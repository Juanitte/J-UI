import { type ReactNode, type CSSProperties, type MouseEvent, useState, Fragment } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export type BreadcrumbSemanticSlot = 'root' | 'list' | 'item' | 'separator' | 'link' | 'overlay'
export type BreadcrumbClassNames = SemanticClassNames<BreadcrumbSemanticSlot>
export type BreadcrumbStyles = SemanticStyles<BreadcrumbSemanticSlot>

export interface BreadcrumbMenuItemType {
  /** Clave única del item */
  key: string
  /** Texto del item */
  title: ReactNode
  /** URL del item */
  href?: string
  /** Icono del item */
  icon?: ReactNode
  /** Handler de click */
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => void
}

export interface BreadcrumbItemType {
  /** Texto/contenido del item */
  title?: ReactNode
  /** URL (renderiza como <a>) */
  href?: string
  /** Segmento de path (se acumulan para itemRender) */
  path?: string
  /** Icono antes del título */
  icon?: ReactNode
  /** Handler de click */
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => void
  /** Clase CSS individual */
  className?: string
  /** Estilos inline individuales */
  style?: CSSProperties
  /** Dropdown menu */
  menu?: { items: BreadcrumbMenuItemType[] }
}

export interface BreadcrumbProps {
  /** Items del breadcrumb */
  items?: BreadcrumbItemType[]
  /** Separador entre items (default: "/") */
  separator?: ReactNode
  /** Render personalizado de cada item */
  itemRender?: (
    item: BreadcrumbItemType,
    params: Record<string, string> | undefined,
    items: BreadcrumbItemType[],
    paths: string[],
  ) => ReactNode
  /** Parámetros de ruta */
  params?: Record<string, string>
  /** Clase CSS del contenedor */
  className?: string
  /** Estilos inline del contenedor */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: BreadcrumbClassNames
  /** Estilos para partes internas del componente */
  styles?: BreadcrumbStyles
}

// ============================================================================
// Chevron Icon
// ============================================================================

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginLeft: '0.125rem' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ============================================================================
// BreadcrumbOverlay (dropdown menu)
// ============================================================================

function BreadcrumbOverlay({
  items,
  style,
  className,
}: {
  items: BreadcrumbMenuItemType[]
  style?: CSSProperties
  className?: string
}) {
  const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '0.25rem',
    minWidth: '7.5rem',
    backgroundColor: tokens.colorBg,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: '0.375rem',
    boxShadow: tokens.shadowMd,
    padding: '0.25rem 0',
    zIndex: 1050,
    maxHeight: 'min(16rem, 40vh)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    ...style,
  }

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.625rem 0.75rem',
    minHeight: '2.75rem',
    fontSize: '0.875rem',
    color: tokens.colorText,
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
  }

  return (
    <div style={overlayStyle} className={className}>
      {items.map((menuItem) => {
        const content = (
          <>
            {menuItem.icon && (
              <span style={{ display: 'inline-flex', fontSize: '0.875rem' }}>{menuItem.icon}</span>
            )}
            {menuItem.title}
          </>
        )

        if (menuItem.href) {
          return (
            <a
              key={menuItem.key}
              href={menuItem.href}
              style={itemStyle}
              onClick={menuItem.onClick}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }}
            >
              {content}
            </a>
          )
        }

        return (
          <span
            key={menuItem.key}
            style={itemStyle}
            onClick={menuItem.onClick}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = tokens.colorBgMuted
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
          >
            {content}
          </span>
        )
      })}
    </div>
  )
}

// ============================================================================
// Breadcrumb Component
// ============================================================================

