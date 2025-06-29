/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: [],
  setupFilesAfterEnv: ['./jest.polyfills.js', './jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }]
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@spectrum-web-components/tabs/sp-tabs.js$': '<rootDir>/test/stubs/sp-tabs.js',
    '^@spectrum-web-components/tabs/sp-tab.js$': '<rootDir>/test/stubs/sp-tab.js'
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  rootDir: '.'
};
