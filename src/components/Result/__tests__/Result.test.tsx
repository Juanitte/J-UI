import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Result } from '../Result'

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement
}

/** Icon container — always the first child of root */
function getIconDiv(container: HTMLElement): HTMLElement {
  return getRoot(container).firstElementChild as HTMLElement
}

/** SVG inside the icon container */
function getIconSVG(container: HTMLElement): SVGElement | null {
  return getIconDiv(container).querySelector('svg')
}

/** Title div: fontWeight 600 */
function getTitleDiv(container: HTMLElement): HTMLElement | null {
  return (
    (Array.from(getRoot(container).querySelectorAll('div')).find(
      (el) => (el as HTMLElement).style.fontWeight === '600',
    ) as HTMLElement | undefined) ?? null
  )
}

/** Subtitle div: fontSize 0.875rem */
function getSubtitleDiv(container: HTMLElement): HTMLElement | null {
  return (
    (Array.from(getRoot(container).querySelectorAll(':scope > div')).find(
      (el) => (el as HTMLElement).style.fontSize === '0.875rem',
    ) as HTMLElement | undefined) ?? null
  )
}

/**
 * Extra div: display flex + marginTop 1.5rem — direct child of root.
 * Icon div has marginBottom (not marginTop); content div has no display:flex.
 */
function getExtraDiv(container: HTMLElement): HTMLElement | null {
  return (
    (Array.from(getRoot(container).children).find(
      (el) =>
        el.tagName === 'DIV' &&
        (el as HTMLElement).style.display === 'flex' &&
        (el as HTMLElement).style.marginTop === '1.5rem',
    ) as HTMLElement | undefined) ?? null
  )
}

/** Content div: textAlign left — direct child of root */
function getContentDiv(container: HTMLElement): HTMLElement | null {
  return (
    (Array.from(getRoot(container).children).find(
      (el) =>
        el.tagName === 'DIV' &&
        (el as HTMLElement).style.textAlign === 'left',
    ) as HTMLElement | undefined) ?? null
  )
}

// ============================================================================
// Tests
// ============================================================================

