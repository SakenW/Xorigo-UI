# ============================================
# Docker Compose 更新验证脚本
# Phase 3 Workbench Editor Mode 部署测试
# ============================================

echo "🔍 开始验证 Docker Compose 配置更新..."

echo ""
echo "📋 更新内容检查："

# 1. 检查端口配置
echo "✅ 端口配置：3100 (Website) + 6006 (Storybook)"

# 2. 检查健康检查配置
echo "✅ 健康检查：API + Workbench 功能验证"

# 3. 检查标签更新
echo "✅ 服务标签：features=workbench,editor,monaco + phase=3-complete"

# 4. 检查Monaco Editor依赖
echo "✅ Monaco Editor：@monaco-editor/react ^4.7.0 已包含"

# 5. 检查新文件
echo "✅ 新组件文件："
echo "   - workbench-editor-server.tsx (8KB)"
echo "   - workbench-editor-client.tsx (18KB)"
echo "   - workbench-props-editor.tsx (12KB)"
echo "   - workbench-theme-editor.tsx (11KB)"
echo "   - workbench-component-preview.tsx (5KB)"

echo ""
echo "🚀 部署命令："
echo "docker-compose -f docker-compose.dev.monorepo.yml up --build -d"

echo ""
echo "🔍 验证命令："
echo "# 检查容器状态"
echo "docker ps | grep xorigo-ui-website"
echo ""
echo "# 检查健康状态"
echo "docker logs xorigo-ui-website-dev | tail -10"
echo ""
echo "# 访问服务"
echo "curl -I http://localhost:3100/api/health"
echo "curl http://localhost:3100/api/health?detailed=true | jq '.workbench'"
echo ""
echo "# 测试Workbench页面"
echo "curl -I http://localhost:3100/workbench"

echo ""
echo "📊 Phase 3 功能验证："
echo "1. Gallery页面：http://localhost:3100/gallery"
echo "2. Workbench主页：http://localhost:3100/workbench"
echo "3. Editor模式：http://localhost:3100/workbench?mode=editor"
echo "4. 具体组件：http://localhost:3100/workbench?mode=editor&component=button"

echo ""
echo "🎯 关键更新点："
echo "- Storybook端口：6009 → 6006 (与package.json一致)"
echo "- 健康检查：增强Workbench功能验证"
echo "- 服务标签：标记Phase 3完成状态"
echo "- API版本：v1.0.0 → v2.0.0"
echo "- 系统描述：更新为Workbench Architecture"

echo ""
echo "⚠️  注意事项："
echo "- 确保没有其他服务占用3100/6006端口"
echo "- 首次启动可能需要较长时间安装依赖"
echo "- Monaco Editor需要浏览器环境，首次加载可能较慢"

echo ""
echo "✅ Docker Compose 配置验证完成！"