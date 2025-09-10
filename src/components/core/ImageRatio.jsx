import React from 'react';
import '@/scss/ImageRatio.scss'

const ImageRatio = () => {

  return (
    <div className="row">
      <div className="col-sm-6 col-md-3 mb-3">
        <div className="ratio-option">
          {/* <div className="ratio-preview" style="aspect-ratio: 1/1;"></div> */}
          <div className='text text-center ratio-option-active'>1:1 方形</div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3 mb-3">
        <div className="ratio-option">
          <div className="text text-center">4:3 标准</div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3 mb-3">
        <div className="ratio-option">
          <div className='text text-center'>16:9 宽屏</div>
        </div>
      </div>
      <div className="col-sm-6 col-md-3 mb-3">
        <div className="ratio-option">
          <div className='text text-center'>3:4 竖屏</div>
        </div>
      </div>
    </div>
  )
}

export default ImageRatio;