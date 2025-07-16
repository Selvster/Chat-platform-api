import Joi from 'joi';

export const createRoomSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Room name is required.',
    'string.min': 'Room name must be at least 3 characters long.',
    'string.max': 'Room name cannot exceed 50 characters.',
    'any.required': 'Room name is required.',
  }),
  description: Joi.string().min(10).max(200).required().messages({
    'string.empty': 'Room description is required.',
    'string.min': 'Room description must be at least 10 characters long.',
    'string.max': 'Room description cannot exceed 200 characters.',
    'any.required': 'Room description is required.',
  }),
});

export const updateRoomSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'Room name must be at least 3 characters long.',
    'string.max': 'Room name cannot exceed 50 characters.',
  }),
  description: Joi.string().min(10).max(200).optional().messages({
    'string.min': 'Room description must be at least 10 characters long.',
    'string.max': 'Room description cannot exceed 200 characters.',
  }),
}).min(1).messages({ 
  'object.min': 'At least one field (name or description) must be provided for update.',
});
