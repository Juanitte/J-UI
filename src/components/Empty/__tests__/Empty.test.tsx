import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Empty } from '../Empty'

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getImageContainer(container: HTMLElement) {
  // First child of root is always the image container div
  return getRoot(container).firstElementChild as HTMLElement
}

function getDescriptionEl(container: HTMLElement) {
  // Description is after the image container (if not hidden)
  const root = getRoot(container)
  const children = Array.from(root.children) as HTMLElement[]
  // Image container is always first; description is next (if present)
  return children[1] && children[1].tagName === 'DIV' ? children[1] : null
}

function getFooterEl(container: HTMLElement) {
  // Footer is the last child of root (if children prop is set)
  const root = getRoot(container)
  const children = Array.from(root.children) as HTMLElement[]
  return children.length > 2 ? children[children.length - 1] : null
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Empty', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = render(<Empty />)
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('root has BEM base class', () => {
      const { container } = render(<Empty />)
      const root = getRoot(container)
      expect(root).toHaveClass('ino-empty')
    })

    it('renders default SimpleImage SVG', () => {
      const { container } = render(<Empty />)
      const imgContainer = getImageContainer(container)
      const svg = imgContainer.querySelector('svg')
      expect(svg).toBeTruthy()
      expect(svg!.getAttribute('width')).toBe('64')
      expect(svg!.getAttribute('height')).toBe('41')
    })

    it('renders default description "No data"', () => {
      render(<Empty />)
      expect(screen.getByText('No data')).toBeTruthy()
    })

    it('does not render footer when no children', () => {
      const { container } = render(<Empty />)
      const root = getRoot(container)
      // Only 2 children: image + description
      expect(root.children.length).toBe(2)
    })
  })

  // ============================================================================
  // Image
  // ============================================================================

  describe('image', () => {
    it('renders default SVG when no image prop', () => {
      const { container } = render(<Empty />)
      const imgContainer = getImageContainer(container)
      expect(imgContainer.querySelector('svg')).toBeTruthy()
    })

    it('renders custom ReactNode as image', () => {
      render(<Empty image={<span data-testid="custom-img">Custom</span>} />)
      expect(screen.getByTestId('custom-img')).toBeTruthy()
    })

    it('renders string as img element with src', () => {
      const { container } = render(<Empty image="https://example.com/empty.png" />)
      const img = getImageContainer(container).querySelector('img')
      expect(img).toBeTruthy()
      expect(img!.getAttribute('src')).toBe('https://example.com/empty.png')
      expect(img!.getAttribute('alt')).toBe('empty')
    })

    it('string image has maxWidth 100%', () => {
      const { container } = render(<Empty image="https://example.com/img.png" />)
      const img = getImageContainer(container).querySelector('img') as HTMLElement
      expect(img.style.maxWidth).toBe('100%')
    })

    it('applies imageStyle to image container', () => {
      const { container } = render(<Empty imageStyle={{ marginBottom: '2rem' }} />)
      const imgContainer = getImageContainer(container)
      expect(imgContainer.style.marginBottom).toBe('2rem')
    })

    it('image container has BEM class', () => {
      const { container } = render(<Empty />)
      const imgContainer = getImageContainer(container)
      expect(imgContainer).toHaveClass('ino-empty__image')
    })

    it('image container has with-desc modifier when description shown', () => {
      const { container } = render(<Empty />)
      const imgContainer = getImageContainer(container)
      expect(imgContainer).toHaveClass('ino-empty__image--with-desc')
    })

    it('image container has no marginBottom when description=false', () => {
      const { container } = render(<Empty description={false} />)
      const imgContainer = getImageContainer(container)
      expect(imgContainer.style.marginBottom).toBeFalsy()
    })
  })

  // ============================================================================
  // Description
  // ============================================================================

  describe('description', () => {
    it('shows "No data" by default', () => {
      render(<Empty />)
      expect(screen.getByText('No data')).toBeTruthy()
    })

    it('renders custom description text', () => {
      render(<Empty description="Nothing here" />)
      expect(screen.getByText('Nothing here')).toBeTruthy()
    })

    it('renders ReactNode as description', () => {
      render(<Empty description={<strong>Empty!</strong>} />)
      expect(screen.getByText('Empty!')).toBeTruthy()
    })

    it('hides description when description=false', () => {
      const { container } = render(<Empty description={false} />)
      const root = getRoot(container)
      // Only image container, no description
      expect(root.children.length).toBe(1)
      expect(screen.queryByText('No data')).toBeNull()
    })

    it('description has correct BEM class', () => {
      const { container } = render(<Empty />)
      const desc = getDescriptionEl(container)
      expect(desc).toBeTruthy()
      expect(desc).toHaveClass('ino-empty__description')
    })
  })

  // ============================================================================
  // Footer (children)
  // ============================================================================

  describe('footer (children)', () => {
    it('renders children in footer', () => {
      render(<Empty><button>Create Now</button></Empty>)
      expect(screen.getByText('Create Now')).toBeTruthy()
    })

    it('footer has BEM class', () => {
      const { container } = render(<Empty><button>Action</button></Empty>)
      const footer = getFooterEl(container)
      expect(footer).toBeTruthy()
      expect(footer).toHaveClass('ino-empty__footer')
    })

    it('does not render footer when no children', () => {
      const { container } = render(<Empty />)
      expect(getFooterEl(container)).toBeNull()
    })

    it('root has 3 children when description and footer present', () => {
      const { container } = render(<Empty><span>Footer</span></Empty>)
      const root = getRoot(container)
      expect(root.children.length).toBe(3)
    })
  })

  // ============================================================================
  // Icon color
  // ============================================================================

  describe('iconColor', () => {
    it('passes iconColor to default SimpleImage stroke', () => {
      const { container } = render(<Empty iconColor="red" />)
      const imgContainer = getImageContainer(container)
      const g = imgContainer.querySelector('g[fill-rule="nonzero"]')
      expect(g).toBeTruthy()
      expect(g!.getAttribute('stroke')).toBe('red')
    })

    it('uses default token color when iconColor not set', () => {
      const { container } = render(<Empty />)
      const imgContainer = getImageContainer(container)
      const g = imgContainer.querySelector('g[fill-rule="nonzero"]')
      expect(g).toBeTruthy()
      // Has some stroke value from tokens.colorBorder
      expect(g!.getAttribute('stroke')).toBeTruthy()
    })
  })

  // ============================================================================
  // Tumbleweed mode
  // ============================================================================

  describe('tumbleweed mode', () => {
    it('renders tumbleweed animation container', () => {
      const { container } = render(<Empty tumbleweed />)
      const imgContainer = getImageContainer(container)
      expect(imgContainer).toHaveClass('ino-empty__image--tumbleweed')
    })

    it('does not render default SimpleImage SVG when tumbleweed=true', () => {
      const { container } = render(<Empty tumbleweed />)
      const imgContainer = getImageContainer(container)
      // No 64x41 SVG
      const svgs = imgContainer.querySelectorAll('svg')
      const simpleImageSvg = Array.from(svgs).find(
        (s) => s.getAttribute('width') === '64' && s.getAttribute('height') === '41',
      )
      expect(simpleImageSvg).toBeFalsy()
    })

    it('renders tumbleweed SVG (40x40)', () => {
      const { container } = render(<Empty tumbleweed />)
      const imgContainer = getImageContainer(container)
      // The tumbleweed SVG inside the animation container
      // It's nested inside animation's inner container
      const twSvg = Array.from(imgContainer.querySelectorAll('svg')).find(
        (s) => s.getAttribute('width') === '40' && s.getAttribute('height') === '40',
      )
      expect(twSvg).toBeTruthy()
    })

    it('renders wind line SVGs', () => {
      const { container } = render(<Empty tumbleweed />)
      const imgContainer = getImageContainer(container)
      // 3 wind SVGs (width=30, height=12) + 1 tumbleweed SVG
      const svgs = imgContainer.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThanOrEqual(4)
    })

    it('renders shadow element', () => {
      const { container } = render(<Empty tumbleweed />)
      const imgContainer = getImageContainer(container)
      // Shadow is a div with borderRadius 50% inside the animation container
      const animContainer = imgContainer.firstElementChild as HTMLElement
      const shadowDiv = Array.from(animContainer.children).find(
        (el) => (el as HTMLElement).style.borderRadius === '50%',
      )
      expect(shadowDiv).toBeTruthy()
    })

    it('still renders description in tumbleweed mode', () => {
      render(<Empty tumbleweed />)
      expect(screen.getByText('No data')).toBeTruthy()
    })
  })

  // ============================================================================
  // Tumbleweed colors
  // ============================================================================

  describe('tumbleweed colors', () => {
    it('applies tumbleweedColor to tumbleweed SVG', () => {
      const { container } = render(<Empty tumbleweed tumbleweedColor="brown" />)
      const imgContainer = getImageContainer(container)
      const twSvg = Array.from(imgContainer.querySelectorAll('svg')).find(
        (s) => s.getAttribute('width') === '40' && s.getAttribute('height') === '40',
      )
      expect(twSvg).toBeTruthy()
      const path = twSvg!.querySelector('path')
      expect(path!.getAttribute('fill')).toBe('brown')
    })

    it('applies windColor to wind line strokes', () => {
      const { container } = render(<Empty tumbleweed windColor="gray" />)
      const imgContainer = getImageContainer(container)
      const windSvgs = Array.from(imgContainer.querySelectorAll('svg')).filter(
        (s) => s.getAttribute('width') === '30' && s.getAttribute('height') === '12',
      )
      expect(windSvgs.length).toBe(3)
      windSvgs.forEach((svg) => {
        const path = svg.querySelector('path')
        expect(path!.getAttribute('stroke')).toBe('gray')
      })
    })

    it('applies shadowColor to shadow element', () => {
      const { container } = render(<Empty tumbleweed shadowColor="rgba(0,0,0,0.2)" />)
      const imgContainer = getImageContainer(container)
      const animContainer = imgContainer.firstElementChild as HTMLElement
      const shadowDiv = Array.from(animContainer.children).find(
        (el) => (el as HTMLElement).style.borderRadius === '50%',
      ) as HTMLElement
      expect(shadowDiv.style.backgroundColor).toBe('rgba(0, 0, 0, 0.2)')
    })
  })

  // ============================================================================
  // className / style
  // ============================================================================

  describe('className / style', () => {
    it('applies className to root', () => {
      const { container } = render(<Empty className="my-empty" />)
      expect(getRoot(container).className).toContain('my-empty')
    })

    it('applies style to root', () => {
      const { container } = render(<Empty style={{ minHeight: '300px' }} />)
      expect(getRoot(container).style.minHeight).toBe('300px')
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = render(<Empty classNames={{ root: 'e-root' }} />)
      expect(getRoot(container).className).toContain('e-root')
    })

    it('applies classNames.image', () => {
      const { container } = render(<Empty classNames={{ image: 'e-img' }} />)
      expect(getImageContainer(container).className).toContain('e-img')
    })

    it('applies classNames.description', () => {
      const { container } = render(<Empty classNames={{ description: 'e-desc' }} />)
      const desc = getDescriptionEl(container)
      expect(desc!.className).toContain('e-desc')
    })

    it('applies classNames.footer', () => {
      const { container } = render(
        <Empty classNames={{ footer: 'e-footer' }}><button>Go</button></Empty>,
      )
      const footer = getFooterEl(container)
      expect(footer!.className).toContain('e-footer')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = render(<Empty styles={{ root: { margin: '10px' } }} />)
      expect(getRoot(container).style.margin).toBe('10px')
    })

    it('applies styles.image', () => {
      const { container } = render(<Empty styles={{ image: { opacity: '0.5' } }} />)
      expect(getImageContainer(container).style.opacity).toBe('0.5')
    })

    it('applies styles.description', () => {
      const { container } = render(<Empty styles={{ description: { letterSpacing: '0.5px' } }} />)
      const desc = getDescriptionEl(container)
      expect(desc!.style.letterSpacing).toBe('0.5px')
    })

    it('applies styles.footer', () => {
      const { container } = render(
        <Empty styles={{ footer: { gap: '8px' } }}><button>Go</button></Empty>,
      )
      const footer = getFooterEl(container)
      expect(footer!.style.gap).toBe('8px')
    })
  })

  // ============================================================================
  // Compound export
  // ============================================================================

  describe('compound export', () => {
    it('PRESENTED_IMAGE_SIMPLE is exported', () => {
      expect(Empty.PRESENTED_IMAGE_SIMPLE).toBeTruthy()
    })

    it('PRESENTED_IMAGE_SIMPLE renders as SVG', () => {
      const { container } = render(
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
      )
      const imgContainer = getImageContainer(container)
      const svg = imgContainer.querySelector('svg')
      expect(svg).toBeTruthy()
      expect(svg!.getAttribute('width')).toBe('64')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('renders with no props at all', () => {
      const { container } = render(<Empty />)
      expect(getRoot(container)).toBeTruthy()
      expect(screen.getByText('No data')).toBeTruthy()
    })

    it('renders with all description hidden and no children', () => {
      const { container } = render(<Empty description={false} />)
      const root = getRoot(container)
      // Only image container
      expect(root.children.length).toBe(1)
    })

    it('renders with description=false and children', () => {
      const { container } = render(<Empty description={false}><button>Add</button></Empty>)
      const root = getRoot(container)
      // image + footer (no description)
      expect(root.children.length).toBe(2)
      expect(screen.getByText('Add')).toBeTruthy()
    })

    it('renders empty string description', () => {
      const { container } = render(<Empty description="" />)
      const desc = getDescriptionEl(container)
      // Empty description div is still rendered (description !== false)
      expect(desc).toBeTruthy()
      expect(desc!.textContent).toBe('')
    })

    it('image container gets classNames.image in tumbleweed mode too', () => {
      const { container } = render(<Empty tumbleweed classNames={{ image: 'tw-img' }} />)
      expect(getImageContainer(container).className).toContain('tw-img')
    })
  })
})
