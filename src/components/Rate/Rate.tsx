import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { ReactNode, CSSProperties, KeyboardEvent } from 'react'
import { tokens } from '../../theme/tokens'
import { Tooltip } from '../Tooltip'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type RateSize = 'small' | 'middle' | 'large'
export type RateSemanticSlot = 'root' | 'star' | 'character'
export type RateClassNames = SemanticClassNames<RateSemanticSlot>
export type RateStyles = SemanticStyles<RateSemanticSlot>

export interface RateRef {
  focus: () => void
  blur: () => void
}

export interface RateProps {
  /** Allow clearing by clicking the same value again (default: true) */
  allowClear?: boolean
  /** Allow half-star selection (default: false) */
  allowHalf?: boolean
  /** Auto focus on mount */
  autoFocus?: boolean
  /** Custom character, default is a filled star SVG */
  character?: ReactNode | ((index: number) => ReactNode)
  /** Total number of stars (default: 5) */
  count?: number
  /** Default value for uncontrolled mode (default: 0) */
  defaultValue?: number
  /** Disable interaction (read-only display) */
  disabled?: boolean
  /** Size of the stars (default: 'middle') */
  size?: RateSize
  /** Tooltip text for each star */
  tooltips?: string[]
  /** Current value (controlled) */
  value?: number
  /** Root inline styles */
  style?: CSSProperties
  /** Root CSS class */
  className?: string
  /** Semantic slot classes */
  classNames?: RateClassNames
  /** Semantic slot styles */
  styles?: RateStyles
  /** Blur callback */
  onBlur?: () => void
  /** Value change callback */
  onChange?: (value: number) => void
  /** Focus callback */
  onFocus?: () => void
  /** Hover value change callback */
  onHoverChange?: (value: number) => void
  /** Keydown callback */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
}

// ============================================================================
// Star Icon
// ============================================================================

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      style={{ display: 'block' }}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// ============================================================================
// Size Config
// ============================================================================

const sizeConfig: Record<RateSize, { fontSize: string; gap: string }> = {
  small:  { fontSize: '0.875rem', gap: '0.25rem' },
  middle: { fontSize: '1.25rem', gap: '0.5rem' },
  large:  { fontSize: '2rem', gap: '0.625rem' },
}

// ============================================================================
// Rate Component
// ============================================================================

