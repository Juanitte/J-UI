import { type ButtonHTMLAttributes, type ReactNode, useState, useRef, useEffect, Children, cloneElement, isValidElement } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

export type BubblePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type BubbleShape = 'circle' | 'square'
export type BubbleSize = 'sm' | 'md' | 'lg'
export type BubbleColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type BubbleDirection = 'top' | 'bottom' | 'left' | 'right'

// Semantic slots
export type BubbleSemanticSlot = 'root' | 'icon' | 'tooltip' | 'tooltipArrow'
export type BubbleClassNames = SemanticClassNames<BubbleSemanticSlot>
export type BubbleStyles = SemanticStyles<BubbleSemanticSlot>

export type BubbleMenuSemanticSlot = 'root' | 'trigger' | 'menu'
export type BubbleMenuClassNames = SemanticClassNames<BubbleMenuSemanticSlot>
export type BubbleMenuStyles = SemanticStyles<BubbleMenuSemanticSlot>

// Mapeo de colores a tokens para acceso dinámico
const colorTokens: Record<BubbleColor, {
  base: string
  contrast: string
}> = {
  primary: { base: tokens.colorPrimary, contrast: tokens.colorPrimaryContrast },
  secondary: { base: tokens.colorSecondary, contrast: tokens.colorSecondaryContrast },
  success: { base: tokens.colorSuccess, contrast: tokens.colorSuccessContrast },
  warning: { base: tokens.colorWarning, contrast: tokens.colorWarningContrast },
  error: { base: tokens.colorError, contrast: tokens.colorErrorContrast },
  info: { base: tokens.colorInfo, contrast: tokens.colorInfoContrast },
}

export interface BubbleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icono a mostrar en el bubble */
  icon?: ReactNode
  /** Texto a mostrar (solo si no hay icono) */
  description?: string
  /** Posición fija en la pantalla */
  position?: BubblePosition
  /** Forma del bubble */
  shape?: BubbleShape
  /** Tamaño del bubble */
  size?: BubbleSize
  /** Color del bubble */
  color?: BubbleColor
  /** Tooltip a mostrar */
  tooltip?: string
  /** Posición del tooltip */
  tooltipPosition?: 'left' | 'right' | 'top' | 'bottom'
  /** Offset horizontal desde el borde (en px) */
  offsetX?: number
  /** Offset vertical desde el borde (en px) */
  offsetY?: number
  /** Mostrar sombra */
  shadow?: boolean | 'sm' | 'md' | 'lg'
  /** Mostrar borde (default: true) */
  bordered?: boolean
  /** Callback cuando se hace scroll al top (para botón "back to top") */
  onBackToTop?: () => void
  /** Mostrar solo cuando se ha hecho scroll */
  visibleOnScroll?: number
  /** @internal Indica si está dentro de un BubbleGroup */
  _inGroup?: boolean
  /** Clases CSS para partes internas del componente */
  classNames?: BubbleClassNames
  /** Estilos para partes internas del componente */
  styles?: BubbleStyles
}

