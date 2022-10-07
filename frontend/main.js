let socket = io();
let serverPublicKey;
let clientKeyPair;
let sessionKey;

socket.on("connect", () => {
	console.log("Connected to server");
});

socket.on("disconnect", () => {
	console.log("Disconnected from server");
});

socket.on("MESSAGE", (message) => {
	console.log("Message: " + message);
});

socket.on("PUBLIC_KEY", async (key) => {
	serverPublicKey = await crypto.subtle
		.importKey(
			"spki",
			importRsaKey(key),
			{
				name: "RSA-OAEP",
				hash: "SHA-256",
			},
			true,
			["encrypt", "wrapKey"]
		)
		.catch((err) => {
			console.log(err);
		});
	createRSAKeyPair().then(() => {
		sendRSAPublicKey();
	});
});

socket.on("SECRET_MESSAGE", async (msg) => {
	console.log(await decryptMessage(msg));
});

/** Send the current draft message */
function sendMessage(msg) {
	let enc = new TextEncoder();
	crypto.subtle
		.encrypt(
			{
				name: "RSA-OAEP",
			},
			serverPublicKey,
			enc.encode(msg).buffer
		)
		.then((encrypted) => {
			socket.emit("MESSAGE", encrypted);
		})
		.catch((err) => {
			console.log(err);
		});
}

async function decryptMessage(msg) {
	let dec = new TextDecoder();
	try {
		return dec.decode(
			await crypto.subtle.decrypt(
				{ name: "RSA-OAEP" },
				clientKeyPair.privateKey,
				msg
			)
		);
	} catch (err) {
		console.log(err);
	}
}

function sendBufferMessage(buf) {
	crypto.subtle
		.encrypt({ name: "RSA-OAEP" }, serverPublicKey, buf)
		.then((encrypted) => {
			socket.emit("MESSAGE", encrypted);
		});
}

function importRsaKey(pem) {
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

function str2ab(str) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

async function createRSAKeyPair() {
	clientKeyPair = await crypto.subtle.generateKey(
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

async function sendRSAPublicKey() {
	// console.log(clientKeyPair.publicKey, serverPublicKey);
	// crypto.subtle
	// 	.wrapKey("raw", clientKeyPair.publicKey, serverPublicKey, {
	// 		name: "RSA-OAEP",
	// 	})
	// 	.then((wrappedKey) => {
	// 		console.log(wrappedKey);
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
	let key = await crypto.subtle
		.exportKey("spki", clientKeyPair.publicKey)
		.catch((err) => {
			console.error(err);
		});

	socket.emit("CLIENT_PUBLIC_KEY", key);
}
