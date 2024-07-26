import { createApp } from 'vue';
import App from './App.vue';
import 'uno.css';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import '../src/assets/global.css';

import 'animate.css';
import 'vue3-circle-progress/dist/circle-progress.css';
// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives
});


const app = createApp(App);

app.use(vuetify);



app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Global Error Handler:', err, info);
};

app.use(router);
app.use(Toast);
app.mount('#app');
