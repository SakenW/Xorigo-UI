#!/usr/bin/env python3
"""
Xorigo UI 工作流 Agent 验证脚本
验证技能是否符合 Claude Code 技能标准
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Any

class SkillValidator:
    """技能验证器"""

    def __init__(self, skill_path: str):
        self.skill_path = Path(skill_path)
        self.errors = []
        self.warnings = []

    def validate(self) -> Dict[str, Any]:
        """执行完整验证"""
        print(f"🔍 验证技能: {self.skill_path}")

        validation_results = {
            "skill_path": str(self.skill_path),
            "validation_timestamp": Path().cwd(),
            "errors": [],
            "warnings": [],
            "status": "valid"
        }

        # 验证必需文件
        self._validate_required_files()

        # 验证 SKILL.md 格式
        self._validate_skill_md()

        # 验证脚本
        self._validate_scripts()

        # 验证整体结构
        self._validate_structure()

        validation_results["errors"] = self.errors
        validation_results["warnings"] = self.warnings

        if self.errors:
            validation_results["status"] = "invalid"
        elif self.warnings:
            validation_results["status"] = "valid_with_warnings"

        return validation_results

    def _validate_required_files(self):
        """验证必需文件"""
        required_files = ["SKILL.md"]
        for file_name in required_files:
            file_path = self.skill_path / file_name
            if not file_path.exists():
                self.errors.append(f"缺少必需文件: {file_name}")

    def _validate_skill_md(self):
        """验证 SKILL.md 文件"""
        skill_md_path = self.skill_path / "SKILL.md"
        if not skill_md_path.exists():
            return

        try:
            with open(skill_md_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 检查 YAML frontmatter
            if not content.startswith('---'):
                self.errors.append("SKILL.md 必须以 YAML frontmatter 开始")
            else:
                # 提取 frontmatter
                frontmatter_end = content.find('---', 3)
                if frontmatter_end == -1:
                    self.errors.append("YAML frontmatter 格式错误")
                else:
                    frontmatter = content[3:frontmatter_end]
                    try:
                        import yaml
                        metadata = yaml.safe_load(frontmatter)
                        self._validate_metadata(metadata)
                    except ImportError:
                        self.warnings.append("无法验证 YAML frontmatter (缺少 PyYAML)")
                    except Exception as e:
                        self.errors.append(f"YAML frontmatter 解析错误: {e}")

            # 检查内容结构
            if "## 何时使用此技能" not in content:
                self.warnings.append("建议添加 '## 何时使用此技能' 章节")
            if "## 工作流程" not in content:
                self.warnings.append("建议添加 '## 工作流程' 章节")

        except Exception as e:
            self.errors.append(f"读取 SKILL.md 失败: {e}")

    def _validate_metadata(self, metadata: Dict[str, Any]):
        """验证元数据"""
        required_fields = ["name", "description"]
        for field in required_fields:
            if field not in metadata:
                self.errors.append(f"YAML frontmatter 缺少必需字段: {field}")

        if "name" in metadata:
            name = metadata["name"]
            if not isinstance(name, str) or len(name.strip()) == 0:
                self.errors.append("name 字段必须是非空字符串")
            if not name.replace("-", "").replace("_", "").isalnum():
                self.warnings.append("name 字段建议使用字母、数字、连字符和下划线")

        if "description" in metadata:
            description = metadata["description"]
            if not isinstance(description, str) or len(description.strip()) == 0:
                self.errors.append("description 字段必须是非空字符串")
            if len(description) < 10:
                self.warnings.append("description 字段建议至少10个字符")

    def _validate_scripts(self):
        """验证脚本文件"""
        scripts_dir = self.skill_path / "scripts"
        if scripts_dir.exists():
            for script_file in scripts_dir.glob("*.py"):
                if not script_file.stat().st_mode & 0o111:
                    self.warnings.append(f"Python 脚本建议设置可执行权限: {script_file.name}")

    def _validate_structure(self):
        """验证整体结构"""
        # 检查是否包含预期目录
        expected_dirs = ["scripts"]
        for dir_name in expected_dirs:
            dir_path = self.skill_path / dir_name
            if dir_path.exists() and not dir_path.is_dir():
                self.errors.append(f"{dir_name} 应该是目录而不是文件")

        # 检查文件命名规范
        for file_path in self.skill_path.rglob("*"):
            if file_path.is_file():
                if " " in file_path.name:
                    self.warnings.append(f"文件名不建议包含空格: {file_path.name}")

def main():
    """主函数"""
    if len(sys.argv) != 2:
        print("用法: python validate_skill.py <skill_path>")
        sys.exit(1)

    skill_path = sys.argv[1]
    validator = SkillValidator(skill_path)
    results = validator.validate()

    # 输出结果
    print(f"\n📊 验证结果: {results['status']}")

    if results["errors"]:
        print(f"\n❌ 错误 ({len(results['errors'])}):")
        for error in results["errors"]:
            print(f"  - {error}")

    if results["warnings"]:
        print(f"\n⚠️ 警告 ({len(results['warnings'])}):")
        for warning in results["warnings"]:
            print(f"  - {warning}")

    if results["status"] == "valid":
        print("\n✅ 技能验证通过！")
        sys.exit(0)
    elif results["status"] == "valid_with_warnings":
        print("\n✅ 技能验证通过（有警告）")
        sys.exit(0)
    else:
        print("\n❌ 技能验证失败")
        sys.exit(1)

if __name__ == "__main__":
    main()