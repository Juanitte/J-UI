import { render, screen } from '@testing-library/react'
import { Grid } from '../Grid'

describe('Grid.Row', () => {
  it('renders children', () => {
    render(
      <Grid.Row>
        <Grid.Col span={12}>Left</Grid.Col>
        <Grid.Col span={12}>Right</Grid.Col>
      </Grid.Row>
    )
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('renders as a flex container', () => {
    const { container } = render(<Grid.Row><div>C</div></Grid.Row>)
    expect(container.firstChild).toHaveClass('ino-row')
  })

  it('applies wrap by default', () => {
    const { container } = render(<Grid.Row><div>C</div></Grid.Row>)
    expect(container.firstChild).toHaveClass('ino-row--wrap')
  })

  it('applies nowrap when wrap=false', () => {
    const { container } = render(<Grid.Row wrap={false}><div>C</div></Grid.Row>)
    expect(container.firstChild).toHaveClass('ino-row--nowrap')
  })

  it('applies align prop', () => {
    const { container } = render(<Grid.Row align="middle"><div>C</div></Grid.Row>)
    expect(container.firstChild).toHaveClass('ino-row--align-middle')
  })

  it('applies justify prop', () => {
    const { container } = render(<Grid.Row justify="center"><div>C</div></Grid.Row>)
    expect(container.firstChild).toHaveClass('ino-row--justify-center')
  })

  it('applies numeric gutter as negative margins', () => {
    const { container } = render(<Grid.Row gutter={16}><div>C</div></Grid.Row>)
    const row = container.firstChild as HTMLElement
    expect(row.style.marginLeft).toBe('-8px')
    expect(row.style.marginRight).toBe('-8px')
  })

  it('applies custom className', () => {
    const { container } = render(<Grid.Row className="my-row"><div>C</div></Grid.Row>)
    expect(container.firstChild).toHaveClass('my-row')
  })
})

describe('Grid.Col', () => {
  it('renders children', () => {
    render(
      <Grid.Row>
        <Grid.Col span={24}>Full Width</Grid.Col>
      </Grid.Row>
    )
    expect(screen.getByText('Full Width')).toBeInTheDocument()
  })

  it('applies span as percentage width', () => {
    render(
      <Grid.Row>
        <Grid.Col span={12}><span>Half</span></Grid.Col>
      </Grid.Row>
    )
    // getByText returns the <span>, closest div is the Col
    const col = screen.getByText('Half').closest('div') as HTMLElement
    expect(col.style.flex).toBe('0 0 50%')
    expect(col.style.maxWidth).toBe('50%')
  })

  it('applies offset as margin-left', () => {
    render(
      <Grid.Row>
        <Grid.Col span={12} offset={6}><span>Offset</span></Grid.Col>
      </Grid.Row>
    )
    const col = screen.getByText('Offset').closest('div') as HTMLElement
    expect(col.style.marginLeft).toBe('25%')
  })

  it('hides column when span=0', () => {
    render(
      <Grid.Row>
        <Grid.Col span={0}><span>Hidden</span></Grid.Col>
      </Grid.Row>
    )
    const col = screen.getByText('Hidden').closest('div') as HTMLElement
    expect(col).toHaveClass('ino-col--hidden')
  })

  it('applies order', () => {
    render(
      <Grid.Row>
        <Grid.Col span={12} order={2}><span>Second</span></Grid.Col>
        <Grid.Col span={12} order={1}><span>First</span></Grid.Col>
      </Grid.Row>
    )
    const second = screen.getByText('Second').closest('div') as HTMLElement
    const first = screen.getByText('First').closest('div') as HTMLElement
    expect(second.style.order).toBe('2')
    expect(first.style.order).toBe('1')
  })

  it('applies flex property', () => {
    render(
      <Grid.Row>
        <Grid.Col flex="auto"><span>Flex</span></Grid.Col>
      </Grid.Row>
    )
    const col = screen.getByText('Flex').closest('div') as HTMLElement
    // jsdom normalizes 'auto' to '1 1 auto'
    expect(col.style.flex).toContain('auto')
  })

  it('applies gutter from Row context', () => {
    render(
      <Grid.Row gutter={24}>
        <Grid.Col span={12}><span>With Gutter</span></Grid.Col>
      </Grid.Row>
    )
    const col = screen.getByText('With Gutter').closest('div') as HTMLElement
    expect(col.style.paddingLeft).toBe('12px')
    expect(col.style.paddingRight).toBe('12px')
  })

  it('applies push positioning', () => {
    render(
      <Grid.Row>
        <Grid.Col span={12} push={6}><span>Pushed</span></Grid.Col>
      </Grid.Row>
    )
    const col = screen.getByText('Pushed').closest('div') as HTMLElement
    expect(col.style.position).toBe('relative')
    expect(col.style.left).toBe('25%')
  })

  it('applies custom className', () => {
    render(
      <Grid.Row>
        <Grid.Col span={12} className="my-col"><span>C</span></Grid.Col>
      </Grid.Row>
    )
    const col = screen.getByText('C').closest('.my-col')
    expect(col).toBeInTheDocument()
  })
})
