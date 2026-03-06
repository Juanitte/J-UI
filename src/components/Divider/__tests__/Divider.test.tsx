import { render, screen } from '@testing-library/react'
import { Divider } from '../Divider'

describe('Divider', () => {
  it('renders a horizontal divider by default', () => {
    const { container } = render(<Divider />)
    const el = container.firstChild as HTMLElement
    expect(el.nodeName).toBe('DIV')
    expect(el.getAttribute('role')).toBe('separator')
  })

  it('renders a vertical divider as a span', () => {
    const { container } = render(<Divider type="vertical" />)
    const el = container.firstChild as HTMLElement
    expect(el.nodeName).toBe('SPAN')
    expect(el.getAttribute('role')).toBe('separator')
  })

  it('renders horizontal divider with text', () => {
    render(<Divider>Section</Divider>)
    expect(screen.getByText('Section')).toBeInTheDocument()
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('applies dashed border style', () => {
    const { container } = render(<Divider dashed />)
    const el = container.firstChild as HTMLElement
    expect(el.style.borderBlockStart).toContain('dashed')
  })

  it('applies solid border style by default', () => {
    const { container } = render(<Divider />)
    const el = container.firstChild as HTMLElement
    expect(el.style.borderBlockStart).toContain('solid')
  })

  it('renders text with left orientation', () => {
    const { container } = render(<Divider orientation="left">Left</Divider>)
    // Should have two line spans and a text span
    const spans = container.querySelectorAll('span')
    expect(spans.length).toBe(3) // before line, text, after line
  })

  it('applies custom className', () => {
    const { container } = render(<Divider className="my-divider" />)
    expect(container.firstChild).toHaveClass('my-divider')
  })

  it('applies custom style', () => {
    const { container } = render(<Divider style={{ margin: '10px 0' }} />)
    expect((container.firstChild as HTMLElement).style.margin).toBe('10px 0px')
  })

  it('applies thickness as number', () => {
    const { container } = render(<Divider thickness={3} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.borderBlockStart).toContain('3px')
  })

  it('applies plain text style', () => {
    render(<Divider plain>Plain Text</Divider>)
    const textEl = screen.getByText('Plain Text')
    expect(textEl).toHaveClass('ino-divider__text--plain')
  })
})
