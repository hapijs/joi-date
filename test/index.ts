
import * as BaseJoi from 'joi';
import JoiDate from '..';
import * as Lab from '@hapi/lab';


const { expect } = Lab.types;

const Joi = BaseJoi.extend(JoiDate) as BaseJoi.Root;

Joi.date().format('YYYY-MM-DD HH:mm');
Joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']);
expect.error(Joi.date().format());

Joi.date().utc();
expect.error(Joi.date().utc(true));
