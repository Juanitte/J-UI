import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from '../Tabs'
import type { TabItem } from '../Tabs'

// jsdom does not implement ResizeObserver
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

const basicItems: TabItem[] = [
  { key: '1', label: 'Tab 1', children: 'Content 1' },
  { key: '2', label: 'Tab 2', children: 'Content 2' },
  { key: '3', label: 'Tab 3', children: 'Content 3' },
]

describe('Tabs', () => {
  // ---------- Basic rendering ----------

  it('renders a tablist', () => {
    render(<Tabs items={basicItems} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders tab buttons with role="tab"', () => {
    render(<Tabs items={basicItems} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
  })

  it('renders tab labels', () => {
    render(<Tabs items={basicItems} />)
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('renders tabpanels', () => {
    render(<Tabs items={basicItems} />)
    const panels = screen.getAllByRole('tabpanel', { hidden: true })
    expect(panels.length).toBeGreaterThanOrEqual(1)
  })

  // ---------- Active tab ----------

  it('marks first tab as active by default', () => {
    render(<Tabs items={basicItems} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('shows active panel content and hides others', () => {
    render(<Tabs items={basicItems} />)
    expect(screen.getByText('Content 1')).toBeVisible()
  })

  it('gives active tab tabIndex=0 and others tabIndex=-1', () => {
    render(<Tabs items={basicItems} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0]).toHaveAttribute('tabindex', '0')
    expect(tabs[1]).toHaveAttribute('tabindex', '-1')
  })

  // ---------- defaultActiveKey ----------

  it('respects defaultActiveKey', () => {
    render(<Tabs items={basicItems} defaultActiveKey="2" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Content 2')).toBeVisible()
  })

  // ---------- Uncontrolled switching ----------

  it('switches active tab on click (uncontrolled)', () => {
    render(<Tabs items={basicItems} />)

    fireEvent.click(screen.getByText('Tab 2'))

    const tabs = screen.getAllByRole('tab')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false')
  })

  // ---------- Controlled ----------

  it('respects controlled activeKey', () => {
    const { rerender } = render(<Tabs items={basicItems} activeKey="1" />)
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true')

    rerender(<Tabs items={basicItems} activeKey="3" />)
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'false')
  })

  // ---------- onChange ----------

  it('calls onChange when a tab is clicked', () => {
    const onChange = vi.fn()
    render(<Tabs items={basicItems} onChange={onChange} />)

    fireEvent.click(screen.getByText('Tab 2'))
    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('does not call onChange when clicking the already active tab', () => {
    const onChange = vi.fn()
    render(<Tabs items={basicItems} onChange={onChange} />)

    fireEvent.click(screen.getByText('Tab 1'))
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- onTabClick ----------

  it('calls onTabClick with key and event', () => {
    const onTabClick = vi.fn()
    render(<Tabs items={basicItems} onTabClick={onTabClick} />)

    fireEvent.click(screen.getByText('Tab 2'))
    expect(onTabClick).toHaveBeenCalledWith('2', expect.any(Object))
  })

  // ---------- Disabled tabs ----------

  it('does not switch to disabled tab on click', () => {
    const onChange = vi.fn()
    const items: TabItem[] = [
      { key: '1', label: 'Tab 1', children: 'Content 1' },
      { key: '2', label: 'Disabled', children: 'Content 2', disabled: true },
    ]
    render(<Tabs items={items} onChange={onChange} />)

    fireEvent.click(screen.getByText('Disabled'))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('marks disabled tabs with aria-disabled', () => {
    const items: TabItem[] = [
      { key: '1', label: 'Active' },
      { key: '2', label: 'Disabled', disabled: true },
    ]
    render(<Tabs items={items} />)
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-disabled', 'true')
  })

  it('renders disabled tabs with opacity 0.5', () => {
    const items: TabItem[] = [
      { key: '1', label: 'Active' },
      { key: '2', label: 'Disabled', disabled: true },
    ]
    render(<Tabs items={items} />)
    const tab = screen.getAllByRole('tab')[1]
    expect(tab.style.opacity).toBe('0.5')
  })

  // ---------- Tab type: card ----------

  it('renders card-type tabs with background color', () => {
    render(<Tabs items={basicItems} type="card" />)
    const tabs = screen.getAllByRole('tab')
    // Active card tab has a background color set
    expect(tabs[0].style.backgroundColor).not.toBe('')
  })

  it('does not render ink bar for card type', () => {
    const { container } = render(
      <Tabs items={basicItems} type="card" classNames={{ inkBar: 'ink-marker' }} />
    )
    expect(container.querySelector('.ink-marker')).not.toBeInTheDocument()
  })

  // ---------- Tab type: editable-card ----------

  it('renders close buttons for editable-card tabs', () => {
    render(<Tabs items={basicItems} type="editable-card" />)
    expect(screen.getByLabelText('Close Tab 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Close Tab 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Close Tab 3')).toBeInTheDocument()
  })

  it('renders add button for editable-card tabs', () => {
    render(<Tabs items={basicItems} type="editable-card" />)
    expect(screen.getByLabelText('Add tab')).toBeInTheDocument()
  })

  it('calls onEdit with "remove" when close button is clicked', () => {
    const onEdit = vi.fn()
    render(<Tabs items={basicItems} type="editable-card" onEdit={onEdit} />)

    fireEvent.click(screen.getByLabelText('Close Tab 2'))
    expect(onEdit).toHaveBeenCalledWith('2', 'remove')
  })

  it('calls onEdit with "add" when add button is clicked', () => {
    const onEdit = vi.fn()
    render(<Tabs items={basicItems} type="editable-card" onEdit={onEdit} />)

    fireEvent.click(screen.getByLabelText('Add tab'))
    expect(onEdit).toHaveBeenCalledWith(expect.any(Object), 'add')
  })

  it('hides add button when hideAdd=true', () => {
    render(<Tabs items={basicItems} type="editable-card" hideAdd />)
    expect(screen.queryByLabelText('Add tab')).not.toBeInTheDocument()
  })

  it('hides close button when closable=false', () => {
    const items: TabItem[] = [
      { key: '1', label: 'No Close', closable: false },
      { key: '2', label: 'Has Close' },
    ]
    render(<Tabs items={items} type="editable-card" />)
    expect(screen.queryByLabelText('Close No Close')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Close Has Close')).toBeInTheDocument()
  })

  it('renders custom addIcon', () => {
    render(
      <Tabs
        items={basicItems}
        type="editable-card"
        addIcon={<span data-testid="custom-add">+</span>}
      />
    )
    expect(screen.getByTestId('custom-add')).toBeInTheDocument()
  })

  it('renders custom closeIcon on individual tab', () => {
    const items: TabItem[] = [
      { key: '1', label: 'Tab', closeIcon: <span data-testid="custom-close">x</span> },
    ]
    render(<Tabs items={items} type="editable-card" />)
    expect(screen.getByTestId('custom-close')).toBeInTheDocument()
  })

  it('renders custom removeIcon for all tabs', () => {
    const items: TabItem[] = [
      { key: '1', label: 'Tab 1' },
      { key: '2', label: 'Tab 2' },
    ]
    render(
      <Tabs
        items={items}
        type="editable-card"
        removeIcon={<span data-testid="rm-icon">×</span>}
      />
    )
    expect(screen.getAllByTestId('rm-icon')).toHaveLength(2)
  })

  // ---------- Tab position ----------

  it('renders top position with column direction (default)', () => {
    const { container } = render(<Tabs items={basicItems} />)
    expect((container.firstChild as HTMLElement).style.flexDirection).toBe('column')
  })

  it('renders bottom position with column-reverse direction', () => {
    const { container } = render(<Tabs items={basicItems} tabPosition="bottom" />)
    expect((container.firstChild as HTMLElement).style.flexDirection).toBe('column-reverse')
  })

  it('renders left position with row direction', () => {
    const { container } = render(<Tabs items={basicItems} tabPosition="left" />)
    expect((container.firstChild as HTMLElement).style.flexDirection).toBe('row')
  })

  it('renders right position with row-reverse direction', () => {
    const { container } = render(<Tabs items={basicItems} tabPosition="right" />)
    expect((container.firstChild as HTMLElement).style.flexDirection).toBe('row-reverse')
  })

  // ---------- Size ----------

  it('renders large tabs with fontSize 16', () => {
    render(<Tabs items={basicItems} size="large" />)
    const tab = screen.getAllByRole('tab')[0]
    expect(tab.style.fontSize).toBe('1rem')
  })

  it('renders middle tabs with fontSize 14', () => {
    render(<Tabs items={basicItems} size="middle" />)
    const tab = screen.getAllByRole('tab')[0]
    expect(tab.style.fontSize).toBe('0.875rem')
  })

  it('renders small tabs with fontSize 14', () => {
    render(<Tabs items={basicItems} size="small" />)
    const tab = screen.getAllByRole('tab')[0]
    expect(tab.style.fontSize).toBe('0.875rem')
  })

  // ---------- tabBarExtraContent ----------

  it('renders extra content on the right (ReactNode)', () => {
    render(
      <Tabs items={basicItems} tabBarExtraContent={<span>Extra</span>} />
    )
    expect(screen.getByText('Extra')).toBeInTheDocument()
  })

  it('renders extra content on left and right ({left, right})', () => {
    render(
      <Tabs
        items={basicItems}
        tabBarExtraContent={{ left: <span>Left</span>, right: <span>Right</span> }}
      />
    )
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  // ---------- Tab icons ----------

  it('renders tab icons', () => {
    const items: TabItem[] = [
      { key: '1', label: 'Home', icon: <span data-testid="tab-icon">🏠</span> },
    ]
    render(<Tabs items={items} />)
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument()
  })

  // ---------- destroyOnHidden ----------

  it('keeps inactive panels in DOM by default (lazy render)', () => {
    render(<Tabs items={basicItems} />)

    // Switch to tab 2 so tab 1 content was rendered once
    fireEvent.click(screen.getByText('Tab 2'))

    // Content 1 should still be in the DOM (hidden)
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('destroys inactive panels when destroyOnHidden=true', () => {
    render(<Tabs items={basicItems} destroyOnHidden />)

    // Switch to tab 2
    fireEvent.click(screen.getByText('Tab 2'))

    // Content 1 should be removed from DOM
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
  })

  // ---------- forceRender ----------

  it('renders forceRender panels even if never active', () => {
    const items: TabItem[] = [
      { key: '1', label: 'Tab 1', children: 'Content 1' },
      { key: '2', label: 'Tab 2', children: 'Forced', forceRender: true },
    ]
    render(<Tabs items={items} />)
    // Tab 2 was never active but forceRender=true
    expect(screen.getByText('Forced')).toBeInTheDocument()
  })

  // ---------- className & style ----------

  it('applies custom className to root', () => {
    const { container } = render(<Tabs items={basicItems} className="my-tabs" />)
    expect(container.firstChild).toHaveClass('my-tabs')
  })

  it('applies custom style to root', () => {
    const { container } = render(<Tabs items={basicItems} style={{ margin: 10 }} />)
    expect((container.firstChild as HTMLElement).style.margin).toBe('10px')
  })

  // ---------- Semantic classNames ----------

  it('applies classNames.root', () => {
    const { container } = render(
      <Tabs items={basicItems} classNames={{ root: 'custom-root' }} />
    )
    expect(container.firstChild).toHaveClass('custom-root')
  })

  it('applies classNames.tabBar', () => {
    const { container } = render(
      <Tabs items={basicItems} classNames={{ tabBar: 'custom-bar' }} />
    )
    expect(container.querySelector('.custom-bar')).toBeInTheDocument()
  })

  it('applies classNames.tab to each tab', () => {
    const { container } = render(
      <Tabs items={basicItems} classNames={{ tab: 'custom-tab' }} />
    )
    expect(container.querySelectorAll('.custom-tab')).toHaveLength(3)
  })

  it('applies classNames.content to the content wrapper', () => {
    const { container } = render(
      <Tabs items={basicItems} classNames={{ content: 'custom-content' }} />
    )
    expect(container.querySelector('.custom-content')).toBeInTheDocument()
  })

  it('applies classNames.inkBar to the ink bar (line type)', () => {
    const { container } = render(
      <Tabs items={basicItems} classNames={{ inkBar: 'custom-ink' }} />
    )
    expect(container.querySelector('.custom-ink')).toBeInTheDocument()
  })

  // ---------- tabBarStyle ----------

  it('applies tabBarStyle', () => {
    const { container } = render(
      <Tabs items={basicItems} tabBarStyle={{ backgroundColor: 'red' }} classNames={{ tabBar: 'bar' }} />
    )
    const bar = container.querySelector('.bar') as HTMLElement
    expect(bar.style.backgroundColor).toBe('red')
  })

  // ---------- Edge cases ----------

  it('renders with empty items array', () => {
    const { container } = render(<Tabs items={[]} />)
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })
})
