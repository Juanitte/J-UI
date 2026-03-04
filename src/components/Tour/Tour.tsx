import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { tokens } from '../../theme/tokens'
import { Button } from '../Button'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticStyle } from '../../utils/semanticDom'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type TourPlacement =
  | 'center'
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom'

type StandardPlacement = Exclude<TourPlacement, 'center'>

export type TourType = 'default' | 'primary'

export type TourSemanticSlot =
  | 'root' | 'mask' | 'popup' | 'header' | 'title'
  | 'description' | 'footer' | 'arrow' | 'close' | 'cover' | 'indicators'

export type TourClassNames = SemanticClassNames<TourSemanticSlot>
export type TourStyles = SemanticStyles<TourSemanticSlot>

export interface TourStepConfig {
  target?: HTMLElement | (() => HTMLElement | null) | null
  title?: ReactNode
  description?: ReactNode
  cover?: ReactNode
  placement?: TourPlacement
  arrow?: boolean | { pointAtCenter: boolean }
  mask?: boolean | { style?: CSSProperties; color?: string }
  type?: TourType
  nextButtonProps?: { children?: ReactNode; onClick?: () => void }
  prevButtonProps?: { children?: ReactNode; onClick?: () => void }
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
}

export interface TourProps {
  steps?: TourStepConfig[]
  open?: boolean
  current?: number
  onChange?: (current: number) => void
  onClose?: (current: number) => void
  onFinish?: () => void
  mask?: boolean | { style?: CSSProperties; color?: string }
  arrow?: boolean | { pointAtCenter: boolean }
  type?: TourType
  placement?: TourPlacement
  gap?: { offset?: number | [number, number]; radius?: number }
  closeIcon?: ReactNode | false
  disabledInteraction?: boolean
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions
  indicatorsRender?: (current: number, total: number) => ReactNode
  actionsRender?: (actions: ReactNode[], info: { current: number; total: number; goTo: (step: number) => void; close: () => void }) => ReactNode
  zIndex?: number
  className?: string
  style?: CSSProperties
  classNames?: TourClassNames
  styles?: TourStyles
}

// ─── Positioning (from Popover) ─────────────────────────────────────────────────

const POPUP_GAP = 8

function getCoords(rect: DOMRect, placement: StandardPlacement): { top: number; left: number } {
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  switch (placement) {
    case 'top':         return { top: rect.top - POPUP_GAP, left: cx }
    case 'topLeft':     return { top: rect.top - POPUP_GAP, left: rect.left }
    case 'topRight':    return { top: rect.top - POPUP_GAP, left: rect.right }
    case 'bottom':      return { top: rect.bottom + POPUP_GAP, left: cx }
    case 'bottomLeft':  return { top: rect.bottom + POPUP_GAP, left: rect.left }
    case 'bottomRight': return { top: rect.bottom + POPUP_GAP, left: rect.right }
    case 'left':        return { top: cy, left: rect.left - POPUP_GAP }
    case 'leftTop':     return { top: rect.top, left: rect.left - POPUP_GAP }
    case 'leftBottom':  return { top: rect.bottom, left: rect.left - POPUP_GAP }
    case 'right':       return { top: cy, left: rect.right + POPUP_GAP }
    case 'rightTop':    return { top: rect.top, left: rect.right + POPUP_GAP }
    case 'rightBottom': return { top: rect.bottom, left: rect.right + POPUP_GAP }
  }
}

function getTransform(placement: StandardPlacement, animating: boolean): string {
  const offset = animating ? 0 : 6

  switch (placement) {
    case 'top':         return `translateX(-50%) translateY(-100%) translateY(${offset}px)`
    case 'topLeft':     return `translateY(-100%) translateY(${offset}px)`
    case 'topRight':    return `translateX(-100%) translateY(-100%) translateY(${offset}px)`
    case 'bottom':      return `translateX(-50%) translateY(${-offset}px)`
    case 'bottomLeft':  return `translateY(${-offset}px)`
    case 'bottomRight': return `translateX(-100%) translateY(${-offset}px)`
    case 'left':        return `translateX(-100%) translateY(-50%) translateX(${offset}px)`
    case 'leftTop':     return `translateX(-100%) translateX(${offset}px)`
    case 'leftBottom':  return `translateX(-100%) translateY(-100%) translateX(${offset}px)`
    case 'right':       return `translateY(-50%) translateX(${-offset}px)`
    case 'rightTop':    return `translateX(${-offset}px)`
    case 'rightBottom': return `translateY(-100%) translateX(${-offset}px)`
  }
}

