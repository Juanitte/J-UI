import {
  type ReactNode, type CSSProperties,
  Children, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

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
  classNames,
  styles,
}, ref) {
  const slides = Children.toArray(children)
  const count = slides.length
  const isVertical = dotPlacement === 'left' || dotPlacement === 'right'
  const isFade = effect === 'fade'

  // ── State ────────────────────────────────────────────────────
  const [current, setCurrent] = useState(initialSlide)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  // For infinite scrollx: track position includes clones
  // Real slides: indices 0..count-1
  // With clones: [lastClone, ...slides, firstClone] → track index = current + 1
  const hasClones = !isFade && infinite && count > 1

  // ── Refs ─────────────────────────────────────────────────────
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

    // scrollx
    if (hasClones) {
      // For infinite: we may temporarily go to clone index
      setTransitioning(true)
      if (index < 0) {
        // Going to last via clone
        setTransitionEnabled(true)
        setCurrent(-1 as any) // will use trackIndex = 0 (last clone)
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
        // Going to first via clone
        setTransitionEnabled(true)
        setCurrent(count as any) // will use trackIndex = count + 1 (first clone)
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
      goTo(current + 1 >= count ? count : current + 1) // triggers clone path for infinite
    } else {
      if (current < count - 1) goTo(current + 1)
    }
  }, [count, current, infinite, goTo])

  const prev = useCallback(() => {
    if (count <= 1) return
    if (infinite) {
      goTo(current - 1 < 0 ? -1 : current - 1) // triggers clone path for infinite
    } else {
      if (current > 0) goTo(current - 1)
    }
  }, [count, current, infinite, goTo])

  // ── Imperative handle ────────────────────────────────────────
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
    // Apply drag offset directly to track for responsiveness
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

    // Calculate which display position the user dragged nearest to
    const currentDisplayIdx = hasClones ? current + 1 : current
    const basePct = -currentDisplayIdx * 100
    const dragPct = (delta / viewport) * 100
    const totalPct = basePct + dragPct
    let nearestIdx = Math.round(-totalPct / 100)

    // Clamp to the track's displayable range
    if (hasClones) {
      nearestIdx = Math.max(0, Math.min(count + 1, nearestIdx))
    } else {
      nearestIdx = Math.max(0, Math.min(count - 1, nearestIdx))
    }
    // Optional: limit to ±1 slide from current
    if (dragClamp) {
      nearestIdx = Math.max(currentDisplayIdx - 1, Math.min(currentDisplayIdx + 1, nearestIdx))
    }

    // Re-enable animated transition for smooth slide
    trackRef.current.style.transition = `transform ${speed}ms ${easing}`

    if (nearestIdx === currentDisplayIdx) {
      // Snap back to current position
      const offset = -currentDisplayIdx * 100
      const correctTransform = isVertical ? `translateY(${offset}%)` : `translateX(${offset}%)`
      trackRef.current.style.transform = correctTransform
      setTimeout(() => {
        if (trackRef.current) {
          // Restore React-managed values (no state change → no re-render to fix them)
          trackRef.current.style.transition = `transform ${speed}ms ${easing}`
          trackRef.current.style.transform = correctTransform
        }
      }, speed)
    } else {
      // Animate to the nearest slide
      const offset = -nearestIdx * 100
      trackRef.current.style.transform = isVertical
        ? `translateY(${offset}%)`
        : `translateX(${offset}%)`

      // Determine the real slide index
      let realTarget: number
      if (hasClones && nearestIdx === 0) {
        realTarget = count - 1 // clone-last → last slide
      } else if (hasClones && nearestIdx === count + 1) {
        realTarget = 0 // clone-first → first slide
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

    // Restart autoplay timer after manual drag
    if (autoplay) startAutoplay()
  }, [current, count, infinite, isVertical, hasClones, isFade, speed, easing, autoplay, dragClamp, beforeChange, startAutoplay])

  // ── Build slides array ───────────────────────────────────────
  const renderSlides = () => {
    if (isFade) {
      return slides.map((child, i) => (
        <div
          key={i}
          className={classNames?.slide}
          style={mergeSemanticStyle(
            {
              position: i === 0 ? ('relative' as const) : ('absolute' as const),
              ...(i !== 0 ? { inset: 0 } : {}),
              width: '100%',
              flexShrink: 0,
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
              transition: transitionEnabled ? `opacity ${speed}ms ${easing}` : 'none',
            },
            styles?.slide,
          )}
        >
          {child}
        </div>
      ))
    }

    // scrollx — with optional clones
    const items: ReactNode[] = []

    const slideBase: CSSProperties = { width: '100%', flexShrink: 0, ...(isVertical ? { height: '100%' } : {}) }

    if (hasClones) {
      items.push(
        <div key="clone-last" className={classNames?.slide} style={mergeSemanticStyle(slideBase, styles?.slide)}>
          {slides[count - 1]}
        </div>,
      )
    }

    slides.forEach((child, i) => {
      items.push(
        <div key={i} className={classNames?.slide} style={mergeSemanticStyle(slideBase, styles?.slide)}>
          {child}
        </div>,
      )
    })

    if (hasClones) {
      items.push(
        <div key="clone-first" className={classNames?.slide} style={mergeSemanticStyle(slideBase, styles?.slide)}>
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

  // ── Compute real current for dots (clamp -1 and count) ──────
  const realCurrent = ((current % count) + count) % count

  // ── Dots ─────────────────────────────────────────────────────
  const showDots = dots !== false && count > 1
  const dotsClassName = typeof dots === 'object' ? dots.className : undefined

  const renderDots = () => {
    if (!showDots) return null
    const isHorizontalDots = dotPlacement === 'top' || dotPlacement === 'bottom'
    return (
      <div
        className={dotsClassName ? `${dotsClassName} ${classNames?.dots ?? ''}`.trim() : classNames?.dots}
        style={mergeSemanticStyle(
          {
            display: 'flex',
            flexDirection: isHorizontalDots ? ('row' as const) : ('column' as const),
            gap: '0.375rem',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isHorizontalDots ? '0.75rem 0' : '0 0.75rem',
          },
          styles?.dots,
        )}
      >
        {slides.map((_, i) => {
          const isActive = i === realCurrent
          return (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                width: isHorizontalDots ? (isActive ? '1.5rem' : '1rem') : '0.1875rem',
                height: isHorizontalDots ? '0.1875rem' : (isActive ? '1.5rem' : '1rem'),
                borderRadius: '1rem',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                backgroundColor: isActive && !(autoplay && dotProgress) ? tokens.colorPrimary : tokens.colorTextSubtle,
                opacity: isActive && !(autoplay && dotProgress) ? 1 : 0.4,
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {isActive && autoplay && dotProgress && (
                <div
                  key={`progress-${realCurrent}-${progressKey}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: tokens.colorPrimary,
                    borderRadius: 'inherit',
                    transformOrigin: isHorizontalDots ? 'left center' : 'center top',
                    animationName: isHorizontalDots ? 'j-carousel-fill-h' : 'j-carousel-fill-v',
                    animationDuration: `${autoplaySpeed}ms`,
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards',
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

    const arrowBase: CSSProperties = {
      position: 'absolute',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: 'rgba(0,0,0,0.25)',
      color: '#fff',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      padding: 0,
    }

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
          className={classNames?.arrow}
          style={mergeSemanticStyle({ ...arrowBase, ...prevPos }, styles?.arrow)}
          onClick={prev}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.5)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.25)' }}
          aria-label="Previous slide"
        >
          <PrevIcon />
        </button>
        <button
          type="button"
          className={classNames?.arrow}
          style={mergeSemanticStyle({ ...arrowBase, ...nextPos }, styles?.arrow)}
          onClick={next}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.5)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.25)' }}
          aria-label="Next slide"
        >
          <NextIcon />
        </button>
      </>
    )
  }

  // ── Layout: dots placement ───────────────────────────────────
  const isDotsBeforeViewport = dotPlacement === 'top' || dotPlacement === 'left'
  const flexDir: CSSProperties['flexDirection'] = isVertical ? 'row' : 'column'

  // ── Root style ───────────────────────────────────────────────
  const rootStyle = mergeSemanticStyle(
    {
      position: 'relative' as const,
      display: 'flex',
      flexDirection: flexDir,
      overflow: 'hidden',
      fontFamily: 'inherit',
    },
    styles?.root,
    style,
  )

  // ── Track style ──────────────────────────────────────────────
  const trackStyle = mergeSemanticStyle(
    {
      display: 'flex',
      flexDirection: (isFade ? 'row' : (isVertical ? 'column' : 'row')) as CSSProperties['flexDirection'],
      position: 'relative' as const,
      ...(isVertical && !isFade ? { height: '100%' } : {}),
      ...(isFade ? {} : {
        transform: getTrackTransform(),
        transition: transitionEnabled ? `transform ${speed}ms ${easing}` : 'none',
      }),
      ...(draggable ? { touchAction: isVertical ? 'pan-x' as const : 'pan-y' as const } : {}),
    },
    styles?.track,
  )

  if (count === 0) return null

  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={rootStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {autoplay && dotProgress && showDots && (
        <style>{`
          @keyframes j-carousel-fill-h { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          @keyframes j-carousel-fill-v { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        `}</style>
      )}
      {isDotsBeforeViewport && renderDots()}

      {/* Viewport */}
      <div style={{ position: 'relative', overflow: 'hidden', flex: 1, ...(isVertical ? { height: '100%' } : {}) }}>
        {renderArrows()}
        <div
          ref={trackRef}
          className={classNames?.track}
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

// ============================================================================
// Export
// ============================================================================

export const Carousel = CarouselComponent
