#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WSL/Linux 音效播放组件
支持多种音效播放方式，适配 WSL 和 Linux 环境
"""

import os
import sys
import subprocess
import platform
from pathlib import Path
from enum import Enum
from typing import Optional

class AudioPreset(Enum):
    """音效预设枚举"""
    TODO_UPDATE = "todo_update"
    TASK_PROGRESS = "task_progress"
    ALL_COMPLETE = "all_complete"
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"

class WSLAudioPlayer:
    """WSL/Linux 环境音效播放器"""

    def __init__(self):
        self.system = platform.system().lower()
        self.is_wsl = self._detect_wsl()

    def _detect_wsl(self) -> bool:
        """检测是否为 WSL 环境"""
        try:
            with open('/proc/version', 'r') as f:
                version = f.read().lower()
                return 'microsoft' in version or 'wsl' in version
        except:
            return False

    def _get_windows_executable(self) -> Optional[str]:
        """获取 Windows 可执行文件路径（WSL 环境）"""
        if not self.is_wsl:
            return None

        # 在 WSL 中寻找 Windows 可执行文件
        windows_paths = [
            '/mnt/c/Windows/System32/powershell.exe',
            '/mnt/c/Windows/System32/cmd.exe',
            '/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe'
        ]

        for path in windows_paths:
            if Path(path).exists():
                return path
        return None

    def _play_wsl_audio(self, preset_name: str, description: str) -> bool:
        """在 WSL 环境中播放音效"""
        try:
            powershell = self._get_windows_executable()
            if not powershell:
                return False

            # WSL 中的音效播放命令
            sound_commands = [
                # 使用系统提示音
                f'{powershell} -Command "Add-Type -AssemblyName System.Media; [System.Media.SystemSounds]::Beep.Play()"',
                # 使用 PowerShell 的 beep 命令
                f'{powershell} -Command "Write-Host `a; Start-Sleep -Milliseconds 100"',
                # 简单的字符提示音
                f'{powershell} -Command "echo `a"'
            ]

            for cmd in sound_commands:
                try:
                    result = subprocess.run(
                        cmd,
                        shell=True,
                        capture_output=True,
                        timeout=3
                    )
                    if result.returncode == 0:
                        print(f"[DEBUG] WSL音效播放成功: {preset_name}", file=sys.stderr)
                        return True
                except subprocess.TimeoutExpired:
                    continue
                except Exception:
                    continue

            return False

        except Exception as e:
            print(f"[DEBUG] WSL音效播放异常: {e}", file=sys.stderr)
            return False

    def _play_linux_audio(self, preset_name: str, description: str) -> bool:
        """在 Linux 环境中播放音效"""
        try:
            # Linux 音效播放命令
            sound_commands = [
                # 使用 aplay（如果可用）
                ['which', 'aplay'],
                # 使用 paplay（Pulse Audio）
                ['which', 'paplay'],
                # 使用 speaker-test（测试扬声器）
                ['which', 'speaker-test']
            ]

            # 检查可用的音频工具
            audio_tool = None
            for cmd in sound_commands:
                try:
                    result = subprocess.run(cmd, capture_output=True, timeout=2)
                    if result.returncode == 0:
                        if 'aplay' in cmd[1]:
                            audio_tool = 'aplay'
                        elif 'paplay' in cmd[1]:
                            audio_tool = 'paplay'
                        elif 'speaker-test' in cmd[1]:
                            audio_tool = 'speaker-test'
                        break
                except:
                    continue

            if audio_tool:
                if audio_tool == 'aplay':
                    # 生成一个简单的 beep 音效
                    try:
                        subprocess.run([
                            'sh', '-c',
                            'play -nq -t alsa synth 0.1 sine 440 2>/dev/null || '
                            'beep -f 440 -l 100 2>/dev/null || '
                            'echo -e "\\a"'
                        ], timeout=3, capture_output=True)
                        print(f"[DEBUG] Linux音效播放成功: {preset_name}", file=sys.stderr)
                        return True
                    except:
                        pass

                elif audio_tool == 'paplay':
                    # 使用 paplay 播放系统提示音
                    try:
                        # 尝试播放系统声音文件
                        system_sounds = [
                            '/usr/share/sounds/alsa/Front_Left.wav',
                            '/usr/share/sounds/freedesktop/stereo/complete.oga',
                            '/usr/share/sounds/freedesktop/stereo/bell.oga'
                        ]

                        for sound_file in system_sounds:
                            if Path(sound_file).exists():
                                subprocess.run(['paplay', sound_file], timeout=3, capture_output=True)
                                print(f"[DEBUG] Linux paplay音效播放成功: {preset_name}", file=sys.stderr)
                                return True
                    except:
                        pass

                elif audio_tool == 'speaker-test':
                    # 使用 speaker-test 生成测试音效
                    try:
                        subprocess.run([
                            'speaker-test', '-t', 'sine', '-f', '440', '-l', '1'
                        ], timeout=3, capture_output=True,
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                        print(f"[DEBUG] Linux speaker-test音效播放成功: {preset_name}", file=sys.stderr)
                        return True
                    except:
                        pass

            # 最后备用方案：终端提示音
            print('\a', end='', flush=True)
            print(f"[DEBUG] Linux终端提示音: {preset_name}", file=sys.stderr)
            return True

        except Exception as e:
            print(f"[DEBUG] Linux音效播放异常: {e}", file=sys.stderr)
            return False

    def play_audio(self, preset_name: str, description: str, silent: bool = False) -> bool:
        """
        播放音效

        Args:
            preset_name: 音效预设名称
            description: 音效描述
            silent: 是否静音模式

        Returns:
            bool: 播放是否成功
        """
        if silent:
            print(f"[DEBUG] 静音模式，跳过音效播放: {preset_name}", file=sys.stderr)
            return True

        print(f"[DEBUG] 尝试播放音效: {preset_name} - {description}", file=sys.stderr)

        try:
            if self.is_wsl:
                return self._play_wsl_audio(preset_name, description)
            else:
                return self._play_linux_audio(preset_name, description)
        except Exception as e:
            print(f"[DEBUG] 音效播放异常: {e}", file=sys.stderr)
            # 最后备用方案
            print('\a', end='', flush=True)
            return True

    def get_system_info(self) -> dict:
        """获取系统音频信息"""
        return {
            "system": self.system,
            "is_wsl": self.is_wsl,
            "has_powershell": bool(self._get_windows_executable()),
            "available_tools": self._check_audio_tools()
        }

    def _check_audio_tools(self) -> list:
        """检查可用的音频工具"""
        tools = []

        if self.is_wsl and self._get_windows_executable():
            tools.append("powershell")

        try:
            # 检查 Linux 音频工具
            result = subprocess.run(['which', 'aplay'], capture_output=True, timeout=2)
            if result.returncode == 0:
                tools.append("aplay")
        except:
            pass

        try:
            result = subprocess.run(['which', 'paplay'], capture_output=True, timeout=2)
            if result.returncode == 0:
                tools.append("paplay")
        except:
            pass

        try:
            result = subprocess.run(['which', 'speaker-test'], capture_output=True, timeout=2)
            if result.returncode == 0:
                tools.append("speaker-test")
        except:
            pass

        return tools

def main():
    """音效播放器主函数"""
    if len(sys.argv) < 2:
        print("用法: wsl-audio.py <preset_name> [description] [--silent]", file=sys.stderr)
        sys.exit(1)

    preset_name = sys.argv[1]
    description = sys.argv[2] if len(sys.argv) > 2 else preset_name
    silent = "--silent" in sys.argv

    player = WSLAudioPlayer()

    # 输出系统信息（调试用）
    system_info = player.get_system_info()
    print(f"[DEBUG] 系统信息: {system_info}", file=sys.stderr)

    success = player.play_audio(preset_name, description, silent)

    if success:
        print(f"[DEBUG] ✅ 音效播放成功: {preset_name}", file=sys.stderr)
        sys.exit(0)
    else:
        print(f"[DEBUG] ❌ 音效播放失败: {preset_name}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()