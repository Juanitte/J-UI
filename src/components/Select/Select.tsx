import {
  type ReactNode,
  type CSSProperties,
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

export type SelectMode = 'multiple' | 'tags'
export type SelectSize = 'large' | 'middle' | 'small'
export type SelectVariant = 'outlined' | 'filled' | 'borderless'
export type SelectStatus = 'error' | 'warning'
export type SelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

export type SelectSemanticSlot = 'root' | 'selector' | 'search' | 'dropdown' | 'option' | 'tag'
export type SelectClassNames = SemanticClassNames<SelectSemanticSlot>
export type SelectStyles = SemanticStyles<SelectSemanticSlot>

export interface SelectOption {
  value: string | number
  label?: ReactNode
  disabled?: boolean
  title?: string
  [key: string]: unknown
}

export interface SelectOptionGroup {
  label: ReactNode
  title?: string
  options: SelectOption[]
}

export interface SelectFieldNames {
  label?: string
  value?: string
  options?: string
}

export interface SelectTagRenderProps {
  label: ReactNode
  value: string | number
  closable: boolean
  onClose: () => void
}

export interface SelectLabelRenderProps {
  label: ReactNode
  value: string | number
}

export interface SelectProps {
  options?: (SelectOption | SelectOptionGroup)[]
  fieldNames?: SelectFieldNames
  value?: string | number | (string | number)[]
  defaultValue?: string | number | (string | number)[]
  mode?: SelectMode
  labelInValue?: boolean
  placeholder?: string
  showSearch?: boolean
  size?: SelectSize
  variant?: SelectVariant
  status?: SelectStatus
  placement?: SelectPlacement
  allowClear?: boolean
  disabled?: boolean
  loading?: boolean
  autoFocus?: boolean
  virtual?: boolean
  popupMatchSelectWidth?: boolean | number
  maxTagCount?: number
  maxTagPlaceholder?: ReactNode | ((omittedValues: (string | number)[]) => ReactNode)
  maxCount?: number
  defaultActiveFirstOption?: boolean
  optionFilterProp?: string
  filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean)
  filterSort?: (a: SelectOption, b: SelectOption) => number
  tokenSeparators?: string[]
  open?: boolean
  dropdownRender?: (menu: ReactNode) => ReactNode
  tagRender?: (props: SelectTagRenderProps) => ReactNode
  labelRender?: (props: SelectLabelRenderProps) => ReactNode
  notFoundContent?: ReactNode
  suffix?: ReactNode
  removeIcon?: ReactNode
  clearIcon?: ReactNode
  prefix?: ReactNode
  optionRender?: (option: SelectOption, info: { index: number }) => ReactNode
  onChange?: (value: any, option: any) => void
  onSelect?: (value: string | number, option: SelectOption) => void
  onDeselect?: (value: string | number, option: SelectOption) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onDropdownVisibleChange?: (open: boolean) => void
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
  className?: string
  style?: CSSProperties
  classNames?: SelectClassNames
  styles?: SelectStyles
}

// ============================================================================
// Icons
// ============================================================================

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CloseTagIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function LoadingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'j-select-spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

// ============================================================================
// FixedTooltip — escapes overflow:hidden via position:fixed
// ============================================================================

function FixedTooltip({ content, children }: { content: string; children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)

  const show = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({ top: rect.top - 4, left: rect.left + rect.width / 2 })
    setVisible(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)))
  }

  const hide = () => {
    setIsAnimating(false)
    setTimeout(() => setVisible(false), 150)
  }

  return (
    <span
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ display: 'inline-flex' }}
    >
      {children}
      {visible && (
        <div style={{
          position: 'fixed',
          zIndex: 9999,
          top: pos.top,
          left: pos.left,
          transform: `translate(-50%, -100%)${isAnimating ? '' : ' translateY(4px)'}`,
          padding: '0.375rem 0.625rem',
          borderRadius: '0.375rem',
          backgroundColor: tokens.colorBgMuted,
          color: tokens.colorText,
          fontSize: '0.8125rem',
          fontWeight: 500,
          whiteSpace: 'pre-line',
          boxShadow: tokens.shadowMd,
          border: `1px solid ${tokens.colorBorder}`,
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
          pointerEvents: 'none',
        }} role="tooltip">
          {content}
          <div style={{
            position: 'absolute',
            bottom: '-0.25rem',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '0.5rem',
            height: '0.5rem',
            backgroundColor: tokens.colorBgMuted,
            borderRight: `1px solid ${tokens.colorBorder}`,
            borderBottom: `1px solid ${tokens.colorBorder}`,
          }} />
        </div>
      )}
    </span>
  )
}

// ============================================================================
// Helpers
// ============================================================================

function isOptionGroup(opt: SelectOption | SelectOptionGroup): opt is SelectOptionGroup {
  return 'options' in opt && Array.isArray((opt as SelectOptionGroup).options)
}

function getOptValue(opt: SelectOption, fn: Required<SelectFieldNames>): string | number {
  return (fn.value !== 'value' ? (opt as Record<string, unknown>)[fn.value] : opt.value) as string | number
}

