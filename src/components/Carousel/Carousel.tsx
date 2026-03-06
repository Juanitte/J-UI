import {
  type ReactNode, type CSSProperties,
  Children, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Carousel.css'

// ============================================================================
// Types
// ============================================================================

export type CarouselEffect = 'scrollx' | 'fade'
export type CarouselDotPlacement = 'top' | 'bottom' | 'left' | 'right'

export type CarouselSemanticSlot = 'root' | 'track' | 'slide' | 'dots' | 'arrow'
export type CarouselClassNames = SemanticClassNames<CarouselSemanticSlot>
export type CarouselStyles = SemanticStyles<CarouselSemanticSlot>

export interface CarouselRef {
  goTo(index: number, animate?: boolean): void
  next(): void
  prev(): void
}

export interface CarouselProps {
  autoplay?: boolean
  autoplaySpeed?: number
  arrows?: boolean
  dots?: boolean | { className?: string }
  dotPlacement?: CarouselDotPlacement
  effect?: CarouselEffect
  speed?: number
  easing?: string
  infinite?: boolean
  draggable?: boolean
  dragClamp?: boolean
  dotProgress?: boolean
  initialSlide?: number
  waitForAnimate?: boolean
  beforeChange?: (current: number, next: number) => void
  afterChange?: (current: number) => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: CarouselClassNames
  styles?: CarouselStyles
}

// ============================================================================
// SVG Icons
// ============================================================================

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 3 5 7 9 11" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 3 9 7 5 11" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 9 7 5 11 9" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 5 7 9 11 5" />
    </svg>
  )
}

// ============================================================================
// Component
// ============================================================================

