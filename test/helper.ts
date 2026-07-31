import { deepEqual } from '@hapi/hoek';
import Joi from 'joi';
import { expect } from 'vitest';

import type { AnySchema, ValidationError } from 'joi';

expect.addEqualityTesters([
    (a, b) => {
        if (!Joi.isSchema(a) || !Joi.isSchema(b)) {
            return undefined;
        }

        return deepEqual(a, b, { prototype: false, deepFunction: true, skip: ['$_temp'] });
    },
]);

type Test = [input: unknown, pass: boolean, expected?: any];

export function validate(schema: AnySchema, tests: Test[]): void {
    const internals = schema as AnySchema & { $_root: { build(desc: unknown): AnySchema } };

    expect(internals.$_root.build(schema.describe())).toEqual(schema);

    for (const test of tests) {
        const [input, pass, expected] = test;
        if (!pass) {
            expect(expected, 'Failing tests messages must be tested').toBeDefined();
        }

        const { error, value } = schema.validate(input);

        if (error && pass) {
            console.log(error);
        }

        if (!error && !pass) {
            console.log(input);
        }

        expect(!error).toEqual(pass);

        if (test.length === 2) {
            if (pass) {
                expect(input).toEqual(value);
            }

            continue;
        }

        if (pass) {
            expect(value).toEqual(expected);
            continue;
        }

        const err = error as ValidationError;

        if (typeof expected === 'string') {
            expect(err.message).toEqual(expected);
            continue;
        }

        expect(err.details).toHaveLength(1);
        expect(err.message).toEqual(err.details[0]?.message);
        expect(err.details[0]).toEqual(expected);
    }
}
