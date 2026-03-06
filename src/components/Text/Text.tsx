import { type ReactNode, type CSSProperties, useState } from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import { Tooltip } from '../Tooltip'
import './Text.css'

export type TextType = 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TextWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
export type TextLineHeight = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'

export interface EllipsisConfig {
  /** Numero de filas antes de truncar (default: 1) */
  rows?: number
  /** Mostrar boton para expandir/colapsar */
  expandable?: boolean
  /** Callback cuando cambia el estado expandido */
  onExpand?: (expanded: boolean) => void
}

export type TextSemanticSlot = 'root' | 'content' | 'copyButton' | 'expandButton'
export type TextClassNames = SemanticClassNames<TextSemanticSlot>
export type TextStyles = SemanticStyles<TextSemanticSlot>

export interface TextProps {
  /** Contenido del texto */
  children: ReactNode
  /** Tipo/color del texto */
  type?: TextType
  /** Tamano del texto */
  size?: TextSize
  /** Texto deshabilitado (gris y sin interaccion) */
  disabled?: boolean
  /** Resaltar texto con fondo amarillo */
  mark?: boolean
  /** Estilo de codigo inline */
  code?: boolean
  /** Estilo de tecla de teclado */
  keyboard?: boolean
  /** Texto subrayado */
  underline?: boolean
  /** Texto tachado */
  delete?: boolean
  /** Grosor del texto */
  weight?: TextWeight
  /** Interlineado del texto */
  lineHeight?: TextLineHeight
  /** Texto en cursiva */
  italic?: boolean
  /** Mostrar boton para copiar el texto */
  copyable?: boolean | { text?: string; onCopy?: () => void }
  /** Truncar texto con ellipsis (...) */
  ellipsis?: boolean | EllipsisConfig
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: TextClassNames
  /** Estilos para partes internas del componente */
  styles?: TextStyles
}

export function Text({
  children,
  type = 'default',
  size = 'md',
  disabled = false,
  mark = false,
  code = false,
  keyboard = false,
  underline = false,
  delete: del = false,
  weight,
  lineHeight,
  italic = false,
  copyable = false,
  ellipsis = false,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: TextProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Configuracion de ellipsis
  const ellipsisConfig: EllipsisConfig | null = ellipsis
    ? typeof ellipsis === 'object'
      ? ellipsis
      : { rows: 1 }
    : null

  const isExpandable = ellipsisConfig?.expandable ?? false
  const rows = ellipsisConfig?.rows ?? 1

  const handleCopy = async () => {
    const textToCopy = typeof copyable === 'object' && copyable.text
      ? copyable.text
      : typeof children === 'string'
        ? children
        : ''

    if (!textToCopy) return

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      if (typeof copyable === 'object' && copyable.onCopy) {
        copyable.onCopy()
      }
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleToggleExpand = () => {
    const newExpanded = !expanded
    setExpanded(newExpanded)
    ellipsisConfig?.onExpand?.(newExpanded)
  }

  // Build BEM root class
  const rootClass = cx(
    `ino-text--${size}`,
    disabled ? 'ino-text--disabled' : `ino-text--${type}`,
    weight ? `ino-text--weight-${weight}` : undefined,
    lineHeight ? `ino-text--lh-${lineHeight}` : undefined,
    {
      'ino-text--italic': italic,
      'ino-text--underline': underline,
      'ino-text--delete': del,
    },
    className,
    classNamesProp?.root,
  )

  // Renderizar el contenido con las modificaciones
  let content: ReactNode = children

  if (mark) {
    content = (
      <mark className="ino-text__mark">
        {content}
      </mark>
    )
  }

  if (code) {
    content = (
      <code className="ino-text__code">
        {content}
      </code>
    )
  }

  if (keyboard) {
    content = (
      <kbd className="ino-text__kbd">
        {content}
      </kbd>
    )
  }

  // Boton de copiar
  const copyButton = copyable && (
    <Tooltip content={copied ? 'Copiado!' : 'Copiar'} delay={100}>
      <button
        onClick={handleCopy}
        disabled={disabled}
        className={cx(
          'ino-text__copy-btn',
          { 'ino-text__copy-btn--copied': copied },
          classNamesProp?.copyButton,
        )}
        style={styles?.copyButton}
      >
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
    </Tooltip>
  )

  // Boton de expandir/colapsar
  const expandButton = isExpandable && (
    <button
      onClick={handleToggleExpand}
      className={cx('ino-text__expand-btn', classNamesProp?.expandButton)}
      style={styles?.expandButton}
    >
      {expanded ? 'menos' : 'mas'}
    </button>
  )

  // Si tiene ellipsis expandible, necesitamos estructura especial
  if (isExpandable) {
    if (rows > 1) {
      // Multi-linea: wrapper div con texto truncado + boton afuera
      const ellipsisClass = !expanded ? 'ino-text--ellipsis-multi' : undefined
      const ellipsisStyle: CSSProperties = !expanded ? { WebkitLineClamp: rows } : {}

      return (
        <div className={rootClass} style={{ ...styles?.root, ...style }}>
          <div
            className={cx(ellipsisClass, classNamesProp?.content)}
            style={{ ...ellipsisStyle, ...styles?.content }}
          >
            {content}
          </div>
          {expandButton}
          {copyButton}
        </div>
      )
    }

    // Una linea: wrapper span con texto truncado inline + boton afuera
    const innerEllipsisClass = !expanded ? 'ino-text--ellipsis-1' : undefined

    return (
      <span
        className={cx('ino-text--expandable-single', rootClass)}
        style={{ ...styles?.root, ...style }}
      >
        <span
          className={cx('ino-text__content--expandable-single', innerEllipsisClass, classNamesProp?.content)}
          style={styles?.content}
        >
          {content}
        </span>
        {expandButton}
        {copyButton}
      </span>
    )
  }

  // Para ellipsis multi-linea sin expandable, usamos un div
  if (ellipsisConfig && rows > 1) {
    return (
      <div
        className={cx('ino-text--ellipsis-multi', rootClass)}
        style={{ WebkitLineClamp: rows, ...styles?.root, ...style }}
      >
        {classNamesProp?.content || styles?.content ? (
          <span className={classNamesProp?.content} style={styles?.content}>{content}</span>
        ) : (
          content
        )}
        {copyButton}
      </div>
    )
  }

  // Ellipsis single line (non-expandable)
  const ellipsisSingleClass = ellipsisConfig && rows === 1 ? 'ino-text--ellipsis-1' : undefined

  return (
    <span
      className={cx(ellipsisSingleClass, rootClass)}
      style={{ ...styles?.root, ...style }}
    >
      {classNamesProp?.content || styles?.content ? (
        <span className={classNamesProp?.content} style={styles?.content}>{content}</span>
      ) : (
        content
      )}
      {copyButton}
    </span>
  )
}

// Iconos internos
function CopyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
