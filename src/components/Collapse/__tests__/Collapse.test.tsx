import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Collapse } from '../Collapse'
import type { CollapseItem } from '../Collapse'

// ============================================================================
// Helpers
// ============================================================================

const defaultItems: CollapseItem[] = [
  { key: '1', label: 'Header 1', children: 'Content 1' },
  { key: '2', label: 'Header 2', children: 'Content 2' },
  { key: '3', label: 'Header 3', children: 'Content 3' },
]

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getPanels(container: HTMLElement) {
  return Array.from(getRoot(container).children) as HTMLElement[]
}

function getHeader(panel: HTMLElement) {
  return panel.firstElementChild as HTMLElement
}

function getContentWrapper(panel: HTMLElement) {
  return panel.lastElementChild as HTMLElement
}

function getContentBody(panel: HTMLElement) {
  const wrapper = getContentWrapper(panel)
  return wrapper.firstElementChild as HTMLElement | null
}

function getArrow(panel: HTMLElement) {
  // Arrow is a span with inline-flex inside the header
  const header = getHeader(panel)
  const found = Array.from(header.children).find(
    (el) => el.tagName === 'SPAN' && (el as HTMLElement).style.display === 'inline-flex',
  )
  return (found as HTMLElement) ?? null
}

function clickHeader(panel: HTMLElement) {
  fireEvent.click(getHeader(panel))
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Collapse', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('renders all panels from items', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      expect(panels.length).toBe(3)
    })

    it('renders panel headers with labels', () => {
      render(<Collapse items={defaultItems} />)
      expect(screen.getByText('Header 1')).toBeTruthy()
      expect(screen.getByText('Header 2')).toBeTruthy()
      expect(screen.getByText('Header 3')).toBeTruthy()
    })

    it('applies className to root', () => {
      const { container } = render(<Collapse items={defaultItems} className="my-collapse" />)
      expect(getRoot(container).className).toContain('my-collapse')
    })

    it('applies style to root', () => {
      const { container } = render(<Collapse items={defaultItems} style={{ width: '400px' }} />)
      expect(getRoot(container).style.width).toBe('400px')
    })

    it('root has border by default', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      expect(getRoot(container).style.border).toContain('1px solid')
    })

    it('root has border-radius', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      expect(getRoot(container).style.borderRadius).toBe('0.5rem')
    })

    it('root has overflow hidden', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      expect(getRoot(container).style.overflow).toBe('hidden')
    })

    it('first panel has no top border', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const firstHeader = getHeader(panels[0])
      // jsdom serializes border: 'none' as 'medium'; check it's not a visible border
      expect(firstHeader.style.borderTop).not.toContain('1px solid')
    })

    it('subsequent panels have top border separator', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const secondHeader = getHeader(panels[1])
      expect(secondHeader.style.borderTop).toContain('1px solid')
    })
  })

  // ============================================================================
  // Expand / Collapse (uncontrolled)
  // ============================================================================

  describe('uncontrolled expand/collapse', () => {
    it('all panels are collapsed by default', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      panels.forEach((panel) => {
        const wrapper = getContentWrapper(panel)
        expect(wrapper.style.maxHeight).toBe('0px')
      })
    })

    it('expands panel with defaultActiveKey (string)', () => {
      const { container } = render(<Collapse items={defaultItems} defaultActiveKey="2" />)
      const panels = getPanels(container)
      // Panel 2 should be expanded
      expect(getContentWrapper(panels[1]).style.maxHeight).toBe('none')
      // Others collapsed
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('0px')
      expect(getContentWrapper(panels[2]).style.maxHeight).toBe('0px')
    })

    it('expands panels with defaultActiveKey (array)', () => {
      const { container } = render(<Collapse items={defaultItems} defaultActiveKey={['1', '3']} />)
      const panels = getPanels(container)
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('none')
      expect(getContentWrapper(panels[1]).style.maxHeight).toBe('0px')
      expect(getContentWrapper(panels[2]).style.maxHeight).toBe('none')
    })

    it('clicking a header expands the panel', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      // Content should now be rendered
      expect(screen.getByText('Content 1')).toBeTruthy()
    })

    it('clicking an expanded header collapses it', () => {
      const { container } = render(<Collapse items={defaultItems} defaultActiveKey="1" />)
      const panels = getPanels(container)

      clickHeader(panels[0]) // collapse
      // After collapse, maxHeight should be animating to 0
      const wrapper = getContentWrapper(panels[0])
      expect(wrapper.style.maxHeight).toBe('0px')
    })

    it('multiple panels can be open simultaneously', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      clickHeader(panels[1])

      expect(screen.getByText('Content 1')).toBeTruthy()
      expect(screen.getByText('Content 2')).toBeTruthy()
    })
  })

  // ============================================================================
  // Controlled mode
  // ============================================================================

  describe('controlled mode', () => {
    it('respects activeKey prop', () => {
      const { container } = render(<Collapse items={defaultItems} activeKey="2" />)
      const panels = getPanels(container)
      expect(getContentWrapper(panels[1]).style.maxHeight).toBe('none')
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('0px')
    })

    it('respects activeKey as array', () => {
      const { container } = render(<Collapse items={defaultItems} activeKey={['1', '3']} />)
      const panels = getPanels(container)
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('none')
      expect(getContentWrapper(panels[2]).style.maxHeight).toBe('none')
    })

    it('does not toggle internally in controlled mode', () => {
      const { container } = render(<Collapse items={defaultItems} activeKey={[]} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      // Still collapsed because activeKey controls state
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('0px')
    })

    it('updates when activeKey prop changes', () => {
      const { container, rerender } = render(<Collapse items={defaultItems} activeKey="1" />)
      const panels = getPanels(container)
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('none')

      rerender(<Collapse items={defaultItems} activeKey="2" />)
      const updatedPanels = getPanels(container)
      expect(getContentWrapper(updatedPanels[0]).style.maxHeight).toBe('0px')
      // Panel 2 content should now be rendered (body exists)
      expect(getContentBody(updatedPanels[1])).toBeTruthy()
    })
  })

  // ============================================================================
  // Accordion mode
  // ============================================================================

  describe('accordion mode', () => {
    it('only one panel open at a time', () => {
      const { container } = render(<Collapse items={defaultItems} accordion />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(screen.getByText('Content 1')).toBeTruthy()

      clickHeader(panels[1])
      // Panel 1 should collapse, panel 2 should expand
      const wrapper0 = getContentWrapper(panels[0])
      expect(wrapper0.style.maxHeight).toBe('0px')
      expect(screen.getByText('Content 2')).toBeTruthy()
    })

    it('clicking active panel closes it', () => {
      const { container } = render(<Collapse items={defaultItems} accordion defaultActiveKey="1" />)
      const panels = getPanels(container)

      clickHeader(panels[0]) // collapse
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('0px')
    })

    it('onChange receives string in accordion mode', () => {
      const onChange = vi.fn()
      const { container } = render(<Collapse items={defaultItems} accordion onChange={onChange} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(onChange).toHaveBeenCalledWith('1')
    })

    it('onChange receives empty string when closing in accordion mode', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Collapse items={defaultItems} accordion defaultActiveKey="1" onChange={onChange} />,
      )
      const panels = getPanels(container)

      clickHeader(panels[0]) // close
      expect(onChange).toHaveBeenCalledWith('')
    })
  })

  // ============================================================================
  // onChange callback
  // ============================================================================

  describe('onChange callback', () => {
    it('called with array when expanding (non-accordion)', () => {
      const onChange = vi.fn()
      const { container } = render(<Collapse items={defaultItems} onChange={onChange} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    it('called with updated array on second expand', () => {
      const onChange = vi.fn()
      const { container } = render(<Collapse items={defaultItems} onChange={onChange} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      clickHeader(panels[2])
      expect(onChange).toHaveBeenLastCalledWith(['1', '3'])
    })

    it('called with filtered array on collapse', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Collapse items={defaultItems} defaultActiveKey={['1', '2']} onChange={onChange} />,
      )
      const panels = getPanels(container)

      clickHeader(panels[0]) // collapse panel 1
      expect(onChange).toHaveBeenCalledWith(['2'])
    })

    it('called even in controlled mode', () => {
      const onChange = vi.fn()
      const { container } = render(<Collapse items={defaultItems} activeKey={[]} onChange={onChange} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(onChange).toHaveBeenCalledWith(['1'])
    })
  })

  // ============================================================================
  // Collapsible modes
  // ============================================================================

  describe('collapsible modes', () => {
    it('default: clicking header toggles panel', () => {
      const onChange = vi.fn()
      const { container } = render(<Collapse items={defaultItems} onChange={onChange} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(onChange).toHaveBeenCalled()
    })

    it('collapsible=disabled: header click does not toggle', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Collapse items={defaultItems} collapsible="disabled" onChange={onChange} />,
      )
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(onChange).not.toHaveBeenCalled()
    })

    it('collapsible=disabled: header has not-allowed cursor', () => {
      const { container } = render(<Collapse items={defaultItems} collapsible="disabled" />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.cursor).toBe('not-allowed')
    })

    it('collapsible=disabled: text color is muted', () => {
      const { container } = render(<Collapse items={defaultItems} collapsible="disabled" />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.color).toContain('var(--j-')
    })

    it('collapsible=icon: clicking header does not toggle', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Collapse items={defaultItems} collapsible="icon" onChange={onChange} />,
      )
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(onChange).not.toHaveBeenCalled()
    })

    it('collapsible=icon: clicking icon toggles', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Collapse items={defaultItems} collapsible="icon" onChange={onChange} />,
      )
      const panels = getPanels(container)
      const arrow = getArrow(panels[0])
      expect(arrow).toBeTruthy()

      fireEvent.click(arrow!)
      expect(onChange).toHaveBeenCalledWith(['1'])
    })

    it('collapsible=icon: header has default cursor', () => {
      const { container } = render(<Collapse items={defaultItems} collapsible="icon" />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.cursor).toBe('default')
    })

    it('collapsible=icon: arrow has pointer cursor', () => {
      const { container } = render(<Collapse items={defaultItems} collapsible="icon" />)
      const panels = getPanels(container)
      const arrow = getArrow(panels[0])
      expect(arrow!.style.cursor).toBe('pointer')
    })

    it('per-panel collapsible overrides global', () => {
      const items: CollapseItem[] = [
        { key: '1', label: 'Enabled', children: 'Content 1' },
        { key: '2', label: 'Disabled', children: 'Content 2', collapsible: 'disabled' },
      ]
      const onChange = vi.fn()
      const { container } = render(<Collapse items={items} onChange={onChange} />)
      const panels = getPanels(container)

      clickHeader(panels[0])
      expect(onChange).toHaveBeenCalledTimes(1)

      clickHeader(panels[1])
      expect(onChange).toHaveBeenCalledTimes(1) // not called again
    })
  })

  // ============================================================================
  // Arrow / expand icon
  // ============================================================================

  describe('arrow / expand icon', () => {
    it('shows arrow by default', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      expect(getArrow(panels[0])).toBeTruthy()
    })

    it('hides arrow when showArrow=false on item', () => {
      const items: CollapseItem[] = [
        { key: '1', label: 'No Arrow', children: 'Content', showArrow: false },
      ]
      const { container } = render(<Collapse items={items} />)
      const panels = getPanels(container)
      expect(getArrow(panels[0])).toBeNull()
    })

    it('arrow rotates 90deg when panel is active', () => {
      const { container } = render(<Collapse items={defaultItems} defaultActiveKey="1" />)
      const panels = getPanels(container)
      const arrow = getArrow(panels[0])
      expect(arrow!.style.transform).toBe('rotate(90deg)')
    })

    it('arrow is at 0deg when panel is collapsed', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const arrow = getArrow(panels[0])
      expect(arrow!.style.transform).toBe('rotate(0deg)')
    })

    it('arrow has transition', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const arrow = getArrow(panels[0])
      expect(arrow!.style.transition).toContain('transform')
    })

    it('custom expandIcon is rendered', () => {
      const customIcon = ({ isActive }: { isActive: boolean }) => (
        <span data-testid="custom-icon">{isActive ? '-' : '+'}</span>
      )
      render(<Collapse items={defaultItems} expandIcon={customIcon} />)
      expect(screen.getAllByTestId('custom-icon').length).toBe(3)
    })

    it('custom expandIcon receives isActive state', () => {
      const customIcon = ({ isActive }: { isActive: boolean }) => (
        <span>{isActive ? 'open' : 'closed'}</span>
      )
      render(<Collapse items={defaultItems} expandIcon={customIcon} defaultActiveKey="1" />)
      expect(screen.getByText('open')).toBeTruthy()
      expect(screen.getAllByText('closed').length).toBe(2)
    })
  })

  // ============================================================================
  // expandIconPlacement
  // ============================================================================

  describe('expandIconPlacement', () => {
    it('arrow at start by default', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const header = getHeader(panels[0])
      const firstChild = header.firstElementChild as HTMLElement
      // First child should be the arrow (inline-flex span)
      expect(firstChild.style.display).toBe('inline-flex')
    })

    it('arrow at end when expandIconPlacement=end', () => {
      const { container } = render(<Collapse items={defaultItems} expandIconPlacement="end" />)
      const panels = getPanels(container)
      const header = getHeader(panels[0])
      const lastChild = header.lastElementChild as HTMLElement
      // Last child should be the arrow (inline-flex span)
      expect(lastChild.style.display).toBe('inline-flex')
    })
  })

  // ============================================================================
  // Extra content
  // ============================================================================

  describe('extra content', () => {
    it('renders extra content in header', () => {
      const items: CollapseItem[] = [
        { key: '1', label: 'Title', children: 'Body', extra: <span>Extra Info</span> },
      ]
      render(<Collapse items={items} />)
      expect(screen.getByText('Extra Info')).toBeTruthy()
    })

    it('extra is placed after label', () => {
      const items: CollapseItem[] = [
        { key: '1', label: 'Title', children: 'Body', extra: <span data-testid="extra">X</span> },
      ]
      const { container } = render(<Collapse items={items} />)
      const panels = getPanels(container)
      const header = getHeader(panels[0])
      const extraSpan = header.querySelector('[data-testid="extra"]')
      expect(extraSpan).toBeTruthy()
      // Extra wrapper has marginLeft: auto (pushed right)
      const extraWrapper = extraSpan!.parentElement as HTMLElement
      expect(extraWrapper.style.marginLeft).toBe('auto')
    })
  })

  // ============================================================================
  // Ghost mode
  // ============================================================================

  describe('ghost mode', () => {
    it('root has no border in ghost mode', () => {
      const { container } = render(<Collapse items={defaultItems} ghost />)
      // jsdom serializes border: 'none' as 'medium'
      expect(getRoot(container).style.border).not.toContain('1px solid')
    })

    it('root has no border-radius in ghost mode', () => {
      const { container } = render(<Collapse items={defaultItems} ghost />)
      expect(getRoot(container).style.borderRadius).toBe('0')
    })

    it('root has transparent background', () => {
      const { container } = render(<Collapse items={defaultItems} ghost />)
      expect(getRoot(container).style.backgroundColor).toBe('transparent')
    })

    it('header has transparent background', () => {
      const { container } = render(<Collapse items={defaultItems} ghost />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.backgroundColor).toBe('transparent')
    })
  })

  // ============================================================================
  // Bordered
  // ============================================================================

  describe('bordered', () => {
    it('has border when bordered=true (default)', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      expect(getRoot(container).style.border).toContain('1px solid')
    })

    it('has no border when bordered=false', () => {
      const { container } = render(<Collapse items={defaultItems} bordered={false} />)
      // jsdom serializes border: 'none' as 'medium'
      expect(getRoot(container).style.border).not.toContain('1px solid')
    })
  })

  // ============================================================================
  // Size variants
  // ============================================================================

  describe('size variants', () => {
    it('small size has smaller padding', () => {
      const { container } = render(<Collapse items={defaultItems} size="small" />)
      const panels = getPanels(container)
      const header = getHeader(panels[0])
      expect(header.style.padding).toBe('0.375rem 0.75rem')
      expect(header.style.fontSize).toBe('0.8125rem')
    })

    it('middle size (default) has medium padding', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const header = getHeader(panels[0])
      expect(header.style.padding).toBe('0.75rem 1rem')
      expect(header.style.fontSize).toBe('0.875rem')
    })

    it('large size has larger padding', () => {
      const { container } = render(<Collapse items={defaultItems} size="large" />)
      const panels = getPanels(container)
      const header = getHeader(panels[0])
      expect(header.style.padding).toBe('1rem 1.25rem')
      expect(header.style.fontSize).toBe('1rem')
    })

    it('size affects content padding', () => {
      const { container } = render(
        <Collapse items={defaultItems} size="small" defaultActiveKey="1" />,
      )
      const panels = getPanels(container)
      const body = getContentBody(panels[0])
      expect(body!.style.padding).toBe('0.75rem')
    })
  })

  // ============================================================================
  // destroyOnHidden
  // ============================================================================

  describe('destroyOnHidden', () => {
    it('content stays in DOM after collapse by default', () => {
      const { container } = render(<Collapse items={defaultItems} defaultActiveKey="1" />)
      const panels = getPanels(container)

      clickHeader(panels[0]) // collapse
      // Content body should still exist in DOM
      const body = getContentBody(panels[0])
      expect(body).toBeTruthy()
    })

    it('content is removed from DOM when destroyOnHidden=true and collapsed', () => {
      const { container } = render(
        <Collapse items={defaultItems} destroyOnHidden defaultActiveKey="1" />,
      )
      const panels = getPanels(container)

      clickHeader(panels[0]) // collapse
      const body = getContentBody(panels[0])
      expect(body).toBeNull()
    })

    it('content is rendered again when re-expanded', () => {
      const { container } = render(
        <Collapse items={defaultItems} destroyOnHidden defaultActiveKey="1" />,
      )
      const panels = getPanels(container)

      clickHeader(panels[0]) // collapse
      expect(getContentBody(panels[0])).toBeNull()

      clickHeader(panels[0]) // expand again
      expect(getContentBody(panels[0])).toBeTruthy()
    })
  })

  // ============================================================================
  // forceRender
  // ============================================================================

  describe('forceRender', () => {
    it('content not in DOM when collapsed and never expanded', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      // Never expanded, content not rendered
      expect(getContentBody(panels[0])).toBeNull()
    })

    it('forceRender renders content even when never expanded', () => {
      const items: CollapseItem[] = [
        { key: '1', label: 'Title', children: 'Force rendered', forceRender: true },
      ]
      const { container } = render(<Collapse items={items} />)
      const panels = getPanels(container)
      const body = getContentBody(panels[0])
      expect(body).toBeTruthy()
      expect(body!.textContent).toBe('Force rendered')
    })
  })

  // ============================================================================
  // Collapse.Panel children API
  // ============================================================================

  describe('Collapse.Panel children API', () => {
    it('renders panels from Collapse.Panel children', () => {
      const { container } = render(
        <Collapse>
          <Collapse.Panel panelKey="a" header="Panel A">Content A</Collapse.Panel>
          <Collapse.Panel panelKey="b" header="Panel B">Content B</Collapse.Panel>
        </Collapse>,
      )
      const panels = getPanels(container)
      expect(panels.length).toBe(2)
      expect(screen.getByText('Panel A')).toBeTruthy()
      expect(screen.getByText('Panel B')).toBeTruthy()
    })

    it('expands Panel by defaultActiveKey', () => {
      const { container } = render(
        <Collapse defaultActiveKey="a">
          <Collapse.Panel panelKey="a" header="Panel A">Content A</Collapse.Panel>
          <Collapse.Panel panelKey="b" header="Panel B">Content B</Collapse.Panel>
        </Collapse>,
      )
      const panels = getPanels(container)
      expect(getContentWrapper(panels[0]).style.maxHeight).toBe('none')
      expect(screen.getByText('Content A')).toBeTruthy()
    })

    it('clicking Panel header toggles it', () => {
      const onChange = vi.fn()
      const { container } = render(
        <Collapse onChange={onChange}>
          <Collapse.Panel panelKey="a" header="Panel A">Content A</Collapse.Panel>
        </Collapse>,
      )
      const panels = getPanels(container)
      clickHeader(panels[0])
      expect(onChange).toHaveBeenCalledWith(['a'])
    })

    it('items prop takes precedence over children', () => {
      const items: CollapseItem[] = [
        { key: 'x', label: 'Item X', children: 'Content X' },
      ]
      const { container } = render(
        <Collapse items={items}>
          <Collapse.Panel panelKey="a" header="Panel A">Content A</Collapse.Panel>
        </Collapse>,
      )
      const panels = getPanels(container)
      expect(panels.length).toBe(1)
      expect(screen.getByText('Item X')).toBeTruthy()
    })

    it('Panel extra prop works', () => {
      render(
        <Collapse defaultActiveKey="a">
          <Collapse.Panel panelKey="a" header="Title" extra={<span>Extra</span>}>Body</Collapse.Panel>
        </Collapse>,
      )
      expect(screen.getByText('Extra')).toBeTruthy()
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(<Collapse items={defaultItems} classNames={{ root: 'cl-root' }} />)
      expect(getRoot(container).className).toContain('cl-root')
    })

    it('applies classNames.header to panel headers', () => {
      const { container } = render(<Collapse items={defaultItems} classNames={{ header: 'cl-header' }} />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).className).toContain('cl-header')
      expect(getHeader(panels[1]).className).toContain('cl-header')
    })

    it('applies classNames.content to content body', () => {
      const { container } = render(
        <Collapse items={defaultItems} defaultActiveKey="1" classNames={{ content: 'cl-content' }} />,
      )
      const panels = getPanels(container)
      const body = getContentBody(panels[0])
      expect(body!.className).toContain('cl-content')
    })

    it('applies classNames.arrow to arrow icon', () => {
      const { container } = render(<Collapse items={defaultItems} classNames={{ arrow: 'cl-arrow' }} />)
      const panels = getPanels(container)
      const arrow = getArrow(panels[0])
      expect(arrow!.className).toContain('cl-arrow')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(
        <Collapse items={defaultItems} styles={{ root: { margin: '10px' } }} />,
      )
      expect(getRoot(container).style.margin).toBe('10px')
    })

    it('applies styles.header', () => {
      const { container } = render(
        <Collapse items={defaultItems} styles={{ header: { letterSpacing: '1px' } }} />,
      )
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.letterSpacing).toBe('1px')
    })

    it('applies styles.content', () => {
      const { container } = render(
        <Collapse items={defaultItems} defaultActiveKey="1" styles={{ content: { lineHeight: '2' } }} />,
      )
      const panels = getPanels(container)
      const body = getContentBody(panels[0])
      expect(body!.style.lineHeight).toBe('2')
    })

    it('applies styles.arrow', () => {
      const { container } = render(
        <Collapse items={defaultItems} styles={{ arrow: { color: 'red' } }} />,
      )
      const panels = getPanels(container)
      const arrow = getArrow(panels[0])
      expect(arrow!.style.color).toBe('red')
    })
  })

  // ============================================================================
  // Per-panel className / style
  // ============================================================================

  describe('per-panel className / style', () => {
    it('applies item className to panel wrapper', () => {
      const items: CollapseItem[] = [
        { key: '1', label: 'Title', children: 'Body', className: 'custom-panel' },
      ]
      const { container } = render(<Collapse items={items} />)
      const panels = getPanels(container)
      expect(panels[0].className).toContain('custom-panel')
    })

    it('applies item style to panel wrapper', () => {
      const items: CollapseItem[] = [
        { key: '1', label: 'Title', children: 'Body', style: { background: 'yellow' } },
      ]
      const { container } = render(<Collapse items={items} />)
      const panels = getPanels(container)
      expect(panels[0].style.background).toBe('yellow')
    })
  })

  // ============================================================================
  // Content rendering
  // ============================================================================

  describe('content rendering', () => {
    it('content body has top border', () => {
      const { container } = render(<Collapse items={defaultItems} defaultActiveKey="1" />)
      const panels = getPanels(container)
      const body = getContentBody(panels[0])
      expect(body!.style.borderTop).toContain('1px solid')
    })

    it('content wrapper has overflow hidden', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const wrapper = getContentWrapper(panels[0])
      expect(wrapper.style.overflow).toBe('hidden')
    })

    it('expanded panel content wrapper has opacity 1', () => {
      const { container } = render(<Collapse items={defaultItems} defaultActiveKey="1" />)
      const panels = getPanels(container)
      const wrapper = getContentWrapper(panels[0])
      expect(wrapper.style.opacity).toBe('1')
    })

    it('collapsed panel content wrapper has opacity 0', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      const wrapper = getContentWrapper(panels[0])
      expect(wrapper.style.opacity).toBe('0')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('handles empty items array', () => {
      const { container } = render(<Collapse items={[]} />)
      const panels = getPanels(container)
      expect(panels.length).toBe(0)
    })

    it('handles single item', () => {
      const items: CollapseItem[] = [{ key: '1', label: 'Only', children: 'Content' }]
      const { container } = render(<Collapse items={items} />)
      const panels = getPanels(container)
      expect(panels.length).toBe(1)
    })

    it('renders with no children content', () => {
      const items: CollapseItem[] = [{ key: '1', label: 'No Content' }]
      const { container } = render(<Collapse items={items} defaultActiveKey="1" />)
      const panels = getPanels(container)
      expect(getContentBody(panels[0])).toBeTruthy()
    })

    it('renders with no label', () => {
      const items: CollapseItem[] = [{ key: '1', children: 'Body' }]
      const { container } = render(<Collapse items={items} />)
      const panels = getPanels(container)
      expect(panels.length).toBe(1)
    })

    it('header has fontWeight 600', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.fontWeight).toBe('600')
    })

    it('header has user-select none', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.userSelect).toBe('none')
    })

    it('header has pointer cursor by default', () => {
      const { container } = render(<Collapse items={defaultItems} />)
      const panels = getPanels(container)
      expect(getHeader(panels[0]).style.cursor).toBe('pointer')
    })

    it('Collapse.Panel export exists', () => {
      expect(Collapse.Panel).toBeTruthy()
    })
  })
})
