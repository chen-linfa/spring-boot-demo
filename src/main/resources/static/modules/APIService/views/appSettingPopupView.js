define(["hbs!modules/APIService/templates/appSettingPopup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
            //"click .js-close-popup": "onClosePupup",
            "click .setting_ability_btn" : "onSubmit",
            "click .cancel_btn" : "onClosePupup"
        },
        afterRender: function() {
            var that = this;
            //console.log(this);
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
            var params = {};
            params.app_id = that._data.app_id;//ability_app_id
            params.ability_id=that._data.ability_id;
            params.comments=that.$("#setting_comments").val();
            if(that._data.ability_type=="1"){
                params.push_type=that.$("#setting_push_type").attr('value');
                var push_url=that.$("#setting_push_url").val();
                params.push_url=push_url;                           
                if(!that.$("input[type='checkbox']").is(':checked')){
                    layer.tips("请选择推送类型", "#setting_push_type", {tips: [4, "#3595CC"], tipsMore: true});
                    return;
                }
                if(push_url==""||push_url==null){
                    layer.tips("请填写推送地址", "#setting_push_url", {tips: [4, "#3595CC"], tipsMore: true});
                    return;
                }                               
            }
            fish.callService("AppManageContrller", "settingApiAbilityByAppIdAndApiAbilitySpecId", params, function(result){
                if(result.res_code == '00000'){
                    layer.alert("设置成功！",function(index){
                        layer.close(index);
                        //能力列表页面
                        var params = {};
                        params.app_id = that._data.app_id;
                        //这里查询能力列表
                        var page=1;
                        var rows=10;
                        that.parentView.queryApiAbilitySpecs(page,rows,params);//传入app_id
                    });
                }else{
                    layer.alert(result.res_message);
                }
                that.onClosePupup();
            });
        },
        initData:function(data){
            var that = this;
            //console.log(data);
            that._data = data;
            that.$("span[name]").each(function(){
                var key = $(this).attr("name");
                $(this).text(data[key]);
            });
            var param = {app_id:that._data.app_id,ability_id:that._data.ability_id};
            fish.callService("AppManageContrller", "queryOneApiAbilityInst", param, function(result){
                if(result.res_code == '00000'){
                    that.$("[name='comments']").val(result.result.comments);
                    var ability_inst_id=result.result.ability_inst_id;
                    //推送类信息
                    var ability_param={};
                    ability_param.ability_inst_id=ability_inst_id;
                    fish.callService("AppManageContrller", "queryApiAbilityPushCfg", ability_param, function(result){
                        if(result.res_code == '00000'){
                            that.$("#setting_push_type").prop("checked",true);//prop
                            that.$("#setting_push_url").val(result.result.push_url);
                        }else{
                            that.$("#setting_push_url").val("");
                        }
                    });
                    
                }else{
                    that.$("[name='comments']").val("");
                }
            }); 
            if(that._data.ability_type == "1"){
                that.$("#setting_send_address").show();
                that.$("#setting_send_type").show();
            }
        }
    });

    return components;
});
