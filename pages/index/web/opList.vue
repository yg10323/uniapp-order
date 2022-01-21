<!-- 一级分类下的店铺展示 -->
<template>
	<view class="op-list">
		<view class="shop-list-content">
			<view class="shop-item" v-for="(item, index) in shopList" :key="index" @click="goShopDetail(item)">
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
		//option为object类型，会序列化上个页面传递的参数
		onLoad: function(option) {
			this.op_id = option.op_id
		},
		components: {
			// uniGrid: ui.uniGrid,
			// uniGridItem: ui.uniGridItem,
			// uniTag: ui.uniTag
		},
		data() {
			return {
				op_id: "",
				shopList: []
			}
		},
		created() {
			this.getShopByOpId()
		},
		methods: {
			transObj(service) {
				return {
					service: eval(service),
				};
			},
			getShopByOpId() {
				this.$api.frontApis.getShopByOpId({
						data: {
							op_id: this.op_id
						}
					})
					.then(res => {
						if (res.code === 200) {
							this.shopList = res.data
						}
					})
			},
			goShopDetail(shopInfo) {
				uni.navigateTo({
					url:`/pages/shop/index?shopInfo=${encodeURIComponent(JSON.stringify(shopInfo))}`
				})
			},
		}
	}
</script>

<style scoped lang="scss">
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
				margin-right: 3px;
			}
		}
	}
</style>
