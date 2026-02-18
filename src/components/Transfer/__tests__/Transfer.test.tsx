import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Transfer } from '../Transfer'
import type { TransferItem } from '../Transfer'

// ============================================================================
// Helpers
// ============================================================================

const baseData: TransferItem[] = [
  { key: '1', title: 'Item 1' },
  { key: '2', title: 'Item 2' },
  { key: '3', title: 'Item 3' },
  { key: '4', title: 'Item 4' },
  { key: '5', title: 'Item 5' },
]

/** Get the two list panels (.j-transfer has two list children) */
function getPanels(container: HTMLElement) {
  const root = container.firstElementChild as HTMLElement
  const children = root.children
  // Structure: [source-list, operation-col, target-list]
  return {
    source: children[0] as HTMLElement,
    operations: children[1] as HTMLElement,
    target: children[2] as HTMLElement,
  }
}

/** Get all visible item rows inside a panel */
function getItems(panel: HTMLElement) {
  // Items are inside the scrollable body div — each has cursor style and gap
  // Items have style containing 'min-height: 2rem'
  return panel.querySelectorAll('[style*="min-height"]')
}

/** Get the select-all checkbox in a panel header */
function getSelectAll(panel: HTMLElement) {
  // Header is the first child div (has border-bottom)
  const header = panel.children[0] as HTMLElement
  return header.querySelector('[style*="0.875rem"]') as HTMLElement | null
}

/** Get operation buttons (right/left arrows) */
function getOpButtons(container: HTMLElement) {
  const { operations } = getPanels(container)
  return operations.querySelectorAll('button')
}

/** Click on an item row */
function clickItem(item: Element) {
  fireEvent.click(item)
}

/** Get search input inside a panel */
function getSearchInput(panel: HTMLElement) {
  return panel.querySelector('input[type="text"]') as HTMLInputElement | null
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Transfer – Basic rendering', () => {
  it('renders source and target panels', () => {
    const { container } = render(<Transfer dataSource={baseData} />)
    const { source, target } = getPanels(container)
    expect(source).toBeTruthy()
    expect(target).toBeTruthy()
  })

  it('renders default titles (Source / Target)', () => {
    render(<Transfer dataSource={baseData} />)
    expect(screen.getByText('Source')).toBeInTheDocument()
    expect(screen.getByText('Target')).toBeInTheDocument()
  })

  it('renders custom titles', () => {
    render(<Transfer dataSource={baseData} titles={['Left', 'Right']} />)
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('renders all items in source by default', () => {
    const { container } = render(<Transfer dataSource={baseData} />)
    const { source } = getPanels(container)
    expect(getItems(source)).toHaveLength(5)
  })

  it('renders two operation buttons by default', () => {
    const { container } = render(<Transfer dataSource={baseData} />)
    const buttons = getOpButtons(container)
    expect(buttons).toHaveLength(2)
  })

  it('renders item count in header', () => {
    render(<Transfer dataSource={baseData} />)
    expect(screen.getByText('5 items')).toBeInTheDocument()
    expect(screen.getByText('0 items')).toBeInTheDocument()
  })

  it('uses singular "item" for single item', () => {
    render(<Transfer dataSource={[{ key: '1', title: 'A' }]} />)
    expect(screen.getByText('1 item')).toBeInTheDocument()
  })
})

// ============================================================================
// Target keys (controlled / uncontrolled)
// ============================================================================

describe('Transfer – Target keys', () => {
  it('places items in target with defaultTargetKeys', () => {
    const { container } = render(
      <Transfer dataSource={baseData} defaultTargetKeys={['3', '4']} />,
    )
    const { source, target } = getPanels(container)
    expect(getItems(source)).toHaveLength(3)
    expect(getItems(target)).toHaveLength(2)
  })

  it('places items in target with controlled targetKeys', () => {
    const { container } = render(
      <Transfer dataSource={baseData} targetKeys={['1', '2']} />,
    )
    const { source, target } = getPanels(container)
    expect(getItems(source)).toHaveLength(3)
    expect(getItems(target)).toHaveLength(2)
  })

  it('updates target when controlled targetKeys change', () => {
    const { container, rerender } = render(
      <Transfer dataSource={baseData} targetKeys={['1']} />,
    )
    expect(getItems(getPanels(container).target)).toHaveLength(1)
    rerender(<Transfer dataSource={baseData} targetKeys={['1', '2', '3']} />)
    expect(getItems(getPanels(container).target)).toHaveLength(3)
  })

  it('shows empty target with "No data"', () => {
    render(<Transfer dataSource={baseData} />)
    // Target panel has no items → shows "No data"
    const noDataElements = screen.getAllByText('No data')
    expect(noDataElements.length).toBeGreaterThanOrEqual(1)
  })
})

// ============================================================================
// Selection
// ============================================================================

describe('Transfer – Selection', () => {
  it('selects an item on click', () => {
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} onSelectChange={onSelectChange} />,
    )
    const { source } = getPanels(container)
    clickItem(getItems(source)[0])
    expect(onSelectChange).toHaveBeenCalledWith(['1'], [])
  })

  it('deselects an item on second click', () => {
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} onSelectChange={onSelectChange} />,
    )
    const { source } = getPanels(container)
    clickItem(getItems(source)[0])
    clickItem(getItems(source)[0])
    expect(onSelectChange).toHaveBeenLastCalledWith([], [])
  })

  it('supports defaultSelectedKeys', () => {
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer
        dataSource={baseData}
        defaultSelectedKeys={['1', '2']}
        onSelectChange={onSelectChange}
      />,
    )
    // Header count should reflect selection
    expect(screen.getByText('2/5 items')).toBeInTheDocument()
  })

  it('supports controlled selectedKeys', () => {
    render(
      <Transfer dataSource={baseData} selectedKeys={['1', '3']} />,
    )
    expect(screen.getByText('2/5 items')).toBeInTheDocument()
  })
})

