<template>
	<view class="index">
		<navbar>
			<template #right>
				<uni-icons type="scan" size="24" @click="scanCode"></uni-icons>
			</template>
		</navbar>

		<view class="content">
			<shop-classify :classifyList="classifyList"></shop-classify>
			<shop-list :shopList="shopList"></shop-list>
		</view>
	</view>
</template>

<script>
	import navbar from '../../components/navbar/navbar.vue'
	import shopClassify from './web/shopClassify.vue'
	import shopList from './web/shopList.vue'

	export default {
		components: {
			navbar,
			shopClassify,
			shopList
		},
		data() {
			return {
				classifyList: [],
				shopList: [],
				// 扫码的数据
				qrInfo: {},
			};
		},
		created() {
			this.getShopClassify();
			this.getShopAll();
		},
		methods: {
			// 店铺一级分类
			getShopClassify() {
				this.$api.frontApis.getShopClassify().then((res) => {
					if (res.code == 200) {
						this.classifyList = res.data;
					} else {
						console.log("error_getShopClassify");
					}
				});
			},
			// 获取全部店铺
			getShopAll() {
				this.$api.frontApis.getShopAll().then((res) => {
					if (res.code == 200) {
						this.shopList = res.data;
					} else {
						console.log("error_getShopAll");
					}
				});
			},
			/**
			 * 以下均为扫码登陆的方法
			 */
			// 扫码并弹窗询问是否登录
			scanCode() {
				uni.scanCode({
					success: scanRes => {
						// 扫码后会得到web端的socket_id和二维码对应的qid
						// socket_id用于扫码并点击确定后发送给服务器查询该二维码是否过期
						this.sendDeviceId(this.getDeviceId())
						// type: string
						this.qrInfo = scanRes.result;
						uni.showModal({
							title: '是否确认登?',
							content: '如非是您本人操作, 请取消本次请求',
							showCancel: true,
							// 判断点击确定还是取消
							success: btnRes => {
								// 确定
								if (btnRes.confirm) {
									this.makeLogin()
								} else if (btnRes.cancel) {
									return
								}
							}
						})
					}
				})
			},
			// 获取设备id
			getDeviceId() {
				let deviceId;
				uni.getSystemInfo({
					success: res => deviceId = res.deviceId
				})

				return deviceId
			},
			// 将deviceId发送给服务器
			sendDeviceId(deviceId) {
				this.$api.frontApis.sendDeviceId({
					data: {
						deviceId: deviceId
					}
				})
			},
			// 点击确认 => 发送网络请求
			makeLogin() {
				this.$api.frontApis.scanLogin({
					data: {
						qrinfo: JSON.parse(this.qrInfo),
						token: uni.getStorageSync('token'),
						deviceId: this.getDeviceId()
					}
				})
			}
		},
	}
</script>

<style>

</style>
