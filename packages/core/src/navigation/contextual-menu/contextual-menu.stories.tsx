/**
 * ContextualMenu Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ContextualMenu } from './contextual-menu'

const meta: Meta<typeof ContextualMenu> = {
  title: 'Navigation/ContextualMenu',
  component: ContextualMenu
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [visible, setVisible] = React.useState(false)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault()
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }

    return (
      <div
        onContextMenu={handleContextMenu}
        className="h-64 flex items-center justify-center border-2 border-dashed"
      >
        右键点击我
        <ContextualMenu
          items={[
            { id: '1', label: 'Copy', icon: <span>📋</span> },
            { id: '2', label: 'Paste', icon: <span>📌</span> }
          ]}
          position={position}
          visible={visible}
          onHide={() => setVisible(false)}
        />
      </div>
    )
  }
}
