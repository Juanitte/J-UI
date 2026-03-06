import { useState, useRef, useEffect, useCallback, createContext, useContext, Children, cloneElement, isValidElement } from 'react'
import type { ReactNode, CSSProperties, ChangeEvent } from 'react'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { classNames as cx } from '../../utils/classNames'

// ============================================================================
// Types
// ============================================================================

export type RadioSemanticSlot = 'root' | 'radio' | 'indicator' | 'label'
export type RadioClassNames = SemanticClassNames<RadioSemanticSlot>
export type RadioStyles = SemanticStyles<RadioSemanticSlot>

export type RadioGroupSemanticSlot = 'root'
export type RadioGroupClassNames = SemanticClassNames<RadioGroupSemanticSlot>
export type RadioGroupStyles = SemanticStyles<RadioGroupSemanticSlot>

export interface RadioChangeEvent {
  target: {
    checked: boolean
    value?: string | number
  }
  nativeEvent: Event
}

export interface RadioOptionType {
  label: ReactNode
  value: string | number
  disabled?: boolean
  style?: CSSProperties
  className?: string
}

export interface RadioProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  autoFocus?: boolean
  value?: string | number
  onChange?: (e: RadioChangeEvent) => void
  children?: ReactNode
  id?: string
  name?: string
  tabIndex?: number
  className?: string
  style?: CSSProperties
  classNames?: RadioClassNames
  styles?: RadioStyles
}

export interface RadioGroupProps {
  value?: string | number
  defaultValue?: string | number
  onChange?: (e: RadioChangeEvent) => void
  disabled?: boolean
  name?: string
  options?: (string | number | RadioOptionType)[]
  optionType?: 'default' | 'button'
  buttonStyle?: 'outline' | 'solid'
  size?: 'small' | 'middle' | 'large'
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: RadioGroupClassNames
  styles?: RadioGroupStyles
}

export type RadioButtonProps = RadioProps

// ============================================================================
// Size mapping for Radio.Button
// ============================================================================

const SIZE_MAP: Record<string, string> = {
  small: 'sm',
  middle: 'md',
  large: 'lg',
}

// ============================================================================
// Group Context
// ============================================================================

interface RadioGroupContextValue {
  value: string | number | undefined
  disabled: boolean
  name?: string
  onChange: (e: RadioChangeEvent) => void
  optionType: 'default' | 'button'
  buttonStyle: 'outline' | 'solid'
  size: 'small' | 'middle' | 'large'
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

// ============================================================================
// Radio Component
// ============================================================================

function RadioComponent({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
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
}: RadioProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  // Resolve state
  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  let mergedChecked: boolean
  let mergedDisabled: boolean
  let mergedName: string | undefined

  if (isInGroup) {
    mergedChecked = value !== undefined && groupContext.value === value
    mergedDisabled = disabled || groupContext.disabled
    mergedName = groupContext.name || name
  } else {
    mergedChecked = isControlled ? controlledChecked : internalChecked
    mergedDisabled = disabled
    mergedName = name
  }

  const [isFocused, setIsFocused] = useState(false)

  // autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (mergedDisabled) return

    const radioEvent: RadioChangeEvent = {
      target: { checked: e.target.checked, value },
      nativeEvent: e.nativeEvent,
    }

    if (isInGroup) {
      groupContext!.onChange(radioEvent)
    } else {
      if (!isControlled) {
        setInternalChecked(e.target.checked)
      }
      onChange?.(radioEvent)
    }
  }

  // ---- BEM classes ----
  const rootClass = cx(
    'ino-radio',
    {
      'ino-radio--checked': mergedChecked,
      'ino-radio--disabled': mergedDisabled,
      'ino-radio--focused': isFocused && focusSourceRef.current === 'keyboard',
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
        className={cx('ino-radio__circle', classNamesProp?.radio)}
        style={styles?.radio}
      >
        <input
          ref={inputRef}
          type="radio"
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
          className="ino-radio__input"
          value={value !== undefined ? String(value) : undefined}
        />
        {mergedChecked && (
          <span
            className={cx('ino-radio__indicator', classNamesProp?.indicator)}
            style={styles?.indicator}
          />
        )}
      </span>
      {children !== undefined && children !== null && (
        <span
          className={cx('ino-radio__label', classNamesProp?.label)}
          style={styles?.label}
        >
          {children}
        </span>
      )}
    </label>
  )
}

// ============================================================================
// Radio.Button Component
// ============================================================================

function RadioButtonComponent({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
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
  _position,
}: RadioButtonProps & { _position?: 'first' | 'middle' | 'last' | 'only' }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const mouseDownRef = useRef(false)
  const focusSourceRef = useRef<'mouse' | 'keyboard'>('keyboard')
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  const isControlled = controlledChecked !== undefined
  const [internalChecked, setInternalChecked] = useState(defaultChecked)

  let mergedChecked: boolean
  let mergedDisabled: boolean
  let mergedName: string | undefined

  const btnStyle = isInGroup ? groupContext.buttonStyle : 'outline'
  const size = isInGroup ? groupContext.size : 'middle'
  const sizeKey = SIZE_MAP[size] || 'md'

  if (isInGroup) {
    mergedChecked = value !== undefined && groupContext.value === value
    mergedDisabled = disabled || groupContext.disabled
    mergedName = groupContext.name || name
  } else {
    mergedChecked = isControlled ? controlledChecked : internalChecked
    mergedDisabled = disabled
    mergedName = name
  }

  const [isFocused, setIsFocused] = useState(false)

  // autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (mergedDisabled) return

    const radioEvent: RadioChangeEvent = {
      target: { checked: e.target.checked, value },
      nativeEvent: e.nativeEvent,
    }

    if (isInGroup) {
      groupContext!.onChange(radioEvent)
    } else {
      if (!isControlled) {
        setInternalChecked(e.target.checked)
      }
      onChange?.(radioEvent)
    }
  }

