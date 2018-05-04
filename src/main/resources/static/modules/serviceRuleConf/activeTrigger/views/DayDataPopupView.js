define(["hbs!modules/serviceRuleConf/activeTrigger/templates/DayDataPopup.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        trigger_type : "",
        events: {
            "click #cancel_btn": "onClosePupup",
            "click #submit_btn": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                         - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            var initdate = new Date();
            var mindate = that.addMonth(-2);
            var startdate = new Date(initdate.getFullYear()+"-"+(initdate.getMonth()+1<10?"0"+(initdate.getMonth()+1):(initdate.getMonth()+1))+"-"+"01");
            that.$("#start_time").datetimepicker({viewType:"date",
                initialDate:fish.dateutil.format(startdate, 'yyyy-mm-dd'),
                startDate:mindate,
                endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd'),
                buttonIcon:''
            });
            that.$("#end_time").datetimepicker({
                viewType:"date",
                initialDate:initdate,
                startDate:mindate,
                endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
            });
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        initData:function(params){
            this._data = params;
            var that = this;
            that.trigger_type = params.trigger_type;
            if(params.trigger_type == "active_trigger"){
                that.initActiveList();
                that.$(".modal-title").text("激活预警日数据");
            }else if(params.trigger_type == "flow_trigger"){
                that.initFlowList();
                that.$(".modal-title").text("流量预警日数据");
            }else if(params.trigger_type == "imei_trigger"){
                that.initIMEIList();
                that.$(".modal-title").text("IMEI预警日数据");
            }
            that.queryData(null,null,params);
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                pgNumber:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.$proj_list.xtable("options",{pageSize:rowNum});
                    var params = {};
                    that.queryData(eventData.page,rowNum,params);
                },
                create:function(){
                    //默认不加载
                    //that.queryData(1);
                }
            });
            that.$("#search_btn").click(function(){
            	var params = {};
            	params.trigger_type = that.trigger_type;
                that.queryData(null,null, params);
            });
            if(params.trigger_type == "imei_trigger"){
                    that.$("#export_warn").click(function(){
                        var start_time = that.$("#start_time").datetimepicker("value");
                        var end_time = that.$("#end_time").datetimepicker("value");
                        var url = "UploadController/exportforImei.do?start_time="+start_time+"&end_time="+end_time;
                        window.open(url);
                    });     
            }
            else{
                that.$("#export_warn").click(function() {
                    var start_time = that.$("#start_time").datetimepicker("value");
                    var end_time = that.$("#end_time").datetimepicker("value");
                    var trigger_id = that._data.trigger_id;
                    var type = "";
                    if(that._data.query_type == 'flow_trigger'){
                        type = "flow_warn";
                    }else if(that._data.query_type == 'active_trigger'){
                        type = "active_warn";
                    }   
                    var url = "UploadController/exportforActiveOrFlow.do?type="+type+"&start_time="+start_time+"&end_time="+end_time+"&trigger_id="+trigger_id;
                    window.open(url);
                })
            }
        },
        initActiveList:function(){
            var option = {
                pagination : false,
                autoFill : false,
                singleSelect : true,
                nowPage : 1,
                rowId : "mem_user_id",// 指定主键字
                pageSize : 10,
                columns : [ {
                    data : "phone_no",
                    title : "MSISDN",
                    width : "25%"
                }, {
                    data : "tr_sign",
                    title :  "推送内容",
                    width : "25%"
                }, {
                    data : "tr_date",
                    title : "推送时间",
                    width : "25%"
                }, {
                    data : "create_date",
                    title : "创建时间",
                    width : "25%"
                } ],
            };
            this.$proj_list = this.$('#proj_list').xtable(option);
        },
        initFlowList:function(){
            var option = {
                pagination : false,
                autoFill : false,
                singleSelect : true,
                nowPage : 1,
                rowId : "mem_user_id",// 指定主键字
                pageSize : 10,
                columns : [ {
                    data : "phone_no",
                    title : "MSISDN",
                    width : "25%"
                }, {
                    data : "tr_sign",
                    title :  "流量阀值",
                    width : "25%"
                }, {
                    data : "tr_date",
                    title : "推送时间",
                    width : "25%"
                }, {
                    data : "create_date",
                    title : "创建时间",
                    width : "25%"
                } ],
            };
            this.$proj_list = this.$('#proj_list').xtable(option);
        },
        initIMEIList:function(){
            var option = {
                pagination : true,
                autoFill : false,
                singleSelect: false,
                nowPage:1,
                rowId: "mem_user_id",//指定主键字
                pageSize : 10,
                columns : [
                        {data : "mem_user_id",title : "MSISDN(卡号)", width: "25%"},
                        {data : "old_imei",title : "旧IMEI", width: "25%"},
                        {data : "new_imei",title : "新IMEI", width: "25%"},
                        {data : "create_date",title : "预警时间", width: "25%"}
                        ],
            };
            this.$proj_list = this.$('#proj_list').xtable(option);
        },
        queryData:function(page,rows,params){
            var that = this;
            if(!params) var params = {};
            params.page = page==null? 1 : page;
            params.rows = rows==null? 10 : rows;
            params.start_time = that.$("#start_time").datetimepicker("value");
            params.end_time = that.$("#end_time").datetimepicker("value");
            if (params.start_time == ''|| params.start_time == null) {
                layer.alert("开始时间不能为空！");
                return;
            }
            if (params.end_time == '' || params.end_time == null) {
                layer.alert("结束时间不能为空！");
                return;
            }
            if (params.start_time > params.end_time) {
                layer.alert("起始时间不能大于截止时间!");
                return false;
            }
            params.trigger_id = that._data.trigger_id;
            if(params.trigger_type != "imei_trigger"){
                fish.callService("TriggerController", "queryFlowOrActiveReportList", params, function(result){
                    var data = result.rows;
                    that.$proj_list.xtable("loadData",data);
                    that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                    that.$(".page-total-num").text(result.pageCount);
                    that.$(".page-data-count").text(result.total);
                    that.popup.center();
                })

            }else{
                fish.callService("TriggerController", "queryImeiReportList", params, function(result){
                    var data = result.rows;
                    that.$proj_list.xtable("loadData",data);
                    that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                    that.$(".page-total-num").text(result.pageCount);
                    that.$(".page-data-count").text(result.total);
                    that.popup.center();
                })
            }
        },
        addMonth:function(monthNum) {
            var today = new Date();
            var str = '';
            var lastMonth = today.setMonth(today.getMonth()+ 1 + monthNum);
            var month = "01";
            if(today.getMonth() < 10){
                month = "0" + today.getMonth();
            }else{
                month =  today.getMonth();
            }
            str = today.getFullYear() + "-" + month;  
            if (today.getMonth() == '0') {
                str = today.getFullYear() - 1 + "-" + "12";
            }
            str = str + "-" + today.getDate();
            return str;
        }

    });

    return components;
});
