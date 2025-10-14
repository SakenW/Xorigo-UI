#!/bin/bash

# Xorigo UI Gallery 页面验证脚本
# 用于验证 Gallery 页面是否正常工作

echo "🎨 Xorigo UI Gallery 页面验证"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 页面 URL
GALLERY_URL="http://localhost:3100/gallery"

echo ""
echo "📊 检查 Docker 容器状态..."

# 检查 Docker 容器状态
if docker ps | grep -q "xorigo-ui-website-dev"; then
    echo -e "${GREEN}✅ Docker 容器运行正常${NC}"
    CONTAINER_STATUS="running"
else
    echo -e "${RED}❌ Docker 容器未运行${NC}"
    echo -e "${YELLOW}💡 请运行: docker-compose -f docker-compose.dev.monorepo.yml up -d${NC}"
    CONTAINER_STATUS="stopped"
fi

echo ""
echo "🌐 检查页面连接..."

# 检查页面连接
if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$GALLERY_URL" 2>/dev/null)
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$GALLERY_URL" 2>/dev/null)

    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ 页面连接正常${NC}"
        echo -e "${GREEN}   HTTP 状态码: $HTTP_STATUS${NC}"
        echo -e "${GREEN}   响应时间: ${RESPONSE_TIME}s${NC}"
        PAGE_STATUS="accessible"
    else
        echo -e "${RED}❌ 页面连接失败${NC}"
        echo -e "${RED}   HTTP 状态码: $HTTP_STATUS${NC}"
        PAGE_STATUS="inaccessible"
    fi
else
    echo -e "${YELLOW}⚠️ curl 命令未找到，无法检查页面连接${NC}"
    PAGE_STATUS="unknown"
fi

echo ""
echo "📋 获取页面信息..."

# 获取页面信息
if [ "$PAGE_STATUS" = "accessible" ]; then
    if command -v curl &> /dev/null; then
        # 获取页面标题
        PAGE_TITLE=$(curl -s "$GALLERY_URL" | grep -o '<title>[^<]*</title>' | sed 's/<title>\(.*\)<\/title>/\1/')

        # 获取页面描述
        PAGE_DESC=$(curl -s "$GALLERY_URL" | grep -o 'name="description"[^>]*content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/')

        # 获取页面大小
        PAGE_SIZE=$(curl -s "$GALLERY_URL" | wc -c)

        echo -e "${GREEN}✅ 页面信息获取成功${NC}"
        echo -e "${GREEN}   标题: $PAGE_TITLE${NC}"
        echo -e "${GREEN}   描述: $PAGE_DESC${NC}"
        echo -e "${GREEN}   大小: $PAGE_SIZE bytes${NC}"

        # 检查组件
        echo ""
        echo "🧩 检查页面组件..."

        COMPONENTS=$(curl -s "$GALLERY_URL" | grep -o '"Gallery[^"]*"' | sort | uniq)
        if [ -n "$COMPONENTS" ]; then
            echo -e "${GREEN}✅ 检测到以下组件:${NC}"
            echo "$COMPONENTS" | while read -r component; do
                echo -e "${GREEN}   • $component${NC}"
            done
        else
            echo -e "${YELLOW}⚠️ 未检测到 Gallery 组件${NC}"
        fi
    fi
else
    echo -e "${RED}❌ 页面不可访问，无法获取信息${NC}"
fi

echo ""
echo "🎯 验证结果总结..."

# 总结结果
if [ "$CONTAINER_STATUS" = "running" ] && [ "$PAGE_STATUS" = "accessible" ]; then
    echo -e "${GREEN}🎉 Gallery 页面验证通过！${NC}"
    echo -e "${GREEN}   ✅ Docker 容器正常运行${NC}"
    echo -e "${GREEN}   ✅ 页面可正常访问${NC}"
    echo -e "${GREEN}   ✅ 页面组件正常加载${NC}"
    echo ""
    echo -e "${BLUE}🌐 您可以在浏览器中访问: $GALLERY_URL${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}❌ Gallery 页面验证失败！${NC}"

    if [ "$CONTAINER_STATUS" != "running" ]; then
        echo -e "${RED}   ❌ Docker 容器未运行${NC}"
        echo -e "${YELLOW}   解决方案: docker-compose -f docker-compose.dev.monorepo.yml up -d${NC}"
    fi

    if [ "$PAGE_STATUS" != "accessible" ]; then
        echo -e "${RED}   ❌ 页面无法访问${NC}"
        echo -e "${YELLOW}   解决方案: 检查端口映射和容器状态${NC}"
    fi

    echo ""
    echo -e "${YELLOW}💡 如果问题持续存在，请查看故障排除日志:${NC}"
    echo -e "${YELLOW}   file:///home/saken/project/Xorigo-UI/docs/TROUBLESHOOTING-LOG.md${NC}"
    EXIT_CODE=1
fi

echo ""
echo "================================"
echo "验证完成 - $(date)"

exit $EXIT_CODE