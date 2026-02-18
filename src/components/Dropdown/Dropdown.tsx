import {
  type ReactNode,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'
import { Button } from '../Button'
import type { ButtonVariant, ButtonSize, ButtonColor } from '../Button/Button'

// ============================================================================
// Types
// ============================================================================

export type DropdownPlacement = 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight'
export type DropdownTrigger = 'hover' | 'click' | 'contextMenu'

export type DropdownSemanticSlot = 'root' | 'overlay' | 'item' | 'arrow'
export type DropdownClassNames = SemanticClassNames<DropdownSemanticSlot>
export type DropdownStyles = SemanticStyles<DropdownSemanticSlot>

export interface DropdownMenuItemType {
  /** Clave única */
  key: string
  /** Contenido del item */
  label?: ReactNode
  /** Icono a la izquierda */
  icon?: ReactNode
  /** Item deshabilitado */
  disabled?: boolean
  /** Estilo peligro (rojo) */
  danger?: boolean
  /** Handler individual */
  onClick?: (info: { key: string; domEvent: ReactMouseEvent }) => void
  /** Sub-menú */
  children?: DropdownMenuItemType[]
  /** Tipo especial: divider o group */
  type?: 'divider' | 'group'
  /** Título del grupo (cuando type: 'group') */
  title?: ReactNode
}

export interface DropdownMenuConfig {
  /** Items del menú */
  items: DropdownMenuItemType[]
  /** Handler global de click */
  onClick?: (info: { key: string; domEvent: ReactMouseEvent }) => void
}

export interface DropdownProps {
  /** Elemento trigger */
  children: ReactNode
  /** Configuración del menú */
  menu?: DropdownMenuConfig
  /** Tipo(s) de trigger */
  trigger?: DropdownTrigger[]
  /** Posición del menú */
  placement?: DropdownPlacement
  /** Mostrar flecha */
  arrow?: boolean
  /** Estado controlado */
  open?: boolean
  /** Callback al cambiar estado */
  onOpenChange?: (open: boolean) => void
  /** Desactivar dropdown */
  disabled?: boolean
  /** Render personalizado del overlay */
  dropdownRender?: (menu: ReactNode) => ReactNode
  /** Clase CSS del wrapper */
  className?: string
  /** Estilos del wrapper */
  style?: CSSProperties
  /** Clases para slots internos */
  classNames?: DropdownClassNames
  /** Estilos para slots internos */
  styles?: DropdownStyles
}

export interface DropdownButtonProps {
  /** Contenido del botón principal */
  children?: ReactNode
  /** Configuración del menú */
  menu?: DropdownMenuConfig
  /** Posición del menú */
  placement?: DropdownPlacement
  /** Tipo(s) de trigger */
  trigger?: DropdownTrigger[]
  /** Click en botón principal */
  onClick?: (e: ReactMouseEvent<HTMLButtonElement>) => void
  /** Icono del botón dropdown */
  icon?: ReactNode
  /** Desactivar ambos */
  disabled?: boolean
  /** Loading en botón principal */
  loading?: boolean
  /** Variante del botón */
  variant?: ButtonVariant
  /** Color del botón */
  color?: ButtonColor
  /** Tamaño */
  size?: ButtonSize
  /** Clase CSS del wrapper */
  className?: string
  /** Estilos del wrapper */
  style?: CSSProperties
  /** Clases para slots internos */
  classNames?: DropdownClassNames
  /** Estilos para slots internos */
  styles?: DropdownStyles
}

// ============================================================================
// Positioning
// ============================================================================

const placementPositionStyles: Record<DropdownPlacement, CSSProperties> = {
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: '0.25rem' },
  bottomLeft: { top: '100%', left: 0, paddingTop: '0.25rem' },
  bottomRight: { top: '100%', right: 0, paddingTop: '0.25rem' },
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: '0.25rem' },
  topLeft: { bottom: '100%', left: 0, paddingBottom: '0.25rem' },
  topRight: { bottom: '100%', right: 0, paddingBottom: '0.25rem' },
}

