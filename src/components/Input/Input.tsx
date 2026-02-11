import {
  type ReactNode,
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ClipboardEvent,
  type MouseEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type InputSize = 'small' | 'middle' | 'large'
export type InputVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
export type InputStatus = 'error' | 'warning'

// -- Semantic slots --
export type InputSemanticSlot = 'root' | 'input' | 'prefix' | 'suffix' | 'addon' | 'count'
export type InputClassNames = SemanticClassNames<InputSemanticSlot>
export type InputStyles = SemanticStyles<InputSemanticSlot>

export type TextAreaSemanticSlot = 'root' | 'textarea' | 'count'
export type TextAreaClassNames = SemanticClassNames<TextAreaSemanticSlot>
export type TextAreaStyles = SemanticStyles<TextAreaSemanticSlot>

export interface InputRef {
  focus: (options?: { preventScroll?: boolean; cursor?: 'start' | 'end' | 'all' }) => void
  blur: () => void
  input: HTMLInputElement | HTMLTextAreaElement | null
}

export interface CountConfig {
  max?: number
  exceedFormatter?: (value: string, config: { max: number }) => string
  show?: boolean | ((args: { value: string; count: number; maxLength?: number }) => ReactNode)
  strategy?: (value: string) => number
}

export interface InputProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  readOnly?: boolean
  id?: string
  autoFocus?: boolean
  name?: string
  autoComplete?: string
  tabIndex?: number
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  prefix?: ReactNode
  suffix?: ReactNode
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  allowClear?: boolean | { clearIcon: ReactNode }
  showCount?: boolean | { formatter: (args: { value: string; count: number; maxLength?: number }) => ReactNode }
  count?: CountConfig
  maxLength?: number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onPressEnter?: (e: KeyboardEvent<HTMLInputElement>) => void
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  className?: string
  style?: CSSProperties
  classNames?: InputClassNames
  styles?: InputStyles
}

export interface TextAreaProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  id?: string
  autoFocus?: boolean
  name?: string
  tabIndex?: number
  rows?: number
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  allowClear?: boolean | { clearIcon: ReactNode }
  showCount?: boolean | { formatter: (args: { value: string; count: number; maxLength?: number }) => ReactNode }
  count?: CountConfig
  maxLength?: number
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onPressEnter?: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void
  onResize?: (size: { width: number; height: number }) => void
  className?: string
  style?: CSSProperties
  classNames?: TextAreaClassNames
  styles?: TextAreaStyles
}

export interface SearchProps extends Omit<InputProps, 'type' | 'addonAfter'> {
  enterButton?: boolean | ReactNode
  loading?: boolean
  onSearch?: (value: string, event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement>) => void
}

export interface PasswordProps extends Omit<InputProps, 'type' | 'suffix'> {
  visibilityToggle?: boolean | { visible: boolean; onVisibleChange: (visible: boolean) => void }
  iconRender?: (visible: boolean) => ReactNode
}

export interface OTPProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  length?: number
  disabled?: boolean
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus
  formatter?: (value: string) => string
  mask?: boolean | string
  autoFocus?: boolean
  className?: string
  style?: CSSProperties
}

// ============================================================================
// Icons
// ============================================================================

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

function SearchSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function LoadingSpinner() {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let deg = 0
    let raf: number
    const tick = () => {
      deg = (deg + 4) % 360
      el.style.transform = `rotate(${deg}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <svg ref={ref} viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.3 199.3 0 19.9-16.1 36-36 36z" />
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

function resolveCountConfig(
  count?: CountConfig,
  showCount?: boolean | { formatter: (args: { value: string; count: number; maxLength?: number }) => ReactNode },
  maxLength?: number,
): { show: boolean; max?: number; strategy: (v: string) => number; formatter?: (args: { value: string; count: number; maxLength?: number }) => ReactNode; exceedFormatter?: (v: string, c: { max: number }) => string } {
  const strategy = count?.strategy || ((v: string) => v.length)
  const max = count?.max ?? maxLength
  const exceedFormatter = count?.exceedFormatter

  let show = false
  let formatter: ((args: { value: string; count: number; maxLength?: number }) => ReactNode) | undefined

  if (count?.show === true) {
    show = true
  } else if (typeof count?.show === 'function') {
    show = true
    formatter = count.show
  } else if (showCount === true) {
    show = true
  } else if (typeof showCount === 'object' && showCount.formatter) {
    show = true
    formatter = showCount.formatter
  }

  return { show, max, strategy, formatter, exceedFormatter }
}

// ============================================================================
// InputComponent (base)
// ============================================================================

const InputComponent = forwardRef<InputRef, InputProps>(function InputInner(props, ref) {
  const {
    value: controlledValue,
    defaultValue = '',
    placeholder,
    type = 'text',
    disabled = false,
    readOnly = false,
    id,
    autoFocus = false,
    name,
    autoComplete,
    tabIndex,
    size = 'middle',
    variant = 'outlined',
    status,
    prefix: prefixNode,
    suffix: suffixNode,
    addonBefore,
    addonAfter,
    allowClear = false,
    showCount,
    count,
    maxLength,
    onChange,
    onPressEnter,
    onFocus,
    onBlur,
    onKeyDown,
    className,
    style,
    classNames,
    styles,
  } = props

  // ---- Controlled / uncontrolled ----
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)

  // ---- Ref ----
  useImperativeHandle(ref, () => ({
    focus: (options) => {
      inputRef.current?.focus({ preventScroll: options?.preventScroll })
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
  }))

  // ---- Count config ----
  const countConfig = resolveCountConfig(count, showCount, maxLength)

  // ---- Handlers ----
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // exceedFormatter
    if (countConfig.exceedFormatter && countConfig.max !== undefined) {
      const charCount = countConfig.strategy(newValue)
      if (charCount > countConfig.max) {
        newValue = countConfig.exceedFormatter(newValue, { max: countConfig.max })
        // Update the native input value so cursor position is correct
        e.target.value = newValue
      }
    }

    if (!isControlled) setInternalValue(newValue)
    onChange?.(e)
  }, [isControlled, onChange, countConfig])

  const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }, [onFocus])

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }, [onBlur])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onPressEnter?.(e)
    onKeyDown?.(e)
  }, [onPressEnter, onKeyDown])

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
      nativeInputValueSetter?.call(inputRef.current, '')
      const event = new Event('input', { bubbles: true })
      inputRef.current.dispatchEvent(event)
    }
    if (!isControlled) setInternalValue('')
    // Create synthetic-like event for onChange
    const syntheticEvent = {
      target: { value: '' },
      currentTarget: { value: '' },
    } as ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
    inputRef.current?.focus()
  }, [isControlled, onChange])

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

  // ---- Sizing ----
  const sc = sizeConfig[size]
  const hasPrefix = !!prefixNode
  const hasSuffix = !!suffixNode || (allowClear && !!currentValue && !disabled && !readOnly)

  // ---- Styles ----
  const statusBorder = getStatusBorderColor(status)
  const focusRing = getFocusRingColor(status)
  const focusBorder = getFocusBorderColor(status)

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
    ...(statusBorder ? (variant === 'underlined' ? { borderBottomColor: statusBorder } : { borderColor: statusBorder }) : {}),
    ...(isFocused && !disabled ? {
      ...(variant === 'underlined'
        ? { borderBottomColor: focusBorder, boxShadow: `0 1px 0 0 ${focusBorder}` }
        : { borderColor: focusBorder, boxShadow: `0 0 0 2px ${focusRing}` }
      ),
    } : {}),
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  }

  const inputBaseStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    width: '100%',
    height: '100%',
    padding: 0,
    paddingLeft: hasPrefix ? 0 : sc.paddingH,
    paddingRight: hasSuffix ? 0 : sc.paddingH,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    lineHeight: 'inherit',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: disabled ? tokens.colorTextSubtle : tokens.colorText,
    cursor: disabled ? 'not-allowed' : undefined,
    boxSizing: 'border-box',
  }

  const prefixStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: sc.paddingH,
    paddingRight: '0.25rem',
    color: tokens.colorTextMuted,
    flexShrink: 0,
  }

  const suffixStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    paddingRight: sc.paddingH,
    paddingLeft: '0.25rem',
    color: tokens.colorTextMuted,
    flexShrink: 0,
    gap: '0.25rem',
  }

  const clearBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    margin: '-0.25rem',
    borderRadius: '50%',
    cursor: 'pointer',
    color: tokens.colorTextMuted,
    transition: 'color 0.15s ease',
    padding: 0,
    border: 'none',
    background: 'none',
    lineHeight: 1,
  }

  // ---- Count display ----
  const charCount = countConfig.strategy(currentValue)
  const countExceeded = countConfig.max !== undefined && charCount > countConfig.max

  const renderCount = () => {
    if (!countConfig.show) return null

    let content: ReactNode
    if (countConfig.formatter) {
      content = countConfig.formatter({ value: currentValue, count: charCount, maxLength: countConfig.max })
    } else if (countConfig.max !== undefined) {
      content = `${charCount} / ${countConfig.max}`
    } else {
      content = `${charCount}`
    }

    const countStyle: CSSProperties = {
      fontSize: '0.75rem',
      lineHeight: '1.25rem',
      color: countExceeded ? tokens.colorError : tokens.colorTextMuted,
      whiteSpace: 'nowrap',
      marginLeft: '0.25rem',
      flexShrink: 0,
    }

    return (
      <span
        className={classNames?.count}
        style={mergeSemanticStyle(countStyle, styles?.count)}
      >
        {content}
      </span>
    )
  }

  // ---- Allow clear button ----
  const showClear = allowClear && !!currentValue && !disabled && !readOnly
  const clearIconNode = typeof allowClear === 'object' ? allowClear.clearIcon : <ClearIcon />

  // ---- Addon styles ----
  const hasAddons = !!addonBefore || !!addonAfter
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

  // Adjust wrapper border radius when addons present
  const wrapperBorderRadius = hasAddons
    ? {
        borderRadius: 0,
        ...(addonBefore && !addonAfter ? { borderRadius: `0 ${sc.radius} ${sc.radius} 0` } : {}),
        ...(!addonBefore && addonAfter ? { borderRadius: `${sc.radius} 0 0 ${sc.radius}` } : {}),
      }
    : {}

  const mergedWrapperStyle: CSSProperties = { ...wrapperBaseStyle, ...wrapperBorderRadius }

  // ---- Render ----
  const inputElement = (
    <span
      ref={wrapperRef}
      className={classNames?.input}
      style={mergeSemanticStyle(mergedWrapperStyle, styles?.input)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasPrefix && (
        <span
          className={classNames?.prefix}
          style={mergeSemanticStyle(prefixStyle, styles?.prefix)}
        >
          {prefixNode}
        </span>
      )}

      <input
        ref={inputRef}
        id={id}
        type={type}
        name={name}
        autoComplete={autoComplete}
        tabIndex={tabIndex}
        value={currentValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        maxLength={maxLength}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={inputBaseStyle}
      />

      {(hasSuffix || suffixNode || countConfig.show) && (
        <span
          className={classNames?.suffix}
          style={mergeSemanticStyle(suffixStyle, styles?.suffix)}
        >
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              style={clearBtnStyle}
              aria-label="Clear"
            >
              {clearIconNode}
            </button>
          )}
          {suffixNode}
          {!hasAddons && renderCount()}
        </span>
      )}
    </span>
  )

  if (hasAddons) {
    const rootStyle: CSSProperties = {
      display: 'inline-flex',
      width: '100%',
      alignItems: 'stretch',
    }

    return (
      <div
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(rootStyle, styles?.root, style)}
      >
        {addonBefore && (
          <span
            className={classNames?.addon}
            style={mergeSemanticStyle(addonBeforeStyle, styles?.addon)}
          >
            {addonBefore}
          </span>
        )}
        {inputElement}
        {addonAfter && (
          <span
            className={classNames?.addon}
            style={mergeSemanticStyle(addonAfterStyle, styles?.addon)}
          >
            {addonAfter}
          </span>
        )}
        {renderCount()}
      </div>
    )
  }

  // No addons — simpler structure
  const rootStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    width: '100%',
  }

  return (
    <span
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootStyle, styles?.root, style)}
    >
      {inputElement}
    </span>
  )
})

// ============================================================================
// TextAreaComponent
// ============================================================================

const TextAreaComponent = forwardRef<InputRef, TextAreaProps>(function TextAreaInner(props, ref) {
  const {
    value: controlledValue,
    defaultValue = '',
    placeholder,
    disabled = false,
    readOnly = false,
    id,
    autoFocus = false,
    name,
    tabIndex,
    rows,
    size = 'middle',
    variant = 'outlined',
    status,
    autoSize = false,
    allowClear = false,
    showCount,
    count,
    maxLength,
    onChange,
    onPressEnter,
    onFocus,
    onBlur,
    onResize,
    className,
    style,
    classNames,
    styles,
  } = props

  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    focus: (options) => {
      textareaRef.current?.focus({ preventScroll: options?.preventScroll })
      if (options?.cursor && textareaRef.current) {
        const len = textareaRef.current.value.length
        switch (options.cursor) {
          case 'start': textareaRef.current.setSelectionRange(0, 0); break
          case 'end': textareaRef.current.setSelectionRange(len, len); break
          case 'all': textareaRef.current.setSelectionRange(0, len); break
        }
      }
    },
    blur: () => textareaRef.current?.blur(),
    input: textareaRef.current,
  }))

  // ---- Count config ----
  const countConfig = resolveCountConfig(count, showCount, maxLength)

  // ---- Auto-size ----
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el || autoSize === false) return

    const cs = window.getComputedStyle(el)
    const lineH = parseFloat(cs.lineHeight) || 20
    const paddingTop = parseFloat(cs.paddingTop) || 0
    const paddingBottom = parseFloat(cs.paddingBottom) || 0
    const borderTop = parseFloat(cs.borderTopWidth) || 0
    const borderBottom = parseFloat(cs.borderBottomWidth) || 0

    el.style.height = 'auto'
    el.style.overflow = 'hidden'

    const scrollH = el.scrollHeight
    let minH = 0
    let maxH = Infinity

    if (typeof autoSize === 'object') {
      if (autoSize.minRows) minH = autoSize.minRows * lineH + paddingTop + paddingBottom + borderTop + borderBottom
      if (autoSize.maxRows) maxH = autoSize.maxRows * lineH + paddingTop + paddingBottom + borderTop + borderBottom
    }

    const clampedH = Math.max(minH, Math.min(scrollH, maxH))
    el.style.height = `${clampedH}px`
    el.style.overflow = clampedH < scrollH ? 'auto' : 'hidden'

    onResize?.({ width: el.offsetWidth, height: clampedH })
  }, [autoSize, onResize])

  useEffect(() => {
    resizeTextarea()
  }, [currentValue, resizeTextarea])

  // ---- Handlers ----
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value

    if (countConfig.exceedFormatter && countConfig.max !== undefined) {
      const charCount = countConfig.strategy(newValue)
      if (charCount > countConfig.max) {
        newValue = countConfig.exceedFormatter(newValue, { max: countConfig.max })
        e.target.value = newValue
      }
    }

    if (!isControlled) setInternalValue(newValue)
    onChange?.(e)
  }, [isControlled, onChange, countConfig])

  const handleFocus = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }, [onFocus])

  const handleBlur = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }, [onBlur])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) onPressEnter?.(e)
  }, [onPressEnter])

  const handleClear = useCallback(() => {
    if (!isControlled) setInternalValue('')
    const syntheticEvent = {
      target: { value: '' },
      currentTarget: { value: '' },
    } as ChangeEvent<HTMLTextAreaElement>
    onChange?.(syntheticEvent)
    textareaRef.current?.focus()
  }, [isControlled, onChange])

  // ---- Hover ----
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

  // ---- Styles ----
  const sc = sizeConfig[size]
  const statusBorder = getStatusBorderColor(status)
  const focusRing = getFocusRingColor(status)
  const focusBorder = getFocusBorderColor(status)

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    boxSizing: 'border-box',
    ...getVariantStyles(variant, sc.radius),
    ...(statusBorder ? (variant === 'underlined' ? { borderBottomColor: statusBorder } : { borderColor: statusBorder }) : {}),
    ...(isFocused && !disabled ? {
      ...(variant === 'underlined'
        ? { borderBottomColor: focusBorder, boxShadow: `0 1px 0 0 ${focusBorder}` }
        : { borderColor: focusBorder, boxShadow: `0 0 0 2px ${focusRing}` }
      ),
    } : {}),
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
  }

  const textareaBaseStyle: CSSProperties = {
    width: '100%',
    padding: `${sc.paddingV} ${sc.paddingH}`,
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    lineHeight: '1.375rem',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: disabled ? tokens.colorTextSubtle : tokens.colorText,
    cursor: disabled ? 'not-allowed' : undefined,
    resize: autoSize ? 'none' : 'vertical',
    boxSizing: 'border-box',
  }

  // ---- Count ----
  const charCount = countConfig.strategy(currentValue)
  const countExceeded = countConfig.max !== undefined && charCount > countConfig.max

  const showClear = allowClear && !!currentValue && !disabled && !readOnly

  const renderCount = () => {
    if (!countConfig.show) return null

    let content: ReactNode
    if (countConfig.formatter) {
      content = countConfig.formatter({ value: currentValue, count: charCount, maxLength: countConfig.max })
    } else if (countConfig.max !== undefined) {
      content = `${charCount} / ${countConfig.max}`
    } else {
      content = `${charCount}`
    }

    const countStyle: CSSProperties = {
      position: 'absolute',
      bottom: '0.25rem',
      right: sc.paddingH,
      fontSize: '0.75rem',
      lineHeight: '1.25rem',
      color: countExceeded ? tokens.colorError : tokens.colorTextMuted,
      pointerEvents: 'none',
    }

    return (
      <span
        className={classNames?.count}
        style={mergeSemanticStyle(countStyle, styles?.count)}
      >
        {content}
      </span>
    )
  }

  return (
    <div
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle({ position: 'relative', width: '100%' }, styles?.root, style)}
    >
      <div
        ref={wrapperRef}
        style={wrapperStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <textarea
          ref={textareaRef}
          id={id}
          name={name}
          tabIndex={tabIndex}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          maxLength={maxLength}
          rows={rows}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={classNames?.textarea}
          style={mergeSemanticStyle(textareaBaseStyle, styles?.textarea)}
        />
        {renderCount()}
      </div>
      {showClear && (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleClear}
          aria-label="Clear"
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: sc.paddingH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.75rem',
            height: '1.75rem',
            margin: '-0.25rem',
            borderRadius: '50%',
            cursor: 'pointer',
            color: tokens.colorTextMuted,
            transition: 'color 0.15s ease',
            padding: 0,
            border: 'none',
            background: 'none',
            lineHeight: 1,
          }}
        >
          {typeof allowClear === 'object' ? allowClear.clearIcon : <ClearIcon />}
        </button>
      )}
    </div>
  )
})

// ============================================================================
// SearchComponent
// ============================================================================

const SearchComponent = forwardRef<InputRef, SearchProps>(function SearchInner(props, ref) {
  const {
    enterButton = false,
    loading = false,
    onSearch,
    onPressEnter,
    onChange,
    value: controlledValue,
    defaultValue = '',
    suffix,
    ...restProps
  } = props

  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const inputRef = useRef<InputRef>(null)

  useImperativeHandle(ref, () => ({
    focus: (options) => inputRef.current?.focus(options),
    blur: () => inputRef.current?.blur(),
    input: inputRef.current?.input as HTMLInputElement | null,
  }))

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value)
    onChange?.(e)
  }, [isControlled, onChange])

  const handleSearch = useCallback((e?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement>) => {
    onSearch?.(currentValue, e)
  }, [currentValue, onSearch])

  const handlePressEnter = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    handleSearch(e)
    onPressEnter?.(e)
  }, [handleSearch, onPressEnter])

  const sc = sizeConfig[restProps.size || 'middle']

  if (enterButton) {
    const buttonContent = enterButton === true
      ? (loading ? <LoadingSpinner /> : <SearchSvg />)
      : enterButton

    const buttonStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: sc.height,
      padding: `0 ${sc.paddingH}`,
      border: 'none',
      backgroundColor: tokens.colorPrimary,
      color: tokens.colorPrimaryContrast,
      cursor: loading ? 'default' : 'pointer',
      fontSize: sc.fontSize,
      fontFamily: 'inherit',
      borderRadius: `0 ${sc.radius} ${sc.radius} 0`,
      transition: 'background-color 0.2s ease',
      opacity: loading ? 0.7 : 1,
      gap: '0.25rem',
      whiteSpace: 'nowrap',
    }

    return (
      <InputComponent
        ref={inputRef}
        {...restProps}
        type="text"
        value={controlledValue}
        defaultValue={defaultValue}
        onChange={handleChange}
        onPressEnter={handlePressEnter}
        suffix={suffix}
        addonAfter={
          <button
            type="button"
            onClick={(e) => !loading && handleSearch(e)}
            style={buttonStyle}
          >
            {buttonContent}
          </button>
        }
      />
    )
  }

  // No enterButton — just a search icon in suffix
  const searchSuffix = (
    <span style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
      {suffix}
      <span
        style={{ cursor: loading ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center' }}
        onClick={(e) => !loading && handleSearch(e)}
      >
        {loading ? <LoadingSpinner /> : <SearchSvg />}
      </span>
    </span>
  )

  return (
    <InputComponent
      ref={inputRef}
      {...restProps}
      type="text"
      value={controlledValue}
      defaultValue={defaultValue}
      onChange={handleChange}
      onPressEnter={handlePressEnter}
      suffix={searchSuffix}
    />
  )
})

// ============================================================================
// PasswordComponent
// ============================================================================

const PasswordComponent = forwardRef<InputRef, PasswordProps>(function PasswordInner(props, ref) {
  const {
    visibilityToggle = true,
    iconRender,
    ...restProps
  } = props

  // Controlled or internal visibility
  const isToggleControlled = typeof visibilityToggle === 'object' && visibilityToggle.visible !== undefined
  const [internalVisible, setInternalVisible] = useState(false)
  const passwordVisible = isToggleControlled
    ? (visibilityToggle as { visible: boolean }).visible
    : internalVisible

  const toggleVisibility = useCallback(() => {
    if (isToggleControlled) {
      ;(visibilityToggle as { visible: boolean; onVisibleChange: (v: boolean) => void }).onVisibleChange(!passwordVisible)
    } else {
      setInternalVisible(v => !v)
    }
  }, [isToggleControlled, visibilityToggle, passwordVisible])

  const showToggle = visibilityToggle !== false

  const toggleIcon = iconRender
    ? iconRender(passwordVisible)
    : passwordVisible ? <EyeIcon /> : <EyeOffIcon />

  const suffixNode = showToggle ? (
    <span
      onClick={toggleVisibility}
      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
    >
      {toggleIcon}
    </span>
  ) : undefined

  return (
    <InputComponent
      ref={ref}
      {...restProps}
      type={passwordVisible ? 'text' : 'password'}
      suffix={suffixNode}
    />
  )
})

// ============================================================================
// OTPComponent
// ============================================================================

const OTPComponent = forwardRef<InputRef, OTPProps>(function OTPInner(props, ref) {
  const {
    value: controlledValue,
    defaultValue = '',
    onChange,
    length = 6,
    disabled = false,
    size = 'middle',
    variant = 'outlined',
    status,
    formatter,
    mask,
    autoFocus = false,
    className,
    style,
  } = props

  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useImperativeHandle(ref, () => ({
    focus: () => inputRefs.current[0]?.focus(),
    blur: () => {
      inputRefs.current.forEach(r => r?.blur())
    },
    input: inputRefs.current[0],
  }))

  const setValue = useCallback((newVal: string) => {
    if (!isControlled) setInternalValue(newVal)
    onChange?.(newVal)
  }, [isControlled, onChange])

  const chars = currentValue.padEnd(length, '').split('').slice(0, length)

  const handleInput = useCallback((index: number, char: string) => {
    let val = char
    if (formatter) val = formatter(val)
    if (!val) return

    const newChars = [...chars]
    newChars[index] = val[0]
    const newValue = newChars.join('').replace(/\s+$/g, '')
    setValue(newValue)

    // Auto-focus next
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [chars, length, formatter, setValue])

  const handleKeyDown = useCallback((index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newChars = [...chars]
      if (chars[index]) {
        newChars[index] = ''
        setValue(newChars.join('').replace(/\s+$/g, ''))
      } else if (index > 0) {
        newChars[index - 1] = ''
        setValue(newChars.join('').replace(/\s+$/g, ''))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }, [chars, length, setValue])

  const handlePaste = useCallback((e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    let pasted = e.clipboardData.getData('text')
    if (formatter) pasted = pasted.split('').map(c => formatter(c)).join('')

    const newChars = [...chars]
    for (let i = 0; i < pasted.length && i < length; i++) {
      newChars[i] = pasted[i]
    }
    const newValue = newChars.join('').replace(/\s+$/g, '')
    setValue(newValue)

    // Focus the next empty cell or last cell
    const nextEmpty = newChars.findIndex(c => !c)
    const focusIdx = nextEmpty === -1 ? length - 1 : Math.min(nextEmpty, length - 1)
    inputRefs.current[focusIdx]?.focus()
  }, [chars, length, formatter, setValue])

  // ---- Styles ----
  const sc = sizeConfig[size]
  const statusBorder = getStatusBorderColor(status)

  const cellBaseStyle: CSSProperties = {
    width: sc.height,
    height: sc.height,
    textAlign: 'center',
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
    color: disabled ? tokens.colorTextSubtle : tokens.colorText,
    ...getVariantStyles(variant, sc.radius),
    ...(statusBorder ? (variant === 'underlined' ? { borderBottomColor: statusBorder } : { borderColor: statusBorder }) : {}),
    ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
    ...(mask ? { WebkitTextSecurity: mask === true ? 'disc' : undefined, fontFamily: mask !== true ? 'monospace' : 'inherit' } as CSSProperties : {}),
  }

  // Focus style applied via ref-based DOM manipulation per cell
  const handleCellFocus = (e: FocusEvent<HTMLInputElement>) => {
    const focusBorder = getFocusBorderColor(status)
    const focusRing = getFocusRingColor(status)
    if (variant === 'underlined') {
      e.currentTarget.style.borderBottomColor = focusBorder
      e.currentTarget.style.boxShadow = `0 1px 0 0 ${focusBorder}`
    } else {
      e.currentTarget.style.borderColor = focusBorder
      e.currentTarget.style.boxShadow = `0 0 0 2px ${focusRing}`
    }
  }
  const handleCellBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (variant === 'underlined') {
      e.currentTarget.style.borderBottomColor = statusBorder || tokens.colorBorder
      e.currentTarget.style.boxShadow = 'none'
    } else {
      e.currentTarget.style.borderColor = statusBorder || (variant === 'filled' ? 'transparent' : tokens.colorBorder)
      e.currentTarget.style.boxShadow = 'none'
    }
  }

  const getMaskDisplay = (char: string) => {
    if (!mask || !char) return char
    if (mask === true) return '\u2022'
    return typeof mask === 'string' ? mask : char
  }

  return (
    <div
      className={className}
      style={{ display: 'inline-flex', gap: '0.5rem', ...style }}
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          value={mask ? getMaskDisplay(chars[i]) : chars[i]}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          onFocus={(e) => { handleCellFocus(e); e.target.select() }}
          onBlur={handleCellBlur}
          style={cellBaseStyle}
        />
      ))}
    </div>
  )
})

// ============================================================================
// Compound Export
// ============================================================================

export const Input = Object.assign(InputComponent, {
  TextArea: TextAreaComponent,
  Search: SearchComponent,
  Password: PasswordComponent,
  OTP: OTPComponent,
})
