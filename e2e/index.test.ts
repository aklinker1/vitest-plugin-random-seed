import { describe, it, expect } from 'vitest';

console.log(
  'TEST:',
  ['import', 'meta', 'test', 'SEED'].join('.'),
  import.meta.test.SEED,
);

describe('Example test using seed', () => {
  it('should define import.meta.env.TEST_SEED', () => {
    expect(import.meta.test.SEED).not.toBeUndefined();
    expect(import.meta.test.SEED).toBeGreaterThanOrEqual(0);
  });
});
