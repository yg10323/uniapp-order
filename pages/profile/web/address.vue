<template>
	<view class="address">
		<!-- 数据库中的地址数据 -->
		<view class="address-item">
			<view class="address-item-wrap">
				<view class="address-item-wrap-upper">
					{{user.address}}
				</view>
				<view class="address-item-wrap-lower">
					<text class="name lower-item">{{user.name}}</text>
					<text class="phone lower-item">{{user.phone}}</text>
				</view>
			</view>
			<view class="edit">
				<uni-icons type="compose" size="24" @click="handleEdit"></uni-icons>
			</view>
		</view>

		<!-- 遍历本地的地址列表 -->
		<!-- 添加右侧滑动删除 -->
		<!-- TODO: h5页面中点击删除报错, 但不影响功能正常使用 -->
		<uni-swipe-action>
			<uni-swipe-action-item :right-options="options" @click="handleSwipe($event,index)"
				v-for="(item,index) in localAddress" :key="index">
				<view class="address-item">
					<view class="address-item-wrap">
						<view class="address-item-wrap-upper">
							{{item.localAddress}}
						</view>
						<view class="address-item-wrap-lower">
							<text class="name lower-item">{{item.localName}}</text>
							<text class="phone lower-item">{{item.localPhone}}</text>
						</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>

		<!-- 新增地址 -->
		<view class="address-bottom">
			<button type="default" class="btn-add" @click="addLocalAddress">
				<uni-icons type="plus" size="24"></uni-icons>
				新增收货地址
			</button>
		</view>

		<popup v-if="popupShow" @cancel="cancel" @confirm="confirm">
			<template v-slot:popup-main>
				<view>
					<input type="text" v-model="localInfo.localAddress" placeholder="请输入地址" />
					<input type="text" v-model="localInfo.localName" placeholder="请输入收货人" />
					<input type="text" v-model="localInfo.localPhone" placeholder="请输入联系电话" />
				</view>
			</template>
		</popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	// import ui from '../../../plugins/uni-ui/index.js'
	import popup from '../../../components/popup/popup.vue'

	export default {
		components: {
			// uniIcons: ui.uniIcons,
			// uniCard: ui.uniCard,
			// uniSwipeAction: ui.uniSwipeAction,
			// uniSwipeActionItem: ui.uniSwipeActionItem
		},
		computed: mapState(['isLogin', 'userInfo']),
		created() {
			this.user = this.userInfo
			this.localAddress = uni.getStorageSync('localAddress'+this.user.account) || []
			
		},
		data() {
			return {
				user: this.userInfo,
				name: '',
				address: '',
				phone: '',
				// 新增的地址保存至本地, 因为后端没有设计该功能
				localAddress: [],
				localInfo: {
					localName: '',
					localAddress: '',
					localPhone: ''
				},
				popupShow: false,
				options: [{
						text: '取消',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		methods: {
			handleEdit() {
				uni.navigateTo({
					url: '/pages/profile/web/editAddress'
				})
			},
			addLocalAddress() {
				console.log('新增本地地址')
				this.popupShow = !this.popupShow
			},
			// 监听popup的点击事件
			cancel() {
				this.popupShow = !this.popupShow
				this.localInfo = {
					localName: '',
					localAddress: '',
					localPhone: ''
				}
			},
			confirm() {
				const res = this.$utils.removeEmpty(this.localInfo)
				if (Object.keys(res).length !== 3) {
					uni.showToast({
						title: '信息填写不完整!',
						icon: "error"
					})
					return
				}
				// 将新增的地址信息保存至本地
				this.localAddress.push(this.localInfo)
				uni.setStorage({
					key: "localAddress" + this.user.account,
					data: this.localAddress
				})
			},
			// 右侧滑块点击事件
			handleSwipe(e, index) {
				// console.log(e.content.text)
				if (e.content.text == '删除') {
					this.localAddress.splice(index, 1)
					uni.setStorage({
						key: "localAddress" + this.user.account,
						data: this.localAddress
					})
				}
			},


			...mapMutations(['login'])
		},
	}
</script>

<style scoped lang="scss">
	.address-item {
		display: flex;
		justify-content: space-between;
		padding: 10px;
		border-bottom: 1rpx solid #979797;

		&-wrap {
			&-lower {
				margin-top: 5px;
				font-size: 14px;

				.lower-item {
					margin-right: 20px;
					color: #979797;
				}
			}
		}

		.edit {
			display: flex;
			align-items: center;
		}
	}

	.address-bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}



	input {
		background-color: #fff;

		height: 40px;
		margin: 10px;
		border-radius: 10px;
	}
</style>
