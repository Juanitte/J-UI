import { type ReactNode, type CSSProperties } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type PlaceholderSize = 'large' | 'small' | 'default'

export type PlaceholderSemanticSlot = 'root' | 'avatar' | 'title' | 'paragraph'
export type PlaceholderClassNames = SemanticClassNames<PlaceholderSemanticSlot>
export type PlaceholderStyles = SemanticStyles<PlaceholderSemanticSlot>

export interface PlaceholderAvatarProps {
  shape?: 'circle' | 'square'
  size?: PlaceholderSize | number
}

export interface PlaceholderTitleProps {
  width?: number | string
}

export interface PlaceholderParagraphProps {
  rows?: number
  width?: number | string | Array<number | string>
}

export interface PlaceholderProps {
  active?: boolean
  avatar?: boolean | PlaceholderAvatarProps
  loading?: boolean
  paragraph?: boolean | PlaceholderParagraphProps
  round?: boolean
  title?: boolean | PlaceholderTitleProps
  className?: string
  style?: CSSProperties
  classNames?: PlaceholderClassNames
  styles?: PlaceholderStyles
  children?: ReactNode
}

export interface PlaceholderButtonProps {
  active?: boolean
  block?: boolean
  shape?: 'circle' | 'round' | 'square' | 'default'
  size?: PlaceholderSize
  className?: string
  style?: CSSProperties
}

export interface PlaceholderAvatarComponentProps {
  active?: boolean
  shape?: 'circle' | 'square'
  size?: PlaceholderSize | number
  className?: string
  style?: CSSProperties
}

export interface PlaceholderInputProps {
  active?: boolean
  size?: PlaceholderSize
  className?: string
  style?: CSSProperties
}

export interface PlaceholderImageProps {
  active?: boolean
  className?: string
  style?: CSSProperties
}

export interface PlaceholderNodeProps {
  active?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

// ============================================================================
// Constants
// ============================================================================

const SHIMMER_KEYFRAMES = `
@keyframes j-placeholder-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`

const SIZE_MAP: Record<string, string> = {
  small: '1.5rem',
  default: '2rem',
  large: '2.5rem',
}

const AVATAR_SIZE_MAP: Record<string, string> = {
  small: '1.5rem',
  default: '2rem',
  large: '2.5rem',
}

// ============================================================================
// Helpers
// ============================================================================

function resolveSize(size: PlaceholderSize | number | undefined, map: Record<string, string>): string {
  if (typeof size === 'number') return `${size / 16}rem`
  return map[size || 'default'] || map.default
}

function blockStyle(active: boolean, extra?: CSSProperties): CSSProperties {
  const base: CSSProperties = {
    backgroundColor: tokens.colorBgMuted,
    ...extra,
  }
  if (active) {
    base.background = `linear-gradient(90deg, ${tokens.colorBgMuted} 25%, ${tokens.colorBorder} 37%, ${tokens.colorBgMuted} 63%)`
    base.backgroundSize = '200% 100%'
    base.animation = 'j-placeholder-shimmer 1.5s ease-in-out infinite'
  }
  return base
}

// ============================================================================
// Sub-components
// ============================================================================

function PlaceholderButton({
  active = false,
  block = false,
  shape = 'default',
  size = 'default',
  className,
  style,
}: PlaceholderButtonProps) {
  const h = SIZE_MAP[size] || SIZE_MAP.default
  const isCircle = shape === 'circle'
  const isSquare = shape === 'square'
  const borderRadius = shape === 'round'
    ? '999px'
    : (isCircle ? '50%' : '0.375rem')

  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        className={className}
        style={blockStyle(active, {
          height: h,
          width: (isCircle || isSquare) ? h : (block ? '100%' : '4rem'),
          borderRadius,
          ...style,
        })}
      />
    </>
  )
}

function PlaceholderAvatar({
  active = false,
  shape = 'circle',
  size = 'default',
  className,
  style,
}: PlaceholderAvatarComponentProps) {
  const s = resolveSize(size, AVATAR_SIZE_MAP)

  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        className={className}
        style={blockStyle(active, {
          width: s,
          height: s,
          borderRadius: shape === 'circle' ? '50%' : '0.375rem',
          flexShrink: 0,
          ...style,
        })}
      />
    </>
  )
}

