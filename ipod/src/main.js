import { createApp } from 'vue';
import { createVuetify } from "vuetify";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue';
import router from './router';
import './assets/main.css';
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);
const pinia = createPinia();
const vuetify = createVuetify({
    components,
    directives
});

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount('#app');

export default app;