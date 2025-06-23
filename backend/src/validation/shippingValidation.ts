import Joi from 'joi';

export const createShippingSchema = Joi.object({
    full_name: Joi.string().trim().min(6).max(60).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    region: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
});


export const updateShippingSchema = Joi.object({
    full_name: Joi.string().trim().min(6).max(60),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    region: Joi.string().trim(),
    city: Joi.string().trim(),
    address: Joi.string().trim(),
});