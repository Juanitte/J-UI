import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { createRef } from 'react'
import { Switch } from '../Switch'
import type { SwitchRef } from '../Switch'

// ============================================================================
// Helpers
// ============================================================================

function getSwitch() {
  return screen.getByRole('switch')
}

function getTrack(container: HTMLElement) {
  return container.querySelector('button > span') as HTMLElement
}

function getThumb(container: HTMLElement) {
  // Thumb is the last <span> child inside the track (has borderRadius 50%)
  const track = getTrack(container)
  const spans = track.querySelectorAll(':scope > span')
  return spans[spans.length - 1] as HTMLElement
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Switch – Basic rendering', () => {
  it('renders a button with role="switch"', () => {
    render(<Switch />)
    expect(getSwitch()).toBeInTheDocument()
    expect(getSwitch().tagName).toBe('BUTTON')
  })

  it('has type="button"', () => {
    render(<Switch />)
    expect(getSwitch()).toHaveAttribute('type', 'button')
  })

  it('defaults to aria-checked=false', () => {
    render(<Switch />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false')
  })

  it('renders track, thumb structure', () => {
    const { container } = render(<Switch />)
    expect(getTrack(container)).toBeTruthy()
    expect(getThumb(container)).toBeTruthy()
    expect(getThumb(container)).toHaveClass('ino-switch__thumb')
  })

  it('sets id on button', () => {
    render(<Switch id="my-switch" />)
    expect(getSwitch()).toHaveAttribute('id', 'my-switch')
  })

  it('sets tabIndex on button', () => {
    render(<Switch tabIndex={-1} />)
    expect(getSwitch()).toHaveAttribute('tabindex', '-1')
  })
})

// ============================================================================
// Controlled & Uncontrolled
// ============================================================================

