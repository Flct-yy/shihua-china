import React from "react";
import PoemInput from "./PoemInput";
import StyleSelector from "./StyleSelector";
import ImageRatio from "./ImageRatio";
import GenerateButton from "./GenerateButton";

const AllSelect = () => {

  return (
    <div className="my-5 p-2 rounded container d-flex flex-column items-center" style={{border: "1px solid #ccc"}}>

      <div className="tab-content" id="settingsTabsContent">
        <div className="tab-pane fade show active" id="poem" role="tabpanel">
          <PoemInput />
        </div>

        <div className="tab-pane fade" id="style" role="tabpanel">
          <StyleSelector />
        </div>

        <div className="tab-pane fade" id="ratio" role="tabpanel">
          <ImageRatio />
        </div>
      </div>

      {/* 选项卡导航 */}
      <div class="d-flex justify-content-between align-items-center border-top">
        <ul className="nav nav-tabs" id="settingsTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="poem-tab" data-bs-toggle="tab" data-bs-target="#poem" type="button" role="tab">→</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="style-tab" data-bs-toggle="tab" data-bs-target="#style" type="button" role="tab">艺术风格</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="ratio-tab" data-bs-toggle="tab" data-bs-target="#ratio" type="button" role="tab">图片比例</button>
          </li>
        </ul>
          <GenerateButton />
      </div>
    </div>
  )
}


export default AllSelect;