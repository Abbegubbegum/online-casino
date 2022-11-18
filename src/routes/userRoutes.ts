import express from "express";
import userModel, { IUser } from "../models/user.js";

const router = express.Router();

router.post("/", (req, res) => {
	let user: any = {
		username: "Abbe",
		email: "abbe@gmail.com",
		password: "yoyoyoyoyo",
	};

	userModel
		.create(user)
		.then((newDoc) => {
			res.status(201).json(newDoc);
		})
		.catch((err) => {
			console.log(err);
		});
});

export default router;