function BubbleComponent({
  icon,
  description,
  position = 'bottom-right',
  shape = 'circle',
  size = 'md',
  color = 'primary',
  tooltip,
  tooltipPosition,
  offsetX = 24,
  offsetY = 24,
  shadow = 'lg',
  bordered = true,
  onBackToTop,
  visibleOnScroll,
  disabled,
  className,
  style,
  onClick,
  _inGroup,
  classNames: semanticClassNames,
  styles: semanticStyles,
  ...props
}: BubbleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(visibleOnScroll === undefined)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Manejar visibilidad basada en scroll
  useEffect(() => {
    if (visibleOnScroll === undefined) return

    const handleScroll = () => {
      setIsVisible(window.scrollY >= visibleOnScroll)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleOnScroll])

  const getShadow = (): string | undefined => {
    if (!shadow) return undefined
    if (shadow === true || shadow === 'lg') return tokens.shadowLg
    if (shadow === 'sm') return tokens.shadowSm
    if (shadow === 'md') return tokens.shadowMd
    return undefined
  }

  const sizeMap: Record<BubbleSize, { size: number; fontSize: string; iconSize: number }> = {
    sm: { size: 40, fontSize: '0.75rem', iconSize: 16 },
    md: { size: 48, fontSize: '0.875rem', iconSize: 20 },
    lg: { size: 56, fontSize: '1rem', iconSize: 24 },
  }

  const positionStyles: Record<BubblePosition, React.CSSProperties> = {
    'top-left': { top: offsetY, left: offsetX },
    'top-right': { top: offsetY, right: offsetX },
    'bottom-left': { bottom: offsetY, left: offsetX },
    'bottom-right': { bottom: offsetY, right: offsetX },
  }

  // Calcular posición del tooltip basada en la posición del bubble
  const getTooltipPos = (): 'left' | 'right' | 'top' | 'bottom' => {
    if (tooltipPosition) return tooltipPosition
    if (position.includes('right')) return 'left'
    if (position.includes('left')) return 'right'
    return 'left'
  }

  // Aplicar estilos de posición para fixed y absolute, pero no para relative
  const shouldApplyPositionStyles = !style?.position || style.position === 'fixed' || style.position === 'absolute'

  // Hover effect: brightness para grupo, scale para normal
  const getHoverStyles = (): React.CSSProperties => {
    if (_inGroup) {
      return {
        filter: isHovered && !disabled ? 'brightness(1.15)' : 'brightness(1)',
      }
    }
    return {
      transform: isHovered && !disabled ? 'scale(1.1)' : 'scale(1)',
    }
  }

  const ct = colorTokens[color]

  const baseStyles: React.CSSProperties = {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeMap[size].size,
    height: sizeMap[size].size,
    borderRadius: shape === 'circle' ? '50%' : '0.5rem',
    backgroundColor: ct.base,
    color: ct.contrast,
    border: bordered ? `1px solid ${tokens.colorBorder}` : 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    boxShadow: getShadow(),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...getHoverStyles(),
    zIndex: isHovered ? 1002 : (shouldApplyPositionStyles ? 1000 : undefined),
    fontFamily: 'inherit',
    fontSize: sizeMap[size].fontSize,
    ...(shouldApplyPositionStyles && positionStyles[position]),
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (onBackToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      onBackToTop()
    }

    onClick?.(e)
  }

  if (!isVisible) return null

  // Estilos del tooltip (mismo estilo que el componente Tooltip)
  const tooltipPos = getTooltipPos()

  const tooltipPositionStyles: Record<'left' | 'right' | 'top' | 'bottom', React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', marginBottom: '0.5rem', transform: `translateX(-50%) translateY(${isHovered ? 0 : 6}px)` },
    bottom: { top: '100%', left: '50%', marginTop: '0.5rem', transform: `translateX(-50%) translateY(${isHovered ? 0 : -6}px)` },
    left: { right: '100%', top: '50%', marginRight: '0.5rem', transform: `translateY(-50%) translateX(${isHovered ? 0 : 6}px)` },
    right: { left: '100%', top: '50%', marginLeft: '0.5rem', transform: `translateY(-50%) translateX(${isHovered ? 0 : -6}px)` },
  }

  const arrowStyles: Record<'left' | 'right' | 'top' | 'bottom', React.CSSProperties> = {
    top: { bottom: '-0.25rem', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderRight: `1px solid ${tokens.colorBorder}`, borderBottom: `1px solid ${tokens.colorBorder}` },
    bottom: { top: '-0.25rem', left: '50%', transform: 'translateX(-50%) rotate(-135deg)', borderRight: `1px solid ${tokens.colorBorder}`, borderBottom: `1px solid ${tokens.colorBorder}` },
    left: { right: '-0.25rem', top: '50%', transform: 'translateY(-50%) rotate(-45deg)', borderRight: `1px solid ${tokens.colorBorder}`, borderBottom: `1px solid ${tokens.colorBorder}` },
    right: { left: '-0.25rem', top: '50%', transform: 'translateY(-50%) rotate(135deg)', borderRight: `1px solid ${tokens.colorBorder}`, borderBottom: `1px solid ${tokens.colorBorder}` },
  }

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 1001,
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: tokens.colorBgMuted,
    color: tokens.colorText,
    fontSize: '0.8125rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    boxShadow: tokens.shadowMd,
    border: `1px solid ${tokens.colorBorder}`,
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
    pointerEvents: 'none',
    ...tooltipPositionStyles[tooltipPos],
  }

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: tokens.colorBgMuted,
    ...arrowStyles[tooltipPos],
  }

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      style={mergeSemanticStyle(baseStyles, semanticStyles?.root, style)}
      className={mergeSemanticClassName(className, semanticClassNames?.root)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      {...props}
    >
      {/* Icono o descripción */}
      {icon ? (
        <span style={{ display: 'flex', fontSize: sizeMap[size].iconSize, ...semanticStyles?.icon }} className={semanticClassNames?.icon}>{icon}</span>
      ) : description ? (
        <span style={semanticStyles?.icon} className={semanticClassNames?.icon}>{description}</span>
      ) : (
        <DefaultIcon size={sizeMap[size].iconSize} />
      )}

      {/* Tooltip inline */}
      {tooltip && (
        <div style={{ ...tooltipStyle, ...semanticStyles?.tooltip }} className={semanticClassNames?.tooltip} role="tooltip">
          {tooltip}
          <div style={{ ...arrowStyle, ...semanticStyles?.tooltipArrow }} className={semanticClassNames?.tooltipArrow} />
        </div>
      )}
    </button>
  )
}

