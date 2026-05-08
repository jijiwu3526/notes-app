# 全栈记事本应用

这是一个使用Vue.js前端和Express后端构建的全栈记事本应用程序，使用TypeScript编写。

## 项目结构

```
notes-app/
├── backend/                 # 后端 Express 应用
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   ├── utils/          # 工具函数
│   │   └── server.ts       # 服务器入口
│   ├── package.json
│   ├── tsconfig.json
│   └── API.md              # API 文档
├── frontend/               # 前端 Vue.js 应用
│   ├── src/
│   │   ├── components/     # Vue 组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── services/       # API 服务
│   │   ├── router/         # 路由配置
│   │   ├── assets/         # 静态资源
│   │   ├── types/          # TypeScript 类型定义
│   │   ├── App.vue         # 主应用组件
│   │   └── main.ts         # 应用入口
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts      # Vite 配置
│   └── index.html
├── shared/                 # 共享类型定义
│   └── types.ts
└── package.json            # 根目录配置
```

## 功能特性

### 前端 (Vue.js + TypeScript)
- 用户注册/登录系统
- 记事本 CRUD 操作（创建、读取、更新、删除）
- 搜索功能
- 响应式 UI 设计
- 状态管理 (Pinia)
- 路由管理 (Vue Router)
- 类型安全 (TypeScript)

### 后端 (Express + TypeScript)
- RESTful API 接口
- 用户认证和授权
- MongoDB 数据库集成
- 数据验证和错误处理
- 搜索功能
- 安全措施（密码加密、JWT）

## API 端点

### 用户管理
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户资料（需认证）

### 记事本管理
- `GET /api/notes` - 获取所有记事本
- `GET /api/notes/:id` - 获取特定记事本
- `POST /api/notes` - 创建记事本
- `PUT /api/notes/:id` - 更新记事本
- `DELETE /api/notes/:id` - 删除记事本
- `GET /api/notes/search/:query` - 搜索记事本

## 部署到 Sealos

### 后端部署
1. 准备代码仓库，确保包含 Dockerfile 和 docker-compose.yml
2. 在 Sealos 云平台上创建应用
3. 配置环境变量（DATABASE_URL, JWT_SECRET等）
4. 部署应用

### 桌面应用打包 (HBuilderX)
1. 安装 HBuilderX
2. 导入前端项目
3. 配置 manifest.json
4. 发行 → 原生App-云打包
5. 选择目标平台（Windows/macOS/Linux）进行打包

### 微信小程序部署
1. 在 HBuilderX 中发行 → 小程序-微信
2. 生成微信小程序代码
3. 使用微信开发者工具上传
4. 在微信公众平台提交审核

## 开发说明

### 前端开发
```bash
cd frontend
npm install
npm run dev
```

### 后端开发
```bash
cd backend
npm install
npm run dev
```

### 项目启动
```bash
cd notes-app
npm install
npm run dev
```

## 技术栈

- **前端**: Vue.js 3, TypeScript, Pinia, Vue Router, Vite
- **后端**: Node.js, Express, TypeScript, Mongoose
- **数据库**: MongoDB
- **工具**: Axios (HTTP Client), Jwt (认证), Bcryptjs (密码加密)
- **部署**: Sealos, Docker

## 环境变量

后端需要以下环境变量：
- `DATABASE_URL` - MongoDB 连接字符串
- `JWT_SECRET` - JWT 密钥
- `PORT` - 服务器端口（默认 3000）
- `NODE_ENV` - 环境模式（开发/生产）

## 安全特性

- JWT 认证
- 密码 Bcrypt 加密
- 输入验证
- CORS 配置
- 速率限制

这个项目提供了一个完整的全栈解决方案，从基础的记事本功能到部署到云端，再到打包成桌面应用和微信小程序的完整流程。