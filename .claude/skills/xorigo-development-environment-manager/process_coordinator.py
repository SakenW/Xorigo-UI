#!/usr/bin/env python3
"""
Xorigo UI 进程协调器
专门解决端口 3100 唯一占用问题，确保开发服务器的稳定访问
"""

import subprocess
import time
import os
import signal
import json
from typing import Optional, Dict, Tuple

class ProcessCoordinator:
    """进程协调器 - 确保端口 3100 的唯一使用"""

    def __init__(self):
        self.target_port = 3100
        self.processes = {}
        self.state_file = "/tmp/xorigo_dev_state.json"

    def detect_port_3100_usage(self) -> Dict[str, any]:
        """检测端口 3100 的使用情况"""
        print(f"🔍 检测端口 {self.target_port} 使用情况...")

        try:
            # 获取占用端口 3100 的进程信息
            result = subprocess.run(
                ["lsof", "-ti", f":{self.target_port}"],
                capture_output=True,
                text=True
            )

            if result.returncode == 0 and result.stdout.strip():
                process_id = int(result.stdout.strip())

                # 获取进程详细信息
                cmd_result = subprocess.run(
                    ["ps", "-p", str(process_id), "-o", "pid,ppid,cmd"],
                    capture_output=True,
                    text=True
                )

                process_info = {
                    "occupied": True,
                    "process_id": process_id,
                    "details": cmd_result.stdout.strip(),
                    "is_claude_process": self._is_claude_process(process_id),
                    "is_website_dev": self._is_website_dev_process(process_id)
                }

                print(f"📊 端口 {self.target_port} 被进程 {process_id} 占用")
                return process_info
            else:
                print(f"✅ 端口 {self.target_port} 空闲")
                return {"occupied": False}

        except Exception as e:
            print(f"❌ 检测失败: {e}")
            return {"occupied": False, "error": str(e)}

    def _is_claude_process(self, pid: int) -> bool:
        """检查是否是 Claude 的进程"""
        try:
            # 通过进程树检查是否与 Claude 相关
            parent_result = subprocess.run(
                ["ps", "-p", str(pid), "-o", "ppid="],
                capture_output=True,
                text=True
            )

            if parent_result.returncode == 0:
                ppid = int(parent_result.stdout.strip())
                # 检查父进程信息
                cmd_result = subprocess.run(
                    ["ps", "-p", str(ppid), "-o", "cmd="],
                    capture_output=True,
                    text=True
                )

                cmd = cmd_result.stdout.strip()
                return any(claude_indicator in cmd.lower() for claude_indicator in
                          ['claude', 'anthropic', 'mcp', 'skill'])

        except:
            pass
        return False

    def _is_website_dev_process(self, pid: int) -> bool:
        """检查是否是 Website 开发服务器进程"""
        try:
            cmd_result = subprocess.run(
                ["ps", "-p", str(pid), "-o", "cmd="],
                capture_output=True,
                text=True
            )

            cmd = cmd_result.stdout.strip()
            return any(indicator in cmd for indicator in
                      ['next dev', 'pnpm dev:website', 'website'])
        except:
            pass
        return False

    def coordinate_port_3100(self) -> bool:
        """协调端口 3100 的使用，确保唯一性"""
        print(f"🎯 开始协调端口 {self.target_port}...")

        # 检测当前使用情况
        usage = self.detect_port_3100_usage()

        if not usage["occupied"]:
            print("✅ 端口空闲，可以直接启动开发服务器")
            return True

        process_id = usage["process_id"]
        is_claude = usage.get("is_claude_process", False)
        is_website = usage.get("is_website_dev", False)

        # 决策逻辑
        if is_claude:
            print("🤖 检测到 Claude 进程占用端口")
            return self._handle_claude_process(process_id)
        elif is_website:
            print("🌐 检测到 Website 开发服务器运行")
            print("✅ 端口 3100 正在正常运行中")
            return True
        else:
            print("❓ 检测到未知进程占用端口")
            return self._handle_unknown_process(process_id)

    def _handle_claude_process(self, pid: int) -> bool:
        """处理 Claude 进程占用端口的情况"""
        print("🔧 处理 Claude 进程占用...")

        # 方案 1: 尝试优雅停止 Claude 的开发服务器进程
        try:
            # 发送 SIGTERM 信号
            os.kill(pid, signal.SIGTERM)
            print(f"📤 已向 Claude 进程 {pid} 发送停止信号")

            # 等待进程停止
            time.sleep(2)

            # 检查端口是否释放
            if not self.detect_port_3100_usage()["occupied"]:
                print("✅ Claude 进程已释放端口")
                return True

            # 如果优雅停止失败，强制停止
            os.kill(pid, signal.SIGKILL)
            print(f"🔨 已强制停止 Claude 进程 {pid}")
            time.sleep(1)

            return not self.detect_port_3100_usage()["occupied"]

        except Exception as e:
            print(f"❌ 处理 Claude 进程失败: {e}")
            return False

    def _handle_unknown_process(self, pid: int) -> bool:
        """处理未知进程占用端口的情况"""
        print(f"⚠️ 未知进程 {pid} 占用端口，提供用户选择:")
        print(f"1. 手动结束进程: kill {pid}")
        print(f"2. 重启系统清理端口")
        print(f"3. 使用其他端口（不推荐）")

        return False

    def save_coordination_state(self, state: Dict):
        """保存协调状态"""
        try:
            with open(self.state_file, 'w') as f:
                json.dump(state, f, indent=2)
        except:
            pass

    def load_coordination_state(self) -> Dict:
        """加载协调状态"""
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    return json.load(f)
        except:
            pass
        return {}

def main():
    """主函数 - 智能进程协调"""
    coordinator = ProcessCoordinator()

    print("🚀 Xorigo UI 进程协调器启动")
    print(f"🎯 目标：确保端口 3100 的唯一使用")

    # 执行端口协调
    success = coordinator.coordinate_port_3100()

    if success:
        print("✅ 端口 3100 协调成功")
        print("🌐 现在可以启动开发服务器或访问 http://localhost:3100")
    else:
        print("❌ 端口 3100 协调失败")
        print("💡 建议手动检查并清理端口占用")

    # 保存状态
    coordinator.save_coordination_state({
        "last_coordination": time.time(),
        "success": success,
        "target_port": 3100
    })

if __name__ == "__main__":
    main()