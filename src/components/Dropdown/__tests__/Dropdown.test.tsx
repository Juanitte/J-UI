import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Dropdown } from '../Dropdown'
import type { DropdownMenuConfig } from '../Dropdown'

const menu: DropdownMenuConfig = {
  items: [
    { key: '1', label: 'Option 1' },
    { key: '2', label: 'Option 2' },
    { key: '3', label: 'Option 3' },
  ],
}

// Helper: open the dropdown by hovering (default trigger)
async function openByHover(trigger: HTMLElement, waitForText = 'Option 1') {
  fireEvent.mouseEnter(trigger)
  await waitFor(() => {
    expect(screen.getByText(waitForText)).toBeInTheDocument()
  })
}

describe('Dropdown', () => {
  // ---------- Basic rendering ----------

  it('renders trigger children', () => {
    render(
      <Dropdown menu={menu}>
        <button>Open</button>
      </Dropdown>
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('does not show menu initially', () => {
    render(
      <Dropdown menu={menu}>
        <button>Open</button>
      </Dropdown>
    )
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('renders as inline-flex wrapper', () => {
    const { container } = render(
      <Dropdown menu={menu}>
        <button>Open</button>
      </Dropdown>
    )
    expect(container.firstChild).toHaveClass('ino-dropdown')
  })

  // ---------- Hover trigger (default) ----------

  it('shows menu on mouseEnter', async () => {
    const { container } = render(
      <Dropdown menu={menu}>
        <button>Open</button>
      </Dropdown>
    )
    fireEvent.mouseEnter(container.firstChild as HTMLElement)

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })
  })

  it('hides menu on mouseLeave', async () => {
    const { container } = render(
      <Dropdown menu={menu}>
        <button>Open</button>
      </Dropdown>
    )
    const root = container.firstChild as HTMLElement
    await openByHover(root)

    fireEvent.mouseLeave(root)

    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    })
  })

  // ---------- Click trigger ----------

  it('toggles menu on click when trigger=["click"]', async () => {
    render(
      <Dropdown menu={menu} trigger={['click']}>
        <button>Click me</button>
      </Dropdown>
    )

    fireEvent.click(screen.getByText('Click me'))

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })

  // ---------- Context menu trigger ----------

  it('opens menu on right-click when trigger=["contextMenu"]', async () => {
    const { container } = render(
      <Dropdown menu={menu} trigger={['contextMenu']}>
        <span>Right click</span>
      </Dropdown>
    )

    fireEvent.contextMenu(container.firstChild as HTMLElement)

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })

  // ---------- Menu items ----------

  it('renders item icons', async () => {
    const iconMenu: DropdownMenuConfig = {
      items: [
        { key: '1', label: 'With Icon', icon: <span data-testid="item-icon">★</span> },
      ],
    }
    const { container } = render(
      <Dropdown menu={iconMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'With Icon')

    expect(screen.getByTestId('item-icon')).toBeInTheDocument()
  })

  it('calls item onClick and global menu onClick when item is clicked', async () => {
    const itemClick = vi.fn()
    const globalClick = vi.fn()
    const clickMenu: DropdownMenuConfig = {
      items: [{ key: 'a', label: 'Action', onClick: itemClick }],
      onClick: globalClick,
    }
    const { container } = render(
      <Dropdown menu={clickMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Action')

    fireEvent.click(screen.getByText('Action'))

    expect(itemClick).toHaveBeenCalledTimes(1)
    expect(itemClick).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'a' })
    )
    expect(globalClick).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'a' })
    )
  })

  it('does not call onClick for disabled items', async () => {
    const handleClick = vi.fn()
    const disabledMenu: DropdownMenuConfig = {
      items: [{ key: '1', label: 'Disabled', disabled: true, onClick: handleClick }],
    }
    const { container } = render(
      <Dropdown menu={disabledMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Disabled')

    fireEvent.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders disabled items with cursor not-allowed', async () => {
    const disabledMenu: DropdownMenuConfig = {
      items: [{ key: '1', label: 'Disabled', disabled: true }],
    }
    const { container } = render(
      <Dropdown menu={disabledMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Disabled')

    const item = screen.getByText('Disabled').closest('.ino-dropdown__item') as HTMLElement
    expect(item).toHaveClass('ino-dropdown__item--disabled')
  })

  it('renders danger items with error color', async () => {
    const dangerMenu: DropdownMenuConfig = {
      items: [{ key: '1', label: 'Delete', danger: true }],
    }
    const { container } = render(
      <Dropdown menu={dangerMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Delete')

    const item = screen.getByText('Delete').closest('.ino-dropdown__item') as HTMLElement
    // Danger items use tokens.colorError via BEM class
    expect(item).toHaveClass('ino-dropdown__item--danger')
  })

  // ---------- Divider ----------

  it('renders divider items', async () => {
    const dividerMenu: DropdownMenuConfig = {
      items: [
        { key: '1', label: 'Above' },
        { key: 'd', type: 'divider' },
        { key: '2', label: 'Below' },
      ],
    }
    const { container } = render(
      <Dropdown menu={dividerMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Above')

    expect(screen.getByText('Above')).toBeInTheDocument()
    expect(screen.getByText('Below')).toBeInTheDocument()
  })

  // ---------- Group ----------

  it('renders group items with title and children', async () => {
    const groupMenu: DropdownMenuConfig = {
      items: [
        {
          key: 'g',
          type: 'group',
          title: 'Group Title',
          children: [
            { key: 'g1', label: 'Group Item 1' },
            { key: 'g2', label: 'Group Item 2' },
          ],
        },
      ],
    }
    const { container } = render(
      <Dropdown menu={groupMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Group Title')

    expect(screen.getByText('Group Title')).toBeInTheDocument()
    expect(screen.getByText('Group Item 1')).toBeInTheDocument()
    expect(screen.getByText('Group Item 2')).toBeInTheDocument()
  })

  // ---------- Submenu ----------

  it('renders submenu chevron for items with children', async () => {
    const subMenu: DropdownMenuConfig = {
      items: [
        {
          key: 'p',
          label: 'Parent',
          children: [{ key: 'c1', label: 'Child' }],
        },
      ],
    }
    const { container } = render(
      <Dropdown menu={subMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Parent')

    // Parent item should have a chevron-right SVG
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })

  it('shows submenu on hover over parent item', async () => {
    const subMenu: DropdownMenuConfig = {
      items: [
        {
          key: 'p',
          label: 'Parent',
          children: [{ key: 'c1', label: 'Sub Child' }],
        },
      ],
    }
    const { container } = render(
      <Dropdown menu={subMenu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement, 'Parent')

    // Submenu not visible yet
    expect(screen.queryByText('Sub Child')).not.toBeInTheDocument()

    // Hover over parent item
    const parentItem = screen.getByText('Parent').closest('.ino-dropdown__item') as HTMLElement
    fireEvent.mouseEnter(parentItem)

    expect(screen.getByText('Sub Child')).toBeInTheDocument()
  })

  // ---------- Arrow ----------

  it('renders arrow when arrow=true', async () => {
    const { container } = render(
      <Dropdown menu={menu} arrow>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement)

    // Arrow is now a BEM element
    const arrowEl = container.querySelector('.ino-dropdown__arrow')
    expect(arrowEl).toBeInTheDocument()
  })

  it('does not render arrow by default', async () => {
    const { container } = render(
      <Dropdown menu={menu}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement)

    const arrowEl = container.querySelector('div[style*="width: 8px"]')
    expect(arrowEl).not.toBeInTheDocument()
  })

  // ---------- Controlled state ----------

  it('respects controlled open prop', () => {
    render(
      <Dropdown menu={menu} open>
        <button>Open</button>
      </Dropdown>
    )
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('does not show menu when controlled open=false', () => {
    render(
      <Dropdown menu={menu} open={false}>
        <button>Open</button>
      </Dropdown>
    )
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when state changes', async () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <Dropdown menu={menu} onOpenChange={onOpenChange}>
        <button>Open</button>
      </Dropdown>
    )
    fireEvent.mouseEnter(container.firstChild as HTMLElement)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  // ---------- Disabled ----------

  it('does not open when disabled', async () => {
    const { container } = render(
      <Dropdown menu={menu} disabled>
        <button>Open</button>
      </Dropdown>
    )
    fireEvent.mouseEnter(container.firstChild as HTMLElement)

    // Give time for timeout to fire (if it would)
    await new Promise((r) => setTimeout(r, 200))
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  // ---------- dropdownRender ----------

  it('uses custom dropdownRender', async () => {
    const customRender = (menuNode: React.ReactNode) => (
      <div data-testid="custom-overlay">
        {menuNode}
        <button>Extra Button</button>
      </div>
    )
    const { container } = render(
      <Dropdown menu={menu} dropdownRender={customRender}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement)

    expect(screen.getByTestId('custom-overlay')).toBeInTheDocument()
    expect(screen.getByText('Extra Button')).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  // ---------- className & style ----------

  it('applies custom className', () => {
    const { container } = render(
      <Dropdown menu={menu} className="my-dropdown">
        <button>Open</button>
      </Dropdown>
    )
    expect(container.firstChild).toHaveClass('my-dropdown')
  })

  it('applies custom style', () => {
    const { container } = render(
      <Dropdown menu={menu} style={{ margin: 10 }}>
        <button>Open</button>
      </Dropdown>
    )
    expect((container.firstChild as HTMLElement).style.margin).toBe('10px')
  })

  // ---------- Semantic classNames ----------

  it('applies classNames.overlay to the menu container', async () => {
    const { container } = render(
      <Dropdown menu={menu} classNames={{ overlay: 'my-overlay' }}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement)

    expect(container.querySelector('.my-overlay')).toBeInTheDocument()
  })

  it('applies classNames.item to menu items', async () => {
    const { container } = render(
      <Dropdown menu={menu} classNames={{ item: 'my-item' }}>
        <button>Open</button>
      </Dropdown>
    )
    await openByHover(container.firstChild as HTMLElement)

    const items = container.querySelectorAll('.my-item')
    expect(items).toHaveLength(3)
  })
})

describe('Dropdown.Button', () => {
  it('renders two buttons', () => {
    render(<Dropdown.Button menu={menu}>Action</Dropdown.Button>)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('renders main button with children text', () => {
    render(<Dropdown.Button menu={menu}>Action</Dropdown.Button>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders chevron icon on the dropdown trigger button', () => {
    const { container } = render(
      <Dropdown.Button menu={menu}>Action</Dropdown.Button>
    )
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(1)
  })

  it('calls onClick on main button click', () => {
    const handleClick = vi.fn()
    render(
      <Dropdown.Button menu={menu} onClick={handleClick}>
        Action
      </Dropdown.Button>
    )
    fireEvent.click(screen.getByText('Action'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders custom icon on dropdown trigger', () => {
    render(
      <Dropdown.Button menu={menu} icon={<span data-testid="custom-icon">▼</span>}>
        Action
      </Dropdown.Button>
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Dropdown.Button menu={menu} className="my-dd-btn">Action</Dropdown.Button>
    )
    expect(container.firstChild).toHaveClass('my-dd-btn')
  })
})
