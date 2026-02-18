import { useState, useRef, useEffect, useCallback, createContext, useContext, Children, cloneElement, isValidElement } from 'react'
import type { ReactNode, CSSProperties, ChangeEvent } from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticClassName, mergeSemanticStyle } from '../../utils/semanticDom'

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
// Size config (for Radio.Button)
// ============================================================================

const sizeConfig: Record<string, { height: string; fontSize: string; paddingH: string; radius: string }> = {
  small:  { height: '1.5rem',  fontSize: '0.75rem',  paddingH: '0.5rem',  radius: '0.25rem' },
  middle: { height: '2rem',    fontSize: '0.875rem', paddingH: '0.75rem', radius: '0.375rem' },
  large:  { height: '2.5rem',  fontSize: '1rem',     paddingH: '1rem',    radius: '0.5rem' },
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
  classNames,
  styles,
}: RadioProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const radioRef = useRef<HTMLSpanElement>(null)
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

  // Hover handlers — ref-based DOM manipulation (J-UI pattern)
  const hasCustomColors = !!(styles?.radio && (
    'backgroundColor' in styles.radio ||
    'borderColor' in styles.radio ||
    'border' in styles.radio
  ))

  const handleMouseEnter = () => {
    if (mergedDisabled || !radioRef.current) return
    if (hasCustomColors) {
      radioRef.current.style.filter = 'brightness(1.15)'
    } else if (mergedChecked) {
      radioRef.current.style.backgroundColor = tokens.colorPrimaryHover
      radioRef.current.style.borderColor = tokens.colorPrimaryHover
    } else {
      radioRef.current.style.borderColor = tokens.colorPrimary
    }
  }

  const handleMouseLeave = () => {
    if (mergedDisabled || !radioRef.current) return
    if (hasCustomColors) {
      radioRef.current.style.filter = ''
    } else if (mergedChecked) {
      radioRef.current.style.backgroundColor = tokens.colorPrimary
      radioRef.current.style.borderColor = tokens.colorPrimary
    } else {
      radioRef.current.style.borderColor = tokens.colorBorder
    }
  }

  // ---- Styles ----
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

  const radioBoxStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    border: `2px solid ${(mergedChecked || isFocused) ? tokens.colorPrimary : tokens.colorBorder}`,
    backgroundColor: mergedChecked ? tokens.colorPrimary : 'transparent',
    transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    flexShrink: 0,
    boxShadow: isFocused && !mergedDisabled && focusSourceRef.current === 'keyboard'
      ? `0 0 0 2px ${tokens.colorPrimaryLight}`
      : 'none',
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

  const indicatorStyle: CSSProperties = {
    width: '0.375rem',
    height: '0.375rem',
    borderRadius: '50%',
    backgroundColor: '#fff',
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
      onMouseDown={() => { mouseDownRef.current = true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        ref={radioRef}
        className={classNames?.radio}
        style={mergeSemanticStyle(radioBoxStyle, styles?.radio)}
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
          style={hiddenInputStyle}
          value={value !== undefined ? String(value) : undefined}
        />
        {mergedChecked && (
          <span
            className={classNames?.indicator}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...indicatorStyle,
              ...styles?.indicator,
            }}
          />
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
  classNames,
  styles,
  _position,
}: RadioButtonProps & { _position?: 'first' | 'middle' | 'last' | 'only' }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLLabelElement>(null)
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

  // Hover — ref-based
  const hasCustomColors = !!(styles?.root && (
    'backgroundColor' in styles.root ||
    'borderColor' in styles.root ||
    'border' in styles.root
  ))

  const handleMouseEnter = () => {
    if (mergedDisabled || !rootRef.current) return
    if (hasCustomColors) {
      rootRef.current.style.filter = 'brightness(1.15)'
    } else if (mergedChecked) {
      // Already active — subtle hover
      if (btnStyle === 'solid') {
        rootRef.current.style.backgroundColor = tokens.colorPrimaryHover
      } else {
        rootRef.current.style.color = tokens.colorPrimaryHover
        rootRef.current.style.borderColor = tokens.colorPrimaryHover
      }
    } else {
      rootRef.current.style.color = tokens.colorPrimary
      rootRef.current.style.borderColor = tokens.colorPrimary
    }
  }

  const handleMouseLeave = () => {
    if (mergedDisabled || !rootRef.current) return
    if (hasCustomColors) {
      rootRef.current.style.filter = ''
    } else if (mergedChecked) {
      if (btnStyle === 'solid') {
        rootRef.current.style.backgroundColor = tokens.colorPrimary
      } else {
        rootRef.current.style.color = tokens.colorPrimary
        rootRef.current.style.borderColor = tokens.colorPrimary
      }
    } else {
      rootRef.current.style.color = tokens.colorText
      rootRef.current.style.borderColor = tokens.colorBorder
    }
  }

  // ---- Styles ----
  const sc = sizeConfig[size]

  // Border-radius based on position within group
  let borderRadius: string
  if (_position === 'first') {
    borderRadius = `${sc.radius} 0 0 ${sc.radius}`
  } else if (_position === 'last') {
    borderRadius = `0 ${sc.radius} ${sc.radius} 0`
  } else if (_position === 'middle') {
    borderRadius = '0'
  } else {
    borderRadius = sc.radius // 'only' or standalone
  }

  const rootBaseStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sc.height,
    padding: `0 ${sc.paddingH}`,
    fontSize: sc.fontSize,
    fontFamily: 'inherit',
    lineHeight: 1,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius,
    cursor: mergedDisabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
    ...(mergedDisabled ? { opacity: 0.5 } : {}),
  }

  // Negative margin to collapse double borders (except first/only)
  if (_position && _position !== 'first' && _position !== 'only') {
    rootBaseStyle.marginLeft = '-1px'
  }

  // Apply checked/unchecked visual
  if (mergedChecked) {
    if (btnStyle === 'solid') {
      rootBaseStyle.backgroundColor = tokens.colorPrimary
      rootBaseStyle.borderColor = tokens.colorPrimary
      rootBaseStyle.color = tokens.colorPrimaryContrast
    } else {
      rootBaseStyle.backgroundColor = tokens.colorBg
      rootBaseStyle.borderColor = tokens.colorPrimary
      rootBaseStyle.color = tokens.colorPrimary
    }
  } else {
    rootBaseStyle.backgroundColor = tokens.colorBg
    rootBaseStyle.borderColor = isFocused ? tokens.colorPrimary : tokens.colorBorder
    rootBaseStyle.color = isFocused ? tokens.colorPrimary : tokens.colorText
  }

  // Focus ring (keyboard only)
  rootBaseStyle.boxShadow = isFocused && !mergedDisabled && focusSourceRef.current === 'keyboard'
    ? `0 0 0 2px ${tokens.colorPrimaryLight}`
    : 'none'

  // Z-index so checked/focused button's border shows on top of collapsed neighbors
  if (mergedChecked || isFocused) {
    rootBaseStyle.zIndex = 1
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

  return (
    <label
      ref={rootRef}
      className={mergeSemanticClassName(className, classNames?.root)}
      style={mergeSemanticStyle(rootBaseStyle, styles?.root, style)}
      onMouseDown={() => { mouseDownRef.current = true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        style={hiddenInputStyle}
        value={value !== undefined ? String(value) : undefined}
      />
      <span
        className={classNames?.label}
        style={mergeSemanticStyle({ whiteSpace: 'nowrap' }, styles?.label)}
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
  classNames,
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

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="radiogroup"
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(
          { display: 'inline-flex', flexWrap: 'wrap', gap: optionType === 'button' ? 0 : '0.5rem', alignItems: 'center' },
          styles?.root,
          style,
        )}
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
