define(['hbs!modules/clientSelfService/cardState/templates/cardStateQuery.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        initialize : function(){
        },
        afterRender: function(){
            var that = this;
            //过滤非法的卡号输入值
            that.$('#search_input').bind({
              keyup:function(){
                this.value=this.value.replace(/\D/g,'');
              }
            });
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "MobNum",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "MobNum", title: "MSISDN号卡", width: "20%"},
                    {data: "IC", title: "是否呼入锁定", width: "20%",formatter: function(result){if(result=='0'){return '否';}else{return '是';}}},
                    {data: "OC", title: "是否呼出锁定", width: "20%",formatter: function(result){if(result=='0'){return '否';}else{return '是';}}},
                    {data: "GPRSLOCK", title: "是否关闭GPRS数据业务", width: "20%",formatter: function(result){if(result=='0'){return '否';}else{return '是';}}},
                    {data: "ESPLOCK", title: "是否关闭LTE数据业务", width: "20%",formatter: function(result){if(result=='0'){return '否';}else{return '是';}}}
                ],//每列的定义
            };
            that.$data_list = that.$("#myTable").xtable(option);
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.$data_list.xtable("options",{pageSize:rowNum});
                },
                create:function(){
                }
            });
            that.initEvent();
            
            that.$("button[name='batch_gprs_temp']").unbind("click").bind("click",function(){
                window.open("servlet/downloadExcel?type=mould&mould=gprs_query");                 
            });
            
            that.initBatchUpload();
		},
        initEvent : function() {
			var me = this;
			$("#query_gprs").click(function() {
				me.doQuery();
			});
	        
	        $("#seach_btn").unbind("click").bind("click",function(){
	        	me.toDetail(me.order_id,me.date,$("#prod_name").val());
	        });
	        
		},
        doQuery : function( page, rows){
        	var that = this;
        	var num = 1;
            var row = 10;
    		var msisdn = $.trim($("[name='misidn_num']").val());// 去除输入框中的空格
    		if (msisdn == '请输入卡号') {
    			msisdn = '';
    		}
    		if (msisdn == '') {
    			Utils.alert('请输入卡号');
    			return;
    		}
    		if (!/^[1-9][0-9]*$/.test(msisdn)) {
    			Utils.alert("卡号格式错误");
    			return;
    		}
    		var result = {};
    		var param = {};
    		param.msisdn = msisdn;
    		param.page = page==null? num : page;
            param.rows = rows==null? row : rows;
            fish.callService("CustBusinessContrller", "queryHssState", param, function(result){
               console.log(result);
                if (result.res_code == "0000") {
                	 that.$("#myTable").xtable("loadData",result.result);
                     that.$('.js-pagination').pagination("update",{records:result.result.length,start:1});
                     that.$(".page-total-num").text( Math.ceil(result.result.length/10));
                     that.$(".page-data-count").text(result.result.length);
				} else {
					layer.alert(result.res_message);
				}
                
            });
        },
        //初始化上传事件
        initBatchUpload : function(){
            var me = this;
            //附件上传
            me.$('#gprs_file').unbind().on('change',function(){
                var fileName = me.$("#gprs_file").val();
                // $("#gprs_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        me.$("#gprs_file").val("");
                        return;
                    }
                }
                var params_str = {};
				params_str.upload_type = 'gprs_status_query';
                
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                $.ajaxFileUpload({
                    url :"UploadController/uploadExcel.do",
                    secureuri : false,
                    data: params,
                    fileElementId : "gprs_file",
                    dataType : 'json',
                    success : function(data, status) {
                        layer.closeAll();
                        me.$("#gprs_file").val("");
                        if (data.res_code == "00000") {
							var info=data.result;
							var exl_message = info.exl_message
							var json=JSON.parse(info.MobNumInfo);
							if(info.mark=="true"){
								alert(exl_message);
								var download_key = info.download_key;
								
                                window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=gprs_statu");  
							}else{
								me.$("#myTable").xtable("loadData",json);
								me.$('.js-pagination').pagination("update",{records:json.length,start:1});
								me.$(".page-total-num").text( Math.ceil(json.length/10));
								me.$(".page-data-count").text(json.length);
							}
							
						} else {
							Utils.alert(data.res_message);
						}
                        me.initBatchUpload();
                    },
                    
                    error : function(data, status, e) {
                        var me = that;
                        layer.alert("操作失败" + data.res_message);
                        me.initBatchUpload();
                        me.$("#gprs_file").val("");
                        layer.closeAll();
                    }
                });
                layer.load();
                me.initBatchUpload();
            });
        }, 
        initData : function(param){
        }
	});
    return pageView;
});
