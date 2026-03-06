import {
  type ReactNode,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useState,
  useRef,
  useEffect,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
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
  return (
    <li
      role="separator"
      className={cx(
        'ino-menu__divider',
        { 'ino-menu__divider--dashed': item.dashed },
        ctx.classNames?.divider,
      )}
      style={ctx.styles?.divider}
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
  // Dynamic: inline indent
  const titleDynamicStyle: CSSProperties = {
    ...(ctx.mode === 'inline' && !ctx.inlineCollapsed
      ? { paddingLeft: 16 + ctx.inlineIndent * level }
      : {}),
    ...ctx.styles?.groupTitle,
  }

  return (
    <li
      role="presentation"
      className={cx('ino-menu__group', ctx.classNames?.group)}
      style={ctx.styles?.group}
    >
      <div className={cx('ino-menu__group-title', ctx.classNames?.groupTitle)} style={titleDynamicStyle}>
        {item.label}
      </div>
      <ul role="group" className="ino-menu__group-list">
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

  const itemClass = cx(
    'ino-menu__item',
    {
      'ino-menu__item--horizontal': isHorizontal,
      'ino-menu__item--vertical': isVertical,
      'ino-menu__item--disabled': item.disabled,
      'ino-menu__item--danger': item.danger,
      'ino-menu__item--selected': isSelected,
      'ino-menu__item--collapsed': collapsed,
    },
    ctx.classNames?.item,
  )

  // Dynamic: inline indent stays inline
  const itemDynamicStyle: CSSProperties = {
    ...(isInline && !collapsed ? { paddingLeft: 16 + ctx.inlineIndent * level } : {}),
    ...ctx.styles?.item,
  }

  const handleClick = (e: ReactMouseEvent) => {
    if (item.disabled) return
    ctx.onItemClick(item, fullKeyPath, e)
  }

  const innerContent = (
    <>
      {item.icon && (
        <span className="ino-menu__item-icon">{item.icon}</span>
      )}
      {(!collapsed || !item.icon) && (
        <span className="ino-menu__item-label">{item.label}</span>
      )}
    </>
  )

  return (
    <li
      role="menuitem"
      className={itemClass}
      style={itemDynamicStyle}
      title={!collapsed ? item.title : undefined}
      onClick={handleClick}
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

  const triggerClass = cx(
    'ino-menu__submenu-trigger',
    {
      'ino-menu__submenu-trigger--horizontal': isHorizontal,
      'ino-menu__submenu-trigger--disabled': item.disabled,
      'ino-menu__submenu-trigger--active': hasSelectedChild,
      'ino-menu__submenu-trigger--collapsed': collapsed,
    },
    ctx.classNames?.item,
  )

  // Dynamic: inline indent
  const triggerDynamicStyle: CSSProperties = {
    ...(isInline && !collapsed ? { paddingLeft: 16 + ctx.inlineIndent * level } : {}),
    ...ctx.styles?.item,
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

  const expandIconClass = cx(
    'ino-menu__expand-icon',
    { 'ino-menu__expand-icon--open': isOpen && !usePopup },
  )

  const popupClass = cx(
    'ino-menu__submenu-popup',
    isHorizontal ? 'ino-menu__submenu-popup--horizontal' : 'ino-menu__submenu-popup--vertical',
    ctx.classNames?.submenu,
  )

  const inlineClass = cx(
    'ino-menu__submenu-inline',
    isOpen ? 'ino-menu__submenu-inline--open' : 'ino-menu__submenu-inline--closed',
    ctx.classNames?.submenu,
  )

  return (
    <li
      role="none"
      className={cx('ino-menu__submenu-wrapper', { 'ino-menu__submenu-wrapper--popup': usePopup })}
      onMouseEnter={handleWrapperMouseEnter}
      onMouseLeave={handleWrapperMouseLeave}
    >
      <div
        role="menuitem"
        aria-expanded={isOpen}
        className={triggerClass}
        style={triggerDynamicStyle}
        onClick={handleTriggerClick}
      >
        {item.icon && (
          <span className="ino-menu__item-icon">{item.icon}</span>
        )}
        {(!collapsed || !item.icon) && (
          <span className="ino-menu__item-label">{item.label}</span>
        )}
        {(!collapsed || !item.icon) && (
          <span className={expandIconClass}>{expandIconContent}</span>
        )}
      </div>

      {/* Popup submenu (vertical/horizontal/collapsed) */}
      {usePopup && isOpen && (
        <ul
          ref={popupRef}
          role="menu"
          className={popupClass}
          style={ctx.styles?.submenu}
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
          className={inlineClass}
          style={ctx.styles?.submenu}
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

  const rootClass = cx(
    'ino-menu',
    `ino-menu--${mode}`,
    { 'ino-menu--collapsed': isInline && inlineCollapsed },
    className,
    classNames?.root,
  )

  const rootDynamicStyle: CSSProperties = {
    ...styles?.root,
    ...style,
  }

  return (
    <ul
      role={isHorizontal ? 'menubar' : 'menu'}
      className={rootClass}
      style={rootDynamicStyle}
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