// ============================================================================
// Select all
// ============================================================================

describe('Transfer – Select all', () => {
  it('shows select-all checkbox in headers by default', () => {
    const { container } = render(<Transfer dataSource={baseData} />)
    const { source, target } = getPanels(container)
    expect(getSelectAll(source)).toBeTruthy()
    expect(getSelectAll(target)).toBeTruthy()
  })

  it('hides select-all checkbox when showSelectAll=false', () => {
    const { container } = render(
      <Transfer dataSource={baseData} showSelectAll={false} />,
    )
    const { source } = getPanels(container)
    expect(getSelectAll(source)).toBeNull()
  })

  it('selects all items on select-all click', () => {
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} onSelectChange={onSelectChange} />,
    )
    const { source } = getPanels(container)
    fireEvent.click(getSelectAll(source)!)
    expect(onSelectChange).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '2', '3', '4', '5']),
      [],
    )
  })

  it('deselects all on second select-all click', () => {
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} onSelectChange={onSelectChange} />,
    )
    const { source } = getPanels(container)
    fireEvent.click(getSelectAll(source)!)
    fireEvent.click(getSelectAll(source)!)
    expect(onSelectChange).toHaveBeenLastCalledWith([], [])
  })

  it('does not select disabled items via select-all', () => {
    const data: TransferItem[] = [
      { key: '1', title: 'A' },
      { key: '2', title: 'B', disabled: true },
      { key: '3', title: 'C' },
    ]
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={data} onSelectChange={onSelectChange} />,
    )
    const { source } = getPanels(container)
    fireEvent.click(getSelectAll(source)!)
    expect(onSelectChange).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '3']),
      [],
    )
    // Should NOT include '2'
    expect(onSelectChange.mock.calls[0][0]).not.toContain('2')
  })
})

// ============================================================================
// Transfer items between panels
// ============================================================================

