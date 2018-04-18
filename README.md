
# joi-date-extensions

Joi extensions for extra date rules.

[![npm version](https://badge.fury.io/js/joi-date-extensions.svg)](http://badge.fury.io/js/joi-date-extensions)
[![Build Status](https://secure.travis-ci.org/hapijs/joi-date-extensions.svg?branch=master)](http://travis-ci.org/hapijs/joi-date-extensions)
<!--

Remove those badges until they work properly on semver.

[![Dependencies Status](https://david-dm.org/hapijs/joi-date-extensions.svg)](https://david-dm.org/hapijs/joi-date-extensions)
[![DevDependencies Status](https://david-dm.org/hapijs/joi-date-extensions/dev-status.svg)](https://david-dm.org/hapijs/joi-date-extensions#info=devDependencies)

-->
[![NSP Status](https://nodesecurity.io/orgs/hapijs/projects/0394bf83-b5bc-410b-878c-e8cf1b92033e/badge)](https://nodesecurity.io/orgs/hapijs/projects/0394bf83-b5bc-410b-878c-e8cf1b92033e)
[![Known Vulnerabilities](https://snyk.io/test/npm/joi-date-extensions/badge.svg)](https://snyk.io/test/npm/joi-date-extensions)

Lead Maintainer: [Nicolas Morel](https://github.com/marsup)

# Usage

Usage is a two steps process. First, a schema is constructed using the provided types and constraints:

```js
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const schema = Joi.date().format('YYYY-MM-DD');
```

# API
See the [API Reference](https://github.com/hapijs/joi-date-extensions/blob/v1.2.0/API.md).
