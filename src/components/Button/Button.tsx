import { type ButtonHTMLAttributes, type ReactNode, useRef } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'
import { getColorVars } from '../../utils/colorVars'
import { useConfig } from '../ConfigProvider'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'dashed' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type ButtonShadow = boolean | 'sm' | 'md' | 'lg'
export type ButtonIconPlacement = 'start' | 'end'
export type ButtonAnimation = 'pulse' | 'ripple' | 'shake' | 'firecracker' | 'confetti'

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

const CONFIG_SIZE_MAP = { small: 'sm', middle: 'md', large: 'lg' } as const

export function Button({
  variant = 'primary',
  size: sizeProp,
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
  disabled: disabledProp,
  children,
  className,
  style,
  classNames: classNamesProp,
  styles,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}: ButtonProps) {
  const { componentSize, componentDisabled } = useConfig()
  const size: ButtonSize = sizeProp ?? (componentSize ? CONFIG_SIZE_MAP[componentSize] : undefined) ?? 'md'
  const disabled = disabledProp ?? componentDisabled
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDisabled = disabled || loading

  // Determine if has gradient or custom background
  const hasGradient = Boolean(gradient || gradientCss)
  const hasCustomBg = Boolean(style?.backgroundColor || styles?.root?.backgroundColor)
  const useGradientHover = hasGradient || hasCustomBg

  // Build BEM class string
  const shadowKey = shadow === true ? 'md' : shadow
  const rootClass = cx(
    'ino-btn',
    `ino-btn--${variant}`,
    `ino-btn--${size}`,
    {
      'ino-btn--disabled': isDisabled,
      'ino-btn--loading': loading,
      'ino-btn--block': block,
      'ino-btn--bordered': bordered && variant !== 'outline',
      'ino-btn--gradient': useGradientHover,
      [`ino-btn--shadow-${shadowKey}`]: !!shadow,
    },
    className,
    classNamesProp?.root,
  )

  // Dynamic inline styles: color bridge + gradient + user overrides
  const colorVars = getColorVars(color)

  const getGradientStyles = (): React.CSSProperties | null => {
    if (gradientCss) {
      return {
        background: gradientCss,
        backgroundColor: 'transparent',
        color: '#ffffff',
      }
    }
    if (gradient) {
      return {
        background: `linear-gradient(${gradientAngle}deg, var(--j-${gradient}-400), var(--j-${gradient}-600))`,
        backgroundColor: 'transparent',
        color: '#ffffff',
      }
    }
    return null
  }

  const gradientStyles = getGradientStyles()

  const dynamicStyle: React.CSSProperties = {
    ...colorVars,
    ...gradientStyles,
    ...styles?.root,
    ...style,
  } as React.CSSProperties

  // Animation runner
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
    if (!isDisabled && hoverAnimation) {
      runAnimation(hoverAnimation, e)
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <button
      ref={buttonRef}
      disabled={isDisabled}
      className={rootClass}
      style={dynamicStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <span className={cx('ino-btn__spinner', classNamesProp?.spinner)} style={styles?.spinner}>
          <Spinner />
        </span>
      )}
      {!loading && icon && iconPlacement === 'start' && (
        <span
          className={cx('ino-btn__icon', classNamesProp?.icon)}
          style={styles?.icon}
        >
          {icon}
        </span>
      )}
      {classNamesProp?.content || styles?.content ? (
        <span className={cx(classNamesProp?.content)} style={styles?.content}>{children}</span>
      ) : (
        children
      )}
      {!loading && icon && iconPlacement === 'end' && (
        <span
          className={cx('ino-btn__icon', classNamesProp?.icon)}
          style={styles?.icon}
        >
          {icon}
        </span>
      )}
    </button>
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
  const pulseColor = `var(--j-${color})`

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
  const colors = [
    `var(--j-${color})`,
    `var(--j-${color}-300)`,
    `var(--j-${color}-400)`,
    `var(--j-${color}-600)`,
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
  const colors = [
    `var(--j-${color})`,
    `var(--j-${color}-300)`,
    `var(--j-${color}-400)`,
    `var(--j-${color}-600)`,
    tokens.colorWarning,
    tokens.colorSuccess,
  ]

  const rect = button.getBoundingClientRect()
  const particleCount = 12

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

    const radians = angle * Math.PI / 180
    const halfWidth = rect.width / 2
    const halfHeight = rect.height / 2

    const edgeX = halfWidth + Math.cos(radians) * halfWidth
    const edgeY = halfHeight + Math.sin(radians) * halfHeight

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
