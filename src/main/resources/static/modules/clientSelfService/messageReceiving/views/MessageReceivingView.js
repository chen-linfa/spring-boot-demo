define(['hbs!modules/clientSelfService/messageReceiving/templates/message-receiving.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.$('.js-selectmenu').combobox();
            that.$('.js-check').icheck();
            that.$('#start_time').val(that.addDate(-30));
            that.$('#end_time').val(that.addDate(0));
            var initdate = new Date();
            var mindate = that.addMonth(-3);
            var startdate = new Date();
            startdate.setDate(startdate.getDate() - 30);
            that.$("#start_time").datetimepicker({viewType:"date",
                initialDate:fish.dateutil.format(startdate, 'yyyy-mm-dd'),
                startDate:mindate,
                endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd'),
            });
            that.$("#end_time").datetimepicker({
                viewType:"date",
                initialDate:initdate,
                startDate:mindate,
                endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
            });
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "noticeTitle",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "send_msisdn", title: "发送号码", width: "20%"},
                    {data: "msg_content", title: "内容", width: "20%"},
                    {data: "receive_ttime", title: "接收时间", width: "20%"},
                    {data: "receive_msisdn", title: "转发号码", width: "20%"},
                    {data: "create_date", title: "创建时间", width:"20%"}
                ],//每列的定义
                //onLoad: fish.bind(that.bindTableButton,that) //表单加载数据后触发的操作
            };
            this.$("#myTable").xtable(option);
            this.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.queryMemberInfo(eventData.page,rowNum);
                },
                create:function(){
                    //默认不加载
                    //that.queryMemberInfo(1);
                }
            });
            //this.doQuery();
            this.$('#query').click(function(){
                var param = {};
                param.search_where = that.$("#search_input").val();//除去输入框中的空格
                param.start_time = that.$("#start_time").val();
                param.end_time = that.$("#end_time").val();
                that.doQuery(null, null, param);
            });
            that.$("#template_download").click(function(){
                var search_content = $.trim(that.$('#search_input').val());
                var url = "servlet/downloadExcel?type=mould&mould=msg_accept";
                window.open(url);
            });

            that.$('#data_export').click(function(){
                
                var search_where = that.$('#search_input').val();
                var param = {};
                param.search_where = search_where; 
                param.start_time = that.$("#start_time").val();
                param.end_time = that.$("#end_time").val();
                param.type = "recevie_sms";
                fish.callService("SmsController", "exportSmsData", param,function(data) {
                    if (data.res_code == "00000") {
                        var temp_key = data.result;
                        var download_key = temp_key.download_key;
                        var exl_message = temp_key.exl_message
                        layer.alert("继续下载？", function(index){
                            window.open("servlet/downloadExcel?type=recevie_sms&temp_key="+temp_key);
                            layer.close(index);
                        });
                    } else {
                        layer.alert(data.res_message);
                    }
                });
            });
            that.initUploadEvent();
            //过滤非法的卡号输入值
            that.$('#search_input').bind({
                keyup:function(){
                    this.value=this.value.replace(/\D/g,'');
                }
            });
            var param = {};
            param.search_where = that.$("#search_input").val();//除去输入框中的空格
            param.start_time = that.$("#start_time").val();
            param.end_time = that.$("#end_time").val();
            that.doQuery(null, null, param);
		},
        initUploadEvent:function(){
            var that = this;
            that.$('#number_upload').on("change", function(){
                var fileName = that.$("#number_upload").val();
                that.$("#number_upload").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        that.$("#number_upload").val("");
                        return;
                    }
                }
            
                var params_str = {};
                params_str.upload_type = 'msg_accept';
                
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                $.ajaxFileUpload({
                    url : "UploadController/uploadExcel.do",
                    secureuri : false,
                    fileElementId : "number_upload",
                    data: params,
                    dataType : 'json',
                    success : function(data) {
                        layer.closeAll();
                        that.$("#number_upload").val("");
                        if(data.res_code=="00000"){
                            var info = data.result;
                            var download_key = info.download_key;
                            var exl_message = info.exl_message
                            if(""!=info.download_key && null!=info.download_key){
                                var download_key = info.download_key;
                                window.open(Utils.getContextPath() + "/UploadController/downloadExcel.do?download_key="+download_key+"&download_type=number_upload");   
                            }else{
                                var res_list = info.res_list
                                that.$("#myTable").xtable("loadData",res_list);
                                that.$('.js-pagination').pagination("update",{records:res_list.length,start:"1"});
                                that.$(".page-total-num").text("1");
                                that.$(".page-data-count").text(res_list.length);
                            }
                        }else{
                            layer.alert(data.res_message);
                        }
                    },
                    error : function(data) {
                        layer.alert("操作失败 ！  "+ data.res_message);
                        that.$("#number_upload").val("");
                        layer.closeAll();
                    }
                });
                layer.load();
                that.initUploadEvent();
            });
        },
        doQuery : function( page, rows, param){
            var that = this;
            var param = {};
            var num = 1;
            var row = 10;
            var search_content = that.$("#search_input").val();
            param.page = page==null? num : page;
            param.rows = rows==null? row : rows;
            param.search_content = search_content;
            if(param.start_time==""||param.start_time==null){
                param.start_time = that.addDate(-90);
            }
            fish.callService("SmsController", "querySmsReceiveRecord", param, function(result){
                //console.log(result.rows);
                that.$("#myTable").xtable("loadData",result.rows);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
            });
        },
        addDate : function(days) {
            var d = new Date();
            d.setDate(d.getDate() + days);
            var month = d.getMonth() + 1;
            var day = d.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            var val = d.getFullYear() + "-" + month + "-" + day;
            return val;
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
        },queryMemberInfo : function( page, rows){
            var that = this;
            var param = {};
            var num = 1;
            var row = 10;
            var search_content = that.$("#search_input").val();
            param.page = page==null? num : page;
            param.rows = rows==null? row : rows;
            param.search_content = search_content;
            if(param.start_time==""||param.start_time==null){
                param.start_time = that.addDate(-90);
            }
            fish.callService("SmsController", "querySmsReceiveRecord", param, function(result){
                //console.log(result.rows);
                that.$("#myTable").xtable("loadData",result.rows);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
            });
        }
        
        //  limitDate : function(key, dfmt , minDate , maxDate) {
        //     $("#"+key+"").unbind('focus').bind('focus',function(){
        //         WdatePicker({dateFmt:dfmt, minDate:minDate, maxDate:maxDate});
        //     });
        // }
	});
    return pageView;
});
