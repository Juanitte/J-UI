import {
  type ReactNode, type ReactElement, type CSSProperties,
  useState, useRef, useEffect, useCallback, useMemo, useContext, createContext,
  Children, cloneElement,
} from 'react'
import { tokens } from '../../theme/tokens'
import type { SemanticClassNames, SemanticStyles } from '../../utils/semanticDom'
import { mergeSemanticStyle, mergeSemanticClassName } from '../../utils/semanticDom'

// ============================================================================
// Types
// ============================================================================

/** Path to a field: 'username', ['address', 'city'], or ['items', 0, 'name'] */
export type NamePath = string | number | (string | number)[]

/** Internal normalized path — always an array */
type InternalNamePath = (string | number)[]

export type FormLayout = 'horizontal' | 'vertical' | 'inline'
export type FormValidateStatus = 'success' | 'warning' | 'error' | 'validating' | ''
export type FormVariant = 'outlined' | 'filled' | 'borderless' | 'underlined'
export type FormSize = 'small' | 'middle' | 'large'
export type FormRequiredMark =
  | boolean
  | 'optional'
  | { position: 'prefix' | 'suffix' }
  | ((label: ReactNode, info: { required: boolean }) => ReactNode)

// ---- Semantic slots ----

export type FormSemanticSlot = 'root'
export type FormClassNames = SemanticClassNames<FormSemanticSlot>
export type FormStyles = SemanticStyles<FormSemanticSlot>

export type FormItemSemanticSlot = 'root' | 'label' | 'control' | 'help' | 'extra'
export type FormItemClassNames = SemanticClassNames<FormItemSemanticSlot>
export type FormItemStyles = SemanticStyles<FormItemSemanticSlot>

// ---- Validation ----

export interface FormRule {
  required?: boolean
  message?: string | ReactNode
  type?: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'integer' | 'float'
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  whitespace?: boolean
  enum?: any[]
  validator?: (rule: FormRule, value: any) => Promise<void>
  transform?: (value: any) => any
  validateTrigger?: string | string[]
  warningOnly?: boolean
}

export interface FieldError {
  name: InternalNamePath
  errors: string[]
  warnings: string[]
}

export interface FieldData {
  name: InternalNamePath
  value: any
  touched: boolean
  validating: boolean
  errors: string[]
  warnings: string[]
}

// ---- FormInstance ----

export interface FormInstance {
  getFieldValue: (name: NamePath) => any
  getFieldsValue: (nameList?: NamePath[] | true) => Record<string, any>
  setFieldValue: (name: NamePath, value: any) => void
  setFieldsValue: (values: Record<string, any>) => void
  validateFields: (nameList?: NamePath[], options?: { validateOnly?: boolean }) => Promise<Record<string, any>>
  resetFields: (nameList?: NamePath[]) => void
  isFieldTouched: (name: NamePath) => boolean
  isFieldsTouched: (nameList?: NamePath[], allFieldsTouched?: boolean) => boolean
  getFieldError: (name: NamePath) => string[]
  getFieldsError: (nameList?: NamePath[]) => FieldError[]
  submit: () => void
  scrollToField: (name: NamePath, options?: ScrollIntoViewOptions) => void
  isFieldValidating: (name: NamePath) => boolean
  getFieldsData: () => FieldData[]
  /** @internal */
  _getStore: () => FormStore
}

// ---- Form Props ----

export interface FormProps {
  form?: FormInstance
  name?: string
  layout?: FormLayout
  variant?: FormVariant
  size?: FormSize
  initialValues?: Record<string, any>
  onFinish?: (values: Record<string, any>) => void
  onFinishFailed?: (errorInfo: { values: Record<string, any>; errorFields: FieldError[] }) => void
  onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void
  fields?: FieldData[]
  validateTrigger?: string | string[]
  colon?: boolean
  labelAlign?: 'left' | 'right'
  labelWrap?: boolean
  requiredMark?: FormRequiredMark
  disabled?: boolean
  scrollToFirstError?: boolean | ScrollIntoViewOptions
  children?: ReactNode
  className?: string
  style?: CSSProperties
  classNames?: FormClassNames
  styles?: FormStyles
}

// ---- Form.Item Props ----

interface FieldControl {
  value: any
  [trigger: string]: any
}

interface FieldMeta {
  touched: boolean
  validating: boolean
  errors: string[]
  warnings: string[]
  name: InternalNamePath
}

export interface FormItemProps {
  name?: NamePath
  label?: ReactNode
  layout?: FormLayout
  rules?: FormRule[]
  dependencies?: NamePath[]
  validateTrigger?: string | string[]
  validateFirst?: boolean
  validateDebounce?: number
  valuePropName?: string
  trigger?: string
  getValueFromEvent?: (...args: any[]) => any
  getValueProps?: (value: any) => Record<string, any>
  normalize?: (value: any, prevValue: any, allValues: Record<string, any>) => any
  shouldUpdate?: boolean | ((prevValues: Record<string, any>, curValues: Record<string, any>) => boolean)
  noStyle?: boolean
  hidden?: boolean
  required?: boolean
  colon?: boolean
  labelAlign?: 'left' | 'right'
  hasFeedback?: boolean
  help?: ReactNode
  extra?: ReactNode
  validateStatus?: FormValidateStatus
  initialValue?: any
  children?: ReactNode | ((control: FieldControl, meta: FieldMeta, form: FormInstance) => ReactNode)
  className?: string
  style?: CSSProperties
  classNames?: FormItemClassNames
  styles?: FormItemStyles
}

// ---- Form.List ----

export interface FormListField {
  name: number
  key: number
}

export interface FormListOperations {
  add: (defaultValue?: any, insertIndex?: number) => void
  remove: (index: number | number[]) => void
  move: (from: number, to: number) => void
}

