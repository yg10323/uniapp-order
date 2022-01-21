<template>
	<view class="index">
		<navbar></navbar>

		<view class="content">
			<shop-classify :classifyList="classifyList"></shop-classify>
			<shop-list :shopList="shopList"></shop-list>
		</view>
	</view>
</template>

<script>
	import navbar from '../../components/navbar/navbar.vue'
	import shopClassify from './web/shopClassify.vue'
	import shopList from './web/shopList.vue'

	export default {
		components: {
			navbar,
			shopClassify,
			shopList
		},
		data() {
			return {
				classifyList: [],
				shopList: [],
			};
		},
		created() {
			this.getShopClassify();
			this.getShopAll();
		},
		methods: {
			// 店铺一级分类
			getShopClassify() {
				this.$api.frontApis.getShopClassify().then((res) => {
					if (res.code == 200) {
						this.classifyList = res.data;
					} else {
						console.log("error_getShopClassify");
					}
				});
			},
			// 获取全部店铺
			getShopAll() {
				this.$api.frontApis.getShopAll().then((res) => {
					if (res.code == 200) {
						this.shopList = res.data;
					} else {
						console.log("error_getShopAll");
					}
				});
			},
		},
	}
</script>

<style>

</style>
