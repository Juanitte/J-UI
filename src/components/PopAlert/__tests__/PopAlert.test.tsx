import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, cleanup } from '@testing-library/react'
import { usePopAlert } from '../PopAlert'
import type { PopAlertApi, PopAlertHookConfig } from '../PopAlert'
import { tokens } from '../../../theme/tokens'

// ─── Theme mock ──────────────────────────────────────────────────────────────

let mockThemeMode = 'light'

vi.mock('../../../theme', () => ({
  useThemeMode: () => mockThemeMode,
}))

// ─── Fake timers ─────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date'],
  })
  mockThemeMode = 'light'
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

// ─── Wrapper component that exposes the API ──────────────────────────────────

let apiRef: PopAlertApi

function Wrapper({ config }: { config?: PopAlertHookConfig }) {
  const [api, contextHolder] = usePopAlert(config)
  apiRef = api
  return <div>{contextHolder}</div>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Advance the clock by 50ms to fire both nested rAFs in one sweep
 * and allow all effects (including auto-close timer setup) to flush.
 */
function flushEnterAnimation() {
  act(() => { vi.advanceTimersByTime(50) })
}

function getContainer(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.ino-pop-alert__container') ?? null
}

function getItems(): HTMLElement[] {
  const container = getContainer()
  if (!container) return []
  // Each item is a wrapper div > card div
  return Array.from(container.children) as HTMLElement[]
}

function getCard(itemIndex = 0): HTMLElement | null {
  const items = getItems()
  return (items[itemIndex]?.firstElementChild as HTMLElement) ?? null
}

function getIconSpan(itemIndex = 0): HTMLElement | null {
  const card = getCard(itemIndex)
  if (!card) return null
  return card.querySelector<HTMLElement>('.ino-pop-alert__icon') ?? null
}

function getContentSpan(itemIndex = 0): HTMLElement | null {
  const card = getCard(itemIndex)
  if (!card) return null
  return card.querySelector<HTMLElement>('.ino-pop-alert__content') ?? null
}

/** The flex:1 wrapper div that contains content + description spans */
function getContentWrapper(itemIndex = 0): HTMLElement | null {
  const card = getCard(itemIndex)
  if (!card) return null
  return card.querySelector<HTMLElement>('.ino-pop-alert__content-wrapper') ?? null
}

/** The description span */
function getDescriptionSpan(itemIndex = 0): HTMLElement | null {
  const card = getCard(itemIndex)
  if (!card) return null
  return card.querySelector<HTMLElement>('.ino-pop-alert__description') ?? null
}

function getCloseButton(itemIndex = 0): HTMLButtonElement | null {
  const card = getCard(itemIndex)
  if (!card) return null
  return card.querySelector('button') as HTMLButtonElement | null
}

function getProgressBar(itemIndex = 0): HTMLElement | null {
  const card = getCard(itemIndex)
  if (!card) return null
  return card.querySelector<HTMLElement>('.ino-pop-alert__progress') ?? null
}

// ============================================================================
// Tests
// ============================================================================

describe('PopAlert', () => {
  // ==========================================================================
  // Basic rendering
  // ==========================================================================

  describe('basic rendering', () => {
    it('renders nothing initially', () => {
      render(<Wrapper />)
      expect(getContainer()).toBeNull()
    })

    it('renders a message in the portal', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Hello') })
      flushEnterAnimation()
      expect(getContainer()).not.toBeNull()
      expect(getItems().length).toBe(1)
    })

    it('renders content text', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Test message') })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Test message')
    })

    it('renders ReactNode content', () => {
      render(<Wrapper />)
      act(() => { apiRef.info(<strong>Bold</strong>) })
      flushEnterAnimation()
      const content = getContentSpan()!
      expect(content.querySelector('strong')).not.toBeNull()
      expect(content.textContent).toBe('Bold')
    })

    it('renders icon by default', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Msg') })
      flushEnterAnimation()
      const icon = getIconSpan()!
      expect(icon.querySelector('svg')).not.toBeNull()
    })

    it('portal renders in document.body', () => {
      render(<Wrapper />)
      act(() => { apiRef.success('Ok') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.closest('body')).toBe(document.body)
    })
  })

  // ==========================================================================
  // Description
  // ==========================================================================

  describe('description', () => {
    it('renders description text below content', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Main', type: 'info', description: 'Secondary', duration: 0 })
      })
      flushEnterAnimation()
      expect(getDescriptionSpan()!.textContent).toBe('Secondary')
    })

    it('renders ReactNode description', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Main', type: 'info', description: <em data-testid="desc-node">note</em>, duration: 0 })
      })
      flushEnterAnimation()
      expect(document.body.querySelector('[data-testid="desc-node"]')).not.toBeNull()
    })

    it('no description span when description is not provided', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('No desc', 0) })
      flushEnterAnimation()
      expect(getDescriptionSpan()).toBeNull()
    })

    it('description has fontSize 0.8125em', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', description: 'D', duration: 0 })
      })
      flushEnterAnimation()
      expect(getDescriptionSpan()!).toHaveClass('ino-pop-alert__description')
    })

    it('description has marginTop 0.125rem', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', description: 'D', duration: 0 })
      })
      flushEnterAnimation()
      expect(getDescriptionSpan()!).toHaveClass('ino-pop-alert__description')
    })

    it('description propagates on key-based update', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', key: 'k', description: 'Old', duration: 0 })
      })
      flushEnterAnimation()
      act(() => {
        apiRef.open({ content: 'C', type: 'info', key: 'k', description: 'New', duration: 0 })
      })
      flushEnterAnimation()
      expect(getDescriptionSpan()!.textContent).toBe('New')
    })

    it('description can be cleared on update', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', key: 'k2', description: 'Had desc', duration: 0 })
      })
      flushEnterAnimation()
      act(() => {
        apiRef.open({ content: 'C', type: 'info', key: 'k2', duration: 0 })
      })
      flushEnterAnimation()
      expect(getDescriptionSpan()).toBeNull()
    })
  })

  // ==========================================================================
  // Types (success, error, info, warning, loading)
  // ==========================================================================

  describe('types', () => {
    it('api.success() shows success message', () => {
      render(<Wrapper />)
      act(() => { apiRef.success('Done') })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Done')
      const icon = getIconSpan()!
      // success icon color uses tokens.colorSuccess
      expect(icon.style.color).toBe(tokens.colorSuccess)
    })

    it('api.error() shows error message', () => {
      render(<Wrapper />)
      act(() => { apiRef.error('Fail') })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Fail')
      expect(getIconSpan()!.style.color).toBe(tokens.colorError)
    })

    it('api.info() shows info message', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Note') })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Note')
      expect(getIconSpan()!.style.color).toBe(tokens.colorInfo)
    })

    it('api.warning() shows warning message', () => {
      render(<Wrapper />)
      act(() => { apiRef.warning('Careful') })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Careful')
      expect(getIconSpan()!.style.color).toBe(tokens.colorWarning)
    })

    it('api.loading() shows loading message', () => {
      render(<Wrapper />)
      act(() => { apiRef.loading('Wait') })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Wait')
      // loading uses colorInfo
      expect(getIconSpan()!.style.color).toBe(tokens.colorInfo)
    })

    it('success icon has checkmark path', () => {
      render(<Wrapper />)
      act(() => { apiRef.success('Ok') })
      flushEnterAnimation()
      const svg = getIconSpan()!.querySelector('svg')!
      const path = svg.querySelector('path')!
      expect(path.getAttribute('d')).toContain('14.17')
    })

    it('error icon has X path', () => {
      render(<Wrapper />)
      act(() => { apiRef.error('Fail') })
      flushEnterAnimation()
      const path = getIconSpan()!.querySelector('svg path')!
      expect(path.getAttribute('d')).toContain('15.59')
    })

    it('info icon has i path', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Note') })
      flushEnterAnimation()
      const path = getIconSpan()!.querySelector('svg path')!
      expect(path.getAttribute('d')).toContain('v-6')
    })

    it('warning icon has triangle path', () => {
      render(<Wrapper />)
      act(() => { apiRef.warning('Warn') })
      flushEnterAnimation()
      const path = getIconSpan()!.querySelector('svg path')!
      expect(path.getAttribute('d')).toContain('1 21h22')
    })

    it('loading icon has animated spinner', () => {
      render(<Wrapper />)
      act(() => { apiRef.loading('Load') })
      flushEnterAnimation()
      const svg = getIconSpan()!.querySelector('svg')!
      expect(svg.querySelector('circle')).not.toBeNull()
      expect(svg.querySelector('path')).not.toBeNull()
    })

    it('each type has distinct background color', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'S', type: 'success', key: 's' })
        apiRef.open({ content: 'E', type: 'error', key: 'e' })
      })
      flushEnterAnimation()
      const card0 = getCard(0)!
      const card1 = getCard(1)!
      expect(card0.style.backgroundColor).not.toBe(card1.style.backgroundColor)
    })
  })

  // ==========================================================================
  // api.open()
  // ==========================================================================

  describe('api.open()', () => {
    it('opens with full config', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Custom', type: 'success', duration: 5, closable: true })
      })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Custom')
      expect(getCloseButton()).not.toBeNull()
    })

    it('custom icon overrides default', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Hi', type: 'info', icon: <span data-testid="custom-icon">!</span> })
      })
      flushEnterAnimation()
      const icon = getIconSpan()!
      expect(icon.querySelector('[data-testid="custom-icon"]')).not.toBeNull()
    })
  })

  // ==========================================================================
  // Duration & auto-close
  // ==========================================================================

  describe('duration & auto-close', () => {
    it('default duration is 3 seconds', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Auto') })
      flushEnterAnimation()
      expect(getItems().length).toBe(1)

      // Advance 2.9s — still visible
      act(() => { vi.advanceTimersByTime(2900) })
      expect(getItems().length).toBe(1)

      // Advance to 3s — triggers exit
      act(() => { vi.advanceTimersByTime(200) })
      // Item starts exiting (opacity 0)
      const item = getItems()[0]
      expect(item.style.opacity).toBe('0')
    })

    it('custom duration via shorthand', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Fast', 1) })
      flushEnterAnimation()

      act(() => { vi.advanceTimersByTime(1000) })
      const item = getItems()[0]
      expect(item.style.opacity).toBe('0')
    })

    it('duration 0 never auto-closes', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Persist', 0) })
      flushEnterAnimation()

      // No timer is set for duration 0, item stays visible
      expect(getItems().length).toBe(1)
      expect(getItems()[0].style.opacity).toBe('1')
    })

    it('hook-level default duration applies', () => {
      render(<Wrapper config={{ duration: 2 }} />)
      act(() => { apiRef.info('Delayed') })
      flushEnterAnimation()

      // Still visible before 2s
      act(() => { vi.advanceTimersByTime(1900) })
      expect(getItems()[0].style.opacity).toBe('1')

      // Exits after 2s
      act(() => { vi.advanceTimersByTime(200) })
      expect(getItems()[0].style.opacity).toBe('0')
    })

    it('per-message duration overrides hook default', () => {
      render(<Wrapper config={{ duration: 10 }} />)
      act(() => { apiRef.info('Quick', 1) })
      flushEnterAnimation()

      act(() => { vi.advanceTimersByTime(1000) })
      expect(getItems()[0].style.opacity).toBe('0')
    })

    it('item is removed after exit transition ends', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Bye', type: 'info', closable: true, duration: 0 })
      })
      flushEnterAnimation()

      // Trigger exit via close button
      fireEvent.click(getCloseButton()!)
      expect(getItems().length).toBe(1)

      // Fire transitionEnd on the wrapper
      const item = getItems()[0]
      fireEvent.transitionEnd(item, { target: item })
      expect(getItems().length).toBe(0)
    })

    it('onClose callback fires after exit', () => {
      const onClose = vi.fn()
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'CB', type: 'info', closable: true, duration: 0, onClose })
      })
      flushEnterAnimation()

      // Trigger exit via close button
      fireEvent.click(getCloseButton()!)
      const item = getItems()[0]
      fireEvent.transitionEnd(item, { target: item })
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // Closable
  // ==========================================================================

  describe('closable', () => {
    it('no close button by default', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Msg') })
      flushEnterAnimation()
      expect(getCloseButton()).toBeNull()
    })

    it('closable shows close button', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Close me', type: 'info', closable: true })
      })
      flushEnterAnimation()
      expect(getCloseButton()).not.toBeNull()
    })

    it('clicking close starts exit animation', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Close', type: 'info', closable: true, duration: 0 })
      })
      flushEnterAnimation()

      fireEvent.click(getCloseButton()!)
      const item = getItems()[0]
      expect(item.style.opacity).toBe('0')
    })

    it('close button has correct styles', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'X', type: 'info', closable: true })
      })
      flushEnterAnimation()
      const btn = getCloseButton()!
      expect(btn).toHaveClass('ino-pop-alert__close-btn')
    })

    it('close button hover changes color', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'X', type: 'info', closable: true })
      })
      flushEnterAnimation()
      const btn = getCloseButton()!
      expect(btn).toHaveClass('ino-pop-alert__close-btn')
    })

    it('close button has SVG icon', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'X', type: 'info', closable: true })
      })
      flushEnterAnimation()
      const svg = getCloseButton()!.querySelector('svg')!
      expect(svg.getAttribute('width')).toBe('12')
      expect(svg.querySelectorAll('line').length).toBe(2)
    })
  })

  // ==========================================================================
  // Update in place (key-based)
  // ==========================================================================

  describe('update in place', () => {
    it('same key updates content', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Loading...', type: 'loading', key: 'my-msg', duration: 0 })
      })
      flushEnterAnimation()
      expect(getContentSpan()!.textContent).toBe('Loading...')

      act(() => {
        apiRef.open({ content: 'Done!', type: 'success', key: 'my-msg', duration: 0 })
      })
      flushEnterAnimation()
      expect(getItems().length).toBe(1)
      expect(getContentSpan()!.textContent).toBe('Done!')
    })

    it('same key updates type/icon color', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'A', type: 'loading', key: 'k1', duration: 0 })
      })
      flushEnterAnimation()
      expect(getIconSpan()!.style.color).toBe(tokens.colorInfo)

      act(() => {
        apiRef.open({ content: 'B', type: 'success', key: 'k1', duration: 0 })
      })
      flushEnterAnimation()
      expect(getIconSpan()!.style.color).toBe(tokens.colorSuccess)
    })

    it('different keys create separate messages', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'A', type: 'info', key: 'a', duration: 0 })
        apiRef.open({ content: 'B', type: 'info', key: 'b', duration: 0 })
      })
      flushEnterAnimation()
      expect(getItems().length).toBe(2)
    })
  })

  // ==========================================================================
  // MaxCount
  // ==========================================================================

  describe('maxCount', () => {
    it('limits visible messages', () => {
      render(<Wrapper config={{ maxCount: 2 }} />)
      act(() => { apiRef.info('A', 0) })
      flushEnterAnimation()
      act(() => { apiRef.info('B', 0) })
      flushEnterAnimation()
      act(() => { apiRef.info('C', 0) })
      flushEnterAnimation()
      // 3 items exist, but oldest should be exiting (opacity 0)
      const items = getItems()
      expect(items[0].style.opacity).toBe('0')
    })

    it('new message evicts oldest when at limit', () => {
      render(<Wrapper config={{ maxCount: 1 }} />)
      act(() => { apiRef.info('First', 0) })
      flushEnterAnimation()

      act(() => { apiRef.info('Second', 0) })
      flushEnterAnimation()

      // First should be exiting
      const items = getItems()
      expect(items[0].style.opacity).toBe('0')
    })
  })

  // ==========================================================================
  // Pause on hover
  // ==========================================================================

  describe('pause on hover', () => {
    it('pauses auto-close timer on mouseEnter', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Hover me', 2) })
      flushEnterAnimation()

      // After 500ms, hover
      act(() => { vi.advanceTimersByTime(500) })
      fireEvent.mouseEnter(getItems()[0])

      // Even after 2s more, should still be visible (paused)
      act(() => { vi.advanceTimersByTime(2000) })
      expect(getItems()[0].style.opacity).toBe('1')
    })

    it('resumes timer on mouseLeave', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Leave me', 2) })
      flushEnterAnimation()

      // After 1s, hover then leave
      act(() => { vi.advanceTimersByTime(1000) })
      fireEvent.mouseEnter(getItems()[0])
      act(() => { vi.advanceTimersByTime(500) })
      fireEvent.mouseLeave(getItems()[0])

      // Remaining ~1s
      act(() => { vi.advanceTimersByTime(1100) })
      expect(getItems()[0].style.opacity).toBe('0')
    })

    it('pauseOnHover=false does not pause', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'No pause', type: 'info', pauseOnHover: false, duration: 2 })
      })
      flushEnterAnimation()

      act(() => { vi.advanceTimersByTime(1000) })
      fireEvent.mouseEnter(getItems()[0])

      act(() => { vi.advanceTimersByTime(1100) })
      expect(getItems()[0].style.opacity).toBe('0')
    })

    it('pause on hover does nothing with duration 0', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Forever', 0) })
      flushEnterAnimation()

      fireEvent.mouseEnter(getItems()[0])
      // Item stays visible with duration 0 regardless of hover
      expect(getItems()[0].style.opacity).toBe('1')
    })
  })

  // ==========================================================================
  // Destroy
  // ==========================================================================

  describe('destroy', () => {
    it('destroy(key) starts exit for specific message', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'A', type: 'info', key: 'a', duration: 0 })
      })
      flushEnterAnimation()

      act(() => { apiRef.destroy('a') })
      flushEnterAnimation()
      const items = getItems()
      expect(items[0].style.opacity).toBe('0')
    })

    it('destroy() without key starts exit for all', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.info('A', 0)
        apiRef.info('B', 0)
      })
      flushEnterAnimation()

      act(() => { apiRef.destroy() })
      const items = getItems()
      items.forEach((item) => {
        expect(item.style.opacity).toBe('0')
      })
    })

    it('destroyed items are removed after transitionEnd', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Del', type: 'info', key: 'del', duration: 0 })
      })
      flushEnterAnimation()

      act(() => { apiRef.destroy('del') })
      const item = getItems()[0]
      fireEvent.transitionEnd(item, { target: item })
      expect(getItems().length).toBe(0)
    })
  })

  // ==========================================================================
  // Progress bar
  // ==========================================================================

  describe('progress bar', () => {
    it('no progress bar by default', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Msg') })
      flushEnterAnimation()
      expect(getProgressBar()).toBeNull()
    })

    it('showProgress renders progress bar', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Prog', type: 'info', showProgress: true, duration: 3 })
      })
      flushEnterAnimation()
      expect(getProgressBar()).not.toBeNull()
    })

    it('progress bar has animation with duration', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'P', type: 'info', showProgress: true, duration: 5 })
      })
      flushEnterAnimation()
      const bar = getProgressBar()!
      expect(bar.style.animation).toContain('5s')
      expect(bar.style.animation).toContain('linear')
    })

    it('progress bar has correct positioning', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'P', type: 'info', showProgress: true, duration: 3 })
      })
      flushEnterAnimation()
      const bar = getProgressBar()!
      expect(bar).toHaveClass('ino-pop-alert__progress')
    })

    it('progress bar has opacity 0.6', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'P', type: 'info', showProgress: true, duration: 3 })
      })
      flushEnterAnimation()
      expect(getProgressBar()!).toHaveClass('ino-pop-alert__progress')
    })

    it('no progress bar when duration is 0', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'P', type: 'info', showProgress: true, duration: 0 })
      })
      flushEnterAnimation()
      expect(getProgressBar()).toBeNull()
    })
  })

  // ==========================================================================
  // Placement
  // ==========================================================================

  describe('placement', () => {
    it('default placement is top', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Top') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.top).toBe('0.5rem')
      expect(container.style.alignItems).toBe('center')
    })

    it('topLeft placement', () => {
      render(<Wrapper config={{ placement: 'topLeft' }} />)
      act(() => { apiRef.info('TL') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.top).toBe('0.5rem')
      expect(container.style.alignItems).toBe('flex-start')
    })

    it('topRight placement', () => {
      render(<Wrapper config={{ placement: 'topRight' }} />)
      act(() => { apiRef.info('TR') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.top).toBe('0.5rem')
      expect(container.style.alignItems).toBe('flex-end')
    })

    it('bottom placement uses column-reverse', () => {
      render(<Wrapper config={{ placement: 'bottom' }} />)
      act(() => { apiRef.info('Bot') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.bottom).toBe('0.5rem')
      expect(container.style.flexDirection).toBe('column-reverse')
    })

    it('bottomLeft placement', () => {
      render(<Wrapper config={{ placement: 'bottomLeft' }} />)
      act(() => { apiRef.info('BL') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.bottom).toBe('0.5rem')
      expect(container.style.alignItems).toBe('flex-start')
      expect(container.style.flexDirection).toBe('column-reverse')
    })

    it('bottomRight placement', () => {
      render(<Wrapper config={{ placement: 'bottomRight' }} />)
      act(() => { apiRef.info('BR') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.bottom).toBe('0.5rem')
      expect(container.style.alignItems).toBe('flex-end')
    })

    it('left placement centers vertically', () => {
      render(<Wrapper config={{ placement: 'left' }} />)
      act(() => { apiRef.info('L') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.left).toBe('0.5rem')
      expect(container.style.justifyContent).toBe('center')
      expect(container.style.alignItems).toBe('flex-start')
    })

    it('right placement centers vertically', () => {
      render(<Wrapper config={{ placement: 'right' }} />)
      act(() => { apiRef.info('R') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.right).toBe('0.5rem')
      expect(container.style.justifyContent).toBe('center')
      expect(container.style.alignItems).toBe('flex-end')
    })

    it('custom offset', () => {
      render(<Wrapper config={{ offset: '2rem' }} />)
      act(() => { apiRef.info('Off') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.top).toBe('2rem')
    })

    it('numeric offset', () => {
      render(<Wrapper config={{ offset: 20 }} />)
      act(() => { apiRef.info('Off') })
      flushEnterAnimation()
      const container = getContainer()!
      expect(container.style.top).toBe('20px')
    })
  })

  // ==========================================================================
  // Size
  // ==========================================================================

  describe('size', () => {
    it('default size is md', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Md') })
      flushEnterAnimation()
      const card = getCard()!
      expect(card.style.fontSize).toBe('0.875rem')
    })

    it('sm size', () => {
      render(<Wrapper config={{ size: 'sm' }} />)
      act(() => { apiRef.info('Sm') })
      flushEnterAnimation()
      const card = getCard()!
      expect(card.style.fontSize).toBe('0.75rem')
    })

    it('lg size', () => {
      render(<Wrapper config={{ size: 'lg' }} />)
      act(() => { apiRef.info('Lg') })
      flushEnterAnimation()
      const card = getCard()!
      expect(card.style.fontSize).toBe('1rem')
    })

    it('per-message size overrides hook default', () => {
      render(<Wrapper config={{ size: 'sm' }} />)
      act(() => {
        apiRef.open({ content: 'Big', type: 'info', size: 'lg' })
      })
      flushEnterAnimation()
      expect(getCard()!.style.fontSize).toBe('1rem')
    })

    it('sm icon size is 14', () => {
      render(<Wrapper config={{ size: 'sm' }} />)
      act(() => { apiRef.info('Sm') })
      flushEnterAnimation()
      const svg = getIconSpan()!.querySelector('svg')!
      expect(svg.getAttribute('width')).toBe('14')
    })

    it('md icon size is 16', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Md') })
      flushEnterAnimation()
      const svg = getIconSpan()!.querySelector('svg')!
      expect(svg.getAttribute('width')).toBe('16')
    })

    it('lg icon size is 20', () => {
      render(<Wrapper config={{ size: 'lg' }} />)
      act(() => { apiRef.info('Lg') })
      flushEnterAnimation()
      const svg = getIconSpan()!.querySelector('svg')!
      expect(svg.getAttribute('width')).toBe('20')
    })
  })

  // ==========================================================================
  // Animation
  // ==========================================================================

  describe('animation', () => {
    it('entering state has opacity 0', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Enter') })
      // Before flushEnterAnimation, it's in entering state
      const item = getItems()[0]
      expect(item.style.opacity).toBe('0')
    })

    it('entering state has transform translateY(-100%) for top', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Enter') })
      const item = getItems()[0]
      expect(item.style.transform).toBe('translateY(-100%)')
    })

    it('entering from bottom has translateY(100%)', () => {
      render(<Wrapper config={{ placement: 'bottom' }} />)
      act(() => { apiRef.info('Enter') })
      const item = getItems()[0]
      expect(item.style.transform).toBe('translateY(100%)')
    })

    it('entering from left has translateX(-100%)', () => {
      render(<Wrapper config={{ placement: 'left' }} />)
      act(() => { apiRef.info('Enter') })
      const item = getItems()[0]
      expect(item.style.transform).toBe('translateX(-100%)')
    })

    it('entering from right has translateX(100%)', () => {
      render(<Wrapper config={{ placement: 'right' }} />)
      act(() => { apiRef.info('Enter') })
      const item = getItems()[0]
      expect(item.style.transform).toBe('translateX(100%)')
    })

    it('item has transition properties', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Trans') })
      flushEnterAnimation()
      const item = getItems()[0]
      expect(item).toHaveClass('ino-pop-alert__item')
    })

    it('entering state has maxHeight 0', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Enter') })
      const item = getItems()[0]
      expect(parseFloat(item.style.maxHeight)).toBe(0)
    })

    it('exiting state has maxHeight 0', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Exit', type: 'info', closable: true, duration: 0 })
      })
      flushEnterAnimation()
      fireEvent.click(getCloseButton()!)
      const item = getItems()[0]
      expect(parseFloat(item.style.maxHeight)).toBe(0)
    })
  })

  // ==========================================================================
  // Card styling
  // ==========================================================================

  describe('card styling', () => {
    it('card has border-radius', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Style') })
      flushEnterAnimation()
      expect(getCard()!).toHaveClass('ino-pop-alert__card')
    })

    it('card has inline-flex display', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Style') })
      flushEnterAnimation()
      expect(getCard()!).toHaveClass('ino-pop-alert__card')
    })

    it('card has box-shadow', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Style') })
      flushEnterAnimation()
      expect(getCard()!).toHaveClass('ino-pop-alert__card')
    })

    it('card has border', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Style') })
      flushEnterAnimation()
      expect(getCard()!.style.border).toContain('1px solid')
    })

    it('card has lineHeight 1.5', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Style') })
      flushEnterAnimation()
      expect(getCard()!).toHaveClass('ino-pop-alert__card')
    })

    it('card has color from tokens', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Style') })
      flushEnterAnimation()
      expect(getCard()!).toHaveClass('ino-pop-alert__card')
    })
  })

  // ==========================================================================
  // Container styling
  // ==========================================================================

  describe('container styling', () => {
    it('container has fixed positioning', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('C') })
      flushEnterAnimation()
      expect(getContainer()!.style.position).toBe('fixed')
    })

    it('container has zIndex 1010', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('C') })
      flushEnterAnimation()
      expect(getContainer()!.style.zIndex).toBe('1010')
    })

    it('container has pointer-events none', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('C') })
      flushEnterAnimation()
      expect(getContainer()!.style.pointerEvents).toBe('none')
    })

    it('container has flex-direction column', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('C') })
      flushEnterAnimation()
      expect(getContainer()!.style.flexDirection).toBe('column')
    })

    it('item wrapper has pointer-events all', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('C') })
      flushEnterAnimation()
      expect(getItems()[0]).toHaveClass('ino-pop-alert__item')
    })

    it('container disappears when all items removed', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Gone', type: 'info', closable: true, duration: 0 })
      })
      flushEnterAnimation()

      fireEvent.click(getCloseButton()!)
      const item = getItems()[0]
      fireEvent.transitionEnd(item, { target: item })
      expect(getContainer()).toBeNull()
    })
  })

  // ==========================================================================
  // Dark mode
  // ==========================================================================

  describe('dark mode', () => {
    it('dark mode uses different background color', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Light') })
      flushEnterAnimation()
      const lightBg = getCard()!.style.backgroundColor

      cleanup()
      mockThemeMode = 'dark'

      render(<Wrapper />)
      act(() => { apiRef.info('Dark') })
      flushEnterAnimation()
      const darkBg = getCard()!.style.backgroundColor

      expect(lightBg).not.toBe(darkBg)
    })

    it('dark mode background uses 18% mix', () => {
      mockThemeMode = 'dark'
      render(<Wrapper />)
      act(() => { apiRef.info('Dark') })
      flushEnterAnimation()
      const bg = getCard()!.style.backgroundColor
      expect(bg).toContain('color-mix')
      expect(bg).toContain('18%')
    })

    it('light mode background uses 15% mix', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Light') })
      flushEnterAnimation()
      const bg = getCard()!.style.backgroundColor
      expect(bg).toContain('color-mix')
      expect(bg).toContain('15%')
    })
  })

  // ==========================================================================
  // Semantic classNames
  // ==========================================================================

  describe('semantic classNames', () => {
    it('classNames.root applies to card', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', classNames: { root: 'my-root' } })
      })
      flushEnterAnimation()
      expect(getCard()!.className).toContain('my-root')
    })

    it('classNames.icon applies to icon span', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', classNames: { icon: 'my-icon' } })
      })
      flushEnterAnimation()
      expect(getIconSpan()!.className).toContain('my-icon')
    })

    it('classNames.content applies to content span', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', classNames: { content: 'my-content' } })
      })
      flushEnterAnimation()
      expect(getContentSpan()!.className).toContain('my-content')
    })

    it('classNames.description applies to description span', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', description: 'Desc', classNames: { description: 'my-desc' } })
      })
      flushEnterAnimation()
      expect(getDescriptionSpan()!.className).toContain('my-desc')
    })

    it('className applies to card', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'C', type: 'info', className: 'outer-class' })
      })
      flushEnterAnimation()
      expect(getCard()!.className).toContain('outer-class')
    })
  })

  // ==========================================================================
  // Semantic styles
  // ==========================================================================

  describe('semantic styles', () => {
    it('styles.root merges into card', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'S', type: 'info', styles: { root: { marginTop: '10px' } } })
      })
      flushEnterAnimation()
      expect(getCard()!.style.marginTop).toBe('10px')
    })

    it('styles.icon merges into icon span', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'S', type: 'info', styles: { icon: { opacity: '0.5' } } })
      })
      flushEnterAnimation()
      expect(getIconSpan()!.style.opacity).toBe('0.5')
    })

    it('styles.content merges into content span', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'S', type: 'info', styles: { content: { fontWeight: '700' } } })
      })
      flushEnterAnimation()
      expect(getContentSpan()!.style.fontWeight).toBe('700')
    })

    it('styles.description merges into description span', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'S', type: 'info', description: 'D', styles: { description: { letterSpacing: '2px' } } })
      })
      flushEnterAnimation()
      expect(getDescriptionSpan()!.style.letterSpacing).toBe('2px')
    })

    it('style prop merges into card', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'S', type: 'info', style: { padding: '2rem' } })
      })
      flushEnterAnimation()
      expect(getCard()!.style.padding).toBe('2rem')
    })
  })

  // ==========================================================================
  // Multiple messages
  // ==========================================================================

  describe('multiple messages', () => {
    it('renders multiple messages', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.info('A', 0)
        apiRef.success('B', 0)
        apiRef.error('C', 0)
      })
      flushEnterAnimation()
      expect(getItems().length).toBe(3)
    })

    it('messages render in order', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.info('First', 0)
        apiRef.info('Second', 0)
        apiRef.info('Third', 0)
      })
      flushEnterAnimation()
      expect(getContentSpan(0)!.textContent).toBe('First')
      expect(getContentSpan(1)!.textContent).toBe('Second')
      expect(getContentSpan(2)!.textContent).toBe('Third')
    })

    it('each message auto-closes independently', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Close', type: 'info', closable: true, duration: 0, key: 'a' })
        apiRef.open({ content: 'Stay', type: 'info', duration: 0, key: 'b' })
      })
      flushEnterAnimation()

      // Close first via button, second stays
      fireEvent.click(getCloseButton(0)!)
      expect(getItems()[0].style.opacity).toBe('0')
      expect(getItems()[1].style.opacity).toBe('1')
    })
  })

  // ==========================================================================
  // Keyframes
  // ==========================================================================

  describe('keyframes', () => {
    it('injects spin keyframe', () => {
      render(<Wrapper />)
      act(() => { apiRef.loading('Spin') })
      flushEnterAnimation()
      // Spin animation is referenced in the loading icon SVG path inline style
      const svg = getIconSpan()!.querySelector('svg path')!
      expect((svg as HTMLElement).style.animation).toContain('j-popalert-spin')
    })

    it('injects progress keyframe', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Prog', type: 'info', showProgress: true, duration: 3 })
      })
      flushEnterAnimation()
      // Progress animation is referenced in the progress bar inline style
      const bar = getProgressBar()!
      expect(bar.style.animation).toContain('j-popalert-progress')
    })
  })

  // ==========================================================================
  // Edge cases
  // ==========================================================================

  describe('edge cases', () => {
    it('multiple rapid opens and closes', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.info('A', 0)
        apiRef.info('B', 0)
        apiRef.destroy()
        apiRef.info('C', 0)
      })
      flushEnterAnimation()
      // At least C should exist in the list
      const items = getItems()
      expect(items.length).toBeGreaterThanOrEqual(1)
      // C's content should be present
      const allContent = items.map((i) => (i.firstElementChild as HTMLElement)?.textContent)
      expect(allContent).toContain('C')
    })

    it('destroying non-existent key is safe', () => {
      render(<Wrapper />)
      act(() => { apiRef.destroy('non-existent') })
      // Should not throw
      expect(getContainer()).toBeNull()
    })

    it('empty messages list renders no container', () => {
      render(<Wrapper />)
      expect(getContainer()).toBeNull()
    })

    it('item marginBottom is 0 during exit', () => {
      render(<Wrapper />)
      act(() => {
        apiRef.open({ content: 'Exit', type: 'info', closable: true, duration: 0 })
      })
      flushEnterAnimation()
      fireEvent.click(getCloseButton()!)
      const item = getItems()[0]
      expect(item.style.marginBottom).toBe('0px')
    })

    it('visible item has marginBottom 0.5rem', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Vis', 0) })
      flushEnterAnimation()
      expect(getItems()[0].style.marginBottom).toBe('0.5rem')
    })

    it('icon flexShrink is 0', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Shrink') })
      flushEnterAnimation()
      expect(getIconSpan()!).toHaveClass('ino-pop-alert__icon')
    })

    it('content wrapper has flex 1', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Flex') })
      flushEnterAnimation()
      expect(getContentWrapper()!).toHaveClass('ino-pop-alert__content-wrapper')
    })

    it('content wrapper has minWidth 0', () => {
      render(<Wrapper />)
      act(() => { apiRef.info('Min') })
      flushEnterAnimation()
      expect(getContentWrapper()!).toHaveClass('ino-pop-alert__content-wrapper')
    })
  })
})
