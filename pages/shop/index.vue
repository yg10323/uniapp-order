<template>
	<view class="shop">
		<view class="shop-upper">
			<view class="shop-upper-bg">
				<image :src="shopInfo.shop_avatar_url" mode="scaleToFill"></image>
			</view>
			<view class="shop-upper-intro">
				<view class="shop-avatar">
					<image :src="shopInfo.shop_avatar_url"></image>
				</view>
				<view class="shop-info">
					<view class="shop-name">
						{{shopInfo.name}}
					</view>
					<view class="shop-service" @click="handleUniPopup">
						<text v-for="(item,index) in transObj(shopInfo.service).service" :key="index">{{item}}</text>
					</view>
				</view>
				<view class="shop-notice">
					<uni-icons type="sound" size="22" class="icon"></uni-icons>
					<uni-notice-bar class="noticebar" scrollable="true" single="true" :speed="50"
						background-color="#fff" :text="shopInfo.notice">
					</uni-notice-bar>
				</view>
			</view>
		</view>

		<view class="shop-content">
			<uni-segmented-control :current="current" :values="items" @clickItem="handleSegmented" styleType="text"
				activeColor="green"></uni-segmented-control>
			<view class="content">
				<view v-show="current === 0">
					<food-list :shop_id="shopInfo.id"></food-list>
				</view>
				<view v-show="current === 1">
					<comment :shop_id="shopInfo.id"></comment>
				</view>
			</view>
		</view>

		<view class="shop-footer" v-if="showFooter">
			<shop-cart :cartData="{shop_id:shopInfo.id,foodData:shopCart[shopInfo.id]}" @showFoodInfo="showFoodInfo"
				@handlePayment="handlePayment"></shop-cart>
		</view>

		<view class="food-info-wrap">
			<uni-popup ref="foodInfoWrap" type="bottom" @maskClick="showFoodInfo">
				<food-info :shop_id="shopInfo.id"></food-info>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import foodList from './web/foodList.vue'
	import comment from './web/comment.vue'
	import shopCart from '../../components/shopcart/shopCart.vue'
	import foodInfo from './web/foodInfo.vue'
	import {
		mapState
	} from 'vuex'

	export default {
		onLoad(option) {
			const shopInfo = JSON.parse(decodeURIComponent(option.shopInfo))
			this.shopInfo = shopInfo
			// console.log(this.shopInfo)
		},
		components: {
			foodList,
			comment,
			shopCart,
			foodInfo
		},
		computed: mapState(['shopCart']),
		data() {
			return {
				shopInfo: "",
				current: 0,
				items: ['点餐', '评价'],
				showFoodInfoPopup: false,
				showFooter: true
			}
		},
		methods: {
			transObj(service) {
				return {
					service: eval(service),
				};
			},
			// 切换tab栏
			handleSegmented(e) {
				this.current = e.currentIndex
				// 切换tab栏,隐藏footer
				if (this.current !== 0) this.showFooter = false
				else this.showFooter = true
			},
			handleUniPopup() {
				// this.$refs.popup.open()
			},
			// 控制底部popup显示隐藏
			showFoodInfo() {
				if (this.showFoodInfoPopup) {
					this.$refs.foodInfoWrap.close()
				} else {
					this.$refs.foodInfoWrap.open()
				}
				this.showFoodInfoPopup = !this.showFoodInfoPopup
			},
			// 跳转创建订单页面
			handlePayment() {
				// 没有将某店铺食品添加购物车却点击结算时直接返回
				if(this.shopCart[this.shopInfo.id] == undefined) return 
				// 购物车有数据才结算
				if (this.shopCart[this.shopInfo.id].length) {
					uni.navigateTo({
						url: `/pages/order/web/createOrder?shopInfo=${encodeURIComponent(JSON.stringify(this.shopInfo))}`
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.shop {
		position: relative;
	}

	.shop-upper {
		&-bg {
			image {
				filter: blur(5px);
				width: 100%;
				height: 60px;
			}
		}

		&-intro {
			text-align: center;

			.shop-avatar {
				image {
					width: 64px;
					height: 64px;
					position: absolute;
					top: 15px;
					left: 50%;
					transform: translateX(-50%);
				}
			}

			.shop-info {
				margin-top: 20px;

				.shop-name {
					font-size: 18px;
					font-weight: 700;
				}
			}

			.shop-notice {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 10px;

				.icon {
					height: 40px;
					width: 36px;
					line-height: 36px;

				}
			}
		}
	}

	.shop-content {
		margin-top: 10px;
	}

	.shop-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
	}

	.uni-popup {
		z-index: 1;
		position: relative;
	}

	/deep/ .uni-popup__wrapper {
		position: relative;
		bottom: 50px;
		background-color: #fff;
	}
</style>
