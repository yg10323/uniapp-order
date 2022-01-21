<template>
	<view class="profile">
		<!-- 顶部 -->
		<view class="top-wrap">
			<!-- 左侧头像展示 -->
			<view class="top-wrap-left">
				<image src="../../static/img/default_avatar.png" mode="aspectFit" class="avatar"></image>
			</view>
			<!-- 右侧未登录和登录时 -->
			<view class="top-wrap-right">
				<view class="no-login" v-if="!isLogin" @click="handleLogin">
					登录/注册
				</view>
				<view class="has-login" v-if="isLogin">
					<view class="">
						{{userInfo.account}} 
					</view>
					<view class="">
						{{userInfo.phone}}
					</view>
				</view>
			</view>
		</view>

		<!-- 中间 -->
		<view class="center-wrap">
			<!-- 登录显示 -->
			<view class="center-wrap-login" v-if="isLogin">
				<view class="feedback center-item" @click="toAddress">
					<view class="center-item-left">
						<uni-icons type="location" size="18" class="icon"></uni-icons>
						我的地址
					</view>
					<view class="center-item-right">
						<uni-icons type="right" size="18" class="icon"></uni-icons>
					</view>
				</view>
				<view class="introduce center-item" @click="toComment">
					<view class="center-item-left">
						<uni-icons type="chat" size="18" class="icon"></uni-icons>
						我的评价
					</view>
					<view class="center-item-right">
						<uni-icons type="right" size="18" class="icon"></uni-icons>
					</view>
				</view>
				<view class="introduce center-item" @click="toFeedback">
					<view class="center-item-left">
						<uni-icons type="person" size="18" class="icon"></uni-icons>
						客服中心
					</view>
					<view class="center-item-right">
						<uni-icons type="right" size="18" class="icon"></uni-icons>
					</view>
				</view>
			</view>

			<!-- 未登录和登录都显示 -->
			<view class="center-wrap-no-login">
				<view class="feedback center-item" @click="toHelp">
					<view class="center-item-left">
						<uni-icons type="help" size="18" class="icon"></uni-icons>
						反馈与帮助
					</view>
					<view class="center-item-right">
						<uni-icons type="right" size="18" class="icon"></uni-icons>
					</view>
				</view>
				<view class="introduce center-item" @click="showExplain">
					<view class="center-item-left">
						<uni-icons type="calendar" size="18" class="icon"></uni-icons>
						协议和说明
					</view>
					<view class="center-item-right">
						<uni-icons type="right" size="18" class="icon"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 登录后退出按钮 -->
		<view class="bottom-wrap" v-if="isLogin">
			<button type="default" class="btn-quit" @click="loginOut">退出账号</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,mapMutations
	} from 'vuex'
	// import ui from '../../plugins/uni-ui/index.js'
	import config from './config.js'
	
	export default {
		computed: mapState(['isLogin', 'userInfo']),
		components: {
			// uniIcons: ui.uniIcons,
		},
		methods: {
			// 登录
			handleLogin() {
				uni.navigateTo({
					url: '/pages/profile/web/login'
				})
			},
			// 退出登录
			loginOut(){
				this.logout()
			},
			// 跳转到我的地址
			toAddress(){
				uni.navigateTo({
					url: '/pages/profile/web/address'
				})
			},
			// 跳转到我的评价
			toComment(){
				uni.navigateTo({
					url: '/pages/profile/web/comment'
				})
			},
			// 跳转到客服对话
			toFeedback(){
				uni.navigateTo({
					url: '/pages/profile/web/feedback'
				})
			},
			// 跳转到帮助
			toHelp(){
				uni.navigateTo({
					url: '/pages/profile/web/help'
				})
			},
			// 跳转到协议说明
			showExplain(){
				uni.showModal({
					title: config.explain.title,
					content: config.explain.content,
					showCancel: false
				})
			},
			
			...mapMutations(['logout'])
		}
	}
</script>

<style scoped lang="scss">
	.profile {
		height: calc(100vh - 44px - 50px);
		background-color: #f8f8f8;
	}

	.top-wrap {
		display: flex;
		padding: 20px 0 20px 20px;
		background-color: #fff;

		&-left {
			.avatar {
				width: 64px;
				height: 64px;
				border-radius: 50%;
			}
		}

		&-right {
			display: flex;
			align-items: center;
			margin-left: 20px;

			.no-login {
				font-size: 20px;
			}
		}
	}

	.center-wrap {
		background-color: #fff;

		.center-item {
			display: flex;
			justify-content: space-between;

			padding: 10px;
			height: 30px;
			line-height: 30px;
			font-size: 14px;

			.icon {
				margin-right: 5px;
			}
		}
	}
	
	.bottom-wrap{
		margin-top: 20px;
		
		.btn-quit{
			background-color: #fff;
		}
	}
</style>