export function Breadcrumb({
  items = [],
  separator = '/',
  itemRender,
  params,
  className,
  style,
  classNames,
  styles,
}: BreadcrumbProps) {
  const [hoveredMenuIndex, setHoveredMenuIndex] = useState<number | null>(null)

  // Construir paths acumulativos
  const paths: string[] = []
  items.forEach((item) => {
    if (item.path) {
      paths.push((paths.length > 0 ? paths[paths.length - 1] + '/' : '') + item.path)
    } else {
      paths.push(paths.length > 0 ? paths[paths.length - 1] : '')
    }
  })

  const navStyle = mergeSemanticStyle(
    {
      fontSize: '0.875rem',
      color: tokens.colorTextMuted,
    },
    styles?.root,
    style,
  )

  const listStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    ...styles?.list,
  }

  const renderItemContent = (item: BreadcrumbItemType, index: number) => {
    const isLast = index === items.length - 1

    // Si hay itemRender personalizado
    if (itemRender) {
      return itemRender(item, params, items, paths)
    }

    const content = (
      <>
        {item.icon && (
          <span style={{ display: 'inline-flex', marginRight: item.title ? '0.25rem' : 0, fontSize: '0.875rem' }}>
            {item.icon}
          </span>
        )}
        {item.title}
        {item.menu && <ChevronDownIcon />}
      </>
    )

    const linkBaseStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    }

    // Color por defecto para links y color del hover
    const defaultLinkColor = styles?.link?.color as string | undefined
    const linkColor = defaultLinkColor ?? tokens.colorTextMuted
    const linkHoverColor = defaultLinkColor ?? tokens.colorPrimary
    const lastItemColor = defaultLinkColor ?? tokens.colorText

    // Último item: no clickable, color más oscuro
    if (isLast) {
      return (
        <span
          style={{
            ...linkBaseStyle,
            color: lastItemColor,
            fontWeight: 500,
            ...styles?.link,
            ...item.style,
          }}
          className={mergeSemanticClassName(item.className, classNames?.link)}
        >
          {content}
        </span>
      )
    }

    // Items con href: renderizar como <a>
    if (item.href) {
      return (
        <a
          href={item.href}
          style={{
            ...linkBaseStyle,
            color: linkColor,
            cursor: 'pointer',
            ...styles?.link,
            ...item.style,
          }}
          className={mergeSemanticClassName(item.className, classNames?.link)}
          onClick={item.onClick}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = linkHoverColor
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = linkColor
          }}
        >
          {content}
        </a>
      )
    }

    // Items con onClick pero sin href
    if (item.onClick) {
      return (
        <span
          style={{
            ...linkBaseStyle,
            color: linkColor,
            cursor: 'pointer',
            ...styles?.link,
            ...item.style,
          }}
          className={mergeSemanticClassName(item.className, classNames?.link)}
          onClick={item.onClick}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = linkHoverColor
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = linkColor
          }}
        >
          {content}
        </span>
      )
    }

    // Item sin interacción
    return (
      <span
        style={{
          ...linkBaseStyle,
          color: linkColor,
          ...styles?.link,
          ...item.style,
        }}
        className={mergeSemanticClassName(item.className, classNames?.link)}
      >
        {content}
      </span>
    )
  }

  return (
    <nav
      aria-label="breadcrumb"
      style={navStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
    >
      <ol style={listStyle} className={classNames?.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const hasMenu = item.menu && item.menu.items.length > 0

          return (
            <Fragment key={index}>
              {/* Item */}
              <li
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  position: hasMenu ? 'relative' : undefined,
                  ...styles?.item,
                }}
                className={classNames?.item}
                aria-current={isLast ? 'page' : undefined}
                onMouseEnter={hasMenu ? () => setHoveredMenuIndex(index) : undefined}
                onMouseLeave={hasMenu ? () => setHoveredMenuIndex(null) : undefined}
              >
                {renderItemContent(item, index)}

                {/* Dropdown overlay */}
                {hasMenu && hoveredMenuIndex === index && (
                  <BreadcrumbOverlay
                    items={item.menu!.items}
                    style={styles?.overlay}
                    className={classNames?.overlay}
                  />
                )}
              </li>

              {/* Separator */}
              {!isLast && (
                <li
                  aria-hidden="true"
                  style={{
                    margin: '0 0.5rem',
                    color: tokens.colorTextSubtle,
                    userSelect: 'none',
                    ...styles?.separator,
                  }}
                  className={classNames?.separator}
                >
                  {separator}
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
