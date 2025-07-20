import Joi from 'joi';

export const createMessageSchema = Joi.object({
  content: Joi.string().min(1).max(500).required().messages({
    'string.empty': 'Message content cannot be empty.',
    'string.min': 'Message content must be at least 1 character long.',
    'string.max': 'Message content cannot exceed 500 characters.',
    'any.required': 'Message content is required.',
  }),
});
