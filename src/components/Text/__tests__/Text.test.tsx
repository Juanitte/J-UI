import { render, screen } from '@testing-library/react'
import { Text } from '../Text'

describe('Text', () => {
  it('renders children text', () => {
    render(<Text>Hello World</Text>)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders as a span by default', () => {
    const { container } = render(<Text>Span</Text>)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('applies size styles', () => {
    const { container } = render(<Text size="xs">Small</Text>)
    expect((container.firstChild as HTMLElement).style.fontSize).toBe('0.625rem')
  })

  it('applies disabled styles', () => {
    const { container } = render(<Text disabled>Disabled</Text>)
    const el = container.firstChild as HTMLElement
    expect(el.style.opacity).toBe('0.6')
    expect(el.style.cursor).toBe('not-allowed')
  })

  it('wraps content in <mark> when mark=true', () => {
    const { container } = render(<Text mark>Highlighted</Text>)
    expect(container.querySelector('mark')).toBeInTheDocument()
  })

  it('wraps content in <code> when code=true', () => {
    const { container } = render(<Text code>code snippet</Text>)
    expect(container.querySelector('code')).toBeInTheDocument()
  })

  it('wraps content in <kbd> when keyboard=true', () => {
    const { container } = render(<Text keyboard>Ctrl+C</Text>)
    expect(container.querySelector('kbd')).toBeInTheDocument()
  })

  it('applies underline text-decoration', () => {
    const { container } = render(<Text underline>Underlined</Text>)
    expect((container.firstChild as HTMLElement).style.textDecoration).toBe('underline')
  })

  it('applies line-through for delete prop', () => {
    const { container } = render(<Text delete>Deleted</Text>)
    expect((container.firstChild as HTMLElement).style.textDecoration).toBe('line-through')
  })

  it('applies italic font style', () => {
    const { container } = render(<Text italic>Italic</Text>)
    expect((container.firstChild as HTMLElement).style.fontStyle).toBe('italic')
  })

  it('applies weight styles', () => {
    const { container } = render(<Text weight="bold">Bold</Text>)
    expect((container.firstChild as HTMLElement).style.fontWeight).toBe('700')
  })

  it('applies lineHeight styles', () => {
    const { container } = render(<Text lineHeight="loose">Loose</Text>)
    expect((container.firstChild as HTMLElement).style.lineHeight).toBe('2')
  })

  it('applies ellipsis overflow styles when ellipsis=true', () => {
    const { container } = render(<Text ellipsis>Long text here</Text>)
    const el = container.firstChild as HTMLElement
    expect(el.style.overflow).toBe('hidden')
    expect(el.style.textOverflow).toBe('ellipsis')
    expect(el.style.whiteSpace).toBe('nowrap')
  })

  it('renders multi-line ellipsis as a div', () => {
    const { container } = render(
      <Text ellipsis={{ rows: 3 }}>Multi line text</Text>
    )
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('renders expand button when ellipsis.expandable=true', () => {
    render(<Text ellipsis={{ expandable: true }}>Expandable text</Text>)
    expect(screen.getByText('más')).toBeInTheDocument()
  })

  it('renders copy button when copyable=true', () => {
    render(<Text copyable>Copyable text</Text>)
    const button = screen.getByTitle('Copiar')
    expect(button).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Text className="my-class">T</Text>)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
