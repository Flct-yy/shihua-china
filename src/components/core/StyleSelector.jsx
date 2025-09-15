import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStyle } from "@/store/features/inputSlice";
import "@/scss/StyleSelector.scss"

const StyleSelector = (props) => {
  const { isActive } = props;
  const { style } = useSelector(state => state.input);
  const dispatch = useDispatch();

  const handleClick = (value) => {
    dispatch(setStyle({value}))
  }
  return (
    <div className={"row style-selector " + (isActive ? "active" : "not-active")}>
      <div className="col-md-4">
        <div className={"card style-card " + (style === '水墨'?"style-card-active":"")} 
        onClick={() => handleClick('水墨')}>
          {/* <img src="#" className="card-img-top" alt="水墨风格" /> */}
          <div className="card-body">
            <h5 className="card-title">水墨风格</h5>
            <p className="card-text">传统水墨画风格，黑白灰的层次变化</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className={"card style-card " + (style === '工笔'?"style-card-active":"")}
        onClick={() => handleClick('工笔')}>
          <div className="card-body">
            <h5 className="card-title">工笔风格</h5>
            <p className="card-text">精细工整，注重细节描绘</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className={"card style-card " + (style === '写意'?"style-card-active":"")}
        onClick={() => handleClick('写意')}>
          <div className="card-body">
            <h5 className="card-title">写意风格</h5>
            <p className="card-text">注重意境表达，笔法简练豪放</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleSelector;