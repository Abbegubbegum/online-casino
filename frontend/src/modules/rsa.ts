let serverRSAPublicKey: CryptoKey;
let clientRSAKeyPair: CryptoKeyPair;

export async function importRSAPublicKey(key: string) {
	try {
		serverRSAPublicKey = await crypto.subtle.importKey(
			"spki",
			convertPEMKey(key),
			{
				name: "RSA-OAEP",
				hash: "SHA-256",
			},
			true,
			["encrypt"]
		);
	} catch (err) {
		console.log(err);
	}
}

export async function createRSAKeyPair() {
	clientRSAKeyPair = await crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256",
		},
		true,
		["encrypt", "decrypt"]
	);
}

export async function getRSAPublicKey() {
	try {
		return crypto.subtle.exportKey("spki", clientRSAKeyPair.publicKey);
	} catch (err) {
		console.error(err);
	}
}

export async function decryptRSAMessage(msg: Buffer) {
	let dec = new TextDecoder();
	try {
		return dec.decode(
			await crypto.subtle.decrypt(
				{ name: "RSA-OAEP" },
				clientRSAKeyPair.privateKey,
				msg
			)
		);
	} catch (err) {
		console.log(err);
	}
}

export async function encryptRSAMessage(msg: string) {
	let enc = new TextEncoder();
	try {
		return crypto.subtle.encrypt(
			{
				name: "RSA-OAEP",
			},
			serverRSAPublicKey,
			enc.encode(msg).buffer
		);
	} catch (err) {
		console.log(err);
	}
}

function convertPEMKey(pem: string) {
	// fetch the part of the PEM string between header and footer
	pem = pem.replace(/(\r\n|\n|\r)/gm, "");
	const pemHeader = "-----BEGIN PUBLIC KEY-----";
	const pemFooter = "-----END PUBLIC KEY-----";
	const pemContents = pem.substring(
		pemHeader.length,
		pem.length - pemFooter.length
	);
	// base64 decode the string to get the binary data
	const binaryDerString = window.atob(pemContents);
	// convert from a binary string to an ArrayBuffer
	const binaryDer = str2ab(binaryDerString);

	return binaryDer;
}

function str2ab(str: string) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}
