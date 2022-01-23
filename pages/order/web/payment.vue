<template>
	<view class="payment">
		<view class="payment-top">
			<view class="top-upper">
				<view v-if="postData.taotal_price - postData.pay_price">
					您是我们的优质客户, 已为您随机折扣
					<text style="color: red;">￥{{(postData.taotal_price - postData.pay_price).toFixed(2)}}</text>元
				</view>
				<text>原总金额￥{{postData.taotal_price}}元</text>
				<text>现总金额￥{{postData.pay_price}}元</text>
			</view>
		</view>
		<view class="payment-center">
			<text>倒计时结束后, 将自动完成购买, 请等待!</text>
			<uni-countdown :showDay="false" :minute="0" :second="10" :fontSize="50" @timeup="purchase"></uni-countdown>
		</view>
		<view class="payment-footer">
			底部
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'

	export default {
		onLoad: function(option) {
			this.postData = JSON.parse(decodeURIComponent(option.data));
		},
		data() {
			return {
				postData: ""
			}
		},
		methods: {
			purchase() {
				this.$api.frontApis.purchase({
						data: this.postData
					})
					.then(res => {
						uni.showToast({
							title: res.message
						})
					})
				// 提交数据后, 删除缓存的订单中的购物车数据
				const shop_ids = []
				for (let item of this.postData.food_info) {
					shop_ids.push(item.shop_id)
				}
				this.updateShopCart(shop_ids)
				// 1s后跳转到我的订单页面(tabbar页面)
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/order/index'
					})
				}, 1000)
			},

			...mapMutations(['updateShopCart'])
		}
	}
</script>

<style scoped lang="scss">
	.payment {
		padding: 20px;
	}

	.payment-top .top-upper {
		view {
			font-size: 18px;
		}

		text {
			margin-right: 10px;
			font-size: 20px;
		}
	}

	.payment-center {
		margin-top: 20px;
		padding: 10px;

		text {
			font-size: 22px;
		}

	}
</style>
