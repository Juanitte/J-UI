import {
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { tokens } from '../../theme/tokens'
import { useThemeMode } from '../../theme'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import { generateQRMatrix, type ErrorCorrectionLevel } from './qr-encoder'
import './QRCode.css'

// ─── Types ──────────────────────────────────────────────────────────────────────

export type QRCodeType = 'canvas' | 'svg'
export type QRCodeErrorLevel = ErrorCorrectionLevel
export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'

export type QRCodeSemanticSlot = 'root' | 'canvas' | 'mask'
export type QRCodeClassNames = SemanticClassNames<QRCodeSemanticSlot>
export type QRCodeStyles = SemanticStyles<QRCodeSemanticSlot>

export interface StatusRenderInfo {
  status: QRCodeStatus
  locale: { expired: string; loading: string; scanned: string }
  onRefresh?: () => void
}

export interface QRCodeProps {
  value: string
  type?: QRCodeType
  icon?: string
  size?: number
  iconSize?: number | { width: number; height: number }
  color?: string
  bgColor?: string
  marginSize?: number
  bordered?: boolean
  errorLevel?: QRCodeErrorLevel
  status?: QRCodeStatus
  statusRender?: (info: StatusRenderInfo) => ReactNode
  onRefresh?: () => void
  className?: string
  style?: CSSProperties
  classNames?: QRCodeClassNames
  styles?: QRCodeStyles
}

// ─── Icons ──────────────────────────────────────────────────────────────────────

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.colorPrimary} strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'j-qrcode-spin 0.8s linear infinite' }}>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={tokens.colorSuccess} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function resolveIconSize(iconSize: number | { width: number; height: number }): { iw: number; ih: number } {
  if (typeof iconSize === 'number') return { iw: iconSize, ih: iconSize }
  return { iw: iconSize.width, ih: iconSize.height }
}

function resolveColor(value: string, el: HTMLElement): string {
  if (!value.startsWith('var(')) return value
  const prev = el.style.color
  el.style.color = value
  const resolved = getComputedStyle(el).color
  el.style.color = prev
  return resolved
}

// ─── QRCode Component ──────────────────────────────────────────────────────────

