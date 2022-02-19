<template>
	<view class="order-detail">
		<view class="header">
			<text>{{orderData.done===0?'订单已完成':'订单进行中'}}</text>
			<text>></text>
		</view>

		<view class="food-info">
			<view class="shop-name">
				<text>{{ orderData.food_info[0].data.shop_info.name }}</text>
				<text>></text>
			</view>
<!-- 			<view class="food-item-list">
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
			</view> -->
		</view>

		<view class="buyer-info">

		</view>

		<view class="order-info">

		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function(option) {
			this.orderData = JSON.parse(decodeURIComponent(option.orderData));
			console.log(this.orderData)
		},
		data() {
			return {
				orderData: ''
			}
		},
	}
</script>

<style scoped lang="scss">
	.order-detail {
		height: 100vh;
		padding: 10px;
		background-color: #e5e5e5;
	}

	.header text {
		font-size: 22px;
		font-weight: 700;
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
	
</style>
