/**
 * 本地存储类
 * 参数 preId 本地存贮数据库的前缀
 * 参数 timeSign 时间戳
 */

var BaseLocalStorage = function (preId,timeSign) {
    this.preId = preId;
    this.timeSign = timeSign;
}

BaseLocalStorage.prototype = {
    state : {
        SUCCESS : 0,    // 成功
        FAILURE : 1,    // 失败
        OVERFLOW : 2,   // 溢出
        TIMEOUT : 3,    // 过期
    },
    // 保存本地数据链接
    storeage : localStorage || window.localStorage,
    // 获取本地存储链接
    getKey : function(key) {
        return this.preId + key;
    },
    // 添加(修改)数据
    set : function(key, value, callback, time) {
        var status = this.status.SUCCESS,
            key = this.getKey(key);
        try{
            time = new Date(time).getTime() || time.getTime();
        }catch(e) {
            time = new Date().getTime() + 1000 * 60 * 60 * 24 * 31;
        }
        try{
            this.storeage.setItem(key, time + this.timeSign + value);
        }catch(e) {
            status = this.status.OVERFLOW;
        }
        callback && callback.call(this, status, key, value);
    },
    // 获取数据
    get : function(key, callback) {
        var status = this.status.SUCCESS,
            key = this.getKey(key),
            value = null,
            timeSignLen = this.timeSign.length,
            that = this,
            index,
            time,
            result;
        try{
            value = that.storeage.getItem(key);
        }catch(e) {
            // 获取失败则返回失败状态，数据结果为null
            result = {
                status : that.status.FAILURE,
                value : null
            };
            callback && callback.call(this, result.status, result.value);
            return result;
        }
        if(value) {
            // 获取时间戳与存储数据之间的拼接符起始位置
            index = value.slice(0, index);
            // 获取时间戳
            time = +value.slice(0, index);
            // 如果时间为过期
            if(new Date(time).getTime() >  new Date().getTime() || time == 0 ) {
                // 获取数据结果(拼接后面的字符串)
                value = value.slice(index + timeSignLen);
            }else{
                // 过期状态为空
                value = null,
                // 设置状态为过期状态
                status = that.status.TIMEOUT;
                // 删除该字段
                that.remove(key);
            }
        }else {
            status = that.status.FAILURE;
        }
    },
    // 删除数据
    remove : function() {
        
    }
}