import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TreeSelect } from '../TreeSelect'
import type { TreeSelectTreeData } from '../TreeSelect'

// ============================================================================
// Helpers
// ============================================================================

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

const treeData: TreeSelectTreeData[] = [
  {
    value: 'parent1',
    title: 'Parent 1',
    children: [
      { value: 'child1', title: 'Child 1' },
      { value: 'child2', title: 'Child 2' },
    ],
  },
  {
    value: 'parent2',
    title: 'Parent 2',
    children: [
      { value: 'child3', title: 'Child 3' },
    ],
  },
  { value: 'leaf1', title: 'Leaf 1' },
]

/** Open the dropdown by clicking the selector */
function openDropdown() {
  const selector = screen.getByText((_, el) =>
    el?.tagName === 'DIV' && el.style?.cursor === 'pointer',
  ) ?? document.querySelector('[style*="cursor: pointer"]')
  fireEvent.click(selector!)
}

/** Get the dropdown container */
function getDropdown(container: HTMLElement) {
  return container.querySelector('.j-treeselect-dropdown') as HTMLElement | null
}

/** Get all visible tree node rows (they have data-value) */
function getNodes(container: HTMLElement) {
  return container.querySelectorAll('[data-value]')
}

/** Get a specific node by value */
function getNode(container: HTMLElement, value: string) {
  return container.querySelector(`[data-value="${value}"]`) as HTMLElement | null
}

/** Click the switcher (expand/collapse) icon on a node */
function clickSwitcher(node: HTMLElement) {
  // Switcher is a span with cursor: pointer inside the node row
  const switchers = node.querySelectorAll('span[style*="cursor: pointer"]')
  // First one with width: 1.5rem is the switcher
  const switcher = Array.from(switchers).find(
    (s) => (s as HTMLElement).style.width === '1.5rem',
  )
  if (switcher) fireEvent.click(switcher)
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('TreeSelect – Basic rendering', () => {
  it('renders selector with placeholder', () => {
    render(<TreeSelect treeData={treeData} placeholder="Select..." />)
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })

  it('renders suffix chevron icon', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(1)
  })

  it('does not render dropdown by default', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    expect(getDropdown(container)).toBeNull()
  })

  it('applies className to root', () => {
    const { container } = render(<TreeSelect treeData={treeData} className="my-ts" />)
    expect(container.firstElementChild).toHaveClass('my-ts')
  })

  it('applies style to root', () => {
    const { container } = render(<TreeSelect treeData={treeData} style={{ margin: '10px' }} />)
    expect((container.firstElementChild as HTMLElement).style.margin).toBe('10px')
  })
})

// ============================================================================
// Open / close dropdown
// ============================================================================

describe('TreeSelect – Open / close', () => {
  it('opens dropdown on selector click', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    fireEvent.click(container.querySelector('[style*="cursor: pointer"]')!)
    expect(getDropdown(container)).toBeTruthy()
  })

  it('opens dropdown with controlled open prop', () => {
    const { container } = render(<TreeSelect treeData={treeData} open />)
    expect(getDropdown(container)).toBeTruthy()
  })

  it('closes dropdown on click outside', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    fireEvent.click(container.querySelector('[style*="cursor: pointer"]')!)
    expect(getDropdown(container)).toBeTruthy()
    fireEvent.mouseDown(document.body)
    expect(getDropdown(container)).toBeNull()
  })

  it('calls onDropdownVisibleChange when opening', () => {
    const onDropdownVisibleChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} onDropdownVisibleChange={onDropdownVisibleChange} />,
    )
    fireEvent.click(container.querySelector('[style*="cursor: pointer"]')!)
    expect(onDropdownVisibleChange).toHaveBeenCalledWith(true)
  })

  it('closes dropdown on Escape', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    fireEvent.click(container.querySelector('[style*="cursor: pointer"]')!)
    expect(getDropdown(container)).toBeTruthy()
    fireEvent.keyDown(container.firstElementChild!, { key: 'Escape' })
    expect(getDropdown(container)).toBeNull()
  })
})

// ============================================================================
// Tree rendering
// ============================================================================

