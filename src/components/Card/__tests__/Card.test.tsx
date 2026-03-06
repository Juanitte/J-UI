import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '../Card'

// Mock ResizeObserver (required by Tabs used inside Card)
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getHeader(container: HTMLElement) {
  const root = getRoot(container)
  return root.querySelector('.ino-card__header') as HTMLElement | null
}

function getBody(container: HTMLElement) {
  const root = getRoot(container)
  // Body is any direct child div that is not header, cover, or actions
  const children = Array.from(root.children) as HTMLElement[]
  return children.find(
    (el) => el.tagName === 'DIV' && !el.classList.contains('ino-card__header') && !el.classList.contains('ino-card__cover') && el.tagName !== 'UL',
  ) || children[children.length - 1] as HTMLElement
}

function getActions(container: HTMLElement) {
  return getRoot(container).querySelector('ul') as HTMLElement | null
}

function getActionItems(container: HTMLElement) {
  const actions = getActions(container)
  return actions ? (Array.from(actions.querySelectorAll('li')) as HTMLElement[]) : []
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Card – Basic rendering', () => {
  it('renders a root div', () => {
    const { container } = render(<Card>Content</Card>)
    expect(getRoot(container).tagName).toBe('DIV')
  })

  it('renders children in body', () => {
    render(<Card>Hello Card</Card>)
    expect(screen.getByText('Hello Card')).toBeInTheDocument()
  })

  it('has card class', () => {
    const { container } = render(<Card>Content</Card>)
    expect(getRoot(container)).toHaveClass('ino-card')
  })

  it('has card class for overflow', () => {
    const { container } = render(<Card>Content</Card>)
    expect(getRoot(container)).toHaveClass('ino-card')
  })

  it('does not show header when no title/extra/tabList', () => {
    const { container } = render(<Card>Content</Card>)
    expect(getHeader(container)).toBeFalsy()
  })
})

// ============================================================================
// Title & Extra
// ============================================================================

