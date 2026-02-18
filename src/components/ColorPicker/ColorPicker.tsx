import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import type { ReactNode, CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb'
export type ColorPickerSize = 'sm' | 'md' | 'lg'
export type ColorPickerTrigger = 'click' | 'hover'
export type ColorPickerPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
export type ColorPickerMode = 'single' | 'gradient'

export interface ColorPickerGradientStop {
  color: string
  percent: number
}

export type ColorPickerSemanticSlot = 'root' | 'trigger' | 'panel' | 'presets'
export type ColorPickerClassNames = SemanticClassNames<ColorPickerSemanticSlot>
export type ColorPickerStyles = SemanticStyles<ColorPickerSemanticSlot>

export interface ColorPickerPreset {
  label: ReactNode
  colors: string[]
}

export interface ColorPickerColor {
  h: number
  s: number
  b: number
  a: number
  toHexString: () => string
  toRgbString: () => string
  toHsbString: () => string
  toRgb: () => { r: number; g: number; b: number; a: number }
  toHsb: () => { h: number; s: number; b: number; a: number }
}

export interface ColorPickerProps {
  value?: string | ColorPickerColor | ColorPickerGradientStop[]
  defaultValue?: string | ColorPickerColor | ColorPickerGradientStop[]
  mode?: ColorPickerMode | ColorPickerMode[]
  onModeChange?: (mode: ColorPickerMode) => void
  format?: ColorPickerFormat
  defaultFormat?: ColorPickerFormat
  disabled?: boolean
  disabledAlpha?: boolean
  allowClear?: boolean
  showText?: boolean | ((color: ColorPickerColor) => ReactNode)
  trigger?: ColorPickerTrigger
  placement?: ColorPickerPlacement
  size?: ColorPickerSize
  open?: boolean
  presets?: ColorPickerPreset[]
  panelRender?: (panel: ReactNode) => ReactNode
  onChange?: (color: ColorPickerColor, hex: string) => void
  onChangeComplete?: (color: ColorPickerColor, hex: string) => void
  onGradientChange?: (stops: ColorPickerGradientStop[], css: string) => void
  onFormatChange?: (format: ColorPickerFormat) => void
  onOpenChange?: (open: boolean) => void
  onClear?: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: ColorPickerClassNames
  styles?: ColorPickerStyles
}

// ============================================================================
// Icons
// ============================================================================

function ClearIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="3" x2="9" y2="9" /><line x1="9" y1="3" x2="3" y2="9" />
    </svg>
  )
}

// ============================================================================
// Color Utilities
// ============================================================================

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function hsbToRgb(h: number, s: number, bri: number): { r: number; g: number; b: number } {
  const _s = s / 100
  const _b = bri / 100
  const k = (n: number) => (n + h / 60) % 6
  const f = (n: number) => _b * (1 - _s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  }
}

function rgbToHsb(r: number, g: number, b: number): { h: number; s: number; b: number } {
  const _r = r / 255, _g = g / 255, _b = b / 255
  const max = Math.max(_r, _g, _b), min = Math.min(_r, _g, _b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    switch (max) {
      case _r: h = ((_g - _b) / d + (_g < _b ? 6 : 0)) * 60; break
      case _g: h = ((_b - _r) / d + 2) * 60; break
      case _b: h = ((_r - _g) / d + 4) * 60; break
    }
  }
  return {
    h: Math.round(h),
    s: Math.round(max === 0 ? 0 : (d / max) * 100),
    b: Math.round(max * 100),
  }
}

function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2]
  if (h.length === 4) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2]+h[3]+h[3]
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
    a: h.length === 8 ? Math.round((parseInt(h.slice(6, 8), 16) / 255) * 100) / 100 : 1,
  }
}

function colorToHex(c: { h: number; s: number; b: number; a: number }): string {
  const { r, g, b } = hsbToRgb(c.h, c.s, c.b)
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
  if (c.a < 1) return hex + Math.round(c.a * 255).toString(16).padStart(2, '0')
  return hex
}

function colorToRgbString(c: { h: number; s: number; b: number; a: number }): string {
  const { r, g, b } = hsbToRgb(c.h, c.s, c.b)
  return c.a < 1 ? `rgba(${r}, ${g}, ${b}, ${Math.round(c.a * 100) / 100})` : `rgb(${r}, ${g}, ${b})`
}

function colorToHsbString(c: { h: number; s: number; b: number; a: number }): string {
  return c.a < 1
    ? `hsba(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(c.b)}%, ${Math.round(c.a * 100) / 100})`
    : `hsb(${Math.round(c.h)}, ${Math.round(c.s)}%, ${Math.round(c.b)}%)`
}

type HSBA = { h: number; s: number; b: number; a: number }

function createColor(val: HSBA): ColorPickerColor {
  return {
    h: val.h, s: val.s, b: val.b, a: val.a,
    toHexString() { return colorToHex(this) },
    toRgbString() { return colorToRgbString(this) },
    toHsbString() { return colorToHsbString(this) },
    toRgb() { const rgb = hsbToRgb(this.h, this.s, this.b); return { ...rgb, a: this.a } },
    toHsb() { return { h: this.h, s: this.s, b: this.b, a: this.a } },
  }
}

