<template>
	<view class="payment">
		订单付款页面
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		computed: {
			...mapState(['shopCart'])
		},
		onLoad: function(option) {
			this.shop_id = option.shop_id
		},
		created() {
			this.orderData = this.shopCart[this.shop_id]
		},
		data() {
			return {
				shop_id: '',
				orderData: [],
				// 向服务器发送的数据
				postData:{
					food_info:[],
					taotal_price:'',
					pay_price:''
				}
			}
		},
		methods:{
			
		},
	}
</script>

<style scoped lang="scss">
</style>