describe('TreeSelect – Tree nodes', () => {
  it('renders top-level nodes when opened', () => {
    const { container } = render(<TreeSelect treeData={treeData} open />)
    // Only top-level visible initially (collapsed)
    expect(getNode(container, 'parent1')).toBeTruthy()
    expect(getNode(container, 'parent2')).toBeTruthy()
    expect(getNode(container, 'leaf1')).toBeTruthy()
  })

  it('does not render children when collapsed', () => {
    const { container } = render(<TreeSelect treeData={treeData} open />)
    expect(getNode(container, 'child1')).toBeNull()
    expect(getNode(container, 'child2')).toBeNull()
  })

  it('expands node on switcher click', () => {
    const { container } = render(<TreeSelect treeData={treeData} open />)
    clickSwitcher(getNode(container, 'parent1')!)
    expect(getNode(container, 'child1')).toBeTruthy()
    expect(getNode(container, 'child2')).toBeTruthy()
  })

  it('collapses node on second switcher click', () => {
    const { container } = render(<TreeSelect treeData={treeData} open />)
    clickSwitcher(getNode(container, 'parent1')!)
    expect(getNode(container, 'child1')).toBeTruthy()
    clickSwitcher(getNode(container, 'parent1')!)
    expect(getNode(container, 'child1')).toBeNull()
  })

  it('expands all with treeDefaultExpandAll', () => {
    const { container } = render(<TreeSelect treeData={treeData} open treeDefaultExpandAll />)
    expect(getNode(container, 'child1')).toBeTruthy()
    expect(getNode(container, 'child2')).toBeTruthy()
    expect(getNode(container, 'child3')).toBeTruthy()
  })

  it('expands specific keys with treeDefaultExpandedKeys', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} open treeDefaultExpandedKeys={['parent2']} />,
    )
    expect(getNode(container, 'child1')).toBeNull() // parent1 not expanded
    expect(getNode(container, 'child3')).toBeTruthy() // parent2 expanded
  })

  it('shows "No data" when treeData is empty', () => {
    render(<TreeSelect treeData={[]} open />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('shows custom notFoundContent', () => {
    render(<TreeSelect treeData={[]} open notFoundContent="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })
})

// ============================================================================
// Single select
// ============================================================================

describe('TreeSelect – Single select', () => {
  it('selects a leaf node on click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} open onChange={onChange} />,
    )
    fireEvent.click(getNode(container, 'leaf1')!)
    expect(onChange).toHaveBeenCalledWith('leaf1', expect.any(Array), expect.objectContaining({ triggerValue: 'leaf1' }))
  })

  it('closes dropdown after single select', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    fireEvent.click(container.querySelector('[style*="cursor: pointer"]')!)
    fireEvent.click(getNode(container, 'leaf1')!)
    expect(getDropdown(container)).toBeNull()
  })

  it('displays selected value in selector', () => {
    render(<TreeSelect treeData={treeData} value="leaf1" />)
    expect(screen.getByText('Leaf 1')).toBeInTheDocument()
  })

  it('displays defaultValue', () => {
    render(<TreeSelect treeData={treeData} defaultValue="leaf1" />)
    expect(screen.getByText('Leaf 1')).toBeInTheDocument()
  })

  it('selects parent node if selectable', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} open treeDefaultExpandAll onChange={onChange} />,
    )
    fireEvent.click(getNode(container, 'parent1')!)
    expect(onChange).toHaveBeenCalledWith('parent1', expect.any(Array), expect.any(Object))
  })

  it('does not select disabled node', () => {
    const data: TreeSelectTreeData[] = [
      { value: 'a', title: 'A', disabled: true },
      { value: 'b', title: 'B' },
    ]
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={data} open onChange={onChange} />,
    )
    fireEvent.click(getNode(container, 'a')!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not select node with selectable=false', () => {
    const data: TreeSelectTreeData[] = [
      { value: 'a', title: 'A', selectable: false },
      { value: 'b', title: 'B' },
    ]
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={data} open onChange={onChange} />,
    )
    fireEvent.click(getNode(container, 'a')!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('updates display when controlled value changes', () => {
    const { rerender } = render(<TreeSelect treeData={treeData} value="leaf1" />)
    expect(screen.getByText('Leaf 1')).toBeInTheDocument()
    rerender(<TreeSelect treeData={treeData} value="parent2" />)
    expect(screen.getByText('Parent 2')).toBeInTheDocument()
  })
})

// ============================================================================
// Multiple select (no checkbox)
// ============================================================================

describe('TreeSelect – Multiple select', () => {
  it('renders tags for multiple values', () => {
    render(
      <TreeSelect treeData={treeData} multiple defaultValue={['leaf1', 'parent2']} />,
    )
    expect(screen.getByText('Leaf 1')).toBeInTheDocument()
    expect(screen.getByText('Parent 2')).toBeInTheDocument()
  })

  it('does not close dropdown after selecting in multiple mode', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} multiple open treeDefaultExpandAll />,
    )
    fireEvent.click(getNode(container, 'child1')!)
    expect(getDropdown(container)).toBeTruthy()
  })

  it('toggles selection on second click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} multiple open defaultValue={['leaf1']} onChange={onChange} />,
    )
    fireEvent.click(getNode(container, 'leaf1')!)
    // Should remove leaf1
    expect(onChange).toHaveBeenCalledWith([], expect.any(Array), expect.any(Object))
  })

  it('removes tag on close icon click', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} multiple defaultValue={['leaf1', 'parent2']} onChange={onChange} />,
    )
    // Find close icons (CloseTagIcon SVGs)
    const closeIcons = container.querySelectorAll('span[style*="cursor: pointer"][style*="margin-left"]')
    fireEvent.click(closeIcons[0])
    expect(onChange).toHaveBeenCalled()
  })

  it('shows placeholder when no values selected', () => {
    render(<TreeSelect treeData={treeData} multiple placeholder="Choose..." />)
    expect(screen.getByText('Choose...')).toBeInTheDocument()
  })
})

// ============================================================================
// Checkable mode
// ============================================================================

describe('TreeSelect – Checkable', () => {
  it('shows checkboxes on tree nodes', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} treeCheckable open treeDefaultExpandAll />,
    )
    // Checkboxes are spans with 0.875rem width
    const checkboxes = getDropdown(container)!.querySelectorAll('[style*="0.875rem"]')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('checks a node and cascades to children', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} treeCheckable open treeDefaultExpandAll onChange={onChange} />,
    )
    fireEvent.click(getNode(container, 'parent1')!)
    // Should check parent1, child1, child2
    expect(onChange).toHaveBeenCalled()
    const checkedValues = onChange.mock.calls[0][0] as (string | number)[]
    expect(checkedValues).toContain('parent1')
    expect(checkedValues).toContain('child1')
    expect(checkedValues).toContain('child2')
  })

  it('unchecks parent when child is unchecked', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        open
        treeDefaultExpandAll
        value={['parent1', 'child1', 'child2']}
        onChange={onChange}
      />,
    )
    fireEvent.click(getNode(container, 'child1')!)
    expect(onChange).toHaveBeenCalled()
    const newValues = onChange.mock.calls[0][0] as (string | number)[]
    expect(newValues).not.toContain('parent1')
    expect(newValues).not.toContain('child1')
    expect(newValues).toContain('child2')
  })

  it('strictly checks without cascade when treeCheckStrictly', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        treeCheckStrictly
        open
        treeDefaultExpandAll
        onChange={onChange}
      />,
    )
    fireEvent.click(getNode(container, 'parent1')!)
    expect(onChange).toHaveBeenCalled()
    const checkedValues = onChange.mock.calls[0][0] as (string | number)[]
    expect(checkedValues).toEqual(['parent1'])
  })

  it('does not check node with disableCheckbox', () => {
    const data: TreeSelectTreeData[] = [
      { value: 'a', title: 'A', disableCheckbox: true },
      { value: 'b', title: 'B' },
    ]
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={data} treeCheckable open onChange={onChange} />,
    )
    fireEvent.click(getNode(container, 'a')!)
    expect(onChange).not.toHaveBeenCalled()
  })
})

// ============================================================================
// showCheckedStrategy
// ============================================================================

