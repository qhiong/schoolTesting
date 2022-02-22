import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/assets/css/global.css'
import '@/assets/icon/iconfont.css'
const app = createApp(App)
app.use(Element, { locale })
app
  .use(store)
  .use(router)
  .mount('#app')
