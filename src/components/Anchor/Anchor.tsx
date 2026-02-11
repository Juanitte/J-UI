import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

export interface AnchorLinkItemProps {
  /** Clave única del enlace */
  key: string
  /** Destino del enlace (debe empezar con #) */
  href: string
  /** Contenido del enlace */
  title: ReactNode
  /** Enlaces hijos (solo en dirección vertical) */
  children?: AnchorLinkItemProps[]
}

export type AnchorSemanticSlot = 'root' | 'track' | 'indicator' | 'link'
export type AnchorClassNames = SemanticClassNames<AnchorSemanticSlot>
export type AnchorStyles = SemanticStyles<AnchorSemanticSlot>

export interface AnchorProps {
  /** Lista declarativa de enlaces */
  items?: AnchorLinkItemProps[]
  /** Dirección de la navegación */
  direction?: 'vertical' | 'horizontal'
  /** Offset en px desde el top al calcular la posición del scroll */
  offsetTop?: number
  /** Offset del destino al hacer scroll (por defecto usa offsetTop) */
  targetOffset?: number
  /** Distancia de tolerancia para detectar la sección activa */
  bounds?: number
  /** Contenedor scrollable */
  getContainer?: () => HTMLElement | Window
  /** Función para personalizar qué enlace está activo */
  getCurrentAnchor?: (activeLink: string) => string
  /** Callback cuando cambia el enlace activo */
  onChange?: (currentActiveLink: string) => void
  /** Callback al hacer clic en un enlace */
  onClick?: (e: React.MouseEvent<HTMLElement>, link: { title: ReactNode; href: string }) => void
  /** Usar replaceState en vez de pushState */
  replace?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: AnchorClassNames
  /** Estilos para partes internas del componente */
  styles?: AnchorStyles
}

// ============================================================================
// Helpers
// ============================================================================

function getDefaultContainer(): HTMLElement | Window {
  return window
}

function getScrollTop(container: HTMLElement | Window): number {
  if (container === window) {
    return window.scrollY || document.documentElement.scrollTop
  }
  return (container as HTMLElement).scrollTop
}

function getOffsetTop(element: HTMLElement, container: HTMLElement | Window): number {
  if (container === window) {
    return element.getBoundingClientRect().top + window.scrollY
  }
  const containerEl = container as HTMLElement
  const containerRect = containerEl.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  return elementRect.top - containerRect.top + containerEl.scrollTop
}

function flattenItems(items: AnchorLinkItemProps[]): AnchorLinkItemProps[] {
  const result: AnchorLinkItemProps[] = []
  for (const item of items) {
    result.push(item)
    if (item.children) {
      result.push(...flattenItems(item.children))
    }
  }
  return result
}

// ============================================================================
// Anchor Component
// ============================================================================

