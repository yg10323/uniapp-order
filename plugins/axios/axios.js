import Vue from "vue";
import axios from "axios";
import axiosAdapterUniapp from 'axios-adapter-uniapp'
import {
	axios_config
} from '../../config.json'

let loadingInstance;

const instance = axios.create({
	baseURL: `${axios_config.host}:${axios_config.port}`,
	timeout: 60 * 1000,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	},
	adapter: axiosAdapterUniapp
});

instance.interceptors.request.use(
	config => {
		const reqObj = config;
		// 发送请求时携带token
		if (uni.getStorageSync('token')) {
			reqObj.headers.Authorization = uni.getStorageSync('token')
		} else {
			uni.showToast({
				title:'请登录'
			})
		}
		return reqObj;
	},
	err => Promise.reject(err)
);

instance.interceptors.response.use(
	response => {
		const res = response.data;
		// 对响应数据做点什么
		if (res.code !== 200) {
			// 401 未认证
			if (res.code === 401) {
				localStorage.clear();
				// setTimeout(() => location.reload(), 1000)
			}
		}
		return res;
	},
	err => Promise.reject(err)
);

Vue.prototype.$axios = instance
export default instance;
