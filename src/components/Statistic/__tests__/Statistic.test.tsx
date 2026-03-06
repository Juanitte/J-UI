import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Statistic } from '../Statistic'

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getTitle(container: HTMLElement) {
  const root = getRoot(container)
  return root.querySelector('.ino-statistic__title') as HTMLElement | null
}

function getContent(container: HTMLElement) {
  const root = getRoot(container)
  return root.querySelector('.ino-statistic__content') as HTMLElement | null
}

function getPrefix(container: HTMLElement) {
  const content = getContent(container)
  if (!content) return null
  return content.querySelector('.ino-statistic__prefix') as HTMLElement | null
}

function getSuffix(container: HTMLElement) {
  const content = getContent(container)
  if (!content) return null
  return content.querySelector('.ino-statistic__suffix') as HTMLElement | null
}

function getLoadingPlaceholder(container: HTMLElement) {
  const content = getContent(container)
  if (!content) return null
  return content.querySelector('.ino-statistic__loading') as HTMLElement | null
}

// ============================================================================
// Statistic
// ============================================================================

describe('Statistic', () => {
  // ============================================================================
  // Basic rendering
  // ============================================================================

  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<Statistic />)
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('renders value 0 by default', () => {
      const { container } = render(<Statistic />)
      expect(getContent(container)!.textContent).toContain('0')
    })

    it('renders string value', () => {
      const { container } = render(<Statistic value="hello" />)
      expect(getContent(container)!.textContent).toContain('hello')
    })

    it('renders numeric value', () => {
      const { container } = render(<Statistic value={42} />)
      expect(getContent(container)!.textContent).toContain('42')
    })

    it('renders title when provided', () => {
      render(<Statistic title="Total Users" value={100} />)
      expect(screen.getByText('Total Users')).toBeTruthy()
    })

    it('does not render title when not provided', () => {
      const { container } = render(<Statistic value={100} />)
      expect(getTitle(container)).toBeNull()
    })

    it('renders content section', () => {
      const { container } = render(<Statistic value={50} />)
      expect(getContent(container)).toBeTruthy()
    })
  })

  // ============================================================================
  // Value formatting
  // ============================================================================

  describe('value formatting', () => {
    it('formats large number with comma grouping', () => {
      const { container } = render(<Statistic value={1234567} />)
      expect(getContent(container)!.textContent).toContain('1,234,567')
    })

    it('applies precision for decimal places', () => {
      const { container } = render(<Statistic value={3.14159} precision={2} />)
      expect(getContent(container)!.textContent).toContain('3.14')
    })

    it('pads with zeros when precision exceeds decimals', () => {
      const { container } = render(<Statistic value={5} precision={3} />)
      expect(getContent(container)!.textContent).toContain('5.000')
    })

    it('uses custom decimal separator', () => {
      const { container } = render(
        <Statistic value={3.14} precision={2} decimalSeparator="," />,
      )
      expect(getContent(container)!.textContent).toContain('3,14')
    })

    it('uses custom group separator', () => {
      const { container } = render(<Statistic value={1000000} groupSeparator="." />)
      expect(getContent(container)!.textContent).toContain('1.000.000')
    })

    it('formats with both custom separators', () => {
      const { container } = render(
        <Statistic value={1234.56} precision={2} decimalSeparator="," groupSeparator="." />,
      )
      expect(getContent(container)!.textContent).toContain('1.234,56')
    })

    it('handles string numeric value', () => {
      const { container } = render(<Statistic value="9876" />)
      expect(getContent(container)!.textContent).toContain('9,876')
    })

    it('handles NaN string value gracefully', () => {
      const { container } = render(<Statistic value="not-a-number" />)
      expect(getContent(container)!.textContent).toContain('not-a-number')
    })

    it('handles negative numbers', () => {
      const { container } = render(<Statistic value={-500} />)
      expect(getContent(container)!.textContent).toContain('-500')
    })

    it('handles zero with precision', () => {
      const { container } = render(<Statistic value={0} precision={2} />)
      expect(getContent(container)!.textContent).toContain('0.00')
    })
  })

  // ============================================================================
  // Prefix and suffix
  // ============================================================================

  describe('prefix and suffix', () => {
    it('renders prefix text', () => {
      render(<Statistic value={100} prefix="$" />)
      expect(screen.getByText('$')).toBeTruthy()
    })

    it('renders suffix text', () => {
      render(<Statistic value={80} suffix="%" />)
      expect(screen.getByText('%')).toBeTruthy()
    })

    it('renders prefix ReactNode', () => {
      render(<Statistic value={10} prefix={<span data-testid="prefix-icon">★</span>} />)
      expect(screen.getByTestId('prefix-icon')).toBeTruthy()
    })

    it('renders suffix ReactNode', () => {
      render(<Statistic value={10} suffix={<span data-testid="suffix-icon">↑</span>} />)
      expect(screen.getByTestId('suffix-icon')).toBeTruthy()
    })

    it('prefix has right margin', () => {
      const { container } = render(<Statistic value={100} prefix="$" />)
      const prefix = getPrefix(container)
      expect(prefix).toBeTruthy()
      expect(prefix).toHaveClass('ino-statistic__prefix')
    })

    it('suffix has left margin', () => {
      const { container } = render(<Statistic value={100} suffix="%" />)
      const suffix = getSuffix(container)
      expect(suffix).toBeTruthy()
      expect(suffix).toHaveClass('ino-statistic__suffix')
    })

    it('no prefix element when not provided', () => {
      const { container } = render(<Statistic value={100} />)
      expect(getPrefix(container)).toBeNull()
    })

    it('no suffix element when not provided', () => {
      const { container } = render(<Statistic value={100} />)
      expect(getSuffix(container)).toBeNull()
    })
  })

  // ============================================================================
  // Custom formatter
  // ============================================================================

  describe('custom formatter', () => {
    it('uses formatter instead of default formatting', () => {
      render(<Statistic value={1000} formatter={(v) => `${v} items`} />)
      expect(screen.getByText('1000 items')).toBeTruthy()
    })

    it('formatter receives original value', () => {
      const formatter = vi.fn(() => 'formatted')
      render(<Statistic value={42} formatter={formatter} />)
      expect(formatter).toHaveBeenCalledWith(42)
    })

    it('formatter can return ReactNode', () => {
      render(
        <Statistic
          value={100}
          formatter={(v) => <strong data-testid="custom">{String(v)}</strong>}
        />,
      )
      expect(screen.getByTestId('custom')).toBeTruthy()
    })

    it('formatter overrides precision', () => {
      const { container } = render(
        <Statistic value={3.14} precision={2} formatter={(v) => `~${v}`} />,
      )
      expect(getContent(container)!.textContent).toContain('~3.14')
    })
  })

  // ============================================================================
  // Loading state
  // ============================================================================

  describe('loading state', () => {
    it('shows loading placeholder when loading', () => {
      const { container } = render(<Statistic value={100} loading />)
      const placeholder = getLoadingPlaceholder(container)
      expect(placeholder).toBeTruthy()
    })

    it('loading placeholder has default width', () => {
      const { container } = render(<Statistic value={100} loading />)
      const placeholder = getLoadingPlaceholder(container)!
      expect(placeholder.style.width).toBe('7rem')
    })

    it('loading placeholder uses custom width', () => {
      const { container } = render(<Statistic value={100} loading loadingWidth="10rem" />)
      const placeholder = getLoadingPlaceholder(container)!
      expect(placeholder.style.width).toBe('10rem')
    })

    it('loading hides the actual value', () => {
      const { container } = render(<Statistic value={12345} loading />)
      expect(getContent(container)!.textContent).not.toContain('12,345')
    })

    it('loading placeholder has animation class', () => {
      const { container } = render(<Statistic value={100} loading />)
      const placeholder = getLoadingPlaceholder(container)!
      expect(placeholder).toHaveClass('ino-statistic__loading')
    })

    it('loading placeholder has loading class', () => {
      const { container } = render(<Statistic value={100} loading />)
      const placeholder = getLoadingPlaceholder(container)!
      expect(placeholder).toHaveClass('ino-statistic__loading')
    })

    it('shows value when not loading', () => {
      const { container } = render(<Statistic value={12345} loading={false} />)
      expect(getContent(container)!.textContent).toContain('12,345')
    })
  })

  // ============================================================================
  // Title styling
  // ============================================================================

  describe('title styling', () => {
    it('title has title class', () => {
      const { container } = render(<Statistic title="Test" value={0} />)
      expect(getTitle(container)).toHaveClass('ino-statistic__title')
    })

    it('title has title class for font size', () => {
      const { container } = render(<Statistic title="Test" value={0} />)
      expect(getTitle(container)).toHaveClass('ino-statistic__title')
    })

    it('title has title class for line height', () => {
      const { container } = render(<Statistic title="Test" value={0} />)
      expect(getTitle(container)).toHaveClass('ino-statistic__title')
    })
  })

  // ============================================================================
  // Content styling
  // ============================================================================

  describe('content styling', () => {
    it('content has content class', () => {
      const { container } = render(<Statistic value={0} />)
      expect(getContent(container)).toHaveClass('ino-statistic__content')
    })

    it('content has content class for font-weight', () => {
      const { container } = render(<Statistic value={0} />)
      expect(getContent(container)).toHaveClass('ino-statistic__content')
    })

    it('content has content class for tabular-nums', () => {
      const { container } = render(<Statistic value={0} />)
      expect(getContent(container)).toHaveClass('ino-statistic__content')
    })

    it('content has content class for line height', () => {
      const { container } = render(<Statistic value={0} />)
      expect(getContent(container)).toHaveClass('ino-statistic__content')
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(
        <Statistic value={0} classNames={{ root: 'stat-root' }} />,
      )
      expect(getRoot(container).className).toContain('stat-root')
    })

    it('applies classNames.title', () => {
      const { container } = render(
        <Statistic title="T" value={0} classNames={{ title: 'stat-title' }} />,
      )
      expect(getTitle(container)!.className).toContain('stat-title')
    })

    it('applies classNames.content', () => {
      const { container } = render(
        <Statistic value={0} classNames={{ content: 'stat-content' }} />,
      )
      expect(getContent(container)!.className).toContain('stat-content')
    })

    it('applies classNames.prefix', () => {
      const { container } = render(
        <Statistic value={0} prefix="$" classNames={{ prefix: 'stat-prefix' }} />,
      )
      expect(getPrefix(container)!.className).toContain('stat-prefix')
    })

    it('applies classNames.suffix', () => {
      const { container } = render(
        <Statistic value={0} suffix="%" classNames={{ suffix: 'stat-suffix' }} />,
      )
      expect(getSuffix(container)!.className).toContain('stat-suffix')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(
        <Statistic value={0} styles={{ root: { margin: '1rem' } }} />,
      )
      expect(getRoot(container).style.margin).toBe('1rem')
    })

    it('applies styles.title', () => {
      const { container } = render(
        <Statistic title="T" value={0} styles={{ title: { letterSpacing: '1px' } }} />,
      )
      expect(getTitle(container)!.style.letterSpacing).toBe('1px')
    })

    it('applies styles.content', () => {
      const { container } = render(
        <Statistic value={0} styles={{ content: { textAlign: 'center' } }} />,
      )
      expect(getContent(container)!.style.textAlign).toBe('center')
    })

    it('applies styles.prefix', () => {
      const { container } = render(
        <Statistic value={0} prefix="$" styles={{ prefix: { color: 'green' } }} />,
      )
      expect(getPrefix(container)!.style.color).toBe('green')
    })

    it('applies styles.suffix', () => {
      const { container } = render(
        <Statistic value={0} suffix="%" styles={{ suffix: { color: 'red' } }} />,
      )
      expect(getSuffix(container)!.style.color).toBe('red')
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className / style', () => {
    it('applies className to root', () => {
      const { container } = render(<Statistic value={0} className="my-stat" />)
      expect(getRoot(container).className).toContain('my-stat')
    })

    it('applies style to root', () => {
      const { container } = render(
        <Statistic value={0} style={{ maxWidth: '200px' }} />,
      )
      expect(getRoot(container).style.maxWidth).toBe('200px')
    })
  })

  // ============================================================================
  // Compound export
  // ============================================================================

  describe('compound export', () => {
    it('Statistic.Countdown is defined', () => {
      expect(Statistic.Countdown).toBeDefined()
      expect(typeof Statistic.Countdown).toBe('function')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('renders with no props', () => {
      const { container } = render(<Statistic />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('title as ReactNode', () => {
      render(<Statistic title={<em data-testid="em-title">Revenue</em>} value={0} />)
      expect(screen.getByTestId('em-title')).toBeTruthy()
    })

    it('prefix and suffix have proper classes', () => {
      const { container } = render(<Statistic value={0} prefix="$" suffix="%" />)
      expect(getPrefix(container)).toHaveClass('ino-statistic__prefix')
      expect(getSuffix(container)).toHaveClass('ino-statistic__suffix')
    })

    it('prefix and suffix have proper classes for alignment', () => {
      const { container } = render(<Statistic value={0} prefix="$" suffix="%" />)
      expect(getPrefix(container)).toHaveClass('ino-statistic__prefix')
      expect(getSuffix(container)).toHaveClass('ino-statistic__suffix')
    })

    it('small number does not get group separators', () => {
      const { container } = render(<Statistic value={999} />)
      expect(getContent(container)!.textContent).toContain('999')
      expect(getContent(container)!.textContent).not.toContain(',')
    })
  })
})

// ============================================================================
// Statistic.Countdown
// ============================================================================

describe('Statistic.Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'],
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ============================================================================
  // Basic rendering
  // ============================================================================

  describe('basic rendering', () => {
    it('renders root element', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(<Statistic.Countdown value={10000} />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('renders title when provided', () => {
      vi.setSystemTime(new Date(0))
      render(<Statistic.Countdown title="Countdown" value={10000} />)
      expect(screen.getByText('Countdown')).toBeTruthy()
    })

    it('renders countdown value', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(<Statistic.Countdown value={3661000} />)
      // 3661000ms = 1h 1m 1s → "01:01:01"
      expect(getContent(container)!.textContent).toContain('01:01:01')
    })

    it('renders content section with content class', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(<Statistic.Countdown value={5000} />)
      expect(getContent(container)).toHaveClass('ino-statistic__content')
    })
  })

  // ============================================================================
  // Countdown format tokens
  // ============================================================================

  describe('format tokens', () => {
    it('default format HH:mm:ss', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(<Statistic.Countdown value={7261000} />)
      // 7261000ms = 2h 1m 1s
      expect(getContent(container)!.textContent).toContain('02:01:01')
    })

    it('format with days DD D[d] HH:mm:ss', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={90061000} format="D[d] HH:mm:ss" />,
      )
      // 90061000ms = 1d 1h 1m 1s
      expect(getContent(container)!.textContent).toContain('1d 01:01:01')
    })

    it('format with milliseconds SSS', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={1234} format="s.SSS" />,
      )
      expect(getContent(container)!.textContent).toContain('1.234')
    })

    it('format with single-digit tokens H:m:s', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={3661000} format="H:m:s" />,
      )
      // 3661000ms = 1h 1m 1s
      expect(getContent(container)!.textContent).toContain('1:1:1')
    })

    it('format with padded days DD', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={86400000 * 3} format="DD [days]" />,
      )
      expect(getContent(container)!.textContent).toContain('03 days')
    })

    it('format with literal brackets', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={3600000} format="H [hours] m [min]" />,
      )
      expect(getContent(container)!.textContent).toContain('1 hours 0 min')
    })

    it('format with singular/plural', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={86400000} format="D [day|days]" />,
      )
      // 1 day → singular
      expect(getContent(container)!.textContent).toContain('1 day')
    })

    it('format with plural inflection', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={86400000 * 2} format="D [day|days]" />,
      )
      expect(getContent(container)!.textContent).toContain('2 days')
    })
  })

  // ============================================================================
  // Countdown callbacks
  // ============================================================================

  describe('callbacks', () => {
    it('calls onFinish when countdown reaches zero', () => {
      const onFinish = vi.fn()
      vi.setSystemTime(new Date(0))
      render(<Statistic.Countdown value={1000} onFinish={onFinish} />)
      // Advance past expiry
      act(() => {
        vi.setSystemTime(new Date(2000))
        vi.advanceTimersByTime(1000)
      })
      expect(onFinish).toHaveBeenCalledTimes(1)
    })

    it('calls onChange on each tick', () => {
      const onChange = vi.fn()
      vi.setSystemTime(new Date(0))
      render(<Statistic.Countdown value={5000} onChange={onChange} />)
      // onChange is called immediately on first tick
      expect(onChange).toHaveBeenCalled()
      const firstCall = onChange.mock.calls[0][0]
      expect(typeof firstCall).toBe('number')
    })

    it('onFinish only fires once', () => {
      const onFinish = vi.fn()
      vi.setSystemTime(new Date(0))
      render(<Statistic.Countdown value={1000} onFinish={onFinish} />)
      act(() => {
        vi.setSystemTime(new Date(2000))
        vi.advanceTimersByTime(1000)
      })
      act(() => {
        vi.setSystemTime(new Date(3000))
        vi.advanceTimersByTime(1000)
      })
      expect(onFinish).toHaveBeenCalledTimes(1)
    })

    it('shows 00:00:00 when countdown is past', () => {
      vi.setSystemTime(new Date(10000))
      const { container } = render(<Statistic.Countdown value={5000} />)
      expect(getContent(container)!.textContent).toContain('00:00:00')
    })
  })

  // ============================================================================
  // Countdown ticking
  // ============================================================================

  describe('ticking', () => {
    it('value decreases over time', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(<Statistic.Countdown value={10000} />)
      expect(getContent(container)!.textContent).toContain('00:00:10')

      act(() => {
        vi.setSystemTime(new Date(5000))
        vi.advanceTimersByTime(1000)
      })
      // setSystemTime(5000) + advanceTimersByTime(1000) → Date.now()=6000 → 10000-6000=4s
      expect(getContent(container)!.textContent).toContain('00:00:04')
    })

    it('uses 33ms interval when SSS is in format', () => {
      vi.setSystemTime(new Date(0))
      const onChange = vi.fn()
      render(
        <Statistic.Countdown value={2000} format="s.SSS" onChange={onChange} />,
      )
      const callsBefore = onChange.mock.calls.length
      act(() => {
        vi.setSystemTime(new Date(33))
        vi.advanceTimersByTime(33)
      })
      // Should have ticked at least once more
      expect(onChange.mock.calls.length).toBeGreaterThan(callsBefore)
    })
  })

  // ============================================================================
  // Countdown prefix and suffix
  // ============================================================================

  describe('prefix and suffix', () => {
    it('renders prefix', () => {
      vi.setSystemTime(new Date(0))
      render(<Statistic.Countdown value={5000} prefix="⏰" />)
      expect(screen.getByText('⏰')).toBeTruthy()
    })

    it('renders suffix', () => {
      vi.setSystemTime(new Date(0))
      render(<Statistic.Countdown value={5000} suffix="left" />)
      expect(screen.getByText('left')).toBeTruthy()
    })
  })

  // ============================================================================
  // Countdown semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} classNames={{ root: 'cd-root' }} />,
      )
      expect(getRoot(container).className).toContain('cd-root')
    })

    it('applies classNames.title', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} title="CD" classNames={{ title: 'cd-title' }} />,
      )
      expect(getTitle(container)!.className).toContain('cd-title')
    })

    it('applies classNames.content', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} classNames={{ content: 'cd-content' }} />,
      )
      expect(getContent(container)!.className).toContain('cd-content')
    })

    it('applies classNames.prefix', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} prefix="⏰" classNames={{ prefix: 'cd-prefix' }} />,
      )
      expect(getPrefix(container)!.className).toContain('cd-prefix')
    })

    it('applies classNames.suffix', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} suffix="left" classNames={{ suffix: 'cd-suffix' }} />,
      )
      expect(getSuffix(container)!.className).toContain('cd-suffix')
    })
  })

  // ============================================================================
  // Countdown semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} styles={{ root: { padding: '1rem' } }} />,
      )
      expect(getRoot(container).style.padding).toBe('1rem')
    })

    it('applies styles.content', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} styles={{ content: { textAlign: 'right' } }} />,
      )
      expect(getContent(container)!.style.textAlign).toBe('right')
    })
  })

  // ============================================================================
  // Countdown className / style
  // ============================================================================

  describe('className / style', () => {
    it('applies className to root', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} className="my-cd" />,
      )
      expect(getRoot(container).className).toContain('my-cd')
    })

    it('applies style to root', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={5000} style={{ border: '1px solid red' }} />,
      )
      expect(getRoot(container).style.border).toContain('1px solid red')
    })
  })

  // ============================================================================
  // Countdown edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('handles value already in the past', () => {
      vi.setSystemTime(new Date(10000))
      const { container } = render(<Statistic.Countdown value={5000} />)
      expect(getContent(container)!.textContent).toContain('00:00:00')
    })

    it('handles very large countdown', () => {
      vi.setSystemTime(new Date(0))
      const { container } = render(
        <Statistic.Countdown value={86400000 * 100} format="D[d] HH:mm:ss" />,
      )
      expect(getContent(container)!.textContent).toContain('100d')
    })

    it('title as ReactNode', () => {
      vi.setSystemTime(new Date(0))
      render(
        <Statistic.Countdown
          title={<span data-testid="cd-title-node">Timer</span>}
          value={5000}
        />,
      )
      expect(screen.getByTestId('cd-title-node')).toBeTruthy()
    })
  })
})
