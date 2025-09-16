import axios from 'axios';

// 创建axios实例，配置基础URL
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端服务URL
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 更严格的令牌桶算法实现 - 针对智谱AI API的严格并发限制
class TokenBucket {
  constructor(tokensPerSecond = 0.5, bucketSize = 1) {
    this.tokensPerSecond = tokensPerSecond; // 每2秒生成1个令牌
    this.bucketSize = bucketSize; // 桶容量为1，确保一次只有一个请求
    this.tokens = bucketSize;
    this.lastRefillTime = Date.now();
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0; // 记录最后一次发送请求的时间
    this.minRequestInterval = 2000; // 最小请求间隔为2秒
  }

  // 添加请求到令牌桶
  add(requestFn) {
    const timestamp = new Date().toISOString();
    console.log(`[令牌桶][${timestamp}] 请求已添加，当前队列长度: ${this.queue.length}`);
    
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
      console.log(`[令牌桶] 填充令牌，当前令牌数: ${this.tokens}`);
      this.lastRefillTime = now;
    }
  }

  // 检查是否可以发送请求（考虑最小间隔）
  canSendRequest() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest >= this.minRequestInterval) {
      return true;
    } else {
      console.log(`[令牌桶] 请求间隔不足，还需等待: ${Math.ceil((this.minRequestInterval - timeSinceLastRequest) / 1000)}秒`);
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
        console.log(`[令牌桶][${now}] 处理请求 (添加时间: ${timestamp})，剩余令牌: ${this.tokens}，队列剩余: ${this.queue.length}`);
        
        // 更新最后请求时间
        this.lastRequestTime = Date.now();
        
        try {
          const result = await requestFn();
          console.log(`[令牌桶][${new Date().toISOString()}] 请求处理成功`);
          resolve(result);
        } catch (error) {
          console.error(`[令牌桶][${new Date().toISOString()}] 请求处理失败:`, error.message || error);
          reject(error);
        }
      } else {
        // 没有足够的令牌或请求间隔不足，等待一段时间
        const waitTime = Math.max(
          Math.ceil((1 - this.tokens) * 1000 / this.tokensPerSecond),
          this.minRequestInterval - (Date.now() - this.lastRequestTime)
        );
        console.log(`[令牌桶] 等待条件满足，将在${Math.ceil(waitTime / 1000)}秒后重试`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.processing = false;
    console.log(`[令牌桶][${new Date().toISOString()}] 队列已处理完毕`);
  }
}

// 创建全局令牌桶实例，每2秒只发放1个令牌，桶容量为1
// 这是针对智谱AI API最严格的控制策略，确保请求不会超过API的并发限制
const tokenBucket = new TokenBucket(0.5, 1);

// 添加重试机制的辅助函数
const withRetry = async (requestFn, maxRetries = 3, retryDelay = 2000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      // 如果是并发过高错误，进行重试
      if (error.errorType === 'rate_limit' && retries < maxRetries - 1) {
        retries++;
        console.log(`并发过高，将在${retryDelay}ms后重试第${retries}次...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        // 每次重试增加延迟时间
        retryDelay *= 1.5;
      } else {
        // 其他错误或达到最大重试次数，抛出错误
        throw error;
      }
    }
  }
};

/**
 * 生成图像的API调用
 * @param {string} prompt - 提示词
 * @param {string} model - 模型名称
 * @param {string} quality - 图像质量
 * @param {string} size - 图像尺寸
 * @param {boolean} watermarkEnabled - 是否启用水印
 * @param {string} userId - 用户ID
 * @returns {Promise} 返回API响应
 */
export const generateImage = async (
  prompt,
  model = 'cogview-3-flash',
  quality = 'standard',
  size = '1024x1024',
  watermarkEnabled = true,
  userId = null
) => {
  // 创建一个请求函数，包装实际的API调用
  const requestFn = async () => {
    try {
      const response = await apiClient.post('/generate', {
        prompt,
        model,
        quality,
        size,
        watermark_enabled: watermarkEnabled,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('生成图像失败:', error);
      // 解析错误信息，提取后端返回的具体错误
      if (error.response && error.response.data) {
        // 创建一个包含更详细错误信息的新错误
        const apiError = new Error(error.response.data.error || 'API调用失败');
        apiError.errorType = error.response.data.errorType || 'api_error';
        apiError.response = error.response;
        throw apiError;
      }
      // 对于没有响应体的错误，使用原始错误
      throw error;
    }
  };
  
  // 创建一个包含重试逻辑的包装函数
  const requestWithRetryFn = async () => {
    return withRetry(requestFn);
  };
  
  // 使用令牌桶算法控制请求频率，每秒最多发送1个请求，并应用重试机制
  // 这将严格控制发送到智谱API的请求频率，有效避免"并发数过高"错误
  return tokenBucket.add(requestWithRetryFn);
};

/**
 * 将图片保存到本地存储
 * @param {string} imageUrl - 图片URL
 * @param {string} filename - 文件名
 * @returns {Promise} 返回保存结果
 */
export const saveImageToLocal = async (imageUrl, filename = 'generated-image.jpg') => {
  try {
    // 从URL获取图片数据
    const response = await fetch(imageUrl, {
      method: 'GET',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`无法获取图片: ${response.statusText}`);
    }
    
    // 将响应转换为Blob对象
    const blob = await response.blob();
    
    // 创建一个临时URL
    const url = window.URL.createObjectURL(blob);
    
    // 创建一个<a>标签用于下载
    const link = document.createElement('a');
    link.href = url;
    
    // 设置文件名，如果提供了特定扩展名则使用，否则基于blob类型
    let finalFilename = filename;
    const fileExtension = finalFilename.split('.').pop().toLowerCase();
    const imageType = blob.type.split('/')[1];
    
    // 如果文件名没有扩展名或者扩展名与图片类型不匹配，添加正确的扩展名
    if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
      finalFilename += `.${imageType}`;
    }
    
    link.download = finalFilename;
    
    // 隐藏链接并添加到文档中
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // 触发点击事件以下载图片
    link.click();
    
    // 清理临时资源
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    console.log(`[图片保存] 图片已保存到本地: ${finalFilename}`);
    return {
      success: true,
      filename: finalFilename
    };
  } catch (error) {
    console.error('[图片保存] 保存图片失败:', error);
    throw new Error(`保存图片失败: ${error.message || '未知错误'}`);
  }
};

export default {
  generateImage,
  saveImageToLocal
};