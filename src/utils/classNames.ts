export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, boolean | undefined>
  | ClassValue[]

/**
 * Merges class name values into a single space-separated string.
 * Falsy values are ignored. Objects use their truthy keys.
 *
 * @example
 * classNames('foo', false, { bar: true, baz: false }, ['qux'])
 * // → 'foo bar qux'
 */
export function classNames(...args: ClassValue[]): string {
  const result: string[] = []

  for (const arg of args) {
    if (!arg) continue

    if (typeof arg === 'string' || typeof arg === 'number') {
      result.push(String(arg))
    } else if (Array.isArray(arg)) {
      const inner = classNames(...arg)
      if (inner) result.push(inner)
    } else if (typeof arg === 'object') {
      for (const [key, val] of Object.entries(arg)) {
        if (val) result.push(key)
      }
    }
  }

  return result.join(' ')
}