describe('Result', () => {
  // ── Basic rendering ───────────────────────────────────────────────────

  describe('basic rendering', () => {
    it('renders a root element', () => {
      const { container } = render(<Result />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('root has textAlign center', () => {
      const { container } = render(<Result />)
      expect(getRoot(container).style.textAlign).toBe('center')
    })

    it('root has padding 3rem 2rem', () => {
      const { container } = render(<Result />)
      expect(getRoot(container).style.padding).toBe('3rem 2rem')
    })

    it('icon container is always rendered', () => {
      const { container } = render(<Result />)
      expect(getIconDiv(container)).toBeTruthy()
    })

    it('icon container has display flex', () => {
      const { container } = render(<Result />)
      expect(getIconDiv(container).style.display).toBe('flex')
    })

    it('icon container has marginBottom 1.5rem', () => {
      const { container } = render(<Result />)
      expect(getIconDiv(container).style.marginBottom).toBe('1.5rem')
    })
  })

  // ── status / icon ─────────────────────────────────────────────────────

  describe('status icons', () => {
    it('default status=info renders an SVG icon', () => {
      const { container } = render(<Result />)
      expect(getIconSVG(container)).not.toBeNull()
    })

    it('status=success renders an SVG icon', () => {
      const { container } = render(<Result status="success" />)
      expect(getIconSVG(container)).not.toBeNull()
    })

    it('status=error renders an SVG icon', () => {
      const { container } = render(<Result status="error" />)
      expect(getIconSVG(container)).not.toBeNull()
    })

    it('status=warning renders an SVG icon', () => {
      const { container } = render(<Result status="warning" />)
      expect(getIconSVG(container)).not.toBeNull()
    })

    it('non-HTTP icon div has fontSize 4.5rem', () => {
      const { container } = render(<Result status="success" />)
      expect(getIconDiv(container).style.fontSize).toBe('4.5rem')
    })

    it('status=403 renders a 250×200 illustration SVG', () => {
      const { container } = render(<Result status={403} />)
      const svg = getIconSVG(container)!
      expect(svg.getAttribute('width')).toBe('250')
      expect(svg.getAttribute('height')).toBe('200')
    })

    it('status=404 renders a 250×200 illustration SVG', () => {
      const { container } = render(<Result status={404} />)
      const svg = getIconSVG(container)!
      expect(svg.getAttribute('width')).toBe('250')
      expect(svg.getAttribute('height')).toBe('200')
    })

    it('status=500 renders a 250×200 illustration SVG', () => {
      const { container } = render(<Result status={500} />)
      const svg = getIconSVG(container)!
      expect(svg.getAttribute('width')).toBe('250')
      expect(svg.getAttribute('height')).toBe('200')
    })

    it('HTTP status icon div has no fontSize (illustration is self-sized)', () => {
      const { container } = render(<Result status={404} />)
      expect(getIconDiv(container).style.fontSize).toBe('')
    })

    it('custom icon prop overrides status icon', () => {
      const { container } = render(
        <Result status="error" icon={<span data-testid="my-icon">★</span>} />,
      )
      expect(getIconDiv(container).querySelector('[data-testid="my-icon"]')).not.toBeNull()
      expect(getIconSVG(container)).toBeNull()
    })

    it('custom icon=0 (falsy but not null/undefined) still overrides', () => {
      const { container } = render(<Result icon={<span>X</span>} />)
      expect(getIconSVG(container)).toBeNull()
    })
  })

  // ── title ─────────────────────────────────────────────────────────────

  describe('title', () => {
    it('title not rendered when not provided', () => {
      const { container } = render(<Result />)
      expect(getTitleDiv(container)).toBeNull()
    })

    it('renders title text', () => {
      const { container } = render(<Result title="Operation Complete" />)
      expect(getTitleDiv(container)?.textContent).toBe('Operation Complete')
    })

    it('title has fontWeight 600', () => {
      const { container } = render(<Result title="Title" />)
      expect(getTitleDiv(container)?.style.fontWeight).toBe('600')
    })

    it('title has fontSize 1.5rem', () => {
      const { container } = render(<Result title="Title" />)
      expect(getTitleDiv(container)?.style.fontSize).toBe('1.5rem')
    })

    it('title has marginBottom 0.5rem', () => {
      const { container } = render(<Result title="Title" />)
      expect(getTitleDiv(container)?.style.marginBottom).toBe('0.5rem')
    })

    it('title accepts ReactNode', () => {
      const { container } = render(<Result title={<strong>Bold Title</strong>} />)
      expect(getTitleDiv(container)?.querySelector('strong')).not.toBeNull()
    })
  })

  // ── subTitle ──────────────────────────────────────────────────────────

  describe('subTitle', () => {
    it('subTitle not rendered when not provided', () => {
      const { container } = render(<Result />)
      expect(getSubtitleDiv(container)).toBeNull()
    })

    it('renders subTitle text', () => {
      const { container } = render(<Result subTitle="Something went wrong." />)
      expect(getSubtitleDiv(container)?.textContent).toBe('Something went wrong.')
    })

    it('subTitle has fontSize 0.875rem', () => {
      const { container } = render(<Result subTitle="desc" />)
      expect(getSubtitleDiv(container)?.style.fontSize).toBe('0.875rem')
    })

    it('subTitle has lineHeight 1.6', () => {
      const { container } = render(<Result subTitle="desc" />)
      expect(getSubtitleDiv(container)?.style.lineHeight).toBe('1.6')
    })

    it('subTitle accepts ReactNode', () => {
      const { container } = render(<Result subTitle={<em>Italic desc</em>} />)
      expect(getSubtitleDiv(container)?.querySelector('em')).not.toBeNull()
    })
  })

  // ── extra ─────────────────────────────────────────────────────────────

  describe('extra', () => {
    it('extra not rendered when not provided', () => {
      const { container } = render(<Result />)
      expect(getExtraDiv(container)).toBeNull()
    })

    it('renders extra content', () => {
      const { container } = render(<Result extra={<button>Retry</button>} />)
      expect(getExtraDiv(container)?.querySelector('button')?.textContent).toBe('Retry')
    })

    it('extra div has display flex', () => {
      const { container } = render(<Result extra={<button>OK</button>} />)
      expect(getExtraDiv(container)?.style.display).toBe('flex')
    })

    it('extra div has justifyContent center', () => {
      const { container } = render(<Result extra={<button>OK</button>} />)
      expect(getExtraDiv(container)?.style.justifyContent).toBe('center')
    })

    it('extra div has marginTop 1.5rem', () => {
      const { container } = render(<Result extra={<button>OK</button>} />)
      expect(getExtraDiv(container)?.style.marginTop).toBe('1.5rem')
    })
  })

  // ── children (content) ────────────────────────────────────────────────

  describe('children (content)', () => {
    it('content not rendered when no children', () => {
      const { container } = render(<Result />)
      expect(getContentDiv(container)).toBeNull()
    })

    it('renders children inside content div', () => {
      const { container } = render(
        <Result>
          <p>Detail info</p>
        </Result>,
      )
      expect(getContentDiv(container)?.querySelector('p')?.textContent).toBe('Detail info')
    })

    it('content div has textAlign left', () => {
      const { container } = render(<Result>child</Result>)
      expect(getContentDiv(container)?.style.textAlign).toBe('left')
    })

    it('content div has borderRadius 0.5rem', () => {
      const { container } = render(<Result>child</Result>)
      expect(getContentDiv(container)?.style.borderRadius).toBe('0.5rem')
    })

    it('content div has marginTop 1.5rem', () => {
      const { container } = render(<Result>child</Result>)
      expect(getContentDiv(container)?.style.marginTop).toBe('1.5rem')
    })
  })

  // ── classNames ────────────────────────────────────────────────────────

  describe('classNames', () => {
    it('classNames.root applied to root div', () => {
      const { container } = render(<Result classNames={{ root: 'my-root' }} />)
      expect(getRoot(container).classList.contains('my-root')).toBe(true)
    })

    it('classNames.icon applied to icon container', () => {
      const { container } = render(<Result classNames={{ icon: 'my-icon' }} />)
      expect(getIconDiv(container).classList.contains('my-icon')).toBe(true)
    })

    it('classNames.title applied to title div', () => {
      const { container } = render(<Result title="T" classNames={{ title: 'my-title' }} />)
      expect(getTitleDiv(container)?.classList.contains('my-title')).toBe(true)
    })

    it('classNames.subtitle applied to subtitle div', () => {
      const { container } = render(
        <Result subTitle="S" classNames={{ subtitle: 'my-subtitle' }} />,
      )
      expect(getSubtitleDiv(container)?.classList.contains('my-subtitle')).toBe(true)
    })

    it('classNames.extra applied to extra div', () => {
      const { container } = render(
        <Result extra={<span />} classNames={{ extra: 'my-extra' }} />,
      )
      expect(getExtraDiv(container)?.classList.contains('my-extra')).toBe(true)
    })

    it('classNames.content applied to content div', () => {
      const { container } = render(
        <Result classNames={{ content: 'my-content' }}>child</Result>,
      )
      expect(getContentDiv(container)?.classList.contains('my-content')).toBe(true)
    })
  })

  // ── styles ────────────────────────────────────────────────────────────

  describe('styles', () => {
    it('styles.root applied to root div', () => {
      const { container } = render(<Result styles={{ root: { background: 'red' } }} />)
      expect(getRoot(container).style.background).toBe('red')
    })

    it('styles.icon applied to icon container', () => {
      const { container } = render(<Result styles={{ icon: { opacity: '0.5' } }} />)
      expect(getIconDiv(container).style.opacity).toBe('0.5')
    })

    it('styles.title applied to title div', () => {
      const { container } = render(<Result title="T" styles={{ title: { color: 'blue' } }} />)
      expect(getTitleDiv(container)?.style.color).toBe('blue')
    })

    it('styles.subtitle applied to subtitle div', () => {
      const { container } = render(
        <Result subTitle="S" styles={{ subtitle: { color: 'green' } }} />,
      )
      expect(getSubtitleDiv(container)?.style.color).toBe('green')
    })

    it('styles.extra applied to extra div', () => {
      const { container } = render(
        <Result extra={<span />} styles={{ extra: { gap: '1rem' } }} />,
      )
      expect(getExtraDiv(container)?.style.gap).toBe('1rem')
    })

    it('styles.content applied to content div', () => {
      const { container } = render(
        <Result styles={{ content: { padding: '2rem' } }}>child</Result>,
      )
      expect(getContentDiv(container)?.style.padding).toBe('2rem')
    })
  })

  // ── className and style ───────────────────────────────────────────────

  describe('className and style', () => {
    it('className applied to root', () => {
      const { container } = render(<Result className="my-result" />)
      expect(getRoot(container).classList.contains('my-result')).toBe(true)
    })

    it('className and classNames.root both applied', () => {
      const { container } = render(
        <Result className="a" classNames={{ root: 'b' }} />,
      )
      expect(getRoot(container).classList.contains('a')).toBe(true)
      expect(getRoot(container).classList.contains('b')).toBe(true)
    })

    it('style applied to root (overrides defaults)', () => {
      const { container } = render(<Result style={{ padding: '1rem' }} />)
      expect(getRoot(container).style.padding).toBe('1rem')
    })
  })
})
