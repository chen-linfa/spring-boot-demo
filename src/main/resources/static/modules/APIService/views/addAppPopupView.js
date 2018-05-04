define(["hbs!modules/APIService/templates/addAppPopup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
        	//"click .js-close-popup": "onClosePupup",
            "click .add_app_btn" : "onSubmit",
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
            var add_app_name=$.trim(that.$("#add_app_name").val());
            var add_app_url=$.trim(that.$("#add_app_url").val());
            var add_app_desc=$.trim(that.$("#add_app_desc").val());
            if(that.check_form(add_app_name,add_app_url,add_app_desc)){
                that.addApp(add_app_name,add_app_url,add_app_desc);                   
            }                       
        },
        //添加应用
        addApp:function(add_app_name,add_app_url,add_app_desc){
            var that = this;
            var params = {};
            params.app_name = add_app_name;
            params.app_url = add_app_url;
            params.app_desc = add_app_desc;
            fish.callService("AppManageContrller", "addApp", params, function(result){
                if(result.res_code == '00000'){
                    //that.onClosePupup();
                    layer.alert("新建应用成功！",function(index){
                         that.parentView.queryData();
                         layer.close(index);
                    });
                   
                    //debugger;
                    //that.parentView.initTableInput();
                }else{
                    layer.alert(result.res_message);
                }
                that.onClosePupup();
            });
        },
        //提交表单检查
        check_form : function(app_name,app_url,app_desc) {
            if(app_name==""){
                layer.tips("应用名称不能为空", "#add_app_name", {tips: [4, "#3595CC"], tipsMore: true});//#add_app_name
                return false;
            }
            if(app_url==""){
                layer.tips("应用地址不能为空", "#add_app_url", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
            if(app_desc==""){
                layer.tips("应用描述不能为空", "#add_app_desc", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
                return true;
        }
    });

    return components;
});
