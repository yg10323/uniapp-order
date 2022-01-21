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
					选项卡2的内容
				</view>
				<view v-show="current === 2">
					选项卡3的内容
				</view>
			</view>
		</view>

		<view class="shop-footer">
			<shop-cart></shop-cart>
		</view>
	</view>
</template>

<script>
	// import ui from '../../plugins/uni-ui/index.js'
	import foodList from './web/foodList.vue'
	import comment from './web/comment.vue'
	import shopCart from '../../components/shopcart/shopCart.vue'

	export default {
		onLoad(option) {
			const shopInfo = JSON.parse(decodeURIComponent(option.shopInfo))
			this.shopInfo = shopInfo
			console.log(this.shopInfo)
		},
		components: {
			// uniNoticeBar: ui.uniNoticeBar,
			// uniIcons: ui.uniIcons,
			// uniSegmentedControl: ui.uniSegmentedControl,
			foodList,
			comment,
			shopCart
		},
		data() {
			return {
				shopInfo: "",
				current: 0,
				items: ['点餐', '评价']
			}
		},
		methods: {
			transObj(service) {
				return {
					service: eval(service),
				};
			},
			handleSegmented(e) {
				this.current = e.currentIndex
			},
			handleUniPopup() {
				// this.$refs.popup.open()
			},
		}
	}
</script>

<style scoped lang="scss">
	.shop {
		// height: 100vh;
		// overflow: hidden;
	}

	.shop-upper {
		height: 25vh;
		// background-color: red;

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
		height: 60vh;
		margin-top: 10px;
	}

	.shop-footer {
		// height: 65px;
		// height: calc(100vh - 60vh - 25vh - 44px);
		// background-color: yellow;

		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;

	}
</style>
