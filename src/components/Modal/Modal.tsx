import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Modal.css'

// ============================================================================
// Types
// ============================================================================

export type ModalSemanticSlot = 'root' | 'mask' | 'header' | 'body' | 'footer' | 'closeBtn' | 'content'
export type ModalClassNames = SemanticClassNames<ModalSemanticSlot>
export type ModalStyles = SemanticStyles<ModalSemanticSlot>

export interface ModalMaskConfig {
  blur?: boolean
}

export interface ModalProps {
  /** Whether the modal is visible */
  open?: boolean
  /** Called when the user clicks the X, mask, or presses ESC */
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void
  /** Called when the OK button is clicked */
  onOk?: (e: React.MouseEvent) => void
  /** Callback after open/close animation completes */
  afterOpenChange?: (open: boolean) => void

  /** Title shown in the header */
  title?: ReactNode
  /**
   * Footer content.
   * - `undefined` (default): Cancel + OK buttons
   * - `null`: no footer
   * - `ReactNode`: custom content
   * - `(params) => ReactNode`: render function with `{ OkBtn, CancelBtn }`
   */
  footer?: ReactNode | null | ((params: { OkBtn: React.FC; CancelBtn: React.FC }) => ReactNode)
  /** Modal body content */
  children?: ReactNode

  /** Whether to show the close button (default: true) */
  closable?: boolean
  /** Custom close icon */
  closeIcon?: ReactNode
  /** Whether clicking the mask closes the modal (default: true) */
  maskClosable?: boolean
  /** Whether pressing ESC closes the modal (default: true) */
  keyboard?: boolean

  /** Width of the modal (default: '32rem') */
  width?: number | string
  /** Whether to vertically center the modal (default: false) */
  centered?: boolean

  /** OK button text (default: 'OK') */
  okText?: ReactNode
  /** Cancel button text (default: 'Cancel') */
  cancelText?: ReactNode
  /** Props spread onto the OK Button */
  okButtonProps?: Record<string, unknown>
  /** Props spread onto the Cancel Button */
  cancelButtonProps?: Record<string, unknown>

  /** Shows a loading spinner on the OK button */
  confirmLoading?: boolean
  /** Shows skeleton loading in the body */
  loading?: boolean

  /** Whether to unmount children when modal closes (default: false) */
  destroyOnClose?: boolean
  /** Mask configuration: boolean or { blur } (default: true) */
  mask?: boolean | ModalMaskConfig
  /** z-index of the modal (default: 1000) */
  zIndex?: number
  /** Custom render wrapper for the dialog panel (e.g. for draggable) */
  modalRender?: (node: ReactNode) => ReactNode

  className?: string
  style?: CSSProperties
  classNames?: ModalClassNames
  styles?: ModalStyles
}

// ── Confirm dialog types ──

export type ModalConfirmType = 'confirm' | 'info' | 'success' | 'error' | 'warning'

export interface ModalConfirmConfig {
  title?: ReactNode
  content?: ReactNode
  icon?: ReactNode
  okText?: ReactNode
  cancelText?: ReactNode
  onOk?: () => void | Promise<void>
  onCancel?: () => void
  /** Show a left border in the confirm type color (default: true) */
  bordered?: boolean
  closable?: boolean
  centered?: boolean
  width?: number | string
  maskClosable?: boolean
  keyboard?: boolean
  zIndex?: number
  className?: string
  style?: CSSProperties
}

export interface ModalInstance {
  destroy: () => void
  update: (config: Partial<ModalConfirmConfig>) => void
}

export interface ModalHookApi {
  confirm: (config: ModalConfirmConfig) => ModalInstance
  info: (config: ModalConfirmConfig) => ModalInstance
  success: (config: ModalConfirmConfig) => ModalInstance
  warning: (config: ModalConfirmConfig) => ModalInstance
  error: (config: ModalConfirmConfig) => ModalInstance
  destroyAll: () => void
}

// ============================================================================
// Icons
// ============================================================================

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" style={{ animation: 'j-modal-spin 0.75s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function ConfirmSuccessIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function ConfirmInfoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
}

function ConfirmWarningIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  )
}

function ConfirmErrorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  )
}