export function QRCode({
  value,
  type = 'canvas',
  icon,
  size = 160,
  iconSize = 40,
  color = tokens.colorText,
  bgColor = 'transparent',
  marginSize = 0,
  bordered = true,
  errorLevel = 'M',
  status = 'active',
  statusRender,
  onRefresh,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: QRCodeProps) {
  const matrix = useMemo(() => generateQRMatrix(value, errorLevel), [value, errorLevel])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const themeMode = useThemeMode()

  // ─── Canvas rendering ─────────────────────────────────────

  useEffect(() => {
    if (type !== 'canvas' || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1

    const moduleCount = matrix.length
    const totalModules = moduleCount + marginSize * 2
    const moduleSize = size / totalModules

    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const resolvedColor = resolveColor(color, canvas)
    const resolvedBg = bgColor !== 'transparent' ? resolveColor(bgColor, canvas) : 'transparent'
    const resolvedIconBg = resolvedBg !== 'transparent' ? resolvedBg : resolveColor(tokens.colorBg, canvas)

    ctx.clearRect(0, 0, size, size)
    if (resolvedBg !== 'transparent') {
      ctx.fillStyle = resolvedBg
      ctx.fillRect(0, 0, size, size)
    }

    ctx.fillStyle = resolvedColor
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c]) {
          const x = Math.floor((c + marginSize) * moduleSize)
          const y = Math.floor((r + marginSize) * moduleSize)
          const w = Math.floor((c + marginSize + 1) * moduleSize) - x
          const h = Math.floor((r + marginSize + 1) * moduleSize) - y
          ctx.fillRect(x, y, w, h)
        }
      }
    }

    if (icon) {
      let aborted = false
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        if (aborted) return
        const { iw, ih } = resolveIconSize(iconSize)
        const ix = (size - iw) / 2
        const iy = (size - ih) / 2
        ctx.fillStyle = resolvedIconBg
        ctx.fillRect(ix - 2, iy - 2, iw + 4, ih + 4)
        ctx.drawImage(img, ix, iy, iw, ih)
      }
      img.src = icon
      return () => { aborted = true }
    }
  }, [matrix, size, color, bgColor, marginSize, icon, iconSize, type, themeMode])

  // ─── SVG content ──────────────────────────────────────────

  const svgContent = useMemo(() => {
    if (type !== 'svg') return null

    const moduleCount = matrix.length
    const totalModules = moduleCount + marginSize * 2
    const moduleSize = size / totalModules

    const { iw, ih } = resolveIconSize(iconSize)
    const ix = (size - iw) / 2
    const iy = (size - ih) / 2

    const rects: ReactNode[] = []
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (matrix[r][c]) {
          const x = Math.floor((c + marginSize) * moduleSize)
          const y = Math.floor((r + marginSize) * moduleSize)
          const w = Math.floor((c + marginSize + 1) * moduleSize) - x
          const h = Math.floor((r + marginSize + 1) * moduleSize) - y
          rects.push(
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={color}
            />,
          )
        }
      }
    }

    return (
      <svg
        className={classNamesProp?.canvas}
        style={{ display: 'block', ...styles?.canvas }}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {bgColor !== 'transparent' && (
          <rect x={0} y={0} width={size} height={size} fill={bgColor} />
        )}
        {rects}
        {icon && (
          <>
            <rect x={ix - 2} y={iy - 2} width={iw + 4} height={ih + 4} fill={bgColor !== 'transparent' ? bgColor : tokens.colorBg} />
            <image href={icon} x={ix} y={iy} width={iw} height={ih} />
          </>
        )}
      </svg>
    )
  }, [matrix, size, color, bgColor, marginSize, icon, iconSize, type, classNamesProp?.canvas, styles?.canvas])

  // ─── Status overlay ───────────────────────────────────────

  const locale = { expired: 'QR code expired', loading: 'Loading...', scanned: 'Scanned' }

  let statusOverlay: ReactNode = null
  if (status !== 'active') {
    if (statusRender) {
      statusOverlay = (
        <div className={cx('ino-qrcode__mask', classNamesProp?.mask)} style={styles?.mask}>
          {statusRender({ status, locale, onRefresh })}
        </div>
      )
    } else if (status === 'loading') {
      statusOverlay = (
        <div className={cx('ino-qrcode__mask', classNamesProp?.mask)} style={styles?.mask}>
          <SpinnerIcon />
        </div>
      )
    } else if (status === 'expired') {
      statusOverlay = (
        <div className={cx('ino-qrcode__mask', classNamesProp?.mask)} style={styles?.mask}>
          <span className="ino-qrcode__expired-text">
            {locale.expired}
          </span>
          <button
            className="ino-qrcode__refresh-btn"
            onClick={onRefresh}
          >
            <RefreshIcon /> Refresh
          </button>
        </div>
      )
    } else if (status === 'scanned') {
      statusOverlay = (
        <div className={cx('ino-qrcode__mask', classNamesProp?.mask)} style={styles?.mask}>
          <CheckIcon />
          <span className="ino-qrcode__scanned-text" style={{ color: tokens.colorSuccess }}>
            {locale.scanned}
          </span>
        </div>
      )
    }
  }

  // ─── Render ───────────────────────────────────────────────

  return (
    <div
      className={cx(
        'ino-qrcode',
        { 'ino-qrcode--bordered': bordered },
        className,
        classNamesProp?.root,
      )}
      style={{ ...styles?.root, ...style }}
    >
      <div className="ino-qrcode__wrapper" style={{ width: size, height: size }}>
        {type === 'canvas' ? (
          <canvas
            ref={canvasRef}
            className={classNamesProp?.canvas}
            style={{
              display: 'block',
              width: size,
              height: size,
              ...styles?.canvas,
            }}
          />
        ) : (
          svgContent
        )}

        {statusOverlay}
      </div>
    </div>
  )
}