// ============================================
// BubbleGroup Component
// ============================================

export interface BubbleGroupProps {
  /** Bubbles hijos del grupo */
  children: ReactNode
  /** Posición fija en la pantalla */
  position?: BubblePosition
  /** Dirección del grupo */
  direction?: BubbleDirection
  /** Tamaño de los bubbles */
  size?: BubbleSize
  /** Offset horizontal desde el borde (en px) */
  offsetX?: number
  /** Offset vertical desde el borde (en px) */
  offsetY?: number
  /** Mostrar sombra en el grupo */
  shadow?: boolean | 'sm' | 'md' | 'lg'
  /** Estilo adicional para el contenedor */
  style?: React.CSSProperties
  /** Clase adicional para el contenedor */
  className?: string
}

export type BubbleMenuTrigger = 'click' | 'hover'

export interface BubbleMenuProps {
  /** Bubbles hijos del menú */
  children: ReactNode
  /** Posición fija en la pantalla */
  position?: BubblePosition
  /** Dirección de expansión */
  direction?: BubbleDirection
  /** Modo de activación: click o hover */
  trigger?: BubbleMenuTrigger
  /** Icono del trigger cuando está cerrado (si no se pasa, usa + por defecto) */
  icon?: ReactNode
  /** Icono del trigger cuando está abierto (si no se pasa, rota el icon 45°) */
  openIcon?: ReactNode
  /** Forma del trigger y los hijos */
  shape?: BubbleShape
  /** Tamaño del trigger y los hijos */
  size?: BubbleSize
  /** Color del trigger */
  color?: BubbleColor
  /** Offset horizontal desde el borde (en px) */
  offsetX?: number
  /** Offset vertical desde el borde (en px) */
  offsetY?: number
  /** Mostrar sombra */
  shadow?: boolean | 'sm' | 'md' | 'lg'
  /** Tooltip del trigger */
  tooltip?: string
  /** Abierto por defecto */
  defaultOpen?: boolean
  /** Controlado: estado abierto */
  open?: boolean
  /** Callback cuando cambia el estado */
  onOpenChange?: (open: boolean) => void
  /** Espacio entre bubbles (en px) */
  gap?: number
  /** Estilo adicional para el contenedor */
  style?: React.CSSProperties
  /** Clase adicional para el contenedor */
  className?: string
  /** Clases CSS para partes internas del componente */
  classNames?: BubbleMenuClassNames
  /** Estilos para partes internas del componente */
  styles?: BubbleMenuStyles
}

