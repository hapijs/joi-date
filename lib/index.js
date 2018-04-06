'use strict';

// Load modules

const Moment = require('moment');

module.exports = (joi) => ({

    name: 'date',

    base: joi.date(),

    language: {
        format: 'must be a string with one of the following formats {{format}}'
    },

    coerce(value, state, options) {

        if (!value || value instanceof Date || typeof value === 'number') {
            return value;
        }

        if (options.convert && this._flags.momentFormat) {
            const date = this._flags.utc
                ? Moment.utc(value, this._flags.momentFormat, true)
                : Moment(value, this._flags.momentFormat, true);

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
                format: joi.array().items(joi.string()).single().required()
            },
            setup(params) {

                this._flags.momentFormat = params.format;
            },
            validate(params, value, state, options) {

                // No-op just to enable description
                return value;
            }
        },
        {
            name: 'utc',
            description(params) {

                return 'Date should be interpreted in UTC';
            },
            setup(params) {

                this._flags.utc = true;
            },
            validate(params, value, state, options) {

                // No-op just to enable description
                return value;
            }
        }
    ]

});
