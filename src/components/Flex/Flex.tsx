import type { ElementType, ReactNode, CSSProperties } from 'react'
import { classNames as cx } from '../../utils/classNames'
import './Flex.css'

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
  /** Direccion vertical (column) en lugar de horizontal (row) */
  vertical?: boolean
  /** Comportamiento de wrap */
  wrap?: FlexWrap | boolean
  /** Alineacion horizontal (justify-content) */
  justify?: FlexJustify
  /** Alineacion vertical (align-items) */
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

// Maps for justify/align values to BEM modifier suffixes
const JUSTIFY_MAP: Record<string, string> = {
  'flex-start': 'start',
  'center': 'center',
  'flex-end': 'end',
  'space-between': 'between',
  'space-around': 'around',
  'space-evenly': 'evenly',
  'start': 'start',
  'end': 'end',
  'normal': 'normal',
}

const ALIGN_MAP: Record<string, string> = {
  'flex-start': 'start',
  'center': 'center',
  'flex-end': 'end',
  'stretch': 'stretch',
  'baseline': 'baseline',
  'start': 'start',
  'end': 'end',
  'normal': 'normal',
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
  // Procesar wrap
  const getWrapValue = (): FlexWrap => {
    if (typeof wrap === 'boolean') {
      return wrap ? 'wrap' : 'nowrap'
    }
    return wrap
  }

  const wrapValue = getWrapValue()

  // Determine gap: preset string goes to CSS class, number/array to inline
  const isPresetGap = typeof gap === 'string'
  const getGapStyle = (): CSSProperties['gap'] => {
    if (gap === undefined || isPresetGap) return undefined
    if (typeof gap === 'number') return gap
    return `${gap[1]}px ${gap[0]}px`
  }

  const rootClass = cx(
    'ino-flex',
    vertical ? 'ino-flex--column' : 'ino-flex--row',
    `ino-flex--${wrapValue}`,
    `ino-flex--justify-${JUSTIFY_MAP[justify] ?? justify}`,
    `ino-flex--align-${ALIGN_MAP[align] ?? align}`,
    isPresetGap ? `ino-flex--gap-${gap}` : undefined,
    className,
  )

  const dynamicStyle: CSSProperties = {
    gap: getGapStyle(),
    flex,
    ...style,
  }

  return (
    <Component className={rootClass} style={dynamicStyle}>
      {children}
    </Component>
  )
}
