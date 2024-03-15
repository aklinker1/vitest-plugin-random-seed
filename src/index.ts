/// <reference types="vitest" />
import type { Plugin } from 'vite';

let seed: number;

export default function RandomSeed(options?: RandomSeedPluginOptions) {
  const shouldLog = seed == null;
  seed ??= options?.seed ?? getEnvSeed() ?? getRandomSeed();
  return {
    name: 'random-seed',
    apply: (_, { mode }) => mode === 'test',
    config: () => {
      if (shouldLog) {
        console.log(`Test seed: \x1b[1m\x1b[36m${seed}\x1b[0m`);
      }
      return {
        define: {
          'import.meta.test.SEED': JSON.stringify(seed),
        },
      };
    },
  } satisfies Plugin;
}

export interface RandomSeedPluginOptions {
  seed?: number;
}

function getRandomSeed(): number {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function getEnvSeed(): number | undefined {
  const env = process.env.TEST_SEED?.trim();
  if (!env) return;
  const num = Number(env);
  if (isNaN(num)) return;
  return num;
}
