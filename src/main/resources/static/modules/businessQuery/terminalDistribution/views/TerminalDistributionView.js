define(['hbs!modules/businessQuery/terminalDistribution/templates/terminalDistribution.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-pagination').pagination();
                //初始化时间选择控件
                var initdate = new Date();
                var initdate2 = new Date();
                var mindate = new Date();
                //最多查询三个月范围内的订单
                mindate.setDate(initdate.getDate()-90);
                initdate2.setDate(initdate.getDate()-30)
                that.$('#start_time').datetimepicker({
                    initialDate:initdate2,
                    viewType:"date",
                    format:"yyyymmdd",
                    startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd'),
                    endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
                });
                that.$('#end_time').datetimepicker({
                    initialDate:initdate,
                    viewType:"date",
                    format:"yyyymmdd",
                    startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd'),
                    endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
                });
                //初始化表格
                var option = {
                    pagination: false,
                    autoFill: false,
                    singleSelect: true,//该表格可以多选
                    rowId: "mem_user_id",//指定主键字段
                    onSelectClass: "selected",
                    nowPage: 1,
                    columns: [
                        {data: "mem_user_id", title: "MSISDN(卡号)", width: "20%"},
                        {data: "imei", title: "IMEI", width: "20%"},
                        {data: "prov_name", title: "终端位置", width: "45%"},
                        {data: "day_cycle", title: "定位时间", width: "15%"}
                    ],//每列的定义
                    onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
                };
                that.$(".js-terminal-table").xtable(option);
                //外部分页组件
                that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                        var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                        that.initFormTable(eventData.page,rowNum);
                    },
                    create:function(){
                        //默认不加载
                        //that.queryMemberInfo(1);
                    }
                });
                //查询
                that.$("#btn_search").unbind("click").bind("click",function(){
                    that.initFormTable();
                });
                //下载终端分布清单
                that.$("button[name='export_btn']").unbind("click").bind("click",function(){
                    that.downloadCustMem();
                });
                
                //下载号码模板
                that.$("button[name='load_template_btn']").unbind("click").bind("click",function(){
                    window.open("servlet/downloadExcel?type=mould&mould=mem_device");
                });
                //上传号码下载终端分布清单
                that.initUploadEvent();
                },
             tableStyling:function(){
                var that = this;
                //DATATABLE的classname是包括表头的，故自行设定表列样式
                that.$("#xtab").find("tr").each(function(){
                    $(this).children("td").eq(3).addClass("text text-weaker-color");
                });
            },   
            /**
             * 时间控件日期限制
             * @param key
             * @param dfmt 日期格式 ： yyyy-mm-dd
             * @param min  最小日期  
             * @param max  最大日期
             */
            getDateTime : function(dateStr){
                var date = new Date(dateStr);
                return  date.getTime();
            },
            validate : function(){
                var me = this;
                var msisdn = $.trim(me.$("#msisdn").val());
                var start_time = me.$("#start_time").val();
                var end_time = me.$("#end_time").val();
                if(msisdn == ''){
                    layer.alert("查询号码不能为空");
                    return false;
                }else{
                    if(!/^[1-9][0-9]*$/.test(msisdn)){
                        layer.alert("卡号格式错误");
                        return;
                    }
                }
                if(start_time == '' || end_time == ''){
                    layer.alert("查询时间段不能为空");
                    return false;
                }
                var startTime = me.getDateTime(start_time);
                var endTime = me.getDateTime(end_time);
                if(startTime > endTime){
                    layer.alert("开始时间不能大于结束时间");
                    return false;
                }
                return true;
            },
            initFormTable : function(page, rows){
                var me = this;
                var that = this;
                if(!me.validate()){
                    return false;
                }
                var param = {};
                var num = 1;
                var row = 10;
                var msisdn = $.trim(me.$("#msisdn").val());//除去输入框中的空格
                var start_time = me.$("#start_time").val();
                var end_time = me.$("#end_time").val();
                param.page = page==null? num : page;
                param.rows = rows==null? row : rows;
                param.msisdn = msisdn;
                param.start_time = start_time;
                param.end_time = end_time;
                console.log(param);
                fish.callService("LocationController", "queryDeviceSpeadList", param, function(data){
                    console.log(data);
                    var has_data = false;
                    var pageCount = 0;
                    if(data && data.total>0){
                        has_data = true;
                        me.initTableData(data);
                        pageCount = data.pageCount;
                    }
                    if(has_data == false){
                        me.$(".js-terminal-table").xtable("loadData",[]); 
                    }
                    me.$(".js-page").html(pageCount);
                    me.$(".js-count").html(data.total);
                    me.$('.js-pagination').pagination("update",{records:data.total,start:data.pageNumber});
                });
            },
            initTableData : function(data){
                var me = this;
                var total = data.total;
                if(total > 0){
                    me.$(".js-terminal-table").xtable("loadData",data.rows);  
                }else{
                    me.$(".js-terminal-table").xtable("loadData",[]); 
                }
            },
            downloadCustMem : function(){
                var me = this;
                var start_time = me.$("#start_time").val();
                var end_time = me.$("#end_time").val();
                if(start_time == '' || end_time == ''){
                    layer.alert("查询时间段不能为空");
                    return false;
                }
                var startTime = me.getDateTime(start_time);
                var endTime = me.getDateTime(end_time);
                if(startTime > endTime){
                    layer.alert("开始时间不能大于结束时间");
                    return false;
                }
                window.open("UploadController/downloadExlforCustMemdevice.do?start_time="+start_time+"&end_time="+end_time);
            },
            initUploadEvent : function(){
                var me = this;
                //附件上传
                me.$('#device_spread_file').unbind().on("change", function(){
                    var fileName = me.$("#device_spread_file").val();
                    me.$("#device_spread_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                    var extPattern = /.+\.(xls|xlsx)$/i;
                    if($.trim(fileName) != ""){
                        if(!extPattern.test(fileName)){
                            layerr.alert("只能上传EXCEL文件！");
                            return;
                        }
                    }
                    
                    var start_time = me.$("#start_time").val();
                    var end_time = me.$("#end_time").val();
                    if(start_time == '' || end_time == ''){
                        layer.alert("查询时间段不能为空");
                        return false;
                    }
                    var startTime = me.getDateTime(start_time);
                    var endTime = me.getDateTime(end_time);
                    if(startTime > endTime){
                        layer.alert("开始时间不能大于结束时间");
                        return false;
                    }
                    
                    var params_str = {};
                    params_str.upload_type = 'device_spread';
                    params_str.start_time = start_time;
                    params_str.end_time = end_time;
                    
                    var other_params_str = JSON.stringify(params_str);
                    var reg = new RegExp('"', "g");
                    var other_params_str = other_params_str.replace(reg, "?");
                    
                    var params = {};
                    params.params_str = other_params_str;
                    
                    $.ajaxFileUpload({
                        url :"UploadController/uploadExcel.do",
                        secureuri : false,
                        fileElementId : "device_spread_file",
                        data: params,
                        dataType : 'json',
                        success : function(data) {
                            layer.closeAll();
                            me.$("#device_spread_file").val("");
                            if(data.res_code=="00000"){
                                var info = data.result;
                                var download_key = info.download_key;
                                var exl_message = info.exl_message
                                layer.alert(exl_message, function(index){
                                    layer.close(index);
                                    window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=device_spread");
                                });
                            }else{
                                layer.alert(data.res_message);
                            }
                        },
                        error : function(data) {
                            layer.alert("操作失败！"+ data.res_message);
                            me.$("#device_spread_file").val("");
                            layer.closeAll();
                        }
                    });
                    layer.load();
                    me.initUploadEvent();
                });
            },
        
        });
        return pageView;
    });
