import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// jsdom does not implement Element.scrollTo
Element.prototype.scrollTo ??= function () {}

// jsdom does not implement window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
