define(["hbs!modules/serviceRuleConf/IMEITrigger/templates/imeiChangeConfigure.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        afterRender: function () {
            var that = this;
            that.$('.js-pagination').pagination({
               
            });
            that.$('.js-check').icheck();
            that.$('.js-dropdown').dropdown();
            that.$('.js-combobox').combobox();
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                        - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            that.bindEvent();
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        initData:function(params){
            this._data = params;
            if(params.option == "edit"){
                this.show_detail(params);
            }else if(params.option == "add"){
                this.$(".modal-title").text("新增配置");
            }
            this._data.add_msisdn_list=[];
            this._data.delete_msisdn_list=[];
        },
        //查询配置详情
        show_detail : function(data){
            var me = this;
            me.$("#trigger_name").val(data.trigger_name);
            var params = {};
            params.trigger_id = data.trigger_id;
            params.trigger_type = data.trigger_type;
            fish.callService("TriggerController", "getAllTriggerInfo", params, function(data){
                if(data.res_code == '00000'){
                    //提醒能力、附加能力
                    var action_inst_list = data.result.action_inst_list;
                    if($.isArray(action_inst_list) && action_inst_list.length > 0){
                        _.each(action_inst_list,function(action_inst,i){
                            var action_type = action_inst.action_code+"|";
                            var jqDom = me.$('.'+action_inst.action_code+"_tip");
                            me.$(".js-check").each(function(){
                                var cur_code = $(this).attr("value");
                                if((cur_code=="" || cur_code) && cur_code.indexOf(action_type) != -1){
                                    $(this).icheck('check');
                                    jqDom.removeClass("hidden");
                                }
                            });
                        })
                    }
                    //更新配置描述序列
                    var num = 2;
                    me.$("#trigger_desc_send").find(".auto_tip").each(function(){
                        if(!$(this).hasClass("hidden")){
                            $(this).find(".num").html(num++);
                        }
                    });
                    num = 2
                    var num = 2;
                    me.$("#trigger_desc").find(".auto_tip").each(function(){
                        if(!$(this).hasClass("hidden")){
                            $(this).find(".num").html(num++);
                        }
                    });
                }else{
                    layer.alert("查询配置详情出错");
                }           
            });
        },
        bindEvent:function(){
            var that = this;
            that.$("#cancel_btn").click(function(){
                that.onClosePupup()
            });
            that.$("#config_save_btn").click(function(){
                that.onSubmit();
            });
            that.$(".single_checkbox").click(function(e){
                var cur = $(this).attr("value");
                var action_type = cur
                if(cur.indexOf("|") > -1){
                    action_type = cur.substring(0, cur.indexOf("|"));
                }
                var jqDom = that.$('.'+action_type+"_tip");
                if($(this).prop("checked")) {
                    jqDom.removeClass("hidden")
                }else {
                    jqDom.addClass("hidden");
                }
                //更新提示序列
                var num = 2;
                that.$("#trigger_desc").find(".auto_tip").each(function(){
                    if(!$(this).hasClass("hidden")){
                        $(this).find(".num").text(num++);
                    }
                });
                num = 2;
                that.$("#trigger_desc_send").find(".auto_tip").each(function(){
                    if(!$(this).hasClass("hidden")){
                        $(this).find(".num").text(num++);
                    }
                });
            });
        },
        getSelectedMember:function(query_type,mem_user_id_list){},
        getTriggerDesc : function(){
            //获取配置描述
            var trigger_desc = "";
            this.$("#trigger_desc_send").find(".tip").each(function(){
                if(!$(this).hasClass("hidden")){
                    trigger_desc += $(this).html();
                }
            });
            return trigger_desc;
        },
        onSubmit:function(){
            var that = this;
            var params={};
            if (!$.trim(that.$("#trigger_name").val())) {
                layer.alert("配置名称不能为空");
                return;
            }
            action_type_list = [];
            that.$(".js-check").each(function(){
                if($(this).is(':checked') && $(this).attr("value")){
                    action_type_list.push($(this).attr("value"));
                }
            });
            params.trigger_id = that._data.trigger_id;
            params.trigger_name = that.$("#trigger_name").val();
            params.trigger_desc = $.trim(that.getTriggerDesc());
            params.action_type_list = action_type_list;
            if(that._data.option == "edit"){
                params.add_msisdn_list = that._data.add_msisdn_list;
                params.delete_msisdn_list = that._data.delete_msisdn_list;
                fish.callService("TriggerController", "editImeiTrigger", params, function(data){
                    if(data.res_code == '00000'){
                        layer.alert("修改成功!");
                        that.parentView.doQuery();
                    }else{
                        layer.alert("修改失败！");
                    }           
                });
            }else if(that._data.option == "add"){
                params.mem_choose_type = "all";
                fish.callService("TriggerController", "addImeiTrigger", params, function(data){
                    if(data.res_code == '00000'){
                        if(data.res_message=="已存在配置信息,不能重复提交"){
                            layer.alert(data.res_message);
                        }else{
                            layer.alert("保存成功！");
                        }
                        that.parentView.doQuery();
                    }else{
                        layer.alert("保存失败！");
                    }           
                });
            }
            
            that.onClosePupup();
        }
    });

    return components;
});
