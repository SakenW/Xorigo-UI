#!/usr/bin/env python3
"""
Xorigo 组件迁移技能
用于自动迁移和整合工作台组件
"""

import sys
import os
import json
import argparse
from pathlib import Path

# 添加 scripts 目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "scripts"))

from xorigo_component_migrator import XorigoComponentMigrator

class XorigoComponentMigratorSkill:
    """Xorigo 组件迁移技能"""

    def __init__(self):
        self.workspace_root = os.environ.get('WORKSPACE_ROOT', '/home/saken/project/Xorigo-UI')
        self.migrator = XorigoComponentMigrator(self.workspace_root)

    def run(self, **kwargs) -> dict:
        """执行迁移"""
        try:
            # 执行迁移
            success = self.migrator.run()

            # 返回结果
            return {
                "success": success,
                "stats": self.migrator.stats,
                "backup_dir": str(self.migrator.backup_dir),
                "message": "组件迁移完成" if success else "组件迁移有错误"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"迁移过程中发生错误: {e}"
            }

    def analyze_only(self) -> dict:
        """仅分析，不执行迁移"""
        try:
            # 扫描组件
            components = self.migrator.scan_components()

            # 识别迁移目标
            targets = self.migrator.identify_migration_targets(components)

            return {
                "success": True,
                "total_components": self.migrator.stats['total_components'],
                "targets": targets,
                "message": "组件分析完成"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"分析过程中发生错误: {e}"
            }

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='Xorigo 组件迁移工具')
    parser.add_argument('--mode', choices=['full', 'analyze'], default='full',
                        help='运行模式: full=完整迁移, analyze=仅分析')
    parser.add_argument('--output', type=str, help='输出文件路径 (JSON格式)')

    args = parser.parse_args()

    skill = XorigoComponentMigratorSkill()

    if args.mode == 'analyze':
        result = skill.analyze_only()
    else:
        result = skill.run()

    # 输出结果
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
    else:
        print(json.dumps(result, indent=2, ensure_ascii=False))

    return 0 if result.get('success') else 1

if __name__ == "__main__":
    sys.exit(main())
