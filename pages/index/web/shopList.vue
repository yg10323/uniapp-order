<template>
	<view class="shop-list">
		<view class="shop-list-titile">附近商家</view>

		<view class="shop-list-choice">
			<uni-grid :column="4" :showBorder="false" :square="false">
				<uni-grid-item>
					<view class="grid-content">
						综合排序
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-content">销量最高</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-content">距离最近</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="grid-content">
						筛选
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>

		<view class="shop-list-content">
			<view class="shop-item" v-for="(item, index) in shopList" :key="item.id" @click="goShopDetail(item)">
				<image mode="aspectFit" style="width: 100px; height: 100px" :src="item.shop_avatar_url"></image>
				<view class="shop-item-desc">
					<view class="title">{{ item.name }}</view>
					<view class="delivery">
						<text>接受预定</text>
						{{ item.start_time }}后配送
						<text type="danger">{{ item.delivery }}</text>
					</view>
					<view class="service">
						<uni-tag class="tag" v-for="(serve, index) in transObj(item.service).service" :key="index"
							type="warning" inverted="true" :text="serve">
						</uni-tag>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import ui from '../../../plugins/uni-ui/index.js'

	export default {
		name: "",
		components: {
			// uniGrid: ui.uniGrid,
			// uniGridItem: ui.uniGridItem,
			// uniTag: ui.uniTag
		},
		props: {
			shopList: {
				type: Array,
				required: true,
				default: () => [],
			},
		},
		methods: {
			transObj(service) {
				return {
					service: eval(service),
				};
			},
			goShopDetail(shopInfo) {
				uni.navigateTo({
					url:`/pages/shop/index?shopInfo=${encodeURIComponent(JSON.stringify(shopInfo))}`
				})
			},
		},
	};
</script>

<style scoped lang="scss">
	.shop-list-titile {
		font-size: 18px;
		font-weight: 700;
		margin: 0 0 15px 10px;
	}

	.shop-list-choice {
		text-align: center;
		margin-bottom: 10px;
		border-bottom: 1px solid rgb(231, 230, 230);
		padding: 0 10px;

		.grid-content {
			height: 30px;
			width: 80px;
			line-height: 30px;
			font-size: 14px;
		}
	}

	.shop-list-content {
		.shop-item {
			display: flex;
			padding: 0 10px;
			height: 100px;
			margin-bottom: 20px;

			&-desc {
				width: 100%;

				margin: 10px;

				.title,
				.delivery,
				.service {
					margin-bottom: 10px;
				}

				.title {
					font-size: 18px;
				}

				.delivery {
					display: flex;
					justify-content: space-between;
					font-size: 12px;
					color: #37a2ee;
				}
			}
		}
		
		.service {

			.tag {
				/*1. 先强制一行内显示文本*/
				white-space: nowrap;
				/*2. 超出的部分隐藏*/
				overflow: hidden;
				/*3. 文字用省略号替代超出的部分*/
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
</style>
