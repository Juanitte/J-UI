import {
  type ReactNode,
  type CSSProperties,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export interface TransferItem {
  key: string
  title: string
  description?: string
  disabled?: boolean
  [key: string]: unknown
}

export type TransferDirection = 'left' | 'right'
export type TransferStatus = 'error' | 'warning'

export type TransferSemanticSlot = 'root' | 'list' | 'header' | 'search' | 'item' | 'operation'
export type TransferClassNames = SemanticClassNames<TransferSemanticSlot>
export type TransferStyles = SemanticStyles<TransferSemanticSlot>

export interface TransferProps {
  dataSource: TransferItem[]
  targetKeys?: string[]
  defaultTargetKeys?: string[]
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  onChange?: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void
  onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void
  onSearch?: (direction: TransferDirection, value: string) => void
  render?: (record: TransferItem) => ReactNode
  disabled?: boolean
  showSearch?: boolean
  filterOption?: (inputValue: string, item: TransferItem) => boolean
  titles?: [ReactNode, ReactNode]
  operations?: [string, string]
  showSelectAll?: boolean
  oneWay?: boolean
  status?: TransferStatus
  footer?: ReactNode | ((props: { direction: TransferDirection }) => ReactNode)
  pagination?: boolean | { pageSize?: number }
  listStyle?: CSSProperties | ((direction: TransferDirection) => CSSProperties)
  className?: string
  style?: CSSProperties
  classNames?: TransferClassNames
  styles?: TransferStyles
}

// ============================================================================
// Icons
// ============================================================================

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 5.5 4 7.5 8 3" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2.5" y1="5" x2="7.5" y2="5" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'right'
        ? <polyline points="9 18 15 12 9 6" />
        : <polyline points="15 18 9 12 15 6" />
      }
    </svg>
  )
}

// ============================================================================
// InlineCheckbox (helper)
// ============================================================================

interface InlineCheckboxProps {
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange: () => void
}

function InlineCheckbox({ checked, indeterminate, disabled, onChange }: InlineCheckboxProps) {
  const showCheck = checked && !indeterminate
  const showMinus = indeterminate

  const boxStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.875rem',
    height: '0.875rem',
    borderRadius: '0.1875rem',
    border: `2px solid ${(checked || indeterminate) ? tokens.colorPrimary : tokens.colorBorder}`,
    backgroundColor: (checked || indeterminate) ? tokens.colorPrimary : 'transparent',
    color: '#fff',
    flexShrink: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
    opacity: disabled ? 0.5 : 1,
  }

  return (
    <span
      style={boxStyle}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onChange()
      }}
    >
      {showCheck && <CheckIcon />}
      {showMinus && <MinusIcon />}
    </span>
  )
}

// ============================================================================
// TransferList (internal)
// ============================================================================

interface TransferListProps {
  direction: TransferDirection
  items: TransferItem[]
  selectedKeys: string[]
  onSelect: (key: string) => void
  onSelectAll: (keys: string[], checked: boolean) => void
  title?: ReactNode
  showSearch: boolean
  searchValue: string
  onSearchChange: (value: string) => void
  filterOption: (inputValue: string, item: TransferItem) => boolean
  render?: (record: TransferItem) => ReactNode
  disabled: boolean
  showSelectAll: boolean
  oneWay: boolean
  onRemove?: (key: string) => void
  footer?: ReactNode
  pagination?: { pageSize: number }
  listStyle?: CSSProperties
  classNames?: TransferClassNames
  styles?: TransferStyles
  statusBorderColor?: string
}

