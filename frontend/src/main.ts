import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import io from "socket.io-client";
import {
	decryptRSAMessage,
	importRSAPublicKey,
	createRSAKeyPair,
	getRSAPublicKey,
	encryptRSAMessage,
} from "./modules/rsa.js";
import {
	importAESKey,
	decryptAESMessage,
	encryptAESMessage,
} from "./modules/kyber.js";
import { kyber } from "kyber-crystals";

createApp(App).mount("#app");

const socket = io("ws://localhost:5050");

socket.on("connect", () => {
	console.log("Connected to server");
});

socket.on("disconnect", () => {
	console.log("Disconnected from server");
});

socket.on("MESSAGE", (message) => {
	console.log("Message: " + message);
});

socket.on("AES_MESSAGE", async (msg: ArrayBuffer[]) => {
	// console.log(msg);
	console.log("Message received AES:", await decryptAESMessage(msg));
	socket.emit("AES_MESSAGE", await encryptAESMessage("waddup"));
});

socket.on("RSA_MESSAGE", async (msg: Buffer) => {
	console.log("Message received RSA:", await decryptRSAMessage(msg));
	socket.emit("RSA_MESSAGE", await encryptRSAMessage("Bitchass"));
});

socket.on("PUBLIC_KEY_RSA", async (key: string) => {
	await importRSAPublicKey(key);
	createRSAKeyPair().then(async () => {
		socket.emit("CLIENT_PUBLIC_KEY", await getRSAPublicKey());
	});
});

socket.on("PUBLIC_KEY_KYBER", (key: Buffer) => {
	let publicKey = new Uint8Array(key);
	kyber.encrypt(publicKey).then((ct) => {
		socket.emit("CIPHER_TEXT", ct.cyphertext);
		importAESKey(ct.secret);
	});
});

export function initRSA() {
	socket.emit("SETUP_RSA");
}

export function initKyber() {
	socket.emit("SETUP_KYBER");
}
