// const BaseJoi = require('joi');
// const sanitizeHtml=require('sanitize-html');

// const extension = (joi) => ({
//     type: 'string',
//     base: joi.string(),
//     messages: {
//         'string.escapeHTML': '{{#label}} must not include HTML!'
//     },
//     rules: {
//         escapeHTML: {
//             validate(value, helpers) {
//                 const clean = sanitizeHtml(value, {
//                     allowedTags: [],
//                     allowedAttributes: {},
//                 });
//                 if (clean !== value) return helpers.error('string.escapeHTML', { value })
//                 return clean;
//             }
//         }
//     }
// });

// const Joi=BaseJoi.extend(extension);

const Joi=require("joi");
module.exports.petfinderSchema = Joi.object({
    pet: Joi.object({
        petname: Joi.string().required(),
        age: Joi.number().required().min(0).max(25),
        gender: Joi.string().required(),
        size: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string(),
        lostDate: Joi.string().required(),
        typeOfPet:Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
});

module.exports.petAdoptionSchema = Joi.object({
    petadopt: Joi.object({
        petname: Joi.string().required(),
        age: Joi.number().required().min(0).max(25),
        gender: Joi.string().required(),
        size: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string(),
        typeOfPet:Joi.string().required(),
        dogBreeds:Joi.string(),
        catBreeds:Joi.string(),
        isAdoptable:Joi.boolean(),
        needsSpecialCare:Joi.boolean()
    }).required(),
    deleteImages:Joi.array()
});

module.exports.shelterSchema = Joi.object({
    shelter: Joi.object({
        shelterName: Joi.string().required(),
        shelterLocation: Joi.string().required(),
        shelterEmail: Joi.string().required(),
        shelterPhone: Joi.string().required(),
        shelterDescription: Joi.string().required(),
        shelterImage: Joi.string(),
    }).required(),
    deleteImages:Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
});