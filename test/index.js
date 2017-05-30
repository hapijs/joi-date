'use strict';

// Load modules

const Lab = require('lab');
const Code = require('code');
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
const expect = Code.expect;


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

        it('should be correctly described', (done) => {

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
    });
});
