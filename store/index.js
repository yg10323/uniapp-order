import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
		isLogin: false,
		userInfo: {},
  },
  mutations: {
		// 用户登录成功后
		login(state, payload) {
			state.isLogin = true;
			state.userInfo = payload
			uni.setStorage({
				key: 'userInfo',
				data: payload
			})
			uni.setStorage({
				key: 'token',
				data: payload.token
			})
		},
		// 用户登出后
		logout(state) {
			state.isLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
			uni.removeStorage({
				key: 'token'
			})
		},
		// 用户更新信息后
		updateInfo(state,payload){
			state.userInfo = payload
			uni.setStorage({
				key: 'userInfo',
				data: payload
			})
		},
		// 网页版刷新页面后重新读取缓存
		loadStorage(state){
			const storage =	uni.getStorageSync('userInfo') || null
			if(storage){
				state.isLogin = true;
				state.userInfo = storage
				uni.setStorage({
					key: 'userInfo',
					data: storage
				})
			}
		}
  },
  actions: {
  },
  modules: {
  }
})

export default store

export function initStore() {
  store.commit('loadStorage')
}
