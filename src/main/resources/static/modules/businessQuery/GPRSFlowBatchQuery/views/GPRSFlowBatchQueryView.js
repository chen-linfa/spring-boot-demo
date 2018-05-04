define(['hbs!modules/businessQuery/GPRSFlowBatchQuery/templates/GPRSFlowBatchQuery.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-pagination').pagination({
                    records: 100
                });
                var option = {
                    pagination: false,
                    autoFill: false,
                    singleSelect: true,//该表格可以多选
                    rowId: "msisdn",//指定主键字段
                    onSelectClass: "selected",
                    nowPage: 1,
                    columns: [
                        {data: "msisdn", title: "MSISDN(卡号)", width: "20%"},
                        {data: "outflows", title: "使用流量数(单位MB)", width: "20%"},
                        {data: "outTeleminutes", title: "通话分钟数(单位分)", width: "20%"},
                        {data: "outMassage", title: "使用短信数（单位条）", width: "15%"},
                        {data: "outColmassage", title: "彩信数（单位条)", width: "15%"},
                        {data: "control", title: "操作", width:"10%", formatter: function(data){
                            //操作列的按钮生成
                            var html = '<a href="javascript:void(0);" class="js-btn_detail" name="detail">详细信息</a>';
                            return html;
                             }
                        }
                    ],
                    onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
                };
                that.$('.js-flow-table').xtable(option);
                that.initUploadEvent();
                //批量查询模板下载 
                that.$("button[name='batch_flow_temp']").unbind("click").bind("click",function(){
                    window.open("servlet/downloadExcel?type=mould&mould=flow");                 
                });
                //页面中找不到该按钮
                // that.$("#mem_search").unbind("click").bind("click",function(){
                //     that.queryStatisticsFlowInfo();
                // });
                // 页面中找不到该按钮，点击导出数据
                // $("button[name='export_flow_data']").unbind("click").bind("click",function() {
                    
                //     var search_where = $("[name='search_where']").val();
                //     var param = {};
                //     param.search_where = search_where; 
                //     param.start_time = $("#start__time").val();
                //     param.end_time = $("#end_time").val();
                //     param.type = "flow";
                //     Invoker.async("CustBusinessContrller", "exportCustQryData", param,function(data) {
                //         console.log(data);
                //         if (data.res_code == "00000") {
                //             var temp_key = data.result;
                //             window.open(Utils.getContextPath() + "/servlet/downloadExcel?type=flow_data&temp_key="+temp_key);                 
                //         } else {
                //             Utils.alert(data.res_message);
                //         }
                //     });
                // });
                //页面找不到该按钮返回上一页
                // $("[name='return_last_level']").unbind("click").bind("click",function(){
                //     $("#mem_list_div").show();
                //     $("#sms_list_div").hide();
                // });
            },
            cur_sms_list : [],  
            msisdn : "",//当前卡号  
            tableStyling:function(){
                var that = this;
                //DATATABLE的classname是包括表头的，故自行设定表列样式
                that.$(".js-flow-table").find("tr").each(function(){
                    $(this).children("td").eq(5).addClass("operation");
                });
            },
            //初始化批量上传事件
            initUploadEvent : function(){
                var me = this;      
                //附件上传
                me.$('#flowinfo_file').unbind().on('change',function(){
                    var fileName = me.$("#flowinfo_file").val();
                    var extPattern = /.+\.(xls|xlsx)$/i;
                    if($.trim(fileName) != ""){
                        if(!extPattern.test(fileName)){
                            layer.alert("只能上传EXCEL文件！");
                            me.$("#flowinfo_file").val("");
                            return;
                        }
                    }
                    var params_str = {};
                    params_str.upload_type = 'mem_flow';
                    
                    var other_params_str = JSON.stringify(params_str);
                    var reg = new RegExp('"', "g");
                    var other_params_str = other_params_str.replace(reg, "?");
                    
                    var params = {};
                    params.params_str = other_params_str;
                    
                    $.ajaxFileUpload({
                        url : "UploadController/uploadExcel.do",
                        secureuri : false,
                        fileElementId : "flowinfo_file",
                        data: params, 
                        dataType : 'json',
                        success : function(data, status) {
                            layer.closeAll();
                            me.$("#flowinfo_file").val("");
                            if (data.res_code == "00000") {
                                var info = data.result;
                                var exl_message = info.exl_message;
                                layer.alert(exl_message, function(){                
                                    var mark = info.mark;
                                    //少于20条数据
                                    if(mark=='0'){
                                        var res_list = info.res_list
                                        me.appendStatisticsSmsInfo(res_list);
                                    }else{
                                        var download_key = info.download_key;
                                        window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=mem_flow");   
                                    }
                                });
                            }else{
                                layer.alert(data.res_message);
                            }
                        },
                        error : function(data, status, e) {
                            layer.alert("操作失败");
                            me.$("#flowinfo_file").val("");
                            layer.closeAll();
                        }
                    });
                    layer.load();
                    me.initUploadEvent();
                });
            },
            //渲染分页列表
            appendStatisticsSmsInfo: function(data){
                var me = this;
                var page = [];
                var html = [];
                var rows = data;

                if(rows != null&&rows.length>0){
                    me.$('.js-flow-table').xtable("loadData",rows);
                    me.bindTableButton(rows);
                    $.each(rows, function(i,value){
                        me.bindTableButton(value);
                    });
                }
                else{
                    me.$('.js-flow-table').xtable("loadData",[]);
                    me.$('.js-flow-table').append("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
                }
            },
            //点击详情
            bindTableButton:function(value){
                var that = this;
                that.$(".js-flow-table").delegate(".js-btn_detail","click",function(){
                    var $tr = $(this).parents("tr");
                    that.$(".js-detail").remove();
                    var $template = that.$("#detail_tr").clone();
                    $template.removeAttr('id').addClass('js-detail');
                    that.$(".js-outTeleminutes").html(value.outTeleminutes);
                    that.$(".js-outMassage").html(value.outMassage);
                    that.$(".js-outflows").html(value.outflows);
                    that.$(".js-outColmassage").html(value.outColmassage);
                    $tr.after($template);
                });
            },
            //页面中无相关触发函数的条件
            //查询流量短信信息
            // queryStatisticsFlowInfo : function(pageNum,pageRow){
                
            //     var me = this;
            //     var search_where = $("[name='search_where']").val();
            //     if(search_where==''||search_where==null){
            //         Utils.alert("请输入卡号！");
            //         return;
            //     }
                
                
            //     var param = {};
            //     var num = 1;
            //     var row = 10;
            //     param.mem_user_id = search_where;
            //     param.pageNum = pageNum==null? num : pageNum;
            //     param.pageRow = pageRow==null? row : pageRow;
            //     //debugger;
            //     Invoker.async("CustBusinessContrller", "queryCurrentBusiUsage", param, function(data) {
            //         console.log(data);
            //         if (data.res_code == "00000") {
            //             me.appendStatisticsSmsInfo(data.result.rows);
            //             laypage({
            //                 cont: 'memPage',
            //                 pages: data.result.pageCount, //总页数
            //                 curr: data.result.pageNumber, //当前页
            //                 //skin: '#6495ED',
            //                 groups: '3', //连续页数
            //                 skip: true, //跳页
            //                 jump: function(obj, first){ //触发分页后的回调
            //                     if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
            //                         var state = $(".tab-nav-link.active").attr("name");
            //                         page_curr = obj.curr;
            //                         me.queryStatisticsFlowInfo(obj.curr);
            //                     }
            //                 }
            //             });
            //         }
            //         else{
            //             Utils.alert(data.res_message);
            //         }
            //     });
                
            // },
            //无相关函数的调用
            //初始化客户查询点击事件
            // initMemDetailClk : function(jqDom){
                
            //     var me = this;
            //     jqDom.find("[name='btn_detail']").unbind("click").bind("click",function(index,ele){
            //         //debugger;
            //         var detail = $(this).closest("tr").data("data");
            //         WYUtil.setInputDomain(detail, $('#detail_container'));
            //         $('#detail_container').show();
            //         $('#memUserList').hide();
                    
            //     });
                
                
            // },
            //取得要展示的列表内容，并把内容赋给cur_sms_list对象
            // loadFlowList : function(pageNum,pageRow){
                
            //     var me = this;
            //     $("#mem_list_div").hide();
            //     $("#sms_list_div").show();
            //     var param = {};
            //     var num = 1;
            //     var row = 10;
            //     param.start_time = $("#start__time").val();
            //     param.end_time = $("#end_time").val();
            //     param.msisdn = me.msisdn;
            //     param.pageNum = pageNum==null? num : pageNum;
            //     param.pageRow = pageRow==null? row : pageRow;
                
            //     Invoker.async("CustBusinessContrller", "flowListSearchByMsisdn", param, function(data) {
            //         console.log(data);
            //         if (data.res_code == "00000") {
            //             me.appendSpecificFlowInfo(data);
            //             laypage({
            //                 cont: 'smsPage',
            //                 pages: data.result.pageCount, //总页数
            //                 curr: data.result.pageNumber, //当前页
            //                 //skin: '#6495ED',
            //                 groups: '3', //连续页数
            //                 skip: true, //跳页
            //                 jump: function(obj, first){ //触发分页后的回调
            //                     if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
            //                         var state = $(".tab-nav-link.active").attr("name");
            //                         page_curr = obj.curr;
            //                         me.loadSmsList(obj.curr);
            //                     }
            //                 }
            //             });
            //         }
            //         else{
            //             Utils.alert(data.res_message);
            //         }
            //     });
            // },
            //增加成员短信列表
            // appendSpecificFlowInfo : function(data){
                
            //     var page = [];
            //     var html = [];
            //     var rows = data.result.rows;
            //     html.push("<tr><th>MSISDN(卡号)</th><th>用户名</th><th>使用日期</th><th>上行流量</th><th>下行流量</th><th>总流量（M）</th></tr>");
            //     if(rows != null){
            //         $.each(rows, function(i,value){
            //             //debugger;
            //             var msisdn_num = "";
            //             html.push("<tr>" +
            //                     "<td name='msisdn_num'><em class='handle'>"+value.mem_user_id+"</em></td>" +
            //                     "<td>"+value.mem_user_name+"</td>" +
            //                     "<td>"+value.status_date+"</td>" +
            //                     "<td>"+(value.fcount_low_up==null?"0":value.fcount_low_up)+"</td>" +
            //                     "<td>"+(value.count_flow_down==null?"0":value.count_flow_down)+"</td>" +
            //                     "<td>"+value.count_flow_total+"</td>" +
            //                     "</tr>");
            //         });
            //     }
            //     else{
            //         html.push("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
            //     }
            //     $("#smsList").html(html.join(""));
            // },
    

    
        });
        return pageView;
    });