  // Collapse borders for non-first items
  const shouldCollapse = _position && _position !== 'first' && _position !== 'only'

  // ---- BEM classes ----
  const rootClass = cx(
    'ino-radio-btn',
    `ino-radio-btn--${sizeKey}`,
    `ino-radio-btn--${btnStyle}`,
    {
      'ino-radio-btn--checked': mergedChecked,
      'ino-radio-btn--disabled': mergedDisabled,
      'ino-radio-btn--focused': isFocused && focusSourceRef.current === 'keyboard',
      'ino-radio-btn--collapse': shouldCollapse,
      [`ino-radio-btn--${_position}`]: !!_position,
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
      <input
        ref={inputRef}
        type="radio"
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
        className="ino-radio__input"
        value={value !== undefined ? String(value) : undefined}
      />
      <span
        className={cx('ino-radio-btn__label', classNamesProp?.label)}
        style={styles?.label}
      >
        {children}
      </span>
    </label>
  )
}

// ============================================================================
// Radio.Group Component
// ============================================================================

function RadioGroupComponent({
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  name,
  options,
  optionType = 'default',
  buttonStyle = 'outline',
  size = 'middle',
  children,
  className,
  style,
  classNames: classNamesProp,
  styles,
}: RadioGroupProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue)
  const currentValue = isControlled ? controlledValue : internalValue

  const handleChange = useCallback((e: RadioChangeEvent) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }, [isControlled, onChange])

  const contextValue: RadioGroupContextValue = {
    value: currentValue,
    disabled,
    name,
    onChange: handleChange,
    optionType,
    buttonStyle,
    size,
  }

  // Normalize options
  const normalizedOptions: RadioOptionType[] | undefined = options?.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { label: String(opt), value: opt }
    }
    return opt
  })

  const RadioItem = optionType === 'button' ? RadioButtonComponent : RadioComponent

  // For button-type children, inject _position via cloneElement
  const resolvePosition = (index: number, total: number): 'first' | 'middle' | 'last' | 'only' => {
    if (total === 1) return 'only'
    if (index === 0) return 'first'
    if (index === total - 1) return 'last'
    return 'middle'
  }

  let renderedChildren: ReactNode
  if (normalizedOptions) {
    renderedChildren = normalizedOptions.map((opt, index) => (
      <RadioItem
        key={String(opt.value)}
        value={opt.value}
        disabled={opt.disabled}
        className={opt.className}
        style={opt.style}
        {...(optionType === 'button' ? { _position: resolvePosition(index, normalizedOptions.length) } : {})}
      >
        {opt.label}
      </RadioItem>
    ))
  } else if (optionType === 'button' && children) {
    const childArray = Children.toArray(children).filter(isValidElement)
    renderedChildren = childArray.map((child, index) =>
      cloneElement(child as React.ReactElement<any>, {
        _position: resolvePosition(index, childArray.length),
      })
    )
  } else {
    renderedChildren = children
  }

  const groupClass = cx(
    'ino-radio-group',
    {
      'ino-radio-group--default': optionType !== 'button',
      'ino-radio-group--button': optionType === 'button',
    },
    className,
    classNamesProp?.root,
  )

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="radiogroup"
        className={groupClass}
        style={{ ...styles?.root, ...style }}
      >
        {renderedChildren}
      </div>
    </RadioGroupContext.Provider>
  )
}

// ============================================================================
// Compound Export
// ============================================================================

export const Radio = Object.assign(RadioComponent, {
  Group: RadioGroupComponent,
  Button: RadioButtonComponent,
})