function getArrowStyle(placement: StandardPlacement, bgColor: string, borderColor: string): CSSProperties {
  const base: CSSProperties = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: bgColor,
  }

  const border = borderColor !== 'transparent' ? `1px solid ${borderColor}` : 'none'

  switch (placement) {
    case 'top':
      return { ...base, bottom: '-0.25rem', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderRight: border, borderBottom: border }
    case 'topLeft':
      return { ...base, bottom: '-0.25rem', left: '1rem', transform: 'rotate(45deg)', borderRight: border, borderBottom: border }
    case 'topRight':
      return { ...base, bottom: '-0.25rem', right: '1rem', transform: 'rotate(45deg)', borderRight: border, borderBottom: border }
    case 'bottom':
      return { ...base, top: '-0.25rem', left: '50%', transform: 'translateX(-50%) rotate(-135deg)', borderRight: border, borderBottom: border }
    case 'bottomLeft':
      return { ...base, top: '-0.25rem', left: '1rem', transform: 'rotate(-135deg)', borderRight: border, borderBottom: border }
    case 'bottomRight':
      return { ...base, top: '-0.25rem', right: '1rem', transform: 'rotate(-135deg)', borderRight: border, borderBottom: border }
    case 'left':
      return { ...base, right: '-0.25rem', top: '50%', transform: 'translateY(-50%) rotate(-45deg)', borderRight: border, borderBottom: border }
    case 'leftTop':
      return { ...base, right: '-0.25rem', top: '0.75rem', transform: 'rotate(-45deg)', borderRight: border, borderBottom: border }
    case 'leftBottom':
      return { ...base, right: '-0.25rem', bottom: '0.75rem', transform: 'rotate(-45deg)', borderRight: border, borderBottom: border }
    case 'right':
      return { ...base, left: '-0.25rem', top: '50%', transform: 'translateY(-50%) rotate(135deg)', borderRight: border, borderBottom: border }
    case 'rightTop':
      return { ...base, left: '-0.25rem', top: '0.75rem', transform: 'rotate(135deg)', borderRight: border, borderBottom: border }
    case 'rightBottom':
      return { ...base, left: '-0.25rem', bottom: '0.75rem', transform: 'rotate(135deg)', borderRight: border, borderBottom: border }
  }
}

function flipPlacement(p: StandardPlacement): StandardPlacement {
  if (p === 'top') return 'bottom'
  if (p === 'topLeft') return 'bottomLeft'
  if (p === 'topRight') return 'bottomRight'
  if (p === 'bottom') return 'top'
  if (p === 'bottomLeft') return 'topLeft'
  if (p === 'bottomRight') return 'topRight'
  if (p === 'left') return 'right'
  if (p === 'leftTop') return 'rightTop'
  if (p === 'leftBottom') return 'rightBottom'
  if (p === 'right') return 'left'
  if (p === 'rightTop') return 'leftTop'
  if (p === 'rightBottom') return 'leftBottom'
  return p
}

// ─── Close Icon ─────────────────────────────────────────────────────────────────

function DefaultCloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Mask ID ────────────────────────────────────────────────────────────────────

let tourMaskIdCounter = 0

// ─── Helpers ────────────────────────────────────────────────────────────────────

function resolveTarget(target: TourStepConfig['target']): HTMLElement | null {
  if (!target) return null
  if (typeof target === 'function') return target()
  return target
}

interface SpotlightRect {
  left: number
  top: number
  width: number
  height: number
  right: number
  bottom: number
}