describe('Transfer – Move items', () => {
  it('moves selected items to target on right arrow click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} defaultSelectedKeys={['1', '2']} onChange={onChange} />,
    )
    const buttons = getOpButtons(container)
    fireEvent.click(buttons[0]) // Right arrow
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining(['1', '2']),
      'right',
      expect.arrayContaining(['1', '2']),
    )
  })

  it('moves selected items back to source on left arrow click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Transfer
        dataSource={baseData}
        defaultTargetKeys={['3', '4']}
        defaultSelectedKeys={['3']}
        onChange={onChange}
      />,
    )
    const buttons = getOpButtons(container)
    fireEvent.click(buttons[1]) // Left arrow
    expect(onChange).toHaveBeenCalledWith(
      ['4'],
      'left',
      ['3'],
    )
  })

  it('updates panel contents after uncontrolled move', () => {
    const { container } = render(
      <Transfer dataSource={baseData} defaultSelectedKeys={['1', '2']} />,
    )
    const buttons = getOpButtons(container)
    fireEvent.click(buttons[0]) // Right arrow
    const { source, target } = getPanels(container)
    expect(getItems(source)).toHaveLength(3)
    expect(getItems(target)).toHaveLength(2)
  })

  it('clears selection of moved items after transfer', () => {
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer
        dataSource={baseData}
        defaultSelectedKeys={['1', '2']}
        onSelectChange={onSelectChange}
      />,
    )
    const buttons = getOpButtons(container)
    fireEvent.click(buttons[0]) // Right
    // After move, onSelectChange should be called with moved items removed
    const lastCall = onSelectChange.mock.calls[onSelectChange.mock.calls.length - 1]
    expect(lastCall[0]).not.toContain('1')
    expect(lastCall[0]).not.toContain('2')
  })

  it('does not move disabled items', () => {
    const data: TransferItem[] = [
      { key: '1', title: 'A' },
      { key: '2', title: 'B', disabled: true },
    ]
    const onChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={data} defaultSelectedKeys={['1', '2']} onChange={onChange} />,
    )
    const buttons = getOpButtons(container)
    fireEvent.click(buttons[0])
    expect(onChange).toHaveBeenCalledWith(['1'], 'right', ['1'])
  })

  it('does nothing when no items are selected', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} onChange={onChange} />,
    )
    const buttons = getOpButtons(container)
    fireEvent.click(buttons[0])
    expect(onChange).not.toHaveBeenCalled()
  })
})

// ============================================================================
// Operations text
// ============================================================================

describe('Transfer – Operations', () => {
  it('shows custom operation text', () => {
    render(<Transfer dataSource={baseData} operations={['Add', 'Remove']} />)
    expect(screen.getByText('Add')).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('disables operation buttons when globally disabled', () => {
    const { container } = render(<Transfer dataSource={baseData} disabled />)
    const buttons = getOpButtons(container)
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })
})

// ============================================================================
// Disabled
// ============================================================================

describe('Transfer – Disabled', () => {
  it('applies not-allowed cursor to items', () => {
    const { container } = render(<Transfer dataSource={baseData} disabled />)
    const { source } = getPanels(container)
    const item = getItems(source)[0] as HTMLElement
    expect(item.style.cursor).toBe('not-allowed')
  })

  it('applies opacity 0.5 to items', () => {
    const { container } = render(<Transfer dataSource={baseData} disabled />)
    const { source } = getPanels(container)
    const item = getItems(source)[0] as HTMLElement
    expect(item.style.opacity).toBe('0.5')
  })

  it('does not select items when disabled', () => {
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} disabled onSelectChange={onSelectChange} />,
    )
    const { source } = getPanels(container)
    clickItem(getItems(source)[0])
    expect(onSelectChange).not.toHaveBeenCalled()
  })

  it('disabled items cannot be selected individually', () => {
    const data: TransferItem[] = [
      { key: '1', title: 'A' },
      { key: '2', title: 'B', disabled: true },
    ]
    const onSelectChange = vi.fn()
    const { container } = render(
      <Transfer dataSource={data} onSelectChange={onSelectChange} />,
    )
    const { source } = getPanels(container)
    clickItem(getItems(source)[1]) // Click disabled item
    expect(onSelectChange).not.toHaveBeenCalled()
  })
})

