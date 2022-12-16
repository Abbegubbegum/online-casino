<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
import router from "../router";
const store = useStore();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

async function submitForm() {
	if (password.value !== confirmPassword.value) {
		return;
	}

	const res = await fetch("http://localhost:5050/users", {
		method: "POST",
		body: JSON.stringify({
			username,
			email,
			password,
		}),
	});

	if (res.ok) {
		store.state.username = username.value;
		router.push("/");
	} else {
	}
}
</script>

<template>
	<div class="w-full h-full flex flex-col justify-center items-center">
		<div class="bg-gray-500 p-10">
			<form
				class="flex flex-col gap-6 text-black"
				@submit.prevent="submitForm"
			>
				<input
					type="text"
					name="username"
					placeholder="Username"
					class="font-semibold p-1 py-2"
					v-model="username"
					required
				/>
				<input
					type="email"
					placeholder="Email"
					class="font-semibold p-1 py-2"
					v-model="email"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					class="p-1 py-2 font-semibold"
					minlength="5"
					v-model="password"
					required
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					class="p-1 py-2 font-semibold"
					v-model="confirmPassword"
					required
				/>
				<button
					type="submit"
					class="border bg-gray-100 text-xl font-bold"
				>
					REGISTER
				</button>
			</form>
		</div>
		<router-link
			to="login"
			class="fixed top-10 left-10 text-6xl font-bold text-white"
			>&larr;</router-link
		>
	</div>
</template>

<style scoped></style>
