define(["hbs!modules/APIService/templates/editAppPopup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
        	//"click .js-close-popup": "onClosePupup",
            "click .edit_app_btn" : "onSubmit",
            "click .cancel_btn" : "onClosePupup"
        },
        afterRender: function() {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                         - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            // that.$('.js-combobox').combobox();
        },
        onClosePupup: function(){
        	this.trigger("editview.close");
        	this.popup.close();
        },
        //提交
        onSubmit:function(){
            var that = this;
            var app_id= that.app_id;
            var app_name=$.trim(that.$("#edit_app_name").val());
            var app_url=$.trim(that.$("#edit_app_url").val());
            var app_desc=$.trim(that.$("#edit_app_desc").val());
            if(that.check_form(app_name,app_url,app_desc)){
                that.editApp(app_name,app_url,app_desc,app_id);
            }                         
        },
        //编辑应用
        editApp:function(app_name,app_url,app_desc,app_id){
            var that = this;
            var params = {};
            params.app_id=app_id;
            params.app_name = app_name;
            params.app_url = app_url;
            params.app_desc = app_desc;
            fish.callService("AppManageContrller", "editApp", params, function(result){
                if(result.res_code == '00000'){
                    layer.alert("修改应用成功！");
                    that.parentView.queryData();                         
                }
                that.onClosePupup();
            });
            
        },
        initData:function(data,app_id){
            var that = this;
            that.app_id = app_id;
            var edit_app_name=data.result.app_name;
            var edit_app_url=data.result.app_url;
            var edit_app_desc=data.result.app_desc;
            that.$("#edit_app_name").val(edit_app_name);
            that.$("#edit_app_url").val(edit_app_url);
            that.$("#edit_app_desc").val(edit_app_desc);
        },
        //提交表单检查
        check_form : function(app_name,app_url,app_desc) {
            if(app_name==""){
                layer.tips("应用名称不能为空", "#edit_app_name", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
            if(app_url==""){
                layer.tips("应用地址不能为空", "#edit_app_url", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
            if(app_desc==""){
                layer.tips("应用描述不能为空", "#edit_app_desc", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
                return true;
        },
    });
    return components;
});