const CarouselComponent = forwardRef<CarouselRef, CarouselProps>(function CarouselInner({
  autoplay = false,
  autoplaySpeed = 3000,
  arrows = false,
  dots = true,
  dotPlacement = 'bottom',
  effect = 'scrollx',
  speed = 500,
  easing = 'ease',
  infinite = true,
  draggable = false,
  dragClamp = false,
  dotProgress = false,
  initialSlide = 0,
  waitForAnimate = false,
  beforeChange,
  afterChange,
  children,
  className,
  style,
  classNames: classNamesProp,
  styles,
}, ref) {
  const slides = Children.toArray(children)
  const count = slides.length
  const isVertical = dotPlacement === 'left' || dotPlacement === 'right'
  const isFade = effect === 'fade'

  const [current, setCurrent] = useState(initialSlide)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  const hasClones = !isFade && infinite && count > 1

  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragRef = useRef({ startX: 0, startY: 0, deltaX: 0, deltaY: 0, dragging: false })
  const afterChangeRef = useRef(afterChange)
  afterChangeRef.current = afterChange

  // ── Navigation ───────────────────────────────────────────────
  const goTo = useCallback((index: number, animate = true) => {
    if (count === 0) return
    if (waitForAnimate && transitioning) return

    const clamped = ((index % count) + count) % count
    beforeChange?.(current, clamped)

    if (!animate) {
      setTransitionEnabled(false)
      setCurrent(clamped)
      setTransitioning(false)
      requestAnimationFrame(() => {
        setTransitionEnabled(true)
        afterChangeRef.current?.(clamped)
      })
      return
    }

    if (isFade) {
      setTransitioning(true)
      setCurrent(clamped)
      setTimeout(() => {
        setTransitioning(false)
        afterChangeRef.current?.(clamped)
      }, speed)
      return
    }

    if (hasClones) {
      setTransitioning(true)
      if (index < 0) {
        setTransitionEnabled(true)
        setCurrent(-1 as any)
        setTimeout(() => {
          setTransitionEnabled(false)
          setCurrent(count - 1)
          requestAnimationFrame(() => {
            setTransitionEnabled(true)
            setTransitioning(false)
            afterChangeRef.current?.(count - 1)
          })
        }, speed)
      } else if (index >= count) {
        setTransitionEnabled(true)
        setCurrent(count as any)
        setTimeout(() => {
          setTransitionEnabled(false)
          setCurrent(0)
          requestAnimationFrame(() => {
            setTransitionEnabled(true)
            setTransitioning(false)
            afterChangeRef.current?.(0)
          })
        }, speed)
      } else {
        setTransitionEnabled(true)
        setCurrent(clamped)
        setTimeout(() => {
          setTransitioning(false)
          afterChangeRef.current?.(clamped)
        }, speed)
      }
    } else {
      setTransitioning(true)
      setCurrent(clamped)
      setTimeout(() => {
        setTransitioning(false)
        afterChangeRef.current?.(clamped)
      }, speed)
    }
  }, [count, current, transitioning, waitForAnimate, beforeChange, speed, isFade, hasClones])

  const next = useCallback(() => {
    if (count <= 1) return
    if (infinite) {
      goTo(current + 1 >= count ? count : current + 1)
    } else {
      if (current < count - 1) goTo(current + 1)
    }
  }, [count, current, infinite, goTo])

  const prev = useCallback(() => {
    if (count <= 1) return
    if (infinite) {
      goTo(current - 1 < 0 ? -1 : current - 1)
    } else {
      if (current > 0) goTo(current - 1)
    }
  }, [count, current, infinite, goTo])

  useImperativeHandle(ref, () => ({ goTo, next, prev }), [goTo, next, prev])

  // ── Autoplay ─────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    if (!autoplay || count <= 1) return
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => next(), autoplaySpeed)
  }, [autoplay, autoplaySpeed, count, next])

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [startAutoplay, stopAutoplay])

  const handleMouseEnter = useCallback(() => { if (autoplay) { stopAutoplay(); setPaused(true) } }, [autoplay, stopAutoplay])
  const handleMouseLeave = useCallback(() => { if (autoplay) { startAutoplay(); setPaused(false); setProgressKey(k => k + 1) } }, [autoplay, startAutoplay])

  // ── Drag ─────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!draggable) return
    dragRef.current = { startX: e.clientX, startY: e.clientY, deltaX: 0, deltaY: 0, dragging: true }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [draggable])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d.dragging) return
    d.deltaX = e.clientX - d.startX
    d.deltaY = e.clientY - d.startY
    if (trackRef.current && !isFade) {
      let delta = isVertical ? d.deltaY : d.deltaX
      const viewport = isVertical
        ? (rootRef.current?.clientHeight ?? 1)
        : (rootRef.current?.clientWidth ?? 1)
      if (dragClamp) delta = Math.max(-viewport, Math.min(viewport, delta))
      const baseOffset = -(hasClones ? current + 1 : current) * 100
      const pctOffset = (delta / viewport) * 100
      trackRef.current.style.transition = 'none'
      trackRef.current.style.transform = isVertical
        ? `translateY(${baseOffset + pctOffset}%)`
        : `translateX(${baseOffset + pctOffset}%)`
    }
  }, [current, hasClones, isFade, isVertical, dragClamp])

  const handlePointerUp = useCallback(() => {
    const d = dragRef.current
    if (!d.dragging) return
    d.dragging = false

    if (isFade || !trackRef.current) return

    const delta = isVertical ? d.deltaY : d.deltaX
    const viewport = isVertical
      ? (rootRef.current?.clientHeight ?? 1)
      : (rootRef.current?.clientWidth ?? 1)

    const currentDisplayIdx = hasClones ? current + 1 : current
    const basePct = -currentDisplayIdx * 100
    const dragPct = (delta / viewport) * 100
    const totalPct = basePct + dragPct
    let nearestIdx = Math.round(-totalPct / 100)

    if (hasClones) {
      nearestIdx = Math.max(0, Math.min(count + 1, nearestIdx))
    } else {
      nearestIdx = Math.max(0, Math.min(count - 1, nearestIdx))
    }
    if (dragClamp) {
      nearestIdx = Math.max(currentDisplayIdx - 1, Math.min(currentDisplayIdx + 1, nearestIdx))
    }

    trackRef.current.style.transition = `transform ${speed}ms ${easing}`

    if (nearestIdx === currentDisplayIdx) {
      const offset = -currentDisplayIdx * 100
      const correctTransform = isVertical ? `translateY(${offset}%)` : `translateX(${offset}%)`
      trackRef.current.style.transform = correctTransform
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = `transform ${speed}ms ${easing}`
          trackRef.current.style.transform = correctTransform
        }
      }, speed)
    } else {
      const offset = -nearestIdx * 100
      trackRef.current.style.transform = isVertical
        ? `translateY(${offset}%)`
        : `translateX(${offset}%)`

      let realTarget: number
      if (hasClones && nearestIdx === 0) {
        realTarget = count - 1
      } else if (hasClones && nearestIdx === count + 1) {
        realTarget = 0
      } else {
        realTarget = hasClones ? nearestIdx - 1 : nearestIdx
      }

      beforeChange?.(current, realTarget)
      setTransitioning(true)

      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = ''
          trackRef.current.style.transform = ''
        }
        setTransitionEnabled(false)
        setCurrent(realTarget)
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
          setTransitioning(false)
          afterChangeRef.current?.(realTarget)
        })
      }, speed)
    }

    if (autoplay) startAutoplay()
  }, [current, count, infinite, isVertical, hasClones, isFade, speed, easing, autoplay, dragClamp, beforeChange, startAutoplay])

  // ── Build slides array ───────────────────────────────────────
  const renderSlides = () => {
    if (isFade) {
      return slides.map((child, i) => (
        <div
          key={i}
          className={cx(
            'ino-carousel__slide--fade',
            i === 0 ? 'ino-carousel__slide--fade-first' : 'ino-carousel__slide--fade-other',
            classNamesProp?.slide,
          )}
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
            transition: transitionEnabled ? `opacity ${speed}ms ${easing}` : 'none',
            ...styles?.slide,
          }}
        >
          {child}
        </div>
      ))
    }

    const items: ReactNode[] = []

    if (hasClones) {
      items.push(
        <div key="clone-last" className={cx('ino-carousel__slide', { 'ino-carousel__slide--vertical': isVertical }, classNamesProp?.slide)} style={styles?.slide}>
          {slides[count - 1]}
        </div>,
      )
    }

    slides.forEach((child, i) => {
      items.push(
        <div key={i} className={cx('ino-carousel__slide', { 'ino-carousel__slide--vertical': isVertical }, classNamesProp?.slide)} style={styles?.slide}>
          {child}
        </div>,
      )
    })

    if (hasClones) {
      items.push(
        <div key="clone-first" className={cx('ino-carousel__slide', { 'ino-carousel__slide--vertical': isVertical }, classNamesProp?.slide)} style={styles?.slide}>
          {slides[0]}
        </div>,
      )
    }

    return items
  }

  // ── Track transform ──────────────────────────────────────────
  const getTrackTransform = (): string => {
    if (isFade) return 'none'
    const offset = -(hasClones ? current + 1 : current) * 100
    return isVertical ? `translateY(${offset}%)` : `translateX(${offset}%)`
  }

  const realCurrent = ((current % count) + count) % count

  // ── Dots ─────────────────────────────────────────────────────
  const showDots = dots !== false && count > 1
  const dotsClassName = typeof dots === 'object' ? dots.className : undefined
  const isHorizontalDots = dotPlacement === 'top' || dotPlacement === 'bottom'

  const renderDots = () => {
    if (!showDots) return null
    return (
      <div
        className={cx(
          'ino-carousel__dots',
          isHorizontalDots ? 'ino-carousel__dots--h' : 'ino-carousel__dots--v',
          dotsClassName,
          classNamesProp?.dots,
        )}
        style={styles?.dots}
      >
        {slides.map((_, i) => {
          const isActive = i === realCurrent
          return (
            <button
              key={i}
              type="button"
              className="ino-carousel__dot"
              onClick={() => goTo(i)}
              style={{
                width: isHorizontalDots ? (isActive ? '1.5rem' : '1rem') : '0.1875rem',
                height: isHorizontalDots ? '0.1875rem' : (isActive ? '1.5rem' : '1rem'),
                backgroundColor: isActive && !(autoplay && dotProgress) ? tokens.colorPrimary : tokens.colorTextSubtle,
                opacity: isActive && !(autoplay && dotProgress) ? 1 : 0.4,
              }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {isActive && autoplay && dotProgress && (
                <div
                  key={`progress-${realCurrent}-${progressKey}`}
                  className={cx(
                    'ino-carousel__dot-progress',
                    isHorizontalDots ? 'ino-carousel__dot-progress--h' : 'ino-carousel__dot-progress--v',
                  )}
                  style={{
                    backgroundColor: tokens.colorPrimary,
                    animationDuration: `${autoplaySpeed}ms`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // ── Arrows ───────────────────────────────────────────────────
  const renderArrows = () => {
    if (!arrows || count <= 1) return null

    const PrevIcon = isVertical ? ChevronUpIcon : ChevronLeftIcon
    const NextIcon = isVertical ? ChevronDownIcon : ChevronRightIcon

    const prevPos: CSSProperties = isVertical
      ? { top: '0.5rem', left: '50%', transform: 'translateX(-50%)' }
      : { left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }

    const nextPos: CSSProperties = isVertical
      ? { bottom: '0.5rem', left: '50%', transform: 'translateX(-50%)' }
      : { right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }

    return (
      <>
        <button
          type="button"
          className={cx('ino-carousel__arrow', classNamesProp?.arrow)}
          style={{ ...prevPos, ...styles?.arrow }}
          onClick={prev}
          aria-label="Previous slide"
        >
          <PrevIcon />
        </button>
        <button
          type="button"
          className={cx('ino-carousel__arrow', classNamesProp?.arrow)}
          style={{ ...nextPos, ...styles?.arrow }}
          onClick={next}
          aria-label="Next slide"
        >
          <NextIcon />
        </button>
      </>
    )
  }

  const isDotsBeforeViewport = dotPlacement === 'top' || dotPlacement === 'left'

  // ── Track style ──────────────────────────────────────────────
  const trackStyle: CSSProperties = {
    ...(isFade ? {} : {
      transform: getTrackTransform(),
      transition: transitionEnabled ? `transform ${speed}ms ${easing}` : 'none',
    }),
    ...(draggable ? { touchAction: isVertical ? 'pan-x' as const : 'pan-y' as const } : {}),
    ...styles?.track,
  }

  if (count === 0) return null

  return (
    <div
      ref={rootRef}
      className={cx(
        'ino-carousel',
        isVertical ? 'ino-carousel--row-reverse' : 'ino-carousel--row',
        className,
        classNamesProp?.root,
      )}
      style={{ ...styles?.root, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isDotsBeforeViewport && renderDots()}

      <div className={cx('ino-carousel__viewport', { 'ino-carousel__viewport--vertical': isVertical })}>
        {renderArrows()}
        <div
          ref={trackRef}
          className={cx(
            'ino-carousel__track',
            isFade
              ? 'ino-carousel__track--horizontal'
              : isVertical
                ? 'ino-carousel__track--vertical'
                : 'ino-carousel__track--horizontal',
            classNamesProp?.track,
          )}
          style={trackStyle}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {renderSlides()}
        </div>
      </div>

      {!isDotsBeforeViewport && renderDots()}
    </div>
  )
})

export const Carousel = CarouselComponent
