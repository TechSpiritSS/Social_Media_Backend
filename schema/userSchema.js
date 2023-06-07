const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

const updateProfileSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  revealMode: Joi.boolean().optional(),
});

const updateOpenStatusSchema = Joi.object({
  openMode: Joi.boolean().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateOpenStatusSchema,
};
