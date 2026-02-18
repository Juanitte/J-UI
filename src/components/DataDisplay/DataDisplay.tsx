import {
  type CSSProperties,
  type ReactNode,
  useState,
  useEffect,
  Children,
  isValidElement,
} from 'react'
import { tokens } from '../../theme/tokens'
import {
  type SemanticClassNames,
  type SemanticStyles,
  mergeSemanticClassName,
  mergeSemanticStyle,
} from '../../utils/semanticDom'

// ─── Responsive helpers (from Grid pattern) ─────────────────────────────────

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

const breakpointValues: Record<Breakpoint, number> = {
  xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600,
}

const breakpointOrder: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

function getResponsiveValue<T>(value: T | Partial<Record<Breakpoint, T>>, windowWidth: number): T | undefined {
  if (typeof value !== 'object' || value === null) return value as T
  const resp = value as Partial<Record<Breakpoint, T>>
  for (const bp of breakpointOrder) {
    if (windowWidth >= breakpointValues[bp] && resp[bp] !== undefined) return resp[bp]
  }
  return undefined
}

function useWindowWidth(): number {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export type DataDisplaySize = 'large' | 'middle' | 'small'
export type DataDisplayLayout = 'horizontal' | 'vertical'
export type DataDisplaySemanticSlot = 'root' | 'header' | 'title' | 'extra' | 'label' | 'content' | 'table' | 'row'
export type DataDisplayClassNames = SemanticClassNames<DataDisplaySemanticSlot>
export type DataDisplayStyles = SemanticStyles<DataDisplaySemanticSlot>

export interface DataDisplayItem {
  key: string
  label?: ReactNode
  children?: ReactNode
  span?: number | Partial<Record<Breakpoint, number>>
  labelStyle?: CSSProperties
  contentStyle?: CSSProperties
}

export interface DataDisplayItemProps {
  itemKey: string
  label?: ReactNode
  children?: ReactNode
  span?: number | Partial<Record<Breakpoint, number>>
  labelStyle?: CSSProperties
  contentStyle?: CSSProperties
}

export interface DataDisplayProps {
  items?: DataDisplayItem[]
  title?: ReactNode
  extra?: ReactNode
  bordered?: boolean
  column?: number | Partial<Record<Breakpoint, number>>
  layout?: DataDisplayLayout
  colon?: boolean
  size?: DataDisplaySize
  labelStyle?: CSSProperties
  contentStyle?: CSSProperties
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: DataDisplayClassNames
  styles?: DataDisplayStyles
}

// ─── Size config ────────────────────────────────────────────────────────────────

const SIZE_CONFIG: Record<DataDisplaySize, {
  headerPadding: string
  cellPadding: string
  fontSize: string
  headerFontSize: string
}> = {
  small:  { headerPadding: '0.5rem 0',  cellPadding: '0.375rem 0.75rem', fontSize: '0.8125rem', headerFontSize: '0.875rem' },
  middle: { headerPadding: '0.75rem 0', cellPadding: '0.75rem 1rem',     fontSize: '0.875rem',  headerFontSize: '1rem' },
  large:  { headerPadding: '1rem 0',    cellPadding: '1rem 1.5rem',      fontSize: '1rem',      headerFontSize: '1.125rem' },
}

// ─── Row distribution ───────────────────────────────────────────────────────────

interface ResolvedItem extends DataDisplayItem {
  resolvedSpan: number
}

function distributeRows(items: DataDisplayItem[], columns: number, windowWidth: number): ResolvedItem[][] {
  const rows: ResolvedItem[][] = []
  let currentRow: ResolvedItem[] = []
  let currentSpan = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    // Resolve responsive span
    const rawSpan = typeof item.span === 'object' && item.span !== null
      ? (getResponsiveValue(item.span, windowWidth) ?? 1)
      : (item.span ?? 1)
    const span = Math.min(rawSpan, columns)

    if (currentSpan + span > columns && currentRow.length > 0) {
      // Fill remaining space in previous row by stretching last item
      const remaining = columns - currentSpan
      if (remaining > 0 && currentRow.length > 0) {
        currentRow[currentRow.length - 1].resolvedSpan += remaining
      }
      rows.push(currentRow)
      currentRow = []
      currentSpan = 0
    }

    currentRow.push({ ...item, resolvedSpan: span })
    currentSpan += span
  }

  // Push last row, stretching last item to fill
  if (currentRow.length > 0) {
    const remaining = columns - currentSpan
    if (remaining > 0) {
      currentRow[currentRow.length - 1].resolvedSpan += remaining
    }
    rows.push(currentRow)
  }

  return rows
}

// ─── DataDisplay.Item compound (thin wrapper) ───────────────────────────────────

function DataDisplayItemCompound(_props: DataDisplayItemProps & { children?: ReactNode }) {
  return null
}

// ─── Main component ─────────────────────────────────────────────────────────────

