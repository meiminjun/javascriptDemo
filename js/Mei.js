;
(function (window) {
    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeIsArray = Array.isArray,
        nativeForEach = ArrayProto.forEach;
    var Mei = {
        Dom: {
            getAttr: function (ele, attr) {
                var e = ele[0] || {};
                var attrs = e.attributes;
                if (typeof attrs == 'undefined') {
                    return "";
                } else if (typeof attrs[attr] == 'undefined') {
                    return "";
                } else {
                    return attrs[attr].value;
                }
            }
        },
        /**
         * 模板方法
         */
        Template: {},
        // 数组方法
        Array: {
            isArray: nativeIsArray || function (obj) {
                return toString.call(obj) == '[object Array]';
            }
        },
        // 数字
        Number: {
            // 保留2位小数(4舍5入)，如：2，会在2后面补上00.即2.00
            toDecimalTwo: function (x) {
                var f_x = parseFloat(x);
                if (isNaN(f_x)) {
                    alert('function:toDecimalTwo->parameter error');
                    return false;
                }
                var f_x = Math.round(x * 100) / 100;
                var s_x = f_x.toString();
                var pos_decimal = s_x.indexOf('.');
                if (pos_decimal < 0) {
                    pos_decimal = s_x.length;
                    s_x += '.';
                }
                while (s_x.length <= pos_decimal + 2) {
                    s_x += '0';
                }
                return s_x;
            },
            /**
             * 保留几位小数(4舍5入)
             * @param  {[type]} x   [小数]
             * @param  {[type]} num [要保留的位数]
             * @return {[type]}     [description]
             */
            formatNumber: function (x, num) {
                var f = parseFloat(x);
                if (isNaN(f) || isNaN(num)) {
                    return;
                }
                return f.toFixed(num);
            },
            /**
             * 强制保留几位小数(不4舍5入)
             * 当为整数时，则直接返回整数
             * @param  {[type]} src [description]
             * @param  {[type]} pos [description]
             * @return {[type]}     [description]
             */
            fomatFloat: function (src, pos) {
                var s = src || 0;
                var num = pos + 1;
                var result = 0;
                if (typeof src !== "string") {
                    s = src.toString();
                }
                // 如果传入的为整数,则返回整数
                if (s.indexOf(".") !== -1) {
                    result = Number(s.substr(0, s.indexOf(".") + num)) || 0;
                } else {
                    result = src;
                }
                return result;
            },
            /**
             * 随机生成数字
             * @param  {[type]} min [description]
             * @param  {[type]} max [description]
             * @return {[type]}     [description]
             */
            random: function (min, max) {
                if (max == null) {
                    max = min;
                    min = 0;
                }
                return min + Math.floor(Math.random() * (max - min + 1));
            },
        },
        /**
         * [isEmpty description]
         * @param  {[type]}  obj [description]
         * @return {Boolean}     [description]
         */
        isEmpty: function (obj) {
            if (obj == null) return true;
            if (Mei.isNumber(obj)) return false;
            if (Mei.Array.isArray(obj) || Mei.isString(obj)) return obj.length === 0;
            for (var key in obj)
                if (Mei.has(obj, key)) return false;
            return true;
        },
        has: function (obj, key) {
            return hasOwnProperty.call(obj, key);
        },
        // 继承方法
        extend: function (obj) {
            each(slice.call(arguments, 1), function (source) {
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        }
    };
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = Mei.each = Mei.forEach = function (obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (Mei.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
        Mei['is' + name] = function (obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

    var Alert = function (data) {
        if (!data) {
            return;
        }
        this.content = data.content;
        // 创建提示面板
        this.panel = document.createElement('div');
        // 创建title
        this.titleNode = document.createElement('p');
        // 创建提示内容组件
        this.contentNode = document.createElement('p');
        // 创建确定按钮
        this.confirmBtn = document.createElement('span');
        // 创建取消按钮
        this.cancelBtn = document.createElement('span');
        // 创建关闭按钮
        this.closeBtn = document.createElement('b');
        // 为提示框创建面板添加类
        this.panel.className = 'alert';
        // 为关闭按钮添加样式类
        this.closeBtn.className = 'a-close';
        // 为确定按钮添加样式类
        this.confirmBtn.className = 'a-confirm';

        // 标题文案
        this.titleNode.innerHTML = data.title || '温馨提示';
        // 为确定按钮添加文案
        this.confirmBtn.innerHTML = data.confirm || '确认';
        // 为提示内容添加文本
        this.contentNode.innerHTML = this.content;
        // 点击确定按钮执行方法 如果 data中有success方法则为success方法，否则为空函数
        this.success = data.success || function () {
            };
        // 点击关闭按钮执行方法
        this.fail = data.fail || function () {
            };
    }

    Alert.prototype = {
        // 创建方法
        init: function () {
            // 生成提示框
            this.panel.appendChild(this.titleNode);
            this.panel.appendChild(this.closeBtn);
            this.panel.appendChild(this.contentNode);
            this.panel.appendChild(this.confirmBtn);
            // 插入到页面中
            document.body.appendChild(this.panel);
            // 绑定事件
            this.bindEvent();
            // 显示提示框
            this.show();
        },
        bindEvent: function () {
            var me = this;
            // 关闭按钮点击事件
            this.closeBtn.onclick = function () {
                // 执行关闭取消方法
                me.fail();
                // 隐藏弹窗
                me.hide();
            }
            // 确定按钮点击事件
            this.confirmBtn.onclick = function () {
                // 执行点击事件方法
                me.success();
                // 隐藏弹窗
                me.hide();
            }
        },
        // 隐藏弹窗方法
        hide: function () {
            this.panel.style.display = 'none';
        },
        // 显示弹窗方法
        show: function () {
            this.panel.style.display = 'block';
        }
    };
    Mei.Template.Alert = Alert;
    window.Mei = Mei;
})(window);