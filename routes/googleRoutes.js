const router = require('express').Router();

const GoogleUser = require('../models/google.user.model');

const { googleLoginValidation, googleRegisterValidation }= require('./validation');

router.post('/register', async (req, res) => {
    const {error} = googleRegisterValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    const emailExist = await GoogleUser.findOne({email: req.body.email});
    if (emailExist) {
        console.log(emailExist)
        return res.status(400).send({
            message: 'This email already exists!'
        });
    };

    const user = new GoogleUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    });

    try {
        await user.save();
        res.send({user: user._id});
        console.log(user)
        console.log('User Saved')
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    const {error} = googleLoginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };
    const validUser = await GoogleUser.findOne({email: req.body.email});
    if (!validUser) {
        return res.status(400).send('Email is not found');
    };
    res.send('Logged in!')
})

module.exports = router;