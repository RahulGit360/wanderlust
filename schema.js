const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional().allow(''),
        image: Joi.string().optional().allow(''),
        price: Joi.number().required().min(0),
        location: Joi.string().optional().allow(''),
        country: Joi.string().optional().allow(''),
    }).required()
});