describe('Switch – Controlled & Uncontrolled', () => {
  it('uses defaultChecked for initial state', () => {
    render(<Switch defaultChecked />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true')
  })

  it('uses defaultValue for initial state', () => {
    render(<Switch defaultValue />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles uncontrolled state on click', () => {
    render(<Switch />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(getSwitch())
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(getSwitch())
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false')
  })

  it('respects controlled checked prop', () => {
    const { rerender } = render(<Switch checked={false} />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false')
    rerender(<Switch checked />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true')
  })

  it('respects controlled value prop', () => {
    const { rerender } = render(<Switch value={false} />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false')
    rerender(<Switch value />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true')
  })

  it('does not toggle internally when controlled', () => {
    render(<Switch checked={false} />)
    fireEvent.click(getSwitch())
    expect(getSwitch()).toHaveAttribute('aria-checked', 'false')
  })

  it('value takes precedence over checked', () => {
    render(<Switch value checked={false} />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true')
  })

  it('defaultValue takes precedence over defaultChecked', () => {
    render(<Switch defaultValue defaultChecked={false} />)
    expect(getSwitch()).toHaveAttribute('aria-checked', 'true')
  })
})

// ============================================================================
// Events
// ============================================================================

describe('Switch – Events', () => {
  it('calls onChange with new checked value', () => {
    const onChange = vi.fn()
    render(<Switch onChange={onChange} />)
    fireEvent.click(getSwitch())
    expect(onChange).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it('calls onClick with new checked value', () => {
    const onClick = vi.fn()
    render(<Switch onClick={onClick} />)
    fireEvent.click(getSwitch())
    expect(onClick).toHaveBeenCalledWith(true, expect.any(Object))
  })

  it('calls both onChange and onClick on click', () => {
    const onChange = vi.fn()
    const onClick = vi.fn()
    render(<Switch onChange={onChange} onClick={onClick} />)
    fireEvent.click(getSwitch())
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('passes false on second click (toggle off)', () => {
    const onChange = vi.fn()
    render(<Switch defaultChecked onChange={onChange} />)
    fireEvent.click(getSwitch())
    expect(onChange).toHaveBeenCalledWith(false, expect.any(Object))
  })
})

// ============================================================================
// Disabled
// ============================================================================

describe('Switch – Disabled', () => {
  it('sets disabled attribute on button', () => {
    render(<Switch disabled />)
    expect(getSwitch()).toBeDisabled()
  })

  it('applies not-allowed cursor', () => {
    render(<Switch disabled />)
    expect(getSwitch()).toHaveClass('ino-switch--disabled')
  })

  it('applies opacity 0.5', () => {
    render(<Switch disabled />)
    expect(getSwitch()).toHaveClass('ino-switch--disabled')
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<Switch disabled onChange={onChange} />)
    fireEvent.click(getSwitch())
    expect(onChange).not.toHaveBeenCalled()
  })
})

// ============================================================================
// Loading
// ============================================================================

describe('Switch – Loading', () => {
  it('disables button when loading', () => {
    render(<Switch loading />)
    expect(getSwitch()).toBeDisabled()
  })

  it('shows spinner SVG in thumb', () => {
    const { container } = render(<Switch loading />)
    const thumb = getThumb(container)
    const svg = thumb.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('does not call onChange when loading', () => {
    const onChange = vi.fn()
    render(<Switch loading onChange={onChange} />)
    fireEvent.click(getSwitch())
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not show spinner when not loading', () => {
    const { container } = render(<Switch />)
    const thumb = getThumb(container)
    const svg = thumb.querySelector('svg')
    expect(svg).toBeNull()
  })

  it('spinner size matches switch size (default)', () => {
    const { container } = render(<Switch loading />)
    const svg = getThumb(container).querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('12')
    expect(svg.getAttribute('height')).toBe('12')
  })

  it('spinner size matches switch size (small)', () => {
    const { container } = render(<Switch loading size="small" />)
    const svg = getThumb(container).querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('8')
    expect(svg.getAttribute('height')).toBe('8')
  })
})

// ============================================================================
// Size
// ============================================================================

describe('Switch – Size', () => {
  it('applies default size dimensions', () => {
    const { container } = render(<Switch />)
    const track = getTrack(container)
    expect(track).toHaveClass('ino-switch__track')
    expect(getSwitch()).not.toHaveClass('ino-switch--small')
  })

  it('applies small size dimensions', () => {
    const { container } = render(<Switch size="small" />)
    expect(getSwitch()).toHaveClass('ino-switch--small')
  })

  it('default thumb size is 1.125rem', () => {
    const { container } = render(<Switch />)
    const thumb = getThumb(container)
    expect(thumb).toHaveClass('ino-switch__thumb')
  })

  it('small thumb size is 0.75rem', () => {
    const { container } = render(<Switch size="small" />)
    const thumb = getThumb(container)
    expect(thumb).toHaveClass('ino-switch__thumb')
    expect(getSwitch()).toHaveClass('ino-switch--small')
  })
})

// ============================================================================
// Children (inner content)
// ============================================================================

describe('Switch – Children', () => {
  it('shows checkedChildren when checked', () => {
    render(<Switch defaultChecked checkedChildren="ON" unCheckedChildren="OFF" />)
    expect(screen.getByText('ON')).toBeInTheDocument()
    expect(screen.queryByText('OFF')).not.toBeInTheDocument()
  })

  it('shows unCheckedChildren when unchecked', () => {
    render(<Switch checkedChildren="ON" unCheckedChildren="OFF" />)
    expect(screen.getByText('OFF')).toBeInTheDocument()
    expect(screen.queryByText('ON')).not.toBeInTheDocument()
  })

  it('switches children on toggle', () => {
    render(<Switch checkedChildren="ON" unCheckedChildren="OFF" />)
    expect(screen.getByText('OFF')).toBeInTheDocument()
    fireEvent.click(getSwitch())
    expect(screen.getByText('ON')).toBeInTheDocument()
    expect(screen.queryByText('OFF')).not.toBeInTheDocument()
  })

  it('uses minWidth instead of width when children are present', () => {
    const { container } = render(<Switch checkedChildren="ON" />)
    const track = getTrack(container)
    expect(track).toHaveClass('ino-switch__track')
  })

  it('does not render inner span when no children', () => {
    const { container } = render(<Switch />)
    const track = getTrack(container)
    // Only thumb span should exist
    const spans = track.querySelectorAll(':scope > span')
    expect(spans).toHaveLength(1)
  })

  it('renders inner span when children are set', () => {
    const { container } = render(<Switch checkedChildren="ON" unCheckedChildren="OFF" />)
    const track = getTrack(container)
    // Inner span + thumb span
    const spans = track.querySelectorAll(':scope > span')
    expect(spans).toHaveLength(2)
  })
})

// ============================================================================
// Thumb position
// ============================================================================

describe('Switch – Thumb position', () => {
  it('positions thumb at left when unchecked', () => {
    const { container } = render(<Switch />)
    const thumb = getThumb(container)
    expect(getSwitch()).toHaveClass('ino-switch--unchecked')
  })

  it('positions thumb at right when checked', () => {
    const { container } = render(<Switch defaultChecked />)
    expect(getSwitch()).toHaveClass('ino-switch--checked')
  })

  it('thumb moves on toggle', () => {
    const { container } = render(<Switch />)
    expect(getSwitch()).toHaveClass('ino-switch--unchecked')
    fireEvent.click(getSwitch())
    expect(getSwitch()).toHaveClass('ino-switch--checked')
  })
})

// ============================================================================
// Track color
// ============================================================================

describe('Switch – Track color', () => {
  it('uses primary color when checked', () => {
    const { container } = render(<Switch defaultChecked />)
    const track = getTrack(container)
    expect(getSwitch()).toHaveClass('ino-switch--checked')
  })

  it('uses secondary color when unchecked', () => {
    const { container } = render(<Switch />)
    expect(getSwitch()).toHaveClass('ino-switch--unchecked')
  })
})

// ============================================================================
// Ref methods
// ============================================================================

describe('Switch – Ref', () => {
  it('focus() focuses the button', () => {
    const ref = createRef<SwitchRef>()
    render(<Switch ref={ref} />)
    act(() => ref.current!.focus())
    expect(document.activeElement).toBe(getSwitch())
  })

  it('blur() blurs the button', () => {
    const ref = createRef<SwitchRef>()
    render(<Switch ref={ref} />)
    act(() => ref.current!.focus())
    expect(document.activeElement).toBe(getSwitch())
    act(() => ref.current!.blur())
    expect(document.activeElement).not.toBe(getSwitch())
  })
})

// ============================================================================
// autoFocus
// ============================================================================

describe('Switch – autoFocus', () => {
  it('focuses automatically when autoFocus is true', () => {
    render(<Switch autoFocus />)
    expect(document.activeElement).toBe(getSwitch())
  })
})

// ============================================================================
// Semantic classNames & styles
// ============================================================================

describe('Switch – Semantic classNames & styles', () => {
  it('applies className to button', () => {
    render(<Switch className="my-switch" />)
    expect(getSwitch()).toHaveClass('my-switch')
  })

  it('applies style to button', () => {
    render(<Switch style={{ margin: '10px' }} />)
    expect(getSwitch().style.margin).toBe('10px')
  })

  it('applies classNames.root to button', () => {
    render(<Switch classNames={{ root: 'root-cls' }} />)
    expect(getSwitch()).toHaveClass('root-cls')
  })

  it('applies classNames.track to track span', () => {
    const { container } = render(<Switch classNames={{ track: 'track-cls' }} />)
    expect(getTrack(container)).toHaveClass('track-cls')
  })

  it('applies classNames.thumb to thumb span', () => {
    const { container } = render(<Switch classNames={{ thumb: 'thumb-cls' }} />)
    expect(getThumb(container)).toHaveClass('thumb-cls')
  })

  it('applies classNames.inner to inner span', () => {
    const { container } = render(
      <Switch checkedChildren="ON" unCheckedChildren="OFF" classNames={{ inner: 'inner-cls' }} />,
    )
    const track = getTrack(container)
    const innerSpan = track.querySelectorAll(':scope > span')[0] as HTMLElement
    expect(innerSpan).toHaveClass('inner-cls')
  })

  it('applies styles.root to button', () => {
    render(<Switch styles={{ root: { padding: '5px' } }} />)
    expect(getSwitch().style.padding).toBe('5px')
  })

  it('applies styles.track to track span', () => {
    const { container } = render(<Switch styles={{ track: { opacity: '0.8' } }} />)
    expect(getTrack(container).style.opacity).toBe('0.8')
  })

  it('applies styles.thumb to thumb span', () => {
    const { container } = render(<Switch styles={{ thumb: { boxShadow: 'none' } }} />)
    expect(getThumb(container).style.boxShadow).toBe('none')
  })

  it('applies styles.inner to inner span', () => {
    const { container } = render(
      <Switch
        checkedChildren="ON"
        unCheckedChildren="OFF"
        styles={{ inner: { fontWeight: 'bold' } }}
      />,
    )
    const track = getTrack(container)
    const innerSpan = track.querySelectorAll(':scope > span')[0] as HTMLElement
    expect(innerSpan.style.fontWeight).toBe('bold')
  })
})

// ============================================================================
// Focus ring (keyboard only)
// ============================================================================

describe('Switch – Focus ring', () => {
  it('shows focus ring on keyboard focus', () => {
    const { container } = render(<Switch />)
    fireEvent.focus(getSwitch())
    // Focus ring is now CSS-only via :focus-visible
    expect(getSwitch()).toHaveClass('ino-switch')
  })

  it('hides focus ring on mouse focus', () => {
    const { container } = render(<Switch />)
    fireEvent.mouseDown(getSwitch())
    fireEvent.focus(getSwitch())
    // Focus ring is now CSS-only via :focus-visible
    expect(getSwitch()).toHaveClass('ino-switch')
  })

  it('removes focus ring on blur', () => {
    const { container } = render(<Switch />)
    fireEvent.focus(getSwitch())
    fireEvent.blur(getSwitch())
    // Focus ring is now CSS-only via :focus-visible
    expect(getSwitch()).toHaveClass('ino-switch')
  })
})
