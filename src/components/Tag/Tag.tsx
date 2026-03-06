import { type ReactNode, type CSSProperties, useState, useCallback } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Tag.css'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type TagPresetColor =
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  | 'pink' | 'red' | 'yellow' | 'orange' | 'cyan' | 'green'
  | 'blue' | 'purple' | 'geekblue' | 'magenta' | 'volcano' | 'gold' | 'lime'

export type TagVariant = 'outlined' | 'filled' | 'solid'

export type TagSemanticSlot = 'root' | 'icon' | 'content' | 'closeIcon'
export type TagClassNames = SemanticClassNames<TagSemanticSlot>
export type TagStyles = SemanticStyles<TagSemanticSlot>

export interface TagProps {
  children?: ReactNode
  color?: TagPresetColor | (string & {})
  variant?: TagVariant
  closable?: boolean
  closeIcon?: ReactNode
  onClose?: (e: React.MouseEvent) => void
  icon?: ReactNode
  bordered?: boolean
  href?: string
  target?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
  style?: CSSProperties
  classNames?: TagClassNames
  styles?: TagStyles
}

export type CheckableTagSemanticSlot = 'root' | 'content'
export type CheckableTagClassNames = SemanticClassNames<CheckableTagSemanticSlot>
export type CheckableTagStyles = SemanticStyles<CheckableTagSemanticSlot>

export interface CheckableTagProps {
  children?: ReactNode
  checked?: boolean
  onChange?: (checked: boolean) => void
  color?: TagPresetColor | (string & {})
  disabled?: boolean
  className?: string
  style?: CSSProperties
  classNames?: CheckableTagClassNames
  styles?: CheckableTagStyles
}

// ─── Color Resolution ───────────────────────────────────────────────────────────

interface ResolvedColor {
  bg: string
  border: string
  text: string
  solid: string
}

const STATUS_PRESETS: Record<string, ResolvedColor> = {
  primary:   { bg: tokens.colorPrimaryLight,   border: tokens.colorPrimaryBorder,   text: tokens.colorPrimary,   solid: tokens.colorPrimary },
  secondary: { bg: tokens.colorSecondaryLight,  border: tokens.colorSecondaryBorder, text: tokens.colorSecondary, solid: tokens.colorSecondary },
  success:   { bg: tokens.colorSuccessLight,    border: tokens.colorSuccessBorder,   text: tokens.colorSuccess,   solid: tokens.colorSuccess },
  warning:   { bg: tokens.colorWarningLight,    border: tokens.colorWarningBorder,   text: tokens.colorWarning,   solid: tokens.colorWarning },
  error:     { bg: tokens.colorErrorLight,      border: tokens.colorErrorBorder,     text: tokens.colorError,     solid: tokens.colorError },
  info:      { bg: tokens.colorInfoLight,       border: tokens.colorInfoBorder,      text: tokens.colorInfo,      solid: tokens.colorInfo },
}

const DECORATIVE_PRESETS: Record<string, string> = {
  pink:     '#eb2f96',
  magenta:  '#eb2f96',
  red:      '#f5222d',
  volcano:  '#fa541c',
  orange:   '#fa8c16',
  gold:     '#faad14',
  yellow:   '#fadb14',
  lime:     '#a0d911',
  green:    '#52c41a',
  cyan:     '#13c2c2',
  blue:     '#1677ff',
  geekblue: '#2f54eb',
  purple:   '#722ed1',
}

function resolveColorForVariant(
  color: string | undefined,
  variant: TagVariant,
): { backgroundColor: string; borderColor: string; color: string } {
  // No color → default tag
  if (!color) {
    if (variant === 'solid') {
      return { backgroundColor: tokens.colorTextMuted, borderColor: tokens.colorTextMuted, color: '#fff' }
    }
    if (variant === 'filled') {
      return { backgroundColor: tokens.colorBgMuted, borderColor: 'transparent', color: tokens.colorText }
    }
    // outlined
    return { backgroundColor: 'transparent', borderColor: tokens.colorBorder, color: tokens.colorText }
  }

  // Status preset
  const status = STATUS_PRESETS[color]
  if (status) {
    if (variant === 'solid') {
      return { backgroundColor: status.solid, borderColor: status.solid, color: '#fff' }
    }
    if (variant === 'filled') {
      return {
        backgroundColor: `color-mix(in srgb, ${status.solid} 25%, transparent)`,
        borderColor: 'transparent',
        color: status.text,
      }
    }
    // outlined
    return { backgroundColor: 'transparent', borderColor: status.border, color: status.text }
  }

  // Decorative preset or custom hex/rgb
  const hex = DECORATIVE_PRESETS[color] ?? color
  if (variant === 'solid') {
    return { backgroundColor: hex, borderColor: hex, color: '#fff' }
  }
  if (variant === 'filled') {
    return {
      backgroundColor: `color-mix(in srgb, ${hex} 25%, transparent)`,
      borderColor: 'transparent',
      color: hex,
    }
  }
  // outlined
  return {
    backgroundColor: 'transparent',
    borderColor: `color-mix(in srgb, ${hex} 45%, transparent)`,
    color: hex,
  }
}

