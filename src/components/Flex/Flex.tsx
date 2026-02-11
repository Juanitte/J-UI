import type { ElementType, ReactNode, CSSProperties } from 'react'

export type FlexJustify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'end'
  | 'normal'

export type FlexAlign =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'stretch'
  | 'baseline'
  | 'start'
  | 'end'
  | 'normal'

export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export type FlexGap = 'small' | 'middle' | 'large' | number | [number, number]

export interface FlexProps {
  /** Contenido del flex container */
  children?: ReactNode
  /** Dirección vertical (column) en lugar de horizontal (row) */
  vertical?: boolean
  /** Comportamiento de wrap */
  wrap?: FlexWrap | boolean
  /** Alineación horizontal (justify-content) */
  justify?: FlexJustify
  /** Alineación vertical (align-items) */
  align?: FlexAlign
  /** Espacio entre elementos ('small' | 'middle' | 'large' | number | [horizontal, vertical]) */
  gap?: FlexGap
  /** Propiedad flex del contenedor */
  flex?: CSSProperties['flex']
  /** Elemento HTML a renderizar */
  component?: ElementType
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

const gapMap: Record<'small' | 'middle' | 'large', string> = {
  small: '0.5rem',
  middle: '1rem',
  large: '1.5rem',
}

export function Flex({
  children,
  vertical = false,
  wrap = 'nowrap',
  justify = 'normal',
  align = 'normal',
  gap,
  flex,
  component: Component = 'div',
  className,
  style,
}: FlexProps) {
  // Procesar gap
  const getGapValue = (): CSSProperties['gap'] => {
    if (gap === undefined) return undefined
    if (typeof gap === 'number') return gap
    if (typeof gap === 'string') return gapMap[gap]
    // Array [horizontal, vertical] -> CSS gap usa "row column"
    return `${gap[1]}px ${gap[0]}px`
  }

  // Procesar wrap (puede ser boolean o string)
  const getWrapValue = (): FlexWrap => {
    if (typeof wrap === 'boolean') {
      return wrap ? 'wrap' : 'nowrap'
    }
    return wrap
  }

  const flexStyles: CSSProperties = {
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    flexWrap: getWrapValue(),
    justifyContent: justify,
    alignItems: align,
    gap: getGapValue(),
    flex,
    ...style,
  }

  return (
    <Component style={flexStyles} className={className}>
      {children}
    </Component>
  )
}
