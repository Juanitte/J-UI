import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Menu } from '../Menu'
import type { MenuItemType } from '../Menu'

const items: MenuItemType[] = [
  { key: '1', label: 'Home' },
  { key: '2', label: 'About' },
  { key: '3', label: 'Contact' },
]

describe('Menu', () => {
  // ---------- Basic rendering ----------

  it('renders all item labels', () => {
    render(<Menu items={items} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders as a ul element with role="menu"', () => {
    const { container } = render(<Menu items={items} />)
    const ul = container.querySelector('ul')
    expect(ul).toBeInTheDocument()
    expect(ul).toHaveAttribute('role', 'menu')
  })

  it('renders items as li with role="menuitem"', () => {
    const { container } = render(<Menu items={items} />)
    const menuItems = container.querySelectorAll('li[role="menuitem"]')
    expect(menuItems).toHaveLength(3)
  })

  it('renders with empty items', () => {
    const { container } = render(<Menu items={[]} />)
    expect(container.querySelector('ul')).toBeInTheDocument()
  })

  // ---------- Modes ----------

  it('uses vertical mode by default (borderRight)', () => {
    const { container } = render(<Menu items={items} />)
    const ul = container.querySelector('ul') as HTMLElement
    expect(ul).toHaveClass('ino-menu--vertical')
  })

  it('renders horizontal mode with flex layout and role="menubar"', () => {
    const { container } = render(<Menu items={items} mode="horizontal" />)
    const ul = container.querySelector('ul') as HTMLElement
    expect(ul).toHaveClass('ino-menu--horizontal')
    expect(ul).toHaveAttribute('role', 'menubar')
  })

  it('renders horizontal mode with borderBottom', () => {
    const { container } = render(<Menu items={items} mode="horizontal" />)
    const ul = container.querySelector('ul') as HTMLElement
    expect(ul).toHaveClass('ino-menu--horizontal')
  })

  // ---------- Icons ----------

  it('renders item icons', () => {
    const iconItems: MenuItemType[] = [
      { key: '1', label: 'Home', icon: <span data-testid="icon">★</span> },
    ]
    render(<Menu items={iconItems} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  // ---------- Selection (uncontrolled) ----------

  it('selects an item on click', () => {
    const { container } = render(<Menu items={items} />)
    fireEvent.click(screen.getByText('About'))
    // Selected item gets primary color
    const aboutLi = screen.getByText('About').closest('li') as HTMLElement
    expect(aboutLi).toHaveClass('ino-menu__item--selected')
  })

  it('calls onClick with key and keyPath', () => {
    const handleClick = vi.fn()
    render(<Menu items={items} onClick={handleClick} />)
    fireEvent.click(screen.getByText('Home'))
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ key: '1', keyPath: ['1'] })
    )
  })

  it('calls onSelect when item is selected', () => {
    const handleSelect = vi.fn()
    render(<Menu items={items} onSelect={handleSelect} />)
    fireEvent.click(screen.getByText('About'))
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: '2', selectedKeys: ['2'] })
    )
  })

  it('calls individual item onClick', () => {
    const itemClick = vi.fn()
    const clickItems: MenuItemType[] = [
      { key: '1', label: 'Clickable', onClick: itemClick },
    ]
    render(<Menu items={clickItems} />)
    fireEvent.click(screen.getByText('Clickable'))
    expect(itemClick).toHaveBeenCalledWith(
      expect.objectContaining({ key: '1' })
    )
  })

  // ---------- Selection (controlled) ----------

  it('highlights items from selectedKeys prop', () => {
    const { container } = render(<Menu items={items} selectedKeys={['2']} />)
    const aboutLi = screen.getByText('About').closest('li') as HTMLElement
    // Selected item should have primary color via BEM class
    expect(aboutLi).toHaveClass('ino-menu__item--selected')
  })

  it('uses defaultSelectedKeys for initial selection', () => {
    const handleSelect = vi.fn()
    render(<Menu items={items} defaultSelectedKeys={['1']} onSelect={handleSelect} />)
    // Click a different item
    fireEvent.click(screen.getByText('Contact'))
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: '3', selectedKeys: ['3'] })
    )
  })

  // ---------- Multiple selection ----------

  it('supports multiple selection', () => {
    const handleSelect = vi.fn()
    render(<Menu items={items} multiple onSelect={handleSelect} />)
    fireEvent.click(screen.getByText('Home'))
    fireEvent.click(screen.getByText('About'))
    expect(handleSelect).toHaveBeenCalledTimes(2)
    // Second call should have both keys
    expect(handleSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ selectedKeys: ['1', '2'] })
    )
  })

  it('calls onDeselect when deselecting in multiple mode', () => {
    const handleDeselect = vi.fn()
    render(
      <Menu items={items} multiple defaultSelectedKeys={['1']} onDeselect={handleDeselect} />
    )
    fireEvent.click(screen.getByText('Home'))
    expect(handleDeselect).toHaveBeenCalledWith(
      expect.objectContaining({ key: '1', selectedKeys: [] })
    )
  })

  // ---------- Selectable=false ----------

  it('does not select items when selectable=false', () => {
    const handleSelect = vi.fn()
    render(<Menu items={items} selectable={false} onSelect={handleSelect} />)
    fireEvent.click(screen.getByText('Home'))
    expect(handleSelect).not.toHaveBeenCalled()
  })

  // ---------- Disabled items ----------

  it('does not call onClick for disabled items', () => {
    const handleClick = vi.fn()
    const disabledItems: MenuItemType[] = [
      { key: '1', label: 'Disabled', disabled: true },
    ]
    render(<Menu items={disabledItems} onClick={handleClick} />)
    fireEvent.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders disabled items with cursor not-allowed', () => {
    const disabledItems: MenuItemType[] = [
      { key: '1', label: 'Disabled', disabled: true },
    ]
    render(<Menu items={disabledItems} />)
    const li = screen.getByText('Disabled').closest('li') as HTMLElement
    expect(li).toHaveClass('ino-menu__item--disabled')
  })

  it('renders disabled items with reduced opacity', () => {
    const disabledItems: MenuItemType[] = [
      { key: '1', label: 'Disabled', disabled: true },
    ]
    render(<Menu items={disabledItems} />)
    const li = screen.getByText('Disabled').closest('li') as HTMLElement
    expect(li).toHaveClass('ino-menu__item--disabled')
  })

  // ---------- Danger items ----------

  it('renders danger items with error color', () => {
    const dangerItems: MenuItemType[] = [
      { key: '1', label: 'Delete', danger: true },
    ]
    render(<Menu items={dangerItems} />)
    const li = screen.getByText('Delete').closest('li') as HTMLElement
    expect(li).toHaveClass('ino-menu__item--danger')
  })

  // ---------- Divider ----------

  it('renders divider with role="separator"', () => {
    const dividerItems: MenuItemType[] = [
      { key: '1', label: 'Above' },
      { key: 'd', type: 'divider' },
      { key: '2', label: 'Below' },
    ]
    const { container } = render(<Menu items={dividerItems} />)
    const sep = container.querySelector('li[role="separator"]')
    expect(sep).toBeInTheDocument()
  })

  it('renders dashed divider', () => {
    const dividerItems: MenuItemType[] = [
      { key: 'd', type: 'divider', dashed: true },
    ]
    const { container } = render(<Menu items={dividerItems} />)
    const sep = container.querySelector('li[role="separator"]') as HTMLElement
    expect(sep).toHaveClass('ino-menu__divider--dashed')
  })

  // ---------- Group ----------

  it('renders group with title and children', () => {
    const groupItems: MenuItemType[] = [
      {
        type: 'group',
        label: 'Group Title',
        children: [
          { key: 'g1', label: 'Item A' },
          { key: 'g2', label: 'Item B' },
        ],
      },
    ]
    render(<Menu items={groupItems} />)
    expect(screen.getByText('Group Title')).toBeInTheDocument()
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })

  it('renders group with role="presentation" and child list with role="group"', () => {
    const groupItems: MenuItemType[] = [
      {
        type: 'group',
        label: 'Group',
        children: [{ key: 'g1', label: 'Child' }],
      },
    ]
    const { container } = render(<Menu items={groupItems} />)
    expect(container.querySelector('li[role="presentation"]')).toBeInTheDocument()
    expect(container.querySelector('ul[role="group"]')).toBeInTheDocument()
  })

  // ---------- SubMenu (inline mode) ----------

  it('renders submenu trigger with aria-expanded', () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Sub Item' }],
      },
    ]
    render(<Menu items={subItems} mode="inline" />)
    const trigger = screen.getByText('SubMenu').closest('[role="menuitem"]')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens inline submenu on click', () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Sub Item' }],
      },
    ]
    render(<Menu items={subItems} mode="inline" />)
    fireEvent.click(screen.getByText('SubMenu'))
    const trigger = screen.getByText('SubMenu').closest('[role="menuitem"]')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Sub Item')).toBeInTheDocument()
  })

  it('closes inline submenu on second click', () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Sub Item' }],
      },
    ]
    render(<Menu items={subItems} mode="inline" />)
    fireEvent.click(screen.getByText('SubMenu'))
    expect(screen.getByText('SubMenu').closest('[role="menuitem"]'))
      .toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByText('SubMenu'))
    expect(screen.getByText('SubMenu').closest('[role="menuitem"]'))
      .toHaveAttribute('aria-expanded', 'false')
  })

  it('calls onOpenChange when submenu opens/closes', () => {
    const handleOpenChange = vi.fn()
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Sub Item' }],
      },
    ]
    render(<Menu items={subItems} mode="inline" onOpenChange={handleOpenChange} />)
    fireEvent.click(screen.getByText('SubMenu'))
    expect(handleOpenChange).toHaveBeenCalledWith(['sub'])
  })

  it('uses defaultOpenKeys for initial open state', () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Sub Item' }],
      },
    ]
    render(<Menu items={subItems} mode="inline" defaultOpenKeys={['sub']} />)
    const trigger = screen.getByText('SubMenu').closest('[role="menuitem"]')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('respects controlled openKeys', () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Sub Item' }],
      },
    ]
    render(<Menu items={subItems} mode="inline" openKeys={['sub']} />)
    const trigger = screen.getByText('SubMenu').closest('[role="menuitem"]')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  // ---------- SubMenu (vertical mode - popup on hover) ----------

  it('opens vertical submenu on hover', async () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Popup Item' }],
      },
    ]
    const { container } = render(<Menu items={subItems} mode="vertical" />)

    // Hover over the submenu wrapper li
    const wrapperLi = screen.getByText('SubMenu').closest('li[role="none"]') as HTMLElement
    fireEvent.mouseEnter(wrapperLi)

    await waitFor(() => {
      expect(screen.getByText('Popup Item')).toBeInTheDocument()
    })
  })

  it('closes vertical submenu on mouse leave', async () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Popup Item' }],
      },
    ]
    render(<Menu items={subItems} mode="vertical" />)

    const wrapperLi = screen.getByText('SubMenu').closest('li[role="none"]') as HTMLElement
    fireEvent.mouseEnter(wrapperLi)

    await waitFor(() => {
      expect(screen.getByText('Popup Item')).toBeInTheDocument()
    })

    fireEvent.mouseLeave(wrapperLi)

    await waitFor(() => {
      expect(screen.queryByText('Popup Item')).not.toBeInTheDocument()
    })
  })

  // ---------- SubMenu (triggerSubMenuAction=click in vertical) ----------

  it('opens vertical submenu on click when triggerSubMenuAction="click"', () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Click Item' }],
      },
    ]
    render(<Menu items={subItems} mode="vertical" triggerSubMenuAction="click" />)
    fireEvent.click(screen.getByText('SubMenu'))
    expect(screen.getByText('Click Item')).toBeInTheDocument()
  })

  // ---------- Inline collapsed ----------

  it('collapses inline menu to narrow width', () => {
    const iconItems: MenuItemType[] = [
      { key: '1', label: 'Home', icon: <span data-testid="home-icon">🏠</span> },
    ]
    const { container } = render(<Menu items={iconItems} mode="inline" inlineCollapsed />)
    const ul = container.querySelector('ul') as HTMLElement
    expect(ul).toHaveClass('ino-menu--collapsed')
  })

  it('hides labels when collapsed and item has icon', () => {
    const iconItems: MenuItemType[] = [
      { key: '1', label: 'Home', icon: <span data-testid="icon">🏠</span> },
    ]
    render(<Menu items={iconItems} mode="inline" inlineCollapsed />)
    // When collapsed with an icon, the label text is hidden
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  // ---------- Inline indent ----------

  it('applies inline indent to nested items', () => {
    const nestedItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'SubMenu',
        children: [{ key: 's1', label: 'Nested' }],
      },
    ]
    render(<Menu items={nestedItems} mode="inline" defaultOpenKeys={['sub']} inlineIndent={30} />)
    const nestedLi = screen.getByText('Nested').closest('li') as HTMLElement
    // level 1 indent: 16 + 30 * 1 = 46px
    expect(nestedLi.style.paddingLeft).toBe('46px')
  })

  // ---------- Selected border indicators ----------

  it('renders right border on selected item in vertical mode', () => {
    render(<Menu items={items} selectedKeys={['1']} mode="vertical" />)
    const li = screen.getByText('Home').closest('li') as HTMLElement
    expect(li).toHaveClass('ino-menu__item--selected')
    expect(li).toHaveClass('ino-menu__item--vertical')
  })

  it('renders bottom border on selected item in horizontal mode', () => {
    render(<Menu items={items} selectedKeys={['1']} mode="horizontal" />)
    const li = screen.getByText('Home').closest('li') as HTMLElement
    expect(li).toHaveClass('ino-menu__item--selected')
    expect(li).toHaveClass('ino-menu__item--horizontal')
  })

  // ---------- className & style ----------

  it('applies custom className', () => {
    const { container } = render(<Menu items={items} className="my-menu" />)
    expect(container.querySelector('ul')).toHaveClass('my-menu')
  })

  it('applies custom style', () => {
    const { container } = render(<Menu items={items} style={{ margin: 10 }} />)
    expect((container.querySelector('ul') as HTMLElement).style.margin).toBe('10px')
  })

  // ---------- Semantic classNames ----------

  it('applies classNames.item to menu items', () => {
    const { container } = render(
      <Menu items={items} classNames={{ item: 'my-item' }} />
    )
    const itemEls = container.querySelectorAll('.my-item')
    expect(itemEls).toHaveLength(3)
  })

  it('applies classNames.divider to divider items', () => {
    const dividerItems: MenuItemType[] = [
      { key: '1', label: 'A' },
      { key: 'd', type: 'divider' },
      { key: '2', label: 'B' },
    ]
    const { container } = render(
      <Menu items={dividerItems} classNames={{ divider: 'my-divider' }} />
    )
    expect(container.querySelector('.my-divider')).toBeInTheDocument()
  })

  it('applies classNames.submenu to submenu list', () => {
    const subItems: MenuItemType[] = [
      {
        key: 'sub',
        label: 'Sub',
        children: [{ key: 's1', label: 'Child' }],
      },
    ]
    const { container } = render(
      <Menu items={subItems} mode="inline" defaultOpenKeys={['sub']} classNames={{ submenu: 'my-sub' }} />
    )
    expect(container.querySelector('.my-sub')).toBeInTheDocument()
  })

  it('applies classNames.group to group wrapper', () => {
    const groupItems: MenuItemType[] = [
      {
        type: 'group',
        label: 'G',
        children: [{ key: 'g1', label: 'C' }],
      },
    ]
    const { container } = render(
      <Menu items={groupItems} classNames={{ group: 'my-group' }} />
    )
    expect(container.querySelector('.my-group')).toBeInTheDocument()
  })

  it('applies classNames.groupTitle to group title', () => {
    const groupItems: MenuItemType[] = [
      {
        type: 'group',
        label: 'Title',
        children: [{ key: 'g1', label: 'C' }],
      },
    ]
    const { container } = render(
      <Menu items={groupItems} classNames={{ groupTitle: 'my-gt' }} />
    )
    expect(container.querySelector('.my-gt')).toBeInTheDocument()
  })
})
