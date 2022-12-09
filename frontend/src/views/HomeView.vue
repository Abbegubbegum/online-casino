<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import { sendBet } from "../main";

const store = useStore();
store.state.balance = 10000;

const betAmount = ref(0);

function placeBet(ev: any) {
	const option = ev.submitter.value;

	if (betAmount.value <= 0 || betAmount.value > store.state.balance) {
		return;
	}

	sendBet(betAmount.value, option);
}
</script>

<template>
	<div class="h-full grid grid-rows-[auto_1fr]">
		<header class="flex justify-between p-6 border-b border-gray-600">
			<h2 class="text-2xl">Username: {{ store.state.username }}</h2>
			<h1 class="text-5xl font-bold">Casino Royale</h1>
			<h2 class="text-2xl">Balance: {{ store.state.balance }}</h2>
		</header>
		<main class="grid grid-flow-col grid-rows-[auto_1fr] grid-cols-2">
			<form
				class="col-span-2 flex justify-center items-center p-6"
				id="bettingForm"
				@submit.prevent="placeBet"
				onkeydown="return event.key != 'Enter'"
			>
				<input
					type="number"
					class="p-3 text-black text-xl font-bold w-1/4"
					v-model="betAmount"
					min="1"
					:max="store.state.balance"
					required
				/>
			</form>
			<div class="flex flex-col justify-around items-center">
				<input
					type="submit"
					class="py-6 px-10 border border-gray-300 bg-blue-500"
					form="bettingForm"
					value="CT"
				/>
			</div>
			<div class="flex flex-col justify-around items-center">
				<input
					type="submit"
					class="py-6 px-10 border border-gray-300 bg-red-600"
					form="bettingForm"
					value="T"
				/>
			</div>
		</main>
	</div>
</template>

<style></style>
