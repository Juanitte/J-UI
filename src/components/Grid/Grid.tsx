import { createContext, useContext, type ReactNode, type CSSProperties } from 'react'
import { classNames as cx } from '../../utils/classNames'

// ============================================================================
// Types
// ============================================================================

export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch'
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>

export interface ColSpanProps {
  span?: number
  offset?: number
  push?: number
  pull?: number
  order?: number
  flex?: CSSProperties['flex']
}

export type ColBreakpointValue = number | ColSpanProps

export interface RowProps {
  /** Contenido (normalmente Col) */
  children?: ReactNode
  /** Espacio entre columnas (px). Puede ser number, responsive object, o [horizontal, vertical] */
  gutter?: number | Partial<Record<Breakpoint, number>> | [number | Partial<Record<Breakpoint, number>>, number | Partial<Record<Breakpoint, number>>]
  /** Alineación vertical */
  align?: RowAlign
  /** Alineación horizontal */
  justify?: RowJustify
  /** Permitir wrap */
  wrap?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

export interface ColProps {
  /** Contenido */
  children?: ReactNode
  /** Número de columnas (1-24) */
  span?: number
  /** Desplazar a la derecha (número de columnas) */
  offset?: number
  /** Mover a la derecha con position (número de columnas) */
  push?: number
  /** Mover a la izquierda con position (número de columnas) */
  pull?: number
  /** Orden flex */
  order?: number
  /** Propiedad flex */
  flex?: CSSProperties['flex']
  /** Responsive: <576px */
  xs?: ColBreakpointValue
  /** Responsive: ≥576px */
  sm?: ColBreakpointValue
  /** Responsive: ≥768px */
  md?: ColBreakpointValue
  /** Responsive: ≥992px */
  lg?: ColBreakpointValue
  /** Responsive: ≥1200px */
  xl?: ColBreakpointValue
  /** Responsive: ≥1600px */
  xxl?: ColBreakpointValue
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

// ============================================================================
// Constants
// ============================================================================

const GRID_COLUMNS = 24

const breakpointValues: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

const breakpointOrder: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

// ============================================================================
// Context
// ============================================================================

interface RowContextValue {
  gutter: [number, number]
}

const RowContext = createContext<RowContextValue>({ gutter: [0, 0] })

// ============================================================================
// Helpers
// ============================================================================

function getResponsiveValue<T>(value: T | Partial<Record<Breakpoint, T>>, windowWidth: number): T | undefined {
  if (typeof value !== 'object' || value === null) {
    return value as T
  }

  const responsiveValue = value as Partial<Record<Breakpoint, T>>

  // Buscar el breakpoint más grande que sea menor o igual al ancho actual
  for (const bp of breakpointOrder) {
    if (windowWidth >= breakpointValues[bp] && responsiveValue[bp] !== undefined) {
      return responsiveValue[bp]
    }
  }

  return undefined
}

function useWindowWidth(): number {
  // En SSR o sin window, retornar un valor por defecto
  if (typeof window === 'undefined') {
    return 1200 // Valor por defecto (xl)
  }
  return window.innerWidth
}

// ============================================================================
// Row Component
// ============================================================================

export function Row({
  children,
  gutter = 0,
  align = 'top',
  justify = 'start',
  wrap = true,
  className,
  style,
}: RowProps) {
  const windowWidth = useWindowWidth()

  // Procesar gutter
  const getGutter = (): [number, number] => {
    if (typeof gutter === 'number') {
      return [gutter, 0]
    }

    if (Array.isArray(gutter)) {
      const horizontal = typeof gutter[0] === 'number'
        ? gutter[0]
        : getResponsiveValue(gutter[0], windowWidth) ?? 0
      const vertical = typeof gutter[1] === 'number'
        ? gutter[1]
        : getResponsiveValue(gutter[1], windowWidth) ?? 0
      return [horizontal, vertical]
    }

    // Objeto responsive
    return [getResponsiveValue(gutter, windowWidth) ?? 0, 0]
  }

  const [horizontalGutter, verticalGutter] = getGutter()

  const rootClass = cx(
    'ino-row',
    wrap ? 'ino-row--wrap' : 'ino-row--nowrap',
    `ino-row--align-${align}`,
    `ino-row--justify-${justify}`,
    className,
  )

  // Dynamic: gutter-derived margins and row gap
  const rowDynamicStyle: CSSProperties = {
    marginLeft: horizontalGutter ? -(horizontalGutter / 2) : undefined,
    marginRight: horizontalGutter ? -(horizontalGutter / 2) : undefined,
    rowGap: verticalGutter || undefined,
    ...style,
  }

  return (
    <RowContext.Provider value={{ gutter: [horizontalGutter, verticalGutter] }}>
      <div className={rootClass} style={rowDynamicStyle}>
        {children}
      </div>
    </RowContext.Provider>
  )
}

// ============================================================================
// Col Component
// ============================================================================

export function Col({
  children,
  span,
  offset,
  push,
  pull,
  order,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className,
  style,
}: ColProps) {
  const { gutter } = useContext(RowContext)
  const windowWidth = useWindowWidth()

  // Obtener props responsive
  const getColProps = (): ColSpanProps => {
    const breakpoints: { bp: Breakpoint; value: ColBreakpointValue | undefined }[] = [
      { bp: 'xxl', value: xxl },
      { bp: 'xl', value: xl },
      { bp: 'lg', value: lg },
      { bp: 'md', value: md },
      { bp: 'sm', value: sm },
      { bp: 'xs', value: xs },
    ]

    // Buscar el breakpoint activo
    for (const { bp, value } of breakpoints) {
      if (value !== undefined && windowWidth >= breakpointValues[bp]) {
        if (typeof value === 'number') {
          return { span: value }
        }
        return value
      }
    }

    // Valores por defecto
    return { span, offset, push, pull, order, flex }
  }

  const colProps = getColProps()
  const activeSpan = colProps.span ?? span
  const activeOffset = colProps.offset ?? offset ?? 0
  const activePush = colProps.push ?? push ?? 0
  const activePull = colProps.pull ?? pull ?? 0
  const activeOrder = colProps.order ?? order
  const activeFlex = colProps.flex ?? flex

  // Calcular width como porcentaje del grid
  const getWidth = (): string | undefined => {
    if (activeFlex) return undefined
    if (activeSpan === undefined) return undefined
    if (activeSpan === 0) return 'none' // Ocultar
    return `${(activeSpan / GRID_COLUMNS) * 100}%`
  }

  const getOffset = (): string | undefined => {
    if (activeOffset === 0) return undefined
    return `${(activeOffset / GRID_COLUMNS) * 100}%`
  }

  const getPosition = (): CSSProperties => {
    if (activePush === 0 && activePull === 0) return {}

    return {
      position: 'relative',
      left: activePush ? `${(activePush / GRID_COLUMNS) * 100}%` : undefined,
      right: activePull ? `${(activePull / GRID_COLUMNS) * 100}%` : undefined,
    }
  }

  const width = getWidth()
  const isHidden = width === 'none'

  const colClass = cx(
    'ino-col',
    { 'ino-col--hidden': isHidden },
    className,
  )

  // Dynamic: gutter padding, width, offset, order, position
  const colDynamicStyle: CSSProperties = {
    paddingLeft: gutter[0] ? gutter[0] / 2 : undefined,
    paddingRight: gutter[0] ? gutter[0] / 2 : undefined,
    flex: activeFlex ?? (width && !isHidden ? `0 0 ${width}` : undefined),
    maxWidth: isHidden ? undefined : width,
    marginLeft: getOffset(),
    order: activeOrder,
    ...getPosition(),
    ...style,
  }

  return (
    <div className={colClass} style={colDynamicStyle}>
      {children}
    </div>
  )
}

// ============================================================================
// Grid namespace
// ============================================================================

export const Grid = {
  Row,
  Col,
}
