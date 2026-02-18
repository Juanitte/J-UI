import { type ReactNode, type CSSProperties, useState } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'
import { Tooltip } from '../Tooltip'

export type TextType = 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TextWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
export type TextLineHeight = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'

export interface EllipsisConfig {
  /** Número de filas antes de truncar (default: 1) */
  rows?: number
  /** Mostrar botón para expandir/colapsar */
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
  /** Tamaño del texto */
  size?: TextSize
  /** Texto deshabilitado (gris y sin interacción) */
  disabled?: boolean
  /** Resaltar texto con fondo amarillo */
  mark?: boolean
  /** Estilo de código inline */
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
  /** Mostrar botón para copiar el texto */
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
  classNames,
  styles,
}: TextProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const sizeMap: Record<TextSize, string> = {
    xs: '0.625rem',
    sm: '0.8125rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.25rem',
  }

  const typeColorMap: Record<TextType, string> = {
    default: tokens.colorText,
    secondary: tokens.colorTextMuted,
    success: tokens.colorSuccess,
    warning: tokens.colorWarning,
    error: tokens.colorError,
    info: tokens.colorInfo,
  }

  const weightMap: Record<TextWeight, number> = {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  }

  const lineHeightMap: Record<TextLineHeight, number> = {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  }

  // Configuración de ellipsis
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

  // Estilos de ellipsis
  const getEllipsisStyles = (): React.CSSProperties => {
    if (!ellipsisConfig || expanded) return {}

    if (rows === 1) {
      return {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        maxWidth: '100%',
        verticalAlign: 'bottom',
      }
    }

    // Multi-line ellipsis
    return {
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: rows,
      WebkitBoxOrient: 'vertical',
    }
  }

  const baseStyles = mergeSemanticStyle(
    {
      fontSize: sizeMap[size],
      color: disabled ? tokens.colorTextSubtle : typeColorMap[type],
      cursor: disabled ? 'not-allowed' : undefined,
      opacity: disabled ? 0.6 : 1,
      fontWeight: weight ? weightMap[weight] : undefined,
      lineHeight: lineHeight ? lineHeightMap[lineHeight] : undefined,
      fontStyle: italic ? 'italic' : undefined,
      textDecoration: underline ? 'underline' : del ? 'line-through' : undefined,
      ...getEllipsisStyles(),
    },
    styles?.root,
    style,
  )

  const rootClassName = mergeSemanticClassName(className, classNames?.root)

  // Renderizar el contenido con las modificaciones
  let content: ReactNode = children

  // Aplicar mark (highlight)
  if (mark) {
    content = (
      <mark
        style={{
          backgroundColor: tokens.colorWarning200,
          color: tokens.colorWarning900,
          padding: '0 0.125rem',
          borderRadius: '0.125rem',
        }}
      >
        {content}
      </mark>
    )
  }

  // Aplicar code
  if (code) {
    content = (
      <code
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.9em',
          backgroundColor: tokens.colorBgMuted,
          border: `1px solid ${tokens.colorBorder}`,
          borderRadius: '0.25rem',
          padding: '0.125rem 0.375rem',
        }}
      >
        {content}
      </code>
    )
  }

  // Aplicar keyboard
  if (keyboard) {
    content = (
      <kbd
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.9em',
          backgroundColor: tokens.colorBgMuted,
          border: `1px solid ${tokens.colorBorder}`,
          borderBottom: `2px solid ${tokens.colorBorder}`,
          borderRadius: '0.25rem',
          padding: '0.125rem 0.375rem',
          boxShadow: `inset 0 -1px 0 ${tokens.colorBorder}`,
        }}
      >
        {content}
      </kbd>
    )
  }

  // Botón de copiar
  const copyButton = copyable && (
    <Tooltip content={copied ? 'Copiado!' : 'Copiar'} delay={100}>
      <button
        onClick={handleCopy}
        disabled={disabled}
        className={classNames?.copyButton}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '0.25rem',
          padding: '0.125rem',
          border: 'none',
          background: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: copied ? tokens.colorSuccess : tokens.colorTextMuted,
          opacity: disabled ? 0.5 : 1,
          transition: 'color 0.2s',
          verticalAlign: 'middle',
          ...styles?.copyButton,
        }}
      >
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
    </Tooltip>
  )

  // Botón de expandir/colapsar
  const expandButton = isExpandable && (
    <button
      onClick={handleToggleExpand}
      className={classNames?.expandButton}
      style={{
        display: 'inline',
        marginLeft: '0.25rem',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: tokens.colorPrimary,
        fontSize: 'inherit',
        fontFamily: 'inherit',
        ...styles?.expandButton,
      }}
    >
      {expanded ? 'menos' : 'más'}
    </button>
  )

  // Separar estilos base de estilos de ellipsis para poder anidar correctamente
  const textStyles: React.CSSProperties = {
    fontSize: sizeMap[size],
    color: disabled ? tokens.colorTextSubtle : typeColorMap[type],
    cursor: disabled ? 'not-allowed' : undefined,
    opacity: disabled ? 0.6 : 1,
    fontWeight: weight ? weightMap[weight] : undefined,
    lineHeight: lineHeight ? lineHeightMap[lineHeight] : undefined,
    fontStyle: italic ? 'italic' : undefined,
    textDecoration: underline ? 'underline' : del ? 'line-through' : undefined,
  }

  // Si tiene ellipsis expandible, necesitamos estructura especial
  if (isExpandable) {
    const ellipsisOnlyStyles = getEllipsisStyles()

    if (rows > 1) {
      // Multi-línea: wrapper div con texto truncado + botón afuera
      return (
        <div style={mergeSemanticStyle(textStyles, styles?.root, style)} className={rootClassName}>
          <div style={{ ...ellipsisOnlyStyles, ...styles?.content }} className={classNames?.content}>
            {content}
          </div>
          {expandButton}
          {copyButton}
        </div>
      )
    }

    // Una línea: wrapper span con texto truncado inline + botón afuera
    return (
      <span style={mergeSemanticStyle({ ...textStyles, display: 'inline-flex', alignItems: 'baseline', maxWidth: '100%' }, styles?.root, style)} className={rootClassName}>
        <span style={{ ...ellipsisOnlyStyles, flex: '0 1 auto', minWidth: 0, ...styles?.content }} className={classNames?.content}>
          {content}
        </span>
        {expandButton}
        {copyButton}
      </span>
    )
  }

  // Para ellipsis multi-línea sin expandable, usamos un div
  if (ellipsisConfig && rows > 1) {
    return (
      <div style={baseStyles} className={rootClassName}>
        {classNames?.content || styles?.content ? (
          <span className={classNames?.content} style={styles?.content}>{content}</span>
        ) : (
          content
        )}
        {copyButton}
      </div>
    )
  }

  return (
    <span style={baseStyles} className={rootClassName}>
      {classNames?.content || styles?.content ? (
        <span className={classNames?.content} style={styles?.content}>{content}</span>
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
