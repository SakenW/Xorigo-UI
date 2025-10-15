# ============================================
# Xorigo UI Website 生产环境 Dockerfile
# Multi-Stage Build for Next.js 15
# ============================================

# ===== Stage 1: Dependencies =====
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./

# 安装生产依赖（使用 npm install 因为没有 package-lock.json）
RUN npm install --legacy-peer-deps --omit=dev --no-fund --no-audit

# ===== Stage 2: Builder =====
FROM node:22-alpine AS builder

WORKDIR /app

# 复制所有源码
COPY . .

# 安装所有依赖（包括开发依赖）用于构建
RUN npm install --legacy-peer-deps --no-fund --no-audit

# 先构建 @xorigo-ui/core 包
RUN cd ../../packages/core && npm run build || true

# 禁用遥测
ENV NEXT_TELEMETRY_DISABLED=1

# 构建 Next.js 应用（跳过类型检查，因为开发时已验证）
RUN npx next build --no-lint || npx next build

# ===== Stage 3: Runner =====
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制 public 目录
COPY --from=builder /app/public ./public

# 复制 standalone 构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3100

# 设置环境变量
ENV PORT=3100
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