function computeSpotlight(
  targetRect: DOMRect,
  gapOffset: [number, number],
): SpotlightRect {
  return {
    left: targetRect.left - gapOffset[0],
    top: targetRect.top - gapOffset[1],
    width: targetRect.width + gapOffset[0] * 2,
    height: targetRect.height + gapOffset[1] * 2,
    right: targetRect.right + gapOffset[0],
    bottom: targetRect.bottom + gapOffset[1],
  }
}

// ─── Tour Component ─────────────────────────────────────────────────────────────

export function Tour({
  steps = [],
  open,
  current,
  onChange,
  onClose,
  onFinish,
  mask: maskProp = true,
  arrow: arrowProp = true,
  type: typeProp = 'default',
  placement: placementProp = 'bottom',
  gap,
  closeIcon,
  disabledInteraction = false,
  scrollIntoViewOptions: scrollProp = true,
  indicatorsRender,
  actionsRender,
  zIndex = 1001,
  classNames,
  styles,
}: TourProps) {
  // ── State ──
  const [internalCurrent, setInternalCurrent] = useState(0)
  const currentStep = current ?? internalCurrent
  const isControlled = current !== undefined

  // Reset to step 0 when reopening (uncontrolled mode)
  const prevOpenRef = useRef(false)
  useEffect(() => {
    if (open && !prevOpenRef.current && !isControlled) {
      setInternalCurrent(0)
    }
    prevOpenRef.current = !!open
  }, [open, isControlled])

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [resolvedPlacement, setResolvedPlacement] = useState<TourPlacement>(placementProp)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const popupRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLElement | null>(null)
  const noTransitionRef = useRef(true)
  const flipCheckedRef = useRef(false)
  const maskIdRef = useRef(`j-tour-mask-${++tourMaskIdCounter}`)
  const rafRef = useRef<number>(0)

  // ── Resolve current step config ──
  const stepConfig = steps[currentStep] as TourStepConfig | undefined
  const resolvedType = stepConfig?.type ?? typeProp
  const isPrimary = resolvedType === 'primary'
  const resolvedMask = stepConfig?.mask ?? maskProp
  const showMask = resolvedMask !== false
  const resolvedArrow = stepConfig?.arrow ?? arrowProp
  const resolvedStepPlacement = stepConfig?.placement ?? placementProp
  const resolvedScroll = stepConfig?.scrollIntoViewOptions ?? scrollProp
  const isLastStep = currentStep === steps.length - 1
  const total = steps.length

  // ── Gap ──
  const gapOffsetRaw = gap?.offset ?? 6
  const gapOffset: [number, number] = Array.isArray(gapOffsetRaw)
    ? gapOffsetRaw
    : [gapOffsetRaw, gapOffsetRaw]
  const gapRadius = gap?.radius ?? 2

  // ── Mask color ──
  const maskColor = typeof resolvedMask === 'object' && resolvedMask.color
    ? resolvedMask.color
    : 'rgba(0,0,0,0.45)'
  const maskStyle = typeof resolvedMask === 'object' ? resolvedMask.style : undefined

  // ── Compute spotlight rect ──
  const spotlight = targetRect ? computeSpotlight(targetRect, gapOffset) : null

  // ── Positioning ──
  const updatePosition = useCallback((tRect: DOMRect | null, pl: TourPlacement) => {
    if (!tRect || pl === 'center') {
      // Center on target or viewport
      if (tRect) {
        setCoords({
          top: tRect.top + tRect.height / 2,
          left: tRect.left + tRect.width / 2,
        })
      } else {
        setCoords({
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
        })
      }
      return
    }

    // Create a DOMRect-like from spotlight for getCoords
    const sr = computeSpotlight(tRect, gapOffset)
    const fakeRect = {
      left: sr.left,
      top: sr.top,
      right: sr.right,
      bottom: sr.bottom,
      width: sr.width,
      height: sr.height,
      x: sr.left,
      y: sr.top,
      toJSON() { return this },
    } as DOMRect

    setCoords(getCoords(fakeRect, pl as StandardPlacement))
  }, [gapOffset])

  // ── Target resolution + scroll into view ──
  useEffect(() => {
    if (!open || !stepConfig) {
      setTargetRect(null)
      targetRef.current = null
      return
    }

    const el = resolveTarget(stepConfig.target)
    targetRef.current = el

    if (el) {
      // Scroll into view
      if (resolvedScroll) {
        const opts = typeof resolvedScroll === 'object'
          ? resolvedScroll
          : { block: 'center' as const, behavior: 'instant' as const }
        el.scrollIntoView(opts)
      }

      // Small delay to let scroll settle before measuring
      const timer = window.setTimeout(() => {
        const rect = el.getBoundingClientRect()
        setTargetRect(rect)

        const pl = resolvedStepPlacement
        setResolvedPlacement(pl)
        flipCheckedRef.current = false
        noTransitionRef.current = true
        updatePosition(rect, pl)

        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            noTransitionRef.current = false
            setIsAnimating(true)
          })
        })
      }, 50)

      return () => {
        window.clearTimeout(timer)
        cancelAnimationFrame(rafRef.current)
      }
    } else {
      setTargetRect(null)
      setResolvedPlacement('center')
      flipCheckedRef.current = false
      noTransitionRef.current = true
      updatePosition(null, 'center')

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          noTransitionRef.current = false
          setIsAnimating(true)
        })
      })

      return () => cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentStep])

  // ── Scroll/resize tracking ──
  useEffect(() => {
    if (!open || !targetRef.current) return
    const handle = () => {
      if (!targetRef.current) return
      const rect = targetRef.current.getBoundingClientRect()
      setTargetRect(rect)
      updatePosition(rect, resolvedPlacement)
    }
    window.addEventListener('scroll', handle, true)
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle, true)
      window.removeEventListener('resize', handle)
    }
  }, [open, currentStep, resolvedPlacement, updatePosition])

  // ── Auto-flip ──
  useLayoutEffect(() => {
    if (!open || resolvedPlacement === 'center' || flipCheckedRef.current || !popupRef.current || !targetRect) return
    flipCheckedRef.current = true

    const popupRect = popupRef.current.getBoundingClientRect()
    const sp = resolvedPlacement as StandardPlacement

    const isTop = sp.startsWith('top')
    const isBottom = sp.startsWith('bottom')
    const isLeft = sp.startsWith('left')
    const isRight = sp.startsWith('right')

    let shouldFlip = false

    if (isTop && popupRect.top < 0) {
      const spaceBelow = window.innerHeight - targetRect.bottom
      if (spaceBelow > targetRect.top) shouldFlip = true
    } else if (isBottom && popupRect.bottom > window.innerHeight) {
      const spaceAbove = targetRect.top
      if (spaceAbove > window.innerHeight - targetRect.bottom) shouldFlip = true
    } else if (isLeft && popupRect.left < 0) {
      const spaceRight = window.innerWidth - targetRect.right
      if (spaceRight > targetRect.left) shouldFlip = true
    } else if (isRight && popupRect.right > window.innerWidth) {
      const spaceLeft = targetRect.left
      if (spaceLeft > window.innerWidth - targetRect.right) shouldFlip = true
    }

    if (shouldFlip) {
      const flipped = flipPlacement(sp)
      setResolvedPlacement(flipped)
      updatePosition(targetRect, flipped)
    }
  })

  // ── Navigation ──
  const fadeTimerRef = useRef<number>(0)

  const goTo = useCallback((step: number) => {
    // Fade out first, then change step after transition completes
    setIsAnimating(false)
    window.clearTimeout(fadeTimerRef.current)
    fadeTimerRef.current = window.setTimeout(() => {
      if (!isControlled) setInternalCurrent(step)
      onChange?.(step)
    }, 150) // matches opacity transition duration
  }, [isControlled, onChange])

  const handleClose = useCallback(() => {
    setIsAnimating(false)
    onClose?.(currentStep)
  }, [currentStep, onClose])

  const handlePrev = useCallback(() => {
    if (stepConfig?.prevButtonProps?.onClick) {
      stepConfig.prevButtonProps.onClick()
    } else if (currentStep > 0) {
      goTo(currentStep - 1)
    }
  }, [currentStep, stepConfig, goTo])

  const handleNext = useCallback(() => {
    stepConfig?.nextButtonProps?.onClick?.()
    if (isLastStep) {
      onFinish?.()
      handleClose()
    } else {
      goTo(currentStep + 1)
    }
  }, [currentStep, isLastStep, stepConfig, goTo, onFinish, handleClose])

  // ── Cleanup fade timer ──
  useEffect(() => () => { window.clearTimeout(fadeTimerRef.current) }, [])

  // ── Early return ──
  if (!open || !stepConfig || typeof document === 'undefined') return null

  // ── Arrow ──
  const showArrow = resolvedPlacement !== 'center' && !!targetRect && resolvedArrow !== false

  const arrowBg = isPrimary ? tokens.colorPrimary : tokens.colorBg
  const arrowBorder = isPrimary ? 'transparent' : tokens.colorBorder

  const arrowComputedStyle: CSSProperties | undefined = showArrow
    ? {
        ...getArrowStyle(resolvedPlacement as StandardPlacement, arrowBg, arrowBorder),
        ...styles?.arrow,
      }
    : undefined

  // ── Popup transform ──
  const isCenter = resolvedPlacement === 'center'
  const popupTransform = isCenter
    ? `translate(-50%, -50%) ${isAnimating ? '' : 'translateY(6px)'}`
    : getTransform(resolvedPlacement as StandardPlacement, isAnimating)

  // ── Type-based styles ──
  const cardStyle: CSSProperties = isPrimary
    ? {
        backgroundColor: tokens.colorPrimary,
        color: '#fff',
        borderRadius: '0.5rem',
        boxShadow: tokens.shadowLg,
        padding: '1rem',
        minWidth: '16rem',
        maxWidth: '22rem',
        position: 'relative',
      }
    : {
        backgroundColor: tokens.colorBg,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: '0.5rem',
        boxShadow: tokens.shadowLg,
        padding: '1rem',
        minWidth: '16rem',
        maxWidth: '22rem',
        position: 'relative',
      }

  const titleStyle: CSSProperties = {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: isPrimary ? '#fff' : tokens.colorText,
    marginRight: closeIcon !== false ? '1.5rem' : 0,
  }

  const descriptionStyle: CSSProperties = {
    fontSize: '0.8125rem',
    color: isPrimary ? 'rgba(255,255,255,0.85)' : tokens.colorTextMuted,
    marginTop: stepConfig.title ? '0.25rem' : 0,
    lineHeight: 1.5,
  }

  const footerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.75rem',
    gap: '0.5rem',
  }

  const closeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    padding: '0.125rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: isPrimary ? 'rgba(255,255,255,0.65)' : tokens.colorTextMuted,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.25rem',
    lineHeight: 1,
  }

  const coverStyle: CSSProperties = {
    marginBottom: '0.75rem',
    borderRadius: '0.25rem',
    overflow: 'hidden',
  }

  // ── Indicators ──
  const indicatorDots = indicatorsRender
    ? indicatorsRender(currentStep, total)
    : (
      <div
        className={classNames?.indicators}
        style={mergeSemanticStyle({
          display: 'flex',
          gap: '0.375rem',
          alignItems: 'center',
        }, styles?.indicators)}
      >
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '50%',
              backgroundColor: i === currentStep
                ? (isPrimary ? '#fff' : tokens.colorPrimary)
                : (isPrimary ? 'rgba(255,255,255,0.3)' : tokens.colorBorder),
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </div>
    )

  // ── Prev/Next buttons ──
  const tourBtnBase: CSSProperties = {
    padding: '0.25rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    lineHeight: 1.5,
  }

  const showPrev = currentStep > 0 || !!stepConfig?.prevButtonProps
  const prevButton = showPrev && (
    isPrimary ? (
      <button
        type="button"
        style={{ ...tourBtnBase, border: '1px solid rgba(255,255,255,0.35)', background: 'transparent', color: '#fff' }}
        onClick={handlePrev}
      >
        {stepConfig.prevButtonProps?.children ?? 'Previous'}
      </button>
    ) : (
      <Button variant="outline" size="sm" onClick={handlePrev}>
        {stepConfig.prevButtonProps?.children ?? 'Previous'}
      </Button>
    )
  )

  const nextButton = isPrimary ? (
    <button
      type="button"
      style={{ ...tourBtnBase, border: 'none', background: '#fff', color: tokens.colorPrimary }}
      onClick={handleNext}
    >
      {stepConfig.nextButtonProps?.children ?? (isLastStep ? 'Finish' : 'Next')}
    </button>
  ) : (
    <Button variant="primary" size="sm" onClick={handleNext}>
      {stepConfig.nextButtonProps?.children ?? (isLastStep ? 'Finish' : 'Next')}
    </Button>
  )

  // ── Popup ──
  const popupContainerStyle: CSSProperties = {
    position: 'fixed',
    zIndex: zIndex + 1,
    top: coords.top,
    left: coords.left,
    opacity: isAnimating ? 1 : 0,
    transform: popupTransform,
    transition: noTransitionRef.current ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
    pointerEvents: isAnimating ? 'auto' : 'none',
  }

  // ── Render ──
  return createPortal(
    <>
      {/* Mask overlay */}
      {showMask && (
        <svg
          className={classNames?.mask}
          style={mergeSemanticStyle({
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex,
            pointerEvents: 'none',
            opacity: isAnimating ? 1 : 0,
            transition: 'opacity 0.2s ease-out',
          }, styles?.mask, maskStyle)}
        >
          <defs>
            <mask id={maskIdRef.current}>
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {spotlight && (
                <rect
                  x={spotlight.left}
                  y={spotlight.top}
                  width={spotlight.width}
                  height={spotlight.height}
                  rx={gapRadius}
                  ry={gapRadius}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={maskColor}
            mask={`url(#${maskIdRef.current})`}
          />
        </svg>
      )}

      {/* Disabled interaction blocker */}
      {disabledInteraction && spotlight && (
        <div
          style={{
            position: 'fixed',
            left: spotlight.left,
            top: spotlight.top,
            width: spotlight.width,
            height: spotlight.height,
            zIndex: zIndex + 1,
            pointerEvents: 'auto',
            background: 'transparent',
            cursor: 'not-allowed',
          }}
        />
      )}

      {/* Popup panel */}
      <div ref={popupRef} style={popupContainerStyle}>
        <div
          className={classNames?.popup}
          style={mergeSemanticStyle(cardStyle, styles?.popup)}
          role="dialog"
        >
          {/* Cover */}
          {stepConfig.cover && (
            <div
              className={classNames?.cover}
              style={mergeSemanticStyle(coverStyle, styles?.cover)}
            >
              {stepConfig.cover}
            </div>
          )}

          {/* Close button */}
          {closeIcon !== false && (
            <button
              className={classNames?.close}
              style={mergeSemanticStyle(closeButtonStyle, styles?.close)}
              onClick={handleClose}
              aria-label="Close"
              type="button"
            >
              {closeIcon ?? <DefaultCloseIcon />}
            </button>
          )}

          {/* Header / Title */}
          {stepConfig.title && (
            <div
              className={classNames?.title}
              style={mergeSemanticStyle(titleStyle, styles?.title)}
            >
              {stepConfig.title}
            </div>
          )}

          {/* Description */}
          {stepConfig.description && (
            <div
              className={classNames?.description}
              style={mergeSemanticStyle(descriptionStyle, styles?.description)}
            >
              {stepConfig.description}
            </div>
          )}

          {/* Footer */}
          {total > 0 && (
            <div
              className={classNames?.footer}
              style={mergeSemanticStyle(footerStyle, styles?.footer)}
            >
              {indicatorDots}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {actionsRender
                  ? actionsRender(
                      [prevButton, nextButton],
                      { current: currentStep, total, goTo, close: handleClose },
                    )
                  : <>{prevButton}{nextButton}</>
                }
              </div>
            </div>
          )}
        </div>

        {/* Arrow */}
        {showArrow && arrowComputedStyle && (
          <div className={classNames?.arrow} style={arrowComputedStyle} />
        )}
      </div>
    </>,
    document.body,
  )
}
