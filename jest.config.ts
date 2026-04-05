import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.test.tsx',
    '<rootDir>/components/**/*.test.ts',
    '<rootDir>/components/**/*.test.tsx',
    '<rootDir>/app/**/*.test.ts',
    '<rootDir>/app/**/*.test.tsx',
  ],
};

export default createJestConfig(customJestConfig);