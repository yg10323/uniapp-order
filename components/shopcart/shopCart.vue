<template>
	<view class="shop-cart">
		<view class="left">
			<view class="img">
				图片
			</view>
			<view class="text">
				费用
			</view>
		</view>
		
		<view class="right">
			右侧
		</view>
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style scoped lang="scss">
	.shop-cart {
		display: flex;
		justify-content: space-between;
		height: calc(100vh - 60vh - 25vh - 44px);
		background-color: red;
	}
	
	.left {
		display: flex;
		width: 50%;
		background-color: yellow;
	}
</style>
