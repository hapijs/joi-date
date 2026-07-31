## Compatibility

This version requires **joi** v18 or newer, and **node** v22 or newer.

## Usage

```js
import BaseJoi from 'joi';
import { JoiDate } from '@joi/date';

const Joi = BaseJoi.extend(JoiDate);

const schema = Joi.date().format('YYYY-MM-DD');
```

## Rules

### `date.format(format)`

Specifies the allowed date format:

- `format` - string or array of strings that follow the `dayjs` [format](https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens), or an object with:
    - `format` - the format(s) above.
    - `utc` - if `true`, the value is parsed as UTC instead of using the machine's local timezone. Defaults to `false`.

A single format:

```js
const schema = Joi.date().format('YYYY-MM-DD');

schema.validate('2021-10-29'); // 2021-10-29T00:00:00.000 in the local timezone
schema.validate('29/10/2021'); // "value" must be in YYYY-MM-DD format
```

Any dayjs token, including a time part:

```js
const schema = Joi.date().format('DD/MM/YYYY HH:mm');

schema.validate('29/10/2021 14:30');
```

Several formats, tried in order until one matches:

```js
const schema = Joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']);

schema.validate('2021/10/29');
schema.validate('29-10-2021');
```

The object form to parse as UTC instead of the machine's local timezone:

```js
const schema = Joi.date().format({ format: 'YYYY-MM-DD', utc: true });

schema.validate('2021-10-29'); // 2021-10-29T00:00:00.000Z
```

```js
const schema = Joi.date().format({ format: ['YYYY/MM/DD', 'DD-MM-YYYY'], utc: true });
```

`utc` only applies to the formats above, so it cannot be combined with joi's own base formats. Those
stay joi's: use [`date.iso()`](https://joi.dev/api/#dateiso) or
[`date.timestamp()`](https://joi.dev/api/#datetimestamptype) rather than `format('iso')`.

`format()` only applies to string inputs. Any other value is left to joi's own date coercion, which
reads a number as an epoch timestamp in milliseconds:

```js
const schema = Joi.date().format('YYYYMMDD');

schema.validate('20211029'); // 2021-10-29
schema.validate(20211029); // 1970-01-01T05:36:51.029Z
```

Convert the value to a string yourself if it needs to be parsed with the format.
