'use strict';

const Code = require('@hapi/code');
const Joi = require('joi');
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

            const schema = custom.date().format('yyyy-MM-dd');
            expect(schema.validate(undefined).error).to.not.exist();
        });

        it('validates date', () => {

            const now = Date.now();
            const date = new Date();

            Helper.validate(custom.date(), [
                [now, true, new Date(now)],
                [date, true],
                ['xxx', false, {
                    message: '"value" must be a valid date',
                    path: [],
                    type: 'date.base',
                    context: { value: 'xxx', label: 'value' }
                }]
            ]);

            Helper.validate(custom.date().format('yyyy-MM-dd'), [
                [now, true, new Date(now)],
                [date, true],
                [new Date(NaN), false, {
                    message: '"value" must be a valid date',
                    path: [],
                    type: 'date.base',
                    context: { value: new Date(NaN), label: 'value' }
                }],
                ['xxx', false, {
                    message: '"value" must be in yyyy-MM-dd format',
                    path: [],
                    type: 'date.format',
                    context: { value: 'xxx', label: 'value', format: 'yyyy-MM-dd' }
                }]
            ]);
        });

        it('validates base formats', () => {

            Helper.validate(custom.date().format('iso'), [
                ['+002013-06-07T14:21:46.295Z', true, new Date('+002013-06-07T14:21:46.295Z')],
                ['-002013-06-07T14:21:46.295Z', true, new Date('-002013-06-07T14:21:46.295Z')],
                ['002013-06-07T14:21:46.295Z', false, {
                    message: '"value" must be in ISO 8601 date format',
                    path: [],
                    type: 'date.format',
                    context: { label: 'value', value: '002013-06-07T14:21:46.295Z', format: 'iso' }
                }]
            ]);
        });

        it('errors without convert enabled', () => {

            Helper.validate(custom.date().format('yyyy-MM-dd').options({ convert: false }), [
                ['2000-01-01', false, {
                    message: '"value" must be a valid date',
                    path: [],
                    type: 'date.base',
                    context: { value: '2000-01-01', label: 'value' }
                }]
            ]);

            Helper.validate(custom.date().options({ convert: false }), [
                ['2000-01-01', false, {
                    message: '"value" must be a valid date',
                    path: [],
                    type: 'date.base',
                    context: { value: '2000-01-01', label: 'value' }
                }]
            ]);
        });

        it('validates custom format', () => {

            const schema = custom.date()
                .format('dd$yy#MM');

            Helper.validate(schema, [
                ['13$07#06', true, new Date(2007, 5, 13)],
                ['2013-06-07', false, {
                    message: '"value" must be in dd$yy#MM format',
                    path: [],
                    type: 'date.format',
                    context: { value: '2013-06-07', label: 'value', format: 'dd$yy#MM' }
                }]
            ]);
        });
        it('enforces format', () => {

            const schema = custom.date().format('yyyy-MM-dd');

            Helper.validate(schema, [
                ['1', false, '"value" must be in yyyy-MM-dd format'],
                ['10', false, '"value" must be in yyyy-MM-dd format'],
                ['1000', false, '"value" must be in yyyy-MM-dd format'],
                ['100x', false, '"value" must be in yyyy-MM-dd format'],
                ['1-1', false, '"value" must be in yyyy-MM-dd format']
            ]);
        });

        it('fails with bad formats', () => {

            expect(() => custom.date().format(true)).to.throw('Invalid format "value" must be a string');
        });

        it('fails without convert', () => {

            const schema = custom.date().format('yyyy-MM-dd');
            expect(schema.validate('foo', { convert: false }).error).to.be.an.error('"value" must be a valid date');
        });

        it('fails with overflow dates', () => {

            Helper.validate(custom.date().format('yyyy-MM-dd'), [
                ['1999-02-31', false, {
                    message: '"value" must be in yyyy-MM-dd format',
                    path: [],
                    type: 'date.format',
                    context: { value: '1999-02-31', label: 'value', format: 'yyyy-MM-dd' }
                }],
                ['2005-13-01', false, {
                    message: '"value" must be in yyyy-MM-dd format',
                    path: [],
                    type: 'date.format',
                    context: { value: '2005-13-01', label: 'value', format: 'yyyy-MM-dd' }
                }],
                ['2010-01-32', false, {
                    message: '"value" must be in yyyy-MM-dd format',
                    path: [],
                    type: 'date.format',
                    context: { value: '2010-01-32', label: 'value', format: 'yyyy-MM-dd' }
                }]
            ]);
        });

        it('should support .allow()', () => {

            const schema = custom.date().format('yyyy-MM-dd').allow('epoch');
            expect(schema.validate('epoch')).to.equal({ value: 'epoch' });
        });

        describe('describe()', () => {

            it('describes custom formats', () => {

                const schema = custom.date().format('dd#yyyy$MM');
                expect(schema.describe()).to.equal({
                    type: 'date',
                    flags: {
                        format: 'dd#yyyy$MM'
                    }
                });
            });

        });
    });
});
