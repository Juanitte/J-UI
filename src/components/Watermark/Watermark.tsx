import { type ReactNode, type CSSProperties, useRef, useState, useEffect } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export interface WatermarkFont {
  /** Text color. Supports rgba and CSS variables. Default: 'rgba(0,0,0,0.15)' */
  color?: string
  /** Font size in px. Default: 16 */
  fontSize?: number
  /** Font weight. Default: 'normal' */
  fontWeight?: 'normal' | 'lighter' | 'bold' | 'bolder' | number
  /** Font style. Default: 'normal' */
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
  /** Font family. Default: 'sans-serif' */
  fontFamily?: string
}

export type WatermarkSemanticSlot = 'root' | 'watermark'
export type WatermarkClassNames = SemanticClassNames<WatermarkSemanticSlot>
export type WatermarkStyles = SemanticStyles<WatermarkSemanticSlot>

export interface WatermarkProps {
  /** Text content. Array = multi-line. */
  content?: string | string[]
  /** Image URL. Takes priority over content when provided. */
  image?: string
  /** Rotation angle in degrees. Default: -22 */
  rotate?: number
  /** Width of each watermark tile content area in px. Default: 120 */
  width?: number
  /** Height of each watermark tile content area in px. Default: 64 */
  height?: number
  /** [gapX, gapY] spacing between tiles in px. Default: [100, 100] */
  gap?: [number, number]
  /** [offsetX, offsetY] background-position offset. Default: [gap[0]/2, gap[1]/2] */
  offset?: [number, number]
  /** z-index of the watermark overlay. Default: 9 */
  zIndex?: number
  /** Font configuration for text watermarks */
  font?: WatermarkFont
  /** Content to render underneath the watermark */
  children?: ReactNode

  className?: string
  style?: CSSProperties
  classNames?: WatermarkClassNames
  styles?: WatermarkStyles
}

// ============================================================================
// Helpers
// ============================================================================

/** Resolve a CSS variable to its computed color value (canvas can't read var()) */
function resolveColor(value: string, el: HTMLElement): string {
  if (!value.startsWith('var(')) return value
  const prev = el.style.color
  el.style.color = value
  const resolved = getComputedStyle(el).color
  el.style.color = prev
  return resolved
}

// ============================================================================
// Watermark Component
// ============================================================================

export function Watermark({
  content,
  image,
  rotate = -22,
  width = 120,
  height = 64,
  gap = [100, 100],
  offset,
  zIndex = 9,
  font = {},
  children,
  className,
  style,
  classNames,
  styles,
}: WatermarkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dataUrl, setDataUrl] = useState('')

  const [gapX, gapY] = gap
  const tileW = width + gapX
  const tileH = height + gapY
  const [offsetX, offsetY] = offset ?? [0, 0]

  const {
    color = tokens.colorText,
    fontSize = 16,
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontFamily = 'sans-serif',
  } = font

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    const dpr = window.devicePixelRatio || 1
    canvas.width = tileW * dpr
    canvas.height = tileH * dpr

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    // Move to content center, rotate, then draw centered on origin
    ctx.translate(tileW / 2, tileH / 2)
    ctx.rotate((rotate * Math.PI) / 180)

    if (image) {
      let aborted = false
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        if (aborted) return
        ctx.drawImage(img, -width / 2, -height / 2, width, height)
        setDataUrl(canvas.toDataURL())
      }
      img.onerror = () => {
        if (aborted) return
        setDataUrl('')
      }
      img.src = image
      return () => { aborted = true }
    }

    // Text rendering
    const lines = Array.isArray(content) ? content : content ? [content] : []
    if (lines.length === 0) {
      setDataUrl('')
      return
    }

    const resolvedColor = resolveColor(color, container)
    const lineHeight = fontSize * 1.5
    const totalHeight = lines.length * lineHeight

    // If the color has no alpha (e.g. resolved from a CSS variable), apply default opacity
    const hasAlpha = /rgba?\(.*,\s*[\d.]+\s*\)/.test(resolvedColor) && resolvedColor.includes('rgba')
    if (!hasAlpha) ctx.globalAlpha = 0.15

    ctx.font = `${fontStyle === 'none' ? 'normal' : fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.fillStyle = resolvedColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const startY = -((totalHeight - lineHeight) / 2)
    lines.forEach((line, i) => {
      ctx.fillText(line, 0, startY + i * lineHeight)
    })

    setDataUrl(canvas.toDataURL())
  }, [
    content, image, rotate, width, height, tileW, tileH,
    color, fontSize, fontWeight, fontStyle, fontFamily,
  ])

  return (
    <div
      ref={containerRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(
        { position: 'relative' },
        styles?.root,
        style,
      )}
    >
      {children}
      {dataUrl && (
        <div
          className={classNames?.watermark}
          style={mergeSemanticStyle(
            {
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex,
              backgroundImage: `url('${dataUrl}')`,
              backgroundRepeat: 'repeat',
              backgroundSize: `${tileW}px ${tileH}px`,
              backgroundPosition: `${offsetX}px ${offsetY}px`,
            },
            styles?.watermark,
          )}
        />
      )}
    </div>
  )
}
