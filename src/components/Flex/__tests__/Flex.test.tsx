import { render, screen } from '@testing-library/react'
import { Flex } from '../Flex'

describe('Flex', () => {
  it('renders children', () => {
    render(<Flex><span>Child</span></Flex>)
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('renders as a div by default', () => {
    const { container } = render(<Flex>Content</Flex>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('renders as a custom component', () => {
    const { container } = render(<Flex component="section">Content</Flex>)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })

  it('applies horizontal direction by default', () => {
    const { container } = render(<Flex>Content</Flex>)
    expect(container.firstChild).toHaveClass('ino-flex--row')
  })

  it('applies vertical direction', () => {
    const { container } = render(<Flex vertical>Content</Flex>)
    expect(container.firstChild).toHaveClass('ino-flex--column')
  })

  it('applies wrap', () => {
    const { container } = render(<Flex wrap="wrap">Content</Flex>)
    expect(container.firstChild).toHaveClass('ino-flex--wrap')
  })

  it('applies wrap as boolean', () => {
    const { container } = render(<Flex wrap>Content</Flex>)
    expect(container.firstChild).toHaveClass('ino-flex--wrap')
  })

  it('applies nowrap by default', () => {
    const { container } = render(<Flex>Content</Flex>)
    expect(container.firstChild).toHaveClass('ino-flex--nowrap')
  })

  it('applies justify and align', () => {
    const { container } = render(<Flex justify="center" align="flex-end">Content</Flex>)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('ino-flex--justify-center')
    expect(el).toHaveClass('ino-flex--align-end')
  })

  it('applies named gap values', () => {
    const { container } = render(<Flex gap="small">Content</Flex>)
    expect(container.firstChild).toHaveClass('ino-flex--gap-small')
  })

  it('applies numeric gap', () => {
    const { container } = render(<Flex gap={20}>Content</Flex>)
    expect((container.firstChild as HTMLElement).style.gap).toBe('20px')
  })

  it('applies array gap [horizontal, vertical]', () => {
    const { container } = render(<Flex gap={[10, 20]}>Content</Flex>)
    expect((container.firstChild as HTMLElement).style.gap).toBe('20px 10px')
  })

  it('applies flex property', () => {
    const { container } = render(<Flex flex="1 1 auto">Content</Flex>)
    expect((container.firstChild as HTMLElement).style.flex).toBe('1 1 auto')
  })

  it('applies custom className and style', () => {
    const { container } = render(
      <Flex className="my-flex" style={{ padding: 10 }}>Content</Flex>
    )
    expect(container.firstChild).toHaveClass('my-flex')
    expect((container.firstChild as HTMLElement).style.padding).toBe('10px')
  })
})
