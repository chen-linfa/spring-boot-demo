define(['hbs!modules/businessQuery/apnBatchSearch/templates/apnBatchSearch.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                var option = {
                    pagination: false,
                    autoFill: false,
                    rowId: "msisdn",//指定主键字段
                    singleSelect: true,//该表格可以多选
                    onSelectClass: "selected",
                    nowPage: 1,
                    columns: [
                        {data: "msisdn", title: "MSISDN（卡号）", width: "20%"},
                        {data: "ip", title: "终端IP", width: "20%"},
                        {data: "apn", title: "接入点", width: "15%"},
                        {data: "rat", title: "接入方式", width: "15%"},
                        {data: "gprsstatus", title: "在线状态", width: "15%"},
                        {data: "timestamp", title: "状态变更的时间", width: "20%"}
                    ],
                    onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
                };
                that.$("#xtab").xtable(option);

                that.$("#search_btn").unbind("click").bind("click",function(){
                    that.queryBatchApn();
                });
                that.initBatchUpload();
                //批量查询模板下载 
                that.$("button[name='batch_balance_temp']").unbind("click").bind("click",function(){
                    window.open("servlet/downloadExcel?type=mould&mould=apn");                 
                });
                
            },
        tableStyling:function(){
            var that = this;
            //DATATABLE的classname是包括表头的，故自行设定表列样式
            that.$("#xtab").find("tr").each(function(){
                $(this).children("td").eq(2).addClass("text text-weaker-color");
            });
        },
            //APN查询
        queryBatchApn : function(page, rows){
            var me = this;
            var msisdn = $.trim(me.$('#search_input').val());//去除输入框中的空格
            if(msisdn == '请输入卡号'){
                msisdn = '';
            }
            if(msisdn == ''){
                layer.alert('请输入卡号');
                return ;
            }
            
            if(!/^[1-9][0-9]*$/.test(msisdn)){
                layer.alert("卡号格式错误");
                return;
            }
            
            var param = {};
            var num = 1;
            var row = 10;
            param.pageNum = page==null? num : page;
            param.pageRow = rows==null? row : rows;
            param.search_online_content = msisdn;
            param.msisdn = msisdn;
            fish.callService("CustBusinessContrller", "apnListSearchByMsisidn", param, function(data){
                var pageCount = 0;
                if(data.res_code=="00000"){
                    if(data.result.result_code=='200'){
                    	
                  
                    	 var result = data.result.result[0].apns[0];
         				/*var param.gprsStatus = result.gprsStatus=="00"?"离线":"在线";
         				alert(param.gprsStatus);*/
         				var state = "";
         				var ratstate ="";
         				var newDate = new Date();
         				newDate.setTime(result.timestamp);
         				if(result.gprsStatus=="00"){
         					state="离线";
         				}else{
         					state="在线"
         				}

         				if(result.rat=="1"){
         					ratstate="1G";
         				}else if(result.rat=="2"){
         					ratstate="2G";
         				}else{
         					ratstate="4G或其他"
         				}
         				
         				var datas = {};
         				datas.msisdn = msisdn;
         				datas.ip = result.ip;
         				datas.apn = result.apn;
         				datas.rat = ratstate;
         				datas.gprsstatus = state;
         				datas.timestamp = newDate.toLocaleDateString();
         				me.appendApnInfo(datas);
                    }else{ 
					//null
					}
                   
                }
                
            });
        },
        //渲染分页列表
        appendApnInfo:function(data){
            var me = this;
            if(data){
                var arr = [];
                arr.push(data);
                me.$("#xtab").xtable("loadData",arr);
                //me.initTableEvent();
            }else{
                me.$("#xtab").xtable("loadData",[]);
                var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
                me.$("#xtab").append(error_tr);
            }
        }, 
        //初始化上传事件
        initBatchUpload : function(){
            var me = this;
            //附件上传
            me.$('#apn_file').unbind().on('change',function(){
                var fileName = me.$("#apn_file").val();
                // $("#apn_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        me.$("#apn_file").val("");
                        return;
                    }
                }
                var params_str = {};
                params_str.upload_type = 'apn';
                
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                $.ajaxFileUpload({
                    url :"UploadController/uploadExcel.do",
                    secureuri : false,
                    data: params,
                    fileElementId : "apn_file",
                    dataType : 'json',
                    success : function(data, status) {
                        layer.closeAll();
                        me.$("#apn_file").val("");
                        if(data.res_code == "00000"){
                        	var info = data.result;
                        	var exl_message = data.res_message;
                            layer.alert(exl_message, function(){                
                                var download_key = info.download_key;
                                window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=apns"); 
                                layer.closeAll();
                            });
                        }else{
                            layer.alert(data.res_message);
                        }
                        me.initBatchUpload();
                    },
                    
                    error : function(data, status, e) {
                        var me = that;
                        layer.alert("操作失败");
                        me.initBatchUpload();
                        me.$("#apn_file").val("");
                        layer.closeAll();
                    }
                });
                layer.load();
                me.initBatchUpload();
            });
        }, 
        });
        return pageView;
    });
