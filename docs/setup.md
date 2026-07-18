# 本地运行

## 环境

- Node.js 22+
- OpenAI API Key（或兼容网关）

## 启动

```bash
git clone https://github.com/kk18615105392/Agent.git
cd Agent

cp .env.example .env.local
# 填入 OPENAI_API_KEY

npm install
npm run dev
```

打开 http://localhost:3000

```bash
# 健康检查
curl http://localhost:3000/api/health

# 构建
npm run build && npm start
```

项目说明见 [README.md](../README.md)。  
面试说明见 [interview.md](interview.md)。
