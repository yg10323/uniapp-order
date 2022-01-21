<template>
	<view class="login">
		<uni-forms ref="form" :modelValue="formData" :rules="rules">
			<uni-forms-item label="用户名" name="account" class="label">
				<input type="text" v-model="formData.account" placeholder="请输入用户名" class="input" />
			</uni-forms-item>
			<uni-forms-item label="密码" name="password" class="label">
				<input type="password" v-model="formData.password" placeholder="请输入密码" class="input" />
			</uni-forms-item>
		</uni-forms>
		<button class="btn" type="primary" @click="handleLogin">登录</button>
		<button class="btn" @click="handleRegister">注册</button>
	</view>
</template>

<script>
	// import ui from '../../../plugins/uni-ui/index.js'
	import config from '../config.js'
	import {
		mapMutations
	} from 'vuex';

	export default {
		components: {
			// uniForms: ui.uniForms,
			// uniFormsItem: ui.uniFormsItem,
			// uniEasyinput: ui.uniEasyinput,
		},
		data() {
			return {
				// 表单数据
				formData: {
					account: '',
					password: ''
				},
				rules: config.rules
			}
		},
		methods: {
			// 登录
			handleLogin() {
				this.$refs.form.validate().then(res => {
					this.$api.frontApis.login({
							data: {
								...this.formData,
								longKeep: true
							}
						})
						.then(res => {
							if (res.code === 200) {
								// console.log(res)
								uni.showToast({
									title: res.message,
									success() {
										setTimeout(() => {
											// 跳转到tabBar页面, 使用switchTab
											uni.switchTab({
												url: '/pages/profile/index',
											})
										}, 1000)
									}
								})
							} else {
								uni.showToast({
									title: res.message,
									icon:'error'
								})
							}
							this.login({...res.userInfo,token:res.token})
						})
				}).catch(err => {
					return err
				})
			},
			
			// 注册
			handleRegister() {
				this.$refs.form.validate().then(res => {
					this.$api.frontApis.register({data:this.formData})
					.then(res=>{
						if(res.code===200){
							uni.showToast({
								title: res.message + '赶紧登录吧',
							})
						}else {
							uni.showToast({
								title: res.message,
								icon:'error'
							})
						}
					})
					
				}).catch(err => {
					return err
				})
			},

			...mapMutations(['login'])
		}
	}
</script>

<style scoped lang="scss">
	.login {
		padding: 10px;
	}

	.btn {
		margin-bottom: 10px;
	}
</style>
