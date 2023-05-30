import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
// 替代传统的在main.ts中直接导入的形式
import pinia from "./stores/store"

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
