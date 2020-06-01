import Vue from 'vue';
import App from './App.vue';
import VeeValidate from "vee-validate";
import VueResource from 'vue-resource';
import pt_BR from './pt_BR';
import VueRouter from 'vue-router';
import { routes } from './routes';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import VueTheMask from 'vue-the-mask'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueTheMask)

Vue.use(VueResource);
Vue.http.options.root = 'http://localhost:1234';

Vue.use(VueRouter);

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.use(VeeValidate, {
  locale: 'pt_BR',
  dictionary: { pt_BR: { messages: pt_BR } },
  inject: true,
  fieldsBagName: "veeFields",
  errorBagName: "veeErrors"
});

const router = new VueRouter({ 
  routes, 
  mode: 'history'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
