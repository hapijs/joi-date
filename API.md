<!-- version -->
# 1.0.2 API Reference
<!-- versionstop -->

<!-- toc -->

- [Rules](#rules)
  - [`date.format(format)`](#dateformatformat)

<!-- tocstop -->

# Rules

## `date.format(format)`

Specifies the allowed date format:
- `format` - string or array of strings that follow the `moment.js` [format](http://momentjs.com/docs/#/parsing/string-format/).

```js
const schema = Joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']);
```
