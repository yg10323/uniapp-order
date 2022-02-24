<template>
	<view class="order">
		<view class="order-login" v-if="orders">
			<view class="order-header">
				<view>
					<text>全部订单</text>
					<text class="border"></text>
				</view>
				<view>
					<text>待评价</text>
					<text class="border"></text>
				</view>
			</view>
			<view class="order-list">
				<view class="order-item" v-for="(item,index) in orders" :key="index">
					<view class="shop" v-for="(shop,index) in item.food_info" :key="index">
						<view class="shop-info">
							<view class="shop-info-left" @click="toShopPage(shop.shop_id)">
								<image :src="shop.data.shop_info.avatar_url" mode=""></image>
								<text>{{shop.data.shop_info.name}}</text>
							</view>
							<view class="shop-info-right">
								<text>{{item.done===1 ? '进行中' : '已完成'}}</text>
							</view>
						</view>
						<view class="order-info" @click="toOrderDetail(item)">
							<view class="foods" v-for="(food,index) in shop.data.food_data" :key="index">
								<view class="food-avatar">
									<image :src="food.avatar_url" mode=""></image>
								</view>
								<view class="food-name">
									<text>{{food.name}}</text>
								</view>
							</view>
						</view>
						<view class="order-item-wrap">
							<text>￥{{item.pay_price.toFixed(2)}}</text>
							<text>共{{shop.data.food_data.length}}件</text>
						</view>
					</view>
					<view class="similar-shop">
						<text class="evaluate" v-if="item.evaluated === 0" @click="toEvaluate(item)">评价</text>
						<text  @click="toOpList(item.shop_info.op_id)">相似商家</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 未登录时 -->
		<view class="order-no-login" v-if="!orders">
			请登录候查看
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			this.orders = ''
			this.getOrder()
		},
		data() {
			return {
				orders: ''
			}
		},
		methods: {
			// 请求订单数据
			getOrder() {
				this.$api.frontApis.getOrder().then(res => {
					if (res.code === 200) {
						this.orders = this.$utils.dealOrderData(res.data).reverse()
					}
					// console.log(this.orders)
				})
			},
			// 跳转到店铺页面
			toShopPage(shop_id){
				this.$api.frontApis.getShopById({data:{shop_id}}).then(res=>{
					if(res.code===200){
						uni.navigateTo({
							url:`/pages/shop/index?shopInfo=${encodeURIComponent(JSON.stringify(res.data))}`
						})
						// console.log(res)
					}
				})
			},
			// 跳转到op分类页面
			toOpList(op_id){
				uni.navigateTo({
					url: `/pages/index/web/opList?op_id=${op_id}`
				})
			},
			//跳转到订单详情页
			toOrderDetail(item){
				uni.navigateTo({
					url: `/pages/order/web/orderDetail?orderData=${JSON.stringify(item)}`
				})
			},
			// 跳转评价页面
			toEvaluate(item){
				uni.navigateTo({
					url: `/pages/order/web/evaluate?orderData=${JSON.stringify(item)}`
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.order {
		// padding: 10px;
		background-color: #e5e5e5;
	}

	.order-header {
		display: flex;
		position: fixed;
		left: 0;
		right: 0;
		padding: 10px;
		background-color: #fff;
		z-index: 100;

		view {
			margin-right: 30px;
		}

		.border {
			position: absolute;
			left: 25px;
			bottom: 0;
			display: inline-block;
			height: 7px;
			width: 25px;
			border-radius: 5px;
			background-color: #fad642;
		}
	}

	.order-list {
		position: relative;
		padding: 50px 10px 10px 10px;
	}

	.order-item {
		padding: 10px;
		margin-bottom: 10px;
		border-radius: 10px;
		background-color: #fff;
	}

	.similar-shop {
		display: flex;
		justify-content: flex-end;
	}
	
	.similar-shop text {
		// position: relative;
		right: 0;
		display: inline-block;
		padding: 5px;
		border: 1px solid #d5d5d6;
		border-radius: 5px;
	}

	.similar-shop .evaluate {
		margin-right: 10px;
		background-color: #ffbe11;
	}

	.order-item-wrap {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 0;
		right: 0;
		width: 100px;
		height: 150px;
		background-color: #fff;
		opacity: 0.8;

		text:first-child {
			margin-left: 15px;
			margin-top: 70%;
		}

		text:last-child {
			margin-left: 20px;
			font-size: 14px;
		}
	}

	.shop {
		position: relative;
		margin-bottom: 10px;
	}

	.shop-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;

	}

	.shop-info-left {
		display: flex;
		align-items: center;

		image {
			width: 40px;
			height: 40px;
			margin-right: 10px;
			border-radius: 10px;
		}

		text {
			font-size: 20px;
			width: 200px;
			// 超出以省略号显示
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.order-info {
		display: flex;
		overflow: scroll;
	}

	.order-info::-webkit-scrollbar {
		display: none;
	}

	.foods {
		margin-right: 10px;
	}

	.food-avatar image {
		width: 100px;
		height: 80px;
		border-radius: 10px;
	}

	.food-name {
		display: inline-block;
		width: 100px;
		// 超出以省略号显示
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
