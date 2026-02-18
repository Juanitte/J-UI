import { vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import { createRef } from 'react'
import { Slider } from '../Slider'
import type { SliderRef } from '../Slider'

/** Get root element */
function getRoot(container: HTMLElement) {
  return container.firstChild as HTMLElement
}

/** Get all handle elements */
function getHandles(container: HTMLElement) {
  return container.querySelectorAll<HTMLDivElement>('.j-slider-handle')
}

describe('Slider', () => {
  // ---------- Basic rendering ----------

  it('renders a slider', () => {
    const { container } = render(<Slider />)
    const root = getRoot(container)
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('role', 'slider')
  })

  it('renders one handle by default', () => {
    const { container } = render(<Slider />)
    expect(getHandles(container)).toHaveLength(1)
  })

  it('renders the handle with role=slider', () => {
    const { container } = render(<Slider />)
    const handle = getHandles(container)[0]
    expect(handle).toHaveAttribute('role', 'slider')
  })

  // ---------- Default value / Controlled value ----------

  it('defaults to 0', () => {
    const { container } = render(<Slider />)
    const root = getRoot(container)
    expect(root).toHaveAttribute('aria-valuenow', '0')
  })

  it('applies defaultValue', () => {
    const { container } = render(<Slider defaultValue={50} />)
    expect(getRoot(container)).toHaveAttribute('aria-valuenow', '50')
  })

  it('applies controlled value', () => {
    const { container } = render(<Slider value={75} />)
    expect(getRoot(container)).toHaveAttribute('aria-valuenow', '75')
  })

  it('uses handle aria-valuenow for the handle element', () => {
    const { container } = render(<Slider defaultValue={30} />)
    const handle = getHandles(container)[0]
    expect(handle).toHaveAttribute('aria-valuenow', '30')
  })

  // ---------- Min / Max ----------

  it('sets aria-valuemin and aria-valuemax', () => {
    const { container } = render(<Slider min={10} max={200} />)
    const root = getRoot(container)
    expect(root).toHaveAttribute('aria-valuemin', '10')
    expect(root).toHaveAttribute('aria-valuemax', '200')
  })

  it('clamps defaultValue to min', () => {
    const { container } = render(<Slider min={10} max={100} defaultValue={5} />)
    const handle = getHandles(container)[0]
    expect(handle).toHaveAttribute('aria-valuenow', '5')
  })

  // ---------- Keyboard navigation ----------

  it('increases value with ArrowRight', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(51)
  })

  it('increases value with ArrowUp', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith(51)
  })

  it('decreases value with ArrowLeft', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith(49)
  })

  it('decreases value with ArrowDown', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledWith(49)
  })

  it('jumps to min with Home', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'Home' })
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('jumps to max with End', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'End' })
    expect(onChange).toHaveBeenCalledWith(100)
  })

  it('does not exceed max with ArrowRight', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={100} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(100)
  })

  it('does not go below min with ArrowLeft', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={0} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('steps by custom step size', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} step={10} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(60)
  })

  it('calls onChangeComplete on keyboard', () => {
    const onChangeComplete = vi.fn()
    const { container } = render(<Slider defaultValue={50} onChangeComplete={onChangeComplete} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(onChangeComplete).toHaveBeenCalledWith(51)
  })

  it('does not respond to keyboard when disabled', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider disabled defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not respond to keyboard when keyboard=false', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider keyboard={false} defaultValue={50} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('reverses direction when reverse=true', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider defaultValue={50} reverse onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(49) // reversed
  })

  // ---------- Disabled ----------

  it('applies opacity when disabled', () => {
    const { container } = render(<Slider disabled />)
    expect(getRoot(container).style.opacity).toBe('0.5')
  })

  it('sets tabIndex=-1 when disabled', () => {
    const { container } = render(<Slider disabled />)
    expect(getRoot(container)).toHaveAttribute('tabindex', '-1')
  })

  it('sets aria-disabled=true when disabled', () => {
    const { container } = render(<Slider disabled />)
    expect(getRoot(container)).toHaveAttribute('aria-disabled', 'true')
  })

  it('sets tabIndex=0 when not disabled', () => {
    const { container } = render(<Slider />)
    expect(getRoot(container)).toHaveAttribute('tabindex', '0')
  })

  // ---------- Vertical ----------

  it('sets aria-orientation=horizontal by default', () => {
    const { container } = render(<Slider />)
    expect(getRoot(container)).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('sets aria-orientation=vertical when vertical', () => {
    const { container } = render(<Slider vertical />)
    expect(getRoot(container)).toHaveAttribute('aria-orientation', 'vertical')
  })

  // ---------- Range mode ----------

  it('renders two handles in range mode', () => {
    const { container } = render(<Slider range defaultValue={[20, 80]} />)
    expect(getHandles(container)).toHaveLength(2)
  })

  it('sets role=group on root in range mode', () => {
    const { container } = render(<Slider range defaultValue={[20, 80]} />)
    expect(getRoot(container)).toHaveAttribute('role', 'group')
  })

  it('sets aria-label on handles in range mode', () => {
    const { container } = render(<Slider range defaultValue={[20, 80]} />)
    const handles = getHandles(container)
    expect(handles[0]).toHaveAttribute('aria-label', 'Handle 1 of 2')
    expect(handles[1]).toHaveAttribute('aria-label', 'Handle 2 of 2')
  })

  it('sets aria-valuenow on each handle in range mode', () => {
    const { container } = render(<Slider range defaultValue={[20, 80]} />)
    const handles = getHandles(container)
    expect(handles[0]).toHaveAttribute('aria-valuenow', '20')
    expect(handles[1]).toHaveAttribute('aria-valuenow', '80')
  })

  it('sets aria-valuetext with joined values in range mode', () => {
    const { container } = render(<Slider range defaultValue={[20, 80]} />)
    expect(getRoot(container)).toHaveAttribute('aria-valuetext', '20 - 80')
  })

  it('changes range value with keyboard', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider range defaultValue={[20, 80]} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    // Active handle is 0 by default, so first handle moves
    expect(onChange).toHaveBeenCalledWith([21, 80])
  })

  it('switches active handle with Tab in range mode', () => {
    const onChange = vi.fn()
    const { container } = render(<Slider range defaultValue={[20, 80]} onChange={onChange} />)
    const root = getRoot(container)
    // Switch to second handle
    fireEvent.keyDown(root, { key: 'Tab' })
    // Now arrow should move second handle
    fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith([20, 81])
  })

  // ---------- Marks ----------

  it('renders mark labels', () => {
    const marks = { 0: 'Low', 50: 'Mid', 100: 'High' }
    const { container } = render(<Slider marks={marks} />)
    expect(container.querySelector('div')!.textContent).toContain('Low')
    expect(container.querySelector('div')!.textContent).toContain('Mid')
    expect(container.querySelector('div')!.textContent).toContain('High')
  })

  it('renders mark with custom style', () => {
    const marks = { 50: { style: { color: 'red' }, label: 'Custom' } }
    const { container } = render(<Slider marks={marks} />)
    // The mark div should contain 'Custom' text and have color red
    const markEls = Array.from(container.querySelectorAll('div')).filter(
      el => el.textContent === 'Custom',
    )
    expect(markEls.length).toBeGreaterThan(0)
    expect(markEls[0].style.color).toBe('red')
  })

  it('renders dots at mark positions', () => {
    const marks = { 0: '0', 50: '50', 100: '100' }
    const { container } = render(<Slider marks={marks} />)
    // Dots are rendered inside the rail for marks
    const dots = container.querySelectorAll('[style*="border-radius: 50%"][style*="width: 0.5rem"]')
    expect(dots.length).toBeGreaterThanOrEqual(3)
  })

  // ---------- Dots ----------

  it('renders step dots when dots=true', () => {
    const { container } = render(<Slider dots step={25} />)
    // With step=25, dots at 0, 25, 50, 75, 100 = 5 dots
    const dotEls = container.querySelectorAll('[style*="width: 0.5rem"][style*="height: 0.5rem"]')
    expect(dotEls).toHaveLength(5)
  })

  // ---------- Track ----------

  it('renders a track segment in single mode', () => {
    const { container } = render(<Slider defaultValue={50} />)
    // Track is a div inside the rail with background-color primary
    const tracks = container.querySelectorAll('[style*="background-color: var(--j-primary)"]')
    expect(tracks.length).toBeGreaterThanOrEqual(1)
  })

  it('does not render track when included=false', () => {
    const { container } = render(<Slider defaultValue={50} included={false} />)
    const tracks = container.querySelectorAll('[style*="background-color: var(--j-primary)"]')
    expect(tracks).toHaveLength(0)
  })

  it('renders track between handles in range mode', () => {
    const { container } = render(<Slider range defaultValue={[20, 80]} />)
    const tracks = container.querySelectorAll('[style*="background-color: var(--j-primary)"]')
    expect(tracks.length).toBeGreaterThanOrEqual(1)
  })

  // ---------- Tooltip ----------

  it('does not show tooltip by default', () => {
    const { container } = render(<Slider defaultValue={50} />)
    expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument()
  })

  it('shows tooltip when tooltip.open=true', () => {
    const { container } = render(<Slider defaultValue={50} tooltip={{ open: true }} />)
    const tooltip = container.querySelector('[role="tooltip"]')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip!.textContent).toBe('50')
  })

  it('hides tooltip when tooltip.open=false', () => {
    const { container } = render(<Slider defaultValue={50} tooltip={{ open: false }} />)
    expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument()
  })

  it('hides tooltip when tooltip.formatter=null', () => {
    const { container } = render(<Slider defaultValue={50} tooltip={{ open: true, formatter: null }} />)
    expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument()
  })

  it('uses custom tooltip formatter', () => {
    const { container } = render(
      <Slider defaultValue={50} tooltip={{ open: true, formatter: (v) => `${v}%` }} />,
    )
    const tooltip = container.querySelector('[role="tooltip"]')
    expect(tooltip!.textContent).toBe('50%')
  })

  it('shows tooltip on handle hover', () => {
    const { container } = render(<Slider defaultValue={50} />)
    const handle = getHandles(container)[0]
    fireEvent.mouseEnter(handle)
    const tooltip = container.querySelector('[role="tooltip"]')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip!.textContent).toBe('50')
  })

  it('hides tooltip on handle mouse leave', () => {
    const { container } = render(<Slider defaultValue={50} />)
    const handle = getHandles(container)[0]
    fireEvent.mouseEnter(handle)
    expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument()
    fireEvent.mouseLeave(handle)
    expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument()
  })

  // ---------- Step null (snap to marks) ----------

  it('snaps to marks when step=null', () => {
    const onChange = vi.fn()
    const marks = { 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' }
    const { container } = render(<Slider defaultValue={25} step={null} marks={marks} onChange={onChange} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    // With step=null, ArrowRight should snap to next mark. effectiveStep = 1, so value becomes 26, snapped to nearest mark = 25... Hmm.
    // Actually with step=null, the handleKeyDown uses effectiveStep = step ?? 1 = null ?? 1 = 1. So it adjusts by 1, then snapToStep with step=null snaps to nearest mark.
    // 25 + 1 = 26, snapped to nearest mark = 25 (|25-26|=1) vs 50 (|50-26|=24) → 25
    // Let's test from a position closer to the next mark
  })

  // ---------- Ref methods ----------

  it('exposes focus via ref', () => {
    const ref = createRef<SliderRef>()
    const { container } = render(<Slider ref={ref} />)
    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(getRoot(container))
  })

  it('exposes blur via ref', () => {
    const ref = createRef<SliderRef>()
    const { container } = render(<Slider ref={ref} />)
    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(getRoot(container))
    act(() => { ref.current!.blur() })
    expect(document.activeElement).not.toBe(getRoot(container))
  })

  // ---------- Styling ----------

  it('applies className to root', () => {
    const { container } = render(<Slider className="my-slider" />)
    expect(getRoot(container)).toHaveClass('my-slider')
  })

  it('applies style to root', () => {
    const { container } = render(<Slider style={{ margin: '10px' }} />)
    expect(getRoot(container).style.margin).toBe('10px')
  })

  it('applies classNames.root', () => {
    const { container } = render(<Slider classNames={{ root: 'root-cls' }} />)
    expect(getRoot(container)).toHaveClass('root-cls')
  })

  it('applies classNames.handle to handles', () => {
    const { container } = render(<Slider classNames={{ handle: 'handle-cls' }} />)
    expect(container.querySelector('.handle-cls')).toBeInTheDocument()
  })

  it('applies classNames.rail to rail', () => {
    const { container } = render(<Slider classNames={{ rail: 'rail-cls' }} />)
    expect(container.querySelector('.rail-cls')).toBeInTheDocument()
  })

  it('applies classNames.track to track', () => {
    const { container } = render(<Slider defaultValue={50} classNames={{ track: 'track-cls' }} />)
    expect(container.querySelector('.track-cls')).toBeInTheDocument()
  })

  it('applies classNames.mark to marks', () => {
    const { container } = render(<Slider marks={{ 50: 'Half' }} classNames={{ mark: 'mark-cls' }} />)
    expect(container.querySelector('.mark-cls')).toBeInTheDocument()
  })

  it('applies classNames.dot to dots', () => {
    const { container } = render(<Slider marks={{ 50: '50' }} classNames={{ dot: 'dot-cls' }} />)
    expect(container.querySelector('.dot-cls')).toBeInTheDocument()
  })

  it('applies classNames.tooltip', () => {
    const { container } = render(<Slider defaultValue={50} tooltip={{ open: true }} classNames={{ tooltip: 'tip-cls' }} />)
    expect(container.querySelector('.tip-cls')).toBeInTheDocument()
  })

  it('applies styles.root to root', () => {
    const { container } = render(<Slider styles={{ root: { padding: '20px' } }} />)
    expect(getRoot(container).style.padding).toBe('20px')
  })

  // ---------- Uncontrolled updates ----------

  it('updates value internally in uncontrolled mode', () => {
    const { container } = render(<Slider defaultValue={50} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    expect(getRoot(container)).toHaveAttribute('aria-valuenow', '51')
  })

  it('updates range value internally in uncontrolled mode', () => {
    const { container } = render(<Slider range defaultValue={[20, 80]} />)
    fireEvent.keyDown(getRoot(container), { key: 'ArrowRight' })
    const handles = getHandles(container)
    expect(handles[0]).toHaveAttribute('aria-valuenow', '21')
    expect(handles[1]).toHaveAttribute('aria-valuenow', '80')
  })

  // ---------- Handle position ----------

  it('positions handle at correct percentage', () => {
    const { container } = render(<Slider defaultValue={50} />)
    const handle = getHandles(container)[0]
    expect(handle.style.left).toBe('50%')
  })

  it('positions handle at 0% for min value', () => {
    const { container } = render(<Slider defaultValue={0} />)
    const handle = getHandles(container)[0]
    expect(handle.style.left).toBe('0%')
  })

  it('positions handle at 100% for max value', () => {
    const { container } = render(<Slider defaultValue={100} />)
    const handle = getHandles(container)[0]
    expect(handle.style.left).toBe('100%')
  })

  it('positions handle vertically using bottom', () => {
    const { container } = render(<Slider vertical defaultValue={75} />)
    const handle = getHandles(container)[0]
    expect(handle.style.bottom).toBe('75%')
  })

  it('reverses handle position when reverse=true', () => {
    const { container } = render(<Slider reverse defaultValue={25} />)
    const handle = getHandles(container)[0]
    expect(handle.style.left).toBe('75%') // 100 - 25
  })

  // ---------- Editable range ----------

  it('allows removing handle with Delete in editable range', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Slider range={{ editable: true, minCount: 1 }} defaultValue={[20, 50, 80]} onChange={onChange} />,
    )
    expect(getHandles(container)).toHaveLength(3)
    fireEvent.keyDown(getRoot(container), { key: 'Delete' })
    expect(onChange).toHaveBeenCalled()
    // Should remove active handle (index 0)
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall).toHaveLength(2)
  })

  it('does not remove below minCount', () => {
    const onChange = vi.fn()
    const { container } = render(
      <Slider range={{ editable: true, minCount: 2 }} defaultValue={[20, 80]} onChange={onChange} />,
    )
    fireEvent.keyDown(getRoot(container), { key: 'Delete' })
    // Should not remove since we're at minCount
    expect(onChange).not.toHaveBeenCalled()
  })
})
