#!/bin/bash

# 查看 Xorigo UI Docker 开发环境日志

echo "📊 查看 Xorigo UI 开发容器日志..."
docker-compose -f docker-compose.dev.yml logs -f
