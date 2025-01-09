import Joi from 'joi';
import {BaseValidator} from "./base.js"

// Session Validator
export class SessionValidator extends BaseValidator {
    constructor(){
      super();
      this.schema = Joi.object({
        id: Joi.string().optional(),
        shop: Joi.string().required().messages({
          'string.empty': 'Shop is required.',
          'any.required': 'Shop is required.',
        }),
        state: Joi.string().required().messages({
          'string.empty': 'State is required.',
          'any.required': 'State is required.',
        }),
        accessToken: Joi.string().required().messages({
          'string.empty': 'Access token is required.',
          'any.required': 'Access token is required.',
        }),
        scope: Joi.string().optional(),
        expires: Joi.date().iso().optional().messages({
          'date.base': 'Invalid expiration date.',
          'date.format': 'Expiration date must be in ISO format.',
        }),
      });
    }
}