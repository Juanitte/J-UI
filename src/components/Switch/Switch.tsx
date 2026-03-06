import {
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

// ============================================================================
// Types
// ============================================================================

export type SwitchSize = 'default' | 'small'
export type SwitchSemanticSlot = 'root' | 'track' | 'thumb' | 'inner'
export type SwitchClassNames = SemanticClassNames<SwitchSemanticSlot>
export type SwitchStyles = SemanticStyles<SwitchSemanticSlot>

export interface SwitchRef {
  focus: () => void
  blur: () => void
}

export interface SwitchProps {
  autoFocus?: boolean
  checked?: boolean
  checkedChildren?: ReactNode
  defaultChecked?: boolean
  defaultValue?: boolean
  disabled?: boolean
  loading?: boolean
  size?: SwitchSize
  unCheckedChildren?: ReactNode
  value?: boolean
  onChange?: (checked: boolean, event: MouseEvent) => void
  onClick?: (checked: boolean, event: MouseEvent) => void
  className?: string
  style?: CSSProperties
  classNames?: SwitchClassNames
  styles?: SwitchStyles
  tabIndex?: number
  id?: string
}

// ============================================================================
// Loading spinner
// ============================================================================

function SwitchSpinner({ size }: { size: SwitchSize }) {
  const d = size === 'small' ? 8 : 12
  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 24 24"
      fill="none"
      className="ino-switch__spinner"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={tokens.colorPrimary}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
      />
    </svg>
  )
}

// ============================================================================
// Switch Component
// ============================================================================

function SwitchComponent(
  {
    autoFocus = false,
    checked: controlledChecked,
    checkedChildren,
    defaultChecked = false,
    defaultValue,
    disabled = false,
    loading = false,
    size = 'default',
    unCheckedChildren,
    value,
    onChange,
    onClick,
    className,
    style,
    classNames: classNamesProp,
    styles,
    tabIndex,
    id,
  }: SwitchProps,
  ref: React.Ref<SwitchRef>,
) {
  // ---- Resolve aliases ----
  const resolvedControlled = value ?? controlledChecked
  const resolvedDefault = defaultValue ?? defaultChecked

  // ---- Controlled / uncontrolled ----
  const isControlled = resolvedControlled !== undefined
  const [internalChecked, setInternalChecked] = useState(resolvedDefault)
  const mergedChecked = isControlled ? resolvedControlled! : internalChecked

  const isDisabled = disabled || loading

  // ---- Refs ----
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hasChildren = checkedChildren !== undefined || unCheckedChildren !== undefined

  // ---- autoFocus ----
  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- useImperativeHandle ----
  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    blur: () => buttonRef.current?.blur(),
  }))

  // ---- Click handler ----
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return
    const newChecked = !mergedChecked
    if (!isControlled) {
      setInternalChecked(newChecked)
    }
    onChange?.(newChecked, e)
    onClick?.(newChecked, e)
  }

  // ---- BEM classes ----
  const rootClass = cx(
    'ino-switch',
    {
      'ino-switch--checked': mergedChecked,
      'ino-switch--unchecked': !mergedChecked,
      'ino-switch--disabled': isDisabled,
      'ino-switch--small': size === 'small',
    },
    className,
    classNamesProp?.root,
  )

  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      role="switch"
      aria-checked={mergedChecked}
      disabled={isDisabled}
      tabIndex={tabIndex}
      className={rootClass}
      style={{ ...styles?.root, ...style }}
      onClick={handleClick}
    >
      <span
        className={cx('ino-switch__track', classNamesProp?.track)}
        style={styles?.track}
      >
        {hasChildren && (
          <span
            className={cx('ino-switch__inner', classNamesProp?.inner)}
            style={styles?.inner}
          >
            {mergedChecked ? checkedChildren : unCheckedChildren}
          </span>
        )}
        <span
          className={cx('ino-switch__thumb', classNamesProp?.thumb)}
          style={styles?.thumb}
        >
          {loading && <SwitchSpinner size={size} />}
        </span>
      </span>
    </button>
  )
}

// ============================================================================
// Export
// ============================================================================

export const Switch = forwardRef<SwitchRef, SwitchProps>(SwitchComponent)
