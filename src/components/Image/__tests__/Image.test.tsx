import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Image } from '../Image'

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getImg(container: HTMLElement) {
  return getRoot(container).querySelector('img') as HTMLImageElement | null
}

function getMask(container: HTMLElement) {
  // Mask is a div with "Preview" text inside root
  const root = getRoot(container)
  return (Array.from(root.children).find(
    (el) => el.textContent?.includes('Preview') && (el as HTMLElement).style.position === 'absolute',
  ) as HTMLElement | undefined) ?? null
}

function getPlaceholder(container: HTMLElement) {
  // Placeholder is an absolutely positioned div with flex center
  const root = getRoot(container)
  return (Array.from(root.children).find(
    (el) =>
      (el as HTMLElement).style.position === 'absolute' &&
      (el as HTMLElement).style.display === 'flex' &&
      !el.textContent?.includes('Preview'),
  ) as HTMLElement | undefined) ?? null
}

function getErrorState(container: HTMLElement) {
  // Error state is an absolutely positioned div with a BrokenImageIcon SVG (48x48)
  const root = getRoot(container)
  return (Array.from(root.children).find((el) => {
    const svg = el.querySelector('svg[width="48"][height="48"]')
    return svg !== null
  }) as HTMLElement | undefined) ?? null
}

/** Simulate the image loading successfully */
function simulateLoad(container: HTMLElement) {
  const img = getImg(container)
  if (img) fireEvent.load(img)
}

/** Simulate the image failing to load */
function simulateError(container: HTMLElement) {
  const img = getImg(container)
  if (img) fireEvent.error(img)
}

function getPreviewOverlay() {
  // Preview overlay is portaled to document.body, has position fixed and z-index 1050
  return (Array.from(document.body.children).find((el) => {
    const style = (el as HTMLElement).style
    return style.position === 'fixed' && style.zIndex === '1050'
  }) as HTMLElement | undefined) ?? null
}

function getPreviewCloseButton() {
  const overlay = getPreviewOverlay()
  if (!overlay) return null
  // Close button is the first button with position absolute, top 1rem, right 1rem
  return Array.from(overlay.querySelectorAll('button')).find(
    (btn) => btn.style.top === '1rem' && btn.style.right === '1rem',
  ) ?? null
}

function getToolbarButtons() {
  const overlay = getPreviewOverlay()
  if (!overlay) return []
  // Toolbar buttons have title attributes
  return Array.from(overlay.querySelectorAll('button[title]')) as HTMLElement[]
}