function AnchorRoot({
  items = [],
  direction = 'vertical',
  offsetTop = 0,
  targetOffset,
  bounds = 5,
  getContainer = getDefaultContainer,
  getCurrentAnchor,
  onChange,
  onClick,
  replace = false,
  className,
  style,
  classNames,
  styles,
}: AnchorProps) {
  const [activeLink, setActiveLink] = useState<string>('')
  const indicatorRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Map<string, HTMLElement>>(new Map())
  const isScrollingRef = useRef(false)
  const activeLinkRef = useRef(activeLink)
  activeLinkRef.current = activeLink

  const isVertical = direction === 'vertical'
  const allLinks = flattenItems(items)
  const resolvedTargetOffset = targetOffset ?? offsetTop

  // Registrar ref de cada link
  const registerLink = useCallback((href: string, el: HTMLElement | null) => {
    if (el) {
      linkRefs.current.set(href, el)
    } else {
      linkRefs.current.delete(href)
    }
  }, [])

  // Calcular enlace activo según posición de scroll
  const calculateActiveLink = useCallback(() => {
    if (isScrollingRef.current) return

    if (getCurrentAnchor) {
      const custom = getCurrentAnchor(activeLinkRef.current)
      if (custom !== activeLinkRef.current) {
        setActiveLink(custom)
        onChange?.(custom)
      }
      return
    }

    const container = getContainer()
    const scrollTop = getScrollTop(container) + offsetTop + bounds

    let newActiveLink = ''

    for (const link of allLinks) {
      if (!link.href.startsWith('#')) continue
      const targetId = link.href.slice(1)
      const targetElement = document.getElementById(targetId)
      if (!targetElement) continue

      const top = getOffsetTop(targetElement, container)
      if (top <= scrollTop) {
        newActiveLink = link.href
      }
    }

    if (!newActiveLink && allLinks.length > 0) {
      newActiveLink = allLinks[0].href
    }

    if (newActiveLink !== activeLinkRef.current) {
      setActiveLink(newActiveLink)
      onChange?.(newActiveLink)
    }
  }, [allLinks, bounds, getContainer, getCurrentAnchor, offsetTop, onChange])

  // Escuchar eventos de scroll
  useEffect(() => {
    const container = getContainer()

    const handleScroll = () => {
      calculateActiveLink()
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    calculateActiveLink()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [calculateActiveLink, getContainer])

  // Actualizar posición del indicador
  useEffect(() => {
    if (!indicatorRef.current || !wrapperRef.current) return

    const activeLinkEl = linkRefs.current.get(activeLink)
    if (!activeLinkEl) {
      indicatorRef.current.style.opacity = '0'
      return
    }

    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const linkRect = activeLinkEl.getBoundingClientRect()

    if (isVertical) {
      indicatorRef.current.style.top = `${linkRect.top - wrapperRect.top}px`
      indicatorRef.current.style.height = `${linkRect.height}px`
    } else {
      indicatorRef.current.style.left = `${linkRect.left - wrapperRect.left}px`
      indicatorRef.current.style.width = `${linkRect.width}px`
    }
    indicatorRef.current.style.opacity = '1'

    if (!isVertical) {
      activeLinkEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeLink, isVertical])

  // Click en un enlace
  const handleClick = useCallback((
    e: React.MouseEvent<HTMLElement>,
    href: string,
    title: ReactNode,
  ) => {
    onClick?.(e, { title, href })

    if (!href.startsWith('#')) return

    e.preventDefault()

    const targetId = href.slice(1)
    const targetElement = document.getElementById(targetId)
    if (!targetElement) return

    isScrollingRef.current = true

    const container = getContainer()
    const targetTop = getOffsetTop(targetElement, container)
    const scrollTo = targetTop - resolvedTargetOffset

    if (container === window) {
      window.scrollTo({ top: scrollTo, behavior: 'smooth' })
    } else {
      (container as HTMLElement).scrollTo({ top: scrollTo, behavior: 'smooth' })
    }

    setActiveLink(href)
    onChange?.(href)

    if (replace) {
      window.history.replaceState(null, '', href)
    } else {
      window.history.pushState(null, '', href)
    }

    setTimeout(() => {
      isScrollingRef.current = false
    }, 500)
  }, [getContainer, onClick, onChange, replace, resolvedTargetOffset])

  // Render links recursivo
  const renderItems = (linkItems: AnchorLinkItemProps[], depth: number = 0) => {
    return linkItems.map((item) => {
      const isActive = activeLink === item.href

      const linkStyle: CSSProperties = isVertical
        ? {
            display: 'flex',
            alignItems: 'center',
            minHeight: '2.75rem',
            padding: `0.25rem 0 0.25rem ${depth + 1}rem`,
            color: isActive ? tokens.colorPrimary : tokens.colorTextMuted,
            textDecoration: 'none',
            fontSize: '0.875rem',
            lineHeight: '1.375rem',
            transition: 'color 0.15s ease',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }
        : {
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '2.75rem',
            padding: '0.25rem 1rem',
            color: isActive ? tokens.colorPrimary : tokens.colorTextMuted,
            textDecoration: 'none',
            fontSize: '0.875rem',
            lineHeight: '1.375rem',
            transition: 'color 0.15s ease',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }

      return (
        <div key={item.key} style={isVertical ? {} : { display: 'inline-block' }}>
          <a
            ref={(el) => registerLink(item.href, el)}
            href={item.href}
            style={{ ...linkStyle, ...styles?.link }}
            className={classNames?.link}
            onClick={(e) => handleClick(e, item.href, item.title)}
            title={typeof item.title === 'string' ? item.title : undefined}
          >
            {item.title}
          </a>
          {isVertical && item.children && item.children.length > 0 && (
            <div>{renderItems(item.children, depth + 1)}</div>
          )}
        </div>
      )
    })
  }

  // Estilos del contenedor
  const wrapperStyle: CSSProperties = isVertical
    ? mergeSemanticStyle(
        { position: 'relative', paddingLeft: 2 },
        styles?.root,
        style,
      )
    : mergeSemanticStyle(
        { position: 'relative', display: 'flex', flexWrap: 'wrap', paddingBottom: 2 },
        styles?.root,
        style,
      )

  // Track (línea de fondo)
  const trackStyle: CSSProperties = isVertical
    ? {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: tokens.colorBorder,
        borderRadius: 1,
      }
    : {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: tokens.colorBorder,
        borderRadius: 1,
      }

  // Indicador activo
  const indicatorStyle: CSSProperties = isVertical
    ? {
        position: 'absolute',
        left: 0,
        width: 2,
        backgroundColor: tokens.colorPrimary,
        borderRadius: 1,
        transition: 'top 0.15s ease, height 0.15s ease, opacity 0.15s ease',
        opacity: 0,
        zIndex: 1,
      }
    : {
        position: 'absolute',
        bottom: 0,
        height: 2,
        backgroundColor: tokens.colorPrimary,
        borderRadius: 1,
        transition: 'left 0.15s ease, width 0.15s ease, opacity 0.15s ease',
        opacity: 0,
        zIndex: 1,
      }

  return (
    <div ref={wrapperRef} style={wrapperStyle} className={mergeSemanticClassName(className, classNames?.root)}>
      <div style={{ ...trackStyle, ...styles?.track }} className={classNames?.track} />
      <div ref={indicatorRef} style={{ ...indicatorStyle, ...styles?.indicator }} className={classNames?.indicator} />
      {renderItems(items)}
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export const Anchor = AnchorRoot
