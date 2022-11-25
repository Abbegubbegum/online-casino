import { Schema, model, InferSchemaType } from "mongoose";

let user = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	balance: {
		type: Number,
		default: 0,
	},
});

export type IUser = InferSchemaType<typeof user>;
export default model("User", user);
