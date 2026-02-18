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

export type NestedSelectExpandTrigger = 'click' | 'hover'
export type NestedSelectPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
export type NestedSelectSize = 'large' | 'middle' | 'small'
export type NestedSelectVariant = 'outlined' | 'filled' | 'borderless'
export type NestedSelectStatus = 'error' | 'warning'
export type NestedSelectFieldNames = { label?: string; value?: string; children?: string }
export type NestedSelectShowCheckedStrategy = 'SHOW_PARENT' | 'SHOW_CHILD'

export type NestedSelectSemanticSlot = 'root' | 'selector' | 'dropdown' | 'menu' | 'option'
export type NestedSelectClassNames = SemanticClassNames<NestedSelectSemanticSlot>
export type NestedSelectStyles = SemanticStyles<NestedSelectSemanticSlot>

export interface NestedSelectOption {
  value: string | number
  label?: ReactNode
  children?: NestedSelectOption[]
  disabled?: boolean
  disableCheckbox?: boolean
  isLeaf?: boolean
  loading?: boolean
  [key: string]: unknown
}

export interface NestedSelectSearchConfig {
  filter?: (inputValue: string, path: NestedSelectOption[]) => boolean
  render?: (inputValue: string, path: NestedSelectOption[]) => ReactNode
  limit?: number | false
}

export interface NestedSelectTagRenderProps {
  label: ReactNode
  value: (string | number)[]
  closable: boolean
  onClose: () => void
}

export interface NestedSelectProps {
  /** Opciones jerárquicas */
  options?: NestedSelectOption[]
  /** Valor seleccionado (controlado). Single: (string|number)[]. Multiple: (string|number)[][] */
  value?: (string | number)[] | (string | number)[][]
  /** Valor inicial (no controlado) */
  defaultValue?: (string | number)[] | (string | number)[][]
  /** Placeholder */
  placeholder?: string
  /** Visibilidad del dropdown (controlado) */
  open?: boolean
  /** Deshabilitar componente */
  disabled?: boolean
  /** Mostrar botón limpiar */
  allowClear?: boolean
  /** Cómo expandir sub-opciones */
  expandTrigger?: NestedSelectExpandTrigger
  /** Permitir seleccionar en niveles intermedios */
  changeOnSelect?: boolean
  /** Habilitar búsqueda */
  showSearch?: boolean | NestedSelectSearchConfig
  /** Variante visual */
  variant?: NestedSelectVariant
  /** Estado de validación */
  status?: NestedSelectStatus
  /** Tamaño */
  size?: NestedSelectSize
  /** Icono suffix */
  suffixIcon?: ReactNode
  /** Icono de expandir en las opciones */
  expandIcon?: ReactNode
  /** Contenido cuando no hay resultados de búsqueda */
  notFoundContent?: ReactNode
  /** Render custom del valor seleccionado (single mode) */
  displayRender?: (labels: string[], selectedOptions: NestedSelectOption[]) => ReactNode
  /** Mapeo de campos custom */
  fieldNames?: NestedSelectFieldNames
  /** Posición del dropdown */
  placement?: NestedSelectPlacement
  /** Selección múltiple con checkboxes */
  multiple?: boolean
  /** Estrategia de visualización en modo múltiple */
  showCheckedStrategy?: NestedSelectShowCheckedStrategy
  /** Máximo de tags visibles en modo múltiple */
  maxTagCount?: number
  /** Placeholder para tags ocultos */
  maxTagPlaceholder?: ReactNode | ((omittedValues: (string | number)[][]) => ReactNode)
  /** Render custom de cada tag en modo múltiple */
  tagRender?: (props: NestedSelectTagRenderProps) => ReactNode
  /** Carga lazy de opciones */
  loadData?: (selectedOptions: NestedSelectOption[]) => void
  /** Contenido antes del valor en el selector */
  prefix?: ReactNode
  /** Wrap custom del contenido del dropdown */
  popupRender?: (menus: ReactNode) => ReactNode
  /** Al cambiar selección */
  onChange?: (value: any, selectedOptions: any) => void
  /** Al cambiar visibilidad del dropdown */
  onDropdownVisibleChange?: (open: boolean) => void
  /** Clase CSS */
  className?: string
  /** Estilos inline */
  style?: CSSProperties
  /** Clases para slots */
  classNames?: NestedSelectClassNames
  /** Estilos para slots */
  styles?: NestedSelectStyles
}

