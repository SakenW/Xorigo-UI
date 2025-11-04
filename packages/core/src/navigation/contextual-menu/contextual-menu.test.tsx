/**
 * ContextualMenu Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContextualMenu } from './contextual-menu'

const items = [
  { id: '1', label: 'Copy', icon: <span>📋</span> },
  { id: '2', label: 'Paste', icon: <span>📌</span> }
]

describe('ContextualMenu', () => {
  it('renders when visible', () => {
    render(
      <ContextualMenu
        items={items}
        position={{ x: 100, y: 100 }}
        visible={true}
        onHide={() => {}}
      />
    )
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })
})
