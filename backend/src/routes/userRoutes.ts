import express from "express";
import userModel, { IUser } from "../models/user.js";

const router = express.Router();

router.post("/", (req, res) => {
	let user = req.body;

	if (
		typeof user.username !== "string" ||
		user.email !== "string" ||
		user.password !== "string"
	) {
		res.status(400).send("Bad Request");
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
