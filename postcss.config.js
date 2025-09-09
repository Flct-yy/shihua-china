import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssImport(), // 处理 @import 规则
    // postcss-preset-env包含了 autoprefixer 的功能，并提供了更多现代 CSS 特性
    postcssPresetEnv({
      stage: 3, // 使用稳定阶段的 CSS 特性
      features: {
        // 启用 CSS 嵌套功能（类似 Sass）
        'nesting-rules': true,
        // 可以在这里启用其他实验性特性
      },
    }),
  ]
}