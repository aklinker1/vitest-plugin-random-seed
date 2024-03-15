import { defineWorkspace } from 'vitest/config';
import RandomSeed from './src';

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      include: ['src/**/*.test.ts'],
    },
  },
  {
    test: {
      name: 'e2e',
      include: ['e2e/**/*.test.ts'],
    },
    plugins: [RandomSeed()],
  },
]);
