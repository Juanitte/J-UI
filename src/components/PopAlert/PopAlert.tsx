import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { tokens } from '../../theme/tokens'
import { useThemeMode } from '../../theme'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './PopAlert.css'

// ============================================================================
// Types
// ============================================================================

export type PopAlertType = 'success' | 'info' | 'warning' | 'error' | 'loading'
export type PopAlertPlacement = 'top' | 'topLeft' | 'topRight' | 'right' | 'bottomRight' | 'bottom' | 'bottomLeft' | 'left'
export type PopAlertSize = 'sm' | 'md' | 'lg'

export type PopAlertSemanticSlot = 'root' | 'icon' | 'content' | 'description'
export type PopAlertClassNames = SemanticClassNames<PopAlertSemanticSlot>
export type PopAlertStyles = SemanticStyles<PopAlertSemanticSlot>

export interface PopAlertConfig {
  content: ReactNode
  /** Secondary text shown below content */
  description?: ReactNode
  type?: PopAlertType
  /** Size of the message pill. Overrides hook default. */
  size?: PopAlertSize
  /** Duration in seconds. Default 3. Use 0 to never auto-close. */
  duration?: number
  /** Unique key for update-in-place. Auto-generated if omitted. */
  key?: string
  icon?: ReactNode
  onClose?: () => void
  closable?: boolean
  /** Show a shrinking progress bar for remaining time */
  showProgress?: boolean
  /** Pause auto-close timer on hover (default true) */
  pauseOnHover?: boolean
  classNames?: PopAlertClassNames
  styles?: PopAlertStyles
  className?: string
  style?: CSSProperties
}

export interface PopAlertApi {
  success(content: ReactNode, duration?: number): void
  error(content: ReactNode, duration?: number): void
  info(content: ReactNode, duration?: number): void
  warning(content: ReactNode, duration?: number): void
  loading(content: ReactNode, duration?: number): void
  open(config: PopAlertConfig & { type: PopAlertType }): void
  destroy(key?: string): void
}

export interface PopAlertHookConfig {
  maxCount?: number
  /** Placement on screen (default 'top') */
  placement?: PopAlertPlacement
  /** Offset from the edge (default '0.5rem') */
  offset?: number | string
  /** Default size (default 'md') */
  size?: PopAlertSize
  /** Default duration in seconds (default 3) */
  duration?: number
}

/** Internal instance in the queue */
interface PopAlertInstance {
  key: string
  content: ReactNode
  description?: ReactNode
  type: PopAlertType
  size: PopAlertSize
  duration: number
  pauseOnHover: boolean
  closable: boolean
  showProgress: boolean
  icon?: ReactNode
  onClose?: () => void
  classNames?: PopAlertClassNames
  styles?: PopAlertStyles
  className?: string
  style?: CSSProperties
  phase: 'entering' | 'visible' | 'exiting'
  /** Bumped on update to restart timer */
  version: number
}

// ============================================================================
// Icons
// ============================================================================

function SuccessIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function InfoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}

function WarningIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  )
}

function ErrorIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  )
}

function LoadingIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" style={{ animation: 'j-popalert-spin 0.75s linear infinite', transformOrigin: 'center' }} />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

const DEFAULT_ICONS: Record<PopAlertType, (size: number) => ReactNode> = {
  success: (size) => <SuccessIcon size={size} />,
  info:    (size) => <InfoIcon size={size} />,
  warning: (size) => <WarningIcon size={size} />,
  error:   (size) => <ErrorIcon size={size} />,
  loading: (size) => <LoadingIcon size={size} />,
}

// ============================================================================
// Color config
// ============================================================================

type TypeColors = { bg: string; border: string; icon: string }

const BASE_COLORS: Record<PopAlertType, string> = {
  success: tokens.colorSuccess,
  info:    tokens.colorInfo,
  warning: tokens.colorWarning,
  error:   tokens.colorError,
  loading: tokens.colorInfo,
}

function getTypeColors(type: PopAlertType, isDark: boolean): TypeColors {
  const base = BASE_COLORS[type]
  if (isDark) {
    return {
      bg:     `color-mix(in srgb, ${base} 18%, ${tokens.colorBg})`,
      border: `color-mix(in srgb, ${base} 30%, ${tokens.colorBorder})`,
      icon:   base,
    }
  }
  return {
    bg:     `color-mix(in srgb, ${base} 15%, white)`,
    border: `color-mix(in srgb, ${base} 40%, ${tokens.colorBorder})`,
    icon:   base,
  }
}