function parseColor(input: string | ColorPickerColor | undefined): HSBA {
  if (!input) return { h: 0, s: 100, b: 100, a: 1 }
  if (typeof input === 'object' && 'h' in input) return { h: input.h, s: input.s, b: input.b, a: input.a }
  const str = String(input).trim()
  if (str.startsWith('#')) {
    const rgba = hexToRgba(str)
    const hsb = rgbToHsb(rgba.r, rgba.g, rgba.b)
    return { ...hsb, a: rgba.a }
  }
  const rgbMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/)
  if (rgbMatch) {
    const hsb = rgbToHsb(+rgbMatch[1], +rgbMatch[2], +rgbMatch[3])
    return { ...hsb, a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1 }
  }
  const hsbMatch = str.match(/hsba?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*(?:,\s*([\d.]+))?\s*\)/)
  if (hsbMatch) {
    return { h: +hsbMatch[1], s: +hsbMatch[2], b: +hsbMatch[3], a: hsbMatch[4] !== undefined ? parseFloat(hsbMatch[4]) : 1 }
  }
  if (/^[0-9a-f]{3,8}$/i.test(str)) return parseColor('#' + str)
  return { h: 0, s: 100, b: 100, a: 1 }
}

function colorsEqual(a: HSBA, b: HSBA): boolean {
  return a.h === b.h && a.s === b.s && a.b === b.b && a.a === b.a
}

// ============================================================================
// Gradient Utilities
// ============================================================================

interface GradientStopInternal {
  color: HSBA
  percent: number
}

function isGradientValue(v: unknown): v is ColorPickerGradientStop[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null && 'percent' in v[0]
}

function parseGradientStops(stops: ColorPickerGradientStop[]): GradientStopInternal[] {
  return stops.map(s => ({ color: parseColor(s.color), percent: s.percent }))
}

function gradientToCss(stops: GradientStopInternal[], angle: number): string {
  const sorted = [...stops].sort((a, b) => a.percent - b.percent)
  const stopsStr = sorted.map(s => `${colorToHex(s.color)} ${s.percent}%`).join(', ')
  return `linear-gradient(${angle}deg, ${stopsStr})`
}

function stopsToExport(stops: GradientStopInternal[]): ColorPickerGradientStop[] {
  return stops.map(s => ({ color: colorToHex(s.color), percent: s.percent }))
}

function interpolateGradientColor(stops: GradientStopInternal[], percent: number): HSBA {
  const sorted = [...stops].sort((a, b) => a.percent - b.percent)
  if (sorted.length === 0) return { h: 0, s: 100, b: 100, a: 1 }
  if (percent <= sorted[0].percent) return { ...sorted[0].color }
  if (percent >= sorted[sorted.length - 1].percent) return { ...sorted[sorted.length - 1].color }
  let left = sorted[0], right = sorted[sorted.length - 1]
  for (let i = 0; i < sorted.length - 1; i++) {
    if (percent >= sorted[i].percent && percent <= sorted[i + 1].percent) {
      left = sorted[i]; right = sorted[i + 1]; break
    }
  }
  const t = right.percent === left.percent ? 0 : (percent - left.percent) / (right.percent - left.percent)
  return {
    h: Math.round(left.color.h + (right.color.h - left.color.h) * t),
    s: Math.round(left.color.s + (right.color.s - left.color.s) * t),
    b: Math.round(left.color.b + (right.color.b - left.color.b) * t),
    a: Math.round((left.color.a + (right.color.a - left.color.a) * t) * 100) / 100,
  }
}

// ============================================================================
// useDrag hook — shared by SB picker and sliders
// ============================================================================

function useDrag(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onDrag: (x: number, y: number) => void,
  onDragEnd: () => void,
) {
  const onDragRef = useRef(onDrag)
  const onDragEndRef = useRef(onDragEnd)
  onDragRef.current = onDrag
  onDragEndRef.current = onDragEnd
  const isDragging = useRef(false)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      e.preventDefault()
      const rect = containerRef.current.getBoundingClientRect()
      onDragRef.current(
        clamp((e.clientX - rect.left) / rect.width, 0, 1),
        clamp((e.clientY - rect.top) / rect.height, 0, 1),
      )
    }
    const handleUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      onDragEndRef.current()
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [containerRef])

  return (e: ReactMouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    onDragRef.current(
      clamp((e.clientX - rect.left) / rect.width, 0, 1),
      clamp((e.clientY - rect.top) / rect.height, 0, 1),
    )
  }
}

// ============================================================================
// Internal: Saturation-Brightness Picker
// ============================================================================

function SBPicker({ hue, saturation, brightness, onChange, onDragEnd }: {
  hue: number; saturation: number; brightness: number
  onChange: (s: number, b: number) => void; onDragEnd: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseDown = useDrag(
    ref,
    (x, y) => onChange(Math.round(x * 100), Math.round((1 - y) * 100)),
    onDragEnd,
  )
  const pureColor = `hsl(${hue}, 100%, 50%)`

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative', width: '100%', height: 150, borderRadius: 4,
        cursor: 'crosshair', overflow: 'hidden',
        background: `linear-gradient(to bottom, transparent 0%, #000 100%), linear-gradient(to right, #fff 0%, ${pureColor} 100%)`,
      }}
    >
      <div style={{
        position: 'absolute',
        left: `${saturation}%`, top: `${100 - brightness}%`,
        width: 12, height: 12, borderRadius: '50%',
        border: '2px solid #fff', boxShadow: '0 0 2px rgba(0,0,0,0.4)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />
    </div>
  )
}

// ============================================================================
// Internal: Hue Slider
// ============================================================================

