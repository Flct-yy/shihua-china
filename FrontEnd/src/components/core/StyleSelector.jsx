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
    <div className={"style-selector-container " + (isActive ? "active" : "not-active")}>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div className="col">
          <div className={"card style-card h-100 " + (style === '水墨'?"style-card-active":"")} 
          onClick={() => handleClick('水墨')}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">水墨风格</h5>
              <p className="card-text">传统水墨画风格，黑白灰的层次变化</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className={"card style-card h-100 " + (style === '工笔'?"style-card-active":"")}
          onClick={() => handleClick('工笔')}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">工笔风格</h5>
              <p className="card-text">精细工整，注重细节描绘</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className={"card style-card h-100 " + (style === '写意'?"style-card-active":"")}
          onClick={() => handleClick('写意')}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">写意风格</h5>
              <p className="card-text">注重意境表达，笔法简练豪放</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className={"card style-card h-100 " + (style === '青绿山水'?"style-card-active":"")}
          onClick={() => handleClick('青绿山水')}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">青绿山水</h5>
              <p className="card-text">以矿物质颜料为主，色彩鲜艳，富有装饰性</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className={"card style-card h-100 " + (style === '淡彩'?"style-card-active":"")}
          onClick={() => handleClick('淡彩')}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">淡彩风格</h5>
              <p className="card-text">色彩淡雅，层次分明，具有文人画的意境</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className={"card style-card h-100 " + (style === '重彩'?"style-card-active":"")}
          onClick={() => handleClick('重彩')}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">重彩风格</h5>
              <p className="card-text">色彩浓郁，对比强烈，装饰性强</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleSelector;