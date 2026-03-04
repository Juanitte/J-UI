import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Tree } from '../Tree'
import type { TreeData } from '../Tree'

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getRoot(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

function getItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('[role="treeitem"]'))
}

function getItem(container: HTMLElement, key: string): HTMLElement | null {
  return container.querySelector(`[data-key="${key}"]`)
}

function getSwitcher(item: HTMLElement): HTMLElement | null {
  // Switcher is the span with cursor:pointer before title that contains an SVG
  const spans = Array.from(item.children) as HTMLElement[]
  return spans.find((s) => s.style.cursor === 'pointer' && s.querySelector('svg')) ?? null
}

function getCheckbox(item: HTMLElement): HTMLElement | null {
  // Checkbox is an inline-flex span with border-radius 0.1875rem and width 0.875rem
  const spans = Array.from(item.children) as HTMLElement[]
  return spans.find((s) => s.style.width === '0.875rem' && s.style.height === '0.875rem') ?? null
}

function getTitleSpan(item: HTMLElement): HTMLElement | null {
  // Title is the span with flex:1
  const spans = Array.from(item.children) as HTMLElement[]
  return spans.find((s) => {
    const flex = s.style.flex
    return flex && (flex === '1' || flex.startsWith('1'))
  }) ?? null
}

// ─── Default test data ──────────────────────────────────────────────────────────

const treeData: TreeData[] = [
  {
    key: 'parent-1',
    title: 'Parent 1',
    children: [
      { key: 'child-1-1', title: 'Child 1-1' },
      {
        key: 'child-1-2',
        title: 'Child 1-2',
        children: [
          { key: 'grandchild-1', title: 'Grandchild 1' },
        ],
      },
    ],
  },
  {
    key: 'parent-2',
    title: 'Parent 2',
    children: [
      { key: 'child-2-1', title: 'Child 2-1' },
    ],
  },
  { key: 'leaf', title: 'Leaf node' },
]

// ============================================================================
// Basic rendering
// ============================================================================

describe('Tree', () => {
  describe('basic rendering', () => {
    it('renders root with role="tree"', () => {
      const { container } = render(<Tree treeData={treeData} />)
      expect(getRoot(container).getAttribute('role')).toBe('tree')
    })

    it('root has tabIndex=0', () => {
      const { container } = render(<Tree treeData={treeData} />)
      expect(getRoot(container).getAttribute('tabindex')).toBe('0')
    })

    it('renders all nodes as treeitems (children in DOM even when collapsed)', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const items = getItems(container)
      // All nodes are rendered in DOM (collapsed via grid-template-rows: 0fr)
      expect(items.length).toBeGreaterThanOrEqual(3)
      expect(getItem(container, 'parent-1')).toBeTruthy()
      expect(getItem(container, 'parent-2')).toBeTruthy()
      expect(getItem(container, 'leaf')).toBeTruthy()
    })

    it('nodes display their titles', () => {
      const { container } = render(<Tree treeData={treeData} />)
      expect(getItem(container, 'parent-1')!.textContent).toContain('Parent 1')
      expect(getItem(container, 'parent-2')!.textContent).toContain('Parent 2')
      expect(getItem(container, 'leaf')!.textContent).toContain('Leaf node')
    })

    it('nodes have data-key attribute', () => {
      const { container } = render(<Tree treeData={treeData} />)
      expect(getItem(container, 'parent-1')).toBeTruthy()
      expect(getItem(container, 'parent-2')).toBeTruthy()
      expect(getItem(container, 'leaf')).toBeTruthy()
    })

    it('parent nodes have aria-expanded=false by default', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const parent = getItem(container, 'parent-1')!
      expect(parent.getAttribute('aria-expanded')).toBe('false')
    })

    it('leaf nodes do not have aria-expanded', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const leaf = getItem(container, 'leaf')!
      expect(leaf.getAttribute('aria-expanded')).toBeNull()
    })

    it('renders empty tree without errors', () => {
      const { container } = render(<Tree treeData={[]} />)
      expect(getRoot(container)).toBeTruthy()
      expect(getItems(container).length).toBe(0)
    })

    it('root has correct base styles', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      expect(root.style.fontSize).toBe('0.875rem')
      expect(root.style.lineHeight).toBe('1.5')
    })
  })

  // ============================================================================
  // Expansion
  // ============================================================================

  describe('expansion', () => {
    it('clicking switcher expands a node', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const parent = getItem(container, 'parent-1')!
      const switcher = getSwitcher(parent)!
      fireEvent.click(switcher)
      // Children should now be visible
      expect(getItem(container, 'child-1-1')).toBeTruthy()
      expect(getItem(container, 'child-1-2')).toBeTruthy()
    })

    it('clicking switcher again collapses', () => {
      const { container } = render(<Tree treeData={treeData} defaultExpandedKeys={['parent-1']} />)
      expect(getItem(container, 'child-1-1')).toBeTruthy()
      const parent = getItem(container, 'parent-1')!
      const switcher = getSwitcher(parent)!
      fireEvent.click(switcher)
      // aria-expanded should now be false
      expect(parent.getAttribute('aria-expanded')).toBe('false')
    })

    it('defaultExpandedKeys expands specified nodes', () => {
      const { container } = render(
        <Tree treeData={treeData} defaultExpandedKeys={['parent-1', 'child-1-2']} />,
      )
      expect(getItem(container, 'child-1-1')).toBeTruthy()
      expect(getItem(container, 'grandchild-1')).toBeTruthy()
    })

    it('defaultExpandAll expands all parent nodes', () => {
      const { container } = render(<Tree treeData={treeData} defaultExpandAll />)
      expect(getItem(container, 'child-1-1')).toBeTruthy()
      expect(getItem(container, 'child-1-2')).toBeTruthy()
      expect(getItem(container, 'grandchild-1')).toBeTruthy()
      expect(getItem(container, 'child-2-1')).toBeTruthy()
    })

    it('controlled expandedKeys determines expansion', () => {
      const { container } = render(
        <Tree treeData={treeData} expandedKeys={['parent-2']} />,
      )
      // parent-2 is expanded
      expect(getItem(container, 'parent-2')!.getAttribute('aria-expanded')).toBe('true')
      // parent-1 is NOT expanded
      expect(getItem(container, 'parent-1')!.getAttribute('aria-expanded')).toBe('false')
    })

    it('onExpand fires when toggling', () => {
      const onExpand = vi.fn()
      const { container } = render(<Tree treeData={treeData} onExpand={onExpand} />)
      const parent = getItem(container, 'parent-1')!
      fireEvent.click(getSwitcher(parent)!)
      expect(onExpand).toHaveBeenCalledWith(
        ['parent-1'],
        expect.objectContaining({ expanded: true }),
      )
    })

    it('autoExpandParent expands ancestors of defaultExpandedKeys', () => {
      const { container } = render(
        <Tree treeData={treeData} defaultExpandedKeys={['child-1-2']} autoExpandParent />,
      )
      // parent-1 should be auto-expanded because child-1-2 needs it
      expect(getItem(container, 'child-1-2')).toBeTruthy()
    })
  })

  // ============================================================================
  // Selection
  // ============================================================================

  describe('selection', () => {
    it('clicking a node selects it', () => {
      const onSelect = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} onSelect={onSelect} />,
      )
      const leaf = getItem(container, 'leaf')!
      fireEvent.click(leaf)
      expect(onSelect).toHaveBeenCalledWith(
        ['leaf'],
        expect.objectContaining({ selected: true }),
      )
    })

    it('clicking same node again deselects', () => {
      const onSelect = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} defaultSelectedKeys={['leaf']} onSelect={onSelect} />,
      )
      const leaf = getItem(container, 'leaf')!
      fireEvent.click(leaf)
      expect(onSelect).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ selected: false }),
      )
    })

    it('selected node has aria-selected=true', () => {
      const { container } = render(
        <Tree treeData={treeData} defaultSelectedKeys={['leaf']} />,
      )
      const leaf = getItem(container, 'leaf')!
      expect(leaf.getAttribute('aria-selected')).toBe('true')
    })

    it('unselected node has aria-selected=false', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const leaf = getItem(container, 'leaf')!
      expect(leaf.getAttribute('aria-selected')).toBe('false')
    })

    it('multiple selection works', () => {
      const onSelect = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} multiple defaultSelectedKeys={['leaf']} onSelect={onSelect} />,
      )
      const parent = getItem(container, 'parent-1')!
      fireEvent.click(parent)
      expect(onSelect).toHaveBeenCalledWith(
        expect.arrayContaining(['leaf', 'parent-1']),
        expect.anything(),
      )
    })

    it('selectable={false} disables selection', () => {
      const onSelect = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} selectable={false} onSelect={onSelect} />,
      )
      fireEvent.click(getItem(container, 'leaf')!)
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('node-level selectable={false} prevents selection', () => {
      const data: TreeData[] = [{ key: 'a', title: 'A', selectable: false }]
      const onSelect = vi.fn()
      const { container } = render(
        <Tree treeData={data} onSelect={onSelect} />,
      )
      fireEvent.click(getItem(container, 'a')!)
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('controlled selectedKeys', () => {
      const { container } = render(
        <Tree treeData={treeData} selectedKeys={['parent-2']} />,
      )
      expect(getItem(container, 'parent-2')!.getAttribute('aria-selected')).toBe('true')
      expect(getItem(container, 'leaf')!.getAttribute('aria-selected')).toBe('false')
    })

    it('selected node title has primary color', () => {
      const { container } = render(
        <Tree treeData={treeData} defaultSelectedKeys={['leaf']} />,
      )
      const leaf = getItem(container, 'leaf')!
      const title = getTitleSpan(leaf)!
      expect(title.style.fontWeight).toBe('600')
    })
  })

  // ============================================================================
  // Checkable
  // ============================================================================

  describe('checkable', () => {
    it('renders checkboxes when checkable={true}', () => {
      const { container } = render(<Tree treeData={treeData} checkable />)
      const items = getItems(container)
      items.forEach((item) => {
        expect(getCheckbox(item)).toBeTruthy()
      })
    })

    it('no checkboxes by default', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const items = getItems(container)
      items.forEach((item) => {
        expect(getCheckbox(item)).toBeNull()
      })
    })

    it('clicking node checks it', () => {
      const onCheck = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} checkable onCheck={onCheck} />,
      )
      fireEvent.click(getItem(container, 'leaf')!)
      expect(onCheck).toHaveBeenCalledWith(
        expect.arrayContaining(['leaf']),
        expect.objectContaining({ checked: true }),
      )
    })

    it('cascade check: checking parent checks all children', () => {
      const onCheck = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} checkable onCheck={onCheck} />,
      )
      fireEvent.click(getItem(container, 'parent-2')!)
      const checkedKeys = onCheck.mock.calls[0][0] as string[]
      expect(checkedKeys).toContain('parent-2')
      expect(checkedKeys).toContain('child-2-1')
    })

    it('cascade check: checking all children checks parent', () => {
      const onCheck = vi.fn()
      // parent-2 has one child: child-2-1
      const { container } = render(
        <Tree treeData={treeData} checkable defaultExpandedKeys={['parent-2']} onCheck={onCheck} />,
      )
      fireEvent.click(getItem(container, 'child-2-1')!)
      const checkedKeys = onCheck.mock.calls[0][0] as string[]
      expect(checkedKeys).toContain('parent-2')
      expect(checkedKeys).toContain('child-2-1')
    })

    it('checkStrictly prevents cascade', () => {
      const onCheck = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} checkable checkStrictly onCheck={onCheck} />,
      )
      fireEvent.click(getItem(container, 'parent-2')!)
      const result = onCheck.mock.calls[0][0] as { checked: string[]; halfChecked: string[] }
      // checkStrictly returns { checked, halfChecked } format
      expect(result.checked).toContain('parent-2')
      expect(result.checked).not.toContain('child-2-1')
    })

    it('defaultCheckedKeys initializes checked state', () => {
      const { container } = render(
        <Tree treeData={treeData} checkable defaultCheckedKeys={['leaf']} />,
      )
      const leaf = getItem(container, 'leaf')!
      const checkbox = getCheckbox(leaf)!
      // Checked checkbox has non-transparent bg
      expect(checkbox.style.backgroundColor).not.toBe('transparent')
    })

    it('controlled checkedKeys', () => {
      const { container } = render(
        <Tree treeData={treeData} checkable checkedKeys={['leaf']} />,
      )
      const leaf = getItem(container, 'leaf')!
      const checkbox = getCheckbox(leaf)!
      expect(checkbox.style.backgroundColor).not.toBe('transparent')
    })

    it('node-level checkable={false} hides checkbox', () => {
      const data: TreeData[] = [{ key: 'a', title: 'A', checkable: false }]
      const { container } = render(<Tree treeData={data} checkable />)
      expect(getCheckbox(getItem(container, 'a')!)).toBeNull()
    })

    it('disableCheckbox prevents checking', () => {
      const onCheck = vi.fn()
      const data: TreeData[] = [{ key: 'a', title: 'A', disableCheckbox: true }]
      const { container } = render(
        <Tree treeData={data} checkable onCheck={onCheck} />,
      )
      fireEvent.click(getItem(container, 'a')!)
      expect(onCheck).not.toHaveBeenCalled()
    })

    it('unchecked checkbox is transparent', () => {
      const { container } = render(<Tree treeData={treeData} checkable />)
      const leaf = getItem(container, 'leaf')!
      const checkbox = getCheckbox(leaf)!
      expect(checkbox.style.backgroundColor).toBe('transparent')
    })
  })

  // ============================================================================
  // Disabled
  // ============================================================================

  describe('disabled', () => {
    it('globally disabled tree shows not-allowed cursor', () => {
      const { container } = render(<Tree treeData={treeData} disabled />)
      const items = getItems(container)
      items.forEach((item) => {
        expect(item.style.cursor).toBe('not-allowed')
      })
    })

    it('globally disabled tree has reduced opacity', () => {
      const { container } = render(<Tree treeData={treeData} disabled />)
      const items = getItems(container)
      items.forEach((item) => {
        expect(item.style.opacity).toBe('0.5')
      })
    })

    it('globally disabled prevents selection', () => {
      const onSelect = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} disabled onSelect={onSelect} />,
      )
      fireEvent.click(getItem(container, 'leaf')!)
      expect(onSelect).not.toHaveBeenCalled()
    })

    it('node-level disabled', () => {
      const data: TreeData[] = [
        { key: 'a', title: 'A', disabled: true },
        { key: 'b', title: 'B' },
      ]
      const { container } = render(<Tree treeData={data} />)
      expect(getItem(container, 'a')!.style.cursor).toBe('not-allowed')
      expect(getItem(container, 'b')!.style.cursor).toBe('pointer')
    })

    it('disabled node prevents check', () => {
      const onCheck = vi.fn()
      const data: TreeData[] = [{ key: 'a', title: 'A', disabled: true }]
      const { container } = render(
        <Tree treeData={data} checkable onCheck={onCheck} />,
      )
      fireEvent.click(getItem(container, 'a')!)
      expect(onCheck).not.toHaveBeenCalled()
    })
  })

  // ============================================================================
  // Show line
  // ============================================================================

  describe('showLine', () => {
    it('showLine renders tree lines', () => {
      const { container } = render(
        <Tree treeData={treeData} showLine defaultExpandedKeys={['parent-1']} />,
      )
      // Check that child nodes have indent spans with border-left
      const child = getItem(container, 'child-1-1')!
      const spans = Array.from(child.querySelectorAll('span'))
      const hasLine = spans.some((s) => s.style.borderLeft !== '')
      expect(hasLine).toBe(true)
    })

    it('showLine with custom leaf icon', () => {
      const { container } = render(
        <Tree
          treeData={treeData}
          showLine={{ showLeafIcon: <span data-testid="leaf-icon">L</span> }}
          defaultExpandedKeys={['parent-1']}
        />,
      )
      expect(container.querySelector('[data-testid="leaf-icon"]')).toBeTruthy()
    })
  })

  // ============================================================================
  // Show icon
  // ============================================================================

  describe('showIcon', () => {
    it('no icons by default', () => {
      const { container } = render(<Tree treeData={treeData} />)
      // No SVGs from the icon renderer (only switcher SVGs exist)
      const leaf = getItem(container, 'leaf')!
      const iconSpans = Array.from(leaf.children).filter(
        (el) => (el as HTMLElement).style.marginRight === '0.25rem',
      )
      expect(iconSpans.length).toBe(0)
    })

    it('showIcon with function icon', () => {
      const icon = ({ isLeaf }: { isLeaf: boolean }) => (
        <span data-testid={isLeaf ? 'leaf-ico' : 'branch-ico'}>I</span>
      )
      const { container } = render(
        <Tree treeData={treeData} showIcon icon={icon} />,
      )
      expect(container.querySelector('[data-testid="leaf-ico"]')).toBeTruthy()
      expect(container.querySelector('[data-testid="branch-ico"]')).toBeTruthy()
    })

    it('node-level icon overrides default', () => {
      const data: TreeData[] = [
        { key: 'a', title: 'A', icon: <span data-testid="node-icon">N</span> },
      ]
      const { container } = render(<Tree treeData={data} showIcon />)
      expect(container.querySelector('[data-testid="node-icon"]')).toBeTruthy()
    })
  })

  // ============================================================================
  // Custom switcher icon
  // ============================================================================

  describe('switcherIcon', () => {
    it('custom switcherIcon renders', () => {
      const { container } = render(
        <Tree
          treeData={treeData}
          switcherIcon={<span data-testid="custom-switcher">+</span>}
        />,
      )
      expect(container.querySelector('[data-testid="custom-switcher"]')).toBeTruthy()
    })

    it('function switcherIcon receives expanded state', () => {
      const switcherIcon = vi.fn(({ expanded }: { expanded: boolean }) => (
        <span>{expanded ? '-' : '+'}</span>
      ))
      const { container } = render(
        <Tree treeData={treeData} switcherIcon={switcherIcon} />,
      )
      // Called for parent nodes (collapsed)
      expect(switcherIcon).toHaveBeenCalled()
      const parent = getItem(container, 'parent-1')!
      expect(parent.textContent).toContain('+')
    })
  })

  // ============================================================================
  // Title render
  // ============================================================================

  describe('titleRender', () => {
    it('custom titleRender replaces default title', () => {
      const { container } = render(
        <Tree
          treeData={treeData}
          titleRender={(node) => <strong data-testid={`title-${node.key}`}>{node.title}</strong>}
        />,
      )
      expect(container.querySelector('[data-testid="title-leaf"]')).toBeTruthy()
    })
  })

  // ============================================================================
  // Filter
  // ============================================================================

  describe('filterTreeNode', () => {
    it('filtered nodes have reduced opacity', () => {
      const { container } = render(
        <Tree
          treeData={treeData}
          filterTreeNode={(node) => node.key === 'leaf'}
        />,
      )
      // leaf matches filter → normal opacity
      const leaf = getItem(container, 'leaf')!
      expect(leaf.style.opacity).toBe('1')
      // parent-1 does not match → filtered opacity
      const parent = getItem(container, 'parent-1')!
      expect(parent.style.opacity).toBe('0.4')
    })
  })

  // ============================================================================
  // fieldNames
  // ============================================================================

  describe('fieldNames', () => {
    it('custom fieldNames maps fields correctly', () => {
      const data = [
        { id: 'x', label: 'Custom Label', items: [] },
      ]
      const { container } = render(
        <Tree
          treeData={data as any}
          fieldNames={{ key: 'id', title: 'label', children: 'items' }}
        />,
      )
      const items = getItems(container)
      expect(items[0].textContent).toContain('Custom Label')
      expect(items[0].getAttribute('data-key')).toBe('x')
    })
  })

  // ============================================================================
  // Keyboard navigation
  // ============================================================================

  describe('keyboard navigation', () => {
    it('ArrowDown moves focus to next visible node', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      // Focus the tree
      fireEvent.focus(root)
      // First node should be focused
      expect(getItem(container, 'parent-1')!.style.outline).toContain('2px solid')
      // ArrowDown
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      expect(getItem(container, 'parent-2')!.style.outline).toContain('2px solid')
    })

    it('ArrowUp moves focus to previous node', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      fireEvent.focus(root)
      // Move down first
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      // Then up
      fireEvent.keyDown(root, { key: 'ArrowUp' })
      expect(getItem(container, 'parent-1')!.style.outline).toContain('2px solid')
    })

    it('ArrowRight expands collapsed node', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      fireEvent.focus(root)
      // ArrowRight to expand parent-1
      fireEvent.keyDown(root, { key: 'ArrowRight' })
      expect(getItem(container, 'parent-1')!.getAttribute('aria-expanded')).toBe('true')
    })

    it('ArrowRight on expanded node moves to first child', () => {
      const { container } = render(
        <Tree treeData={treeData} defaultExpandedKeys={['parent-1']} />,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      // ArrowRight when already expanded → focus first child
      fireEvent.keyDown(root, { key: 'ArrowRight' })
      expect(getItem(container, 'child-1-1')!.style.outline).toContain('2px solid')
    })

    it('ArrowLeft collapses expanded node', () => {
      const { container } = render(
        <Tree treeData={treeData} defaultExpandedKeys={['parent-1']} />,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      // ArrowLeft to collapse parent-1
      fireEvent.keyDown(root, { key: 'ArrowLeft' })
      expect(getItem(container, 'parent-1')!.getAttribute('aria-expanded')).toBe('false')
    })

    it('ArrowLeft on collapsed node moves to parent', () => {
      const { container } = render(
        <Tree treeData={treeData} defaultExpandedKeys={['parent-1']} />,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      // Move to child-1-1
      fireEvent.keyDown(root, { key: 'ArrowRight' }) // moves to first child
      // ArrowLeft → focus parent
      fireEvent.keyDown(root, { key: 'ArrowLeft' })
      expect(getItem(container, 'parent-1')!.style.outline).toContain('2px solid')
    })

    it('Enter selects focused node', () => {
      const onSelect = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} onSelect={onSelect} />,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      // Move to leaf
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      // Press Enter
      fireEvent.keyDown(root, { key: 'Enter' })
      expect(onSelect).toHaveBeenCalledWith(
        ['leaf'],
        expect.objectContaining({ selected: true }),
      )
    })

    it('Space checks focused node when checkable', () => {
      const onCheck = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} checkable onCheck={onCheck} />,
      )
      const root = getRoot(container)
      fireEvent.focus(root)
      // Move to leaf (3rd item)
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      // Press Space
      fireEvent.keyDown(root, { key: ' ' })
      expect(onCheck).toHaveBeenCalledWith(
        expect.arrayContaining(['leaf']),
        expect.objectContaining({ checked: true }),
      )
    })

    it('Home moves focus to first node', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      fireEvent.focus(root)
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      fireEvent.keyDown(root, { key: 'ArrowDown' })
      fireEvent.keyDown(root, { key: 'Home' })
      expect(getItem(container, 'parent-1')!.style.outline).toContain('2px solid')
    })

    it('End moves focus to last node', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      fireEvent.focus(root)
      fireEvent.keyDown(root, { key: 'End' })
      expect(getItem(container, 'leaf')!.style.outline).toContain('2px solid')
    })

    it('ArrowDown wraps from last to first', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      fireEvent.focus(root)
      fireEvent.keyDown(root, { key: 'End' }) // go to last
      fireEvent.keyDown(root, { key: 'ArrowDown' }) // wrap
      expect(getItem(container, 'parent-1')!.style.outline).toContain('2px solid')
    })

    it('ArrowUp wraps from first to last', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      fireEvent.focus(root)
      fireEvent.keyDown(root, { key: 'ArrowUp' }) // wrap
      expect(getItem(container, 'leaf')!.style.outline).toContain('2px solid')
    })

    it('blur clears focus', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const root = getRoot(container)
      fireEvent.focus(root)
      expect(getItem(container, 'parent-1')!.style.outline).toContain('2px solid')
      fireEvent.blur(root)
      // Focus outline should be removed
      expect(getItem(container, 'parent-1')!.style.outline).toBe('none')
    })
  })

  // ============================================================================
  // Hover
  // ============================================================================

  describe('hover', () => {
    it('mouseenter changes background', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const leaf = getItem(container, 'leaf')!
      fireEvent.mouseEnter(leaf)
      expect(leaf.style.backgroundColor).toBeTruthy()
      expect(leaf.style.backgroundColor).not.toBe('')
    })

    it('mouseleave restores background', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const leaf = getItem(container, 'leaf')!
      fireEvent.mouseEnter(leaf)
      fireEvent.mouseLeave(leaf)
      expect(leaf.style.backgroundColor).toBe('')
    })

    it('hover on disabled node does nothing', () => {
      const data: TreeData[] = [{ key: 'a', title: 'A', disabled: true }]
      const { container } = render(<Tree treeData={data} />)
      const item = getItem(container, 'a')!
      const bgBefore = item.style.backgroundColor
      fireEvent.mouseEnter(item)
      expect(item.style.backgroundColor).toBe(bgBefore)
    })

    it('hover with custom node style uses brightness filter', () => {
      const { container } = render(
        <Tree treeData={treeData} styles={{ node: { backgroundColor: '#f00' } }} />,
      )
      const leaf = getItem(container, 'leaf')!
      fireEvent.mouseEnter(leaf)
      expect(leaf.style.filter).toBe('brightness(1.15)')
    })

    it('mouseleave with custom node style clears filter', () => {
      const { container } = render(
        <Tree treeData={treeData} styles={{ node: { backgroundColor: '#f00' } }} />,
      )
      const leaf = getItem(container, 'leaf')!
      fireEvent.mouseEnter(leaf)
      fireEvent.mouseLeave(leaf)
      expect(leaf.style.filter).toBe('')
    })
  })

  // ============================================================================
  // Draggable
  // ============================================================================

  describe('draggable', () => {
    it('draggable nodes have draggable attribute', () => {
      const { container } = render(<Tree treeData={treeData} draggable />)
      const items = getItems(container)
      items.forEach((item) => {
        expect(item.getAttribute('draggable')).toBe('true')
      })
    })

    it('non-draggable nodes do not have draggable', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const items = getItems(container)
      items.forEach((item) => {
        expect(item.getAttribute('draggable')).not.toBe('true')
      })
    })

    it('draggable renders drag handle icon', () => {
      const { container } = render(<Tree treeData={treeData} draggable />)
      const leaf = getItem(container, 'leaf')!
      const handleSpans = Array.from(leaf.children).filter(
        (el) => (el as HTMLElement).style.cursor === 'grab',
      )
      expect(handleSpans.length).toBeGreaterThan(0)
    })

    it('onDragStart fires', () => {
      const onDragStart = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} draggable onDragStart={onDragStart} />,
      )
      const leaf = getItem(container, 'leaf')!
      fireEvent.dragStart(leaf, { dataTransfer: { setData: vi.fn() } })
      expect(onDragStart).toHaveBeenCalledWith(
        expect.objectContaining({ node: expect.objectContaining({ key: 'leaf' }) }),
      )
    })

    it('function draggable controls which nodes are draggable', () => {
      const { container } = render(
        <Tree treeData={treeData} draggable={(node) => node.key === 'leaf'} />,
      )
      expect(getItem(container, 'leaf')!.getAttribute('draggable')).toBe('true')
      expect(getItem(container, 'parent-1')!.getAttribute('draggable')).not.toBe('true')
    })

    it('draggable object with nodeDraggable', () => {
      const { container } = render(
        <Tree treeData={treeData} draggable={{ nodeDraggable: (n) => n.key !== 'leaf' }} />,
      )
      expect(getItem(container, 'leaf')!.getAttribute('draggable')).not.toBe('true')
      expect(getItem(container, 'parent-1')!.getAttribute('draggable')).toBe('true')
    })

    it('custom drag icon', () => {
      const { container } = render(
        <Tree
          treeData={treeData}
          draggable={{ icon: <span data-testid="drag-ico">D</span> }}
        />,
      )
      expect(container.querySelector('[data-testid="drag-ico"]')).toBeTruthy()
    })
  })

  // ============================================================================
  // Right click
  // ============================================================================

  describe('right click', () => {
    it('onRightClick fires on context menu', () => {
      const onRightClick = vi.fn()
      const { container } = render(
        <Tree treeData={treeData} onRightClick={onRightClick} />,
      )
      const leaf = getItem(container, 'leaf')!
      fireEvent.contextMenu(leaf)
      expect(onRightClick).toHaveBeenCalledWith(
        expect.objectContaining({ node: expect.objectContaining({ key: 'leaf' }) }),
      )
    })
  })

  // ============================================================================
  // Virtual scroll
  // ============================================================================

  describe('virtual scroll', () => {
    it('renders with height prop', () => {
      const { container } = render(
        <Tree treeData={treeData} height={200} />,
      )
      const root = getRoot(container)
      expect(root.getAttribute('role')).toBe('tree')
      // Should have a scrollable container
      const scrollContainer = root.firstElementChild as HTMLElement
      expect(scrollContainer.style.height).toBe('200px')
      expect(scrollContainer.style.overflowY).toBe('auto')
    })

    it('virtual scroll renders tree items', () => {
      const { container } = render(
        <Tree treeData={treeData} height={300} />,
      )
      const items = getItems(container)
      expect(items.length).toBe(3)
    })
  })

  // ============================================================================
  // DirectoryTree
  // ============================================================================

  describe('DirectoryTree', () => {
    it('renders with role="tree"', () => {
      const { container } = render(
        <Tree.DirectoryTree treeData={treeData} />,
      )
      expect(getRoot(container).getAttribute('role')).toBe('tree')
    })

    it('shows icons by default', () => {
      const { container } = render(
        <Tree.DirectoryTree treeData={treeData} />,
      )
      // Icon spans should be present (marginRight: 0.25rem)
      const items = getItems(container)
      const hasIcons = items.some((item) =>
        Array.from(item.children).some(
          (el) => (el as HTMLElement).style.marginRight === '0.25rem',
        ),
      )
      expect(hasIcons).toBe(true)
    })

    it('defaults to multiple selection', () => {
      const onSelect = vi.fn()
      const { container } = render(
        <Tree.DirectoryTree
          treeData={treeData}
          defaultSelectedKeys={['leaf']}
          onSelect={onSelect}
        />,
      )
      fireEvent.click(getItem(container, 'parent-1')!)
      expect(onSelect).toHaveBeenCalledWith(
        expect.arrayContaining(['leaf', 'parent-1']),
        expect.anything(),
      )
    })

    it('expandAction=click expands on node click', () => {
      const { container } = render(
        <Tree.DirectoryTree treeData={treeData} expandAction="click" />,
      )
      fireEvent.click(getItem(container, 'parent-1')!)
      expect(getItem(container, 'child-1-1')).toBeTruthy()
    })

    it('expandAction=doubleClick expands on double click', () => {
      const { container } = render(
        <Tree.DirectoryTree treeData={treeData} expandAction="doubleClick" />,
      )
      fireEvent.doubleClick(getItem(container, 'parent-1')!)
      expect(getItem(container, 'child-1-1')).toBeTruthy()
    })

    it('expandAction={false} disables click expansion', () => {
      const { container } = render(
        <Tree.DirectoryTree treeData={treeData} expandAction={false} />,
      )
      fireEvent.click(getItem(container, 'parent-1')!)
      // Should NOT have expanded (only switcher can expand)
      expect(getItem(container, 'parent-1')!.getAttribute('aria-expanded')).toBe('false')
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('classNames.root applies to root', () => {
      const { container } = render(
        <Tree treeData={treeData} classNames={{ root: 'my-root' }} />,
      )
      expect(getRoot(container).className).toContain('my-root')
    })

    it('classNames.node applies to treeitems', () => {
      const { container } = render(
        <Tree treeData={treeData} classNames={{ node: 'my-node' }} />,
      )
      const items = getItems(container)
      items.forEach((item) => {
        expect(item.className).toContain('my-node')
      })
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('styles.root merges into root', () => {
      const { container } = render(
        <Tree treeData={treeData} styles={{ root: { margin: '10px' } }} />,
      )
      expect(getRoot(container).style.margin).toBe('10px')
    })

    it('styles.node merges into treeitems', () => {
      const { container } = render(
        <Tree treeData={treeData} styles={{ node: { paddingLeft: '20px' } }} />,
      )
      const items = getItems(container)
      items.forEach((item) => {
        expect(item.style.paddingLeft).toBe('20px')
      })
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className and style', () => {
    it('className applies to root', () => {
      const { container } = render(
        <Tree treeData={treeData} className="custom-tree" />,
      )
      expect(getRoot(container).className).toContain('custom-tree')
    })

    it('style applies to root', () => {
      const { container } = render(
        <Tree treeData={treeData} style={{ border: '1px solid red' }} />,
      )
      expect(getRoot(container).style.border).toContain('1px solid')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('deeply nested tree renders correctly', () => {
      const deep: TreeData[] = [
        {
          key: 'l1', title: 'L1', children: [
            {
              key: 'l2', title: 'L2', children: [
                {
                  key: 'l3', title: 'L3', children: [
                    { key: 'l4', title: 'L4' },
                  ],
                },
              ],
            },
          ],
        },
      ]
      const { container } = render(<Tree treeData={deep} defaultExpandAll />)
      expect(getItem(container, 'l4')).toBeTruthy()
    })

    it('numeric keys work', () => {
      const data: TreeData[] = [
        { key: 1, title: 'One' },
        { key: 2, title: 'Two' },
      ]
      const { container } = render(<Tree treeData={data} />)
      expect(getItem(container, '1')).toBeTruthy()
      expect(getItem(container, '2')).toBeTruthy()
    })

    it('ReactNode title renders correctly', () => {
      const data: TreeData[] = [
        { key: 'r', title: <em data-testid="react-title">Rich</em> },
      ]
      const { container } = render(<Tree treeData={data} />)
      expect(container.querySelector('[data-testid="react-title"]')).toBeTruthy()
    })

    it('title font size is correct', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const leaf = getItem(container, 'leaf')!
      const title = getTitleSpan(leaf)!
      expect(title.style.fontSize).toBe('0.8125rem')
    })

    it('node row has border-radius', () => {
      const { container } = render(<Tree treeData={treeData} />)
      const leaf = getItem(container, 'leaf')!
      expect(leaf.style.borderRadius).toBe('0.25rem')
    })

    it('compound export has DirectoryTree', () => {
      expect(Tree.DirectoryTree).toBeTruthy()
    })
  })
})
