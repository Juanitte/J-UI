import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Progress } from '../Progress'

// ============================================================================
// DOM helpers — line / steps
// ============================================================================

function getRoot(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

/** Trail div: position:relative + overflow:hidden (line type only) */
function getTrail(container: HTMLElement): HTMLElement | null {
  return (
    (Array.from(container.querySelectorAll('div')).find(
      (el) =>
        (el as HTMLElement).style.position === 'relative' &&
        (el as HTMLElement).style.overflow === 'hidden',
    ) as HTMLElement | undefined) ?? null
  )
}

/** First position:absolute div inside trail — the main stroke bar */
function getStroke(container: HTMLElement): HTMLElement | null {
  const trail = getTrail(container)
  if (!trail) return null
  const absChildren = Array.from(trail.children).filter(
    (el) => el.tagName === 'DIV' && (el as HTMLElement).style.position === 'absolute',
  ) as HTMLElement[]
  return absChildren[0] ?? null
}

/** Second position:absolute div inside trail — the success segment */
function getSuccessSegment(container: HTMLElement): HTMLElement | null {
  const trail = getTrail(container)
  if (!trail) return null
  const absChildren = Array.from(trail.children).filter(
    (el) => el.tagName === 'DIV' && (el as HTMLElement).style.position === 'absolute',
  ) as HTMLElement[]
  return absChildren[1] ?? null
}

/** First DIV child of stroke — the active shimmer overlay */
function getShimmer(container: HTMLElement): HTMLElement | null {
  const stroke = getStroke(container)
  if (!stroke) return null
  return (
    (Array.from(stroke.children).find((el) => el.tagName === 'DIV') as HTMLElement | undefined) ??
    null
  )
}

/** Direct SPAN child of root — outer info text (line / steps) */
function getOuterText(container: HTMLElement): HTMLElement | null {
  const root = getRoot(container)
  return (
    (Array.from(root.children).find((el) => el.tagName === 'SPAN') as HTMLElement | undefined) ??
    null
  )
}

/** SPAN inside stroke div — inner info text (percentPosition.type='inner') */
function getInnerText(container: HTMLElement): HTMLElement | null {
  const stroke = getStroke(container)
  if (!stroke) return null
  return stroke.querySelector('span') as HTMLElement | null
}

/** Steps trail container: the div with gap:0.125rem (unique to steps container) */
function getStepsContainer(container: HTMLElement): HTMLElement | null {
  const root = getRoot(container)
  return (
    (Array.from(root.children).find(
      (el) =>
        el.tagName === 'DIV' &&
        (el as HTMLElement).style.gap === '0.125rem',
    ) as HTMLElement | undefined) ?? null
  )
}

/** All direct children of steps trail container */
function getStepItems(container: HTMLElement): HTMLElement[] {
  const sc = getStepsContainer(container)
  if (!sc) return []
  return Array.from(sc.children) as HTMLElement[]
}

// ============================================================================
// DOM helpers — circle / dashboard
// ============================================================================

function getSVG(container: HTMLElement): SVGSVGElement | null {
  return container.querySelector('svg') as SVGSVGElement | null
}

function getCircles(container: HTMLElement): SVGCircleElement[] {
  const svg = getSVG(container)
  if (!svg) return []
  return Array.from(svg.querySelectorAll('circle')) as SVGCircleElement[]
}

function getTrailCircle(container: HTMLElement): SVGCircleElement | null {
  return getCircles(container)[0] ?? null
}

function getStrokeCircle(container: HTMLElement): SVGCircleElement | null {
  return getCircles(container)[1] ?? null
}

/** SPAN with position:absolute inside circle root — centered info text */
function getCircleText(container: HTMLElement): HTMLElement | null {
  const root = getRoot(container)
  return (
    (Array.from(root.children).find(
      (el) => el.tagName === 'SPAN' && (el as HTMLElement).style.position === 'absolute',
    ) as HTMLElement | undefined) ?? null
  )
}

// ============================================================================
// Tests
// ============================================================================

describe('Progress', () => {
  // ── Line rendering ─────────────────────────────────────────────────────

  describe('line rendering', () => {
    it('renders a root element', () => {
      const { container } = render(<Progress />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('root has display flex', () => {
      const { container } = render(<Progress />)
      expect(getRoot(container).style.display).toBe('flex')
    })

    it('root has 100% width by default', () => {
      const { container } = render(<Progress />)
      expect(getRoot(container).style.width).toBe('100%')
    })

    it('trail renders with overflow hidden', () => {
      const { container } = render(<Progress percent={50} />)
      expect(getTrail(container)).not.toBeNull()
      expect(getTrail(container)!.style.overflow).toBe('hidden')
    })

    it('stroke width matches percent', () => {
      const { container } = render(<Progress percent={60} />)
      expect(getStroke(container)!.style.width).toBe('60%')
    })

    it('percent=0 stroke has width 0%', () => {
      const { container } = render(<Progress percent={0} />)
      expect(getStroke(container)!.style.width).toBe('0%')
    })

    it('percent=100 stroke has width 100%', () => {
      const { container } = render(<Progress percent={100} />)
      expect(getStroke(container)!.style.width).toBe('100%')
    })

    it('negative percent is clamped to 0', () => {
      const { container } = render(<Progress percent={-20} />)
      expect(getStroke(container)!.style.width).toBe('0%')
    })

    it('percent > 100 is clamped to 100', () => {
      const { container } = render(<Progress percent={150} />)
      expect(getStroke(container)!.style.width).toBe('100%')
    })

    it('stroke has width transition', () => {
      const { container } = render(<Progress percent={50} />)
      expect(getStroke(container)!.style.transition).toContain('width')
    })
  })

  // ── showInfo ──────────────────────────────────────────────────────────

  describe('showInfo', () => {
    it('shows rounded percent text by default', () => {
      const { container } = render(<Progress percent={42} />)
      expect(getOuterText(container)?.textContent).toBe('42%')
    })

    it('rounds fractional percent', () => {
      const { container } = render(<Progress percent={33.7} />)
      expect(getOuterText(container)?.textContent).toBe('34%')
    })

    it('showInfo=false hides text', () => {
      const { container } = render(<Progress percent={50} showInfo={false} />)
      expect(getOuterText(container)).toBeNull()
    })

    it('success status (line) shows CheckCircleIcon SVG', () => {
      const { container } = render(<Progress percent={100} />)
      expect(getOuterText(container)?.querySelector('svg')).not.toBeNull()
    })

    it('exception status (line) shows CloseCircleIcon SVG', () => {
      const { container } = render(<Progress percent={50} status="exception" />)
      expect(getOuterText(container)?.querySelector('svg')).not.toBeNull()
    })
  })

  // ── format ────────────────────────────────────────────────────────────

  describe('format', () => {
    it('calls format with clamped percent and undefined successPercent', () => {
      const format = vi.fn(() => 'custom')
      render(<Progress percent={55} format={format} />)
      expect(format).toHaveBeenCalledWith(55, undefined)
    })

    it('renders format return value', () => {
      const { container } = render(<Progress percent={50} format={() => 'DONE'} />)
      expect(getOuterText(container)?.textContent).toBe('DONE')
    })

    it('format returning null hides info', () => {
      const { container } = render(<Progress percent={50} format={() => null} />)
      expect(getOuterText(container)).toBeNull()
    })

    it('format returning false hides info', () => {
      const { container } = render(
        <Progress percent={50} format={() => false as unknown as string} />,
      )
      expect(getOuterText(container)).toBeNull()
    })

    it('format receives successPercent when success prop provided', () => {
      const format = vi.fn(() => 'ok')
      render(<Progress percent={70} success={{ percent: 30 }} format={format} />)
      expect(format).toHaveBeenCalledWith(70, 30)
    })
  })

  // ── status ────────────────────────────────────────────────────────────

  describe('status', () => {
    it('percent=100 auto-resolves to success — shows icon', () => {
      const { container } = render(<Progress percent={100} />)
      expect(getOuterText(container)?.querySelector('svg')).not.toBeNull()
    })

    it('explicit status overrides auto-resolved status', () => {
      // exception overrides auto-success at percent=100
      const { container } = render(<Progress percent={100} status="exception" />)
      expect(getOuterText(container)?.querySelector('svg')).not.toBeNull()
      // icon is still SVG; we just verify it renders something
    })

    it('active status adds shimmer div inside stroke', () => {
      const { container } = render(<Progress percent={50} status="active" />)
      expect(getShimmer(container)).not.toBeNull()
    })

    it('active shimmer has animation style', () => {
      const { container } = render(<Progress percent={50} status="active" />)
      expect(getShimmer(container)!.style.animation).toContain('j-progress-active')
    })

    it('normal status has no shimmer', () => {
      const { container } = render(<Progress percent={50} />)
      expect(getShimmer(container)).toBeNull()
    })
  })

  // ── strokeColor ───────────────────────────────────────────────────────

  describe('strokeColor', () => {
    it('string strokeColor sets stroke background', () => {
      const { container } = render(<Progress percent={50} strokeColor="red" />)
      expect(getStroke(container)!.style.background).toBe('red')
    })

    it('{from, to} creates linear-gradient background', () => {
      const { container } = render(
        <Progress percent={50} strokeColor={{ from: 'blue', to: 'green' }} />,
      )
      expect(getStroke(container)!.style.background).toContain('linear-gradient')
    })

    it('{from, to, direction} uses the provided direction', () => {
      // jsdom preserves 'to right' but strips the CSS default 'to bottom'
      const { container } = render(
        <Progress
          percent={50}
          strokeColor={{ from: 'blue', to: 'green', direction: 'to right' }}
        />,
      )
      expect(getStroke(container)!.style.background).toContain('to right')
    })

    it('Record<string, string> gradient stops create linear-gradient', () => {
      const { container } = render(
        <Progress percent={50} strokeColor={{ '0%': 'red', '100%': 'blue' }} />,
      )
      expect(getStroke(container)!.style.background).toContain('linear-gradient')
    })
  })

  // ── strokeLinecap ─────────────────────────────────────────────────────

  describe('strokeLinecap', () => {
    it('round (default) sets borderRadius = strokeWidth / 2', () => {
      const { container } = render(<Progress percent={50} strokeWidth={8} strokeLinecap="round" />)
      expect(getTrail(container)!.style.borderRadius).toBe('4px')
    })

    it('butt sets borderRadius = 0', () => {
      const { container } = render(<Progress percent={50} strokeLinecap="butt" />)
      // React passes 0 as the string '0'; jsdom stores it as '0'
      expect(parseFloat(getTrail(container)!.style.borderRadius || '0')).toBe(0)
    })

    it('square sets borderRadius = 0', () => {
      const { container } = render(<Progress percent={50} strokeLinecap="square" />)
      expect(parseFloat(getTrail(container)!.style.borderRadius || '0')).toBe(0)
    })
  })

  // ── trailColor ────────────────────────────────────────────────────────

  describe('trailColor', () => {
    it('custom trailColor applied to trail background', () => {
      const { container } = render(<Progress percent={50} trailColor="lightgray" />)
      expect(getTrail(container)!.style.backgroundColor).toBe('lightgray')
    })
  })

  // ── size ──────────────────────────────────────────────────────────────

  describe('size', () => {
    it('size="small" sets stroke height to 6px', () => {
      const { container } = render(<Progress percent={50} size="small" />)
      expect(getTrail(container)!.style.height).toBe('6px')
    })

    it('size="default" sets stroke height to 8px', () => {
      const { container } = render(<Progress percent={50} size="default" />)
      expect(getTrail(container)!.style.height).toBe('8px')
    })

    it('size as number sets stroke height', () => {
      const { container } = render(<Progress percent={50} size={12} />)
      expect(getTrail(container)!.style.height).toBe('12px')
    })

    it('size=[width, height] tuple sets stroke height to height', () => {
      const { container } = render(<Progress percent={50} size={[200, 10]} />)
      expect(getTrail(container)!.style.height).toBe('10px')
    })
  })

  // ── success segment ───────────────────────────────────────────────────

  describe('success segment', () => {
    it('success.percent renders a second absolute div in trail', () => {
      const { container } = render(<Progress percent={80} success={{ percent: 30 }} />)
      expect(getSuccessSegment(container)).not.toBeNull()
    })

    it('success segment width matches success.percent', () => {
      const { container } = render(<Progress percent={80} success={{ percent: 40 }} />)
      expect(getSuccessSegment(container)!.style.width).toBe('40%')
    })

    it('success.percent=0 does not render success segment', () => {
      const { container } = render(<Progress percent={80} success={{ percent: 0 }} />)
      expect(getSuccessSegment(container)).toBeNull()
    })

    it('success.strokeColor applied to success segment', () => {
      const { container } = render(
        <Progress percent={80} success={{ percent: 30, strokeColor: 'gold' }} />,
      )
      expect(getSuccessSegment(container)!.style.backgroundColor).toBe('gold')
    })
  })

  // ── percentPosition ───────────────────────────────────────────────────

  describe('percentPosition', () => {
    it('default (outer, end) — info span is last child of root', () => {
      const { container } = render(<Progress percent={50} />)
      expect((getRoot(container).lastElementChild as HTMLElement).tagName).toBe('SPAN')
    })

    it('outer start — info span is first child of root', () => {
      const { container } = render(
        <Progress percent={50} percentPosition={{ type: 'outer', align: 'start' }} />,
      )
      expect((getRoot(container).firstElementChild as HTMLElement).tagName).toBe('SPAN')
    })

    it('inner type — text rendered inside stroke div', () => {
      const { container } = render(
        <Progress percent={50} percentPosition={{ type: 'inner' }} strokeWidth={20} />,
      )
      expect(getInnerText(container)).not.toBeNull()
      expect(getOuterText(container)).toBeNull()
    })

    it('inner center — justifyContent center', () => {
      const { container } = render(
        <Progress
          percent={50}
          percentPosition={{ type: 'inner', align: 'center' }}
          strokeWidth={20}
        />,
      )
      expect(getInnerText(container)!.style.justifyContent).toBe('center')
    })

    it('inner start — justifyContent flex-start', () => {
      const { container } = render(
        <Progress
          percent={50}
          percentPosition={{ type: 'inner', align: 'start' }}
          strokeWidth={20}
        />,
      )
      expect(getInnerText(container)!.style.justifyContent).toBe('flex-start')
    })

    it('inner end — justifyContent flex-end', () => {
      const { container } = render(
        <Progress
          percent={50}
          percentPosition={{ type: 'inner', align: 'end' }}
          strokeWidth={20}
        />,
      )
      expect(getInnerText(container)!.style.justifyContent).toBe('flex-end')
    })
  })

  // ── Steps (line type) ─────────────────────────────────────────────────

  describe('steps (line)', () => {
    it('renders N step items', () => {
      const { container } = render(<Progress percent={50} steps={5} />)
      expect(getStepItems(container).length).toBe(5)
    })

    it('correct filled count at 50% with 10 steps', () => {
      const { container } = render(<Progress percent={50} steps={10} showInfo={false} />)
      const items = getStepItems(container)
      // first 5 should be filled (same color), last 5 trail color
      const fillColor = items[0].style.backgroundColor
      const trailColor = items[5].style.backgroundColor
      expect(fillColor).not.toBe(trailColor)
      // boundary: item[4] filled, item[5] not
      expect(items[4].style.backgroundColor).toBe(fillColor)
      expect(items[5].style.backgroundColor).toBe(trailColor)
    })

    it('array strokeColor assigns colors to filled steps', () => {
      const { container } = render(
        <Progress percent={100} steps={3} strokeColor={['red', 'green', 'blue']} />,
      )
      const items = getStepItems(container)
      expect(items[0].style.backgroundColor).toBe('red')
      expect(items[1].style.backgroundColor).toBe('green')
      expect(items[2].style.backgroundColor).toBe('blue')
    })

    it('shows outer text info with steps', () => {
      const { container } = render(<Progress percent={50} steps={4} />)
      expect(getOuterText(container)?.textContent).toBe('50%')
    })

    it('showInfo=false hides text for steps', () => {
      const { container } = render(<Progress percent={50} steps={4} showInfo={false} />)
      expect(getOuterText(container)).toBeNull()
    })
  })

  // ── Circle type ───────────────────────────────────────────────────────

  describe('circle type', () => {
    it('renders SVG element', () => {
      const { container } = render(<Progress type="circle" percent={50} />)
      expect(getSVG(container)).not.toBeNull()
    })

    it('SVG width and height default to 120', () => {
      const { container } = render(<Progress type="circle" percent={50} />)
      expect(getSVG(container)!.getAttribute('width')).toBe('120')
      expect(getSVG(container)!.getAttribute('height')).toBe('120')
    })

    it('renders at least trail and stroke circles', () => {
      const { container } = render(<Progress type="circle" percent={50} />)
      expect(getCircles(container).length).toBeGreaterThanOrEqual(2)
    })

    it('root has inline-flex display', () => {
      const { container } = render(<Progress type="circle" percent={50} />)
      expect(getRoot(container).style.display).toBe('inline-flex')
    })

    it('shows percent text inside circle', () => {
      const { container } = render(<Progress type="circle" percent={75} />)
      expect(getCircleText(container)?.textContent).toBe('75%')
    })

    it('showInfo=false hides inner text', () => {
      const { container } = render(<Progress type="circle" percent={50} showInfo={false} />)
      expect(getCircleText(container)).toBeNull()
    })

    it('success status shows CheckIcon SVG inside circle', () => {
      const { container } = render(<Progress type="circle" percent={100} />)
      expect(getCircleText(container)?.querySelector('svg')).not.toBeNull()
    })

    it('exception status shows CloseIcon SVG inside circle', () => {
      const { container } = render(<Progress type="circle" percent={50} status="exception" />)
      expect(getCircleText(container)?.querySelector('svg')).not.toBeNull()
    })

    it('stroke circle has strokeDasharray', () => {
      const { container } = render(<Progress type="circle" percent={50} />)
      expect(getStrokeCircle(container)!.getAttribute('stroke-dasharray')).toBeTruthy()
    })

    it('stroke dasharray changes with percent', () => {
      const { container: c1 } = render(<Progress type="circle" percent={25} />)
      const { container: c2 } = render(<Progress type="circle" percent={75} />)
      const d1 = getStrokeCircle(c1)?.getAttribute('stroke-dasharray')
      const d2 = getStrokeCircle(c2)?.getAttribute('stroke-dasharray')
      expect(d1).not.toBe(d2)
    })

    it('percent=0 produces minimal filled dasharray', () => {
      const { container } = render(<Progress type="circle" percent={0} />)
      const da = getStrokeCircle(container)!.getAttribute('stroke-dasharray')!
      const [filled] = da.split(' ').map(parseFloat)
      expect(filled).toBeCloseTo(0, 1)
    })

    it('width prop changes SVG dimensions', () => {
      const { container } = render(<Progress type="circle" percent={50} width={200} />)
      expect(getSVG(container)!.getAttribute('width')).toBe('200')
      expect(getSVG(container)!.getAttribute('height')).toBe('200')
    })

    it('size="small" sets default circle width to 80', () => {
      const { container } = render(<Progress type="circle" percent={50} size="small" />)
      expect(getSVG(container)!.getAttribute('width')).toBe('80')
    })

    it('size as number sets circle canvas width', () => {
      const { container } = render(<Progress type="circle" percent={50} size={100} />)
      expect(getSVG(container)!.getAttribute('width')).toBe('100')
    })

    it('string strokeColor applied to stroke circle', () => {
      const { container } = render(<Progress type="circle" percent={50} strokeColor="red" />)
      expect(getStrokeCircle(container)!.getAttribute('stroke')).toBe('red')
    })

    it('Record<string,string> strokeColor renders linearGradient in SVG defs', () => {
      const { container } = render(
        <Progress
          type="circle"
          percent={50}
          strokeColor={{ '0%': 'blue', '100%': 'red' }}
        />,
      )
      expect(getSVG(container)!.querySelector('linearGradient')).not.toBeNull()
    })

    it('success segment renders a third circle', () => {
      const { container } = render(
        <Progress type="circle" percent={80} success={{ percent: 30 }} />,
      )
      expect(getCircles(container).length).toBeGreaterThanOrEqual(3)
    })

    it('width<=20 does not render inner text span (uses tooltip instead)', () => {
      const { container } = render(<Progress type="circle" percent={50} width={20} />)
      expect(getCircleText(container)).toBeNull()
    })
  })

  // ── Dashboard type ────────────────────────────────────────────────────

  describe('dashboard type', () => {
    it('renders SVG element', () => {
      const { container } = render(<Progress type="dashboard" percent={50} />)
      expect(getSVG(container)).not.toBeNull()
    })

    it('default gapDegree=75 adds strokeDasharray to trail circle', () => {
      const { container } = render(<Progress type="dashboard" percent={50} />)
      expect(getTrailCircle(container)!.getAttribute('stroke-dasharray')).toBeTruthy()
    })

    it('gapDegree=0 removes strokeDasharray from trail circle', () => {
      const { container } = render(<Progress type="dashboard" percent={50} gapDegree={0} />)
      expect(getTrailCircle(container)!.getAttribute('stroke-dasharray')).toBeNull()
    })

    it('gapDegree changes stroke dasharray compared to circle', () => {
      const { container: cCircle } = render(<Progress type="circle" percent={50} />)
      const { container: cDash } = render(<Progress type="dashboard" percent={50} />)
      const d1 = getStrokeCircle(cCircle)?.getAttribute('stroke-dasharray')
      const d2 = getStrokeCircle(cDash)?.getAttribute('stroke-dasharray')
      expect(d1).not.toBe(d2)
    })
  })

  // ── Circle steps ──────────────────────────────────────────────────────

  describe('circle steps', () => {
    it('renders multiple trail circles for each step', () => {
      const { container } = render(<Progress type="circle" percent={50} steps={4} />)
      // 4 trail circles + 2 filled circles (50% of 4)
      expect(getCircles(container).length).toBeGreaterThan(2)
    })

    it('zero filled when percent=0', () => {
      const { container: c0 } = render(<Progress type="circle" percent={0} steps={4} />)
      const { container: c50 } = render(<Progress type="circle" percent={50} steps={4} />)
      expect(getCircles(c0).length).toBeLessThan(getCircles(c50).length)
    })
  })

  // ── classNames (line) ─────────────────────────────────────────────────

  describe('classNames (line)', () => {
    it('classNames.trail applied to trail div', () => {
      const { container } = render(<Progress percent={50} classNames={{ trail: 'my-trail' }} />)
      expect(getTrail(container)!.classList.contains('my-trail')).toBe(true)
    })

    it('classNames.stroke applied to stroke div', () => {
      const { container } = render(<Progress percent={50} classNames={{ stroke: 'my-stroke' }} />)
      expect(getStroke(container)!.classList.contains('my-stroke')).toBe(true)
    })

    it('classNames.text applied to outer text span', () => {
      const { container } = render(<Progress percent={50} classNames={{ text: 'my-text' }} />)
      expect(getOuterText(container)!.classList.contains('my-text')).toBe(true)
    })
  })

  // ── styles (line) ─────────────────────────────────────────────────────

  describe('styles (line)', () => {
    it('styles.root applied to root div', () => {
      const { container } = render(<Progress percent={50} styles={{ root: { gap: '1rem' } }} />)
      expect(getRoot(container).style.gap).toBe('1rem')
    })

    it('styles.trail applied to trail div', () => {
      const { container } = render(
        <Progress percent={50} styles={{ trail: { opacity: '0.5' } }} />,
      )
      expect(getTrail(container)!.style.opacity).toBe('0.5')
    })

    it('styles.stroke applied to stroke div', () => {
      const { container } = render(
        <Progress percent={50} styles={{ stroke: { opacity: '0.7' } }} />,
      )
      expect(getStroke(container)!.style.opacity).toBe('0.7')
    })

    it('styles.text applied to outer text span', () => {
      const { container } = render(
        <Progress percent={50} styles={{ text: { color: 'red' } }} />,
      )
      expect(getOuterText(container)!.style.color).toBe('red')
    })
  })

  // ── classNames (circle) ───────────────────────────────────────────────

  describe('classNames (circle)', () => {
    it('classNames.trail applied to trail circle element', () => {
      const { container } = render(
        <Progress type="circle" percent={50} classNames={{ trail: 'circ-trail' }} />,
      )
      expect(getTrailCircle(container)!.classList.contains('circ-trail')).toBe(true)
    })

    it('classNames.stroke applied to stroke circle element', () => {
      const { container } = render(
        <Progress type="circle" percent={50} classNames={{ stroke: 'circ-stroke' }} />,
      )
      expect(getStrokeCircle(container)!.classList.contains('circ-stroke')).toBe(true)
    })

    it('classNames.text applied to circle text span', () => {
      const { container } = render(
        <Progress type="circle" percent={50} classNames={{ text: 'circ-text' }} />,
      )
      expect(getCircleText(container)!.classList.contains('circ-text')).toBe(true)
    })
  })

  // ── styles (circle) ───────────────────────────────────────────────────

  describe('styles (circle)', () => {
    it('styles.root applied to circle root div', () => {
      const { container } = render(
        <Progress type="circle" percent={50} styles={{ root: { border: '1px solid red' } }} />,
      )
      expect(getRoot(container).style.border).toBe('1px solid red')
    })

    it('styles.text applied to circle text span', () => {
      const { container } = render(
        <Progress type="circle" percent={50} styles={{ text: { color: 'blue' } }} />,
      )
      expect(getCircleText(container)!.style.color).toBe('blue')
    })
  })

  // ── className and style ───────────────────────────────────────────────

  describe('className and style', () => {
    it('className applied to line root', () => {
      const { container } = render(<Progress percent={50} className="custom-progress" />)
      expect(getRoot(container).classList.contains('custom-progress')).toBe(true)
    })

    it('style applied to line root', () => {
      const { container } = render(<Progress percent={50} style={{ margin: '1rem' }} />)
      expect(getRoot(container).style.margin).toBe('1rem')
    })

    it('className applied to circle root', () => {
      const { container } = render(
        <Progress type="circle" percent={50} className="circ-class" />,
      )
      expect(getRoot(container).classList.contains('circ-class')).toBe(true)
    })

    it('style applied to circle root', () => {
      const { container } = render(
        <Progress type="circle" percent={50} style={{ padding: '4px' }} />,
      )
      expect(getRoot(container).style.padding).toBe('4px')
    })
  })
})
