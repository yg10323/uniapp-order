<template>
	<view class="evaluate">
		评价
	</view>
</template>

<script>
	export default {
		onLoad: function(option) {
			this.orderData = JSON.parse(decodeURIComponent(option.orderData));
			console.log(this.orderData)
		},
	}
</script>

<style scoped lang="scss">
</style>