function RateComponent(
  {
    allowClear = true,
    allowHalf = false,
    autoFocus = false,
    character,
    count = 5,
    defaultValue = 0,
    disabled = false,
    size = 'middle',
    tooltips,
    value: controlledValue,
    style,
    className,
    classNames,
    styles,
    onBlur,
    onChange,
    onFocus,
    onHoverChange,
    onKeyDown,
  }: RateProps,
  ref: React.Ref<RateRef>,
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const starRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')

  // State
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const [hoverValue, setHoverValue] = useState(0)
  const [isFocused, setIsFocused] = useState(false)

  const displayValue = hoverValue > 0 ? hoverValue : currentValue

  // Imperative handle
  useImperativeHandle(ref, () => ({
    focus: () => rootRef.current?.focus(),
    blur: () => rootRef.current?.blur(),
  }))

  // autoFocus
  useEffect(() => {
    if (autoFocus && rootRef.current) {
      rootRef.current.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Character resolution
  const resolveCharacter = (index: number): ReactNode => {
    if (typeof character === 'function') return character(index)
    if (character) return character
    return <StarIcon />
  }

  // Fill state helpers
  const isFull = (index: number): boolean => displayValue >= index + 1
  const isHalf = (index: number): boolean =>
    allowHalf && displayValue >= index + 0.5 && displayValue < index + 1

  // Custom color detection (for ref-based hover glow)
  const hasCustomColors = !!(
    (styles?.character && 'color' in styles.character) ||
    (styles?.star && ('color' in styles.star || 'backgroundColor' in styles.star))
  )

  // Filled color: use custom character color or default warning
  const filledColor = styles?.character?.color as string | undefined
  const emptyColor = filledColor ? undefined : tokens.colorBorder

  // Click handler
  const handleStarClick = (starValue: number) => {
    if (disabled) return

    let newValue = starValue
    if (allowClear && starValue === currentValue) {
      newValue = 0
    }

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  // Hover handlers
  const handleStarMouseEnter = (index: number, value: number) => {
    if (disabled) return
    setHoverValue(value)
    onHoverChange?.(value)

    // Ref-based glow on specific star
    const el = starRefs.current[index]
    if (el && hasCustomColors) {
      el.style.filter = 'brightness(1.15)'
    }
  }

  const handleStarMouseLeave = (index: number) => {
    if (disabled) return
    const el = starRefs.current[index]
    if (el && hasCustomColors) {
      el.style.filter = ''
    }
  }

  const handleRootMouseLeave = () => {
    if (disabled) return
    setHoverValue(0)
    onHoverChange?.(0)
  }

  // Keyboard handler
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    onKeyDown?.(e)

    const step = allowHalf ? 0.5 : 1

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp': {
        e.preventDefault()
        const next = Math.min(currentValue + step, count)
        if (!isControlled) setInternalValue(next)
        onChange?.(next)
        break
      }
      case 'ArrowLeft':
      case 'ArrowDown': {
        e.preventDefault()
        const next = Math.max(currentValue - step, 0)
        if (!isControlled) setInternalValue(next)
        onChange?.(next)
        break
      }
    }
  }

  // ---- Styles ----

  const sc = sizeConfig[size]

  const rootStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sc.gap,
    cursor: disabled ? 'default' : 'pointer',
    userSelect: 'none',
    outline: 'none',
    lineHeight: 1,
    fontSize: sc.fontSize,
    ...(disabled ? { opacity: 0.5 } : {}),
    boxShadow: isFocused && !disabled && focusSourceRef.current === 'keyboard'
      ? `0 0 0 2px ${tokens.colorPrimaryLight}`
      : 'none',
    borderRadius: '0.25rem',
    padding: '0.125rem',
  }

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      tabIndex={disabled ? -1 : 0}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootStyle, styles?.root, style)}
      onMouseLeave={handleRootMouseLeave}
      onMouseDown={() => { mouseDownRef.current = true }}
      onFocus={() => {
        focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
        mouseDownRef.current = false
        setIsFocused(true)
        onFocus?.()
      }}
      onBlur={() => {
        setIsFocused(false)
        onBlur?.()
      }}
      onKeyDown={handleKeyDown}
      aria-valuenow={currentValue}
      aria-valuemin={0}
      aria-valuemax={count}
    >
      {Array.from({ length: count }, (_, index) => {
        const starIsFull = isFull(index)
        const starIsHalf = isHalf(index)
        const isHovered = hoverValue > 0 && Math.ceil(hoverValue) === index + 1
        const i = index + 1 // 1-based

        const starWrapperStyle: CSSProperties = {
          position: 'relative',
          display: 'inline-flex',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'transform 0.15s ease',
          transform: isHovered && !disabled ? 'scale(1.15)' : 'scale(1)',
        }

        const bgCharStyle: CSSProperties = {
          display: 'inline-flex',
          color: emptyColor,
          transition: 'color 0.2s ease',
          ...(filledColor && !starIsFull && !starIsHalf ? { color: filledColor, opacity: 0.25 } : {}),
        }

        const fgCharStyle: CSSProperties = {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          color: filledColor || tokens.colorWarning,
          clipPath: starIsFull ? 'inset(0 0% 0 0)' : starIsHalf ? 'inset(0 50% 0 0)' : 'inset(0 100% 0 0)',
          transition: 'color 0.2s ease, clip-path 0.15s ease',
          pointerEvents: 'none',
        }

        const hitAreaBase: CSSProperties = {
          position: 'absolute',
          top: 0,
          height: '100%',
          zIndex: 1,
          cursor: 'inherit',
        }

        const tooltipText = tooltips?.[index]

        const starElement = (
          <div
            ref={(el) => { starRefs.current[index] = el }}
            className={classNames?.star}
            style={mergeSemanticStyle(starWrapperStyle, styles?.star)}
            role="radio"
            aria-checked={displayValue >= i}
            aria-label={tooltipText ?? `${i} star${i > 1 ? 's' : ''}`}
          >
            {/* Background (empty) layer */}
            <span
              className={classNames?.character}
              style={mergeSemanticStyle(bgCharStyle, styles?.character)}
            >
              {resolveCharacter(index)}
            </span>

            {/* Foreground (filled) layer — always rendered for smooth width transition */}
            <span
              className={classNames?.character}
              style={mergeSemanticStyle(fgCharStyle, styles?.character)}
            >
              {resolveCharacter(index)}
            </span>

            {/* Invisible click/hover targets */}
            {allowHalf ? (
              <>
                <div
                  style={{ ...hitAreaBase, left: 0, width: '50%' }}
                  onMouseEnter={() => handleStarMouseEnter(index, i - 0.5)}
                  onMouseLeave={() => handleStarMouseLeave(index)}
                  onClick={() => handleStarClick(i - 0.5)}
                />
                <div
                  style={{ ...hitAreaBase, right: 0, width: '50%' }}
                  onMouseEnter={() => handleStarMouseEnter(index, i)}
                  onMouseLeave={() => handleStarMouseLeave(index)}
                  onClick={() => handleStarClick(i)}
                />
              </>
            ) : (
              <div
                style={{ ...hitAreaBase, left: 0, width: '100%' }}
                onMouseEnter={() => handleStarMouseEnter(index, i)}
                onMouseLeave={() => handleStarMouseLeave(index)}
                onClick={() => handleStarClick(i)}
              />
            )}
          </div>
        )

        return tooltipText ? (
          <Tooltip key={index} content={tooltipText}>
            {starElement}
          </Tooltip>
        ) : (
          <span key={index}>{starElement}</span>
        )
      })}
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export const Rate = forwardRef(RateComponent)
