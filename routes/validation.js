const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(1)
            .required(),
        lastName: Joi.string()
            .min(1)
            .required(),
        email: Joi.string()
            .min(1)
            .max(255)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .max(1024)
            .required()
    });

    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(1)
            .max(255)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .max(1024)
            .required()
    });

    return schema.validate(data);
};

const googleRegisterValidation = data => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(1)
            .required(),
        lastName: Joi.string()
            .min(1)
            .required(),
        email: Joi.string()
            .min(1)
            .max(255)
            .email()
            .required()
    });

    return schema.validate(data);
};

const googleLoginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(1)
            .max(255)
            .email()
            .required()
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.googleRegisterValidation = googleRegisterValidation;
module.exports.googleLoginValidation = googleLoginValidation;