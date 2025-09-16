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
    <div className={"row image-ratio " + (isActive ? "active" : "not-active")}>
      <div className="col-sm-6 col-md-3">
        <div className="ratio-option">
          {/* <div className="ratio-preview" style="aspect-ratio: 1/1;"></div> */}
          <div className={'text text-center ' + (
            ratio === '4:3' ? "ratio-option-active" : ""
          )} onClick={() => handleClick('4:3')}>4:3 标准</div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3">
        <div className="ratio-option">
          <div className={'text text-center ' + (
            ratio === '1:1' ? "ratio-option-active" : ""
          )} onClick={() => handleClick('1:1')}>1:1 方形</div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3">
        <div className="ratio-option">
          <div className={'text text-center ' + (
            ratio === '16:9' ? "ratio-option-active" : ""
          )} onClick={() => handleClick('16:9')}>16:9 宽屏</div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3">
        <div className="ratio-option">
          <div className={'text text-center ' + (
            ratio === '3:4' ? "ratio-option-active" : ""
          )} onClick={() => handleClick('3:4')}>3:4 竖屏</div>
        </div>
      </div>
    </div>
  )
}

export default ImageRatio;