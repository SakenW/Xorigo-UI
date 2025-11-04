import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ListItem } from './list-item'

describe('ListItem', () => {
  it('renders with basic props', () => {
    render(<ListItem title="Test Item" />)
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<ListItem title="Test Item" description="Test Description" />)
    expect(screen.getByText('Test Item')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders with avatar', () => {
    const avatar = <div data-testid="avatar">Avatar</div>
    render(<ListItem title="Test Item" avatar={avatar} />)
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    const icon = <div data-testid="icon">Icon</div>
    render(<ListItem title="Test Item" icon={icon} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders with badge', () => {
    render(<ListItem title="Test Item" badge="5" />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<ListItem title="Test Item" onClick={handleClick} />)

    fireEvent.click(screen.getByText('Test Item'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles double click events', () => {
    const handleDoubleClick = vi.fn()
    render(<ListItem title="Test Item" onDoubleClick={handleDoubleClick} />)

    fireEvent.doubleClick(screen.getByText('Test Item'))
    expect(handleDoubleClick).toHaveBeenCalledTimes(1)
  })

  it('handles selection', () => {
    const handleSelectionChange = vi.fn()
    render(
      <ListItem
        title="Test Item"
        selectable
        onSelectionChange={handleSelectionChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(handleSelectionChange).toHaveBeenCalledWith(true)

    fireEvent.click(checkbox)
    expect(handleSelectionChange).toHaveBeenCalledWith(false)
  })

  it('applies disabled state', () => {
    render(<ListItem title="Test Item" disabled />)
    const item = screen.getByText('Test Item').closest('div')
    expect(item).toHaveClass('opacity-50', 'cursor-not-allowed', 'pointer-events-none')
  })

  it('applies selected state', () => {
    render(<ListItem title="Test Item" selected />)
    const item = screen.getByText('Test Item').closest('div')
    expect(item).toHaveClass('bg-accent', 'text-accent-foreground')
  })

  it('applies density variants', () => {
    const { rerender } = render(<ListItem title="Test Item" density="compact" />)
    let item = screen.getByText('Test Item').closest('div')
    expect(item).toHaveClass('px-3', 'py-2', 'text-sm')

    rerender(<ListItem title="Test Item" density="spacious" />)
    item = screen.getByText('Test Item').closest('div')
    expect(item).toHaveClass('px-6', 'py-4', 'text-base')
  })

  it('applies interactive variants', () => {
    const { rerender } = render(<ListItem title="Test Item" interactive="hoverable" />)
    let item = screen.getByText('Test Item').closest('div')
    expect(item).toHaveClass('cursor-pointer', 'hover:bg-accent/50', 'rounded-md')

    rerender(<ListItem title="Test Item" interactive="clickable" />)
    item = screen.getByText('Test Item').closest('div')
    expect(item).toHaveClass('cursor-pointer', 'active:bg-accent/80', 'rounded-md')
  })

  it('renders multiline content', () => {
    render(
      <ListItem
        title="Test Item"
        description="Test Description"
        multiline
      >
        Additional content
      </ListItem>
    )
    expect(screen.getByText('Additional content')).toBeInTheDocument()
  })

  it('handles drag and drop', () => {
    const handleDragStart = vi.fn()
    render(<ListItem title="Test Item" draggable onDragStart={handleDragStart} />)

    const item = screen.getByText('Test Item').closest('div')
    fireEvent.dragStart(item!)
    expect(handleDragStart).toHaveBeenCalled()
  })

  it('renders caption', () => {
    render(<ListItem title="Test Item" caption="Caption text" />)
    expect(screen.getByText('Caption text')).toBeInTheDocument()
  })

  it('renders actions', () => {
    const actions = <button data-testid="action">Action</button>
    render(<ListItem title="Test Item" actions={actions} />)
    expect(screen.getByTestId('action')).toBeInTheDocument()
  })

  it('renders with indicator', () => {
    const indicator = <div data-testid="indicator" />
    render(<ListItem title="Test Item" indicator={indicator} />)
    expect(screen.getByTestId('indicator')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<ListItem title="Test Item" className="custom-class" />)
    const item = screen.getByText('Test Item').closest('div')
    expect(item).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<ListItem title="Test Item" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })

  it('renders hover content on hover', () => {
    const hoverContent = <div data-testid="hover-content">Hover Content</div>
    render(
      <ListItem
        title="Test Item"
        hoverContent={hoverContent}
        showHoverContent
      />
    )

    const item = screen.getByText('Test Item').closest('div')
    fireEvent.mouseEnter(item!)
    expect(screen.getByTestId('hover-content')).toBeInTheDocument()
  })

  it('stops propagation when clicking checkbox', () => {
    const handleClick = vi.fn()
    const handleSelectionChange = vi.fn()

    render(
      <ListItem
        title="Test Item"
        onClick={handleClick}
        selectable
        onSelectionChange={handleSelectionChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleSelectionChange).toHaveBeenCalled()
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies badge variants', () => {
    const { rerender } = render(
      <ListItem title="Test Item" badge="5" badgeVariant="destructive" />
    )
    let badge = screen.getByText('5')
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')

    rerender(
      <ListItem title="Test Item" badge="5" badgeVariant="success" />
    )
    badge = screen.getByText('5')
    expect(badge).toHaveClass('bg-green-500', 'text-white')
  })

  it('does not trigger events when disabled', () => {
    const handleClick = vi.fn()
    const handleDoubleClick = vi.fn()

    render(
      <ListItem
        title="Test Item"
        disabled
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />
    )

    const item = screen.getByText('Test Item').closest('div')
    fireEvent.click(item!)
    fireEvent.doubleClick(item!)

    expect(handleClick).not.toHaveBeenCalled()
    expect(handleDoubleClick).not.toHaveBeenCalled()
  })
})
