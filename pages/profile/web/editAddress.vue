<template>
	<view class="editAddress">
		<view class="address info-item">
			<text class="label">收货地址: </text>
			<input type="text" v-model="addressData.address" class="input"/>
		</view>
		<view class="name info-item">
			<text class="label">收货人: </text>
			<input type="text" v-model="addressData.name" class="input"/>
		</view>
		<view class="phone info-item">
			<text class="label">手机号: </text>
			<input type="text" v-model="addressData.phone" class="input"/>
		</view>
		<button type="primary" class="btn" @click="updateAddress">保存地址</button>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		computed: mapState(['userInfo']),
		created() {
			this.addressData.address = this.userInfo.address
			this.addressData.name = this.userInfo.name
			this.addressData.phone = this.userInfo.phone
		},
		data() {
			return {
				addressData: {
					name:'',
					address:'',
					phone:''
				}
			}
		},
		methods:{
			updateAddress(){
				// console.log(this.addressData)
				this.$api.frontApis.updateAddress({data:this.addressData})
				.then(res=>{
					if(res.code===200){
						this.userInfo.address = this.addressData.address 
						this.userInfo.name = this.addressData.name
						this.userInfo.phone = this.addressData.phone
						
						uni.showToast({
							title: res.message,
							success() {
								setTimeout(() => {
									uni.redirectTo({
										url:'/pages/profile/web/address'
									})
								}, 1000)
							}
						})
						this.updateInfo(this.userInfo)
					}
				})
			},
			
			...mapMutations(['updateInfo'])
		}
	}
</script>

<style scoped lang="scss">
	.info-item {
		display: flex;
		padding: 10px;
		border-bottom: 1px solid #ccc;	
		
		.label {
			margin-right: 15px;
		}
	}
	
	.btn {
		margin: 20px;
	}
</style>
