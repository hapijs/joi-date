'use strict';

// Load modules

const Lab = require('lab');
const Helper = require('./helper');
const BaseJoi = require('joi');
const Extension = require('../');
const Joi = BaseJoi.extend(Extension);


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = lab.expect;


describe('date', () => {

    describe('format()', () => {

        it('validates an empty date', (done) => {

            const schema = Joi.date().format('YYYY-MM-DD');
            schema.validate(undefined, (err, value) => {

                expect(err).to.not.exist();
                done();
            });
        });

        it('still validates a date', (done) => {

            const now = Date.now();
            const date = new Date();

            Helper.validate(Joi.date().format('YYYY-MM-DD'), [
                [now, true],
                [date, true],
                [new Date(NaN), false, null, '"value" must be a number of milliseconds or valid date string']
            ], done);
        });

        it('validates custom format', (done) => {

            Helper.validate(Joi.date().format('DD#YYYY$MM'), [
                ['07#2013$06', true],
                ['2013-06-07', false, null, '"value" must be a string with one of the following formats [DD#YYYY$MM]']
            ], done);
        });

        it('validates several custom formats', (done) => {

            Helper.validate(Joi.date().format(['DD#YYYY$MM', 'YY|DD|MM']), [
                ['13|07|06', true],
                ['2013-06-07', false, null, '"value" must be a string with one of the following formats [DD#YYYY$MM, YY|DD|MM]']
            ], done);
        });

        it('supports utc mode', (done) => {

            Helper.validate(Joi.date().utc().format('YYYY-MM-DD'), [
                ['2018-01-01', true, null, new Date('2018-01-01:00:00:00.000Z')]
            ], done);
        });

        it('fails with bad formats', (done) => {

            expect(() => {

                Joi.date().format(true);
            }).to.throw(/must be a string/);

            expect(() => {

                Joi.date().format(['YYYYMMDD', true]);
            }).to.throw(/must be a string/);
            done();
        });

        it('fails without convert', (done) => {

            const schema = Joi.date().format('YYYY-MM-DD');
            schema.validate('foo', { convert: false }, (err) => {

                expect(err).to.be.an.error('"value" must be a valid date');
                done();
            });
        });

        it('fails with overflow dates', (done) => {

            Helper.validate(Joi.date().format('YYYY-MM-DD'), [
                ['1999-02-31', false, null, '"value" must be a string with one of the following formats [YYYY-MM-DD]'],
                ['2005-13-01', false, null, '"value" must be a string with one of the following formats [YYYY-MM-DD]'],
                ['2010-01-32', false, null, '"value" must be a string with one of the following formats [YYYY-MM-DD]']
            ], done);
        });

        it('should be correctly described (local mode)', (done) => {

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
            done();
        });

        it('should be correctly described (utc mode)', (done) => {

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
            done();
        });
    });
});
