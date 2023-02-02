import express from "express";
import userModel from "../models/user.js";

const router = express.Router();

router.get("/", (req, res) => {
	const username = req.query.username;
	const password = req.query.password;

	if (typeof username !== "string" || typeof password !== "string") {
		return res.sendStatus(400);
	}

	userModel
		.findOne({ username: username, password: password })
		.then((user) => {
			if (!user) {
				return res.sendStatus(404);
			}
			return res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			return res.sendStatus(404);
		});
});

router.post("/", (req, res) => {
	const user = req.body;

	console.log(req.body);

	if (
		typeof user.username !== "string" ||
		typeof user.email !== "string" ||
		typeof user.password !== "string"
	) {
		res.status(400).send("Bad Request");
		return;
	}

	// user = {
	// 	username: "Abbe",
	// 	email: "abbe@gmail.com",
	// 	password: "yoyoyoyoyo",
	// };

	userModel
		.create(user)
		.then((newDoc) => {
			res.status(201).json(newDoc);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).send("Bad Request");
		});
});

export default router;
