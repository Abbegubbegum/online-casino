import EventEmitter from "events";
import { Socket } from "socket.io";
import kyber from "./kyber.js";

export default class Decrypter extends EventEmitter {
	constructor() {
		super();
	}

	processMessage(
		socket: Socket,
		event: string,
		data: Buffer[],
		key: Uint8Array
	) {
		if (key) this.emit(event, kyber.decryptMessage(data, key), socket, key);
	}
}
