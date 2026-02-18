import { vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Steps } from '../Steps'
import type { StepItem } from '../Steps'

const basicItems: StepItem[] = [
  { title: 'First' },
  { title: 'Second' },
  { title: 'Third' },
]

describe('Steps', () => {
  // ---------- Basic rendering ----------

  it('renders a navigation landmark with aria-label', () => {
    render(<Steps items={basicItems} />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Steps')
  })

  it('renders all step titles', () => {
    render(<Steps items={basicItems} />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
  })

  it('displays 1-based step numbers', () => {
    render(<Steps items={basicItems} current={2} />)
    // Only the last step (index 2, "wait" would show number 3) — but current=2 means
    // step 0 → finish (check icon), step 1 → finish (check icon), step 2 → process (shows "3")
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  // ---------- Auto-derived status ----------

  it('gives "finish" status to steps before current', () => {
    const { container } = render(<Steps items={basicItems} current={2} />)
    // Finished steps render CheckIcon (svg with polyline)
    const svgs = container.querySelectorAll('svg')
    // Steps 0 and 1 should have check icons
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })

  it('gives "process" status with bold title to the current step', () => {
    render(<Steps items={basicItems} current={1} />)
    const title = screen.getByText('Second')
    expect(title.style.fontWeight).toBe('600')
  })

  it('gives "wait" status with muted style to steps after current', () => {
    render(<Steps items={basicItems} current={0} />)
    const waitTitle = screen.getByText('Third')
    // Wait titles have a non-empty color (muted)
    expect(waitTitle.style.color).not.toBe('')
  })

  // ---------- Status override ----------

  it('uses item.status override instead of computed status', () => {
    const items: StepItem[] = [
      { title: 'Done', status: 'finish' },
      { title: 'Oops', status: 'error' },
      { title: 'Waiting' },
    ]
    render(<Steps items={items} current={0} />)
    // "Oops" should have error color even though it's after current
    const errorTitle = screen.getByText('Oops')
    expect(errorTitle.style.color).not.toBe('')
  })

  // ---------- Error status prop ----------

  it('applies error status to current step via status prop', () => {
    const { container } = render(
      <Steps items={basicItems} current={1} status="error" />
    )
    // Error step gets a CloseIcon (X svg)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(1)
    // The error title should have error styling
    const title = screen.getByText('Second')
    expect(title.style.color).not.toBe('')
  })

  // ---------- Custom icon ----------

  it('renders custom item icon instead of number', () => {
    const items: StepItem[] = [
      { title: 'Custom', icon: <span data-testid="custom-icon">★</span> },
    ]
    render(<Steps items={items} />)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  // ---------- Description ----------

  it('renders step descriptions', () => {
    const items: StepItem[] = [
      { title: 'Step 1', description: 'Description 1' },
      { title: 'Step 2', description: 'Description 2' },
    ]
    render(<Steps items={items} />)
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('Description 2')).toBeInTheDocument()
  })

  // ---------- SubTitle ----------

  it('renders subTitle next to title', () => {
    const items: StepItem[] = [
      { title: 'Main', subTitle: 'Sub Info' },
    ]
    render(<Steps items={items} />)
    expect(screen.getByText('Sub Info')).toBeInTheDocument()
  })

  // ---------- Direction ----------

  it('renders horizontally by default (flexDirection row)', () => {
    render(<Steps items={basicItems} />)
    const nav = screen.getByRole('navigation')
    expect(nav.style.flexDirection).toBe('row')
  })

  it('renders vertically when direction="vertical"', () => {
    render(<Steps items={basicItems} direction="vertical" />)
    const nav = screen.getByRole('navigation')
    expect(nav.style.flexDirection).toBe('column')
  })

  // ---------- Size ----------

  it('renders small icons (24px) when size="small"', () => {
    const { container } = render(<Steps items={[{ title: 'A' }]} size="small" />)
    // Icon wrapper has width/height = 24
    const iconWrapper = container.querySelector('div[style*="width: 1.5rem"]')
    expect(iconWrapper).toBeInTheDocument()
  })

  it('renders default icons (32px) by default', () => {
    const { container } = render(<Steps items={[{ title: 'A' }]} />)
    const iconWrapper = container.querySelector('div[style*="width: 2rem"]')
    expect(iconWrapper).toBeInTheDocument()
  })

  // ---------- Navigation type ----------

  it('renders navigation type with border-bottom on root', () => {
    render(<Steps items={basicItems} type="navigation" />)
    const nav = screen.getByRole('navigation')
    expect(nav.style.borderBottom).toContain('1px solid')
  })

  it('renders arrow separators between navigation steps', () => {
    const { container } = render(
      <Steps items={basicItems} type="navigation" />
    )
    // Arrows are created with CSS borders (borderLeft). Non-last steps get arrows.
    // The first two steps should have arrow divs
    const arrows = container.querySelectorAll('div[style*="border-left"]')
    expect(arrows.length).toBe(2) // 3 items - 1 last = 2 arrows
  })

  // ---------- Disabled ----------

  it('renders disabled steps with opacity 0.5', () => {
    const items: StepItem[] = [
      { title: 'Active' },
      { title: 'Disabled', disabled: true },
    ]
    const { container } = render(<Steps items={items} onChange={() => {}} />)
    // Find the step containing "Disabled" text
    const disabledStep = screen.getByText('Disabled').closest('div[style*="opacity"]') as HTMLElement
    expect(disabledStep.style.opacity).toBe('0.5')
  })

  it('does not call onChange for disabled steps', () => {
    const onChange = vi.fn()
    const items: StepItem[] = [
      { title: 'Step 1' },
      { title: 'Disabled Step', disabled: true },
    ]
    render(<Steps items={items} onChange={onChange} />)

    fireEvent.click(screen.getByText('Disabled Step'))
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- onChange ----------

  it('calls onChange with step index when clicked', () => {
    const onChange = vi.fn()
    render(<Steps items={basicItems} onChange={onChange} />)

    fireEvent.click(screen.getByText('Third'))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('renders clickable steps with cursor pointer when onChange is provided', () => {
    const onChange = vi.fn()
    render(<Steps items={basicItems} onChange={onChange} />)
    const step = screen.getByText('Second').closest('div[style*="cursor"]') as HTMLElement
    expect(step.style.cursor).toBe('pointer')
  })

  it('renders non-clickable steps with cursor default when no onChange', () => {
    render(<Steps items={basicItems} />)
    const step = screen.getByText('Second').closest('div[style*="cursor"]') as HTMLElement
    expect(step.style.cursor).toBe('default')
  })

  // ---------- progressDot ----------

  it('renders dot indicators when progressDot=true', () => {
    const { container } = render(
      <Steps items={basicItems} progressDot />
    )
    // Dots are 8x8 spans with borderRadius 50%
    const dots = container.querySelectorAll('span[style*="border-radius: 50%"]')
    expect(dots).toHaveLength(3)
  })

  it('uses custom progressDot render function', () => {
    const dotRender = vi.fn((dot, { index }) => (
      <span data-testid={`dot-${index}`}>{dot}</span>
    ))
    render(
      <Steps items={basicItems} progressDot={dotRender} />
    )
    expect(dotRender).toHaveBeenCalledTimes(3)
    expect(screen.getByTestId('dot-0')).toBeInTheDocument()
    expect(screen.getByTestId('dot-1')).toBeInTheDocument()
    expect(screen.getByTestId('dot-2')).toBeInTheDocument()
  })

  // ---------- percent ----------

  it('renders progress ring on current step when percent is set', () => {
    const { container } = render(
      <Steps items={basicItems} current={1} percent={60} />
    )
    // ProgressRing renders two <circle> elements inside an SVG
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
  })

  it('does not render progress ring on non-current steps', () => {
    const { container } = render(
      <Steps items={[{ title: 'Done' }, { title: 'Current' }]} current={1} percent={50} />
    )
    // The finished step (index 0) should not have a progress ring
    // Only the current step (index 1) gets it
    const circles = container.querySelectorAll('circle')
    // Exactly 2 circles (background track + progress arc) for the single current step
    expect(circles).toHaveLength(2)
  })

  // ---------- labelPlacement ----------

  it('centers content below icon when labelPlacement="vertical"', () => {
    render(
      <Steps items={[{ title: 'Centered' }]} labelPlacement="vertical" />
    )
    const step = screen.getByText('Centered').closest('div[style*="flex-direction: column"]')
    expect(step).toBeInTheDocument()
  })

  // ---------- initial ----------

  it('offsets step numbers with initial prop', () => {
    render(
      <Steps items={[{ title: 'Offset' }]} initial={5} current={0} />
    )
    // Step index 0, initial=5 → display number = 0 + 5 + 1 = 6
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('offsets step numbers starting from initial', () => {
    render(
      <Steps items={[{ title: 'A' }, { title: 'B' }]} initial={3} />
    )
    // current=0 (default), step 0 → process → shows 0+3+1=4
    // step 1 → wait → shows 1+3+1=5
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  // ---------- className & style ----------

  it('applies custom className to root', () => {
    render(<Steps items={basicItems} className="my-steps" />)
    expect(screen.getByRole('navigation')).toHaveClass('my-steps')
  })

  it('applies custom style to root', () => {
    render(<Steps items={basicItems} style={{ margin: 10 }} />)
    expect(screen.getByRole('navigation').style.margin).toBe('10px')
  })

  // ---------- Semantic classNames ----------

  it('applies classNames.root', () => {
    render(<Steps items={basicItems} classNames={{ root: 'custom-root' }} />)
    expect(screen.getByRole('navigation')).toHaveClass('custom-root')
  })

  it('applies classNames.step to each step', () => {
    const { container } = render(
      <Steps items={basicItems} classNames={{ step: 'custom-step' }} />
    )
    expect(container.querySelectorAll('.custom-step')).toHaveLength(3)
  })

  it('applies classNames.icon to icon wrappers', () => {
    const { container } = render(
      <Steps items={basicItems} classNames={{ icon: 'custom-icon' }} />
    )
    expect(container.querySelectorAll('.custom-icon')).toHaveLength(3)
  })

  it('applies classNames.content to content wrappers', () => {
    const { container } = render(
      <Steps items={basicItems} classNames={{ content: 'custom-content' }} />
    )
    expect(container.querySelectorAll('.custom-content')).toHaveLength(3)
  })

  it('applies classNames.tail to tail lines', () => {
    const { container } = render(
      <Steps items={basicItems} classNames={{ tail: 'custom-tail' }} />
    )
    // Only non-last steps have tails → 2 tails
    expect(container.querySelectorAll('.custom-tail')).toHaveLength(2)
  })

  // ---------- Edge cases ----------

  it('renders with empty items array', () => {
    render(<Steps items={[]} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders single step without tail', () => {
    const { container } = render(
      <Steps items={[{ title: 'Only One' }]} classNames={{ tail: 'tail-marker' }} />
    )
    expect(container.querySelectorAll('.tail-marker')).toHaveLength(0)
  })
})
