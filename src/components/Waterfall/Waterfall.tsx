import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  type ReactNode,
  type CSSProperties,
  type Key,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

// ============================================================================
// Types
// ============================================================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type WaterfallGap = number | Partial<Record<Breakpoint, number>>

export interface WaterfallItem<T = unknown> {
  /** Identificador único del item */
  key: Key
  /** Contenido del item (tiene prioridad sobre itemRender) */
  children?: ReactNode
  /** Altura del item en px (si se conoce de antemano) */
  height?: number
  /** Columna específica donde colocar el item (0-indexed) */
  column?: number
  /** Datos personalizados asociados al item */
  data?: T
}

export interface WaterfallItemRenderInfo<T = unknown> extends WaterfallItem<T> {
  /** Índice del item en el array original */
  index: number
  /** Columna asignada por el algoritmo */
  assignedColumn: number
}

export interface WaterfallLayoutInfo {
  key: Key
  column: number
}

export type WaterfallSemanticSlot = 'root' | 'column' | 'item'
export type WaterfallClassNames = SemanticClassNames<WaterfallSemanticSlot>
export type WaterfallStyles = SemanticStyles<WaterfallSemanticSlot>

export interface WaterfallProps<T = unknown> {
  /** Array de items a renderizar */
  items?: WaterfallItem<T>[]
  /** Número de columnas (fijo o responsive) */
  columns?: number | Partial<Record<Breakpoint, number>>
  /** Espacio entre items (horizontal y vertical iguales, o [horizontal, vertical]) */
  gutter?: WaterfallGap | [WaterfallGap, WaterfallGap]
  /** Función para renderizar cada item */
  itemRender?: (itemInfo: WaterfallItemRenderInfo<T>) => ReactNode
  /** Monitorear continuamente cambios de tamaño en los items */
  fresh?: boolean
  /** Callback cuando cambia la asignación de columnas */
  onLayoutChange?: (layoutInfo: WaterfallLayoutInfo[]) => void
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: WaterfallClassNames
  /** Estilos para partes internas del componente */
  styles?: WaterfallStyles
}

export interface WaterfallRef {
  nativeElement: HTMLDivElement | null
}

// ============================================================================
// Constants
// ============================================================================

const breakpointValues: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

const breakpointOrder: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

// ============================================================================
// Helpers
// ============================================================================

function getResponsiveValue<T>(
  value: T | Partial<Record<Breakpoint, T>> | undefined,
  windowWidth: number,
  defaultValue: T
): T {
  if (value === undefined) return defaultValue
  if (typeof value !== 'object' || value === null) return value as T

  const responsiveValue = value as Partial<Record<Breakpoint, T>>

  for (const bp of breakpointOrder) {
    if (windowWidth >= breakpointValues[bp] && responsiveValue[bp] !== undefined) {
      return responsiveValue[bp] as T
    }
  }

  return defaultValue
}

function useWindowWidth(): number {
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return 1200
    return window.innerWidth
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

// ============================================================================
// WaterfallItem Component
// ============================================================================

interface WaterfallItemComponentProps {
  item: WaterfallItem
  index: number
  column: number
  columnWidth: string
  horizontalGutter: number
  verticalGutter: number
  itemRender?: (itemInfo: WaterfallItemRenderInfo) => ReactNode
  onResize?: (key: Key, height: number) => void
  fresh?: boolean
  style?: CSSProperties
  itemClassName?: string
  itemStyle?: CSSProperties
}

function WaterfallItemComponent({
  item,
  index,
  column,
  columnWidth,
  horizontalGutter,
  verticalGutter,
  itemRender,
  onResize,
  fresh,
  itemClassName,
  itemStyle,
}: WaterfallItemComponentProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  // Observar cambios de tamaño
  useEffect(() => {
    if (!fresh || !onResize || !itemRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onResize(item.key, entry.contentRect.height)
      }
    })

    observer.observe(itemRef.current)
    return () => observer.disconnect()
  }, [fresh, item.key, onResize])

  // Medir altura inicial
  useEffect(() => {
    if (itemRef.current && onResize) {
      onResize(item.key, itemRef.current.offsetHeight)
    }
  }, [item.key, onResize])

  const content = item.children ?? itemRender?.({
    ...item,
    index,
    assignedColumn: column,
  })

  // Dynamic: gutter padding, width, margin
  const itemDynamicStyle: CSSProperties = {
    width: columnWidth,
    marginBottom: verticalGutter,
    paddingLeft: horizontalGutter / 2,
    paddingRight: horizontalGutter / 2,
    ...itemStyle,
  }

  return (
    <div ref={itemRef} className={cx('ino-waterfall__item', itemClassName)} style={itemDynamicStyle}>
      {content}
    </div>
  )
}

