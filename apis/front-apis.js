export default {
    getShopClassify: {
        name: '获取店铺分类',
        url: '/front/shop/classify',
        method: 'GET',
    },
    getShopAll: {
        name: '获取全部店铺',
        url: '/front/shop/all',
        method: 'GET',
    },
    getShopFood: {
        name: '获取店铺食品',
        url: '/front/shop/food',
        method: 'POST'
    },
    login: {
        name: '登录',
        url: '/buyer/login',
        method: 'POST'
    },
    register: {
        name: '注册',
        url: '/buyer/register',
        method: 'POST'
    },
		updateAddress: {
				name:'更新收货信息',
				url:'/buyer/update/address',
				method:'POST'
		},
		getShopByOpId:{
			name:'根据一级分类获取全部店铺',
			url:'/front/shop/all/op_id',
			method:'POST'
		}
}