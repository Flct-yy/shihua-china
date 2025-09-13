import React, { useRef } from "react";
import PoemInput from "./PoemInput";
import StyleSelector from "./StyleSelector";
import ImageRatio from "./ImageRatio";
import GenerateButton from "./GenerateButton";
import "@/scss/AllSelect.scss";

const AllSelect = () => {
  const [activeTab, setActiveTab] = React.useState("poem");

  // 用ref获取各模块
  const poemRef = useRef(null);
  const styleRef = useRef(null);
  const ratioRef = useRef(null);
  const navRef = useRef(null);
  const containerRef = useRef(null);

  // 处理tab切换
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      ref={containerRef}
      className="all-select-container my-5 rounded container"
    >
      <div className="all-select-wrapper p-2 rounded container d-flex flex-column">
        {/* 选项卡导航 - 根据当前tab位置变化 */}
        <div 
          ref={navRef} 
          className={`nav-container d-flex justify-content-between align-items-center transition-all duration-300 ease-in-out ${activeTab === 'poem' ? 'nav-bottom' : 'nav-top'}`}
        >
          <ul className="choice-nav">
            <li className="choice-nav-item">
              <button 
                className={`choice-nav-link ${activeTab === "poem" ? " active" : ""}`} 
                onClick={() => handleTabChange("poem")}
              >
                › 
              </button>
            </li>
            <li className="choice-nav-item">
              <button 
                className={`choice-nav-link ${activeTab === "style" ? " active" : ""}`} 
                onClick={() => handleTabChange("style")}
              >
                艺术风格
              </button>
            </li>
            <li className="choice-nav-item">
              <button 
                className={`choice-nav-link ${activeTab === "ratio" ? " active" : ""}`} 
                onClick={() => handleTabChange("ratio")}
              >
                图片比例
              </button>
            </li>
          </ul>
          <GenerateButton />
        </div>

        {/* 输入框区域 */}
        <div 
          ref={poemRef} 
          className={`poem-container choice-content-item transition-all duration-300 ease-in-out ${activeTab === 'poem' ? 'poem-visible' : 'poem-hidden'}`}
        >
          <PoemInput isActive={activeTab === "poem"} />
        </div>

        {/* 内容选择区域 */}
        <div className="choice-content">
          {/* 艺术风格选择器 */}
          <div 
            ref={styleRef} 
            className={`style-container choice-content-item transition-all duration-300 ease-in-out ${activeTab === 'style' ? 'content-visible' : 'content-hidden'}`}
          >
            <StyleSelector isActive={activeTab === "style"} />
          </div>

          {/* 图片比例选择器 */}
          <div 
            ref={ratioRef} 
            className={`ratio-container choice-content-item transition-all duration-300 ease-in-out ${activeTab === 'ratio' ? 'content-visible' : 'content-hidden'}`}
          >
            <ImageRatio isActive={activeTab === "ratio"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllSelect;