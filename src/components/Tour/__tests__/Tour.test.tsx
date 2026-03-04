import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, cleanup } from '@testing-library/react'
import { Tour } from '../Tour'
import type { TourStepConfig } from '../Tour'

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getPopup(): HTMLElement | null {
  return document.body.querySelector('[role="dialog"]')
}

/** The mask SVG contains a <defs> element — the close icon SVG does not. */
function getMask(): SVGElement | null {
  const svgs = document.body.querySelectorAll('svg')
  for (const svg of svgs) {
    if (svg.querySelector('defs')) return svg
  }
  return null
}

function getCloseButton(): HTMLElement | null {
  return document.body.querySelector('[aria-label="Close"]')
}

function getIndicators(): HTMLElement[] {
  const popup = getPopup()
  if (!popup) return []
  const footerEl = popup.children[popup.children.length - 1] as HTMLElement
  if (!footerEl) return []
  const indicatorContainer = footerEl.firstElementChild as HTMLElement
  if (!indicatorContainer) return []
  return Array.from(indicatorContainer.children) as HTMLElement[]
}

function getButtons(): HTMLElement[] {
  const popup = getPopup()
  if (!popup) return []
  return Array.from(popup.querySelectorAll('button')).filter(
    (b) => b.getAttribute('aria-label') !== 'Close',
  )
}

/**
 * Show the tour by advancing fake timers through:
 * 1) 50ms setTimeout (positioning delay)
 * 2) two rAFs (animation trigger → setIsAnimating(true))
 */
function showTour() {
  act(() => { vi.advanceTimersByTime(50) })
  act(() => { vi.advanceTimersByTime(0) }) // rAF 1
  act(() => { vi.advanceTimersByTime(0) }) // rAF 2
}

// ─── Mock getBoundingClientRect ──────────────────────────────────────────────

const mockRect: DOMRect = {
  top: 100,
  left: 200,
  bottom: 140,
  right: 300,
  width: 100,
  height: 40,
  x: 200,
  y: 100,
  toJSON() { return this },
}

// ─── Target management ──────────────────────────────────────────────────────────

const targets: HTMLElement[] = []

function makeTarget(): HTMLElement {
  const el = document.createElement('div')
  el.getBoundingClientRect = () => mockRect
  el.scrollIntoView = vi.fn()
  document.body.appendChild(el)
  targets.push(el)
  return el
}

function basicSteps(target?: HTMLElement): TourStepConfig[] {
  return [
    { target: target ?? null, title: 'Step 1', description: 'First step description' },
    { target: target ?? null, title: 'Step 2', description: 'Second step description' },
    { target: target ?? null, title: 'Step 3', description: 'Third step description' },
  ]
}

// ─── Setup / Teardown ───────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
})

afterEach(() => {
  // Clean up React first, then manual targets
  cleanup()
  targets.forEach((el) => { if (el.parentNode) el.parentNode.removeChild(el) })
  targets.length = 0
  vi.useRealTimers()
})

// ============================================================================
// Basic rendering
// ============================================================================

