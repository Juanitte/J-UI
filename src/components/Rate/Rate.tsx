import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { ReactNode, CSSProperties, KeyboardEvent } from 'react'
import { Tooltip } from '../Tooltip'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

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
// Size key map
// ============================================================================

const SIZE_KEY: Record<RateSize, string> = {
  small: 'sm',
  middle: 'md',
  large: 'lg',
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
    classNames: classNamesProp,
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

  // State
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const [hoverValue, setHoverValue] = useState(0)

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

  // Filled color: use custom character color or default warning
  const filledColor = styles?.character?.color as string | undefined

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
  const handleStarMouseEnter = (_index: number, value: number) => {
    if (disabled) return
    setHoverValue(value)
    onHoverChange?.(value)
  }

  const handleStarMouseLeave = (_index: number) => {
    if (disabled) return
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

  // ---- BEM classes ----
  const rootClass = cx(
    'ino-rate',
    `ino-rate--${SIZE_KEY[size]}`,
    {
      'ino-rate--disabled': disabled,
    },
    className,
    classNamesProp?.root,
  )

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      tabIndex={disabled ? -1 : 0}
      className={rootClass}
      style={{ ...styles?.root, ...style }}
      onMouseLeave={handleRootMouseLeave}
      onFocus={() => { onFocus?.() }}
      onBlur={() => { onBlur?.() }}
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

        const tooltipText = tooltips?.[index]

        // Dynamic styles for custom character color
        const bgCharDynamic: CSSProperties | undefined =
          filledColor && !starIsFull && !starIsHalf
            ? { color: filledColor, opacity: 0.25 }
            : filledColor
              ? { color: undefined } // let CSS handle it when there's no custom empty state
              : undefined

        const fgCharDynamic: CSSProperties | undefined = filledColor
          ? { color: filledColor }
          : undefined

        const fgClipClass = starIsFull
          ? 'ino-rate__char-fg--full'
          : starIsHalf
            ? 'ino-rate__char-fg--half'
            : 'ino-rate__char-fg--empty'

        const starClass = cx(
          'ino-rate__star',
          {
            'ino-rate__star--hovered': isHovered && !disabled,
          },
          classNamesProp?.star,
        )

        const starElement = (
          <div
            className={starClass}
            style={styles?.star}
            role="radio"
            aria-checked={displayValue >= i}
            aria-label={tooltipText ?? `${i} star${i > 1 ? 's' : ''}`}
          >
            {/* Background (empty) layer */}
            <span
              className={cx('ino-rate__char-bg', classNamesProp?.character)}
              style={{ ...bgCharDynamic, ...styles?.character }}
            >
              {resolveCharacter(index)}
            </span>

            {/* Foreground (filled) layer */}
            <span
              className={cx('ino-rate__char-fg', fgClipClass, classNamesProp?.character)}
              style={{ ...fgCharDynamic, ...styles?.character }}
            >
              {resolveCharacter(index)}
            </span>

            {/* Invisible click/hover targets */}
            {allowHalf ? (
              <>
                <div
                  className="ino-rate__hit ino-rate__hit--left"
                  onMouseEnter={() => handleStarMouseEnter(index, i - 0.5)}
                  onMouseLeave={() => handleStarMouseLeave(index)}
                  onClick={() => handleStarClick(i - 0.5)}
                />
                <div
                  className="ino-rate__hit ino-rate__hit--right"
                  onMouseEnter={() => handleStarMouseEnter(index, i)}
                  onMouseLeave={() => handleStarMouseLeave(index)}
                  onClick={() => handleStarClick(i)}
                />
              </>
            ) : (
              <div
                className="ino-rate__hit ino-rate__hit--full"
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
