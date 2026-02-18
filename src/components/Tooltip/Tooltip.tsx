import { useState, useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export type TooltipSemanticSlot = 'root' | 'popup' | 'arrow'
export type TooltipClassNames = SemanticClassNames<TooltipSemanticSlot>
export type TooltipStyles = SemanticStyles<TooltipSemanticSlot>

export interface TooltipProps {
  /** Contenido del tooltip */
  content: ReactNode
  /** Elemento que activa el tooltip */
  children: ReactNode
  /** Posición del tooltip */
  position?: TooltipPosition
  /** Delay antes de mostrar (ms) */
  delay?: number
  /** Desactivar tooltip */
  disabled?: boolean
  /** Clase CSS adicional */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Clases CSS para partes internas del componente */
  classNames?: TooltipClassNames
  /** Estilos para partes internas del componente */
  styles?: TooltipStyles
}

const GAP = 8

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  className,
  style,
  classNames,
  styles,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const timeoutRef = useRef<number | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    switch (position) {
      case 'top':
        setCoords({ top: rect.top - GAP, left: rect.left + rect.width / 2 })
        break
      case 'bottom':
        setCoords({ top: rect.bottom + GAP, left: rect.left + rect.width / 2 })
        break
      case 'left':
        setCoords({ top: rect.top + rect.height / 2, left: rect.left - GAP })
        break
      case 'right':
        setCoords({ top: rect.top + rect.height / 2, left: rect.right + GAP })
        break
    }
  }, [position])

  const showTooltip = () => {
    if (disabled) return
    timeoutRef.current = window.setTimeout(() => {
      updateCoords()
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsAnimating(false)
    setTimeout(() => setVisible(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Reposition on scroll/resize while visible
  useEffect(() => {
    if (!visible) return
    const handle = () => updateCoords()
    window.addEventListener('scroll', handle, true)
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle, true)
      window.removeEventListener('resize', handle)
    }
  }, [visible, updateCoords])

  const getTransform = (): string => {
    const offset = isAnimating ? 0 : 6
    switch (position) {
      case 'top':
        return `translateX(-50%) translateY(-100%) translateY(${offset}px)`
      case 'bottom':
        return `translateX(-50%) translateY(${-offset}px)`
      case 'left':
        return `translateX(-100%) translateY(-50%) translateX(${offset}px)`
      case 'right':
        return `translateY(-50%) translateX(${-offset}px)`
    }
  }

  const arrowPositionStyles: Record<TooltipPosition, CSSProperties> = {
    top: {
      bottom: '-0.25rem',
      left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
      borderRight: `1px solid ${tokens.colorBorder}`,
      borderBottom: `1px solid ${tokens.colorBorder}`,
    },
    bottom: {
      top: '-0.25rem',
      left: '50%',
      transform: 'translateX(-50%) rotate(-135deg)',
      borderRight: `1px solid ${tokens.colorBorder}`,
      borderBottom: `1px solid ${tokens.colorBorder}`,
    },
    left: {
      right: '-0.25rem',
      top: '50%',
      transform: 'translateY(-50%) rotate(-45deg)',
      borderRight: `1px solid ${tokens.colorBorder}`,
      borderBottom: `1px solid ${tokens.colorBorder}`,
    },
    right: {
      left: '-0.25rem',
      top: '50%',
      transform: 'translateY(-50%) rotate(135deg)',
      borderRight: `1px solid ${tokens.colorBorder}`,
      borderBottom: `1px solid ${tokens.colorBorder}`,
    },
  }

  const tooltipStyle: CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    top: coords.top,
    left: coords.left,
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: tokens.colorBgMuted,
    color: tokens.colorText,
    fontSize: '0.8125rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    boxShadow: tokens.shadowMd,
    border: `1px solid ${tokens.colorBorder}`,
    opacity: isAnimating ? 1 : 0,
    transform: getTransform(),
    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
    pointerEvents: 'none',
    ...styles?.popup,
  }

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: tokens.colorBgMuted,
    ...arrowPositionStyles[position],
    ...styles?.arrow,
  }

  const rootStyle = mergeSemanticStyle(
    { display: 'inline-flex' },
    styles?.root,
    style,
  )

  const popup = visible && typeof document !== 'undefined'
    ? createPortal(
        <div style={tooltipStyle} className={classNames?.popup} role="tooltip">
          {content}
          <div style={arrowStyle} className={classNames?.arrow} />
        </div>,
        document.body,
      )
    : null

  return (
    <div
      ref={triggerRef}
      style={rootStyle}
      className={mergeSemanticClassName(className, classNames?.root)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {popup}
    </div>
  )
}
