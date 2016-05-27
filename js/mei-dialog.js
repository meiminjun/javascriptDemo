/*
* @Author: meiminjun
* @Date:   2016-05-20 17:13:52
* @Last Modified by:   meiminjun
* @Last Modified time: 2016-05-20 17:51:48
*/

Mei.$package("Mei",function(M) {
    var $D = M.dom,
        $E = M.event,
        $U = M.Util;
    // alert组件
    var Confirm = function(data) {
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
        // 为提示框添加id
        this.panel.id = 'mei-dialog';
        // 为提示框创建面板添加类
        this.panel.className = 'alert';
        // 为标题添加样式类
        this.titleNode.className = 'a-title';
        // 为关闭按钮添加样式类
        this.closeBtn.className = 'a-close';
        // 为确定按钮添加样式类
        this.confirmBtn.className = 'a-confirm';
        // 为取消按钮添加样式类
        this.cancelBtn.className = 'a-cancel';
        // 为内容添加样式类
        this.contentNode.className = 'a-content';
        // 标题文案
        this.titleNode.innerHTML = data.title || '温馨提示';
        // 为确定按钮添加文案
        this.confirmBtn.innerHTML = data.confirmTxt || '确认';
        // 为取消按钮添加文案
        this.cancelBtn.innerHTML = data.cancelTxt || '取消';
        // 为提示内容添加文本
        this.contentNode.innerHTML = this.content;
        // 点击确定按钮执行方法 如果 data中有success方法则为success方法，否则为空函数
        this.confirm = data.confirm || function() {};
        // 点击关闭按钮执行方法
        this.cancel = data.cancel || function() {};
        // this.init();
    };
    Confirm.prototype = {
        // 创建方法
        init: function() {
            var _clientHeight = document.body.clientHeight,
                  _clientWidth = document.body.clientWidth,
                  _top = _clientHeight/2-155,
                  _right = _clientWidth/2-280/2;
            this.panel.style.top = _top+'px';
            this.panel.style.right = _right+'px';
            // 生成提示框
            this.panel.appendChild(this.titleNode);
            this.panel.appendChild(this.closeBtn);
            this.panel.appendChild(this.contentNode);
            this.panel.appendChild(this.confirmBtn);
            if(this.cancelBtn) {
                this.panel.appendChild(this.cancelBtn);
            }
            this.hide();
            // 插入到页面中
            document.body.appendChild(this.panel);
            // 绑定事件
            this.bindEvent();
            // 显示
            this.show();
        },
        bindEvent: function() {
            var me = this;
            // 关闭按钮点击事件
            this.cancelBtn.onclick = function() {
                // 隐藏弹窗
                me.hide();
                // 执行关闭取消方法
                me.cancel();
            };
            // 确定按钮点击事件
            this.confirmBtn.onclick = function() {
                // 隐藏弹窗
                me.hide();
                // 执行点击事件方法
                me.confirm();
            };
        },
        // 隐藏弹窗方法
        hide: function() {
            this.panel.style.display = 'none';
            $U.hideMask();
        },
        // 显示弹窗方法
        show: function() {
            $U.showMask();
            this.panel.style.display = 'block';
        }
    };
    // 右侧按钮提示框
    var Dialog = function(data) {
        // 继承基本提示框构造函数
        Confirm.call(this,data);
        // 为确认按钮添加right类设置位置居右
        this.confirmBtn.className = this.confirmBtn.className +" w100";
        this.cancelBtn = null;
    }

    // 继承基本提示框方法
    Dialog.prototype = new Confirm();
    Dialog.prototype.bindEvent = function() {
        var me = this;
        // 确定按钮点击事件
        this.confirmBtn.onclick = function() {
            // 隐藏弹窗
            me.hide();
            // 执行点击事件方法
            me.confirm();
        };
    }
    M.Confirm = Confirm;
    M.Dialog = Dialog;
});