define(["hbs!modules/serviceRuleConf/flowTrigger/templates/flowChangeConfigure.html"
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
            that.action_type = {"web" : "web", "sms" : "SMS|PHONE_NO", "api" : "API|API_ABILITY_CODE"};
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                        - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            that.bindEvent();
            that.initUploadEvent();
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        initData:function(params){
            this._data = params;
            if(params.option == "edit"){
                this.show_detail(params);
                this.$(".js-edit").removeClass("hidden");
                this.$(".js-add").addClass("hidden");
            }else if(params.option == "add"){
                this.$(".js-edit").addClass("hidden");
                this.$(".js-add").removeClass("hidden");
                this.$(".modal-title").text("新增配置");
            }
            this._data.add_msisdn_list=[];
            this._data.delete_msisdn_list=[];
            this.upload_key = "";
            this.msisdn_list = [];
        },
        show_detail : function(data){
            var me = this;
            me.$("#trigger_name").val(data.trigger_name);
            var params = {};
            params.trigger_id = data.trigger_id;
            fish.callService("TriggerController", "getAllTriggerInfo", params, function(data){
                if(data.res_code == '00000'){
                    //流量等级
                    var rule_attr_inst = data.result.rule_attr_inst;
                    if(rule_attr_inst != ''){
                        var flow_level = rule_attr_inst.attr_value+"|"+rule_attr_inst.attr_unit;
                        me.$(".flow_level_option").each(function(){
                            var cur_code = $(this).attr("name");
                            $(this).find(".js-check").attr("disable",true);
                            if(flow_level == cur_code){
                                $(this).removeClass("hidden");
                                $(this).find(".js-check").icheck("check")
                                me.$(".flow_level_tip").html("（" + cur_code.replace(/\|/g, "") + "）");
                            }else{
                                $(this).addClass("hidden");
                            }
                        });
                    }
                    //提醒能力、附加能力
                    var action_inst_list = data.result.action_inst_list;
                    if($.isArray(action_inst_list) && action_inst_list.length > 0){
                        _.each(action_inst_list,function(action_inst,i){
                            var action_type = action_inst.action_code+"|";
                            var jqDom = me.$('.'+action_inst.action_code+"_tip");
                            me.$("#action_type").find(".js-check").each(function(){
                                var cur_code = $(this).attr("value");
                                if(cur_code.indexOf(action_type) != -1){
                                    $(this).icheck('check');
                                    jqDom.removeClass("hidden");
                                }
                            });
                            me.$("#other_action_type").find(".js-check").each(function(){
                                var cur_code = $(this).attr("value");
                                if(cur_code.indexOf(action_type) != -1){
                                   $(this).icheck('check');
                                    jqDom.removeClass("hidden");
                                }
                            });
                        })
                    }
                    //短信号码
                    var action_para_inst_list = data.result.action_para_inst_list;
                    if($.isArray(action_para_inst_list) && action_para_inst_list.length > 0){
                        $.each(action_para_inst_list, function(i, action_para_inst){                    
                            var action_para_code = action_para_inst.action_para_code;
                            if(me.action_type["sms"].indexOf(action_para_code) != -1){
                                me.$("#action_type_msisdn").val(action_para_inst.action_para_value);
                                me.$(".msisdn").html(action_para_inst.action_para_value);
                            }
                        });
                    }
                    //更新配置描述序列
                    var num = 2;
                    me.$("#trigger_desc").find(".auto_tip").each(function(){
                        if(!$(this).hasClass("hidden")){
                            $(this).find(".num").html(num++);
                        }
                    });
                    num = 2;
                    me.$("#trigger_desc_send").find(".auto_tip").each(function(){
                        if(!$(this).hasClass("hidden")){
                            $(this).find(".num").html(num++);
                        }
                    });
                    if(me.$('[value="SMS|PHONE_NO"]').prop("checked")){
                        me.$("#action_type_msisdn").removeClass("hidden");
                     }
                }else{
                    layer.alert("查询配置详情出错");
                }           
            });
        },
        bindEvent:function(){
            var that = this;
            that.$("#view").click(function(){
                that.configureMember("view");
            });
            that.$("#add").click(function(){
                that.configureMember("add");
            });
            that.$("#delete").click(function(){
                that.configureMember("delete");
            });
            that.$("#cancel_btn").click(function(){
                that.onClosePupup()
            });
            that.$("#config_save_btn").click(function(){
                that.onSubmit();
            });
            that.$("#action_type").find('.js-check').click(function(){
                 if(that.$('[value="SMS|PHONE_NO"]').prop("checked")){
                    that.$("#action_type_msisdn").removeClass("hidden");
                 }else{
                     that.$("#action_type_msisdn").addClass("hidden");
                 }
            });
            that.$("#mem_choose_type").find(".js-check").click(function(){
                if(that.$('#part').prop("checked")){
                    that.$('#part_mem_show').removeClass("hidden");
                    that.$('#upload_mem_show').addClass("hidden");
                    that.$('#download_templet').addClass("hidden");
                    that.choose_type = 'part';
                }
                else if(that.$('#upload').prop("checked")){
                    that.$('#part_mem_show').addClass("hidden");
                    that.$('#upload_mem_show').removeClass("hidden");
                    that.$('#download_templet').removeClass("hidden");
                    that.choose_type = 'upload';
                }
                else if(that.$('#all').prop("checked")){
                    that.$('#part_mem_show').addClass("hidden");
                    that.$('#upload_mem_show').addClass("hidden");
                    that.$('#download_templet').addClass("hidden");
                    that.choose_type = 'all';
                }
            });
            that.$('#download_templet').click(function(){
                window.location.href = "";
            });
            that.$('#part_mem_show').click(function(){
                that.configureMember("add");
            });
            that.$("#flow_level").find(".js-check").click(function(){
                that.flow_level = $(this).attr("value");
                $(".flow_level_tip").html("（" + $(this).attr("value").replace(/\|/g, "") + "）");
                $("#trigger_name").val('号码流量实时提醒（'+$(this).attr("value").replace(/\|/g, "")+'）');
            });
            that.$(".single_checkbox").click(function(e){
                var cur = $(this).attr("value");
                var action_type = cur
                if(cur.indexOf("|") > -1){
                    action_type = cur.substring(0, cur.indexOf("|"));
                }
                var jqDom = that.$('.'+action_type+"_tip");
                if($(this).prop("checked")) {
                    jqDom.removeClass("hidden");
                }else {
                    jqDom.addClass("hidden");
                }
                //更新提示序列
                var num = 2;
                that.$("#trigger_desc").find(".auto_tip").each(function(){
                    if(!$(this).hasClass("hidden")){
                        $(this).find(".num").html(num++);
                    }
                });
                num = 2;
                that.$("#trigger_desc_send").find(".auto_tip").each(function(){
                    if(!$(this).hasClass("hidden")){
                        $(this).find(".num").html(num++);
                    }
                });
            });
            $("#action_type_msisdn").blur(function(){
                var action_type_msisdn = that.$("#action_type_msisdn").val();
                if(action_type_msisdn != '' && that.checkPhoneNumber(action_type_msisdn) == false){
                    layer.alert("号码格式错误！");
                }
                if(that.$(".single_checkbox[sms=yes]").prop("checked")){
                    that.$(".msisdn").html(action_type_msisdn);
                    that.action_type_msisdn = action_type_msisdn;
                }
            });
        },
        configureMember:function(query_type){
            var that = this;
            var data = {};
            data.query_type = query_type;
            data.trigger_id = that._data.trigger_id;
            data.trigger_type = that._data.trigger_type;
            fish.popupView({
                url:"modules/serviceRuleConf/activeTrigger/views/ConfigureMemberView",
                width:400,
                callback:function(popup, view) {
                    view.parentView = that;
                    view.initData(data);
                }
            });

        },
        getSelectedMember:function(query_type,mem_user_id_list){
            var that = this;
            if(query_type == "add"){
                that._data.add_msisdn_list = mem_user_id_list;
            }else if(query_type == "delete"){
                that._data.delete_msisdn_list = mem_user_id_list;
            }
        },
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
            var action_type_msisdn = that.$("#action_type_msisdn").val();
            if(action_type_msisdn == ''&&that.$(".single_checkbox[sms=yes]").prop("checked")){
            	 layer.alert("请输入短信号码！");
                 return;
            }
            if(action_type_msisdn != '' && that.checkPhoneNumber(action_type_msisdn) == false &&that.$(".single_checkbox[sms=yes]").prop("checked")){
                layer.alert("号码格式错误！");
                return;
            }
            action_type_list = [];
            that.$("#action_type").find(".js-check").each(function(){
                if($(this).is(':checked') && $(this).attr("value")){
                    action_type_list.push($(this).attr("value"));
                }
            });
             that.$("#other_action_type").find(".js-check").each(function(){
                if($(this).is(':checked') && $(this).attr("value")){
                    action_type_list.push($(this).attr("value"));
                }
            });
            params.trigger_name = that.$("#trigger_name").val();
            params.trigger_desc = $.trim(that.getTriggerDesc());
            params.action_type_list = action_type_list;
            if(that._data.option == "edit"){
                params.trigger_id = that._data.trigger_id;
                params.add_msisdn_list = that._data.add_msisdn_list;
                params.delete_msisdn_list = that._data.delete_msisdn_list;
                params.action_type_msisdn = "";
                fish.callService("TriggerController", "editFlowTrigger", params, function(data){
                    if(data.res_code == '00000'){
                        layer.alert(data.result != null ? "修改成功! 已生成订单号:"+data.result.order_id : "修改成功!");
                        that.parentView.doQuery();
                    }else{
                        layer.alert("修改失败！");
                    }           
                });
            }else if(that._data.option == "add"){
                var param = {};
                param.flow_level = that.flow_level;   
                fish.callService("TriggerController", "checkFlowRuleAttrCode", param, function(data){
                    if(data.res_code == '00000'){
                        var count = data.result;
                        if(count > 0){
                            layer.alert("校验流量等级失败，同个流量等级的配置已存在");
                        }else{
                            params.flow_level = that.flow_level;
                            params.mem_choose_type = that.choose_type;//号码列表类型
                            params.msisdn_list = that._data.add_msisdn_list;
                            params.action_type_msisdn = $.trim(that.$("#action_type_msisdn").val());
                            params.upload_key = that.upload_key;
                            fish.callService("TriggerController", "addFlowTrigger", params, function(data){
                                if(data.res_code == '00000'){
                                    layer.alert(data.result != null ? "保存成功! 已生成订单号:"+data.result.order_id : "保存成功!");
                                    that.parentView.doQuery();
                                }else{
                                    layer.alert("保存失败！");
                                }           
                            });
                        }
                    }else{
                        layer.alert("校验流量等级失败");
                    }           
                });
            }
            that.onClosePupup();
        },
        //初始化上传事件
        initUploadEvent : function(){
            
            var me = this;
            //附件上传
            $('#trigger_file').on('change',function(){
                var fileName = me.$("#trigger_file").val();
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        me.$("#trigger_file").val("");
                        return;
                    }
                }
                var params_str = {};
                params_str.upload_type = 'busy_trigger';
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                $.ajaxFileUpload({
                    url : "UploadController/uploadExcel.do",
                    secureuri : false,
                    fileElementId : "trigger_file",
                    data: params, 
                    dataType : 'json',
                    success : function(data, status) {
                        
                        layer.closeAll();
                        me.$("#trigger_file").val("");
                        if(data.res_code=="00000"){
                            var info = data.result;
                            var exl_message = info.exl_message;
                            layer.alert(exl_message, function(){
                                me.send_list = info.phone_list;
                                me.initUploadEvent();
                            });
                            me.upload_key = info.download_key;
                        }else{
                            layer.alert(data.res_message);
                        }
                    },
                    error : function(data, status, e) {
                        layer.alert("操作失败");
                        me.initUploadEvent();
                        $("#trigger_file").val("");
                        layer.closeAll();
                    }
                });
                me.initUploadEvent();
                layer.load();
            });
        },
        checkPhoneNumber: function(phoneNumber){
            var reg  = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
            if(reg.test(phoneNumber)){
                return true;
            }
            return false;
        },
    });

    return components;
});
