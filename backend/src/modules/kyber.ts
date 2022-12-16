import pkg from "kyber-crystals";
import crypto from "crypto";
const { kyber } = pkg;

let privateKey: Uint8Array;
let publicKey: Uint8Array;

let cyphertext: Uint8Array;

let aesKey: Uint8Array;

async function initKeys() {
	const keyPair = await kyber.keyPair();

	privateKey = keyPair.privateKey;
	publicKey = keyPair.publicKey;
}

async function decrypt(ct: Uint8Array): Promise<Uint8Array> {
	return await kyber.decrypt(ct, privateKey);
}

function getPublicKey(): Uint8Array {
	return publicKey;
}

function getAESKey(): Uint8Array {
	return aesKey;
}

function getCypherText(): Uint8Array {
	return cyphertext;
}

function getPrivateKey(): Uint8Array {
	return privateKey;
}

function encryptMessage(msg: string, key: Uint8Array) {
	let iv = crypto.randomBytes(16);
	let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
	let ciphers = [cipher.update(msg, "utf-8"), cipher.final()];
	// console.log(ciphers);
	let ct = Buffer.concat(ciphers);

	// let ct = cipher.update(msg, "utf8", "utf8") + cipher.final("utf8");

	return [ct, iv];
}

function decryptMessage(msg: Buffer[], key: Uint8Array) {
	let decipher = crypto.createDecipheriv("aes-256-cbc", key, msg[1]);

	let ciphers = [decipher.update(msg[0]), decipher.final()];

	return Buffer.concat(ciphers).toString("utf8");
}

export default {
	initKeys,
	decrypt,
	getPublicKey,
	getAESKey,
	getCypherText,
	getPrivateKey,
	encryptMessage,
	decryptMessage,
};
