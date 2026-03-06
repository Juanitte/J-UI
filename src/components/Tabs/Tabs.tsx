import {
  type ReactNode,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import './Tabs.css'

// ============================================================================
// Types
// ============================================================================

export type TabsType = 'line' | 'card' | 'editable-card'
export type TabsSize = 'large' | 'middle' | 'small'
export type TabsPosition = 'top' | 'bottom' | 'left' | 'right'

export interface IndicatorConfig {
  size?: number | ((origin: number) => number)
  align?: 'start' | 'center' | 'end'
}

export interface TabItem {
  key: string
  label?: ReactNode
  children?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  closable?: boolean
  closeIcon?: ReactNode
  forceRender?: boolean
  destroyOnHidden?: boolean
}

export type TabsSemanticSlot = 'root' | 'tabBar' | 'tab' | 'content' | 'inkBar'
export type TabsClassNames = SemanticClassNames<TabsSemanticSlot>
export type TabsStyles = SemanticStyles<TabsSemanticSlot>

export interface TabsProps {
  items?: TabItem[]
  activeKey?: string
  defaultActiveKey?: string
  type?: TabsType
  size?: TabsSize
  tabPosition?: TabsPosition
  centered?: boolean
  animated?: boolean | { inkBar: boolean; tabPane: boolean }
  tabBarGutter?: number
  tabBarStyle?: CSSProperties
  tabBarExtraContent?: ReactNode | { left?: ReactNode; right?: ReactNode }
  indicator?: IndicatorConfig
  addIcon?: ReactNode
  removeIcon?: ReactNode
  hideAdd?: boolean
  destroyOnHidden?: boolean
  onChange?: (activeKey: string) => void
  onEdit?: (key: string | ReactMouseEvent, action: 'add' | 'remove') => void
  onTabClick?: (key: string, event: ReactMouseEvent) => void
  className?: string
  style?: CSSProperties
  classNames?: TabsClassNames
  styles?: TabsStyles
}

// ============================================================================
// Constants
// ============================================================================

const SCROLL_STEP = 200

const SIZE_CONFIG = {
  large: { paddingH: '1.25rem 1rem', paddingV: '0.75rem 1.5rem', fontSize: '1rem', cardHeight: '2.75rem' },
  middle: { paddingH: '0.75rem 1rem', paddingV: '0.75rem 1.5rem', fontSize: '0.875rem', cardHeight: '2.5rem' },
  small: { paddingH: '0.5rem 0.75rem', paddingV: '0.5rem 1rem', fontSize: '0.875rem', cardHeight: '2.25rem' },
}

// ============================================================================
// Icons
// ============================================================================

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ============================================================================
// Tabs Component
// ============================================================================

export function Tabs({
  items = [],
  activeKey,
  defaultActiveKey,
  type = 'line',
  size = 'middle',
  tabPosition = 'top',
  centered = false,
  animated = { inkBar: true, tabPane: false },
  tabBarGutter,
  tabBarStyle,
  tabBarExtraContent,
  indicator,
  addIcon,
  removeIcon,
  hideAdd = false,
  destroyOnHidden = false,
  onChange,
  onEdit,
  onTabClick,
  className,
  style,
  classNames,
  styles,
}: TabsProps) {
  // ---- Controlled / uncontrolled ----
  const isControlled = activeKey !== undefined
  const [internalKey, setInternalKey] = useState(
    defaultActiveKey ?? items[0]?.key ?? '',
  )
  const currentKey = isControlled ? activeKey! : internalKey
  const handleTabChange = useCallback(
    (key: string) => {
      if (!isControlled) setInternalKey(key)
      onChange?.(key)
    },
    [isControlled, onChange],
  )

  // ---- Derived flags ----
  const isVertical = tabPosition === 'left' || tabPosition === 'right'
  const isCard = type === 'card' || type === 'editable-card'
  const isEditable = type === 'editable-card'
  const inkBarAnimated = typeof animated === 'boolean' ? animated : animated.inkBar
  const tabPaneAnimated = typeof animated === 'boolean' ? animated : animated.tabPane

  const sizeConfig = SIZE_CONFIG[size]

  // ---- Hover tracking ----
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  // ---- Refs for ink bar measurement ----
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const navListRef = useRef<HTMLDivElement>(null)
  const navWrapRef = useRef<HTMLDivElement>(null)
  const [inkBarStyle, setInkBarStyle] = useState<CSSProperties>({})

  // ---- Overflow state ----
  const [showScrollArrows, setShowScrollArrows] = useState(false)
  const [canScrollStart, setCanScrollStart] = useState(false)
  const [canScrollEnd, setCanScrollEnd] = useState(false)

  // ---- Track previously rendered panels (for lazy destroy) ----
  const renderedRef = useRef<Set<string>>(new Set())

  // Mark active panel as rendered
  if (currentKey) {
    renderedRef.current.add(currentKey)
  }

  // ---- Measure ink bar ----
  const updateInkBar = useCallback(() => {
    if (isCard || !navListRef.current) return
    const tabEl = tabRefs.current.get(currentKey)
    if (!tabEl) {
      setInkBarStyle({ opacity: 0 })
      return
    }

    const listEl = navListRef.current
    let pos: number
    let dim: number

    if (isVertical) {
      pos = tabEl.offsetTop - listEl.offsetTop
      dim = tabEl.offsetHeight
    } else {
      pos = tabEl.offsetLeft - listEl.offsetLeft
      dim = tabEl.offsetWidth
    }

    // Apply indicator config
    let finalDim = dim
    let offset = 0
    if (indicator?.size != null) {
      finalDim =
        typeof indicator.size === 'function'
          ? indicator.size(dim)
          : indicator.size
      const align = indicator.align ?? 'center'
      if (align === 'center') offset = (dim - finalDim) / 2
      else if (align === 'end') offset = dim - finalDim
    }

    if (isVertical) {
      const newStyle: CSSProperties = {
        position: 'absolute',
        width: 2,
        height: finalDim,
        top: pos + offset,
        backgroundColor: tokens.colorPrimary,
        borderRadius: 1,
        transition: inkBarAnimated
          ? 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'
          : 'none',
        ...(tabPosition === 'left' ? { right: 0 } : { left: 0 }),
      }
      setInkBarStyle(newStyle)
    } else {
      const newStyle: CSSProperties = {
        position: 'absolute',
        height: 2,
        width: finalDim,
        left: pos + offset,
        bottom: 0,
        backgroundColor: tokens.colorPrimary,
        borderRadius: 1,
        transition: inkBarAnimated
          ? 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)'
          : 'none',
      }
      setInkBarStyle(newStyle)
    }
  }, [currentKey, isCard, isVertical, tabPosition, inkBarAnimated, indicator])

  // ---- Check overflow ----
  const updateOverflow = useCallback(() => {
    const list = navListRef.current
    if (!list) return

    if (isVertical) {
      const hasOverflow = list.scrollHeight > list.clientHeight + 1
      setShowScrollArrows(hasOverflow)
      setCanScrollStart(list.scrollTop > 0)
      setCanScrollEnd(
        list.scrollTop + list.clientHeight < list.scrollHeight - 1,
      )
    } else {
      const hasOverflow = list.scrollWidth > list.clientWidth + 1
      setShowScrollArrows(hasOverflow)
      setCanScrollStart(list.scrollLeft > 0)
      setCanScrollEnd(
        list.scrollLeft + list.clientWidth < list.scrollWidth - 1,
      )
    }
  }, [isVertical])

  // ---- Auto-scroll active tab into view ----
  const scrollActiveIntoView = useCallback(() => {
    const list = navListRef.current
    const tabEl = tabRefs.current.get(currentKey)
    if (!list || !tabEl) return

    if (isVertical) {
      const tabTop = tabEl.offsetTop - list.offsetTop
      const tabBottom = tabTop + tabEl.offsetHeight
      if (tabTop < list.scrollTop) {
        list.scrollTo({ top: tabTop, behavior: 'smooth' })
      } else if (tabBottom > list.scrollTop + list.clientHeight) {
        list.scrollTo({
          top: tabBottom - list.clientHeight,
          behavior: 'smooth',
        })
      }
    } else {
      const tabLeft = tabEl.offsetLeft - list.offsetLeft
      const tabRight = tabLeft + tabEl.offsetWidth
      if (tabLeft < list.scrollLeft) {
        list.scrollTo({ left: tabLeft, behavior: 'smooth' })
      } else if (tabRight > list.scrollLeft + list.clientWidth) {
        list.scrollTo({
          left: tabRight - list.clientWidth,
          behavior: 'smooth',
        })
      }
    }
  }, [currentKey, isVertical])

  // ---- Effects ----
  useEffect(() => {
    updateInkBar()
    scrollActiveIntoView()
  }, [updateInkBar, scrollActiveIntoView])

  useEffect(() => {
    updateOverflow()
  }, [updateOverflow, items])

  // ResizeObserver for ink bar + overflow
  useEffect(() => {
    const list = navListRef.current
    if (!list) return

    const ro = new ResizeObserver(() => {
      updateInkBar()
      updateOverflow()
    })
    ro.observe(list)
    tabRefs.current.forEach((el) => ro.observe(el))

    return () => ro.disconnect()
  }, [updateInkBar, updateOverflow, items])

  // Update overflow on scroll + convert vertical wheel to horizontal scroll
  useEffect(() => {
    const list = navListRef.current
    if (!list) return

    const handleScroll = () => updateOverflow()
    list.addEventListener('scroll', handleScroll, { passive: true })

    const handleWheel = (e: WheelEvent) => {
      if (isVertical) return
      if (e.deltaX !== 0) return
      if (Math.abs(e.deltaY) < 1) return
      e.preventDefault()
      list.scrollLeft += e.deltaY
    }
    list.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      list.removeEventListener('scroll', handleScroll)
      list.removeEventListener('wheel', handleWheel)
    }
  }, [updateOverflow, isVertical])

  // ---- Scroll handlers ----
  const scrollBy = (delta: number) => {
    const list = navListRef.current
    if (!list) return
    if (isVertical) {
      list.scrollBy({ top: delta, behavior: 'smooth' })
    } else {
      list.scrollBy({ left: delta, behavior: 'smooth' })
    }
  }

  // ---- Tab click ----
  const handleClick = (item: TabItem, e: ReactMouseEvent) => {
    if (item.disabled) return
    onTabClick?.(item.key, e)
    if (item.key !== currentKey) {
      handleTabChange(item.key)
    }
  }

  // ---- Tab close ----
  const handleClose = (item: TabItem, e: ReactMouseEvent) => {
    e.stopPropagation()
    onEdit?.(item.key, 'remove')
  }

  // ---- Add ----
  const handleAdd = (e: ReactMouseEvent) => {
    onEdit?.(e, 'add')
  }

  // ---- Extra content ----
  let extraLeft: ReactNode = null
  let extraRight: ReactNode = null
  if (tabBarExtraContent) {
    if (
      typeof tabBarExtraContent === 'object' &&
      tabBarExtraContent !== null &&
      'left' in tabBarExtraContent
    ) {
      const extra = tabBarExtraContent as { left?: ReactNode; right?: ReactNode }
      extraLeft = extra.left ?? null
      extraRight = extra.right ?? null
    } else {
      extraRight = tabBarExtraContent as ReactNode
    }
  }

  // ---- Tab bar border class ----
  const barBorderClass = isCard
    ? undefined
    : tabPosition === 'top'
      ? 'ino-tabs__bar--border-bottom'
      : tabPosition === 'bottom'
        ? 'ino-tabs__bar--border-top'
        : tabPosition === 'left'
          ? 'ino-tabs__bar--border-right'
          : 'ino-tabs__bar--border-left'

  // ---- Content ----
  const contentStyle: CSSProperties = isCard
    ? {
        border: `1px solid ${tokens.colorBorder}`,
        ...(tabPosition === 'top'
          ? { borderTop: 'none', borderRadius: '0 0 0.5rem 0.5rem' }
          : tabPosition === 'bottom'
            ? { borderBottom: 'none', borderRadius: '0.5rem 0.5rem 0 0' }
            : tabPosition === 'left'
              ? { borderLeft: 'none', borderRadius: '0 0.5rem 0.5rem 0' }
              : { borderRight: 'none', borderRadius: '0.5rem 0 0 0.5rem' }),
      }
    : {}

  // ---- Tab style builder ----
  const getTabStyle = (item: TabItem, isActive: boolean): CSSProperties => {
    const gutter = tabBarGutter ?? (isVertical ? 0 : isCard ? 2 : 0)
    const padding = isVertical ? sizeConfig.paddingV : sizeConfig.paddingH
    const isHovered = hoveredKey === item.key && !item.disabled && !isActive

    const base: CSSProperties = {
      padding,
      fontSize: sizeConfig.fontSize,
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      color: item.disabled
        ? tokens.colorTextSubtle
        : isHovered
          ? isCard ? tokens.colorPrimary : tokens.colorPrimaryHover
          : isActive
            ? isCard
              ? tokens.colorText
              : tokens.colorPrimary
            : tokens.colorText,
      fontWeight: isActive ? 600 : 400,
      ...(isVertical
        ? { marginBottom: gutter }
        : { marginRight: gutter }),
    }

    if (isCard) {
      const isTop = tabPosition === 'top'
      const isBottom = tabPosition === 'bottom'
      const isLeft = tabPosition === 'left'

      const cardRadius = '0.5rem'
      const borderRadiusMap: Record<TabsPosition, string> = {
        top: `${cardRadius} ${cardRadius} 0 0`,
        bottom: `0 0 ${cardRadius} ${cardRadius}`,
        left: `${cardRadius} 0 0 ${cardRadius}`,
        right: `0 ${cardRadius} ${cardRadius} 0`,
      }

      Object.assign(base, {
        backgroundColor: isActive ? tokens.colorBg : isHovered ? tokens.colorBg : tokens.colorBgSubtle,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: borderRadiusMap[tabPosition],
        height: sizeConfig.cardHeight,
        ...(isTop ? { borderBottomColor: isActive ? tokens.colorBg : tokens.colorBorder } : {}),
        ...(isBottom ? { borderTopColor: isActive ? tokens.colorBg : tokens.colorBorder } : {}),
        ...(isLeft ? { borderRightColor: isActive ? tokens.colorBg : tokens.colorBorder } : {}),
        ...(!isTop && !isBottom && !isLeft
          ? { borderLeftColor: isActive ? tokens.colorBg : tokens.colorBorder }
          : {}),
      } as CSSProperties)
    }

    return base
  }

  // ---- Render active content ----
  const renderContent = () => {
    return items.map((item) => {
      const isActive = item.key === currentKey
      const shouldDestroy =
        (item.destroyOnHidden ?? destroyOnHidden) && !isActive
      const wasRendered = renderedRef.current.has(item.key)
      const shouldRender = isActive || item.forceRender || (wasRendered && !shouldDestroy)

      if (!shouldRender) return null

      return (
        <div
          key={item.key}
          role="tabpanel"
          aria-hidden={!isActive}
          className={cx(
            'ino-tabs__pane',
            { 'ino-tabs__pane--hidden': !isActive },
          )}
          style={
            tabPaneAnimated && isActive
              ? { animation: 'j-tabs-fadein 0.3s ease' }
              : undefined
          }
        >
          {item.children}
        </div>
      )
    })
  }

  // ---- Ref callback for tab elements ----
  const setTabRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) {
      tabRefs.current.set(key, el)
    } else {
      tabRefs.current.delete(key)
    }
  }

  // ---- Render ----
  return (
    <div
      className={cx('ino-tabs', `ino-tabs--${tabPosition}`, className, classNames?.root)}
      style={{ ...styles?.root, ...style }}
    >
      {/* Tab bar */}
      <div
        className={cx(
          'ino-tabs__bar',
          isVertical ? 'ino-tabs__bar--vertical' : 'ino-tabs__bar--horizontal',
          barBorderClass,
          classNames?.tabBar,
        )}
        style={{ ...tabBarStyle, ...styles?.tabBar }}
      >
        {/* Extra left */}
        {extraLeft && (
          <div className="ino-tabs__extra">
            {extraLeft}
          </div>
        )}

        {/* Scroll arrow start */}
        {showScrollArrows && (
          <button
            className={cx(
              'ino-tabs__scroll-arrow',
              isVertical ? 'ino-tabs__scroll-arrow--v' : 'ino-tabs__scroll-arrow--h',
            )}
            style={{
              opacity: canScrollStart ? 1 : 0.3,
              pointerEvents: canScrollStart ? 'auto' : 'none',
            }}
            onClick={() => scrollBy(-SCROLL_STEP)}
            tabIndex={-1}
            aria-label="Scroll tabs back"
          >
            {isVertical ? <ChevronUpIcon /> : <ChevronLeftIcon />}
          </button>
        )}

        {/* Nav wrap */}
        <div ref={navWrapRef} className="ino-tabs__nav-wrap">
          <div
            ref={navListRef}
            className={cx(
              'ino-tabs__nav-list',
              isVertical ? 'ino-tabs__nav-list--vertical' : 'ino-tabs__nav-list--horizontal',
              { 'ino-tabs__nav-list--centered': centered && !showScrollArrows },
            )}
            role="tablist"
          >
            {items.map((item) => {
              const isActive = item.key === currentKey
              const tabStyle = getTabStyle(item, isActive)

              return (
                <div
                  key={item.key}
                  ref={setTabRef(item.key)}
                  role="tab"
                  aria-selected={isActive}
                  aria-disabled={item.disabled}
                  tabIndex={isActive ? 0 : -1}
                  className={cx(
                    'ino-tabs__tab',
                    { 'ino-tabs__tab--disabled': item.disabled },
                    classNames?.tab,
                  )}
                  style={{ ...tabStyle, ...styles?.tab }}
                  onClick={(e) => handleClick(item, e)}
                  onMouseEnter={() => {
                    if (!item.disabled) setHoveredKey(item.key)
                  }}
                  onMouseLeave={() => {
                    setHoveredKey((prev) => prev === item.key ? null : prev)
                  }}
                >
                  {item.icon && (
                    <span className="ino-tabs__tab-icon">
                      {item.icon}
                    </span>
                  )}
                  {item.label && <span>{item.label}</span>}
                  {isEditable && item.closable !== false && (
                    <button
                      className="ino-tabs__close-btn"
                      onClick={(e) => handleClose(item, e)}
                      tabIndex={-1}
                      aria-label={`Close ${item.label ?? item.key}`}
                    >
                      {item.closeIcon ?? removeIcon ?? <CloseIcon />}
                    </button>
                  )}
                </div>
              )
            })}

            {/* Ink bar (only for line type) */}
            {!isCard && (
              <div
                style={{ ...inkBarStyle, ...styles?.inkBar }}
                className={classNames?.inkBar}
              />
            )}
          </div>
        </div>

        {/* Scroll arrow end */}
        {showScrollArrows && (
          <button
            className={cx(
              'ino-tabs__scroll-arrow',
              isVertical ? 'ino-tabs__scroll-arrow--v' : 'ino-tabs__scroll-arrow--h',
            )}
            style={{
              opacity: canScrollEnd ? 1 : 0.3,
              pointerEvents: canScrollEnd ? 'auto' : 'none',
            }}
            onClick={() => scrollBy(SCROLL_STEP)}
            tabIndex={-1}
            aria-label="Scroll tabs forward"
          >
            {isVertical ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </button>
        )}

        {/* Extra right */}
        {extraRight && (
          <div className="ino-tabs__extra">
            {extraRight}
          </div>
        )}

        {/* Add button (editable-card) */}
        {isEditable && !hideAdd && (
          <button
            className="ino-tabs__add-btn"
            style={{
              width: sizeConfig.cardHeight,
              height: sizeConfig.cardHeight,
              marginLeft: isVertical ? 0 : '0.25rem',
              marginTop: isVertical ? '0.25rem' : 0,
            }}
            onClick={handleAdd}
            tabIndex={-1}
            aria-label="Add tab"
          >
            {addIcon ?? <PlusIcon />}
          </button>
        )}
      </div>

      {/* Content */}
      <div
        className={cx('ino-tabs__content', classNames?.content)}
        style={{ ...contentStyle, ...styles?.content }}
      >
        {renderContent()}
      </div>
    </div>
  )
}
