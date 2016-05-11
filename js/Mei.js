var Mei = {
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
        }
    }
};