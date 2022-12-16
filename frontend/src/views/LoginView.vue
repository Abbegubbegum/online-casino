<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
	<div class="w-full h-full flex flex-col justify-center items-center">
		<div class="bg-gray-500 p-6">
			<form class="flex flex-col gap-6 text-black">
				<input
					type="text"
					name="username"
					placeholder="Username"
					class="font-semibold p-1 py-2"
				/>
				<input
					type="password"
					placeholder="Password"
					class="p-1 py-2 font-semibold"
				/>
				<button
					type="submit"
					class="border bg-gray-100 text-xl font-bold"
				>
					LOGIN
				</button>
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

<style scoped></style>
