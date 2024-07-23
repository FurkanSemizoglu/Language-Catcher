
import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
/* import '@unocss/reset/normalize.css' */
import '../src/assets/global.css'
import 'animate.css';
const app = createApp(App)


app.use(router)
app.use(Toast);
app.mount('#app')