<script setup lang="ts">
import { ref, watch } from "vue";
import { useStore } from "vuex";
import router from "../router";
import { initKyber, sendBet } from "../main";

initKyber();

const store = useStore();

watch(
	() => store.state.isRolling,
	(newVal: boolean, oldVal: boolean) => {
		if (!newVal && oldVal) {
			newestResult.value =
				store.state.previousResults[
					store.state.previousResults.length - 1
				];

			setTimeout(() => {
				newestResult.value = "";
			}, 2000);
		}
	}
);

const newestResult = ref("");

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
					<p v-if="store.state.isRolling">Rolling...</p>
					<p v-else-if="newestResult">
						Rolled:
						<span
							:class="{
								'text-red-600': newestResult === 'T',
								'text-blue-500': newestResult === 'CT',
							}"
							>{{ newestResult }}</span
						>
					</p>
					<p v-else class="opacity-0">THING</p>

					<p>Previous Results:</p>
					<div class="flex justify-center gap-3">
						<span
							v-for="result in store.state.previousResults"
							:class="{
								'text-red-600': result === 'T',
								'text-blue-500': result === 'CT',
							}"
						>
							{{ result }}
						</span>
					</div>
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