function getOptLabel(opt: SelectOption, fn: Required<SelectFieldNames>): ReactNode {
  const label = fn.label !== 'label' ? (opt as Record<string, unknown>)[fn.label] : opt.label
  return (label ?? getOptValue(opt, fn)) as ReactNode
}

function getSearchableText(opt: SelectOption, fn: Required<SelectFieldNames>): string {
  if (opt.title) return opt.title
  const label = getOptLabel(opt, fn)
  if (typeof label === 'string') return label
  if (typeof label === 'number') return String(label)
  return String(getOptValue(opt, fn))
}

function flattenOptions(
  options: (SelectOption | SelectOptionGroup)[],
  fn: Required<SelectFieldNames>,
): SelectOption[] {
  const flat: SelectOption[] = []
  for (const opt of options) {
    if (isOptionGroup(opt)) {
      const children = fn.options !== 'options'
        ? (opt as unknown as Record<string, unknown>)[fn.options] as SelectOption[]
        : opt.options
      if (children) flat.push(...children)
    } else {
      flat.push(opt)
    }
  }
  return flat
}

function defaultFilter(inputValue: string, option: SelectOption, fn: Required<SelectFieldNames>, optionFilterProp?: string): boolean {
  const search = inputValue.toLowerCase()
  if (optionFilterProp) {
    const propVal = (option as unknown as Record<string, unknown>)[optionFilterProp]
    return String(propVal ?? '').toLowerCase().includes(search)
  }
  const text = getSearchableText(option, fn).toLowerCase()
  return text.includes(search)
}

// ============================================================================
// Virtual scroll
// ============================================================================

const VIRTUAL_ITEM_HEIGHT = 32
const VIRTUAL_THRESHOLD = 32
const VIRTUAL_BUFFER = 5

type VirtualItem =
  | { type: 'option'; option: SelectOption; globalIndex: number }
  | { type: 'group-header'; label: ReactNode; key: string }

