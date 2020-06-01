import Login from "./components/login/Login.vue";
import RegisterCompany from "./components/registerCompany/RegisterCompany.vue";
import Home from "./components/home/Home.vue";

export const routes = [
    { path: '/', name: 'login', component: Login, title: 'login' },
    { path: '/register', name: 'registerCompany', component: RegisterCompany, title: 'registerCompany' },
    { path: '/home', name: 'home', component: Home, title: 'home' },
    { path: '*', component: Home }
];