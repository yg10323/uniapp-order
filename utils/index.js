export default {
	/**
	 * 格式化时间
	 * @param {*} timestamp 
	 * @returns 年-月-日 时:分:秒
	 */
	formatTime(timestamp) {
		const d = new Date(parseInt(timestamp)); //根据时间戳生成的时间对象
		const date = (d.getFullYear()) + "-" +
			(d.getMonth() + 1) + "-" +
			(d.getDate()) + " " +
			(d.getHours()) + ":" +
			(d.getMinutes()) + ":" +
			(d.getSeconds());
		return date;
	},
	/**
	 * 格式化时间
	 * @param {*} timestamp 
	 * @returns 时:分
	 */
	formatHour(timestamp) {
		const d = new Date(parseInt(timestamp)); //根据时间戳生成的时间对象
		const date =
			(d.getHours()) + ":" +
			(d.getMinutes())
		return date;
	},
	/**
	 * 对象递归删除空数据, 返回新对象
	 * @param {any} data
	 * @returns  
	 */
	deepRemove(data) {
		// 对非对象进行过滤
		if (typeof data !== 'object') return data
		// 对null undefined 进行过滤
		if (data == undefined) return data
		// 对 RegExp Date Function 进行过滤
		if (data instanceof RegExp) return new RegExp(data)
		if (data instanceof Date) return new Date(data)
		if (data instanceof Function) return new Function(data)
		// 创建对应类型的实例
		let newData = new data.constructor()
		// 递归: 清除所有空串、undefined、null、以及对象属性值为空的属性
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				let res = this.deepRemove(data[key])
				// 判断非空属性,并对其进行保留 (0也要保留)
				if ((res || res === 0) && JSON.stringify(res) !== '[]' && JSON.stringify(res) !== '{}') {
					newData[key] = res
				}
			}
		}

		return newData
	},

	// 对deepRemove返回的数据进一步处理
	// 调用此函数
	removeEmpty(data) {
		const res = this.deepRemove(data)
		let finalData;
		// data如果是数组, 可能会出现empty的元素, 对此进行清除
		if (res instanceof Array) {
			finalData = res.filter(item => item || item === 0)
		} else {
			// data是对象,不做处理
			finalData = res
		}

		return finalData
	},

	/**
	 * 对象深拷贝
	 * @param  obj 
	 * @returns newObj
	 */
	deepClone(obj) {
		// 对非对象进行过滤
		if (typeof obj !== 'object') return obj

		// 对null undefined 进行过滤
		if (obj == undefined) return obj

		// 对 RegExp Date Function 进行过滤
		if (obj instanceof RegExp) return new RegExp(obj)
		if (obj instanceof Date) return new Date(obj)
		if (obj instanceof Function) return new Function(obj)

		// 利用constructor进行实例化, 不管是对象还是数组
		let newObj = new obj.constructor()
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				newObj[key] = this.deepClone(obj[key])
			}
		}

		return newObj
	},

	/**
	 * 根据食品分类合并食品
	 */
	mergefoods(foods) {
		let data = this.deepClone(foods);
		// let data = foods;
		let foodInfoArray = [];
		const classifyArray = []
		// 获取全部的分类
		for (let i = 0; i < data.length; i++) {
			classifyArray.push(data[i].food_classify)
		}
		// 获取去重后的分类
		const newClassifyArray = [...new Set(classifyArray)]

		for (let i in newClassifyArray) {
			const o = {
				classify: newClassifyArray[i],
				list: []
			}

			for (let j in classifyArray) {
				if (data[j].food_classify === newClassifyArray[i]) {
					o.list.push(data[j])
				}
			}

			foodInfoArray.push(o);
		}

		return foodInfoArray
	},
	/**
	 * 合并相同订单(id在数据库经过排序)
	 * @param {Object} orders 
	 * @returns Object data
	 */
	dealOrderData(orders) {
		let data = this.deepClone(orders);

		let current_id, next_id;
		let foodInfoArray = [];
		let foodDataArray = [];

		for (let i = 0; i < data.length; i++) {
			const temp = {
				shop_id: data[i].shop_info.id,
				data: {
					shop_info: data[i].shop_info,
					food_data: ""
				}
			}
			current_id = data[i].id;
			// next_id为undefined表示数组只有一个元素或遍历到了最后一个元素
			// 当遍历到最后一个元素的时候, 同样需要往foodInfoArray添加一次
			if (data[i + 1]) {
				next_id = data[i + 1].id;
			} else {
				foodDataArray.push(data[i].food_info)
				temp.data.food_data = foodDataArray
				foodInfoArray.push(temp)
				data[i].food_info = foodInfoArray
				return data;
			}
			// 能来到下面说明至少有两个数据项
			// 记录重复id的food_info
			if (current_id === next_id) {
				// 判断是否属于同一店铺
				if (data[i].shop_info.id === data[i + 1].shop_info.id) {
					foodDataArray.push(data[i].food_info)
				} else {
					temp.data.food_data = foodDataArray
					foodDataArray = []
					foodInfoArray.push(temp)
				}
				data.splice(i, 1)
				i = i - 1; //i减一为了保证下次遍历从当前下标开始
			} else {
				// 当id不相同时, 将foodInfoArray赋值给food_info
				foodDataArray.push(data[i].food_info)
				temp.data.food_data = foodDataArray
				foodInfoArray.push(temp)
				data[i].food_info = foodInfoArray
				foodInfoArray = [];
				foodDataArray = []
			}
		}
	}
}
