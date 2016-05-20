/*
* @Author: meiminjun
* @Date:   2016-05-20 17:13:52
* @Last Modified by:   meiminjun
* @Last Modified time: 2016-05-20 17:53:45
*/

Mei.$package("Mei",function(M) {
    var $D = M.dom,
        $E = J.event,
        $U = M.Util;
    // actionsheet组件
    var ActionSheet = function(data) {
        if (!data) {
            return;
        }
        var _data = [];
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                _data[i].text = item.text;
                _data[i].className = item.cssClasses || "as-blue";
                _data[i].click = item.click || function() {};
            }
        }
        this.data = _data;
        // 创建面板
        this.panel = document.createElement('div');
        // 创建title
        this.titleNode = document.createElement('p');
        //
        // 为ActionSheet创建面板添加类
        this.panel.className = 'actionSheet';
        // 为标题添加样式类
        this.titleNode.className = 'as-title';
    };
    ActionSheet.prototype = {
        // 初始化方法
        init: function() {
            var _data = this.data;
            for (var i = 0; i < _data.length; i++) {}
            this.panel.appendChild();
        }
    };
    this.ActionSheet = ActionSheet;
});