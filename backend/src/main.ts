import express from "express";
import { resolve } from "path";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import rsa from "./modules/rsa.js";
import kyber from "./modules/kyber.js";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import { RouletteGame } from "./modules/roulette.js";
import Decrypter from "./modules/decryptor.js";
import dotenv from "dotenv";

dotenv.config();

const databaseUri = process.env.DB_URI || "mongodb://localhost/casino";

const app = express();
const port = 5050;
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

app.use(express.json());
app.use(cors());

app.use(express.static(resolve("../frontend/dist")));
app.use("/api/users", userRoutes);

app.get("/api", (req, res) => {
	res.sendStatus(200);
});

rsa.initKeys();

kyber.initKeys();

let roulette = new RouletteGame();
let decryptedSocket = new Decrypter();

io.on("connection", (socket) => {
	let clientPublicKey = "";
	let aesKey: Uint8Array;

	socket.onAny((event, data) => {
		decryptedSocket.processMessage(socket, event, data, aesKey);
	});

	socket.on("SETUP_RSA", () => {
		socket.emit("PUBLIC_KEY_RSA", rsa.getPublicKey());
	});

	// socket.on("RSA_MESSAGE", (msg: Buffer) => {
	// 	console.log("Message received RSA:", rsa.decrypt(msg));
	// });

	socket.on("CLIENT_PUBLIC_KEY", (key: Buffer) => {
		clientPublicKey = `-----BEGIN PUBLIC KEY-----\n
		${key.toString("base64")}\n
		-----END PUBLIC KEY-----`;
		// socket.emit(
		// 	"RSA_MESSAGE",
		// 	rsa.encrypt("Wassup my guy", clientPublicKey)
		// );
	});

	socket.on("SETUP_KYBER", async () => {
		socket.emit("PUBLIC_KEY_KYBER", kyber.getPublicKey());
	});

	socket.on("CIPHER_TEXT", async (ct: Uint8Array) => {
		aesKey = await kyber.decrypt(ct);
		// console.log("Secret", kyber.getSharedSecret());

		// socket.emit(
		// 	"AES_MESSAGE",
		// 	kyber.encryptMessage("Waddap my home dawg", aesKey)
		// );
	});

	socket.on("AES_MESSAGE", async (msg: Buffer[]) => {
		console.log("Message received AES:", kyber.decryptMessage(msg, aesKey));
	});

	// Send the socket the current previous results from the roulette game
	socket.emit("PREVIOUS_RESULTS", roulette.prevResults);

	roulette.on("RESULT", (result: string) => {
		socket.emit("ROULETTE_RESULT", result);
	});

	roulette.on("START_BETTING", () => {
		socket.emit("START_BETTING");
	});

	roulette.on("START_ROLL", () => {
		socket.emit("START_ROLLING");
	});
});

decryptedSocket.on(
	"PLACE_BET",
	async (dataString: string, socket: Socket, key: Uint8Array) => {
		const data = JSON.parse(dataString);

		const res = await roulette.placeBet(
			socket,
			key,
			data.username,
			data.amount,
			data.option
		);

		if (!res) {
			socket.emit("FAILED_BET", kyber.encryptMessage(dataString, key));
		}
	}
);

server.listen(port, async () => {
	await mongoose.connect(databaseUri);
	console.log(`listening on http://localhost:${port}`);
});

// console.log(publicKey);
// console.log(privateKey);

// console.log(encryptedData.toString("base64"));

// const decryptedData = crypto.privateDecrypt(
// 	{
// 		key: privateKey,
// 		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
// 		oaepHash: "sha256",
// 	},
// 	encryptedData
// );

// console.log(decryptedData.toString());
