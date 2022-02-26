<template>
	<view class="comment">
		<view class="header">
			<text>共 {{evaluates.length}} 条评价</text>
		</view>
		<view class="main">
			<view class="content" v-for="(item, index) in evaluates" :key="index">
				<view class="shop-info">
					<view class="shop-info-left">
						<image src="../../../static/img/default_avatar.png" mode=""></image>
						<text>{{item.buyer_info.name}}</text>
					</view>
					<view class="shop-info-right">
						<text>{{item.createTime.split('T')[0]}}</text>
					</view>
				</view>
				<view class="rate-info">
					<text>评分：</text>
					<uni-rate :value="item.rate" :readonly="true" :size="18" />
					<text>口味{{item.rate}}星 包装{{item.rate}}星</text>
				</view>
				<view class="evaluate-info">
					<text>{{item.content}}</text>
				</view>
				<view class="other-info">
					<view class="food-info" v-for="(food,index) in item.food_info[0].data.food_data" :key="index">
						<view class="left">
							<image :src="food.avatar_url" mode=""></image>
							<text>{{food.name}}</text>
						</view>
					</view>
				</view>
				<view class="reply" v-if="item.evaluate_id !== null">
					<text class="left-text">商家回复：</text>
					<text class="right-text">{{item.reply}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			shop_id: {
				type: Number,
				required: true
			}
		},
		created() {
			this.getShopEvaluates()
		},
		data() {
			return {
				evaluates: ''
			}
		},
		methods: {
			// 获取评价数据
			getShopEvaluates() {
				this.$api.frontApis.getShopEvaluates({
					data: {
						shop_id: this.shop_id
					}
				}).then(res => {
					if (res.code === 200) {
						this.evaluates = this.$utils.dealOrderData(res.data).reverse()
						// console.log(this.evaluates)
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.comment {
		height: 100vh;
		padding: 10px;
		background-color: #f6f6f6;
	}

	.header {
		margin-bottom: 10px;
		font-size: 18px;
	}


	.content {
		padding: 15px 10px;
		margin-bottom: 15px;
		border-radius: 5px;
		background-color: #fff;
	}

	.shop-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.shop-info-left {
		display: flex;
		align-items: center;
	}

	.shop-info-left image {
		width: 40px;
		height: 40px;
		margin-right: 5px;
		border-radius: 50%;
	}

	.shop-info-right text {
		color: #98989d;
	}

	.rate-info {
		display: flex;
		align-items: center;
		margin: 10px 0;
	}

	.rate-info view {
		margin-right: 15px;
	}

	.rate-info text {
		font-size: 14px;
		color: #98989d;
	}

	.other-info {
		display: flex;
	}

	.food-info {
		margin-top: 15px;
	}

	.food-info .left {
		display: flex;
		align-items: center;
	}

	.left image {
		width: 20px;
		height: 20px;
		margin-right: 5px;
		border-radius: 10px;
	}

	.left text {
		display: inline-block;
		padding: 5px;
		font-size: 14px;
		background-color: #f6f6f6;
	}
	
	.reply {
		padding: 5px;
		margin-top: 10px;
		font-size: 14px;
		background-color: #f6f6f6;
	}
	
	.left-text {
		color: #ffa04e;
	}
</style>
