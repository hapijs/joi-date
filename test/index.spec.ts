import Joi from 'joi';
import { describe, expect, it } from 'vitest';

import * as Helper from './helper.js';
import { JoiDate } from '../src/index.js';

describe('date', () => {
    const custom = Joi.extend(JoiDate);
    const baseFormats = ['iso', 'javascript', 'unix'];

    describe('format()', () => {
        it('validates an empty date', () => {
            const schema = custom.date().format('YYYY-MM-DD');
            expect(schema.validate(undefined).error).toBeUndefined();
        });

        it('validates date', () => {
            const now = Date.now();
            const date = new Date();

            Helper.validate(custom.date(), [
                [now, true, new Date(now)],
                [date, true],
                [
                    'xxx',
                    false,
                    {
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: 'xxx', label: 'value' },
                    },
                ],
            ]);

            Helper.validate(custom.date().format('YYYY-MM-DD'), [
                [now, true, new Date(now)],
                [date, true],
                [
                    new Date(NaN),
                    false,
                    {
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: new Date(NaN), label: 'value' },
                    },
                ],
                [
                    'xxx',
                    false,
                    {
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: 'xxx', label: 'value', format: 'YYYY-MM-DD' },
                    },
                ],
            ]);
        });

        it('validates base formats', () => {
            Helper.validate(custom.date().format('iso'), [
                ['+002013-06-07T14:21:46.295Z', true, new Date('+002013-06-07T14:21:46.295Z')],
                ['-002013-06-07T14:21:46.295Z', true, new Date('-002013-06-07T14:21:46.295Z')],
                [
                    '002013-06-07T14:21:46.295Z',
                    false,
                    {
                        message: '"value" must be in ISO 8601 date format',
                        path: [],
                        type: 'date.format',
                        context: { label: 'value', value: '002013-06-07T14:21:46.295Z', format: 'iso' },
                    },
                ],
            ]);
        });

        it('errors without convert enabled', () => {
            Helper.validate(custom.date().format('YYYY-MM-DD').options({ convert: false }), [
                [
                    '2000-01-01',
                    false,
                    {
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: '2000-01-01', label: 'value' },
                    },
                ],
            ]);

            Helper.validate(custom.date().options({ convert: false }), [
                [
                    '2000-01-01',
                    false,
                    {
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: '2000-01-01', label: 'value' },
                    },
                ],
            ]);
        });

        it('validates custom format', () => {
            Helper.validate(custom.date().format('DD#YYYY$MM'), [
                ['07#2013$06', true, new Date(2013, 5, 7)],
                [
                    '2013-06-07',
                    false,
                    {
                        message: '"value" must be in DD#YYYY$MM format',
                        path: [],
                        type: 'date.format',
                        context: { value: '2013-06-07', label: 'value', format: 'DD#YYYY$MM' },
                    },
                ],
            ]);
        });

        it('enforces format', () => {
            const schema = custom.date().format('YYYY-MM-DD');

            Helper.validate(schema, [
                ['1', false, '"value" must be in YYYY-MM-DD format'],
                ['10', false, '"value" must be in YYYY-MM-DD format'],
                ['1000', false, '"value" must be in YYYY-MM-DD format'],
                ['100x', false, '"value" must be in YYYY-MM-DD format'],
                ['1-1', false, '"value" must be in YYYY-MM-DD format'],
            ]);
        });

        it('validates several custom formats', () => {
            const schema = custom.date().format(['DD#YYYY$MM', 'YY|DD|MM']);

            Helper.validate(schema, [
                ['13|07|06', true, new Date(2013, 5, 7)],
                [
                    '2013-06-07',
                    false,
                    {
                        message: '"value" must be in [DD#YYYY$MM, YY|DD|MM] format',
                        path: [],
                        type: 'date.format',
                        context: {
                            value: '2013-06-07',
                            label: 'value',
                            format: ['DD#YYYY$MM', 'YY|DD|MM'],
                        },
                    },
                ],
            ]);
        });

        it('supports utc mode', () => {
            Helper.validate(custom.date().format({ format: 'YYYY-MM-DD', utc: true }), [
                ['2018-01-01', true, new Date('2018-01-01:00:00:00.000Z')],
            ]);
        });

        it('supports utc mode with several formats', () => {
            Helper.validate(custom.date().format({ format: ['DD#YYYY$MM', 'YYYY-MM-DD'], utc: true }), [
                ['2018-01-01', true, new Date('2018-01-01T00:00:00.000Z')],
                ['01#2018$01', true, new Date('2018-01-01T00:00:00.000Z')],
            ]);
        });

        it('fails with bad formats', () => {
            const badType = () => custom.date().format(true);
            expect(badType).toThrow(Joi.ValidationError);
            expect(badType).toThrow('Invalid format "value" must be one of [string, array, object]');

            const badItem = () => custom.date().format([true]);
            expect(badItem).toThrow(Joi.ValidationError);
            expect(badItem).toThrow('Invalid format "[0]" must be a string');
        });

        it('fails with bad options', () => {
            const missingFormat = () => custom.date().format({ utc: true });
            expect(missingFormat).toThrow(Joi.ValidationError);
            expect(missingFormat).toThrow('Invalid format "format" is required');

            const badUtc = () => custom.date().format({ format: 'YYYY-MM-DD', utc: 'yes' });
            expect(badUtc).toThrow(Joi.ValidationError);
            expect(badUtc).toThrow('Invalid format "utc" must be a boolean');

            const badKey = () => custom.date().format({ format: 'YYYY-MM-DD', unknown: true });
            expect(badKey).toThrow(Joi.ValidationError);
            expect(badKey).toThrow('Invalid format "unknown" is not allowed');
        });

        it('fails with a base format outside of a lone string', () => {
            const message = 'Invalid format "value" must be a dayjs format, use iso() or timestamp() instead';

            for (const format of baseFormats) {
                expect(() => custom.date().format([format])).toThrow(message.replace('"value"', '"[0]"'));
                expect(() => custom.date().format({ format })).toThrow(message.replace('"value"', '"format"'));
                expect(() => custom.date().format({ format, utc: true })).toThrow(
                    message.replace('"value"', '"format"'),
                );
            }
        });

        it('fails without convert', () => {
            const schema = custom.date().format('YYYY-MM-DD');
            const { error } = schema.validate('foo', { convert: false });

            expect(error).toBeInstanceOf(Joi.ValidationError);
            expect(error.message).toEqual('"value" must be a valid date');
        });

        it('fails with overflow dates', () => {
            Helper.validate(custom.date().format('YYYY-MM-DD'), [
                [
                    '1999-02-31',
                    false,
                    {
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: '1999-02-31', label: 'value', format: 'YYYY-MM-DD' },
                    },
                ],
                [
                    '2005-13-01',
                    false,
                    {
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: '2005-13-01', label: 'value', format: 'YYYY-MM-DD' },
                    },
                ],
                [
                    '2010-01-32',
                    false,
                    {
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: '2010-01-32', label: 'value', format: 'YYYY-MM-DD' },
                    },
                ],
            ]);
        });

        it('should support .allow()', () => {
            const schema = custom.date().format('YYYY-MM-DD').allow('epoch');
            expect(schema.validate('epoch')).toEqual({ value: 'epoch' });
        });

        describe('describe()', () => {
            it('describes custom formats', () => {
                const schema = custom.date().format(['DD#YYYY$MM', 'YY|DD|MM']);
                expect(schema.describe()).toEqual({
                    type: 'date',
                    flags: {
                        format: ['DD#YYYY$MM', 'YY|DD|MM'],
                    },
                });
            });

            it('describes utc mode', () => {
                const schema = custom.date().format({ format: ['DD#YYYY$MM', 'YY|DD|MM'], utc: true });
                expect(schema.describe()).toEqual({
                    type: 'date',
                    flags: {
                        format: ['DD#YYYY$MM', 'YY|DD|MM'],
                        utc: true,
                    },
                });
            });
        });
    });
});
