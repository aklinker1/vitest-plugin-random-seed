/// <reference types="vite/client" />

interface ImportMetaTest {
  /**
   * An integer in the range `[0, Number.MAX_SAFE_INT)`.
   *
   * Generated randomly once per-test run by [`vitest-plugin-random-seed`](https://npmjs.com/package/vitest-plugin-random-seed).
   *
   * Can be set to a static value from the command line:
   *
   * ```sh
   * # Windows
   * cross-env TEST_SEED=123456 vitest
   * # Mac/Linux
   * TEST_SEED=123456 vitest
   * ```
   */
  readonly SEED: number;
}

interface ImportMeta {
  readonly test: ImportMetaTest;
}
