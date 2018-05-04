define(['hbs!modules/businessQuery/groupFlowQuery/templates/groupFlowQuery.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-progressbar1').progressbar();
                that.initMemTable();
                that.initFormTable();
                that.initClick();
            },
            
            initClick : function(){
            	var that = this;
                //返回
                that.$("#btn_back").click(function(e){
                	$(".js-col-row").show();
        			$(".js-mem-row").css("visibility","hidden");
        			that.options.group_code = "";
                });
            },
            
            //查询订购组名称
            initFormTable : function(){//page, rows
                var me = this;
                var param = {};
                fish.callService("CustBusinessContrller", "queryIsOrderFlows", param, function(data){
                    if (data.res_code == "00000") {
                        if (data && data.result.length > 0) {
                            me.initTableData(data.result);
                        } else {
                            me.$(".js-col-row").empty();
                            var error_tr = '<div><td colspan="99" align="center"><font color="red">客户没有订购流量池套餐！</font></div>';
                            me.$(".js-col-row").append(error_tr);
                        }
                    }
                });
            },
            /*数据填充*/
            initTableData : function(data){
                var that = this;
                that.$(".js-col-row").empty();
                if(data){
                    for(var i=0; i<data.length; i++){
                        var memberInfo = data[i];
                            //展示详细信息
                        that.imei_grouping(memberInfo);
                    }
            
                }else{
                	that.$(".js-col-row").empty();
                    var error_tr = '<div><td colspan="99" align="center"><font color="red">客户没有订购流量池套餐！</font></div>';
                    that.$(".js-col-row").append(error_tr);
                }
            },
           
            // 初始化成员表格
    		initMemTable : function() {   			
                var that = this;
                var option = {
                    pagination: false,
                    autoFill: false,
                    singleSelect: true,//该表格可以多选
                    rowId: "mem_user_id",//指定主键字段
                    onSelectClass: "selected",
                    nowPage: 1,
                    columns: [
                        {data: "mem_user_id", title: "MSISDN（卡号）", width: "20%"},
                        {data: "card_status_desc", title: "卡状态", width: "20%"},
                        {data: "group_code", title: "归属流量池", width: "20%",formatter:function(){return that.options.group_code}},
                        {data: "count_flow_total", title: "已使用流量(MB)", width: "20%",formatter:function(data){
                        	return (data/1024/1024).toFixed(2); 
                        }}
                    ],//每列的定义
                };
                that.$form_table= that.$("#form_table").xtable(option);
                
                that.$('.js-pagination-mem').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                        var rowNum = that.$('.js-pagination-mem').pagination("option","rowNum");
                        that.$("#form_table").xtable("options",{pageSize:rowNum});
                        var group_code = that.options.group_code;
                        that.queryMem(group_code,eventData.page,rowNum);
                    },
                    create:function(){}
                });
    		},
            
            imei_grouping : function(data) {//mem_user_id
                var that = this;
                param={};
                param.orderflows_id=data.orderflows_id;
                param.prod_name=data.prod_name;
                param.prod_code=data.prod_code;
                fish.callService("CustBusinessContrller", "queryFlows", param , function(result){
                    if(result.res_code == "00000"){
                    	var temp = that.$(".temp-div .js-temp").clone();
                        var total_flow = 0;
                        if(result.result.flow_limit!=''&&result.result.flow_limit!=null){
                            total_flow = result.result.flow_limit;
                            var total_flow_fixed = ((result.result.flow_limit/1024)>1?((result.result.flow_limit/1024).toFixed(2)+'<span class="text-brand-primary">GB</span>'):((result.result.flow_limit).toFixed(2)+'<span class="text-brand-primary">MB</span>'));
                        }
                        
                        var left = ((result.result.flow_left/1024/1024)>1?((result.result.flow_left/1024/1024).toFixed(2)+"GB"):((result.result.flow_left/1024).toFixed(2)+"MB"));
                        var used_fixed = ((result.result.flow_used/1024/1024)>1?((result.result.flow_used/1024/1024).toFixed(2)+"GB"):((result.result.flow_used/1024).toFixed(2)+"MB"));

                        var used = (parseFloat(result.result.flow_used)/1024).toFixed(2);
//                        if(left==0&&used==0){
//                            layer.alert("暂无数据");
//                        }
                        var progress = total_flow == 0?0:(used/total_flow)*100;
                        if(parseInt(used)==0){
                        	progress=0;
                        }
                        temp.find(".js-total").html(total_flow_fixed);
                        temp.find(".js-used").html(used_fixed);
                        temp.find(".js-left").html(left);
                        temp.find('.js-progressbar1').progressbar("value",progress);//进度条
                        temp.find(".js-name").html(result.result.flow_member+"("+data.prod_code+")");
                        var group_code=data.prod_code;
                        temp.attr("id",data.prod_code);
                        temp.click(function(){
//                        	$(".js-mem-row").show();
                        	function getSearch(){
                				that.queryMem(group_code);
                			}
                            that.$("#btn_search").bind("click",getSearch);
                        	that.queryMem(data.prod_code);
                        });
                        that.$(".js-col-row").append(temp);
                        
                    }else{
                        layer.alert(result.res_message);
                    }
                });
            },
            
    		queryMem : function(group_code,page,rows) {
    			$(".js-col-row").hide();
    			$(".js-mem-row").css("visibility","visible");
    			var that = this;
    			var params = {"group_code" : group_code};
    			params.page = page==null? 1 : page;
                params.rows = rows==null? 10 : rows;
                that.options.group_code = group_code;
                var search_content = $.trim($('#search_input').val());
                if(search_content!=""){
                	params.search_content=search_content;
                }
    			fish.callService("CustMemController", "queryMemByFlowGroup", params, function(data) {
    				if (data.res_code == "00000") {
    					that.$("#form_table").xtable("loadData",data.result.rows);
    					that.$('.js-pagination-mem').pagination("update",{records:data.result.total,start:data.result.pageNumber});
    	                that.$(".page-total-num-mem").text(data.result.pageCount);
    	                that.$(".page-data-count-mem").text(data.result.total);
    					that.$(".x-hide").show();
    				} else {
    					fish.error(data.res_message);
    				}
    			});
    		},
    		
    		initData:function(){//用以从其它页面跳转到当前页面传参，在mainView.js的openView函数中调用。若不声明，会报错
            }
    		
        });
        return pageView;
    });
