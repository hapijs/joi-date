'use strict';

const BaseJoi = require('@hapi/joi');
const Code = require('@hapi/code');
const DateExtension = require('..');
const Lab = require('@hapi/lab');

const Helper = require('./helper');

const Joi = BaseJoi.extend(DateExtension);


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('date', () => {

    describe('format()', () => {

        it('validates an empty date', async () => {

            const schema = Joi.date().format('YYYY-MM-DD');
            await expect(schema.validate(undefined)).to.not.reject();
        });

        it('still validates a date', () => {

            const now = Date.now();
            const date = new Date();

            Helper.validate(Joi.date().format('YYYY-MM-DD'), [
                [now, true],
                [date, true],
                [new Date(NaN), false, null, '"value" must be a number of milliseconds or valid date string']
            ]);

            Helper.validate(Joi.date(), [
                [now, true],
                [date, true]
            ]);
        });

        it('errors without convert enabled', () => {

            Helper.validate(Joi.date().format('YYYY-MM-DD').options({ convert: false }), [
                ['2000-01-01', false, null, '"value" must be a valid date']
            ]);

            Helper.validate(Joi.date().options({ convert: false }), [
                ['2000-01-01', false, null, '"value" must be a valid date']
            ]);
        });

        it('validates custom format', () => {

            Helper.validate(Joi.date().format('DD#YYYY$MM'), [
                ['07#2013$06', true],
                ['2013-06-07', false, null, '"value" must be a string with one of the following formats [DD#YYYY$MM]']
            ]);
        });

        it('validates several custom formats', () => {

            Helper.validate(Joi.date().format(['DD#YYYY$MM', 'YY|DD|MM']), [
                ['13|07|06', true],
                ['2013-06-07', false, null, '"value" must be a string with one of the following formats [DD#YYYY$MM, YY|DD|MM]']
            ]);
        });

        it('supports utc mode', () => {

            Helper.validate(Joi.date().utc().format('YYYY-MM-DD'), [
                ['2018-01-01', true, null, new Date('2018-01-01:00:00:00.000Z')]
            ]);
        });

        it('fails with bad formats', () => {

            expect(() => {

                Joi.date().format(true);
            }).to.throw(/must be a string/);

            expect(() => {

                Joi.date().format(['YYYYMMDD', true]);
            }).to.throw(/must be a string/);
        });

        it('fails without convert', async () => {

            const schema = Joi.date().format('YYYY-MM-DD');
            await expect(schema.validate('foo', { convert: false })).to.reject('"value" must be a valid date');
        });

        it('fails with overflow dates', () => {

            Helper.validate(Joi.date().format('YYYY-MM-DD'), [
                ['1999-02-31', false, null, '"value" must be a string with one of the following formats [YYYY-MM-DD]'],
                ['2005-13-01', false, null, '"value" must be a string with one of the following formats [YYYY-MM-DD]'],
                ['2010-01-32', false, null, '"value" must be a string with one of the following formats [YYYY-MM-DD]']
            ]);
        });

        it('should be correctly described (local mode)', () => {

            const schema = Joi.date().format(['DD#YYYY$MM', 'YY|DD|MM']);
            expect(schema.describe()).to.equal({
                type: 'date',
                flags: {
                    momentFormat: ['DD#YYYY$MM', 'YY|DD|MM']
                },
                options: {
                    language: {
                        date: {
                            format: 'must be a string with one of the following formats {{format}}'
                        }
                    }
                },
                rules: [
                    {
                        name: 'format',
                        description: 'Date should respect format DD#YYYY$MM,YY|DD|MM',
                        arg: {
                            format: [
                                'DD#YYYY$MM',
                                'YY|DD|MM'
                            ]
                        }
                    }
                ]
            });
        });

        it('should be correctly described (utc mode)', () => {

            const schema = Joi.date().utc().format(['DD#YYYY$MM', 'YY|DD|MM']);
            expect(schema.describe()).to.equal({
                type: 'date',
                flags: {
                    utc: true,
                    momentFormat: ['DD#YYYY$MM', 'YY|DD|MM']
                },
                options: {
                    language: {
                        date: {
                            format: 'must be a string with one of the following formats {{format}}'
                        }
                    }
                },
                rules: [
                    {
                        name: 'utc',
                        description: 'Date should be interpreted in UTC',
                        arg: {}
                    },
                    {
                        name: 'format',
                        description: 'Date should respect format DD#YYYY$MM,YY|DD|MM',
                        arg: {
                            format: [
                                'DD#YYYY$MM',
                                'YY|DD|MM'
                            ]
                        }
                    }
                ]
            });
        });

        it('does not error with allowed value null', async () => {

            const schema = Joi.date().format('YYYY-MM-DD').allow(null);
            await expect(schema.validate(null)).to.not.reject();
        });

        it('does not error with allowed value \'null\'', async () => {

            const schema = Joi.date().format('YYYY-MM-DD').allow('null');
            await expect(schema.validate('null')).to.not.reject();
        });
    });
});
