const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 后端令牌桶算法实现 - 统一控制对智谱API的并发请求
class TokenBucket {
  constructor(tokensPerSecond = 0.5, bucketSize = 1) {
    this.tokensPerSecond = tokensPerSecond; // 每2秒生成1个令牌
    this.bucketSize = bucketSize; // 桶容量为1
    this.tokens = bucketSize;
    this.lastRefillTime = Date.now();
    this.queue = [];
    this.processing = false;
    this.minRequestInterval = 2000; // 最小请求间隔为2秒
    this.lastRequestTime = 0;
  }

  // 添加请求到令牌桶
  add(requestFn) {
    const timestamp = new Date().toISOString();
    console.log(`[后端令牌桶][${timestamp}] 请求已添加到队列，当前队列长度: ${this.queue.length}`);
    
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject, timestamp });
      this.process();
    });
  }

  // 填充令牌
  refillTokens() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTime) / 1000;
    
    if (elapsedSeconds > 0) {
      this.tokens = Math.min(
        this.bucketSize,
        this.tokens + (elapsedSeconds * this.tokensPerSecond)
      );
      console.log(`[后端令牌桶] 填充令牌，当前令牌数: ${this.tokens}`);
      this.lastRefillTime = now;
    }
  }

  // 检查是否可以发送请求
  canSendRequest() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest >= this.minRequestInterval) {
      return true;
    } else {
      console.log(`[后端令牌桶] 请求间隔不足，还需等待: ${Math.ceil((this.minRequestInterval - timeSinceLastRequest) / 1000)}秒`);
      return false;
    }
  }

  // 处理队列中的请求
  async process() {
    if (this.processing) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      this.refillTokens();
      
      if (this.tokens >= 1 && this.canSendRequest()) {
        // 消耗一个令牌
        this.tokens -= 1;
        const { requestFn, resolve, reject, timestamp } = this.queue.shift();
        
        const now = new Date().toISOString();
        console.log(`[后端令牌桶][${now}] 处理请求 (添加时间: ${timestamp})，剩余令牌: ${this.tokens}，队列剩余: ${this.queue.length}`);
        
        // 更新最后请求时间
        this.lastRequestTime = Date.now();
        
        try {
          const result = await requestFn();
          console.log(`[后端令牌桶][${new Date().toISOString()}] 请求处理成功`);
          resolve(result);
        } catch (error) {
          console.error(`[后端令牌桶][${new Date().toISOString()}] 请求处理失败:`, error.message || error);
          reject(error);
        }
      } else {
        // 没有足够的令牌或请求间隔不足，等待一段时间
        const waitTime = Math.max(
          Math.ceil((1 - this.tokens) * 1000 / this.tokensPerSecond),
          this.minRequestInterval - (Date.now() - this.lastRequestTime)
        );
        console.log(`[后端令牌桶] 等待条件满足，将在${Math.ceil(waitTime / 1000)}秒后重试`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.processing = false;
    console.log(`[后端令牌桶][${new Date().toISOString()}] 队列已处理完毕`);
  }
}

// 创建全局令牌桶实例，统一控制对智谱API的并发请求
const apiTokenBucket = new TokenBucket(0.5, 1);

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 智谱AI API端点
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/images/generations';

// 核心：生成图像的POST接口
app.post('/api/generate', async (req, res) => {
  try {
    // 1. 从前端获取数据
    const { 
      prompt, 
      model = 'cogview-3-flash', // 默认使用用户指定的cogview-3-flash
      quality = 'standard', 
      size = '1024x1024',
      watermark_enabled = true,
      user_id 
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '提示词参数是必须的' });
    }

    // 2. 验证模型是否支持
    const supportedModels = ['cogview-4-250304', 'cogview-4', 'cogview-3-flash'];
    if (!supportedModels.includes(model)) {
      return res.status(400).json({ error: `不支持的模型: ${model}，支持的模型有: ${supportedModels.join(', ')}` });
    }

    // 3. 验证质量参数是否适用于所选模型
    if (quality !== 'standard' && model !== 'cogview-4-250304') {
      return res.status(400).json({ error: '质量参数hd仅支持cogview-4-250304模型' });
    }

    // 4. 准备请求数据，符合智谱API要求
    const requestData = {
      model,
      prompt,
      size,
      watermark_enabled
    };

    // 仅对支持的模型添加质量参数
    if (model === 'cogview-4-250304') {
      requestData.quality = quality;
    }

    // 添加用户ID（如果提供）
    if (user_id) {
      if (user_id.length < 6 || user_id.length > 128) {
        return res.status(400).json({ error: '用户ID长度必须在6-128个字符之间' });
      }
      requestData.user_id = user_id;
    }

    // 5. 创建请求函数，用于传递给令牌桶
    const apiRequestFn = async () => {
      console.log(`[后端] 准备发送请求到智谱API，模型: ${model}`);
      
      try {
        const response = await axios.post(ZHIPU_API_URL, requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
          }
        });
        
        console.log(`[后端] 智谱API请求成功，模型: ${model}`);
        return response;
      } catch (error) {
        console.error(`[后端] 智谱API请求失败，模型: ${model}，错误:`, error.response?.data || error.message);
        
        // 处理并发过高错误，增加重试逻辑
        if (error.response?.data?.error?.code === '1302' || 
            (error.response?.data?.error?.message && 
             error.response.data.error.message.includes('并发数过高'))) {
          console.log(`[后端] 检测到并发过高错误(1302)，将在5秒后重试`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // 重试一次
          console.log(`[后端] 重试智谱API请求，模型: ${model}`);
          return await axios.post(ZHIPU_API_URL, requestData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`
            }
          });
        }
        
        throw error;
      }
    };
    
    // 6. 使用令牌桶控制请求并发
    console.log(`[后端] 请求已加入令牌桶队列，等待处理`);
    const response = await apiTokenBucket.add(apiRequestFn);

    // 6. 解析响应
    const { created, data, content_filter } = response.data;
    const imageUrl = data[0].url;

    // 7. 将图片URL和相关信息返回给前端
    res.json({
      success: true,
      created,
      imageUrl,
      content_filter
    });

  } catch (error) {
    // 8. 错误处理
    console.error('API调用失败:', error.response?.data || error.message);

    // 返回更详细的错误信息给前端，方便调试
    let errorMessage = '生成图像失败，请稍后重试';
    let errorType = 'api_error';
    
    if (error.response?.data) {
      errorMessage = error.response.data.error?.message || JSON.stringify(error.response.data);
      // 识别常见的错误类型，提供更具体的提示
      if (errorMessage.includes('并发数过高')) {
        errorMessage = '当前使用该API的并发数过高，请稍等片刻后再试';
        errorType = 'rate_limit';
      } else if (errorMessage.includes('限额')) {
        errorMessage = '当前API调用次数已达到今日限额，请明天再试';
        errorType = 'quota_exceeded';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      errorType: errorType
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});