const arrowPositionStyles: Record<DropdownPlacement, CSSProperties> = {
  bottom: { top: -4, left: '50%', transform: 'translateX(-50%) rotate(-135deg)' },
  bottomLeft: { top: -4, left: 16, transform: 'rotate(-135deg)' },
  bottomRight: { top: -4, right: 16, transform: 'rotate(-135deg)' },
  top: { bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
  topLeft: { bottom: -4, left: 16, transform: 'rotate(45deg)' },
  topRight: { bottom: -4, right: 16, transform: 'rotate(45deg)' },
}

// Animation offsets based on placement direction
function getAnimationTransform(placement: DropdownPlacement, isAnimating: boolean): string {
  const offset = isAnimating ? 0 : 6
  const isTop = placement.startsWith('top')
  const baseTransform = placement === 'bottom' || placement === 'top' ? 'translateX(-50%) ' : ''
  return `${baseTransform}translateY(${isTop ? offset : -offset}px)`
}

// ============================================================================
// ChevronDown Icon
// ============================================================================

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ============================================================================
// DropdownMenu (internal)
// ============================================================================

function DropdownMenu({
  items,
  globalOnClick,
  onCloseDropdown,
  classNames,
  styles,
  isSubmenu = false,
}: {
  items: DropdownMenuItemType[]
  globalOnClick?: DropdownMenuConfig['onClick']
  onCloseDropdown: () => void
  classNames?: DropdownClassNames
  styles?: DropdownStyles
  isSubmenu?: boolean
}) {
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null)

  const menuStyle: CSSProperties = {
    minWidth: isSubmenu ? '8.75rem' : '10rem',
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.5rem',
    boxShadow: tokens.shadowMd,
    padding: '0.25rem 0',
    ...(isSubmenu ? {} : styles?.overlay),
  }

  const handleItemClick = (item: DropdownMenuItemType, e: ReactMouseEvent) => {
    if (item.disabled) return
    item.onClick?.({ key: item.key, domEvent: e })
    globalOnClick?.({ key: item.key, domEvent: e })
    onCloseDropdown()
  }

  return (
    <div style={menuStyle} className={!isSubmenu ? classNames?.overlay : undefined}>
      {items.map((item) => {
        // Divider
        if (item.type === 'divider') {
          return (
            <div
              key={item.key}
              style={{
                height: 1,
                margin: '0.25rem 0',
                backgroundColor: tokens.colorBorder,
              }}
            />
          )
        }

        // Group
        if (item.type === 'group') {
          return (
            <div key={item.key}>
              <div
                style={{
                  padding: '0.3125rem 0.75rem',
                  fontSize: '0.75rem',
                  color: tokens.colorTextSubtle,
                  fontWeight: 600,
                }}
              >
                {item.title}
              </div>
              {item.children?.map((child) => (
                <MenuItem
                  key={child.key}
                  item={child}
                  globalOnClick={globalOnClick}
                  onCloseDropdown={onCloseDropdown}
                  onItemClick={handleItemClick}
                  hoveredSubmenu={hoveredSubmenu}
                  setHoveredSubmenu={setHoveredSubmenu}
                  classNames={classNames}
                  styles={styles}
                />
              ))}
            </div>
          )
        }

        // Regular item
        return (
          <MenuItem
            key={item.key}
            item={item}
            globalOnClick={globalOnClick}
            onCloseDropdown={onCloseDropdown}
            onItemClick={handleItemClick}
            hoveredSubmenu={hoveredSubmenu}
            setHoveredSubmenu={setHoveredSubmenu}
            classNames={classNames}
            styles={styles}
          />
        )
      })}
    </div>
  )
}

// ============================================================================
// MenuItem (internal)
// ============================================================================

