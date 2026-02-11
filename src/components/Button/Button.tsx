import { type ButtonHTMLAttributes, type ReactNode, useRef } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'dashed' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type ButtonShadow = boolean | 'sm' | 'md' | 'lg'
export type ButtonIconPlacement = 'start' | 'end'
export type ButtonAnimation = 'pulse' | 'ripple' | 'shake' | 'firecracker' | 'confetti'

// Mapeo de colores a tokens para acceso dinámico
const colorTokens: Record<ButtonColor, {
  base: string
  hover: string
  light: string
  dark: string
  contrast: string
  border: string
  200: string
  300: string
  400: string
  600: string
}> = {
  primary: {
    base: tokens.colorPrimary,
    hover: tokens.colorPrimaryHover,
    light: tokens.colorPrimaryLight,
    dark: tokens.colorPrimaryDark,
    contrast: tokens.colorPrimaryContrast,
    border: tokens.colorPrimaryBorder,
    200: tokens.colorPrimary200,
    300: tokens.colorPrimary300,
    400: tokens.colorPrimary400,
    600: tokens.colorPrimary600,
  },
  secondary: {
    base: tokens.colorSecondary,
    hover: tokens.colorSecondaryHover,
    light: tokens.colorSecondaryLight,
    dark: tokens.colorSecondaryDark,
    contrast: tokens.colorSecondaryContrast,
    border: tokens.colorSecondaryBorder,
    200: tokens.colorSecondary200,
    300: tokens.colorSecondary300,
    400: tokens.colorSecondary400,
    600: tokens.colorSecondary600,
  },
  success: {
    base: tokens.colorSuccess,
    hover: tokens.colorSuccessHover,
    light: tokens.colorSuccessLight,
    dark: tokens.colorSuccessDark,
    contrast: tokens.colorSuccessContrast,
    border: tokens.colorSuccessBorder,
    200: tokens.colorSuccess200,
    300: tokens.colorSuccess300,
    400: tokens.colorSuccess400,
    600: tokens.colorSuccess600,
  },
  warning: {
    base: tokens.colorWarning,
    hover: tokens.colorWarningHover,
    light: tokens.colorWarningLight,
    dark: tokens.colorWarningDark,
    contrast: tokens.colorWarningContrast,
    border: tokens.colorWarningBorder,
    200: tokens.colorWarning200,
    300: tokens.colorWarning300,
    400: tokens.colorWarning400,
    600: tokens.colorWarning600,
  },
  error: {
    base: tokens.colorError,
    hover: tokens.colorErrorHover,
    light: tokens.colorErrorLight,
    dark: tokens.colorErrorDark,
    contrast: tokens.colorErrorContrast,
    border: tokens.colorErrorBorder,
    200: tokens.colorError200,
    300: tokens.colorError300,
    400: tokens.colorError400,
    600: tokens.colorError600,
  },
  info: {
    base: tokens.colorInfo,
    hover: tokens.colorInfoHover,
    light: tokens.colorInfoLight,
    dark: tokens.colorInfoDark,
    contrast: tokens.colorInfoContrast,
    border: tokens.colorInfoBorder,
    200: tokens.colorInfo200,
    300: tokens.colorInfo300,
    400: tokens.colorInfo400,
    600: tokens.colorInfo600,
  },
}

