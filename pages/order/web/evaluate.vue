<template>
	<view class="evaluate">
		<view class="main">
			<view class="title">
				<text>您对商家/菜品满意吗?</text>
			</view>
			<view class="content" v-for="(order,index) in orderData.food_info" :key='index'>
				<view class="shop-info">
					<view class="shop-left">
						<image :src="order.data.shop_info.avatar_url" mode=""></image>
						<text>{{order.data.shop_info.name}}</text>
					</view>
					<view class="shop-right">
						<text class="btn-submit" @click="submit(order)"
							v-if="evaluated.indexOf(order.shop_id) === -1">提交</text>
					</view>
				</view>
				<view class="rate">
					<view class="upper">
						<text>总体</text>
						<uni-rate v-model="rate" />
					</view>
					<view class="center">
						<textarea v-model="textArea" placeholder-style="color:#bbb9b9" placeholder="口味赞, 包装好, 推荐给大家" />
					</view>
					<view class="lower">
						<view class="food-info" v-for="(food,index) in order.data.food_data" :key="index">
							<view class="left">
								<image :src="food.avatar_url" mode=""></image>
								<text @click="addFoodName(food.name)">{{food.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function(option) {
			this.orderData = JSON.parse(decodeURIComponent(option.orderData));
			// console.log(this.orderData)
		},
		data() {
			return {
				orderData: '',
				rate: 5,
				textArea: '',
				evaluated: []
			}
		},
		methods: {
			addFoodName(name) {
				this.textArea += '#' + name + '#'
			},
			// 提交评价数据
			submit(order) {
				const food_ids = []
				for (let item of order.data.food_data) {
					food_ids.push(item.id)
				}
				const postData = {
					order_id: this.orderData.id,
					shop_id: order.shop_id,
					food_id: food_ids,
					buyer_id: this.orderData.buyer_id,
					content: this.textArea,
					rate: this.rate
				}
				// 提交数据
				this.$api.frontApis.evaluate({
					data: postData
				}).then(res => {
					if (res.code === 200) {
						this.evaluated.push(order.shop_id)
						// 判断是否都评价完
						if (this.evaluated.length === this.orderData.food_info.length) {
							this.jumpPage()
						}
					}
				})
			},
			// 评价完更新订单并跳转页面
			jumpPage() {
				const postData = {
					order_id: this.orderData.id
				}
				this.$api.frontApis.updateOrder({
					data: postData
				}).then(res => {
					if (res.code === 200) {
						uni.switchTab({
							url: "/pages/order/index"
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.evaluate {
		height: 100vh;
		padding: 10px;
		background-color: #e5e5e5;
	}

	.main {
		padding: 10px;
		margin-bottom: 10px;
		border-radius: 10px;
		background-color: #fff;
	}

	.title {
		padding-bottom: 10px;
		border-bottom: 1px solid #e5e5e5;
	}

	.title text {
		font-size: 18px;
		font-weight: 700;
	}

	.content {
		margin: 15px 0 30px 0;
	}

	.shop-info {
		display: flex;
		justify-content: space-between;
	}

	.shop-left {
		display: flex;
		align-items: center;
	}

	.shop-left image {
		width: 40px;
		height: 40px;
		margin-right: 10px;
		border-radius: 10px;
	}

	.btn-submit {
		display: inline-block;
		padding: 10px;
		margin-top: 10px;
		border-radius: 10px;
		background-color: #ffbe11;
	}

	.rate {
		margin-top: 20px;
	}

	.rate .upper {
		display: flex;
		align-items: center;
	}

	.upper text {
		margin-right: 5px;
	}

	.rate textarea {
		margin-top: 10px;
		width: 100%;
		padding: 10px 0;
		border-radius: 10px;
		background-color: #f6f6f6;
	}

	.food-info {
		margin-top: 15px;
	}

	.food-info .left {
		display: flex;
		align-items: center;
	}

	.left image {
		width: 30px;
		height: 30px;
		margin-right: 5px;
	}

	.left text {
		display: inline-block;
		padding: 5px;
		background-color: #f0eded;
	}
</style>
