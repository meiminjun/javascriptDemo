;
(function(window) {
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
    var M = {
        $namespace: function(name) {
            if (!name) {
                return window;
            }
            var nsArr = name.split('.');
            var ns = window;
            for (i = 0,l = nsArr.length; i < l; i++) {
                var n = nsArr[i];
                ns[n] = ns[n] || {};
            }
            return ns;
        },
        $package: function(ns, func) {
            var me;
            if (typeof ns == "function") {
                func = ns;
                target = window;
            } else if (typeof ns == "string") {
                target = this.$namespace(ns);
            } else if (typeof ns == "object") {
                target = ns;
            }
            func.call(target, this);
        },
        Class: function() {
            var length = arguments.length;
            var option = arguments[length - 1];
            option.init = option.init || function() {};
            if (length === 2) {
                var superClass = arguments[0].extend;
                var tempClass = function() {};
                tempClass.prototype = superClass.prototype;
                var subClass = function() {
                    return new subClass.prototype._init(arguments);
                };
                subClass.superClass = superClass.prototype;
                subClass.callSuper = function(context, func) {
                    var slice = Array.prototype.slice;
                    var a = slice.call(arguments, 2);
                    var func = subClass.superClass[func];
                    if (func) {
                        func.apply(context, a.concat(slice.call(arguments)));
                    }
                };
                subClass.prototype = new tempClass();
                subClass.prototype.constructor = subClass;
                J.extend(subClass.prototype, option);
                subClass.prototype._init = function(args) {
                    this.init.apply(this, args);
                };
                subClass.prototype._init.prototype = subClass.prototype;
                return subClass;
            } else if (length === 1) {
                var newClass = function() {
                    return new newClass.prototype._init(arguments);
                };
                newClass.prototype = option;
                newClass.prototype._init = function(arg) {
                    this.init.apply(this, arg);
                };
                newClass.prototype._init.prototype = newClass.prototype;
                return newClass;
            }
        },
        indexOf: function(arr, elem) {
            var $T = J.type;
            //数组或类数组对象
            if (arr.length) {
                return [].indexOf.call(arr, elem);
            } else if ($T.isObject(arr)) {
                for (var i in arr) {
                    if (arr.hasOwnProperty(i) && arr[i] === elem) {
                        return i;
                    }
                }
            }
        },
        each: function(arr, callback) {
            var $T = J.type;
            if (arr.length) {
                [].forEach.call(arr, callback);
            } else if ($T.isObject(arr)) {
                for (var i in arr) {
                    if (arr.hasOwnProperty(i))
                        if (callback.call(arr[i], arr[i], i, arr) === false) return;
                }
            }
        },
        // Dom: {
        //     getAttr: function(ele, attr) {
        //         var e = ele[0] || {};
        //         var attrs = e.attributes;
        //         if (typeof attrs == 'undefined') {
        //             return "";
        //         } else if (typeof attrs[attr] == 'undefined') {
        //             return "";
        //         } else {
        //             return attrs[attr].value;
        //         }
        //     }
        // },
        // 数字
        Number: {
            // 保留2位小数(4舍5入)，如：2，会在2后面补上00.即2.00
            toDecimalTwo: function(x) {
                var f_x = parseFloat(x);
                if (isNaN(f_x)) {
                    alert('function:toDecimalTwo->parameter error');
                    return false;
                }
                var f_y = Math.round(x * 100) / 100;
                var s_x = f_y.toString();
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
            formatNumber: function(x, num) {
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
            fomatFloat: function(src, pos) {
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
            random: function(min, max) {
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
        isEmpty: function(obj) {
            if (obj == null) return true;
            if (M.isNumber(obj)) return false;
            if (M.Array.isArray(obj) || M.isString(obj)) return obj.length === 0;
            for (var key in obj)
                if (M.has(obj, key)) return false;
            return true;
        },
        has: function(obj, key) {
            return hasOwnProperty.call(obj, key);
        },
        // 继承方法(仿undstore)
        clone: function(obj) {
            forEach(slice.call(arguments, 1), function(source) {
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        }
    };
    window.M = window.Mei = M;
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var forEach = M.forEach = function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (M.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    };
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    forEach(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
        M['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });

})(window);
// type
M.$package(function(M) {
    var ots = Object.prototype.toString;
    var type = {
        isArray: function(o) {
            return o && (o.constructor === Array || ots.call(o) === "[object Array]");
        },
        isObject: function(o) {
            return o && (o.constructor === Object || ots.call(o) === "[object Object]");
        },
        isBoolean: function(o) {
            return (o === false || o) && (o.constructor === Boolean);
        },
        isNumber: function(o) {
            return (o === 0 || o) && o.constructor === Number;
        },
        isUndefined: function(o) {
            return typeof(o) === "undefined";
        },
        isNull: function(o) {
            return o === null;
        },
        isFunction: function(o) {
            return o && (o.constructor === Function);
        },
        isString: function(o) {
            return (o === "" || o) && (o.constructor === String);
        }
    };
    M.type = type;
});
//browser
M.$package(function(M) {
    var ua = navigator.userAgent;
    var platform = {};
    platform.android = ua.indexOf("Android") > -1,
        platform.iPhone = ua.indexOf("iPhone") > -1,
        platform.iPad = ua.indexOf("iPad") > -1,
        platform.iPod = ua.indexOf("iPod") > -1,
        platform.winPhone = ua.indexOf("IE") > -1,
        platform.IOS = platform.iPad || platform.iPhone;
    platform.touchDevice = "ontouchstart" in window;
    M.platform = platform;
});
//dom
M.$package(function(M) {
    var doc = document;
    $T = M.type,
        tagNameExpr = /^[\w-]+$/,
        idExpr = /^#([\w-]*)$/,
        classExpr = /^\.([\w-]+)$/;
        // selectorEngine;
    var hasClassListProperty = 'classList' in document.documentElement;
    var vendors = ['o', 'ms', 'moz', 'webkit'];
    var div = document.createElement('div');
    var $D = {
        $: function(selector, context) {
            var result;
            var qse;
            context = context || doc;
            //优先使用原始的
            if (idExpr.test(selector)) {
                result = this.id(selector.replace("#", ""));
                if (result) return [result];
                else return [];
            } else if (tagNameExpr.test(selector)) {
                result = this.tagName(selector, context);
            } else if (classExpr.test(selector)) {
                result = this.className(selector.replace(".", ""), context);
            }
            // //自定义选择器
            // else if(selectorEngine) result = selectorEngine(selector,context);
            //querySelectorAll
            else result = context.querySelectorAll(selector);
            //nodeList转为array
            return [].slice.call(result);
        },
        id: function(id) {
            return doc.getElementById(id);
        },
        tagName: function(tagName, context) {
            context = context || doc;
            return context.getElementsByTagName(tagName);
        },
        node: function(name) {
            return doc.createElement(name);
        },
        className: function(className, context) {
            context = context || doc;
            return context.getElementsByClassName(className);
        },
        remove: function(node) {
            // TODO:这里应该会有bug
            var context = node.parentNode;
            if (context) context.removeChild(node);
        },
        matchesSelector: function(ele, selector) {
            if (!ele || !selector) return;
            var matchesSelector = ele.webkitMatchesSelector || ele.mozMatchesSelector || ele.oMatchesSelector || ele.matchesSelector;
            if (matchesSelector) return matchesSelector.call(ele, selector);
            var list = this.$(selector);
            if (M.indexOf(list, ele) > 0) return true;
            return false;
        },
        closest: function(elem, selector) {
            while (elem) {
                if ($D.matchesSelector(elem, selector)) {
                    return elem;
                }
                elem = elem.parentNode;
            }
        },
        toDomStyle: function(cssStyle) {
            if (!$T.isString(cssStyle)) return;
            return cssStyle.replace(/\-[a-z]/g, function(m) {
                return m.charAt(1).toUpperCase();
            });
        },
        toCssStyle: function(domStyle) {
            if (!$T.isString(domStyle)) return;
            return domStyle.replace(/[A-Z]/g, function(m) {
                return '-' + m.toLowerCase();
            });
        },
        setStyle: function(elem, styleName, styleValue) {
            var self = this;
            if ($T.isArray(elem)) {
                M.each(elem, function(e) {
                    self.setStyle(e, styleName, styleValue);
                });
                return;
            }
            if ($T.isObject(styleName)) {
                for (var n in styleName) {
                    if (styleName.hasOwnProperty(n)) {
                        elem.style[n] = styleName[n];
                    }
                }
                return;
            }
            if ($T.isString(styleName)) {
                elem.style[styleName] = styleValue;
            }
        },
        //获取带有出产商的属性名
        getVendorPropertyName: function(prop) {
            var style = div.style;
            var _prop;
            if (prop in style) return prop;
            // _prop = prop;
            _prop = prop.charAt(0).toUpperCase() + prop.substr(1);
            for (var i = vendors.length; i--;) {
                var v = vendors[i];
                var vendorProp = v + _prop;
                if (vendorProp in style) {
                    return vendorProp;
                }
            }
        },
        //检测是否支持3D属性
        isSupprot3d: function() {
            // var transformStr = $D.getVendorPropertyName("transform");
            // $D.setStyle(div ,transformStr ,"rotatex(90deg)");
            // if(div.style[transformStr] == "") return false;
            // return true;
            var p_prop = $D.getVendorPropertyName("perspective");
            return p_prop && p_prop in div.style;
        },
        filterSelector: function(arr, selector) {
            return M.filter(arr, function(elem) {
                return $D.matchesSelector(elem, selector);
            });
        },
        addClass: function() {
            if (hasClassListProperty) {
                return function(elem, className) {
                    if (!elem || !className || $D.hasClass(elem, className)) {
                        return;
                    }
                    elem.classList.add(className);
                };
            } else {
                return function(elem, className) {
                    if (!elem || !className || $D.hasClass(elem, className)) {
                        return;
                    }
                    elem.className += " " + className;
                };
            }
        }(),
        hasClass: function() {
            if (hasClassListProperty) {
                return function(elem, className) {
                    if (!elem || !className) {
                        return false;
                    }
                    return elem.classList.contains(className);
                };
            } else {
                return function(elem, className) {
                    if (!elem || !className) {
                        return false;
                    }
                    return -1 < (' ' + elem.className + ' ').indexOf(' ' + className + ' ');
                };
            }
        }(),
        removeClass: function() {
            if (hasClassListProperty) {
                return function(elem, className) {
                    if (!elem || !className || !$D.hasClass(elem, className)) {
                        return;
                    }
                    elem.classList.remove(className);
                };
            } else {
                return function(elem, className) {
                    if (!elem || !className || !$D.hasClass(elem, className)) {
                        return;
                    }
                    elem.className = elem.className.replace(new RegExp('(?:^|\\s)' + className + '(?:\\s|$)'), ' ');
                };
            }
        }(),
        toggleClass: function(ele, className) {
                if ($D.hasClass(ele, className)) {
                    $D.removeClass(ele, className);
                } else {
                    $D.addClass(ele, className);
                }
            }
            /*setSelectorEngine:function(func) {
                selectorEngine = func;
            }*/
    };
    M.dom = $D;
});
// event
M.$package(function(M) {
    var $T = M.type;
    var isDomEvent = function(obj, evtType) {
        //addEventListener supported by ie9+
        return obj.addEventListener && (("on" + evtType).toLowerCase() in obj || "webkitTransitionEnd" == evtType);
    };
    var $E = {
        on: function(obj, evtType, handler) {
            if ($T.isArray(obj)) {
                for (var i = obj.length; i--;) {
                    $E.on(obj[i], evtType, handler);
                }
            }
            //evtType is a string split by space
            if ($T.isString(evtType) && evtType.indexOf(" ") > 0) {
                evtType = evtType.split(" ");
                for (var i = evtType.length; i--;) {
                    $E.on(obj, evtType[i], handler);
                }
                return;
            }
            //handler is an array
            if ($T.isArray(handler)) {
                for (var i = handler.length; i--;) {
                    $E.on(obj, evtType, handler[i]);
                }
                return;
            }
            //evtType is an object
            if ($T.isObject(evtType)) {
                for (var eName in evtType) {
                    $E.on(obj, eName, evtType[eName]);
                }
                return;
            }
            //is dom event support
            if (isDomEvent(obj, evtType)) {
                obj.addEventListener(evtType, handler, false);
                return;
            }
            //dom event in origin element
            if (obj.elem && isDomEvent(obj.elem, evtType)) {
                obj.elem.addEventListener(evtType, handler, false);
                return;
            }
            //is specific custom event
            if (customEvent[evtType]) {
                customEvent[evtType](obj, handler);
                return;
            }
            //other custom event
            if (!obj.events) obj.events = {};
            if (!obj.events[evtType]) obj.events[evtType] = [];
            obj.events[evtType].push(handler);
        },
        once: function(obj, evtType, handler) {
            var f = function() {
                handler();
                $E.off(obj, evtType, f);
            };
            $E.on(obj, evtType, f);
        },
        off: function(obj, evtType, handler) {
            //evtType is a string split by space
            if ($T.isString(evtType) && evtType.indexOf(" ") > 0) {
                evtType = evtType.split(" ");
                for (var i = evtType.length; i--;) {
                    $E.off(obj, evtType[i], handler);
                }
                return;
            }
            //handler is an array
            if ($T.isArray(handler)) {
                for (var i = handler.length; i--;) {
                    $E.off(obj, evtType, handler[i]);
                }
                return;
            }
            //evtType is an object
            if ($T.isObject(evtType)) {
                for (var eName in evtType) {
                    $E.off(obj, eName, evtType[eName]);
                }
                return;
            }
            if (isDomEvent(obj, evtType)) {
                obj.removeEventListener(evtType, handler, false);
                return;
            }
            //dom event in origin element
            if (obj.elem && isDomEvent(obj.elem, evtType)) {
                obj.elem.removeEventListener(evtType, handler, false);
                return;
            }
            //is specific custom event
            if (customEvent[evtType]) {
                customEvent._off(obj, evtType, handler);
                return;
            }
            if (!evtType) {
                obj.events = {};
                return;
            }
            if (obj.events) {
                if (!handler) {
                    obj.events[evtType] = [];
                    return;
                }
                if (obj.events[evtType]) {
                    var evtArr = obj.events[evtType];
                    for (var i = evtArr.length; i--;) {
                        if (evtArr[i] == handler) {
                            evtArr.splice(i, 1);
                            return;
                        }
                    }
                }
            }
        },
        fire: function(obj, evtType) {
            var arg = [].slice.call(arguments, 2);
            //obj is dom element
            if (isDomEvent(obj, evtType)) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(evtType, true, true);
                obj.dispatchEvent(evt);
                return;
            }
            //dom event in origin element
            if (obj.elem && isDomEvent(obj.elem, evtType)) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(evtType, true, true);
                obj.elem.dispatchEvent(evt);
                return;
            }
            if (obj.events && obj.events[evtType]) {
                var handler = obj.events[evtType];
                for (var i = 0, l = handler.length; i < l; i++) {
                    handler[i].apply(window, arg);
                }
            }
        }
    };
    var startEvt, moveEvt, endEvt;
    //选择不同事件
    if (M.platform.touchDevice) {
        startEvt = "touchstart";
        moveEvt = "touchmove";
        endEvt = "touchend";
    } else {
        startEvt = "mousedown";
        moveEvt = "mousemove";
        endEvt = "mouseup";
    }
    var getTouchPos = function(e) {
        var t = e.touches;
        if (t && t[0]) {
            return {
                x: t[0].clientX,
                y: t[0].clientY
            };
        }
        return {
            x: e.clientX,
            y: e.clientY
        };
    };
    //计算两点之间距离
    var getDist = function(p1, p2) {
        if (!p1 || !p2) return 0;
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    };
    //计算两点之间所成角度
    var getAngle = function(p1, p2) {
        var r = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var a = r * 180 / Math.PI;
        return a;
    };
    var customEventHandlers = [];
    var isCustomEvtMatch = function(ch, ele, evtType, handler) {
        return ch.ele == ele && evtType == ch.evtType && handler == ch.handler;
    };
    //自定义事件
    var customEvent = {
        _fire: function(ele, evtType, handler) {
            M.each(customEventHandlers, function(ch) {
                if (isCustomEvtMatch(ch, ele, evtType, handler)) {
                    handler.call(ele, {
                        type: evtType
                    });
                }
            });
        },
        _off: function(ele, evtType, handler) {
            M.each(customEventHandlers, function(ch, i) {
                var at = ch.actions;
                if (isCustomEvtMatch(ch, ele, evtType, handler)) {
                    //删除辅助处理程序
                    for (var n in at) {
                        var h = at[n];
                        if ($T.isObject(h)) {
                            //非绑定在该元素的handler
                            $E.off(h.ele, n, h.handler);
                        } else {
                            $E.off(ele, n, h);
                        }
                    }
                    //删除本处理程序数据
                    customEventHandlers.splice(i, 1);
                    return;
                }
            });
        },
        tap: function(ele, handler) {
            //按下松开之间的移动距离小于20，认为发生了tap
            var TAP_DISTANCE = 20;
            //双击之间最大耗时
            var DOUBLE_TAP_TIME = 300;
            var pt_pos;
            var ct_pos;
            var pt_up_pos;
            var pt_up_time;
            var evtType;
            var startEvtHandler = function(e) {
                // e.stopPropagation();
                var touches = e.touches;
                if (!touches || touches.length == 1) { //鼠标点击或者单指点击
                    ct_pos = pt_pos = getTouchPos(e);
                }
            };
            var moveEvtHandler = function(e) {
                // e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            };
            var endEvtHandler = function(e) {
                // e.stopPropagation();
                var now = Date.now();
                var dist = getDist(ct_pos, pt_pos);
                var up_dist = getDist(ct_pos, pt_up_pos);
                if (dist < TAP_DISTANCE) {
                    if (pt_up_time && now - pt_up_time < DOUBLE_TAP_TIME && up_dist < TAP_DISTANCE) {
                        evtType = "doubletap";
                    } else {
                        evtType = "tap";
                    }
                    handler.call(ele, {
                        target: e.target,
                        oriEvt: e,
                        type: evtType,
                        isDoubleTap: true
                    });
                }
                pt_up_pos = ct_pos;
                pt_up_time = now;
            };
            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            $E.on(ele, endEvt, endEvtHandler);
            var evtOpt = {
                ele: ele,
                evtType: evtType,
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;
            customEventHandlers.push(evtOpt);
        },
        hold: function(ele, handler) {
            //按下松开之间的移动距离小于20，认为点击生效
            var HOLD_DISTANCE = 20;
            //按下两秒后hold触发
            var HOLD_TIME = 2000;
            var holdTimeId;
            var pt_pos;
            var ct_pos;
            var startEvtHandler = function(e) {
                e.stopPropagation();
                var touches = e.touches;
                if (!touches || touches.length == 1) { //鼠标点击或者单指点击
                    pt_pos = ct_pos = getTouchPos(e);
                    pt_time = Date.now();
                    holdTimeId = setTimeout(function() {
                        if (touches && touches.length != 1) return;
                        if (getDist(pt_pos, ct_pos) < HOLD_DISTANCE) {
                            handler.call(ele, {
                                oriEvt: e,
                                target: e.target,
                                type: "hold"
                            });
                        }
                    }, HOLD_TIME);
                }
            };
            var moveEvtHandler = function(e) {
                e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            };
            var endEvtHandler = function(e) {
                e.stopPropagation();
                clearTimeout(holdTimeId);
            };
            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            $E.on(ele, endEvt, endEvtHandler);
            var evtOpt = {
                ele: ele,
                evtType: "hold",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;
            customEventHandlers.push(evtOpt);
        },
        swipe: function(ele, handler) {
            //按下之后移动30px之后就认为swipe开始
            var SWIPE_DISTANCE = 30;
            //swipe最大经历时间
            var SWIPE_TIME = 500;
            var pt_pos;
            var ct_pos;
            var pt_time;
            var pt_up_time;
            var pt_up_pos;
            //获取swipe的方向
            var getSwipeDirection = function(p2, p1) {
                var dx = p2.x - p1.x;
                var dy = -p2.y + p1.y;
                var angle = Math.atan2(dy, dx) * 180 / Math.PI;
                if (angle < 45 && angle > -45) return "right";
                if (angle >= 45 && angle < 135) return "top";
                if (angle >= 135 || angle < -135) return "left";
                if (angle >= -135 && angle <= -45) return "bottom";
            };
            var startEvtHandler = function(e) {
                // e.stopPropagation();
                var touches = e.touches;
                if (!touches || touches.length == 1) { //鼠标点击或者单指点击
                    pt_pos = ct_pos = getTouchPos(e);
                    pt_time = Date.now();
                }
            };
            var moveEvtHandler = function(e) {
                // e.stopPropagation();
                e.preventDefault();
                ct_pos = getTouchPos(e);
            };
            var endEvtHandler = function(e) {
                // e.stopPropagation();
                var dir;
                pt_up_pos = ct_pos;
                pt_up_time = Date.now();
                if (getDist(pt_pos, pt_up_pos) > SWIPE_DISTANCE && pt_up_time - pt_time < SWIPE_TIME) {
                    dir = getSwipeDirection(pt_up_pos, pt_pos);
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "swipe",
                        direction: dir
                    });
                }
            };
            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            $E.on(ele, endEvt, endEvtHandler);
            var evtOpt = {
                ele: ele,
                evtType: "swipe",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            evtOpt.actions[endEvt] = endEvtHandler;
            customEventHandlers.push(evtOpt);
        },
        transform: function(ele, handler) {
            var pt_pos1;
            var pt_pos2;
            var pt_len; //初始两指距离
            var pt_angle; //初始两指所成角度
            var startEvtHandler = function(e) {
                var touches = e.touches;
                if (!touches) return;
                if (touches.length == 2) { //双指点击
                    pt_pos1 = getTouchPos(e.touches[0]);
                    pt_pos2 = getTouchPos(e.touches[1]);
                    pt_len = getDist(pt_pos1, pt_pos2);
                    pt_angle = getAngle(pt_pos1, pt_pos2);
                }
            };
            var moveEvtHandler = function(e) {
                e.preventDefault();
                var touches = e.touches;
                if (!touches) return;
                if (touches.length == 2) { //双指点击
                    var ct_pos1 = getTouchPos(e.touches[0]);
                    var ct_pos2 = getTouchPos(e.touches[1]);
                    var ct_len = getDist(ct_pos1, ct_pos2);
                    var ct_angle = getAngle(ct_pos1, ct_pos2);
                    var scale = ct_len / pt_len;
                    var rotation = ct_angle - pt_angle;
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "transform",
                        scale: scale,
                        rotate: rotate
                    });
                }
            };
            $E.on(ele, startEvt, startEvtHandler);
            $E.on(ele, moveEvt, moveEvtHandler);
            var evtOpt = {
                ele: ele,
                evtType: "transform",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions[startEvt] = startEvtHandler;
            evtOpt.actions[moveEvt] = moveEvtHandler;
            customEventHandlers.push(evtOpt);
        },
        scrollstart: function(ele, handler) {
            var isScrolling;
            var scrollTimeId;
            var scrollHandler = function(e) {
                if (!isScrolling) {
                    isScrolling = true;
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "scrollstart"
                    });
                }
                clearTimeout(scrollTimeId);
                scrollTimeId = setTimeout(function() {
                    isScrolling = false;
                }, 250);
            };
            $E.on(ele, "scroll", scrollHandler);
            var evtOpt = {
                ele: ele,
                evtType: "scrollstart",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.scroll = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        scrollend: function(ele, handler) {
            var scrollTimeId;
            var scrollHandler = function(e) {
                clearTimeout(scrollTimeId);
                scrollTimeId = setTimeout(function() {
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "scrollend"
                    });
                }, 250);
            };
            $E.on(ele, "scroll", scrollHandler);
            var evtOpt = {
                ele: ele,
                evtType: "scrollend",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.scroll = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        scrolltobottom: function(ele, handler) {
            var body = document.body;
            var scrollHandler = function(e) {
                if (body.scrollHeight <= body.scrollTop + window.innerHeight) {
                    handler.call(ele, {
                        oriEvt: e,
                        target: e.target,
                        type: "scrolltobottom"
                    });
                }
            };
            $E.on(ele, "scroll", scrollHandler);
            var evtOpt = {
                ele: ele,
                evtType: "scrolltobottom",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.scroll = scrollHandler;
            customEventHandlers.push(evtOpt);
        },
        //兼容性更好的orientationchange事件，这里使用resize实现。不覆盖原生orientation change 和 resize事件
        ortchange: function(ele, handler) {
            var pre_w = window.innerWidth;
            var resizeHandler = function(e) {
                var current_w = window.innerWidth,
                    current_h = window.innerHeight,
                    orientation;
                if (pre_w == current_w) return;
                if (current_w > current_h) {
                    orientation = "landscape";
                } else {
                    orientation = "portrait";
                }
                handler.call(ele, {
                    oriEvt: e,
                    target: e.target,
                    type: "ortchange",
                    orientation: orientation
                });
                pre_w = current_w;
            };
            $E.on(window, "resize", resizeHandler);
            var evtOpt = {
                ele: ele,
                evtType: "ortchange",
                handler: handler
            };
            evtOpt.actions = {};
            evtOpt.actions.resize = resizeHandler;
            customEventHandlers.push(evtOpt);
        }
    };
    M.event = $E;
});


M.$package(function(M) {
        var $D = M.dom;
        var Util = {
            // 显示蒙板
            showMask:function() {
                var maskNode = document.getElementById('mask');
                if(!maskNode) {
                    var maskNode = document.createElement("div");
                    maskNode.className = "mask";
                    maskNode.id = "mask";
                    document.body.insertBefore(maskNode,document.body.children[0]);
                }
            },
            hideMask:function() {
                var maskNode = document.getElementById('mask');
                if(maskNode) {
                    $D.remove(maskNode);
                }
            }
        }
        M.Util = Util;
});