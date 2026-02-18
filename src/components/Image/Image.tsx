import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  createContext,
  useMemo,
  type ReactNode,
  type CSSProperties,
  type SyntheticEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type ImageSemanticSlot = 'root' | 'image' | 'mask'
export type ImageClassNames = SemanticClassNames<ImageSemanticSlot>
export type ImageStyles = SemanticStyles<ImageSemanticSlot>

export type PreviewSemanticSlot = 'root' | 'body' | 'toolbar' | 'close'

export interface PreviewConfig {
  /** Controlled open state */
  open?: boolean
  /** Custom preview source (e.g. high-res) */
  src?: string
  /** Callback when preview open state changes */
  onOpenChange?: (open: boolean) => void
  /** Minimum zoom scale */
  minScale?: number
  /** Maximum zoom scale */
  maxScale?: number
  /** Zoom step multiplier (zoom = current * (1 + scaleStep)) */
  scaleStep?: number
}

export interface PreviewGroupConfig extends PreviewConfig {
  /** Controlled current image index */
  current?: number
  /** Callback when current image changes */
  onChange?: (current: number, prev: number) => void
  /** Custom counter renderer */
  countRender?: (current: number, total: number) => ReactNode
}

export interface ImageProps {
  /** Image source URL */
  src?: string
  /** Alt text */
  alt?: string
  /** Image width */
  width?: string | number
  /** Image height */
  height?: string | number
  /** Fallback URL when load fails */
  fallback?: string
  /** Loading placeholder. true = built-in blur effect */
  placeholder?: ReactNode | boolean
  /** Preview config. false to disable */
  preview?: boolean | PreviewConfig
  /** Error callback */
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void
  /** Root CSS class */
  className?: string
  /** Root inline style */
  style?: CSSProperties
  /** Semantic class names */
  classNames?: ImageClassNames
  /** Semantic styles */
  styles?: ImageStyles
}

export interface PreviewGroupProps {
  /** Declarative image list */
  items?: (string | { src: string; alt?: string })[]
  /** Group preview config. false to disable */
  preview?: boolean | PreviewGroupConfig
  /** Image children */
  children?: ReactNode
}

// ─── Icons ──────────────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function ZoomInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

function ZoomOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  )
}

function RotateLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  )
}

function RotateRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
    </svg>
  )
}

function FlipHIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <polyline points="6 12 3 12" />
      <polyline points="21 12 18 12" />
    </svg>
  )
}

function FlipVIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="12 6 12 3" />
      <polyline points="12 21 12 18" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

function BrokenImageIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={tokens.colorTextSubtle} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

// ─── Transform helpers ──────────────────────────────────────────────────────────

interface Transform {
  scale: number
  rotate: number
  flipX: boolean
  flipY: boolean
  x: number
  y: number
}

const DEFAULT_TRANSFORM: Transform = {
  scale: 1,
  rotate: 0,
  flipX: false,
  flipY: false,
  x: 0,
  y: 0,
}

function getTransformStyle(t: Transform): string {
  return `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.scale}) rotate(${t.rotate}deg) scaleX(${t.flipX ? -1 : 1}) scaleY(${t.flipY ? -1 : 1})`
}

// ─── Preview Group Context ──────────────────────────────────────────────────────

interface GroupImageData {
  src: string
  alt?: string
  previewSrc?: string
}

interface PreviewGroupContextValue {
  isGroup: boolean
  register: (id: number, data: GroupImageData) => () => void
  open: (index: number) => void
  previewDisabled: boolean
}

const PreviewGroupContext = createContext<PreviewGroupContextValue>({
  isGroup: false,
  register: () => () => {},
  open: () => {},
  previewDisabled: false,
})

// ─── Preview Overlay ────────────────────────────────────────────────────────────

interface PreviewOverlayProps {
  open: boolean
  src: string
  alt?: string
  onClose: () => void
  minScale: number
  maxScale: number
  scaleStep: number
  // Group props
  isGroup?: boolean
  current?: number
  total?: number
  onPrev?: () => void
  onNext?: () => void
  countRender?: (current: number, total: number) => ReactNode
}

