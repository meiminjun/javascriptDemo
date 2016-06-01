/*
 * @Author: meiminjun
 * @Date:   2016-05-20 17:13:52
 * @Last Modified by:   meiminjun
 * @Last Modified time: 2016-05-20 17:53:45
 */
Mei.$package("Mei", function(M) {
    var $D = M.dom,
        $E = M.event,
        $U = M.Util;

    // <div id="mei-actionsheet" class="mei-actionsheet">
    //     <div style="width:100%">
    //         <a class="blue">标题</a>
    //         <a class="as-blue">
    //             第一行内容
    //         </a>
    //         <a class="blue">
    //             第一行内容
    //         </a>
    //         <a class="cancel">取消</a>
    //     </div>
    // </div>


    // actionsheet组件
    var ActionSheet = function(data) {
        if (!data) {
            return;
        }
        var _data = [];
        if (data.items&&data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                var _itemObj = {};
                var item = data.items[i];
                var node;
                // _itemObj.text = item.text;
                // _itemObj[i].className = item.cssClasses || "blue";
                _itemObj.click = item.click || function() {};
                node = document.createElement("a");
                node.className = item.cssClasses || "blue";
                node.innerHTML = item.text || "";
                _itemObj.node = node;
                _data.push(_itemObj);
            }
        }else {
            alert("参数不对");
        }
        this.data = _data;
        // 创建面板
        this.panel = document.createElement('div');
        // 为ActionSheet创建面板添加类
        this.panel.id = 'mei-actionsheet';
        this.panel.className = 'mei-actionsheet';

        // 创建容器
        this.contentPanel = document.createElement('div');
        this.contentPanel.style.width = "100%";

        // 创建title
        this.titleNode = document.createElement('a');
        // 为标题添加样式类
        this.titleNode.className = 'blue';
        // 标题文案
        this.titleNode.innerHTML = data.title || '温馨提示';

        // 创建取消按钮
        this.cancelNode = document.createElement('a');
        this.cancelNode.className = 'cancel';
        this.cancelNode.innerHTML = '取消';
        // 插入到页面中
        document.body.appendChild(this.panel);
    };
    ActionSheet.prototype = {
        // 初始化方法
        init: function() {
            var me = this;
            var _data = this.data;
            this.panel.appendChild(this.contentPanel);
            this.contentPanel.appendChild(this.titleNode);
            for (var i = 0; i < _data.length; i++) {
                this.contentPanel.appendChild(_data[i].node);
                // 绑定事件
                me.bindEvent(_data[i]);
            }
            this.contentPanel.appendChild(this.cancelNode);
            this.cancelNode.onclick = function() {
                me.hide();
            }
        },
        bindEvent: function(node) {
            var me = this;
            node.node.onclick = function() {
                var target = this;
                // 响应点击事件
                node.click(target);
                // 隐藏弹窗
                me.hide();
            }
        },
        hide: function() {
            this.panel.style.display = "none";
        },
        show:function() {
            this.panel.style.display = "block";
        }
    };
    M.ActionSheet = ActionSheet;
});