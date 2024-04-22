
import { DateSchema, Extension, Root } from 'joi';

declare module 'joi' {

    interface DateSchema {

        /**
         * Specifies the allowed date format.
         *
         * @param format - string or array of strings that follow the moment.js format.
         */
        format(format: string | string[]): this;

        /**
         * Dates will be parsed as UTC instead of using the machine's local timezone.
         */
        utc(): this;
    }
}

interface DateExtension extends Extension {
    type: 'date';
    base: DateSchema;
}

interface JoiDateFactory {
    (joi: Root): DateExtension;
    default: (joi: Root) => DateExtension;
}
declare const factory: JoiDateFactory;
export = factory;
