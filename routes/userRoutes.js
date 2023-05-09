const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("./validation");

router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const validUser = await User.findOne({ email: req.body.email });
	if (!validUser) {
		return res.status(400).send("Email is not found");
	}

	const validPass = await bcrypt.compare(req.body.password, validUser.password);
	if (!validPass) {
		return res.status(400).send("Invalid password");
	}

	const token = jwt.sign({ _id: validUser._id }, process.env.TOKEN_SECRET);
	res.header("auth-token", token).json({ token, email: validUser.email });
});

router.post("/register", async (req, res) => {
	const { error } = registerValidation(req.body);
	console.log(error);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const emailExist = await User.findOne({ email: req.body.email });
	if (emailExist) {
		return res.status(400).send({
			message: "This email already exists",
		});
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	const user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: hashedPassword,
	});

	try {
		await user.save();
		res.send({ user: user._id });
		console.log("User Saved");
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
