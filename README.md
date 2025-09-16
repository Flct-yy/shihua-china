# 诗画中国 - 诗词成画应用

## 项目简介

诗画中国是一个将中国古诗词转化为中国传统风格绘画的应用。用户可以输入一句古诗词，选择艺术风格和图片比例，系统会通过AI生成一幅对应的中国画作品。

## 技术栈

### 前端
- React 19
- Redux Toolkit
- Vite
- Bootstrap
- Sass

### 后端
- Node.js
- Express
- Axios
- 智谱AI API

## 项目结构

```
├── Backend/          # 后端项目
│   ├── .env          # 环境变量配置
│   ├── package.json  # 后端依赖
│   └── src/
│       └── app.js    # 后端主程序
├── FrontEnd/         # 前端项目
│   ├── index.html    # HTML入口文件
│   ├── package.json  # 前端依赖
│   ├── vite.config.js # Vite配置
│   └── src/
│       ├── App.jsx   # 应用入口组件
│       ├── components/ # React组件
│       ├── pages/    # 页面组件
│       ├── scss/     # SCSS样式文件
│       ├── services/ # API服务
│       └── store/    # Redux状态管理
└── README.md         # 项目说明文档
```

## 快速开始

### 前提条件

- Node.js (推荐 v16 或更高版本)
- npm (通常随Node.js一起安装)
- 智谱AI API密钥 (已在.env文件中配置)

### 安装依赖

1. 安装后端依赖：

```bash
cd Backend
npm install
```

2. 安装前端依赖：

```bash
cd ../FrontEnd
npm install
```

### 启动项目

1. 启动后端服务器：

```bash
cd Backend
npm start
```

后端服务器将在 http://localhost:3000 启动。

2. 启动前端开发服务器：

```bash
cd ../FrontEnd
npm run dev
```

前端应用将在 http://localhost:5173 启动。

### 构建生产版本

如果需要构建前端项目的生产版本：

```bash
cd FrontEnd
npm run build
```

构建后的文件将在 `dist` 目录中。

## 使用说明

1. 在文本框中输入一句古诗词
2. 选择一个艺术风格（水墨、工笔或写意）
3. 选择一个图片比例
4. 点击"开始生成"按钮
5. 等待图片生成完成，生成的图片将显示在页面下方

## 注意事项

- API密钥已在 `Backend/.env` 文件中配置
- 图片生成可能需要一些时间，请耐心等待
- 当前使用的是智谱AI的 `cogview-3-flash` 模型

## 功能特性

- 支持多种中国传统绘画风格
- 支持不同图片比例
- 瀑布流布局展示生成的图片
- 可下载生成的图片

## License

[MIT](LICENSE)