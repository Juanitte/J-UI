import {
  useState,
  useRef,
  useCallback,
  useEffect,
  Children,
  isValidElement,
  type ReactNode,
  type CSSProperties,
  type ReactElement,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export interface SplitterPanelProps {
  /** Contenido del panel */
  children?: ReactNode
  /** Tamaño inicial (px o porcentaje como string "50%") */
  defaultSize?: number | string
  /** Tamaño controlado */
  size?: number | string
  /** Tamaño mínimo (px o porcentaje) */
  min?: number | string
  /** Tamaño máximo (px o porcentaje) */
  max?: number | string
  /** Permitir redimensionar este panel */
  resizable?: boolean
  /** Permitir colapsar. true = ambos lados, o { start?: boolean, end?: boolean } */
  collapsible?: boolean | { start?: boolean; end?: boolean }
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

export type SplitterSemanticSlot = 'root' | 'panel' | 'bar' | 'collapseButton'
export type SplitterClassNames = SemanticClassNames<SplitterSemanticSlot>
export type SplitterStyles = SemanticStyles<SplitterSemanticSlot>

export interface SplitterProps {
  /** Paneles (solo acepta Splitter.Panel como hijos) */
  children?: ReactNode
  /** Dirección del split */
  orientation?: 'horizontal' | 'vertical'
  /** Modo lazy: solo actualiza tamaño al soltar */
  lazy?: boolean
  /** Callback cuando cambian los tamaños */
  onResize?: (sizes: number[]) => void
  /** Callback al empezar a arrastrar */
  onResizeStart?: (sizes: number[]) => void
  /** Callback al terminar de arrastrar */
  onResizeEnd?: (sizes: number[]) => void
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: SplitterClassNames
  /** Estilos para partes internas del componente */
  styles?: SplitterStyles
}

interface PanelConfig {
  defaultSize?: number | string
  size?: number | string
  min?: number | string
  max?: number | string
  resizable: boolean
  collapsible: boolean | { start?: boolean; end?: boolean }
  children?: ReactNode
  style?: CSSProperties
  className?: string
}

// ============================================================================
// Helpers
// ============================================================================

function parseSizeValue(value: number | string | undefined, totalSize: number): number | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  if (value.endsWith('%')) {
    return (parseFloat(value) / 100) * totalSize
  }
  return parseFloat(value)
}

// ============================================================================
// Panel Component (declarative only, rendered by Splitter)
// ============================================================================

export function Panel(_props: SplitterPanelProps): ReactElement | null {
  return null
}

// ============================================================================
// SplitBar Component
// ============================================================================

interface SplitBarProps {
  isVertical: boolean
  onMouseDown: (e: React.MouseEvent) => void
  collapsibleStart: boolean
  collapsibleEnd: boolean
  onCollapseStart: () => void
  onCollapseEnd: () => void
  isStartCollapsed: boolean
  isEndCollapsed: boolean
  barClassName?: string
  barStyle?: CSSProperties
  collapseButtonClassName?: string
  collapseButtonStyle?: CSSProperties
}

function SplitBar({
  isVertical,
  onMouseDown,
  collapsibleStart,
  collapsibleEnd,
  onCollapseStart,
  onCollapseEnd,
  isStartCollapsed,
  isEndCollapsed,
  barClassName,
  barStyle,
  collapseButtonClassName,
  collapseButtonStyle,
}: SplitBarProps) {
  const [hovered, setHovered] = useState(false)

  const barStyles: CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [isVertical ? 'height' : 'width']: '0.75rem',
    [isVertical ? 'width' : 'height']: '100%',
    cursor: isVertical ? 'row-resize' : 'col-resize',
    userSelect: 'none',
    zIndex: 1,
  }

  const lineStyles: CSSProperties = {
    [isVertical ? 'width' : 'height']: '100%',
    [isVertical ? 'height' : 'width']: hovered ? 3 : 2,
    backgroundColor: hovered ? tokens.colorPrimary : tokens.colorBorder,
    borderRadius: 1,
    transition: 'background-color 0.15s ease, height 0.15s ease, width 0.15s ease',
  }

  const arrowBtnStyles = (side: 'start' | 'end'): CSSProperties => {
    const isStart = side === 'start'
    const offset = isStart ? '-0.875rem' : '0.875rem'

    const base: CSSProperties = {
      position: 'absolute',
      width: '1.25rem',
      height: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      border: `1px solid ${tokens.colorBorder}`,
      backgroundColor: tokens.colorBg,
      cursor: 'pointer',
      fontSize: '0.625rem',
      color: tokens.colorTextMuted,
      opacity: hovered ? 1 : 0,
      transition: 'opacity 0.15s ease',
      zIndex: 2,
    }

    if (isVertical) {
      // Bar is horizontal — arrows sit side by side, centered horizontally
      return {
        ...base,
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${offset}), -50%)`,
      }
    }

    // Bar is vertical — arrows stack vertically, centered vertically
    return {
      ...base,
      top: '50%',
      left: '50%',
      transform: `translate(-50%, calc(-50% + ${offset}))`,
    }
  }

  // Flechas según orientación y estado
  const getArrow = (side: 'start' | 'end') => {
    const isStart = side === 'start'
    const isCollapsed = isStart ? isStartCollapsed : isEndCollapsed

    if (isVertical) {
      // Vertical: start = panel arriba, end = panel abajo
      if (isCollapsed) return isStart ? '▼' : '▲'
      return isStart ? '▲' : '▼'
    } else {
      // Horizontal: start = panel izquierdo, end = panel derecho
      if (isCollapsed) return isStart ? '▶' : '◀'
      return isStart ? '◀' : '▶'
    }
  }

  return (
    <div
      style={{ ...barStyles, ...barStyle }}
      className={barClassName}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={lineStyles} />
      {collapsibleStart && (
        <button
          style={{ ...arrowBtnStyles('start'), ...collapseButtonStyle }}
          className={collapseButtonClassName}
          onClick={(e) => { e.stopPropagation(); onCollapseStart() }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {getArrow('start')}
        </button>
      )}
      {collapsibleEnd && (
        <button
          style={{ ...arrowBtnStyles('end'), ...collapseButtonStyle }}
          className={collapseButtonClassName}
          onClick={(e) => { e.stopPropagation(); onCollapseEnd() }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {getArrow('end')}
        </button>
      )}
    </div>
  )
}

// ============================================================================
// Splitter Component
// ============================================================================

function SplitterRoot({
  children,
  orientation = 'horizontal',
  lazy = false,
  onResize,
  onResizeStart,
  onResizeEnd,
  className,
  style,
  classNames,
  styles,
}: SplitterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVertical = orientation === 'vertical'

  // Extraer configuración de paneles
  const panels: PanelConfig[] = []
  Children.forEach(children, (child) => {
    if (isValidElement<SplitterPanelProps>(child) && child.type === Panel) {
      panels.push({
        defaultSize: child.props.defaultSize,
        size: child.props.size,
        min: child.props.min,
        max: child.props.max,
        resizable: child.props.resizable ?? true,
        collapsible: child.props.collapsible ?? false,
        children: child.props.children,
        style: child.props.style,
        className: child.props.className,
      })
    }
  })

  const panelCount = panels.length

  // Estado de tamaños (en porcentaje del contenedor)
  const [sizes, setSizes] = useState<number[]>(() => {
    const initial: number[] = []
    let usedPercent = 0
    let autoCount = 0

    for (const panel of panels) {
      if (panel.defaultSize !== undefined || panel.size !== undefined) {
        const val = panel.size ?? panel.defaultSize!
        if (typeof val === 'string' && val.endsWith('%')) {
          const pct = parseFloat(val)
          initial.push(pct)
          usedPercent += pct
        } else {
          // px - convertiremos después, por ahora marcamos como -1
          initial.push(-(typeof val === 'number' ? val : parseFloat(val)))
          autoCount++
        }
      } else {
        initial.push(0)
        autoCount++
      }
    }

    // Distribuir el espacio restante entre paneles sin tamaño
    const remaining = 100 - usedPercent
    const zeroCount = initial.filter((v) => v === 0).length

    if (zeroCount > 0) {
      const each = remaining / zeroCount
      return initial.map((v) => (v === 0 ? each : v < 0 ? -v : v))
    }

    return initial.map((v) => (v < 0 ? -v : v))
  })

  // Tamaños colapsados (guardamos el tamaño previo)
  const [collapsed, setCollapsed] = useState<boolean[]>(() => Array(panelCount).fill(false))
  const prevSizesRef = useRef<number[]>([])

  // Drag state
  const dragRef = useRef<{
    barIndex: number
    startPos: number
    startSizes: number[]
    containerSize: number
  } | null>(null)

  const [dragging, setDragging] = useState(false)
  const lazySizesRef = useRef<number[] | null>(null)
  const lazyIndicatorRef = useRef<HTMLDivElement>(null)

  // Sincronizar tamaños controlados (cuando se pasa size prop)
  useEffect(() => {
    const controlled = panels.some((p) => p.size !== undefined)
    if (!controlled) return

    const containerSize = containerRef.current
      ? (isVertical ? containerRef.current.offsetHeight : containerRef.current.offsetWidth)
      : 0

    const newSizes = panels.map((panel, i) => {
      if (panel.size === undefined) return sizes[i] ?? (100 / panelCount)
      const val = panel.size
      if (typeof val === 'string' && val.endsWith('%')) return parseFloat(val)
      const px = typeof val === 'number' ? val : parseFloat(val)
      return containerSize > 0 ? (px / containerSize) * 100 : px
    })

    // Solo actualizar si hay cambios reales
    const changed = newSizes.some((s, i) => Math.abs(s - (sizes[i] ?? 0)) > 0.01)
    if (changed) setSizes(newSizes)
  })

  // Resolución de px a porcentaje basada en el contenedor (solo al montar)
  useEffect(() => {
    if (!containerRef.current) return
    const containerSize = isVertical
      ? containerRef.current.offsetHeight
      : containerRef.current.offsetWidth

    if (containerSize === 0) return

    let needsUpdate = false
    const newSizes = sizes.map((s, i) => {
      const panel = panels[i]
      if (panel && panel.size === undefined && panel.defaultSize !== undefined) {
        const val = panel.defaultSize
        if (typeof val === 'number' && val > 100) {
          needsUpdate = true
          return (val / containerSize) * 100
        }
      }
      return s
    })

    if (needsUpdate) {
      setSizes(newSizes)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calcular tamaños con constraints
  const getConstrainedSizes = useCallback(
    (newSizes: number[]): number[] => {
      if (!containerRef.current) return newSizes
      const containerSize = isVertical
        ? containerRef.current.offsetHeight
        : containerRef.current.offsetWidth

      return newSizes.map((s, i) => {
        const panel = panels[i]
        if (!panel) return s

        const minPx = parseSizeValue(panel.min, containerSize)
        const maxPx = parseSizeValue(panel.max, containerSize)
        const minPct = minPx !== undefined ? (minPx / containerSize) * 100 : 0
        const maxPct = maxPx !== undefined ? (maxPx / containerSize) * 100 : 100

        return Math.min(Math.max(s, minPct), maxPct)
      })
    },
    [isVertical, panels]
  )

  // Handle drag
  const handleMouseDown = useCallback(
    (barIndex: number) => (e: React.MouseEvent) => {
      e.preventDefault()
      if (!containerRef.current) return

      // Verificar que ambos paneles son resizable
      if (!panels[barIndex]?.resizable || !panels[barIndex + 1]?.resizable) return

      const containerSize = isVertical
        ? containerRef.current.offsetHeight
        : containerRef.current.offsetWidth

      const startPos = isVertical ? e.clientY : e.clientX

      dragRef.current = {
        barIndex,
        startPos,
        startSizes: [...sizes],
        containerSize,
      }

      setDragging(true)
      onResizeStart?.(sizes)

      if (lazy) lazySizesRef.current = [...sizes]
    },
    [isVertical, panels, sizes, onResizeStart, lazy]
  )

  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return

      const { barIndex, startPos, startSizes, containerSize } = dragRef.current
      const currentPos = isVertical ? e.clientY : e.clientX
      const delta = currentPos - startPos
      const deltaPct = (delta / containerSize) * 100

      const newSizes = [...startSizes]
      newSizes[barIndex] = startSizes[barIndex] + deltaPct
      newSizes[barIndex + 1] = startSizes[barIndex + 1] - deltaPct

      // Aplicar constraints respetando la suma de ambos paneles
      const constrained = [...newSizes]
      const sum = startSizes[barIndex] + startSizes[barIndex + 1]

      // Clamp panel izquierdo, compensar con el derecho
      const clamped = getConstrainedSizes(constrained)
      constrained[barIndex] = clamped[barIndex]
      constrained[barIndex + 1] = sum - constrained[barIndex]

      // Clamp panel derecho, compensar con el izquierdo
      const clamped2 = getConstrainedSizes(constrained)
      constrained[barIndex + 1] = clamped2[barIndex + 1]
      constrained[barIndex] = sum - constrained[barIndex + 1]

      if (lazy) {
        lazySizesRef.current = constrained
        // Posicionar indicador de preview
        if (lazyIndicatorRef.current && dragRef.current) {
          const numBars = panels.length - 1
          const available = dragRef.current.containerSize - numBars * 12
          const leftSum = constrained.slice(0, dragRef.current.barIndex + 1).reduce((a, b) => a + b, 0)
          const pos = (leftSum / 100) * available + dragRef.current.barIndex * 12 + 6
          if (isVertical) {
            lazyIndicatorRef.current.style.top = `${pos}px`
            lazyIndicatorRef.current.style.left = '0'
          } else {
            lazyIndicatorRef.current.style.left = `${pos}px`
            lazyIndicatorRef.current.style.top = '0'
          }
          lazyIndicatorRef.current.style.display = 'block'
        }
      } else {
        setSizes(constrained)
        onResize?.(constrained)
      }
    }

    const handleMouseUp = () => {
      if (lazyIndicatorRef.current) {
        lazyIndicatorRef.current.style.display = 'none'
      }
      if (lazy && lazySizesRef.current) {
        setSizes(lazySizesRef.current)
        onResize?.(lazySizesRef.current)
        lazySizesRef.current = null
      }
      setDragging(false)
      dragRef.current = null
      onResizeEnd?.(sizes)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, isVertical, getConstrainedSizes, lazy, sizes, onResize, onResizeEnd])

  // Collapse/Expand
  const handleCollapse = useCallback(
    (panelIndex: number) => {
      setCollapsed((prev) => {
        const next = [...prev]
        if (next[panelIndex]) {
          // Expandir: restaurar tamaño previo
          const restored = prevSizesRef.current[panelIndex] || (100 / panelCount)
          setSizes((s) => {
            const newSizes = [...s]
            // Tomar espacio del panel adyacente
            const adjacentIndex = panelIndex === 0 ? 1 : panelIndex - 1
            newSizes[adjacentIndex] -= restored - newSizes[panelIndex]
            newSizes[panelIndex] = restored
            onResize?.(newSizes)
            return newSizes
          })
          next[panelIndex] = false
        } else {
          // Colapsar: guardar tamaño actual
          prevSizesRef.current[panelIndex] = sizes[panelIndex]
          setSizes((s) => {
            const newSizes = [...s]
            const adjacentIndex = panelIndex === 0 ? 1 : panelIndex - 1
            newSizes[adjacentIndex] += newSizes[panelIndex]
            newSizes[panelIndex] = 0
            onResize?.(newSizes)
            return newSizes
          })
          next[panelIndex] = true
        }
        return next
      })
    },
    [panelCount, sizes, onResize]
  )

  // Render
  const displaySizes = sizes

  const containerStyle = mergeSemanticStyle(
    {
      display: 'flex',
      flexDirection: isVertical ? 'column' : 'row',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    styles?.root,
    style,
  )

  // Cursor overlay durante drag
  const overlayStyles: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    cursor: isVertical ? 'row-resize' : 'col-resize',
  }

  return (
    <div ref={containerRef} style={containerStyle} className={mergeSemanticClassName(className, classNames?.root)}>
      {dragging && <div style={overlayStyles} />}
      {lazy && (
        <div
          ref={lazyIndicatorRef}
          style={{
            display: 'none',
            position: 'absolute',
            ...(isVertical
              ? { left: 0, right: 0, height: 2 }
              : { top: 0, bottom: 0, width: 2 }),
            backgroundColor: tokens.colorBorder,
            zIndex: 10,
            pointerEvents: 'none',
            transform: isVertical ? 'translateY(-50%)' : 'translateX(-50%)',
          }}
        />
      )}
      {panels.map((panel, index) => {
        const panelStyles: CSSProperties = {
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: `${displaySizes[index]}%`,
          minWidth: 0,
          minHeight: 0,
          overflow: 'auto',
          transition: dragging ? 'none' : 'flex-basis 0.15s ease',
          ...styles?.panel,
          ...panel.style,
        }

        // Collapsible config
        const getCollapsible = (side: 'start' | 'end', barIndex: number) => {
          const panelIdx = side === 'start' ? barIndex : barIndex + 1
          const p = panels[panelIdx]
          if (!p) return false
          if (typeof p.collapsible === 'boolean') return p.collapsible
          if (typeof p.collapsible === 'object') {
            return side === 'start' ? !!p.collapsible.start : !!p.collapsible.end
          }
          return false
        }

        return (
          <div key={index} style={{ display: 'contents' }}>
            <div style={panelStyles} className={mergeSemanticClassName(panel.className, classNames?.panel)}>
              {panel.children}
            </div>
            {index < panelCount - 1 && (
              <SplitBar
                isVertical={isVertical}
                onMouseDown={handleMouseDown(index)}
                collapsibleStart={
                  getCollapsible('end', index) ||
                  (typeof panels[index]?.collapsible === 'boolean' && !!panels[index]?.collapsible)
                }
                collapsibleEnd={
                  getCollapsible('start', index) ||
                  (typeof panels[index + 1]?.collapsible === 'boolean' && !!panels[index + 1]?.collapsible)
                }
                onCollapseStart={() => handleCollapse(index)}
                onCollapseEnd={() => handleCollapse(index + 1)}
                isStartCollapsed={collapsed[index]}
                isEndCollapsed={collapsed[index + 1]}
                barClassName={classNames?.bar}
                barStyle={styles?.bar}
                collapseButtonClassName={classNames?.collapseButton}
                collapseButtonStyle={styles?.collapseButton}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Compound Component
// ============================================================================

export const Splitter = Object.assign(SplitterRoot, { Panel })
