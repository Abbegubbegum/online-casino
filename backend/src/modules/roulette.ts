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

	static results = ["CT", "T"];

	constructor() {
		super();
	}

	roll() {
		this.bettingIsOn = false;
		this.isRolling = true;
		this.emit("START_ROLL");

		setTimeout(this.payout, 10000);
	}

	async payout() {
		const result =
			RouletteGame.results[Math.random() * RouletteGame.results.length];

		for (let i = 0; i < this.bets.length; i++) {
			const bet = this.bets[i];

			this.bets.splice(i, 1);

			if (bet.option === result) {
				let account = await user.findOne({
					username: bet.username,
				});

				if (!account) {
					continue;
				}

				account.balance += bet.amount * 2;

				account.save();

				bet.socket.emit("BALANCE", account.balance);
			}
		}
		this.emit("PAYOUT_COMPLETE");
		this.startBetting();
	}

	startBetting() {
		this.bettingIsOn = true;
		this.isRolling = false;
		this.emit("START_BETTING");

		setTimeout(() => {
			this.roll();
		}, 20000);
	}

	async placeBet(
		socket: Socket,
		username: string,
		amount: number,
		option: string
	): Promise<boolean> {
		if (!this.bettingIsOn) return false;

		console.log("BET", username, amount, option);

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
