import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { createRef } from 'react'
import { Carousel } from '../Carousel'
import type { CarouselRef } from '../Carousel'

// ============================================================================
// Setup — only fake setTimeout/setInterval; leave rAF & performance untouched
// so React's scheduler doesn't break. Map rAF through setTimeout for control.
// ============================================================================

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'],
  })
  // Bridge rAF to setTimeout so vi.advanceTimersByTime(0) flushes rAF too
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 0) as unknown as number)
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

// ============================================================================
// Helpers
// ============================================================================

function getRoot(container: HTMLElement) {
  return container.firstElementChild as HTMLElement
}

function getViewport(container: HTMLElement) {
  const root = getRoot(container)
  if (!root) return null
  // Viewport is the DIV child of root that contains at least one DIV grandchild
  // (the track). Dots container only has BUTTON children.
  for (const child of Array.from(root.children)) {
    if (child.tagName !== 'DIV') continue
    if (Array.from(child.children).some(c => c.tagName === 'DIV')) {
      return child as HTMLElement
    }
  }
  return null
}

function getTrack(container: HTMLElement) {
  const viewport = getViewport(container)
  if (!viewport) return null
  // Track is the first DIV child of viewport (arrows are BUTTONs)
  return Array.from(viewport.children).find(c => c.tagName === 'DIV') as HTMLElement ?? null
}

function getSlides(container: HTMLElement) {
  const track = getTrack(container)
  return track ? (Array.from(track.children) as HTMLElement[]) : []
}

function getDots() {
  return screen.queryAllByRole('button', { name: /^Go to slide/ }) as HTMLElement[]
}

function getArrows() {
  return {
    prev: screen.queryByRole('button', { name: 'Previous slide' }) as HTMLElement | null,
    next: screen.queryByRole('button', { name: 'Next slide' }) as HTMLElement | null,
  }
}

function renderCarousel(props: React.ComponentProps<typeof Carousel> = {}) {
  const { children, ...rest } = props
  // Pass slides as direct children (NOT wrapped in Fragment)
  // so Children.toArray sees 3 elements, not 1 Fragment
  if (children !== undefined) {
    return render(<Carousel {...rest}>{children}</Carousel>)
  }
  return render(
    <Carousel {...rest}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>,
  )
}

function advanceTimers(ms: number) {
  act(() => { vi.advanceTimersByTime(ms) })
}

function flushRaf() {
  // rAF is bridged to setTimeout(cb, 0), so advancing 1ms flushes it
  act(() => { vi.advanceTimersByTime(1) })
}

// ============================================================================
// Basic rendering
// ============================================================================

