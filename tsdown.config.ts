import { defineConfig } from 'tsdown';

import type { UserConfig } from 'tsdown';

export default defineConfig({
    clean: true,
    entry: ['./src/index.ts'],
    exports: true,
    format: 'esm',
    hash: false,
    outDir: './dist',
    target: 'node22',
}) as UserConfig;