// ============================================================================
// Search
// ============================================================================

describe('Transfer – Search', () => {
  it('does not show search by default', () => {
    const { container } = render(<Transfer dataSource={baseData} />)
    const { source } = getPanels(container)
    expect(getSearchInput(source)).toBeNull()
  })

  it('shows search inputs when showSearch=true', () => {
    const { container } = render(<Transfer dataSource={baseData} showSearch />)
    const { source, target } = getPanels(container)
    expect(getSearchInput(source)).toBeTruthy()
    expect(getSearchInput(target)).toBeTruthy()
  })

  it('filters source items by search', () => {
    const { container } = render(<Transfer dataSource={baseData} showSearch />)
    const { source } = getPanels(container)
    const input = getSearchInput(source)!
    fireEvent.change(input, { target: { value: 'Item 1' } })
    expect(getItems(source)).toHaveLength(1)
  })

  it('shows "No data" when search matches nothing', () => {
    const { container } = render(<Transfer dataSource={baseData} showSearch />)
    const { source } = getPanels(container)
    const input = getSearchInput(source)!
    fireEvent.change(input, { target: { value: 'zzz' } })
    // Should show "No data" for that panel
    expect(source.textContent).toContain('No data')
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    const { container } = render(
      <Transfer dataSource={baseData} showSearch onSearch={onSearch} />,
    )
    const { source } = getPanels(container)
    const input = getSearchInput(source)!
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onSearch).toHaveBeenCalledWith('left', 'test')
  })

  it('search is case-insensitive by default', () => {
    const { container } = render(<Transfer dataSource={baseData} showSearch />)
    const { source } = getPanels(container)
    const input = getSearchInput(source)!
    fireEvent.change(input, { target: { value: 'item 3' } })
    expect(getItems(source)).toHaveLength(1)
  })

  it('uses custom filterOption', () => {
    const filterOption = (input: string, item: TransferItem) => item.key === input
    const { container } = render(
      <Transfer dataSource={baseData} showSearch filterOption={filterOption} />,
    )
    const { source } = getPanels(container)
    const input = getSearchInput(source)!
    fireEvent.change(input, { target: { value: '2' } })
    expect(getItems(source)).toHaveLength(1)
  })
})

// ============================================================================
// Custom render
// ============================================================================

describe('Transfer – Custom render', () => {
  it('uses custom render function for items', () => {
    render(
      <Transfer
        dataSource={baseData}
        render={(item) => <span data-testid={`custom-${item.key}`}>{item.title} (custom)</span>}
      />,
    )
    expect(screen.getByTestId('custom-1')).toBeInTheDocument()
    expect(screen.getByText('Item 1 (custom)')).toBeInTheDocument()
  })
})

// ============================================================================
// oneWay mode
// ============================================================================

describe('Transfer – oneWay', () => {
  it('hides left arrow button', () => {
    const { container } = render(
      <Transfer dataSource={baseData} oneWay />,
    )
    const buttons = getOpButtons(container)
    expect(buttons).toHaveLength(1)
  })

  it('shows remove icons on target items', () => {
    const { container } = render(
      <Transfer dataSource={baseData} defaultTargetKeys={['1', '2']} oneWay />,
    )
    const { target } = getPanels(container)
    // Target items should have close (X) icons — SVG inside a clickable span
    const closeSvgs = target.querySelectorAll('svg')
    // At least 2 close icons (one per target item) + possibly header checkbox SVG
    expect(closeSvgs.length).toBeGreaterThanOrEqual(2)
  })

  it('removes item from target on close icon click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Transfer
        dataSource={baseData}
        defaultTargetKeys={['1', '2']}
        oneWay
        onChange={onChange}
      />,
    )
    const { target } = getPanels(container)
    // Find close icon spans inside items (they have cursor: pointer and are inside items)
    const items = getItems(target)
    const closeSpan = items[0].querySelector('[style*="cursor: pointer"]') as HTMLElement
    fireEvent.click(closeSpan)
    expect(onChange).toHaveBeenCalledWith(['2'], 'left', ['1'])
  })

  it('does not show checkboxes on target items in oneWay mode', () => {
    const { container } = render(
      <Transfer dataSource={baseData} defaultTargetKeys={['1']} oneWay />,
    )
    const { target } = getPanels(container)
    const items = getItems(target)
    // In oneWay mode, target items don't have a 0.875rem checkbox
    const checkbox = items[0].querySelector('[style*="0.875rem"]')
    expect(checkbox).toBeNull()
  })
})

