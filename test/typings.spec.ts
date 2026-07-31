import BaseJoi from 'joi';
import { describe, expectTypeOf, it } from 'vitest';

import { JoiDate } from '../src/index.js';

const Joi = BaseJoi.extend(JoiDate) as BaseJoi.Root;

describe('typings', () => {
    it('format() accepts a string or an array of strings', () => {
        expectTypeOf(Joi.date().format).toBeCallableWith('YYYY-MM-DD HH:mm');
        expectTypeOf(Joi.date().format).toBeCallableWith(['YYYY/MM/DD', 'DD-MM-YYYY']);

        // @ts-expect-error format requires an argument
        expectTypeOf(Joi.date().format).toBeCallableWith();
    });

    it('format() accepts an options object', () => {
        expectTypeOf(Joi.date().format).toBeCallableWith({ format: 'YYYY-MM-DD' });
        expectTypeOf(Joi.date().format).toBeCallableWith({ format: ['YYYY/MM/DD'], utc: true });

        // @ts-expect-error format is required
        expectTypeOf(Joi.date().format).toBeCallableWith({ utc: true });

        // @ts-expect-error utc must be a boolean
        expectTypeOf(Joi.date().format).toBeCallableWith({ format: 'YYYY-MM-DD', utc: 'yes' });
    });
});
