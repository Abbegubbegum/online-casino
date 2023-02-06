<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import router from "../router";
import { initKyber, sendBet } from "../main";

initKyber();

const store = useStore();

if (!store.state.username) {
	router.push("/login");
}

const betInput = ref(0);

function placeBet(ev: any) {
	const option = ev.submitter.value;

	if (betInput.value <= 0 || betInput.value > store.state.balance) {
		return;
	}

	sendBet(betInput.value, option);

	store.state.balance -= betInput.value;

	if (option === "T") {
		store.state.tBet += betInput.value;
	} else if (option === "CT") {
		store.state.ctBet += betInput.value;
	}
}
</script>

<template>
	<div class="h-full grid grid-rows-[auto_1fr]">
		<header
			class="flex justify-center items-center p-6 border-b border-gray-600"
		>
			<h2 class="text-2xl absolute left-6">
				Username: {{ store.state.username }}
			</h2>
			<h1 class="text-5xl font-bold">Crypto Casino</h1>
			<h2 class="text-2xl absolute right-6">
				Balance: {{ store.state.balance }}
			</h2>
		</header>
		<main class="grid grid-flow-col grid-rows-[auto_1fr] grid-cols-2">
			<form
				class="col-span-2 flex flex-col justify-around items-center p-6"
				id="bettingForm"
				@submit.prevent="placeBet"
				onkeydown="return event.key != 'Enter'"
			>
				<input
					type="number"
					class="p-3 text-black text-xl font-bold w-1/4"
					v-model="betInput"
					min="1"
					:max="store.state.balance"
					required
				/>

				<div class="m-6 text-3xl font-bold text-center">
					<p :class="{ 'opacity-0': !store.state.isRolling }">
						Rolling...
					</p>

					<p>Previous Results:</p>
					<p>
						{{ store.state.previousResults.join("  ") }}
					</p>
				</div>
			</form>
			<div class="flex flex-col justify-around items-center">
				<p class="text-5xl font-bold">
					{{ store.state.ctBet }}
				</p>
				<input
					type="submit"
					class="py-6 px-10 border border-gray-300 bg-blue-500 cursor-pointer"
					form="bettingForm"
					value="CT"
					:disabled="store.state.isRolling"
				/>
			</div>
			<div class="flex flex-col justify-around items-center">
				<p class="text-5xl font-bold">
					{{ store.state.tBet }}
				</p>
				<input
					type="submit"
					class="py-6 px-10 border border-gray-300 bg-red-600 cursor-pointer"
					form="bettingForm"
					value="T"
					:disabled="store.state.isRolling"
				/>
			</div>
		</main>
	</div>
</template>

<style></style>
