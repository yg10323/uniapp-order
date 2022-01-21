export default {

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
	}
}
