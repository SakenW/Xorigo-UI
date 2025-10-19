#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Xorigo UI 项目 - Todo飞书通知 Hook
专门为 TodoWrite 工具提供飞书通知功能，集成 Xorigo UI 项目特色
"""

import json
import sys
import os
import subprocess
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

class XorigoFeishuNotifier:
    """Xorigo UI 项目专用飞书通知器"""

    def __init__(self):
        self.app_id = os.environ.get('LARK_APP_ID', '')
        self.app_secret = os.environ.get('LARK_APP_SECRET', '')
        self.chat_id = os.environ.get('LARK_DEFAULT_CHAT_ID', '')
        self.domain = os.environ.get('LARK_DOMAIN', 'https://open.feishu.cn')
        self.access_token = None

    def get_access_token(self) -> Optional[str]:
        """获取飞书访问令牌"""
        if not self.app_id or not self.app_secret:
            print("[DEBUG] 飞书应用凭证未配置", file=sys.stderr)
            return None

        if self.access_token:
            return self.access_token

        try:
            url = f"{self.domain}/open-apis/auth/v3/tenant_access_token/internal"
            headers = {"Content-Type": "application/json; charset=utf-8"}
            data = {
                "app_id": self.app_id,
                "app_secret": self.app_secret
            }

            response = requests.post(url, headers=headers, json=data, timeout=10)
            result = response.json()

            if result.get('code') == 0:
                self.access_token = result.get('tenant_access_token')
                print("[DEBUG] 飞书访问令牌获取成功", file=sys.stderr)
                return self.access_token
            else:
                print(f"[DEBUG] 飞书访问令牌获取失败: {result}", file=sys.stderr)
                return None

        except Exception as e:
            print(f"[DEBUG] 获取飞书访问令牌异常: {e}", file=sys.stderr)
            return None

    def analyze_todos(self, todos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """分析 Todo 状态"""
        if not todos:
            return {
                "total": 0,
                "completed": 0,
                "in_progress": 0,
                "pending": 0,
                "percentage": 0,
                "status": "no_tasks"
            }

        total = len(todos)
        completed = sum(1 for todo in todos if todo.get('status') == 'completed')
        in_progress = sum(1 for todo in todos if todo.get('status') == 'in_progress')
        pending = sum(1 for todo in todos if todo.get('status') == 'pending')

        percentage = int((completed / total) * 100) if total > 0 else 0

        if completed == total:
            status = "all_complete"
        elif in_progress > 0:
            status = "in_progress"
        else:
            status = "pending"

        return {
            "total": total,
            "completed": completed,
            "in_progress": in_progress,
            "pending": pending,
            "percentage": percentage,
            "status": status
        }

    def create_xorigo_card(self, todos: List[Dict[str, Any]], analysis: Dict[str, Any]) -> Dict[str, Any]:
        """创建 Xorigo UI 专用的飞书卡片"""

        # 根据状态选择卡片模板
        if analysis["status"] == "all_complete":
            template_color = "green"
            title = "🎉 Xorigo UI 任务全部完成"
            header_icon = "🎨"
        elif analysis["status"] == "in_progress":
            template_color = "blue"
            title = "⚡ Xorigo UI 开发进行中"
            header_icon = "🚀"
        else:
            template_color = "orange"
            title = "📋 Xorigo UI 任务规划"
            header_icon = "🎯"

        # 生成进度条
        progress_bar = "█" * (analysis["percentage"] // 10) + "░" * (10 - analysis["percentage"] // 10)

        # 构建任务列表
        task_elements = []
        for i, todo in enumerate(todos[:5]):  # 最多显示5个任务
            status_icon = {
                "completed": "✅",
                "in_progress": "🔄",
                "pending": "⏳"
            }.get(todo.get('status', 'pending'), "⏳")

            task_content = todo.get('content', '未知任务')
            task_elements.append({
                "tag": "div",
                "text": {
                    "tag": "lark_md",
                    "content": f"{status_icon} {task_content}"
                }
            })

        # 如果任务太多，添加省略提示
        if len(todos) > 5:
            task_elements.append({
                "tag": "div",
                "text": {
                    "tag": "plain_text",
                    "content": f"... 还有 {len(todos) - 5} 个任务"
                }
            })

        # 构建卡片内容
        card = {
            "config": {
                "wide_screen_mode": True
            },
            "header": {
                "title": {
                    "tag": "plain_text",
                    "content": f"{header_icon} {title}"
                },
                "template": template_color
            },
            "elements": [
                # 项目信息
                {
                    "tag": "div",
                    "text": {
                        "tag": "lark_md",
                        "content": "**🏗️ 项目**: Xorigo UI 组件库"
                    }
                },
                {
                    "tag": "div",
                    "text": {
                        "tag": "lark_md",
                        "content": "**🛠️ 技术栈**: React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12"
                    }
                },
                {
                    "tag": "hr"
                },
                # 进度信息
                {
                    "tag": "div",
                    "text": {
                        "tag": "lark_md",
                        "content": f"**📊 进度**: {progress_bar} {analysis['percentage']}%"
                    }
                },
                {
                    "tag": "div",
                    "text": {
                        "tag": "lark_md",
                        "content": f"**📋 状态**: ✅{analysis['completed']} | 🔄{analysis['in_progress']} | ⏳{analysis['pending']}"
                    }
                },
                {
                    "tag": "hr"
                },
                # 任务列表
                {
                    "tag": "div",
                    "text": {
                        "tag": "lark_md",
                        "content": "**📝 任务列表**:"
                    }
                }
            ]
        }

        # 添加任务元素
        card["elements"].extend(task_elements)

        # 添加时间戳
        card["elements"].extend([
            {
                "tag": "hr"
            },
            {
                "tag": "div",
                "text": {
                    "tag": "plain_text",
                    "content": f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
                }
            }
        ])

        return card

    def send_card(self, card: Dict[str, Any]) -> bool:
        """发送飞书卡片"""
        access_token = self.get_access_token()
        if not access_token:
            return False

        try:
            url = f"{self.domain}/open-apis/im/v1/messages"
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json; charset=utf-8"
            }
            data = {
                "receive_id": self.chat_id,
                "receive_id_type": "chat_id",
                "msg_type": "interactive",
                "content": json.dumps(card, ensure_ascii=False)
            }

            response = requests.post(url, headers=headers, json=data, timeout=15)
            result = response.json()

            if result.get('code') == 0:
                message_id = result.get('data', {}).get('message_id')
                print(f"[DEBUG] ✅ 飞书卡片发送成功: {message_id}", file=sys.stderr)
                return True
            else:
                print(f"[DEBUG] ❌ 飞书卡片发送失败: {result}", file=sys.stderr)
                return False

        except Exception as e:
            print(f"[DEBUG] 发送飞书卡片异常: {e}", file=sys.stderr)
            return False

def main():
    """飞书通知主函数"""
    try:
        print("[DEBUG] Xorigo UI Todo飞书通知Hook被调用", file=sys.stderr)

        # 从标准输入读取数据
        data = json.load(sys.stdin)
        tool_input = data.get('tool_input', {})

        # 检查是否启用飞书通知
        feishu_enabled = os.environ.get('CLAUDE_LARK_ENABLED', 'true').lower() == 'true'
        xorigo_feishu_enabled = os.environ.get('XORIGO_FEISHU_ENABLED', 'true').lower() == 'true'

        if not (feishu_enabled and xorigo_feishu_enabled):
            print("[DEBUG] 飞书通知已禁用", file=sys.stderr)
            return

        # 获取 todos 数据
        todos = tool_input.get('todos', [])
        if not todos:
            print("[DEBUG] 没有Todo数据，跳过飞书通知", file=sys.stderr)
            return

        print(f"[DEBUG] 接收到 {len(todos)} 个Todo任务", file=sys.stderr)

        # 创建通知器并发送
        notifier = XorigoFeishuNotifier()
        analysis = notifier.analyze_todos(todos)
        card = notifier.create_xorigo_card(todos, analysis)

        success = notifier.send_card(card)

        if success:
            print("📢 Xorigo UI 飞书通知发送成功")
        else:
            print("❌ Xorigo UI 飞书通知发送失败")

    except Exception as e:
        print(f"[DEBUG] 飞书通知Hook执行错误: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)

    sys.exit(0)

if __name__ == "__main__":
    main()