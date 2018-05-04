define(['hbs!modules/businessQuery/custBalanceQuery/templates/custBalanceSearch.html',
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
                        {data: "msisdn", title: "MSISDN（卡号）", width: "25%"},
                        {data: "card_brand_type", title: "卡品牌", width: "20%"},
                        {data: "", title: "查询时间", width: "30%",
                        formatter:function(data){
                            return that.curDateTime();
                        }},
                        {data: "strBalance", title: "实时余额（元）", width: "25%"}
                    ],
                    onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
                };
                that.$("#xtab").xtable(option);

                that.$("#search_btn").unbind("click").bind("click",function(){
                    that.queryCardBalance();
                });
                that.initBatchUpload();
                //批量查询模板下载 
                that.$("button[name='batch_balance_temp']").unbind("click").bind("click",function(){
                    window.open("servlet/downloadExcel?type=mould&mould=balance");                 
                });
                
            },
        tableStyling:function(){
            var that = this;
            //DATATABLE的classname是包括表头的，故自行设定表列样式
            that.$("#xtab").find("tr").each(function(){
                $(this).children("td").eq(2).addClass("text text-weaker-color");
            });
        },
            //查询用户余额
        queryCardBalance : function(page, rows){
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
            param.search_content = msisdn;
            fish.callService("CustBusinessContrller", "queryCustBalanceState", param, function(data){
                var has_data = false;
                var pageCount = 0;
                if(data.res_code=="00000"){
                    has_data = true;
                    me.appendCardInfo(data.result);
                }
                if(has_data == false){
                    var res_message = data.res_message;
                    if(res_message == ''){
                        res_message = '暂无数据，请重新查询！';
                    }
                    me.$("#xtab").xtable("loadData",{});
                    var error_tr = '<tr><td colspan="99" align="center"><font color="red">'+res_message+'</font></td></tr>';
                    me.$("#xtab").append(error_tr);
                };

                
            });
        },
        //渲染分页列表
        appendCardInfo:function(data){
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
            me.$('#balance_file').unbind().on('change',function(){
                var fileName = me.$("#balance_file").val();
                // $("#balance_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        me.$("#balance_file").val("");
                        return;
                    }
                }
                var params_str = {};
                params_str.upload_type = 'balance_info';
                
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                $.ajaxFileUpload({
                    url :"UploadController/uploadExcel.do",
                    secureuri : false,
                    data: params,
                    fileElementId : "balance_file",
                    dataType : 'json',
                    success : function(data, status) {
                        layer.closeAll();
                        me.$("#balance_file").val("");
                        if(data.res_code == "00000"){
                            var info = data.result;
                            var exl_message = info.exl_message;
                            layer.alert(exl_message, function(){                
                                var mark = info.mark;
                                //少于20条数据
                                if(mark=='0'){
                                    var res_list = info.res_list
                                    me.appendCardInfo2(res_list);
                                }else{
                                    var download_key = info.download_key;
                                    window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=balance_info");   
                                }
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
                        me.$("#balance_file").val("");
                        layer.closeAll();
                    }
                });
                layer.load();
                me.initBatchUpload();
            });
        }, 
        //上传xls渲染分页列表
        appendCardInfo2 : function(data){
            var me = this;
            if(data){
                 me.$("#xtab").xtable("loadData",data);
                    // me.initTableEvent();
            }
            else{
                me.$("#xtab").xtable("loadData",[]);
                var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
                me.$("#xtab").append(error_tr);
            }
        },  
        //获取当前系统时间
        curDateTime:function(){
            
            var d = new Date(); 
            //var year = d.getYear();
            var year = d.getFullYear(); 
            var month = d.getMonth()+1; 
            var date = d.getDate(); 
            var day = d.getDay(); 
            var hours = d.getHours(); 
            var minutes = d.getMinutes(); 
            var seconds = d.getSeconds(); 
            var ms = d.getMilliseconds(); 
            var curDateTime= year;
            if(month>9)
            curDateTime = curDateTime +"-"+month;
            else
            curDateTime = curDateTime +"-0"+month;
            if(date>9)
            curDateTime = curDateTime +"-"+date;
            else
            curDateTime = curDateTime +"-0"+date;
            if(hours>9)
            curDateTime = curDateTime +" "+hours;
            else
            curDateTime = curDateTime +"0"+hours;
            if(minutes>9)
            curDateTime = curDateTime +":"+minutes;
            else
            curDateTime = curDateTime +":0"+minutes;
            if(seconds>9)
            curDateTime = curDateTime +":"+seconds;
            else
            curDateTime = curDateTime +":0"+seconds;
            return curDateTime; 
        },
        //页面中无对应的".back_a"元素，该函数无作用
        // initTableEvent : function(){
        //     var me = this;
        //     $(".back_a").unbind("click").click(function(e){
        //         $(".member_list_div").show();
        //         $(".member_detail_div").hide();
        //     });
        // },
        });
        return pageView;
    });
