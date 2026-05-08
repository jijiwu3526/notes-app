# 在Sealos上部署后端应用完整教程

## 什么是Sealos？

Sealos是一个开源的云操作系统，提供简单易用的Kubernetes部署解决方案，可以帮助您快速部署和管理后端应用。

## 部署步骤

### 1. 准备工作

#### 安装Sealos CLI
```bash
# 安装sealos CLI工具
curl -sL https://get.sealos.io | bash
```

#### 注册Sealos账户
- 访问 https://cloud.sealos.io/
- 注册账户并登录

### 2. 本地应用准备

在部署之前，您需要确保后端应用代码准备就绪：

#### 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 构建步骤（如果需要）
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

#### 创建 docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/notes
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### 3. Sealos部署流程

#### 方法一：使用Sealos Cloud Dashboard
1. 登录 https://cloud.sealos.io/
2. 点击"Deploy"或"创建应用"
3. 选择部署方式：
   - 从GitHub仓库：提供仓库链接
   - 上传代码包：打包项目zip文件上传
   - 直接部署：粘贴Dockerfile内容

#### 方法二：使用Sealos CLI
```bash
# 登录sealos
sealos login cloud.sealos.io

# 初始化集群（如果需要）
sealos run k3s-sealos-io/registry:latest

# 部署应用
sealos deploy --name notes-app -f docker-compose.yml
```

#### 方法三：使用Docker镜像
1. 构建并推送镜像到Docker Hub或其他容器仓库
```bash
docker build -t yourusername/notes-backend .
docker push yourusername/notes-backend
```

2. 在Sealos控制台使用镜像部署

### 4. 环境变量配置

在Sealos控制台中配置必要的环境变量：
- DATABASE_URL: MongoDB连接字符串
- PORT: 应用端口（默认3000）
- JWT_SECRET: JWT密钥
- NODE_ENV: 生产环境标识

### 5. 数据库配置

Sealos支持多种数据库：
- 内置MongoDB服务
- 连接外部数据库（如阿里云MongoDB）
- 自建数据库实例

### 6. 域名配置

1. 在Sealos控制台分配域名
2. 或者使用自定义域名
3. 配置SSL证书（可选）

### 7. 监控和日志

- 通过Sealos控制台查看应用日志
- 监控应用健康状况
- 查看资源使用情况

### 8. 更新和维护

```bash
# 更新应用
sealos update --name notes-app -f docker-compose.yml

# 扩容副本
sealos scale --name notes-app --replicas=3

# 回滚版本
sealos rollback --name notes-app --revision=1
```

## HBuilderX打包桌面应用

### 1. 安装HBuilderX
- 下载并安装HBuilderX
- 安装必要插件

### 2. 配置项目
```json
// manifest.json
{
    "name": "NotesApp",
    "appid": "__UNI__XXXXXX",
    "description": "",
    "versionName": "1.0.0",
    "versionCode": "100",
    "app-plus": {
        "distribute": {
            "splashscreen": {
                "waiting": true,
                "alwaysShowBeforeRender": true
            },
            "android": {
                "permissions": [
                    "<uses-permission android:name=\"android.permission.INTERNET\"/>"
                ]
            },
            "ios": {},
            "sdkConfigs": {}
        }
    }
}
```

### 3. 打包为桌面应用
1. 在HBuilderX中打开项目
2. 点击"发行" -> "原生App-云打包"
3. 选择目标平台（Windows/macOS/Linux）
4. 配置打包参数
5. 提交打包

## 微信小程序部署

### 1. 微信公众平台准备
- 注册小程序账号
- 获取AppID
- 配置服务器域名

### 2. 小程序开发
- 创建uni-app项目
- 适配移动端UI
- 实现小程序特有的API

### 3. 上传发布
1. 在HBuilderX中选择"发行" -> "小程序-微信"
2. 生成小程序代码
3. 使用微信开发者工具上传
4. 在微信公众平台提交审核

## 注意事项

1. **安全性**：确保API接口有适当的验证机制
2. **性能**：优化数据库查询，使用缓存
3. **监控**：设置错误监控和性能监控
4. **备份**：定期备份数据库
5. **HTTPS**：使用SSL证书保护数据传输

## 常见问题排查

1. **部署失败**：检查Dockerfile和环境变量
2. **连接问题**：验证数据库连接字符串
3. **性能问题**：检查资源限制和优化代码
4. **域名问题**：确保DNS解析正确

这个部署流程可以让您将后端应用部署在Sealos上，然后通过HBuilderX打包为桌面应用，最后上传到微信小程序平台。