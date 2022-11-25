let aesKey: CryptoKey;

export async function importAESKey(key: ArrayBuffer) {
	aesKey = await crypto.subtle.importKey(
		"raw",
		key,
		{ name: "AES-CBC" },
		false,
		["encrypt", "decrypt"]
	);
}

export async function decryptAESMessage(msg: ArrayBuffer[]) {
	let dec = new TextDecoder();

	try {
		return dec.decode(
			await crypto.subtle.decrypt(
				{ name: "AES-CBC", iv: msg[1] },
				aesKey,
				msg[0]
			)
		);
	} catch (err) {
		console.log(err);
	}
}