// ============================================================================
// Size config
// ============================================================================

const SIZE_CONFIG: Record<PopAlertSize, { fontSize: string; padding: string; gap: string; iconSize: number }> = {
  sm: { fontSize: '0.75rem',  padding: '0.375rem 0.625rem', gap: '0.375rem', iconSize: 14 },
  md: { fontSize: '0.875rem', padding: '0.5rem 0.875rem',   gap: '0.5rem',   iconSize: 16 },
  lg: { fontSize: '1rem',     padding: '0.625rem 1rem',     gap: '0.625rem', iconSize: 20 },
}

// ============================================================================
// Placement helpers
// ============================================================================

function getContainerPosition(placement: PopAlertPlacement, offset: number | string): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    zIndex: 1010,
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'none',
    padding: '0 1rem',
  }

  switch (placement) {
    case 'top':
      return { ...base, top: offset, left: 0, right: 0, alignItems: 'center' }
    case 'topLeft':
      return { ...base, top: offset, left: 0, alignItems: 'flex-start' }
    case 'topRight':
      return { ...base, top: offset, right: 0, alignItems: 'flex-end' }
    case 'bottom':
      return { ...base, bottom: offset, left: 0, right: 0, alignItems: 'center', flexDirection: 'column-reverse' }
    case 'bottomLeft':
      return { ...base, bottom: offset, left: 0, alignItems: 'flex-start', flexDirection: 'column-reverse' }
    case 'bottomRight':
      return { ...base, bottom: offset, right: 0, alignItems: 'flex-end', flexDirection: 'column-reverse' }
    case 'left':
      return { ...base, top: 0, bottom: 0, left: offset, alignItems: 'flex-start', justifyContent: 'center' }
    case 'right':
      return { ...base, top: 0, bottom: 0, right: offset, alignItems: 'flex-end', justifyContent: 'center' }
  }
}

function getEnterTransform(placement: PopAlertPlacement): string {
  switch (placement) {
    case 'top': case 'topLeft': case 'topRight':
      return 'translateY(-100%)'
    case 'bottom': case 'bottomLeft': case 'bottomRight':
      return 'translateY(100%)'
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
  }
}

function getExitTransform(placement: PopAlertPlacement): string {
  switch (placement) {
    case 'top': case 'topLeft': case 'topRight':
      return 'translateY(-50%)'
    case 'bottom': case 'bottomLeft': case 'bottomRight':
      return 'translateY(50%)'
    case 'left':
      return 'translateX(-50%)'
    case 'right':
      return 'translateX(50%)'
  }
}

// ============================================================================
// PopAlertItem (internal)
// ============================================================================

