import { render, screen } from '@testing-library/react'
import { Space } from '../Space'

describe('Space', () => {
  it('renders children', () => {
    render(
      <Space>
        <span>A</span>
        <span>B</span>
      </Space>
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('returns null when no children', () => {
    const { container } = render(<Space />)
    expect(container.firstChild).toBeNull()
  })

  it('renders with BEM base class', () => {
    const { container } = render(
      <Space><span>A</span></Space>
    )
    expect(container.firstChild).toHaveClass('ino-space')
  })

  it('renders horizontal by default', () => {
    const { container } = render(
      <Space><span>A</span><span>B</span></Space>
    )
    expect(container.firstChild).toHaveClass('ino-space--horizontal')
  })

  it('renders vertical direction', () => {
    const { container } = render(
      <Space direction="vertical"><span>A</span><span>B</span></Space>
    )
    expect(container.firstChild).toHaveClass('ino-space--vertical')
  })

  it('applies size as named value', () => {
    const { container } = render(
      <Space size="large"><span>A</span><span>B</span></Space>
    )
    expect((container.firstChild as HTMLElement).style.gap).toBe('1.5rem')
  })

  it('applies size as number', () => {
    const { container } = render(
      <Space size={32}><span>A</span><span>B</span></Space>
    )
    expect((container.firstChild as HTMLElement).style.gap).toBe('32px')
  })

  it('applies size as [horizontal, vertical] tuple', () => {
    const { container } = render(
      <Space size={['small', 'large']}><span>A</span><span>B</span></Space>
    )
    expect((container.firstChild as HTMLElement).style.gap).toBe('1.5rem 0.5rem')
  })

  it('applies wrap class', () => {
    const { container } = render(
      <Space wrap><span>A</span><span>B</span></Space>
    )
    expect(container.firstChild).toHaveClass('ino-space--wrap')
  })

  it('renders with split separator', () => {
    render(
      <Space split={<span data-testid="sep">|</span>}>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </Space>
    )
    const seps = screen.getAllByTestId('sep')
    expect(seps).toHaveLength(2) // 3 items = 2 separators
  })

  it('applies custom className', () => {
    const { container } = render(
      <Space className="my-space"><span>A</span></Space>
    )
    expect(container.firstChild).toHaveClass('my-space')
  })
})

describe('Space.Compact', () => {
  it('renders children', () => {
    render(
      <Space.Compact>
        <button>A</button>
        <button>B</button>
      </Space.Compact>
    )
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('returns null when no children', () => {
    const { container } = render(<Space.Compact />)
    expect(container.firstChild).toBeNull()
  })

  it('renders with BEM base class', () => {
    const { container } = render(
      <Space.Compact><button>A</button></Space.Compact>
    )
    expect(container.firstChild).toHaveClass('ino-space-compact')
  })

  it('renders as flex when block=true', () => {
    const { container } = render(
      <Space.Compact block><button>A</button></Space.Compact>
    )
    expect(container.firstChild).toHaveClass('ino-space-compact--block')
  })

  it('renders horizontal direction by default', () => {
    const { container } = render(
      <Space.Compact><button>A</button></Space.Compact>
    )
    expect(container.firstChild).toHaveClass('ino-space-compact--horizontal')
  })

  it('renders vertical direction', () => {
    const { container } = render(
      <Space.Compact direction="vertical"><button>A</button></Space.Compact>
    )
    expect(container.firstChild).toHaveClass('ino-space-compact--vertical')
  })
})
