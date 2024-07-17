import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { defaultConfig, plugin as formKitPlugin } from '@formkit/vue'
import App from './App.vue'
import i18n from '@/i18n'
import globalPlugins from '@/plugins/globalPlugins'

import '@formkit/themes/genesis'
import '@/assets/css/index.scss'

import './modules/common/apiConfig'

import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
createApp(App)
  .use(createPinia())
  .use(i18n)
  .use(globalPlugins)
  .use(formKitPlugin, defaultConfig)
  .use(SplitterGroup)
  .use(SplitterPanel)
  .use(SplitterResizeHandle)
  .mount('#app')
