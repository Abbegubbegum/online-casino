import { EventEmitter } from "events";
import user from "../models/user.js";
import type { Socket } from "socket.io";

export type Bet = {
	socket: Socket;
	username: string;
	amount: number;
	option: string;
};

export class RouletteGame extends EventEmitter {
	isRolling = false;
	bettingIsOn = true;

	bets: Bet[] = [];
	lastResult = "";

	constructor() {
		super();
	}

	roll() {
		this.bettingIsOn = false;
		this.isRolling = true;
		this.emit("START_ROLL");

		setTimeout(this.payout, 10000);

        
	}

	payout() {}

	startBetting() {
		this.bettingIsOn = true;
		this.isRolling = false;
		this.emit("START_BETTING");
	}

	async placeBet(
		socket: Socket,
		username: string,
		amount: number,
		option: string
	): Promise<boolean> {
		if (!this.bettingIsOn) return false;

		let result = await user.findOne({
			username: username,
			balance: { $gte: amount },
		});

		if (!result) {
			return false;
		}

		result.balance -= amount;

		result.save();

		let existingBet = this.bets.find(
			(bet) => bet.username === username && bet.option === option
		);

		if (existingBet) {
			existingBet.socket = socket;
			existingBet.amount += amount;
		} else {
			this.bets.push({
				socket,
				username,
				amount,
				option,
			});
		}

		return true;
	}
}
