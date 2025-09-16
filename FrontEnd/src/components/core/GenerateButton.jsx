import React, { useState } from "react";
import { useSelector } from "react-redux";
import apiService from "@/services/apiService";
import LoadingSpinner from "./LoadingSpinner";

const GenerateButton = ({ onImageGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isQueued, setIsQueued] = useState(false);

  // 从Redux store获取用户输入的数据
  const { poem, style, ratio } = useSelector(state => state.input);

  // 处理生成按钮点击事件
  const handleGenerate = async () => {
    // 验证输入
    if (!poem.trim()) {
      setError('请输入诗句');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // 设置请求排队状态
    setIsQueued(true);
    setError('');
    setIsLoading(false);

    try {
      // 准备API请求参数
      const prompt = `${poem}，请以${style}风格绘制一幅中国画`;
      
      // 根据选择的比例确定图片尺寸
      let size = '1024x1024'; // 默认尺寸
      if (ratio === '4:3') size = '1024x768';
      else if (ratio === '16:9') size = '1600x900';
      else if (ratio === '3:4') size = '768x1024';

      // 调用API服务生成图片，此时请求会进入队列
      // 当请求开始处理时，API服务内部会执行实际的API调用
      const response = await apiService.generateImage(prompt, 'cogview-3-flash', 'standard', size);
      
      // 当请求开始处理时，更新状态（这里是因为我们的队列实现中，实际请求在requestFn中执行）
      // 在这个实现中，请求从队列中取出并开始执行的时机是隐式的，所以我们在请求返回前立即更新状态
      // 在更复杂的实现中，可能需要在队列处理器中添加回调来更精确地跟踪状态变化
      setIsQueued(false);
      setIsLoading(true);

      if (response.success && response.imageUrl) {
        // 创建新的图片对象
        const newImage = {
          id: Date.now().toString(),
          url: response.imageUrl,
          title: '诗画作品',
          poem: poem,
          style: style,
          ratio: ratio,
          createdAt: new Date()
        };

        // 通知父组件图片已生成
        if (onImageGenerated) {
          onImageGenerated(newImage);
        }
      } else {
        // 根据后端返回的errorType显示更友好的错误消息
        const errorMsg = response.error || '生成图片失败';
        const errorType = response.errorType || 'api_error';
        throw new Error(`[${errorType}]${errorMsg}`);
      }
    } catch (err) {
      console.error('生成图片时发生错误:', err);
      // 解析错误消息，提取友好的提示信息
      let displayError = '生成图片失败，请稍后重试';
      if (err.message) {
        // 如果错误消息包含错误类型标记
        if (err.message.startsWith('[')) {
          const match = err.message.match(/^\[(\w+)\](.*)$/);
          if (match) {
            const [, errorType, errorMsg] = match;
            // 根据错误类型显示不同的提示信息
            if (errorType === 'rate_limit') {
              displayError = '当前服务器繁忙，请稍等片刻后再试';
            } else if (errorType === 'quota_exceeded') {
              displayError = '今日调用次数已用完，请明天再试';
            } else {
              displayError = errorMsg || displayError;
            }
          } else {
            displayError = err.message;
          }
        } else {
          displayError = err.message;
        }
      }
      setError(displayError);
    } finally {
      // 重置加载状态
      setIsLoading(false);
    }
  };

  return (
    <div className="generate-button-container">
      <button 
        className={`btn btn-primary btn-sm px-4 ${isLoading || isQueued ? 'disabled' : ''}`} 
        onClick={handleGenerate}
        disabled={isLoading || isQueued}
      >
        {isLoading ? (
          <span className="loading-button">
            <LoadingSpinner size={16} color="white" />
            <span className="ml-2">生成中...</span>
          </span>
        ) : isQueued ? (
          <span className="queued-button">
            <LoadingSpinner size={16} color="white" />
            <span className="ml-2">排队中...</span>
          </span>
        ) : (
          '开始生成'
        )}
      </button>
      {error && (
        <div className="error-message mt-2 text-danger text-sm">
          {error}
        </div>
      )}
      {isQueued && (
        <div className="queue-message mt-2 text-info text-sm">
          当前请求较多，正在排队等待处理
        </div>
      )}
    </div>
  );
};

export default GenerateButton;