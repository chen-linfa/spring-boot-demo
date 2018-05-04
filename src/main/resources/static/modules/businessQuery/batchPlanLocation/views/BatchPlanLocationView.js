define(['hbs!modules/businessQuery/batchPlanLocation/templates/batchPlanLocation.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                        var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                        that.doQuery(eventData.page,rowNum);
                    },
                    create:function(){
                        that.doQuery(1);
                    }
                });
                //初始化时间选择控件
                var initdate = new Date();
                var mindate = new Date();
                mindate.setDate(initdate.getDate()-90);
                that.$('#start_date').datetimepicker({
                    initialDate:mindate,
                    viewType:"date",
                    format:"yyyy-mm-dd",
                    startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd'),
                    endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
                });
                that.$('#end_date').datetimepicker({
                    initialDate:initdate,
                    viewType:"date",
                    format:"yyyy-mm-dd",
                    startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd'),
                    endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
                });
                that.$("#proj_add_btn").click(function(){
                    fish.popupView({
                        url:"modules/businessQuery/batchPlanLocation/views/ModifyView.js",
                        width:400,
                        viewOption:{
                            type:"add",
                            param:{},
                        },
                        callback:function(popup,view){
                            view.parentView = that;
                        }
                    })
                });
                var option = {
                    pagination: false,
                    autoFill: false,
                    singleSelect: true,//该表格可以多选
                    rowId: "plan_id",//指定主键字段
                    onSelectClass: "selected",
                    nowPage: 1,
                    columns: [
                        {data:"_checkbox",title:"",checkbox:true},
                        {data: "plan_name", title: "任务名称", width: "21%"},
                        {data: "count", title: "号码总数", width: "9%"},
                        {data: "exec_state", title: "任务状态", width:"10%",code:"EXEC_STATUS"},
                        {data: "begin_time", title: "开始时间", width: "11%"},
                        {data: "end_time", title: "结束时间", width: "11%"},
                        {data: "exec_type", title: "执行类型", width:"10%",code:"EXEC_TYPE"},
                        {data: "loc_rate", title: "定位频率", width:"9%"},
                        {data: "plan_prior", title: "优先级", width:"8%"},
                        {data: "", title: "操作", width:"11%",className:"operation", formatter: function(data){
                            //操作列的按钮生成
                            var html ='<a href="javascript:void(0);" class="js-btn_detail" id="view_detail" style="color:blue;">详情</a>&nbsp;&nbsp;<a href="javascript:void(0);" class="js-download" id="download_result" style="color:blue;">下载</a>';
                            return html;
                        }}
                    ],//每列的定义
                    onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
                };
                that.$(".js-table").xtable(option);
                that.initEvent();
                that.doQuery();
            },
            msisdn_list : [], //上传的号码列表
            
            data : {
                plan_type : "0"                     //任务类型：计划
            },
            
            upload_key : "",
            //事件注册
            initEvent : function() {
                var me = this;
                
                me.$("#query_btn").click(function() {
                    var param = {};
                    var start_date = me.$("#start_date").val();
                    var end_date = me.$("#end_date").val();
                    if(start_date != '' && end_date != '' ){
                        var startTime = me.getDateTime(start_date);
                        var endTime = me.getDateTime(end_date);
                        if(startTime > endTime){
                            layer.alert("开始时间不能大于结束时间");
                            return ;
                        }
                    }
                    if (me.$("#start_date").val())  param.start_date = start_date;
                    if (me.$("#end_date").val())  param.end_date = end_date;
                    // 页面无该元素
                    // if ($.trim($("#query_num").val()))  param.msisdn = $.trim($("#query_num").val());
                    if ($.trim(me.$("#query_group_num").val()))  param.plan_name = $.trim(me.$("#query_group_num").val());
                    me.doQuery(null, null, param);
                });
                
                me.$("#reset_btn").click(function() {
                    me.$(".js-search-form").find("input").val("");
                });
                
                me.$("#proj_del_btn").click(function() {
                    me.deleteProject();
                });
                
                me.$("#proj_modify_btn").click(function() {
                    var row = me.$(".js-table").xtable("getSelected");
                    if (!row || row.length == 0) {
                        layer.alert("请选择要修改的任务");
                        return;
                    }else{
                        var obj = row[0];
                        var exec_state = obj.exec_state;
                        if (obj.exec_state != 0) {
                            layer.alert("该任务【" + me.exec_state(obj.exec_state) + "】，不允许修改");
                            return;
                        }else{
                            fish.popupView({
                            url:"modules/businessQuery/batchPlanLocation/views/ModifyView.js",
                            width:400,
                             viewOption:{
                                type:"modify",
                                param:obj,
                            },
                            callback:function(popup,view){
                                view.parentView = me;
                            }
                        });

                        }
                        
                    }
                    
                });
                //页面无该相应元素
                // $("#proj_view_detail_btn").click(function() {
                //     me.view_detail();
                // });
                
            },
        //翻译执行状态
        exec_state : function(data) {
            if (data == 0)  data = "待执行";
            else if (data == 1)  data = "执行中";
            else if (data == 2)  data = "执行完成";
            else if (data == 3)  data = "执行失败";
            return data;
        },

            //查询
        doQuery : function(page, rows, param){
            var me = this;
            if (!param)  param = new Object();
            param.page = page ? page : 1;
            param.rows = rows ? rows : 10;
            param.plan_type = me.data.plan_type;
            fish.callService("LocationController", "queryProjects", param, function(data){
                var has_data = false;
                var pageCount = 0;
                //me.removeOldData();
                if(data && data.total>0){
                    has_data = true;
                    me.initTableData(data);
                    pageCount = data.pageCount;
                }
                if(has_data == false){
                    me.$(".js-table").xtable("loadData",[]);
                    var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
                    me.$(".js-table").append(error_tr);
                }
                me.$('.js-pagination').pagination("update",{records:data.total,start:data.pageNumber});
                me.$(".js-total").html(data.total);
                me.$(".js-num").html(data.pageCount);
            });
        },
        tableStyling:function(){
            var that = this;
            //DATATABLE的classname是包括表头的，故自行设定表列样式
            that.$(".js-table").find("tr").each(function(){
                $(this).children("td").eq(4).addClass("text text-weaker-color");
                $(this).children("td").eq(5).addClass("text text-weaker-color");
                $(this).children("td").eq(9).addClass("operation");
            });
        },
        initTableData : function(data){
            //debugger
            var me = this;
            var total = data.total;
            if(total > 0){
                me.$(".js-table").xtable("loadData",data.rows);
                me.$(".js-table").delegate("#view_detail","click",function(e){                 
                        var ele = $(this).closest("tr");
                        me.view_detail(ele);
                    });
                me.$(".js-table #download_result").unbind("click").bind("click",function(e){                
                        var ele = $(this).closest("tr");
                        var rowId = ele.attr("id");
                        var data = me.$(".js-table").xtable("findData","#"+rowId);
                        if (data.exec_state == "1") {
                            // var attr_code_name = WYUtil.getAttrValueName('EXEC_STATUS', data.exec_state);
                            var attr_code_name = ele.find("td").eq(3).html();
                            layer.alert("该任务【" + attr_code_name + "】, 不允许下载");
                            return;
                        }
                        window.open("UploadController/downloadExlforLocPlan.do?plan_id="+data.plan_id); 
                    });
            }else{
                me.$(".js-table").xtable("loadData",[]);
                var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
                me.$(".js-table").append(error_tr);
            }
        },
        //查看明细
        view_detail : function(jqDom) {
            var me = this;
            var data = {};
            var rowId = jqDom.attr("id");
            var data = me.$(".js-table").xtable("findData","#"+rowId);
            fish.popupView({
                url:"modules/businessQuery/batchPlanLocation/views/DetailView.js",
                width:400,
                viewOption:{
                    plan_id:data.plan_id,
                    exec_state:data.exec_state,
                    plan_name:data.plan_name
                },
            })
        },
        getDateTime:function(dateStr){
            var date = new Date(dateStr);
            return  date.getTime();
        },
        //删除操作
        deleteProject : function() {
            var me = this;
            var row = me.$(".js-table").xtable("getSelected");
            if (!row || row.length == 0) {
                layer.alert("请选择要删除的任务");
                return;
            }
            var obj = row[0];
            var exec_state = obj.exec_state;
            var tr = me.$(".js-table").find("tr[id="+obj.plan_id+"]");
            if(exec_state == 1){
                // var attr_code_name = WYUtil.getAttrValueName('EXEC_STATUS', exec_state);
                var attr_code_name = tr.find("td").eq(3).html();
                layer.alert("该任务【" + attr_code_name + "】，不允许删除");
                return;
            }
            
            layer.confirm("确认删除【" + obj.plan_name + "】？", {yes: function() {
            var param = {id : obj.plan_id};      
            fish.callService("LocationController", "delProject", param , function(reply){
                    if (reply.res_code != "00000") {
                        layer.alert(reply.res_message);
                        return;
                    }
                    layer.alert("删除成功");
                    me.doQuery();
                });
            }});
        }
        

        });
        return pageView;
    });
