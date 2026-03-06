import { createContext, useContext, useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

// ============================================================================
// Types
// ============================================================================

export type SiderTheme = 'light' | 'dark'
export type SiderBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface LayoutProps {
  /** Contenido del layout */
  children?: ReactNode
  /** Tiene Sider como hijo directo */
  hasSider?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

export interface HeaderProps {
  /** Contenido del header */
  children?: ReactNode
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

export interface FooterProps {
  /** Contenido del footer */
  children?: ReactNode
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

export interface ContentProps {
  /** Contenido principal */
  children?: ReactNode
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
}

export type SiderSemanticSlot = 'root' | 'content' | 'trigger'
export type SiderClassNames = SemanticClassNames<SiderSemanticSlot>
export type SiderStyles = SemanticStyles<SiderSemanticSlot>

export interface SiderProps {
  /** Contenido del sider */
  children?: ReactNode
  /** Ancho del sider en px */
  width?: number | string
  /** Ancho cuando está colapsado */
  collapsedWidth?: number
  /** Puede colapsarse */
  collapsible?: boolean
  /** Estado colapsado (controlado) */
  collapsed?: boolean
  /** Estado colapsado inicial */
  defaultCollapsed?: boolean
  /** Invertir dirección de la flecha del trigger */
  reverseArrow?: boolean
  /** Breakpoint para colapsar automáticamente */
  breakpoint?: SiderBreakpoint
  /** Tema del sider */
  theme?: SiderTheme
  /** Trigger personalizado, null para ocultar */
  trigger?: ReactNode | null
  /** Callback cuando cambia el estado */
  onCollapse?: (collapsed: boolean, type: 'clickTrigger' | 'responsive') => void
  /** Callback cuando se activa el breakpoint */
  onBreakpoint?: (broken: boolean) => void
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: SiderClassNames
  /** Estilos para partes internas del componente */
  styles?: SiderStyles
}

// ============================================================================
// Constants
// ============================================================================

const breakpointValues: Record<SiderBreakpoint, number> = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

// ============================================================================
// Context
// ============================================================================

interface SiderContextValue {
  siderCollapsed: boolean
}

const SiderContext = createContext<SiderContextValue>({ siderCollapsed: false })

// ============================================================================
// Layout Component
// ============================================================================

function LayoutComponent({
  children,
  hasSider,
  className,
  style,
}: LayoutProps) {
  const rootClass = cx(
    'ino-layout',
    { 'ino-layout--has-sider': hasSider },
    className,
  )

  return (
    <div className={rootClass} style={style}>
      {children}
    </div>
  )
}

// ============================================================================
// Header Component
// ============================================================================

function Header({
  children,
  className,
  style,
}: HeaderProps) {
  return (
    <header className={cx('ino-layout__header', className)} style={style}>
      {children}
    </header>
  )
}

// ============================================================================
// Footer Component
// ============================================================================

function Footer({
  children,
  className,
  style,
}: FooterProps) {
  return (
    <footer className={cx('ino-layout__footer', className)} style={style}>
      {children}
    </footer>
  )
}

// ============================================================================
// Content Component
// ============================================================================

function Content({
  children,
  className,
  style,
}: ContentProps) {
  return (
    <main className={cx('ino-layout__content', className)} style={style}>
      {children}
    </main>
  )
}

// ============================================================================
// Sider Component
// ============================================================================

function Sider({
  children,
  width = 200,
  collapsedWidth = 80,
  collapsible = false,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  reverseArrow = false,
  breakpoint,
  theme = 'dark',
  trigger,
  onCollapse,
  onBreakpoint,
  className,
  style,
  classNames,
  styles,
}: SiderProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const [broken, setBroken] = useState(false)

  // Determinar si es controlado o no
  const isControlled = controlledCollapsed !== undefined
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed

  // Manejar responsive breakpoint
  useEffect(() => {
    if (!breakpoint || typeof window === 'undefined') return

    const handleResize = () => {
      const shouldBreak = window.innerWidth < breakpointValues[breakpoint]

      if (shouldBreak !== broken) {
        setBroken(shouldBreak)
        onBreakpoint?.(shouldBreak)

        if (shouldBreak && !collapsed) {
          if (!isControlled) {
            setInternalCollapsed(true)
          }
          onCollapse?.(true, 'responsive')
        } else if (!shouldBreak && collapsed && broken) {
          if (!isControlled) {
            setInternalCollapsed(false)
          }
          onCollapse?.(false, 'responsive')
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint, broken, collapsed, isControlled, onBreakpoint, onCollapse])

  const handleTriggerClick = () => {
    const newCollapsed = !collapsed
    if (!isControlled) {
      setInternalCollapsed(newCollapsed)
    }
    onCollapse?.(newCollapsed, 'clickTrigger')
  }

  const currentWidth = collapsed ? collapsedWidth : (typeof width === 'number' ? width : parseInt(width))

  // Dynamic: sider width must stay inline
  const siderDynamicStyle: CSSProperties = {
    flex: `0 0 ${currentWidth}px`,
    maxWidth: currentWidth,
    minWidth: currentWidth,
    width: currentWidth,
    ...styles?.root,
    ...style,
  }

  const siderClass = cx(
    'ino-layout__sider',
    `ino-layout__sider--${theme}`,
    className,
    classNames?.root,
  )

  // Renderizar trigger
  const renderTrigger = () => {
    if (!collapsible) return null
    if (trigger === null) return null

    // Si collapsedWidth es 0, mostrar trigger especial fuera del sider
    if (collapsedWidth === 0 && collapsed) {
      const triggerClass = cx(
        'ino-layout__sider-trigger',
        'ino-layout__sider-trigger--zero',
        `ino-layout__sider-trigger--${theme}`,
        classNames?.trigger,
      )

      return (
        <div className={triggerClass} style={styles?.trigger} onClick={handleTriggerClick}>
          {trigger || <DefaultTriggerIcon collapsed={collapsed} reverseArrow={reverseArrow} />}
        </div>
      )
    }

    const triggerClass = cx(
      'ino-layout__sider-trigger',
      `ino-layout__sider-trigger--${theme}`,
      classNames?.trigger,
    )

    return (
      <div className={triggerClass} style={styles?.trigger} onClick={handleTriggerClick}>
        {trigger || <DefaultTriggerIcon collapsed={collapsed} reverseArrow={reverseArrow} />}
      </div>
    )
  }

  return (
    <SiderContext.Provider value={{ siderCollapsed: collapsed }}>
      <aside className={siderClass} style={siderDynamicStyle}>
        <div className={cx('ino-layout__sider-content', classNames?.content)} style={styles?.content}>
          {children}
        </div>
        {renderTrigger()}
      </aside>
    </SiderContext.Provider>
  )
}

// ============================================================================
// Default Trigger Icon
// ============================================================================

function DefaultTriggerIcon({ collapsed, reverseArrow }: { collapsed: boolean; reverseArrow: boolean }) {
  const shouldPointRight = reverseArrow ? collapsed : !collapsed

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('ino-layout__trigger-icon', { 'ino-layout__trigger-icon--collapsed': shouldPointRight })}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

// ============================================================================
// Hook para usar contexto del Sider
// ============================================================================

export function useSider() {
  return useContext(SiderContext)
}

// ============================================================================
// Layout namespace
// ============================================================================

export const Layout = Object.assign(LayoutComponent, {
  Header,
  Footer,
  Content,
  Sider,
})

// También exportar individualmente para flexibilidad
export { Header, Footer, Content, Sider }
