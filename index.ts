import crypto from "crypto";
import express from "express";
import { cwd } from "process";
import http from "http";
import { Server } from "socket.io";
const app = express();
const port = 5050;
const server = http.createServer(app);
const io = new Server(server);

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: "spki",
		format: "pem",
	},
	privateKeyEncoding: {
		type: "pkcs8",
		format: "pem",
	},
});

app.use(express.static(cwd() + "/frontend"));

app.get("/", (req, res) => {
	res.sendFile(cwd() + "/frontend/index.html");
});

io.on("connection", (socket) => {
	// console.log("User Connected", socket);
	io.emit("PUBLIC_KEY", publicKey);

	socket.on("MESSAGE", (msg: Buffer) => {
		console.log("Raw message: ", msg.toString("base64"));
		console.log("Message received", decrypt(msg));
	});
});

server.listen(port, () => {
	console.log(`listening on http://localhost:${port}`);
});

// console.log(publicKey);
// console.log(privateKey);

function encrypt(msg: string): string {
	return crypto
		.publicEncrypt(
			{
				key: publicKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha256",
			},
			Buffer.from(msg)
		)
		.toString("base64");
}

function decrypt(cypher: Buffer): string {
	return crypto
		.privateDecrypt(
			{
				key: privateKey,
				oaepHash: "sha256",
			},
			cypher
		)
		.toString();
}

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