describe('TreeSelect – showCheckedStrategy', () => {
  it('SHOW_CHILD: only leaf values appear as tags', () => {
    render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        showCheckedStrategy="SHOW_CHILD"
        value={['parent1', 'child1', 'child2']}
      />,
    )
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.queryByText('Parent 1')).not.toBeInTheDocument()
  })

  it('SHOW_PARENT: parent tag shown when all children checked', () => {
    render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        showCheckedStrategy="SHOW_PARENT"
        value={['parent1', 'child1', 'child2']}
      />,
    )
    expect(screen.getByText('Parent 1')).toBeInTheDocument()
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Child 2')).not.toBeInTheDocument()
  })

  it('SHOW_ALL (default): all checked values appear as tags', () => {
    render(
      <TreeSelect
        treeData={treeData}
        treeCheckable
        value={['parent1', 'child1', 'child2']}
      />,
    )
    expect(screen.getByText('Parent 1')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('exports strategy constants', () => {
    expect(TreeSelect.SHOW_ALL).toBe('SHOW_ALL')
    expect(TreeSelect.SHOW_PARENT).toBe('SHOW_PARENT')
    expect(TreeSelect.SHOW_CHILD).toBe('SHOW_CHILD')
  })
})

// ============================================================================
// maxTagCount
// ============================================================================

describe('TreeSelect – maxTagCount', () => {
  it('limits visible tags and shows +N', () => {
    render(
      <TreeSelect
        treeData={treeData}
        multiple
        defaultValue={['leaf1', 'parent1', 'parent2']}
        maxTagCount={1}
      />,
    )
    // Only 1 visible tag + "+2" overflow tag
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('uses custom maxTagPlaceholder', () => {
    render(
      <TreeSelect
        treeData={treeData}
        multiple
        defaultValue={['leaf1', 'parent1', 'parent2']}
        maxTagCount={1}
        maxTagPlaceholder={(vals) => `${vals.length} more`}
      />,
    )
    expect(screen.getByText('2 more')).toBeInTheDocument()
  })
})

// ============================================================================
// Search
// ============================================================================

describe('TreeSelect – Search', () => {
  it('does not show search input by default', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    expect(container.querySelector('input[type="text"]')).toBeNull()
  })

  it('shows search input when showSearch=true and dropdown is open', () => {
    const { container } = render(<TreeSelect treeData={treeData} showSearch open />)
    expect(container.querySelector('input[type="text"]')).toBeTruthy()
  })

  it('filters tree nodes by search', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} showSearch open treeDefaultExpandAll />,
    )
    const input = container.querySelector('input[type="text"]')!
    fireEvent.change(input, { target: { value: 'Child 1' } })
    // Only matching nodes + ancestors should be visible
    expect(getNode(container, 'child1')).toBeTruthy()
    // Non-matching branch should be hidden
    expect(getNode(container, 'leaf1')).toBeNull()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} showSearch open onSearch={onSearch} />,
    )
    const input = container.querySelector('input[type="text"]')!
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('shows "No data" when search matches nothing', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} showSearch open treeDefaultExpandAll />,
    )
    const input = container.querySelector('input[type="text"]')!
    fireEvent.change(input, { target: { value: 'zzzzz' } })
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('does not filter when filterTreeNode=false', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} showSearch open treeDefaultExpandAll filterTreeNode={false} />,
    )
    const input = container.querySelector('input[type="text"]')!
    fireEvent.change(input, { target: { value: 'zzz' } })
    // All nodes still visible
    expect(getNode(container, 'leaf1')).toBeTruthy()
    expect(getNode(container, 'child1')).toBeTruthy()
  })
})

// ============================================================================
// AllowClear
// ============================================================================

describe('TreeSelect – AllowClear', () => {
  it('shows clear button when allowClear and value set', () => {
    render(
      <TreeSelect treeData={treeData} allowClear value="leaf1" />,
    )
    expect(screen.getByLabelText('Clear')).toBeInTheDocument()
  })

  it('does not show clear button when no value', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} allowClear />,
    )
    expect(container.querySelector('[aria-label="Clear"]')).toBeNull()
  })

  it('clears value on clear click', () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(
      <TreeSelect treeData={treeData} allowClear defaultValue="leaf1" onChange={onChange} onClear={onClear} />,
    )
    fireEvent.click(screen.getByLabelText('Clear'))
    expect(onChange).toHaveBeenCalled()
    expect(onClear).toHaveBeenCalled()
  })

  it('does not show clear button when disabled', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} allowClear value="leaf1" disabled />,
    )
    expect(container.querySelector('[aria-label="Clear"]')).toBeNull()
  })
})

// ============================================================================
// Disabled
// ============================================================================

describe('TreeSelect – Disabled', () => {
  it('applies not-allowed cursor', () => {
    const { container } = render(<TreeSelect treeData={treeData} disabled />)
    const selector = container.querySelector('[style*="cursor"]') as HTMLElement
    expect(selector.style.cursor).toBe('not-allowed')
  })

  it('applies opacity 0.5', () => {
    const { container } = render(<TreeSelect treeData={treeData} disabled />)
    const selector = container.querySelector('[style*="opacity"]') as HTMLElement
    expect(selector.style.opacity).toBe('0.5')
  })

  it('does not open dropdown when disabled', () => {
    const { container } = render(<TreeSelect treeData={treeData} disabled />)
    fireEvent.click(container.querySelector('[style*="not-allowed"]')!)
    expect(getDropdown(container)).toBeNull()
  })
})

