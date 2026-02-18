import {
  type ReactNode,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type AutoCompleteVariant = 'outlined' | 'filled' | 'borderless'
export type AutoCompleteStatus = 'error' | 'warning'

export type AutoCompleteSemanticSlot = 'root' | 'input' | 'dropdown' | 'option'
export type AutoCompleteClassNames = SemanticClassNames<AutoCompleteSemanticSlot>
export type AutoCompleteStyles = SemanticStyles<AutoCompleteSemanticSlot>

export interface AutoCompleteOption {
  /** Valor de la opción (se usa para filtrar y como valor seleccionado) */
  value: string
  /** Contenido visual (si se omite, se usa value) */
  label?: ReactNode
  /** Deshabilitar esta opción */
  disabled?: boolean
  /** Sub-opciones para definir un grupo */
  options?: AutoCompleteOption[]
}

export interface AutoCompleteProps {
  /** Opciones disponibles */
  options?: AutoCompleteOption[]
  /** Valor del input (controlado) */
  value?: string
  /** Valor inicial (no controlado) */
  defaultValue?: string
  /** Placeholder */
  placeholder?: string
  /** Visibilidad del dropdown (controlado) */
  open?: boolean
  /** Visibilidad inicial del dropdown */
  defaultOpen?: boolean
  /** Deshabilitar componente */
  disabled?: boolean
  /** Mostrar botón limpiar */
  allowClear?: boolean
  /** Focus al montar */
  autoFocus?: boolean
  /** Rellenar input con opción resaltada al navegar con teclado */
  backfill?: boolean
  /** Activar primera opción automáticamente */
  defaultActiveFirstOption?: boolean
  /** Variante visual del input */
  variant?: AutoCompleteVariant
  /** Estado de validación */
  status?: AutoCompleteStatus
  /** Filtrar opciones. true = case-insensitive includes, false = sin filtro, fn = custom */
  filterOption?: boolean | ((inputValue: string, option: AutoCompleteOption) => boolean)
  /** Contenido cuando no hay coincidencias. null = ocultar dropdown */
  notFoundContent?: ReactNode
  /** Ancho del dropdown: true = igualar input, número = ancho fijo */
  popupMatchSelectWidth?: boolean | number
  /** Al cambiar input o seleccionar */
  onChange?: (value: string) => void
  /** Al escribir en el input */
  onSearch?: (value: string) => void
  /** Al seleccionar una opción */
  onSelect?: (value: string, option: AutoCompleteOption) => void
  /** Al obtener foco */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void
  /** Al perder foco */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  /** Al cambiar visibilidad del dropdown */
  onDropdownVisibleChange?: (open: boolean) => void
  /** Al limpiar */
  onClear?: () => void
  /** Contenido prefix del input (ej. icono a la izquierda) */
  prefix?: ReactNode
  /** Icono suffix del input. Por defecto no muestra nada. */
  suffix?: ReactNode
  /** Clase CSS */
  className?: string
  /** Estilos inline */
  style?: CSSProperties
  /** Clases para slots */
  classNames?: AutoCompleteClassNames
  /** Estilos para slots */
  styles?: AutoCompleteStyles
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

/** Flatten grouped options into a flat list for keyboard navigation */
function flattenOptions(options: AutoCompleteOption[]): AutoCompleteOption[] {
  const flat: AutoCompleteOption[] = []
  for (const opt of options) {
    if (opt.options) {
      flat.push(...opt.options)
    } else {
      flat.push(opt)
    }
  }
  return flat
}

/** Default filter: case-insensitive includes on value */
function defaultFilter(inputValue: string, option: AutoCompleteOption): boolean {
  const search = inputValue.toLowerCase()
  if (option.value.toLowerCase().includes(search)) return true
  if (typeof option.label === 'string' && option.label.toLowerCase().includes(search)) return true
  return false
}

// ============================================================================
// AutoComplete Component
// ============================================================================

export function AutoComplete({
  options = [],
  value: controlledValue,
  defaultValue = '',
  placeholder,
  open: controlledOpen,
  defaultOpen = false,
  disabled = false,
  allowClear = false,
  autoFocus = false,
  backfill = false,
  defaultActiveFirstOption = true,
  variant = 'outlined',
  status,
  filterOption = true,
  notFoundContent = null,
  popupMatchSelectWidth = true,
  onChange,
  onSearch,
  onSelect,
  onFocus,
  onBlur,
  onDropdownVisibleChange,
  onClear,
  prefix,
  suffix,
  className,
  style,
  classNames,
  styles,
}: AutoCompleteProps) {
  // ---- Controlled / uncontrolled state ----
  const isValueControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isValueControlled ? controlledValue : internalValue

  const isOpenControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isOpenControlled ? controlledOpen : internalOpen

  const [activeIndex, setActiveIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [flipUp, setFlipUp] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Refs
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const backfillValueRef = useRef<string | null>(null)

  // ---- Value helpers ----
  const setValue = useCallback((newValue: string) => {
    if (!isValueControlled) setInternalValue(newValue)
    onChange?.(newValue)
  }, [isValueControlled, onChange])

  const setOpen = useCallback((newOpen: boolean) => {
    if (!isOpenControlled) setInternalOpen(newOpen)
    onDropdownVisibleChange?.(newOpen)
    if (newOpen) {
      setFlipUp(false)
      // Animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
    }
  }, [isOpenControlled, onDropdownVisibleChange])

  // ---- Filter options ----
  const filteredOptions = useMemo(() => {
    if (filterOption === false) return options

    const filterFn = typeof filterOption === 'function' ? filterOption : defaultFilter

    return options
      .map((opt) => {
        // Group: filter children
        if (opt.options) {
          const filtered = opt.options.filter((child) => filterFn(currentValue, child))
          if (filtered.length === 0) return null
          return { ...opt, options: filtered }
        }
        // Regular option
        return filterFn(currentValue, opt) ? opt : null
      })
      .filter(Boolean) as AutoCompleteOption[]
  }, [options, currentValue, filterOption])

  const flatFiltered = useMemo(() => flattenOptions(filteredOptions), [filteredOptions])

  // ---- Should dropdown be visible ----
  const hasContent = flatFiltered.length > 0 || notFoundContent !== null
  const shouldShowDropdown = isOpen && hasContent && !disabled

  // ---- Reset activeIndex when filtered list changes ----
  useEffect(() => {
    if (defaultActiveFirstOption && flatFiltered.length > 0) {
      const firstEnabled = flatFiltered.findIndex((o) => !o.disabled)
      setActiveIndex(firstEnabled >= 0 ? firstEnabled : -1)
    } else {
      setActiveIndex(-1)
    }
  }, [flatFiltered, defaultActiveFirstOption])

  // ---- Auto-focus ----
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
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

  // ---- Auto-flip: measure actual dropdown and flip if it overflows viewport ----
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

  // ---- Handlers ----
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    backfillValueRef.current = null
    setValue(newValue)
    onSearch?.(newValue)
    if (!isOpen) setOpen(true)
  }

  const handleSelectOption = (option: AutoCompleteOption) => {
    if (option.disabled) return
    backfillValueRef.current = null
    setValue(option.value)
    onSelect?.(option.value, option)
    setOpen(false)
    inputRef.current?.focus()
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
    if (!isOpen && hasContent) {
      setOpen(true)
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Don't close if clicking inside dropdown
    const relatedTarget = e.relatedTarget as Node | null
    if (rootRef.current && relatedTarget && rootRef.current.contains(relatedTarget)) {
      return
    }
    setIsFocused(false)
    onBlur?.(e)
    // Commit backfill value
    if (backfillValueRef.current !== null) {
      setValue(backfillValueRef.current)
      backfillValueRef.current = null
    }
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    backfillValueRef.current = null
    setValue('')
    onClear?.()
    inputRef.current?.focus()
  }

  const navigateOptions = (direction: 1 | -1) => {
    if (flatFiltered.length === 0) return
    let next = activeIndex
    for (let i = 0; i < flatFiltered.length; i++) {
      next = (next + direction + flatFiltered.length) % flatFiltered.length
      if (!flatFiltered[next].disabled) break
    }
    setActiveIndex(next)
    if (backfill && flatFiltered[next]) {
      backfillValueRef.current = flatFiltered[next].value
      if (!isValueControlled) setInternalValue(flatFiltered[next].value)
      onChange?.(flatFiltered[next].value)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setOpen(true)
        } else {
          navigateOptions(1)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          navigateOptions(-1)
        }
        break
      case 'Enter':
        if (isOpen && activeIndex >= 0 && flatFiltered[activeIndex] && !flatFiltered[activeIndex].disabled) {
          e.preventDefault()
          handleSelectOption(flatFiltered[activeIndex])
        }
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          setOpen(false)
        }
        break
    }
  }

  // ---- Styles ----

  // Root
  const rootStyle = mergeSemanticStyle(
    {
      position: 'relative',
      display: 'inline-block',
      width: '100%',
    },
    styles?.root,
    style,
  )

  // Input border/background by variant
  const variantStyles: Record<AutoCompleteVariant, CSSProperties> = {
    outlined: {
      border: `1px solid ${tokens.colorBorder}`,
      backgroundColor: tokens.colorBg,
    },
    filled: {
      border: '1px solid transparent',
      backgroundColor: tokens.colorBgMuted,
    },
    borderless: {
      border: '1px solid transparent',
      backgroundColor: 'transparent',
    },
  }

  // Status border override
  const statusBorderColor = status === 'error'
    ? tokens.colorError
    : status === 'warning'
      ? tokens.colorWarning
      : undefined

  // Focus ring color
  const focusRingColor = status === 'error'
    ? tokens.colorErrorBg
    : status === 'warning'
      ? tokens.colorWarningBg
      : tokens.colorPrimaryLight

  const inputBaseStyle: CSSProperties = {
    width: '100%',
    minHeight: '2.75rem',
    padding: '0.375rem 0.75rem',
    paddingLeft: prefix ? '2rem' : '0.75rem',
    paddingRight: allowClear && currentValue ? (suffix ? '3.5rem' : '2.25rem') : (suffix ? '2rem' : '0.75rem'),
    fontSize: '1rem',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    borderRadius: '0.375rem',
    outline: 'none',
    color: disabled ? tokens.colorTextSubtle : statusBorderColor || tokens.colorText,
    cursor: disabled ? 'not-allowed' : undefined,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    ...variantStyles[variant],
    ...(statusBorderColor ? { borderColor: statusBorderColor } : {}),
    ...(isFocused && !disabled ? {
      borderColor: statusBorderColor || tokens.colorPrimary,
      boxShadow: `0 0 0 2px ${focusRingColor}`,
    } : {}),
    ...(disabled ? { opacity: 0.6 } : {}),
  }

  const mergedInputStyle = mergeSemanticStyle(inputBaseStyle, styles?.input)

  // Dropdown
  const dropdownWidth = typeof popupMatchSelectWidth === 'number'
    ? popupMatchSelectWidth
    : undefined

  const dropdownBaseStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    zIndex: 1050,
    width: dropdownWidth || (popupMatchSelectWidth === true ? '100%' : undefined),
    minWidth: popupMatchSelectWidth === false ? 120 : undefined,
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

  const mergedDropdownStyle = mergeSemanticStyle(dropdownBaseStyle, styles?.dropdown)

  // Option base
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

  // Suffix area
  const suffixStyle: CSSProperties = {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    pointerEvents: 'none',
  }

  // Clear button — 28px touch target with 14px icon centered
  const clearBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    margin: -4,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorTextMuted,
    cursor: 'pointer',
    padding: 0,
    pointerEvents: 'auto',
    transition: 'color 0.15s ease',
  }

  // ---- Render helpers ----

  // Track the global option index for keyboard nav
  let optionIndexCounter = 0

  const renderOption = (opt: AutoCompleteOption) => {
    const idx = optionIndexCounter++
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
  }

  const renderOptions = () => {
    // Reset counter for each render
    optionIndexCounter = 0

    if (flatFiltered.length === 0) {
      if (notFoundContent === null) return null
      return (
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: tokens.colorTextSubtle, textAlign: 'center' }}>
          {notFoundContent}
        </div>
      )
    }

    return filteredOptions.map((opt) => {
      // Group
      if (opt.options) {
        return (
          <div key={`group-${opt.value}`}>
            <div
              style={{
                padding: '0.3125rem 0.75rem',
                fontSize: '0.75rem',
                color: tokens.colorTextSubtle,
                fontWeight: 600,
                userSelect: 'none',
              }}
            >
              {opt.label ?? opt.value}
            </div>
            {opt.options.map(renderOption)}
          </div>
        )
      }
      // Regular option
      return renderOption(opt)
    })
  }

  return (
    <div
      ref={rootRef}
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={shouldShowDropdown}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        autoComplete="off"
        value={currentValue}
        placeholder={placeholder}
        disabled={disabled}
        style={mergedInputStyle}
        className={classNames?.input}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />

      {/* Prefix area */}
      {prefix && (
        <span style={{
          position: 'absolute',
          left: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          color: tokens.colorTextMuted,
          pointerEvents: 'none',
        }}>
          {prefix}
        </span>
      )}

      {/* Suffix area */}
      {(suffix || (allowClear && currentValue && !disabled)) && (
        <span style={suffixStyle}>
          {allowClear && currentValue && !disabled && (
            <button
              type="button"
              style={clearBtnStyle}
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
          {suffix && (
            <span style={{ display: 'flex', color: tokens.colorTextMuted }}>
              {suffix}
            </span>
          )}
        </span>
      )}

      {/* Dropdown */}
      {shouldShowDropdown && (
        <div
          ref={dropdownRef}
          role="listbox"
          style={mergedDropdownStyle}
          className={classNames?.dropdown}
          onMouseDown={(e) => e.preventDefault()}
        >
          {renderOptions()}
        </div>
      )}
    </div>
  )
}