export type ButtonSemanticSlot = 'root' | 'icon' | 'spinner' | 'content'
export type ButtonClassNames = SemanticClassNames<ButtonSemanticSlot>
export type ButtonStyles = SemanticStyles<ButtonSemanticSlot>

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  color?: ButtonColor
  loading?: boolean
  /** Añade sombra al botón */
  shadow?: ButtonShadow
  /** Añade borde al botón */
  bordered?: boolean
  /** Icono del botón */
  icon?: ReactNode
  /** Posición del icono */
  iconPlacement?: ButtonIconPlacement
  /** Animación al hacer click */
  clickAnimation?: ButtonAnimation
  /** Animación al hacer hover */
  hoverAnimation?: ButtonAnimation
  /** Gradiente preconfigurado usando un color del tema */
  gradient?: ButtonColor
  /** Ángulo del gradiente preconfigurado en grados (default: 135) */
  gradientAngle?: number
  /** Gradiente CSS personalizado (ej: "linear-gradient(45deg, #8c75d1, #6591c7)") */
  gradientCss?: string
  /** El botón ocupa el 100% del ancho de su contenedor */
  block?: boolean
  /** Clases CSS para partes internas del componente */
  classNames?: ButtonClassNames
  /** Estilos para partes internas del componente */
  styles?: ButtonStyles
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  color = 'primary',
  loading = false,
  shadow = false,
  bordered = false,
  icon,
  iconPlacement = 'start',
  clickAnimation,
  hoverAnimation,
  gradient,
  gradientAngle = 135,
  gradientCss,
  block = false,
  disabled,
  children,
  className,
  style,
  classNames,
  styles,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDisabled = disabled || loading

  const getShadow = (): string | undefined => {
    if (!shadow) return undefined
    if (shadow === true || shadow === 'md') return tokens.shadowMd
    if (shadow === 'sm') return tokens.shadowSm
    if (shadow === 'lg') return tokens.shadowLg
    return undefined
  }

  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    minHeight: '2.75rem',
    fontWeight: 500,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    transition: 'all 0.15s ease',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    overflow: 'hidden',
    boxShadow: getShadow(),
  }

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.8125rem' },
    md: { padding: '0.625rem 1.125rem', fontSize: '0.875rem' },
    lg: { padding: '0.875rem 1.5rem', fontSize: '1rem' },
  }

  const ct = colorTokens[color]

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: ct.base,
      color: ct.contrast,
    },
    secondary: {
      backgroundColor: ct.light,
      color: ct.dark,
    },
    outline: {
      backgroundColor: 'transparent',
      color: ct.base,
      border: `1px solid ${ct.base}`,
    },
    dashed: {
      backgroundColor: 'transparent',
      color: ct.base,
      border: `1px dashed ${ct.base}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: ct.base,
    },
    link: {
      backgroundColor: 'transparent',
      color: ct.base,
      padding: 0,
    },
  }

  const variantHoverStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: { backgroundColor: ct.hover },
    secondary: { backgroundColor: ct[200] },
    outline: { backgroundColor: ct.light },
    dashed: { backgroundColor: ct.light },
    ghost: { backgroundColor: ct.light },
    link: { color: ct.hover },
  }

  // Borde adicional si bordered=true
  const borderStyle: React.CSSProperties = bordered && variant !== 'outline'
    ? { border: `1px solid ${ct.border}` }
    : {}

  // Determinar si tiene gradiente
  const hasGradient = Boolean(gradient || gradientCss)

  // Estilos de gradiente
  const getGradientStyles = (): React.CSSProperties | null => {
    if (gradientCss) {
      return {
        background: gradientCss,
        backgroundColor: 'transparent',
        color: '#ffffff',
      }
    }
    if (gradient) {
      const gt = colorTokens[gradient]
      return {
        background: `linear-gradient(${gradientAngle}deg, ${gt[400]}, ${gt[600]})`,
        backgroundColor: 'transparent',
        color: '#ffffff',
      }
    }
    return null
  }

  const gradientStyles = getGradientStyles()

  const combinedStyles = mergeSemanticStyle(
    {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...borderStyle,
      ...gradientStyles,
      ...(block && { width: '100%' }),
    },
    styles?.root,
    style,
  )

  // Función para ejecutar animaciones
  const runAnimation = (animation: ButtonAnimation, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    switch (animation) {
      case 'ripple':
        createRipple(button, x, y)
        break
      case 'pulse':
        createPulse(button, color)
        break
      case 'shake':
        createShake(button)
        break
      case 'firecracker':
        createFirecracker(button, color)
        break
      case 'confetti':
        createConfetti(button, x, y, color)
        break
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      if (hasGradient) {
        // Para gradientes usamos filter en lugar de cambiar el background
        e.currentTarget.style.filter = 'brightness(1.1)'
      } else {
        Object.assign(e.currentTarget.style, variantHoverStyles[variant])
      }
      if (hoverAnimation) {
        runAnimation(hoverAnimation, e)
      }
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasGradient) {
      e.currentTarget.style.filter = ''
    } else {
      Object.assign(e.currentTarget.style, variantStyles[variant])
    }
    onMouseLeave?.(e)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return

    if (clickAnimation) {
      runAnimation(clickAnimation, e)
    }

    onClick?.(e)
  }

  return (
    <>
      <style>{`
        @keyframes j-spin { to { transform: rotate(360deg); } }
        @keyframes j-ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes j-pulse-wave {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes j-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        @keyframes j-particle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
      <button
        ref={buttonRef}
        disabled={isDisabled}
        style={combinedStyles}
        className={mergeSemanticClassName(className, classNames?.root)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <span className={classNames?.spinner} style={styles?.spinner}>
            <Spinner />
          </span>
        )}
        {!loading && icon && iconPlacement === 'start' && (
          <span
            style={{ display: 'inline-flex', fontSize: '1.1em', ...styles?.icon }}
            className={classNames?.icon}
          >
            {icon}
          </span>
        )}
        {classNames?.content || styles?.content ? (
          <span className={classNames?.content} style={styles?.content}>{children}</span>
        ) : (
          children
        )}
        {!loading && icon && iconPlacement === 'end' && (
          <span
            style={{ display: 'inline-flex', fontSize: '1.1em', ...styles?.icon }}
            className={classNames?.icon}
          >
            {icon}
          </span>
        )}
      </button>
    </>
  )
}

