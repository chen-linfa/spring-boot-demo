define(["hbs!modules/serviceControlWarn/templates/projModifyPopup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
        	//"click .js-close-popup": "onClosePupup",
            "click #submit_btn" : "modifyConfig",
            "click #cancel_btn" : "onClosePupup"
        },
        afterRender: function() {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                         - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
        },
        onClosePupup: function(){
        	this.trigger("editview.close");
        	this.popup.close();
        },
        //修改操作
        modifyConfig : function() {
            var that = this;
            var params = {};
            params.warn_config_name = $.trim(that.$("#warn_config_name").val());
            params.men_type = that.$addMenType.combobox("value");
            params.restrict_type = that.$addRestrictType.combobox("value");
            params.restrict_value= $.trim(that.$("#restrict_value").val());
            params.warn_config_id =  that._data.warn_config_id;
            params.comments =  $.trim(that.$("#comments").val());
            params.unit = that.$addUnit.combobox("value");
            params.status_cd = that.$addStausCd.combobox("value");
            if(!that.validate(params)){
                return;
            }
            fish.callService("AlarmController", "updateAlarmInfo", params, function(data){
                if(data.res_code == '00000'){
                    layer.alert("更新成功！");
                    that.parentView.queryData();
                }else{
                    layer.alert("更新失败！");
                }
                that.onClosePupup();
                
            });
        },
        //初始化弹窗数据
        initData:function(params){
            var that = this;
            that._data = params;
            var unitCode;
            if(params.men_type=='1'){
                unitCode = "FLOW_UTIL";
            }else if(params.men_type=='2'){
                unitCode = "MESSAGE_UTIL";
            }else if(params.men_type=='3'){
                unitCode = "VOICE_UTIL";
            }
            //初始化comboxbox下拉框
            that.$addMenType = that.$("#add_men_type").combobox({
                attr_code:"MEM_TYPE"
            });
            that.$addRestrictType = that.$("#add_restrict_type").combobox({
                attr_code:"LIMIT_TYPE"
            });
            that.$addUnit = that.$("#add_unit").combobox({
                attr_code:unitCode
            });
            that.$addStausCd = that.$("#add_status_cd").combobox({
                attr_code:"STATUS_CD"
            });
            //初始化下拉框里面数值
            that.$addMenType.combobox("value",params.men_type);
            that.$addRestrictType.combobox("value",params.restrict_type);
            that.$addUnit.combobox("value",params.unit);
            that.$addStausCd.combobox("value",params.status_cd);
            that.$('#warn_config_name').val(params.warn_config_name);
            that.$('#restrict_value').val(params.restrict_value);
            that.$('#comments').val(params.comments);
        },
        validate : function(params) {
            var that = this;
            if (!params.warn_config_name) {
                layer.tips("配置名称不能为空", "#warn_config_name", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }

            var men_type = that.$("#add_men_type").combobox("value");
            if (!params.men_type) {
                layer.tips("请选择业务类型！", "#add_men_type", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
            if (!params.restrict_type) {
                layer.tips("请选择限制类型！", "#add_restrict_type", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
            if (!params.status_cd) {
                layer.tips("请选择状态！", "#add_restrict_type", {tips: [4, "#3595CC"], tipsMore: true});
                return false;
            }
            if (!params.unit) {
                layer.tips("请选择单位！","#add_unit", {tips: [4, "#3595CC"], tipsMore: true});
                return ;
            }
            return true;
        },
    });
    return components;
});
