'use strict';

// Load modules

const Joi = require('joi');
const Moment = require('moment');

module.exports = {

    name: 'date',

    base: Joi.date(),

    language: {
        format: 'must be a string with one of the following formats {{format}}'
    },

    coerce(value, state, options) {

        if (!value || value instanceof Date || typeof value === 'number') {
            return value;
        }

        if (options.convert && this._flags.momentFormat) {
            const date = Moment(value, this._flags.momentFormat, true);
            if (date.isValid()) {
                return date.toDate();
            }

            return this.createError('date.format', { value, format: this._flags.momentFormat }, state, options);
        }

        return value;
    },

    rules: [
        {
            name: 'format',
            description(params) {

                return `Date should respect format ${params.format}`;
            },
            params: {
                format: Joi.array().items(Joi.string()).single().required()
            },
            setup(params) {

                this._flags.momentFormat = params.format;
            },
            validate(params, value, state, options) {

                // No-op just to enable description
                return value;
            }
        }
    ]

};
