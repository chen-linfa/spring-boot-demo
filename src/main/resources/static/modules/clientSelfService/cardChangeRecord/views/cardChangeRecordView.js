define(['hbs!modules/clientSelfService/cardChangeRecord/templates/cardChangeRecord.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
            	that.$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                var option = {
    					pagination: false,
    					autoFill: false,
    					singleSelect: true,//该表格可以多选
    					rowId: "msisdn",//指定主键字段
    					onSelectClass: "selected",
    					nowPage: 1,
    					columns: [
                            {data: "msisdn", title: "卡号", width: "20%"},
                            {data: "old_status_cd", title: "卡状态(变更前)", width: "10%",code:"CARD_STATUS"},
                            {data: "new_status_cd", title: "卡状态(变更后)", width: "10%",code:"CARD_STATUS"},

    					],//每列的定义
    					//onLoad: me.initTableEvent //表单加载数据后触发的操作
    				};
                that.$("#xtab").xtable(option);	
                that.$('.js-pagination').pagination({
                	records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	var me = this;
                    	var param = {};
    					param.msisdn = $.trim($("#search_sms_name").val());//除去输入框中的空格
    					
    					me.initTable(null, null, param);
                    },
                    create:function(){
                    	//默认不加载
                    	//that.queryMemberInfo(1);
                    }
                });
                that.initEvent();
            },
			initEvent : function() {

				var me = this;
				$('#start_time').val(me.addDate(-30));
				$('#end_time').val(me.addDate(0));
			//	alert($('#start_time').val())
				var dfmt = "yyyy-MM-dd";
		        var minDate = me.addDate(-90);
		        var maxDate = me.addDate(0);
		        me.limitDate("start_time", dfmt, minDate, maxDate);
		        me.limitDate("end_time", dfmt, minDate, maxDate);
				$("#btn_search").click(function() {
					var param = {};
					param.msisdn = $.trim($("#search_sms_name").val());//除去输入框中的空格
					me.initTable(null, null, param);
				});
				//过滤非法的卡号输入值
	        	me.$('#search_sms_name').bind({
	        		keyup:function(){
	        			this.value=this.value.replace(/\D/g,'');
	        		}
	        	});

				

			},
	        addDate :function(days) {
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
			 limitDate : function(key, dfmt , minDate , maxDate) {
			     	$("#"+key+"").unbind('focus').bind('focus',function(){
			     		$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
			        });
			    },
				dataChangeEvent : function(param){
					var me = this;
					me.initTable(null, null, param);
				},
				
				// 初始化表格
				initTableEvent : function(jq) {
					var me = window.CardStateChange;
				},

				initTable : function(pageNum, pageRow, params) {
					var me = this;
	    			if(!me.validate()){
	    				return false;
	    			}
					if (params == null) {
						params = {};
					}
					
					/*if(params.start_time==""||params.start_time==null){
						params.start_time = TimeUtil.getHistoryMonth(3);
					}*/
					var num = 1;
					var row = 10;
					params.page = pageNum == null ? num : pageNum;
					params.rows = pageRow == null ? row : pageRow;
					if(me.if_upload_search){
						params.start_time = "";
						params.end_time = "";
						params.search_where = "";
						params.msisdn_list = me.msisdn_list;
					}
					params.start_time = $("#start_time").val();
					params.end_time = $("#end_time").val();

					fish.callService("CustBusinessContrller", "qryMemCardStateChange",params, function(reply) {
	                		console.log(reply);
	                		me.$("#xtab").xtable("loadData",reply.rows);
	                		me.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
	                		me.$(".page-total-num").text(reply.pageCount);
	                		me.$(".page-data-count").text(reply.total);
	                	}
					);
				},			  
	    		validate : function(){
	    			var me = this;
	    			var imei = $.trim($("#search_sms_name").val());
	    			var start_time =$("#start_time").val();
	    			var end_time = $("#end_time").val();
	    			if(imei == ''){
	    				layer.alert("查询号码不能为空");
	    				return false;
	    			}else{
	    				if(!/^[1-9][0-9]*$/.test(imei)){
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
				
        });
        return pageView;
    });
