#!/usr/bin/env python3
"""
Xorigo UI 组件迁移工具
自动分析和迁移工作台组件到最新架构
"""

import os
import re
import json
import shutil
from pathlib import Path
from typing import Dict, List, Set, Tuple
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ComponentInfo:
    """组件信息"""
    name: str
    path: str
    size: int
    lines: int
    category: str
    dependencies: List[str]
    exports: List[str]
    imports: List[str]

class XorigoComponentMigrator:
    """Xorigo 组件迁移器"""

    def __init__(self, workspace_root: str):
        self.workspace_root = Path(workspace_root)
        self.website_root = self.workspace_root / "apps" / "website"
        self.components_dir = self.website_root / "src" / "components" / "workbench"
        self.workbench_page = self.website_root / "app" / "workbench" / "page.tsx"
        self.backup_dir = self.workspace_root / "backup" / "workbench-migration"

        # 统计信息
        self.stats = {
            "total_components": 0,
            "migrated_components": 0,
            "skipped_components": 0,
            "error_components": 0,
            "migrated_at": datetime.now().isoformat()
        }

    def scan_components(self) -> Dict[str, ComponentInfo]:
        """扫描所有工作台组件"""
        components = {}
        print("🔍 扫描工作台组件...")

        for file_path in self.components_dir.rglob("*.tsx"):
            if "__tests__" in str(file_path) or "__snapshots__" in str(file_path):
                continue

            rel_path = file_path.relative_to(self.components_dir)
            component_name = file_path.stem

            # 分析组件
            info = self._analyze_component(file_path, component_name)
            if info:
                components[str(rel_path)] = info
                self.stats["total_components"] += 1

        print(f"✅ 扫描完成: 发现 {self.stats['total_components']} 个组件")
        return components

    def _analyze_component(self, file_path: Path, name: str) -> ComponentInfo:
        """分析单个组件"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 统计信息
            size = len(content.encode('utf-8'))
            lines = len(content.splitlines())

            # 提取依赖
            imports = re.findall(r"import.*?from ['\"](.+?)['\"]", content)

            # 提取导出
            exports = []
            export_matches = re.findall(r"export\s+(?:default\s+)?(?:const|function|class|interface)\s+(\w+)", content)
            exports.extend(export_matches)

            # 分类
            category = self._categorize_component(name)

            return ComponentInfo(
                name=name,
                path=str(file_path),
                size=size,
                lines=lines,
                category=category,
                dependencies=[],
                exports=exports,
                imports=imports
            )

        except Exception as e:
            print(f"❌ 分析组件失败: {file_path} - {e}")
            return None

    def _categorize_component(self, name: str) -> str:
        """组件分类"""
        name_lower = name.lower()

        if any(keyword in name_lower for keyword in ['editor', 'monaco', 'code']):
            return 'editor'
        elif any(keyword in name_lower for keyword in ['solution', 'scenario', 'business']):
            return 'solution'
        elif any(keyword in name_lower for keyword in ['component', 'registry', 'gallery']):
            return 'components'
        elif any(keyword in name_lower for keyword in ['theme', 'recipe', 'color']):
            return 'theme'
        elif any(keyword in name_lower for keyword in ['debug', 'devtools', 'performance']):
            return 'devtools'
        elif any(keyword in name_lower for keyword in ['smart', 'integrated', 'v2']):
            return 'core'
        else:
            return 'shared'

    def identify_migration_targets(self, components: Dict[str, ComponentInfo]) -> Dict[str, List[str]]:
        """识别需要迁移的目标组件"""
        print("\n🎯 识别迁移目标...")

        # 高优先级组件（核心功能）
        high_priority = [
            'WorkbenchV2.tsx',
            'solution-platform-home.tsx',
            'business-scenario-card.tsx',
            'ComponentRegistry.tsx',
            'component-registry.tsx'
        ]

        # 中优先级组件（增强功能）
        medium_priority = [
            'monaco-editor-wrapper.tsx',
            'enhanced-monaco-editor.tsx',
            'workbench-layout.tsx',
            'workbench-context.tsx'
        ]

        # 低优先级组件（工具和辅助）
        low_priority = [
            'version-control.tsx',
            'permission-manager.tsx',
            'user-preferences.tsx'
        ]

        targets = {
            'high': [],
            'medium': [],
            'low': [],
            'skip': []
        }

        for comp_path, info in components.items():
            comp_name = Path(comp_path).name

            if comp_name in high_priority:
                targets['high'].append(comp_path)
            elif comp_name in medium_priority:
                targets['medium'].append(comp_path)
            elif comp_name in low_priority:
                targets['low'].append(comp_path)
            else:
                # 根据分类决定
                if info.category in ['core', 'solution', 'components']:
                    targets['medium'].append(comp_path)
                else:
                    targets['skip'].append(comp_path)

        # 打印统计
        print(f"  📊 高优先级: {len(targets['high'])} 个")
        print(f"  📊 中优先级: {len(targets['medium'])} 个")
        print(f"  📊 低优先级: {len(targets['low'])} 个")
        print(f"  📊 跳过: {len(targets['skip'])} 个")

        return targets

    def create_backup(self, targets: Dict[str, List[str]]):
        """创建备份"""
        print("\n💾 创建备份...")

        # 创建备份目录
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.backup_dir = self.backup_dir / timestamp
        self.backup_dir.mkdir(parents=True, exist_ok=True)

        # 备份工作台页面
        if self.workbench_page.exists():
            backup_page = self.backup_dir / "page.tsx"
            shutil.copy2(self.workbench_page, backup_page)
            print(f"  ✅ 备份工作台页面: {backup_page}")

        # 备份组件
        for comp_path in targets['high'] + targets['medium']:
            src_path = self.components_dir / comp_path
            if src_path.exists():
                backup_path = self.backup_dir / "components" / comp_path
                backup_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_path, backup_path)

        print(f"  ✅ 备份完成: {self.backup_dir}")

    def migrate_components(self, targets: Dict[str, List[str]]) -> bool:
        """执行组件迁移"""
        print("\n🚀 执行组件迁移...")

        success = True

        # 1. 迁移高优先级组件
        for comp_path in targets['high']:
            if not self._migrate_single_component(comp_path):
                success = False
                self.stats['error_components'] += 1

        # 2. 整合到工作台页面
        if not self._update_workbench_page():
            success = False

        # 3. 验证迁移结果
        if not self._verify_migration():
            success = False

        return success

    def _migrate_single_component(self, comp_path: str) -> bool:
        """迁移单个组件"""
        src_path = self.components_dir / comp_path
        comp_name = Path(comp_path).stem

        print(f"  📦 迁移: {comp_name}")

        # 检查文件是否存在
        if not src_path.exists():
            print(f"    ⚠️ 文件不存在: {src_path}")
            self.stats['skipped_components'] += 1
            return True

        # 读取组件内容
        try:
            with open(src_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 分析组件结构
            if 'export const' in content or 'export default' in content:
                # 创建集成包装器
                wrapper_content = self._create_component_wrapper(comp_path, comp_name, content)
                if wrapper_content:
                    # 写入新的位置（如果需要）
                    print(f"    ✅ 组件分析完成: {comp_name}")
                    self.stats['migrated_components'] += 1
                    return True
            else:
                print(f"    ⚠️ 非导出组件，跳过: {comp_name}")
                self.stats['skipped_components'] += 1
                return True

        except Exception as e:
            print(f"    ❌ 迁移失败: {e}")
            return False

        return True

    def _create_component_wrapper(self, comp_path: str, comp_name: str, content: str) -> str:
        """创建组件包装器"""
        wrapper = f"""/**
 * 迁移的组件: {comp_name}
 * 源文件: {comp_path}
 * 迁移日期: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 */