function BubbleGroup({
  children,
  position = 'bottom-right',
  direction = 'top',
  size = 'md',
  offsetX = 24,
  offsetY = 24,
  shadow = 'lg',
  style,
  className,
}: BubbleGroupProps) {
  const positionStyles: Record<BubblePosition, React.CSSProperties> = {
    'top-left': { top: offsetY, left: offsetX },
    'top-right': { top: offsetY, right: offsetX },
    'bottom-left': { bottom: offsetY, left: offsetX },
    'bottom-right': { bottom: offsetY, right: offsetX },
  }

  // Determinar si es dirección vertical u horizontal
  const isVertical = direction === 'top' || direction === 'bottom'

  const getShadow = (): string | undefined => {
    if (!shadow) return undefined
    if (shadow === true || shadow === 'lg') return tokens.shadowLg
    if (shadow === 'sm') return tokens.shadowSm
    if (shadow === 'md') return tokens.shadowMd
    return undefined
  }

  // Determinar flexDirection basado en direction
  const getFlexDirection = (): React.CSSProperties['flexDirection'] => {
    switch (direction) {
      case 'top': return 'column-reverse'
      case 'bottom': return 'column'
      case 'left': return 'row-reverse'
      case 'right': return 'row'
    }
  }

  // Estilos del contenedor compacto
  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    display: 'flex',
    flexDirection: getFlexDirection(),
    boxShadow: getShadow(),
    zIndex: 1000,
    ...positionStyles[position],
    ...style,
  }

  const childrenArray = Children.toArray(children)
  const validChildren = childrenArray.filter(isValidElement)
  const totalChildren = validChildren.length
  const radius = '0.5rem'

  // Calcular border-radius para cada hijo según su posición visual
  const getBorderRadius = (index: number): string => {
    const isFirst = index === 0
    const isLast = index === totalChildren - 1
    const isOnly = totalChildren === 1

    if (isOnly) return radius

    if (isVertical) {
      // column-reverse: index 0 está visualmente abajo, último arriba
      // column: index 0 está visualmente arriba, último abajo
      const isVisualTop = direction === 'top' ? isLast : isFirst
      const isVisualBottom = direction === 'top' ? isFirst : isLast

      if (isVisualTop) return `${radius} ${radius} 0 0`
      if (isVisualBottom) return `0 0 ${radius} ${radius}`
    } else {
      // row-reverse: index 0 está visualmente a la derecha, último a la izquierda
      // row: index 0 está visualmente a la izquierda, último a la derecha
      const isVisualLeft = direction === 'right' ? isLast : isFirst
      const isVisualRight = direction === 'right' ? isFirst : isLast

      if (isVisualLeft) return `${radius} 0 0 ${radius}`
      if (isVisualRight) return `0 ${radius} ${radius} 0`
    }

    return '0'
  }

  return (
    <div style={containerStyles} className={className}>
      {validChildren.map((child, index) => {
        if (!isValidElement<BubbleProps>(child)) return null

        return cloneElement(child, {
          key: index,
          style: {
            position: 'relative' as const,
            borderRadius: getBorderRadius(index),
            ...child.props.style,
          } as React.CSSProperties,
          size: child.props.size || size,
          shape: 'square' as BubbleShape, // Siempre cuadrado en grupo compacto
          shadow: false, // Sin sombra individual, la tiene el contenedor
          _inGroup: true, // Para que use brightness en hover en lugar de scale
        })
      })}
    </div>
  )
}

// ============================================
// BubbleMenu Component (Desplegable)
// ============================================

