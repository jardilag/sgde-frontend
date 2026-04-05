import '@testing-library/jest-dom';

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: class {
    observe = () => undefined;

    unobserve = () => undefined;

    disconnect = () => undefined;
  },
});

Object.defineProperty(globalThis, 'getComputedStyle', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    getPropertyValue: jest.fn().mockReturnValue(''),
  })),
});

if (globalThis.window !== undefined) {
  Object.defineProperty(globalThis, 'getComputedStyle', {
    writable: true,
    value: globalThis.getComputedStyle,
  });
}

globalThis.scrollTo = jest.fn();