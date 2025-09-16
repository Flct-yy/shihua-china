import React from 'react';
import '@/scss/LoadingSpinner.scss';

/**
 * 加载动画组件
 * @param {Object} props
 * @param {number} props.size - 加载动画的大小（默认24px）
 * @param {string} props.color - 加载动画的颜色（默认#000）
 * @param {string} props.className - 额外的CSS类名
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ size = 24, color = '#000', className = '' }) => {
  return (
    <div 
      className={`loading-spinner ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderColor: `${color}33`,
        borderTopColor: color
      }}
    />
  );
};

export default LoadingSpinner;