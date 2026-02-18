import {
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type SwitchSize = 'default' | 'small'
export type SwitchSemanticSlot = 'root' | 'track' | 'thumb' | 'inner'
export type SwitchClassNames = SemanticClassNames<SwitchSemanticSlot>
export type SwitchStyles = SemanticStyles<SwitchSemanticSlot>

export interface SwitchRef {
  focus: () => void
  blur: () => void
}

export interface SwitchProps {
  autoFocus?: boolean
  checked?: boolean
  checkedChildren?: ReactNode
  defaultChecked?: boolean
  defaultValue?: boolean
  disabled?: boolean
  loading?: boolean
  size?: SwitchSize
  unCheckedChildren?: ReactNode
  value?: boolean
  onChange?: (checked: boolean, event: MouseEvent) => void
  onClick?: (checked: boolean, event: MouseEvent) => void
  className?: string
  style?: CSSProperties
  classNames?: SwitchClassNames
  styles?: SwitchStyles
  tabIndex?: number
  id?: string
}

// ============================================================================
// Loading spinner
// ============================================================================

function SwitchSpinner({ size }: { size: SwitchSize }) {
  const d = size === 'small' ? 8 : 12
  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'j-spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={tokens.colorPrimary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
      />
    </svg>
  )
}

// ============================================================================
// Switch Component
// ============================================================================

function SwitchComponent(
  {
    autoFocus = false,
    checked: controlledChecked,
    checkedChildren,
    defaultChecked = false,
    defaultValue,
    disabled = false,
    loading = false,
    size = 'default',
    unCheckedChildren,
    value,
    onChange,
    onClick,
    className,
    style,
    classNames,
    styles: slotStyles,
    tabIndex,
    id,
  }: SwitchProps,
  ref: React.Ref<SwitchRef>,
) {
  // ---- Resolve aliases ----
  const resolvedControlled = value ?? controlledChecked
  const resolvedDefault = defaultValue ?? defaultChecked

  // ---- Controlled / uncontrolled ----
  const isControlled = resolvedControlled !== undefined
  const [internalChecked, setInternalChecked] = useState(resolvedDefault)
  const mergedChecked = isControlled ? resolvedControlled! : internalChecked

  const isDisabled = disabled || loading

  // ---- Refs ----
  const buttonRef = useRef<HTMLButtonElement>(null)
  const trackRef = useRef<HTMLSpanElement>(null)
  const mouseDownRef = useRef(false)

  // ---- Focus ----
  const [isFocused, setIsFocused] = useState(false)
  const [focusSource, setFocusSource] = useState<'mouse' | 'keyboard'>('keyboard')

  // ---- autoFocus ----
  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- useImperativeHandle ----
  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    blur: () => buttonRef.current?.blur(),
  }))

  // ---- Click handler ----
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return
    const newChecked = !mergedChecked
    if (!isControlled) {
      setInternalChecked(newChecked)
    }
    onChange?.(newChecked, e)
    onClick?.(newChecked, e)
  }

  // ---- Hover (ref-based, per MEMORY.md) ----
  const hasCustomColors = !!(slotStyles?.track && (
    'backgroundColor' in slotStyles.track || 'borderColor' in slotStyles.track || 'border' in slotStyles.track
  ))

  const handleMouseEnter = () => {
    if (isDisabled || !trackRef.current) return
    if (hasCustomColors) {
      trackRef.current.style.filter = 'brightness(1.15)'
    } else if (mergedChecked) {
      trackRef.current.style.backgroundColor = tokens.colorPrimaryHover
    } else {
      trackRef.current.style.backgroundColor = tokens.colorSecondary
    }
  }

  const handleMouseLeave = () => {
    if (isDisabled || !trackRef.current) return
    if (hasCustomColors) {
      trackRef.current.style.filter = ''
    } else if (mergedChecked) {
      trackRef.current.style.backgroundColor = tokens.colorPrimary
    } else {
      trackRef.current.style.backgroundColor = tokens.colorSecondary
    }
  }

  // ---- Dimensions (rem) ----
  const isSmall = size === 'small'
  const trackHeight = isSmall ? 1 : 1.375
  const trackMinWidth = isSmall ? 1.75 : 2.75
  const thumbSize = isSmall ? 0.75 : 1.125
  const thumbMargin = 0.125
  const hasChildren = checkedChildren !== undefined || unCheckedChildren !== undefined

  // ---- Styles ----
  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1,
    ...(isDisabled ? { opacity: 0.5 } : {}),
  }

  const trackStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    ...(hasChildren
      ? { minWidth: `${trackMinWidth}rem`, height: `${trackHeight}rem` }
      : { width: `${trackMinWidth}rem`, height: `${trackHeight}rem` }),
    borderRadius: `${trackHeight / 2}rem`,
    backgroundColor: mergedChecked ? tokens.colorPrimary : tokens.colorSecondary,
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: isFocused && !isDisabled && focusSource === 'keyboard'
      ? `0 0 0 2px ${tokens.colorPrimaryLight}`
      : 'none',
  }

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: `${thumbMargin}rem`,
    left: mergedChecked ? `calc(100% - ${thumbSize + thumbMargin}rem)` : `${thumbMargin}rem`,
    width: `${thumbSize}rem`,
    height: `${thumbSize}rem`,
    borderRadius: '50%',
    backgroundColor: tokens.colorBg,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    transition: 'left 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  }

  const innerPad = thumbSize + thumbMargin * 2
  const innerStyle: CSSProperties = {
    display: 'block',
    overflow: 'hidden',
    fontSize: isSmall ? '0.5625rem' : '0.75rem',
    color: '#fff',
    paddingLeft: `${mergedChecked ? (isSmall ? 0.375 : 0.5) : (innerPad + (isSmall ? 0.125 : 0.25))}rem`,
    paddingRight: `${mergedChecked ? (innerPad + (isSmall ? 0.125 : 0.25)) : (isSmall ? 0.375 : 0.5)}rem`,
    transition: 'padding 0.2s ease',
    lineHeight: `${trackHeight}rem`,
    whiteSpace: 'nowrap',
  }

  return (
    <>
      <style>{`@keyframes j-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="switch"
        aria-checked={mergedChecked}
        disabled={isDisabled}
        tabIndex={tabIndex}
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(rootStyle, slotStyles?.root, style)}
        onClick={handleClick}
        onMouseDown={() => {
          mouseDownRef.current = true
          setFocusSource('mouse')
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => {
          setFocusSource(mouseDownRef.current ? 'mouse' : 'keyboard')
          mouseDownRef.current = false
          setIsFocused(true)
        }}
        onBlur={() => setIsFocused(false)}
      >
        <span
          ref={trackRef}
          className={classNames?.track}
          style={mergeSemanticStyle(trackStyle, slotStyles?.track)}
        >
          {hasChildren && (
            <span
              className={classNames?.inner}
              style={mergeSemanticStyle(innerStyle, slotStyles?.inner)}
            >
              {mergedChecked ? checkedChildren : unCheckedChildren}
            </span>
          )}
          <span
            className={classNames?.thumb}
            style={mergeSemanticStyle(thumbStyle, slotStyles?.thumb)}
          >
            {loading && <SwitchSpinner size={size} />}
          </span>
        </span>
      </button>
    </>
  )
}

// ============================================================================
// Export
// ============================================================================

export const Switch = forwardRef<SwitchRef, SwitchProps>(SwitchComponent)
