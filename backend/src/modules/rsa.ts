import crypto from "crypto";

let publicKey: string;
let privateKey: string;

function initKeys() {
	const keys = crypto.generateKeyPairSync("rsa", {
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

	publicKey = keys.publicKey;
	privateKey = keys.privateKey;
	// console.log(publicKey);
}

function getPublicKey(): string {
	// console.log(publicKey);

	return publicKey;
}

function encrypt(msg: string, publicKey: string): Buffer {
	return crypto.publicEncrypt(
		{
			key: publicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: "sha256",
		},
		Buffer.from(msg)
	);
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

export default { initKeys, encrypt, decrypt, getPublicKey };
