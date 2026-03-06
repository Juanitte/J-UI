import { vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { createRef } from 'react'
import { Rate } from '../Rate'
import type { RateRef } from '../Rate'

/** Get the clickable hit-area div(s) inside a star element */
function getHitAreas(star: Element) {
  return star.querySelectorAll<HTMLDivElement>(':scope > div')
}

/** Click the full hit area of a star (non-half mode) */
function clickStar(index: number) {
  const stars = screen.getAllByRole('radio')
  const areas = getHitAreas(stars[index])
  fireEvent.click(areas[areas.length - 1])
}

/** Hover over the full hit area of a star */
function hoverStar(index: number) {
  const stars = screen.getAllByRole('radio')
  const areas = getHitAreas(stars[index])
  fireEvent.mouseEnter(areas[areas.length - 1])
}

describe('Rate', () => {
  // ---------- Basic rendering ----------

  it('renders a radiogroup', () => {
    render(<Rate />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })

  it('renders 5 stars by default', () => {
    render(<Rate />)
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('renders custom count of stars', () => {
    render(<Rate count={3} />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('renders star SVG by default', () => {
    const { container } = render(<Rate />)
    const svgs = container.querySelectorAll('svg')
    // Each star has 2 layers (bg + fg) with SVGs
    expect(svgs.length).toBe(10)
  })

  // ---------- Default value / Controlled value ----------

  it('starts with 0 value by default', () => {
    render(<Rate />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-valuenow', '0')
  })

  it('applies defaultValue', () => {
    render(<Rate defaultValue={3} />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-valuenow', '3')
  })

  it('applies controlled value', () => {
    render(<Rate value={4} />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-valuenow', '4')
  })

  it('marks filled stars as checked', () => {
    render(<Rate defaultValue={3} />)
    const stars = screen.getAllByRole('radio')
    expect(stars[0]).toHaveAttribute('aria-checked', 'true')
    expect(stars[1]).toHaveAttribute('aria-checked', 'true')
    expect(stars[2]).toHaveAttribute('aria-checked', 'true')
    expect(stars[3]).toHaveAttribute('aria-checked', 'false')
    expect(stars[4]).toHaveAttribute('aria-checked', 'false')
  })

  // ---------- Click to select ----------

  it('selects a star on click', () => {
    const onChange = vi.fn()
    render(<Rate onChange={onChange} />)
    clickStar(2) // 3rd star = value 3
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('updates value in uncontrolled mode', () => {
    render(<Rate />)
    clickStar(3) // 4th star = value 4
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-valuenow', '4')
  })

  it('selects different stars sequentially', () => {
    const onChange = vi.fn()
    render(<Rate onChange={onChange} />)
    clickStar(4) // value 5
    expect(onChange).toHaveBeenCalledWith(5)
    clickStar(1) // value 2
    expect(onChange).toHaveBeenCalledWith(2)
  })

  // ---------- allowClear ----------

  it('clears value when clicking same star (allowClear=true)', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={3} onChange={onChange} />)
    clickStar(2) // click star 3 again
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('does not clear when allowClear=false', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={3} allowClear={false} onChange={onChange} />)
    clickStar(2) // click star 3 again
    expect(onChange).toHaveBeenCalledWith(3)
  })

  // ---------- allowHalf ----------

  it('renders two hit areas per star when allowHalf=true', () => {
    render(<Rate allowHalf />)
    const stars = screen.getAllByRole('radio')
    const hitAreas = getHitAreas(stars[0])
    expect(hitAreas).toHaveLength(2)
  })

  it('selects half star on left-half click', () => {
    const onChange = vi.fn()
    render(<Rate allowHalf onChange={onChange} />)
    const stars = screen.getAllByRole('radio')
    const hitAreas = getHitAreas(stars[1]) // 2nd star
    fireEvent.click(hitAreas[0]) // left half = value 1.5
    expect(onChange).toHaveBeenCalledWith(1.5)
  })

  it('selects full star on right-half click', () => {
    const onChange = vi.fn()
    render(<Rate allowHalf onChange={onChange} />)
    const stars = screen.getAllByRole('radio')
    const hitAreas = getHitAreas(stars[1]) // 2nd star
    fireEvent.click(hitAreas[1]) // right half = value 2
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('applies half clip-path when value is x.5', () => {
    render(<Rate defaultValue={2.5} allowHalf />)
    const stars = screen.getAllByRole('radio')
    // 3rd star (index 2) should be half-filled: fg layer has clip-path inset(0 50% 0 0)
    const fgSpan = stars[2].querySelectorAll(':scope > span')[1] as HTMLElement
    expect(fgSpan).toHaveClass('ino-rate__char-fg--half')
  })

  it('applies full clip-path for filled stars', () => {
    render(<Rate defaultValue={2.5} allowHalf />)
    const stars = screen.getAllByRole('radio')
    // 1st star (index 0) is fully filled
    const fgSpan = stars[0].querySelectorAll(':scope > span')[1] as HTMLElement
    expect(fgSpan).toHaveClass('ino-rate__char-fg--full')
  })

  it('applies empty clip-path for empty stars', () => {
    render(<Rate defaultValue={2.5} allowHalf />)
    const stars = screen.getAllByRole('radio')
    // 4th star (index 3) is empty
    const fgSpan = stars[3].querySelectorAll(':scope > span')[1] as HTMLElement
    expect(fgSpan).toHaveClass('ino-rate__char-fg--empty')
  })

  // ---------- Disabled ----------

  it('applies opacity when disabled', () => {
    render(<Rate disabled />)
    const root = screen.getByRole('radiogroup')
    expect(root).toHaveClass('ino-rate--disabled')
  })

  it('sets tabIndex=-1 when disabled', () => {
    render(<Rate disabled />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('tabindex', '-1')
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<Rate disabled onChange={onChange} />)
    clickStar(2)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not respond to keyboard when disabled', () => {
    const onChange = vi.fn()
    render(<Rate disabled defaultValue={2} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })
    expect(onChange).not.toHaveBeenCalled()
  })

  // ---------- Sizes ----------

  it('applies small size font', () => {
    render(<Rate size="small" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('ino-rate--sm')
  })

  it('applies middle size font (default)', () => {
    render(<Rate />)
    expect(screen.getByRole('radiogroup')).toHaveClass('ino-rate--md')
  })

  it('applies large size font', () => {
    render(<Rate size="large" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('ino-rate--lg')
  })

  it('applies small size gap', () => {
    render(<Rate size="small" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('ino-rate--sm')
  })

  it('applies large size gap', () => {
    render(<Rate size="large" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('ino-rate--lg')
  })

  // ---------- Character ----------

  it('renders custom character ReactNode', () => {
    render(<Rate character={<span data-testid="heart">♥</span>} />)
    // 5 stars x 2 layers = 10 hearts
    expect(screen.getAllByTestId('heart')).toHaveLength(10)
  })

  it('renders custom character via function', () => {
    render(<Rate character={(index) => <span data-testid={`char-${index}`}>{index + 1}</span>} />)
    expect(screen.getAllByTestId('char-0')).toHaveLength(2) // bg + fg layers
    expect(screen.getAllByTestId('char-4')).toHaveLength(2)
  })

  // ---------- Tooltips ----------

  it('renders tooltip wrappers when tooltips are provided', () => {
    const { container } = render(
      <Rate tooltips={['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful']} />,
    )
    // Stars with tooltips are not wrapped in plain <span>, they get Tooltip wrapper
    // The aria-label should match tooltip text
    const stars = screen.getAllByRole('radio')
    expect(stars[0]).toHaveAttribute('aria-label', 'Terrible')
    expect(stars[4]).toHaveAttribute('aria-label', 'Wonderful')
  })

  it('uses default aria-label when no tooltips', () => {
    render(<Rate />)
    const stars = screen.getAllByRole('radio')
    expect(stars[0]).toHaveAttribute('aria-label', '1 star')
    expect(stars[1]).toHaveAttribute('aria-label', '2 stars')
    expect(stars[4]).toHaveAttribute('aria-label', '5 stars')
  })

  // ---------- Keyboard navigation ----------

  it('increases value with ArrowRight', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={2} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('increases value with ArrowUp', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={2} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('decreases value with ArrowLeft', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={3} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('decreases value with ArrowDown', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={3} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('does not exceed count with ArrowRight', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={5} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not go below 0 with ArrowLeft', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={0} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('steps by 0.5 with allowHalf on keyboard', () => {
    const onChange = vi.fn()
    render(<Rate defaultValue={2} allowHalf onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(2.5)
  })

  // ---------- Hover ----------

  it('calls onHoverChange when hovering a star', () => {
    const onHoverChange = vi.fn()
    render(<Rate onHoverChange={onHoverChange} />)
    hoverStar(2) // hover 3rd star
    expect(onHoverChange).toHaveBeenCalledWith(3)
  })

  it('calls onHoverChange with 0 when mouse leaves root', () => {
    const onHoverChange = vi.fn()
    render(<Rate onHoverChange={onHoverChange} />)
    hoverStar(2)
    fireEvent.mouseLeave(screen.getByRole('radiogroup'))
    expect(onHoverChange).toHaveBeenLastCalledWith(0)
  })

  it('applies scale transform on hovered star', () => {
    render(<Rate />)
    hoverStar(1)
    const stars = screen.getAllByRole('radio')
    expect(stars[1]).toHaveClass('ino-rate__star--hovered')
  })

  it('does not hover when disabled', () => {
    const onHoverChange = vi.fn()
    render(<Rate disabled onHoverChange={onHoverChange} />)
    hoverStar(0)
    expect(onHoverChange).not.toHaveBeenCalled()
  })

  // ---------- Events ----------

  it('calls onFocus when focused', () => {
    const onFocus = vi.fn()
    render(<Rate onFocus={onFocus} />)
    fireEvent.focus(screen.getByRole('radiogroup'))
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('calls onBlur when blurred', () => {
    const onBlur = vi.fn()
    render(<Rate onBlur={onBlur} />)
    fireEvent.focus(screen.getByRole('radiogroup'))
    fireEvent.blur(screen.getByRole('radiogroup'))
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('calls onKeyDown on keydown', () => {
    const onKeyDown = vi.fn()
    render(<Rate onKeyDown={onKeyDown} />)
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' })
    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })

  // ---------- Ref methods ----------

  it('exposes focus via ref', () => {
    const ref = createRef<RateRef>()
    render(<Rate ref={ref} />)
    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(screen.getByRole('radiogroup'))
  })

  it('exposes blur via ref', () => {
    const ref = createRef<RateRef>()
    render(<Rate ref={ref} />)
    act(() => { ref.current!.focus() })
    expect(document.activeElement).toBe(screen.getByRole('radiogroup'))
    act(() => { ref.current!.blur() })
    expect(document.activeElement).not.toBe(screen.getByRole('radiogroup'))
  })

  // ---------- autoFocus ----------

  it('auto-focuses on mount', () => {
    render(<Rate autoFocus />)
    expect(document.activeElement).toBe(screen.getByRole('radiogroup'))
  })

  // ---------- ARIA attributes ----------

  it('sets aria-valuemin=0', () => {
    render(<Rate />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-valuemin', '0')
  })

  it('sets aria-valuemax to count', () => {
    render(<Rate count={10} />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-valuemax', '10')
  })

  it('sets tabIndex=0 when not disabled', () => {
    render(<Rate />)
    expect(screen.getByRole('radiogroup')).toHaveAttribute('tabindex', '0')
  })

  // ---------- Styling ----------

  it('applies className to root', () => {
    render(<Rate className="my-rate" />)
    expect(screen.getByRole('radiogroup')).toHaveClass('my-rate')
  })

  it('applies style to root', () => {
    render(<Rate style={{ margin: '10px' }} />)
    expect(screen.getByRole('radiogroup').style.margin).toBe('10px')
  })

  it('applies classNames.root', () => {
    render(<Rate classNames={{ root: 'root-cls' }} />)
    expect(screen.getByRole('radiogroup')).toHaveClass('root-cls')
  })

  it('applies classNames.star to each star', () => {
    render(<Rate classNames={{ star: 'star-cls' }} />)
    const starsWithClass = document.querySelectorAll('.star-cls')
    expect(starsWithClass).toHaveLength(5)
  })

  it('applies classNames.character to character spans', () => {
    render(<Rate classNames={{ character: 'char-cls' }} />)
    const charSpans = document.querySelectorAll('.char-cls')
    // 5 stars x 2 layers (bg + fg)
    expect(charSpans).toHaveLength(10)
  })

  it('applies styles.root to root', () => {
    render(<Rate styles={{ root: { padding: '5px' } }} />)
    expect(screen.getByRole('radiogroup').style.padding).toBe('5px')
  })

  it('applies styles.star to star wrappers', () => {
    render(<Rate styles={{ star: { border: '1px solid red' } }} />)
    const stars = screen.getAllByRole('radio')
    expect(stars[0].style.border).toBe('1px solid red')
  })

  // ---------- Filled/empty colors ----------

  it('uses warning color for filled stars by default', () => {
    render(<Rate defaultValue={1} />)
    const stars = screen.getAllByRole('radio')
    const fgSpan = stars[0].querySelectorAll(':scope > span')[1] as HTMLElement
    expect(fgSpan).toHaveClass('ino-rate__char-fg')
  })

  it('uses border color for empty stars by default', () => {
    render(<Rate defaultValue={0} />)
    const stars = screen.getAllByRole('radio')
    const bgSpan = stars[0].querySelector(':scope > span') as HTMLElement
    expect(bgSpan).toHaveClass('ino-rate__char-bg')
  })
})
