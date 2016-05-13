;(function (window) {
    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var nativeIsArray = Array.isArray,
        nativeForEach = ArrayProto.forEach;
    var Mei = {
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
            for (var key in obj) if (Mei.has(obj, key)) return false;
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
    window.Mei = Mei;
})(window);