export interface FormListProps {
  name: NamePath
  children: (
    fields: FormListField[],
    operations: FormListOperations,
    meta: { errors: ReactNode[] }
  ) => ReactNode
  initialValue?: any[]
}

// ---- Form.ErrorList ----

export interface FormErrorListProps {
  errors?: ReactNode[]
  className?: string
  style?: CSSProperties
}

// ---- Form.Provider ----

export interface FormProviderProps {
  onFormFinish?: (name: string, info: { values: Record<string, any>; forms: Record<string, FormInstance> }) => void
  onFormChange?: (name: string, info: { changedFields: FieldData[]; forms: Record<string, FormInstance> }) => void
  children?: ReactNode
}

// ============================================================================
// Helpers
// ============================================================================

function normalizeToArray(val: string | string[] | undefined): string[] {
  if (!val) return ['onChange']
  return Array.isArray(val) ? val : [val]
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date((obj as any).getTime()) as T
  if (obj instanceof RegExp) return new RegExp((obj as any).source, (obj as any).flags) as T
  if (Array.isArray(obj)) return obj.map(deepClone) as T
  const result: any = {}
  for (const key of Object.keys(obj as any)) {
    result[key] = deepClone((obj as any)[key])
  }
  return result
}

// Spinning SVG for validating state (ref-based animation, no @keyframes needed)
function SpinningSvg({ color }: { color: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let deg = 0
    let raf: number
    const tick = () => {
      deg = (deg + 4) % 360
      el.style.transform = `rotate(${deg}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <svg ref={ref} viewBox="0 0 1024 1024" width="14" height="14" fill={color} style={{ flexShrink: 0 }}>
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.3 199.3 0 19.9-16.1 36-36 36z" />
    </svg>
  )
}

// Feedback icons for hasFeedback
function FeedbackIcon({ status }: { status: FormValidateStatus }) {
  if (status === 'success') return (
    <svg viewBox="64 64 896 896" width="14" height="14" fill={tokens.colorSuccess} style={{ flexShrink: 0 }}>
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" />
    </svg>
  )
  if (status === 'error') return (
    <svg viewBox="64 64 896 896" width="14" height="14" fill={tokens.colorError} style={{ flexShrink: 0 }}>
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z" />
    </svg>
  )
  if (status === 'warning') return (
    <svg viewBox="64 64 896 896" width="14" height="14" fill={tokens.colorWarning} style={{ flexShrink: 0 }}>
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
    </svg>
  )
  if (status === 'validating') return <SpinningSvg color={tokens.colorPrimary} />
  return null
}

// ============================================================================
// FormStore
// ============================================================================

type Subscriber = () => void

class FormStore {
  private values: Record<string, any> = {}
  private initialValues: Record<string, any> = {}
  private subscribers: Map<string, Set<Subscriber>> = new Map()
  private globalSubscribers: Set<Subscriber> = new Set()
  private touchedFields: Set<string> = new Set()
  private fieldErrors: Map<string, string[]> = new Map()
  private fieldWarnings: Map<string, string[]> = new Map()
  private validatingFields: Set<string> = new Set()
  private rules: Map<string, FormRule[]> = new Map()
  private onValuesChange?: (changedValues: Record<string, any>, allValues: Record<string, any>) => void
  private onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void

  // ---- Static path utilities ----

  static toPathArray(name: NamePath): InternalNamePath {
    if (Array.isArray(name)) return name
    if (typeof name === 'number') return [name]
    return String(name).split('.')
  }

  static toPathKey(name: NamePath): string {
    const arr = FormStore.toPathArray(name)
    return arr.join('.')
  }

  static getNestedValue(obj: any, path: InternalNamePath): any {
    let current = obj
    for (const key of path) {
      if (current == null) return undefined
      current = current[key]
    }
    return current
  }

  private static setNestedValue(obj: any, path: InternalNamePath, value: any): any {
    if (path.length === 0) return value
    const result = Array.isArray(obj) ? [...obj] : { ...obj }
    const [head, ...rest] = path
    if (rest.length === 0) {
      result[head] = value
    } else {
      result[head] = FormStore.setNestedValue(
        result[head] ?? (typeof rest[0] === 'number' ? [] : {}),
        rest,
        value
      )
    }
    return result
  }

  // ---- Initialization ----

  setInitialValues(values: Record<string, any>, init: boolean): void {
    this.initialValues = deepClone(values)
    if (init) {
      this.values = deepClone(values)
    }
  }

  setOnValuesChange(fn?: (changed: Record<string, any>, all: Record<string, any>) => void): void {
    this.onValuesChange = fn
  }

  setOnFieldsChange(fn?: (changedFields: FieldData[], allFields: FieldData[]) => void): void {
    this.onFieldsChange = fn
  }

  // ---- Value access ----

  getFieldValue(name: NamePath): any {
    const path = FormStore.toPathArray(name)
    return FormStore.getNestedValue(this.values, path)
  }

  getFieldsValue(nameList?: NamePath[] | true): Record<string, any> {
    if (!nameList || nameList === true) return deepClone(this.values)
    const result: Record<string, any> = {}
    for (const name of nameList) {
      const key = FormStore.toPathKey(name)
      result[key] = this.getFieldValue(name)
    }
    return result
  }

  setFieldValue(name: NamePath, value: any): void {
    const path = FormStore.toPathArray(name)
    this.values = FormStore.setNestedValue(this.values, path, value)
    this.notify(name)
    this.notifyGlobal()
    if (this.onValuesChange) {
      const changed: Record<string, any> = {}
      changed[FormStore.toPathKey(name)] = value
      this.onValuesChange(changed, deepClone(this.values))
    }
    if (this.onFieldsChange) {
      const key = FormStore.toPathKey(name)
      const changedField: FieldData = {
        name: path,
        value,
        touched: this.touchedFields.has(key),
        validating: this.validatingFields.has(key),
        errors: this.fieldErrors.get(key) || [],
        warnings: this.fieldWarnings.get(key) || [],
      }
      this.onFieldsChange([changedField], this.getFieldsData())
    }
  }

  setFieldsValue(values: Record<string, any>): void {
    const merge = (target: any, source: any): any => {
      if (source === null || typeof source !== 'object' || Array.isArray(source)) return source
      const result = { ...target }
      for (const key of Object.keys(source)) {
        result[key] = merge(result[key], source[key])
      }
      return result
    }
    this.values = merge(this.values, values)
    this.notifyAll()
    if (this.onValuesChange) {
      this.onValuesChange(deepClone(values), deepClone(this.values))
    }
    if (this.onFieldsChange) {
      this.onFieldsChange(this.getFieldsData(), this.getFieldsData())
    }
  }

  // Set external fields (for controlled mode)
  setFields(fields: FieldData[]): void {
    for (const field of fields) {
      const path = field.name
      const key = FormStore.toPathKey(path)
      if (field.value !== undefined) {
        this.values = FormStore.setNestedValue(this.values, path, field.value)
      }
      if (field.touched !== undefined) {
        if (field.touched) this.touchedFields.add(key)
        else this.touchedFields.delete(key)
      }
      if (field.errors) this.fieldErrors.set(key, field.errors)
      if (field.warnings) this.fieldWarnings.set(key, field.warnings)
      this.notify(path)
    }
    this.notifyGlobal()
  }

  // ---- FieldData access ----

  getFieldsData(): FieldData[] {
    const result: FieldData[] = []
    for (const key of this.rules.keys()) {
      const path = key.split('.') as InternalNamePath
      result.push({
        name: path,
        value: this.getFieldValue(path),
        touched: this.touchedFields.has(key),
        validating: this.validatingFields.has(key),
        errors: this.fieldErrors.get(key) || [],
        warnings: this.fieldWarnings.get(key) || [],
      })
    }
    return result
  }

  // ---- Subscriptions ----

  subscribe(name: NamePath, subscriber: Subscriber): () => void {
    const key = FormStore.toPathKey(name)
    if (!this.subscribers.has(key)) this.subscribers.set(key, new Set())
    this.subscribers.get(key)!.add(subscriber)
    return () => {
      this.subscribers.get(key)?.delete(subscriber)
    }
  }

  subscribeAll(subscriber: Subscriber): () => void {
    this.globalSubscribers.add(subscriber)
    return () => { this.globalSubscribers.delete(subscriber) }
  }

  private notify(name: NamePath): void {
    const key = FormStore.toPathKey(name)
    this.subscribers.get(key)?.forEach(fn => fn())
  }

  private notifyAll(): void {
    this.subscribers.forEach(subs => subs.forEach(fn => fn()))
    this.notifyGlobal()
  }

  private notifyGlobal(): void {
    this.globalSubscribers.forEach(fn => fn())
  }

  // ---- Touch ----

  touchField(name: NamePath): void {
    this.touchedFields.add(FormStore.toPathKey(name))
  }

  isFieldTouched(name: NamePath): boolean {
    return this.touchedFields.has(FormStore.toPathKey(name))
  }

  isFieldsTouched(nameList?: NamePath[], allFieldsTouched = false): boolean {
    if (!nameList) {
      return this.touchedFields.size > 0
    }
    const keys = nameList.map(n => FormStore.toPathKey(n))
    return allFieldsTouched
      ? keys.every(k => this.touchedFields.has(k))
      : keys.some(k => this.touchedFields.has(k))
  }

  // ---- Errors ----

  getFieldError(name: NamePath): string[] {
    return this.fieldErrors.get(FormStore.toPathKey(name)) || []
  }

  getFieldWarning(name: NamePath): string[] {
    return this.fieldWarnings.get(FormStore.toPathKey(name)) || []
  }

  getFieldsError(nameList?: NamePath[]): FieldError[] {
    const keys = nameList
      ? nameList.map(n => FormStore.toPathKey(n))
      : Array.from(this.rules.keys())
    return keys.map(key => ({
      name: key.split('.') as InternalNamePath,
      errors: this.fieldErrors.get(key) || [],
      warnings: this.fieldWarnings.get(key) || [],
    }))
  }

  isFieldValidating(name: NamePath): boolean {
    return this.validatingFields.has(FormStore.toPathKey(name))
  }

  // ---- Rules ----

  registerRules(name: NamePath, rules: FormRule[]): void {
    this.rules.set(FormStore.toPathKey(name), rules)
  }

  unregisterField(name: NamePath): void {
    const key = FormStore.toPathKey(name)
    this.rules.delete(key)
    this.fieldErrors.delete(key)
    this.fieldWarnings.delete(key)
    this.validatingFields.delete(key)
    this.touchedFields.delete(key)
  }

  // ---- Validation ----

  async validateField(name: NamePath, options?: { validateFirst?: boolean }): Promise<string[]> {
    const key = FormStore.toPathKey(name)
    const rules = this.rules.get(key) || []
    if (rules.length === 0) {
      this.fieldErrors.delete(key)
      this.fieldWarnings.delete(key)
      this.notify(name)
      return []
    }

    let value = this.getFieldValue(name)

    this.validatingFields.add(key)
    this.notify(name)

    const errors: string[] = []
    const warnings: string[] = []

    for (const rule of rules) {
      try {
        let testValue = value
        if (rule.transform) testValue = rule.transform(testValue)

        // required
        if (rule.required) {
          if (
            testValue === undefined || testValue === null || testValue === '' ||
            (Array.isArray(testValue) && testValue.length === 0)
          ) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `This field is required`)
          }
        }

        // skip remaining checks if value is empty and not required
        if (testValue === undefined || testValue === null || testValue === '') continue

        // type checks
        if (rule.type === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(testValue))) {
            throw new Error(typeof rule.message === 'string' ? rule.message : 'Not a valid email')
          }
        }
        if (rule.type === 'url') {
          try { new URL(String(testValue)) } catch {
            throw new Error(typeof rule.message === 'string' ? rule.message : 'Not a valid URL')
          }
        }
        if (rule.type === 'number' && typeof testValue !== 'number') {
          throw new Error(typeof rule.message === 'string' ? rule.message : 'Must be a number')
        }
        if (rule.type === 'integer') {
          if (typeof testValue !== 'number' || !Number.isInteger(testValue)) {
            throw new Error(typeof rule.message === 'string' ? rule.message : 'Must be an integer')
          }
        }
        if (rule.type === 'float') {
          if (typeof testValue !== 'number') {
            throw new Error(typeof rule.message === 'string' ? rule.message : 'Must be a number')
          }
        }
        if (rule.type === 'boolean' && typeof testValue !== 'boolean') {
          throw new Error(typeof rule.message === 'string' ? rule.message : 'Must be a boolean')
        }

        // min / max
        if (rule.min !== undefined) {
          if (typeof testValue === 'string' && testValue.length < rule.min) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `Must be at least ${rule.min} characters`)
          }
          if (typeof testValue === 'number' && testValue < rule.min) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `Must be at least ${rule.min}`)
          }
          if (Array.isArray(testValue) && testValue.length < rule.min) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `Must have at least ${rule.min} items`)
          }
        }
        if (rule.max !== undefined) {
          if (typeof testValue === 'string' && testValue.length > rule.max) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `Must be at most ${rule.max} characters`)
          }
          if (typeof testValue === 'number' && testValue > rule.max) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `Must be at most ${rule.max}`)
          }
          if (Array.isArray(testValue) && testValue.length > rule.max) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `Must have at most ${rule.max} items`)
          }
        }

        // len
        if (rule.len !== undefined) {
          const length = typeof testValue === 'string' ? testValue.length :
            Array.isArray(testValue) ? testValue.length : 0
          if (length !== rule.len) {
            throw new Error(typeof rule.message === 'string' ? rule.message : `Must be exactly ${rule.len} characters`)
          }
        }

        // pattern
        if (rule.pattern && !rule.pattern.test(String(testValue))) {
          throw new Error(typeof rule.message === 'string' ? rule.message : 'Does not match the required pattern')
        }

        // whitespace
        if (rule.whitespace && typeof testValue === 'string' && !testValue.trim()) {
          throw new Error(typeof rule.message === 'string' ? rule.message : 'Cannot be only whitespace')
        }

        // enum
        if (rule.enum && !rule.enum.includes(testValue)) {
          throw new Error(typeof rule.message === 'string' ? rule.message : `Must be one of: ${rule.enum.join(', ')}`)
        }

        // custom validator
        if (rule.validator) {
          await rule.validator(rule, testValue)
        }
      } catch (err: any) {
        const msg = err?.message || String(err)
        if (rule.warningOnly) {
          warnings.push(msg)
        } else {
          errors.push(msg)
          // validateFirst: stop on first error
          if (options?.validateFirst) break
        }
      }
    }

    this.fieldErrors.set(key, errors)
    this.fieldWarnings.set(key, warnings)
    this.validatingFields.delete(key)
    this.notify(name)

    return errors
  }

  async validateFields(nameList?: NamePath[], options?: { validateOnly?: boolean }): Promise<Record<string, any>> {
    const keys = nameList
      ? nameList.map(n => FormStore.toPathKey(n))
      : Array.from(this.rules.keys())

    const allErrors: FieldError[] = []
    for (const key of keys) {
      const path = key.split('.') as InternalNamePath
      const errors = await this.validateField(path)
      if (errors.length > 0) {
        allErrors.push({
          name: path,
          errors,
          warnings: this.fieldWarnings.get(key) || [],
        })
      }
    }

    // validateOnly: don't update UI, just return result
    if (options?.validateOnly) {
      if (allErrors.length > 0) {
        throw {
          values: deepClone(this.values),
          errorFields: allErrors,
        }
      }
      return deepClone(this.values)
    }

    if (allErrors.length > 0) {
      throw {
        values: deepClone(this.values),
        errorFields: allErrors,
      }
    }

    return deepClone(this.values)
  }

  // ---- Reset ----

  resetFields(nameList?: NamePath[]): void {
    if (!nameList) {
      this.values = deepClone(this.initialValues)
      this.touchedFields.clear()
      this.fieldErrors.clear()
      this.fieldWarnings.clear()
      this.validatingFields.clear()
      this.notifyAll()
    } else {
      for (const name of nameList) {
        const path = FormStore.toPathArray(name)
        const key = FormStore.toPathKey(name)
        const initVal = FormStore.getNestedValue(this.initialValues, path)
        this.values = FormStore.setNestedValue(this.values, path, initVal !== undefined ? deepClone(initVal) : undefined)
        this.touchedFields.delete(key)
        this.fieldErrors.delete(key)
        this.fieldWarnings.delete(key)
        this.validatingFields.delete(key)
        this.notify(name)
      }
    }
  }

  // ---- Scroll ----

  scrollToField(name: NamePath, options?: ScrollIntoViewOptions): void {
    const key = FormStore.toPathKey(name)
    const el = document.querySelector(`[data-field-name="${key}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', ...options })
    }
  }
}

// ============================================================================
// Contexts
// ============================================================================

interface FormContextValue {
  form: FormInstance
  layout: FormLayout
  variant: FormVariant
  size: FormSize
  colon: boolean
  labelAlign: 'left' | 'right'
  labelWrap: boolean
  requiredMark: FormRequiredMark
  disabled: boolean
  validateTrigger: string | string[]
}

const FormContext = createContext<FormContextValue | null>(null)

interface FormListContextValue {
  prefixPath: InternalNamePath
}

const FormListContext = createContext<FormListContextValue | null>(null)

// Form.Provider context
interface FormProviderContextValue {
  registerForm: (name: string, form: FormInstance) => void
  unregisterForm: (name: string) => void
  onFormFinish?: (name: string, info: { values: Record<string, any>; forms: Record<string, FormInstance> }) => void
  onFormChange?: (name: string, info: { changedFields: FieldData[]; forms: Record<string, FormInstance> }) => void
}

const FormProviderContext = createContext<FormProviderContextValue | null>(null)

// ============================================================================
// useForm
// ============================================================================

export function useForm(form?: FormInstance): [FormInstance] {
  const storeRef = useRef<FormStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = new FormStore()
  }

  const formInstance = useMemo<FormInstance>(() => {
    const store = storeRef.current!
    return {
      getFieldValue: (name) => store.getFieldValue(name),
      getFieldsValue: (nameList) => store.getFieldsValue(nameList),
      setFieldValue: (name, value) => store.setFieldValue(name, value),
      setFieldsValue: (values) => store.setFieldsValue(values),
      validateFields: (nameList, options) => store.validateFields(nameList, options),
      resetFields: (nameList) => store.resetFields(nameList),
      isFieldTouched: (name) => store.isFieldTouched(name),
      isFieldsTouched: (nameList, all) => store.isFieldsTouched(nameList, all),
      getFieldError: (name) => store.getFieldError(name),
      getFieldsError: (nameList) => store.getFieldsError(nameList),
      submit: () => {},
      scrollToField: (name, options) => store.scrollToField(name, options),
      isFieldValidating: (name) => store.isFieldValidating(name),
      getFieldsData: () => store.getFieldsData(),
      _getStore: () => store,
    }
  }, [])

  if (form) return [form]
  return [formInstance]
}

