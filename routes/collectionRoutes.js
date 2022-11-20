const router = require("express").Router();
const verify = require("./verifyToken");

const Photo = require("../models/photo.model");

router.post("/add", verify, async (req, res) => {
	if (!req.headers.email) {
		let userID = req.user._id;
		let photoID = req.body.photoID;

		try {
			let photo = await Photo.findOne({ photoID, userID });

			if (photo) {
				return res.json("Image already saved!");
			} else {
				photo = new Photo({
					photoID: photoID,
					userID: userID,
					altDescription: req.body.altDescription,
					urlsSmall: req.body.urlsSmall,
					urlsRegular: req.body.urlsRegular,
					urlsThumb: req.body.urlsThumb,
					urlsRaw: req.body.urlsRaw,
					date: new Date(),
				});
				photo
					.save()
					.then(() => {
						res.json("Image saved!");
					})
					.catch((err) => {
						console.log(err);
						res.status(400).json("Error: " + err);
					});
			}
		} catch (err) {
			console.error(err);
			res.status(500).json("Server Error");
		}
	}
});

router.get("/get", verify, async (req, res) => {
	if (!req.headers.email) {
		await Photo.find({ userID: req.user._id })
			.then((photos) => {
				res.json(photos);
			})
			.catch((err) => res.status(400).json("Error: " + err));
	}
});

router.delete("/:id", verify, async (req, res) => {
	if (!req.headers.email) {
		await Photo.findOneAndDelete({
			photoID: req.params.id,
			userID: req.user._id,
		})
			.then((photos) => res.json("Photo deleted!"))
			.catch((err) => res.status(400).json("Error: " + err));
	}
});

module.exports = router;
