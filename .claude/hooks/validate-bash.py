#!/usr/bin/env python3
"""
Xorigo UI Bash 命令验证 Hook

严格禁止 npm run dev 命令，确保只能使用 Docker 热更新容器
"""

import json
import sys
import re
import os

def is_npm_run_dev_forbidden(command):
    """检查是否为被禁止的 npm run dev 命令"""

    # 定义被禁止的命令模式
    forbidden_patterns = [
        r'npm\s+run\s+dev',
        r'npm\s+run\s+dev:website',
        r'yarn\s+dev',
        r'pnpm\s+dev',
        r'npm\s+start',
        r'next\s+dev',
        r'npm.*dev.*3000',
        r'npm.*dev.*3001'
    ]

    command_lower = command.lower()

    for pattern in forbidden_patterns:
        if re.search(pattern, command_lower):
            return True, f"检测到被禁止的命令: {pattern}"

    return False, None

def check_port_usage(command):
    """检查命令是否试图使用被禁止的端口"""

    # 检查是否试图使用端口 3000 或 3001
    forbidden_port_patterns = [
        r'--port\s+3000',
        r'-p\s+3000',
        r':3000',
        r'--port\s+3001',
        r'-p\s+3001',
        r':3001'
    ]

    for pattern in forbidden_port_patterns:
        if re.search(pattern, command):
            return True, f"检测到试图使用被禁止的端口: {pattern}"

    return False, None

def is_docker_allowed_command(command):
    """检查是否为允许的 Docker 相关命令"""

    # Docker 直接命令被禁止，必须通过代理
    forbidden_docker_patterns = [
        r'docker[-\s]compose',
        r'docker\s+run',
        r'docker\s+start',
        r'docker\s+stop',
        r'docker\s+restart',
        r'docker\s+build',
        r'docker\s+up',
        r'docker\s+down',
        r'docker\s+ps',
        r'docker\s+logs',
        r'docker\s+exec',
        r'docker\s+rm',
        r'docker\s+images',
        r'docker\s+rmi',
        r'docker\s+pull',
        r'docker\s+push',
        r'docker\s+tag',
        r'docker\s+system',
        r'docker\s+network',
        r'docker\s+volume',
        r'docker\s+prune',
        r'docker\s+save',
        r'docker\s+load',
        r'docker\s+export',
        r'docker\s+import',
        r'docker\s+image',
        r'docker\s+container'
    ]

    # 检查是否为被禁止的 Docker 命令
    for pattern in forbidden_docker_patterns:
        if re.search(pattern, command):
            return False, f"检测到被禁止的 Docker 命令: {pattern}，请使用代理系统"

    # 只允许通过代理系统执行的 Docker 命令
    allowed_patterns = [
        r'npm\s+run\s+docker:dev',
        r'npm\s+run\s+docker:build',
        r'npm\s+run\s+docker:rebuild',
        r'npm\s+run\s+docker:clean',
        r'npm\s+run\s+agent:',
        r'npm\s+run\s+docker:',
        r'\./scripts/agent-dev-server\.sh',
        r'\./scripts/dev-docker\.sh',
        r'\./scripts/test-dev-server-agent\.sh',
        r'python3.*\.claude/hooks/validate-bash\.py'  # 允许 Hook 自身调用
    ]

    # 检查是否为允许的命令
    for pattern in allowed_patterns:
        if re.search(pattern, command):
            return True, None

    return False, None

def validate_command(command):
    """验证命令是否被允许执行"""

    # 1. 检查是否为被禁止的 npm run dev 命令
    is_forbidden, reason = is_npm_run_dev_forbidden(command)
    if is_forbidden:
        return False, reason

    # 2. 检查是否试图使用被禁止的端口
    port_forbidden, port_reason = check_port_usage(command)
    if port_forbidden:
        return False, port_reason

    # 3. 检查 Docker 命令是否通过代理系统
    docker_allowed, docker_reason = is_docker_allowed_command(command)
    if docker_reason:  # 如果有明确的原因，说明是被禁止的
        return False, docker_reason

    # 4. 如果不是明确允许的命令，检查是否为开发服务器相关的命令
    if not docker_allowed:
        # 检查是否为开发服务器相关的命令
        dev_server_patterns = [
            r'npm.*dev',
            r'next.*dev',
            r'start.*dev',
            r'dev.*server',
            r'localhost.*3000',
            r'localhost.*3001'
        ]

        for pattern in dev_server_patterns:
            if re.search(pattern, command):
                return False, f"检测到开发服务器相关命令，请使用代理系统: {pattern}"

    return True, None

def main():
    """主函数"""
    try:
        # 从 stdin 读取输入
        input_data = json.loads(sys.stdin.read())

        # 获取命令信息
        command = input_data.get('command', '')

        if not command:
            # 如果没有命令，允许执行
            print(json.dumps({
                "allowed": True,
                "message": "No command to validate"
            }))
            return 0

        # 验证命令
        is_allowed, reason = validate_command(command)

        if is_allowed:
            # 命令被允许
            response = {
                "allowed": True,
                "message": f"Command allowed: {command[:50]}..."
            }
            print(json.dumps(response))
            return 0
        else:
            # 命令被禁止
            error_msg = f"""🚨 命令被禁止！

原因: {reason}

⚠️ 重要约束:
- ❌ 严禁使用 npm run dev 命令
- ❌ 严禁直接操作 Docker，必须通过代理系统
- ❌ 严禁使用端口 3000/3001
- ✅ 必须使用 Docker 热更新容器 (端口 3100)
- ✅ 请使用代理系统: npm run agent:* 或 ./scripts/agent-dev-server.sh

📖 参考: docs/dev-server-agent-guide.md
🛡️ 参考: docs/claude-hooks-protection-guide.md

当前命令: {command}
"""

            response = {
                "allowed": False,
                "message": error_msg,
                "suggestion": "请使用 'npm run agent:start' 启动开发环境"
            }
            print(json.dumps(response), file=sys.stderr)
            return 2

    except json.JSONDecodeError:
        error_msg = "❌ Hook 输入格式错误：无法解析 JSON"
        print(json.dumps({"allowed": False, "message": error_msg}), file=sys.stderr)
        return 2

    except Exception as e:
        error_msg = f"❌ Hook 执行错误: {str(e)}"
        print(json.dumps({"allowed": False, "message": error_msg}), file=sys.stderr)
        return 2

if __name__ == "__main__":
    sys.exit(main())