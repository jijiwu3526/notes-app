# Seayos后端部署详细指南

## 1. 前端准备工作

### 1.1 代码准备
在部署到Sealos之前，请确保您的后端应用代码准备就绪：

- 代码推送到GitHub仓库
- 包含Dockerfile
- 包含package.json
- 环境变量配置明确

### 1.2 项目结构示例
```
notes-backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.ts
├── package.json
├── tsconfig.json
├── Dockerfile
└── docker-compose.yml
```

## 2. Sealos部署步骤

### 2.1 使用Sealos Dashboard部署

1. **登录Sealos Cloud**
   - 访问 https://cloud.sealos.io/
   - 使用您的账户登录

2. **创建应用**
   - 点击"应用" -> "创建应用"
   - 选择部署方式：
     - 从Git仓库部署
     - 上传代码包
     - 使用镜像部署

3. **从Git仓库部署**
   - 输入您的GitHub/GitLab仓库URL
   - 选择分支（通常是main或master）
   - 选择构建上下文路径（通常是项目根目录）

### 2.2 Dockerfile示例
```dockerfile
# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用源代码
COPY . .

# 编译TypeScript（如果使用）
RUN npm run build

# 暴露端口
EXPOSE 3000

# 定义环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "dist/server.js"]
```

### 2.3 部署配置

在Sealos控制台中进行以下配置：

**资源配置**：
- CPU: 0.5-1核
- 内存: 512MB-1GB
- 存储: 根据需要选择

**环境变量**：
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://your-mongo-url/notes
JWT_SECRET=your-jwt-secret
```

**端口配置**：
- 内部端口: 3000
- 对外端口: 80

## 3. 数据库配置

### 3.1 使用Sealos内置MongoDB
1. 在应用市场中搜索"MongoDB"
2. 部署MongoDB实例
3. 获取连接字符串并配置到应用环境变量

### 3.2 连接外部数据库
如果您有自己的MongoDB实例，需要确保：
- 数据库可公开访问
- 白名单配置包含Sealos的IP范围

## 4. 自定义域名和SSL

### 4.1 配置自定义域名
1. 在域名提供商处添加CNAME记录指向Sealos提供的域名
2. 在Sealos控制台添加自定义域名
3. 等待DNS生效（通常几分钟到几小时）

### 4.2 SSL证书
Sealos通常会自动提供SSL证书，您也可以上传自定义证书。

## 5. 健康检查和监控

### 5.1 健康检查端点
在您的应用中添加健康检查路由：
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

### 5.2 日志查看
- 通过Sealos控制台查看应用日志
- 设置日志级别为适当等级
- 监控错误日志

## 6. HBuilderX打包桌面应用

### 6.1 配置HBuilderX项目
```json
{
  "name": "NotesApp",
  "appid": "__UNI__XXXXXX",
  "description": "全栈记事本应用",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true
    },
    "modules": {},
    "distribute": {
      "android": {
        "permissions": [
          "<uses-permission android:name=\"android.permission.CHANGE_NETWORK_STATE\"/>",
          "<uses-permission android:name=\"android.permission.MOUNT_UNMOUNT_FILESYSTEMS\"/>",
          "<uses-permission android:name=\"android.permission.READ_CONTACTS\"/>",
          "<uses-permission android:name=\"android.permission.VIBRATE\"/>",
          "<uses-permission android:name=\"android.permission.READ_LOGS\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_WIFI_STATE\"/>",
          "<uses-permission android:name=\"android.permission.WRITE_CONTACTS\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_NETWORK_STATE\"/>",
          "<uses-permission android:name=\"android.permission.CAMERA\"/>",
          "<uses-permission android:name=\"android.permission.RECORD_AUDIO\"/>",
          "<uses-permission android:name=\"android.permission.GET_ACCOUNTS\"/>",
          "<uses-permission android:name=\"android.permission.MODIFY_AUDIO_SETTINGS\"/>",
          "<uses-permission android:name=\"android.permission.READ_PHONE_STATE\"/>",
          "<uses-permission android:name=\"android.permission.CHANGE_WIFI_STATE\"/>",
          "<uses-permission android:name=\"android.permission.WAKE_LOCK\"/>",
          "<uses-permission android:name=\"android.permission.CALL_PHONE\"/>",
          "<uses-permission android:name=\"android.permission.FLASHLIGHT\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_COARSE_LOCATION\"/>",
          "<uses-permission android:name=\"android.permission.ACCESS_FINE_LOCATION\"/>",
          "<uses-permission android:name=\"android.permission.WRITE_SETTINGS\"/>"
        ]
      },
      "ios": {},
      "sdkConfigs": {}
    }
  }
}
```

### 6.2 打包为桌面应用
1. 打开HBuilderX
2. 选择"发行" -> "原生App-云打包"
3. 选择目标平台（Windows/macOS/Linux）
4. 填写应用信息
5. 提交打包任务

## 7. 微信小程序部署

### 7.1 准备工作
- 注册微信小程序账号
- 获取AppID
- 下载微信开发者工具

### 7.2 配置小程序
```javascript
// main.js 或 app.js
const config = {
  apiUrl: 'https://your-sealos-domain.com/api', // 您的Sealos后端API地址
  appId: 'your-wechat-appid',
  appSecret: 'your-wechat-appsecret'
};

export default config;
```

### 7.3 上传小程序
1. 在HBuilderX中编译为微信小程序
2. 打开微信开发者工具
3. 上传代码到微信平台
4. 在微信公众平台提交审核

## 8. 故障排除

### 8.1 常见问题
1. **部署失败**：检查Dockerfile语法和依赖安装
2. **连接数据库失败**：确认数据库连接字符串正确
3. **环境变量缺失**：确保所有必需环境变量已配置
4. **端口冲突**：确认应用监听正确端口

### 8.2 性能优化
- 启用应用日志监控
- 配置合适的资源限制
- 实现数据库连接池
- 使用缓存机制

## 9. 安全最佳实践

1. **API安全**：
   - 使用JWT进行身份验证
   - 实现API限流
   - 验证所有输入参数

2. **数据安全**：
   - 加密敏感数据
   - 定期备份数据库
   - 使用HTTPS传输

3. **访问控制**：
   - 实现权限系统
   - 使用CORS配置
   - 定期更新依赖

## 10. 维护和更新

### 10.1 应用更新
1. 更新代码并推送至Git仓库
2. 在Sealos控制台触发重新部署
3. 验证更新后的应用正常运行

### 10.2 数据库迁移
如需数据库结构变更：
1. 创建迁移脚本
2. 在部署前执行迁移
3. 备份现有数据

通过遵循这个指南，您应该能够成功将后端应用部署到Sealos，然后使用HBuilderX打包为桌面应用，并最终部署到微信小程序平台。