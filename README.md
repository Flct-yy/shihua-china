# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




## 核心框架
- **React 19.1.1** - 最新版本的 React
- **Vite 7.1.2** - 快速的构建工具和开发服务器

## 开发工具和配置
- **ESLint** - 代码质量检查
- **PostCSS + Autoprefixer** - CSS 处理
- **Sass** - CSS 预处理器

## 主要依赖
- **React Router DOM 7.8.2** - 路由管理
- **Axios 1.11.0** - HTTP 客户端
- **Bootstrap 5.3.8** - CSS 框架
- **React Icons 5.5.0** - 图标库
- **react-redux** - 状态管理库

## 项目配置
- 支持 ES 模块 (`"type": "module"`)
- 配置了合理的 `.gitignore`
- 设置了开发/构建脚本
- 配置了 Vite 和 ESLint

## 目录结构：
```
src/
  components/     # 组件
  pages/          # 页面
  hooks/          # 自定义 Hook
  utils/          # 工具函数
  styles/         # 样式文件
  assets/         # 静态资源
```