function PopAlertItem({
  instance,
  placement,
  onRequestClose,
  onRemoved,
}: {
  instance: PopAlertInstance
  placement: PopAlertPlacement
  onRequestClose: (key: string) => void
  onRemoved: (key: string) => void
}) {
  const [visualPhase, setVisualPhase] = useState<'entering' | 'visible' | 'exiting'>('entering')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const elapsedRef = useRef(0)
  const lastTickRef = useRef(Date.now())
  const itemRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const themeMode = useThemeMode()
  const isDark = themeMode === 'dark'
  const colors = getTypeColors(instance.type, isDark)

  // Double rAF for enter animation
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisualPhase('visible')
      })
    })
    return () => cancelAnimationFrame(raf1)
  }, [])

  // Sync external phase → exiting
  useEffect(() => {
    if (instance.phase === 'exiting') {
      setVisualPhase('exiting')
    }
  }, [instance.phase])

  // Smooth transition on key-based update (version bump)
  useEffect(() => {
    if (instance.version === 0) return
    elapsedRef.current = 0
    lastTickRef.current = Date.now()
    requestAnimationFrame(() => {
      // Card-level scale+fade animation (no wrapper collapse)
      if (cardRef.current) {
        cardRef.current.style.animation = 'none'
        void cardRef.current.offsetHeight
        cardRef.current.style.animation = 'j-popalert-update 0.3s ease'
      }
      // Restart progress bar animation
      if (progressRef.current) {
        progressRef.current.style.animation = 'none'
        void progressRef.current.offsetHeight
        progressRef.current.style.animation = `j-popalert-progress ${instance.duration}s linear forwards`
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance.version])

  // Auto-close timer
  useEffect(() => {
    if (instance.duration === 0 || visualPhase !== 'visible') return
    const remaining = (instance.duration * 1000) - elapsedRef.current
    if (remaining <= 0) {
      onRequestClose(instance.key)
      return
    }
    lastTickRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      onRequestClose(instance.key)
    }, remaining)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visualPhase, instance.duration, instance.key, instance.version, onRequestClose])

  const handleMouseEnter = useCallback(() => {
    if (!instance.pauseOnHover || instance.duration === 0) return
    elapsedRef.current += Date.now() - lastTickRef.current
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (progressRef.current) progressRef.current.style.animationPlayState = 'paused'
  }, [instance.pauseOnHover, instance.duration])

  const handleMouseLeave = useCallback(() => {
    if (!instance.pauseOnHover || instance.duration === 0 || visualPhase !== 'visible') return
    if (progressRef.current) progressRef.current.style.animationPlayState = 'running'
    const remaining = (instance.duration * 1000) - elapsedRef.current
    if (remaining <= 0) {
      onRequestClose(instance.key)
      return
    }
    lastTickRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      onRequestClose(instance.key)
    }, remaining)
  }, [instance.pauseOnHover, instance.duration, instance.key, onRequestClose, visualPhase])

  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.target !== itemRef.current) return
    if (visualPhase === 'exiting') {
      instance.onClose?.()
      onRemoved(instance.key)
    }
  }, [visualPhase, instance, onRemoved])

  // ── Styles ──
  const isEntering = visualPhase === 'entering'
  const isExiting = visualPhase === 'exiting'

  const sizeConfig = SIZE_CONFIG[instance.size]

  const wrapperStyle: CSSProperties = {
    maxHeight: isEntering || isExiting ? 0 : '9.375rem',
    opacity: isEntering || isExiting ? 0 : 1,
    transform: isEntering ? getEnterTransform(placement) : isExiting ? getExitTransform(placement) : 'translate(0, 0)',
    marginBottom: isExiting ? 0 : '0.5rem',
  }

  const hasProgress = instance.showProgress && !!instance.duration && !isExiting

  const cardStyle: CSSProperties = {
    gap: sizeConfig.gap,
    padding: sizeConfig.padding,
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    fontSize: sizeConfig.fontSize,
    ...instance.styles?.root,
    ...instance.style,
  }

  return (
    <div
      ref={itemRef}
      className="ino-pop-alert__item"
      style={wrapperStyle}
      onTransitionEnd={handleTransitionEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={cx('ino-pop-alert__card', instance.className, instance.classNames?.root)}
        style={cardStyle}
      >
        {/* Icon */}
        <span
          className={cx('ino-pop-alert__icon', instance.classNames?.icon)}
          style={{ color: colors.icon, ...instance.styles?.icon }}
        >
          {instance.icon ?? DEFAULT_ICONS[instance.type](sizeConfig.iconSize)}
        </span>

        {/* Content + Description */}
        <div className="ino-pop-alert__content-wrapper">
          <span
            className={cx('ino-pop-alert__content', instance.classNames?.content)}
            style={instance.styles?.content}
          >
            {instance.content}
          </span>
          {instance.description != null && (
            <span
              className={cx('ino-pop-alert__description', instance.classNames?.description)}
              style={instance.styles?.description}
            >
              {instance.description}
            </span>
          )}
        </div>

        {/* Close button */}
        {instance.closable && (
          <button
            type="button"
            className="ino-pop-alert__close-btn"
            onClick={() => onRequestClose(instance.key)}
          >
            <CloseIcon />
          </button>
        )}

        {/* Progress bar */}
        {hasProgress && (
          <div
            ref={progressRef}
            className="ino-pop-alert__progress"
            style={{
              backgroundColor: colors.icon,
              animation: `j-popalert-progress ${instance.duration}s linear forwards`,
            }}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PopAlertContainer (internal)
// ============================================================================

function PopAlertContainer({
  instances,
  placement,
  offset,
  onRequestClose,
  onRemoved,
}: {
  instances: PopAlertInstance[]
  placement: PopAlertPlacement
  offset: number | string
  onRequestClose: (key: string) => void
  onRemoved: (key: string) => void
}) {
  if (typeof document === 'undefined') return null
  if (instances.length === 0) return null

  const containerStyle = getContainerPosition(placement, offset)

  return createPortal(
    <div className="ino-pop-alert__container" style={containerStyle}>
      {instances.map((inst) => (
        <PopAlertItem
          key={inst.key}
          instance={inst}
          placement={placement}
          onRequestClose={onRequestClose}
          onRemoved={onRemoved}
        />
      ))}
    </div>,
    document.body,
  )
}

// ============================================================================
// usePopAlert Hook
// ============================================================================

let idCounter = 0

export function usePopAlert(hookConfig?: PopAlertHookConfig): [PopAlertApi, ReactNode] {
  const instancesRef = useRef<PopAlertInstance[]>([])
  const [, forceRender] = useState(0)

  const defaultDuration = hookConfig?.duration ?? 3
  const maxCount = hookConfig?.maxCount ?? Infinity
  const placement = hookConfig?.placement ?? 'top'
  const offset = hookConfig?.offset ?? '0.5rem'
  const defaultSize = hookConfig?.size ?? 'md'

  const triggerRender = useCallback(() => {
    forceRender((c) => c + 1)
  }, [])

  const addOrUpdate = useCallback((config: PopAlertConfig & { type: PopAlertType }) => {
    const key = config.key ?? `j-popalert-${++idCounter}`
    const duration = config.duration ?? defaultDuration
    const pauseOnHover = config.pauseOnHover ?? true
    const closable = config.closable ?? false
    const showProgress = config.showProgress ?? false
    const size = config.size ?? defaultSize

    const existing = instancesRef.current.find((i) => i.key === key)
    if (existing) {
      existing.content = config.content
      existing.description = config.description
      existing.type = config.type
      existing.size = size
      existing.duration = duration
      existing.icon = config.icon
      existing.onClose = config.onClose
      existing.closable = closable
      existing.showProgress = showProgress
      existing.pauseOnHover = pauseOnHover
      existing.classNames = config.classNames
      existing.styles = config.styles
      existing.className = config.className
      existing.style = config.style
      existing.version += 1
      triggerRender()
      return
    }

    // Enforce maxCount
    const active = instancesRef.current.filter((i) => i.phase !== 'exiting')
    if (active.length >= maxCount) {
      const oldest = active[0]
      if (oldest) oldest.phase = 'exiting'
    }

    const instance: PopAlertInstance = {
      key,
      content: config.content,
      description: config.description,
      type: config.type,
      size,
      duration,
      icon: config.icon,
      onClose: config.onClose,
      closable,
      showProgress,
      pauseOnHover,
      classNames: config.classNames,
      styles: config.styles,
      className: config.className,
      style: config.style,
      phase: 'entering',
      version: 0,
    }

    instancesRef.current = [...instancesRef.current, instance]
    triggerRender()
  }, [defaultDuration, defaultSize, maxCount, triggerRender])

  const requestClose = useCallback((key: string) => {
    const inst = instancesRef.current.find((i) => i.key === key)
    if (inst && inst.phase !== 'exiting') {
      inst.phase = 'exiting'
      triggerRender()
    }
  }, [triggerRender])

  const removeInstance = useCallback((key: string) => {
    instancesRef.current = instancesRef.current.filter((i) => i.key !== key)
    triggerRender()
  }, [triggerRender])

  const api: PopAlertApi = useMemo(() => ({
    success: (content, duration?) => addOrUpdate({ content, type: 'success', duration }),
    error:   (content, duration?) => addOrUpdate({ content, type: 'error', duration }),
    info:    (content, duration?) => addOrUpdate({ content, type: 'info', duration }),
    warning: (content, duration?) => addOrUpdate({ content, type: 'warning', duration }),
    loading: (content, duration?) => addOrUpdate({ content, type: 'loading', duration }),
    open:    (config) => addOrUpdate(config),
    destroy: (key?) => {
      if (key) {
        requestClose(key)
      } else {
        instancesRef.current.forEach((i) => { i.phase = 'exiting' })
        triggerRender()
      }
    },
  }), [addOrUpdate, requestClose, triggerRender])

  const contextHolder = (
    <PopAlertContainer
      instances={instancesRef.current}
      placement={placement}
      offset={offset}
      onRequestClose={requestClose}
      onRemoved={removeInstance}
    />
  )

  return [api, contextHolder]
}