function HueBar({ hue, onChange, onDragEnd }: {
  hue: number; onChange: (h: number) => void; onDragEnd: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseDown = useDrag(ref, (x) => onChange(Math.round(x * 360)), onDragEnd)

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        position: 'relative', width: '100%', height: 10, borderRadius: 5, cursor: 'pointer',
        background: 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
      }}
    >
      <div style={{
        position: 'absolute', left: `${(hue / 360) * 100}%`, top: '50%',
        width: 12, height: 12, borderRadius: '50%',
        border: '2px solid #fff', boxShadow: '0 0 2px rgba(0,0,0,0.3)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
      }} />
    </div>
  )
}

// ============================================================================
// Internal: Alpha Slider
// ============================================================================

function AlphaBar({ color, alpha, onChange, onDragEnd }: {
  color: HSBA; alpha: number; onChange: (a: number) => void; onDragEnd: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseDown = useDrag(ref, (x) => onChange(Math.round(x * 100) / 100), onDragEnd)
  const { r, g, b } = hsbToRgb(color.h, color.s, color.b)
  const solid = `rgb(${r}, ${g}, ${b})`

  const checkerBg = [
    'linear-gradient(45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(-45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(45deg, transparent 75%, #ccc 75%)',
    'linear-gradient(-45deg, transparent 75%, #ccc 75%)',
  ].join(', ')

  return (
    <div style={{ position: 'relative', width: '100%', height: 10, borderRadius: 5 }}>
      {/* Checkered background */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 5,
        backgroundImage: checkerBg,
        backgroundSize: '8px 8px',
        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
      }} />
      {/* Color gradient overlay */}
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute', inset: 0, borderRadius: 5, cursor: 'pointer',
          background: `linear-gradient(to right, transparent 0%, ${solid} 100%)`,
        }}
      >
        <div style={{
          position: 'absolute', left: `${alpha * 100}%`, top: '50%',
          width: 12, height: 12, borderRadius: '50%',
          border: '2px solid #fff', boxShadow: '0 0 2px rgba(0,0,0,0.3)',
          transform: 'translate(-50%, -50%)', pointerEvents: 'none',
          backgroundColor: solid,
        }} />
      </div>
    </div>
  )
}

// ============================================================================
// Internal: Format Inputs
// ============================================================================

function FormatInputs({ color, format, disabledAlpha, onColorChange, onFormatChange }: {
  color: HSBA; format: ColorPickerFormat; disabledAlpha: boolean
  onColorChange: (c: HSBA) => void; onFormatChange: (f: ColorPickerFormat) => void
}) {
  // Local hex state for controlled editing
  const [hexLocal, setHexLocal] = useState(colorToHex(color).toUpperCase())
  const prevColorRef = useRef(color)
  if (!colorsEqual(prevColorRef.current, color)) {
    prevColorRef.current = color
    setHexLocal(colorToHex(color).toUpperCase())
  }

  const formats: ColorPickerFormat[] = ['hex', 'rgb', 'hsb']

  const commitHex = () => {
    let hex = hexLocal.startsWith('#') ? hexLocal : '#' + hexLocal
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      const rgba = hexToRgba(hex)
      const hsb = rgbToHsb(rgba.r, rgba.g, rgba.b)
      onColorChange({ ...hsb, a: color.a })
    } else if (/^#[0-9a-f]{8}$/i.test(hex)) {
      const rgba = hexToRgba(hex)
      const hsb = rgbToHsb(rgba.r, rgba.g, rgba.b)
      onColorChange({ ...hsb, a: rgba.a })
    } else {
      setHexLocal(colorToHex(color).toUpperCase())
    }
  }

  const { r, g, b: blue } = hsbToRgb(color.h, color.s, color.b)

  const handleRgb = (comp: 'r' | 'g' | 'b', val: number) => {
    if (isNaN(val)) return
    const nr = comp === 'r' ? clamp(val, 0, 255) : r
    const ng = comp === 'g' ? clamp(val, 0, 255) : g
    const nb = comp === 'b' ? clamp(val, 0, 255) : blue
    const hsb = rgbToHsb(nr, ng, nb)
    onColorChange({ ...hsb, a: color.a })
  }

  const handleHsb = (comp: 'h' | 's' | 'b', val: number) => {
    if (isNaN(val)) return
    onColorChange({
      h: comp === 'h' ? clamp(val, 0, 360) : color.h,
      s: comp === 's' ? clamp(val, 0, 100) : color.s,
      b: comp === 'b' ? clamp(val, 0, 100) : color.b,
      a: color.a,
    })
  }

  const handleAlpha = (val: number) => {
    if (isNaN(val)) return
    onColorChange({ ...color, a: clamp(val, 0, 100) / 100 })
  }

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const inputBase: CSSProperties = {
    height: '1.5rem', border: `1px solid ${tokens.colorBorder}`, borderRadius: '0.25rem',
    padding: '0 0.25rem', fontSize: '0.75rem', fontFamily: 'monospace', textAlign: 'center',
    outline: 'none', color: tokens.colorText, backgroundColor: 'transparent',
    flex: 1, minWidth: 0,
  }

  return (
    <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
      <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            height: '1.5rem', padding: '0 0.25rem 0 0.375rem', border: `1px solid ${tokens.colorBorder}`,
            borderRadius: '0.25rem', backgroundColor: 'transparent', color: tokens.colorText,
            cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 600, display: 'flex',
            alignItems: 'center', gap: '0.125rem', fontFamily: 'inherit', outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorderHover }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorder }}
        >
          {format.toUpperCase()}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropdownOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s ease' }}>
            <polyline points="3 4 5 6 7 4" />
          </svg>
        </button>
        {dropdownOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '0.125rem', zIndex: 10,
            minWidth: '100%', padding: '0.125rem', borderRadius: '0.375rem',
            border: `1px solid ${tokens.colorBorder}`,
            backgroundColor: tokens.colorBg,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            {formats.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => { onFormatChange(f); setDropdownOpen(false) }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                style={{
                  display: 'block', width: '100%', padding: '0.25rem 0.5rem', border: 'none',
                  borderRadius: '0.25rem', backgroundColor: 'transparent',
                  color: f === format ? tokens.colorPrimary : tokens.colorText,
                  cursor: 'pointer', fontSize: '0.6875rem', fontWeight: f === format ? 700 : 500,
                  fontFamily: 'inherit', textAlign: 'left',
                  transition: 'background-color 0.1s ease',
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {format === 'hex' && (
        <input
          style={{ ...inputBase, fontFamily: 'monospace' }}
          value={hexLocal}
          onChange={(e) => setHexLocal(e.target.value)}
          onBlur={commitHex}
          onKeyDown={(e) => { if (e.key === 'Enter') commitHex() }}
        />
      )}

      {format === 'rgb' && (<>
        <input style={inputBase} inputMode="numeric" value={r} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleRgb('r', v === '' ? 0 : Math.min(+v, 255)) }} />
        <input style={inputBase} inputMode="numeric" value={g} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleRgb('g', v === '' ? 0 : Math.min(+v, 255)) }} />
        <input style={inputBase} inputMode="numeric" value={blue} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleRgb('b', v === '' ? 0 : Math.min(+v, 255)) }} />
      </>)}

      {format === 'hsb' && (<>
        <input style={inputBase} inputMode="numeric" value={Math.round(color.h)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleHsb('h', v === '' ? 0 : Math.min(+v, 360)) }} />
        <input style={inputBase} inputMode="numeric" value={Math.round(color.s)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleHsb('s', v === '' ? 0 : Math.min(+v, 100)) }} />
        <input style={inputBase} inputMode="numeric" value={Math.round(color.b)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleHsb('b', v === '' ? 0 : Math.min(+v, 100)) }} />
      </>)}

      {!disabledAlpha && (<>
        <input
          style={{ ...inputBase, width: '2.25rem', flex: 'none' }}
          inputMode="numeric"
          value={Math.round(color.a * 100)}
          onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) handleAlpha(v === '' ? 0 : Math.min(+v, 100)) }}
        />
        <span style={{ fontSize: '0.6875rem', color: tokens.colorTextMuted, flexShrink: 0 }}>%</span>
      </>)}
    </div>
  )
}