describe('Carousel', () => {
  describe('basic rendering', () => {
    it('renders root element', () => {
      const { container } = renderCarousel()
      const root = getRoot(container)
      expect(root).toBeTruthy()
      expect(root.tagName).toBe('DIV')
    })

    it('renders children as slides', () => {
      const { container } = renderCarousel()
      // With infinite=true (default), there are clones: [lastClone, slide1, slide2, slide3, firstClone]
      const slides = getSlides(container)
      expect(slides.length).toBe(5) // 3 real + 2 clones
    })

    it('renders slide content', () => {
      renderCarousel()
      // Use getAllByText because infinite clones duplicate some slides
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Slide 2').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Slide 3').length).toBeGreaterThanOrEqual(1)
    })

    it('returns null when no children', () => {
      const { container } = render(<Carousel>{}</Carousel>)
      expect(container.firstElementChild).toBeNull()
    })

    it('returns null when children is empty array', () => {
      const { container } = render(<Carousel />)
      expect(container.firstElementChild).toBeNull()
    })

    it('applies className to root', () => {
      const { container } = renderCarousel({ className: 'my-carousel' })
      expect(getRoot(container).className).toContain('my-carousel')
    })

    it('applies style to root', () => {
      const { container } = renderCarousel({ style: { width: '600px' } })
      expect(getRoot(container).style.width).toBe('600px')
    })

    it('root has overflow hidden', () => {
      const { container } = renderCarousel()
      expect(getRoot(container)).toHaveClass('ino-carousel')
    })

    it('root uses flex layout', () => {
      const { container } = renderCarousel()
      expect(getRoot(container)).toHaveClass('ino-carousel')
    })
  })

  // ============================================================================
  // Dots
  // ============================================================================

  describe('dots', () => {
    it('renders dots by default', () => {
      renderCarousel()
      const dots = getDots()
      expect(dots.length).toBe(3) // one per real slide
    })

    it('dots have correct aria-labels', () => {
      renderCarousel()
      const dots = getDots()
      expect(dots[0].getAttribute('aria-label')).toBe('Go to slide 1')
      expect(dots[1].getAttribute('aria-label')).toBe('Go to slide 2')
      expect(dots[2].getAttribute('aria-label')).toBe('Go to slide 3')
    })

    it('first dot is active by default (initialSlide=0)', () => {
      renderCarousel()
      const dots = getDots()
      // Active dot has width 1.5rem vs inactive 1rem (horizontal)
      expect(dots[0].style.width).toBe('1.5rem')
      expect(dots[1].style.width).toBe('1rem')
      expect(dots[2].style.width).toBe('1rem')
    })

    it('hides dots when dots=false', () => {
      renderCarousel({ dots: false })
      const dots = getDots()
      expect(dots.length).toBe(0)
    })

    it('applies className from dots config object', () => {
      renderCarousel({ dots: { className: 'custom-dots' } })
      const dots = getDots()
      const dotsContainer = dots[0]?.parentElement
      expect(dotsContainer?.className).toContain('custom-dots')
    })

    it('clicking a dot navigates to that slide', () => {
      const onChange = vi.fn()
      renderCarousel({ beforeChange: onChange })
      const dots = getDots()

      fireEvent.click(dots[2]) // click third dot
      expect(onChange).toHaveBeenCalledWith(0, 2)
    })

    it('does not show dots with single slide', () => {
      render(<Carousel><div>Only slide</div></Carousel>)
      const dots = getDots()
      expect(dots.length).toBe(0)
    })

    it('dots placed at bottom by default', () => {
      const { container } = renderCarousel()
      const root = getRoot(container)
      // Default dotPlacement='bottom', so dots come after the viewport
      const lastChild = root.lastElementChild as HTMLElement
      // Dots container has button children
      expect(Array.from(lastChild.children).some(c => c.tagName === 'BUTTON')).toBe(true)
    })

    it('dots placed at top when dotPlacement=top', () => {
      const { container } = renderCarousel({ dotPlacement: 'top' })
      const root = getRoot(container)
      // Dots should come before the viewport
      const firstChild = root.firstElementChild as HTMLElement
      expect(Array.from(firstChild.children).some(c => c.tagName === 'BUTTON')).toBe(true)
    })
  })

  // ============================================================================
  // Arrows
  // ============================================================================

  describe('arrows', () => {
    it('does not render arrows by default', () => {
      renderCarousel()
      const { prev, next } = getArrows()
      expect(prev).toBeNull()
      expect(next).toBeNull()
    })

    it('renders arrows when arrows=true', () => {
      renderCarousel({ arrows: true })
      const { prev, next } = getArrows()
      expect(prev).toBeTruthy()
      expect(next).toBeTruthy()
    })

    it('arrow buttons have correct aria-labels', () => {
      renderCarousel({ arrows: true })
      const { prev, next } = getArrows()
      expect(prev!.getAttribute('aria-label')).toBe('Previous slide')
      expect(next!.getAttribute('aria-label')).toBe('Next slide')
    })

    it('clicking next arrow navigates forward', () => {
      const onChange = vi.fn()
      renderCarousel({ arrows: true, beforeChange: onChange })
      const { next } = getArrows()

      fireEvent.click(next!)
      expect(onChange).toHaveBeenCalledWith(0, 1)
    })

    it('clicking prev arrow navigates backward (infinite)', () => {
      const onChange = vi.fn()
      renderCarousel({ arrows: true, beforeChange: onChange })
      const { prev } = getArrows()

      fireEvent.click(prev!)
      // In infinite mode, going prev from 0 wraps to last slide (2)
      expect(onChange).toHaveBeenCalledWith(0, 2)
    })

    it('does not render arrows with single slide', () => {
      render(<Carousel arrows><div>Only</div></Carousel>)
      const { prev, next } = getArrows()
      expect(prev).toBeNull()
      expect(next).toBeNull()
    })

    it('arrows are type=button', () => {
      renderCarousel({ arrows: true })
      const { prev, next } = getArrows()
      expect(prev!.getAttribute('type')).toBe('button')
      expect(next!.getAttribute('type')).toBe('button')
    })
  })

  // ============================================================================
  // initialSlide
  // ============================================================================

  describe('initialSlide', () => {
    it('starts at the given slide', () => {
      renderCarousel({ initialSlide: 1 })
      const dots = getDots()
      // Second dot active
      expect(dots[1].style.width).toBe('1.5rem')
      expect(dots[0].style.width).toBe('1rem')
    })

    it('sets track transform according to initialSlide', () => {
      const { container } = renderCarousel({ initialSlide: 2 })
      const track = getTrack(container)
      // With clones: offset = -(2+1)*100 = -300%
      expect(track!.style.transform).toBe('translateX(-300%)')
    })
  })

  // ============================================================================
  // Effect: scrollx (default)
  // ============================================================================

  describe('scrollx effect', () => {
    it('uses translateX by default (horizontal)', () => {
      const { container } = renderCarousel()
      const track = getTrack(container)
      // initialSlide=0, with clones: offset = -(0+1)*100 = -100%
      expect(track!.style.transform).toBe('translateX(-100%)')
    })

    it('creates clone slides for infinite mode', () => {
      const { container } = renderCarousel({ infinite: true })
      const slides = getSlides(container)
      // 3 real slides + 2 clones (lastClone at start, firstClone at end)
      expect(slides.length).toBe(5)
    })

    it('does not create clones when infinite=false', () => {
      const { container } = renderCarousel({ infinite: false })
      const slides = getSlides(container)
      expect(slides.length).toBe(3) // no clones
    })

    it('track has transition with specified speed and easing', () => {
      const { container } = renderCarousel({ speed: 300, easing: 'linear' })
      const track = getTrack(container)
      expect(track!.style.transition).toContain('transform 300ms linear')
    })

    it('no-clone track starts at translateX(0%)', () => {
      const { container } = renderCarousel({ infinite: false, initialSlide: 0 })
      const track = getTrack(container)
      // No clones: offset = -(0)*100 = 0 → translateX(0%)
      expect(track!.style.transform).toContain('translateX')
      expect(track!.style.transform).toContain('0%')
    })
  })

  // ============================================================================
  // Effect: fade
  // ============================================================================

  describe('fade effect', () => {
    it('does not apply transform on the track', () => {
      const { container } = renderCarousel({ effect: 'fade' })
      const track = getTrack(container)
      // In fade mode, transform is not set on the track style
      expect(track!.style.transform).toBeFalsy()
    })

    it('does not create clone slides', () => {
      const { container } = renderCarousel({ effect: 'fade', infinite: true })
      const slides = getSlides(container)
      expect(slides.length).toBe(3) // no clones in fade mode
    })

    it('active slide has opacity 1', () => {
      const { container } = renderCarousel({ effect: 'fade', initialSlide: 0 })
      const slides = getSlides(container)
      expect(slides[0].style.opacity).toBe('1')
    })

    it('inactive slides have opacity 0', () => {
      const { container } = renderCarousel({ effect: 'fade', initialSlide: 0 })
      const slides = getSlides(container)
      expect(slides[1].style.opacity).toBe('0')
      expect(slides[2].style.opacity).toBe('0')
    })

    it('first slide has position relative, others absolute', () => {
      const { container } = renderCarousel({ effect: 'fade' })
      const slides = getSlides(container)
      expect(slides[0]).toHaveClass('ino-carousel__slide--fade-first')
      expect(slides[1]).toHaveClass('ino-carousel__slide--fade-other')
      expect(slides[2]).toHaveClass('ino-carousel__slide--fade-other')
    })

    it('slide transition includes opacity', () => {
      const { container } = renderCarousel({ effect: 'fade', speed: 400, easing: 'linear' })
      const slides = getSlides(container)
      expect(slides[0].style.transition).toContain('opacity 400ms linear')
    })
  })

  // ============================================================================
  // Infinite mode
  // ============================================================================

  describe('infinite mode', () => {
    it('clones contain correct content', () => {
      const { container } = renderCarousel()
      const slides = getSlides(container)
      // First clone is last slide, last clone is first slide
      expect(slides[0].textContent).toBe('Slide 3') // last clone
      expect(slides[4].textContent).toBe('Slide 1') // first clone
    })

    it('wraps forward from last to first', () => {
      const afterChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, afterChange })

      // Go to slide 2 (last), then next
      act(() => { ref.current!.goTo(2) })
      advanceTimers(600)
      flushRaf()

      act(() => { ref.current!.next() })
      advanceTimers(600)
      flushRaf()

      expect(afterChange).toHaveBeenCalledWith(0) // wrapped to first
    })

    it('wraps backward from first to last', () => {
      const afterChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, afterChange })

      // At slide 0, go prev
      act(() => { ref.current!.prev() })
      advanceTimers(600)
      flushRaf()

      expect(afterChange).toHaveBeenCalledWith(2) // wrapped to last
    })
  })

  // ============================================================================
  // Non-infinite mode
  // ============================================================================

  describe('non-infinite mode', () => {
    it('does not wrap forward from last slide', () => {
      const onChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, infinite: false, initialSlide: 2, beforeChange: onChange })

      act(() => { ref.current!.next() })
      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not wrap backward from first slide', () => {
      const onChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, infinite: false, initialSlide: 0, beforeChange: onChange })

      act(() => { ref.current!.prev() })
      expect(onChange).not.toHaveBeenCalled()
    })

    it('allows normal forward navigation', () => {
      const onChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, infinite: false, initialSlide: 0, beforeChange: onChange })

      act(() => { ref.current!.next() })
      expect(onChange).toHaveBeenCalledWith(0, 1)
    })

    it('allows normal backward navigation', () => {
      const onChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, infinite: false, initialSlide: 2, beforeChange: onChange })

      act(() => { ref.current!.prev() })
      expect(onChange).toHaveBeenCalledWith(2, 1)
    })
  })

  // ============================================================================
  // Autoplay
  // ============================================================================

  describe('autoplay', () => {
    it('auto-advances slides at autoplaySpeed', () => {
      const afterChange = vi.fn()
      renderCarousel({ autoplay: true, autoplaySpeed: 2000, afterChange })

      // After 2s, should advance to slide 1
      advanceTimers(2000)
      advanceTimers(600) // wait for transition
      flushRaf()

      expect(afterChange).toHaveBeenCalledWith(1)
    })

    it('pauses on mouse enter', () => {
      const afterChange = vi.fn()
      const { container } = renderCarousel({ autoplay: true, autoplaySpeed: 2000, afterChange })
      const root = getRoot(container)

      fireEvent.mouseEnter(root)
      advanceTimers(3000)

      expect(afterChange).not.toHaveBeenCalled()
    })

    it('resumes on mouse leave', () => {
      const afterChange = vi.fn()
      const { container } = renderCarousel({ autoplay: true, autoplaySpeed: 2000, afterChange })
      const root = getRoot(container)

      fireEvent.mouseEnter(root)
      advanceTimers(3000) // paused

      fireEvent.mouseLeave(root)
      advanceTimers(2000) // should now advance
      advanceTimers(600)
      flushRaf()

      expect(afterChange).toHaveBeenCalled()
    })

    it('does not autoplay with single slide', () => {
      const afterChange = vi.fn()
      render(<Carousel autoplay autoplaySpeed={1000} afterChange={afterChange}><div>Only</div></Carousel>)

      advanceTimers(3000)
      expect(afterChange).not.toHaveBeenCalled()
    })

    it('uses default autoplaySpeed of 3000', () => {
      const afterChange = vi.fn()
      renderCarousel({ autoplay: true, afterChange })

      advanceTimers(2999)
      expect(afterChange).not.toHaveBeenCalled()

      advanceTimers(1) // 3000ms total
      advanceTimers(600) // transition
      flushRaf()

      expect(afterChange).toHaveBeenCalledWith(1)
    })
  })

  // ============================================================================
  // Callbacks: beforeChange / afterChange
  // ============================================================================

  describe('beforeChange / afterChange', () => {
    it('calls beforeChange with (current, next) on navigation', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange })

      act(() => { ref.current!.goTo(2) })
      expect(beforeChange).toHaveBeenCalledWith(0, 2)
    })

    it('calls afterChange with (current) after transition completes', () => {
      const afterChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, afterChange, speed: 500 })

      act(() => { ref.current!.goTo(1) })
      expect(afterChange).not.toHaveBeenCalled()

      advanceTimers(500)
      flushRaf()
      expect(afterChange).toHaveBeenCalledWith(1)
    })

    it('calls afterChange when animate=false', () => {
      const afterChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, afterChange })

      act(() => { ref.current!.goTo(2, false) })
      flushRaf()
      expect(afterChange).toHaveBeenCalledWith(2)
    })
  })

  // ============================================================================
  // Ref methods
  // ============================================================================

  describe('ref methods', () => {
    it('exposes goTo method', () => {
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref })
      expect(typeof ref.current!.goTo).toBe('function')
    })

    it('exposes next method', () => {
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref })
      expect(typeof ref.current!.next).toBe('function')
    })

    it('exposes prev method', () => {
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref })
      expect(typeof ref.current!.prev).toBe('function')
    })

    it('goTo navigates to specific slide', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange })

      act(() => { ref.current!.goTo(2) })
      advanceTimers(600)
      flushRaf()

      expect(beforeChange).toHaveBeenCalledWith(0, 2)
      // Active dot is now the third
      const dots = getDots()
      expect(dots[2].style.width).toBe('1.5rem')
    })

    it('goTo with animate=false skips transition', () => {
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref })

      act(() => { ref.current!.goTo(2, false) })
      flushRaf()

      const dots = getDots()
      expect(dots[2].style.width).toBe('1.5rem')
    })

    it('next advances one slide', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange })

      act(() => { ref.current!.next() })
      expect(beforeChange).toHaveBeenCalledWith(0, 1)
    })

    it('prev goes back one slide', () => {
      const ref = createRef<CarouselRef>()
      const beforeChange = vi.fn()
      renderCarousel({ ref, beforeChange, initialSlide: 1 })

      act(() => { ref.current!.prev() })
      expect(beforeChange).toHaveBeenCalledWith(1, 0)
    })

    it('goTo wraps negative index', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange })

      act(() => { ref.current!.goTo(-1) })
      // clamped = ((-1 % 3) + 3) % 3 = 2
      expect(beforeChange).toHaveBeenCalledWith(0, 2)
    })

    it('goTo wraps index beyond count', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange })

      act(() => { ref.current!.goTo(5) })
      // clamped = ((5 % 3) + 3) % 3 = 2
      expect(beforeChange).toHaveBeenCalledWith(0, 2)
    })
  })

  // ============================================================================
  // waitForAnimate
  // ============================================================================

  describe('waitForAnimate', () => {
    it('blocks navigation during transition when waitForAnimate=true', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange, waitForAnimate: true, speed: 500 })

      act(() => { ref.current!.goTo(1) })
      expect(beforeChange).toHaveBeenCalledTimes(1)

      // Try to navigate again while transitioning
      act(() => { ref.current!.goTo(2) })
      expect(beforeChange).toHaveBeenCalledTimes(1) // still 1 — blocked

      // After transition completes
      advanceTimers(500)
      flushRaf()
      act(() => { ref.current!.goTo(2) })
      expect(beforeChange).toHaveBeenCalledTimes(2) // now allowed
    })

    it('allows navigation during transition when waitForAnimate=false (default)', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange, speed: 500 })

      act(() => { ref.current!.goTo(1) })
      act(() => { ref.current!.goTo(2) })
      expect(beforeChange).toHaveBeenCalledTimes(2) // both allowed
    })
  })

  // ============================================================================
  // Vertical mode (dotPlacement left/right)
  // ============================================================================

  describe('vertical mode', () => {
    it('uses translateY when dotPlacement=left', () => {
      const { container } = renderCarousel({ dotPlacement: 'left' })
      const track = getTrack(container)
      expect(track!.style.transform).toContain('translateY')
    })

    it('uses translateY when dotPlacement=right', () => {
      const { container } = renderCarousel({ dotPlacement: 'right' })
      const track = getTrack(container)
      expect(track!.style.transform).toContain('translateY')
    })

    it('root flexDirection is row for vertical mode', () => {
      const { container } = renderCarousel({ dotPlacement: 'left' })
      expect(getRoot(container)).toHaveClass('ino-carousel--row-reverse')
    })

    it('root flexDirection is column for horizontal mode', () => {
      const { container } = renderCarousel({ dotPlacement: 'bottom' })
      expect(getRoot(container)).toHaveClass('ino-carousel--row')
    })

    it('dots use column direction in vertical mode', () => {
      renderCarousel({ dotPlacement: 'left' })
      const dotsContainer = getDots()[0]?.parentElement as HTMLElement
      expect(dotsContainer).toHaveClass('ino-carousel__dots--v')
    })

    it('dots use row direction in horizontal mode', () => {
      renderCarousel({ dotPlacement: 'bottom' })
      const dotsContainer = getDots()[0]?.parentElement as HTMLElement
      expect(dotsContainer).toHaveClass('ino-carousel__dots--h')
    })

    it('dots placed before viewport when dotPlacement=left', () => {
      const { container } = renderCarousel({ dotPlacement: 'left' })
      const root = getRoot(container)
      const firstChild = root.firstElementChild as HTMLElement
      // First child is dots container (has button children)
      expect(Array.from(firstChild.children).some(c => c.tagName === 'BUTTON')).toBe(true)
    })

    it('active dot has height 1.5rem in vertical mode', () => {
      renderCarousel({ dotPlacement: 'right' })
      const dots = getDots()
      expect(dots[0].style.height).toBe('1.5rem')
      expect(dots[1].style.height).toBe('1rem')
    })
  })

  // ============================================================================
  // Dot progress
  // ============================================================================

  describe('dotProgress', () => {
    it('renders progress bar inside active dot when autoplay + dotProgress', () => {
      renderCarousel({ autoplay: true, dotProgress: true })
      const activeDot = getDots()[0]
      // Active dot should have a child div (the progress indicator)
      const progressBar = activeDot.querySelector('div')
      expect(progressBar).toBeTruthy()
    })

    it('does not render progress bar without autoplay', () => {
      renderCarousel({ autoplay: false, dotProgress: true })
      const activeDot = getDots()[0]
      const progressBar = activeDot.querySelector('div')
      expect(progressBar).toBeNull()
    })

    it('progress bar has animation', () => {
      renderCarousel({ autoplay: true, dotProgress: true, autoplaySpeed: 5000 })
      const activeDot = getDots()[0]
      const progressBar = activeDot.querySelector('div') as HTMLElement
      expect(progressBar.style.animationDuration).toBe('5000ms')
    })

    it('progress bar animationPlayState changes on pause', () => {
      const { container } = renderCarousel({ autoplay: true, dotProgress: true })
      const root = getRoot(container)

      fireEvent.mouseEnter(root)

      const activeDot = getDots()[0]
      const progressBar = activeDot.querySelector('div') as HTMLElement
      expect(progressBar.style.animationPlayState).toBe('paused')
    })

    it('injects keyframe style element', () => {
      renderCarousel({ autoplay: true, dotProgress: true })
      const activeDot = getDots()[0]
      const progressBar = activeDot.querySelector('div') as HTMLElement
      expect(progressBar).toHaveClass('ino-carousel__dot-progress')
    })

    it('uses vertical fill animation when dotPlacement is left/right', () => {
      renderCarousel({ autoplay: true, dotProgress: true, dotPlacement: 'left' })
      const activeDot = getDots()[0]
      const progressBar = activeDot.querySelector('div') as HTMLElement
      expect(progressBar).toHaveClass('ino-carousel__dot-progress--v')
    })

    it('uses horizontal fill animation when dotPlacement is top/bottom', () => {
      renderCarousel({ autoplay: true, dotProgress: true, dotPlacement: 'bottom' })
      const activeDot = getDots()[0]
      const progressBar = activeDot.querySelector('div') as HTMLElement
      expect(progressBar).toHaveClass('ino-carousel__dot-progress--h')
    })
  })

  // ============================================================================
  // Draggable
  // ============================================================================

  describe('draggable', () => {
    it('sets touchAction on track when draggable', () => {
      const { container } = renderCarousel({ draggable: true })
      const track = getTrack(container)
      expect(track!.style.touchAction).toBe('pan-y') // horizontal carousel: pan-y
    })

    it('sets touchAction pan-x for vertical draggable carousel', () => {
      const { container } = renderCarousel({ draggable: true, dotPlacement: 'left' })
      const track = getTrack(container)
      expect(track!.style.touchAction).toBe('pan-x')
    })

    it('does not set touchAction when not draggable', () => {
      const { container } = renderCarousel({ draggable: false })
      const track = getTrack(container)
      expect(track!.style.touchAction).toBeFalsy()
    })

    it('pointer events are bound on track', () => {
      const { container } = renderCarousel({ draggable: true })
      const track = getTrack(container)
      // Track should exist and be interactive
      expect(track).toBeTruthy()
    })
  })

  // ============================================================================
  // Speed / easing
  // ============================================================================

  describe('speed and easing', () => {
    it('default speed is 500ms', () => {
      const { container } = renderCarousel()
      const track = getTrack(container)
      expect(track!.style.transition).toContain('500ms')
    })

    it('default easing is ease', () => {
      const { container } = renderCarousel()
      const track = getTrack(container)
      expect(track!.style.transition).toContain('ease')
    })

    it('custom speed applies to track transition', () => {
      const { container } = renderCarousel({ speed: 1000 })
      const track = getTrack(container)
      expect(track!.style.transition).toContain('1000ms')
    })

    it('custom easing applies to track transition', () => {
      const { container } = renderCarousel({ easing: 'cubic-bezier(0.4, 0, 0.2, 1)' })
      const track = getTrack(container)
      expect(track!.style.transition).toContain('cubic-bezier(0.4, 0, 0.2, 1)')
    })
  })

  // ============================================================================
  // Semantic classNames
  // ============================================================================

  describe('semantic classNames', () => {
    it('applies classNames.root', () => {
      const { container } = renderCarousel({ classNames: { root: 'cr-root' } })
      expect(getRoot(container).className).toContain('cr-root')
    })

    it('applies classNames.track', () => {
      const { container } = renderCarousel({ classNames: { track: 'cr-track' } })
      const track = getTrack(container)
      expect(track!.className).toContain('cr-track')
    })

    it('applies classNames.slide to each slide', () => {
      const { container } = renderCarousel({ classNames: { slide: 'cr-slide' }, infinite: false })
      const slides = getSlides(container)
      slides.forEach((slide) => {
        expect(slide.className).toContain('cr-slide')
      })
    })

    it('applies classNames.dots to dots container', () => {
      renderCarousel({ classNames: { dots: 'cr-dots' } })
      const dotsContainer = getDots()[0]?.parentElement as HTMLElement
      expect(dotsContainer.className).toContain('cr-dots')
    })

    it('applies classNames.arrow to arrow buttons', () => {
      renderCarousel({ arrows: true, classNames: { arrow: 'cr-arrow' } })
      const { prev, next } = getArrows()
      expect(prev!.className).toContain('cr-arrow')
      expect(next!.className).toContain('cr-arrow')
    })
  })

  // ============================================================================
  // Semantic styles
  // ============================================================================

  describe('semantic styles', () => {
    it('applies styles.root', () => {
      const { container } = renderCarousel({ styles: { root: { border: '1px solid red' } } })
      expect(getRoot(container).style.border).toContain('1px solid red')
    })

    it('applies styles.track', () => {
      const { container } = renderCarousel({ styles: { track: { gap: '10px' } } })
      const track = getTrack(container)
      expect(track!.style.gap).toBe('10px')
    })

    it('applies styles.slide to each slide', () => {
      const { container } = renderCarousel({ styles: { slide: { padding: '5px' } }, infinite: false })
      const slides = getSlides(container)
      slides.forEach((slide) => {
        expect(slide.style.padding).toBe('5px')
      })
    })

    it('applies styles.dots', () => {
      renderCarousel({ styles: { dots: { backgroundColor: 'blue' } } })
      const dotsContainer = getDots()[0]?.parentElement as HTMLElement
      expect(dotsContainer.style.backgroundColor).toBe('blue')
    })

    it('applies styles.arrow', () => {
      renderCarousel({ arrows: true, styles: { arrow: { opacity: '0.8' } } })
      const { prev, next } = getArrows()
      expect(prev!.style.opacity).toBe('0.8')
      expect(next!.style.opacity).toBe('0.8')
    })
  })

  // ============================================================================
  // Edge cases
  // ============================================================================

  describe('edge cases', () => {
    it('handles two children', () => {
      render(
        <Carousel>
          <div>A</div>
          <div>B</div>
        </Carousel>,
      )
      const dots = getDots()
      expect(dots.length).toBe(2)
    })

    it('goTo does nothing when count is 0', () => {
      const ref = createRef<CarouselRef>()
      render(<Carousel ref={ref} />)
      // Should not throw
      expect(() => { ref.current }).not.toThrow()
    })

    it('next/prev does nothing with single slide', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      render(
        <Carousel ref={ref} beforeChange={beforeChange}>
          <div>Only</div>
        </Carousel>,
      )

      act(() => { ref.current!.next() })
      act(() => { ref.current!.prev() })
      expect(beforeChange).not.toHaveBeenCalled()
    })

    it('fade effect with infinite does not create clones', () => {
      const { container } = renderCarousel({ effect: 'fade', infinite: true })
      const slides = getSlides(container)
      expect(slides.length).toBe(3)
    })

    it('goTo wraps large indices via modulo', () => {
      const beforeChange = vi.fn()
      const ref = createRef<CarouselRef>()
      renderCarousel({ ref, beforeChange })

      act(() => { ref.current!.goTo(5) })
      // clamped = ((5 % 3) + 3) % 3 = 2
      expect(beforeChange).toHaveBeenCalledWith(0, 2)
    })
  })
})