// ============================================================================
// useWatch
// ============================================================================

export function useWatch(name: NamePath, formInstance?: FormInstance): any {
  const ctx = useContext(FormContext)
  const form = formInstance || ctx?.form

  const [value, setValue] = useState(() => form?.getFieldValue(name))

  useEffect(() => {
    if (!form) return
    const store = form._getStore()
    setValue(store.getFieldValue(name))
    const unsubscribe = store.subscribe(name, () => {
      setValue(store.getFieldValue(name))
    })
    return unsubscribe
  }, [form, FormStore.toPathKey(name)]) // eslint-disable-line react-hooks/exhaustive-deps

  return value
}

// ============================================================================
// useFormInstance
// ============================================================================

export function useFormInstance(): FormInstance {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useFormInstance must be used within a <Form>')
  return ctx.form
}

// ============================================================================
// Form.Provider Component
// ============================================================================

function FormProviderComponent({ onFormFinish, onFormChange, children }: FormProviderProps) {
  const formsRef = useRef<Record<string, FormInstance>>({})

  const contextValue = useMemo<FormProviderContextValue>(() => ({
    registerForm: (name, form) => { formsRef.current[name] = form },
    unregisterForm: (name) => { delete formsRef.current[name] },
    onFormFinish,
    onFormChange,
  }), [onFormFinish, onFormChange])

  return (
    <FormProviderContext.Provider value={contextValue}>
      {children}
    </FormProviderContext.Provider>
  )
}

