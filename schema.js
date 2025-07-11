const Joi = require('joi');

module.exports.postSchema = Joi.object({
  
        title: Joi.string().required(),
        content: Joi.string().required(),
        image:Joi.string().allow("", null),

   

}); 

