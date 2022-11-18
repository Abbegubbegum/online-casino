let socket = io();
let serverRSAPublicKey;
let clientRSAKeyPair;
let aesKey;

let rsaBtn = document.getElementById("rsa-btn");
let kyberBtn = document.getElementById("kyber-btn");

rsaBtn.addEventListener("click", () => {
	if (socket.connected) {
		socket.emit("SETUP_RSA");
	}
});

kyberBtn.addEventListener("click", () => {
	if (socket.connected) {
		socket.emit("SETUP_KYBER");
	}
});

socket.on("connect", () => {
	console.log("Connected to server");
});

socket.on("disconnect", () => {
	console.log("Disconnected from server");
});

socket.on("MESSAGE", (message) => {
	console.log("Message: " + message);
});

socket.on("PUBLIC_KEY_KYBER", (key) => {
	let publicKey = new Uint8Array(key);
	kyber.encrypt(publicKey).then((ct) => {
		socket.emit("CIPHER_TEXT", ct.cyphertext);
		aesKey = ct.secret;
		console.log("Secret", aesKey);
	});
});

socket.on("PUBLIC_KEY_RSA", async (key) => {
	serverRSAPublicKey = await crypto.subtle
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

socket.on("AES_MESSAGE", async (msg) => {
	console.log(msg);
});

socket.on("RSA_MESSAGE", async (msg) => {
	console.log(await decryptRSAMessage(msg));
});

/** Send the current draft message */
function sendRSAMessage(msg) {
	let enc = new TextEncoder();
	crypto.subtle
		.encrypt(
			{
				name: "RSA-OAEP",
			},
			serverRSAPublicKey,
			enc.encode(msg).buffer
		)
		.then((encrypted) => {
			socket.emit("MESSAGE", encrypted);
		})
		.catch((err) => {
			console.log(err);
		});
}

async function decryptRSAMessage(msg) {
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

function sendRSAMessageBuf(buf) {
	crypto.subtle
		.encrypt({ name: "RSA-OAEP" }, serverRSAPublicKey, buf)
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
		.exportKey("spki", clientRSAKeyPair.publicKey)
		.catch((err) => {
			console.error(err);
		});

	socket.emit("CLIENT_PUBLIC_KEY", key);
}
