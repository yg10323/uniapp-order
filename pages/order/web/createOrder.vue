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
			<view class="shop-name">
				<text>{{ shopInfo.name }}</text>
				<text>{{ shopInfo.delivery }}</text>
			</view>
			<view class="food-item-list">
				<view class="food-item" v-for="(item, index) in orderData" :key="index">
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
							<text>x{{ item.count }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="food-total-price">
				<view class="food-total-price-upper">
					<text>总打包费</text>
					<text>￥{{ totalExtra }}</text>
				</view>
				<view class="food-total-price-lower">
					<text v-if="originalPrice - totalPrice">
						已优惠
						<text style="color: red">￥{{ (originalPrice - totalPrice).toFixed(2) }}</text>
					</text>
					<text style="margin-left: 10px">小计 ￥{{ totalPrice.toFixed(2) }}</text>
				</view>
			</view>
		</view>

		<!-- 商家服务只展示: 猫公益, 放心吃, 准时宝 -->
		<view class="service-info">
			<view class="service-item" v-for="(item, index) in transObj(shopInfo.service).service" :key="index"
				v-if="item === '猫公益' || item === '准时宝' || item === '放心吃'">
				<view class="public-welfare" v-if="item === '准时宝'">
					<view class="service-item-title">
						<view class="title-left">
							<uni-icons type="vip" size="24"></uni-icons>
							<text>准时宝</text>
						</view>
						<view class="title-right"> ￥0 </view>
					</view>
					<view class="service-item-desc">
						超时小于10分钟不赔, 超过10分钟赔<text style="color: red">4.08元</text>, 超过15分钟 赔<text
							style="color: red">12.24元</text>,
						超过30分钟赔<text>28.56元</text>
					</view>
				</view>
				<view class="on-time" v-if="item === '猫公益'">
					<view class="service-item-title">
						<view class="title-left">
							<uni-icons type="fire" size="24"></uni-icons>
							<text>猫公益</text>
						</view>
					</view>
					<view class="service-item-desc">
						本单完成后, 商家将自动捐赠<text style="color: red">0.01元</text>到猫公益基金
					</view>
				</view>
				<view class="good-eat" v-if="item === '放心吃'">
					<view class="service-item-title">
						<view class="title-left">
							<uni-icons type="heart" size="24"></uni-icons>
							<text>放心吃</text>
						</view>
						<view class="title-right"> 商家已为您投保放心吃 </view>
					</view>
				</view>
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
				<view class="create-order-footer-right" @click="toPayment"> 付款 </view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";

	export default {
		onLoad: function(option) {
			this.shopInfo = JSON.parse(decodeURIComponent(option.shopInfo));
		},
		created() {
			this.orderData = this.shopCart[this.shopInfo.id];
			// console.log(this.orderData)
		},
		computed: {
			...mapState(["shopCart", "userInfo"]),
			totalExtra() {
				let total = 0;
				for (let item of this.orderData) {
					total = total + item.data.extra;
				}
				return total;
			},
			originalPrice() {
				let price = 0;
				for (let item of this.orderData) {
					// 原价格 = 打包费 + 单价 * 份数
					price = price + item.data.extra + item.data.price * item.count;
				}

				return price;
			},
			totalPrice() {
				let price = 0;
				for (let item of this.orderData) {
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
				shopInfo: "",
				orderData: [],
				// 向服务器发送的数据
				postData: {},
			};
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
			// 跳转支付页面
			toPayment() {
				// 付款却没有收货地址时
				if (!this.userInfo.address) {
					uni.navigateTo({
						url: "/pages/profile/web/editAddress",
					});
				} else {
					// console.log(this.orderData)
					const food_ids = []
					for (let item of this.orderData) {
						food_ids.push(item.data.id)
					}
					// 订单金额大于20时随机减0-5
					let pay_price;
					if (this.totalPrice.toFixed(2) > 20) {
						pay_price = this.totalPrice - Math.random() * 10
					} else {
						pay_price = this.totalPrice
					}
					this.postData = {
						food_info: [{
							shop_id: this.shopInfo.id,
							food_ids: food_ids
						}],
						taotal_price: this.totalPrice.toFixed(2),
						pay_price: pay_price.toFixed(2),
					}
					uni.navigateTo({
						url: `/pages/order/web/payment?data=${encodeURIComponent(JSON.stringify(this.postData))}`
					})
				}
			},
		}
	};
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
		margin-bottom: 10px;
		border-radius: 10px;
		background-color: #fff;
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
			font-size: 14px;
			color: #ccc;
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

	// service-info
	.service-info {
		padding: 10px;
		margin-bottom: 70px;
		border-radius: 10px;
		background-color: #fff;
	}

	.service-item {
		padding: 10px 5px;
	}

	.service-item-title {
		display: flex;
		justify-content: space-between;
		position: relative;

		text:last-child {
			margin-left: 30px;
		}
	}

	.service-item-desc {
		font-size: 14px;
		padding: 5px;
		color: #888;
	}

	.uni-icons {
		position: absolute;
		bottom: 0;
		font-weight: 700;
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
</style>
