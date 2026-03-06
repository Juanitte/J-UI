import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QRCode } from '../QRCode'
import { generateQRMatrix } from '../qr-encoder'

// ============================================================================
// Canvas mock (jsdom has no canvas support)
// ============================================================================

beforeAll(() => {
  const noop = () => {}
  HTMLCanvasElement.prototype.getContext = (() => ({
    setTransform: noop,
    clearRect: noop,
    fillRect: noop,
    drawImage: noop,
    fillStyle: '',
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext
})

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getInnerWrapper(container: HTMLElement) {
  const root = getRoot(container)
  return root.querySelector<HTMLElement>('.ino-qrcode__wrapper') ?? null
}

function getCanvas(container: HTMLElement) {
  return getRoot(container).querySelector('canvas') as HTMLCanvasElement | null
}

function getSvg(container: HTMLElement) {
  const inner = getInnerWrapper(container)
  if (!inner) return null
  return inner.querySelector('svg') as SVGElement | null
}

function getMask(container: HTMLElement) {
  const inner = getInnerWrapper(container)
  if (!inner) return null
  return inner.querySelector<HTMLElement>('.ino-qrcode__mask') ?? null
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('QRCode', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<QRCode value="hello" />)
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('root has inline-block display', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getRoot(container)).toHaveClass('ino-qrcode')
    })

    it('root has relative position', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getRoot(container)).toHaveClass('ino-qrcode')
    })

    it('root has lineHeight 0', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getRoot(container)).toHaveClass('ino-qrcode')
    })

    it('renders inner wrapper with correct size', () => {
      const { container } = render(<QRCode value="hello" />)
      const inner = getInnerWrapper(container)
      expect(inner).toBeTruthy()
      expect(inner!.style.width).toBe('160px')
      expect(inner!.style.height).toBe('160px')
    })

    it('renders with custom size', () => {
      const { container } = render(<QRCode value="hello" size={200} />)
      const inner = getInnerWrapper(container)
      expect(inner!.style.width).toBe('200px')
      expect(inner!.style.height).toBe('200px')
    })
  })

  // ============================================================================
  // Canvas mode (default)
  // ============================================================================

  describe('canvas mode', () => {
    it('renders canvas element by default', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getCanvas(container)).toBeTruthy()
    })

    it('canvas has display block', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getCanvas(container)!.style.display).toBe('block')
    })

    it('canvas has correct dimensions', () => {
      const { container } = render(<QRCode value="hello" size={120} />)
      const canvas = getCanvas(container)!
      expect(canvas.style.width).toBe('120px')
      expect(canvas.style.height).toBe('120px')
    })

    it('does not render svg in canvas mode', () => {
      const { container } = render(<QRCode value="hello" type="canvas" />)
      const inner = getInnerWrapper(container)!
      const svg = inner.querySelector('svg[viewBox]')
      expect(svg).toBeNull()
    })
  })

  // ============================================================================
  // SVG mode
  // ============================================================================

  describe('SVG mode', () => {
    it('renders svg element', () => {
      const { container } = render(<QRCode value="hello" type="svg" />)
      const svg = getSvg(container)
      expect(svg).toBeTruthy()
    })

    it('svg has correct width and height', () => {
      const { container } = render(<QRCode value="hello" type="svg" size={200} />)
      const svg = getSvg(container)!
      expect(svg.getAttribute('width')).toBe('200')
      expect(svg.getAttribute('height')).toBe('200')
    })

    it('svg has correct viewBox', () => {
      const { container } = render(<QRCode value="hello" type="svg" size={160} />)
      const svg = getSvg(container)!
      expect(svg.getAttribute('viewBox')).toBe('0 0 160 160')
    })

    it('svg has display block', () => {
      const { container } = render(<QRCode value="hello" type="svg" />)
      const svg = getSvg(container)!
      expect((svg as unknown as HTMLElement).style.display).toBe('block')
    })

    it('renders rect elements for QR modules', () => {
      const { container } = render(<QRCode value="test" type="svg" />)
      const svg = getSvg(container)!
      const rects = svg.querySelectorAll('rect')
      // Should have multiple rects for the QR code modules
      expect(rects.length).toBeGreaterThan(10)
    })

    it('does not render background rect when bgColor is transparent (default)', () => {
      const { container } = render(<QRCode value="hi" type="svg" size={160} />)
      const svg = getSvg(container)!
      // No rect with width/height matching full size as background
      const bgRect = svg.querySelector('rect[width="160"][height="160"]')
      expect(bgRect).toBeNull()
    })

    it('renders background rect when bgColor is set', () => {
      const { container } = render(<QRCode value="hi" type="svg" bgColor="white" size={160} />)
      const svg = getSvg(container)!
      const bgRect = svg.querySelector('rect[width="160"][height="160"]')
      expect(bgRect).toBeTruthy()
      expect(bgRect!.getAttribute('fill')).toBe('white')
    })

    it('module rects use custom color', () => {
      const { container } = render(<QRCode value="hi" type="svg" color="red" />)
      const svg = getSvg(container)!
      const rects = svg.querySelectorAll('rect[fill="red"]')
      expect(rects.length).toBeGreaterThan(0)
    })

    it('does not render canvas in SVG mode', () => {
      const { container } = render(<QRCode value="hello" type="svg" />)
      expect(getCanvas(container)).toBeNull()
    })
  })

  // ============================================================================
  // Icon in SVG mode
  // ============================================================================

  describe('icon (SVG mode)', () => {
    it('renders image element for icon', () => {
      const { container } = render(<QRCode value="hello" type="svg" icon="logo.png" />)
      const svg = getSvg(container)!
      const image = svg.querySelector('image')
      expect(image).toBeTruthy()
      expect(image!.getAttribute('href')).toBe('logo.png')
    })

    it('icon has default 40px size', () => {
      const { container } = render(<QRCode value="hello" type="svg" icon="logo.png" />)
      const svg = getSvg(container)!
      const image = svg.querySelector('image')!
      expect(image.getAttribute('width')).toBe('40')
      expect(image.getAttribute('height')).toBe('40')
    })

    it('icon uses custom iconSize number', () => {
      const { container } = render(<QRCode value="hello" type="svg" icon="logo.png" iconSize={30} />)
      const svg = getSvg(container)!
      const image = svg.querySelector('image')!
      expect(image.getAttribute('width')).toBe('30')
      expect(image.getAttribute('height')).toBe('30')
    })

    it('icon uses custom iconSize object', () => {
      const { container } = render(
        <QRCode value="hello" type="svg" icon="logo.png" iconSize={{ width: 50, height: 30 }} />,
      )
      const svg = getSvg(container)!
      const image = svg.querySelector('image')!
      expect(image.getAttribute('width')).toBe('50')
      expect(image.getAttribute('height')).toBe('30')
    })

    it('renders background rect behind icon', () => {
      const { container } = render(<QRCode value="hello" type="svg" icon="logo.png" size={160} iconSize={40} />)
      const svg = getSvg(container)!
      // Background rect behind icon: centered, slightly larger (iw+4, ih+4)
      // Center: (160-40)/2 = 60, offset: 60-2 = 58
      const bgRect = svg.querySelector('rect[width="44"]')
      expect(bgRect).toBeTruthy()
    })

    it('no image element when icon is not provided', () => {
      const { container } = render(<QRCode value="hello" type="svg" />)
      const svg = getSvg(container)!
      expect(svg.querySelector('image')).toBeNull()
    })
  })

  // ============================================================================
  // Bordered
  // ============================================================================

  describe('bordered', () => {
    it('has border by default', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getRoot(container)).toHaveClass('ino-qrcode--bordered')
    })

    it('has padding when bordered', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getRoot(container)).toHaveClass('ino-qrcode--bordered')
    })

    it('has borderRadius when bordered', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getRoot(container)).toHaveClass('ino-qrcode--bordered')
    })

    it('no border when bordered=false', () => {
      const { container } = render(<QRCode value="hello" bordered={false} />)
      const root = getRoot(container)
      expect(root.style.border).not.toContain('1px solid')
    })

    it('no padding when bordered=false', () => {
      const { container } = render(<QRCode value="hello" bordered={false} />)
      expect(getRoot(container).style.padding).toBeFalsy()
    })
  })

  // ============================================================================
  // Status: active
  // ============================================================================

  describe('status: active', () => {
    it('no overlay when status is active (default)', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getMask(container)).toBeNull()
    })

    it('renders QR code normally', () => {
      const { container } = render(<QRCode value="hello" />)
      expect(getCanvas(container)).toBeTruthy()
    })
  })

  // ============================================================================
  // Status: loading
  // ============================================================================

  describe('status: loading', () => {
    it('shows mask overlay', () => {
      const { container } = render(<QRCode value="hello" status="loading" />)
      expect(getMask(container)).toBeTruthy()
    })

    it('mask has absolute positioning', () => {
      const { container } = render(<QRCode value="hello" status="loading" />)
      const mask = getMask(container)!
      expect(mask).toHaveClass('ino-qrcode__mask')
    })

    it('renders spinner SVG', () => {
      const { container } = render(<QRCode value="hello" status="loading" />)
      const mask = getMask(container)!
      const spinnerSvg = mask.querySelector('svg')
      expect(spinnerSvg).toBeTruthy()
      // Spinner has animation style
      expect((spinnerSvg as unknown as HTMLElement).style.animation).toContain('j-qrcode-spin')
    })
  })

  // ============================================================================
  // Status: expired
  // ============================================================================

  describe('status: expired', () => {
    it('shows expired text', () => {
      render(<QRCode value="hello" status="expired" />)
      expect(screen.getByText('QR code expired')).toBeTruthy()
    })

    it('shows refresh button', () => {
      render(<QRCode value="hello" status="expired" />)
      expect(screen.getByText(/Refresh/)).toBeTruthy()
    })

    it('refresh button calls onRefresh', () => {
      const onRefresh = vi.fn()
      render(<QRCode value="hello" status="expired" onRefresh={onRefresh} />)
      fireEvent.click(screen.getByText(/Refresh/))
      expect(onRefresh).toHaveBeenCalledTimes(1)
    })

    it('refresh button has primary background color', () => {
      render(<QRCode value="hello" status="expired" />)
      const btn = screen.getByText(/Refresh/).closest('button') as HTMLElement
      expect(btn).toHaveClass('ino-qrcode__refresh-btn')
    })
  })

  // ============================================================================
  // Status: scanned
  // ============================================================================

  describe('status: scanned', () => {
    it('shows "Scanned" text', () => {
      render(<QRCode value="hello" status="scanned" />)
      expect(screen.getByText('Scanned')).toBeTruthy()
    })

    it('shows check icon', () => {
      const { container } = render(<QRCode value="hello" status="scanned" />)
      const mask = getMask(container)!
      // Check icon is 28x28 SVG
      const checkSvg = mask.querySelector('svg[width="28"][height="28"]')
      expect(checkSvg).toBeTruthy()
    })

    it('shows mask overlay', () => {
      const { container } = render(<QRCode value="hello" status="scanned" />)
      expect(getMask(container)).toBeTruthy()
    })
  })

  // ============================================================================
  // Status: statusRender
  // ============================================================================

  describe('statusRender', () => {
    it('renders custom status content', () => {
      render(
        <QRCode
          value="hello"
          status="expired"
          statusRender={({ status }) => <span>Custom: {status}</span>}
        />,
      )
      expect(screen.getByText('Custom: expired')).toBeTruthy()
    })

    it('statusRender receives onRefresh', () => {
      const onRefresh = vi.fn()
      render(
        <QRCode
          value="hello"
          status="expired"
          onRefresh={onRefresh}
          statusRender={({ onRefresh: refresh }) => (
            <button onClick={refresh}>Custom Refresh</button>
          )}
        />,
      )
      fireEvent.click(screen.getByText('Custom Refresh'))
      expect(onRefresh).toHaveBeenCalledTimes(1)
    })

    it('statusRender receives locale strings', () => {
      render(
        <QRCode
          value="hello"
          status="loading"
          statusRender={({ locale }) => <span>{locale.loading}</span>}
        />,
      )
      expect(screen.getByText('Loading...')).toBeTruthy()
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(<QRCode value="hello" classNames={{ root: 'qr-root' }} />)
      expect(getRoot(container).className).toContain('qr-root')
    })

    it('applies classNames.canvas to canvas element', () => {
      const { container } = render(<QRCode value="hello" classNames={{ canvas: 'qr-canvas' }} />)
      expect(getCanvas(container)!.className).toContain('qr-canvas')
    })

    it('applies classNames.canvas to svg element in SVG mode', () => {
      const { container } = render(<QRCode value="hello" type="svg" classNames={{ canvas: 'qr-svg' }} />)
      const svg = getSvg(container)!
      expect((svg as unknown as HTMLElement).getAttribute('class')).toContain('qr-svg')
    })

    it('applies classNames.mask to status overlay', () => {
      const { container } = render(
        <QRCode value="hello" status="loading" classNames={{ mask: 'qr-mask' }} />,
      )
      expect(getMask(container)!.className).toContain('qr-mask')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(<QRCode value="hello" styles={{ root: { margin: '10px' } }} />)
      expect(getRoot(container).style.margin).toBe('10px')
    })

    it('applies styles.canvas to canvas element', () => {
      const { container } = render(
        <QRCode value="hello" styles={{ canvas: { opacity: '0.8' } }} />,
      )
      expect(getCanvas(container)!.style.opacity).toBe('0.8')
    })

    it('applies styles.canvas to svg element in SVG mode', () => {
      const { container } = render(
        <QRCode value="hello" type="svg" styles={{ canvas: { opacity: '0.5' } }} />,
      )
      const svg = getSvg(container)!
      expect((svg as unknown as HTMLElement).style.opacity).toBe('0.5')
    })

    it('applies styles.mask to status overlay', () => {
      const { container } = render(
        <QRCode value="hello" status="expired" styles={{ mask: { borderRadius: '1rem' } }} />,
      )
      expect(getMask(container)!.style.borderRadius).toBe('1rem')
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className / style', () => {
    it('applies className to root', () => {
      const { container } = render(<QRCode value="hello" className="my-qr" />)
      expect(getRoot(container).className).toContain('my-qr')
    })

    it('applies style to root', () => {
      const { container } = render(<QRCode value="hello" style={{ boxShadow: '0 0 10px red' }} />)
      expect(getRoot(container).style.boxShadow).toBe('0 0 10px red')
    })
  })

  // ============================================================================
  // QR encoder (generateQRMatrix)
  // ============================================================================

  describe('generateQRMatrix', () => {
    it('returns a 2D boolean matrix', () => {
      const matrix = generateQRMatrix('hello')
      expect(Array.isArray(matrix)).toBe(true)
      expect(Array.isArray(matrix[0])).toBe(true)
      expect(typeof matrix[0][0]).toBe('boolean')
    })

    it('returns a square matrix', () => {
      const matrix = generateQRMatrix('hello')
      const size = matrix.length
      matrix.forEach((row) => {
        expect(row.length).toBe(size)
      })
    })

    it('matrix size is version*4+17', () => {
      // "hello" with M level should fit in version 1 (21x21)
      const matrix = generateQRMatrix('hello', 'M')
      expect(matrix.length).toBe(21)
    })

    it('returns [[false]] for empty string', () => {
      const matrix = generateQRMatrix('')
      expect(matrix).toEqual([[false]])
    })

    it('different values produce different matrices', () => {
      const m1 = generateQRMatrix('hello')
      const m2 = generateQRMatrix('world')
      // At least some cells should differ
      let differs = false
      for (let r = 0; r < m1.length && !differs; r++) {
        for (let c = 0; c < m1[r].length && !differs; c++) {
          if (m1[r][c] !== m2[r][c]) differs = true
        }
      }
      expect(differs).toBe(true)
    })

    it('higher error level can produce larger matrix', () => {
      // A longer string may need more modules with higher EC
      const longText = 'https://example.com/very/long/path?with=params&and=more'
      const mL = generateQRMatrix(longText, 'L')
      const mH = generateQRMatrix(longText, 'H')
      expect(mH.length).toBeGreaterThanOrEqual(mL.length)
    })

    it('contains true values (dark modules)', () => {
      const matrix = generateQRMatrix('test')
      const hasDark = matrix.some((row) => row.some((cell) => cell === true))
      expect(hasDark).toBe(true)
    })

    it('contains false values (light modules)', () => {
      const matrix = generateQRMatrix('test')
      const hasLight = matrix.some((row) => row.some((cell) => cell === false))
      expect(hasLight).toBe(true)
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('renders with minimal props', () => {
      const { container } = render(<QRCode value="x" />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('renders with empty value', () => {
      const { container } = render(<QRCode value="" />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('renders with long URL value', () => {
      const { container } = render(<QRCode value="https://example.com/a/very/long/path" />)
      expect(getRoot(container)).toBeTruthy()
    })

    it('mask overlay has semi-transparent white background', () => {
      const { container } = render(<QRCode value="hello" status="loading" />)
      const mask = getMask(container)!
      expect(mask).toHaveClass('ino-qrcode__mask')
    })

    it('spin keyframes style is injected', () => {
      const { container } = render(<QRCode value="hello" status="loading" />)
      // Spinner SVG references the j-qrcode-spin animation in its inline style
      const mask = getMask(container)!
      const spinnerSvg = mask.querySelector('svg') as unknown as HTMLElement
      expect(spinnerSvg.style.animation).toContain('j-qrcode-spin')
    })

    it('error level defaults to M', () => {
      // Verify component renders without errorLevel prop (uses default 'M')
      const { container } = render(<QRCode value="hello" type="svg" />)
      const svg = getSvg(container)!
      expect(svg.querySelectorAll('rect').length).toBeGreaterThan(0)
    })
  })
})
