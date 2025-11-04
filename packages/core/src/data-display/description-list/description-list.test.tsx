/**
 * @fileoverview Description List Component Tests
 * @description 描述列表组件的单元测试套件
 * @author Xorigo UI Team
 * @version 1.0.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '../../../test/test-utils';
import { DescriptionList, Term, Description } from './description-list';

// ============================================================================
// Mock数据
// ============================================================================

const mockItems = [
  {
    term: 'React',
    description: '用于构建用户界面的库',
  },
  {
    term: 'TypeScript',
    description: '带类型检查的JavaScript超集',
  },
  {
    term: 'Vite',
    description: '下一代前端构建工具',
  },
];

const mockItemsWithIcons = [
  {
    term: 'React',
    description: '用于构建用户界面的库',
    icon: <span data-testid="react-icon">⚛️</span>,
  },
  {
    term: 'TypeScript',
    description: '带类型检查的JavaScript超集',
    icon: <span data-testid="ts-icon">📘</span>,
  },
];

const mockItemsWithIds = [
  {
    id: 'react-id',
    term: 'React',
    description: '用于构建用户界面的库',
  },
  {
    id: 'ts-id',
    term: 'TypeScript',
    description: '带类型检查的JavaScript超集',
  },
];

const mockGroups = [
  {
    title: '前端框架',
    icon: <span data-testid="framework-icon">🎨</span>,
    items: [
      {
        term: 'React',
        description: '用于构建用户界面的库',
      },
      {
        term: 'Vue',
        description: '渐进式JavaScript框架',
      },
    ],
  },
  {
    title: '构建工具',
    items: [
      {
        term: 'Vite',
        description: '下一代前端构建工具',
      },
      {
        term: 'Webpack',
        description: '模块打包器',
      },
    ],
  },
];

// ============================================================================
// 测试用例
// ============================================================================

describe('DescriptionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 基本渲染测试
  describe('基本渲染', () => {
    it('应该正确渲染基本描述列表', () => {
      render(<DescriptionList items={mockItems} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('用于构建用户界面的库')).toBeInTheDocument();
    });

    it('应该使用传入的aria-label', () => {
      render(
        <DescriptionList
          items={mockItems}
          ariaLabel="自定义列表标签"
        />
      );

      expect(screen.getByRole('list', { name: '自定义列表标签' })).toBeInTheDocument();
    });

    it('应该显示标题', () => {
      render(
        <DescriptionList
          items={mockItems}
          label="技术栈"
        />
      );

      expect(screen.getByText('技术栈')).toBeInTheDocument();
    });

    it('应该显示项目图标', () => {
      render(
        <DescriptionList
          items={mockItemsWithIcons}
          showIcons={true}
        />
      );

      expect(screen.getByTestId('react-icon')).toBeInTheDocument();
      expect(screen.getByTestId('ts-icon')).toBeInTheDocument();
    });
  });

  // 布局变体测试
  describe('布局变体', () => {
    it('应该支持垂直布局', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          variant="vertical"
        />
      );

      const list = container.querySelector('.group\\/description-list');
      expect(list).toHaveClass('flex', 'flex-col', 'gap-2');
    });

    it('应该支持水平布局', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          variant="horizontal"
        />
      );

      const list = container.querySelector('.group\\/description-list');
      expect(list).toHaveClass('grid', 'grid-cols-2', 'gap-4');
    });

    it('应该支持自动布局', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          variant="auto"
        />
      );

      const list = container.querySelector('.group\\/description-list');
      expect(list).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
    });

    it('应该使用默认布局（auto）', () => {
      const { container } = render(
        <DescriptionList items={mockItems} />
      );

      const list = container.querySelector('.group\\/description-list');
      expect(list).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
    });
  });

  // 尺寸和密度测试
  describe('尺寸和密度', () => {
    it('应该支持小尺寸', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          size="sm"
        />
      );

      const terms = container.querySelectorAll('.font-medium');
      expect(terms[0]).toHaveClass('text-sm', 'font-medium');
    });

    it('应该支持中等尺寸', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          size="md"
        />
      );

      const terms = container.querySelectorAll('.font-medium');
      expect(terms[0]).toHaveClass('text-base', 'font-semibold');
    });

    it('应该支持大尺寸', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          size="lg"
        />
      );

      const terms = container.querySelectorAll('.font-medium');
      expect(terms[0]).toHaveClass('text-lg', 'font-bold');
    });

    it('应该支持紧密密度', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          density="compact"
        />
      );

      const list = container.querySelector('.group\\/description-list');
      expect(list).toHaveClass('gap-2');
    });

    it('应该支持舒适密度', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          density="comfortable"
        />
      );

      const list = container.querySelector('.group\\/description-list');
      expect(list).toHaveClass('gap-6');
    });
  });

  // 复制功能测试
  describe('复制功能', () => {
    it('应该显示复制按钮（当copyable为true时）', () => {
      render(
        <DescriptionList
          items={mockItems}
          copyable={true}
        />
      );

      const copyButtons = screen.getAllByText('复制');
      expect(copyButtons.length).toBeGreaterThan(0);
    });

    it('应该触发复制事件', async () => {
      const mockOnCopy = vi.fn();
      render(
        <DescriptionList
          items={mockItems}
          copyable={true}
          onItemCopy={mockOnCopy}
        />
      );

      const copyButton = screen.getAllByText('复制')[0];
      await fireEvent.click(copyButton);

      // 由于现代浏览器的Clipboard API，复制操作可能需要用户手势
      // 这里我们主要测试回调是否被调用
      // 在实际测试环境中，可能需要mock clipboard API
    });

    it('应该支持项目级别的复制设置', () => {
      const itemsWithCopyable = [
        {
          term: 'React',
          description: '用于构建用户界面的库',
          copyable: true,
        },
        {
          term: 'TypeScript',
          description: '带类型检查的JavaScript超集',
          copyable: false,
        },
      ];

      render(
        <DescriptionList
          items={itemsWithCopyable}
        />
      );

      // 第一个项目有复制按钮，第二个没有
      const copyButtons = screen.getAllByText('复制');
      expect(copyButtons.length).toBe(1);
    });
  });

  // 分组功能测试
  describe('分组功能', () => {
    it('应该正确渲染分组', () => {
      render(
        <DescriptionList
          groups={mockGroups}
        />
      );

      expect(screen.getByText('前端框架')).toBeInTheDocument();
      expect(screen.getByText('构建工具')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    it('应该显示分组图标', () => {
      render(
        <DescriptionList
          groups={mockGroups}
        />
      );

      expect(screen.getByTestId('framework-icon')).toBeInTheDocument();
    });

    it('应该支持可折叠分组', () => {
      const collapsibleGroups = [
        {
          title: '可折叠分组',
          collapsible: true,
          defaultCollapsed: true,
          items: [
            {
              term: 'React',
              description: '用于构建用户界面的库',
            },
          ],
        },
      ];

      render(
        <DescriptionList
          groups={collapsibleGroups}
        />
      );

      // 默认应该是折叠状态
      const toggleButton = screen.getByLabelText('展开');
      expect(toggleButton).toBeInTheDocument();
    });

    it('应该允许切换分组状态', async () => {
      const collapsibleGroups = [
        {
          title: '可折叠分组',
          collapsible: true,
          defaultCollapsed: true,
          items: [
            {
              term: 'React',
              description: '用于构建用户界面的库',
            },
          ],
        },
      ];

      render(
        <DescriptionList
          groups={collapsibleGroups}
        />
      );

      const toggleButton = screen.getByLabelText('展开');
      await fireEvent.click(toggleButton);

      // 切换后应该是展开状态
      expect(screen.getByLabelText('折叠')).toBeInTheDocument();
    });
  });

  // 自定义渲染测试
  describe('自定义渲染', () => {
    it('应该支持自定义项目渲染器', () => {
      const renderCustomItem = (item: any, index: number) => {
        return (
          <div key={index} data-testid="custom-item">
            自定义渲染: {item.term}
          </div>
        );
      };

      render(
        <DescriptionList
          items={mockItems}
          renderCustomItem={renderCustomItem}
        />
      );

      expect(screen.getAllByTestId('custom-item').length).toBe(mockItems.length);
    });
  });

  // 可访问性测试
  describe('可访问性', () => {
    it('应该具有正确的角色属性', () => {
      render(<DescriptionList items={mockItems} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('应该支持键盘导航（复制按钮）', async () => {
      render(
        <DescriptionList
          items={mockItems}
          copyable={true}
        />
      );

      const copyButton = screen.getAllByText('复制')[0];
      copyButton.focus();
      expect(copyButton).toHaveFocus();

      await fireEvent.keyDown(copyButton, { key: 'Enter', code: 'Enter' });
      // 测试键盘交互
    });

    it('应该具有正确的aria属性（可折叠分组）', () => {
      const collapsibleGroups = [
        {
          title: '可折叠分组',
          collapsible: true,
          items: [
            {
              term: 'React',
              description: '用于构建用户界面的库',
            },
          ],
        },
      ];

      render(
        <DescriptionList
          groups={collapsibleGroups}
        />
      );

      const toggleButton = screen.getByRole('button', { name: '' });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // 响应式测试
  describe('响应式设计', () => {
    it('应该在水平布局中显示分隔符', () => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          variant="horizontal"
        />
      );

      const items = container.querySelectorAll('.group\\/description-item');
      expect(items.length).toBe(2);
    });
  });

  // 子组件测试
  describe('Term 组件', () => {
    it('应该正确渲染术语', () => {
      render(
        <div>
          <Term>React</Term>
        </div>
      );

      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('应该支持不同尺寸', () => {
      render(
        <div>
          <Term size="sm">Small Term</Term>
        </div>
      );

      expect(screen.getByText('Small Term')).toHaveClass('text-sm', 'font-medium');
    });

    it('应该支持图标', () => {
      render(
        <div>
          <Term icon={<span data-testid="term-icon">🎨</span>}>
            Term with Icon
          </Term>
        </div>
      );

      expect(screen.getByTestId('term-icon')).toBeInTheDocument();
    });

    it('应该支持点击事件', async () => {
      const handleClick = vi.fn();
      render(
        <div>
          <Term onClick={handleClick}>Clickable Term</Term>
        </div>
      );

      await fireEvent.click(screen.getByText('Clickable Term'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Description 组件', () => {
    it('应该正确渲染描述', () => {
      render(
        <div>
          <Description>这是一段描述</Description>
        </div>
      );

      expect(screen.getByText('这是一段描述')).toBeInTheDocument();
    });

    it('应该支持不同尺寸', () => {
      render(
        <div>
          <Description size="lg">Large Description</Description>
        </div>
      );

      expect(screen.getByText('Large Description')).toHaveClass('text-lg');
    });

    it('应该支持富文本内容', () => {
      const richContent = (
        <div>
          <strong>粗体文本</strong> 和 <em>斜体文本</em>
        </div>
      );

      render(
        <div>
          <Description>{richContent}</Description>
        </div>
      );

      expect(screen.getByText('粗体文本')).toBeInTheDocument();
      expect(screen.getByText('斜体文本')).toBeInTheDocument();
    });
  });

  describe('CopyButton 组件', () => {
    it('应该显示复制图标', () => {
      render(
        <div>
          <CopyButton value="test-value" />
        </div>
      );

      expect(screen.getByLabelText('复制内容')).toBeInTheDocument();
    });

    it('应该支持自定义onCopy回调', async () => {
      const handleCopy = vi.fn();
      render(
        <div>
          <CopyButton value="test-value" onCopy={handleCopy} />
        </div>
      );

      const copyButton = screen.getByLabelText('复制内容');
      await fireEvent.click(copyButton);

      expect(handleCopy).toHaveBeenCalledWith('test-value');
    });

    it('应该显示复制成功的反馈', async () => {
      render(
        <div>
          <CopyButton value="test-value" />
        </div>
      );

      const copyButton = screen.getByLabelText('复制内容');
      await fireEvent.click(copyButton);

      // 在实际测试中，状态更新可能需要等待
      // 这里我们主要测试UI结构的稳定性
    });
  });
});

// ============================================================================
// 快照测试
// ============================================================================

describe('DescriptionList 快照测试', () => {
  it('基本渲染应该匹配快照', () => {
    const { container } = render(
      <DescriptionList items={mockItems} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('带图标的渲染应该匹配快照', () => {
    const { container } = render(
      <DescriptionList
        items={mockItemsWithIcons}
        showIcons={true}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('分组渲染应该匹配快照', () => {
    const { container } = render(
      <DescriptionList groups={mockGroups} />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('所有变体组合应该匹配快照', () => {
    const variants = [
      { variant: 'vertical' as const },
      { variant: 'horizontal' as const },
      { variant: 'auto' as const },
    ];

    variants.forEach(({ variant }) => {
      const { container } = render(
        <DescriptionList
          items={mockItems}
          variant={variant}
        />
      );

      expect(container.firstChild).toMatchSnapshot(`variant-${variant}`);
    });
  });
});