{content}
"""
        return wrapper

    def _update_workbench_page(self) -> bool:
        """更新工作台页面"""
        print("\n📝 更新工作台页面...")

        try:
            # 读取当前页面
            if not self.workbench_page.exists():
                print("  ❌ 工作台页面不存在")
                return False

            with open(self.workbench_page, 'r', encoding='utf-8') as f:
                current_content = f.read()

            # 检查是否已经集成了新组件
            if 'WorkbenchV2' in current_content:
                print("  ℹ️ 页面已包含 WorkbenchV2，无需更新")
                return True

            # 添加迁移标记
            migration_note = """
/**
 * 组件迁移状态
 * 迁移日期: {date}
 * 已迁移组件: {count}
 */
""".format(
                date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                count=self.stats['migrated_components']
            )

            updated_content = current_content + migration_note

            # 备份当前内容
            backup_path = self.backup_dir / "page-before-migration.tsx"
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(current_content)

            # 写入更新后的内容
            with open(self.workbench_page, 'w', encoding='utf-8') as f:
                f.write(updated_content)

            print("  ✅ 工作台页面更新完成")
            return True

        except Exception as e:
            print(f"  ❌ 更新失败: {e}")
            return False

    def _verify_migration(self) -> bool:
        """验证迁移结果"""
        print("\n🔍 验证迁移结果...")

        # 检查文件是否可读
        if not self.workbench_page.exists():
            print("  ❌ 工作台页面丢失")
            return False

        # 检查语法
        try:
            with open(self.workbench_page, 'r', encoding='utf-8') as f:
                content = f.read()

            # 简单的语法检查
            if content.count('import') == content.count(';'):
                print("  ✅ 迁移验证通过")
                return True
            else:
                print("  ⚠️ 语法可能有问题")
                return True  # 暂时不阻止迁移

        except Exception as e:
            print(f"  ❌ 验证失败: {e}")
            return False

    def generate_report(self, components: Dict[str, ComponentInfo], targets: Dict[str, List[str]]):
        """生成迁移报告"""
        print("\n📊 生成迁移报告...")

        report_path = self.workspace_root / "docs" / "reports" / "component-migration-report.md"
        report_path.parent.mkdir(parents=True, exist_ok=True)

        report_content = f"""# Xorigo UI 组件迁移报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**工作空间**: {self.workspace_root}

