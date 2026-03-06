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
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

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
  const orient = isVertical ? 'vertical' : 'horizontal'

  const barClass = cx(
    'ino-splitter__bar',
    `ino-splitter__bar--${orient}`,
    barClassName,
  )

  const lineClass = cx(
    'ino-splitter__bar-line',
    `ino-splitter__bar-line--${orient}`,
  )

  // Collapse button positioning: dynamic transform stays inline
  const getCollapseButtonStyle = (side: 'start' | 'end'): CSSProperties => {
    const isStart = side === 'start'
    const offset = isStart ? '-0.875rem' : '0.875rem'

    if (isVertical) {
      return {
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${offset}), -50%)`,
      }
    }
    return {
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
      if (isCollapsed) return isStart ? '\u25BC' : '\u25B2'
      return isStart ? '\u25B2' : '\u25BC'
    } else {
      if (isCollapsed) return isStart ? '\u25B6' : '\u25C0'
      return isStart ? '\u25C0' : '\u25B6'
    }
  }

  return (
    <div
      className={barClass}
      style={barStyle}
      onMouseDown={onMouseDown}
    >
      <div className={lineClass} />
      {collapsibleStart && (
        <button
          className={cx('ino-splitter__collapse-btn', collapseButtonClassName)}
          style={{ ...getCollapseButtonStyle('start'), ...collapseButtonStyle }}
          onClick={(e) => { e.stopPropagation(); onCollapseStart() }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {getArrow('start')}
        </button>
      )}
      {collapsibleEnd && (
        <button
          className={cx('ino-splitter__collapse-btn', collapseButtonClassName)}
          style={{ ...getCollapseButtonStyle('end'), ...collapseButtonStyle }}
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
  const orient = isVertical ? 'vertical' : 'horizontal'

  const rootClass = cx(
    'ino-splitter',
    `ino-splitter--${orient}`,
    className,
    classNames?.root,
  )

  const rootDynamicStyle: CSSProperties = {
    ...styles?.root,
    ...style,
  }

  return (
    <div ref={containerRef} className={rootClass} style={rootDynamicStyle}>
      {dragging && (
        <div className={cx('ino-splitter__overlay', `ino-splitter__overlay--${orient}`)} />
      )}
      {lazy && (
        <div
          ref={lazyIndicatorRef}
          className={cx('ino-splitter__lazy-indicator', `ino-splitter__lazy-indicator--${orient}`)}
        />
      )}
      {panels.map((panel, index) => {
        const panelClass = cx(
          'ino-splitter__panel',
          { 'ino-splitter__panel--animated': !dragging },
          panel.className,
          classNames?.panel,
        )

        // Dynamic: flex-basis from calculated sizes
        const panelDynamicStyle: CSSProperties = {
          flexBasis: `${displaySizes[index]}%`,
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
            <div className={panelClass} style={panelDynamicStyle}>
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