function TransferList({
  direction, items, selectedKeys, onSelect, onSelectAll,
  title, showSearch, searchValue, onSearchChange,
  filterOption, render: renderItem, disabled, showSelectAll,
  oneWay, onRemove,
  footer, pagination,
  listStyle, classNames, styles: slotStyles, statusBorderColor,
}: TransferListProps) {
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys])

  const filteredItems = useMemo(() => {
    if (!searchValue) return items
    return items.filter(item => filterOption(searchValue, item))
  }, [items, searchValue, filterOption])

  const enabledItems = useMemo(
    () => filteredItems.filter(item => !item.disabled),
    [filteredItems],
  )

  const selectedCount = useMemo(
    () => enabledItems.filter(item => selectedSet.has(item.key)).length,
    [enabledItems, selectedSet],
  )

  // ---- Pagination ----
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = pagination?.pageSize ?? 10
  const totalPages = pagination ? Math.max(1, Math.ceil(filteredItems.length / pageSize)) : 1
  const effectivePage = Math.min(currentPage, totalPages)

  useEffect(() => { setCurrentPage(1) }, [searchValue])

  const displayItems = pagination
    ? filteredItems.slice((effectivePage - 1) * pageSize, effectivePage * pageSize)
    : filteredItems

  const allSelected = enabledItems.length > 0 && selectedCount === enabledItems.length
  const someSelected = selectedCount > 0 && !allSelected

  const handleSelectAll = () => {
    if (disabled) return
    const enabledKeys = enabledItems.map(item => item.key)
    onSelectAll(enabledKeys, !allSelected)
  }

  // ---- Styles ----
  const panelStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '12rem',
    height: '18rem',
    border: `1px solid ${statusBorderColor ?? tokens.colorBorder}`,
    borderRadius: '0.5rem',
    backgroundColor: tokens.colorBg,
    overflow: 'hidden',
    ...listStyle,
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderBottom: `1px solid ${tokens.colorBorder}`,
    backgroundColor: tokens.colorBgSubtle,
    color: tokens.colorText,
  }

  const countStyle: CSSProperties = {
    flex: 1,
    fontSize: '0.75rem',
    opacity: 0.65,
    textAlign: 'right',
  }

  const searchWrapStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    borderBottom: `1px solid ${tokens.colorBorder}`,
    color: tokens.colorTextSubtle,
  }

  const searchInputStyle: CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: tokens.colorText,
    fontSize: '0.8125rem',
    fontFamily: 'inherit',
    padding: 0,
  }

  const bodyStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorBorderHover} transparent`,
  }

  const itemBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.375rem 0.75rem',
    minHeight: '2rem',
    transition: 'background-color 0.15s ease',
    fontSize: '0.8125rem',
    color: tokens.colorText,
  }

  const emptyStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorTextSubtle,
    fontSize: '0.8125rem',
  }

  const unit = enabledItems.length === 1 ? 'item' : 'items'
  const isTarget = direction === 'right'

  return (
    <div
      className={classNames?.list}
      style={mergeSemanticStyle(panelStyle, slotStyles?.list)}
    >
      {/* Header */}
      <div
        className={classNames?.header}
        style={mergeSemanticStyle(headerStyle, slotStyles?.header)}
      >
        {showSelectAll && (
          <InlineCheckbox
            checked={allSelected}
            indeterminate={someSelected}
            disabled={disabled || enabledItems.length === 0}
            onChange={handleSelectAll}
          />
        )}
        {title != null && (
          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
            {title}
          </span>
        )}
        <span style={countStyle}>
          {selectedCount > 0 ? `${selectedCount}/` : ''}{enabledItems.length} {unit}
        </span>
      </div>

      {/* Search */}
      {showSearch && (
        <div
          className={classNames?.search}
          style={mergeSemanticStyle(searchWrapStyle, slotStyles?.search)}
        >
          <SearchIcon />
          <input
            type="text"
            value={searchValue}
            placeholder="Search..."
            disabled={disabled}
            onChange={(e) => onSearchChange(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      )}

      {/* Body */}
      {filteredItems.length === 0 ? (
        <div style={emptyStyle}>No data</div>
      ) : (
        <div style={bodyStyle}>
          {displayItems.map(item => {
            const isChecked = selectedSet.has(item.key)
            const isDisabled = disabled || !!item.disabled
            const showRemove = oneWay && isTarget && !isDisabled

            return (
              <div
                key={item.key}
                className={classNames?.item}
                style={mergeSemanticStyle({
                  ...itemBaseStyle,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                }, slotStyles?.item)}
                onClick={() => { if (!isDisabled) onSelect(item.key) }}
                onMouseEnter={(e) => {
                  if (!isDisabled) (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = ''
                }}
              >
                {!(oneWay && isTarget) && (
                  <InlineCheckbox
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => { if (!isDisabled) onSelect(item.key) }}
                  />
                )}
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {renderItem ? renderItem(item) : item.title}
                </span>
                {showRemove && (
                  <span
                    style={{
                      display: 'inline-flex', cursor: 'pointer', color: tokens.colorTextSubtle,
                      padding: '0.125rem', borderRadius: '0.125rem',
                      transition: 'color 0.15s ease',
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove?.(item.key)
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorError }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorTextSubtle }}
                  >
                    <CloseIcon />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && filteredItems.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.375rem',
          padding: '0.375rem 0.75rem',
          borderTop: `1px solid ${tokens.colorBorder}`,
          fontSize: '0.75rem',
          color: tokens.colorTextMuted,
        }}>
          <button
            type="button"
            disabled={effectivePage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '1.25rem', height: '1.25rem', borderRadius: '0.1875rem',
              border: 'none', backgroundColor: 'transparent', padding: 0,
              color: effectivePage > 1 ? tokens.colorPrimary : tokens.colorTextSubtle,
              cursor: effectivePage > 1 ? 'pointer' : 'not-allowed',
              opacity: effectivePage > 1 ? 1 : 0.4,
            }}
          >
            <ChevronIcon direction="left" />
          </button>
          <span>{effectivePage}/{totalPages}</span>
          <button
            type="button"
            disabled={effectivePage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '1.25rem', height: '1.25rem', borderRadius: '0.1875rem',
              border: 'none', backgroundColor: 'transparent', padding: 0,
              color: effectivePage < totalPages ? tokens.colorPrimary : tokens.colorTextSubtle,
              cursor: effectivePage < totalPages ? 'pointer' : 'not-allowed',
              opacity: effectivePage < totalPages ? 1 : 0.4,
            }}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}

      {/* Footer */}
      {footer != null && (
        <div style={{
          padding: '0.5rem 0.75rem',
          borderTop: `1px solid ${tokens.colorBorder}`,
          fontSize: '0.8125rem',
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Transfer Component
// ============================================================================

function TransferComponent({
  dataSource,
  targetKeys: controlledTargetKeys,
  defaultTargetKeys,
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  onChange,
  onSelectChange,
  onSearch,
  render,
  disabled = false,
  showSearch = false,
  filterOption: filterOptionProp,
  titles,
  operations,
  showSelectAll = true,
  oneWay = false,
  status,
  footer,
  pagination,
  listStyle,
  className,
  style,
  classNames,
  styles,
}: TransferProps) {
  // ---- Target keys (controlled / uncontrolled) ----
  const isTargetControlled = controlledTargetKeys !== undefined
  const [internalTargetKeys, setInternalTargetKeys] = useState<string[]>(defaultTargetKeys ?? [])
  const mergedTargetKeys = isTargetControlled ? controlledTargetKeys : internalTargetKeys

  // ---- Selected keys (controlled / uncontrolled) ----
  const isSelectedControlled = controlledSelectedKeys !== undefined
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultSelectedKeys ?? [])
  const mergedSelectedKeys = isSelectedControlled ? controlledSelectedKeys : internalSelectedKeys

  // ---- Search state ----
  const [sourceSearchValue, setSourceSearchValue] = useState('')
  const [targetSearchValue, setTargetSearchValue] = useState('')

  // ---- Derived data ----
  const targetKeySet = useMemo(() => new Set(mergedTargetKeys), [mergedTargetKeys])

  const sourceItems = useMemo(
    () => dataSource.filter(item => !targetKeySet.has(item.key)),
    [dataSource, targetKeySet],
  )
  const targetItems = useMemo(
    () => dataSource.filter(item => targetKeySet.has(item.key)),
    [dataSource, targetKeySet],
  )

  const sourceSelectedKeys = useMemo(
    () => mergedSelectedKeys.filter(key => !targetKeySet.has(key)),
    [mergedSelectedKeys, targetKeySet],
  )
  const targetSelectedKeys = useMemo(
    () => mergedSelectedKeys.filter(key => targetKeySet.has(key)),
    [mergedSelectedKeys, targetKeySet],
  )

  // ---- Filter function ----
  const defaultFilterOption = useCallback(
    (inputValue: string, item: TransferItem) =>
      item.title.toLowerCase().includes(inputValue.toLowerCase()),
    [],
  )
  const filterOption = filterOptionProp ?? defaultFilterOption

  // ---- Status border ----
  const statusBorderColor = status === 'error'
    ? tokens.colorError
    : status === 'warning'
      ? tokens.colorWarning
      : undefined

  // ---- Handlers ----
  const updateSelectedKeys = useCallback((
    newSourceSelected: string[],
    newTargetSelected: string[],
  ) => {
    const combined = [...newSourceSelected, ...newTargetSelected]
    if (!isSelectedControlled) setInternalSelectedKeys(combined)
    onSelectChange?.(newSourceSelected, newTargetSelected)
  }, [isSelectedControlled, onSelectChange])

  const handleSelect = useCallback((direction: TransferDirection, key: string) => {
    const current = direction === 'left' ? sourceSelectedKeys : targetSelectedKeys
    const other = direction === 'left' ? targetSelectedKeys : sourceSelectedKeys
    const idx = current.indexOf(key)
    const updated = idx >= 0
      ? current.filter(k => k !== key)
      : [...current, key]

    if (direction === 'left') {
      updateSelectedKeys(updated, other)
    } else {
      updateSelectedKeys(other, updated)
    }
  }, [sourceSelectedKeys, targetSelectedKeys, updateSelectedKeys])

  const handleSelectAll = useCallback((direction: TransferDirection, keys: string[], checked: boolean) => {
    const other = direction === 'left' ? targetSelectedKeys : sourceSelectedKeys
    const updated = checked ? keys : []

    if (direction === 'left') {
      updateSelectedKeys(updated, other)
    } else {
      updateSelectedKeys(other, updated)
    }
  }, [sourceSelectedKeys, targetSelectedKeys, updateSelectedKeys])

  const handleTransfer = useCallback((direction: TransferDirection) => {
    const keysToMove = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys
    const movableKeys = keysToMove.filter(key => {
      const item = dataSource.find(d => d.key === key)
      return item && !item.disabled
    })
    if (movableKeys.length === 0) return

    let newTargetKeys: string[]
    if (direction === 'right') {
      newTargetKeys = [...mergedTargetKeys, ...movableKeys]
    } else {
      const moveSet = new Set(movableKeys)
      newTargetKeys = mergedTargetKeys.filter(k => !moveSet.has(k))
    }

    if (!isTargetControlled) setInternalTargetKeys(newTargetKeys)
    onChange?.(newTargetKeys, direction, movableKeys)

    // Clear moved items from selection
    const remaining = mergedSelectedKeys.filter(k => !movableKeys.includes(k))
    if (!isSelectedControlled) setInternalSelectedKeys(remaining)
    const newTargetSet = new Set(newTargetKeys)
    onSelectChange?.(
      remaining.filter(k => !newTargetSet.has(k)),
      remaining.filter(k => newTargetSet.has(k)),
    )
  }, [
    sourceSelectedKeys, targetSelectedKeys, mergedTargetKeys,
    mergedSelectedKeys, dataSource, isTargetControlled,
    isSelectedControlled, onChange, onSelectChange,
  ])

  const handleRemove = useCallback((key: string) => {
    const newTargetKeys = mergedTargetKeys.filter(k => k !== key)
    if (!isTargetControlled) setInternalTargetKeys(newTargetKeys)
    onChange?.(newTargetKeys, 'left', [key])
  }, [mergedTargetKeys, isTargetControlled, onChange])

  const handleSearch = useCallback((direction: TransferDirection, value: string) => {
    if (direction === 'left') setSourceSearchValue(value)
    else setTargetSearchValue(value)
    onSearch?.(direction, value)
  }, [onSearch])

  // ---- List styles ----
  const sourceListStyle = typeof listStyle === 'function' ? listStyle('left') : listStyle
  const targetListStyle = typeof listStyle === 'function' ? listStyle('right') : listStyle

  // ---- Resolve footer & pagination ----
  const resolvedSourceFooter = typeof footer === 'function' ? footer({ direction: 'left' }) : footer
  const resolvedTargetFooter = typeof footer === 'function' ? footer({ direction: 'right' }) : footer
  const paginationConfig = pagination
    ? { pageSize: (typeof pagination === 'object' ? pagination.pageSize : undefined) ?? 10 }
    : undefined

  // ---- Operation button styles ----
  const hasSourceSelected = sourceSelectedKeys.length > 0
  const hasTargetSelected = targetSelectedKeys.length > 0
  const hasOperationText = !!(operations?.[0] || operations?.[1])

  const opBtnStyle = (enabled: boolean): CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    ...(hasOperationText
      ? { minWidth: '1.75rem', height: '1.75rem', padding: '0 0.5rem' }
      : { width: '1.75rem', height: '1.75rem', padding: 0 }),
    borderRadius: '0.25rem',
    border: 'none',
    cursor: enabled && !disabled ? 'pointer' : 'not-allowed',
    backgroundColor: enabled && !disabled ? tokens.colorPrimary : tokens.colorBgMuted,
    color: enabled && !disabled ? '#fff' : tokens.colorTextSubtle,
    opacity: enabled && !disabled ? 1 : 0.6,
    transition: 'all 0.15s ease',
  })

  // ---- Root style ----
  const rootStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1rem',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  }

  const operationColStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: hasOperationText ? 'stretch' : 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  }

  return (
    <div
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootStyle, styles?.root, style)}
    >
      {/* Source list */}
      <TransferList
        direction="left"
        items={sourceItems}
        selectedKeys={sourceSelectedKeys}
        onSelect={(key) => handleSelect('left', key)}
        onSelectAll={(keys, checked) => handleSelectAll('left', keys, checked)}
        title={titles?.[0] ?? 'Source'}
        showSearch={showSearch}
        searchValue={sourceSearchValue}
        onSearchChange={(v) => handleSearch('left', v)}
        filterOption={filterOption}
        render={render}
        disabled={disabled}
        showSelectAll={showSelectAll}
        oneWay={false}
        footer={resolvedSourceFooter}
        pagination={paginationConfig}
        listStyle={sourceListStyle}
        classNames={classNames}
        styles={styles}
        statusBorderColor={statusBorderColor}
      />

      {/* Operation buttons */}
      <div
        className={classNames?.operation}
        style={mergeSemanticStyle(operationColStyle, styles?.operation)}
      >
        <button
          type="button"
          disabled={disabled || !hasSourceSelected}
          style={opBtnStyle(hasSourceSelected)}
          onClick={() => handleTransfer('right')}
          onMouseEnter={(e) => {
            if (hasSourceSelected && !disabled) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.filter = ''
          }}
        >
          {operations?.[0] ? (
            <span style={{ fontSize: '0.6875rem', fontWeight: 600 }}>{operations[0]}</span>
          ) : (
            <ArrowRightIcon />
          )}
        </button>
        {!oneWay && (
          <button
            type="button"
            disabled={disabled || !hasTargetSelected}
            style={opBtnStyle(hasTargetSelected)}
            onClick={() => handleTransfer('left')}
            onMouseEnter={(e) => {
              if (hasTargetSelected && !disabled) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.15)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = ''
            }}
          >
            {operations?.[1] ? (
              <span style={{ fontSize: '0.6875rem', fontWeight: 600 }}>{operations[1]}</span>
            ) : (
              <ArrowLeftIcon />
            )}
          </button>
        )}
      </div>

      {/* Target list */}
      <TransferList
        direction="right"
        items={targetItems}
        selectedKeys={targetSelectedKeys}
        onSelect={(key) => handleSelect('right', key)}
        onSelectAll={(keys, checked) => handleSelectAll('right', keys, checked)}
        title={titles?.[1] ?? 'Target'}
        showSearch={showSearch}
        searchValue={targetSearchValue}
        onSearchChange={(v) => handleSearch('right', v)}
        filterOption={filterOption}
        render={render}
        disabled={disabled}
        showSelectAll={showSelectAll}
        oneWay={oneWay}
        onRemove={handleRemove}
        footer={resolvedTargetFooter}
        pagination={paginationConfig}
        listStyle={targetListStyle}
        classNames={classNames}
        styles={styles}
        statusBorderColor={statusBorderColor}
      />
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export { TransferComponent as Transfer }
