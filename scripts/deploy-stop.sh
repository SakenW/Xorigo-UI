#!/bin/bash

# 停止 TH-UI 生产环境

echo "🛑 停止 TH-UI 生产环境..."
docker-compose down

echo "✅ 生产环境已停止"
