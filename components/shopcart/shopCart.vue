<template>
	<view class="shop-cart">
		<view class="left" @click="showFoodInfo">
			<view class="img">
				<image src="../../static/img/shopcart/default.png" v-if="totalPrice==0"></image>
				<image src="../../static/img/shopcart/active.png" v-if="totalPrice"></image>
			</view>
			<view class="text">
				合计: {{totalPrice.toFixed(2)}}元
			</view>
		</view>

		<view class="right" :class="totalPrice==0?'':'paymentActive'" @click="handlePayment">
			{{totalPrice==0 ? '添加食品' : '结算'}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			cartData: {
				type: Object,
				required: true,
				default: () => {},
			}
		},
		created() {},
		computed: {
			totalPrice() {
				let price = 0
				if (this.cartData.foodData) {
					for (let item of this.cartData.foodData) {
						// 总价格 = 打包费 + 单价 * 折扣 * 份数
						let discount = item.data.discount || 1
						price = price + item.data.extra + item.data.price * discount * item.count
					}
				}

				return price
			}
		},
		methods: {
			handlePayment() {
				// console.log(this.cartData)
				// 向父组件发射 结算 事件
				this.$emit('handlePayment')
			},
			showFoodInfo() {
				// 向父组件发射 展示 食品信息事件
				this.$emit('showFoodInfo')
			}
		}
	}
</script>

<style scoped lang="scss">
	.shop-cart {
		display: flex;
		justify-content: space-between;
		padding-left: 20px;
		height: 50px;
		line-height: 50px;
		background-color: #fff;
	}

	.left {
		display: flex;
		width: 70%;
		// background-color: yellow;

		.img {
			position: absolute;
			top: -20px;

			image {
				width: 40px;
				height: 70px;
			}
		}

		.text {
			margin-left: 60px;
		}
	}

	.right {
		flex: 1;
		text-align: center;
		background-color: gray;
	}

	.paymentActive {
		background-color: #ffbe11;
	}
</style>
