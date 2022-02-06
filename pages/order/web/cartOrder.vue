<template>
	<view class="create-order">
		<view class="address-info">
			<view class="has-address" v-if="userInfo.address" @click="toEditAddress">
				<view class="address">
					{{ userInfo.address }}
				</view>
				<view class="name">
					<text>{{ userInfo.name }}</text>
					<text>{{ userInfo.phone }}</text>
				</view>
			</view>
			<view class="no-address" v-if="!userInfo.address" @click="toEditAddress">
				<text>添加收货地址</text>
				<text>></text>
			</view>

			<view class="arrive-time">
				<text class="left-text">送达时间</text>
				<text class="right-time">{{ getTimeRange() }}送达</text>
			</view>
		</view>


		<view class="food-info">
			<view>
				<checkbox-group @change="change">
					<view v-for="(shop,index) in shops" :key="index">
						<checkbox :value="shop_ids[shop.id]" checked="true" class="check-box"
							v-if="shopCart[shop.id].length" />
						<view class="shop-order">
							<!-- 店铺信息 -->
							<view class="shop-name" v-if="shopCart[shop.id].length">
								<text>{{ shop.name }}</text>
								<text>{{ shop.delivery }}</text>
							</view>
							<!-- 食品信息 -->
							<view class="food-item-list">
								<view class="food-item" v-for="(item, index) in shopCart[shop.id]" :key="index">
									<view class="item-left">
										<image :src="item.data.avatar_url" mode=""></image>
									</view>
									<view class="item-right">
										<view class="item-right-upper">
											<text>{{ item.data.name }}</text>
											<text>打包费: ￥{{ item.data.extra }}</text>
											<text>￥{{ item.data.price }}</text>
										</view>
										<view class="item-right-lower">
											<text class="reduce" @click="countDecrease(item,shop.id)">-</text>
											<text class="count">{{item.count}}</text>
											<text class="add" @click="countIncrease(item,shop.id)">+</text>
										</view>
									</view>
								</view>
							</view>
							<!-- 店铺费用显示 -->
							<view class="food-total-price" v-if="shopCart[shop.id].length">
								<view class="food-total-price-upper">
									<text>总打包费</text>
									<text>￥{{ shopTotalExtra(shop.id) }}</text>
								</view>
								<view class="food-total-price-lower">
									<text v-if="shopOriginalPrice(shop.id) - shopTotalPrice(shop.id)">
										已优惠
										<text
											style="color: red">￥{{ (shopOriginalPrice(shop.id) - shopTotalPrice(shop.id)).toFixed(2) }}</text>
									</text>
									<text style="margin-left: 10px">小计 ￥{{ shopTotalPrice(shop.id).toFixed(2) }}</text>
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
		</view>

		<!-- 付款 -->
		<view class="footer-wrap">
			<view class="create-order-footer">
				<view class="create-order-footer-left">
					<view class="footer-left-total">
						<text>￥</text>
						<text>{{ totalPrice.toFixed(2) }}</text>
					</view>
					<view class="footer-left-discount">
						已优惠￥{{ (originalPrice - totalPrice).toFixed(2) }}
					</view>
				</view>
				<view class="create-order-footer-right" :class="checkedShop.length==0? 'no-checked':''"
					@click="toPayment"> 付款 </view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";

	export default {
		onLoad: function(option) {
			const shop_ids = JSON.parse(decodeURIComponent(option.shop_ids));
			for (let id of shop_ids) {
				this.shop_ids[id] = id
			}
		},
		created() {
			this.getShopInfo()
			this.checkedShop = Object.keys(this.shop_ids)
		},
		computed: {
			...mapState(["shopCart", "userInfo"]),
			// 设置订单数据
			setOrderData() {
				this.orderData = []
				for (let id of this.checkedShop) {
					this.orderData.push(...this.shopCart[id])
				}
				this.copyOrderData = this.$utils.deepClone(this.orderData)
			},
			totalExtra() {
				this.setOrderData
				let total = 0;
				for (let item of this.copyOrderData) {
					total = total + item.data.extra;
				}
				return total;
			},
			// 订单原总价
			originalPrice() {
				this.setOrderData
				let price = 0;
				for (let item of this.copyOrderData) {
					// 原价格 = 打包费 + 单价 * 份数
					price = price + item.data.extra + item.data.price * item.count;
				}

				return price;
			},
			// 订单打折后的总价格
			totalPrice() {
				this.setOrderData
				let price = 0;
				for (let item of this.copyOrderData) {
					// 总价格 = 打包费 + 单价 * 折扣 * 份数
					let discount = item.data.discount || 1;
					price =
						price + item.data.extra + item.data.price * discount * item.count;
				}

				return price;
			},
		},
		data() {
			return {
				shop_ids: {}, //key和value都是shop_id
				shops: [], //店铺信息
				checkedShop: [], //选中的店铺id,重要(最后网络请求也要用)
				orderData: [], //订单数据,用于渲染到页面
				copyOrderData: [], //copy, 用于订单的勾选取消,总价格计算
			}
		},
		methods: {
			transObj(service) {
				return {
					service: eval(service),
				};
			},
			// 生成配送时间范围
			getTimeRange() {
				// 生成15-50之间的配送时间
				let randomMinutes = parseInt(Math.random() * (50 - 15 + 1) + 15, 10);
				let nowTimeStamp = new Date().getTime();
				let futureTimeStamp = nowTimeStamp + randomMinutes * 60 * 1000;

				let nowTime = this.$utils.formatHour(nowTimeStamp);
				let futureTime = this.$utils.formatHour(futureTimeStamp);
				return `${nowTime}~${futureTime}`;
			},
			// 没有地址信息, 跳转编辑地址页面
			toEditAddress() {
				uni.navigateTo({
					url: "/pages/profile/web/editAddress",
				});
			},
			// 获取店铺信息
			getShopInfo() {
				for (let shop_id of Object.keys(this.shop_ids)) {
					this.$api.frontApis.getShopById({
							data: {
								shop_id
							}
						})
						.then(res => {
							if (res.code === 200) this.shops.push(res.data)
						})
				}
			},
			// 店铺总打包费
			shopTotalExtra(shop_id) {
				this.setOrderData
				let total = 0;
				for (let item of this.shopCart[shop_id]) {
					total = total + item.data.extra;
				}
				return total;
			},
			// 所属店铺订单原总价
			shopOriginalPrice(shop_id) {
				this.setOrderData
				let price = 0;
				for (let item of this.shopCart[shop_id]) {
					// 原价格 = 打包费 + 单价 * 份数
					price = price + item.data.extra + item.data.price * item.count;
				}

				return price;
			},
			// 计算店铺的总价格
			shopTotalPrice(shop_id) {
				this.setOrderData
				let price = 0;
				for (let item of this.shopCart[shop_id]) {
					// 总价格 = 打包费 + 单价 * 折扣 * 份数
					let discount = item.data.discount || 1;
					price =
						price + item.data.extra + item.data.price * discount * item.count;
				}

				return price;
			},
			// 食品加数量
			countDecrease(item, shop_id) {
				this.changeCount({
					shop_id: shop_id,
					name: item.name,
					method: "decrease"
				})
			},
			// 食品减数量
			countIncrease(item, shop_id) {
				this.changeCount({
					shop_id: shop_id,
					name: item.name,
					method: "increase"
				})
			},
			// checkbox勾选状态改变
			change(e) {
				this.checkedShop = e.detail.value
				// console.log(this.checkedShop)
			},
			// 处理数据, 跳转支付页面
			toPayment() {
				// 付款却没有收货地址时
				if (!this.userInfo.address) {
					uni.navigateTo({
						url: "/pages/profile/web/editAddress",
					});
				} else if (this.checkedShop.length === 0) {
					return;
				} else {
					const food_info_array = []
					for (let shop_id of this.checkedShop) {
						const o = {},
							food_ids = []
						o.shop_id = Number(shop_id)
						for (let item of this.shopCart[shop_id]) {
							food_ids.push(item.data.id)
						}
						o.food_ids = food_ids
						food_info_array.push(o)
					}
					// 订单金额大于20时随机减0-5
					let pay_price;
					if (this.totalPrice.toFixed(2) > 20) {
						pay_price = this.totalPrice - Math.random() * 10
					} else {
						pay_price = this.totalPrice
					}
					// 要发送给后台的数据, 格式请遵守接口书写规则
					const postData = {
						food_info: food_info_array,
						taotal_price: this.totalPrice.toFixed(2),
						pay_price: pay_price.toFixed(2),
					}
					uni.navigateTo({
						url: `/pages/order/web/payment?data=${encodeURIComponent(JSON.stringify(postData))}`
					})
				}
			},

			...mapMutations(['changeCount'])
		}
	}
