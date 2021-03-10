## Compatibility

This version requires **joi** v17 or newer.

## Usage

```js
const Joi = require('joi')
    .extend(require('@joi/date'));

const schema = Joi.date().format('YYYY-MM-DD');
```

## Rules

### `date.format(format)`

Specifies the allowed date format:
- `format` - string that follows the `date-fns` [format](https://date-fns.org/v2.19.0/docs/parse).

```js
const schema = Joi.date().format('YYYY-MM-DD HH:mm');
```
