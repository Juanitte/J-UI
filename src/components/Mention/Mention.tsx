import {
  type ReactNode,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ChangeEvent,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { InputSize, InputVariant, InputStatus } from '../Input'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type MentionSemanticSlot = 'root' | 'textarea' | 'dropdown' | 'option'
export type MentionClassNames = SemanticClassNames<MentionSemanticSlot>
export type MentionStyles = SemanticStyles<MentionSemanticSlot>

export interface MentionOption {
  value: string
  label?: ReactNode
  disabled?: boolean
}

export interface MentionRef {
  focus: (options?: { preventScroll?: boolean; cursor?: 'start' | 'end' | 'all' }) => void
  blur: () => void
  textarea: HTMLTextAreaElement | null
  nativeElement: HTMLDivElement | null
}

export interface MentionProps {
  value?: string
  defaultValue?: string
  onChange?: (text: string) => void
  onSelect?: (option: MentionOption, prefix: string) => void
  onSearch?: (text: string, prefix: string) => void
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void
  onPopupScroll?: (e: React.UIEvent<HTMLDivElement>) => void

  options?: MentionOption[]
  prefix?: string | string[]
  split?: string
  filterOption?: false | ((input: string, option: MentionOption) => boolean)
  validateSearch?: (text: string, props: MentionProps) => boolean
  notFoundContent?: ReactNode
  placement?: 'top' | 'bottom'
  allowClear?: boolean

  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  id?: string
  autoFocus?: boolean
  rows?: number
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  resize?: boolean
  size?: InputSize
  variant?: InputVariant
  status?: InputStatus

  className?: string
  style?: CSSProperties
  classNames?: MentionClassNames
  styles?: MentionStyles
}

// ============================================================================
// Icons
// ============================================================================

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ============================================================================
// Helpers
// ============================================================================

const sizeConfig: Record<InputSize, { height: string; fontSize: string; lineHeight: string; paddingH: string; paddingV: string; radius: string }> = {
  small:  { height: '1.5rem', fontSize: '0.75rem',  lineHeight: '1.125rem', paddingH: '0.5rem',  paddingV: '0.25rem',  radius: '0.25rem' },
  middle: { height: '2rem',   fontSize: '0.875rem', lineHeight: '1.375rem', paddingH: '0.75rem', paddingV: '0.375rem', radius: '0.375rem' },
  large:  { height: '2.5rem', fontSize: '1rem',     lineHeight: '1.5rem',   paddingH: '0.75rem', paddingV: '0.625rem', radius: '0.5rem' },
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

/** Default filter: case-insensitive includes on value/label */
function defaultMentionFilter(input: string, option: MentionOption): boolean {
  const search = input.toLowerCase()
  if (option.value.toLowerCase().includes(search)) return true
  if (typeof option.label === 'string' && option.label.toLowerCase().includes(search)) return true
  return false
}

interface MentionContext {
  prefix: string
  searchText: string
  startPos: number
}

/**
 * Scan backwards from cursor to find an active mention trigger.
 * A valid trigger is a prefix char at position 0 or preceded by whitespace or the split char.
 */
function getMentionContext(
  value: string,
  cursorPos: number,
  prefixes: string[],
  split: string,
): MentionContext | null {
  const textBeforeCursor = value.slice(0, cursorPos)

  // Try each prefix, longest first to avoid partial matches
  const sorted = [...prefixes].sort((a, b) => b.length - a.length)

  for (const prefix of sorted) {
    // Search backwards for this prefix
    let searchFrom = textBeforeCursor.length
    while (searchFrom > 0) {
      const idx = textBeforeCursor.lastIndexOf(prefix, searchFrom - 1)
      if (idx < 0) break
      searchFrom = idx

      // Check if prefix is at start or preceded by whitespace/split
      const charBefore = idx > 0 ? textBeforeCursor[idx - 1] : ''
      const isValidPosition = idx === 0 || charBefore === ' ' || charBefore === '\n' || charBefore === split

      if (!isValidPosition) continue

      // Extract search text between prefix and cursor
      const searchText = textBeforeCursor.slice(idx + prefix.length)

      // Search text should not contain whitespace or split (it means the mention ended)
      if (searchText.includes('\n') || (split !== ' ' && searchText.includes(split))) continue
      // For space split, allow only if no space in search text
      if (split === ' ' && searchText.includes(' ')) continue

      return { prefix, searchText, startPos: idx }
    }
  }

  return null
}

// ============================================================================
// Mention Component
// ============================================================================

export const Mention = forwardRef<MentionRef, MentionProps>(function MentionInner(props, ref) {
  const {
    value: controlledValue,
    defaultValue = '',
    onChange,
    onSelect,
    onSearch,
    onFocus,
    onBlur,
    onPopupScroll,

    options = [],
    prefix: prefixProp = '@',
    split = ' ',
    filterOption = true,
    validateSearch,
    notFoundContent = 'No matches',
    placement = 'bottom',
    allowClear = false,

    placeholder,
    disabled = false,
    readOnly = false,
    id,
    autoFocus = false,
    rows = 1,
    autoSize = false,
    resize: resizeProp = false,
    size = 'middle',
    variant = 'outlined',
    status,

    className,
    style,
    classNames,
    styles,
  } = props

  // ---- Normalize prefixes ----
  const prefixes = useMemo(
    () => Array.isArray(prefixProp) ? prefixProp : [prefixProp],
    [prefixProp],
  )

  // ---- Refs ----
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mentionContextRef = useRef<MentionContext | null>(null)

  // ---- State ----
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const [isFocused, setIsFocused] = useState(false)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')
  const [isOpen, setIsOpenRaw] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [flipUp, setFlipUp] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [searchText, setSearchText] = useState('')

  // ---- Imperative handle ----
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
    textarea: textareaRef.current,
    nativeElement: rootRef.current,
  }))

  // ---- Dropdown open/close ----
  const setOpen = useCallback((newOpen: boolean) => {
    setIsOpenRaw(newOpen)
    if (newOpen) {
      setFlipUp(placement === 'top')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
    }
  }, [placement])

  // ---- Filter options ----
  const filteredOptions = useMemo(() => {
    if (filterOption === false) return options
    const filterFn = typeof filterOption === 'function' ? filterOption : defaultMentionFilter
    return options.filter((opt) => filterFn(searchText, opt))
  }, [options, searchText, filterOption])

  const hasContent = filteredOptions.length > 0 || notFoundContent !== null
  const shouldShowDropdown = isOpen && hasContent && !disabled && !readOnly

  // ---- Reset activeIndex when filtered list changes ----
  useEffect(() => {
    if (filteredOptions.length > 0) {
      const firstEnabled = filteredOptions.findIndex((o) => !o.disabled)
      setActiveIndex(firstEnabled >= 0 ? firstEnabled : -1)
    } else {
      setActiveIndex(-1)
    }
  }, [filteredOptions])

  // ---- Auto-focus ----
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  // ---- Click outside ----
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, setOpen])

  // ---- Scroll active option into view ----
  useEffect(() => {
    if (!shouldShowDropdown || activeIndex < 0) return
    const dropdown = dropdownRef.current
    if (!dropdown) return
    const activeEl = dropdown.querySelector(`[data-option-index="${activeIndex}"]`) as HTMLElement | null
    if (activeEl) {
      const elTop = activeEl.offsetTop
      const elBottom = elTop + activeEl.offsetHeight
      if (elTop < dropdown.scrollTop) {
        dropdown.scrollTop = elTop
      } else if (elBottom > dropdown.scrollTop + dropdown.clientHeight) {
        dropdown.scrollTop = elBottom - dropdown.clientHeight
      }
    }
  }, [activeIndex, shouldShowDropdown])

  // ---- AutoSize ----
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el || autoSize === false) return

    const cs = window.getComputedStyle(el)
    const lineH = parseFloat(cs.lineHeight) || 20
    const paddingTop = parseFloat(cs.paddingTop) || 0
    const paddingBottom = parseFloat(cs.paddingBottom) || 0
    const borderTop = parseFloat(cs.borderTopWidth) || 0
    const borderBottom = parseFloat(cs.borderBottomWidth) || 0

    el.style.minHeight = '0'
    el.style.height = '0'
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
    el.style.minHeight = minH > 0 ? `${minH}px` : ''
    el.style.maxHeight = maxH !== Infinity ? `${maxH}px` : ''
    el.style.overflow = clampedH < scrollH ? 'auto' : 'hidden'
  }, [autoSize])

  useLayoutEffect(() => {
    resizeTextarea()
  }, [currentValue, resizeTextarea])

  // Auto-flip: measure actual dropdown and flip if it overflows viewport
  useLayoutEffect(() => {
    if (!isOpen || !dropdownRef.current || !rootRef.current) return
    const dropRect = dropdownRef.current.getBoundingClientRect()
    const rootRect = rootRef.current.getBoundingClientRect()
    const spaceAbove = rootRect.top
    const spaceBelow = window.innerHeight - rootRect.bottom

    if (!flipUp && dropRect.bottom > window.innerHeight) {
      if (spaceAbove > spaceBelow) setFlipUp(true)
    } else if (flipUp && dropRect.top < 0) {
      if (spaceBelow > spaceAbove) setFlipUp(false)
    }
  })

  // ---- Mention detection ----
  const detectMention = useCallback((val: string, cursorPos: number) => {
    const ctx = getMentionContext(val, cursorPos, prefixes, split)
    mentionContextRef.current = ctx

    if (ctx) {
      // Validate search if provided
      if (validateSearch && !validateSearch(ctx.searchText, props)) {
        setOpen(false)
        return
      }
      setSearchText(ctx.searchText)
      onSearch?.(ctx.searchText, ctx.prefix)
      if (!isOpen) setOpen(true)
    } else {
      setOpen(false)
    }
  }, [prefixes, split, validateSearch, props, onSearch, isOpen, setOpen])

  // ---- Select option ----
  const handleSelectOption = useCallback((option: MentionOption) => {
    if (option.disabled) return
    const ctx = mentionContextRef.current
    if (!ctx) return

    const before = currentValue.slice(0, ctx.startPos)
    const after = currentValue.slice(ctx.startPos + ctx.prefix.length + ctx.searchText.length)
    const mention = ctx.prefix + option.value + split
    const newValue = before + mention + after
    const newCursorPos = before.length + mention.length

    if (!isControlled) setInternalValue(newValue)
    onChange?.(newValue)
    onSelect?.(option, ctx.prefix)
    setOpen(false)
    mentionContextRef.current = null

    // Restore cursor position after React re-renders
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    })
  }, [currentValue, isControlled, onChange, onSelect, split, setOpen])

  // ---- Event handlers ----
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (!isControlled) setInternalValue(newValue)
    onChange?.(newValue)

    // Detect mention context at cursor position
    const cursorPos = e.target.selectionStart ?? newValue.length
    detectMention(newValue, cursorPos)
  }, [isControlled, onChange, detectMention])

  const handleFocus = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
    focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
    mouseDownRef.current = false
    setIsFocused(true)
    onFocus?.(e)
  }, [onFocus])

  const handleBlur = useCallback((e: FocusEvent<HTMLTextAreaElement>) => {
    // Don't close if clicking inside dropdown
    const relatedTarget = e.relatedTarget as Node | null
    if (rootRef.current && relatedTarget && rootRef.current.contains(relatedTarget)) {
      return
    }
    setIsFocused(false)
    onBlur?.(e)
    setOpen(false)
  }, [onBlur, setOpen])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (filteredOptions.length > 0) {
          setActiveIndex((prev) => {
            let next = prev
            for (let i = 0; i < filteredOptions.length; i++) {
              next = (next + 1) % filteredOptions.length
              if (!filteredOptions[next].disabled) return next
            }
            return prev
          })
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (filteredOptions.length > 0) {
          setActiveIndex((prev) => {
            let next = prev
            for (let i = 0; i < filteredOptions.length; i++) {
              next = (next - 1 + filteredOptions.length) % filteredOptions.length
              if (!filteredOptions[next].disabled) return next
            }
            return prev
          })
        }
        break
      case 'Enter':
        if (activeIndex >= 0 && filteredOptions[activeIndex] && !filteredOptions[activeIndex].disabled) {
          e.preventDefault()
          handleSelectOption(filteredOptions[activeIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
    }
  }, [isOpen, filteredOptions, activeIndex, handleSelectOption, setOpen])

  // Handle cursor movement (click within textarea)
  const handleClick = useCallback(() => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart ?? 0
      detectMention(currentValue, cursorPos)
    }
  }, [currentValue, detectMention])

  const handleClear = useCallback(() => {
    if (!isControlled) setInternalValue('')
    onChange?.('')
    setOpen(false)
    textareaRef.current?.focus()
  }, [isControlled, onChange, setOpen])

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

  const textareaBaseStyle: CSSProperties = {
    width: '100%',
    padding: `${sc.paddingV} ${sc.paddingH}`,
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    lineHeight: sc.lineHeight,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: disabled ? tokens.colorTextSubtle : tokens.colorText,
    cursor: disabled ? 'not-allowed' : undefined,
    resize: (resizeProp && !autoSize) ? 'vertical' : 'none',
    boxSizing: 'border-box',
  }

  const dropdownBaseStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    zIndex: 1050,
    width: '100%',
    maxHeight: 'min(16rem, 40vh)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    boxShadow: tokens.shadowMd,
    padding: '0.25rem 0',
    opacity: isAnimating ? 1 : 0,
    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
    ...(flipUp
      ? {
          bottom: '100%',
          marginBottom: '0.25rem',
          transform: isAnimating ? 'translateY(0)' : 'translateY(6px)',
        }
      : {
          top: '100%',
          marginTop: '0.25rem',
          transform: isAnimating ? 'translateY(0)' : 'translateY(-6px)',
        }),
  }

  const optionBaseStyle: CSSProperties = {
    padding: '0.625rem 0.75rem',
    minHeight: '2.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '1.375rem',
    boxSizing: 'border-box',
  }

  const clearBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: tokens.colorTextMuted,
    cursor: 'pointer',
    transition: 'color 0.15s ease, background-color 0.15s ease',
  }

  const showClear = allowClear && !!currentValue && !disabled && !readOnly

  // ---- Render options ----
  const renderOptions = () => {
    if (filteredOptions.length === 0) {
      if (notFoundContent === null) return null
      return (
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: tokens.colorTextSubtle, textAlign: 'center' }}>
          {notFoundContent}
        </div>
      )
    }

    return filteredOptions.map((opt, idx) => {
      const isActive = idx === activeIndex
      const optStyle: CSSProperties = {
        ...optionBaseStyle,
        backgroundColor: isActive ? tokens.colorBgMuted : undefined,
        color: opt.disabled ? tokens.colorTextSubtle : tokens.colorText,
        cursor: opt.disabled ? 'not-allowed' : 'pointer',
        opacity: opt.disabled ? 0.5 : 1,
        ...styles?.option,
      }

      return (
        <div
          key={opt.value}
          role="option"
          aria-selected={isActive}
          aria-disabled={opt.disabled}
          data-option-index={idx}
          style={optStyle}
          className={classNames?.option}
          onClick={() => handleSelectOption(opt)}
          onMouseEnter={(e) => {
            if (!opt.disabled) {
              setActiveIndex(idx)
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }
          }}
          onMouseLeave={(e) => {
            if (!opt.disabled && !isActive) {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }
          }}
        >
          {opt.label ?? opt.value}
        </div>
      )
    })
  }

  // ---- Render ----
  const rootStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    width: '100%',
  }

  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootStyle, styles?.root, style)}
    >
      <div
        ref={wrapperRef}
        style={wrapperStyle}
        onMouseDown={() => { mouseDownRef.current = true }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <textarea
          ref={textareaRef}
          id={id}
          rows={autoSize ? 1 : rows}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          className={classNames?.textarea}
          style={mergeSemanticStyle(textareaBaseStyle, styles?.textarea)}
          role="textbox"
          aria-haspopup="listbox"
          aria-expanded={shouldShowDropdown}
          aria-autocomplete="list"
          autoComplete="off"
        />

        {showClear && (
          <button
            type="button"
            style={{
              ...clearBtnStyle,
              position: 'absolute',
              right: '0.25rem',
              top: '0.25rem',
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = tokens.colorText
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
            tabIndex={-1}
            aria-label="Clear"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {shouldShowDropdown && (
        <div
          ref={dropdownRef}
          role="listbox"
          style={mergeSemanticStyle(dropdownBaseStyle, styles?.dropdown)}
          className={classNames?.dropdown}
          onMouseDown={(e) => e.preventDefault()}
          onScroll={onPopupScroll}
        >
          {renderOptions()}
        </div>
      )}
    </div>
  )
})
