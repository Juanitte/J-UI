import {
  type ReactNode,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  useEffect,
  forwardRef,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { InputSize, InputVariant, InputStatus } from '../Input'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type InputNumberSemanticSlot = 'root' | 'input' | 'prefix' | 'suffix' | 'handler' | 'handlerUp' | 'handlerDown' | 'addon'
export type InputNumberClassNames = SemanticClassNames<InputNumberSemanticSlot>
export type InputNumberStyles = SemanticStyles<InputNumberSemanticSlot>

export interface InputNumberRef {
  focus: (options?: { preventScroll?: boolean; cursor?: 'start' | 'end' | 'all' }) => void
  blur: () => void
  input: HTMLInputElement | null
  nativeElement: HTMLDivElement | null
}

export interface InputNumberProps {
  value?: number | string | null
  defaultValue?: number | string | null
  onChange?: (value: number | string | null) => void
  onStep?: (value: number, info: { offset: number; type: 'up' | 'down' }) => void
  onPressEnter?: (e: KeyboardEvent<HTMLInputElement>) => void
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void

  min?: number
  max?: number
  step?: number
  precision?: number
  formatter?: (value: string | number | undefined, info: { userTyping: boolean; input: string }) => string
  parser?: (displayValue: string | undefined) => number | string
  controls?: boolean | { upIcon?: ReactNode; downIcon?: ReactNode }
  keyboard?: boolean
  changeOnWheel?: boolean
  changeOnBlur?: boolean
  stringMode?: boolean
  decimalSeparator?: string

  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  id?: string
  autoFocus?: boolean
  name?: string
  tabIndex?: number
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  prefix?: ReactNode
  suffix?: ReactNode
  addonBefore?: ReactNode
  addonAfter?: ReactNode

  className?: string
  style?: CSSProperties
  classNames?: InputNumberClassNames
  styles?: InputNumberStyles
}

// ============================================================================
// Icons
// ============================================================================

function ChevronUpIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ============================================================================
// Helpers
// ============================================================================

const sizeConfig: Record<InputSize, { height: string; fontSize: string; paddingH: string; paddingV: string; radius: string }> = {
  small:  { height: '1.5rem', fontSize: '0.75rem', paddingH: '0.5rem',  paddingV: '0.25rem', radius: '0.25rem' },
  middle: { height: '2rem',   fontSize: '0.875rem', paddingH: '0.75rem', paddingV: '0.5rem',  radius: '0.375rem' },
  large:  { height: '2.5rem', fontSize: '1rem',     paddingH: '0.75rem', paddingV: '0.5rem',  radius: '0.5rem' },
}

function getVariantStyles(variant: InputVariant, radius: string): CSSProperties {
  switch (variant) {
    case 'outlined':
      return { border: `1px solid ${tokens.colorBorder}`, backgroundColor: tokens.colorBg, borderRadius: radius }
    case 'filled':
      return { border: '1px solid transparent', backgroundColor: tokens.colorBgMuted, borderRadius: radius }
    case 'borderless':
      return { border: '1px solid transparent', backgroundColor: 'transparent', borderRadius: radius }
    case 'underlined':
      return { border: 'none', borderBottom: `1px solid ${tokens.colorBorder}`, borderRadius: 0, backgroundColor: 'transparent' }
  }
}

function getStatusBorderColor(status?: InputStatus): string | undefined {
  if (status === 'error') return tokens.colorError
  if (status === 'warning') return tokens.colorWarning
  return undefined
}

function getFocusRingColor(status?: InputStatus): string {
  if (status === 'error') return tokens.colorErrorBg
  if (status === 'warning') return tokens.colorWarningBg
  return tokens.colorPrimaryLight
}

function getFocusBorderColor(status?: InputStatus): string {
  if (status === 'error') return tokens.colorError
  if (status === 'warning') return tokens.colorWarning
  return tokens.colorPrimary
}

/** Get precision from a step value (e.g. 0.01 → 2) */
function getStepPrecision(step: number): number {
  const str = String(step)
  const dotIndex = str.indexOf('.')
  return dotIndex >= 0 ? str.length - dotIndex - 1 : 0
}

/** Round a number to a given precision */
function toPrecision(num: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.round(num * factor) / factor
}

/** Safe addition avoiding floating-point issues */
function safeAdd(a: number, b: number, precision: number): number {
  return toPrecision(a + b, precision)
}

// ============================================================================
// InputNumber Component
// ============================================================================

export const InputNumber = forwardRef<InputNumberRef, InputNumberProps>(function InputNumberInner(props, ref) {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    onStep,
    onPressEnter,
    onFocus,
    onBlur,

    min = -Infinity,
    max = Infinity,
    step = 1,
    precision: precisionProp,
    formatter,
    parser,
    controls = true,
    keyboard = true,
    changeOnWheel = false,
    changeOnBlur = true,
    stringMode = false,
    decimalSeparator,

    placeholder,
    disabled = false,
    readOnly = false,
    id,
    autoFocus = false,
    name,
    tabIndex,
    size = 'middle',
    variant = 'outlined',
    status,
    prefix,
    suffix,
    addonBefore,
    addonAfter,

    className,
    style,
    classNames,
    styles,
  } = props

  // ---- Refs ----
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const handlerRef = useRef<HTMLDivElement>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const userTypingRef = useRef(false)

  // ---- State ----
  const isControlled = controlledValue !== undefined
  const [isFocused, setIsFocused] = useState(false)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')

  // Resolve precision: explicit > inferred from step
  const resolvedPrecision = precisionProp ?? getStepPrecision(step)

  // Get numeric value from controlled/default
  const getNumericValue = useCallback((val: number | string | null | undefined): number | null => {
    if (val === null || val === undefined || val === '') return null
    const num = typeof val === 'string' ? parseFloat(val) : val
    return isNaN(num) ? null : num
  }, [])

  // Format a numeric value for display
  const formatValue = useCallback((val: number | string | null | undefined, userTyping = false): string => {
    if (val === null || val === undefined || val === '') return ''
    let strVal = typeof val === 'number' ? String(val) : val
    // Apply precision formatting when not actively typing
    if (precisionProp !== undefined && !userTyping) {
      const num = typeof val === 'number' ? val : parseFloat(val as string)
      if (!isNaN(num)) strVal = num.toFixed(precisionProp)
    }
    if (formatter) {
      return formatter(val, { userTyping, input: strVal })
    }
    let result = strVal
    if (decimalSeparator && typeof result === 'string') {
      result = result.replace('.', decimalSeparator)
    }
    return result
  }, [formatter, decimalSeparator, precisionProp])

  // Parse display string back to number/string
  const parseValue = useCallback((displayVal: string): number | string => {
    if (parser) {
      return parser(displayVal)
    }
    let cleaned = displayVal
    if (decimalSeparator) {
      cleaned = cleaned.replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.')
    }
    // Strip non-numeric chars except . - and e
    cleaned = cleaned.replace(/[^\d.\-e]/gi, '')
    return cleaned
  }, [parser, decimalSeparator])

  // Current numeric value
  const currentNumeric = getNumericValue(isControlled ? controlledValue : undefined)

  // Display value state
  const [displayValue, setDisplayValue] = useState(() => {
    const initial = isControlled ? controlledValue : defaultValue
    return formatValue(initial)
  })

  // Sync display when controlled value changes externally
  useEffect(() => {
    if (isControlled && !userTypingRef.current) {
      setDisplayValue(formatValue(controlledValue))
    }
  }, [controlledValue, isControlled, formatValue])

  // ---- Imperative handle ----
  useImperativeHandle(ref, () => ({
    focus: (options) => {
      inputRef.current?.focus(options)
      if (options?.cursor && inputRef.current) {
        const len = inputRef.current.value.length
        switch (options.cursor) {
          case 'start': inputRef.current.setSelectionRange(0, 0); break
          case 'end': inputRef.current.setSelectionRange(len, len); break
          case 'all': inputRef.current.setSelectionRange(0, len); break
        }
      }
    },
    blur: () => inputRef.current?.blur(),
    input: inputRef.current,
    nativeElement: rootRef.current,
  }))

  // ---- Commit value ----
  const commitValue = useCallback((rawVal: string) => {
    if (rawVal === '' || rawVal === '-') {
      if (isControlled) {
        setDisplayValue(formatValue(controlledValue))
      } else {
        setDisplayValue('')
      }
      onChange?.(null)
      return
    }

    const parsed = parseValue(rawVal)
    let num = typeof parsed === 'string' ? parseFloat(parsed) : parsed
    if (isNaN(num)) {
      // Revert to previous value
      if (isControlled) {
        setDisplayValue(formatValue(controlledValue))
      }
      return
    }

    // Clamp
    num = Math.max(min, Math.min(max, num))
    // Precision
    num = toPrecision(num, resolvedPrecision)

    const outValue = stringMode ? num.toFixed(resolvedPrecision) : num
    onChange?.(outValue)
    if (!isControlled) {
      setDisplayValue(formatValue(num))
    }
  }, [parseValue, min, max, resolvedPrecision, stringMode, onChange, isControlled, controlledValue, formatValue])

  // ---- Step ----
  const doStep = useCallback((type: 'up' | 'down') => {
    if (disabled || readOnly) return

    const current = (() => {
      // Try parsing current display
      const parsed = parseValue(displayValue)
      const num = typeof parsed === 'string' ? parseFloat(parsed) : parsed
      if (!isNaN(num)) return num
      // Fallback to controlled value
      if (currentNumeric !== null) return currentNumeric
      return 0
    })()

    const offset = type === 'up' ? step : -step
    let next = safeAdd(current, offset, resolvedPrecision)
    next = Math.max(min, Math.min(max, next))
    next = toPrecision(next, resolvedPrecision)

    const outValue = stringMode ? next.toFixed(resolvedPrecision) : next
    onChange?.(outValue)
    onStep?.(next, { offset: Math.abs(step), type })
    if (!isControlled) {
      setDisplayValue(formatValue(next))
    }
    userTypingRef.current = false
  }, [disabled, readOnly, parseValue, displayValue, currentNumeric, step, resolvedPrecision, min, max, stringMode, onChange, onStep, isControlled, formatValue])

  // ---- Event handlers ----
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    userTypingRef.current = true
    const raw = e.target.value
    setDisplayValue(raw)

    // If not changeOnBlur, commit immediately for valid numbers
    if (!changeOnBlur) {
      const parsed = parseValue(raw)
      const num = typeof parsed === 'string' ? parseFloat(parsed) : parsed
      if (!isNaN(num)) {
        const clamped = Math.max(min, Math.min(max, num))
        const rounded = toPrecision(clamped, resolvedPrecision)
        const outValue = stringMode ? rounded.toFixed(resolvedPrecision) : rounded
        onChange?.(outValue)
      }
    }
  }, [changeOnBlur, parseValue, min, max, resolvedPrecision, stringMode, onChange])

  const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
    mouseDownRef.current = false
    setIsFocused(true)
    userTypingRef.current = false
    onFocus?.(e)
  }, [onFocus])

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    userTypingRef.current = false
    if (changeOnBlur) {
      commitValue(displayValue)
    }
    onBlur?.(e)
  }, [changeOnBlur, commitValue, displayValue, onBlur])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      userTypingRef.current = false
      commitValue(displayValue)
      onPressEnter?.(e)
    }
    if (keyboard && !disabled && !readOnly) {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        doStep('up')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        doStep('down')
      }
    }
  }, [commitValue, displayValue, onPressEnter, keyboard, disabled, readOnly, doStep])

  // ---- Wheel ----
  useEffect(() => {
    if (!changeOnWheel || !isFocused || disabled || readOnly) return
    const el = inputRef.current
    if (!el) return

    const handleWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) doStep('up')
      else if (e.deltaY > 0) doStep('down')
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [changeOnWheel, isFocused, disabled, readOnly, doStep])

  // ---- Long press for step buttons ----
  const startLongPress = useCallback((type: 'up' | 'down') => {
    doStep(type)
    longPressTimerRef.current = setTimeout(() => {
      longPressIntervalRef.current = setInterval(() => doStep(type), 80)
    }, 400)
  }, [doStep])

  const stopLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    if (longPressIntervalRef.current) {
      clearInterval(longPressIntervalRef.current)
      longPressIntervalRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => () => stopLongPress(), [stopLongPress])

  // ---- Hover (ref-based) ----
  const handleMouseEnter = useCallback(() => {
    if (disabled || isFocused) return
    const el = wrapperRef.current
    if (!el) return
    if (variant === 'borderless') return
    if (variant === 'underlined') {
      el.style.borderBottomColor = getStatusBorderColor(status) || tokens.colorBorderHover
    } else {
      el.style.borderColor = getStatusBorderColor(status) || tokens.colorBorderHover
    }
  }, [disabled, isFocused, variant, status])

  const handleMouseLeave = useCallback(() => {
    if (disabled || isFocused) return
    const el = wrapperRef.current
    if (!el) return
    if (variant === 'borderless') return
    if (variant === 'underlined') {
      el.style.borderBottomColor = getStatusBorderColor(status) || tokens.colorBorder
    } else {
      el.style.borderColor = getStatusBorderColor(status) || (variant === 'filled' ? 'transparent' : tokens.colorBorder)
    }
  }, [disabled, isFocused, variant, status])

  // Handler visibility on hover (ref-based)
  const handleWrapperMouseEnter = useCallback(() => {
    handleMouseEnter()
    if (handlerRef.current && !disabled && !readOnly) {
      handlerRef.current.style.opacity = '1'
    }
  }, [handleMouseEnter, disabled, readOnly])

  const handleWrapperMouseLeave = useCallback(() => {
    handleMouseLeave()
    if (handlerRef.current && !isFocused) {
      handlerRef.current.style.opacity = '0'
    }
  }, [handleMouseLeave, isFocused])

  // Show handlers when focused
  useEffect(() => {
    if (handlerRef.current) {
      handlerRef.current.style.opacity = isFocused ? '1' : '0'
    }
  }, [isFocused])

  // ---- Computed values ----
  const sc = sizeConfig[size]
  const statusBorder = getStatusBorderColor(status)
  const focusBorder = getFocusBorderColor(status)
  const focusRing = getFocusRingColor(status)
  const showControls = controls !== false && !readOnly
  const atMax = currentNumeric !== null && currentNumeric >= max
  const atMin = currentNumeric !== null && currentNumeric <= min

  const upIcon = typeof controls === 'object' ? controls.upIcon : undefined
  const downIcon = typeof controls === 'object' ? controls.downIcon : undefined

  // ---- Styles ----
  const hasAddons = !!addonBefore || !!addonAfter

  const wrapperBaseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    width: '100%',
    height: sc.height,
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    lineHeight: sc.height,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    boxSizing: 'border-box',
    ...getVariantStyles(variant, sc.radius),
    ...(variant === 'underlined'
      ? { borderBottomColor: isFocused && !disabled ? focusBorder : (statusBorder || tokens.colorBorder) }
      : { borderColor: isFocused && !disabled && variant !== 'borderless'
          ? focusBorder
          : (statusBorder || (variant === 'borderless' || variant === 'filled' ? 'transparent' : tokens.colorBorder)) }),
    boxShadow: isFocused && !disabled && focusSourceRef.current === 'keyboard'
      ? (variant === 'underlined' ? `0 1px 0 0 ${focusBorder}` : `0 0 0 2px ${focusRing}`)
      : 'none',
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  }

  const wrapperBorderRadius = hasAddons
    ? {
        borderRadius: 0,
        ...(addonBefore && !addonAfter ? { borderRadius: `0 ${sc.radius} ${sc.radius} 0` } : {}),
        ...(!addonBefore && addonAfter ? { borderRadius: `${sc.radius} 0 0 ${sc.radius}` } : {}),
      }
    : {}

  const mergedWrapperStyle: CSSProperties = { ...wrapperBaseStyle, ...wrapperBorderRadius }

  const inputBaseStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    width: '100%',
    height: '100%',
    padding: `0 ${sc.paddingH}`,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    color: disabled ? tokens.colorTextSubtle : tokens.colorText,
    background: 'none',
    border: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : undefined,
    textAlign: 'left',
    boxSizing: 'border-box',
  }

  const prefixStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: sc.paddingH,
    color: tokens.colorTextMuted,
    flexShrink: 0,
  }

  const suffixStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    paddingRight: showControls ? '0' : sc.paddingH,
    color: tokens.colorTextMuted,
    flexShrink: 0,
  }

  const handlerWrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
    borderLeft: `1px solid ${tokens.colorBorder}`,
    opacity: 0,
    transition: 'opacity 0.15s ease',
    flexShrink: 0,
  }

  const handlerBtnBase: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorTextMuted,
    cursor: 'pointer',
    fontSize: '0.5rem',
    lineHeight: 0,
    width: '1.25rem',
    transition: 'color 0.15s ease, background-color 0.15s ease',
  }

  const handlerUpStyle: CSSProperties = {
    ...handlerBtnBase,
    borderBottom: `1px solid ${tokens.colorBorder}`,
    borderRadius: `0 ${hasAddons && addonAfter ? '0' : sc.radius} 0 0`,
  }

  const handlerDownStyle: CSSProperties = {
    ...handlerBtnBase,
    borderRadius: `0 0 ${hasAddons && addonAfter ? '0' : sc.radius} 0`,
  }

  // Addon styles
  const addonBaseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `0 ${sc.paddingH}`,
    height: sc.height,
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    backgroundColor: tokens.colorBgMuted,
    border: `1px solid ${statusBorder || tokens.colorBorder}`,
    color: tokens.colorText,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  }

  const addonBeforeStyle: CSSProperties = {
    ...addonBaseStyle,
    borderRight: 'none',
    borderRadius: `${sc.radius} 0 0 ${sc.radius}`,
  }

  const addonAfterStyle: CSSProperties = {
    ...addonBaseStyle,
    borderLeft: 'none',
    borderRadius: `0 ${sc.radius} ${sc.radius} 0`,
  }

  // ---- Render ----
  const inputElement = (
    <div
      ref={wrapperRef}
      className={classNames?.input}
      style={mergeSemanticStyle(mergedWrapperStyle, styles?.input)}
      onMouseDown={() => { mouseDownRef.current = true }}
      onMouseEnter={handleWrapperMouseEnter}
      onMouseLeave={handleWrapperMouseLeave}
    >
      {prefix && (
        <span className={classNames?.prefix} style={mergeSemanticStyle(prefixStyle, styles?.prefix)}>
          {prefix}
        </span>
      )}

      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        tabIndex={tabIndex}
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={inputBaseStyle}
        aria-valuemin={min !== -Infinity ? min : undefined}
        aria-valuemax={max !== Infinity ? max : undefined}
        aria-valuenow={currentNumeric ?? undefined}
        role="spinbutton"
      />

      {suffix && (
        <span className={classNames?.suffix} style={mergeSemanticStyle(suffixStyle, styles?.suffix)}>
          {suffix}
        </span>
      )}

      {showControls && (
        <div
          ref={handlerRef}
          className={classNames?.handler}
          style={mergeSemanticStyle(handlerWrapperStyle, styles?.handler)}
        >
          <span
            className={classNames?.handlerUp}
            style={mergeSemanticStyle(handlerUpStyle, styles?.handlerUp, atMax || disabled ? { cursor: 'not-allowed', color: tokens.colorTextSubtle } : undefined)}
            onMouseDown={(e) => { e.preventDefault(); if (!atMax && !disabled) startLongPress('up') }}
            onMouseUp={stopLongPress}
            onMouseEnter={(e) => {
              if (!atMax && !disabled) {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = tokens.colorBgMuted
                el.style.color = tokens.colorPrimary
              }
            }}
            onMouseLeave={(e) => {
              stopLongPress()
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = 'transparent'
              el.style.color = (atMax || disabled) ? tokens.colorTextSubtle : tokens.colorTextMuted
            }}
          >
            {upIcon || <ChevronUpIcon />}
          </span>
          <span
            className={classNames?.handlerDown}
            style={mergeSemanticStyle(handlerDownStyle, styles?.handlerDown, atMin || disabled ? { cursor: 'not-allowed', color: tokens.colorTextSubtle } : undefined)}
            onMouseDown={(e) => { e.preventDefault(); if (!atMin && !disabled) startLongPress('down') }}
            onMouseUp={stopLongPress}
            onMouseEnter={(e) => {
              if (!atMin && !disabled) {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = tokens.colorBgMuted
                el.style.color = tokens.colorPrimary
              }
            }}
            onMouseLeave={(e) => {
              stopLongPress()
              const el = e.currentTarget as HTMLElement
              el.style.backgroundColor = 'transparent'
              el.style.color = (atMin || disabled) ? tokens.colorTextSubtle : tokens.colorTextMuted
            }}
          >
            {downIcon || <ChevronDownIcon />}
          </span>
        </div>
      )}
    </div>
  )

  if (hasAddons) {
    const rootStyle: CSSProperties = {
      display: 'inline-flex',
      width: '100%',
      alignItems: 'stretch',
    }

    return (
      <div
        ref={rootRef}
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(rootStyle, styles?.root, style)}
      >
        {addonBefore && (
          <span className={classNames?.addon} style={mergeSemanticStyle(addonBeforeStyle, styles?.addon)}>
            {addonBefore}
          </span>
        )}
        {inputElement}
        {addonAfter && (
          <span className={classNames?.addon} style={mergeSemanticStyle(addonAfterStyle, styles?.addon)}>
            {addonAfter}
          </span>
        )}
      </div>
    )
  }

  const rootStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    width: '100%',
  }

  return (
    <span
      ref={rootRef as React.RefObject<HTMLSpanElement>}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootStyle, styles?.root, style)}
    >
      {inputElement}
    </span>
  )
})
