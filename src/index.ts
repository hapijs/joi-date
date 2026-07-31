import Dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat.js';
import Utc from 'dayjs/plugin/utc.js';

import type { CoerceObject, DateSchema, Extension, Root } from 'joi';

Dayjs.extend(CustomParseFormat);
Dayjs.extend(Utc);

interface FormatOptions {
    /** String or array of strings that follow the dayjs format. */
    format: string | string[];

    /** Parse the value as UTC instead of using the machine's local timezone. Defaults to `false`. */
    utc?: boolean;
}

declare module 'joi' {
    interface DateSchema {
        /**
         * Specifies the allowed date format.
         *
         * @param format - String or array of strings that follow the dayjs format, or an object with a `format` key and
         *   parsing options.
         */
        format(format: string | string[] | FormatOptions): this;
    }
}

interface DateInternals {
    $_getFlag(name: string): unknown;
    $_setFlag(flag: string, value: unknown): DateInternals & DateSchema;
    $_super: DateSchema;
}

interface DateExtension extends Extension {
    type: 'date';
    base: DateSchema;
}

const baseFormats = ['iso', 'javascript', 'unix'];

export function JoiDate(joi: Root): DateExtension {
    const dayjsFormat = joi
        .string()
        .invalid(...baseFormats)
        .messages({
            'any.invalid': '{{#label}} must be a dayjs format, use iso() or timestamp() instead',
        });

    const formats = joi.array().items(dayjsFormat);
    const args = {
        format: joi.alternatives([
            joi.string(),
            formats,
            joi.object({ format: joi.alternatives([dayjsFormat, formats]).required(), utc: joi.boolean() }),
        ]),
    };

    return {
        type: 'date',
        base: joi.date(),

        coerce: {
            from: 'string',
            method(value: string, { schema }: { schema: DateInternals }) {
                const format = schema.$_getFlag('format') as string | string[] | undefined;
                if (!format) {
                    return undefined;
                }

                const utc = schema.$_getFlag('utc');

                for (const candidate of [format].flat()) {
                    const date = utc ? Dayjs.utc(value, candidate, true) : Dayjs(value, candidate, true);

                    if (date.isValid()) {
                        return { value: date.toDate() };
                    }
                }

                return undefined;
            },
        } as unknown as CoerceObject,

        rules: {
            utc: {
                method(this: DateInternals, enabled: boolean) {
                    return this.$_setFlag('utc', enabled);
                },
            },
        },

        overrides: {
            format(this: DateInternals, format: string | string[] | FormatOptions) {
                joi.attempt(format, args.format, 'Invalid format');

                if (typeof format === 'string' && baseFormats.includes(format)) {
                    return this.$_super.format(format);
                }

                const spec: FormatOptions = typeof format === 'object' && !Array.isArray(format) ? format : { format };

                const schema = spec.utc ? this.$_setFlag('utc', true) : this;

                return schema.$_setFlag('format', spec.format);
            },
        },
    };
}
