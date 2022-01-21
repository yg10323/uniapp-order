<template>
	<view class="navbar">
		<view class="left navbar-item">
			<slot name="left">城市</slot>
		</view>
		<view class="center navbar-item">
			<slot name="center">
				<input type="text" placeholder="请输入搜索内容..." />
			</slot>
		</view>
		<view class="right navbar-item">
			<slot name="right">扫码</slot>
		</view>
	</view>
</template>

<script>
export default {
  name: "",
};
</script>

<style scoped lang="scss">
.navbar{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
}


input {
	background-color: #f8f8f8;
	padding: 5px;
	border-radius: 8px;
}
</style>