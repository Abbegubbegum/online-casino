import EventEmitter from "events";
import { Socket } from "socket.io-client";
import { decryptAESMessage, encryptAESMessage } from "./kyber";

export default class DecryptedSocket extends EventEmitter {
	socket: Socket;
	constructor(socket: Socket) {
		super();
		this.socket = socket;
	}

	async sendMessage(event: string, data: any) {
		this.socket.emit(event, await encryptAESMessage(JSON.stringify(data)));
	}

	async processMessage(event: string, data: ArrayBuffer[]) {
		if (!event || !data || typeof data === "string") return;

		this.emit(event, await decryptAESMessage(data));
	}
}