// ============================================================================
// Internal: Presets Panel
// ============================================================================

function PresetsPanel({ presets, onSelect }: {
  presets: ColorPickerPreset[]; onSelect: (color: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {presets.map((preset, i) => (
        <div key={i}>
          {preset.label && (
            <div style={{ fontSize: '0.75rem', color: tokens.colorTextMuted, marginBottom: '0.25rem', fontWeight: 500 }}>
              {preset.label}
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {preset.colors.map((c, j) => (
              <button
                key={j}
                type="button"
                onClick={() => onSelect(c)}
                style={{
                  width: '1.25rem', height: '1.25rem', borderRadius: '0.25rem', padding: 0, cursor: 'pointer',
                  border: `1px solid ${tokens.colorBorder}`, backgroundColor: c,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Internal: Gradient Bar
// ============================================================================

function GradientBar({ stops, activeIndex, angle, onSelectStop, onMoveStop, onAddStop, onRemoveStop, onAngleChange, onDragEnd }: {
  stops: GradientStopInternal[]
  activeIndex: number
  angle: number
  onSelectStop: (index: number) => void
  onMoveStop: (index: number, percent: number) => void
  onAddStop: (percent: number) => void
  onRemoveStop: (index: number) => void
  onAngleChange: (angle: number) => void
  onDragEnd: () => void
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef<number | null>(null)
  const onMoveStopRef = useRef(onMoveStop)
  onMoveStopRef.current = onMoveStop
  const onDragEndRef = useRef(onDragEnd)
  onDragEndRef.current = onDragEnd

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (draggingRef.current === null || !barRef.current) return
      e.preventDefault()
      const rect = barRef.current.getBoundingClientRect()
      const percent = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
      onMoveStopRef.current(draggingRef.current, Math.round(percent))
    }
    const handleUp = () => {
      if (draggingRef.current !== null) {
        draggingRef.current = null
        onDragEndRef.current()
      }
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
  }, [])

  const handleBarClick = (e: ReactMouseEvent) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const percent = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
    onAddStop(Math.round(percent))
  }

  const handleStopMouseDown = (e: ReactMouseEvent, index: number) => {
    e.stopPropagation()
    e.preventDefault()
    draggingRef.current = index
    onSelectStop(index)
  }

  const sorted = [...stops].sort((a, b) => a.percent - b.percent)
  const gradientCss = sorted.map(s => `${colorToHex(s.color)} ${s.percent}%`).join(', ')

  const checkerBg = [
    'linear-gradient(45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(-45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(45deg, transparent 75%, #ccc 75%)',
    'linear-gradient(-45deg, transparent 75%, #ccc 75%)',
  ].join(', ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Gradient bar */}
      <div
        ref={barRef}
        onMouseDown={handleBarClick}
        style={{ position: 'relative', height: 12, borderRadius: 6, cursor: 'pointer', marginTop: '0.25rem', marginBottom: '0.25rem' }}
      >
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 6,
          backgroundImage: checkerBg,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 6,
          background: `linear-gradient(to right, ${gradientCss})`,
        }} />
        {stops.map((stop, i) => (
          <div
            key={i}
            onMouseDown={(e) => handleStopMouseDown(e, i)}
            style={{
              position: 'absolute',
              left: `${stop.percent}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 14, height: 14, borderRadius: '50%',
              border: i === activeIndex ? `2px solid ${tokens.colorPrimary}` : '2px solid #fff',
              boxShadow: '0 0 3px rgba(0,0,0,0.3)',
              backgroundColor: colorToHex(stop.color),
              cursor: 'grab', zIndex: i === activeIndex ? 2 : 1,
            }}
          />
        ))}
      </div>
      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <span style={{ fontSize: '0.6875rem', color: tokens.colorTextMuted, flexShrink: 0 }}>Angle</span>
        <input
          type="number" min={0} max={360} value={angle}
          onChange={(e) => onAngleChange(clamp(+e.target.value, 0, 360))}
          style={{
            height: '1.5rem', width: '3rem', border: `1px solid ${tokens.colorBorder}`, borderRadius: '0.25rem',
            padding: '0 0.25rem', fontSize: '0.75rem', fontFamily: 'monospace', textAlign: 'center',
            outline: 'none', color: tokens.colorText, backgroundColor: 'transparent',
          }}
        />
        <span style={{ fontSize: '0.6875rem', color: tokens.colorTextMuted }}>°</span>
        <div style={{ flex: 1 }} />
        {stops.length > 2 && (
          <button
            type="button"
            onClick={() => onRemoveStop(activeIndex)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '1.5rem', height: '1.5rem', padding: 0, border: `1px solid ${tokens.colorBorder}`,
              borderRadius: '0.25rem', backgroundColor: 'transparent', cursor: 'pointer',
              color: tokens.colorTextMuted,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ff4d4f' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted }}
          >
            <ClearIcon />
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Internal: Mode Tabs
// ============================================================================

function ModeTabs({ modes, activeMode, onModeChange }: {
  modes: ColorPickerMode[]
  activeMode: ColorPickerMode
  onModeChange: (m: ColorPickerMode) => void
}) {
  return (
    <div style={{ display: 'flex', borderRadius: '0.25rem', overflow: 'hidden', border: `1px solid ${tokens.colorBorder}` }}>
      {modes.map(m => (
        <button
          key={m}
          type="button"
          onClick={() => onModeChange(m)}
          style={{
            flex: 1, padding: '0.25rem 0', border: 'none',
            backgroundColor: m === activeMode ? tokens.colorPrimary : 'transparent',
            color: m === activeMode ? '#fff' : tokens.colorText,
            cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 600, fontFamily: 'inherit',
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
        >
          {m === 'single' ? 'Single' : 'Gradient'}
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// ColorPicker Component
// ============================================================================

const sizeConfig: Record<ColorPickerSize, { height: string; swatch: number; radius: string; fontSize: string; paddingText: string; paddingIcon: string }> = {
  sm: { height: '1.5rem', swatch: 16, radius: '0.25rem', fontSize: '0.75rem', paddingText: '0 0.6rem 0 0.375rem', paddingIcon: '0.1875rem' },
  md: { height: '2rem', swatch: 20, radius: '0.375rem', fontSize: '0.8125rem', paddingText: '0 0.8rem 0 0.5rem', paddingIcon: '0.3125rem' },
  lg: { height: '2.5rem', swatch: 28, radius: '0.5rem', fontSize: '0.875rem', paddingText: '0 1rem 0 0.625rem', paddingIcon: '0.3125rem' },
}

export function ColorPicker({
  value: controlledValue,
  defaultValue = '#1677ff',
  mode,
  onModeChange,
  format: controlledFormat,
  defaultFormat = 'hex',
  disabled = false,
  disabledAlpha = false,
  allowClear = false,
  showText,
  trigger = 'click',
  placement = 'bottomLeft',
  size = 'md',
  open: controlledOpen,
  presets,
  panelRender,
  onChange,
  onChangeComplete,
  onGradientChange,
  onFormatChange,
  onOpenChange,
  onClear,
  children,
  className,
  style,
  classNames,
  styles,
}: ColorPickerProps) {
  // ---- Mode ----
  // mode="gradient" → show tabs (Single | Gradient), default to Gradient
  // mode="single" or undefined → single only, no tabs
  // mode={['single','gradient']} → show tabs, default to first
  const modeArray: ColorPickerMode[] = !mode ? ['single']
    : typeof mode === 'string'
      ? (mode === 'gradient' ? ['single', 'gradient'] : ['single'])
      : mode
  const showModeTabs = modeArray.length > 1
  const defaultActiveMode: ColorPickerMode =
    typeof mode === 'string' && mode === 'gradient' ? 'gradient' : modeArray[0]
  const [internalActiveMode, setInternalActiveMode] = useState<ColorPickerMode>(defaultActiveMode)
  const activeMode = modeArray.includes(internalActiveMode) ? internalActiveMode : modeArray[0]
  const isGradientMode = activeMode === 'gradient'

  // ---- Single color state ----
  const isValueControlled = controlledValue !== undefined
  const isOpenControlled = controlledOpen !== undefined
  const isFormatControlled = controlledFormat !== undefined

  const initVal = controlledValue ?? defaultValue
  const [internalColor, setInternalColor] = useState<HSBA>(() =>
    isGradientValue(initVal) ? { h: 217, s: 91, b: 100, a: 1 } : parseColor(initVal as any)
  )
  const [internalOpen, setInternalOpen] = useState(false)
  const [internalFormat, setInternalFormat] = useState<ColorPickerFormat>(controlledFormat ?? defaultFormat)
  const [animating, setAnimating] = useState(false)
  const [cleared, setCleared] = useState(false)

  const isGradientVal = isGradientValue(controlledValue)
  const isGradientControlled = isValueControlled && isGradientVal
  const currentColor = (isValueControlled && !isGradientVal) ? parseColor(controlledValue as any) : internalColor
  const isOpen = isOpenControlled ? controlledOpen : internalOpen
  const currentFormat = isFormatControlled ? controlledFormat : internalFormat

  // ---- Gradient state ----
  const [internalGradientStops, setInternalGradientStops] = useState<GradientStopInternal[]>(() => {
    if (isGradientValue(initVal)) return parseGradientStops(initVal)
    const base = parseColor(initVal as any)
    return [
      { color: { ...base }, percent: 0 },
      { color: { h: 0, s: 0, b: 100, a: 1 }, percent: 100 },
    ]
  })
  const [gradientAngle, setGradientAngle] = useState(90)
  const [activeStopIndex, setActiveStopIndex] = useState(0)
  const cachedGradientRef = useRef<GradientStopInternal[] | null>(null)

  const currentGradientStops = isGradientControlled
    ? parseGradientStops(controlledValue as ColorPickerGradientStop[])
    : internalGradientStops
  const safeStopIndex = Math.min(activeStopIndex, currentGradientStops.length - 1)

  // Editing color: active stop in gradient mode, single color otherwise
  const editingColor = isGradientMode
    ? (currentGradientStops[safeStopIndex]?.color ?? { h: 0, s: 100, b: 100, a: 1 })
    : currentColor

  // Stable refs for callbacks
  const gradientStopsRef = useRef(currentGradientStops)
  gradientStopsRef.current = currentGradientStops
  const gradientAngleRef = useRef(gradientAngle)
  gradientAngleRef.current = gradientAngle
  const activeStopIndexRef = useRef(safeStopIndex)
  activeStopIndexRef.current = safeStopIndex

  // ---- Smart flip ----
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)

  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<number | null>(null)

  // ---- Open animation ----
  useEffect(() => {
    if (isOpen) {
      setAnimating(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true))
      })
    }
  }, [isOpen])

  // ---- Close on outside click ----
  useEffect(() => {
    if (!isOpen) return
    const handleDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      if (panelRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // ---- Cleanup hover timeout ----
  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current) }
  }, [])

  // ---- Auto-flip: measure real DOM and flip if it overflows ----
  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current || !rootRef.current) return
    const panelRect = panelRef.current.getBoundingClientRect()
    const rootRect = rootRef.current.getBoundingClientRect()
    const spaceAbove = rootRect.top
    const spaceBelow = window.innerHeight - rootRect.bottom
    const isTop = resolvedPlacement.startsWith('top')

    if (!isTop && panelRect.bottom > window.innerHeight) {
      if (spaceAbove > spaceBelow) {
        setResolvedPlacement(p => p.replace('bottom', 'top') as ColorPickerPlacement)
      }
    } else if (isTop && panelRect.top < 0) {
      if (spaceBelow > spaceAbove) {
        setResolvedPlacement(p => p.replace('top', 'bottom') as ColorPickerPlacement)
      }
    }
  })

  // ---- Helpers ----
  const setOpen = useCallback((v: boolean) => {
    if (disabled) return
    // Set initial direction from placement prop; useLayoutEffect will auto-correct if it overflows
    if (v) setResolvedPlacement(placement)
    if (!isOpenControlled) setInternalOpen(v)
    onOpenChange?.(v)
  }, [disabled, isOpenControlled, onOpenChange, placement])

  const updateColor = useCallback((c: HSBA) => {
    setCleared(false)
    if (isGradientMode) {
      const stops = gradientStopsRef.current
      const idx = activeStopIndexRef.current
      const newStops = stops.map((s, i) => i === idx ? { ...s, color: c } : s)
      if (!isGradientControlled) setInternalGradientStops(newStops)
      onGradientChange?.(stopsToExport(newStops), gradientToCss(newStops, gradientAngleRef.current))
      return
    }
    if (!isValueControlled) setInternalColor(c)
    const co = createColor(c)
    onChange?.(co, co.toHexString())
  }, [isGradientMode, isGradientControlled, isValueControlled, onChange, onGradientChange])

  const fireComplete = useCallback(() => {
    if (isGradientMode) {
      const stops = gradientStopsRef.current
      onGradientChange?.(stopsToExport(stops), gradientToCss(stops, gradientAngleRef.current))
      return
    }
    const c = isValueControlled ? parseColor(controlledValue as string | ColorPickerColor | undefined) : internalColor
    const co = createColor(c)
    onChangeComplete?.(co, co.toHexString())
  }, [isGradientMode, isValueControlled, controlledValue, internalColor, onChangeComplete, onGradientChange])

  const handleFormatChange = useCallback((f: ColorPickerFormat) => {
    if (!isFormatControlled) setInternalFormat(f)
    onFormatChange?.(f)
  }, [isFormatControlled, onFormatChange])

  const handlePresetSelect = useCallback((c: string) => {
    updateColor(parseColor(c))
    fireComplete()
  }, [updateColor, fireComplete])

  const handleClear = useCallback(() => {
    setCleared(true)
    onClear?.()
  }, [onClear])

  // ---- Mode change ----
  const handleModeChange = useCallback((newMode: ColorPickerMode) => {
    if (newMode === activeMode) return
    if (newMode === 'gradient') {
      if (cachedGradientRef.current) {
        setInternalGradientStops(cachedGradientRef.current)
      } else {
        const cc = isValueControlled && !isGradientVal ? parseColor(controlledValue as any) : internalColor
        setInternalGradientStops([
          { color: { ...cc }, percent: 0 },
          { color: { h: 0, s: 0, b: 100, a: 1 }, percent: 100 },
        ])
      }
      setActiveStopIndex(0)
    } else {
      cachedGradientRef.current = [...internalGradientStops]
      const firstColor = internalGradientStops[0]?.color ?? { h: 0, s: 100, b: 100, a: 1 }
      if (!isValueControlled) setInternalColor(firstColor)
    }
    setInternalActiveMode(newMode)
    onModeChange?.(newMode)
  }, [activeMode, isValueControlled, isGradientVal, controlledValue, internalColor, internalGradientStops, onModeChange])

  // ---- Gradient handlers ----
  const handleGradientSelectStop = useCallback((index: number) => {
    setActiveStopIndex(index)
  }, [])

  const handleGradientMoveStop = useCallback((index: number, percent: number) => {
    const stops = gradientStopsRef.current
    const newStops = stops.map((s, i) => i === index ? { ...s, percent } : s)
    if (!isGradientControlled) setInternalGradientStops(newStops)
    onGradientChange?.(stopsToExport(newStops), gradientToCss(newStops, gradientAngleRef.current))
  }, [isGradientControlled, onGradientChange])

  const handleGradientAddStop = useCallback((percent: number) => {
    const stops = gradientStopsRef.current
    const newColor = interpolateGradientColor(stops, percent)
    const newStops = [...stops, { color: newColor, percent }]
    if (!isGradientControlled) setInternalGradientStops(newStops)
    setActiveStopIndex(newStops.length - 1)
    onGradientChange?.(stopsToExport(newStops), gradientToCss(newStops, gradientAngleRef.current))
  }, [isGradientControlled, onGradientChange])

  const handleGradientRemoveStop = useCallback((index: number) => {
    const stops = gradientStopsRef.current
    if (stops.length <= 2) return
    const newStops = stops.filter((_, i) => i !== index)
    if (!isGradientControlled) setInternalGradientStops(newStops)
    setActiveStopIndex(prev => Math.min(prev, newStops.length - 1))
    onGradientChange?.(stopsToExport(newStops), gradientToCss(newStops, gradientAngleRef.current))
  }, [isGradientControlled, onGradientChange])

  const handleGradientAngleChange = useCallback((a: number) => {
    setGradientAngle(a)
    const stops = gradientStopsRef.current
    onGradientChange?.(stopsToExport(stops), gradientToCss(stops, a))
  }, [onGradientChange])

  // ---- Trigger handlers ----
  const handleTriggerClick = () => {
    if (trigger === 'click') setOpen(!isOpen)
  }

  const handleMouseEnter = () => {
    if (trigger !== 'hover' || disabled) return
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    if (trigger !== 'hover') return
    hoverTimeoutRef.current = window.setTimeout(() => setOpen(false), 200)
  }

  // ---- Placement (smart flip) ----
  const isTop = resolvedPlacement.startsWith('top')
  const isRight = resolvedPlacement.endsWith('Right')

  const panelPositionStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1050,
    ...(isTop ? { bottom: '100%', marginBottom: '0.25rem' } : { top: '100%', marginTop: '0.25rem' }),
    ...(isRight ? { right: 0 } : { left: 0 }),
  }

  // ---- Computed values ----
  const sc = sizeConfig[size]
  const { r, g, b: blue } = hsbToRgb(currentColor.h, currentColor.s, currentColor.b)
  const solidColor = `rgba(${r}, ${g}, ${blue}, ${currentColor.a})`
  const colorObj = createColor(currentColor)

  const { r: editR, g: editG, b: editBlue } = hsbToRgb(editingColor.h, editingColor.s, editingColor.b)
  const editingSolidColor = `rgba(${editR}, ${editG}, ${editBlue}, ${editingColor.a})`

  const gradientCssString = isGradientMode ? gradientToCss(currentGradientStops, gradientAngle) : ''

  // ---- Show text ----
  let textContent: ReactNode = null
  if (showText) {
    if (isGradientMode) {
      if (typeof showText === 'function') {
        textContent = showText(createColor(editingColor))
      } else {
        textContent = `${gradientAngle}°`
      }
    } else {
      if (typeof showText === 'function') {
        textContent = showText(colorObj)
      } else {
        switch (currentFormat) {
          case 'hex': textContent = colorObj.toHexString().toUpperCase(); break
          case 'rgb': textContent = colorObj.toRgbString(); break
          case 'hsb': textContent = colorObj.toHsbString(); break
        }
      }
    }
  }

  // ---- Build panel content ----
  const panelContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {showModeTabs && (
        <ModeTabs modes={modeArray} activeMode={activeMode} onModeChange={handleModeChange} />
      )}
      {isGradientMode && (
        <GradientBar
          stops={currentGradientStops}
          activeIndex={safeStopIndex}
          angle={gradientAngle}
          onSelectStop={handleGradientSelectStop}
          onMoveStop={handleGradientMoveStop}
          onAddStop={handleGradientAddStop}
          onRemoveStop={handleGradientRemoveStop}
          onAngleChange={handleGradientAngleChange}
          onDragEnd={fireComplete}
        />
      )}
      <SBPicker
        hue={editingColor.h} saturation={editingColor.s} brightness={editingColor.b}
        onChange={(s, b) => updateColor({ ...editingColor, s, b })}
        onDragEnd={fireComplete}
      />
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{
          width: '1.75rem', height: '1.75rem', borderRadius: '50%', flexShrink: 0,
          border: `1px solid ${tokens.colorBorder}`,
          backgroundColor: editingSolidColor,
        }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <HueBar hue={editingColor.h} onChange={(h) => updateColor({ ...editingColor, h })} onDragEnd={fireComplete} />
          {!disabledAlpha && (
            <AlphaBar color={editingColor} alpha={editingColor.a} onChange={(a) => updateColor({ ...editingColor, a })} onDragEnd={fireComplete} />
          )}
        </div>
      </div>
      <FormatInputs
        color={editingColor}
        format={currentFormat}
        disabledAlpha={disabledAlpha}
        onColorChange={(c) => { updateColor(c); fireComplete() }}
        onFormatChange={handleFormatChange}
      />
      {presets && presets.length > 0 && (
        <>
          <div style={{ height: 1, backgroundColor: tokens.colorBorder }} />
          <PresetsPanel presets={presets} onSelect={handlePresetSelect} />
        </>
      )}
      {allowClear && (
        <>
          <div style={{ height: 1, backgroundColor: tokens.colorBorder }} />
          <button
            type="button"
            onClick={handleClear}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
              padding: '0.25rem 0', border: 'none', backgroundColor: 'transparent',
              color: tokens.colorTextMuted, cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorText }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = tokens.colorTextMuted }}
          >
            <ClearIcon /> Clear
          </button>
        </>
      )}
    </div>
  )

  const finalPanel = panelRender ? panelRender(panelContent) : panelContent

  // ---- Trigger content ----
  const checkerBg = [
    'linear-gradient(45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(-45deg, #ccc 25%, transparent 25%)',
    'linear-gradient(45deg, transparent 75%, #ccc 75%)',
    'linear-gradient(-45deg, transparent 75%, #ccc 75%)',
  ].join(', ')

  const triggerRef = useRef<HTMLButtonElement>(null)

  const triggerElement = children || (
    <button
      ref={triggerRef}
      type="button"
      disabled={disabled}
      onClick={handleTriggerClick}
      className={classNames?.trigger}
      style={mergeSemanticStyle({
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        height: sc.height,
        padding: showText ? sc.paddingText : sc.paddingIcon,
        border: `1px solid ${tokens.colorBorder}`, borderRadius: sc.radius,
        backgroundColor: tokens.colorBg, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 0.2s ease',
      }, styles?.trigger)}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorderHover
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = tokens.colorBorder
      }}
    >
      {/* Swatch */}
      <span style={{
        position: 'relative', width: sc.swatch, height: sc.swatch,
        borderRadius: 3, overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
      }}>
        <span style={{
          position: 'absolute', inset: 0,
          backgroundImage: checkerBg,
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
        }} />
        {isGradientMode && !cleared ? (
          <span style={{ position: 'absolute', inset: 0, background: gradientCssString }} />
        ) : (
          <span style={{
            position: 'absolute', inset: 0,
            backgroundColor: cleared ? 'transparent' : solidColor,
          }} />
        )}
        {cleared && (
          <span style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={sc.swatch} height={sc.swatch} viewBox="0 0 16 16" fill="none" stroke="#ff4d4f" strokeWidth="1.5">
              <line x1="3" y1="3" x2="13" y2="13" />
            </svg>
          </span>
        )}
      </span>
      {showText && textContent !== null && (
        <span style={{ fontSize: sc.fontSize, color: tokens.colorText, whiteSpace: 'nowrap' }}>
          {textContent}
        </span>
      )}
    </button>
  )

  // ---- Render ----
  return (
    <div
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle({ position: 'relative', display: 'inline-block' }, styles?.root, style)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children ? (
        <div onClick={handleTriggerClick} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {triggerElement}
        </div>
      ) : (
        triggerElement
      )}

      {isOpen && (
        <div
          ref={panelRef}
          className={classNames?.panel}
          style={mergeSemanticStyle({
            ...panelPositionStyle,
            width: '17.5rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: `1px solid ${tokens.colorBorder}`,
            boxShadow: tokens.shadowMd,
            backgroundColor: tokens.colorBg,
            opacity: animating ? 1 : 0,
            transform: animating ? 'translateY(0)' : `translateY(${isTop ? 4 : -4}px)`,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }, styles?.panel)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {finalPanel}
        </div>
      )}
    </div>
  )
}
