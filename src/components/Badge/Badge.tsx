import type { ReactNode, CSSProperties } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

export type BadgeRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'

export type BadgeSemanticSlot = 'root' | 'icon' | 'content'
export type BadgeClassNames = SemanticClassNames<BadgeSemanticSlot>
export type BadgeStyles = SemanticStyles<BadgeSemanticSlot>

export interface BadgeProps {
  /** Contenido del badge */
  children: ReactNode
  /** Color de fondo (CSS color o variable del tema) */
  bgColor?: string
  /** Color del texto y borde (CSS color o variable del tema) */
  color?: string
  /** Radio del borde */
  radius?: BadgeRadius
  /** Icono opcional a la izquierda */
  icon?: ReactNode
  /** Mostrar borde */
  bordered?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: BadgeClassNames
  /** Estilos para partes internas del componente */
  styles?: BadgeStyles
}

export function Badge({
  children,
  bgColor = tokens.colorPrimaryLight,
  color = tokens.colorPrimary,
  radius = 'md',
  icon,
  bordered = true,
  className,
  style,
  classNames,
  styles,
}: BadgeProps) {
  const radiusValues: Record<BadgeRadius, number | string> = {
    none: 0,
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.75rem',
    full: 9999,
  }

  const rootStyle = mergeSemanticStyle(
    {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      fontSize: '0.8125rem',
      fontWeight: 500,
      borderRadius: radiusValues[radius],
      backgroundColor: bgColor,
      color: color,
      border: bordered ? `1px solid ${color}` : 'none',
      whiteSpace: 'nowrap',
    },
    styles?.root,
    style,
  )

  return (
    <span style={rootStyle} className={mergeSemanticClassName(className, classNames?.root)}>
      {icon && (
        <span
          style={{ display: 'inline-flex', fontSize: '0.875rem', ...styles?.icon }}
          className={classNames?.icon}
        >
          {icon}
        </span>
      )}
      {classNames?.content || styles?.content ? (
        <span className={classNames?.content} style={styles?.content}>{children}</span>
      ) : (
        children
      )}
    </span>
  )
}