function PreviewOverlay({
  open,
  src,
  alt,
  onClose,
  minScale,
  maxScale,
  scaleStep,
  isGroup,
  current = 0,
  total = 1,
  onPrev,
  onNext,
  countRender,
}: PreviewOverlayProps) {
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)
  const prevSrcRef = useRef(src)

  // Reset transform when image changes
  useEffect(() => {
    if (src !== prevSrcRef.current) {
      setTransform(DEFAULT_TRANSFORM)
      prevSrcRef.current = src
    }
  }, [src])

  // Animate in
  useEffect(() => {
    if (open) {
      setTransform(DEFAULT_TRANSFORM)
      setIsAnimating(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    }
  }, [open])

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Focus overlay for keyboard events
  useEffect(() => {
    if (open && overlayRef.current) {
      overlayRef.current.focus()
    }
  }, [open])

  // Zoom helpers
  const zoomIn = useCallback(() => {
    setTransform(t => {
      const next = t.scale * (1 + scaleStep)
      return { ...t, scale: Math.min(next, maxScale) }
    })
  }, [scaleStep, maxScale])

  const zoomOut = useCallback(() => {
    setTransform(t => {
      const next = t.scale / (1 + scaleStep)
      if (next <= minScale) {
        return { ...t, scale: minScale, x: 0, y: 0 }
      }
      return { ...t, scale: next }
    })
  }, [scaleStep, minScale])

  const rotateLeft = useCallback(() => {
    setTransform(t => ({ ...t, rotate: t.rotate - 90 }))
  }, [])

  const rotateRight = useCallback(() => {
    setTransform(t => ({ ...t, rotate: t.rotate + 90 }))
  }, [])

  const flipH = useCallback(() => {
    setTransform(t => ({ ...t, flipX: !t.flipX }))
  }, [])

  const flipV = useCallback(() => {
    setTransform(t => ({ ...t, flipY: !t.flipY }))
  }, [])

  const reset = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM)
  }, [])

  // Keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      case 'ArrowLeft':
        if (isGroup && onPrev) { e.preventDefault(); onPrev() }
        break
      case 'ArrowRight':
        if (isGroup && onNext) { e.preventDefault(); onNext() }
        break
      case '+':
      case '=':
        e.preventDefault()
        zoomIn()
        break
      case '-':
        e.preventDefault()
        zoomOut()
        break
    }
  }, [onClose, isGroup, onPrev, onNext, zoomIn, zoomOut])

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }, [zoomIn, zoomOut])

  // Drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (transform.scale <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y }
  }, [transform.scale, transform.x, transform.y])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setTransform(t => ({ ...t, x: dragStart.current.tx + dx, y: dragStart.current.ty + dy }))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // Backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  if (!open || typeof document === 'undefined') return null

  const toolbarBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    border: 'none',
    background: 'none',
    color: 'rgba(255,255,255,0.75)',
    cursor: 'pointer',
    borderRadius: '0.375rem',
    transition: 'color 0.15s, background-color 0.15s',
    padding: 0,
  }

  const navBtnStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.35)',
    color: 'rgba(255,255,255,0.85)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    padding: 0,
    zIndex: 2,
  }

  const counter = isGroup && total > 1 ? (
    <div style={{
      position: 'absolute',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'rgba(255,255,255,0.85)',
      fontSize: '0.875rem',
      fontWeight: 500,
      userSelect: 'none',
    }}>
      {countRender ? countRender(current + 1, total) : `${current + 1} / ${total}`}
    </div>
  ) : null

  const overlay = (
    <div
      ref={overlayRef}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        outline: 'none',
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.72)' }}
        onClick={handleBackdropClick}
      />

      {/* Counter */}
      {counter}

      {/* Close button */}
      <button
        type="button"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'rgba(0,0,0,0.35)',
          color: 'rgba(255,255,255,0.85)',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          padding: 0,
          zIndex: 2,
        }}
        onClick={onClose}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.55)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.35)' }}
      >
        <CloseIcon />
      </button>

      {/* Navigation arrows */}
      {isGroup && total > 1 && (
        <>
          <button
            type="button"
            style={{ ...navBtnStyle, left: '1rem' }}
            onClick={onPrev}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.55)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.35)' }}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            style={{ ...navBtnStyle, right: '1rem' }}
            onClick={onNext}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.55)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.35)' }}
          >
            <ChevronRightIcon />
          </button>
        </>
      )}

      {/* Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            maxWidth: '80vw',
            maxHeight: '80vh',
            objectFit: 'contain',
            transform: getTransformStyle(transform),
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            cursor: transform.scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Toolbar */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.125rem',
          backgroundColor: 'rgba(0,0,0,0.45)',
          borderRadius: '2rem',
          padding: '0.25rem 0.5rem',
          zIndex: 2,
        }}
      >
        {([
          { icon: <ZoomOutIcon />, action: zoomOut, title: 'Zoom out' },
          { icon: <ZoomInIcon />, action: zoomIn, title: 'Zoom in' },
          { icon: <RotateLeftIcon />, action: rotateLeft, title: 'Rotate left' },
          { icon: <RotateRightIcon />, action: rotateRight, title: 'Rotate right' },
          { icon: <FlipHIcon />, action: flipH, title: 'Flip horizontal' },
          { icon: <FlipVIcon />, action: flipV, title: 'Flip vertical' },
          { icon: <ResetIcon />, action: reset, title: 'Reset' },
        ] as const).map((btn) => (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            style={toolbarBtnStyle}
            onClick={btn.action}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.12)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}

// ─── Image Component ────────────────────────────────────────────────────────────

let nextGroupImageId = 0

type ImageStatus = 'loading' | 'loaded' | 'error'

function ImageInternal({
  src,
  alt,
  width,
  height,
  fallback,
  placeholder,
  preview = true,
  onError,
  className,
  style,
  classNames,
  styles,
}: ImageProps) {
  const [status, setStatus] = useState<ImageStatus>('loading')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const maskRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const groupCtx = useContext(PreviewGroupContext)
  const { isGroup, register: groupRegister } = groupCtx
  const idRef = useRef(++nextGroupImageId)

  // Resolve preview config
  const previewEnabled = preview !== false && !groupCtx.previewDisabled
  const previewConfig: PreviewConfig = typeof preview === 'object' ? preview : {}
  const isControlled = previewConfig.open !== undefined
  const effectiveOpen = isControlled ? previewConfig.open! : previewOpen

  const previewSrc = previewConfig.src ?? (useFallback && fallback ? fallback : src)

  // Register in group
  useEffect(() => {
    if (!isGroup || !src) return
    const id = idRef.current
    const unreg = groupRegister(id, {
      src: src!,
      alt,
      previewSrc: previewConfig.src,
    })
    return unreg
  }, [isGroup, groupRegister, src, alt, previewConfig.src])

  // Reset status on src change
  useEffect(() => {
    setStatus('loading')
    setUseFallback(false)
  }, [src])

  const handleLoad = useCallback(() => {
    setStatus('loaded')
  }, [])

  const handleError = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    onError?.(e)
    if (fallback && !useFallback) {
      setUseFallback(true)
    } else {
      setStatus('error')
    }
  }, [fallback, useFallback, onError])

  const handleClick = useCallback(() => {
    if (!previewEnabled) return
    if (isGroup) {
      groupCtx.open(idRef.current)
    } else if (isControlled) {
      previewConfig.onOpenChange?.(true)
    } else {
      setPreviewOpen(true)
    }
  }, [previewEnabled, isGroup, groupCtx.open, isControlled, previewConfig])

  const handlePreviewClose = useCallback(() => {
    if (isControlled) {
      previewConfig.onOpenChange?.(false)
    } else {
      setPreviewOpen(false)
    }
  }, [isControlled, previewConfig])

  // Hover mask (ref-based)
  const handleMouseEnter = useCallback(() => {
    if (!previewEnabled || !maskRef.current) return
    maskRef.current.style.opacity = '1'
  }, [previewEnabled])

  const handleMouseLeave = useCallback(() => {
    if (!maskRef.current) return
    maskRef.current.style.opacity = '0'
  }, [])

  const displaySrc = useFallback && fallback ? fallback : src

  const rootStyle = mergeSemanticStyle(
    {
      position: 'relative' as const,
      display: 'inline-block',
      overflow: 'hidden',
      width,
      height,
    },
    styles?.root,
    style,
  )

  const imgStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    ...styles?.image,
  }

  const showPlaceholder = status === 'loading' && placeholder

  return (
    <>
      <div
        className={mergeSemanticClassName(className, classNames?.root)}
        style={rootStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Placeholder */}
        {showPlaceholder && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.colorBgSubtle,
          }}>
            {placeholder === true ? (
              <div style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, ${tokens.colorBgSubtle} 25%, ${tokens.colorBgMuted} 50%, ${tokens.colorBgSubtle} 75%)`,
                backgroundSize: '200% 100%',
                animation: 'j-image-shimmer 1.5s infinite',
              }} />
            ) : placeholder}
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: tokens.colorBgSubtle,
            color: tokens.colorTextSubtle,
            fontSize: '0.75rem',
          }}>
            <BrokenImageIcon />
          </div>
        )}

        {/* Image */}
        {status !== 'error' && (
          <img
            ref={imgRef}
            src={displaySrc}
            alt={alt}
            className={classNames?.image}
            style={{
              ...imgStyle,
              opacity: status === 'loaded' ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {/* Preview mask */}
        {previewEnabled && status === 'loaded' && (
          <div
            ref={maskRef}
            className={classNames?.mask}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              backgroundColor: 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: '0.875rem',
              cursor: 'pointer',
              opacity: 0,
              transition: 'opacity 0.2s',
              ...styles?.mask,
            }}
          >
            <EyeIcon />
            Preview
          </div>
        )}
      </div>

      {/* Shimmer keyframes */}
      {showPlaceholder && placeholder === true && (
        <style>{`@keyframes j-image-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      )}

      {/* Standalone preview (not in group) */}
      {previewEnabled && !groupCtx.isGroup && (
        <PreviewOverlay
          open={effectiveOpen}
          src={previewSrc ?? ''}
          alt={alt}
          onClose={handlePreviewClose}
          minScale={previewConfig.minScale ?? 1}
          maxScale={previewConfig.maxScale ?? 50}
          scaleStep={previewConfig.scaleStep ?? 0.5}
        />
      )}
    </>
  )
}

