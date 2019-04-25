<a href="http://hapijs.com"><img src="https://raw.githubusercontent.com/hapijs/assets/master/images/family.png" width="180px" align="right" /></a>

# joi-date

Joi extensions for extra date rules.

[![Build Status](https://secure.travis-ci.org/hapijs/joi-date.svg?branch=master)](http://travis-ci.org/hapijs/joi-date)

# Usage

Usage is a two steps process. First, a schema is constructed using the provided types and constraints:

```js
const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');
const Joi = BaseJoi.extend(Extension);

const schema = Joi.date().format('YYYY-MM-DD');
```

# API
See the [API Reference](https://github.com/hapijs/joi-date/blob/v1.3.0/API.md).