const CONFIRM_ICONS: Record<ModalConfirmType, ReactNode> = {
  confirm: <ConfirmWarningIcon />,
  info:    <ConfirmInfoIcon />,
  success: <ConfirmSuccessIcon />,
  warning: <ConfirmWarningIcon />,
  error:   <ConfirmErrorIcon />,
}

const CONFIRM_COLORS: Record<ModalConfirmType, string> = {
  confirm: tokens.colorWarning,
  info:    tokens.colorInfo,
  success: tokens.colorSuccess,
  warning: tokens.colorWarning,
  error:   tokens.colorError,
}

// ============================================================================
// Loading Skeleton
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="ino-modal__skeleton">
      <div className="ino-modal__skeleton-bar" style={{ width: '60%' }} />
      <div className="ino-modal__skeleton-bar" style={{ width: '100%', animationDelay: '0.1s' }} />
      <div className="ino-modal__skeleton-bar" style={{ width: '80%', animationDelay: '0.2s' }} />
    </div>
  )
}

// ============================================================================
// Modal Component
// ============================================================================

export function Modal({
  open = false,
  onClose,
  onOk,
  afterOpenChange,
  title,
  footer,
  children,
  closable = true,
  closeIcon,
  maskClosable = true,
  keyboard = true,
  width = '32rem',
  centered = false,
  okText = 'OK',
  cancelText = 'Cancel',
  okButtonProps,
  cancelButtonProps,
  confirmLoading = false,
  loading = false,
  destroyOnClose = false,
  mask: maskProp = true,
  zIndex = 1000,
  modalRender,
  className,
  style,
  classNames,
  styles,
}: ModalProps) {
  // ── Mask config ──
  const showMask = maskProp !== false
  const maskBlur = typeof maskProp === 'object' ? (maskProp.blur ?? false) : false

  // ── State ──
  const [mounted, setMounted] = useState(false)
  const [animating, setAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const prevBodyOverflowRef = useRef<string>('')
  const hasEverOpenedRef = useRef(false)

  if (open) hasEverOpenedRef.current = true

  // ── Mount / open animation ──
  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true)
        })
      })
    } else {
      setAnimating(false)
    }
  }, [open])

  // ── Handle transition end ──
  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.target !== contentRef.current) return
    if (!open) {
      setMounted(false)
      afterOpenChange?.(false)
    } else {
      afterOpenChange?.(true)
    }
  }, [open, afterOpenChange])

  // ── Body scroll lock ──
  useEffect(() => {
    if (mounted) {
      prevBodyOverflowRef.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prevBodyOverflowRef.current
    }
    return () => {
      document.body.style.overflow = prevBodyOverflowRef.current
    }
  }, [mounted])

  // ── Keyboard (Esc) ──
  useEffect(() => {
    if (!mounted || !keyboard) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.(e as unknown as React.KeyboardEvent)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mounted, keyboard, onClose])

  // ── Mask click ──
  const handleMaskClick = useCallback((e: React.MouseEvent) => {
    if (maskClosable) onClose?.(e)
  }, [maskClosable, onClose])

  // ── Don't render if never opened or unmounted ──
  if (!mounted && !hasEverOpenedRef.current) return null
  if (!mounted && destroyOnClose) return null

  // ── Styles ──
  const wrapperClass = cx(
    'ino-modal__wrapper',
    { 'ino-modal__wrapper--hidden': !mounted },
  )

  const maskClass = cx(
    'ino-modal__mask',
    maskBlur ? 'ino-modal__mask--blur' : 'ino-modal__mask--default',
    classNames?.mask,
  )
  const maskStyle: CSSProperties = {
    opacity: animating ? 1 : 0,
    ...styles?.mask,
  }

  const scrollClass = cx(
    'ino-modal__scroll',
    centered ? 'ino-modal__scroll--centered' : 'ino-modal__scroll--top',
  )

  const contentDynamicStyle: CSSProperties = {
    width,
    maxHeight: centered ? 'calc(100vh - 2rem)' : undefined,
    transform: animating ? 'scale(1)' : 'scale(0.85)',
    opacity: animating ? 1 : 0,
    ...styles?.content,
    ...styles?.root,
    ...style,
  }

  // ── Footer buttons ──
  const { style: cancelBtnExtraStyle, ...cancelBtnRest } = (cancelButtonProps ?? {}) as Record<string, unknown>
  const { style: okBtnExtraStyle, ...okBtnRest } = (okButtonProps ?? {}) as Record<string, unknown>

  const CancelBtn: React.FC = () => (
    <button
      type="button"
      className="ino-modal__btn ino-modal__btn--cancel"
      style={cancelBtnExtraStyle as CSSProperties}
      onClick={(e) => onClose?.(e)}
      {...cancelBtnRest}
    >
      {cancelText}
    </button>
  )

  const OkBtn: React.FC = () => (
    <button
      type="button"
      className={cx('ino-modal__btn', 'ino-modal__btn--ok', { 'ino-modal__btn--ok--loading': confirmLoading })}
      style={okBtnExtraStyle as CSSProperties}
      onClick={(e) => onOk?.(e)}
      disabled={confirmLoading}
      {...okBtnRest}
    >
      {confirmLoading && <Spinner />}
      {okText}
    </button>
  )

  let footerContent: ReactNode | null = null
  if (footer === null) {
    footerContent = null
  } else if (footer === undefined) {
    footerContent = (
      <>
        <CancelBtn />
        <OkBtn />
      </>
    )
  } else if (typeof footer === 'function') {
    footerContent = (footer as (params: { OkBtn: React.FC; CancelBtn: React.FC }) => ReactNode)({ OkBtn, CancelBtn })
  } else {
    footerContent = footer
  }

  const shouldRenderContent = !destroyOnClose || mounted

  // ── Build dialog panel ──
  let dialogPanel = (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      className={cx('ino-modal__content', className, classNames?.root)}
      style={contentDynamicStyle}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* Close button */}
      {closable && (
        <button
          type="button"
          className={cx('ino-modal__close-btn', classNames?.closeBtn)}
          style={styles?.closeBtn}
          onClick={(e) => onClose?.(e)}
        >
          {closeIcon ?? <CloseIcon />}
        </button>
      )}

      {/* Header */}
      {title != null && (
        <div className={cx('ino-modal__header', classNames?.header)} style={styles?.header}>
          <div className={cx('ino-modal__header-title', { 'ino-modal__header-title--closable': closable })}>
            {title}
          </div>
        </div>
      )}

      {/* Body */}
      {shouldRenderContent && (
        <div className={cx('ino-modal__body', classNames?.body)} style={styles?.body}>
          {loading ? <LoadingSkeleton /> : children}
        </div>
      )}

      {/* Footer */}
      {footerContent != null && (
        <div className={cx('ino-modal__footer', classNames?.footer)} style={styles?.footer}>
          {footerContent}
        </div>
      )}
    </div>
  )

  // Apply modalRender wrapper
  if (modalRender) {
    dialogPanel = modalRender(dialogPanel) as React.JSX.Element
  }

  // ── Render ──
  const portal = createPortal(
    <div className={wrapperClass} style={{ zIndex }}>
      {/* Mask */}
      {showMask && (
        <div
          className={maskClass}
          style={maskStyle}
          onClick={handleMaskClick}
        />
      )}

      {/* Scroll container */}
      <div
        className={scrollClass}
        onClick={(e) => {
          if (e.target === e.currentTarget && maskClosable) {
            onClose?.(e)
          }
        }}
      >
        {dialogPanel}
      </div>
    </div>,
    document.body,
  )

  return portal
}

