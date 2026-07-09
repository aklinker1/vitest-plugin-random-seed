import { describe, it, expect } from 'vitest';

console.log('__TEST_' + 'SEED__ =', __TEST_SEED__);

describe('Example test using seed', () => {
  it('should define __TEST_SEED__', () => {
    expect(__TEST_SEED__).not.toBeUndefined();
    expect(__TEST_SEED__).toBeGreaterThanOrEqual(0);
  });
});
