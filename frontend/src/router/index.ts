import { createRouter, createWebHistory } from "vue-router";
import EncryptTestView from "../views/EncryptTestView.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: HomeView,
		},
		{
			path: "/test",
			component: EncryptTestView,
		},
	],
});

export default router;
