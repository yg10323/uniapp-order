export default {
	sendDeviceId: {
		name: '扫码登陆时发送设备id',
		url: '/seller/send_deviceid',
		method: 'POST',
	},
	scanLogin: {
		name: '扫码登陆',
		url: '/seller/scan_login',
		method: 'POST',
	},
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
	getShopById: {
		name: '根据店铺id获取店铺信息',
		url: '/front/shop/by_id',
		method: 'POST',
	},
	getShopFood: {
		name: '获取店铺食品',
		url: '/front/shop/food',
		method: 'POST'
	},
	getShopByOpId: {
		name: '根据一级分类获取全部店铺',
		url: '/front/shop/all/op_id',
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
	purchase: {
		name: '创建订单',
		url: '/buyer/purchase',
		method: 'POST'
	},
	updateAddress: {
		name: '更新收货信息',
		url: '/buyer/update/address',
		method: 'POST'
	},
	getOrder: {
		name: '获取个人订单信息',
		url: '/buyer/order',
		method: 'get'
	},
	evaluate: {
		name: '评价订单',
		url: '/buyer/evaluate',
		method: 'POST'
	},
	updateOrder: {
		name: '更新订单',
		url: '/buyer/update/order',
		method: 'POST'
	},
	getEvaluates: {
		name: '获取个人评价',
		url: '/buyer/self/evaluate',
		method: 'get'
	},
	deleteEvaluate: {
		name: '删除个人评价',
		url: '/buyer/delete/evaluate',
		method: 'post'
	},
	getShopEvaluates: {
		name: '获取店铺评价',
		url: '/shop/evaluates',
		method: 'post'
	}
}
