import { createFactory } from "@aklinker1/zero-factory";
import type { ConfigEnv, UserConfig } from "vite";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type { RandomSeedPluginOptions } from "../index";

async function importRandomSeed() {
  const { default: RandomSeed } = await import("../index");
  return RandomSeed;
}

const configEnvFactory = createFactory<ConfigEnv>({
  command: "build",
  mode: "production",
});

describe("Random Seed Plugin", () => {
  beforeEach(() => {
    // Reset the `seed` global variable inside src/index.ts
    vi.resetModules();
    // Hide logs during tests
    console.log = vi.fn();
    // Reset environment to not include hardcoded seed
    delete process.env.TEST_SEED;
  });

  describe("apply", () => {
    const apply = async (
      options: RandomSeedPluginOptions | undefined,
      config: UserConfig,
      env: ConfigEnv,
    ): Promise<boolean> => {
      const RandomSeed = await importRandomSeed();
      return (RandomSeed(options).apply as any)!(config, env);
    };

    it('should apply the plugin when the mode is "test"', async () => {
      const env = configEnvFactory({ mode: "test" });
      const actual = await apply(undefined, {}, env);
      expect(actual).toBe(true);
    });

    it.each(["build", "serve"])("should not apply the plugin when the mode is %j", async (mode) => {
      const env = configEnvFactory({ mode });
      const actual = await apply(undefined, {}, env);
      expect(actual).toBe(false);
    });
  });

  describe("config", () => {
    const config = async (
      options: RandomSeedPluginOptions | undefined,
      config: UserConfig,
      env: ConfigEnv,
    ) => {
      const RandomSeed = await importRandomSeed();
      return (RandomSeed(options).config as any)!(config, env);
    };
    it("should use the environment variable when present", async () => {
      const expectedSeed = "123456";
      process.env.TEST_SEED = expectedSeed;

      const actual = await config(undefined, {}, configEnvFactory());

      expect(actual).toEqual({
        define: {
          __TEST_SEED__: expectedSeed,
        },
      });
    });

    it("should use the seed option when present", async () => {
      const expectedSeed = 123456;
      process.env.TEST_SEED = "not" + expectedSeed;

      const actual = await config({ seed: expectedSeed }, {}, configEnvFactory());

      expect(actual).toEqual({
        define: {
          __TEST_SEED__: String(expectedSeed),
        },
      });
    });

    it.each(["abc", true])("should ignore non-number env seed: %j", async (seed) => {
      process.env.TEST_SEED = String(seed);
      const actual = await config(undefined, {}, configEnvFactory());

      expect(actual.define["__TEST_SEED__"]).not.toBe(String(seed));
    });
  });
});
