## Compatibility

This version requires **joi** v16 or newer. For previous versions of **joi** use version 1.x of this module.

## Usage

```js
const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));

const schema = Joi.date().format('YYYY-MM-DD').utc();
```

## Rules

### `date.format(format)`

Specifies the allowed date format:
- `format` - string or array of strings that follow the `moment.js` [format](http://momentjs.com/docs/#/parsing/string-format/).

```js
const schema = Joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']);
```

### `date.utc()`

Dates will be parsed as UTC instead of using the machine's local timezone.

```js
const schema = Joi.date().utc().format(['YYYY/MM/DD', 'DD-MM-YYYY']);
```
