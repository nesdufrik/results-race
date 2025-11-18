import '@/styles/main.css'
import '@/styles/base.css'
import 'primeicons/primeicons.css'

import { createApp, markRaw } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'
import pinia from '@/stores'
import router from '@/router'

pinia.use(({ store }) => {
	store.router = markRaw(router)
})

const app = createApp(App)
app.use(ToastService)
app.use(DialogService)
app.use(ConfirmationService)
app.use(pinia)
app.use(router)
app.use(PrimeVue, {
	theme: {
		preset: Aura,
	},
})
app.mount('#app')
