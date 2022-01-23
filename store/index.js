import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isLogin: false,
		userInfo: {},
		shopCart: {}
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
		updateInfo(state, payload) {
			state.userInfo = payload
			uni.setStorage({
				key: 'userInfo',
				data: payload
			})
		},
		// 添加购物车信息
		setShopCart(state, payload) {
			const shop_id = payload.data.shop_id
			state.shopCart[shop_id] = [...state.shopCart[shop_id] || '', payload]
			uni.setStorage({
				key: 'shopCart',
				data: state.shopCart
			})
		},
		// 订单完成后, 删除订单相关的缓存数据
		updateShopCart(state, payload) {
			// payload: 支付完成的店铺列表
			const shop_ids = Object.keys(state.shopCart)
			for (let shop_id of payload) {
				delete state.shopCart[shop_id]
			}
			uni.setStorage({
				key: 'shopCart',
				data: state.shopCart
			})
		},
		// 购物车中食品数量变化
		changeCount(state, payload) {
			const data = state.shopCart[payload.shop_id]
			for (let i in data) {
				if (payload.name === data[i].name) {
					if (payload.method === 'increase') {
						data[i].count += 1
					}
					if (payload.method === 'decrease') {
						if (data[i].count === 1) {
							data.splice(i, 1)
						} else {
							data[i].count -= 1
						}
					}
				}
			}
			uni.setStorage({
				key: 'shopCart',
				data: state.shopCart
			})
		},
		// 网页版刷新页面后重新读取缓存
		loadStorage(state) {
			const storage = uni.getStorageSync('userInfo') || null
			const shopCart = uni.getStorageSync('shopCart') || null
			if (storage) {
				state.isLogin = true;
				state.userInfo = storage
				uni.setStorage({
					key: 'userInfo',
					data: storage
				})
			}

			if (shopCart) {
				state.shopCart = shopCart
				uni.setStorage({
					key: 'shopCart',
					data: shopCart
				})
			}
		}
	},
	actions: {},
	modules: {}
})

export default store

export function initStore() {
	store.commit('loadStorage')
}