function PlaceholderInput({
  active = false,
  size = 'default',
  className,
  style,
}: PlaceholderInputProps) {
  const h = SIZE_MAP[size] || SIZE_MAP.default

  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        className={className}
        style={blockStyle(active, {
          width: '100%',
          height: h,
          borderRadius: '0.375rem',
          ...style,
        })}
      />
    </>
  )
}

function PlaceholderImage({
  active = false,
  className,
  style,
}: PlaceholderImageProps) {
  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        className={className}
        style={blockStyle(active, {
          width: '100%',
          height: '100%',
          minHeight: '8rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        })}
      >
        <svg
          width="3rem"
          height="3rem"
          viewBox="0 0 24 24"
          fill="none"
          stroke={tokens.colorTextSubtle}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" fill={tokens.colorTextSubtle} stroke="none" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    </>
  )
}

function PlaceholderNode({
  active = false,
  children,
  className,
  style,
}: PlaceholderNodeProps) {
  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        className={className}
        style={blockStyle(active, {
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          ...(children == null && {
            border: `1px dashed ${tokens.colorBorder}`,
            minHeight: '4rem',
            backgroundColor: 'transparent',
            background: 'none',
            animation: 'none',
          }),
          ...style,
        })}
      >
        {children}
      </div>
    </>
  )
}

// ============================================================================
// Main Component
// ============================================================================

function PlaceholderRoot({
  active = false,
  avatar = false,
  loading,
  paragraph = true,
  round = false,
  title = true,
  className,
  style,
  classNames,
  styles,
  children,
}: PlaceholderProps) {
  // loading=false → show children
  if (loading === false) return <>{children}</>

  // Resolve avatar config
  const showAvatar = avatar !== false
  const avatarConfig: PlaceholderAvatarProps = typeof avatar === 'object' ? avatar : {}
  const avatarShape = avatarConfig.shape || 'circle'
  const avatarSize = resolveSize(avatarConfig.size, AVATAR_SIZE_MAP)

  // Resolve title config
  const showTitle = title !== false
  const titleWidth = (typeof title === 'object' ? title.width : undefined) ?? '38%'

  // Resolve paragraph config
  const showParagraph = paragraph !== false
  const paragraphConfig: PlaceholderParagraphProps = typeof paragraph === 'object' ? paragraph : {}
  const rows = paragraphConfig.rows ?? 3
  const paragraphWidth = paragraphConfig.width

  const barRadius = round ? '999px' : '0.25rem'

  // Resolve row widths
  const rowWidths: Array<number | string> = []
  for (let i = 0; i < rows; i++) {
    if (Array.isArray(paragraphWidth)) {
      rowWidths.push(paragraphWidth[i] ?? '100%')
    } else if (paragraphWidth != null && i === rows - 1) {
      rowWidths.push(paragraphWidth)
    } else if (i === rows - 1) {
      rowWidths.push('61%')
    } else {
      rowWidths.push('100%')
    }
  }

  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(
          { display: 'flex', gap: '1rem' },
          styles?.root,
          style,
        )}
      >
        {/* Avatar */}
        {showAvatar && (
          <div
            className={classNames?.avatar}
            style={mergeSemanticStyle(
              blockStyle(active, {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarShape === 'circle' ? '50%' : '0.375rem',
                flexShrink: 0,
              }),
              styles?.avatar,
            )}
          />
        )}

        {/* Content (title + paragraph) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Title */}
          {showTitle && (
            <div
              className={classNames?.title}
              style={mergeSemanticStyle(
                blockStyle(active, {
                  height: '1rem',
                  width: typeof titleWidth === 'number' ? `${titleWidth}px` : titleWidth,
                  borderRadius: barRadius,
                  marginBottom: showParagraph ? '1.5rem' : undefined,
                }),
                styles?.title,
              )}
            />
          )}

          {/* Paragraph */}
          {showParagraph && (
            <div
              className={classNames?.paragraph}
              style={mergeSemanticStyle(
                { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
                styles?.paragraph,
              )}
            >
              {rowWidths.map((w, i) => (
                <div
                  key={i}
                  style={blockStyle(active, {
                    height: '0.875rem',
                    width: typeof w === 'number' ? `${w}px` : w,
                    borderRadius: barRadius,
                  })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ============================================================================
// Compound Export
// ============================================================================

export const Placeholder = Object.assign(PlaceholderRoot, {
  Button: PlaceholderButton,
  Avatar: PlaceholderAvatar,
  Input: PlaceholderInput,
  Image: PlaceholderImage,
  Node: PlaceholderNode,
})
