define(['hbs!../templates/member-business-query.html'], function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function() {
            var that = this;
            
            var initdate = new Date();
            var mindate = new Date();
            //最多查询六个月以前的
            mindate.setMonth(mindate.getMonth()+ 1 + -6);
            that.$('.js-start_date').datetimepicker({
            	buttonIcon:"",
            	viewType: "month",
            	startDate:fish.dateutil.format(mindate, 'yyyy-mm'),
            	endDate:fish.dateutil.format(initdate, 'yyyy-mm')
            });
            
            that.$('.js-end_date').datetimepicker({
            	viewType: "month",
            	startDate:fish.dateutil.format(mindate, 'yyyy-mm'),
            	endDate:fish.dateutil.format(initdate, 'yyyy-mm')
            });
            
            var option = {
				pagination: false,
				autoFill: false,
				singleSelect: false,//该表格可以多选
				rowId: "month_cycle",//指定主键字段
				onSelectClass: "selected",
				nowPage: 1,
				columns: [
				    {data: "month_cycle", title: "月份", width: "20%"},
				    {data: "msisdn", title: "MSISDN（卡号）", width: "20%"},
					{data: "count_flow_total", title: "	使用流量(MB)", width: "20%"},
					{data: "count_msg_total", title: "使用短信(条)"},
					{data: "count_voice_total", title: "使用通话(分钟)", width: "20%"}
				],//每列的定义
				//onLoad: me.initTableEvent //表单加载数据后触发的操作
			};
			that.$("#xtab").xtable(option);	
			
			that.$("#btn_download").click(function(){
				window.open("servlet/downloadExcel?type=mould&mould=mem_busi");
			});
			
			that.$("#btn_query").click(function(){
				that.queryMemberBusiness();
			});
			
						//附件上传
			that.$('#mem_busi_info_file').unbind().on("change", function(){
				var fileName = that.$("#mem_busi_info_file").val();
				var extPattern = /.+\.(xls|xlsx)$/i;
				if($.trim(fileName) != ""){
					if(!extPattern.test(fileName)){
						layer.alert("只能上传EXCEL文件！");
						return;
					}
				}
				
				var formdata = that.$("#query_form").form('value');
				var start_time = formdata.start_time;
				var end_time = formdata.end_time;
				if(!start_time || !end_time){
					layer.alert("查询时间段不能为空");
					return false;
				}
				var startTime = that.getDateTime(start_time);
				var endTime = that.getDateTime(end_time);
				if(startTime > endTime){
					layer.alert("开始时间不能大于结束时间");
					return false;
				}
				
				var params_str = {};
				params_str.start_time = start_time;
				params_str.end_time = end_time;
				params_str.upload_type = 'mem_busi_info';
				
				var other_params_str = JSON.stringify(params_str);
				var reg = new RegExp('"', "g");
	            var other_params_str = other_params_str.replace(reg, "?");
	            
				var params = {};
				params.params_str = other_params_str;
				
	        	$.ajaxFileUpload({
	    			url : "UploadController/uploadExcel.do",
	    			secureuri : false,
	    			fileElementId : "mem_busi_info_file",
	    			data: params,
	    			dataType : 'json',
	    			success : function(data) {
	    				layer.closeAll();
	    				that.$("#mem_busi_info_file").val("");
	    				if(data.res_code=="00000"){
	    					var info = data.result;
	    					var download_key = info.download_key;
	    					var exl_message = info.exl_message
	    					layer.alert(exl_message, function(index){
	    						window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=mem_busi_info");                 
	    						layer.close(index);
	    					});
	    				}else{
	    					layer.alert(data.res_message);
	    				}
	       			},
	    			error : function(data) {
	    				layer.alert("操作失败   "+ data.res_message);
	    				that.$("#mem_busi_info_file").val("");
	    				layer.closeAll();
	    			}
	    		});
	        	layer.load(1);
	        });
	        //过滤非法的卡号输入值
        	that.$('#msisdn').bind({
        		keyup:function(){
        			this.value=this.value.replace(/\D/g,'');
        		}
        	});
        },
        queryMemberBusiness:function(){
        	    var that = this;

            	var param = that.$("#query_form").form('value');
            	
            	if(!that.validate(param)){
            		return;
            	}
            	
            	fish.callService("AnalysisController", "queryMemUserBusi",param,function(reply){
            		if(reply.res_code == "00000"){
            			if($.isArray(reply.result)){
            				that.$("#xtab").xtable("loadData",that.unitTranslate(reply.result));
            			}else{
            				that.$("#xtab").xtable("loadData",[]);
            			}
            		}
            	});
        },
        validate:function(data){
	        if(!data.msisdn){
	        	layer.alert("查询卡号不能为空!");
	        	return false;
	        }
	        if(data.msisdn){
				if(!/^[1-9][0-9]*$/.test(data.msisdn)){
					layer.alert("卡号格式错误");
					return;
				}
			}
	        if(!data.start_time || !data.end_time){
	        	layer.alert("查询时间段不能为空!");
	        	return false;
	        }
	        
	        var startTime = new Date(data.start_time).getTime();
			var endTime = new Date(data.end_time).getTime();
	
			if (startTime > endTime) {
				layer.alert("起始时间不能大于结束时间!");
				return false;
			}
			return true;
        },
        getDateTime:function(dateStr){
			var arr = dateStr.split("-");
			var date = null;
			if(arr.length > 2){
				date = new Date(arr[0], arr[1],arr[2]);
			}else{
				date = new Date(arr[0], arr[1]);
			}

			return  date.getTime();
		},
        //流量单位转换
		unitTranslate : function(datas){
			if($.isArray(datas) && datas.length > 0){
				
				$.each(datas, function(i, msisdn){
					var count_flow_total = msisdn.count_flow_total;
					if(count_flow_total == undefined || count_flow_total == '' || count_flow_total == 'null'){
						count_flow_total = 0;
					} 
					var num = (parseFloat(count_flow_total) / (1024*1024)).toFixed(2);
					msisdn.count_flow_total = parseFloat(num);
				});
			}
			return datas;
		}
    });
    return pageView;
});