import { createRouter, createWebHistory } from "vue-router";
import EncryptTestView from "../views/EncryptTestView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import { useStore } from "vuex";
const store = useStore();

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: HomeView,
		},
		{
			path: "/login",
			component: LoginView,
		},
		{
			path: "/register",
			component: RegisterView,
		},
		{
			path: "/test",
			component: EncryptTestView,
		},
	],
});

export default router;
