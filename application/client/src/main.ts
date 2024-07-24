
import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
/* import '@unocss/reset/normalize.css' */
import '../src/assets/global.css'
import PrimeVue from "primevue/config";
import 'animate.css';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
const app = createApp(App)
app.use(PrimeVue, {
    unstyled: true
});

app.component('Button', Button);
app.component('InputText', InputText);

app.use(router)
app.use(Toast);
app.mount('#app')