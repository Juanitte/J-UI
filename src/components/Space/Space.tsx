import {
  Children,
  Fragment,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  type ReactNode,
  type CSSProperties,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type SpaceSize = 'small' | 'middle' | 'large' | number

export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline'

export type SpaceSemanticSlot = 'root' | 'item' | 'separator'
export type SpaceClassNames = SemanticClassNames<SpaceSemanticSlot>
export type SpaceStyles = SemanticStyles<SpaceSemanticSlot>

export interface SpaceProps {
  /** Contenido */
  children?: ReactNode
  /** Tamaño del espacio entre elementos. Puede ser un valor o [horizontal, vertical] */
  size?: SpaceSize | [SpaceSize, SpaceSize]
  /** Orientación: horizontal o vertical */
  direction?: 'horizontal' | 'vertical'
  /** Alineación de los elementos en el eje cruzado */
  align?: SpaceAlign
  /** Permitir wrap cuando se desborden */
  wrap?: boolean
  /** Elemento separador entre items */
  split?: ReactNode
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: SpaceClassNames
  /** Estilos para partes internas del componente */
  styles?: SpaceStyles
}

export interface SpaceCompactProps {
  /** Contenido */
  children?: ReactNode
  /** Dirección del grupo compacto */
  direction?: 'horizontal' | 'vertical'
  /** Ocupa el 100% del ancho disponible */
  block?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

export interface CompactItemContextValue {
  isFirstItem: boolean
  isLastItem: boolean
  direction: 'horizontal' | 'vertical'
}

// ============================================================================
// Context
// ============================================================================

const CompactItemContext = createContext<CompactItemContextValue | null>(null)

export function useCompactItemContext(): CompactItemContextValue | null {
  return useContext(CompactItemContext)
}

// ============================================================================
// Constants
// ============================================================================

const sizeMap: Record<'small' | 'middle' | 'large', string> = {
  small: '0.5rem',
  middle: '1rem',
  large: '1.5rem',
}

const BORDER_RADIUS = '0.5rem'

// ============================================================================
// Helpers
// ============================================================================

function resolveSize(size: SpaceSize): string | number {
  if (typeof size === 'number') return size
  return sizeMap[size]
}

function formatGap(val: string | number): string {
  return typeof val === 'number' ? `${val}px` : val
}

// ============================================================================
// Space Component
// ============================================================================

function SpaceRoot({
  children,
  size = 'small',
  direction = 'horizontal',
  align,
  wrap = false,
  split,
  className,
  style,
  classNames,
  styles,
}: SpaceProps) {
  const items = Children.toArray(children)

  if (items.length === 0) return null

  const [horizontalGap, verticalGap] = Array.isArray(size)
    ? [resolveSize(size[0]), resolveSize(size[1])]
    : [resolveSize(size), resolveSize(size)]

  const resolvedAlign = align ?? (direction === 'horizontal' ? 'center' : undefined)

  const alignMap: Record<SpaceAlign, string> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
  }

  const containerStyle = mergeSemanticStyle(
    {
      display: 'inline-flex',
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      flexWrap: wrap ? 'wrap' : 'nowrap',
      alignItems: resolvedAlign ? alignMap[resolvedAlign] : undefined,
      gap: split ? undefined : (horizontalGap === verticalGap ? formatGap(horizontalGap) : `${formatGap(verticalGap)} ${formatGap(horizontalGap)}`),
    },
    styles?.root,
    style,
  )

  const rootClassName = mergeSemanticClassName(className, classNames?.root)

  if (!split) {
    return (
      <div style={containerStyle} className={rootClassName}>
        {classNames?.item || styles?.item
          ? items.map((child, index) => (
              <div key={index} className={classNames?.item} style={styles?.item}>{child}</div>
            ))
          : items
        }
      </div>
    )
  }

  const isVertical = direction === 'vertical'

  return (
    <div style={containerStyle} className={rootClassName}>
      {items.map((child, index) => (
        <Fragment key={index}>
          {classNames?.item || styles?.item ? (
            <div className={classNames?.item} style={styles?.item}>{child}</div>
          ) : (
            child
          )}
          {index < items.length - 1 && (
            <span
              style={{
                display: 'inline-flex',
                alignSelf: 'center',
                margin: isVertical
                  ? (typeof verticalGap === 'number' ? `${verticalGap / 2}px 0` : `calc(${verticalGap} / 2) 0`)
                  : (typeof horizontalGap === 'number' ? `0 ${horizontalGap / 2}px` : `0 calc(${horizontalGap} / 2)`),
                ...styles?.separator,
              }}
              className={classNames?.separator}
            >
              {split}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}

// ============================================================================
// Space.Compact Component
// ============================================================================

function Compact({
  children,
  direction = 'horizontal',
  block = false,
  className,
  style,
}: SpaceCompactProps) {
  const items = Children.toArray(children)

  if (items.length === 0) return null

  const isVertical = direction === 'vertical'

  const containerStyles: CSSProperties = {
    display: block ? 'flex' : 'inline-flex',
    flexDirection: isVertical ? 'column' : 'row',
    ...style,
  }

  return (
    <div style={containerStyles} className={className}>
      {items.map((child, index) => {
        const isFirst = index === 0
        const isLast = index === items.length - 1

        const compactStyle: CSSProperties = {}

        if (isVertical) {
          if (isFirst) {
            compactStyle.borderRadius = `${BORDER_RADIUS} ${BORDER_RADIUS} 0 0`
          } else if (isLast) {
            compactStyle.borderRadius = `0 0 ${BORDER_RADIUS} ${BORDER_RADIUS}`
          } else {
            compactStyle.borderRadius = 0
          }
          if (!isFirst) compactStyle.marginTop = -1
        } else {
          if (isFirst) {
            compactStyle.borderRadius = `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`
          } else if (isLast) {
            compactStyle.borderRadius = `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`
          } else {
            compactStyle.borderRadius = 0
          }
          if (!isFirst) compactStyle.marginLeft = -1
        }

        const contextValue: CompactItemContextValue = {
          isFirstItem: isFirst,
          isLastItem: isLast,
          direction,
        }

        if (isValidElement<{ style?: CSSProperties }>(child)) {
          return (
            <CompactItemContext.Provider key={index} value={contextValue}>
              {cloneElement(child, {
                style: { ...(child.props.style || {}), ...compactStyle },
              })}
            </CompactItemContext.Provider>
          )
        }

        return (
          <CompactItemContext.Provider key={index} value={contextValue}>
            {child}
          </CompactItemContext.Provider>
        )
      })}
    </div>
  )
}

// ============================================================================
// Compound Component
// ============================================================================

export const Space = Object.assign(SpaceRoot, { Compact })
