let socket = io();
let publicKey;
socket.on("connect", () => {
	console.log("Connected to server");
});

socket.on("disconnect", () => {
	console.log("Disconnected from server");
});

socket.on("MESSAGE", (message) => {
	console.log("Message: " + message);
});

socket.on("PUBLIC_KEY", (key) => {
	crypto.subtle
		.importKey(
			"spki",
			importRsaKey(key),
			{
				name: "RSA-OAEP",
				hash: "SHA-256",
			},
			true,
			["encrypt"]
		)
		.then((cryptoKey) => {
			publicKey = cryptoKey;
			sendMessage("Yooo");
		});
});

socket.on("SECRET_MESSAGE", (msg) => {
	console.log(msg);
});

/** Send the current draft message */
function sendMessage(msg) {
	crypto.subtle
		.encrypt(
			{
				name: "RSA-OAEP",
			},
			publicKey,
			str2ab(msg)
		)
		.then((encrypted) => {
			// Emit the message
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