function highlightMatch(text: string, query: string): ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx < 0) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ fontWeight: 700, color: tokens.colorPrimary }}>{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

// ============================================================================
// Size Config
// ============================================================================

const sizeConfig: Record<SelectSize, { height: string; fontSize: string; padding: string; tagLineHeight: string }> = {
  large: { height: '2.5rem', fontSize: '1rem', padding: '0.5rem 0.75rem', tagLineHeight: '1.75rem' },
  middle: { height: '2.25rem', fontSize: '0.875rem', padding: '0.375rem 0.75rem', tagLineHeight: '1.5rem' },
  small: { height: '1.75rem', fontSize: '0.875rem', padding: '0.125rem 0.5rem', tagLineHeight: '1rem' },
}

// ============================================================================
// Select Component
// ============================================================================

function SelectComponent({
  options = [],
  fieldNames: rawFieldNames,
  value: controlledValue,
  defaultValue,
  mode,
  labelInValue = false,
  placeholder = 'Select...',
  showSearch,
  size = 'middle',
  variant = 'outlined',
  status,
  placement = 'bottomLeft',
  allowClear = false,
  disabled = false,
  loading = false,
  autoFocus = false,
  virtual = true,
  popupMatchSelectWidth = true,
  maxTagCount,
  maxTagPlaceholder,
  maxCount,
  defaultActiveFirstOption = true,
  optionFilterProp,
  filterOption = true,
  filterSort,
  tokenSeparators,
  open: controlledOpen,
  dropdownRender,
  tagRender,
  labelRender,
  notFoundContent,
  suffix,
  removeIcon,
  clearIcon,
  prefix,
  optionRender,
  onChange,
  onSelect,
  onDeselect,
  onSearch,
  onClear,
  onFocus,
  onBlur,
  onDropdownVisibleChange,
  onKeyDown,
  className,
  style,
  classNames,
  styles,
}: SelectProps) {
  const fn: Required<SelectFieldNames> = {
    label: rawFieldNames?.label ?? 'label',
    value: rawFieldNames?.value ?? 'value',
    options: rawFieldNames?.options ?? 'options',
  }

  const isMultiple = mode === 'multiple' || mode === 'tags'
  const effectiveShowSearch = showSearch ?? (mode === 'tags' || false)

  // ---- Controlled / uncontrolled state ----

  const isValueControlled = controlledValue !== undefined
  const [internalSingleValue, setInternalSingleValue] = useState<string | number | undefined>(() => {
    if (isMultiple) return undefined
    return (defaultValue as string | number | undefined) ?? undefined
  })
  const [internalMultiValue, setInternalMultiValue] = useState<(string | number)[]>(() => {
    if (!isMultiple) return []
    return (Array.isArray(defaultValue) ? defaultValue : defaultValue !== undefined ? [defaultValue] : []) as (string | number)[]
  })

  const currentSingleValue: string | number | undefined = isMultiple
    ? undefined
    : (isValueControlled ? controlledValue as string | number | undefined : internalSingleValue)

  const currentMultiValue: (string | number)[] = isMultiple
    ? (isValueControlled
      ? (Array.isArray(controlledValue)
        ? (controlledValue as (string | number)[]).filter((v) => v !== '' && v !== null && v !== undefined)
        : controlledValue !== undefined && controlledValue !== '' && controlledValue !== null
          ? [controlledValue as string | number]
          : [])
      : internalMultiValue)
    : []

  // Open state
  const isOpenControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = isOpenControlled ? controlledOpen : internalOpen

  // Internal states
  const [searchValue, setSearchValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)
  const [flipUp, setFlipUp] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Refs
  const rootRef = useRef<HTMLDivElement>(null)
  const selectorRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')
  const measureRef = useRef<HTMLSpanElement>(null)

  // ---- Flat options for filtering / navigation ----

  const allFlat = useMemo(() => flattenOptions(options, fn), [options, fn.label, fn.value, fn.options])

  const filteredOptions = useMemo(() => {
    if (!searchValue || filterOption === false) return options

    const filterFn = typeof filterOption === 'function'
      ? filterOption
      : (input: string, opt: SelectOption) => defaultFilter(input, opt, fn, optionFilterProp)

    const result = options
      .map((opt) => {
        if (isOptionGroup(opt)) {
          const children = (fn.options !== 'options'
            ? (opt as unknown as Record<string, unknown>)[fn.options] as SelectOption[]
            : opt.options
          ) ?? []
          const filtered = children.filter((child) => filterFn(searchValue, child))
          if (filtered.length === 0) return null
          return { ...opt, options: filtered }
        }
        return filterFn(searchValue, opt as SelectOption) ? opt : null
      })
      .filter(Boolean) as (SelectOption | SelectOptionGroup)[]

    return result
  }, [options, searchValue, filterOption, fn.label, fn.value, fn.options])

  const flatFiltered = useMemo(() => {
    let flat = flattenOptions(filteredOptions, fn)
    if (filterSort && searchValue) {
      flat = [...flat].sort(filterSort)
    }
    return flat
  }, [filteredOptions, filterSort, searchValue, fn.label, fn.value, fn.options])

  // ---- Virtual scroll items ----

  const virtualItems = useMemo((): VirtualItem[] => {
    let idx = 0
    const items: VirtualItem[] = []
    for (const opt of filteredOptions) {
      if (isOptionGroup(opt)) {
        const children = (fn.options !== 'options'
          ? (opt as unknown as Record<string, unknown>)[fn.options] as SelectOption[]
          : opt.options
        ) ?? []
        items.push({ type: 'group-header', label: opt.label, key: `group-${items.length}` })
        for (const child of children) {
          items.push({ type: 'option', option: child, globalIndex: idx++ })
        }
      } else {
        items.push({ type: 'option', option: opt as SelectOption, globalIndex: idx++ })
      }
    }
    return items
  }, [filteredOptions, fn.options])

  const useVirtual = virtual && virtualItems.length > VIRTUAL_THRESHOLD
  const [virtualScrollTop, setVirtualScrollTop] = useState(0)

  // ---- Find option by value ----

  const findOption = useCallback((val: string | number): SelectOption | undefined => {
    return allFlat.find((o) => getOptValue(o, fn) === val)
  }, [allFlat, fn.value])

  // ---- Value helpers ----

  const setOpen = useCallback((newOpen: boolean) => {
    if (!isOpenControlled) setInternalOpen(newOpen)
    onDropdownVisibleChange?.(newOpen)
    if (newOpen) {
      // Set initial direction from placement; useLayoutEffect will auto-correct if it overflows
      setFlipUp(placement.startsWith('top'))
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    } else {
      setIsAnimating(false)
    }
  }, [isOpenControlled, onDropdownVisibleChange])

  const handleSelectSingle = useCallback((opt: SelectOption) => {
    const val = getOptValue(opt, fn)
    if (!isValueControlled) setInternalSingleValue(val)
    const optionForCallback = labelInValue ? { value: val, label: getOptLabel(opt, fn) } : val
    onChange?.(optionForCallback, opt)
    onSelect?.(val, opt)
    setSearchValue('')
    setOpen(false)
    selectorRef.current?.focus()
  }, [fn, isValueControlled, labelInValue, onChange, onSelect, setOpen])

  const handleSelectMulti = useCallback((opt: SelectOption) => {
    const val = getOptValue(opt, fn)
    const isSelected = currentMultiValue.includes(val)

    let newValues: (string | number)[]
    if (isSelected) {
      newValues = currentMultiValue.filter((v) => v !== val)
      onDeselect?.(val, opt)
    } else {
      if (maxCount !== undefined && currentMultiValue.length >= maxCount) return
      newValues = [...currentMultiValue, val]
      onSelect?.(val, opt)
    }

    if (!isValueControlled) setInternalMultiValue(newValues)

    if (labelInValue) {
      const optionsForCallback = newValues.map((v) => {
        const o = findOption(v)
        return { value: v, label: o ? getOptLabel(o, fn) : v }
      })
      onChange?.(optionsForCallback, newValues.map((v) => findOption(v) ?? { value: v }))
    } else {
      onChange?.(newValues, newValues.map((v) => findOption(v) ?? { value: v }))
    }

    setSearchValue('')
  }, [fn, currentMultiValue, isValueControlled, labelInValue, maxCount, onChange, onSelect, onDeselect, findOption])

  const handleSelectOption = useCallback((opt: SelectOption) => {
    if (opt.disabled) return
    if (isMultiple) {
      handleSelectMulti(opt)
    } else {
      handleSelectSingle(opt)
    }
  }, [isMultiple, handleSelectSingle, handleSelectMulti])

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isMultiple) {
      if (!isValueControlled) setInternalMultiValue([])
      if (labelInValue) {
        onChange?.([], [])
      } else {
        onChange?.([], [])
      }
    } else {
      if (!isValueControlled) setInternalSingleValue(undefined)
      onChange?.(undefined, undefined)
    }
    setSearchValue('')
    onClear?.()
    selectorRef.current?.focus()
  }, [isMultiple, isValueControlled, labelInValue, onChange, onClear])

  const handleRemoveTag = useCallback((val: string | number) => {
    const opt = findOption(val)
    const newValues = currentMultiValue.filter((v) => v !== val)
    if (!isValueControlled) setInternalMultiValue(newValues)
    if (opt) onDeselect?.(val, opt)

    if (labelInValue) {
      const optionsForCallback = newValues.map((v) => {
        const o = findOption(v)
        return { value: v, label: o ? getOptLabel(o, fn) : v }
      })
      onChange?.(optionsForCallback, newValues.map((v) => findOption(v) ?? { value: v }))
    } else {
      onChange?.(newValues, newValues.map((v) => findOption(v) ?? { value: v }))
    }
  }, [currentMultiValue, isValueControlled, labelInValue, fn, onChange, onDeselect, findOption])

  // ---- Tags mode: create from search ----

  const handleCreateTag = useCallback(() => {
    if (mode !== 'tags' || !searchValue.trim()) return
    const trimmed = searchValue.trim()
    if (currentMultiValue.includes(trimmed)) {
      setSearchValue('')
      return
    }
    if (maxCount !== undefined && currentMultiValue.length >= maxCount) return
    const newValues = [...currentMultiValue, trimmed]
    if (!isValueControlled) setInternalMultiValue(newValues)
    const newOpt: SelectOption = { value: trimmed, label: trimmed }
    onSelect?.(trimmed, newOpt)

    if (labelInValue) {
      const optionsForCallback = newValues.map((v) => {
        const o = findOption(v)
        return { value: v, label: o ? getOptLabel(o, fn) : v }
      })
      onChange?.(optionsForCallback, newValues.map((v) => findOption(v) ?? { value: v }))
    } else {
      onChange?.(newValues, newValues.map((v) => findOption(v) ?? { value: v }))
    }
    setSearchValue('')
  }, [mode, searchValue, currentMultiValue, isValueControlled, labelInValue, fn, onChange, onSelect, findOption])

  // ---- Open/close ----

  const handleSelectorClick = () => {
    if (disabled) return
    if (isOpen) {
      if (!effectiveShowSearch) setOpen(false)
    } else {
      setOpen(true)
    }
    // Focus search input when opening with search
    if (effectiveShowSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
  }

  // ---- Search ----

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value

    // Token separators (tags mode)
    if (mode === 'tags' && tokenSeparators && tokenSeparators.length > 0) {
      const parts = newVal.split(new RegExp(`[${tokenSeparators.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}]`))
      if (parts.length > 1) {
        let accumulated = [...currentMultiValue]
        for (const part of parts) {
          const trimmed = part.trim()
          if (!trimmed || accumulated.includes(trimmed)) continue
          if (maxCount !== undefined && accumulated.length >= maxCount) break
          accumulated.push(trimmed)
          onSelect?.(trimmed, { value: trimmed, label: trimmed })
        }
        if (accumulated.length !== currentMultiValue.length) {
          if (!isValueControlled) setInternalMultiValue(accumulated)
          onChange?.(accumulated, accumulated.map((v) => findOption(v) ?? { value: v }))
        }
        setSearchValue('')
        onSearch?.('')
        return
      }
    }

    setSearchValue(newVal)
    onSearch?.(newVal)
    if (!isOpen) setOpen(true)
  }

  // ---- Keyboard ----

  const navigateOptions = useCallback((direction: 1 | -1) => {
    if (flatFiltered.length === 0) return
    let next = activeIndex
    for (let i = 0; i < flatFiltered.length; i++) {
      next = (next + direction + flatFiltered.length) % flatFiltered.length
      if (!flatFiltered[next].disabled) break
    }
    setActiveIndex(next)
  }, [flatFiltered, activeIndex])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    onKeyDown?.(e)

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
        if (isOpen) navigateOptions(-1)
        break
      case 'Enter':
        if (isOpen && activeIndex >= 0 && flatFiltered[activeIndex] && !flatFiltered[activeIndex].disabled) {
          e.preventDefault()
          handleSelectOption(flatFiltered[activeIndex])
        } else if (mode === 'tags' && searchValue.trim()) {
          e.preventDefault()
          handleCreateTag()
        }
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          setOpen(false)
          selectorRef.current?.focus()
        }
        break
      case 'Backspace':
        if (isMultiple && !searchValue && currentMultiValue.length > 0) {
          const lastVal = currentMultiValue[currentMultiValue.length - 1]
          handleRemoveTag(lastVal)
        }
        break
    }
  }

  // ---- Effects ----

  // Reset activeIndex when filtered list changes
  useEffect(() => {
    if (defaultActiveFirstOption && flatFiltered.length > 0) {
      const firstEnabled = flatFiltered.findIndex((o) => !o.disabled)
      setActiveIndex(firstEnabled >= 0 ? firstEnabled : -1)
    } else {
      setActiveIndex(-1)
    }
  }, [flatFiltered, defaultActiveFirstOption])

  // Click outside
  useEffect(() => {
    if (!isOpen && !isFocused) return
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        if (isOpen) {
          setOpen(false)
          setSearchValue('')
        }
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, isFocused, setOpen])

  // Scroll active option into view
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return
    const dropdown = dropdownRef.current
    if (!dropdown) return

    if (useVirtual) {
      // Find the virtual item index for this activeIndex
      const vIdx = virtualItems.findIndex((item) => item.type === 'option' && item.globalIndex === activeIndex)
      if (vIdx < 0) return
      const itemTop = vIdx * VIRTUAL_ITEM_HEIGHT
      const itemBottom = itemTop + VIRTUAL_ITEM_HEIGHT
      if (itemTop < dropdown.scrollTop) {
        dropdown.scrollTop = itemTop
      } else if (itemBottom > dropdown.scrollTop + dropdown.clientHeight) {
        dropdown.scrollTop = itemBottom - dropdown.clientHeight
      }
    } else {
      const activeEl = dropdown.querySelector(`[data-option-index="${activeIndex}"]`) as HTMLElement | null
      if (activeEl) {
        // Use scrollTop instead of scrollIntoView to avoid scrolling the whole page
        const elTop = activeEl.offsetTop
        const elBottom = elTop + activeEl.offsetHeight
        if (elTop < dropdown.scrollTop) {
          dropdown.scrollTop = elTop
        } else if (elBottom > dropdown.scrollTop + dropdown.clientHeight) {
          dropdown.scrollTop = elBottom - dropdown.clientHeight
        }
      }
    }
  }, [activeIndex, isOpen, useVirtual, virtualItems])

  // Auto-flip: measure actual dropdown and flip if it overflows viewport
  useLayoutEffect(() => {
    if (!isOpen || !dropdownRef.current || !rootRef.current) return
    const dropRect = dropdownRef.current.getBoundingClientRect()
    const rootRect = rootRef.current.getBoundingClientRect()
    const spaceAbove = rootRect.top
    const spaceBelow = window.innerHeight - rootRect.bottom

    if (!flipUp && dropRect.bottom > window.innerHeight) {
      // Opening downward but clipped at bottom — flip up if there's more room above
      if (spaceAbove > spaceBelow) setFlipUp(true)
    } else if (flipUp && dropRect.top < 0) {
      // Opening upward but clipped at top — flip down if there's more room below
      if (spaceBelow > spaceAbove) setFlipUp(false)
    }
  })

  // Auto focus
  useEffect(() => {
    if (autoFocus && selectorRef.current) {
      selectorRef.current.focus()
    }
  }, [autoFocus])

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && effectiveShowSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }
    if (!isOpen) {
      setSearchValue('')
    }
  }, [isOpen, effectiveShowSearch])

  // ---- Styles ----

  const sc = sizeConfig[size]

  const rootStyle = mergeSemanticStyle(
    { position: 'relative', display: 'inline-block', width: '100%' },
    styles?.root,
    style,
  )

  const variantStyles: Record<SelectVariant, CSSProperties> = {
    outlined: { border: `1px solid ${tokens.colorBorder}`, backgroundColor: tokens.colorBg },
    filled: { border: '1px solid transparent', backgroundColor: tokens.colorBgMuted },
    borderless: { border: '1px solid transparent', backgroundColor: 'transparent' },
  }

  const statusBorderColor = status === 'error'
    ? tokens.colorError
    : status === 'warning'
      ? tokens.colorWarning
      : undefined

  const focusRingColor = status === 'error'
    ? tokens.colorErrorBg
    : status === 'warning'
      ? tokens.colorWarningBg
      : tokens.colorPrimaryLight

  const hasClearable = isMultiple ? currentMultiValue.length > 0 : currentSingleValue !== undefined

  const selectorBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: isMultiple ? 'flex-start' : 'center',
    flexWrap: isMultiple ? 'wrap' : undefined,
    width: '100%',
    height: isMultiple ? 'auto' : sc.height,
    minHeight: isMultiple ? sc.height : undefined,
    padding: sc.padding,
    paddingRight: '2.25rem',
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    borderRadius: '0.375rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    color: disabled ? tokens.colorTextSubtle : tokens.colorText,
    ...variantStyles[variant],
    borderColor: isFocused && !disabled
      ? (statusBorderColor || tokens.colorPrimary)
      : (statusBorderColor || (variant === 'outlined' ? tokens.colorBorder : 'transparent')),
    boxShadow: isFocused && !disabled && focusSourceRef.current === 'keyboard'
      ? `0 0 0 2px ${focusRingColor}`
      : 'none',
    ...(disabled ? { opacity: 0.6 } : {}),
    boxSizing: 'border-box',
  }

  const mergedSelectorStyle = mergeSemanticStyle(selectorBaseStyle, styles?.selector)

  const isRight = placement.endsWith('Right')
  const dropdownWidth = typeof popupMatchSelectWidth === 'number'
    ? popupMatchSelectWidth
    : undefined

  const dropdownBaseStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1050,
    left: isRight ? undefined : 0,
    right: isRight ? 0 : undefined,
    width: dropdownWidth || (popupMatchSelectWidth === true ? '100%' : undefined),
    minWidth: popupMatchSelectWidth === false ? '7.5rem' : undefined,
    maxHeight: 'min(16rem, 40vh)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorBorderHover} transparent`,
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

  const optionBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    lineHeight: '1.375rem',
    whiteSpace: 'nowrap',
    ...(useVirtual ? { height: VIRTUAL_ITEM_HEIGHT, boxSizing: 'border-box' as const } : {}),
  }

  const suffixStyle: CSSProperties = {
    position: 'absolute',
    right: '0.5rem',
    top: isMultiple ? '0.625rem' : '50%',
    transform: isMultiple ? undefined : 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    pointerEvents: 'none',
  }

  const clearBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorTextMuted,
    cursor: 'pointer',
    padding: 0,
    pointerEvents: 'auto',
    transition: 'color 0.15s ease, background-color 0.15s ease',
  }

  const tagBaseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.0625rem 0.5rem',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    backgroundColor: tokens.colorBgMuted,
    borderRadius: '0.25rem',
    maxWidth: '12.5rem',
    border: `1px solid ${tokens.colorBorder}`,
  }

  const searchInputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorText,
    fontFamily: 'inherit',
    fontSize: sc.fontSize,
    padding: 0,
    margin: 0,
    lineHeight: sc.tagLineHeight,
  }

  // ---- Hover handlers (ref-based per MEMORY.md) ----

  const handleSelectorMouseEnter = useCallback(() => {
    if (disabled || isFocused) return
    const el = selectorRef.current
    if (!el) return
    if (variant === 'outlined') {
      el.style.borderColor = statusBorderColor || tokens.colorBorderHover
    }
  }, [disabled, isFocused, variant, statusBorderColor])

  const handleSelectorMouseLeave = useCallback(() => {
    if (disabled || isFocused) return
    const el = selectorRef.current
    if (!el) return
    if (variant === 'outlined') {
      el.style.borderColor = statusBorderColor || tokens.colorBorder
    }
  }, [disabled, isFocused, variant, statusBorderColor])

  // ---- Render: selected display (single mode) ----

  const selectedLabel = useMemo((): ReactNode | null => {
    if (isMultiple || currentSingleValue === undefined) return null
    const opt = findOption(currentSingleValue)
    const rawLabel = opt ? getOptLabel(opt, fn) : String(currentSingleValue)
    if (labelRender) return labelRender({ label: rawLabel, value: currentSingleValue })
    return rawLabel
  }, [isMultiple, currentSingleValue, findOption, fn, labelRender])

  // ---- Render: tags (multiple mode) ----

  const renderTags = () => {
    if (currentMultiValue.length === 0 && !searchValue && !effectiveShowSearch) {
      return (
        <span style={{ color: tokens.colorTextSubtle, flex: 1, lineHeight: sc.tagLineHeight }}>
          {placeholder}
        </span>
      )
    }

    const visibleCount = maxTagCount !== undefined ? Math.min(maxTagCount, currentMultiValue.length) : currentMultiValue.length
    const visibleValues = currentMultiValue.slice(0, visibleCount)
    const omittedValues = currentMultiValue.slice(visibleCount)

    return (
      <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', flex: 1, overflow: 'hidden', alignItems: 'center' }}>
        {visibleValues.map((val) => {
          const opt = findOption(val)
          const rawLabel = opt ? getOptLabel(opt, fn) : String(val)
          const displayLabel = labelRender ? labelRender({ label: rawLabel, value: val }) : rawLabel
          const closable = !disabled

          if (tagRender) {
            return <span key={String(val)}>{tagRender({ label: displayLabel, value: val, closable, onClose: () => handleRemoveTag(val) })}</span>
          }

          return (
            <span
              key={String(val)}
              style={mergeSemanticStyle(tagBaseStyle, styles?.tag)}
              className={classNames?.tag}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayLabel}</span>
              {closable && (
                <span
                  style={{ display: 'inline-flex', cursor: 'pointer', marginLeft: '0.25rem', color: tokens.colorTextMuted }}
                  onClick={(e) => { e.stopPropagation(); handleRemoveTag(val) }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {removeIcon ?? <CloseTagIcon />}
                </span>
              )}
            </span>
          )
        })}
        {omittedValues.length > 0 && (
          <FixedTooltip content={omittedValues.map((v) => {
            const o = findOption(v)
            return o ? String(getOptLabel(o, fn)) : String(v)
          }).join('\n')}>
            <span style={mergeSemanticStyle(tagBaseStyle, styles?.tag)} className={classNames?.tag}>
              {typeof maxTagPlaceholder === 'function'
                ? maxTagPlaceholder(omittedValues)
                : maxTagPlaceholder ?? `+${omittedValues.length}`}
            </span>
          </FixedTooltip>
        )}

        {/* Inline search input for multiple mode */}
        {effectiveShowSearch && (
          <>
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onMouseDown={() => { mouseDownRef.current = true }}
              onFocus={() => {
                if (!isFocused) {
                  focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
                  mouseDownRef.current = false
                }
                setIsFocused(true)
              }}
              style={{ ...searchInputStyle, width: `${Math.max(0.25, (searchValue.length + 1) * 0.5)}rem`, minWidth: currentMultiValue.length === 0 && !searchValue ? '100%' : '0.25rem', ...styles?.search }}
              className={classNames?.search}
              autoComplete="off"
              placeholder={currentMultiValue.length === 0 ? placeholder : undefined}
            />
            <span ref={measureRef} style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', fontSize: sc.fontSize, fontFamily: 'inherit' }}>{searchValue || ' '}</span>
          </>
        )}
      </span>
    )
  }

  // ---- Render: options ----

  let optionIndexCounter = 0

  const renderOption = (opt: SelectOption) => {
    const idx = optionIndexCounter++
    const val = getOptValue(opt, fn)
    const label = getOptLabel(opt, fn)
    const isActive = idx === activeIndex
    const isSelected = isMultiple
      ? currentMultiValue.includes(val)
      : currentSingleValue === val

    const isMaxed = isMultiple && !isSelected && maxCount !== undefined && currentMultiValue.length >= maxCount
    const isDisabled = opt.disabled || isMaxed

    const optStyle: CSSProperties = {
      ...optionBaseStyle,
      backgroundColor: isActive
        ? tokens.colorBgMuted
        : isSelected && !isMultiple
          ? tokens.colorPrimaryBg
          : undefined,
      color: isDisabled
        ? tokens.colorTextSubtle
        : isSelected && !isMultiple
          ? tokens.colorPrimary
          : tokens.colorText,
      fontWeight: isSelected ? 600 : undefined,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      ...styles?.option,
    }

    const labelContent = optionRender
      ? optionRender(opt, { index: idx })
      : (effectiveShowSearch && searchValue
        ? highlightMatch(getSearchableText(opt, fn), searchValue)
        : label)

    return (
      <div
        key={String(val)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        data-option-index={idx}
        style={optStyle}
        className={classNames?.option}
        onClick={() => !isMaxed && handleSelectOption(opt)}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            setActiveIndex(idx)
            if (!isSelected || isMultiple) {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && !isActive) {
            if (isSelected && !isMultiple) {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorPrimaryBg
            } else {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }
          }
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{labelContent}</span>
        {isMultiple && isSelected && (
          <span style={{ display: 'flex', marginLeft: '0.5rem', color: tokens.colorPrimary, flexShrink: 0 }}>
            <CheckIcon />
          </span>
        )}
      </div>
    )
  }

  const renderOptionsList = () => {
    optionIndexCounter = 0

    if (flatFiltered.length === 0) {
      const content = notFoundContent !== undefined ? notFoundContent : 'No data'
      if (content === null) return null
      return (
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: tokens.colorTextSubtle, textAlign: 'center' }}>
          {content}
        </div>
      )
    }

    // ---- Virtual scroll path ----
    if (useVirtual) {
      const totalHeight = virtualItems.length * VIRTUAL_ITEM_HEIGHT
      const visibleCount = Math.ceil(256 / VIRTUAL_ITEM_HEIGHT) // maxHeight ~256px
      const startIdx = Math.max(0, Math.floor(virtualScrollTop / VIRTUAL_ITEM_HEIGHT) - VIRTUAL_BUFFER)
      const endIdx = Math.min(virtualItems.length, startIdx + visibleCount + 2 * VIRTUAL_BUFFER)
      const topPad = startIdx * VIRTUAL_ITEM_HEIGHT
      const bottomPad = Math.max(0, (virtualItems.length - endIdx) * VIRTUAL_ITEM_HEIGHT)

      const visibleSlice = virtualItems.slice(startIdx, endIdx)

      return (
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ height: topPad }} />
          {visibleSlice.map((item) => {
            if (item.type === 'group-header') {
              return (
                <div key={item.key} style={{
                  height: VIRTUAL_ITEM_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0.75rem',
                  fontSize: '0.75rem',
                  color: tokens.colorTextSubtle,
                  fontWeight: 600,
                  userSelect: 'none',
                  boxSizing: 'border-box',
                }}>
                  {item.label}
                </div>
              )
            }
            // Reset counter for this option
            optionIndexCounter = item.globalIndex
            return renderOption(item.option)
          })}
          <div style={{ height: bottomPad }} />
        </div>
      )
    }

    // ---- Regular path ----
    return filteredOptions.map((opt, groupIdx) => {
      if (isOptionGroup(opt)) {
        const children = (fn.options !== 'options'
          ? (opt as unknown as Record<string, unknown>)[fn.options] as SelectOption[]
          : opt.options
        ) ?? []
        return (
          <div key={`group-${groupIdx}`}>
            <div style={{
              padding: '0.3125rem 0.75rem',
              fontSize: '0.75rem',
              color: tokens.colorTextSubtle,
              fontWeight: 600,
              userSelect: 'none',
            }}>
              {opt.label}
            </div>
            {children.map(renderOption)}
          </div>
        )
      }
      return renderOption(opt as SelectOption)
    })
  }

  // ---- Should show dropdown ----
  const hasContent = flatFiltered.length > 0 || (notFoundContent !== undefined && notFoundContent !== null)
  const shouldShowDropdown = isOpen && !disabled && (hasContent || loading)

  return (
    <div
      ref={rootRef}
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      <style>{`
        @keyframes j-select-spin { to { transform: rotate(360deg); } }
        .j-select-dropdown::-webkit-scrollbar { width: 4px; }
        .j-select-dropdown::-webkit-scrollbar-track { background: transparent; }
        .j-select-dropdown::-webkit-scrollbar-thumb { background: ${tokens.colorBorderHover}; border-radius: 4px; }
        .j-select-dropdown::-webkit-scrollbar-thumb:hover { background: ${tokens.colorTextSubtle}; }
      `}</style>

      {/* Selector */}
      <div
        ref={selectorRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        style={mergedSelectorStyle}
        className={classNames?.selector}
        onClick={handleSelectorClick}
        onKeyDown={isMultiple && effectiveShowSearch ? undefined : handleKeyDown}
        onMouseDown={() => { mouseDownRef.current = true }}
        onMouseEnter={handleSelectorMouseEnter}
        onMouseLeave={handleSelectorMouseLeave}
        onFocus={(e) => {
          if (e.target === e.currentTarget) {
            focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
            mouseDownRef.current = false
          }
          setIsFocused(true)
          onFocus?.()
        }}
        onBlur={(e) => {
          // Don't blur if focus moves within root
          const relatedTarget = e.relatedTarget as Node | null
          if (rootRef.current && relatedTarget && rootRef.current.contains(relatedTarget)) return
          setIsFocused(false)
          onBlur?.()
          if (!isOpenControlled) {
            setOpen(false)
            setSearchValue('')
          }
        }}
      >
        {prefix && (
          <span style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem', flexShrink: 0 }}>{prefix}</span>
        )}

        {isMultiple ? renderTags() : (
          <>
            {/* Single mode: search input overlay */}
            {effectiveShowSearch && isOpen ? (
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onMouseDown={() => { mouseDownRef.current = true }}
                onFocus={() => {
                  if (!isFocused) {
                    focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
                    mouseDownRef.current = false
                  }
                  setIsFocused(true)
                }}
                style={{
                  ...searchInputStyle,
                  width: '100%',
                  lineHeight: sc.height,
                  ...styles?.search,
                }}
                className={classNames?.search}
                autoComplete="off"
                placeholder={selectedLabel ? String(selectedLabel) : placeholder}
              />
            ) : (
              selectedLabel !== null ? (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {selectedLabel}
                </span>
              ) : (
                <span style={{ color: tokens.colorTextSubtle, flex: 1 }}>{placeholder}</span>
              )
            )}
          </>
        )}
      </div>

      {/* Suffix area */}
      <span style={suffixStyle}>
        {allowClear && hasClearable && !disabled && (
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
            {clearIcon ?? <ClearIcon />}
          </button>
        )}
        <span style={{
          display: 'flex',
          color: tokens.colorTextMuted,
          pointerEvents: 'none',
          transition: suffix ? undefined : 'transform 0.2s ease',
          transform: suffix ? undefined : (isOpen ? 'rotate(180deg)' : 'rotate(0deg)'),
        }}>
          {suffix ?? (loading ? <LoadingIcon /> : <ChevronDownIcon />)}
        </span>
      </span>

      {/* Dropdown */}
      {shouldShowDropdown && (
        <div
          ref={dropdownRef}
          role="listbox"
          style={mergedDropdownStyle}
          className={`j-select-dropdown${classNames?.dropdown ? ` ${classNames.dropdown}` : ''}`}
          onMouseDown={(e) => e.preventDefault()}
          onScroll={useVirtual ? (e) => setVirtualScrollTop((e.currentTarget as HTMLElement).scrollTop) : undefined}
        >
          {dropdownRender ? dropdownRender(<>{renderOptionsList()}</>) : renderOptionsList()}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Select.Option (noop marker for API surface)
// ============================================================================

function SelectOptionComponent(_props: SelectOption) {
  return null
}

// ============================================================================
// Export
// ============================================================================

export const Select = Object.assign(SelectComponent, {
  Option: SelectOptionComponent,
})
