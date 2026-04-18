# 智谱AI Web客户端

前后端分离架构：React + Flask

## 项目结构

```
├── frontend/          # React前端
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/          # Flask后端
    ├── app.py
    └── requirements.txt
```

## 安装

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
pip install -r requirements.txt
```

## 运行

```bash
# 终端1: 启动后端
cd backend
python app.py

# 终端2: 启动前端
cd frontend
npm run dev
```

访问 http://localhost:3000

## API接口

- `POST /api/save_key` - 保存API Key
- `POST /api/chat` - 发送消息

## 获取API Key

访问 https://open.bigmodel.cn 注册获取