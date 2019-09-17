<a href="https://hapi.dev"><img src="https://raw.githubusercontent.com/hapijs/assets/master/images/family.png" width="180px" align="right" /></a>

# @hapi/joi-date

Extensions for advance date rules.

[![Build Status](https://secure.travis-ci.org/hapijs/joi-date.svg?branch=master)](http://travis-ci.org/hapijs/joi-date)

# Compatibility

This version requires **joi** v16 or newer. For previous versions of **joi** use version 1.x of this module.

# Usage

```js
const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));

const schema = Joi.date().format('YYYY-MM-DD').utc();
```

# API

See the [API Reference](https://github.com/hapijs/joi-date/blob/master/API.md).
