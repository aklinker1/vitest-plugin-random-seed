# vitest-plugin-random-seed

Define and print an integer that can be used to seed libraries like [ChanceJS](https://github.com/chancejs/chancejs), [Falso](https://github.com/ngneat/falso), or [FakerJS](https://github.com/faker-js/faker).

## Installation

```sh
npm i vitest-plugin-random-seed
```

In your `vite.config.ts` or `vitest.config.ts` file, add the plugin:

```ts
import RandomSeed from 'vitest-plugin-random-seed';

export default defineConfig({
  plugins: [RandomSeed()],
});
```

And in your tests, you can access the seed via `import.meta.test.SEED`! That's really all this plugin does...

```ts
console.log(import.meta.test.SEED);
```

This plugin really shines when used in combination with [ChanceJS](https://github.com/chancejs/chancejs), [Falso](https://github.com/ngneat/falso), or [FakerJS](https://github.com/faker-js/faker) to generate reproducable, but random test data.

### Chance

```ts
// src/utils/testing/fake-objects.ts
import seed from 'chance';

export const chance = seed(import.meta.test.SEED);

export function fakeFilename() {
  return chance.string();
}
```

### FakerJS

```ts
// src/utils/testing/fake-objects.ts
import { faker } from '@faker-js/faker';

faker.seed(import.meta.test.SEED);

export function fakeFilename() {
  return faker.string.alphanumeric();
}
```

### Falso

```ts
// src/utils/testing/fake-objects.ts
import { randDirectoryPath, seed } from '@ngneat/falso';

seed(import.meta.test.SEED);

export function fakeFilename() {
  return randFileName();
}
```

## TypeScript Types

To add types for `import.meta.test.SEED`, add `vitest-plugin-random-seed/types` to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest-plugin-random-seed/types"]
  }
}
```

## Setting the Seed

When a randomized test fails, you can recreate the test case by setting the `TEST_SEED` environment variable:

```sh
TEST_SEED=123456 vitest
```

This will run tests with the specific seed.

## Test Isolation

By default, Vitest runs each test file is ran in their isolated context. That means if you use a fake data library, the seed is applied in every file. This means that running all tests, `TEST_SEED=123 vitest`, and running just one test, `TEST_SEED=123 vitest some-file.test.ts`, will result in the same random values being generated inside `some-file.test.ts`.

However, if you use `it.only` or `it.skip`, the test result for a file will change. To reset the seed for each test, [add a setup file](https://vitest.dev/config/#setupfiles) and reset the seed before each test:

```ts
// vitest.setup.ts
import { seed } from '@fakerjs/faker';
import { beforeEach } from 'vitest';

beforeEach(() => {
  seed(import.meta.test.SEED);
});
```

> Because ChanceJS doesn't have a global seed, this won't work. You'll need to setup a global instance and reassign it before each test.

If you've disabled test isolation, you can manually reset the seed before each test as shown above.

## Contributing

This project uses [Bun](https://bun.sh). To install dependencies, run:

```sh
bun i
```

To run unit and E2E tests:

```sh
bun run test
```

To build the NPM package:

```sh
bun run build
```

Or run any of the other commands:

```sh
bun run check
bun run test:coverage
```
