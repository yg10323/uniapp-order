<template>
	<view class="popup">
		<view class="popup-header popup-item">
			<slot name="popup-header">
				<!-- 标题请使用 text标签 -->
				<text>提示信息</text>
			</slot>
		</view>

		<view class="popup-main popup-item">
			<slot name="popup-main">
				<input type="text" value="" placeholder="请输入内容" />
			</slot>
		</view>

		<view class="popup-footer popup-item">
			<slot name="popup-footer">
				<button type="default" @click="cancel">取消</button>
				<button type="primary" @click="confirm">确认</button>
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		methods:{
			cancel(){
				this.$emit('cancel')
			},
			confirm(){
				this.$emit('confirm')
			}
		}
	}
</script>

<style scoped lang="scss">
	.popup {
		background-color: #dbdbdb;

		position: fixed;
		width: 70%;
		padding: 10px;
		// margin-left: 50%;
		// margin-top: 10%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		border-radius: 10px;

		z-index: 99;
	}

	.popup-header {
		margin-bottom: 30px;

		text {
			font-size: 18px;
			font-weight: 700;
		}
	}


	input {
		background-color: #FFFFFF;

		height: 40px;
		margin: 10px;
		border-radius: 10px;
	}

	.popup-footer {
		display: flex;
	}

	button {
		width: 40%;
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