export interface NestedSelectPanelProps {
  /** Opciones jerárquicas */
  options?: NestedSelectOption[]
  /** Valor (controlado) */
  value?: (string | number)[] | (string | number)[][]
  /** Valor inicial */
  defaultValue?: (string | number)[] | (string | number)[][]
  /** Al cambiar selección */
  onChange?: (value: any, selectedOptions: any) => void
  /** Selección múltiple */
  multiple?: boolean
  /** Cómo expandir sub-opciones */
  expandTrigger?: NestedSelectExpandTrigger
  /** Permitir seleccionar en niveles intermedios */
  changeOnSelect?: boolean
  /** Mapeo de campos custom */
  fieldNames?: NestedSelectFieldNames
  /** Icono de expandir */
  expandIcon?: ReactNode
  /** Deshabilitar */
  disabled?: boolean
  /** Clase CSS */
  className?: string
  /** Estilos inline */
  style?: CSSProperties
  /** Clases para slots */
  classNames?: NestedSelectClassNames
  /** Estilos para slots */
  styles?: NestedSelectStyles
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

function ChevronRightIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
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
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
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
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'j-nested-spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

// ============================================================================
// Helpers
// ============================================================================

function getOptionValue(opt: NestedSelectOption, fn: NestedSelectFieldNames): string | number {
  return (fn.value ? (opt as Record<string, unknown>)[fn.value] : opt.value) as string | number
}

function getOptionLabel(opt: NestedSelectOption, fn: NestedSelectFieldNames): ReactNode {
  const label = fn.label ? (opt as Record<string, unknown>)[fn.label] : opt.label
  return (label ?? getOptionValue(opt, fn)) as ReactNode
}

function getOptionChildren(opt: NestedSelectOption, fn: NestedSelectFieldNames): NestedSelectOption[] | undefined {
  return (fn.children ? (opt as Record<string, unknown>)[fn.children] : opt.children) as NestedSelectOption[] | undefined
}

function hasChildren(opt: NestedSelectOption, fn: NestedSelectFieldNames): boolean {
  if (opt.isLeaf === true) return false
  const children = getOptionChildren(opt, fn)
  return !!children && children.length > 0
}

/** Like hasChildren but also considers loadData expandable options */
function isExpandable(opt: NestedSelectOption, fn: NestedSelectFieldNames, hasLoadData: boolean): boolean {
  if (opt.isLeaf === true) return false
  const children = getOptionChildren(opt, fn)
  if (children && children.length > 0) return true
  // If loadData is configured and option is not explicitly a leaf, it's expandable (children not loaded yet)
  // At this point isLeaf is false | undefined (true was handled above), both mean "expandable with loadData"
  return hasLoadData
}

function getLabelString(label: ReactNode): string {
  if (typeof label === 'string') return label
  if (typeof label === 'number') return String(label)
  return ''
}

function findOption(options: NestedSelectOption[], val: string | number, fn: NestedSelectFieldNames): NestedSelectOption | undefined {
  return options.find((o) => getOptionValue(o, fn) === val)
}

function resolveValuePath(
  options: NestedSelectOption[],
  valuePath: (string | number)[],
  fn: NestedSelectFieldNames,
): NestedSelectOption[] {
  const result: NestedSelectOption[] = []
  let current = options
  for (const val of valuePath) {
    const opt = findOption(current, val, fn)
    if (!opt) break
    result.push(opt)
    const children = getOptionChildren(opt, fn)
    if (children) {
      current = children
    } else {
      break
    }
  }
  return result
}

function collectPaths(
  options: NestedSelectOption[],
  fn: NestedSelectFieldNames,
  parentPath: NestedSelectOption[] = [],
): NestedSelectOption[][] {
  const paths: NestedSelectOption[][] = []
  for (const opt of options) {
    const currentPath = [...parentPath, opt]
    const children = getOptionChildren(opt, fn)
    if (children && children.length > 0) {
      paths.push(...collectPaths(children, fn, currentPath))
    } else {
      paths.push(currentPath)
    }
  }
  return paths
}

function defaultSearchFilter(inputValue: string, path: NestedSelectOption[], fn: NestedSelectFieldNames): boolean {
  const search = inputValue.toLowerCase()
  return path.some((opt) => {
    const label = getLabelString(getOptionLabel(opt, fn))
    return label.toLowerCase().includes(search)
  })
}

// --- Multiple-mode helpers ---

function pathsEqual(a: (string | number)[], b: (string | number)[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function isPathSelected(path: (string | number)[], selectedPaths: (string | number)[][]): boolean {
  return selectedPaths.some((sp) => pathsEqual(sp, path))
}

/** Collect all leaf value paths under an option */
function collectLeafValuePaths(
  opt: NestedSelectOption,
  fn: NestedSelectFieldNames,
  parentPath: (string | number)[] = [],
): (string | number)[][] {
  const val = getOptionValue(opt, fn)
  const currentPath = [...parentPath, val]
  const children = getOptionChildren(opt, fn)
  if (children && children.length > 0) {
    const paths: (string | number)[][] = []
    for (const child of children) {
      paths.push(...collectLeafValuePaths(child, fn, currentPath))
    }
    return paths
  }
  return [currentPath]
}

/** Build the value path prefix up to a column index using expandedPath */
function buildValuePathUpTo(
  options: NestedSelectOption[],
  expandedPath: (string | number)[],
  fn: NestedSelectFieldNames,
  columnIndex: number,
): (string | number)[] {
  const result: (string | number)[] = []
  let current = options
  for (let i = 0; i < columnIndex; i++) {
    const val = expandedPath[i]
    if (val === undefined) break
    result.push(val)
    const opt = findOption(current, val, fn)
    if (opt) {
      const children = getOptionChildren(opt, fn)
      if (children) current = children
    }
  }
  return result
}

type CheckState = 'unchecked' | 'checked' | 'indeterminate'

function getCheckState(
  opt: NestedSelectOption,
  columnIndex: number,
  expandedPath: (string | number)[],
  selectedPaths: (string | number)[][],
  fn: NestedSelectFieldNames,
  options: NestedSelectOption[],
): CheckState {
  const pathPrefix = buildValuePathUpTo(options, expandedPath, fn, columnIndex)
  const children = getOptionChildren(opt, fn)
  if (!children || children.length === 0) {
    const val = getOptionValue(opt, fn)
    return isPathSelected([...pathPrefix, val], selectedPaths) ? 'checked' : 'unchecked'
  }
  const allLeafPaths = collectLeafValuePaths(opt, fn, pathPrefix)
  const selectedCount = allLeafPaths.filter((lp) => isPathSelected(lp, selectedPaths)).length
  if (selectedCount === 0) return 'unchecked'
  if (selectedCount === allLeafPaths.length) return 'checked'
  return 'indeterminate'
}

/** SHOW_PARENT strategy: collapse leaf selections to parent tags when all children selected */
function collapseToParents(
  selectedPaths: (string | number)[][],
  options: NestedSelectOption[],
  fn: NestedSelectFieldNames,
): (string | number)[][] {
  const result: (string | number)[][] = []
  const consumed = new Set<number>()

  function tryCollapse(opts: NestedSelectOption[], prefix: (string | number)[]): void {
    for (const opt of opts) {
      const val = getOptionValue(opt, fn)
      const path = [...prefix, val]
      const children = getOptionChildren(opt, fn)

      if (children && children.length > 0) {
        const allLeafs = collectLeafValuePaths(opt, fn, prefix)
        const allSelected = allLeafs.length > 0 && allLeafs.every((lp) => isPathSelected(lp, selectedPaths))
        if (allSelected) {
          result.push(path)
          allLeafs.forEach((lp) => {
            const idx = selectedPaths.findIndex((sp) => pathsEqual(sp, lp))
            if (idx >= 0) consumed.add(idx)
          })
        } else {
          tryCollapse(children, path)
        }
      }
    }
  }

  tryCollapse(options, [])
  selectedPaths.forEach((sp, idx) => {
    if (!consumed.has(idx)) result.push(sp)
  })
  return result
}

// ============================================================================
// NestedSelect Component
// ============================================================================

function NestedSelectComponent({
  options = [],
  value: controlledValue,
  defaultValue,
  placeholder = 'Seleccionar',
  open: controlledOpen,
  disabled = false,
  allowClear = true,
  expandTrigger = 'click',
  changeOnSelect = false,
  showSearch = false,
  variant = 'outlined',
  status,
  size = 'middle',
  suffixIcon,
  expandIcon,
  notFoundContent = 'Sin resultados',
  displayRender,
  fieldNames: rawFieldNames,
  placement = 'bottomLeft',
  multiple = false,
  showCheckedStrategy = 'SHOW_CHILD',
  maxTagCount,
  maxTagPlaceholder,
  tagRender,
  loadData,
  prefix,
  popupRender,
  onChange,
  onDropdownVisibleChange,
  className,
  style,
  classNames,
  styles,
}: NestedSelectProps) {
  const fn: Required<NestedSelectFieldNames> = {
    label: rawFieldNames?.label ?? 'label',
    value: rawFieldNames?.value ?? 'value',
    children: rawFieldNames?.children ?? 'children',
  }

  const hasLoadData = !!loadData

  // ---- Controlled / uncontrolled state ----

  // Single mode state
  const defaultSingleValue = multiple ? [] : (defaultValue as (string | number)[] ?? [])
  const isValueControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultSingleValue)
  const currentValue: (string | number)[] = multiple
    ? []
    : (isValueControlled ? controlledValue as (string | number)[] : internalValue)

  // Multiple mode state
  const defaultMultiValue = multiple ? (defaultValue as (string | number)[][] ?? []) : []
  const [internalMultiValue, setInternalMultiValue] = useState<(string | number)[][]>(defaultMultiValue)
  const currentMultiValue: (string | number)[][] = multiple
    ? (isValueControlled ? controlledValue as (string | number)[][] : internalMultiValue)
    : []

  // Open state
  const isOpenControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = isOpenControlled ? controlledOpen : internalOpen

  // Expanded path
  const [expandedPath, setExpandedPath] = useState<(string | number)[]>([])
  const [activeColumn, setActiveColumn] = useState(0)
  const [activeIndices, setActiveIndices] = useState<number[]>([])
  // Search
  const [searchValue, setSearchValue] = useState('')
  const [searchActiveIndex, setSearchActiveIndex] = useState(0)
  // Focus
  const [isFocused, setIsFocused] = useState(false)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')
  // Flip
  const [flipUp, setFlipUp] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Refs
  const rootRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectorRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const hoverTimeoutRef = useRef<number | null>(null)

  const isSearching = !!showSearch && searchValue.length > 0

  // ---- Value helpers ----

  const setValueSingle = useCallback((newValue: (string | number)[], selectedOpts: NestedSelectOption[]) => {
    if (!isValueControlled) setInternalValue(newValue)
    onChange?.(newValue, selectedOpts)
  }, [isValueControlled, onChange])

  const setValueMulti = useCallback((newValues: (string | number)[][], selectedOptsPaths: NestedSelectOption[][]) => {
    if (!isValueControlled) setInternalMultiValue(newValues)
    onChange?.(newValues, selectedOptsPaths)
  }, [isValueControlled, onChange])

  const preferTop = placement.startsWith('top')

  const setOpen = useCallback((newOpen: boolean) => {
    if (!isOpenControlled) setInternalOpen(newOpen)
    onDropdownVisibleChange?.(newOpen)
    if (newOpen) {
      // Set initial direction from placement; useLayoutEffect will auto-correct if it overflows
      setFlipUp(preferTop)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true))
      })
      if (!multiple && currentValue.length > 0) {
        setExpandedPath([...currentValue])
      } else if (multiple && currentMultiValue.length > 0) {
        setExpandedPath([...currentMultiValue[0]])
      } else {
        setExpandedPath([])
      }
      setSearchValue('')
      setActiveColumn(0)
      setActiveIndices([])
    } else {
      setIsAnimating(false)
    }
  }, [isOpenControlled, onDropdownVisibleChange, currentValue, currentMultiValue, multiple, preferTop])

  // ---- Auto-flip: measure real DOM and flip if it overflows ----
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

  // ---- Resolve current selection for display (single mode) ----
  const selectedOptions = useMemo(
    () => multiple ? [] : resolveValuePath(options, currentValue, fn),
    [options, currentValue, fn.label, fn.value, fn.children, multiple],
  )

  const selectedLabels = useMemo(
    () => selectedOptions.map((o) => getLabelString(getOptionLabel(o, fn))),
    [selectedOptions, fn.label],
  )

  const displayValue = useMemo(() => {
    if (multiple) return null
    if (currentValue.length === 0) return null
    if (displayRender) return displayRender(selectedLabels, selectedOptions)
    return selectedLabels.join(' / ')
  }, [multiple, currentValue, selectedLabels, selectedOptions, displayRender])

  // ---- Display paths for multiple mode (showCheckedStrategy) ----
  const displayPaths = useMemo((): (string | number)[][] => {
    if (!multiple || currentMultiValue.length === 0) return []
    if (showCheckedStrategy === 'SHOW_PARENT') {
      return collapseToParents(currentMultiValue, options, fn)
    }
    return currentMultiValue
  }, [multiple, currentMultiValue, showCheckedStrategy, options, fn.label, fn.value, fn.children])

  // ---- Build columns from expandedPath ----
  const columns = useMemo(() => {
    const cols: NestedSelectOption[][] = [options]
    let current = options
    for (const val of expandedPath) {
      const opt = findOption(current, val, fn)
      if (opt) {
        const children = getOptionChildren(opt, fn)
        if (children && children.length > 0) {
          cols.push(children)
          current = children
        } else {
          break
        }
      } else {
        break
      }
    }
    return cols
  }, [options, expandedPath, fn.value, fn.children])

  // ---- Search paths ----
  const searchConfig = typeof showSearch === 'object' ? showSearch : {}
  const searchPaths = useMemo(() => {
    if (!isSearching) return []
    const allPaths = collectPaths(options, fn)
    const filterFn = searchConfig.filter
      ? (path: NestedSelectOption[]) => searchConfig.filter!(searchValue, path)
      : (path: NestedSelectOption[]) => defaultSearchFilter(searchValue, path, fn)
    const filtered = allPaths.filter(filterFn)
    const limit = searchConfig.limit !== undefined ? searchConfig.limit : 50
    return limit === false ? filtered : filtered.slice(0, limit)
  }, [isSearching, searchValue, options, fn.label, fn.value, fn.children, searchConfig.filter, searchConfig.limit])

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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isOpen, showSearch])

  // Cleanup hover timeout
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  // ---- Handlers ----

  const handleSelectorClick = () => {
    if (disabled) return
    setOpen(!isOpen)
  }

  const handleSelectorKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(!isOpen)
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      setOpen(false)
    } else if (isOpen && !isSearching) {
      handleCascadeKeyDown(e)
    }
  }

  const handleExpandOption = (columnIndex: number, opt: NestedSelectOption) => {
    const val = getOptionValue(opt, fn)
    setExpandedPath((prev) => {
      const next = prev.slice(0, columnIndex)
      next[columnIndex] = val
      return next
    })

    // Trigger loadData if option has no children yet
    if (loadData) {
      const children = getOptionChildren(opt, fn)
      if (!children || children.length === 0) {
        const pathSoFar: NestedSelectOption[] = []
        let current = options
        for (let i = 0; i < columnIndex; i++) {
          const found = findOption(current, expandedPath[i], fn)
          if (found) {
            pathSoFar.push(found)
            const c = getOptionChildren(found, fn)
            if (c) current = c
          }
        }
        pathSoFar.push(opt)
        loadData(pathSoFar)
      }
    }
  }

  const handleSelectOption = (path: NestedSelectOption[]) => {
    const valuePath = path.map((o) => getOptionValue(o, fn))
    setValueSingle(valuePath, path)
    setOpen(false)
    selectorRef.current?.focus()
  }

  // --- Multiple mode: checkbox toggle ---
  const handleCheckboxToggle = useCallback((columnIndex: number, opt: NestedSelectOption) => {
    if (opt.disabled || opt.disableCheckbox) return

    const pathPrefix = buildValuePathUpTo(options, expandedPath, fn, columnIndex)
    const val = getOptionValue(opt, fn)
    const children = getOptionChildren(opt, fn)

    let pathsToToggle: (string | number)[][]
    if (children && children.length > 0) {
      // Parent: collect all non-disabled leaf paths
      pathsToToggle = collectLeafValuePaths(opt, fn, pathPrefix).filter((leafPath) => {
        const leafOpts = resolveValuePath(options, leafPath, fn)
        const leafOpt = leafOpts[leafOpts.length - 1]
        return leafOpt && !leafOpt.disabled && !leafOpt.disableCheckbox
      })
    } else {
      pathsToToggle = [[...pathPrefix, val]]
    }

    const checkState = getCheckState(opt, columnIndex, expandedPath, currentMultiValue, fn, options)
    let newValues: (string | number)[][]

    if (checkState === 'checked') {
      newValues = currentMultiValue.filter(
        (existing) => !pathsToToggle.some((tp) => pathsEqual(existing, tp)),
      )
    } else {
      const toAdd = pathsToToggle.filter(
        (tp) => !isPathSelected(tp, currentMultiValue),
      )
      newValues = [...currentMultiValue, ...toAdd]
    }

    const newSelectedOpts = newValues.map((vp) => resolveValuePath(options, vp, fn))
    setValueMulti(newValues, newSelectedOpts)
  }, [options, expandedPath, fn, currentMultiValue, setValueMulti])

  const handleOptionClick = (columnIndex: number, opt: NestedSelectOption) => {
    if (opt.disabled) return
    const expandable = isExpandable(opt, fn, hasLoadData)

    if (multiple) {
      if (expandable) {
        handleExpandOption(columnIndex, opt)
      }
      if (!opt.disableCheckbox) {
        handleCheckboxToggle(columnIndex, opt)
      }
      return
    }

    // Single mode
    if (expandable) {
      handleExpandOption(columnIndex, opt)
      if (changeOnSelect) {
        const partialPath: NestedSelectOption[] = []
        let current = options
        for (let i = 0; i < columnIndex; i++) {
          const found = findOption(current, expandedPath[i], fn)
          if (found) {
            partialPath.push(found)
            const children = getOptionChildren(found, fn)
            if (children) current = children
          }
        }
        partialPath.push(opt)
        const valuePath = partialPath.map((o) => getOptionValue(o, fn))
        setValueSingle(valuePath, partialPath)
      }
    } else {
      const fullPath: NestedSelectOption[] = []
      let current = options
      for (let i = 0; i < columnIndex; i++) {
        const found = findOption(current, expandedPath[i], fn)
        if (found) {
          fullPath.push(found)
          const children = getOptionChildren(found, fn)
          if (children) current = children
        }
      }
      fullPath.push(opt)
      handleSelectOption(fullPath)
    }
  }

  const handleOptionHover = (columnIndex: number, opt: NestedSelectOption) => {
    if (expandTrigger !== 'hover' || opt.disabled) return
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = window.setTimeout(() => {
      if (isExpandable(opt, fn, hasLoadData)) {
        handleExpandOption(columnIndex, opt)
      }
    }, 150)
  }

  const handleSearchSelect = (path: NestedSelectOption[]) => {
    if (multiple) {
      const valuePath = path.map((o) => getOptionValue(o, fn))
      const alreadySelected = isPathSelected(valuePath, currentMultiValue)
      let newValues: (string | number)[][]
      if (alreadySelected) {
        newValues = currentMultiValue.filter((vp) => !pathsEqual(vp, valuePath))
      } else {
        newValues = [...currentMultiValue, valuePath]
      }
      const newOpts = newValues.map((vp) => resolveValuePath(options, vp, fn))
      setValueMulti(newValues, newOpts)
    } else {
      handleSelectOption(path)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (multiple) {
      setValueMulti([], [])
    } else {
      setValueSingle([], [])
    }
    setExpandedPath([])
    selectorRef.current?.focus()
  }

  const handleRemoveTag = (pathToRemove: (string | number)[]) => {
    // If the display path is a collapsed parent (SHOW_PARENT), remove all its leaf descendants
    const leafPaths = resolveValuePath(options, pathToRemove, fn)
    const lastOpt = leafPaths[leafPaths.length - 1]
    if (lastOpt) {
      const children = getOptionChildren(lastOpt, fn)
      if (children && children.length > 0) {
        // It's a parent path - remove all its leaf descendants
        const parentPrefix = pathToRemove.slice(0, -1)
        const leafsToRemove = collectLeafValuePaths(lastOpt, fn, parentPrefix)
        const newValues = currentMultiValue.filter(
          (vp) => !leafsToRemove.some((lr) => pathsEqual(vp, lr)),
        )
        const newOpts = newValues.map((vp) => resolveValuePath(options, vp, fn))
        setValueMulti(newValues, newOpts)
        return
      }
    }
    // Leaf path - just remove it
    const newValues = currentMultiValue.filter((vp) => !pathsEqual(vp, pathToRemove))
    const newOpts = newValues.map((vp) => resolveValuePath(options, vp, fn))
    setValueMulti(newValues, newOpts)
  }

  // ---- Keyboard navigation for cascade panels ----
  const handleCascadeKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const col = activeColumn
    const currentCol = columns[col]
    if (!currentCol) return
    const currentIdx = activeIndices[col] ?? -1

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        let next = currentIdx
        for (let i = 0; i < currentCol.length; i++) {
          next = (next + 1) % currentCol.length
          if (!currentCol[next].disabled) break
        }
        setActiveIndices((prev) => {
          const copy = [...prev]
          copy[col] = next
          return copy
        })
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        let next = currentIdx < 0 ? currentCol.length : currentIdx
        for (let i = 0; i < currentCol.length; i++) {
          next = (next - 1 + currentCol.length) % currentCol.length
          if (!currentCol[next].disabled) break
        }
        setActiveIndices((prev) => {
          const copy = [...prev]
          copy[col] = next
          return copy
        })
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        if (currentIdx >= 0 && currentIdx < currentCol.length) {
          const opt = currentCol[currentIdx]
          if (isExpandable(opt, fn, hasLoadData) && !opt.disabled) {
            handleExpandOption(col, opt)
            setActiveColumn(col + 1)
            setActiveIndices((prev) => {
              const copy = [...prev]
              copy[col + 1] = 0
              return copy
            })
          }
        }
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (col > 0) {
          setActiveColumn(col - 1)
        }
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (currentIdx >= 0 && currentIdx < currentCol.length) {
          handleOptionClick(col, currentCol[currentIdx])
        }
        break
      }
    }
  }

  // ---- Search keyboard ----
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      selectorRef.current?.focus()
      return
    }
    if (!isSearching || searchPaths.length === 0) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSearchActiveIndex((prev) => Math.min(prev + 1, searchPaths.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSearchActiveIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (searchPaths[searchActiveIndex]) {
          handleSearchSelect(searchPaths[searchActiveIndex])
        }
        break
    }
  }

  // Reset search active index when results change
  useEffect(() => {
    setSearchActiveIndex(0)
  }, [searchPaths.length])

  // ---- Styles ----

  const sizeConfig: Record<NestedSelectSize, { height: string; fontSize: string; padding: string; tagLineHeight: string }> = {
    large: { height: '2.5rem', fontSize: '1rem', padding: '0.5rem 0.75rem', tagLineHeight: '1.75rem' },
    middle: { height: '2.25rem', fontSize: '0.875rem', padding: '0.375rem 0.75rem', tagLineHeight: '1.5rem' },
    small: { height: '1.75rem', fontSize: '0.875rem', padding: '0.125rem 0.5rem', tagLineHeight: '1rem' },
  }
  const sc = sizeConfig[size]

  const rootStyle = mergeSemanticStyle(
    { position: 'relative', display: 'inline-block', width: '100%' },
    styles?.root,
    style,
  )

  const variantStyles: Record<NestedSelectVariant, CSSProperties> = {
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

  const hasClearable = multiple ? currentMultiValue.length > 0 : currentValue.length > 0

  const selectorBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: multiple ? 'flex-start' : 'center',
    flexWrap: multiple ? 'wrap' : undefined,
    width: '100%',
    height: multiple ? 'auto' : sc.height,
    minHeight: multiple ? sc.height : undefined,
    padding: sc.padding,
    paddingRight: '2rem',
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    borderRadius: '0.375rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    color: disabled ? tokens.colorTextSubtle : statusBorderColor || tokens.colorText,
    ...variantStyles[variant],
    borderColor: isFocused && !disabled
      ? (statusBorderColor || tokens.colorPrimary)
      : (statusBorderColor || (variant === 'outlined' ? tokens.colorBorder : 'transparent')),
    boxShadow: isFocused && !disabled && focusSourceRef.current === 'keyboard'
      ? `0 0 0 2px ${focusRingColor}`
      : 'none',
    ...(disabled ? { opacity: 0.6 } : {}),
  }

  const mergedSelectorStyle = mergeSemanticStyle(selectorBaseStyle, styles?.selector)

  const isRight = placement.endsWith('Right')
  const dropdownBaseStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1050,
    left: isRight ? undefined : 0,
    right: isRight ? 0 : undefined,
    opacity: isAnimating ? 1 : 0,
    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    boxShadow: tokens.shadowMd,
    overflow: 'hidden',
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

  const menuBaseStyle: CSSProperties = {
    minWidth: '7.5rem',
    maxHeight: '16rem',
    overflowY: 'auto',
    padding: '0.25rem 0',
  }

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
  }

  const suffixStyle: CSSProperties = {
    position: 'absolute',
    right: '0.5rem',
    top: multiple ? '0.625rem' : '50%',
    transform: multiple ? undefined : 'translateY(-50%)',
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

  const searchInputStyle: CSSProperties = {
    width: '100%',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    border: 'none',
    borderBottom: `1px solid ${tokens.colorBorder}`,
    outline: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorText,
  }

  const tagStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '1px 0.5rem',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    backgroundColor: tokens.colorBgMuted,
    borderRadius: '0.25rem',
    maxWidth: '12.5rem',
    border: `1px solid ${tokens.colorBorder}`,
  }

  // ---- Render helpers ----

  const renderCheckbox = (state: CheckState, isDisabled: boolean) => {
    const boxStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1rem',
      height: '1rem',
      borderRadius: '0.1875rem',
      border: `1.5px solid ${state !== 'unchecked' ? tokens.colorPrimary : tokens.colorBorder}`,
      backgroundColor: state !== 'unchecked' ? tokens.colorPrimary : 'transparent',
      color: '#fff',
      marginRight: '0.5rem',
      flexShrink: 0,
      transition: 'all 0.15s ease',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
    }
    return (
      <span style={boxStyle}>
        {state === 'checked' && <CheckIcon />}
        {state === 'indeterminate' && <MinusIcon />}
      </span>
    )
  }

  const renderTags = () => {
    if (displayPaths.length === 0) {
      return <span style={{ color: tokens.colorTextSubtle, flex: 1, lineHeight: sc.tagLineHeight }}>{placeholder}</span>
    }

    const visibleCount = maxTagCount !== undefined ? Math.min(maxTagCount, displayPaths.length) : displayPaths.length
    const visiblePaths = displayPaths.slice(0, visibleCount)
    const omittedPaths = displayPaths.slice(visibleCount)

    return (
      <span style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', flex: 1, overflow: 'hidden', alignItems: 'center' }}>
        {visiblePaths.map((vp, idx) => {
          const opts = resolveValuePath(options, vp, fn)
          const labels = opts.map((o) => getLabelString(getOptionLabel(o, fn)))
          const label = labels.join(' / ')
          const closable = !disabled
          const onClose = () => handleRemoveTag(vp)

          if (tagRender) {
            return <span key={idx}>{tagRender({ label, value: vp, closable, onClose })}</span>
          }

          return (
            <span key={idx} style={tagStyle}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
              {closable && (
                <span
                  style={{ display: 'inline-flex', cursor: 'pointer', marginLeft: '0.25rem', color: tokens.colorTextMuted }}
                  onClick={(e) => { e.stopPropagation(); onClose() }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <CloseTagIcon />
                </span>
              )}
            </span>
          )
        })}
        {omittedPaths.length > 0 && (
          <span style={tagStyle}>
            {typeof maxTagPlaceholder === 'function'
              ? maxTagPlaceholder(omittedPaths)
              : maxTagPlaceholder ?? `+${omittedPaths.length}`}
          </span>
        )}
      </span>
    )
  }

  const renderOption = (opt: NestedSelectOption, columnIndex: number, optIndex: number) => {
    const val = getOptionValue(opt, fn)
    const label = getOptionLabel(opt, fn)
    const expandable = isExpandable(opt, fn, hasLoadData)
    const isSelected = !multiple && currentValue[columnIndex] === val
    const isKeyboardActive = activeColumn === columnIndex && activeIndices[columnIndex] === optIndex

    const optStyle: CSSProperties = {
      ...optionBaseStyle,
      backgroundColor: isKeyboardActive
        ? tokens.colorBgMuted
        : isSelected
          ? tokens.colorPrimaryBg
          : undefined,
      color: opt.disabled
        ? tokens.colorTextSubtle
        : isSelected
          ? tokens.colorPrimary
          : tokens.colorText,
      fontWeight: isSelected ? 600 : undefined,
      cursor: opt.disabled ? 'not-allowed' : 'pointer',
      opacity: opt.disabled ? 0.5 : 1,
      ...styles?.option,
    }

    return (
      <div
        key={String(val)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={opt.disabled}
        style={optStyle}
        className={classNames?.option}
        onClick={() => handleOptionClick(columnIndex, opt)}
        onMouseEnter={(e) => {
          if (!opt.disabled) {
            if (!isSelected && !isKeyboardActive) {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }
            handleOptionHover(columnIndex, opt)
          }
        }}
        onMouseLeave={(e) => {
          if (!opt.disabled && !isSelected && !isKeyboardActive) {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }
        }}
      >
        {multiple && renderCheckbox(
          getCheckState(opt, columnIndex, expandedPath, currentMultiValue, fn, options),
          !!opt.disabled || !!opt.disableCheckbox,
        )}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
        {expandable && (
          <span style={{ display: 'flex', marginLeft: '0.5rem', color: tokens.colorTextMuted, flexShrink: 0 }}>
            {opt.loading ? <LoadingIcon /> : (expandIcon ?? <ChevronRightIcon />)}
          </span>
        )}
      </div>
    )
  }

  const renderCascadeMenus = () => (
    <div style={{ display: 'flex' }}>
      {columns.map((col, colIdx) => {
        const isLastCol = colIdx === columns.length - 1
        const menuStyle: CSSProperties = {
          ...menuBaseStyle,
          borderRight: isLastCol ? undefined : `1px solid ${tokens.colorBorder}`,
          ...styles?.menu,
        }
        return (
          <div key={colIdx} style={menuStyle} className={classNames?.menu}>
            {col.map((opt, optIdx) => renderOption(opt, colIdx, optIdx))}
          </div>
        )
      })}
    </div>
  )

  const renderSearchResults = () => {
    if (searchPaths.length === 0) {
      return (
        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: tokens.colorTextSubtle, textAlign: 'center' }}>
          {notFoundContent}
        </div>
      )
    }

    return (
      <div style={{ ...menuBaseStyle, ...styles?.menu }} className={classNames?.menu}>
        {searchPaths.map((path, idx) => {
          const isActive = idx === searchActiveIndex
          const labels = path.map((o) => getLabelString(getOptionLabel(o, fn)))
          const rendered = searchConfig.render
            ? searchConfig.render(searchValue, path)
            : highlightMatch(labels.join(' / '), searchValue)

          // In multiple mode, show checkbox for search results
          const valuePath = path.map((o) => getOptionValue(o, fn))
          const isChecked = multiple && isPathSelected(valuePath, currentMultiValue)

          const itemStyle: CSSProperties = {
            ...optionBaseStyle,
            backgroundColor: isActive ? tokens.colorBgMuted : undefined,
            ...styles?.option,
          }

          return (
            <div
              key={idx}
              role="option"
              aria-selected={isActive}
              style={itemStyle}
              className={classNames?.option}
              onClick={() => handleSearchSelect(path)}
              onMouseEnter={(e) => {
                setSearchActiveIndex(idx)
                if (!isActive) {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                }
              }}
            >
              {multiple && renderCheckbox(isChecked ? 'checked' : 'unchecked', false)}
              <span style={{ flex: 1 }}>{rendered}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const menusContent = isSearching ? renderSearchResults() : renderCascadeMenus()

  return (
    <div
      ref={rootRef}
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      <style>{`@keyframes j-nested-spin { to { transform: rotate(360deg); } }`}</style>

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
        onKeyDown={handleSelectorKeyDown}
        onMouseDown={() => { mouseDownRef.current = true }}
        onFocus={() => {
          focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
          mouseDownRef.current = false
          setIsFocused(true)
        }}
        onBlur={() => setIsFocused(false)}
      >
        {prefix && (
          <span style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem', flexShrink: 0 }}>{prefix}</span>
        )}
        {multiple ? renderTags() : (
          displayValue ? (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {displayValue}
            </span>
          ) : (
            <span style={{ color: tokens.colorTextSubtle, flex: 1 }}>{placeholder}</span>
          )
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
            <ClearIcon />
          </button>
        )}
        <span style={{ display: 'flex', color: tokens.colorTextMuted, pointerEvents: 'none' }}>
          {suffixIcon ?? <ChevronDownIcon />}
        </span>
      </span>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={mergedDropdownStyle}
          className={classNames?.dropdown}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Search input */}
          {showSearch && (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              style={searchInputStyle}
              autoComplete="off"
            />
          )}

          {/* Content */}
          {popupRender ? popupRender(menusContent) : menusContent}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Panel Sub-component
// ============================================================================

function NestedSelectPanel({
  options = [],
  value: controlledValue,
  defaultValue,
  onChange,
  multiple = false,
  expandTrigger = 'click',
  changeOnSelect = false,
  fieldNames: rawFieldNames,
  expandIcon,
  disabled = false,
  className,
  style,
  classNames,
  styles,
}: NestedSelectPanelProps) {
  const fn: Required<NestedSelectFieldNames> = {
    label: rawFieldNames?.label ?? 'label',
    value: rawFieldNames?.value ?? 'value',
    children: rawFieldNames?.children ?? 'children',
  }

  // State
  const isValueControlled = controlledValue !== undefined

  // Single mode
  const defaultSingleVal = multiple ? [] : (defaultValue as (string | number)[] ?? [])
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultSingleVal)
  const currentValue: (string | number)[] = multiple
    ? []
    : (isValueControlled ? controlledValue as (string | number)[] : internalValue)

  // Multiple mode
  const defaultMultiVal = multiple ? (defaultValue as (string | number)[][] ?? []) : []
  const [internalMultiValue, setInternalMultiValue] = useState<(string | number)[][]>(defaultMultiVal)
  const currentMultiValue: (string | number)[][] = multiple
    ? (isValueControlled ? controlledValue as (string | number)[][] : internalMultiValue)
    : []

  const [expandedPath, setExpandedPath] = useState<(string | number)[]>(
    !multiple && currentValue.length > 0 ? [...currentValue] : [],
  )
  const activeColumn = -1
  const activeIndices: number[] = []
  const hoverTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  // Build columns
  const columns = useMemo(() => {
    const cols: NestedSelectOption[][] = [options]
    let current = options
    for (const val of expandedPath) {
      const opt = findOption(current, val, fn)
      if (opt) {
        const children = getOptionChildren(opt, fn)
        if (children && children.length > 0) {
          cols.push(children)
          current = children
        } else {
          break
        }
      } else {
        break
      }
    }
    return cols
  }, [options, expandedPath, fn.value, fn.children])

  // Handlers
  const setValueSingle = useCallback((newValue: (string | number)[], selectedOpts: NestedSelectOption[]) => {
    if (!isValueControlled) setInternalValue(newValue)
    onChange?.(newValue, selectedOpts)
  }, [isValueControlled, onChange])

  const setValueMulti = useCallback((newValues: (string | number)[][], selectedOptsPaths: NestedSelectOption[][]) => {
    if (!isValueControlled) setInternalMultiValue(newValues)
    onChange?.(newValues, selectedOptsPaths)
  }, [isValueControlled, onChange])

  const handleExpandOption = (columnIndex: number, opt: NestedSelectOption) => {
    const val = getOptionValue(opt, fn)
    setExpandedPath((prev) => {
      const next = prev.slice(0, columnIndex)
      next[columnIndex] = val
      return next
    })
  }

  const handleCheckboxToggle = useCallback((columnIndex: number, opt: NestedSelectOption) => {
    if (opt.disabled || opt.disableCheckbox) return
    const pathPrefix = buildValuePathUpTo(options, expandedPath, fn, columnIndex)
    const val = getOptionValue(opt, fn)
    const children = getOptionChildren(opt, fn)

    let pathsToToggle: (string | number)[][]
    if (children && children.length > 0) {
      pathsToToggle = collectLeafValuePaths(opt, fn, pathPrefix).filter((leafPath) => {
        const leafOpts = resolveValuePath(options, leafPath, fn)
        const leafOpt = leafOpts[leafOpts.length - 1]
        return leafOpt && !leafOpt.disabled && !leafOpt.disableCheckbox
      })
    } else {
      pathsToToggle = [[...pathPrefix, val]]
    }

    const checkState = getCheckState(opt, columnIndex, expandedPath, currentMultiValue, fn, options)
    let newValues: (string | number)[][]
    if (checkState === 'checked') {
      newValues = currentMultiValue.filter(
        (existing) => !pathsToToggle.some((tp) => pathsEqual(existing, tp)),
      )
    } else {
      const toAdd = pathsToToggle.filter(
        (tp) => !isPathSelected(tp, currentMultiValue),
      )
      newValues = [...currentMultiValue, ...toAdd]
    }
    const newSelectedOpts = newValues.map((vp) => resolveValuePath(options, vp, fn))
    setValueMulti(newValues, newSelectedOpts)
  }, [options, expandedPath, fn, currentMultiValue, setValueMulti])

  const handleOptionClick = (columnIndex: number, opt: NestedSelectOption) => {
    if (disabled || opt.disabled) return
    const expandable = hasChildren(opt, fn)

    if (multiple) {
      if (expandable) handleExpandOption(columnIndex, opt)
      if (!opt.disableCheckbox) handleCheckboxToggle(columnIndex, opt)
      return
    }

    if (expandable) {
      handleExpandOption(columnIndex, opt)
      if (changeOnSelect) {
        const partialPath: NestedSelectOption[] = []
        let current = options
        for (let i = 0; i < columnIndex; i++) {
          const found = findOption(current, expandedPath[i], fn)
          if (found) {
            partialPath.push(found)
            const children = getOptionChildren(found, fn)
            if (children) current = children
          }
        }
        partialPath.push(opt)
        const valuePath = partialPath.map((o) => getOptionValue(o, fn))
        setValueSingle(valuePath, partialPath)
      }
    } else {
      const fullPath: NestedSelectOption[] = []
      let current = options
      for (let i = 0; i < columnIndex; i++) {
        const found = findOption(current, expandedPath[i], fn)
        if (found) {
          fullPath.push(found)
          const children = getOptionChildren(found, fn)
          if (children) current = children
        }
      }
      fullPath.push(opt)
      const valuePath = fullPath.map((o) => getOptionValue(o, fn))
      setValueSingle(valuePath, fullPath)
    }
  }

  const handleOptionHover = (columnIndex: number, opt: NestedSelectOption) => {
    if (expandTrigger !== 'hover' || disabled || opt.disabled) return
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = window.setTimeout(() => {
      if (hasChildren(opt, fn)) {
        handleExpandOption(columnIndex, opt)
      }
    }, 150)
  }

  // Render checkbox
  const renderCheckbox = (state: CheckState, isDisabled: boolean) => {
    const boxStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1rem',
      height: '1rem',
      borderRadius: '0.1875rem',
      border: `1.5px solid ${state !== 'unchecked' ? tokens.colorPrimary : tokens.colorBorder}`,
      backgroundColor: state !== 'unchecked' ? tokens.colorPrimary : 'transparent',
      color: '#fff',
      marginRight: '0.5rem',
      flexShrink: 0,
      transition: 'all 0.15s ease',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
    }
    return (
      <span style={boxStyle}>
        {state === 'checked' && <CheckIcon />}
        {state === 'indeterminate' && <MinusIcon />}
      </span>
    )
  }

  // Styles
  const menuBaseStyle: CSSProperties = {
    minWidth: '7.5rem',
    maxHeight: '16rem',
    overflowY: 'auto',
    padding: '0.25rem 0',
  }

  const optionBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.15s ease',
    lineHeight: '1.375rem',
    whiteSpace: 'nowrap',
  }

  const rootBaseStyle: CSSProperties = {
    display: 'inline-flex',
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    overflow: 'hidden',
    ...style,
  }

  const renderOption = (opt: NestedSelectOption, columnIndex: number, optIndex: number) => {
    const val = getOptionValue(opt, fn)
    const label = getOptionLabel(opt, fn)
    const expandable = hasChildren(opt, fn)
    const isSelected = !multiple && currentValue[columnIndex] === val
    const isKeyboardActive = activeColumn === columnIndex && activeIndices[columnIndex] === optIndex
    const isDisabled = disabled || !!opt.disabled

    const optStyle: CSSProperties = {
      ...optionBaseStyle,
      backgroundColor: isKeyboardActive
        ? tokens.colorBgMuted
        : isSelected
          ? tokens.colorPrimaryBg
          : undefined,
      color: isDisabled
        ? tokens.colorTextSubtle
        : isSelected
          ? tokens.colorPrimary
          : tokens.colorText,
      fontWeight: isSelected ? 600 : undefined,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      ...styles?.option,
    }

    return (
      <div
        key={String(val)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        style={optStyle}
        className={classNames?.option}
        onClick={() => handleOptionClick(columnIndex, opt)}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            if (!isSelected && !isKeyboardActive) {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }
            handleOptionHover(columnIndex, opt)
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && !isSelected && !isKeyboardActive) {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }
        }}
      >
        {multiple && renderCheckbox(
          getCheckState(opt, columnIndex, expandedPath, currentMultiValue, fn, options),
          isDisabled || !!opt.disableCheckbox,
        )}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
        {expandable && (
          <span style={{ display: 'flex', marginLeft: '0.5rem', color: tokens.colorTextMuted, flexShrink: 0 }}>
            {expandIcon ?? <ChevronRightIcon />}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      style={mergeSemanticStyle(rootBaseStyle, styles?.root)}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      {columns.map((col, colIdx) => {
        const isLastCol = colIdx === columns.length - 1
        const menuStyle: CSSProperties = {
          ...menuBaseStyle,
          borderRight: isLastCol ? undefined : `1px solid ${tokens.colorBorder}`,
          ...styles?.menu,
        }
        return (
          <div key={colIdx} style={menuStyle} className={classNames?.menu}>
            {col.map((opt, optIdx) => renderOption(opt, colIdx, optIdx))}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Compound export
// ============================================================================

export const NestedSelect = Object.assign(NestedSelectComponent, {
  Panel: NestedSelectPanel,
  SHOW_PARENT: 'SHOW_PARENT' as const,
  SHOW_CHILD: 'SHOW_CHILD' as const,
})

// ============================================================================
// Highlight helper
// ============================================================================

function highlightMatch(text: string, query: string): ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: tokens.colorPrimary }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}
