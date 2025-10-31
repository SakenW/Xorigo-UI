#!/usr/bin/env python3
"""
测试智能组件生成器功能
"""

import sys
import os
sys.path.append('/home/saken/project/Xorigo-UI/.claude/skills/xorigo-component-generator')

def test_smart_generator():
    """测试智能生成器基本功能"""
    print("🧪 测试 Xorigo UI 智能组件生成器 v1.5.2")

    # 导入生成器
    from smart_generator_fixed import SmartComponentGenerator

    # 创建生成器实例
    generator = SmartComponentGenerator()

    # 测试用例
    test_cases = [
        ("TestTable", "data-display"),
        ("ModalDialog", "overlays"),
        ("ColorPicker", "primitives"),
        ("InputField", "form"),
        ("LoadingSpinner", "feedback"),
        ("MenuDropdown", "navigation"),
        ("BrandLogo", "branding")
    ]

    print("\n📊 智能推断测试结果:")
    for component_name, expected_category in test_cases:
        try:
            category, confidence = generator.infer_component_category(component_name)
            name_pascal, name_kebab, name_camel = generator.normalize_component_name(component_name)

            # 检查结果
            is_correct = category == expected_category
            status = "✅" if is_correct else "❌"

            print(f"{status} {component_name}: {category} (置信度: {confidence:.2f}, 预期: {expected_category})")

            if is_correct:
                print(f"   📁 路径: packages/core/src/{category}/{name_pascal}/")
                print(f"   📝 文件: {name_pascal}.tsx")
                print(f"   📦 导入: import {{ {name_pascal} }} from '@xorigo-ui/core/{category}'")

        except Exception as e:
            print(f"❌ {component_name}: 测试失败 - {e}")

    print(f"\n✅ 智能生成器 v1.5.2 测试完成！")

if __name__ == "__main__":
    test_smart_generator()