// ============================================================================
// Waterfall Component
// ============================================================================

function WaterfallInner<T = unknown>(
  {
    items = [],
    columns = 3,
    gutter = 0,
    itemRender,
    fresh = false,
    onLayoutChange,
    className,
    style,
    classNames,
    styles,
  }: WaterfallProps<T>,
  ref: React.ForwardedRef<WaterfallRef>
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [itemHeights, setItemHeights] = useState<Map<Key, number>>(new Map())
  const windowWidth = useWindowWidth()

  // Exponer ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref({ nativeElement: containerRef.current })
      } else {
        ref.current = { nativeElement: containerRef.current }
      }
    }
  }, [ref])

  // Calcular valores responsive
  const columnCount = getResponsiveValue(columns, windowWidth, 3)

  // Procesar gutter
  const [horizontalGutter, verticalGutter] = useMemo(() => {
    if (typeof gutter === 'number') {
      return [gutter, gutter]
    }

    if (Array.isArray(gutter)) {
      const h = getResponsiveValue(gutter[0], windowWidth, 0)
      const v = getResponsiveValue(gutter[1], windowWidth, 0)
      return [h, v]
    }

    // Objeto responsive (mismo valor para ambos)
    const value = getResponsiveValue(gutter, windowWidth, 0)
    return [value, value]
  }, [gutter, windowWidth])

  // Calcular ancho de columna
  const columnWidth = `${100 / columnCount}%`

  // Callback para actualizar altura de items
  const handleItemResize = useCallback((key: Key, height: number) => {
    setItemHeights((prev) => {
      const next = new Map(prev)
      next.set(key, height)
      return next
    })
  }, [])

  // Algoritmo de distribución en columnas
  const { columnItems, layoutInfo } = useMemo(() => {
    const cols: WaterfallItem<T>[][] = Array.from({ length: columnCount }, () => [])
    const colHeights: number[] = Array(columnCount).fill(0)
    const layout: WaterfallLayoutInfo[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      let targetColumn: number

      // Si el item especifica una columna, usarla (si es válida)
      if (item.column !== undefined && item.column >= 0 && item.column < columnCount) {
        targetColumn = item.column
      } else {
        // Encontrar la columna con menor altura
        targetColumn = 0
        let minHeight = colHeights[0]
        for (let c = 1; c < columnCount; c++) {
          if (colHeights[c] < minHeight) {
            minHeight = colHeights[c]
            targetColumn = c
          }
        }
      }

      cols[targetColumn].push(item)

      // Actualizar altura de la columna
      const itemHeight = item.height ?? itemHeights.get(item.key) ?? 0
      colHeights[targetColumn] += itemHeight + verticalGutter

      layout.push({ key: item.key, column: targetColumn })
    }

    return { columnItems: cols, layoutInfo: layout }
  }, [items, columnCount, itemHeights, verticalGutter])

  // Notificar cambios de layout
  const prevLayoutRef = useRef<string>('')
  useEffect(() => {
    const layoutString = JSON.stringify(layoutInfo)
    if (layoutString !== prevLayoutRef.current) {
      prevLayoutRef.current = layoutString
      onLayoutChange?.(layoutInfo)
    }
  }, [layoutInfo, onLayoutChange])

  // Dynamic: gutter-derived margins
  const containerDynamicStyle: CSSProperties = {
    marginLeft: horizontalGutter ? -(horizontalGutter / 2) : undefined,
    marginRight: horizontalGutter ? -(horizontalGutter / 2) : undefined,
    ...styles?.root,
    ...style,
  }

  // Dynamic: column width
  const columnDynamicStyle: CSSProperties = {
    width: columnWidth,
    ...styles?.column,
  }

  return (
    <div ref={containerRef} className={cx('ino-waterfall', className, classNames?.root)} style={containerDynamicStyle}>
      {columnItems.map((colItems, colIndex) => (
        <div key={colIndex} className={cx('ino-waterfall__column', classNames?.column)} style={columnDynamicStyle}>
          {colItems.map((item) => (
            <WaterfallItemComponent
              key={item.key}
              item={item}
              index={items.findIndex((i) => i.key === item.key)}
              column={colIndex}
              columnWidth="100%"
              horizontalGutter={horizontalGutter}
              verticalGutter={verticalGutter}
              itemRender={itemRender as (info: WaterfallItemRenderInfo) => ReactNode}
              onResize={handleItemResize}
              fresh={fresh}
              itemClassName={classNames?.item}
              itemStyle={styles?.item}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export const Waterfall = forwardRef(WaterfallInner) as <T = unknown>(
  props: WaterfallProps<T> & { ref?: React.ForwardedRef<WaterfallRef> }
) => ReturnType<typeof WaterfallInner>
