<template>
	<view class="foodList">
		<view class="left-menu">
			<view class="left-menu-option" :class="menuIndex===index ? 'menuActive':''" v-for="(item,index) in nemuList"
				:key="index" @click="menuClick(item,index)">
				<text>{{item}}</text>
			</view>
		</view>

		<view class="right-content">
			<view class="food" v-for="(parent,index) in foodInfo" :key="index">
				<view class="food-title">
					<text>{{parent.classify}}</text>
				</view>
				<view class="food-item" v-for="(child,index) in parent.list" :key="index">
					<view class="avatar">
						<image :src="child.avatar_url" mode="widthFix"></image>
					</view>
					<view class="other-info">
						<view class="other-info-name">{{child.name}}</view>
						<view class="other-info-sold other-info-item">月售{{child.sold}}</view>
						<view class="other-info-price other-info-item">
							<view class="left">￥<text>{{child.price}}</text></view>
							<view class="right">
								<view class="add" @click="addCount(child)">+</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'

	export default {
		props: {
			shop_id: {
				type: Number,
				required: true
			}
		},
		computed: mapState(['shopCart']),
		created() {
			this.getShopFood()
		},
		data() {
			return {
				foodInfo: "",
				menuIndex: 0,
				prevIndex: 0, //前一个被激活的菜单项
				nemuList: [],
			}
		},
		methods: {
			getShopFood() {
				this.$api.frontApis.getShopFood({
						data: {
							shop_id: this.shop_id
						}
					})
					.then(res => {
						if (res.code === 200) {
							this.foodInfo = this.$utils.mergefoods(res.data)
							// 获取全部的分类
							for (let i = 0; i < this.foodInfo.length; i++) {
								this.nemuList.push(this.foodInfo[i].classify)
							}

							// ------------------------------------------------------------------
							// console.log(this.foodInfo)
						}
					})
			},
			menuClick(item, index) {
				this.menuIndex = index; //动态添加class

				// * 因为联动滚动效果写不出来, 所以取巧: 改变数据的次序, 将与左侧菜单项匹配的数据放在第一位
				for (let i in this.foodInfo) {
					if (item === this.foodInfo[i].classify) {
						const temp = this.$utils.deepClone(this.foodInfo[0])
						this.foodInfo[0] = this.foodInfo[i]
						this.foodInfo[i] = temp
					}
				}
			},
			addCount(data) {
				const food = {
					name: data.name,
					data: data,
					count: 1
				}

				const cartInfo = this.shopCart[this.shop_id]

				for (let i in cartInfo || []) {
					if (food.name === cartInfo[i].name) {
						this.changeCount({
							shop_id: this.shop_id,
							name: food.name,
							method: "increase"
						})
						// 如果存在该食品, 只将count加1
						return
					}
				}
				// 否则就新添加一个
				this.setShopCart(food)
			},


			...mapMutations(['setShopCart', 'changeCount'])
		}
	}
</script>

<style scoped lang="scss">
	.foodList {
		display: flex;
		margin-top: 10px;
		margin-bottom: 10px;

		overflow: hidden;
	}

	.left-menu {
		width: 100px;
		height: 60vh;
		// margin-right: 15px;
		text-align: center;
		overflow-x: hidden;
		overflow-y: scroll;
		background-color: #f6f6f6;

		&-option {
			padding: 15px 2px;
			// 一行显示,超出文字显示省略号
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			// background-color: yellow;
		}
	}

	// 隐藏滚动条
	.left-menu::-webkit-scrollbar {
		display: none;
	}

	.right-content::-webkit-scrollbar {
		display: none;
	}

	.right-content {
		flex: 1;
		height: 60vh;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.food {
		&-title {
			display: inline-block;
			width: 100%;
			padding: 5px 20px;
			font-size: 14px;
			background-color: #f6f6f6;
		}

		&-item {
			display: flex;
			padding: 10px 0;
		}
	}

	.avatar {
		image {
			width: 80px;
			// height: 64px;
			height: 100%;
		}
	}

	.other-info {
		flex: 1;
		margin-left: 10px;

		&-name {
			font-size: 18px;
			font-weight: 700;
		}

		&-sold {
			font-size: 14px;
			color: #ccc;
		}

		&-price {
			display: flex;
			justify-content: space-between;
			position: relative;

			.left {
				text {
					color: red;
					font-size: 18px;
					font-weight: 700;
				}
			}

			.right {
				position: absolute;
				right: 10px;
				bottom: 0;
				text-align: center;

				.add {
					width: 20px;
					height: 20px;
					line-height: 20px;
					font-size: 20px;
					font-weight: 700;
					background-color: #f3a73f;
					border-radius: 5px;
				}
			}
		}
	}

	.other-info-item {
		margin: 5px 0;
	}

	.menuActive {
		background-color: #fff;
	}
</style>