// ============================================================================
// useModal Hook
// ============================================================================

interface ConfirmInstance {
  key: string
  type: ModalConfirmType
  config: ModalConfirmConfig
  open: boolean
  loading: boolean
}

let confirmIdCounter = 0

export function useModal(): [ModalHookApi, ReactNode] {
  const instancesRef = useRef<ConfirmInstance[]>([])
  const [, forceRender] = useState(0)

  const triggerRender = useCallback(() => {
    forceRender((c) => c + 1)
  }, [])

  const closeConfirm = useCallback((key: string) => {
    const dialog = instancesRef.current.find((d) => d.key === key)
    if (dialog) {
      dialog.open = false
      dialog.loading = false
      triggerRender()
    }
  }, [triggerRender])

  const removeConfirm = useCallback((key: string) => {
    instancesRef.current = instancesRef.current.filter((d) => d.key !== key)
    triggerRender()
  }, [triggerRender])

  const handleConfirmOk = useCallback((key: string) => {
    const dialog = instancesRef.current.find((d) => d.key === key)
    if (!dialog) return
    const result = dialog.config.onOk?.()
    if (result && typeof (result as Promise<void>).then === 'function') {
      dialog.loading = true
      triggerRender()
      ;(result as Promise<void>).then(
        () => closeConfirm(key),
        () => { dialog.loading = false; triggerRender() },
      )
    } else {
      closeConfirm(key)
    }
  }, [triggerRender, closeConfirm])

  const handleConfirmCancel = useCallback((key: string) => {
    const dialog = instancesRef.current.find((d) => d.key === key)
    dialog?.config.onCancel?.()
    closeConfirm(key)
  }, [closeConfirm])

  const openDialog = useCallback((type: ModalConfirmType, config: ModalConfirmConfig): ModalInstance => {
    const key = `j-modal-confirm-${++confirmIdCounter}`
    const instance: ConfirmInstance = { key, type, config, open: true, loading: false }
    instancesRef.current = [...instancesRef.current, instance]
    triggerRender()

    return {
      destroy: () => closeConfirm(key),
      update: (newConfig) => {
        const d = instancesRef.current.find((i) => i.key === key)
        if (d) {
          d.config = { ...d.config, ...newConfig }
          triggerRender()
        }
      },
    }
  }, [triggerRender, closeConfirm])

  const api: ModalHookApi = useMemo(() => ({
    confirm: (config) => openDialog('confirm', config),
    info:    (config) => openDialog('info', config),
    success: (config) => openDialog('success', config),
    warning: (config) => openDialog('warning', config),
    error:   (config) => openDialog('error', config),
    destroyAll: () => {
      instancesRef.current.forEach((d) => { d.open = false; d.loading = false })
      triggerRender()
    },
  }), [openDialog, triggerRender])

  const contextHolder = (
    <>
      {instancesRef.current.map((dialog) => {
        const { type, config } = dialog
        const iconColor = CONFIRM_COLORS[type]
        const icon = config.icon ?? CONFIRM_ICONS[type]
        const showCancel = type === 'confirm'
        const bordered = config.bordered !== false && type !== 'confirm'

        return (
          <Modal
            key={dialog.key}
            open={dialog.open}
            onClose={() => handleConfirmCancel(dialog.key)}
            onOk={() => handleConfirmOk(dialog.key)}
            confirmLoading={dialog.loading}
            closable={config.closable ?? false}
            maskClosable={config.maskClosable ?? false}
            keyboard={config.keyboard ?? true}
            centered={config.centered}
            width={config.width ?? '26rem'}
            zIndex={config.zIndex ?? 1000}
            okText={config.okText ?? 'OK'}
            cancelText={config.cancelText ?? 'Cancel'}
            okButtonProps={bordered ? { style: { backgroundColor: iconColor, borderColor: iconColor } } : undefined}
            footer={showCancel ? undefined : ({ OkBtn }) => <OkBtn />}
            afterOpenChange={(isOpen) => {
              if (!isOpen) removeConfirm(dialog.key)
            }}
            styles={{
              content: bordered ? { border: `1px solid ${iconColor}` } : undefined,
              body: { padding: '2rem 2rem 1.5rem' },
              footer: { borderTop: 'none' },
            }}
            className={config.className}
            style={config.style}
          >
            <div className="ino-modal__confirm-row">
              <span className="ino-modal__confirm-icon" style={{ color: iconColor }}>
                {icon}
              </span>
              <div>
                {config.title != null && (
                  <div className="ino-modal__confirm-title" style={{ marginBottom: config.content != null ? '0.5rem' : 0 }}>
                    {config.title}
                  </div>
                )}
                {config.content != null && (
                  <div className="ino-modal__confirm-content">
                    {config.content}
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )
      })}
    </>
  )

  return [api, contextHolder]
}
