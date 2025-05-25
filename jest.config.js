/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@engine/(.*)$': '<rootDir>/src/engine/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
    '^@screens/(.*)$': '<rootDir>/src/app/screens/$1',
    '^@popups/(.*)$': '<rootDir>/src/app/popups/$1',
    '^@ui/(.*)$': '<rootDir>/src/app/ui/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
}; 