// ============================================================================
// Form Component
// ============================================================================

function FormComponent({
  form: externalForm,
  name,
  layout = 'horizontal',
  variant = 'outlined',
  size = 'middle',
  initialValues,
  onFinish,
  onFinishFailed,
  onValuesChange,
  onFieldsChange,
  fields: externalFields,
  validateTrigger = 'onChange',
  colon = true,
  labelAlign = 'left',
  labelWrap = false,
  requiredMark = true,
  disabled = false,
  scrollToFirstError = false,
  children,
  className,
  style,
  classNames,
  styles,
}: FormProps) {
  const [formInstance] = useForm(externalForm)
  const store = formInstance._getStore()
  const providerCtx = useContext(FormProviderContext)

  // Initialize values on first mount
  const mountedRef = useRef(false)
  if (!mountedRef.current && initialValues) {
    store.setInitialValues(initialValues, true)
    mountedRef.current = true
  }

  // Register with Form.Provider
  useEffect(() => {
    if (name && providerCtx) {
      providerCtx.registerForm(name, formInstance)
      return () => providerCtx.unregisterForm(name)
    }
  }, [name, providerCtx, formInstance])

  // Wire up onValuesChange
  useEffect(() => {
    store.setOnValuesChange(onValuesChange)
    return () => store.setOnValuesChange(undefined)
  }, [onValuesChange, store])

  // Wire up onFieldsChange
  useEffect(() => {
    const handler = onFieldsChange ? (changedFields: FieldData[], allFields: FieldData[]) => {
      onFieldsChange(changedFields, allFields)
      if (name && providerCtx?.onFormChange) {
        providerCtx.onFormChange(name, { changedFields, forms: {} })
      }
    } : undefined
    store.setOnFieldsChange(handler)
    return () => store.setOnFieldsChange(undefined)
  }, [onFieldsChange, store, name, providerCtx])

  // External fields control
  useEffect(() => {
    if (externalFields) {
      store.setFields(externalFields)
    }
  }, [externalFields, store])

  // Handle submit
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    try {
      const values = await store.validateFields()
      onFinish?.(values)
      if (name && providerCtx?.onFormFinish) {
        providerCtx.onFormFinish(name, { values, forms: {} })
      }
    } catch (errorInfo: any) {
      onFinishFailed?.(errorInfo)
      if (scrollToFirstError && errorInfo.errorFields?.length > 0) {
        const firstErr = errorInfo.errorFields[0]
        store.scrollToField(firstErr.name, typeof scrollToFirstError === 'object' ? scrollToFirstError : undefined)
      }
    }
  }, [store, onFinish, onFinishFailed, scrollToFirstError, name, providerCtx])

  // Connect submit to formInstance
  useEffect(() => {
    (formInstance as any).submit = () => handleSubmit()
  }, [formInstance, handleSubmit])

  const contextValue: FormContextValue = useMemo(() => ({
    form: formInstance,
    layout,
    variant,
    size,
    colon,
    labelAlign,
    labelWrap,
    requiredMark,
    disabled,
    validateTrigger,
  }), [formInstance, layout, variant, size, colon, labelAlign, labelWrap, requiredMark, disabled, validateTrigger])

  const rootBaseStyle: CSSProperties = {
    ...(layout === 'inline' ? {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'flex-start',
    } : {}),
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form
        name={name}
        onSubmit={handleSubmit}
        className={mergeSemanticClassName(className, classNames?.root)}
        style={mergeSemanticStyle(rootBaseStyle, styles?.root, style)}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

// ============================================================================
// Form.Item Component
// ============================================================================

function FormItemComponent({
  name,
  label,
  layout: itemLayout,
  rules,
  dependencies,
  validateTrigger: itemValidateTrigger,
  validateFirst = false,
  validateDebounce,
  valuePropName = 'value',
  trigger = 'onChange',
  getValueFromEvent,
  getValueProps,
  normalize,
  shouldUpdate,
  noStyle = false,
  hidden = false,
  required: requiredProp,
  colon: itemColon,
  labelAlign: _itemLabelAlign,
  hasFeedback = false,
  help: helpProp,
  extra,
  validateStatus: validateStatusProp,
  initialValue,
  children,
  className,
  style: styleProp,
  classNames: itemClassNames,
  styles: itemStyles,
}: FormItemProps) {
  const ctx = useContext(FormContext)!
  const listCtx = useContext(FormListContext)
  const store = ctx.form._getStore()

  // Compute full field path (accounting for Form.List prefix)
  const fullName = useMemo((): InternalNamePath | undefined => {
    if (name === undefined) return undefined
    const namePath = FormStore.toPathArray(name)
    if (listCtx) return [...listCtx.prefixPath, ...namePath]
    return namePath
  }, [name, listCtx])

  const pathKey = fullName ? FormStore.toPathKey(fullName) : undefined

  // Force re-render counter (subscriber pattern)
  const [, forceUpdate] = useState(0)
  const rerender = useCallback(() => forceUpdate(c => c + 1), [])

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Register field & subscribe
  useEffect(() => {
    if (!fullName) return
    if (rules) store.registerRules(fullName, rules)
    if (initialValue !== undefined) {
      const current = store.getFieldValue(fullName)
      if (current === undefined) {
        store.setFieldValue(fullName, initialValue)
      }
    }
    const unsubscribe = store.subscribe(fullName, rerender)
    return () => {
      unsubscribe()
      store.unregisterField(fullName)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [pathKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update rules if they change
  useEffect(() => {
    if (fullName && rules) store.registerRules(fullName, rules)
  }, [rules]) // eslint-disable-line react-hooks/exhaustive-deps

  // Subscribe to dependencies
  useEffect(() => {
    if (!dependencies || dependencies.length === 0) return
    const unsubs = dependencies.map(dep => store.subscribe(dep, () => {
      // Re-validate this field when dependency changes
      if (fullName) store.validateField(fullName, { validateFirst })
      rerender()
    }))
    return () => unsubs.forEach(u => u())
  }, [dependencies, store, fullName, rerender, validateFirst])

  // shouldUpdate: subscribe to ALL fields
  useEffect(() => {
    if (!shouldUpdate) return
    if (shouldUpdate === true) {
      return store.subscribeAll(rerender)
    }
    // Function form
    if (typeof shouldUpdate === 'function') {
      let prevValues = deepClone(store.getFieldsValue())
      return store.subscribeAll(() => {
        const curValues = store.getFieldsValue()
        if (shouldUpdate(prevValues, curValues)) {
          rerender()
        }
        prevValues = deepClone(curValues)
      })
    }
  }, [shouldUpdate, store, rerender])

  // ---- Field data ----
  const fieldValue = fullName ? store.getFieldValue(fullName) : undefined
  const fieldErrors = fullName ? store.getFieldError(fullName) : []
  const fieldWarnings = fullName ? store.getFieldWarning(fullName) : []
  const fieldTouched = fullName ? store.isFieldTouched(fullName) : false
  const fieldValidating = fullName ? store.isFieldValidating(fullName) : false

  // ---- Compute validation status ----
  const computedStatus: FormValidateStatus = validateStatusProp ?? (
    fieldValidating ? 'validating' :
      fieldErrors.length > 0 ? 'error' :
        fieldWarnings.length > 0 ? 'warning' :
          fieldTouched ? 'success' : ''
  )

  // Map to J-UI status prop
  const childStatus: 'error' | 'warning' | undefined =
    computedStatus === 'error' ? 'error' :
      computedStatus === 'warning' ? 'warning' :
        undefined

  // ---- Required mark ----
  const isRequired = requiredProp ?? rules?.some(r => r.required) ?? false

  // ---- Merge colon ----
  const mergedColon = itemColon ?? ctx.colon

  // ---- Item layout (mix layout) ----
  const mergedLayout = itemLayout ?? ctx.layout

  // ---- Validate triggers ----
  const triggers = normalizeToArray(itemValidateTrigger ?? ctx.validateTrigger)

  // Debounced validation helper
  const doValidate = useCallback((fieldName: InternalNamePath) => {
    if (validateDebounce && validateDebounce > 0) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        store.validateField(fieldName, { validateFirst })
      }, validateDebounce)
    } else {
      store.validateField(fieldName, { validateFirst })
    }
  }, [store, validateDebounce, validateFirst])

  // ---- Build child props injection ----
  const getControlled = useCallback((): Record<string, any> => {
    if (!fullName) return {}

    // Default undefined to appropriate empty value to keep inputs controlled
    let controlledValue = fieldValue
    if (controlledValue === undefined) {
      controlledValue = valuePropName === 'checked' ? false : ''
    }

    // getValueProps: transform value before passing to child
    const controlProps: Record<string, any> = getValueProps
      ? getValueProps(controlledValue)
      : { [valuePropName]: controlledValue }

    // Main trigger (default: onChange)
    controlProps[trigger] = (...args: any[]) => {
      let newValue: any
      if (getValueFromEvent) {
        newValue = getValueFromEvent(...args)
      } else {
        const event = args[0]
        if (event && typeof event === 'object' && event.target) {
          newValue = valuePropName === 'checked' ? event.target.checked : event.target.value
        } else {
          newValue = event
        }
      }

      if (normalize) {
        newValue = normalize(newValue, fieldValue, store.getFieldsValue())
      }

      store.setFieldValue(fullName, newValue)
      store.touchField(fullName)

      if (triggers.includes(trigger)) {
        doValidate(fullName)
      }
    }

    // Additional validate triggers (e.g., 'onBlur')
    for (const t of triggers) {
      if (t !== trigger) {
        const existing = controlProps[t]
        controlProps[t] = (...args: any[]) => {
          existing?.(...args)
          if (fullName) doValidate(fullName)
        }
      }
    }

    // Inject disabled
    if (ctx.disabled) {
      controlProps.disabled = true
    }

    // Inject status
    if (childStatus) {
      controlProps.status = childStatus
    }

    // Inject variant and size from Form context
    if (ctx.variant !== 'outlined') {
      controlProps.variant = ctx.variant
    }
    if (ctx.size !== 'middle') {
      controlProps.size = ctx.size
    }

    return controlProps
  }, [fullName, fieldValue, valuePropName, trigger, getValueFromEvent, getValueProps, normalize, triggers, ctx.disabled, ctx.variant, ctx.size, childStatus, store, doValidate])

  // ---- Render child ----
  const renderChild = () => {
    // Render prop form
    if (typeof children === 'function') {
      const control: FieldControl = {
        value: fieldValue,
        [trigger]: getControlled()[trigger],
      }
      const meta: FieldMeta = {
        touched: fieldTouched,
        validating: fieldValidating,
        errors: fieldErrors,
        warnings: fieldWarnings,
        name: fullName || [],
      }
      return children(control, meta, ctx.form)
    }

    // No name = just layout wrapper, don't inject props
    if (!fullName) return children

    // Clone single child and inject props
    const childElement = Children.only(children) as ReactElement
    return cloneElement(childElement, getControlled())
  }

  // ---- noStyle: just render child with injected props ----
  if (noStyle) {
    return <>{renderChild()}</>
  }

  if (hidden) return null

  // ---- Layout styles (uses mergedLayout for mix layout support) ----
  const isHorizontal = mergedLayout === 'horizontal'

  const rootStyle: CSSProperties = {
    marginBottom: mergedLayout === 'inline' ? 0 : '1.5rem',
    ...(isHorizontal ? {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    } : {
      display: 'flex',
      flexDirection: 'column',
    }),
  }

  // Required mark config (needed before labelBaseStyle)
  const markConfig = ctx.requiredMark
  const isCustomRender = typeof markConfig === 'function'

  const labelBaseStyle: CSSProperties = {
    fontSize: '0.875rem',
    lineHeight: '2rem',
    color: tokens.colorText,
    ...(isHorizontal ? {
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.125rem',
      flexShrink: 0,
      paddingRight: '0.75rem',
      boxSizing: 'border-box' as const,
      maxWidth: '50%',
    } : {
      marginBottom: '0.25rem',
    }),
  }

  // Text truncation/wrap for the text span inside horizontal labels
  const labelTextStyle: CSSProperties = isHorizontal
    ? ctx.labelWrap
      ? { whiteSpace: 'normal' as const, wordBreak: 'break-word' as const }
      : { minWidth: 0, overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, whiteSpace: 'nowrap' as const }
    : {}

  const controlBaseStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
  }

  // Help text
  const helpMessages: ReactNode[] = helpProp !== undefined ? [helpProp] :
    fieldErrors.length > 0 ? fieldErrors :
      fieldWarnings.length > 0 ? fieldWarnings : []

  const helpColor = computedStatus === 'error' ? tokens.colorError :
    computedStatus === 'warning' ? tokens.colorWarning :
      tokens.colorTextMuted

  const helpStyle: CSSProperties = {
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    color: helpColor,
    marginTop: '0.25rem',
    transition: 'color 0.2s ease',
  }

  const extraStyle: CSSProperties = {
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    color: tokens.colorTextMuted,
    marginTop: '0.25rem',
  }

  // Check if position is prefix for label rendering order
  const isRequiredPrefix = typeof markConfig === 'object' && 'position' in markConfig && markConfig.position === 'prefix'

  // Render the mark element (used both inline and outside-label)
  const renderRequiredMark = () => {
    if (markConfig === false) return null

    // 'optional' mode
    if (markConfig === 'optional' && !isRequired) {
      return <span style={{ color: tokens.colorTextMuted, fontSize: '0.75rem', fontWeight: 400 }}>(optional)</span>
    }

    if (!isRequired) return null

    return <span style={{ color: tokens.colorError }}>*</span>
  }

  const colonSuffix = mergedColon && label ? ':' : ''

  const markElement = label !== undefined ? renderRequiredMark() : null

  return (
    <div
      className={mergeSemanticClassName(className, itemClassNames?.root)}
      style={mergeSemanticStyle(rootStyle, itemStyles?.root, styleProp)}
      data-field-name={pathKey}
    >
      {/* Label */}
      {label !== undefined && (
        <label
          className={itemClassNames?.label}
          style={mergeSemanticStyle(labelBaseStyle, itemStyles?.label)}
        >
          {isCustomRender ? (
            <span style={labelTextStyle}>
              {(markConfig as (label: ReactNode, info: { required: boolean }) => ReactNode)(
                <>{label}{colonSuffix}</>,
                { required: isRequired }
              )}
            </span>
          ) : isHorizontal ? (
            <>
              {isRequiredPrefix && markElement && <span style={{ flexShrink: 0 }}>{markElement}</span>}
              <span style={labelTextStyle}>{label}{colonSuffix}</span>
              {!isRequiredPrefix && markElement && <span style={{ flexShrink: 0 }}>{markElement}</span>}
            </>
          ) : (
            <>
              {isRequiredPrefix && markElement && <span style={{ marginRight: '0.25rem' }}>{markElement}</span>}
              {label}{colonSuffix}
              {!isRequiredPrefix && markElement && <span style={{ marginLeft: '0.25rem' }}>{markElement}</span>}
            </>
          )}
        </label>
      )}

      {/* Control + help + extra */}
      <div
        className={itemClassNames?.control}
        style={mergeSemanticStyle(controlBaseStyle, itemStyles?.control)}
      >
        {hasFeedback && computedStatus ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>{renderChild()}</div>
            <FeedbackIcon status={computedStatus} />
          </div>
        ) : renderChild()}

        {helpMessages.length > 0 && (
          <div
            className={itemClassNames?.help}
            style={mergeSemanticStyle(helpStyle, itemStyles?.help)}
          >
            {helpMessages.map((msg, i) => (
              <div key={i}>{msg}</div>
            ))}
          </div>
        )}

        {extra && (
          <div
            className={itemClassNames?.extra}
            style={mergeSemanticStyle(extraStyle, itemStyles?.extra)}
          >
            {extra}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Form.List Component
// ============================================================================

function FormListComponent({ name, children, initialValue }: FormListProps) {
  const ctx = useContext(FormContext)!
  const listCtx = useContext(FormListContext)
  const store = ctx.form._getStore()

  const fullPath = useMemo((): InternalNamePath => {
    const namePath = FormStore.toPathArray(name)
    if (listCtx) return [...listCtx.prefixPath, ...namePath]
    return namePath
  }, [name, listCtx])

  const [, forceUpdate] = useState(0)
  const keyCounterRef = useRef(0)
  const keysRef = useRef<number[]>([])
  const initializedRef = useRef(false)

  // Synchronous initialization (before first render output)
  if (!initializedRef.current) {
    initializedRef.current = true
    if (initialValue !== undefined) {
      const current = store.getFieldValue(fullPath)
      if (current === undefined) {
        store.setFieldValue(fullPath, initialValue)
        keysRef.current = initialValue.map(() => keyCounterRef.current++)
      }
    }
  }

  // Subscribe
  useEffect(() => {
    const unsub = store.subscribe(fullPath, () => forceUpdate(c => c + 1))
    return unsub
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const listValue: any[] = store.getFieldValue(fullPath) || []

  // Sync keys with list length
  while (keysRef.current.length < listValue.length) {
    keysRef.current.push(keyCounterRef.current++)
  }
  if (keysRef.current.length > listValue.length) {
    keysRef.current.length = listValue.length
  }

  const fields: FormListField[] = listValue.map((_, index) => ({
    name: index,
    key: keysRef.current[index],
  }))

  const operations: FormListOperations = useMemo(() => ({
    add: (defaultValue?: any, insertIndex?: number) => {
      const current: any[] = store.getFieldValue(fullPath) || []
      const newList = [...current]
      const idx = insertIndex ?? newList.length
      newList.splice(idx, 0, defaultValue ?? undefined)
      keysRef.current.splice(idx, 0, keyCounterRef.current++)
      store.setFieldValue(fullPath, newList)
    },
    remove: (index: number | number[]) => {
      const current: any[] = store.getFieldValue(fullPath) || []
      const indices = Array.isArray(index) ? index : [index]
      const newList = current.filter((_, i) => !indices.includes(i))
      keysRef.current = keysRef.current.filter((_, i) => !indices.includes(i))
      store.setFieldValue(fullPath, newList)
    },
    move: (from: number, to: number) => {
      const current: any[] = store.getFieldValue(fullPath) || []
      const newList = [...current]
      const [item] = newList.splice(from, 1)
      newList.splice(to, 0, item)
      const [key] = keysRef.current.splice(from, 1)
      keysRef.current.splice(to, 0, key)
      store.setFieldValue(fullPath, newList)
    },
  }), [store, fullPath])

  return (
    <FormListContext.Provider value={{ prefixPath: fullPath }}>
      {children(fields, operations, { errors: [] })}
    </FormListContext.Provider>
  )
}

// ============================================================================
// Form.ErrorList Component
// ============================================================================

function FormErrorListComponent({ errors, className, style: styleProp }: FormErrorListProps) {
  if (!errors || errors.length === 0) return null

  return (
    <div
      className={className}
      style={{
        color: tokens.colorError,
        fontSize: '0.75rem',
        lineHeight: '1.25rem',
        ...styleProp,
      }}
    >
      {errors.map((error, i) => (
        <div key={i}>{error}</div>
      ))}
    </div>
  )
}

// ============================================================================
// Compound Export
// ============================================================================

export const Form = Object.assign(FormComponent, {
  Item: FormItemComponent,
  List: FormListComponent,
  ErrorList: FormErrorListComponent,
  Provider: FormProviderComponent,
  useForm,
  useWatch,
  useFormInstance,
})