// Animación ripple (onda desde el punto de click)
function createRipple(button: HTMLButtonElement, x: number, y: number) {
  const rippleEl = document.createElement('span')
  rippleEl.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.3;
    transform: scale(0);
    animation: j-ripple 0.5s ease-out forwards;
    pointer-events: none;
    left: ${x}px;
    top: ${y}px;
    width: 100px;
    height: 100px;
    margin-left: -50px;
    margin-top: -50px;
  `
  button.appendChild(rippleEl)
  setTimeout(() => rippleEl.remove(), 500)
}

// Animación pulse (onda de borde que se expande hacia afuera)
function createPulse(button: HTMLButtonElement, color: ButtonColor) {
  const rect = button.getBoundingClientRect()
  const computedStyle = getComputedStyle(button)
  const borderRadius = computedStyle.borderRadius
  const pulseColor = colorTokens[color].base

  // Contenedor en el body para que no sea cortado por overflow:hidden
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    pointer-events: none;
    z-index: 9999;
  `

  // Primera onda
  const pulseEl = document.createElement('span')
  pulseEl.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid ${pulseColor};
    border-radius: ${borderRadius};
    animation: j-pulse-wave 0.4s ease-out forwards;
    pointer-events: none;
  `
  container.appendChild(pulseEl)

  // Segunda onda con delay
  const pulseEl2 = document.createElement('span')
  pulseEl2.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid ${pulseColor};
    border-radius: ${borderRadius};
    animation: j-pulse-wave 0.4s ease-out 0.15s forwards;
    pointer-events: none;
    opacity: 0;
  `
  container.appendChild(pulseEl2)

  document.body.appendChild(container)
  setTimeout(() => container.remove(), 600)
}

// Animación shake (agitar el botón)
function createShake(button: HTMLButtonElement) {
  button.style.animation = 'j-shake 0.4s ease'
  setTimeout(() => {
    button.style.animation = ''
  }, 400)
}

// Animación confetti (partículas desde el punto de click)
function createConfetti(button: HTMLButtonElement, x: number, y: number, color: ButtonColor) {
  const ct = colorTokens[color]
  const colors = [
    ct.base,
    ct[300],
    ct[400],
    ct[600],
    tokens.colorWarning,
    tokens.colorSuccess,
  ]

  const particleCount = 12
  const container = document.createElement('span')
  container.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    z-index: 10;
  `

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span')
    const angle = (i / particleCount) * 360
    const distance = 30 + Math.random() * 20
    const tx = Math.cos(angle * Math.PI / 180) * distance
    const ty = Math.sin(angle * Math.PI / 180) * distance
    const size = 4 + Math.random() * 4
    const delay = Math.random() * 0.1
    const particleColor = colors[Math.floor(Math.random() * colors.length)]

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${particleColor};
      border-radius: 50%;
      --tx: ${tx}px;
      --ty: ${ty}px;
      animation: j-particle 0.6s ease-out ${delay}s forwards;
      pointer-events: none;
    `
    container.appendChild(particle)
  }

  button.appendChild(container)
  setTimeout(() => container.remove(), 700)
}

// Animación firecracker (partículas desde los bordes del botón hacia afuera)
function createFirecracker(button: HTMLButtonElement, color: ButtonColor) {
  const ct = colorTokens[color]
  const colors = [
    ct.base,
    ct[300],
    ct[400],
    ct[600],
    tokens.colorWarning,
    tokens.colorSuccess,
  ]

  const rect = button.getBoundingClientRect()
  const particleCount = 12

  // Contenedor en el body para que las partículas no sean cortadas por overflow:hidden
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    pointer-events: none;
    z-index: 9999;
  `

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span')
    const angle = (i / particleCount) * 360
    const distance = 35 + Math.random() * 25

    // Calcular posición inicial en el borde del botón
    const radians = angle * Math.PI / 180
    const halfWidth = rect.width / 2
    const halfHeight = rect.height / 2

    // Punto en el borde del botón (elipse aproximada)
    const edgeX = halfWidth + Math.cos(radians) * halfWidth
    const edgeY = halfHeight + Math.sin(radians) * halfHeight

    // Punto final hacia afuera
    const tx = Math.cos(radians) * distance
    const ty = Math.sin(radians) * distance

    const size = 4 + Math.random() * 4
    const delay = Math.random() * 0.1
    const particleColor = colors[Math.floor(Math.random() * colors.length)]

    particle.style.cssText = `
      position: absolute;
      left: ${edgeX}px;
      top: ${edgeY}px;
      width: ${size}px;
      height: ${size}px;
      background: ${particleColor};
      border-radius: 50%;
      --tx: ${tx}px;
      --ty: ${ty}px;
      animation: j-particle 0.6s ease-out ${delay}s forwards;
      pointer-events: none;
    `
    container.appendChild(particle)
  }

  document.body.appendChild(container)
  setTimeout(() => container.remove(), 700)
}

function Spinner() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'j-spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
      />
    </svg>
  )
}
