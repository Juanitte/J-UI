import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react'
import type { ReactNode, CSSProperties, ChangeEvent } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

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
  classNames,
  styles,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const checkboxRef = useRef<HTMLSpanElement>(null)
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

  // Hover handlers — direct DOM style manipulation (J-UI pattern)
  // When custom colors are set via styles.checkbox, use filter instead of overriding colors
  const hasCustomColors = !!(styles?.checkbox && (
    'backgroundColor' in styles.checkbox ||
    'borderColor' in styles.checkbox ||
    'border' in styles.checkbox
  ))

  const handleMouseEnter = () => {
    if (mergedDisabled || !checkboxRef.current) return
    if (hasCustomColors) {
      checkboxRef.current.style.filter = 'brightness(1.15)'
    } else if (mergedChecked || indeterminate) {
      checkboxRef.current.style.backgroundColor = tokens.colorPrimaryHover
      checkboxRef.current.style.borderColor = tokens.colorPrimaryHover
    } else {
      checkboxRef.current.style.borderColor = tokens.colorPrimary
    }
  }

  const handleMouseLeave = () => {
    if (mergedDisabled || !checkboxRef.current) return
    if (hasCustomColors) {
      checkboxRef.current.style.filter = ''
    } else if (mergedChecked || indeterminate) {
      checkboxRef.current.style.backgroundColor = tokens.colorPrimary
      checkboxRef.current.style.borderColor = tokens.colorPrimary
    } else {
      checkboxRef.current.style.borderColor = tokens.colorBorder
    }
  }

  // ---- Styles ----

  const isActive = mergedChecked || indeterminate

  const rootStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    minHeight: '2.75rem',
    cursor: mergedDisabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    lineHeight: 1,
    ...(mergedDisabled ? { opacity: 0.5 } : {}),
  }

  const checkboxBoxStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1rem',
    height: '1rem',
    borderRadius: '0.25rem',
    border: `2px solid ${isActive ? tokens.colorPrimary : tokens.colorBorder}`,
    backgroundColor: isActive ? tokens.colorPrimary : 'transparent',
    color: '#fff',
    transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    flexShrink: 0,
    ...(isFocused && !mergedDisabled ? {
      boxShadow: `0 0 0 2px ${tokens.colorPrimaryLight}`,
    } : {}),
  }

  const hiddenInputStyle: CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  }

  const labelStyle: CSSProperties = {
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    color: mergedDisabled ? tokens.colorTextSubtle : tokens.colorText,
  }

  return (
    <label
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootStyle, styles?.root, style)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        ref={checkboxRef}
        className={classNames?.checkbox}
        style={mergeSemanticStyle(checkboxBoxStyle, styles?.checkbox)}
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={hiddenInputStyle}
          value={value !== undefined ? String(value) : undefined}
        />
        {isActive && (
          <span
            className={classNames?.indicator}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...styles?.indicator,
            }}
          >
            {indeterminate ? <MinusIcon /> : <CheckIcon />}
          </span>
        )}
      </span>
      {children !== undefined && children !== null && (
        <span
          className={classNames?.label}
          style={mergeSemanticStyle(labelStyle, styles?.label)}
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
  classNames,
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
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(
          { display: 'inline-flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' },
          styles?.root,
          style,
        )}
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