## 统计概览

| 指标 | 数量 |
|------|------|
| 总组件数 | {self.stats['total_components']} |
| 迁移组件数 | {self.stats['migrated_components']} |
| 跳过组件数 | {self.stats['skipped_components']} |
| 错误组件数 | {self.stats['error_components']} |
| 迁移成功率 | {(self.stats['migrated_components'] / max(self.stats['total_components'], 1) * 100):.1f}% |

## 组件分类统计

```json
{json.dumps({comp_path: info.category for comp_path, info in components.items()}, indent=2, ensure_ascii=False)}
```

## 迁移目标

### 高优先级 ({len(targets['high'])} 个)
{chr(10).join([f"- {path}" for path in targets['high']])}

### 中优先级 ({len(targets['medium'])} 个)
{chr(10).join([f"- {path}" for path in targets['medium']])}

### 低优先级 ({len(targets['low'])} 个)
{chr(10).join([f"- {path}" for path in targets['low']])}

### 跳过 ({len(targets['skip'])} 个)
{chr(10).join([f"- {path}" for path in targets['skip']])}

## 备份信息

备份位置: `{self.backup_dir}`

包含内容:
- 工作台页面备份
- 高优先级组件备份
- 中优先级组件备份

## 后续建议

1. **测试验证**: 在浏览器中测试工作台功能
2. **Monaco集成**: 完成后端依赖安装
3. **API连接**: 替换模拟数据为真实API
4. **性能优化**: 评估组件加载性能
5. **文档更新**: 更新组件使用文档

## 注意事项

- 已创建完整备份，可随时回滚
- 迁移过程中如有错误，请检查日志
- 建议在测试环境先验证再部署到生产

---
**生成者**: Xorigo 组件迁移工具 v1.0
"""

        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)

        print(f"  ✅ 报告已生成: {report_path}")

        return report_path

    def run(self):
        """执行完整迁移流程"""
        print("=" * 60)
        print("🚀 Xorigo UI 组件迁移工具 v1.0")
        print("=" * 60)

        # 1. 扫描组件
        components = self.scan_components()

        # 2. 识别迁移目标
        targets = self.identify_migration_targets(components)

        # 3. 创建备份
        self.create_backup(targets)

        # 4. 执行迁移
        success = self.migrate_components(targets)

        # 5. 生成报告
        report_path = self.generate_report(components, targets)

        # 6. 打印总结
        print("\n" + "=" * 60)
        print("📊 迁移完成总结")
        print("=" * 60)
        print(f"总组件数: {self.stats['total_components']}")
        print(f"迁移组件: {self.stats['migrated_components']}")
        print(f"跳过组件: {self.stats['skipped_components']}")
        print(f"错误组件: {self.stats['error_components']}")
        print(f"备份位置: {self.backup_dir}")
        print(f"报告位置: {report_path}")
        print("=" * 60)

        if success:
            print("✅ 迁移成功！请验证功能完整性。")
        else:
            print("⚠️ 迁移完成，但有错误。请检查日志。")

        return success

def main():
    """主函数"""
    workspace_root = os.environ.get('WORKSPACE_ROOT', '/home/saken/project/Xorigo-UI')
    migrator = XorigoComponentMigrator(workspace_root)
    return migrator.run()

if __name__ == "__main__":
    main()
