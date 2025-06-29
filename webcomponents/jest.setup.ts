import '@testing-library/jest-dom';

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
if (!('ResizeObserver' in global)) {
  (global as any).ResizeObserver = DummyObserver;
}
if (!('IntersectionObserver' in global)) {
  (global as any).IntersectionObserver = DummyObserver;
}
