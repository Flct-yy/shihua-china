import React, { useRef } from "react";
import '@/scss/PoemInput.scss';

const PoemInput = (props) => {
  const [poem, setPoem] = React.useState("");
  const textareaRef = useRef(null); // 用于textarea元素的引用
  const maxRows = 8;
  const minRows = 3;

  // 计算每行文本的视觉行数
  function calculateVisualRows(line) {
    if (!textareaRef.current) return 1;

    // 获取文本域（textarea）元素经过浏览器计算后的最终样式
    const textarea = textareaRef.current;
    const computedStyle = window.getComputedStyle(textarea);

    // 创建用于测量文本宽度的隐藏容器
    const measureSpan = document.createElement('span');
    measureSpan.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: nowrap; /* 禁止换行，测量完整宽度 */
      font-size: ${computedStyle.fontSize};
      font-family: ${computedStyle.fontFamily};
      letter-spacing: ${computedStyle.letterSpacing};
      word-spacing: ${computedStyle.wordSpacing};
    `;
    measureSpan.textContent = line;
    document.body.appendChild(measureSpan);

        // 文本实际宽度
    const textWidth = measureSpan.offsetWidth;

    // 文本域可用宽度 = 总宽度 - 左右内边距
    const textareaWidth = textarea.offsetWidth;
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    const availableWidth = textareaWidth - paddingLeft - paddingRight;

    // 清理临时元素
    document.body.removeChild(measureSpan);

    // 计算视觉行数（不足1行按1行算，超过1行按比例向上取整）
    return availableWidth <= 0 ? 1 : Math.ceil(textWidth / availableWidth);
  }

  const TextareaChange = (event) => {
    const value = event.target.value;
    setPoem(value);

    // 按换行符分割的行数
    const lineBreakRows = value.split("\n").length;
    // 计算每行文本的视觉行数（处理不换行的长文本）
    const lines = value.split("\n");
    const visualRowsPerLine = lines.map(line => calculateVisualRows(line));

    const totalVisualRows = visualRowsPerLine.reduce((sum, rows) => sum + rows, 0);

    // 取两种计算方式的最大值，确保高度足够
    const contentRows = Math.max(lineBreakRows, totalVisualRows);

    // 限制行数不超过最大值
    const displayRows = Math.min(contentRows, maxRows) === maxRows ? maxRows : (contentRows < minRows ? minRows : contentRows);

    // 动态调整textarea高度（基于行数）
    if (textareaRef.current) {
      // 设置新高度（不超过最大行数对应的高度）
      textareaRef.current.style.height = `${displayRows * 2}em`;
    }
  }

  const { isActive } = props;

  return (
    <div className="tab-pane fade show active" id="poem" role="tabpanel">
      <div className="row">
        <div className="col-12">
          <textarea className={"input-textarea w-100 poem-input no-scrollbar px-2 " + (isActive ? "active" : "")} placeholder="请输入一句古诗词. . ." ref={textareaRef} value={poem} onChange={TextareaChange}></textarea>
        </div>
      </div>
    </div>
  )
}

export default PoemInput;