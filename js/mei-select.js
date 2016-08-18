Mei.$package("Mei", function(M) {
    var $D = M.dom,
        $E = M.event,
        $U = M.Util;

    // 格式化字符串方法
    function formateString(str, data) {
        return str.replace(/\{#(\w+)#\}/g, function(match, key) {
            return typeof data[key] === 'undefined' ? '' : data[key]
        });
    }

    var Select = function(data) {
        if (!data && !data.ele && !data.items && !data.display) {
            return;
        }
        this.$eleNode = $D.$("#" + data.ele);
        this.eleNode = document.getElementById(data.ele);
        this.data = data;

        // 为select创建面板
        this.panel = document.createElement('div');
        this.panel.className = 'mei-select';
        this.panel.id = 'mei-select';
        this.panel.click = data.callback || function() {};
        // 创建容器
        this.contentPanel = document.createElement('div');
        this.contentPanel.style.width = "100%";

        // 创建title
        this.titleNode = document.createElement('a');
        // 为标题添加样式类
        this.titleNode.className = 'blue';
        // 标题文案
        this.titleNode.innerHTML = data.title || '温馨提示';

        this.display = data.display;
        this.items = data.items;
        // 创建基础样式模板
        this.item = '<a class="at-btn" value = "{#' + this.display.valueName + '#}">{#' + this.display.keyName + '#}</a>';
        // 创建字符串
        this.itemHtml = '';
        // 格式化数据
        for (var i = 0, len = data.items.length; i < len; i++) {
            this.itemHtml += formateString(this.item, this.items[i]);
        }
        this.itemNode = document.createElement("div");
        this.itemNode.innerHTML = this.itemHtml;

        // $E.on(eleNode,'tap',function() {
        //     alert(111);
        // });

    }

    Select.prototype = {
        // 初始化方法
        init: function() {
            var me = this;
             // 插入到页面中
            document.body.appendChild(this.panel);
            this.panel.appendChild(this.contentPanel);
            this.contentPanel.appendChild(this.titleNode);
            this.contentPanel.appendChild(this.itemNode);
            this.show();
            this.bindEvent(this.panel);
        },
        bindEvent: function(node) {
            var me = this;
            node.onclick = function(e) {
                var target = e.target;
                if(target.className == "at-btn") {
                  // 隐藏弹窗
                  me.hide();
                  // 响应点击事件
                  node.click({text:target.innerHTML,value:target.value},this.data,target,this);
                }
            }
        },
        hide: function() {
            this.panel.style.display = "none";
        },
        show: function() {
            this.panel.style.display = "block";
        }
    };
    M.Select = Select;
});
