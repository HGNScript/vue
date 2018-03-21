new Vue({
	el: ".container",
	data: {
		res: [],
		resLength: 0,    //总数据的长度
		resFlag: false,  //是否显示总数据(默认显示三条数据)
	},
	methods: {
		log: function(data) {
			console.log(data)
		},
		/**
		 * 加载函数
		 * @param  {[type]} height res需要的长度
		 */
		load: function(height) {
			var _this = this;
			axios.get('getAll').then(function(response) {
				_this.res = response.data
				_this.resLength = _this.res.length
				_this.res = _this.resEdit(_this.res, height)
			}).catch(function(error) {
				_this.log(error);
			});
		},
		/**
		 * 提交函数
		 * @param  {[type]}   url  提交的地址
		 * @param  {[type]}   data 提交数据
		 * @param  {Function} fn   回调函数
		 */
		axios: function(url, data, fn) {
			var _this = this
			axios({
					url: url,
					method: 'post',
					data: data,
					transformRequest: [function(data) {
						// Do whatever you want to transform the data
						let ret = ''
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
					}
				}).then((response) => {
					if (fn) fn()
				})
				.catch((error) => {
					console.log(error);
				});
		},
		/**
		 * 设置默认地址
		 * @param  {[type]} item 需要设置的地址对象
		 */
		defAds: function(item) {
			var _this = this
			var ids = new Array();
			this.res.forEach(function(item, index) {
				ids[index] = item.ads_id
			})
			var id = item.ads_id
			var data = [ids, id]

			function fn() {
				if (!_this.resFlag) {
					_this.load()
				}else {
					_this.load(_this.resLength)
				}
			}
			this.axios('setData', data, fn)
		},
		/**
		 * 总数据的编辑
		 * @param  {[type]} res    总数据
		 * @param  {[type]} length 长度 默认为3
		 */
		resEdit: function(res, length) {
			return res.slice(0, length || 3)
		},
		/**
		 * 更多函数(res总数据的编辑)
		 * @return {[type]} [description]
		 */
		more: function() {
			if (!this.resFlag) {
				this.load(this.resLength)
				this.resFlag = !this.resFlag
			} else {
				this.load()
				this.resFlag = !this.resFlag
			}
		}

	},
	mounted: function() {
		this.$nextTick(function() {
			this.load()
		})
	},
})