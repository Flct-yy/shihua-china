import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRatio } from '../../store/features/inputSlice';
import '@/scss/ImageRatio.scss'

const ImageRatio = (props) => {
  const { isActive } = props;
  const { ratio } = useSelector(state => state.input)
  const dispatch = useDispatch();

  const handleClick = (value) => {
    dispatch(setRatio({value}))
  }
  return (
    <div className={"ratio-selector-container " + (isActive ? "active" : "not-active")}>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '4:3' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('4:3')}>
              <svg className="ratio-icon" width="24" height="18" viewBox="0 0 24 18">
                <rect width="24" height="18" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              4:3 标准
            </div>
          </div>
        </div>
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '1:1' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('1:1')}>
              <svg className="ratio-icon" width="18" height="18" viewBox="0 0 18 18">
                <rect width="18" height="18" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              1:1 方形
            </div>
          </div>
        </div>
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '16:9' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('16:9')}>
              <svg className="ratio-icon" width="28" height="16" viewBox="0 0 28 16">
                <rect width="28" height="16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              16:9 宽屏
            </div>
          </div>
        </div>
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '3:4' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('3:4')}>
              <svg className="ratio-icon" width="18" height="24" viewBox="0 0 18 24">
                <rect width="18" height="24" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              3:4 竖屏
            </div>
          </div>
        </div>
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '3:2' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('3:2')}>
              <svg className="ratio-icon" width="27" height="18" viewBox="0 0 27 18">
                <rect width="27" height="18" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              3:2 风景
            </div>
          </div>
        </div>
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '2:3' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('2:3')}>
              <svg className="ratio-icon" width="18" height="27" viewBox="0 0 18 27">
                <rect width="18" height="27" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              2:3 人像
            </div>
          </div>
        </div>
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '9:16' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('9:16')}>
              <svg className="ratio-icon" width="16" height="28" viewBox="0 0 16 28">
                <rect width="16" height="28" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              9:16 手机
            </div>
          </div>
        </div>
        <div className="col">
          <div className="ratio-option">
            <div className={'text ratio-item ' + (
              ratio === '21:9' ? "ratio-option-active" : ""
            )} onClick={() => handleClick('21:9')}>
              <svg className="ratio-icon" width="32" height="14" viewBox="0 0 32 14">
                <rect width="32" height="14" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
              </svg>
              21:9 超宽
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageRatio;