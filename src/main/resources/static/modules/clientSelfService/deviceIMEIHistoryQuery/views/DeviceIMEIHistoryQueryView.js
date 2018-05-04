define(['hbs!../templates/device-IMEI-history-query.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
            	that.$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
    			that.start_time = that.addDate(-14); 
    			that.end_time = that.addDate(-1);
    			
    			that.$("#start_time").val(that.start_time);
    			that.$("#end_time").val(that.end_time);
    		
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "imei",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
                        {data: "mem_user_id", title: "MSISDN（卡号）", width: "20%"},
                        {data: "imei", title: "IMEI", width: "10%"},
                        {data: "card_type", title: "设备类型", width: "15%"},
                        {data: "terminal_type", title: "设备品牌", width: "15%"},
                        {data: "terminal_model", title: "设备型号", width: "15%"},
                        {data: "day_cycle", title: "IMEI记录日期", width: "15%"},
						{data: "control", title: "操作", width:"10%", formatter: function(data){
							//操作列的按钮生成
							var html = '<a href="javascript:void(0);" class="js-btn_detail">展开详情</a>';
							return html;
						}}
					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
				that.$("#xtab").xtable(option);	
				that.bindTableButton();
				
				//外部分页组件
				that.$('.js-pagination').pagination({
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
				
				that.$("#btn_search").unbind("click").bind("click",function(){
					that.initFormTable();
				});
                that.$('#search_input').bind({
                    keyup:function(){
                        this.value=this.value.replace(/\D/g,'');
                    }
                });
            },
    		initFormTable : function(page, rows){
    			var me = this;
    			if(!me.validate()){
    				return false;
    			}
    			var param = {};
    			var num = 1;
    			var row = 10;
    			var imei =$.trim($("#search_input").val());//除去输入框中的空格
    			var start_time = me.$("#start_time").val();
    			var end_time = me.$("#end_time").val();
    			console.log(start_time);
    			console.log("start_time");
    			
    			param.page = page==null? num : page;
    			param.rows = rows==null? row : rows;
    			param.imei = imei;
    			param.start_time = start_time;
    			param.end_time = end_time;
    			fish.callService("TrmlMgrController", "queryTrmlRecord", param, function(data){
    				var has_data = false;
    				var pageCount = 0;
    				if(data && data.total>0){
    					has_data = true;
    					me.initTableData(data);
    					pageCount = data.pageCount;
    				}
    				if(has_data == false){
    					layer.alert("暂无数据");
    					$(".search-from-list #trml_tbody").html('');
    					var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
    					$(".search-from-list #trml_tbody").append(error_tr);
    				}
    				this.$('.js-pagination').pagination("update",{records:data.total,start:data.pageNumber});
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
            	var val = d.getFullYear() + "" +  month + "" + day;
            	return val;
            },
    		initTableData : function(data){
    			var me = this;
    			$(".search-from-list #trml_tbody").html('');
    			var total = data.total;
    			if(total > 0){
    				me.$("#xtab").xtable("loadData",data.rows);
    				me.$('.js-pagination').pagination("update",{records:data.total,start:data.pageNumber});
    				me.$(".page-total-num").text(data.pageCount);
    				me.$(".page-data-count").text(data.total);
//    				for(var i=0; i<data.rows.length; i++){
//    					var memDevice = data.rows[i];
//    					var curr = $(".search-from-list #tr_temp").clone().removeAttr("id").show();
//    					curr.data("data", memDevice);
//    					WYUtil.setInputDomain(memDevice, curr);
//    			        $(".search-from-list #trml_tbody").append(curr);
//    			        curr.data("imei", memDevice.imei);
//    					curr.data("mem_user_id", memDevice.mem_user_id);
//    					curr.data("detail", memDevice);
//    					//详情按钮
//    					curr.find("[name='detail']").bind("click", function() {
//    					var detail = $(this).closest("tr").data("detail");
//    					WYUtil.setInputDomain(detail, $('#detail_container'));
//    					$('#detail_container').show();
//    					$('#page_container').hide();
//    				});
//    				
//    				}
    			}else{
    				var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
    				$(".search-from-list #tr_temp").append(error_tr);
    			}
    		},            
    		validate : function(){
    			var me = this;
    			var imei = $.trim($("#search_input").val());
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
    		getTodayTime:function (){
    			var today = new Date();
    			var cur_month = today.getMonth() * 1 + 1;
    			var cur_day = today.getDate();
    			if (cur_month < 10) {
    				cur_month = "0" + cur_month;
    			}
    			todaytime = new Date(today.getFullYear(), cur_month ,cur_day);
    			return  todaytime.getTime();
    		},
    		
            queryMemberInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	
            	if(!search_content){
            		layer.alert("请输入查询条件！");
            		return;
            	}
            	
            	var param = {
            		page:page,
            		rows:rows,
            		search_content:search_content
            	};
            	fish.callService("TrmlMgrController", "getTrmlList", param, function(reply){
            	//	console.log(reply);
            		that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
    		limitDate : function(key, dfmt , minDate , maxDate) {
    	     	$("#"+key+"").unbind('focus').bind('focus',function(){
    	     		$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
    	        }); 
    	    },

            bindTableButton:function(){
            	var that = this;
            	var page = 1;
            	var rows =  10;
            	that.$("#xtab").delegate(".js-btn_detail","click",function(){
            		var $tr = $(this).parents("tr");
            		that.$(".js-detail").remove();
            		var $template = that.$("#detail_tr").clone();
            		$template.removeAttr('id').addClass('js-detail');
            		$tr.after($template);
					var imei = $(this).parents("tr").attr("id");
                	var curresult = that.$("#xtab").xtable("findData","#"+imei);
                	//console.log(curresult);
					that.$("#IMEI").text(curresult.imei);
					that.$("#day_cycle").text(curresult.day_cycle);
					that.$("#tac").text(curresult.tac?curresult.tac:"");
					that.$("#snr").text(curresult.snr?curresult.snr:"");
					that.$("#cd_sd").text(curresult.cd_sd?curresult.cd_sd:"");
					that.$("#type").text(curresult.card_type?curresult.card_type:"");
					that.$("#terminal_name").text(curresult.terminal_type?curresult.terminal_type:"");
					that.$("#terminal_model").text(curresult.terminal_model?curresult.terminal_model:"");
					fish.utils.getAttrCode("IMEI",function(code){
						
						//console.log(code);
					});
            	});
            }
        });
        return pageView;
    });
