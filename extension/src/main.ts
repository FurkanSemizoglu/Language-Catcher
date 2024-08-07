import 'virtual:uno.css'
import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})
import App from './Popup.vue'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Global Error Handler:', err, info)
}
app.use(vuetify)
app.mount('#app')
