import type { ReactNode, CSSProperties } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Divider.css'

export type DividerType = 'horizontal' | 'vertical'
export type DividerOrientation = 'left' | 'center' | 'right'
export type DividerColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type DividerThickness = 'thin' | 'normal' | 'medium' | 'thick' | number

const colorMap: Record<DividerColor, { line: string; text: string }> = {
  default: { line: tokens.colorBorder, text: tokens.colorText },
  primary: { line: tokens.colorPrimary, text: tokens.colorPrimary },
  secondary: { line: tokens.colorSecondary, text: tokens.colorSecondary },
  success: { line: tokens.colorSuccess, text: tokens.colorSuccess },
  warning: { line: tokens.colorWarning, text: tokens.colorWarning },
  error: { line: tokens.colorError, text: tokens.colorError },
  info: { line: tokens.colorInfo, text: tokens.colorInfo },
}

export type DividerSemanticSlot = 'root' | 'line' | 'text'
export type DividerClassNames = SemanticClassNames<DividerSemanticSlot>
export type DividerStyles = SemanticStyles<DividerSemanticSlot>

export interface DividerProps {
  /** Tipo de divider */
  type?: DividerType
  /** Linea discontinua (dashed) */
  dashed?: boolean
  /** Posicion del texto (solo para horizontal) */
  orientation?: DividerOrientation
  /** Margen entre el texto y la linea mas cercana (en px o porcentaje) */
  orientationMargin?: number | string
  /** Texto sin estilo especial (mas pequeno y sin negrita) */
  plain?: boolean
  /** Color del divider */
  color?: DividerColor
  /** Grosor de la linea ('thin' | 'normal' | 'medium' | 'thick' o numero en px) */
  thickness?: DividerThickness
  /** Texto dentro del divider */
  children?: ReactNode
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: DividerClassNames
  /** Estilos para partes internas del componente */
  styles?: DividerStyles
}

const thicknessMap: Record<Exclude<DividerThickness, number>, number> = {
  thin: 1,
  normal: 1,
  medium: 2,
  thick: 3,
}

export function Divider({
  type = 'horizontal',
  dashed = false,
  orientation = 'center',
  orientationMargin,
  plain = false,
  color = 'default',
  thickness = 'normal',
  children,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: DividerProps) {
  const borderStyle = dashed ? 'dashed' : 'solid'
  const colors = colorMap[color]
  const borderColor = colors.line
  const lineWidth = typeof thickness === 'number' ? thickness : thicknessMap[thickness]

  // Divider vertical
  if (type === 'vertical') {
    return (
      <span
        className={cx('ino-divider', 'ino-divider--vertical', className, classNamesProp?.root)}
        style={{
          borderInlineStart: `${lineWidth}px ${borderStyle} ${borderColor}`,
          ...styles?.root,
          ...style,
        }}
        role="separator"
      />
    )
  }

  // Divider horizontal sin texto
  if (!children) {
    return (
      <div
        className={cx('ino-divider', className, classNamesProp?.root)}
        style={{
          borderBlockStart: `${lineWidth}px ${borderStyle} ${borderColor}`,
          ...styles?.root,
          ...style,
        }}
        role="separator"
      />
    )
  }

  // Divider horizontal con texto
  const getLineWidths = (): { before: string; after: string } => {
    const margin = orientationMargin !== undefined
      ? typeof orientationMargin === 'number'
        ? `${orientationMargin}px`
        : orientationMargin
      : null

    switch (orientation) {
      case 'left':
        return { before: margin || '5%', after: '95%' }
      case 'right':
        return { before: '95%', after: margin || '5%' }
      case 'center':
      default:
        return { before: '50%', after: '50%' }
    }
  }

  const lineWidths = getLineWidths()

  const lineBaseStyle: CSSProperties = {
    borderBlockStart: `${lineWidth}px ${borderStyle} ${borderColor}`,
    flexGrow: 0,
    flexShrink: 0,
  }

  const beforeLineStyles: CSSProperties = {
    ...lineBaseStyle,
    width: lineWidths.before,
  }

  const afterLineStyles: CSSProperties = {
    ...lineBaseStyle,
    width: lineWidths.after,
  }

  // Si hay orientationMargin personalizado, ajustar el calculo
  if (orientationMargin !== undefined && orientation !== 'center') {
    if (orientation === 'left') {
      beforeLineStyles.width = typeof orientationMargin === 'number'
        ? `${orientationMargin}px`
        : orientationMargin
      beforeLineStyles.flexGrow = 0
      afterLineStyles.width = 'auto'
      afterLineStyles.flexGrow = 1
    } else {
      beforeLineStyles.width = 'auto'
      beforeLineStyles.flexGrow = 1
      afterLineStyles.width = typeof orientationMargin === 'number'
        ? `${orientationMargin}px`
        : orientationMargin
      afterLineStyles.flexGrow = 0
    }
  } else if (orientation === 'center') {
    beforeLineStyles.flexGrow = 1
    afterLineStyles.flexGrow = 1
    beforeLineStyles.width = 'auto'
    afterLineStyles.width = 'auto'
  } else {
    if (orientation === 'left') {
      afterLineStyles.flexGrow = 1
      afterLineStyles.width = 'auto'
    } else {
      beforeLineStyles.flexGrow = 1
      beforeLineStyles.width = 'auto'
    }
  }

  return (
    <div
      className={cx('ino-divider', 'ino-divider--with-text', className, classNamesProp?.root)}
      style={{ ...styles?.root, ...style }}
      role="separator"
    >
      <span
        className={cx('ino-divider__line', classNamesProp?.line)}
        style={{ ...beforeLineStyles, ...styles?.line }}
      />
      <span
        className={cx(
          'ino-divider__text',
          plain ? 'ino-divider__text--plain' : 'ino-divider__text--styled',
          classNamesProp?.text,
        )}
        style={{ color: colors.text, ...styles?.text }}
      >
        {children}
      </span>
      <span
        className={cx('ino-divider__line', classNamesProp?.line)}
        style={{ ...afterLineStyles, ...styles?.line }}
      />
    </div>
  )
}
