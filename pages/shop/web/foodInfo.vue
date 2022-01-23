<template>
	<view class="food-info">
		<view class="food-info-title">
			插眼
		</view>
		<view class="food-info-content">
			<view class="food-item" v-for="(item,index) in this.shopCart[this.shop_id] || []" :key="index">
				<view class="left">
					<view class="img">
						<image :src="item.data.avatar_url"></image>
					</view>
					<view class="text">
						<view class="text-upper">
							{{item.data.name}}
						</view>
						<view class="text-center">
							<text class="extra">打包费: {{item.data.extra}}</text>
							<text class="discount" v-if="item.data.discount">折扣: {{item.data.discount.toFixed(2)}}</text>
						</view>
						<view class="text-lower">
							<text>￥</text>
							{{item.data.price}}
						</view>
					</view>
				</view>

				<view class="right">
					<view class="right-wrap">
						<text class="reduce" @click="countDecrease(item)">-</text>
						<text class="count">{{item.count}}</text>
						<text class="add" @click="countIncrease(item)">+</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		props: {
			shop_id: {
				type: Number,
				required: true
			}
		},
		computed: {
			...mapState(['shopCart'])
		},
		methods:{
			countDecrease(item){
				this.changeCount({
					shop_id: this.shop_id,
					name: item.name,
					method: "decrease"
				})
			},
			countIncrease(item){
				this.changeCount({
					shop_id: this.shop_id,
					name: item.name,
					method: "increase"
				})
			},
			
			...mapMutations(['changeCount'])
		}
	}
</script>

<style scoped lang="scss">
	.food-info {
		height: 180px;
		padding: 10px 10px 15px 10px;
		border-radius: 3.2vw 3.2vw 0 0;
		background-color: #fff;
		overflow: hidden;
	}

	.food-info-title {
		text-align: center;
		font-size: 14px;
		margin-bottom: 15px;
	}

	.food-info-content {
		height: 180px;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	// 隐藏滚动条
	.food-info-content::-webkit-scrollbar {
		display: none;
	}

	.food-item {
		display: flex;
		padding: 10px;
		position: relative;
		margin-bottom: 10px;
	}

	.food-item .left {
		display: flex;
		width: 70%;
		// background-color: red;
	}

	.left image {
		width: 50px;
		height: 50px;
	}

	.left .text {
		margin-left: 10px;

		&-upper {
			font-size: 18px;
		}

		&-center {
			font-size: 12px;
			color: #c1c1bb;

			.discount {
				margin-left: 5px;
			}
		}

		&-lower {
			position: relative;
			bottom: 0;
			color: red;

			text {
				font-size: 12px;
			}
		}
	}

	.food-item .right {
		flex: 1;
		position: relative;
		// background-color: yellow;
	}

	.right .right-wrap {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.right-wrap text {
		display: inline-block;
		margin-left: 5px;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		font-size: 22px;
		border-radius: 5px;
		// background-color: red;
	}

	.right-wrap .reduce {
		border: 1px solid #f3a73f;
	}

	.right-wrap .count {
		font-size: 18px;
	}

	.right-wrap .add {
		background-color: #f3a73f;
	}
</style>
