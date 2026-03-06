import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import { Tooltip } from '../Tooltip'

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

  const orient = isVertical ? 'vertical' : 'horizontal'

  // Render links recursivo
  const renderItems = (linkItems: AnchorLinkItemProps[], depth: number = 0) => {
    return linkItems.map((item) => {
      const isActive = activeLink === item.href

      const linkClass = cx(
        'ino-anchor__link',
        `ino-anchor__link--${orient}`,
        { 'ino-anchor__link--active': isActive },
        classNames?.link,
      )

      // Dynamic: vertical indent depth stays inline
      const linkDynamicStyle: CSSProperties = {
        ...(isVertical && depth > 0 ? { paddingLeft: `${depth + 1}rem` } : {}),
        ...styles?.link,
      }

      const anchorLink = (
        <a
          ref={(el) => registerLink(item.href, el)}
          href={item.href}
          className={linkClass}
          style={linkDynamicStyle}
          onClick={(e) => handleClick(e, item.href, item.title)}
        >
          {item.title}
        </a>
      )

      return (
        <div key={item.key} className={isVertical ? undefined : 'ino-anchor__link-wrapper--horizontal'}>
          {typeof item.title === 'string' ? (
            <Tooltip content={item.title} delay={600}>
              {anchorLink}
            </Tooltip>
          ) : anchorLink}
          {isVertical && item.children && item.children.length > 0 && (
            <div>{renderItems(item.children, depth + 1)}</div>
          )}
        </div>
      )
    })
  }

  const rootClass = cx(
    'ino-anchor',
    `ino-anchor--${orient}`,
    className,
    classNames?.root,
  )

  const rootDynamicStyle: CSSProperties = {
    ...styles?.root,
    ...style,
  }

  return (
    <div ref={wrapperRef} className={rootClass} style={rootDynamicStyle}>
      <div className={cx('ino-anchor__track', `ino-anchor__track--${orient}`, classNames?.track)} style={styles?.track} />
      <div ref={indicatorRef} className={cx('ino-anchor__indicator', `ino-anchor__indicator--${orient}`, classNames?.indicator)} style={styles?.indicator} />
      {renderItems(items)}
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export const Anchor = AnchorRoot
