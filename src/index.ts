import crypto from "crypto";
import express from "express";
import { cwd } from "process";
import http from "http";
import { Server } from "socket.io";
import rsa from "./rsa.js";
import kyber from "./kyber.js";
const app = express();
const port = 5050;
const server = http.createServer(app);
const io = new Server(server);

let clientPublicKey = "";

app.use(express.static(cwd() + "/frontend"));

// app.get("/", (req, res) => {
// 	res.sendFile(cwd() + "/frontend/index.html");
// });

io.on("connection", (socket) => {
	// console.log("User Connected", socket);
	socket.on("SETUP_RSA", () => {
		rsa.initKeys();

		io.emit("PUBLIC_KEY_RSA", rsa.getPublicKey());

		socket.on("MESSAGE", (msg: Buffer) => {
			console.log("Raw message: ", msg.toString("base64"));
			console.log("Message received", rsa.decrypt(msg));
		});

		socket.on("CLIENT_PUBLIC_KEY", (key) => {
			clientPublicKey = `-----BEGIN PUBLIC KEY-----\n${key.toString(
				"base64"
			)}\n-----END PUBLIC KEY-----`;
			socket.emit(
				"RSA_MESSAGE",
				rsa.encrypt("Wassup my guy", clientPublicKey)
			);
		});
	});

	socket.on("SETUP_KYBER", async () => {
		await kyber.initKeys();

		io.emit("PUBLIC_KEY_KYBER", kyber.getPublicKey());

		socket.on("CIPHER_TEXT", async (ct: Uint8Array) => {
			await kyber.decrypt(new Uint8Array(ct));
			console.log("Secret", kyber.getSharedSecret());
			socket.emit("AES_MESSAGE", kyber.encryptMessage("Waddup"));
		});

		socket.on("MESSAGE", (msg) => {
			console.log(msg);
		});
	});
});

server.listen(port, () => {
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
