'use strict';

const IsValid = require('date-fns/isValid');
const Parse = require('date-fns/parse');


const internals = {};


module.exports = (joi) => {

    const args = {
        format: joi.string()
    };

    return {

        type: 'date',
        base: joi.date(),

        coerce: {
            from: 'string',
            method: function (value, { schema }) {

                const format = schema.$_getFlag('format');
                if (!format) {
                    return;
                }

                const date = Parse(value, format, new Date());
                if (IsValid(date)) {
                    return { value: date };
                }
            }
        },

        overrides: {
            format: function (format) {

                joi.attempt(format, args.format, 'Invalid format');

                if (['iso', 'javascript', 'unix'].includes(format)) {
                    return this.$_super.format(format);
                }

                return this.$_setFlag('format', format);
            }
        }
    };
};

// Default export for TypeScript module interop

module.exports.default = module.exports;