function DataDisplayComponent({
  items,
  title,
  extra,
  bordered = false,
  column = 3,
  layout = 'horizontal',
  colon = true,
  size = 'middle',
  labelStyle: globalLabelStyle,
  contentStyle: globalContentStyle,
  children,
  className,
  style,
  classNames,
  styles,
}: DataDisplayProps) {
  const windowWidth = useWindowWidth()
  const sizeConf = SIZE_CONFIG[size]
  const isVertical = layout === 'vertical'

  // ── Resolve responsive columns ──
  const resolvedColumns = typeof column === 'object' && column !== null
    ? (getResponsiveValue(column, windowWidth) ?? 3)
    : (column as number)

  // ── Normalize items from props or children ──
  const normalizedItems: DataDisplayItem[] = items ?? (() => {
    const result: DataDisplayItem[] = []
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return
      const props = child.props as DataDisplayItemProps & { children?: ReactNode }
      if (props.itemKey !== undefined) {
        result.push({
          key: props.itemKey,
          label: props.label,
          children: props.children,
          span: props.span,
          labelStyle: props.labelStyle,
          contentStyle: props.contentStyle,
        })
      }
    })
    return result
  })()

  // ── Distribute into rows ──
  const rows = distributeRows(normalizedItems, resolvedColumns, windowWidth)

  // ── Styles ──
  const rootStyle = mergeSemanticStyle(
    {
      width: '100%',
      overflowX: 'auto' as const,
    },
    styles?.root,
    style,
  )

  const showHeader = title || extra
  const headerStyle = mergeSemanticStyle(
    {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      padding: sizeConf.headerPadding,
      marginBottom: '0.75rem',
    },
    styles?.header,
  )

  const titleStyle = mergeSemanticStyle(
    {
      flex: 1,
      minWidth: 0,
      fontSize: sizeConf.headerFontSize,
      fontWeight: 600,
      color: tokens.colorText,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    styles?.title,
  )

  const extraStyle = mergeSemanticStyle(
    {
      flexShrink: 0,
      fontSize: sizeConf.fontSize,
      color: tokens.colorTextMuted,
    },
    styles?.extra,
  )

  const cornerRadius = '0.5rem'

  const tableStyle = mergeSemanticStyle(
    {
      width: '100%',
      minWidth: bordered ? `${resolvedColumns * 200}px` : `${resolvedColumns * 150}px`,
      fontSize: sizeConf.fontSize,
      ...(bordered ? {
        borderCollapse: 'separate' as const,
        borderSpacing: 0,
        borderTop: `1px solid ${tokens.colorBorder}`,
        borderLeft: `1px solid ${tokens.colorBorder}`,
        borderRight: 'none',
        borderBottom: 'none',
        borderRadius: cornerRadius,
      } : {
        borderCollapse: 'collapse' as const,
      }),
    },
    styles?.table,
  )

  // ── Base cell styles ──
  const baseLabelStyle: CSSProperties = {
    padding: sizeConf.cellPadding,
    color: tokens.colorTextMuted,
    fontWeight: 500,
    textAlign: 'left' as const,
    verticalAlign: 'top',
    ...(bordered ? {
      backgroundColor: tokens.colorBgSubtle,
      borderBottom: `1px solid ${tokens.colorBorder}`,
      borderRight: `1px solid ${tokens.colorBorder}`,
    } : {}),
    ...(!bordered && !isVertical ? { whiteSpace: 'nowrap' as const, paddingRight: '0.5rem' } : {}),
  }

  const baseContentStyle: CSSProperties = {
    padding: sizeConf.cellPadding,
    color: tokens.colorText,
    verticalAlign: 'top',
    ...(bordered ? {
      borderBottom: `1px solid ${tokens.colorBorder}`,
      borderRight: `1px solid ${tokens.colorBorder}`,
    } : {}),
  }

  const baseRowStyle: CSSProperties = {}

  // In horizontal mode, total table columns = resolvedColumns * 2 (th + td pairs)
  // In vertical mode, total table columns = resolvedColumns
  const totalTableCols = isVertical ? resolvedColumns : resolvedColumns * 2

  // ── Render rows ──
  const renderHorizontalRow = (row: ResolvedItem[], rowIndex: number, totalRows: number) => {
    const isFirstRow = bordered && rowIndex === 0
    const isLastRow = bordered && rowIndex === totalRows - 1

    return (
      <tr
        key={rowIndex}
        className={classNames?.row}
        style={mergeSemanticStyle(baseRowStyle, styles?.row)}
      >
        {row.map((item, itemIndex) => {
          const isFirstItem = itemIndex === 0
          const isLastItem = itemIndex === row.length - 1
          const labelCorner: CSSProperties = {
            ...(isFirstRow && isFirstItem ? { borderTopLeftRadius: cornerRadius } : {}),
            ...(isLastRow && isFirstItem ? { borderBottomLeftRadius: cornerRadius } : {}),
          }
          const contentCorner: CSSProperties = {
            ...(isFirstRow && isLastItem ? { borderTopRightRadius: cornerRadius } : {}),
            ...(isLastRow && isLastItem ? { borderBottomRightRadius: cornerRadius } : {}),
          }
          const mergedLabelStyle = { ...baseLabelStyle, ...globalLabelStyle, ...item.labelStyle, ...labelCorner }
          const mergedContentStyle = { ...baseContentStyle, ...globalContentStyle, ...item.contentStyle, ...contentCorner }
          const contentColSpan = item.resolvedSpan > 1 ? item.resolvedSpan * 2 - 1 : 1

          return [
            <th
              key={`${item.key}-label`}
              className={mergeSemanticClassName(classNames?.label, undefined)}
              style={mergeSemanticStyle(mergedLabelStyle, styles?.label)}
            >
              {item.label}{colon && item.label ? ':' : ''}
            </th>,
            <td
              key={`${item.key}-content`}
              colSpan={contentColSpan > 1 ? contentColSpan : undefined}
              className={mergeSemanticClassName(classNames?.content, undefined)}
              style={mergeSemanticStyle(mergedContentStyle, styles?.content)}
            >
              {item.children}
            </td>,
          ]
        })}
      </tr>
    )
  }

  const renderVerticalRow = (row: ResolvedItem[], rowIndex: number, totalRows: number) => {
    const isFirstRow = bordered && rowIndex === 0
    const isLastRow = bordered && rowIndex === totalRows - 1

    return (
      <>
        {/* Labels row */}
        <tr
          key={`${rowIndex}-labels`}
          className={classNames?.row}
          style={mergeSemanticStyle(baseRowStyle, styles?.row)}
        >
          {row.map((item, itemIndex) => {
            const isFirstItem = itemIndex === 0
            const isLastItem = itemIndex === row.length - 1
            const corner: CSSProperties = {
              ...(isFirstRow && isFirstItem ? { borderTopLeftRadius: cornerRadius } : {}),
              ...(isFirstRow && isLastItem ? { borderTopRightRadius: cornerRadius } : {}),
            }
            const mergedLabelStyle = { ...baseLabelStyle, ...globalLabelStyle, ...item.labelStyle, ...corner }
            return (
              <th
                key={`${item.key}-label`}
                colSpan={item.resolvedSpan > 1 ? item.resolvedSpan : undefined}
                className={mergeSemanticClassName(classNames?.label, undefined)}
                style={mergeSemanticStyle(mergedLabelStyle, styles?.label)}
              >
                {item.label}{colon && item.label ? ':' : ''}
              </th>
            )
          })}
        </tr>
        {/* Values row */}
        <tr
          key={`${rowIndex}-values`}
          className={classNames?.row}
          style={mergeSemanticStyle(baseRowStyle, styles?.row)}
        >
          {row.map((item, itemIndex) => {
            const isFirstItem = itemIndex === 0
            const isLastItem = itemIndex === row.length - 1
            const corner: CSSProperties = {
              ...(isLastRow && isFirstItem ? { borderBottomLeftRadius: cornerRadius } : {}),
              ...(isLastRow && isLastItem ? { borderBottomRightRadius: cornerRadius } : {}),
            }
            const mergedContentStyle = { ...baseContentStyle, ...globalContentStyle, ...item.contentStyle, ...corner }
            return (
              <td
                key={`${item.key}-content`}
                colSpan={item.resolvedSpan > 1 ? item.resolvedSpan : undefined}
                className={mergeSemanticClassName(classNames?.content, undefined)}
                style={mergeSemanticStyle(mergedContentStyle, styles?.content)}
              >
                {item.children}
              </td>
          )
        })}
      </tr>
    </>
    )
  }

  return (
    <div
      className={mergeSemanticClassName(className, classNames?.root)}
      style={rootStyle}
    >
      {/* Header */}
      {showHeader && (
        <div className={classNames?.header} style={headerStyle}>
          {title && (
            <div className={classNames?.title} style={titleStyle}>
              {title}
            </div>
          )}
          {extra && (
            <div className={classNames?.extra} style={extraStyle}>
              {extra}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <table className={classNames?.table} style={tableStyle}>
        <colgroup>
          {isVertical
            ? Array.from({ length: resolvedColumns }, (_, i) => (
                <col key={i} style={{ width: `${100 / resolvedColumns}%` }} />
              ))
            : Array.from({ length: totalTableCols }, (_, i) => (
                <col key={i} />
              ))
          }
        </colgroup>
        <tbody>
          {rows.map((row, i) =>
            isVertical ? renderVerticalRow(row, i, rows.length) : renderHorizontalRow(row, i, rows.length)
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Compound export ────────────────────────────────────────────────────────────

export const DataDisplay = Object.assign(DataDisplayComponent, {
  Item: DataDisplayItemCompound,
})