// ============================================================================
// Status
// ============================================================================

describe('Transfer – Status', () => {
  it('applies error border color to panels', () => {
    const { container } = render(
      <Transfer dataSource={baseData} status="error" />,
    )
    const { source } = getPanels(container)
    expect(source.style.border).toContain('var(--j-error)')
  })

  it('applies warning border color to panels', () => {
    const { container } = render(
      <Transfer dataSource={baseData} status="warning" />,
    )
    const { source } = getPanels(container)
    expect(source.style.border).toContain('var(--j-warning)')
  })
})

// ============================================================================
// Footer
// ============================================================================

describe('Transfer – Footer', () => {
  it('renders static footer in both panels', () => {
    render(
      <Transfer dataSource={baseData} footer={<span>Footer text</span>} />,
    )
    const footers = screen.getAllByText('Footer text')
    expect(footers).toHaveLength(2)
  })

  it('renders footer function with direction', () => {
    render(
      <Transfer
        dataSource={baseData}
        footer={({ direction }) => <span>{direction} footer</span>}
      />,
    )
    expect(screen.getByText('left footer')).toBeInTheDocument()
    expect(screen.getByText('right footer')).toBeInTheDocument()
  })
})

// ============================================================================
// Pagination
// ============================================================================

describe('Transfer – Pagination', () => {
  const manyItems: TransferItem[] = Array.from({ length: 25 }, (_, i) => ({
    key: String(i + 1),
    title: `Item ${i + 1}`,
  }))

  it('shows pagination controls', () => {
    const { container } = render(
      <Transfer dataSource={manyItems} pagination />,
    )
    const { source } = getPanels(container)
    expect(source.textContent).toContain('1/3')
  })

  it('limits visible items per page (default 10)', () => {
    const { container } = render(
      <Transfer dataSource={manyItems} pagination />,
    )
    const { source } = getPanels(container)
    expect(getItems(source)).toHaveLength(10)
  })

  it('uses custom pageSize', () => {
    const { container } = render(
      <Transfer dataSource={manyItems} pagination={{ pageSize: 5 }} />,
    )
    const { source } = getPanels(container)
    expect(getItems(source)).toHaveLength(5)
    expect(source.textContent).toContain('1/5')
  })

  it('navigates to next page', () => {
    const { container } = render(
      <Transfer dataSource={manyItems} pagination={{ pageSize: 5 }} />,
    )
    const { source } = getPanels(container)
    // Next page button is the second button in pagination area
    const pagBtns = source.querySelectorAll('button[type="button"]')
    // Last two buttons are pagination prev/next (after header select-all and item buttons)
    const nextBtn = pagBtns[pagBtns.length - 1] as HTMLButtonElement
    fireEvent.click(nextBtn)
    expect(source.textContent).toContain('2/5')
  })

  it('does not show pagination when not enabled', () => {
    const { container } = render(<Transfer dataSource={manyItems} />)
    const { source } = getPanels(container)
    // All items visible (no pagination)
    expect(getItems(source)).toHaveLength(25)
  })
})

// ============================================================================
// listStyle
// ============================================================================

