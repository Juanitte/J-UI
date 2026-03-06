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

  it('applies size class', () => {
    const { container } = render(<Text size="xs">Small</Text>)
    expect(container.firstChild).toHaveClass('ino-text--xs')
  })

  it('applies disabled class', () => {
    const { container } = render(<Text disabled>Disabled</Text>)
    expect(container.firstChild).toHaveClass('ino-text--disabled')
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

  it('applies underline class', () => {
    const { container } = render(<Text underline>Underlined</Text>)
    expect(container.firstChild).toHaveClass('ino-text--underline')
  })

  it('applies delete class', () => {
    const { container } = render(<Text delete>Deleted</Text>)
    expect(container.firstChild).toHaveClass('ino-text--delete')
  })

  it('applies italic class', () => {
    const { container } = render(<Text italic>Italic</Text>)
    expect(container.firstChild).toHaveClass('ino-text--italic')
  })

  it('applies weight class', () => {
    const { container } = render(<Text weight="bold">Bold</Text>)
    expect(container.firstChild).toHaveClass('ino-text--weight-bold')
  })

  it('applies lineHeight class', () => {
    const { container } = render(<Text lineHeight="loose">Loose</Text>)
    expect(container.firstChild).toHaveClass('ino-text--lh-loose')
  })

  it('applies ellipsis class when ellipsis=true', () => {
    const { container } = render(<Text ellipsis>Long text here</Text>)
    expect(container.firstChild).toHaveClass('ino-text--ellipsis-1')
  })

  it('renders multi-line ellipsis as a div', () => {
    const { container } = render(
      <Text ellipsis={{ rows: 3 }}>Multi line text</Text>
    )
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('renders expand button when ellipsis.expandable=true', () => {
    render(<Text ellipsis={{ expandable: true }}>Expandable text</Text>)
    expect(screen.getByText('mas')).toBeInTheDocument()
  })

  it('renders copy button when copyable=true', () => {
    render(<Text copyable>Copyable text</Text>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Text className="my-class">T</Text>)
    expect(container.firstChild).toHaveClass('my-class')
  })
})