function MenuItem({
  item,
  globalOnClick,
  onCloseDropdown,
  onItemClick,
  hoveredSubmenu,
  setHoveredSubmenu,
  classNames,
  styles,
}: {
  item: DropdownMenuItemType
  globalOnClick?: DropdownMenuConfig['onClick']
  onCloseDropdown: () => void
  onItemClick: (item: DropdownMenuItemType, e: ReactMouseEvent) => void
  hoveredSubmenu: string | null
  setHoveredSubmenu: (key: string | null) => void
  classNames?: DropdownClassNames
  styles?: DropdownStyles
}) {
  const hasChildren = item.children && item.children.length > 0

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    minHeight: '2.75rem',
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    color: item.danger ? tokens.colorError : item.disabled ? tokens.colorTextSubtle : tokens.colorText,
    opacity: item.disabled ? 0.5 : 1,
    transition: 'background-color 0.15s ease',
    position: hasChildren ? 'relative' : undefined,
    ...styles?.item,
  }

  return (
    <div
      style={itemStyle}
      className={classNames?.item}
      onClick={!item.disabled && !hasChildren ? (e) => onItemClick(item, e) : undefined}
      onMouseEnter={(e) => {
        if (!item.disabled) {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = item.danger
            ? tokens.colorErrorBg
            : tokens.colorBgMuted
        }
        if (hasChildren) setHoveredSubmenu(item.key)
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
        if (hasChildren) setHoveredSubmenu(null)
      }}
    >
      {item.icon && (
        <span style={{ display: 'inline-flex', fontSize: '0.875rem' }}>{item.icon}</span>
      )}
      <span style={{ flex: 1 }}>{item.label}</span>
      {hasChildren && (
        <span style={{ display: 'inline-flex', marginLeft: '0.25rem' }}>
          <ChevronRightIcon />
        </span>
      )}

      {/* Submenu */}
      {hasChildren && hoveredSubmenu === item.key && (
        <div style={{ position: 'absolute', left: '100%', top: -4, paddingLeft: '0.25rem' }}>
          <DropdownMenu
            items={item.children!}
            globalOnClick={globalOnClick}
            onCloseDropdown={onCloseDropdown}
            classNames={classNames}
            styles={styles}
            isSubmenu
          />
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Dropdown Component
// ============================================================================

export function DropdownComponent({
  children,
  menu,
  trigger = ['hover'],
  placement = 'bottomLeft',
  arrow = false,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  dropdownRender,
  className,
  style,
  classNames,
  styles,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)
  const timeoutRef = useRef<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (disabled) return
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  // Show with animation
  const show = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    // Set initial direction from placement; useLayoutEffect will auto-correct if it overflows
    setResolvedPlacement(placement)
    timeoutRef.current = window.setTimeout(() => {
      setOpen(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    }, 100)
  }

  // Hide with animation
  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsAnimating(false)
    timeoutRef.current = window.setTimeout(() => {
      setOpen(false)
    }, 150)
  }

  const toggle = () => {
    if (isOpen) {
      hide()
    } else {
      show()
    }
  }

  // Auto-flip: measure real DOM and flip if it overflows
  useLayoutEffect(() => {
    if (!isOpen || !overlayRef.current || !rootRef.current) return
    const overlayRect = overlayRef.current.getBoundingClientRect()
    const rootRect = rootRef.current.getBoundingClientRect()
    const spaceAbove = rootRect.top
    const spaceBelow = window.innerHeight - rootRect.bottom
    const isTop = resolvedPlacement.startsWith('top')

    if (!isTop && overlayRect.bottom > window.innerHeight) {
      if (spaceAbove > spaceBelow) {
        setResolvedPlacement(p => p.replace('bottom', 'top').replace('Bottom', 'Top') as DropdownPlacement)
      }
    } else if (isTop && overlayRect.top < 0) {
      if (spaceBelow > spaceAbove) {
        setResolvedPlacement(p => p.replace('top', 'bottom').replace('Top', 'Bottom') as DropdownPlacement)
      }
    }
  })

  // Sync resolvedPlacement when placement prop changes
  useEffect(() => {
    setResolvedPlacement(placement)
  }, [placement])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Click outside to close
  useEffect(() => {
    if (!isOpen || !trigger.includes('click')) return

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        hide()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, trigger])

  // Context menu handler
  const handleContextMenu = (e: ReactMouseEvent) => {
    if (!trigger.includes('contextMenu')) return
    e.preventDefault()
    toggle()
  }

  // Hover handlers
  const handleMouseEnter = () => {
    if (trigger.includes('hover')) show()
  }

  const handleMouseLeave = () => {
    if (trigger.includes('hover')) hide()
  }

  // Click handler
  const handleClick = () => {
    if (trigger.includes('click')) toggle()
  }

  // Build overlay content
  const menuContent = menu ? (
    <DropdownMenu
      items={menu.items}
      globalOnClick={menu.onClick}
      onCloseDropdown={hide}
      classNames={classNames}
      styles={styles}
    />
  ) : null

  const overlayContent = dropdownRender ? dropdownRender(menuContent) : menuContent

  // Overlay container styles (includes padding for mouse bridge)
  const overlayContainerStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 1050,
    ...placementPositionStyles[resolvedPlacement],
    opacity: isAnimating ? 1 : 0,
    transform: getAnimationTransform(resolvedPlacement, isAnimating),
    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
  }

  // Arrow style
  const arrowBaseStyle: CSSProperties = {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: tokens.colorBg,
    borderRight: `1px solid ${tokens.colorBorder}`,
    borderBottom: `1px solid ${tokens.colorBorder}`,
    ...arrowPositionStyles[resolvedPlacement],
    ...styles?.arrow,
  }

  const rootStyle = mergeSemanticStyle(
    { position: 'relative', display: 'inline-flex' },
    styles?.root,
    style,
  )

  return (
    <div
      ref={rootRef}
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      <span onClick={handleClick} style={{ display: 'inline-flex' }}>
        {children}
      </span>

      {isOpen && (
        <div ref={overlayRef} style={overlayContainerStyle}>
          {arrow && <div style={arrowBaseStyle} className={classNames?.arrow} />}
          {overlayContent}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Dropdown.Button Component
// ============================================================================

function DropdownButton({
  children,
  menu,
  placement = 'bottomRight',
  trigger = ['hover'],
  onClick,
  icon,
  disabled = false,
  loading = false,
  variant = 'primary',
  color,
  size = 'md',
  className,
  style,
  classNames,
  styles,
}: DropdownButtonProps) {
  return (
    <div
      style={mergeSemanticStyle(
        { display: 'inline-flex', ...style },
        styles?.root,
      )}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      <Button
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        {children}
      </Button>
      <DropdownComponent
        menu={menu}
        trigger={trigger}
        placement={placement}
        disabled={disabled}
        classNames={classNames}
        styles={styles}
      >
        <Button
          variant={variant}
          color={color}
          size={size}
          disabled={disabled}
          icon={icon || <ChevronDownIcon />}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeft: `1px solid rgba(255,255,255,0.2)`,
            minWidth: 'auto',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
          }}
        />
      </DropdownComponent>
    </div>
  )
}

// ============================================================================
// Export with compound pattern
// ============================================================================

export const Dropdown = Object.assign(DropdownComponent, {
  Button: DropdownButton,
})