// ─── Preview Group ──────────────────────────────────────────────────────────────

function PreviewGroupComponent({
  items,
  preview = true,
  children,
}: PreviewGroupProps) {
  const [images, setImages] = useState<Map<number, GroupImageData>>(new Map())
  const [currentId, setCurrentId] = useState<number>(-1)
  const [previewOpen, setPreviewOpen] = useState(false)

  const previewDisabled = preview === false
  const previewConfig: PreviewGroupConfig = typeof preview === 'object' ? preview : {}
  const isControlled = previewConfig.open !== undefined
  const effectiveOpen = isControlled ? previewConfig.open! : previewOpen

  // Stable ref for mutable config to avoid re-creating callbacks
  const configRef = useRef(previewConfig)
  configRef.current = previewConfig

  // Refs for stable callbacks
  const itemsRef = useRef(items)
  itemsRef.current = items
  const imagesMapRef = useRef(images)
  imagesMapRef.current = images

  // When items prop is provided, use it as the gallery list; otherwise use registered images
  const imageList = useMemo(() => {
    if (items) {
      return items.map((item, i) => ({
        id: i,
        src: typeof item === 'string' ? item : item.src,
        alt: typeof item === 'string' ? undefined : item.alt,
        previewSrc: undefined as string | undefined,
      }))
    }
    const entries = Array.from(images.entries()).sort((a, b) => a[0] - b[0])
    return entries.map(([id, data]) => ({ id, ...data }))
  }, [items, images])

  const currentIndex = useMemo(() => {
    const controlled = previewConfig.current
    if (controlled !== undefined) return controlled
    return Math.max(0, imageList.findIndex(img => img.id === currentId))
  }, [imageList, currentId, previewConfig.current])

  const currentImage = imageList[currentIndex]

  // Refs for nav callbacks
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex
  const imageListRef = useRef(imageList)
  imageListRef.current = imageList

  const register = useCallback((id: number, data: GroupImageData) => {
    setImages(prev => {
      const next = new Map(prev)
      next.set(id, data)
      return next
    })
    return () => {
      setImages(prev => {
        const next = new Map(prev)
        next.delete(id)
        return next
      })
    }
  }, [])

  const openPreview = useCallback((id: number) => {
    const itemsList = itemsRef.current
    if (itemsList) {
      // items mode: match clicked image's src to find gallery index
      const registered = imagesMapRef.current.get(id)
      if (registered) {
        const matchIdx = itemsList.findIndex(item => {
          const itemSrc = typeof item === 'string' ? item : item.src
          return itemSrc === registered.src || itemSrc === registered.previewSrc
        })
        setCurrentId(matchIdx >= 0 ? matchIdx : 0)
      } else {
        setCurrentId(0)
      }
    } else {
      setCurrentId(id)
    }
    if (configRef.current.open !== undefined) {
      configRef.current.onOpenChange?.(true)
    } else {
      setPreviewOpen(true)
    }
  }, [])

  const closePreview = useCallback(() => {
    if (configRef.current.open !== undefined) {
      configRef.current.onOpenChange?.(false)
    } else {
      setPreviewOpen(false)
    }
  }, [])

  const goToPrev = useCallback(() => {
    const list = imageListRef.current
    const idx = currentIndexRef.current
    const prevIndex = (idx - 1 + list.length) % list.length
    const prevImage = list[prevIndex]
    if (prevImage) {
      setCurrentId(prevImage.id)
      configRef.current.onChange?.(prevIndex, idx)
    }
  }, [])

  const goToNext = useCallback(() => {
    const list = imageListRef.current
    const idx = currentIndexRef.current
    const nextIndex = (idx + 1) % list.length
    const nextImage = list[nextIndex]
    if (nextImage) {
      setCurrentId(nextImage.id)
      configRef.current.onChange?.(nextIndex, idx)
    }
  }, [])

  const contextValue = useMemo<PreviewGroupContextValue>(() => ({
    isGroup: true,
    register,
    open: openPreview,
    previewDisabled,
  }), [register, openPreview, previewDisabled])

  return (
    <PreviewGroupContext.Provider value={contextValue}>
      {items && !children
        ? items.map((item, i) => {
            const itemSrc = typeof item === 'string' ? item : item.src
            const itemAlt = typeof item === 'string' ? undefined : item.alt
            return <ImageInternal key={i} src={itemSrc} alt={itemAlt} width="7.5rem" height="5rem" />
          })
        : children
      }
      {!previewDisabled && (
        <PreviewOverlay
          open={effectiveOpen}
          src={currentImage?.previewSrc ?? currentImage?.src ?? ''}
          alt={currentImage?.alt}
          onClose={closePreview}
          minScale={previewConfig.minScale ?? 1}
          maxScale={previewConfig.maxScale ?? 50}
          scaleStep={previewConfig.scaleStep ?? 0.5}
          isGroup
          current={currentIndex}
          total={imageList.length}
          onPrev={goToPrev}
          onNext={goToNext}
          countRender={previewConfig.countRender}
        />
      )}
    </PreviewGroupContext.Provider>
  )
}

// ─── Compound Export ─────────────────────────────────────────────────────────────

export const Image = Object.assign(ImageInternal, {
  PreviewGroup: PreviewGroupComponent,
})
