import pkg from "kyber-crystals";
import crypto from "crypto";
const { kyber } = pkg;

let privateKey: Uint8Array;
let publicKey: Uint8Array;

let cyphertext: Uint8Array;
let secret: Uint8Array;

let sharedSecret: Uint8Array;

const aesAlgorithm = "aes-256-cbc";

async function initKeys() {
	const keyPair = await kyber.keyPair();

	privateKey = keyPair.privateKey;
	publicKey = keyPair.publicKey;
}

async function createCypherText() {
	const res = await kyber.encrypt(publicKey);

	cyphertext = res.cyphertext;
	secret = res.secret;
}

async function decrypt(ct: Uint8Array) {
	sharedSecret = await kyber.decrypt(ct, privateKey);
}

async function run() {
	await initKeys();

	await createCypherText();

	await decrypt(cyphertext);

	await decrypt(cyphertext);

	console.log("Private");
	console.log(Buffer.from(privateKey).toString("base64"));
	console.log("Public");
	console.log(Buffer.from(publicKey).toString("base64"));
	console.log("Cypher Text");
	console.log(Buffer.from(cyphertext).toString("base64"));
	console.log("Client Secret");
	console.log(Buffer.from(secret).toString("base64"));
	console.log("Server Secret");
	console.log(Buffer.from(sharedSecret).toString("base64"));
}

function getPublicKey(): Uint8Array {
	return publicKey;
}

function getSharedSecret(): Uint8Array {
	return sharedSecret;
}

function getCypherText(): Uint8Array {
	return cyphertext;
}

function getPrivateKey(): Uint8Array {
	return privateKey;
}

function encryptMessage(msg: string) {
	let initVector = crypto.randomBytes(16);
	let aesCipher = crypto.createCipheriv(
		aesAlgorithm,
		sharedSecret,
		initVector
	);
	return (
		aesCipher.update(msg, "utf-8", "hex") +
		aesCipher.final("hex") +
		initVector
	);
}

function decryptMessage(ct: string) {
	return;
}

export default {
	initKeys,
	createCypherText,
	decrypt,
	getPublicKey,
	getSharedSecret,
	getCypherText,
	run,
	getPrivateKey,
	encryptMessage,
	decryptMessage,
};
