import { render, screen } from '@testing-library/react'
import { Splitter } from '../Splitter'

describe('Splitter', () => {
  it('renders panels with content', () => {
    render(
      <Splitter>
        <Splitter.Panel>Panel A</Splitter.Panel>
        <Splitter.Panel>Panel B</Splitter.Panel>
      </Splitter>
    )
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.getByText('Panel B')).toBeInTheDocument()
  })

  it('renders as a div with flex display', () => {
    const { container } = render(
      <Splitter>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('ino-splitter')
  })

  it('renders horizontal by default (row direction)', () => {
    const { container } = render(
      <Splitter>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('ino-splitter--horizontal')
  })

  it('renders vertical orientation (column direction)', () => {
    const { container } = render(
      <Splitter orientation="vertical">
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    )
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('ino-splitter--vertical')
  })

  it('renders a split bar between panels', () => {
    const { container } = render(
      <Splitter>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    )
    // The split bar now uses BEM class
    const bars = container.querySelectorAll('.ino-splitter__bar')
    expect(bars.length).toBe(1)
  })

  it('renders multiple split bars for multiple panels', () => {
    const { container } = render(
      <Splitter>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
        <Splitter.Panel>C</Splitter.Panel>
      </Splitter>
    )
    const bars = container.querySelectorAll('.ino-splitter__bar')
    expect(bars.length).toBe(2)
  })

  it('applies custom className', () => {
    const { container } = render(
      <Splitter className="my-splitter">
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    )
    expect(container.firstChild).toHaveClass('my-splitter')
  })

  it('renders collapsible buttons when panel has collapsible=true', () => {
    const { container } = render(
      <Splitter>
        <Splitter.Panel collapsible>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    )
    // Collapse buttons are rendered in the split bar
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})

describe('Splitter.Panel', () => {
  it('returns null when rendered directly (declarative only)', () => {
    const { container } = render(<Splitter.Panel>Direct</Splitter.Panel>)
    expect(container.firstChild).toBeNull()
  })
})