describe('Tour', () => {
  describe('basic rendering', () => {
    it('renders nothing when open is false', () => {
      render(<Tour steps={basicSteps()} open={false} />)
      expect(getPopup()).toBeNull()
    })

    it('renders nothing when open is undefined', () => {
      render(<Tour steps={basicSteps()} />)
      expect(getPopup()).toBeNull()
    })

    it('renders nothing when steps are empty', () => {
      render(<Tour steps={[]} open />)
      expect(getPopup()).toBeNull()
    })

    it('renders popup in document.body via portal', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()).toBeTruthy()
      expect(getPopup()!.closest('body')).toBe(document.body)
    })

    it('popup has role="dialog"', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()!.getAttribute('role')).toBe('dialog')
    })
  })

  // ============================================================================
  // Step content
  // ============================================================================

  describe('step content', () => {
    it('displays step title', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()!.textContent).toContain('Step 1')
    })

    it('displays step description', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()!.textContent).toContain('First step description')
    })

    it('renders ReactNode as title', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: <strong data-testid="t">Bold</strong>, description: 'Desc' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      expect(document.body.querySelector('[data-testid="t"]')).toBeTruthy()
    })

    it('renders ReactNode as description', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T', description: <em data-testid="d">Italic</em> },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      expect(document.body.querySelector('[data-testid="d"]')).toBeTruthy()
    })

    it('renders cover image', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T', cover: <img data-testid="cover" src="test.png" alt="c" /> },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      expect(document.body.querySelector('[data-testid="cover"]')).toBeTruthy()
    })

    it('title has correct font weight', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const popup = getPopup()!
      const titleEl = Array.from(popup.children).find(
        (el) => el.textContent === 'Step 1',
      ) as HTMLElement
      expect(titleEl.style.fontWeight).toBe('600')
    })

    it('description has correct font size', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const popup = getPopup()!
      const descEl = Array.from(popup.children).find(
        (el) => el.textContent === 'First step description',
      ) as HTMLElement
      expect(descEl.style.fontSize).toBe('0.8125rem')
    })
  })

  // ============================================================================
  // Navigation
  // ============================================================================

  describe('navigation', () => {
    it('first step shows "Next" button, no "Previous"', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const buttons = getButtons()
      const texts = buttons.map((b) => b.textContent)
      expect(texts).toContain('Next')
      expect(texts).not.toContain('Previous')
    })

    it('clicking "Next" advances to the next step', () => {
      const target = makeTarget()
      const onChange = vi.fn()
      render(<Tour steps={basicSteps(target)} open onChange={onChange} />)
      showTour()
      const nextBtn = getButtons().find((b) => b.textContent === 'Next')!
      fireEvent.click(nextBtn)
      act(() => { vi.advanceTimersByTime(150) })
      expect(onChange).toHaveBeenCalledWith(1)
    })

    it('middle step shows both "Previous" and "Next"', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open current={1} />)
      showTour()
      const texts = getButtons().map((b) => b.textContent)
      expect(texts).toContain('Previous')
      expect(texts).toContain('Next')
    })

    it('clicking "Previous" goes back', () => {
      const target = makeTarget()
      const onChange = vi.fn()
      render(<Tour steps={basicSteps(target)} open current={1} onChange={onChange} />)
      showTour()
      const prevBtn = getButtons().find((b) => b.textContent === 'Previous')!
      fireEvent.click(prevBtn)
      act(() => { vi.advanceTimersByTime(150) })
      expect(onChange).toHaveBeenCalledWith(0)
    })

    it('last step shows "Finish" instead of "Next"', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open current={2} />)
      showTour()
      const texts = getButtons().map((b) => b.textContent)
      expect(texts).toContain('Finish')
    })

    it('clicking "Finish" calls onFinish and onClose', () => {
      const target = makeTarget()
      const onFinish = vi.fn()
      const onClose = vi.fn()
      render(<Tour steps={basicSteps(target)} open current={2} onFinish={onFinish} onClose={onClose} />)
      showTour()
      const finishBtn = getButtons().find((b) => b.textContent === 'Finish')!
      fireEvent.click(finishBtn)
      expect(onFinish).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalledWith(2)
    })

    it('custom nextButtonProps.children', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T', nextButtonProps: { children: 'Go!' } },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      expect(getButtons().some((b) => b.textContent === 'Go!')).toBe(true)
    })

    it('custom prevButtonProps.children', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T1' },
        { target, title: 'T2', prevButtonProps: { children: 'Back' } },
      ]
      render(<Tour steps={steps} open current={1} />)
      showTour()
      expect(getButtons().some((b) => b.textContent === 'Back')).toBe(true)
    })

    it('nextButtonProps.onClick is called', () => {
      const target = makeTarget()
      const onClick = vi.fn()
      const steps: TourStepConfig[] = [
        { target, title: 'T', nextButtonProps: { onClick } },
        { target, title: 'T2' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      const nextBtn = getButtons().find((b) => b.textContent === 'Next')!
      fireEvent.click(nextBtn)
      expect(onClick).toHaveBeenCalled()
    })

    it('prevButtonProps.onClick overrides default behavior', () => {
      const target = makeTarget()
      const onClick = vi.fn()
      const onChange = vi.fn()
      const steps: TourStepConfig[] = [
        { target, title: 'T1' },
        { target, title: 'T2', prevButtonProps: { onClick } },
      ]
      render(<Tour steps={steps} open current={1} onChange={onChange} />)
      showTour()
      const prevBtn = getButtons().find((b) => b.textContent === 'Previous')!
      fireEvent.click(prevBtn)
      expect(onClick).toHaveBeenCalled()
      act(() => { vi.advanceTimersByTime(150) })
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  // ============================================================================
  // Close
  // ============================================================================

  describe('close', () => {
    it('renders close button by default', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getCloseButton()).toBeTruthy()
    })

    it('close button has aria-label="Close"', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getCloseButton()!.getAttribute('aria-label')).toBe('Close')
    })

    it('clicking close calls onClose with current step', () => {
      const target = makeTarget()
      const onClose = vi.fn()
      render(<Tour steps={basicSteps(target)} open current={1} onClose={onClose} />)
      showTour()
      fireEvent.click(getCloseButton()!)
      expect(onClose).toHaveBeenCalledWith(1)
    })

    it('closeIcon={false} hides close button', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open closeIcon={false} />)
      showTour()
      expect(getCloseButton()).toBeNull()
    })

    it('custom closeIcon renders', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open closeIcon={<span data-testid="custom-close">X</span>} />,
      )
      showTour()
      expect(document.body.querySelector('[data-testid="custom-close"]')).toBeTruthy()
    })
  })

  // ============================================================================
  // Controlled vs uncontrolled
  // ============================================================================

  describe('controlled vs uncontrolled', () => {
    it('uncontrolled: starts at step 0', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()!.textContent).toContain('Step 1')
    })

    it('uncontrolled: Next advances internal state', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const nextBtn = getButtons().find((b) => b.textContent === 'Next')!
      fireEvent.click(nextBtn)
      act(() => { vi.advanceTimersByTime(150) })
      showTour()
      expect(getPopup()!.textContent).toContain('Step 2')
    })

    it('controlled: current prop determines step', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open current={2} />)
      showTour()
      expect(getPopup()!.textContent).toContain('Step 3')
    })

    it('controlled: onChange fires but content depends on parent', () => {
      const target = makeTarget()
      const onChange = vi.fn()
      render(<Tour steps={basicSteps(target)} open current={0} onChange={onChange} />)
      showTour()
      const nextBtn = getButtons().find((b) => b.textContent === 'Next')!
      fireEvent.click(nextBtn)
      act(() => { vi.advanceTimersByTime(150) })
      expect(onChange).toHaveBeenCalledWith(1)
      showTour()
      expect(getPopup()!.textContent).toContain('Step 1')
    })
  })

  // ============================================================================
  // Type (default vs primary)
  // ============================================================================

  describe('type', () => {
    it('default type has border on popup', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open type="default" />)
      showTour()
      const popup = getPopup()!
      expect(popup.style.border).toContain('1px solid')
    })

    it('primary type has primary background', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open type="primary" />)
      showTour()
      const popup = getPopup()!
      expect(popup.style.backgroundColor).toBeTruthy()
      expect(popup.style.backgroundColor).not.toBe('')
    })

    it('primary type has white text color', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open type="primary" />)
      showTour()
      const popup = getPopup()!
      expect(popup.style.color).toBe('rgb(255, 255, 255)')
    })

    it('step-level type overrides global type', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'Primary Step', type: 'primary' },
      ]
      render(<Tour steps={steps} open type="default" />)
      showTour()
      const popup = getPopup()!
      expect(popup.style.color).toBe('rgb(255, 255, 255)')
    })

    it('primary type uses white Finish button', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'Only', type: 'primary' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      const finishBtn = getButtons().find((b) => b.textContent === 'Finish')!
      expect(finishBtn.style.background).toContain('rgb(255, 255, 255)')
    })
  })

  // ============================================================================
  // Mask
  // ============================================================================

  describe('mask', () => {
    it('mask is shown by default', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getMask()).toBeTruthy()
    })

    it('mask is hidden when mask={false}', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open mask={false} />)
      showTour()
      expect(getMask()).toBeNull()
    })

    it('mask SVG has fixed positioning', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const svg = getMask()!
      expect(svg.style.position).toBe('fixed')
    })

    it('mask has default color rgba(0,0,0,0.45)', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const svg = getMask()!
      const rects = svg.querySelectorAll(':scope > rect')
      const mainRect = rects[0]
      expect(mainRect.getAttribute('fill')).toBe('rgba(0,0,0,0.45)')
    })

    it('custom mask color', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open mask={{ color: 'rgba(0,0,255,0.5)' }} />)
      showTour()
      const svg = getMask()!
      const rects = svg.querySelectorAll(':scope > rect')
      const mainRect = rects[0]
      expect(mainRect.getAttribute('fill')).toBe('rgba(0,0,255,0.5)')
    })

    it('spotlight cutout exists when target is provided', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const svg = getMask()!
      const maskEl = svg.querySelector('mask')
      expect(maskEl).toBeTruthy()
      const maskRects = maskEl!.querySelectorAll('rect')
      expect(maskRects.length).toBe(2)
    })

    it('step-level mask overrides global mask', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T', mask: false },
      ]
      render(<Tour steps={steps} open mask={true} />)
      showTour()
      expect(getMask()).toBeNull()
    })
  })

  // ============================================================================
  // Arrow
  // ============================================================================

  describe('arrow', () => {
    it('arrow is shown by default when target exists', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const container = getPopup()!.parentElement!
      const arrowEl = container.children[container.children.length - 1] as HTMLElement
      expect(arrowEl.style.width).toBe('0.5rem')
      expect(arrowEl.style.height).toBe('0.5rem')
    })

    it('arrow is hidden when arrow={false}', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open arrow={false} />)
      showTour()
      const container = getPopup()!.parentElement!
      expect(container.children.length).toBe(1)
    })

    it('no arrow when placement is center (no target)', () => {
      const steps: TourStepConfig[] = [
        { target: null, title: 'Center', placement: 'center' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      const container = getPopup()!.parentElement!
      expect(container.children.length).toBe(1)
    })

    it('step-level arrow={false} overrides global arrow', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T', arrow: false },
      ]
      render(<Tour steps={steps} open arrow={true} />)
      showTour()
      const container = getPopup()!.parentElement!
      expect(container.children.length).toBe(1)
    })
  })

  // ============================================================================
  // Placement center (no target)
  // ============================================================================

  describe('center placement (no target)', () => {
    it('centers popup when target is null', () => {
      const steps: TourStepConfig[] = [
        { target: null, title: 'Centered' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      expect(getPopup()).toBeTruthy()
      expect(getPopup()!.textContent).toContain('Centered')
    })

    it('no mask spotlight when there is no target', () => {
      const steps: TourStepConfig[] = [
        { target: null, title: 'No target' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      const svg = getMask()!
      const maskEl = svg.querySelector('mask')!
      expect(maskEl.querySelectorAll('rect').length).toBe(1)
    })

    it('function target returning null uses center', () => {
      const steps: TourStepConfig[] = [
        { target: () => null, title: 'Null fn' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      expect(getPopup()!.textContent).toContain('Null fn')
    })
  })

  // ============================================================================
  // Function target
  // ============================================================================

  describe('function target', () => {
    it('resolves target from function', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target: () => target, title: 'Fn target' },
      ]
      render(<Tour steps={steps} open />)
      showTour()
      expect(getPopup()!.textContent).toContain('Fn target')
    })
  })

  // ============================================================================
  // Scroll into view
  // ============================================================================

  describe('scrollIntoView', () => {
    it('scrolls target into view by default', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(target.scrollIntoView).toHaveBeenCalled()
    })

    it('does not scroll when scrollIntoViewOptions={false}', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open scrollIntoViewOptions={false} />)
      showTour()
      expect(target.scrollIntoView).not.toHaveBeenCalled()
    })
  })

  // ============================================================================
  // Indicators
  // ============================================================================

  describe('indicators', () => {
    it('renders indicator dots matching step count', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const indicators = getIndicators()
      expect(indicators.length).toBe(3)
    })

    it('current step indicator is different from non-current', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open current={0} />)
      showTour()
      const indicators = getIndicators()
      expect(indicators[0].style.backgroundColor).not.toBe(indicators[1].style.backgroundColor)
    })

    it('custom indicatorsRender', () => {
      const target = makeTarget()
      const customRender = (current: number, total: number) => (
        <span data-testid="custom-ind">{current + 1}/{total}</span>
      )
      render(<Tour steps={basicSteps(target)} open indicatorsRender={customRender} />)
      showTour()
      expect(document.body.querySelector('[data-testid="custom-ind"]')!.textContent).toBe('1/3')
    })
  })

  // ============================================================================
  // Custom actions
  // ============================================================================

  describe('actionsRender', () => {
    it('renders custom actions', () => {
      const target = makeTarget()
      const customActions = (
        _actions: React.ReactNode[],
        info: { current: number; total: number },
      ) => (
        <span data-testid="custom-actions">{info.current + 1} of {info.total}</span>
      )
      render(<Tour steps={basicSteps(target)} open actionsRender={customActions} />)
      showTour()
      const el = document.body.querySelector('[data-testid="custom-actions"]')!
      expect(el.textContent).toBe('1 of 3')
    })

    it('actionsRender receives goTo function', () => {
      const target = makeTarget()
      const onChange = vi.fn()
      const customActions = (
        _actions: React.ReactNode[],
        info: { goTo: (step: number) => void },
      ) => (
        <button data-testid="jump" onClick={() => info.goTo(2)}>Jump</button>
      )
      render(<Tour steps={basicSteps(target)} open onChange={onChange} actionsRender={customActions} />)
      showTour()
      fireEvent.click(document.body.querySelector('[data-testid="jump"]')!)
      act(() => { vi.advanceTimersByTime(150) })
      expect(onChange).toHaveBeenCalledWith(2)
    })

    it('actionsRender receives close function', () => {
      const target = makeTarget()
      const onClose = vi.fn()
      const customActions = (
        _actions: React.ReactNode[],
        info: { close: () => void },
      ) => (
        <button data-testid="close-custom" onClick={info.close}>X</button>
      )
      render(<Tour steps={basicSteps(target)} open onClose={onClose} actionsRender={customActions} />)
      showTour()
      fireEvent.click(document.body.querySelector('[data-testid="close-custom"]')!)
      expect(onClose).toHaveBeenCalledWith(0)
    })
  })

  // ============================================================================
  // Disabled interaction
  // ============================================================================

  describe('disabledInteraction', () => {
    it('renders interaction blocker when enabled', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open disabledInteraction />)
      showTour()
      const blockers = Array.from(document.body.querySelectorAll('div')).filter(
        (d) => d.style.cursor === 'not-allowed',
      )
      expect(blockers.length).toBeGreaterThan(0)
    })

    it('no interaction blocker by default', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const blockers = Array.from(document.body.querySelectorAll('div')).filter(
        (d) => d.style.cursor === 'not-allowed',
      )
      expect(blockers.length).toBe(0)
    })
  })

  // ============================================================================
  // Gap
  // ============================================================================

  describe('gap', () => {
    it('spotlight radius uses custom gap.radius', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open gap={{ radius: 10 }} />)
      showTour()
      const svg = getMask()!
      const maskEl = svg.querySelector('mask')!
      const spotlightRect = maskEl.querySelectorAll('rect')[1]
      expect(spotlightRect.getAttribute('rx')).toBe('10')
      expect(spotlightRect.getAttribute('ry')).toBe('10')
    })

    it('default gap radius is 2', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const svg = getMask()!
      const maskEl = svg.querySelector('mask')!
      const spotlightRect = maskEl.querySelectorAll('rect')[1]
      expect(spotlightRect.getAttribute('rx')).toBe('2')
    })
  })

  // ============================================================================
  // zIndex
  // ============================================================================

  describe('zIndex', () => {
    it('default zIndex is 1001 for mask', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const svg = getMask()!
      expect(svg.style.zIndex).toBe('1001')
    })

    it('popup zIndex is zIndex + 1', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open zIndex={2000} />)
      showTour()
      const popupContainer = getPopup()!.parentElement!
      expect(popupContainer.style.zIndex).toBe('2001')
    })

    it('custom zIndex applies to mask', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open zIndex={5000} />)
      showTour()
      const svg = getMask()!
      expect(svg.style.zIndex).toBe('5000')
    })
  })

  // ============================================================================
  // Popup styling
  // ============================================================================

  describe('popup styling', () => {
    it('popup has border-radius', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()!.style.borderRadius).toBe('0.5rem')
    })

    it('popup has min-width', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()!.style.minWidth).toBe('16rem')
    })

    it('popup has max-width', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      expect(getPopup()!.style.maxWidth).toBe('22rem')
    })

    it('popup container has fixed position', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const container = getPopup()!.parentElement!
      expect(container.style.position).toBe('fixed')
    })

    it('popup container starts with opacity 0 before animation', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      // Before showTour(), isAnimating is false → opacity 0
      const container = getPopup()!.parentElement!
      expect(container.style.opacity).toBe('0')
      expect(container.style.pointerEvents).toBe('none')
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('classNames.popup applies to dialog', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ popup: 'my-popup' }} />,
      )
      showTour()
      expect(getPopup()!.className).toContain('my-popup')
    })

    it('classNames.mask applies to SVG', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ mask: 'my-mask' }} />,
      )
      showTour()
      expect(getMask()!.getAttribute('class')).toContain('my-mask')
    })

    it('classNames.close applies to close button', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ close: 'my-close' }} />,
      )
      showTour()
      expect(getCloseButton()!.className).toContain('my-close')
    })

    it('classNames.title applies to title', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ title: 'my-title' }} />,
      )
      showTour()
      const titleEl = Array.from(getPopup()!.children).find(
        (el) => el.textContent === 'Step 1',
      ) as HTMLElement
      expect(titleEl.className).toContain('my-title')
    })

    it('classNames.description applies to description', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ description: 'my-desc' }} />,
      )
      showTour()
      const descEl = Array.from(getPopup()!.children).find(
        (el) => el.textContent === 'First step description',
      ) as HTMLElement
      expect(descEl.className).toContain('my-desc')
    })

    it('classNames.footer applies to footer', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ footer: 'my-footer' }} />,
      )
      showTour()
      const popup = getPopup()!
      const footerEl = popup.children[popup.children.length - 1] as HTMLElement
      expect(footerEl.className).toContain('my-footer')
    })

    it('classNames.arrow applies to arrow', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ arrow: 'my-arrow' }} />,
      )
      showTour()
      const container = getPopup()!.parentElement!
      const arrowEl = container.children[container.children.length - 1] as HTMLElement
      expect(arrowEl.className).toContain('my-arrow')
    })

    it('classNames.cover applies to cover wrapper', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T', cover: <img src="x.png" alt="x" /> },
      ]
      render(
        <Tour steps={steps} open classNames={{ cover: 'my-cover' }} />,
      )
      showTour()
      const coverEl = Array.from(getPopup()!.children).find(
        (el) => el.querySelector('img'),
      ) as HTMLElement
      expect(coverEl.className).toContain('my-cover')
    })

    it('classNames.indicators applies to indicator container', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open classNames={{ indicators: 'my-ind' }} />,
      )
      showTour()
      const indicators = getIndicators()
      expect(indicators.length).toBeGreaterThan(0)
      const container = indicators[0].parentElement!
      expect(container.className).toContain('my-ind')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('styles.popup merges into popup', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ popup: { fontSize: '20px' } }} />,
      )
      showTour()
      expect(getPopup()!.style.fontSize).toBe('20px')
    })

    it('styles.mask merges into SVG mask', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ mask: { opacity: '0.8' } }} />,
      )
      showTour()
      expect(getMask()!.style.opacity).toBeTruthy()
    })

    it('styles.close merges into close button', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ close: { color: 'red' } }} />,
      )
      showTour()
      expect(getCloseButton()!.style.color).toBe('red')
    })

    it('styles.title merges into title', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ title: { color: 'blue' } }} />,
      )
      showTour()
      const titleEl = Array.from(getPopup()!.children).find(
        (el) => el.textContent === 'Step 1',
      ) as HTMLElement
      expect(titleEl.style.color).toBe('blue')
    })

    it('styles.description merges into description', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ description: { letterSpacing: '2px' } }} />,
      )
      showTour()
      const descEl = Array.from(getPopup()!.children).find(
        (el) => el.textContent === 'First step description',
      ) as HTMLElement
      expect(descEl.style.letterSpacing).toBe('2px')
    })

    it('styles.footer merges into footer', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ footer: { padding: '10px' } }} />,
      )
      showTour()
      const popup = getPopup()!
      const footerEl = popup.children[popup.children.length - 1] as HTMLElement
      expect(footerEl.style.padding).toBe('10px')
    })

    it('styles.arrow merges into arrow', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ arrow: { backgroundColor: 'red' } }} />,
      )
      showTour()
      const container = getPopup()!.parentElement!
      const arrowEl = container.children[container.children.length - 1] as HTMLElement
      expect(arrowEl.style.backgroundColor).toBe('red')
    })

    it('styles.cover merges into cover wrapper', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [
        { target, title: 'T', cover: <img src="x.png" alt="x" /> },
      ]
      render(
        <Tour steps={steps} open styles={{ cover: { borderRadius: '1rem' } }} />,
      )
      showTour()
      const coverEl = Array.from(getPopup()!.children).find(
        (el) => el.querySelector('img'),
      ) as HTMLElement
      expect(coverEl.style.borderRadius).toBe('1rem')
    })

    it('styles.indicators merges into indicator container', () => {
      const target = makeTarget()
      render(
        <Tour steps={basicSteps(target)} open styles={{ indicators: { gap: '1rem' } }} />,
      )
      showTour()
      const indicators = getIndicators()
      expect(indicators.length).toBeGreaterThan(0)
      const container = indicators[0].parentElement!
      expect(container.style.gap).toBe('1rem')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('single step shows Finish, no Previous', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [{ target, title: 'Only step' }]
      render(<Tour steps={steps} open />)
      showTour()
      const texts = getButtons().map((b) => b.textContent)
      expect(texts).toContain('Finish')
      expect(texts).not.toContain('Previous')
    })

    it('step without title renders no title element', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [{ target, description: 'Only desc' }]
      render(<Tour steps={steps} open />)
      showTour()
      expect(getPopup()!.textContent).toContain('Only desc')
    })

    it('step without description renders no description element', () => {
      const target = makeTarget()
      const steps: TourStepConfig[] = [{ target, title: 'Only title' }]
      render(<Tour steps={steps} open />)
      showTour()
      expect(getPopup()!.textContent).toContain('Only title')
      expect(getPopup()!.textContent).not.toContain('description')
    })

    it('title margin-right is larger when close icon is visible', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open />)
      showTour()
      const titleEl = Array.from(getPopup()!.children).find(
        (el) => el.textContent === 'Step 1',
      ) as HTMLElement
      expect(titleEl.style.marginRight).toBe('1.5rem')
    })

    it('title margin-right is 0 when closeIcon={false}', () => {
      const target = makeTarget()
      render(<Tour steps={basicSteps(target)} open closeIcon={false} />)
      showTour()
      const titleEl = Array.from(getPopup()!.children).find(
        (el) => el.textContent === 'Step 1',
      ) as HTMLElement
      expect(titleEl.style.marginRight).toBe('0px')
    })
  })
})