// ============================================================================
// Sizes
// ============================================================================

describe('TreeSelect – Sizes', () => {
  it('applies large size min-height', () => {
    const { container } = render(<TreeSelect treeData={treeData} size="large" />)
    const selector = container.querySelector('[style*="min-height"]') as HTMLElement
    expect(selector.style.minHeight).toBe('2.5rem')
  })

  it('applies middle size min-height (default)', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    const selector = container.querySelector('[style*="min-height"]') as HTMLElement
    expect(selector.style.minHeight).toBe('2.25rem')
  })

  it('applies small size min-height', () => {
    const { container } = render(<TreeSelect treeData={treeData} size="small" />)
    const selector = container.querySelector('[style*="min-height"]') as HTMLElement
    expect(selector.style.minHeight).toBe('1.75rem')
  })
})

// ============================================================================
// Variants
// ============================================================================

describe('TreeSelect – Variants', () => {
  it('outlined variant has solid border', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    const selector = container.querySelector('[style*="border"]') as HTMLElement
    expect(selector.style.border).toContain('1px solid')
  })

  it('filled variant has muted background', () => {
    const { container } = render(<TreeSelect treeData={treeData} variant="filled" />)
    const selector = container.querySelector('[style*="min-height"]') as HTMLElement
    expect(selector.style.backgroundColor).toContain('var(--j-bgMuted)')
  })
})

// ============================================================================
// Status
// ============================================================================

describe('TreeSelect – Status', () => {
  it('applies error border color', () => {
    const { container } = render(<TreeSelect treeData={treeData} status="error" />)
    const selector = container.querySelector('[style*="border-color"]') as HTMLElement
    expect(selector.style.borderColor).toContain('var(--j-error)')
  })

  it('applies warning border color', () => {
    const { container } = render(<TreeSelect treeData={treeData} status="warning" />)
    const selector = container.querySelector('[style*="border-color"]') as HTMLElement
    expect(selector.style.borderColor).toContain('var(--j-warning)')
  })
})

// ============================================================================
// fieldNames
// ============================================================================

describe('TreeSelect – fieldNames', () => {
  it('uses custom fieldNames', () => {
    const customData = [
      { id: 'a', name: 'Alpha', items: [{ id: 'b', name: 'Beta' }] },
    ]
    render(
      <TreeSelect
        treeData={customData as any}
        fieldNames={{ value: 'id', label: 'name', children: 'items' }}
        value="a"
      />,
    )
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })
})

// ============================================================================
// Keyboard navigation
// ============================================================================

describe('TreeSelect – Keyboard', () => {
  it('opens dropdown on ArrowDown', () => {
    const { container } = render(<TreeSelect treeData={treeData} />)
    fireEvent.keyDown(container.firstElementChild!, { key: 'ArrowDown' })
    expect(getDropdown(container)).toBeTruthy()
  })

  it('navigates down with ArrowDown', () => {
    const { container } = render(<TreeSelect treeData={treeData} open />)
    const root = container.firstElementChild!
    fireEvent.keyDown(root, { key: 'ArrowDown' })
    // First node should be focused (has outline)
    const focusedNode = getNode(container, 'parent1')
    expect(focusedNode?.style.outline).toContain('2px solid')
  })

  it('selects with Enter on focused node', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} open onChange={onChange} />,
    )
    const root = container.firstElementChild!
    // Navigate to leaf1 (3rd node: parent1, parent2, leaf1)
    fireEvent.keyDown(root, { key: 'ArrowDown' })
    fireEvent.keyDown(root, { key: 'ArrowDown' })
    fireEvent.keyDown(root, { key: 'ArrowDown' })
    fireEvent.keyDown(root, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('leaf1', expect.any(Array), expect.any(Object))
  })

  it('expands node with ArrowRight', () => {
    const { container } = render(<TreeSelect treeData={treeData} open />)
    const root = container.firstElementChild!
    fireEvent.keyDown(root, { key: 'ArrowDown' }) // Focus parent1
    fireEvent.keyDown(root, { key: 'ArrowRight' }) // Expand
    expect(getNode(container, 'child1')).toBeTruthy()
  })

  it('collapses node with ArrowLeft', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} open treeDefaultExpandAll />,
    )
    const root = container.firstElementChild!
    fireEvent.keyDown(root, { key: 'ArrowDown' }) // Focus parent1
    fireEvent.keyDown(root, { key: 'ArrowLeft' }) // Collapse
    expect(getNode(container, 'child1')).toBeNull()
  })

  it('removes last tag on Backspace in multi mode', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} multiple showSearch open defaultValue={['leaf1', 'parent2']} onChange={onChange} />,
    )
    const input = container.querySelector('input[type="text"]')!
    fireEvent.keyDown(input, { key: 'Backspace' })
    expect(onChange).toHaveBeenCalled()
  })
})

