import React, { useState, useEffect } from "react";
import { FaHeart, FaDownload, FaShareAlt, FaTrashAlt } from "react-icons/fa";
import '@/scss/ImageDisplay.scss';

/**
 * 图片数据格式：
 * {
 *   id: string,        // 图片唯一标识符
 *   url: string,       // 图片URL地址
 *   title?: string,    // 图片标题
 *   poem?: string,     // 关联诗句
 *   style?: string,    // 绘画风格
 *   ratio?: string,    // 图片比例
 *   createdAt: Date    // 创建时间
 * }
 */

const ImageDisplay = ({ images = [] }) => {
  const [galleryImages, setGalleryImages] = useState([]);

  // 模拟图片数据，在实际应用中可以从props或API获取
  useEffect(() => {
    // 如果没有传入图片数据，使用模拟数据
    if (images.length === 0) {
      const mockImages = [
        {
          id: '1',
          url: 'https://placebear.com/800/600',
          title: '山水意境',
          poem: '白日依山尽，黄河入海流。',
          style: '中国传统水墨',
          ratio: '4:3',
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          url: 'https://placebear.com/1600/900',
          title: '春日桃花',
          poem: '人面不知何处去，桃花依旧笑春风。',
          style: '工笔画',
          ratio: '16:9',
          createdAt: new Date(Date.now() - 7200000)
        },
        {
          id: '3',
          url: 'https://placebear.com/900/600',
          title: '寒江独钓',
          poem: '孤舟蓑笠翁，独钓寒江雪。',
          style: '水墨画',
          ratio: '3:2',
          createdAt: new Date(Date.now() - 10800000)
        },
        {
          id: '4',
          url: 'https://placebear.com/800/600',
          title: '竹林清风',
          poem: '独坐幽篁里，弹琴复长啸。',
          style: '青绿山水',
          ratio: '4:3',
          createdAt: new Date(Date.now() - 14400000)
        },
        {
          id: '5',
          url: 'https://placebear.com/1600/900',
          title: '月落乌啼',
          poem: '月落乌啼霜满天，江枫渔火对愁眠。',
          style: '淡彩',
          ratio: '16:9',
          createdAt: new Date(Date.now() - 18000000)
        },
        {
          id: '6',
          url: 'https://placebear.com/800/600',
          title: '秋山红叶',
          poem: '停车坐爱枫林晚，霜叶红于二月花。',
          style: '重彩',
          ratio: '3:2',
          createdAt: new Date(Date.now() - 21600000)
        }
      ];
      setGalleryImages(mockImages);
    } else {
      setGalleryImages(images);
    }
  }, []); // 只在组件首次渲染时运行一次

  // 处理图片下载
  const handleDownload = (url, e) => {
    e.stopPropagation();
    // 在实际应用中，这里可以实现图片下载功能
    const link = document.createElement('a');
    link.href = url;
    link.download = `poem-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理图片分享
  const handleShare = (id, e) => {
    e.stopPropagation();
    // 在实际应用中，这里可以实现图片分享功能
    console.log(`Share image ${id}`);
    alert('分享功能暂未实现');
  };

  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="image-gallery container my-5">
      {/* 瀑布流容器 */}
      <div className="masonry-container">
        {/* 遍历图片数组 */}
        {galleryImages.map((image) => (
          <div key={image.id} className="masonry-item">
            <div className="image-card">
              {/* 图片容器 */}
              <div className="image-container" data-ratio={image.ratio || "4:3"}>
                <img
                  src={image.url}
                  alt={image.title || 'Generated image'}
                  loading="lazy"
                />
              </div>

              {/* 图片信息悬停层 */}
              <div className="image-info-overlay">
                <h3>{image.title || '未命名作品'}</h3>
                {image.poem && (
                  <p className="poem-text">{image.poem}</p>
                )}
                <div className="meta-info">
                  <span className="meta-item">{image.style || '未知风格'}</span>
                  <span className="meta-item">{image.ratio || '未知比例'}</span>
                </div>
                <div className="create-time">
                  {formatDate(image.createdAt)}
                </div>
              </div>

              {/* 操作按钮区域 */}
              <div className="image-actions">
                <button
                  className="action-btn"
                  onClick={(e) => handleDownload(image.url, e)}
                  title="下载"
                >
                  <FaDownload className="text-blue-500" />
                </button>
                <button
                  className="action-btn"
                  onClick={(e) => handleShare(image.id, e)}
                  title="分享"
                >
                  <FaShareAlt className="text-green-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态显示 */}
      {galleryImages.length === 0 && (
        <div className="empty-state text-center py-12">
          <div className="empty-icon mb-4">📷</div>
          <h3 className="text-xl font-semibold mb-2">暂无生成的图片</h3>
          <p className="text-gray-500">生成你的第一幅诗画作品吧！</p>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;