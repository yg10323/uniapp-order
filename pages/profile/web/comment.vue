<template>
	<view class="comment">
		<view class="header">
			<text>已贡献 {{evaluates.length}} 条评价</text>
		</view>
		<view class="main">
			<view class="content" v-for="(item, index) in evaluates" :key="index">
				<view class="shop-info">
					<view class="left" @click="toShopPage(item.shop_id)">
						<image :src="item.shop_info.avatar_url" mode=""></image>
						<text>{{item.shop_info.name}}</text>
						<text style="margin-left: 10px;">></text>
					</view>
					<view class="right">
						<text>{{item.createTime.split('T')[0]}}</text>
					</view>
				</view>
				<view class="rate-info">
					<text>商家：</text>
					<uni-rate :value="item.rate" :readonly="true" :size="18" />
					<text>口味{{item.rate}}星 包装{{item.rate}}星</text>
				</view>
				<view class="evaluate-info">
					<text>{{item.content}}</text>
				</view>
				<view class="other-info">
					<view class="btn-delete" @click="deleteEvaluate(item.id)">
						<uni-icons type="trash" size="16"></uni-icons>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		created() {
			this.getEvaluates()
		},
		data() {
			return {
				evaluates: ''
			}
		},
		methods: {
			// 获取评价数据
			getEvaluates() {
				this.$api.frontApis.getEvaluates().then(res => {
					if (res.code === 200) {
						this.evaluates = this.$utils.dealOrderData(res.data).reverse()
						// console.log(this.evaluates)
					}
				})
			},
			// 删除某条评价
			deleteEvaluate(evaluate_id) {
				const postData = {
					evaluate_id: evaluate_id
				}
				uni.showModal({
					title: "确认删除吗",
					success: (res) => {
						if (res.confirm) {
							this.$api.frontApis.deleteEvaluate({
								data: postData
							}).then(res => {
								if (res.code === 200) {
									this.getEvaluates()
								}
							})
						} else if (res.cancel) {
							return
						}
					}
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

	.left {
		display: flex;
		align-items: center;
	}

	.left image {
		width: 40px;
		height: 40px;
		margin-right: 5px;
		border-radius: 10px;
	}

	.right text {
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

	.evaluate-info {
		margin-bottom: 30px;
	}

	.other-info {
		display: flex;
		justify-content: right;
	}

	.btn-delete {
		font-size: 14px;
	}
</style>
