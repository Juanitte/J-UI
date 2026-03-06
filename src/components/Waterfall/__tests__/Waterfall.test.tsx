import { render, screen } from '@testing-library/react'
import { Waterfall } from '../Waterfall'

describe('Waterfall', () => {
  const items = [
    { key: '1', children: <div>Item 1</div> },
    { key: '2', children: <div>Item 2</div> },
    { key: '3', children: <div>Item 3</div> },
    { key: '4', children: <div>Item 4</div> },
    { key: '5', children: <div>Item 5</div> },
    { key: '6', children: <div>Item 6</div> },
  ]

  it('renders all items', () => {
    render(<Waterfall items={items} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 6')).toBeInTheDocument()
  })

  it('renders as a flex row container', () => {
    const { container } = render(<Waterfall items={items} />)
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('ino-waterfall')
  })

  it('renders 3 columns by default', () => {
    const { container } = render(<Waterfall items={items} />)
    const root = container.firstChild as HTMLElement
    // Direct children of root are the columns
    const columns = Array.from(root.children)
    expect(columns.length).toBe(3)
  })

  it('renders custom number of columns', () => {
    const { container } = render(<Waterfall items={items} columns={2} />)
    const root = container.firstChild as HTMLElement
    const columns = Array.from(root.children)
    expect(columns.length).toBe(2)
  })

  it('renders empty when no items', () => {
    const { container } = render(<Waterfall items={[]} columns={3} />)
    const root = container.firstChild as HTMLElement
    const columns = Array.from(root.children)
    // 3 empty columns
    columns.forEach(col => {
      expect(col.children.length).toBe(0)
    })
  })

  it('renders using itemRender function', () => {
    const renderItems = [
      { key: '1', data: { label: 'Custom 1' } },
      { key: '2', data: { label: 'Custom 2' } },
    ]
    render(
      <Waterfall
        items={renderItems}
        itemRender={(info) => <div>{(info.data as { label: string }).label}</div>}
      />
    )
    expect(screen.getByText('Custom 1')).toBeInTheDocument()
    expect(screen.getByText('Custom 2')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Waterfall items={items} className="my-waterfall" />)
    expect(container.firstChild).toHaveClass('my-waterfall')
  })

  it('applies gutter as negative margins', () => {
    const { container } = render(<Waterfall items={items} gutter={16} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.marginLeft).toBe('-8px')
    expect(root.style.marginRight).toBe('-8px')
  })
})
