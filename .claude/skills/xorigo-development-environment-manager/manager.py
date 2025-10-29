#!/usr/bin/env python3
"""
Xorigo UI 开发环境管理器 - 核心实现
基于本地 + Docker 混合开发模式的智能环境管理器
"""

import subprocess
import time
import json
import os
import signal
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class DevelopmentMode(Enum):
    LOCAL = "local"
    DOCKER_HYBRID = "docker_hybrid"
    DOCKER_FULL = "docker_full"

class ServiceType(Enum):
    CORE = "core"
    WEBSITE = "website"
    REDIS = "redis"

@dataclass
class PortInfo:
    number: int
    service: ServiceType
    technology: str
    status: str
    process_id: Optional[int] = None

@dataclass
class EnvironmentStatus:
    mode: DevelopmentMode
    services: Dict[ServiceType, PortInfo]
    health_score: float
    recommendations: List[str]

class DevelopmentEnvironmentManager:
    """Xorigo UI 开发环境管理器"""

    def __init__(self, project_root: str = "/home/saken/project/Xorigo-UI"):
        self.project_root = project_root
        self.ports = {
            3000: {"reserved": True, "purpose": "用户其他库"},
            3001: {"service": ServiceType.CORE, "tech": "Vite"},
            3100: {"service": ServiceType.WEBSITE, "tech": "Next.js"},
            6380: {"service": ServiceType.REDIS, "tech": "Redis", "optional": True}
        }
        self.processes = {}

    def scan_environment(self) -> EnvironmentStatus:
        """扫描当前开发环境状态"""
        print("🔍 正在扫描开发环境...")

        # 扫描端口占用
        port_status = self._scan_ports()

        # 扫描进程状态
        process_status = self._scan_processes()

        # 计算健康分数
        health_score = self._calculate_health_score(port_status, process_status)

        # 生成建议
        recommendations = self._generate_recommendations(port_status, process_status)

        return EnvironmentStatus(
            mode=self._detect_current_mode(),
            services=port_status,
            health_score=health_score,
            recommendations=recommendations
        )

    def _scan_ports(self) -> Dict[ServiceType, PortInfo]:
        """扫描端口状态"""
        services = {}

        for port, config in self.ports.items():
            if port == 3000:  # 跳过保留端口
                continue

            service_type = config.get("service")
            if not service_type:
                continue

            is_occupied = self._is_port_occupied(port)
            process_id = self._get_process_on_port(port) if is_occupied else None

            services[service_type] = PortInfo(
                number=port,
                service=service_type,
                technology=config["tech"],
                status="occupied" if is_occupied else "free",
                process_id=process_id
            )

        return services

    def _is_port_occupied(self, port: int) -> bool:
        """检查端口是否被占用"""
        try:
            result = subprocess.run(
                ["lsof", f"-i:{port}"],
                capture_output=True,
                text=True
            )
            return result.returncode == 0
        except:
            return False

    def _get_process_on_port(self, port: int) -> Optional[int]:
        """获取占用端口的进程ID"""
        try:
            result = subprocess.run(
                ["lsof", "-t", f"-i:{port}"],
                capture_output=True,
                text=True
            )
            if result.returncode == 0 and result.stdout.strip():
                return int(result.stdout.strip())
        except:
            pass
        return None

    def _scan_processes(self) -> Dict[str, List[int]]:
        """扫描相关进程"""
        processes = {
            "vite": [],
            "next": [],
            "node": []
        }

        # 使用 ps 命令扫描进程
        try:
            result = subprocess.run(
                ["ps", "aux"],
                capture_output=True,
                text=True
            )

            for line in result.stdout.split('\n'):
                if 'vite' in line:
                    parts = line.split()
                    if len(parts) > 1:
                        try:
                            processes["vite"].append(int(parts[1]))
                        except:
                            continue
                elif 'next' in line and 'dev' in line:
                    parts = line.split()
                    if len(parts) > 1:
                        try:
                            processes["next"].append(int(parts[1]))
                        except:
                            continue
                elif 'node' in line and any(port in line for port in ['3001', '3100']):
                    parts = line.split()
                    if len(parts) > 1:
                        try:
                            processes["node"].append(int(parts[1]))
                        except:
                            continue
        except:
            pass

        return processes

    def _detect_current_mode(self) -> DevelopmentMode:
        """检测当前开发模式"""
        # 检查是否有 Docker 容器运行
        docker_running = self._check_docker_containers()

        # 检查本地进程
        local_core = self._is_port_occupied(3001)
        local_website = self._is_port_occupied(3100)

        if docker_running and not (local_core or local_website):
            return DevelopmentMode.DOCKER_FULL
        elif docker_running and (local_core or local_website):
            return DevelopmentMode.DOCKER_HYBRID
        else:
            return DevelopmentMode.LOCAL

    def _check_docker_containers(self) -> bool:
        """检查 Docker 容器状态"""
        try:
            result = subprocess.run(
                ["docker", "ps", "--filter", "name=xorigo"],
                capture_output=True,
                text=True
            )
            return len(result.stdout.strip().split('\n')) > 1  # More than header line
        except:
            return False

    def _calculate_health_score(self, port_status: Dict, process_status: Dict) -> float:
        """计算环境健康分数"""
        score = 100.0

        # 端口冲突检测
        if port_status.get(ServiceType.CORE, PortInfo(0, ServiceType.CORE, "", "")).status == "free":
            score -= 30
        if port_status.get(ServiceType.WEBSITE, PortInfo(0, ServiceType.WEBSITE, "", "")).status == "free":
            score -= 40

        # 进程健康检测
        if not process_status.get("vite"):
            score -= 20
        if not process_status.get("next"):
            score -= 30

        return max(0.0, score)

    def _generate_recommendations(self, port_status: Dict, process_status: Dict) -> List[str]:
        """生成环境优化建议"""
        recommendations = []

        # 检查核心服务
        core_status = port_status.get(ServiceType.CORE)
        if not core_status or core_status.status == "free":
            recommendations.append("启动核心库开发服务器: pnpm dev:core")

        # 检查 Website 服务
        website_status = port_status.get(ServiceType.WEBSITE)
        if not website_status or website_status.status == "free":
            recommendations.append("启动 Website 开发服务器: pnpm dev:website")

        # 检查端口冲突
        if port_status.get(ServiceType.CORE, PortInfo(0, ServiceType.CORE, "", "")).process_id:
            recommendations.append("端口 3001 被占用，检查是否有冲突进程")

        if port_status.get(ServiceType.WEBSITE, PortInfo(0, ServiceType.WEBSITE, "", "")).process_id:
            recommendations.append("端口 3100 被占用，检查是否有冲突进程")

        # 推荐混合启动
        if not any(core_status and core_status.status == "occupied" for core_status in [port_status.get(ServiceType.CORE)]):
            recommendations.append("推荐使用混合启动: pnpm local:dev")

        return recommendations

    def start_local_development(self) -> bool:
        """启动本地开发环境"""
        print("🚀 正在启动本地开发环境...")

        try:
            # 检查端口占用
            if self._is_port_occupied(3001):
                print("⚠️ 端口 3001 已被占用，尝试清理...")
                self._cleanup_port(3001)

            if self._is_port_occupied(3100):
                print("⚠️ 端口 3100 已被占用，尝试清理...")
                self._cleanup_port(3100)

            # 启动核心库服务器
            print("启动核心库开发服务器 (端口 3001)...")
            core_process = subprocess.Popen(
                ["pnpm", "dev:core"],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.processes["core"] = core_process

            # 等待核心库启动
            time.sleep(3)

            # 启动 Website 服务器
            print("启动 Website 开发服务器 (端口 3100)...")
            website_process = subprocess.Popen(
                ["pnpm", "dev:website"],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.processes["website"] = website_process

            print("✅ 本地开发环境启动完成!")
            print("   - 核心库: http://localhost:3001")
            print("   - Website: http://localhost:3100")

            return True

        except Exception as e:
            print(f"❌ 启动失败: {e}")
            return False

    def _cleanup_port(self, port: int):
        """清理指定端口的进程"""
        try:
            process_id = self._get_process_on_port(port)
            if process_id:
                os.kill(process_id, signal.SIGTERM)
                time.sleep(1)
                if self._is_port_occupied(port):
                    os.kill(process_id, signal.SIGKILL)
                print(f"✅ 已清理端口 {port} 上的进程")
        except:
            pass

    def stop_all_services(self):
        """停止所有管理的服务"""
        print("🛑 正在停止所有服务...")

        for service, process in self.processes.items():
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"✅ 已停止 {service} 服务")
            except subprocess.TimeoutExpired:
                process.kill()
                print(f"🔥 强制停止 {service} 服务")
            except:
                print(f"⚠️ 无法停止 {service} 服务")

        self.processes.clear()
        print("✅ 所有服务已停止")

def main():
    """主函数"""
    manager = DevelopmentEnvironmentManager()

    # 扫描环境
    status = manager.scan_environment()

    print(f"\n📊 开发环境状态报告")
    print(f"模式: {status.mode.value}")
    print(f"健康分数: {status.health_score}/100")

    print(f"\n🔌 服务状态:")
    for service, port_info in status.services.items():
        status_icon = "🟢" if port_info.status == "occupied" else "🔴"
        print(f"  {status_icon} {service.value}: {port_info.technology} (端口 {port_info.number})")

    if status.recommendations:
        print(f"\n💡 建议:")
        for rec in status.recommendations:
            print(f"  • {rec}")

if __name__ == "__main__":
    main()