describe('Transfer – listStyle', () => {
  it('applies static listStyle to both panels', () => {
    const { container } = render(
      <Transfer dataSource={baseData} listStyle={{ width: '20rem' }} />,
    )
    const { source, target } = getPanels(container)
    expect(source.style.width).toBe('20rem')
    expect(target.style.width).toBe('20rem')
  })

  it('applies function-based listStyle per direction', () => {
    const { container } = render(
      <Transfer
        dataSource={baseData}
        listStyle={(dir) => ({ width: dir === 'left' ? '15rem' : '20rem' })}
      />,
    )
    const { source, target } = getPanels(container)
    expect(source.style.width).toBe('15rem')
    expect(target.style.width).toBe('20rem')
  })
})

// ============================================================================
// Semantic classNames & styles
// ============================================================================

describe('Transfer – Semantic classNames & styles', () => {
  it('applies className to root', () => {
    const { container } = render(
      <Transfer dataSource={baseData} className="my-transfer" />,
    )
    expect(container.firstElementChild).toHaveClass('my-transfer')
  })

  it('applies style to root', () => {
    const { container } = render(
      <Transfer dataSource={baseData} style={{ margin: '10px' }} />,
    )
    expect((container.firstElementChild as HTMLElement).style.margin).toBe('10px')
  })

  it('applies classNames.root to root', () => {
    const { container } = render(
      <Transfer dataSource={baseData} classNames={{ root: 'r-cls' }} />,
    )
    expect(container.firstElementChild).toHaveClass('r-cls')
  })

  it('applies classNames.list to both list panels', () => {
    const { container } = render(
      <Transfer dataSource={baseData} classNames={{ list: 'l-cls' }} />,
    )
    const panels = container.querySelectorAll('.l-cls')
    expect(panels).toHaveLength(2)
  })

  it('applies classNames.header to both headers', () => {
    const { container } = render(
      <Transfer dataSource={baseData} classNames={{ header: 'h-cls' }} />,
    )
    const headers = container.querySelectorAll('.h-cls')
    expect(headers).toHaveLength(2)
  })

  it('applies classNames.search to search wrappers', () => {
    const { container } = render(
      <Transfer dataSource={baseData} showSearch classNames={{ search: 's-cls' }} />,
    )
    const searches = container.querySelectorAll('.s-cls')
    expect(searches).toHaveLength(2)
  })

  it('applies classNames.item to each item', () => {
    const { container } = render(
      <Transfer dataSource={baseData} classNames={{ item: 'i-cls' }} />,
    )
    const items = container.querySelectorAll('.i-cls')
    expect(items).toHaveLength(5) // All in source
  })

  it('applies classNames.operation to operation column', () => {
    const { container } = render(
      <Transfer dataSource={baseData} classNames={{ operation: 'op-cls' }} />,
    )
    const opCol = container.querySelector('.op-cls')
    expect(opCol).toBeTruthy()
  })

  it('applies styles.root to root', () => {
    const { container } = render(
      <Transfer dataSource={baseData} styles={{ root: { padding: '5px' } }} />,
    )
    expect((container.firstElementChild as HTMLElement).style.padding).toBe('5px')
  })
})

// ============================================================================
// Header count display
// ============================================================================

describe('Transfer – Header count', () => {
  it('shows selected/total count when items are selected', () => {
    render(
      <Transfer dataSource={baseData} defaultSelectedKeys={['1', '3']} />,
    )
    expect(screen.getByText('2/5 items')).toBeInTheDocument()
  })

  it('shows only total when nothing selected', () => {
    render(<Transfer dataSource={baseData} />)
    expect(screen.getByText('5 items')).toBeInTheDocument()
  })

  it('excludes disabled items from enabled count', () => {
    const data: TransferItem[] = [
      { key: '1', title: 'A' },
      { key: '2', title: 'B', disabled: true },
      { key: '3', title: 'C' },
    ]
    render(<Transfer dataSource={data} />)
    // 2 enabled items in source
    expect(screen.getByText('2 items')).toBeInTheDocument()
  })
})
