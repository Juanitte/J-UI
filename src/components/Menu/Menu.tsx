import {
  type ReactNode,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useState,
  useRef,
  useEffect,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'
import { Tooltip } from '../Tooltip'

// ============================================================================
// Types
// ============================================================================

export type MenuMode = 'vertical' | 'horizontal' | 'inline'

export type MenuSemanticSlot = 'root' | 'item' | 'submenu' | 'group' | 'groupTitle' | 'divider'
export type MenuClassNames = SemanticClassNames<MenuSemanticSlot>
export type MenuStyles = SemanticStyles<MenuSemanticSlot>

export interface MenuClickInfo {
  key: string
  keyPath: string[]
  domEvent: ReactMouseEvent
}

export interface MenuSelectInfo extends MenuClickInfo {
  selectedKeys: string[]
}

export interface MenuItemOption {
  key: string
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  title?: string
  onClick?: (info: MenuClickInfo) => void
}

export interface SubMenuOption {
  key: string
  label?: ReactNode
  icon?: ReactNode
  disabled?: boolean
  children: MenuItemType[]
}

export interface MenuItemGroupOption {
  key?: string
  type: 'group'
  label?: ReactNode
  children: MenuItemType[]
}

export interface MenuDividerOption {
  key?: string
  type: 'divider'
  dashed?: boolean
}

export type MenuItemType = MenuItemOption | SubMenuOption | MenuItemGroupOption | MenuDividerOption

export interface MenuProps {
  items?: MenuItemType[]
  mode?: MenuMode
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  openKeys?: string[]
  defaultOpenKeys?: string[]
  multiple?: boolean
  selectable?: boolean
  inlineCollapsed?: boolean
  inlineIndent?: number
  triggerSubMenuAction?: 'hover' | 'click'
  onClick?: (info: MenuClickInfo) => void
  onSelect?: (info: MenuSelectInfo) => void
  onDeselect?: (info: MenuSelectInfo) => void
  onOpenChange?: (openKeys: string[]) => void
  expandIcon?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: MenuClassNames
  styles?: MenuStyles
}

// ============================================================================
// Type guards
// ============================================================================

function isDivider(item: MenuItemType): item is MenuDividerOption {
  return 'type' in item && item.type === 'divider'
}

function isGroup(item: MenuItemType): item is MenuItemGroupOption {
  return 'type' in item && item.type === 'group'
}

function isSubMenu(item: MenuItemType): item is SubMenuOption {
  return !isDivider(item) && !isGroup(item) && 'children' in item && Array.isArray(item.children)
}

// ============================================================================
// Icons
// ============================================================================

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ============================================================================
// MenuContext — shared state passed down to items
// ============================================================================

interface MenuContextValue {
  mode: MenuMode
  selectedKeys: string[]
  openKeys: string[]
  inlineCollapsed: boolean
  inlineIndent: number
  triggerSubMenuAction: 'hover' | 'click'
  expandIcon: ReactNode | undefined
  selectable: boolean
  multiple: boolean
  classNames?: MenuClassNames
  styles?: MenuStyles
  onItemClick: (item: MenuItemOption, keyPath: string[], e: ReactMouseEvent) => void
  onSubMenuToggle: (key: string) => void
  onSubMenuMouseEnter: (key: string) => void
  onSubMenuMouseLeave: (key: string) => void
}

// We'll pass context via props rather than React.createContext to keep it simple
// since Menu is a single component tree.

// ============================================================================
// MenuDivider
// ============================================================================

function MenuDivider({ item, ctx }: { item: MenuDividerOption; ctx: MenuContextValue }) {
  const style: CSSProperties = {
    margin: '0.25rem 0',
    padding: 0,
    listStyle: 'none',
    borderTop: item.dashed
      ? `1px dashed ${tokens.colorBorder}`
      : `1px solid ${tokens.colorBorder}`,
    ...ctx.styles?.divider,
  }

  return (
    <li
      role="separator"
      style={style}
      className={ctx.classNames?.divider}
    />
  )
}

// ============================================================================
// MenuGroup
// ============================================================================

function MenuGroup({
  item,
  ctx,
  level,
}: {
  item: MenuItemGroupOption
  ctx: MenuContextValue
  level: number
}) {
  const titleStyle: CSSProperties = {
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: tokens.colorTextSubtle,
    lineHeight: '1.5',
    ...ctx.styles?.groupTitle,
  }

  if (ctx.mode === 'inline' && !ctx.inlineCollapsed) {
    titleStyle.paddingLeft = 16 + ctx.inlineIndent * level
  }

  return (
    <li
      role="presentation"
      style={{ listStyle: 'none', ...ctx.styles?.group }}
      className={ctx.classNames?.group}
    >
      <div style={titleStyle} className={ctx.classNames?.groupTitle}>
        {item.label}
      </div>
      <ul role="group" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {item.children.map((child) => (
          <MenuItemRenderer
            key={getItemKey(child)}
            item={child}
            ctx={ctx}
            level={level}
            keyPath={[]}
          />
        ))}
      </ul>
    </li>
  )
}

// ============================================================================
// MenuItem (leaf)
// ============================================================================

function MenuItemLeaf({
  item,
  ctx,
  level,
  keyPath,
}: {
  item: MenuItemOption
  ctx: MenuContextValue
  level: number
  keyPath: string[]
}) {
  const isSelected = ctx.selectedKeys.includes(item.key)
  const isHorizontal = ctx.mode === 'horizontal'
  const isVertical = ctx.mode === 'vertical'
  const isInline = ctx.mode === 'inline'
  const collapsed = isInline && ctx.inlineCollapsed

  const fullKeyPath = [item.key, ...keyPath]

  // Extract user-provided overrides so selected/hover states respect them
  const userItemColor = ctx.styles?.item?.color as string | undefined
  const userItemBg = ctx.styles?.item?.backgroundColor as string | undefined

  // Spread styles.item but exclude backgroundColor (only used for selected state)
  const { backgroundColor: _excludeBg, ...itemStyleWithoutBg } = ctx.styles?.item ?? {}

  const baseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: isHorizontal ? '0 1.25rem' : '0.5rem 1rem',
    lineHeight: isHorizontal ? '2.875rem' : '1.375rem',
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    color: item.danger
      ? tokens.colorError
      : isSelected
        ? (userItemColor ?? tokens.colorPrimary)
        : (userItemColor ?? tokens.colorText),
    backgroundColor: isSelected && !isHorizontal
      ? (userItemBg ?? tokens.colorPrimaryLight)
      : 'transparent',
    opacity: item.disabled ? 0.5 : 1,
    transition: 'color 0.2s, background-color 0.2s',
    listStyle: 'none',
    position: 'relative',
    whiteSpace: 'nowrap',
    ...itemStyleWithoutBg,
  }

  // Indent for inline mode
  if (isInline && !collapsed) {
    baseStyle.paddingLeft = 16 + ctx.inlineIndent * level
  }

  // Collapsed mode: center icon
  if (collapsed) {
    baseStyle.justifyContent = 'center'
    baseStyle.padding = '0.5rem 0'
  }

  // Selected border for vertical
  if (isSelected && isVertical) {
    baseStyle.borderRight = `3px solid ${userItemColor ?? tokens.colorPrimary}`
  }

  // Selected border for horizontal
  if (isSelected && isHorizontal) {
    baseStyle.borderBottom = `2px solid ${userItemColor ?? tokens.colorPrimary}`
  }

  const handleMouseEnter = (e: ReactMouseEvent<HTMLLIElement>) => {
    if (item.disabled) return
    const el = e.currentTarget as HTMLElement
    if (!isSelected || isHorizontal) {
      el.style.backgroundColor = item.danger ? tokens.colorErrorBg : tokens.colorBgMuted
    }
    if (isHorizontal && !isSelected) {
      el.style.color = item.danger ? tokens.colorError : (userItemColor ?? tokens.colorPrimary)
    }
  }

  const handleMouseLeave = (e: ReactMouseEvent<HTMLLIElement>) => {
    const el = e.currentTarget as HTMLElement
    if (isSelected && !isHorizontal) {
      el.style.backgroundColor = userItemBg ?? tokens.colorPrimaryLight
    } else {
      el.style.backgroundColor = 'transparent'
    }
    if (isHorizontal && !isSelected) {
      el.style.color = item.danger ? tokens.colorError : (userItemColor ?? tokens.colorText)
    }
  }

  const handleClick = (e: ReactMouseEvent) => {
    if (item.disabled) return
    ctx.onItemClick(item, fullKeyPath, e)
  }

  const innerContent = (
    <>
      {item.icon && (
        <span style={{ display: 'inline-flex', flexShrink: 0, fontSize: '0.875rem' }}>{item.icon}</span>
      )}
      {(!collapsed || !item.icon) && (
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
      )}
    </>
  )

  return (
    <li
      role="menuitem"
      style={baseStyle}
      className={ctx.classNames?.item}
      title={!collapsed ? item.title : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {collapsed && item.title ? (
        <Tooltip content={item.title} position="right" delay={100}>
          {innerContent}
        </Tooltip>
      ) : innerContent}
    </li>
  )
}

// ============================================================================
// SubMenu
// ============================================================================

function SubMenu({
  item,
  ctx,
  level,
  keyPath,
}: {
  item: SubMenuOption
  ctx: MenuContextValue
  level: number
  keyPath: string[]
}) {
  const popupRef = useRef<HTMLUListElement>(null)
  const isOpen = ctx.openKeys.includes(item.key)
  const isHorizontal = ctx.mode === 'horizontal'
  const isInline = ctx.mode === 'inline'
  const isVertical = ctx.mode === 'vertical'
  const collapsed = isInline && ctx.inlineCollapsed
  const usePopup = isHorizontal || isVertical || collapsed

  const fullKeyPath = [item.key, ...keyPath]

  // Does any child (recursively) match selectedKeys?
  const hasSelectedChild = hasSelectedDescendant(item.children, ctx.selectedKeys)

  // Trigger style
  const triggerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: isHorizontal ? '0 1.25rem' : '0.5rem 1rem',
    lineHeight: isHorizontal ? '2.875rem' : '1.375rem',
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    color: hasSelectedChild ? tokens.colorPrimary : tokens.colorText,
    opacity: item.disabled ? 0.5 : 1,
    transition: 'color 0.2s, background-color 0.2s',
    listStyle: 'none',
    position: 'relative',
    whiteSpace: 'nowrap',
    ...ctx.styles?.item,
  }

  if (isInline && !collapsed) {
    triggerStyle.paddingLeft = 16 + ctx.inlineIndent * level
  }

  if (collapsed) {
    triggerStyle.justifyContent = 'center'
    triggerStyle.padding = '0.5rem 0'
  }

  // Selected indicator on horizontal for submenu with selected child
  if (hasSelectedChild && isHorizontal) {
    triggerStyle.borderBottom = `2px solid ${tokens.colorPrimary}`
  }

  const handleTriggerMouseEnter = (e: ReactMouseEvent<HTMLElement>) => {
    if (item.disabled) return
    ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
    if (isHorizontal) {
      ;(e.currentTarget as HTMLElement).style.color = tokens.colorPrimary
    }
  }

  const handleTriggerMouseLeave = (e: ReactMouseEvent<HTMLElement>) => {
    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
    if (isHorizontal && !hasSelectedChild) {
      ;(e.currentTarget as HTMLElement).style.color = tokens.colorText
    }
  }

  const handleTriggerClick = (e: ReactMouseEvent) => {
    if (item.disabled) return
    e.stopPropagation()
    if (ctx.triggerSubMenuAction === 'click' || isInline) {
      ctx.onSubMenuToggle(item.key)
    }
  }

  // Hover handlers for popup submenus
  const handleWrapperMouseEnter = () => {
    if (item.disabled || !usePopup) return
    if (ctx.triggerSubMenuAction === 'hover') {
      ctx.onSubMenuMouseEnter(item.key)
    }
  }

  const handleWrapperMouseLeave = () => {
    if (!usePopup) return
    if (ctx.triggerSubMenuAction === 'hover') {
      ctx.onSubMenuMouseLeave(item.key)
    }
  }

  // Expand icon
  const expandIconContent = ctx.expandIcon ?? (
    usePopup
      ? (isHorizontal ? <ChevronDownIcon /> : <ChevronRightIcon />)
      : <ChevronDownIcon />
  )

  const expandIconStyle: CSSProperties = {
    display: 'inline-flex',
    marginLeft: 'auto',
    transition: 'transform 0.2s',
    transform: isOpen && !usePopup ? 'rotate(180deg)' : 'rotate(0deg)',
  }

  // Popup submenu styles
  const popupStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1050,
    listStyle: 'none',
    margin: 0,
    padding: '0.25rem 0',
    minWidth: '10rem',
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    boxShadow: tokens.shadowMd,
    ...(isHorizontal
      ? { top: '100%', left: 0, marginTop: '0.25rem' }
      : { left: '100%', top: 0, marginLeft: '0.25rem' }),
    ...ctx.styles?.submenu,
  }

  // Inline submenu: expand/collapse with transition
  const inlineSubmenuStyle: CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    transition: 'max-height 0.2s ease, opacity 0.2s ease',
    maxHeight: isOpen ? 1000 : 0,
    opacity: isOpen ? 1 : 0,
    ...ctx.styles?.submenu,
  }

  return (
    <li
      role="none"
      style={{ listStyle: 'none', position: usePopup ? 'relative' : undefined }}
      onMouseEnter={handleWrapperMouseEnter}
      onMouseLeave={handleWrapperMouseLeave}
    >
      <div
        role="menuitem"
        aria-expanded={isOpen}
        style={triggerStyle}
        className={ctx.classNames?.item}
        onClick={handleTriggerClick}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
      >
        {item.icon && (
          <span style={{ display: 'inline-flex', flexShrink: 0, fontSize: '0.875rem' }}>{item.icon}</span>
        )}
        {(!collapsed || !item.icon) && (
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
        )}
        {(!collapsed || !item.icon) && (
          <span style={expandIconStyle}>{expandIconContent}</span>
        )}
      </div>

      {/* Popup submenu (vertical/horizontal/collapsed) */}
      {usePopup && isOpen && (
        <ul
          ref={popupRef}
          role="menu"
          style={popupStyle}
          className={ctx.classNames?.submenu}
        >
          {item.children.map((child) => (
            <MenuItemRenderer
              key={getItemKey(child)}
              item={child}
              ctx={ctx}
              level={0}
              keyPath={fullKeyPath}
            />
          ))}
        </ul>
      )}

      {/* Inline submenu */}
      {!usePopup && (
        <ul
          role="menu"
          style={inlineSubmenuStyle}
          className={ctx.classNames?.submenu}
        >
          {item.children.map((child) => (
            <MenuItemRenderer
              key={getItemKey(child)}
              item={child}
              ctx={ctx}
              level={level + 1}
              keyPath={fullKeyPath}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

// ============================================================================
// Helpers
// ============================================================================

function getItemKey(item: MenuItemType): string {
  if ('key' in item && item.key != null) return String(item.key)
  if (isDivider(item)) return `divider-${Math.random()}`
  if (isGroup(item)) return `group-${Math.random()}`
  return `item-${Math.random()}`
}

function hasSelectedDescendant(items: MenuItemType[], selectedKeys: string[]): boolean {
  for (const item of items) {
    if (!isDivider(item) && !isGroup(item) && 'key' in item && selectedKeys.includes(item.key)) {
      return true
    }
    if (isSubMenu(item) && hasSelectedDescendant(item.children, selectedKeys)) {
      return true
    }
    if (isGroup(item) && hasSelectedDescendant(item.children, selectedKeys)) {
      return true
    }
  }
  return false
}

// ============================================================================
// MenuItemRenderer (dispatch)
// ============================================================================

function MenuItemRenderer({
  item,
  ctx,
  level,
  keyPath,
}: {
  item: MenuItemType
  ctx: MenuContextValue
  level: number
  keyPath: string[]
}) {
  if (isDivider(item)) {
    return <MenuDivider item={item} ctx={ctx} />
  }
  if (isGroup(item)) {
    return <MenuGroup item={item} ctx={ctx} level={level} />
  }
  if (isSubMenu(item)) {
    return <SubMenu item={item} ctx={ctx} level={level} keyPath={keyPath} />
  }
  return <MenuItemLeaf item={item as MenuItemOption} ctx={ctx} level={level} keyPath={keyPath} />
}

// ============================================================================
// Menu Component
// ============================================================================

export function Menu({
  items = [],
  mode = 'vertical',
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys = [],
  openKeys: controlledOpenKeys,
  defaultOpenKeys = [],
  multiple = false,
  selectable = true,
  inlineCollapsed = false,
  inlineIndent = 24,
  triggerSubMenuAction = 'hover',
  onClick,
  onSelect,
  onDeselect,
  onOpenChange,
  expandIcon,
  className,
  style,
  classNames,
  styles,
}: MenuProps) {
  // Selected keys state (controlled / uncontrolled)
  const [internalSelectedKeys, setInternalSelectedKeys] = useState(defaultSelectedKeys)
  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys

  // Open keys state (controlled / uncontrolled)
  const [internalOpenKeys, setInternalOpenKeys] = useState(defaultOpenKeys)
  const openKeys = controlledOpenKeys ?? internalOpenKeys

  // Hover timeouts for popup submenus
  const hoverTimeouts = useRef<Map<string, number>>(new Map())

  // Cleanup hover timeouts
  useEffect(() => {
    return () => {
      hoverTimeouts.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  // Track latest openKeys in a ref so timeouts always see current state
  const openKeysRef = useRef(openKeys)
  openKeysRef.current = openKeys

  const setOpenKeysHelper = (keys: string[]) => {
    if (controlledOpenKeys === undefined) {
      setInternalOpenKeys(keys)
    }
    onOpenChange?.(keys)
  }

  const handleItemClick = (item: MenuItemOption, keyPath: string[], e: ReactMouseEvent) => {
    const info: MenuClickInfo = { key: item.key, keyPath, domEvent: e }

    // Individual item onClick
    item.onClick?.(info)

    // Global onClick
    onClick?.(info)

    // Selection
    if (selectable) {
      const isCurrentlySelected = selectedKeys.includes(item.key)

      let newSelectedKeys: string[]
      if (multiple) {
        if (isCurrentlySelected) {
          newSelectedKeys = selectedKeys.filter((k) => k !== item.key)
          onDeselect?.({ ...info, selectedKeys: newSelectedKeys })
        } else {
          newSelectedKeys = [...selectedKeys, item.key]
          onSelect?.({ ...info, selectedKeys: newSelectedKeys })
        }
      } else {
        newSelectedKeys = [item.key]
        if (!isCurrentlySelected) {
          onSelect?.({ ...info, selectedKeys: newSelectedKeys })
        }
      }

      if (controlledSelectedKeys === undefined) {
        setInternalSelectedKeys(newSelectedKeys)
      }
    }
  }

  const handleSubMenuToggle = (key: string) => {
    const current = openKeysRef.current
    const isOpen = current.includes(key)
    if (isOpen) {
      setOpenKeysHelper(current.filter((k) => k !== key))
    } else {
      setOpenKeysHelper([...current, key])
    }
  }

  const handleSubMenuMouseEnter = (key: string) => {
    // Immediately close any submenus that have pending leave timeouts (siblings being left)
    const keysToClose = new Set<string>()
    hoverTimeouts.current.forEach((t, k) => {
      clearTimeout(t)
      keysToClose.add(k)
    })
    hoverTimeouts.current.clear()

    const current = openKeysRef.current
    let newKeys = current.filter((k) => !keysToClose.has(k))
    if (!newKeys.includes(key)) {
      newKeys = [...newKeys, key]
    }
    setOpenKeysHelper(newKeys)
  }

  const handleSubMenuMouseLeave = (key: string) => {
    const t = window.setTimeout(() => {
      // Use ref to get latest openKeys, not stale closure
      const current = openKeysRef.current
      setOpenKeysHelper(current.filter((k) => k !== key))
      hoverTimeouts.current.delete(key)
    }, 150)
    hoverTimeouts.current.set(key, t)
  }

  const ctx: MenuContextValue = {
    mode,
    selectedKeys,
    openKeys,
    inlineCollapsed,
    inlineIndent,
    triggerSubMenuAction,
    expandIcon,
    selectable,
    multiple,
    classNames,
    styles,
    onItemClick: handleItemClick,
    onSubMenuToggle: handleSubMenuToggle,
    onSubMenuMouseEnter: handleSubMenuMouseEnter,
    onSubMenuMouseLeave: handleSubMenuMouseLeave,
  }

  // Root styles
  const isHorizontal = mode === 'horizontal'
  const isInline = mode === 'inline'

  const rootBaseStyle: CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: isHorizontal ? 0 : '0.25rem 0',
    backgroundColor: tokens.colorBg,
    color: tokens.colorText,
    fontSize: '0.875rem',
    overflow: 'hidden',
    ...(isHorizontal
      ? {
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${tokens.colorBorder}`,
        }
      : {
          borderRight: `1px solid ${tokens.colorBorder}`,
        }),
    ...(isInline && inlineCollapsed
      ? { width: '3rem', overflow: 'hidden' }
      : {}),
  }

  const rootStyle = mergeSemanticStyle(rootBaseStyle, styles?.root, style)

  return (
    <ul
      role={isHorizontal ? 'menubar' : 'menu'}
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      {items.map((item) => (
        <MenuItemRenderer
          key={getItemKey(item)}
          item={item}
          ctx={ctx}
          level={0}
          keyPath={[]}
        />
      ))}
    </ul>
  )
}
