import EventEmitter from "events";
import { decryptAESMessage } from "./kyber";

export default class Decrypter extends EventEmitter {
	constructor() {
		super();
	}

	async processMessage(event: string, data: ArrayBuffer[]) {
		this.emit(event, await decryptAESMessage(data));
	}
}