function BubbleMenu({
  children,
  position = 'bottom-right',
  direction = 'top',
  trigger = 'click',
  icon,
  openIcon,
  shape = 'circle',
  size = 'md',
  color = 'primary',
  offsetX = 24,
  offsetY = 24,
  shadow = 'lg',
  tooltip,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  gap = 12,
  style,
  className,
  classNames: semanticClassNames,
  styles: semanticStyles,
}: BubbleMenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const handleToggle = () => {
    if (trigger === 'click') {
      setOpen(!isOpen)
    }
  }

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setOpen(false)
    }
  }

  const sizeMap: Record<BubbleSize, number> = {
    sm: 40,
    md: 48,
    lg: 56,
  }

  const iconSize = sizeMap[size] === 40 ? 16 : sizeMap[size] === 48 ? 20 : 24

  const positionStyles: Record<BubblePosition, React.CSSProperties> = {
    'top-left': { top: offsetY, left: offsetX },
    'top-right': { top: offsetY, right: offsetX },
    'bottom-left': { bottom: offsetY, left: offsetX },
    'bottom-right': { bottom: offsetY, right: offsetX },
  }

  // Determinar si es dirección vertical u horizontal
  const isVertical = direction === 'top' || direction === 'bottom'

  // Determinar flexDirection basado en direction
  const getFlexDirection = (): React.CSSProperties['flexDirection'] => {
    switch (direction) {
      case 'top': return 'column-reverse'
      case 'bottom': return 'column'
      case 'left': return 'row-reverse'
      case 'right': return 'row'
    }
  }

  // Detectar modo inline (relative/static) donde no queremos aplicar posición fija ni offsets
  const isInlineMode = style?.position === 'relative' || style?.position === 'static'

  const childrenArray = Children.toArray(children)
  const validChildren = childrenArray.filter(isValidElement)

  // Calcular el offset de translate para la animación
  const getTranslateValue = (): number => {
    if (isOpen) return 0
    switch (direction) {
      case 'top': return 20
      case 'bottom': return -20
      case 'left': return 20
      case 'right': return -20
    }
  }

  // Posición del contenedor de hijos en modo inline (absoluto respecto al trigger)
  const getChildrenContainerPosition = (): React.CSSProperties => {
    const offset = gap
    switch (direction) {
      case 'top':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: offset }
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: offset }
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)', paddingRight: offset }
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)', paddingLeft: offset }
    }
  }

  // Estilos para modo inline: solo el trigger afecta el layout
  if (isInlineMode) {
    return (
      <div
        style={mergeSemanticStyle({
          position: 'relative',
          display: 'inline-flex',
        }, semanticStyles?.root, style)}
        className={mergeSemanticClassName(className, semanticClassNames?.root)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trigger button */}
        <Bubble
          icon={
            openIcon
              ? (isOpen ? openIcon : (icon || <DefaultIcon size={iconSize} />))
              : (icon || <DefaultIcon size={iconSize} />)
          }
          shape={shape}
          size={size}
          color={color}
          shadow={shadow}
          tooltip={!isOpen ? tooltip : undefined}
          onClick={handleToggle}
          _inGroup
          className={semanticClassNames?.trigger}
          style={{
            position: 'relative',
            transform: !openIcon && isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            ...semanticStyles?.trigger,
          }}
        />

        {/* Children en contenedor absoluto - no afecta el layout */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: getFlexDirection(),
            alignItems: 'center',
            gap: gap,
            zIndex: 1000,
            pointerEvents: isOpen ? 'auto' : 'none',
            ...getChildrenContainerPosition(),
            ...semanticStyles?.menu,
          }}
          className={semanticClassNames?.menu}
        >
          {validChildren.map((child, index) => {
            if (!isValidElement<BubbleProps>(child)) return null

            const delay = index * 0.05
            const translateValue = getTranslateValue()
            const translateAxis = isVertical ? 'Y' : 'X'

            return cloneElement(child, {
              key: index,
              style: {
                position: 'relative' as const, // Forzar relative, no fixed
                opacity: isOpen ? 1 : 0,
                transform: `translate${translateAxis}(${translateValue}px)`,
                transition: `opacity 0.2s ease-out ${delay}s, transform 0.2s ease-out ${delay}s`,
                pointerEvents: isOpen ? 'auto' : 'none',
                ...child.props.style,
              } as React.CSSProperties,
              size: child.props.size || size,
              shape: child.props.shape || shape,
              shadow: child.props.shadow !== undefined ? child.props.shadow : shadow,
            })
          })}
        </div>
      </div>
    )
  }

  // Modo fixed/absolute: comportamiento original
  const containerStyle = mergeSemanticStyle({
    display: 'flex',
    flexDirection: getFlexDirection(),
    alignItems: 'center',
    gap: gap,
    position: style?.position === 'absolute' ? undefined : ('fixed' as const),
    zIndex: 1000,
    ...positionStyles[position],
  }, semanticStyles?.root, style)

  return (
    <div
      style={containerStyle}
      className={mergeSemanticClassName(className, semanticClassNames?.root)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
      <Bubble
        icon={
          openIcon
            ? (isOpen ? openIcon : (icon || <DefaultIcon size={iconSize} />))
            : (icon || <DefaultIcon size={iconSize} />)
        }
        shape={shape}
        size={size}
        color={color}
        shadow={shadow}
        tooltip={!isOpen ? tooltip : undefined}
        onClick={handleToggle}
        _inGroup
        className={semanticClassNames?.trigger}
        style={{
          position: 'relative',
          transform: !openIcon && isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...semanticStyles?.trigger,
        }}
      />

      {/* Children bubbles con animación */}
      {validChildren.map((child, index) => {
        if (!isValidElement<BubbleProps>(child)) return null

        const delay = index * 0.05
        const translateValue = getTranslateValue()
        const translateAxis = isVertical ? 'Y' : 'X'

        return cloneElement(child, {
          key: index,
          style: {
            position: 'relative' as const, // Forzar relative, no fixed
            opacity: isOpen ? 1 : 0,
            transform: `translate${translateAxis}(${translateValue}px)`,
            transition: `opacity 0.2s ease-out ${delay}s, transform 0.2s ease-out ${delay}s`,
            pointerEvents: isOpen ? 'auto' : 'none',
            ...child.props.style,
          } as React.CSSProperties,
          size: child.props.size || size,
          shape: child.props.shape || shape,
          shadow: child.props.shadow !== undefined ? child.props.shadow : shadow,
        })
      })}
    </div>
  )
}

// Crear el tipo compuesto para Bubble con .Group y .Menu
interface BubbleType extends React.FC<BubbleProps> {
  Group: typeof BubbleGroup
  Menu: typeof BubbleMenu
}

// Asignar BubbleGroup y BubbleMenu como propiedades estáticas de Bubble
export const Bubble = BubbleComponent as BubbleType
Bubble.Group = BubbleGroup
Bubble.Menu = BubbleMenu

// Icono por defecto (cruz/plus)
function DefaultIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// Icono de flecha arriba para "back to top"
export function BackToTopIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

// Icono de chat
export function ChatIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

// Icono de notificación/campana
export function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

// Icono de cerrar (X)
export function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
