import Joi from 'joi';
import {BaseValidator} from "./base.js"

// User Validator
export class userValidator extends BaseValidator {
    constructor(){
      super();
      this.schema = Joi.object({
        id: Joi.string().optional(),
        shop: Joi.string().min(1).max(355).required(), 
        sessionId: Joi.string().allow(null), 
        session: Joi.object().optional(),
        mySections: Joi.array().items(Joi.object()).optional(),
      });
    }
}