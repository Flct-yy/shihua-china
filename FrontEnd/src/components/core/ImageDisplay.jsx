import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaShareAlt, FaCheck, FaCircleNotch } from "react-icons/fa";
import '@/scss/ImageDisplay.scss';
import { saveImageToLocal } from '@/services/apiService';

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
  const [displayImages, setDisplayImages] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnCount, setColumnCount] = useState(1);
  const containerRef = useRef(null);
  const [downloadingImageId, setDownloadingImageId] = useState(null);
  const [downloadedImageId, setDownloadedImageId] = useState(null);

  // 初始化列数和监听窗口大小变化
  useEffect(() => {
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    
    return () => {
      window.removeEventListener('resize', updateColumnCount);
    };
  }, []);

  // 从localStorage加载保存的图片
  const loadImagesFromLocalStorage = () => {
    try {
      const savedImages = localStorage.getItem('poemImages');
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages);
        // 确保createdAt是Date对象
        return parsedImages.map(img => ({
          ...img,
          createdAt: new Date(img.createdAt)
        }));
      }
    } catch (error) {
      console.error('从localStorage加载图片失败:', error);
    }
    return null;
  };

  // 保存图片到localStorage
  const saveImagesToLocalStorage = (imagesToSave) => {
    try {
      localStorage.setItem('poemImages', JSON.stringify(imagesToSave));
      console.log('[localStorage] 图片已保存到本地存储');
    } catch (error) {
      console.error('保存图片到localStorage失败:', error);
    }
  };

  // 初始化和更新图片数据
  useEffect(() => {
    // 首先尝试从localStorage加载图片
    const savedImages = loadImagesFromLocalStorage();
    
    // 如果有外部传入的图片数据（这通常是新生成的图片），则更新显示并保存到localStorage
    if (images.length > 0) {
      // 只有当传入的图片与当前显示的图片不同时才更新
      if (JSON.stringify(images) !== JSON.stringify(displayImages)) {
        setDisplayImages(images);
        saveImagesToLocalStorage(images);
      }
    } 
    // 如果没有外部传入的图片，但localStorage有保存的图片，则使用保存的图片
    else if (savedImages && savedImages.length > 0) {
      // 确保只在displayImages为空或不同时才更新，避免不必要的渲染
      if (displayImages.length === 0 || JSON.stringify(savedImages) !== JSON.stringify(displayImages)) {
        setDisplayImages(savedImages);
      }
    } 
    // 如果都没有，则使用模拟数据
    else {
      const mockImages = [{
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
        },
        {
          id: '7',
          url: 'https://placebear.com/800/600',
          title: '秋山红叶',
          poem: '停车坐爱枫林晚，霜叶红于二月花。',
          style: '重彩',
          ratio: '1:1',
          createdAt: new Date(Date.now() - 21600000)
        },
        {
          id: '8',
          url: 'https://placebear.com/800/600',
          title: '秋山红叶',
          poem: '停车坐爱枫林晚，霜叶红于二月花。',
          style: '重彩',
          ratio: '3:2',
          createdAt: new Date(Date.now() - 21600000)
        }
      ];
      setDisplayImages(mockImages);
    }
  }, [images, displayImages]);

  // 更新列数
  const updateColumnCount = () => {
    const width = window.innerWidth;
    let newColumnCount = 1;
    
    if (width >= 1200) {
      newColumnCount = 3;
    } else if (width >= 992) {
      newColumnCount = 3;
    } else if (width >= 768) {
      newColumnCount = 2;
    }
    
    setColumnCount(newColumnCount);
  };

  // 处理图片下载
  const handleDownload = async (image, e) => {
    e.stopPropagation();
    
    // 检查是否已在下载中
    if (downloadingImageId === image.id) {
      return;
    }
    
    // 设置下载中状态
    setDownloadingImageId(image.id);
    setDownloadedImageId(null);
    
    try {
      // 生成文件名，包含图片信息以便识别
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      let baseFilename = '诗画作品';
      
      // 如果有标题，使用标题作为基础文件名
      if (image.title && image.title !== '诗画作品') {
        baseFilename = image.title;
      }
      // 否则如果有诗句，取前几个字作为基础文件名
      else if (image.poem && image.poem.length > 4) {
        baseFilename = image.poem.slice(0, 4);
      }
      
      // 拼接完整文件名
      const filename = `${baseFilename}_${image.style}_${timestamp}`;
      
      // 调用API服务保存图片到本地
      await saveImageToLocal(image.url, filename);
      
      // 设置下载成功状态
      setDownloadedImageId(image.id);
      
      // 2秒后清除下载成功状态
      setTimeout(() => {
        setDownloadedImageId(null);
      }, 2000);
      
    } catch (error) {
      console.error('下载图片失败:', error);
      alert(`下载图片失败: ${error.message || '未知错误'}`);
    } finally {
      // 清除下载中状态
      setDownloadingImageId(null);
    }
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

  // 计算Masonry布局
  useEffect(() => {
    if (displayImages.length === 0 || columnCount === 0) return;
    
    // 初始化列数组
    const newColumns = Array.from({ length: columnCount }, () => []);
    
    // 将图片分配到高度最小的列
    displayImages.forEach((image, index) => {
      // 对于第一行，直接依次分配
      if (index < columnCount) {
        newColumns[index].push(image);
      } else {
        // 找到当前高度最小的列
        let minHeightIndex = 0;
        let minHeight = newColumns[0].reduce((total, img) => {
          // 根据图片比例计算高度权重
          const ratioWeight = img.ratio === '16:9' ? 0.5625 : 
                             img.ratio === '3:2' ? 0.6667 :
                             img.ratio === '1:1' ? 1 : 0.75;
          return total + ratioWeight;
        }, 0);
        
        for (let i = 1; i < columnCount; i++) {
          const height = newColumns[i].reduce((total, img) => {
            const ratioWeight = img.ratio === '16:9' ? 0.5625 : 
                               img.ratio === '3:2' ? 0.6667 :
                               img.ratio === '1:1' ? 1 : 0.75;
            return total + ratioWeight;
          }, 0);
          
          if (height < minHeight) {
            minHeight = height;
            minHeightIndex = i;
          }
        }
        
        // 将当前图片添加到高度最小的列
        newColumns[minHeightIndex].push(image);
      }
    });
    
    setColumns(newColumns);
  }, [displayImages, columnCount]);
  
  return (
    <div className="image-display container my-5">
      {/* 瀑布流容器 */}
      <div className="masonry-container" ref={containerRef}>
        {/* 根据列数渲染每一列 */}
        {columns.map((columnImages, columnIndex) => (
          <div key={columnIndex} className="masonry-column">
            {/* 渲染列中的图片 */}
            {columnImages.map((image) => (
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
                      onClick={(e) => handleDownload(image, e)}
                      title="下载"
                      disabled={downloadingImageId === image.id}
                    >
                      {downloadingImageId === image.id ? (
                        <FaCircleNotch className="text-blue-500 animate-spin" />
                      ) : downloadedImageId === image.id ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaDownload className="text-blue-500" />
                      )}
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
        ))}
      </div>

      {/* 空状态显示 */}
      {displayImages.length === 0 && (
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