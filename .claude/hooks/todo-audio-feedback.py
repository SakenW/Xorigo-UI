#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Xorigo UI 项目 - Todo音效反馈 Hook
专门为 TodoWrite 工具提供音效反馈，支持不同任务状态的音效
"""

import json
import sys
import os
import subprocess
from pathlib import Path

def play_preset_audio(preset_name, description, silent=False):
    """播放预设音效"""
    if silent:
        print(f"[DEBUG] 静音模式，跳过音效播放: {preset_name}", file=sys.stderr)
        return True

    try:
        print(f"[DEBUG] 尝试播放音效: {preset_name} - {description}", file=sys.stderr)

        # 使用项目本地音频组件
        wsl_audio_path = Path(__file__).parent / 'components' / 'audio' / 'wsl-audio.py'

        if wsl_audio_path.exists():
            result = subprocess.run(['python3', str(wsl_audio_path), preset_name, description],
                                 capture_output=True, timeout=5)
            if result.returncode == 0:
                print(f"[DEBUG] ✅ Todo音效播放成功: {preset_name}", file=sys.stderr)
                return True

        # 备用：终端提示音
        print(f"[DEBUG] 使用终端提示音: {preset_name}", file=sys.stderr)
        print('\a', end='', flush=True)
        return True
    except Exception as e:
        print(f"[DEBUG] 音效播放异常: {e}", file=sys.stderr)
        # 最后备用方案
        print('\a', end='', flush=True)
        return True

def analyze_todo_audio_type(todo_data):
    """分析Todo状态并返回应该播放的音效类型"""
    if not todo_data:
        return None

    todos = todo_data.get('todos', [])
    if not todos:
        return None

    # 统计各状态的任务数量
    pending_count = sum(1 for todo in todos if todo.get('status') == 'pending')
    in_progress_count = sum(1 for todo in todos if todo.get('status') == 'in_progress')
    completed_count = sum(1 for todo in todos if todo.get('status') == 'completed')
    total_count = len(todos)

    # 根据状态返回音效类型
    if completed_count == total_count and total_count > 0:
        return "all_complete"
    elif in_progress_count > 0:
        return "task_progress"
    elif pending_count > 0:
        return "todo_update"
    else:
        return "todo_update"

def get_xorigo_project_context():
    """获取 Xorigo UI 项目上下文"""
    try:
        # 检测当前目录是否为 Xorigo UI 项目
        cwd = Path.cwd()
        project_marker_files = ['package.json', 'CLAUDE.md', 'README.md']

        is_xorigo_project = any(
            (cwd / marker).exists() and 'xorigo' in (cwd / marker).read_text().lower()
            for marker in project_marker_files
        )

        if is_xorigo_project:
            return {
                "project_name": "Xorigo UI",
                "project_type": "ui_component_library",
                "tech_stack": ["React", "TypeScript", "Tailwind CSS", "Framer Motion"]
            }

        return {
            "project_name": "Unknown",
            "project_type": "generic",
            "tech_stack": []
        }
    except Exception as e:
        print(f"[DEBUG] 获取项目上下文失败: {e}", file=sys.stderr)
        return {
            "project_name": "Unknown",
            "project_type": "generic",
            "tech_stack": []
        }

def main():
    """音效反馈主函数"""
    try:
        print("[DEBUG] Xorigo UI Todo音效反馈Hook被调用", file=sys.stderr)

        # 从标准输入读取数据
        data = json.load(sys.stdin)
        tool_input = data.get('tool_input', {})

        # 获取项目上下文
        project_context = get_xorigo_project_context()
        print(f"[DEBUG] 项目上下文: {project_context}", file=sys.stderr)

        print(f"[DEBUG] 接收到数据: {data}", file=sys.stderr)

        # 检查是否启用音频
        audio_enabled = os.environ.get('CLAUDE_GLOBAL_AUDIO_ENABLED', 'true').lower() == 'true'
        xorigo_audio_enabled = os.environ.get('XORIGO_AUDIO_ENABLED', 'true').lower() == 'true'
        silent_mode = not (audio_enabled and xorigo_audio_enabled)

        if silent_mode:
            print("[DEBUG] 音频已禁用，跳过Todo音效", file=sys.stderr)
            return

        # 分析并播放相应音效
        audio_type = analyze_todo_audio_type(tool_input)
        if audio_type:
            # 根据项目类型定制描述
            if project_context["project_name"] == "Xorigo UI":
                descriptions = {
                    "all_complete": "Xorigo UI 组件开发任务全部完成",
                    "task_progress": "Xorigo UI 组件开发进度更新",
                    "todo_update": "Xorigo UI 任务列表更新"
                }
            else:
                descriptions = {
                    "all_complete": "所有任务已完成",
                    "task_progress": "任务进度更新",
                    "todo_update": "任务列表更新"
                }

            description = descriptions.get(audio_type, f"{audio_type} - {project_context['project_name']}")
            play_preset_audio(audio_type, description, silent_mode)

            if not silent_mode:
                if audio_type == "all_complete":
                    print(f"🎉 {project_context['project_name']} 所有任务已完成！")
                elif audio_type == "task_progress":
                    print(f"⚡ {project_context['project_name']} 任务进度更新")
                else:
                    print(f"📝 {project_context['project_name']} 任务列表更新")

    except Exception as e:
        print(f"[DEBUG] 音效反馈Hook执行错误: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)

    sys.exit(0)

if __name__ == "__main__":
    main()