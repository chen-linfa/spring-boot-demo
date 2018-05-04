define(['hbs!modules/businessQuery/groupFlowQuery/templates/groupFlowQuery.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-progressbar1').progressbar();
                that.initFormTable();
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
                var me = this;
                me.$(".js-col-row").empty();
                if(data){
                    for(var i=0; i<data.length; i++){
                        var memberInfo = data[i];
                            //展示详细信息
                        me.imei_grouping(memberInfo);
                    }
                }else{
                    me.$(".js-col-row").empty();
                    var error_tr = '<div><td colspan="99" align="center"><font color="red">客户没有订购流量池套餐！</font></div>';
                    me.$(".js-col-row").append(error_tr);
                }
            },
            imei_grouping : function(data) {//mem_user_id
                var me = this;
                param={};
                param.orderflows_id=data.orderflows_id;
                param.prod_name=data.prod_name;
                param.prod_code=data.prod_code;
                fish.callService("CustBusinessContrller", "queryFlows", param , function(result){
                    if(result.res_code == "00000"){
                    	var temp = me.$(".js-temp").clone();
                        var total_flow = 0;
                        if(result.result.flow_limit!=''&&result.result.flow_limit!=null){
                            total_flow = result.result.flow_limit;
                        }

                        var left =parseFloat(result.result.flow_left);
                        var used = parseFloat(result.result.flow_used);
                        if(left==0&&used==0){
                            layer.alert("暂无数据");
                        }
                        var progress = total_flow == 0?0:(used/total_flow)
                        temp.find(".js-total").html(total_flow+'<span class="text-brand-primary">MB</span>');
                        temp.find(".js-used").html(used+'<span class="f12 text-brand-primary">MB</span>');
                        temp.find(".js-left").html(left+"MB");
                        temp.find('.js-progressbar1').progressbar("value",progress);//进度条
                        temp.find(".js-name").html(data.prod_name);
                        me.$(".js-col-row").append(temp);
                    }else{
                        layer.alert(result.res_message);
                    }
                });
                
            },
        });
        return pageView;
    });
