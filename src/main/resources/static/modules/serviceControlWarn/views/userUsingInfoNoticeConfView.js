define(['hbs!modules/serviceControlWarn/templates/userUsingInfoNoticeConf.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            events:{
                "click #proj_modify_btn":"proj_modify_popup",
                "click #proj_del_btn": "deleteProject",
                "click #proj_add_btn":"proj_add_popup"

            },
            afterRender: function () {
                var that = this;
                fish.utils.getAttrCode(["FLOW_UTIL","MESSAGE_UTIL","VOICE_UTIL"],function(code){
                    that.initTable();
                    that.$('.js-dropdownMenu2').dropdown();
                    that.queryData();
                });
                that.bindEvent();
            },
            initTable:function(){
                var that = this;
                var option = {
                    pagination: true,
                    autoFill: false,
                    singleSelect: true,//该表格可以多选
                    rowId: "warn_config_id",//指定主键字段
                    onSelectClass: "selected",
                    nowPage: 1,
                    columns: [
                        {data:"_checkbox",title:" ",checkbox:true},
                        {data: "warn_config_name", title: "配置名称", width: "20%"},
                        {data: "men_type", title: "业务类型", width: "10%",code:"MEM_TYPE"},
                        {data: "restrict_type", title: "限制类型",code:"LIMIT_TYPE"},
                        {data: "restrict_value", title: "限制值"},
                        {data: "unit", title: "值单位",formatter:function(data,rows){
                            var result;
                            if(rows.men_type == '1') result = fish._codecache["FLOW_UTIL"][data];
                            else if(rows.men_type == '2') result = fish._codecache["MESSAGE_UTIL"][data];
                            else if(rows.men_type == '3') result = fish._codecache["VOICE_UTIL"][data];

                            return result || "";
                        }},
                        {data: "oper_date", title: "配置时间", width: "25%"},
                        {data: "status_cd", title: "号码状态", width: "10%",code:"STATUS_CD",formatter:function(data){
                            if(data=="有效"){
                                return '<span class="states valid">有效</span>';
                            }else{
                                return '<span class="states invalid">无效</span>';
                            }
                        }},
                        {data: "control", title: "操作", width:"5%", formatter: function(data){
                            //操作列的按钮生成
                            var html ='<div class="btn-group pull-right">';
                            html += '<button class="js-dropdownMenu2" type="button">';          
                            html += '<i class="ico-pull-down"></i></button>';
                            html += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenu2">';
                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="view_detail" id="view_detail">查看已配置成员</a></li>';
                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="add_mem"  id="add_mem">增加成员</a></li>';
                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="delete_mem" id="delete_mem">删除成员</a></li></ul></div>';
                            return html;
                        }}
                    ],//每列的定义
                    onLoad: fish.bind(that.bindTableEvent,that)
                };
                that.$data_list= that.$("#data_list").xtable(option);
                //外部分页组件
                that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                        var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                        that.$data_list.xtable("options",{pageSize:rowNum});
                        that.queryData(eventData.page,rowNum);
                    },
                    create:function(){
                        //默认不加载
                        //that.queryData(1);
                    }
                });
                that.$("#men_type").combobox({
                    attr_code:"MEM_TYPE",
                    dataSource: [{name: '全部', value: ''}]
                });
                that.$("#restrict_type").combobox({
                    attr_code:"LIMIT_TYPE",
                    dataSource: [{name: '全部', value: ''}]
                });
            },
            queryData:function(page, rows, param){
                var that = this;
                if (!param)  param = new Object();
                param.page = page ? page : 1;
                param.rows = rows ? rows : 10;
                //param.plan_type = me.data.plan_type;
                 fish.callService("AlarmController", "queryAlarm", param, function(result){
                    data = result.rows;
                    //console.log(data);
                    that.$data_list.xtable("loadData",data);
                    that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                    that.$(".page-total-num").text(result.pageCount);
                    that.$(".page-data-count").text(result.total);
                })
            },
            //表格内部事件绑定
            bindTableEvent:function(){
                var that = this;
                that.$data_list.find("tr").each(function(){
                    $(this).children("td").eq(8).addClass("operation");
                });
                that.$(".add_mem").click(function(){
                    var warn_config_id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+warn_config_id);
                    fish.popupView({
                        url:"modules/serviceControlWarn/views/addMemberPopupView",
                        width:400,
                        callback:function(popup, view) {
                            view.parentView = that;
                            view.initData(data);
                        }
                    });
                }),
                that.$(".delete_mem").click(function(){
                    var warn_config_id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+warn_config_id);
                    fish.popupView({
                        url:"modules/serviceControlWarn/views/deleteMemberView",
                        width:400,
                        callback:function(popup, view) {
                            view.parentView = that;
                            view.initData(data);
                        }
                    });
                }),
                that.$(".view_detail").click(function(){
                    var warn_config_id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+warn_config_id);
                    fish.popupView({
                        url:"modules/serviceControlWarn/views/viewDetailView",
                        width:600,
                        callback:function(popup, view) {
                            view.parentView = that;
                            view.initData(data);
                        }
                    });
                });
                that.$(".js-dropdownMenu2").click(function(){
                    if($(this).children(".ico-pull-down").hasClass("active")){
                        $(this).parents(".btn-group").removeClass("open");
                        $(this).children(".ico-pull-down").removeClass("active");
                    }else{
                        that.$(".btn-group").removeClass("open");
                        that.$(".ico-pull-down").removeClass("active");
                        $(this).parents(".btn-group").addClass("open");
                        $(this).children(".ico-pull-down").addClass("active");
                    }
                    
                })
                // that.$('.btn-group').click(function(){
                //     $(this).find(".ico-pull-down").toggleClass("active");
                // })
            },

            bindEvent:function(){
                var that = this;
                that.$("#query_btn").click(function(){
                    var param = {};
                    var men_type = that.$("#men_type").combobox("value");
                    var restrict_type = that.$("#restrict_type").combobox("value");
                    if (men_type)  param.men_type = men_type;
                    if (restrict_type)  param.restrict_type = restrict_type;
                    that.queryData(null, null, param);
                })
            },
            //删除data_list数据
            deleteProject : function() {
                var that = this;
                var selectedRow = that.$data_list.xtable("getSelected");
                // console.log(selectedRow);
                if (selectedRow.length == 0 || !selectedRow) {
                    layer.alert("请选择要删除的配置");
                    return;
                }
                var obj = selectedRow[0];
                layer.confirm("确认删除【" + obj.warn_config_name + "】这条配置？", {yes: function() {
                var param = {warn_config_id:obj.warn_config_id};            
                fish.callService("AlarmController", "deleteAlarm", param , function(reply){
                        if (reply.res_code != "00000") {
                            layer.alert(reply.res_message);
                            return;
                        }
                        layer.alert("配置"+ obj.warn_config_name+"已经删除");
                        that.queryData();
                    });
                }});
            },
            //修改
            proj_modify_popup:function(){
                var that = this;
                var selectedRow = that.$data_list.xtable("getSelected");
                if(selectedRow.length == 0 || !selectedRow){
                    layer.alert("请选择要修改的配置");
                    return;
                }
                var data = selectedRow[0];
                fish.popupView({
                    url:"modules/serviceControlWarn/views/projModifyPopupView",
                    width:400,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.initData(data);
                    }
                });
            },
            proj_add_popup:function(){
                var that = this;
                fish.popupView({
                    url:"modules/serviceControlWarn/views/addWarnConfigureView",
                    width:400,
                    callback:function(popup, view) {
                        view.parentView = that;
                    }
                });
            },
            validate : function() {
                var that = this;
                if (!$.trim(that.$("#warn_config_name").val())) {
                    layer.tips("配置名称不能为空", "#warn_config_name", {tips: [4, "#3595CC"], tipsMore: true});
                    return false;
                }

                var men_type = that.$("#add_men_type").combobox("value");
                if (!men_type||men_type=='') {
                    layer.tips("请选择业务类型！", "#add_men_type", {tips: [4, "#3595CC"], tipsMore: true});
                    return false;
                }
                var restrict_type = that.$("#add_restrict_type").combobox("value");
                if (!restrict_type||restrict_type=='') {
                    layer.tips("请选择限制类型！", "#add_restrict_type", {tips: [4, "#3595CC"], tipsMore: true});
                    return false;
                }
                var status_cd = that.$("#add_status_cd").combobox("value");
                if (!status_cd||status_cd=='') {
                    layer.tips("请选择状态！", "#add_restrict_type", {tips: [4, "#3595CC"], tipsMore: true});
                    return false;
                }
                return true;
            },
        });
        return pageView;
    });