</script>

<style scoped lang="scss">
	.create-order {
		height: 100vh;
		padding: 10px;
		background-color: #e5e5e5;
	}

	// address-info
	.address-info {
		padding: 10px;
		margin-bottom: 10px;
		border-radius: 10px;
		background-color: #fff;
	}

	.has-address .address {
		font-size: 20px;
		font-weight: 700;
	}

	.has-address .name {
		padding: 5px 0;
		color: #8f939c;

		text {
			margin-right: 10px;
		}
	}

	.address-info .arrive-time {
		margin-top: 15px;
		display: flex;
		justify-content: space-between;
	}

	.arrive-time .left-text {
		font-weight: 700;
	}

	.arrive-time .right-time {
		color: #ffbe11;
	}

	.no-address {
		display: flex;
		justify-content: space-between;
		font-size: 24px;
		color: #ffbe11;
	}

	.no-address text:last-child {
		font-size: 18px;
		color: #000;
	}

	// food-info
	.food-info {
		padding: 10px;
		margin-bottom: 70px;
		border-radius: 10px;
		background-color: #fff;
	}

	.check-box {
		// float: left;
	}

	.shop-name {
		display: flex;
		justify-content: space-between;
		padding-bottom: 10px;
		border-bottom: 1px solid #f2ecec;
	}

	.shop-name text:last-child {
		padding: 3px;
		font-size: 12px;
		border: 1px solid #ccc;
	}

	.food-item-list {
		width: 100%;
	}

	.food-item {
		display: flex;
		padding: 10px;
		// background-color: red;
	}

	.item-left {
		margin-right: 10px;
	}

	.item-left image {
		width: 50px;
		height: 50px;
		border-radius: 7px;
	}

	.item-right {
		flex: 1;
		position: relative;
		// background-color: yellow;

		&-upper {
			display: flex;
			justify-content: space-between;
		}

		// 溢出文字省略号显示
		&-upper text:first-child {
			width: 100px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		&-lower {
			position: absolute;
			bottom: 0;
			right: 0;
			font-size: 14px;
			color: #ccc;

			text {
				display: inline-block;
				margin-left: 5px;
				width: 20px;
				height: 20px;
				line-height: 20px;
				text-align: center;
				font-size: 22px;
				border-radius: 5px;
				color: #000;
				// background-color: red;
			}

			.reduce {
				border: 1px solid #f3a73f;
			}

			.count {
				font-size: 18px;
			}

			.add {
				background-color: #f3a73f;
			}
		}
	}

	.food-total-price {
		padding: 10px;

		&-upper {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
		}

		&-lower {
			display: flex;
			justify-content: right;
		}
	}

	// footer-wrap
	.footer-wrap {
		position: fixed;
		bottom: 0;
		left: 10px;
		right: 10px;
	}

	.create-order-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		border-radius: 25px;
		background-color: #000;
	}

	.create-order-footer-left {
		padding: 0 10px;
	}

	.footer-left-total {
		padding-left: 10px;
		font-size: 18px;
		color: #fff;

		text:first-child {
			font-size: 12px;
		}
	}

	.footer-left-discount {
		padding-left: 10px;
		font-size: 12px;
		color: #ccc;
	}

	.create-order-footer-right {
		display: inline-block;
		width: 80px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		border-top-right-radius: 25px;
		border-bottom-right-radius: 25px;
		background-color: #ffbe11;
	}

	.no-checked {
		background-color: #ccc;
	}
</style>
