import Joi from 'joi';

class BaseValidator {
  constructor() {
    this.schema = null;
  }

  validate(data) {
    const { error } = this.schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}

// Product Validator
export class ProductValidator extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      title: Joi.string().min(3).max(270).required().message({
        'string.base': 'Product title must be a string',
        'string.empty': 'Product title cannot be empty',
        'string.min': 'Product title must be at least 3 characters long',
        'string.max': 'Product title can be up to 100 characters long',
      })
      
    });
  }
}