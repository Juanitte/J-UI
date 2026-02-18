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
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

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
    // Also observe each tab
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

  // ---- Styles ----

  // Root
  const rootDirection: CSSProperties['flexDirection'] =
    tabPosition === 'bottom'
      ? 'column-reverse'
      : tabPosition === 'right'
        ? 'row-reverse'
        : tabPosition === 'left'
          ? 'row'
          : 'column'

  const rootStyle = mergeSemanticStyle(
    {
      display: 'flex',
      flexDirection: rootDirection,
      width: '100%',
      minWidth: 0,
    },
    styles?.root,
    style,
  )

  // Tab bar
  const tabBarBorder: CSSProperties = isCard
    ? {}
    : tabPosition === 'top'
      ? { borderBottom: `1px solid ${tokens.colorBorder}` }
      : tabPosition === 'bottom'
        ? { borderTop: `1px solid ${tokens.colorBorder}` }
        : tabPosition === 'left'
          ? { borderRight: `1px solid ${tokens.colorBorder}` }
          : { borderLeft: `1px solid ${tokens.colorBorder}` }

  const tabBarBaseStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: isVertical ? 'stretch' : 'center',
    position: 'relative',
    flexShrink: 0,
    ...tabBarBorder,
    ...tabBarStyle,
  }

  const mergedTabBarStyle = mergeSemanticStyle(
    tabBarBaseStyle,
    styles?.tabBar,
  )

  // Nav wrap: plain block element sized by flex from tabBar, clips overflow
  const navWrapStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
    position: 'relative',
  }

  // Nav list: block-level flex container — width comes from block layout (= navWrap width)
  const navListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    position: 'relative',
    overflowX: isVertical ? 'hidden' : 'auto',
    overflowY: isVertical ? 'auto' : 'hidden',
    scrollbarWidth: 'none',
    justifyContent: centered && !showScrollArrows ? 'center' : undefined,
  }

  // Scroll arrow button
  const arrowBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isVertical ? '100%' : '2rem',
    height: isVertical ? '2rem' : '100%',
    border: 'none',
    background: 'none',
    color: tokens.colorTextMuted,
    cursor: 'pointer',
    flexShrink: 0,
    padding: 0,
  }

  // Content
  const contentBaseStyle: CSSProperties = {
    flex: 1,
    ...(isCard
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
      : {}),
  }

  const mergedContentStyle = mergeSemanticStyle(contentBaseStyle, styles?.content)

  // ---- Tab style builder ----
  const getTabStyle = (item: TabItem, isActive: boolean): CSSProperties => {
    const gutter = tabBarGutter ?? (isVertical ? 0 : isCard ? 2 : 0)
    const padding = isVertical ? sizeConfig.paddingV : sizeConfig.paddingH

    const base: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding,
      fontSize: sizeConfig.fontSize,
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      color: item.disabled
        ? tokens.colorTextSubtle
        : isActive
          ? isCard
            ? tokens.colorText
            : tokens.colorPrimary
          : tokens.colorText,
      fontWeight: isActive ? 600 : 400,
      opacity: item.disabled ? 0.5 : 1,
      whiteSpace: 'nowrap',
      transition: 'color 0.2s, background-color 0.2s',
      flexShrink: 0,
      position: 'relative',
      userSelect: 'none',
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
        backgroundColor: isActive ? tokens.colorBg : tokens.colorBgSubtle,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: borderRadiusMap[tabPosition],
        height: sizeConfig.cardHeight,
        ...(isActive && isTop ? { borderBottomColor: tokens.colorBg } : {}),
        ...(isActive && isBottom ? { borderTopColor: tokens.colorBg } : {}),
        ...(isActive && isLeft ? { borderRightColor: tokens.colorBg } : {}),
        ...(isActive && !isTop && !isBottom && !isLeft
          ? { borderLeftColor: tokens.colorBg }
          : {}),
      } as CSSProperties)
    }

    return base
  }

  // ---- Close button style ----
  const closeBtnStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.25rem',
    padding: '0.125rem',
    border: 'none',
    background: 'none',
    color: tokens.colorTextMuted,
    cursor: 'pointer',
    borderRadius: '0.25rem',
    transition: 'color 0.2s, background-color 0.2s',
    lineHeight: 0,
  }

  // ---- Add button style ----
  const addBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeConfig.cardHeight,
    height: sizeConfig.cardHeight,
    border: `1px dashed ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    background: 'none',
    color: tokens.colorTextMuted,
    cursor: 'pointer',
    flexShrink: 0,
    marginLeft: isVertical ? 0 : '0.25rem',
    marginTop: isVertical ? '0.25rem' : 0,
    transition: 'color 0.2s, border-color 0.2s',
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

      const paneStyle: CSSProperties = {
        ...(isActive ? {} : { display: 'none' }),
        padding: '1rem',
      }

      if (tabPaneAnimated && isActive) {
        // Simple fade-in
        Object.assign(paneStyle, {
          animation: 'j-tabs-fadein 0.3s ease',
        })
      }

      return (
        <div
          key={item.key}
          role="tabpanel"
          aria-hidden={!isActive}
          style={paneStyle}
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
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      {/* Keyframe animation for tab pane fade-in */}
      <style>{`
        @keyframes j-tabs-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Tab bar */}
      <div style={mergedTabBarStyle} className={classNames?.tabBar}>
        {/* Extra left */}
        {extraLeft && (
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {extraLeft}
          </div>
        )}

        {/* Scroll arrow start */}
        {showScrollArrows && (
          <button
            style={{
              ...arrowBtnStyle,
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
        <div ref={navWrapRef} style={navWrapStyle}>
          <div
            ref={navListRef}
            style={navListStyle}
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
                  style={{ ...tabStyle, ...styles?.tab }}
                  className={classNames?.tab}
                  onClick={(e) => handleClick(item, e)}
                  onMouseEnter={(e) => {
                    if (item.disabled) return
                    const el = e.currentTarget as HTMLElement
                    if (!isActive) {
                      if (isCard) {
                        el.style.color = tokens.colorPrimary
                      } else {
                        el.style.color = tokens.colorPrimaryHover
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.disabled) return
                    const el = e.currentTarget as HTMLElement
                    if (!isActive) {
                      el.style.color = tokens.colorText
                    }
                    if (isCard && !isActive) {
                      el.style.backgroundColor = tokens.colorBgSubtle
                    }
                  }}
                >
                  {item.icon && (
                    <span style={{ display: 'inline-flex', lineHeight: 0 }}>
                      {item.icon}
                    </span>
                  )}
                  {item.label && <span>{item.label}</span>}
                  {isEditable && item.closable !== false && (
                    <button
                      style={closeBtnStyle}
                      onClick={(e) => handleClose(item, e)}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.backgroundColor = tokens.colorBgMuted
                        el.style.color = tokens.colorText
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.backgroundColor = 'transparent'
                        el.style.color = tokens.colorTextMuted
                      }}
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
            style={{
              ...arrowBtnStyle,
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
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {extraRight}
          </div>
        )}

        {/* Add button (editable-card) */}
        {isEditable && !hideAdd && (
          <button
            style={addBtnStyle}
            onClick={handleAdd}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.color = tokens.colorPrimary
              el.style.borderColor = tokens.colorPrimary
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.color = tokens.colorTextMuted
              el.style.borderColor = tokens.colorBorder
            }}
            tabIndex={-1}
            aria-label="Add tab"
          >
            {addIcon ?? <PlusIcon />}
          </button>
        )}
      </div>

      {/* Content */}
      <div style={mergedContentStyle} className={classNames?.content}>
        {renderContent()}
      </div>
    </div>
  )
}
