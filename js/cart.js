new Vue({
    el: '#app',
    data: {
        res: [],
        delFlag: false,
        delId: '',
    },
    methods: {
        log: function(data) {
            console.log(data)
        },
        /**
         * 商品数量编辑
         * @param  {[type]} obj 当前商品对象
         * @param  {[type]} msg 判断数量的编辑模式
         */
        countEdit: function(obj, msg) {
            if (msg < 0) {
                obj.count--
                    if (obj.count < 1) {
                        obj.count = 1
                    }
                var data = new Array();
                data['cart_id'] = obj.cart_id
                data['count'] = obj.count

                this.axios('vue/Index/setData', data);

            } else {
                obj.count++
                var data = new Array();
                data['cart_id'] = obj.cart_id
                data['count'] = obj.count

                this.axios('vue/Index/setData', data);

            }
        },
        /**
         * 选中商品
         * @param  {[type]} item 当前商品
         */
        check: function(item) {
            item.checked = !item.checked
        },
        /**
         * 取消全选
         */
        outCheck: function() {
            this.res.forEach(item => item.checked = false)
        },
        /**
         * 删除提示框的显示和隐藏,获取删除商品的id
         * @param  {[type]} tag 是否显示删除提示框
         * @param  {[type]} id  当前需要删除的商品的id
         */
        fdelFlag: function(tag, id) {
            this.delFlag = tag
            if (this.delFlag) this.delId = id
        },
        /**
         * 删除选中的商品
         */
        delData: function() {
            var _this = this

            this.delFlag = false
            var data = new Array()
            data['id'] = this.delId

            function fn() {
                _this.delFlag = false
                _this.load()
            }
            this.axios('vue/Index/delData', data, fn)
        },
        /**
         * 加载数据库的数据
         */
        load: function() {
            var _this = this;
            axios.get('vue/Index/getAll').then(function(response) {
                _this.res = response.data
                _this.res.forEach(function(item, index) {
                    _this.$set(item, 'checked', false)
                })
            }).catch(function(error) {
                _this.log(error);
            });
        },
        /**
         * 使用axios 提交数据和获取数据
         * @param  {[type]}   url  提交的目标网页
         * @param  {[type]}   data 提交的数据
         * @param  {Function} fn   回调函数()
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
    },
    filters: {
        money: function(value, type) {
            if (type) {
                return type + value.toFixed(2)
            } else {
                return "¥" + value.toFixed(2)
            }
        }
    },
    created: function() {
            this.load()
    },
    computed:{
        checkFlag: {
            get: function() {
                return this.res.every(item => item.checked)
            },
            set: function(val) {
                this.res.forEach(item => item.checked = val)
            }
        },
        allAmount: {
            get: function() {
                return this.res.reduce( (prev, curr) => {
                    if (!curr.checked) return prev
                      return prev + curr.count*curr.price
                },0);
            },
        },
    },
})