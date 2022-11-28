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

export async function encryptAESMessage(msg: string) {
	let iv = new Uint8Array(16);
	crypto.getRandomValues(iv);

	let enc = new TextEncoder();
	try {
		let ct = await crypto.subtle.encrypt(
			{ name: "AES-CBC", iv: iv },
			aesKey,
			enc.encode(msg).buffer
		);

		return [ct, iv];
	} catch (err) {
		console.log(err);
	}
}
