import {
  useState,
  useRef,
  useEffect,
  useContext,
  createContext,
  Children,
  type ReactNode,
  type CSSProperties,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Avatar.css'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type AvatarShape = 'circle' | 'square'

export type AvatarBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type AvatarResponsiveSize = Partial<Record<AvatarBreakpoint, number>>
export type AvatarSize = 'small' | 'default' | 'large' | number | AvatarResponsiveSize

export type AvatarSemanticSlot = 'root' | 'image' | 'icon' | 'text'
export type AvatarClassNames = SemanticClassNames<AvatarSemanticSlot>
export type AvatarStyles = SemanticStyles<AvatarSemanticSlot>

export interface AvatarProps {
  src?: string
  srcSet?: string
  alt?: string
  icon?: ReactNode
  shape?: AvatarShape
  size?: AvatarSize
  gap?: number
  draggable?: boolean | 'true' | 'false'
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  onError?: () => boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: AvatarClassNames
  styles?: AvatarStyles
}

export interface AvatarGroupProps {
  max?: { count?: number; style?: CSSProperties }
  size?: AvatarSize
  shape?: AvatarShape
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

// ─── Icons ──────────────────────────────────────────────────────────────────────

function UserIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<string, number> = {
  small: 24,
  default: 32,
  large: 40,
}

const BREAKPOINT_VALUES: Record<AvatarBreakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

const BREAKPOINT_ORDER: AvatarBreakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

function isResponsiveSize(size: AvatarSize): size is AvatarResponsiveSize {
  return typeof size === 'object' && size !== null
}

function resolveSize(size: AvatarSize, windowWidth?: number): number {
  if (typeof size === 'number') return size
  if (typeof size === 'string') return SIZE_MAP[size] ?? 32
  if (windowWidth !== undefined) {
    for (const bp of BREAKPOINT_ORDER) {
      if (windowWidth >= BREAKPOINT_VALUES[bp] && size[bp] !== undefined) {
        return size[bp]!
      }
    }
  }
  for (let i = BREAKPOINT_ORDER.length - 1; i >= 0; i--) {
    const bp = BREAKPOINT_ORDER[i]
    if (size[bp] !== undefined) return size[bp]!
  }
  return 32
}

function sizeToRem(px: number): string {
  return `${px / 16}rem`
}

function useWindowWidth(enabled: boolean): number {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [enabled])

  return width
}

// ─── Context ────────────────────────────────────────────────────────────────────

interface AvatarGroupContextValue {
  size?: AvatarSize
  shape?: AvatarShape
}

const AvatarGroupContext = createContext<AvatarGroupContextValue>({})

// ─── Avatar Component ───────────────────────────────────────────────────────────

function AvatarComponent({
  src,
  srcSet,
  alt,
  icon,
  shape: shapeProp,
  size: sizeProp,
  gap = 4,
  draggable = true,
  crossOrigin,
  onError,
  children,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: AvatarProps) {
  const groupCtx = useContext(AvatarGroupContext)
  const shape = shapeProp ?? groupCtx.shape ?? 'circle'
  const size = sizeProp ?? groupCtx.size ?? 'default'

  const needsResponsive = isResponsiveSize(size)
  const windowWidth = useWindowWidth(needsResponsive)

  const [isImgError, setIsImgError] = useState(false)
  const [textScale, setTextScale] = useState(1)
  const rootRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setIsImgError(false)
  }, [src])

  useEffect(() => {
    if (!textRef.current || !rootRef.current) return
    if (src && !isImgError) return

    const containerWidth = rootRef.current.offsetWidth
    const textWidth = textRef.current.offsetWidth
    const availableWidth = containerWidth - gap * 2

    if (availableWidth <= 0) {
      setTextScale(1)
    } else if (textWidth > availableWidth) {
      setTextScale(availableWidth / textWidth)
    } else {
      setTextScale(1)
    }
  }, [children, src, isImgError, gap, size, windowWidth])

  const handleImgError = () => {
    if (onError) {
      const preventFallback = onError()
      if (preventFallback === false) return
    }
    setIsImgError(true)
  }

  const sizePx = resolveSize(size, needsResponsive ? windowWidth : undefined)
  const sizeRem = sizeToRem(sizePx)
  const fontSize = sizeToRem(sizePx * 0.5)
  const iconSize = Math.round(sizePx * 0.55)

  const showImage = src && !isImgError
  const showIcon = !showImage && icon
  const showText = !showImage && !showIcon && children

  const rootClass = cx(
    'ino-avatar',
    `ino-avatar--${shape}`,
    className,
    classNamesProp?.root,
  )

  const dynamicStyle: CSSProperties = {
    width: sizeRem,
    height: sizeRem,
    fontSize,
    ...styles?.root,
    ...style,
  }

  return (
    <span
      ref={rootRef}
      className={rootClass}
      style={dynamicStyle}
    >
      {showImage && (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          draggable={draggable}
          crossOrigin={crossOrigin || undefined}
          className={cx('ino-avatar__image', classNamesProp?.image)}
          style={styles?.image}
          onError={handleImgError}
        />
      )}

      {showIcon && (
        <span
          className={cx('ino-avatar__icon', classNamesProp?.icon)}
          style={styles?.icon}
        >
          {icon}
        </span>
      )}

      {showText && (
        <span
          ref={textRef}
          className={cx('ino-avatar__text', classNamesProp?.text)}
          style={{
            transform: textScale !== 1 ? `scale(${textScale})` : undefined,
            ...styles?.text,
          }}
        >
          {children}
        </span>
      )}

      {!showImage && !showIcon && !showText && (
        <UserIcon size={iconSize} />
      )}
    </span>
  )
}

// ─── Avatar.Group ───────────────────────────────────────────────────────────────

function AvatarGroup({
  max,
  size = 'default',
  shape = 'circle',
  children,
  className,
  style,
}: AvatarGroupProps) {
  const childArray = Children.toArray(children)
  const maxCount = max?.count
  const visibleCount = maxCount !== undefined && maxCount < childArray.length ? maxCount : childArray.length
  const visible = childArray.slice(0, visibleCount)
  const hiddenCount = childArray.length - visibleCount

  const sizePx = resolveSize(size)
  const overlapMargin = sizeToRem(Math.round(sizePx * -0.3))

  const itemShapeClass = shape === 'circle' ? 'ino-avatar-group__item--circle' : 'ino-avatar-group__item--square'

  return (
    <AvatarGroupContext.Provider value={{ size, shape }}>
      <div
        className={cx('ino-avatar-group', className)}
        style={style}
      >
        {visible.map((child, i) => (
          <span
            key={i}
            className={cx('ino-avatar-group__item', itemShapeClass)}
            style={{
              marginInlineStart: i === 0 ? undefined : overlapMargin,
              zIndex: visibleCount - i,
            }}
          >
            {child}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span
            className={cx('ino-avatar-group__item', itemShapeClass)}
            style={{
              marginInlineStart: overlapMargin,
              zIndex: 0,
            }}
          >
            <AvatarComponent size={size} shape={shape} style={max?.style}>
              +{hiddenCount}
            </AvatarComponent>
          </span>
        )}
      </div>
    </AvatarGroupContext.Provider>
  )
}

// ─── Compound Export ────────────────────────────────────────────────────────────

export const Avatar = Object.assign(AvatarComponent, {
  Group: AvatarGroup,
})
