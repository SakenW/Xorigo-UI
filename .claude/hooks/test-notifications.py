#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Xorigo UI 通知系统测试脚本
测试音效和飞书通知功能
"""

import json
import sys
import subprocess
from pathlib import Path

def create_test_todo_data(scenario="mixed"):
    """创建测试 Todo 数据"""
    scenarios = {
        "all_complete": [
            {"content": "完成 Button 组件开发", "status": "completed"},
            {"content": "编写 Button 单元测试", "status": "completed"},
            {"content": "更新 Button 组件文档", "status": "completed"}
        ],
        "in_progress": [
            {"content": "开发 Card 组件", "status": "completed"},
            {"content": "实现 Card 动画效果", "status": "in_progress"},
            {"content": "编写 Card 组件测试", "status": "pending"}
        ],
        "pending": [
            {"content": "设计 Modal 组件 API", "status": "pending"},
            {"content": "实现 Modal 组件", "status": "pending"},
            {"content": "添加 Modal 动画", "status": "pending"}
        ],
        "mixed": [
            {"content": "优化 Input 组件性能", "status": "completed"},
            {"content": "修复 Select 组件 bug", "status": "in_progress"},
            {"content": "设计 Toast 组件原型", "status": "pending"},
            {"content": "编写 Form 验证逻辑", "status": "pending"}
        ]
    }

    return {
        "tool": "TodoWrite",
        "input": {
            "todos": scenarios.get(scenario, scenarios["mixed"])
        },
        "result": {"success": True},
        "description": "测试 Todo 数据"
    }

def test_audio_feedback(test_data):
    """测试音效反馈"""
    print("🔊 测试音效反馈系统...")

    try:
        # 设置环境变量启用音频
        env = {
            'CLAUDE_GLOBAL_AUDIO_ENABLED': 'true',
            'XORIGO_AUDIO_ENABLED': 'true',
            'PATH': '/usr/bin:/bin'
        }

        process = subprocess.run(
            ['python3', '.claude/hooks/todo-audio-feedback.py'],
            input=json.dumps(test_data),
            text=True,
            capture_output=True,
            timeout=10,
            env=env
        )

        print(f"📟 音效反馈返回码: {process.returncode}")
        if process.stdout:
            print(f"📝 标准输出: {process.stdout.strip()}")
        if process.stderr:
            print(f"⚠️ 标准错误: {process.stderr.strip()}")

        return process.returncode == 0

    except subprocess.TimeoutExpired:
        print("❌ 音效反馈测试超时")
        return False
    except Exception as e:
        print(f"❌ 音效反馈测试异常: {e}")
        return False

def test_feishu_notification(test_data):
    """测试飞书通知"""
    print("📢 测试飞书通知系统...")

    try:
        # 设置环境变量（如果没有配置真实凭证，只测试逻辑）
        env = {
            'CLAUDE_LARK_ENABLED': 'false',  # 设置为 false 避免真实发送
            'XORIGO_FEISHU_ENABLED': 'true',
            'LARK_APP_ID': 'test_app_id',
            'LARK_APP_SECRET': 'test_app_secret',
            'LARK_DEFAULT_CHAT_ID': 'test_chat_id',
            'PATH': '/usr/bin:/bin'
        }

        process = subprocess.run(
            ['python3', '.claude/hooks/todo-feishu-notification.py'],
            input=json.dumps(test_data),
            text=True,
            capture_output=True,
            timeout=15,
            env=env
        )

        print(f"📟 飞书通知返回码: {process.returncode}")
        if process.stdout:
            print(f"📝 标准输出: {process.stdout.strip()}")
        if process.stderr:
            print(f"⚠️ 标准错误: {process.stderr.strip()}")

        return process.returncode == 0

    except subprocess.TimeoutExpired:
        print("❌ 飞书通知测试超时")
        return False
    except Exception as e:
        print(f"❌ 飞书通知测试异常: {e}")
        return False

def test_audio_component():
    """测试音频组件"""
    print("🎵 测试音频组件...")

    try:
        process = subprocess.run(
            ['python3', '.claude/hooks/components/audio/wsl-audio.py', 'test_preset', '测试音效', '--silent'],
            capture_output=True,
            text=True,
            timeout=10
        )

        print(f"📟 音频组件返回码: {process.returncode}")
        if process.stdout:
            print(f"📝 标准输出: {process.stdout.strip()}")
        if process.stderr:
            print(f"⚠️ 标准错误: {process.stderr.strip()}")

        return process.returncode == 0

    except subprocess.TimeoutExpired:
        print("❌ 音频组件测试超时")
        return False
    except Exception as e:
        print(f"❌ 音频组件测试异常: {e}")
        return False

def main():
    """主测试函数"""
    print("🧪 Xorigo UI 通知系统测试开始\n")

    # 检查文件是否存在
    required_files = [
        '.claude/hooks/todo-audio-feedback.py',
        '.claude/hooks/todo-feishu-notification.py',
        '.claude/hooks/components/audio/wsl-audio.py'
    ]

    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)

    if missing_files:
        print(f"❌ 缺少必要文件: {', '.join(missing_files)}")
        sys.exit(1)

    print("✅ 所有必要文件都存在\n")

    # 测试场景
    scenarios = ["all_complete", "in_progress", "pending", "mixed"]
    results = {}

    for scenario in scenarios:
        print(f"🎯 测试场景: {scenario}")
        print("=" * 50)

        test_data = create_test_todo_data(scenario)

        # 测试音频组件
        audio_ok = test_audio_component()

        # 测试音效反馈
        audio_feedback_ok = test_audio_feedback(test_data)

        # 测试飞书通知
        feishu_ok = test_feishu_notification(test_data)

        results[scenario] = {
            "audio_component": audio_ok,
            "audio_feedback": audio_feedback_ok,
            "feishu_notification": feishu_ok
        }

        print(f"🏁 场景 {scenario} 完成")
        print(f"   音频组件: {'✅' if audio_ok else '❌'}")
        print(f"   音效反馈: {'✅' if audio_feedback_ok else '❌'}")
        print(f"   飞书通知: {'✅' if feishu_ok else '❌'}")
        print("\n" + "=" * 50 + "\n")

    # 汇总结果
    print("📊 测试结果汇总:")
    print("=" * 50)

    total_tests = 0
    passed_tests = 0

    for scenario, result in results.items():
        print(f"\n🎯 {scenario}:")
        for test_name, passed in result.items():
            status = "✅ 通过" if passed else "❌ 失败"
            print(f"   {test_name}: {status}")
            total_tests += 1
            if passed:
                passed_tests += 1

    print(f"\n🏆 总体结果: {passed_tests}/{total_tests} 测试通过")

    if passed_tests == total_tests:
        print("🎉 所有测试通过！通知系统工作正常。")
        sys.exit(0)
    else:
        print("⚠️ 部分测试失败，请检查配置和脚本。")
        sys.exit(1)

if __name__ == "__main__":
    main()