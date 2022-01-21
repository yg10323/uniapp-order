import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from './store'
import { initStore } from './store'
import api from './plugins/axios'
import utils from './utils'

Vue.config.productionTip = false

initStore();//h5页面刷新后初始化vux中的数据
Vue.prototype.$api = api;
Vue.prototype.$utils = utils;

App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
