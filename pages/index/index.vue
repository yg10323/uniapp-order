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

		<view class="shop-cart" @click="toCreateOrder">
			<uni-icons class="cart" :class="JSON.stringify(cartEmpty)==='{}' ? '' : 'cart-active'" type="cart">
			</uni-icons>
		</view>
	</view>
</template>

<script>
	import navbar from '../../components/navbar/navbar.vue'
	import shopClassify from './web/shopClassify.vue'
	import shopList from './web/shopList.vue'

	import {
		mapState
	} from 'vuex'

	export default {
		components: {
			navbar,
			shopClassify,
			shopList
		},
		onShow() {
			this.cartEmpty = this.isCartEmpty()
		},
		computed: {
			...mapState(['shopCart']),
		},
		data() {
			return {
				classifyList: [],
				shopList: [],
				cartEmpty: '',
				// 扫码的数据
				qrInfo: {},
			};
		},
		created() {
			this.getShopClassify();
			this.getShopAll();
		},
		methods: {
			// 判断购物车是否为空
			isCartEmpty(){
				return this.$utils.removeEmpty(this.shopCart)
			},
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
			// 购物车结算
			toCreateOrder(){
				const shop_ids = Object.keys(this.$utils.removeEmpty(this.shopCart))				
				// 购物车有数据才结算
				if (shop_ids.length) {
					uni.navigateTo({
						url: `/pages/order/web/cartOrder?shop_ids=${encodeURIComponent(JSON.stringify(shop_ids))}`
					})
				}
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
	.shop-cart {
		position: fixed;
		right: 20px;
		bottom: 70px;
		z-index: 999;
	}

	.cart {
		font-size: 50px !important;
		color: #ccc !important;
	}

	.cart-active {
		color: #ffbe11 !important;
	}
</style>
