import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'src/modules/**/*.{ts,tsx}',
    '!src/modules/**/*.test.{ts,tsx}',
    '!src/modules/**/types.ts',
    '!src/modules/**/testing/**',
    'src/shared/**/*.{ts,tsx}',
    'src/app/Header.tsx',
    'src/app/Footer.tsx',
    'src/app/WebVitals.tsx',
    'src/app/page.tsx',
    'src/app/robots.ts',
    'src/app/api/**/route.ts',
    'src/app/sitemap.ts',
    'src/app/error.tsx',
    'src/app/not-found.tsx',
    'src/app/products/**/page.tsx',
    '!src/**/*.test.{ts,tsx}',
  ],
  coverageThreshold: {
    global: { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
};

export default createJestConfig(config);