describe('Card – Title & Extra', () => {
  it('renders title in header', () => {
    render(<Card title="My Card">Content</Card>)
    expect(screen.getByText('My Card')).toBeInTheDocument()
  })

  it('renders extra in header', () => {
    render(<Card title="Title" extra={<a href="#">More</a>}>Content</Card>)
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('shows header when title is provided', () => {
    const { container } = render(<Card title="Title">Content</Card>)
    expect(getHeader(container)).toBeTruthy()
  })

  it('shows header when only extra is provided', () => {
    const { container } = render(<Card extra="Extra">Content</Card>)
    expect(getHeader(container)).toBeTruthy()
  })

  it('title has title class', () => {
    const { container } = render(<Card title="Title">Content</Card>)
    const title = container.querySelector('.ino-card__title')
    expect(title).toBeTruthy()
    expect(title!.textContent).toBe('Title')
  })

  it('title and extra are in a title row', () => {
    const { container } = render(<Card title="Title" extra="Extra">Content</Card>)
    const header = getHeader(container)!
    const row = header.querySelector('.ino-card__title-row')
    expect(row).toBeTruthy()
  })
})

// ============================================================================
// Variant
// ============================================================================

describe('Card – Variant', () => {
  it('outlined variant (default) has outlined class', () => {
    const { container } = render(<Card>Content</Card>)
    expect(getRoot(container)).toHaveClass('ino-card--outlined')
  })

  it('borderless variant has borderless class', () => {
    const { container } = render(<Card variant="borderless">Content</Card>)
    expect(getRoot(container)).toHaveClass('ino-card--borderless')
  })
})

// ============================================================================
// Size
// ============================================================================

describe('Card – Size', () => {
  it('default size has 1.5rem body padding', () => {
    const { container } = render(<Card>Content</Card>)
    const root = getRoot(container)
    // Body is the only child when no header
    const body = root.querySelector('[style*="padding"]') as HTMLElement
    expect(body).toBeTruthy()
    expect(body.style.padding).toBe('1.5rem')
  })

  it('small size has 0.75rem body padding', () => {
    const { container } = render(<Card size="small">Content</Card>)
    const root = getRoot(container)
    const body = root.querySelector('[style*="padding: 0.75rem"]') as HTMLElement
    expect(body).toBeTruthy()
  })

  it('small size has sm title class', () => {
    const { container } = render(<Card size="small" title="Title">Content</Card>)
    const titleEl = container.querySelector('.ino-card__title--sm')
    expect(titleEl).toBeTruthy()
    expect(titleEl!.textContent).toBe('Title')
  })

  it('default size has default title class', () => {
    const { container } = render(<Card size="default" title="Title">Content</Card>)
    const titleEl = container.querySelector('.ino-card__title--default')
    expect(titleEl).toBeTruthy()
    expect(titleEl!.textContent).toBe('Title')
  })
})

// ============================================================================
// type="inner"
// ============================================================================

describe('Card – type="inner"', () => {
  it('inner card header has inner class', () => {
    const { container } = render(<Card type="inner" title="Inner">Content</Card>)
    const header = getHeader(container)!
    expect(header).toHaveClass('ino-card__header--inner')
  })
})

// ============================================================================
// Cover
// ============================================================================

describe('Card – Cover', () => {
  it('renders cover element', () => {
    render(<Card cover={<img src="cover.png" alt="Cover" />}>Content</Card>)
    const img = screen.getByAltText('Cover')
    expect(img).toBeInTheDocument()
  })

  it('cover is rendered before header', () => {
    const { container } = render(
      <Card cover={<img src="cover.png" alt="Cover" />} title="Title">Content</Card>,
    )
    const root = getRoot(container)
    const first = root.children[0] as HTMLElement
    expect(first).toHaveClass('ino-card__cover')
    expect(first.querySelector('img')).toBeTruthy()
  })

  it('cover wrapper has cover class', () => {
    const { container } = render(
      <Card cover={<img src="cover.png" alt="Cover" />}>Content</Card>,
    )
    const root = getRoot(container)
    const coverWrapper = root.children[0] as HTMLElement
    expect(coverWrapper).toHaveClass('ino-card__cover')
  })
})

// ============================================================================
// Actions
// ============================================================================

describe('Card – Actions', () => {
  it('renders action items', () => {
    const actions = [<span key="a">Edit</span>, <span key="b">Delete</span>]
    render(<Card actions={actions}>Content</Card>)
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('actions are in a ul element', () => {
    const actions = [<span key="a">Edit</span>]
    const { container } = render(<Card actions={actions}>Content</Card>)
    expect(getActions(container)?.tagName).toBe('UL')
  })

  it('each action is a li element', () => {
    const actions = [<span key="a">Edit</span>, <span key="b">Delete</span>]
    const { container } = render(<Card actions={actions}>Content</Card>)
    expect(getActionItems(container).length).toBe(2)
  })

  it('actions have actions class', () => {
    const actions = [<span key="a">Edit</span>]
    const { container } = render(<Card actions={actions}>Content</Card>)
    const ul = getActions(container)!
    expect(ul).toHaveClass('ino-card__actions')
  })

  it('action items have action class', () => {
    const actions = [<span key="a">Edit</span>, <span key="b">Delete</span>]
    const { container } = render(<Card actions={actions}>Content</Card>)
    const items = getActionItems(container)
    items.forEach((item) => {
      expect(item).toHaveClass('ino-card__action')
    })
  })

  it('action items have action class', () => {
    const actions = [<span key="a">Edit</span>]
    const { container } = render(<Card actions={actions}>Content</Card>)
    const items = getActionItems(container)
    expect(items[0]).toHaveClass('ino-card__action')
  })

  it('separator between actions uses bordered class except last', () => {
    const actions = [<span key="a">A</span>, <span key="b">B</span>, <span key="c">C</span>]
    const { container } = render(<Card actions={actions}>Content</Card>)
    const items = getActionItems(container)
    expect(items[0]).toHaveClass('ino-card__action--bordered')
    expect(items[1]).toHaveClass('ino-card__action--bordered')
    expect(items[2]).not.toHaveClass('ino-card__action--bordered')
  })

  it('does not render actions section when actions is empty', () => {
    const { container } = render(<Card actions={[]}>Content</Card>)
    expect(getActions(container)).toBeFalsy()
  })
})

// ============================================================================
// Loading
// ============================================================================

describe('Card – Loading', () => {
  it('shows skeleton when loading=true', () => {
    const { container } = render(<Card loading>Content</Card>)
    // Skeleton has animated divs
    const animated = container.querySelector('[style*="animation"]')
    expect(animated).toBeTruthy()
  })

  it('does not show children when loading', () => {
    render(<Card loading>Actual Content</Card>)
    expect(screen.queryByText('Actual Content')).not.toBeInTheDocument()
  })

  it('shows children when not loading', () => {
    render(<Card loading={false}>Actual Content</Card>)
    expect(screen.getByText('Actual Content')).toBeInTheDocument()
  })

  it('renders 4 skeleton lines', () => {
    const { container } = render(<Card loading>Content</Card>)
    const skeletonLines = container.querySelectorAll('[style*="animation"]')
    expect(skeletonLines.length).toBe(4)
  })
})

// ============================================================================
// Hoverable
// ============================================================================

describe('Card – Hoverable', () => {
  it('has hoverable class on root', () => {
    const { container } = render(<Card hoverable>Content</Card>)
    expect(getRoot(container)).toHaveClass('ino-card--hoverable')
  })

  it('has hoverable class when hoverable', () => {
    const { container } = render(<Card hoverable>Content</Card>)
    expect(getRoot(container)).toHaveClass('ino-card--hoverable')
  })

  it('removes hover effect on mouseLeave', () => {
    const { container } = render(<Card hoverable>Content</Card>)
    const root = getRoot(container)
    fireEvent.mouseEnter(root)
    fireEvent.mouseLeave(root)
    expect(root.style.boxShadow).toBe('')
    expect(root.style.transform).toBe('')
  })

  it('does not apply hover effect when hoverable=false', () => {
    const { container } = render(<Card hoverable={false}>Content</Card>)
    const root = getRoot(container)
    fireEvent.mouseEnter(root)
    expect(root.style.transform).toBe('')
  })
})

// ============================================================================
// Tabs
// ============================================================================

describe('Card – Tabs', () => {
  const tabList = [
    { key: 'tab1', label: 'Tab 1' },
    { key: 'tab2', label: 'Tab 2' },
    { key: 'tab3', label: 'Tab 3', disabled: true },
  ]

  it('renders tabs in header when tabList is provided', () => {
    render(<Card tabList={tabList}>Content</Card>)
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('shows header when only tabList is provided (no title/extra)', () => {
    const { container } = render(<Card tabList={tabList}>Content</Card>)
    expect(getHeader(container)).toBeTruthy()
  })

  it('calls onTabChange when switching tabs', () => {
    const onTabChange = vi.fn()
    render(
      <Card tabList={tabList} defaultActiveTabKey="tab1" onTabChange={onTabChange}>
        Content
      </Card>,
    )
    fireEvent.click(screen.getByText('Tab 2'))
    expect(onTabChange).toHaveBeenCalledWith('tab2')
  })

  it('renders tabs alongside title', () => {
    render(
      <Card title="My Card" tabList={tabList}>Content</Card>,
    )
    expect(screen.getByText('My Card')).toBeInTheDocument()
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
  })

  it('header has no bottom padding when tabs present', () => {
    const { container } = render(<Card tabList={tabList}>Content</Card>)
    const header = getHeader(container)!
    // padding should end with '0' (padding-bottom is 0)
    expect(header.style.padding).toContain('0')
  })
})

// ============================================================================
// Card.Meta
// ============================================================================

describe('Card.Meta', () => {
  it('renders title', () => {
    render(<Card.Meta title="Meta Title" />)
    expect(screen.getByText('Meta Title')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Card.Meta description="Meta Description" />)
    expect(screen.getByText('Meta Description')).toBeInTheDocument()
  })

  it('renders avatar', () => {
    render(<Card.Meta avatar={<img src="avatar.png" alt="Avatar" />} title="Name" />)
    expect(screen.getByAltText('Avatar')).toBeInTheDocument()
  })

  it('renders all three together', () => {
    render(
      <Card.Meta
        avatar={<span data-testid="av">AV</span>}
        title="User Name"
        description="Some description"
      />,
    )
    expect(screen.getByTestId('av')).toBeInTheDocument()
    expect(screen.getByText('User Name')).toBeInTheDocument()
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  it('has meta class', () => {
    const { container } = render(<Card.Meta avatar={<span>A</span>} title="T" />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('ino-card-meta')
  })

  it('title has meta title class', () => {
    const { container } = render(<Card.Meta title="Title" />)
    const title = container.querySelector('.ino-card-meta__title')
    expect(title?.textContent).toBe('Title')
  })

  it('description has meta description class', () => {
    const { container } = render(<Card.Meta description="Desc" />)
    const desc = container.querySelector('.ino-card-meta__description')
    expect(desc?.textContent).toBe('Desc')
  })

  it('applies className', () => {
    const { container } = render(<Card.Meta title="T" className="my-meta" />)
    expect(container.firstElementChild!.className).toContain('my-meta')
  })

  it('applies style', () => {
    const { container } = render(<Card.Meta title="T" style={{ margin: '5px' }} />)
    expect((container.firstElementChild as HTMLElement).style.margin).toBe('5px')
  })
})

// ============================================================================
// Card.Grid
// ============================================================================

describe('Card.Grid', () => {
  it('renders children', () => {
    render(<Card.Grid>Grid Item</Card.Grid>)
    expect(screen.getByText('Grid Item')).toBeInTheDocument()
  })

  it('has grid class', () => {
    const { container } = render(<Card.Grid>Item</Card.Grid>)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('ino-card-grid')
  })

  it('has grid class for borders', () => {
    const { container } = render(<Card.Grid>Item</Card.Grid>)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('ino-card-grid')
  })

  it('has hoverable class when hoverable (default)', () => {
    const { container } = render(<Card.Grid>Item</Card.Grid>)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('ino-card-grid--hoverable')
  })

  it('has no hoverable class when hoverable=false', () => {
    const { container } = render(<Card.Grid hoverable={false}>Item</Card.Grid>)
    const root = container.firstElementChild as HTMLElement
    expect(root).not.toHaveClass('ino-card-grid--hoverable')
  })

  it('has hoverable class on grid', () => {
    const { container } = render(<Card.Grid>Item</Card.Grid>)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('ino-card-grid--hoverable')
  })

  it('has grid class for hover effects', () => {
    const { container } = render(<Card.Grid>Item</Card.Grid>)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('ino-card-grid')
  })

  it('does not have hoverable class when hoverable=false', () => {
    const { container } = render(<Card.Grid hoverable={false}>Item</Card.Grid>)
    const root = container.firstElementChild as HTMLElement
    expect(root).not.toHaveClass('ino-card-grid--hoverable')
  })

  it('applies className', () => {
    const { container } = render(<Card.Grid className="my-grid">Item</Card.Grid>)
    expect(container.firstElementChild!.className).toContain('my-grid')
  })

  it('applies style', () => {
    const { container } = render(<Card.Grid style={{ backgroundColor: 'pink' }}>Item</Card.Grid>)
    expect((container.firstElementChild as HTMLElement).style.backgroundColor).toBe('pink')
  })
})

// ============================================================================
// Card with Card.Grid children
// ============================================================================

describe('Card – Grid layout detection', () => {
  it('applies grid body class when children contain Card.Grid', () => {
    const { container } = render(
      <Card>
        <Card.Grid>A</Card.Grid>
        <Card.Grid>B</Card.Grid>
      </Card>,
    )
    const root = getRoot(container)
    const body = root.querySelector('.ino-card__body--grid') as HTMLElement
    expect(body).toBeTruthy()
  })

  it('uses grid body class for grid children', () => {
    const { container } = render(
      <Card>
        <Card.Grid>A</Card.Grid>
        <Card.Grid>B</Card.Grid>
      </Card>,
    )
    const root = getRoot(container)
    const body = root.querySelector('.ino-card__body--grid') as HTMLElement
    expect(body).toBeTruthy()
  })
})

// ============================================================================
// className & style
// ============================================================================

describe('Card – className & style', () => {
  it('applies className to root', () => {
    const { container } = render(<Card className="my-card">Content</Card>)
    expect(getRoot(container).className).toContain('my-card')
  })

  it('applies style to root', () => {
    const { container } = render(<Card style={{ margin: '20px' }}>Content</Card>)
    expect(getRoot(container).style.margin).toBe('20px')
  })
})

// ============================================================================
// Semantic classNames
// ============================================================================

describe('Card – Semantic classNames', () => {
  it('applies classNames.root', () => {
    const { container } = render(
      <Card classNames={{ root: 'card-root' }}>Content</Card>,
    )
    expect(getRoot(container).className).toContain('card-root')
  })

  it('applies classNames.header', () => {
    const { container } = render(
      <Card title="Title" classNames={{ header: 'card-header' }}>Content</Card>,
    )
    expect(getHeader(container)!.className).toContain('card-header')
  })

  it('applies classNames.body', () => {
    const { container } = render(
      <Card classNames={{ body: 'card-body' }}>Content</Card>,
    )
    const body = container.querySelector('.card-body')
    expect(body).toBeTruthy()
  })

  it('applies classNames.title', () => {
    const { container } = render(
      <Card title="T" classNames={{ title: 'card-title' }}>Content</Card>,
    )
    expect(container.querySelector('.card-title')?.textContent).toBe('T')
  })

  it('applies classNames.extra', () => {
    const { container } = render(
      <Card title="T" extra="E" classNames={{ extra: 'card-extra' }}>Content</Card>,
    )
    expect(container.querySelector('.card-extra')?.textContent).toBe('E')
  })

  it('applies classNames.actions', () => {
    const { container } = render(
      <Card actions={[<span key="a">A</span>]} classNames={{ actions: 'card-actions' }}>
        Content
      </Card>,
    )
    expect(container.querySelector('.card-actions')?.tagName).toBe('UL')
  })

  it('applies classNames.cover', () => {
    const { container } = render(
      <Card cover={<img src="c.png" alt="C" />} classNames={{ cover: 'card-cover' }}>
        Content
      </Card>,
    )
    expect(container.querySelector('.card-cover')).toBeTruthy()
  })
})

// ============================================================================
// Semantic styles
// ============================================================================

describe('Card – Semantic styles', () => {
  it('applies styles.root', () => {
    const { container } = render(
      <Card styles={{ root: { boxShadow: '0 0 5px red' } }}>Content</Card>,
    )
    expect(getRoot(container).style.boxShadow).toBe('0 0 5px red')
  })

  it('applies styles.header', () => {
    const { container } = render(
      <Card title="T" styles={{ header: { backgroundColor: 'pink' } }}>Content</Card>,
    )
    expect(getHeader(container)!.style.backgroundColor).toBe('pink')
  })

  it('applies styles.body', () => {
    const { container } = render(
      <Card styles={{ body: { minHeight: '100px' } }}>Content</Card>,
    )
    const body = container.querySelector('[style*="min-height: 100px"]')
    expect(body).toBeTruthy()
  })

  it('applies styles.title', () => {
    const { container } = render(
      <Card title="T" styles={{ title: { color: 'red' } }}>Content</Card>,
    )
    const title = container.querySelector('[style*="color: red"]')
    expect(title?.textContent).toBe('T')
  })

  it('applies styles.extra', () => {
    const { container } = render(
      <Card title="T" extra="E" styles={{ extra: { fontWeight: '700' } }}>Content</Card>,
    )
    const extra = container.querySelector('[style*="font-weight: 700"]')
    expect(extra?.textContent).toBe('E')
  })

  it('applies styles.cover', () => {
    const { container } = render(
      <Card cover={<img src="c.png" alt="C" />} styles={{ cover: { maxHeight: '200px' } }}>
        Content
      </Card>,
    )
    const cover = container.querySelector('[style*="max-height: 200px"]')
    expect(cover).toBeTruthy()
  })

  it('applies styles.actions', () => {
    const { container } = render(
      <Card actions={[<span key="a">A</span>]} styles={{ actions: { backgroundColor: 'pink' } }}>
        Content
      </Card>,
    )
    expect(getActions(container)!.style.backgroundColor).toBe('pink')
  })
})

// ============================================================================
// Compound export
// ============================================================================

describe('Card – Compound export', () => {
  it('has Meta sub-component', () => {
    expect(Card.Meta).toBeDefined()
    expect(typeof Card.Meta).toBe('function')
  })

  it('has Grid sub-component', () => {
    expect(Card.Grid).toBeDefined()
    expect(typeof Card.Grid).toBe('function')
  })
})
