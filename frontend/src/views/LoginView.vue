<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import router from "../router";
import { useStore } from "vuex";

const store = useStore();

const username = ref("");
const password = ref("");

const error = ref("");

async function login() {
	const params = new URLSearchParams();

	params.set("username", username.value);
	params.set("password", password.value);

	const res = await fetch("http://localhost:5050/api/users?" + params);

	if (res.ok) {
		const data = await res.json();

		store.state.username = username.value;
		store.state.balance = data.balance;
		router.push("/");
	} else {
		if (res.status === 404) {
			error.value = "User not found";

			setTimeout(() => {
				error.value = "";
			}, 1000)
		}
	}
}
</script>

<template>
	<div class="w-full h-full flex flex-col justify-center items-center">
		<div class="bg-gray-500 p-6">
			<form
				class="flex flex-col gap-6 text-black"
				@submit.prevent="login"
			>
				<input
					type="text"
					name="username"
					placeholder="Username"
					class="font-semibold p-1 py-2"
					:class="{error: error !== ''}"
					v-model="username"
				/>
				<input
					type="password"
					placeholder="Password"
					class="p-1 py-2 font-semibold"
					:class="{error: error !== ''}"
					v-model="password"
				/>
				<button
					type="submit"
					class="border bg-gray-100 text-xl font-bold"
				>
					LOGIN
				</button>
				<p v-if="error !== ''" class="text-red-500 font-bold text-xl">{{ error }}</p>
			</form>
		</div>
		<p class="text-lg">
			No account? Click
			<router-link to="register" class="inline text-blue-400 underline"
				>here</router-link
			>
		</p>
	</div>
</template>

<style scoped>
input {
	width: 30ch;
}

.error {
	outline: red solid 2px;
	background-color: rgb(255, 139, 139) !important;
}
</style>
