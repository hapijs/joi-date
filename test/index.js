'use strict';

const Code = require('@hapi/code');
const Joi = require('@hapi/joi');
const JoiDate = require('..');
const Lab = require('@hapi/lab');

const Helper = require('./helper');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('date', () => {

    const custom = Joi.extend(JoiDate);

    describe('format()', () => {

        it('validates an empty date', () => {

            const schema = custom.date().format('YYYY-MM-DD');
            expect(schema.validate(undefined).error).to.not.exist();
        });

        it('validates date', () => {

            const now = Date.now();
            const date = new Date();

            Helper.validate(custom.date(), [
                [now, true],
                [date, true],
                ['xxx', false, null, {
                    message: '"value" must be a valid date',
                    details: [{
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: 'xxx', label: 'value' }
                    }]
                }]
            ]);

            Helper.validate(custom.date().format('YYYY-MM-DD'), [
                [now, true],
                [date, true],
                [new Date(NaN), false, null, {
                    message: '"value" must be a valid date',
                    details: [{
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: new Date(NaN), label: 'value' }
                    }]
                }],
                ['xxx', false, null, {
                    message: '"value" must be in YYYY-MM-DD format',
                    details: [{
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: 'xxx', label: 'value', format: 'YYYY-MM-DD' }
                    }]
                }]
            ]);
        });

        it('validates base formats', () => {

            Helper.validate(custom.date().format('iso'), [
                ['+002013-06-07T14:21:46.295Z', true],
                ['-002013-06-07T14:21:46.295Z', true],
                ['002013-06-07T14:21:46.295Z', false, null, {
                    message: '"value" must be in ISO 8601 date format',
                    details: [{
                        message: '"value" must be in ISO 8601 date format',
                        path: [],
                        type: 'date.format',
                        context: { label: 'value', value: '002013-06-07T14:21:46.295Z', format: 'iso' }
                    }]
                }]
            ]);
        });

        it('errors without convert enabled', () => {

            Helper.validate(custom.date().format('YYYY-MM-DD').options({ convert: false }), [
                ['2000-01-01', false, null, {
                    message: '"value" must be a valid date',
                    details: [{
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: '2000-01-01', label: 'value' }
                    }]
                }]
            ]);

            Helper.validate(custom.date().options({ convert: false }), [
                ['2000-01-01', false, null, {
                    message: '"value" must be a valid date',
                    details: [{
                        message: '"value" must be a valid date',
                        path: [],
                        type: 'date.base',
                        context: { value: '2000-01-01', label: 'value' }
                    }]
                }]
            ]);
        });

        it('validates custom format', () => {

            Helper.validate(custom.date().format('DD#YYYY$MM'), [
                ['07#2013$06', true],
                ['2013-06-07', false, null, {
                    message: '"value" must be in DD#YYYY$MM format',
                    details: [{
                        message: '"value" must be in DD#YYYY$MM format',
                        path: [],
                        type: 'date.format',
                        context: { value: '2013-06-07', label: 'value', format: 'DD#YYYY$MM' }
                    }]
                }]
            ]);
        });

        it('validates several custom formats', () => {

            Helper.validate(custom.date().format(['DD#YYYY$MM', 'YY|DD|MM']), [
                ['13|07|06', true],
                ['2013-06-07', false, null, {
                    message: '"value" must be in [DD#YYYY$MM, YY|DD|MM] format',
                    details: [{
                        message: '"value" must be in [DD#YYYY$MM, YY|DD|MM] format',
                        path: [],
                        type: 'date.format',
                        context: { value: '2013-06-07', label: 'value', format: ['DD#YYYY$MM', 'YY|DD|MM'] }
                    }]
                }]
            ]);
        });

        it('supports utc mode', () => {

            Helper.validate(custom.date().utc().format('YYYY-MM-DD'), [
                ['2018-01-01', true, null, new Date('2018-01-01:00:00:00.000Z')]
            ]);
        });

        it('fails with bad formats', () => {

            expect(() => custom.date().format(true)).to.throw('Invalid format "value" must be one of [string, array]');
            expect(() => custom.date().format([true])).to.throw('Invalid format "[0]" must be a string');
        });

        it('fails without convert', () => {

            const schema = custom.date().format('YYYY-MM-DD');
            expect(schema.validate('foo', { convert: false }).error).to.be.an.error('"value" must be a valid date');
        });

        it('fails with overflow dates', () => {

            Helper.validate(custom.date().format('YYYY-MM-DD'), [
                ['1999-02-31', false, null, {
                    message: '"value" must be in YYYY-MM-DD format',
                    details: [{
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: '1999-02-31', label: 'value', format: 'YYYY-MM-DD' }
                    }]
                }],
                ['2005-13-01', false, null, {
                    message: '"value" must be in YYYY-MM-DD format',
                    details: [{
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: '2005-13-01', label: 'value', format: 'YYYY-MM-DD' }
                    }]
                }],
                ['2010-01-32', false, null, {
                    message: '"value" must be in YYYY-MM-DD format',
                    details: [{
                        message: '"value" must be in YYYY-MM-DD format',
                        path: [],
                        type: 'date.format',
                        context: { value: '2010-01-32', label: 'value', format: 'YYYY-MM-DD' }
                    }]
                }]
            ]);
        });

        it('should support .allow()', () => {

            const schema = custom.date().format('YYYY-MM-DD').allow('epoch');
            expect(schema.validate('epoch')).to.equal({ value: 'epoch' });
        });

        describe('describe()', () => {

            it('describes custom formats', () => {

                const schema = custom.date().format(['DD#YYYY$MM', 'YY|DD|MM']);
                expect(schema.describe()).to.equal({
                    type: 'date',
                    flags: {
                        format: ['DD#YYYY$MM', 'YY|DD|MM']
                    }
                });
            });

            it('describes utc mode', () => {

                const schema = custom.date().utc().format(['DD#YYYY$MM', 'YY|DD|MM']);
                expect(schema.describe()).to.equal({
                    type: 'date',
                    flags: {
                        format: ['DD#YYYY$MM', 'YY|DD|MM'],
                        utc: true
                    }
                });
            });
        });
    });
});
