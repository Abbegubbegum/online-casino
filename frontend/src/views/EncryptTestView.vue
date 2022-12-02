<script setup lang="ts">
import { initRSA, initKyber } from "../main.js";
</script>

<template>
	<div>
		<button
			type="button"
			class="p-4 px-10 m-4 text-xl font-semibold border rounded-lg border-white"
			@click="initRSA"
		>
			RSA
		</button>
		<button
			type="button"
			class="p-4 px-10 m-4 text-xl font-semibold border rounded-lg border-white"
			@click="initKyber"
		>
			KYBER
		</button>
	</div>
</template>
