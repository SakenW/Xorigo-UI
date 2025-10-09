# 多阶段构建 - 生产环境 Dockerfile

# ==============================
# Stage 1: 构建阶段
# ==============================
FROM node:22-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# 安装依赖
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable && \
      pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# 复制源代码
COPY . .

# 构建演示应用
RUN npm run build:demo

# ==============================
# Stage 2: 生产环境
# ==============================
FROM nginx:alpine

# 安装必要工具
RUN apk add --no-cache bash

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制演示网站构建产物
# 注意: dist-demo目录结构为 dist-demo/demo-site/index.html, dist-demo/assets/
# 需要将demo-site目录下的index.html移到根目录,assets保持不变
COPY --from=builder /app/dist-demo/demo-site/index.html /usr/share/nginx/html/index.html
COPY --from=builder /app/dist-demo/assets /usr/share/nginx/html/assets

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3100/health || exit 1

# 暴露端口
EXPOSE 3100

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
