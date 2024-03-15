import type { ConfigEnv } from 'vite';
import { describe, it, expect, vi, beforeEach } from 'vitest';

async function importRandomSeed() {
  const { default: RandomSeed } = await import('../index');
  return RandomSeed;
}

describe('Random Seed Plugin', () => {
  beforeEach(() => {
    // Reset the `seed` global variable inside src/index.ts
    vi.resetModules();
    // Hide logs during tests
    console.log = vi.fn();
    // Reset environment to not include hardcoded seed
    delete process.env.TEST_SEED;
  });

  describe('apply', () => {
    it('should apply the plugin when the mode is "test"', async () => {
      const RandomSeed = await importRandomSeed();
      const plugin = RandomSeed();
      const mode = 'test';

      expect(plugin.apply({}, { mode } as ConfigEnv)).toBe(true);
    });

    it.each(['build', 'serve'])(
      'should not apply the plugin when the mode is %j',
      async (mode) => {
        const RandomSeed = await importRandomSeed();
        const plugin = RandomSeed();

        expect(plugin.apply({}, { mode } as ConfigEnv)).toBe(false);
      },
    );
  });

  describe('config', () => {
    it('should not regenerate the seed if config is called multiple times', async () => {
      const RandomSeed = await importRandomSeed();
      const plugin = RandomSeed();
      const config1 = plugin.config();
      const config2 = plugin.config();

      expect(config1.define['import.meta.test.SEED']).not.toBeUndefined();
      expect(config1).toEqual(config2);
    });

    it('should not regenerate the seed if the plugin is called multiple times', async () => {
      const RandomSeed = await importRandomSeed();
      const config1 = RandomSeed().config();
      const config2 = RandomSeed().config();

      expect(config1.define['import.meta.test.SEED']).not.toBeUndefined();
      expect(config1).toEqual(config2);
    });

    it('should use the environment variable when present', async () => {
      const expectedSeed = '123456';
      process.env.TEST_SEED = expectedSeed;

      const RandomSeed = await importRandomSeed();
      const config = RandomSeed().config();

      expect(config).toEqual({
        define: {
          'import.meta.test.SEED': expectedSeed,
        },
      });
    });

    it('should use the seed option when present', async () => {
      const expectedSeed = 123456;
      process.env.TEST_SEED = 'not' + expectedSeed;

      const RandomSeed = await importRandomSeed();
      const config = RandomSeed({ seed: expectedSeed }).config();

      expect(config).toEqual({
        define: {
          'import.meta.test.SEED': String(expectedSeed),
        },
      });
    });

    it.each(['abc', true])(
      'should ignore non-number env seed: %j',
      async (seed) => {
        const RandomSeed = await importRandomSeed();
        process.env.TEST_SEED = String(seed);
        const config = RandomSeed().config();

        expect(config.define['import.meta.test.SEED']).not.toBe(String(seed));
      },
    );
  });
});
