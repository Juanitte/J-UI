import {
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useState,
  useRef,
  useEffect,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'
import { Tooltip } from '../Tooltip'

// ============================================================================
// Types
// ============================================================================

export type PaginationSize = 'default' | 'small'
export type PaginationItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'

export type PaginationItemRender = (
  page: number,
  type: PaginationItemType,
  originalElement: ReactNode,
) => ReactNode

export type PaginationSemanticSlot = 'root' | 'item' | 'options'
export type PaginationClassNames = SemanticClassNames<PaginationSemanticSlot>
export type PaginationStyles = SemanticStyles<PaginationSemanticSlot>

export interface PaginationProps {
  total?: number
  current?: number
  defaultCurrent?: number
  pageSize?: number
  defaultPageSize?: number
  pageSizeOptions?: number[]
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => ReactNode
  simple?: boolean
  size?: PaginationSize
  disabled?: boolean
  hideOnSinglePage?: boolean
  showLessItems?: boolean
  showTitle?: boolean
  itemRender?: PaginationItemRender
  onChange?: (page: number, pageSize: number) => void
  onShowSizeChange?: (current: number, size: number) => void
  className?: string
  style?: CSSProperties
  classNames?: PaginationClassNames
  styles?: PaginationStyles
}

// ============================================================================
// Helpers
// ============================================================================

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

/** Build the list of page numbers + ellipsis markers to display */
function getPageRange(
  current: number,
  totalPages: number,
  showLessItems: boolean,
): (number | 'jump-prev' | 'jump-next')[] {
  if (totalPages <= 0) return []

  const buffer = showLessItems ? 2 : 3
  // maxVisible is the inner window (excluding first & last which are always shown)
  // We show: [1] ... [range] ... [totalPages]
  const pages: (number | 'jump-prev' | 'jump-next')[] = []

  if (totalPages <= (buffer * 2 + 3)) {
    // Few enough pages to show them all
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  // Always include page 1
  pages.push(1)

  const left = Math.max(2, current - buffer)
  const right = Math.min(totalPages - 1, current + buffer)

  if (left > 2) {
    pages.push('jump-prev')
  }

  for (let i = left; i <= right; i++) {
    pages.push(i)
  }

  if (right < totalPages - 1) {
    pages.push('jump-next')
  }

  // Always include last page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

// ============================================================================
// Sub-components
// ============================================================================

/** Single page/nav button */
function PaginationItem({
  page,
  type,
  isActive,
  disabled,
  size,
  showTitle,
  itemRender,
  itemStyle,
  itemClassName,
  onClick,
}: {
  page: number
  type: PaginationItemType
  isActive: boolean
  disabled: boolean
  size: PaginationSize
  showTitle: boolean
  itemRender?: PaginationItemRender
  itemStyle?: CSSProperties
  itemClassName?: string
  onClick: () => void
}) {
  const isSmall = size === 'small'
  const isEllipsis = type === 'jump-prev' || type === 'jump-next'

  const dim = isSmall ? '1.5rem' : '2rem'
  const fontSize = isSmall ? '0.75rem' : '0.875rem'
  const iconSize = isSmall ? 12 : 14

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: dim,
    height: dim,
    fontSize,
    lineHeight: 1,
    padding: '0 0.25rem',
    border: isEllipsis ? 'none' : '1px solid',
    borderColor: isEllipsis
      ? 'transparent'
      : isActive
        ? tokens.colorPrimary
        : tokens.colorBorder,
    borderRadius: '0.375rem',
    backgroundColor: isEllipsis
      ? 'transparent'
      : isActive
        ? tokens.colorPrimary
        : tokens.colorBg,
    color: isEllipsis
      ? tokens.colorTextMuted
      : isActive
        ? tokens.colorPrimaryContrast
        : tokens.colorText,
    fontWeight: isActive ? 600 : 400,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
    userSelect: 'none',
    ...itemStyle,
  }

  // Title/tooltip text
  let titleText: string | undefined
  if (showTitle) {
    if (type === 'prev') titleText = 'Previous Page'
    else if (type === 'next') titleText = 'Next Page'
    else if (type === 'jump-prev') titleText = 'Previous 5 Pages'
    else if (type === 'jump-next') titleText = 'Next 5 Pages'
    else titleText = String(page)
  }

  // Default content
  let content: ReactNode
  if (type === 'prev') {
    content = (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    )
  } else if (type === 'next') {
    content = (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 6 15 12 9 18" />
      </svg>
    )
  } else if (isEllipsis) {
    content = <span style={{ letterSpacing: '0.125rem', fontWeight: 700 }}>•••</span>
  } else {
    content = page
  }

  const isNavButton = type === 'prev' || type === 'next' || type === 'jump-prev' || type === 'jump-next'

  const originalElement = (
    <button
      type="button"
      disabled={disabled}
      aria-label={type === 'prev' ? 'Previous' : type === 'next' ? 'Next' : undefined}
      aria-current={isActive ? 'page' : undefined}
      style={baseStyle}
      className={itemClassName}
      onMouseEnter={(e) => {
        if (disabled || isActive) return
        const el = e.currentTarget as HTMLElement
        if (!isEllipsis) {
          el.style.borderColor = tokens.colorPrimary
          el.style.color = tokens.colorPrimary
        } else {
          el.style.color = tokens.colorPrimary
        }
      }}
      onMouseLeave={(e) => {
        if (disabled || isActive) return
        const el = e.currentTarget as HTMLElement
        if (!isEllipsis) {
          el.style.borderColor = tokens.colorBorder
          el.style.color = tokens.colorText
        } else {
          el.style.color = tokens.colorTextMuted
        }
      }}
    >
      {content}
    </button>
  )

  const rendered = itemRender ? itemRender(page, type, originalElement) : originalElement

  return (
    <li
      style={{ listStyle: 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}
      onClick={disabled ? undefined : onClick}
    >
      {titleText && isNavButton ? (
        <Tooltip content={titleText} delay={300}>
          {rendered}
        </Tooltip>
      ) : rendered}
    </li>
  )
}

// ============================================================================
// SizeChanger (custom dropdown replacing native <select>)
// ============================================================================

function SizeChanger({
  value,
  options,
  disabled,
  size,
  onChange,
}: {
  value: number
  options: number[]
  disabled: boolean
  size: PaginationSize
  onChange: (value: number) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isSmall = size === 'small'
  const dim = isSmall ? '1.5rem' : '2rem'
  const fontSize = isSmall ? '0.75rem' : '0.875rem'

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const triggerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    height: dim,
    border: '1px solid',
    borderColor: open ? tokens.colorPrimary : tokens.colorBorder,
    borderRadius: '0.375rem',
    backgroundColor: tokens.colorBg,
    color: tokens.colorText,
    fontSize,
    padding: isSmall ? '0 0.5rem' : '0 0.75rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'border-color 0.2s',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '0.25rem',
    minWidth: '100%',
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    boxShadow: tokens.shadowMd,
    padding: '0.25rem 0',
    zIndex: 1050,
  }

  const handleSelect = (opt: number) => {
    onChange(opt)
    setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        style={triggerStyle}
        onClick={() => { if (!disabled) setOpen(!open) }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!disabled) setOpen(!open) } }}
        onMouseEnter={(e) => {
          if (disabled || open) return
          ;(e.currentTarget as HTMLElement).style.borderColor = tokens.colorPrimary
        }}
        onMouseLeave={(e) => {
          if (disabled || open) return
          ;(e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorder
        }}
      >
        <span>{value} / page</span>
        <svg
          width={10}
          height={10}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.6,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <div style={dropdownStyle}>
          {options.map((opt) => (
            <div
              key={opt}
              style={{
                padding: '0.375rem 0.75rem',
                fontSize,
                cursor: 'pointer',
                color: opt === value ? tokens.colorPrimary : tokens.colorText,
                fontWeight: opt === value ? 600 : 400,
                transition: 'background-color 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onClick={() => handleSelect(opt)}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }}
            >
              {opt} / page
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main component
// ============================================================================

export function Pagination({
  total = 0,
  current: controlledCurrent,
  defaultCurrent = 1,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  showSizeChanger: showSizeChangerProp,
  showQuickJumper = false,
  showTotal,
  simple = false,
  size = 'default',
  disabled = false,
  hideOnSinglePage = false,
  showLessItems = false,
  showTitle = true,
  itemRender,
  onChange,
  onShowSizeChange,
  className,
  style,
  classNames,
  styles,
}: PaginationProps) {
  // ── Controlled / uncontrolled state ──────────────────────────────────

  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent)
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize)

  const currentPage = controlledCurrent ?? internalCurrent
  const pageSizeValue = controlledPageSize ?? internalPageSize

  const totalPages = Math.max(1, Math.ceil(total / pageSizeValue))
  const safeCurrent = clamp(currentPage, 1, totalPages)

  const showSizeChanger = showSizeChangerProp ?? total > 50

  // ── Handlers ─────────────────────────────────────────────────────────

  const goToPage = (page: number) => {
    const clamped = clamp(page, 1, totalPages)
    if (clamped === safeCurrent) return
    if (controlledCurrent === undefined) {
      setInternalCurrent(clamped)
    }
    onChange?.(clamped, pageSizeValue)
  }

  const handlePageSizeChange = (newSize: number) => {
    if (controlledPageSize === undefined) {
      setInternalPageSize(newSize)
    }
    const newTotalPages = Math.max(1, Math.ceil(total / newSize))
    const newCurrent = Math.min(safeCurrent, newTotalPages)
    if (controlledCurrent === undefined) {
      setInternalCurrent(newCurrent)
    }
    onShowSizeChange?.(newCurrent, newSize)
    onChange?.(newCurrent, newSize)
  }

  // ── Quick jumper state ───────────────────────────────────────────────

  const [jumperValue, setJumperValue] = useState('')

  const handleJumperKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = parseInt(jumperValue, 10)
      if (!isNaN(val)) {
        goToPage(val)
      }
      setJumperValue('')
    }
  }

  // ── Simple mode input ────────────────────────────────────────────────

  const [simpleInputValue, setSimpleInputValue] = useState(String(safeCurrent))

  // Sync simple input when current changes externally
  if (simple && simpleInputValue !== String(safeCurrent) && document.activeElement?.tagName !== 'INPUT') {
    setSimpleInputValue(String(safeCurrent))
  }

  const handleSimpleInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = parseInt(simpleInputValue, 10)
      if (!isNaN(val)) {
        goToPage(val)
      }
    }
  }

  const handleSimpleInputBlur = () => {
    const val = parseInt(simpleInputValue, 10)
    if (!isNaN(val)) {
      goToPage(val)
    }
    setSimpleInputValue(String(safeCurrent))
  }

  // ── Hide on single page ──────────────────────────────────────────────

  if (hideOnSinglePage && totalPages <= 1) {
    return null
  }

  // ── Styles ───────────────────────────────────────────────────────────

  const isSmall = size === 'small'
  const dim = isSmall ? '1.5rem' : '2rem'
  const fontSize = isSmall ? '0.75rem' : '0.875rem'
  const gap = isSmall ? '0.25rem' : '0.5rem'

  const rootBaseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap,
    color: tokens.colorText,
    fontSize,
  }

  const rootStyle = mergeSemanticStyle(rootBaseStyle, styles?.root, style)

  const inputBaseStyle: CSSProperties = {
    width: '3.125rem',
    height: dim,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.375rem',
    textAlign: 'center',
    backgroundColor: tokens.colorBg,
    color: tokens.colorText,
    fontSize,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = tokens.colorPrimary
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = tokens.colorBorder
  }

  // ── Simple mode ──────────────────────────────────────────────────────

  if (simple) {
    return (
      <nav
        aria-label="pagination"
        style={rootStyle}
        className={mergeSemanticClassName(className, classNames?.root)}
      >
        <ul style={{ display: 'flex', alignItems: 'center', gap, listStyle: 'none', margin: 0, padding: 0 }}>
          <PaginationItem
            page={safeCurrent - 1}
            type="prev"
            isActive={false}
            disabled={disabled || safeCurrent <= 1}
            size={size}
            showTitle={showTitle}
            itemRender={itemRender}
            itemStyle={styles?.item}
            itemClassName={classNames?.item}
            onClick={() => goToPage(safeCurrent - 1)}
          />
          <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', listStyle: 'none' }}>
            <input
              type="text"
              value={simpleInputValue}
              disabled={disabled}
              style={{
                ...inputBaseStyle,
                ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
              }}
              onChange={(e) => setSimpleInputValue(e.target.value)}
              onKeyDown={handleSimpleInputKeyDown}
              onBlur={handleSimpleInputBlur}
              onFocus={handleInputFocus}
            />
            <span style={{ color: tokens.colorTextMuted }}>/</span>
            <span style={{ color: tokens.colorTextMuted }}>{totalPages}</span>
          </li>
          <PaginationItem
            page={safeCurrent + 1}
            type="next"
            isActive={false}
            disabled={disabled || safeCurrent >= totalPages}
            size={size}
            showTitle={showTitle}
            itemRender={itemRender}
            itemStyle={styles?.item}
            itemClassName={classNames?.item}
            onClick={() => goToPage(safeCurrent + 1)}
          />
        </ul>
      </nav>
    )
  }

  // ── Normal mode ──────────────────────────────────────────────────────

  const pageRange = getPageRange(safeCurrent, totalPages, showLessItems)
  const jumpSize = showLessItems ? 5 : 5

  // Range for showTotal
  const rangeStart = total === 0 ? 0 : (safeCurrent - 1) * pageSizeValue + 1
  const rangeEnd = Math.min(safeCurrent * pageSizeValue, total)

  return (
    <nav
      aria-label="pagination"
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      {/* showTotal */}
      {showTotal && (
        <span style={{ color: tokens.colorTextMuted, fontSize, marginRight: '0.25rem' }}>
          {showTotal(total, [rangeStart, rangeEnd])}
        </span>
      )}

      <ul style={{ display: 'flex', alignItems: 'center', gap, listStyle: 'none', margin: 0, padding: 0 }}>
        {/* Prev */}
        <PaginationItem
          page={safeCurrent - 1}
          type="prev"
          isActive={false}
          disabled={disabled || safeCurrent <= 1}
          size={size}
          showTitle={showTitle}
          itemRender={itemRender}
          itemStyle={styles?.item}
          itemClassName={classNames?.item}
          onClick={() => goToPage(safeCurrent - 1)}
        />

        {/* Page numbers + ellipsis */}
        {pageRange.map((item, idx) => {
          if (item === 'jump-prev' || item === 'jump-next') {
            return (
              <PaginationItem
                key={`${item}-${idx}`}
                page={item === 'jump-prev' ? Math.max(1, safeCurrent - jumpSize) : Math.min(totalPages, safeCurrent + jumpSize)}
                type={item}
                isActive={false}
                disabled={disabled}
                size={size}
                showTitle={showTitle}
                itemRender={itemRender}
                itemStyle={styles?.item}
                itemClassName={classNames?.item}
                onClick={() => {
                  if (item === 'jump-prev') {
                    goToPage(Math.max(1, safeCurrent - jumpSize))
                  } else {
                    goToPage(Math.min(totalPages, safeCurrent + jumpSize))
                  }
                }}
              />
            )
          }

          return (
            <PaginationItem
              key={item}
              page={item}
              type="page"
              isActive={item === safeCurrent}
              disabled={disabled}
              size={size}
              showTitle={showTitle}
              itemRender={itemRender}
              itemStyle={styles?.item}
              itemClassName={classNames?.item}
              onClick={() => goToPage(item)}
            />
          )
        })}

        {/* Next */}
        <PaginationItem
          page={safeCurrent + 1}
          type="next"
          isActive={false}
          disabled={disabled || safeCurrent >= totalPages}
          size={size}
          showTitle={showTitle}
          itemRender={itemRender}
          itemStyle={styles?.item}
          itemClassName={classNames?.item}
          onClick={() => goToPage(safeCurrent + 1)}
        />
      </ul>

      {/* Options: sizeChanger + quickJumper */}
      {(showSizeChanger || showQuickJumper) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap,
            ...styles?.options,
          }}
          className={classNames?.options}
        >
          {showSizeChanger && (
            <SizeChanger
              value={pageSizeValue}
              options={pageSizeOptions}
              disabled={disabled}
              size={size}
              onChange={handlePageSizeChange}
            />
          )}

          {showQuickJumper && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: tokens.colorText, fontSize }}>
              Go to
              <input
                type="text"
                value={jumperValue}
                disabled={disabled}
                style={{
                  ...inputBaseStyle,
                  ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                }}
                onChange={(e) => setJumperValue(e.target.value)}
                onKeyDown={handleJumperKeyDown}
                onFocus={handleInputFocus}
                onBlur={(e) => {
                  handleInputBlur(e)
                }}
              />
            </span>
          )}
        </div>
      )}
    </nav>
  )
}
