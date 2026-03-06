import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react'
import type { ReactNode, CSSProperties, ChangeEvent } from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

// ============================================================================
// Types
// ============================================================================

export type CheckboxSemanticSlot = 'root' | 'checkbox' | 'indicator' | 'label'
export type CheckboxClassNames = SemanticClassNames<CheckboxSemanticSlot>
export type CheckboxStyles = SemanticStyles<CheckboxSemanticSlot>

export type CheckboxGroupSemanticSlot = 'root'
export type CheckboxGroupClassNames = SemanticClassNames<CheckboxGroupSemanticSlot>
export type CheckboxGroupStyles = SemanticStyles<CheckboxGroupSemanticSlot>

export interface CheckboxChangeEvent {
  target: {
    checked: boolean
    value?: string | number
  }
  nativeEvent: Event
}

export interface CheckboxOptionType {
  label: ReactNode
  value: string | number
  disabled?: boolean
  style?: CSSProperties
  className?: string
}

export interface CheckboxProps {
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean
  /** Initial checked state (uncontrolled) */
  defaultChecked?: boolean
  /** Disables the checkbox */
  disabled?: boolean
  /** Shows indeterminate (partial) state */
  indeterminate?: boolean
  /** Auto focus on mount */
  autoFocus?: boolean
  /** Callback when state changes */
  onChange?: (e: CheckboxChangeEvent) => void
  /** Value, used within Checkbox.Group */
  value?: string | number
  /** Label content */
  children?: ReactNode
  /** HTML id */
  id?: string
  /** HTML name */
  name?: string
  /** Tab index */
  tabIndex?: number
  /** CSS class */
  className?: string
  /** Inline styles */
  style?: CSSProperties
  /** Semantic slot classes */
  classNames?: CheckboxClassNames
  /** Semantic slot styles */
  styles?: CheckboxStyles
}

export interface CheckboxGroupProps {
  /** Options array for generating checkboxes */
  options?: (string | number | CheckboxOptionType)[]
  /** Currently selected values (controlled) */
  value?: (string | number)[]
  /** Initial selected values (uncontrolled) */
  defaultValue?: (string | number)[]
  /** Disables all checkboxes in the group */
  disabled?: boolean
  /** Name attribute for all inputs */
  name?: string
  /** Callback when selection changes */
  onChange?: (checkedValues: (string | number)[]) => void
  /** Checkbox children (alternative to options) */
  children?: ReactNode
  /** CSS class */
  className?: string
  /** Inline styles */
  style?: CSSProperties
  /** Semantic slot classes */
  classNames?: CheckboxGroupClassNames
  /** Semantic slot styles */
  styles?: CheckboxGroupStyles
}

// ============================================================================
// Icons
// ============================================================================

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 5.5 4 7.5 8 3" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2.5" y1="5" x2="7.5" y2="5" />
    </svg>
  )
}

// ============================================================================
// Group Context
// ============================================================================

interface CheckboxGroupContextValue {
  value: (string | number)[]
  disabled: boolean
  name?: string
  toggleValue: (val: string | number) => void
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)

// ============================================================================
// Checkbox Component
// ============================================================================

function CheckboxComponent({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  indeterminate = false,
  autoFocus = false,
  onChange,
  value,
  children,
  id,
  name,
  tabIndex,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')
  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  // Resolve state
  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  let mergedChecked: boolean
  let mergedDisabled: boolean
  let mergedName: string | undefined

  if (isInGroup) {
    mergedChecked = value !== undefined && groupContext.value.includes(value)
    mergedDisabled = disabled || groupContext.disabled
    mergedName = groupContext.name || name
  } else {
    mergedChecked = isControlled ? controlledChecked : internalChecked
    mergedDisabled = disabled
    mergedName = name
  }

  const [isFocused, setIsFocused] = useState(false)

  const isActive = mergedChecked || indeterminate

  // Set indeterminate on native input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  // autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (mergedDisabled) return

    if (isInGroup && value !== undefined) {
      groupContext!.toggleValue(value)
    } else {
      const newChecked = e.target.checked
      if (!isControlled) {
        setInternalChecked(newChecked)
      }
      onChange?.({
        target: { checked: newChecked, value },
        nativeEvent: e.nativeEvent,
      })
    }
  }

  // ---- BEM classes ----
  const rootClass = cx(
    'ino-checkbox',
    {
      'ino-checkbox--active': isActive,
      'ino-checkbox--disabled': mergedDisabled,
      'ino-checkbox--focused': isFocused && focusSourceRef.current === 'keyboard',
    },
    className,
    classNamesProp?.root,
  )

  return (
    <label
      className={rootClass}
      style={{ ...styles?.root, ...style }}
      onMouseDown={() => { mouseDownRef.current = true }}
    >
      <span
        className={cx('ino-checkbox__box', classNamesProp?.checkbox)}
        style={styles?.checkbox}
      >
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          name={mergedName}
          checked={mergedChecked}
          disabled={mergedDisabled}
          tabIndex={tabIndex}
          onChange={handleChange}
          onFocus={() => {
            focusSourceRef.current = mouseDownRef.current ? 'mouse' : 'keyboard'
            mouseDownRef.current = false
            setIsFocused(true)
          }}
          onBlur={() => setIsFocused(false)}
          className="ino-checkbox__input"
          value={value !== undefined ? String(value) : undefined}
        />
        {isActive && (
          <span
            className={cx('ino-checkbox__indicator', classNamesProp?.indicator)}
            style={styles?.indicator}
          >
            {indeterminate ? <MinusIcon /> : <CheckIcon />}
          </span>
        )}
      </span>
      {children !== undefined && children !== null && (
        <span
          className={cx('ino-checkbox__label', classNamesProp?.label)}
          style={styles?.label}
        >
          {children}
        </span>
      )}
    </label>
  )
}

// ============================================================================
// Checkbox.Group Component
// ============================================================================

function CheckboxGroupComponent({
  options,
  value: controlledValue,
  defaultValue = [],
  disabled = false,
  name,
  onChange,
  children,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: CheckboxGroupProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const toggleValue = useCallback((val: string | number) => {
    const newValue = currentValue.includes(val)
      ? currentValue.filter(v => v !== val)
      : [...currentValue, val]

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [currentValue, isControlled, onChange])

  const contextValue: CheckboxGroupContextValue = {
    value: currentValue,
    disabled,
    name,
    toggleValue,
  }

  // Normalize options
  const normalizedOptions: CheckboxOptionType[] | undefined = options?.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt }
    }
    return opt
  })

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div
        role="group"
        className={cx('ino-checkbox-group', className, classNamesProp?.root)}
        style={{ ...styles?.root, ...style }}
      >
        {normalizedOptions
          ? normalizedOptions.map(opt => (
              <CheckboxComponent
                key={String(opt.value)}
                value={opt.value}
                disabled={opt.disabled}
                className={opt.className}
                style={opt.style}
              >
                {opt.label}
              </CheckboxComponent>
            ))
          : children
        }
      </div>
    </CheckboxGroupContext.Provider>
  )
}

// ============================================================================
// Compound Export
// ============================================================================

export const Checkbox = Object.assign(CheckboxComponent, {
  Group: CheckboxGroupComponent,
})
