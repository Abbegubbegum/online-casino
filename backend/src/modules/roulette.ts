import { EventEmitter } from "events";
import user from "../models/user.js";
import type { Socket } from "socket.io";
import kyber from "./kyber.js";

export type Bet = {
	socket: Socket;
	key: Uint8Array;
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
		this.startBetting();
	}

	roll() {
		console.log("ROULETTE ROLL");
		this.bettingIsOn = false;
		this.isRolling = true;
		this.emit("START_ROLL");

		setTimeout(() => {
			this.payout();
		}, 2000);
	}

	async payout() {
		const result =
			RouletteGame.results[
				Math.floor(Math.random() * RouletteGame.results.length)
			];

		this.emit("RESULT", result);
		console.log("ROULETTE RESULT: " + result);

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

				bet.socket.emit(
					"BALANCE",
					kyber.encryptMessage(account.balance.toString(), bet.key)
				);
				console.log(
					"USER " + bet.username + " BALANCE: " + account.balance
				);
			}
		}
		this.emit("PAYOUT_COMPLETE");
		this.startBetting();
	}

	startBetting() {
		this.bettingIsOn = true;
		this.isRolling = false;
		this.emit("START_BETTING");
		console.log("ROULETTE BETTING");

		setTimeout(() => {
			this.roll();
		}, 10000);
	}

	async placeBet(
		socket: Socket,
		key: Uint8Array,
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
			existingBet.key = key;
			existingBet.amount += amount;
		} else {
			this.bets.push({
				socket,
				key,
				username,
				amount,
				option,
			});
		}

		return true;
	}
}
