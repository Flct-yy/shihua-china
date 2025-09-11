import React from "react";
import PoemInput from "./PoemInput";
import StyleSelector from "./StyleSelector";
import ImageRatio from "./ImageRatio";
import GenerateButton from "./GenerateButton";
import "@/scss/AllSelect.scss";

const AllSelect = () => {
  const [activeTab, setActiveTab] = React.useState("poem");

  return (
    <div className="my-5 p-2 rounded container d-flex flex-column items-center" style={{ border: "1px solid #ccc", overflow: "hidden" }}>

      <div className="choice-content-wrapper">
        <div className="choice-content-item">
          <PoemInput isActive={activeTab === "poem"} />
        </div>
      </div>


      {/* 选项卡导航 */}
      <div class="d-flex justify-content-between align-items-center">
        <ul className="choice-nav">
          <li className="choice-nav-item" >
            <button className={"choice-nav-link" + (activeTab === "poem" ? " active" : "")} onClick={() => setActiveTab("poem")}> › </button>
          </li>
          <li className="choice-nav-item" >
            <button className={"choice-nav-link" + (activeTab === "style" ? " active" : "")} onClick={() => setActiveTab("style")}>艺术风格</button>
          </li>
          <li className="choice-nav-item" >
            <button className={"choice-nav-link" + (activeTab === "ratio" ? " active" : "")} onClick={() => setActiveTab("ratio")}>图片比例</button>
          </li>
        </ul>
        <GenerateButton />
      </div>

      <div className="choice-content-wrapper">
        <div className="choice-content">
          <div className="choice-content-item">
            <StyleSelector isActive={activeTab === "style"} />
          </div>

          <div className="choice-content-item">
            <ImageRatio isActive={activeTab === "ratio"} />
          </div>
        </div>
      </div>

    </div>
  )
}


export default AllSelect;