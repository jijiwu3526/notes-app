# 全栈记事本应用 - 项目构建说明

## 项目概述
这是一个完整的全栈记事本应用程序，包含：
- 前端：Vue.js + TypeScript
- 后端：Express + TypeScript
- 数据库：MongoDB
- 部署：Sealos

## 项目结构
```
notes-app/
├── backend/                 # 后端 Express 应用
├── frontend/                # 前端 Vue.js 应用
├── shared/                  # 共享类型定义
├── package.json             # 根目录配置
├── README.md                # 项目说明
├── integration-test-plan.md # 集成测试计划
├── sealos-deployment-guide.md # Sealos部署指南
└── fullstack-notes.code-workspace # VSCode工作区配置
```

## 开发环境设置

### 前端设置
1. 进入前端目录：
```bash
cd /Users/Apple/notes-app/frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

### 后端设置
1. 进入后端目录：
```bash
cd /Users/Apple/notes-app/backend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

## 环境变量配置

在运行应用程序之前，请确保设置了以下环境变量：

### 后端环境变量
在 backend/ 目录下创建 `.env` 文件：
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/notes
JWT_SECRET=your-super-secret-jwt-key
```

## 运行完整应用

### 方式1：分别运行
1. 在一个终端中启动后端：
```bash
cd /Users/Apple/notes-app/backend
npm run dev
```

2. 在另一个终端中启动前端：
```bash
cd /Users/Apple/notes-app/frontend
npm run dev
```

### 方式2：根目录运行（需要安装concurrently）
1. 在根目录安装依赖：
```bash
cd /Users/Apple/notes-app
npm install
```

2. 运行整个应用：
```bash
npm run dev
```

## 使用VSCode打开项目

您可以使用以下方式之一打开项目：

1. 打开整个项目文件夹：
```bash
code /Users/Apple/notes-app
```

2. 使用工作区文件（推荐）：
```bash
code /Users/Apple/notes-app/fullstack-notes.code-workspace
```

3. 分别打开前端和后端：
```bash
code /Users/Apple/notes-app/frontend
code /Users/Apple/notes-app/backend
```

## 项目文件列表

### 前端文件：
- `/Users/Apple/notes-app/frontend/index.html` - 主页面
- `/Users/Apple/notes-app/frontend/package.json` - 前端依赖
- `/Users/Apple/notes-app/frontend/src/App.vue` - 主应用组件
- `/Users/Apple/notes-app/frontend/src/main.ts` - 应用入口
- `/Users/Apple/notes-app/frontend/src/router/index.ts` - 路由配置
- `/Users/Apple/notes-app/frontend/src/stores/notes.ts` - 笔记状态管理
- `/Users/Apple/notes-app/frontend/src/stores/user.ts` - 用户状态管理
- `/Users/Apple/notes-app/frontend/src/views/*.vue` - 视图组件
- `/Users/Apple/notes-app/frontend/src/types/*.ts` - 类型定义
- `/Users/Apple/notes-app/frontend/tsconfig.json` - TypeScript配置
- `/Users/Apple/notes-app/frontend/vite.config.ts` - Vite构建配置

### 后端文件：
- `/Users/Apple/notes-app/backend/package.json` - 后端依赖
- `/Users/Apple/notes-app/backend/src/server.ts` - 服务器入口
- `/Users/Apple/notes-app/backend/src/models/Note.ts` - 笔记模型
- `/Users/Apple/notes-app/backend/src/routes/noteRoutes.ts` - 笔记路由
- `/Users/Apple/notes-app/backend/src/routes/userRoutes.ts` - 用户路由
- `/Users/Apple/notes-app/backend/tsconfig.json` - TypeScript配置
- `/Users/Apple/notes-app/backend/API.md` - API文档

### 共享文件：
- `/Users/Apple/notes-app/shared/types.ts` - 共享类型定义

### 配置和文档文件：
- `/Users/Apple/notes-app/README.md` - 项目说明
- `/Users/Apple/notes-app/sealos-deployment-guide.md` - Sealos部署指南
- `/Users/Apple/notes-app/integration-test-plan.md` - 集成测试计划
- `/Users/Apple/notes-app/fullstack-notes.code-workspace` - VSCode工作区配置

## 功能测试

### 前端功能测试
1. 访问 http://localhost:5173
2. 测试导航
3. 注册新用户
4. 创建、编辑和删除笔记
5. 验证登录/注销功能

### 后端API测试
1. 访问 http://localhost:3000/health 确认服务器运行
2. 使用API工具测试各个端点

## 部署说明

### 部署到 Sealos
请参考 `/Users/Apple/notes-app/sealos-deployment-guide.md` 文件获取详细部署指南。

### 打包为桌面应用
请参考 README.md 中的 HBuilderX 部分。

### 发布为微信小程序
请参考 README.md 中的微信小程序部分。