// ─── Icons ──────────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg viewBox="0 0 1024 1024" width="10" height="10" fill="currentColor" aria-hidden="true">
      <path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L512 442.2 295.9 191.7c-3-3.6-7.5-5.7-12.3-5.7H203.8c-6.8 0-10.5 7.9-6.1 13.1L460.2 512 197.7 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7L512 581.8l216.1 250.5c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor" aria-hidden="true"
      style={{ animation: 'j-tag-spin 1s linear infinite' }}
    >
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.3 199.3 0 19.9-16.1 36-36 36z" />
    </svg>
  )
}

// ─── Tag Component ──────────────────────────────────────────────────────────────

function TagComponent({
  children,
  color,
  variant = 'outlined',
  closable = false,
  closeIcon,
  onClose,
  icon,
  bordered = true,
  href,
  target,
  disabled = false,
  onClick,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: TagProps) {
  const [visible, setVisible] = useState(true)
  const [closing, setClosing] = useState(false)

  const resolved = resolveColorForVariant(color, variant)

  // ── Close ──

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.(e)
    if (e.defaultPrevented) return
    setClosing(true)
    setTimeout(() => setVisible(false), 200)
  }, [onClose])

  // ── Render ──

  if (!visible) return null

  const rootClass = cx(
    'ino-tag',
    {
      'ino-tag--hoverable': !disabled,
      'ino-tag--disabled': disabled,
      'ino-tag--closing': closing,
      'ino-tag--entering': !closing,
    },
    className,
    classNamesProp?.root,
  )

  const dynamicStyle: CSSProperties = {
    border: bordered ? `1px solid ${resolved.borderColor}` : '1px solid transparent',
    backgroundColor: resolved.backgroundColor,
    color: resolved.color,
    ...styles?.root,
    ...style,
  }

  const Wrapper = (href && !disabled ? 'a' : 'span') as React.ElementType

  const wrapperProps: Record<string, unknown> = {}
  if (href && !disabled) {
    wrapperProps.href = href
    wrapperProps.target = target
  }

  return (
    <Wrapper
      {...wrapperProps}
      className={rootClass}
      style={dynamicStyle}
      onClick={disabled ? undefined : onClick}
    >
      {icon && (
        <span className={cx('ino-tag__icon', classNamesProp?.icon)} style={styles?.icon}>
          {icon}
        </span>
      )}
      <span className={cx('ino-tag__content', classNamesProp?.content)} style={styles?.content}>
        {children}
      </span>
      {closable && (
        <span
          className={cx('ino-tag__close', classNamesProp?.closeIcon)}
          style={styles?.closeIcon}
          onClick={handleClose}
          role="img"
          aria-label="close"
        >
          {closeIcon || <CloseIcon />}
        </span>
      )}
    </Wrapper>
  )
}

// ─── CheckableTag Component ─────────────────────────────────────────────────────

function CheckableTagComponent({
  children,
  checked = false,
  onChange,
  color,
  disabled = false,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: CheckableTagProps) {
  // Resolve checked color
  const checkedColor = color || 'primary'
  const statusPreset = STATUS_PRESETS[checkedColor]
  const hex = statusPreset ? statusPreset.solid : (DECORATIVE_PRESETS[checkedColor] ?? checkedColor)

  const handleClick = useCallback(() => {
    if (disabled) return
    onChange?.(!checked)
  }, [disabled, onChange, checked])

  const rootClass = cx(
    'ino-tag-checkable',
    {
      'ino-tag-checkable--checked': checked,
      'ino-tag-checkable--disabled': disabled,
    },
    className,
    classNamesProp?.root,
  )

  const dynamicStyle: CSSProperties = {
    ...(checked
      ? { backgroundColor: hex, borderColor: hex, color: '#fff' }
      : {}),
    ...styles?.root,
    ...style,
  }

  return (
    <span
      className={rootClass}
      style={dynamicStyle}
      onClick={handleClick}
    >
      <span className={cx('ino-tag-checkable__content', classNamesProp?.content)} style={styles?.content}>
        {children}
      </span>
    </span>
  )
}

// ─── Compound Export ────────────────────────────────────────────────────────────

export const Tag = Object.assign(TagComponent, {
  CheckableTag: CheckableTagComponent,
  SpinnerIcon,
})
