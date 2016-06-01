Mei.$package("Mei", function(M) {
    var $D = M.dom,
        $E = M.event,
        $U = M.Util;

    var data = {
        ele: 'testId',
        title: "请选择银行卡号",
        display: {
            keyName: 'AccountName',
            valueName: 'value'
        },
        items: [{
            other: 'erqwerqeer',
            AccountName: '内容1',
            value: '1'
        }, {
            other: 'erqwerqeer',
            AccountName: '内容2',
            value: '2'
        }, {
            other: 'erqwerqeer',
            AccountName: '内容3',
            value: '3'
        }],
        callback: function(data) {

        }
    };

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
        this.panel.clasName = 'mei-select';
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
        this.item = '<a class="as-blue" value = "{#' + this.display.valueName + '#}">"{#' + this.display.keyName + '#}"</a>';
        // 创建字符串
        this.itemHtml = '';
        debugger;
        // 格式化数据
        for (var i = 0, len = data.items.length; i < len; i++) {
            this.itemHtml += formateString(this.item, this.items[i]);
        }

        // 插入到页面中
        document.body.appendChild(this.panel);
        // $E.on(eleNode,'tap',function() {
        //     alert(111);
        // });

    }

    Select.prototype = {
        // 初始化方法
        init: function() {
            var me = this;
            this.panel.appendChild(this.contentPanel);
            this.contentPanel.appendChild(this.titleNode);
            debugger;
            this.contentPanel.appendChild(this.itemHtml);
            this.show();
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
        show: function() {
            this.panel.style.display = "block";
        }
    };
    M.Select = Select;
});