function getPreviewImage() {
  const overlay = getPreviewOverlay()
  if (!overlay) return null
  return overlay.querySelector('img') as HTMLImageElement | null
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Image', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<Image src="test.jpg" />)
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('root has inline-block display', () => {
      const { container } = render(<Image src="test.jpg" />)
      expect(getRoot(container).style.display).toBe('inline-block')
    })

    it('root has relative position', () => {
      const { container } = render(<Image src="test.jpg" />)
      expect(getRoot(container).style.position).toBe('relative')
    })

    it('root has overflow hidden', () => {
      const { container } = render(<Image src="test.jpg" />)
      expect(getRoot(container).style.overflow).toBe('hidden')
    })

    it('renders img element', () => {
      const { container } = render(<Image src="test.jpg" />)
      const img = getImg(container)
      expect(img).toBeTruthy()
      expect(img!.getAttribute('src')).toBe('test.jpg')
    })

    it('passes alt to img', () => {
      const { container } = render(<Image src="test.jpg" alt="A photo" />)
      expect(getImg(container)!.getAttribute('alt')).toBe('A photo')
    })

    it('applies width and height to root', () => {
      const { container } = render(<Image src="test.jpg" width={200} height={150} />)
      const root = getRoot(container)
      expect(root.style.width).toBe('200px')
      expect(root.style.height).toBe('150px')
    })

    it('accepts string width/height', () => {
      const { container } = render(<Image src="test.jpg" width="50%" height="auto" />)
      const root = getRoot(container)
      expect(root.style.width).toBe('50%')
      expect(root.style.height).toBe('auto')
    })

    it('img has 100% width and height', () => {
      const { container } = render(<Image src="test.jpg" />)
      const img = getImg(container)
      expect(img!.style.width).toBe('100%')
      expect(img!.style.height).toBe('100%')
    })

    it('img has object-fit cover', () => {
      const { container } = render(<Image src="test.jpg" />)
      expect(getImg(container)!.style.objectFit).toBe('cover')
    })
  })

  // ============================================================================
  // Loading state
  // ============================================================================

  describe('loading state', () => {
    it('img starts with opacity 0 (loading)', () => {
      const { container } = render(<Image src="test.jpg" />)
      expect(getImg(container)!.style.opacity).toBe('0')
    })

    it('img becomes opacity 1 after load', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      expect(getImg(container)!.style.opacity).toBe('1')
    })

    it('img has opacity transition', () => {
      const { container } = render(<Image src="test.jpg" />)
      expect(getImg(container)!.style.transition).toContain('opacity')
    })
  })

  // ============================================================================
  // Placeholder
  // ============================================================================

  describe('placeholder', () => {
    it('shows custom placeholder when loading', () => {
      render(<Image src="test.jpg" placeholder={<span>Loading...</span>} />)
      expect(screen.getByText('Loading...')).toBeTruthy()
    })

    it('shows shimmer placeholder when placeholder=true', () => {
      const { container } = render(<Image src="test.jpg" placeholder={true} />)
      const ph = getPlaceholder(container)
      expect(ph).toBeTruthy()
      // Shimmer has animation style
      const shimmerDiv = ph!.firstElementChild as HTMLElement
      expect(shimmerDiv.style.animation).toContain('j-image-shimmer')
    })

    it('hides placeholder after load', () => {
      const { container } = render(<Image src="test.jpg" placeholder={<span>Loading...</span>} />)
      simulateLoad(container)
      expect(screen.queryByText('Loading...')).toBeNull()
    })

    it('no placeholder when not set', () => {
      const { container } = render(<Image src="test.jpg" />)
      expect(getPlaceholder(container)).toBeNull()
    })
  })

  // ============================================================================
  // Error state
  // ============================================================================

  describe('error state', () => {
    it('shows broken image icon on error', () => {
      const { container } = render(<Image src="bad.jpg" />)
      simulateError(container)
      expect(getErrorState(container)).toBeTruthy()
    })

    it('hides img element on error', () => {
      const { container } = render(<Image src="bad.jpg" />)
      simulateError(container)
      expect(getImg(container)).toBeNull()
    })

    it('calls onError callback', () => {
      const onError = vi.fn()
      const { container } = render(<Image src="bad.jpg" onError={onError} />)
      simulateError(container)
      expect(onError).toHaveBeenCalledTimes(1)
    })

    it('tries fallback before showing error', () => {
      const { container } = render(<Image src="bad.jpg" fallback="fallback.jpg" />)
      simulateError(container)
      // Should switch to fallback src, not show error yet
      const img = getImg(container)
      expect(img).toBeTruthy()
      expect(img!.getAttribute('src')).toBe('fallback.jpg')
    })

    it('shows error if fallback also fails', () => {
      const { container } = render(<Image src="bad.jpg" fallback="also-bad.jpg" />)
      // First error → switch to fallback
      simulateError(container)
      // Second error → show broken icon
      simulateError(container)
      expect(getErrorState(container)).toBeTruthy()
    })
  })

  // ============================================================================
  // Fallback
  // ============================================================================

  describe('fallback', () => {
    it('switches to fallback src on error', () => {
      const { container } = render(<Image src="main.jpg" fallback="backup.jpg" />)
      simulateError(container)
      expect(getImg(container)!.getAttribute('src')).toBe('backup.jpg')
    })

    it('can load successfully after switching to fallback', () => {
      const { container } = render(<Image src="main.jpg" fallback="backup.jpg" />)
      simulateError(container) // switch to fallback
      simulateLoad(container) // fallback loads
      expect(getImg(container)!.style.opacity).toBe('1')
    })
  })

  // ============================================================================
  // Preview disabled
  // ============================================================================

  describe('preview disabled', () => {
    it('no mask when preview=false', () => {
      const { container } = render(<Image src="test.jpg" preview={false} />)
      simulateLoad(container)
      expect(getMask(container)).toBeNull()
    })

    it('click does not open preview when preview=false', () => {
      const { container } = render(<Image src="test.jpg" preview={false} />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      expect(getPreviewOverlay()).toBeNull()
    })
  })

  // ============================================================================
  // Preview mask
  // ============================================================================

  describe('preview mask', () => {
    it('shows mask with "Preview" text after image loads', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      const mask = getMask(container)
      expect(mask).toBeTruthy()
      expect(mask!.textContent).toContain('Preview')
    })

    it('mask has absolute positioning', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      const mask = getMask(container)
      expect(mask!.style.position).toBe('absolute')
    })

    it('mask starts with opacity 0', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      const mask = getMask(container)
      expect(mask!.style.opacity).toBe('0')
    })

    it('mask has cursor pointer', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      const mask = getMask(container)
      expect(mask!.style.cursor).toBe('pointer')
    })

    it('no mask while loading', () => {
      const { container } = render(<Image src="test.jpg" />)
      // Don't simulate load
      expect(getMask(container)).toBeNull()
    })
  })

  // ============================================================================
  // Preview overlay
  // ============================================================================

  describe('preview overlay', () => {
    it('opens preview on click', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      expect(getPreviewOverlay()).toBeTruthy()
    })

    it('preview contains the image', () => {
      const { container } = render(<Image src="test.jpg" alt="Test" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const previewImg = getPreviewImage()
      expect(previewImg).toBeTruthy()
      expect(previewImg!.getAttribute('src')).toBe('test.jpg')
    })

    it('preview has close button', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      expect(getPreviewCloseButton()).toBeTruthy()
    })

    it('close button closes preview', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const closeBtn = getPreviewCloseButton()!
      fireEvent.click(closeBtn)
      expect(getPreviewOverlay()).toBeNull()
    })

    it('preview has toolbar with 7 buttons', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const btns = getToolbarButtons()
      expect(btns.length).toBe(7)
    })

    it('toolbar has correct button titles', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const btns = getToolbarButtons()
      const titles = btns.map((b) => b.getAttribute('title'))
      expect(titles).toContain('Zoom in')
      expect(titles).toContain('Zoom out')
      expect(titles).toContain('Rotate left')
      expect(titles).toContain('Rotate right')
      expect(titles).toContain('Flip horizontal')
      expect(titles).toContain('Flip vertical')
      expect(titles).toContain('Reset')
    })

    it('Escape key closes preview', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const overlay = getPreviewOverlay()!
      fireEvent.keyDown(overlay, { key: 'Escape' })
      expect(getPreviewOverlay()).toBeNull()
    })

    it('preview image is not draggable', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const previewImg = getPreviewImage()!
      expect(previewImg.getAttribute('draggable')).toBe('false')
    })
  })

  // ============================================================================
  // Preview config
  // ============================================================================

  describe('preview config', () => {
    it('uses custom preview src', () => {
      const { container } = render(
        <Image src="thumb.jpg" preview={{ src: 'highres.jpg' }} />,
      )
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const previewImg = getPreviewImage()
      expect(previewImg!.getAttribute('src')).toBe('highres.jpg')
    })

    it('controlled open via preview.open', () => {
      const { container } = render(
        <Image src="test.jpg" preview={{ open: true }} />,
      )
      simulateLoad(container)
      expect(getPreviewOverlay()).toBeTruthy()
    })

    it('calls onOpenChange when closing controlled preview', () => {
      const onOpenChange = vi.fn()
      const { container } = render(
        <Image src="test.jpg" preview={{ open: true, onOpenChange }} />,
      )
      simulateLoad(container)
      const closeBtn = getPreviewCloseButton()!
      fireEvent.click(closeBtn)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  // ============================================================================
  // PreviewGroup
  // ============================================================================

  describe('PreviewGroup', () => {
    it('renders children images', () => {
      const { container } = render(
        <Image.PreviewGroup>
          <Image src="a.jpg" alt="Image A" />
          <Image src="b.jpg" alt="Image B" />
        </Image.PreviewGroup>,
      )
      const images = container.querySelectorAll('img')
      expect(images.length).toBe(2)
    })

    it('renders images from items prop', () => {
      const { container } = render(
        <Image.PreviewGroup items={['one.jpg', 'two.jpg', 'three.jpg']} />,
      )
      const images = container.querySelectorAll('img')
      expect(images.length).toBe(3)
    })

    it('renders items with object config', () => {
      const { container } = render(
        <Image.PreviewGroup
          items={[
            { src: 'a.jpg', alt: 'Photo A' },
            { src: 'b.jpg', alt: 'Photo B' },
          ]}
        />,
      )
      const images = container.querySelectorAll('img')
      expect(images.length).toBe(2)
    })

    it('opens group preview on image click', () => {
      const { container } = render(
        <Image.PreviewGroup>
          <Image src="a.jpg" />
          <Image src="b.jpg" />
        </Image.PreviewGroup>,
      )
      // Simulate load on all images
      const imgs = container.querySelectorAll('img')
      imgs.forEach((img) => fireEvent.load(img))
      // Click the first image root
      const roots = container.querySelectorAll('div[style*="inline-block"]')
      fireEvent.click(roots[0])
      expect(getPreviewOverlay()).toBeTruthy()
    })

    it('group preview shows navigation arrows', () => {
      const { container } = render(
        <Image.PreviewGroup>
          <Image src="a.jpg" />
          <Image src="b.jpg" />
        </Image.PreviewGroup>,
      )
      const imgs = container.querySelectorAll('img')
      imgs.forEach((img) => fireEvent.load(img))
      const roots = container.querySelectorAll('div[style*="inline-block"]')
      fireEvent.click(roots[0])

      const overlay = getPreviewOverlay()!
      // Nav buttons: prev (left:1rem) and next (right:1rem)
      const navBtns = Array.from(overlay.querySelectorAll('button')).filter(
        (btn) => btn.style.borderRadius === '50%' && btn.style.zIndex === '2',
      )
      // Close button also has borderRadius 50%, but nav buttons have the navBtnStyle
      expect(navBtns.length).toBeGreaterThanOrEqual(2)
    })

    it('group preview shows counter', () => {
      const { container } = render(
        <Image.PreviewGroup>
          <Image src="a.jpg" />
          <Image src="b.jpg" />
        </Image.PreviewGroup>,
      )
      const imgs = container.querySelectorAll('img')
      imgs.forEach((img) => fireEvent.load(img))
      const roots = container.querySelectorAll('div[style*="inline-block"]')
      fireEvent.click(roots[0])

      // Counter shows "1 / 2"
      const overlay = getPreviewOverlay()!
      expect(overlay.textContent).toContain('/')
    })

    it('disables preview when preview=false', () => {
      const { container } = render(
        <Image.PreviewGroup preview={false}>
          <Image src="a.jpg" />
        </Image.PreviewGroup>,
      )
      const imgs = container.querySelectorAll('img')
      imgs.forEach((img) => fireEvent.load(img))
      // Mask should not appear
      const root = getRoot(container)
      const mask = Array.from(root.querySelectorAll('div')).find(
        (el) => el.textContent?.includes('Preview'),
      )
      expect(mask).toBeFalsy()
    })

    it('custom countRender', () => {
      const { container } = render(
        <Image.PreviewGroup
          preview={{ countRender: (c, t) => `Image ${c} of ${t}` }}
        >
          <Image src="a.jpg" />
          <Image src="b.jpg" />
        </Image.PreviewGroup>,
      )
      const imgs = container.querySelectorAll('img')
      imgs.forEach((img) => fireEvent.load(img))
      const roots = container.querySelectorAll('div[style*="inline-block"]')
      fireEvent.click(roots[0])
      const overlay = getPreviewOverlay()!
      expect(overlay.textContent).toContain('Image')
      expect(overlay.textContent).toContain('of')
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(<Image src="test.jpg" classNames={{ root: 'img-root' }} />)
      expect(getRoot(container).className).toContain('img-root')
    })

    it('applies classNames.image to img element', () => {
      const { container } = render(<Image src="test.jpg" classNames={{ image: 'img-el' }} />)
      expect(getImg(container)!.className).toContain('img-el')
    })

    it('applies classNames.mask', () => {
      const { container } = render(<Image src="test.jpg" classNames={{ mask: 'img-mask' }} />)
      simulateLoad(container)
      const mask = getMask(container)
      expect(mask!.className).toContain('img-mask')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(<Image src="test.jpg" styles={{ root: { borderRadius: '8px' } }} />)
      expect(getRoot(container).style.borderRadius).toBe('8px')
    })

    it('applies styles.image', () => {
      const { container } = render(<Image src="test.jpg" styles={{ image: { objectFit: 'contain' } }} />)
      expect(getImg(container)!.style.objectFit).toBe('contain')
    })

    it('applies styles.mask', () => {
      const { container } = render(<Image src="test.jpg" styles={{ mask: { fontSize: '1rem' } }} />)
      simulateLoad(container)
      const mask = getMask(container)
      expect(mask!.style.fontSize).toBe('1rem')
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className / style', () => {
    it('applies className to root', () => {
      const { container } = render(<Image src="test.jpg" className="my-image" />)
      expect(getRoot(container).className).toContain('my-image')
    })

    it('applies style to root', () => {
      const { container } = render(<Image src="test.jpg" style={{ border: '1px solid red' }} />)
      expect(getRoot(container).style.border).toContain('1px solid red')
    })
  })

  // ============================================================================
  // Compound export
  // ============================================================================

  describe('compound export', () => {
    it('Image.PreviewGroup exists', () => {
      expect(Image.PreviewGroup).toBeTruthy()
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('renders with no src', () => {
      const { container } = render(<Image />)
      const root = getRoot(container)
      expect(root).toBeTruthy()
    })

    it('resets status when src changes', () => {
      const { container, rerender } = render(<Image src="a.jpg" />)
      simulateLoad(container)
      expect(getImg(container)!.style.opacity).toBe('1')
      rerender(<Image src="b.jpg" />)
      // New src → back to loading (opacity 0)
      expect(getImg(container)!.style.opacity).toBe('0')
    })

    it('preview overlay is portaled to document.body', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const overlay = getPreviewOverlay()
      // Overlay parent should be document.body
      expect(overlay!.parentElement).toBe(document.body)
    })

    it('toolbar zoom in button exists and is clickable', () => {
      const { container } = render(<Image src="test.jpg" />)
      simulateLoad(container)
      fireEvent.click(getRoot(container))
      const btns = getToolbarButtons()
      const zoomInBtn = btns.find((b) => b.getAttribute('title') === 'Zoom in')
      expect(zoomInBtn).toBeTruthy()
      // Click should not throw
      fireEvent.click(zoomInBtn!)
    })
  })
})
