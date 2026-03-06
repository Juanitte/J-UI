import { type ReactNode, type CSSProperties, useRef, useState, useEffect, useCallback } from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

// ============================================================================
// Types
// ============================================================================

export type AffixSemanticSlot = 'root' | 'affix'
export type AffixClassNames = SemanticClassNames<AffixSemanticSlot>
export type AffixStyles = SemanticStyles<AffixSemanticSlot>

export interface AffixProps {
  /** Offset in px from the top of the container when fixed at top. Default: 0 if neither offset is set. */
  offsetTop?: number
  /** Offset in px from the bottom of the container when fixed at bottom. offsetTop takes priority if both are set. */
  offsetBottom?: number
  /** Returns the scrollable container element (default: window) */
  target?: () => HTMLElement | Window
  /** Called when the affixed state changes */
  onChange?: (affixed: boolean) => void
  /** Content to affix */
  children?: ReactNode

  className?: string
  style?: CSSProperties
  classNames?: AffixClassNames
  styles?: AffixStyles
}

// ============================================================================
// Internal types
// ============================================================================

interface FixedState {
  position: 'top' | 'bottom'
  top?: number
  bottom?: number
  left: number
  width: number
  height: number
}

// ============================================================================
// Affix Component
// ============================================================================

export function Affix({
  offsetTop,
  offsetBottom,
  target,
  onChange,
  children,
  className,
  style,
  classNames,
  styles,
}: AffixProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [fixedState, setFixedState] = useState<FixedState | null>(null)

  const update = useCallback(() => {
    if (!wrapperRef.current || !contentRef.current) return

    const container = target?.() ?? window
    const wrapperRect = wrapperRef.current.getBoundingClientRect()

    let containerTop: number
    let containerBottom: number
    if (container === window) {
      containerTop = 0
      containerBottom = window.innerHeight
    } else {
      const r = (container as HTMLElement).getBoundingClientRect()
      containerTop = r.top
      containerBottom = r.bottom
    }

    // If neither prop is set, default to offsetTop = 0
    const resolvedOffsetTop = offsetTop ?? (offsetBottom === undefined ? 0 : undefined)

    const shouldFixTop =
      resolvedOffsetTop !== undefined &&
      wrapperRect.top - containerTop <= resolvedOffsetTop

    const shouldFixBottom =
      !shouldFixTop &&
      offsetBottom !== undefined &&
      containerBottom - wrapperRect.bottom <= offsetBottom

    if (shouldFixTop) {
      const next: FixedState = {
        position: 'top',
        top: containerTop + resolvedOffsetTop!,
        left: wrapperRect.left,
        width: wrapperRect.width,
        height: wrapperRect.height,
      }
      setFixedState((prev) => {
        if (!prev) onChange?.(true)
        return next
      })
    } else if (shouldFixBottom) {
      const next: FixedState = {
        position: 'bottom',
        bottom: window.innerHeight - containerBottom + offsetBottom!,
        left: wrapperRect.left,
        width: wrapperRect.width,
        height: wrapperRect.height,
      }
      setFixedState((prev) => {
        if (!prev) onChange?.(true)
        return next
      })
    } else {
      setFixedState((prev) => {
        if (prev) onChange?.(false)
        return null
      })
    }
  }, [target, offsetTop, offsetBottom, onChange])

  useEffect(() => {
    const container = target?.() ?? window
    container.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    // When using a custom target, also update on page scroll so the affixed
    // element tracks the container as it moves within the page
    if (container !== window) {
      window.addEventListener('scroll', update, { passive: true })
    }
    update()
    return () => {
      container.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (container !== window) {
        window.removeEventListener('scroll', update)
      }
    }
  }, [update, target])

  // Dynamic: wrapper height placeholder, content position values
  const wrapperDynamicStyle: CSSProperties = {
    ...(fixedState ? { height: fixedState.height } : {}),
    ...styles?.root,
    ...style,
  }

  const contentDynamicStyle: CSSProperties = fixedState
    ? {
        top: fixedState.top,
        bottom: fixedState.bottom,
        left: fixedState.left,
        width: fixedState.width,
        ...styles?.affix,
      }
    : { ...styles?.affix }

  return (
    <div
      ref={wrapperRef}
      className={cx(className, classNames?.root)}
      style={wrapperDynamicStyle}
    >
      <div
        ref={contentRef}
        className={cx(
          { 'ino-affix__content--fixed': !!fixedState },
          classNames?.affix,
        )}
        style={contentDynamicStyle}
      >
        {children}
      </div>
    </div>
  )
}
