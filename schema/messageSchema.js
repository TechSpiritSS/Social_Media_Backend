const Joi = require('joi');

const sendMsgSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  message: Joi.string().required(),
});

const getMsgSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
});

module.exports = {
  sendMsgSchema,
  getMsgSchema,
};
