class DummyObserver {
  observe() {
    // no-op for tests
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// Polyfill observers used by Spectrum
if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = DummyObserver;
}
if (typeof IntersectionObserver === 'undefined') {
  global.IntersectionObserver = DummyObserver;
}

// Provide a minimal `document.fonts` implementation for Spectrum components
if (typeof Document !== 'undefined' && !Document.prototype.fonts) {
  Object.defineProperty(Document.prototype, 'fonts', {
    value: {
      ready: Promise.resolve(),
      addEventListener() {},
      removeEventListener() {},
      add() {},
      delete() {},
      clear() {},
      check: () => true,
      forEach() {},
      size: 0,
      values: () => [][Symbol.iterator](),
    },
  });
}
if (typeof document !== 'undefined' && !globalThis.document.fonts) {
  globalThis.document.fonts = Document.prototype.fonts;
}
