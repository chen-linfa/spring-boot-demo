define(["hbs!modules/serviceControlWarn/templates/addWarnConfigure.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click #cancel_btn": "onClosePupup",
            "click #submit_btn": "onSubmit"
        },
        afterRender: function () {
            var that = this;
            that.$choose_mem_check = that.$('.js-check').icheck();
            fish.utils.getAttrCode(["FLOW_UTIL","MESSAGE_UTIL","VOICE_UTIL"],function(code){
                // console.log(code);
                that.initConfigure();
            }),
            that.bindEvent();
            that.setUploadFileEvent();
        },
        bindEvent:function(){
            var that = this;
            that.$choose_mem_check.click(function(){
                if(that.$('#part_mem').prop("checked")){
                    that.$('#part_mem_show').removeClass("hidden");
                    that.$('#upload_mem_show').addClass("hidden");
                    that.$('#download_templet').addClass("hidden");
                    that.choose_type = 'part';
                }
                else if(that.$('#upload_mem').prop("checked")){
                    that.$('#part_mem_show').addClass("hidden");
                    that.$('#upload_mem_show').removeClass("hidden");
                    that.$('#download_templet').removeClass("hidden");
                    that.choose_type = 'upload';
                }
                else if(that.$('#all_mem').prop("checked")){
                    that.$('#part_mem_show').addClass("hidden");
                    that.$('#upload_mem_show').addClass("hidden");
                    that.$('#download_templet').addClass("hidden");
                    that.choose_type = 'all';
                }
            })
            that.$('#part_mem_show').click(function(){
                fish.popupView({
                    url:"modules/serviceControlWarn/views/addMemberConfView",
                    width:400,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.initData({});
                    }
                });
            });
            that.$("#download_templet").click(function(){
                window.location.href = 
                "servlet/downloadExcel?type=mould&mould=warn_config";
            })
        },
        onSubmit:function(){
            var me = this;
            var params = {};
            params.warn_config_name = $.trim(me.$("#warn_config_name").val());
            params.unit = me.$addUnit.combobox("option").dataSource[0].title;
            params.men_type= me.$addMenType.combobox("value");
            params.restrict_type = me.$addRestrictType.combobox("value");
            params.status_cd = me.$addStausCd.combobox("value");
            params.restrict_value= $.trim(me.$("#restrict_value").val());
            params.comments= $.trim(me.$("#comments").val());
            params.choose_type = me.choose_type;
            params.cust_mem_ids  = me.msisdn_list;
            params.upload_key  = me.upload_key;
            if(!me.validate(params)){
                return;
            }
            fish.callService("AlarmController", "insertAlarm", params, function(data){
                if(data.res_code == '00000'){
                    layer.alert("保存成功！");
                    me.parentView.queryData();
                    me.onClosePupup();
                }else{
                    layer.alert("保存失败！");
                }
                
            });
        },
        //上传文件事件
        setUploadFileEvent : function() {
            var me = this;
            //附件上传
            me.$('#loc_config_file').unbind().on('change', function(){
                var fileName = me.$("#loc_config_file").val();
                me.$("#loc_config_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        me.$("#loc_config_file").val("");
                        return;
                    }
                }
                
                var params_str = {};
                params_str.upload_type = 'local_config';
                
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                
                $.ajaxFileUpload({
                    url : "UploadController/uploadExcel.do",
                    secureuri : false,
                    fileElementId : "loc_config_file",
                    data: params,
                    dataType : 'json',
                    success : function(data) {
                        layer.closeAll();
                        me.$("#loc_config_file").val("");
                        me.msisdn_list = [];
                        if(data.res_code=="00000"){
                            var info = data.result;
                            var exl_message = info.exl_message;
                            //me.msisdn_list = info.msisdn_list;
//                          me.save_batch_config(info.phone_list);
//                          me.save_batch_config(info.);
                            me.upload_key = info.download_key;
                            me.setUploadFileEvent();
                            layer.alert(exl_message);
                            
                        }else{
                            layer.alert(data.res_message);
                        }
                    },
                    error : function(data) {
                        layer.alert("操作失败 ！  "+ data.res_message);
                        me.$("#loc_config_file").val("");
                        layer.closeAll();
                    }
                });
                me.setUploadFileEvent();
                layer.load();
            });
        },
        setMsisdnList:function(data){
            this.msisdn_list = data; 
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        initConfigure:function(){
            var that = this;
            that.$addMenType = that.$("#add_men_type").combobox({
                attr_code:"MEM_TYPE"
            });
            that.$addRestrictType = that.$("#add_restrict_type").combobox({
                attr_code:"LIMIT_TYPE"
            });
            that.$addUnit = that.$("#add_unit").combobox({
                attr_code:"FLOW_UTIL"
            });
            that.$addStausCd = that.$("#add_status_cd").combobox({
                attr_code:"STATUS_CD"
            });
            that.$("#add_men_type").on('combobox:change', function(e) {
                var unitCode = {};
                var add_unit = [];
                var men_type = that.$addMenType.combobox("value");
                that.$addUnit.combobox("value","");
                if(men_type=='1'){
                    unitCode = fish._codecache["FLOW_UTIL"];
                }else if(men_type=='2'){
                    unitCode = fish._codecache["MESSAGE_UTIL"];
                }else if(men_type=='3'){
                    unitCode = fish._codecache["VOICE_UTIL"];
                }
                _.each(unitCode,function(value,key){
                    var obj = {}
                    obj.title = key;
                    obj.name = value;
                    add_unit.push(obj);
                })
                that.$addUnit = that.$("#add_unit").combobox("option",{dataSource: add_unit});
            })
        },
        validate : function(params) {
            var me = this;
            if (!params.warn_config_name) {
                layer.alert("配置名称不能为空");
                return false;
            }
            if (!params.men_type) {
                layer.alert("请选择业务类型！");
                return false;
            }
            if (!params.restrict_type) {
                layer.alert("请选择限制类型！");
                return false;
            }
            if (!params.status_cd) {
                layer.alert("请选择状态！");
                return false;
            }
            if (!params.unit) {
                layer.alert("请选择单位！");
                return false;
            }
            if(!me.$('#part_mem').prop("checked")&&!me.$('#upload_mem').prop("checked")&&!me.$('#all_mem').prop("checked")){
            	layer.alert("请选择成员！");
                return false;
            }
            return true;
        },

    });

    return components;
});