// ============================================================================
// Semantic classNames & styles
// ============================================================================

describe('TreeSelect – Semantic classNames & styles', () => {
  it('applies classNames.root to root', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} classNames={{ root: 'r-cls' }} />,
    )
    expect(container.firstElementChild).toHaveClass('r-cls')
  })

  it('applies classNames.selector to selector div', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} classNames={{ selector: 's-cls' }} />,
    )
    expect(container.querySelector('.s-cls')).toBeTruthy()
  })

  it('applies classNames.dropdown to dropdown', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} open classNames={{ dropdown: 'd-cls' }} />,
    )
    expect(container.querySelector('.d-cls')).toBeTruthy()
  })

  it('applies classNames.node to tree nodes', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} open classNames={{ node: 'n-cls' }} />,
    )
    const nodeEls = container.querySelectorAll('.n-cls')
    expect(nodeEls.length).toBeGreaterThanOrEqual(3)
  })

  it('applies classNames.tag to tags', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} multiple defaultValue={['leaf1']} classNames={{ tag: 't-cls' }} />,
    )
    expect(container.querySelector('.t-cls')).toBeTruthy()
  })

  it('applies styles.root to root', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} styles={{ root: { padding: '5px' } }} />,
    )
    expect((container.firstElementChild as HTMLElement).style.padding).toBe('5px')
  })
})

// ============================================================================
// Prefix / suffix
// ============================================================================

describe('TreeSelect – Prefix / suffix', () => {
  it('renders custom prefix', () => {
    render(
      <TreeSelect treeData={treeData} prefix={<span data-testid="pfx">P</span>} />,
    )
    expect(screen.getByTestId('pfx')).toBeInTheDocument()
  })

  it('renders custom suffixIcon', () => {
    render(
      <TreeSelect treeData={treeData} suffixIcon={<span data-testid="sfx">S</span>} />,
    )
    expect(screen.getByTestId('sfx')).toBeInTheDocument()
  })
})

// ============================================================================
// dropdownRender
// ============================================================================

describe('TreeSelect – dropdownRender', () => {
  it('wraps tree content with dropdownRender', () => {
    render(
      <TreeSelect
        treeData={treeData}
        open
        dropdownRender={(menu) => <div data-testid="wrapper">{menu}</div>}
      />,
    )
    expect(screen.getByTestId('wrapper')).toBeInTheDocument()
  })
})

// ============================================================================
// onTreeExpand
// ============================================================================

describe('TreeSelect – onTreeExpand', () => {
  it('calls onTreeExpand when expanding', () => {
    const onTreeExpand = vi.fn()
    const { container } = render(
      <TreeSelect treeData={treeData} open onTreeExpand={onTreeExpand} />,
    )
    clickSwitcher(getNode(container, 'parent1')!)
    expect(onTreeExpand).toHaveBeenCalledWith(expect.arrayContaining(['parent1']))
  })
})

// ============================================================================
// treeLine
// ============================================================================

describe('TreeSelect – treeLine', () => {
  it('renders with treeLine class styles', () => {
    const { container } = render(
      <TreeSelect treeData={treeData} open treeDefaultExpandAll treeLine />,
    )
    // Nodes should render — check that children are visible
    expect(getNode(container, 'child1')).toBeTruthy()
    expect(getNode(container, 'child2')).toBeTruthy()
  })
})

// ============================================================================
// maxCount
// ============================================================================

describe('TreeSelect – maxCount', () => {
  it('does not allow more selections than maxCount', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TreeSelect
        treeData={treeData}
        multiple
        open
        treeDefaultExpandAll
        defaultValue={['leaf1', 'child1']}
        maxCount={2}
        onChange={onChange}
      />,
    )
    // Try to select a third item
    fireEvent.click(getNode(container, 'child3')!)
    expect(onChange).not.toHaveBeenCalled()
  })
})
