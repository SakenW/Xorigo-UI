#!/bin/bash

# 停止 TH-UI Docker 开发环境

echo "🛑 停止 TH-UI 开发环境..."
docker-compose -f docker-compose.dev.yml down

echo "✅ 开发环境已停止"
