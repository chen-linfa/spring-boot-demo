define(['hbs!../templates/orderquery.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
            	var that = this;
            	var initdate = new Date();
            	var mindate = new Date();
            	//最多查询三个月范围内的订单
            	mindate.setDate(initdate.getDate()-90);
            	that.$(".js-start_date").datetimepicker({viewType:"date",
            		initialDate:initdate,
            		startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd'),
            		endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
            	});
            	that.$(".js-end_date").datetimepicker({
            		viewType:"date",
            		initialDate:initdate,
            		startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd'),
            		endDate:fish.dateutil.format(initdate, 'yyyy-mm-dd')
            	});
            	
            	that.start_date = that.addDate(-14); 
     			that.end_date = that.addDate(0);
     			$(".js-start_date").val(that.start_date);
     			$(".js-end_date").val(that.end_date);
                
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "order_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "order_id", title: "订单号", width: "10%"},
						{data: "order_title", title: "订单标题", width: "25%",formatter:function(data,rows){
							if(data){
								return '<a href="javascript:void(0);" class="js-detail">'+data+"</a>"; 
							}else{
								return "";
							}
						}},
						{data: "total_num", title: "明细总数", width: "10%"},
						{data: "status_date", title: "状态时间", width: "20%"},
						{data: "order_status", title: "状态", width: "15%",
							code:"ORDER_STATUS",formatter:function(data,rows){
                                if(rows.order_status== "4"){
                                    return '<span class="text-success">'+ data +'</span>';
                                }else if(rows.order_status== "5"){
                                    if(rows.fail_lelvel=="1"){
                                        return '<span class="text-danger">'+ data +'(全部提交失败)</span>';
                                    }
                                    else{
                                        return '<span class="text-warning">'+ data +'(部分竣工失败)</span>'; 
                                    }
                                }else{
                                    return '<span>'+data+'</span>';
                                }
                            }}
					],//每列的定义
					onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
				};
                that.$data_list = that.$("#xtab").xtable(option);	
				
				//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.$data_list.xtable("options",{pageSize:rowNum});
                    	that.queryBusiOrder(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认加载
                    	that.queryBusiOrder(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					var start_date = $(".js-start_date").val();
					var end_date = $(".js-end_date").val();
					if(!that.validate(start_date ,end_date,'M',180)){
						return false;
					}
					that.queryBusiOrder(1);
				});
                //过滤非法的卡号输入值
                that.$('#search_input').bind({
                    keyup:function(){
                        this.value=this.value.replace(/\D/g,'');
                    }
                });
            },
            tableStyling:function(){
            	var that = this;
            	//DATATABLE的classname是包括表头的，故自行设定表列样式
            	that.$("#xtab").find("tr").each(function(){
            		$(this).children("td").eq(1).addClass("text-brand-primary");
            		$(this).children("td").eq(3).addClass("text text-weaker-color");
            	});
            	
            	that.$("#xtab").delegate(".js-detail","click",function(){
                    var params = {};
					params.order_id = $(this).parents("tr").attr("id");
					params.create_date = that.$("#xtab").xtable("findData","#"+params.order_id).create_date;
					that.showDetailView(params);
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
	        validate:function (startDate, endDate ,type, num) {
				that = this;
				if (startDate == '' || endDate == '') {
					layer.alert("查询时间段不能为空!");
					return false;
				}
				var startTime = this.getDateTime(startDate);
				var endTime = this.getDateTime(endDate);
				
				var todayTime = this.getTodayTime();

				if (startTime > endTime) {
					layer.alert("起始时间不能大于截止时间!");
					return false;
				}

				if (endTime > todayTime) {
					layer.alert("截止时间不能大于当前时间!");
					return false;
				}
				
				var time = num * 24 * 60 * 60 * 1000;

				if ((endTime - startTime) > time) {
					var day = '';
					if(type == 'M'){
						day = parseInt(num/30)  + '个月';
					}else{	
						day = num + "天";
					}
					layer.alert("时间跨度不可超过"+day+"!");
					return false;
				}

				return true;
			},
            queryBusiOrder:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim(that.$('#search_input').val());
            	var start_date = that.$(".js-start_date").val();
            	var end_date = that.$(".js-end_date").val();
            	var param = {
            		page:page,
            		rows:rows,
            		order_id:search_content,
            		start_time:start_date,
            		end_time:end_date
            	};
            	fish.callService("BusiOrderController", "queryBusiOrder",param,function(reply){
            		that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            changeListDiv:function(){
				var that = this;
				//切换为第一层查询界面，隐藏详细页
				that.$("#detail_view").hide();
				that.$("#list_view").show();
            },
            initData:function(params){
                var that = this;
                that.$("#search_input").val(params.order_id);
                var page = 1;
                var rows = 10;
                var search_content = $.trim(that.$('#search_input').val());
                var start_date = that.$(".js-start_date").datetimepicker("value");
                var end_date = that.$(".js-end_date").datetimepicker("value");
                var param = {
                    page:page,
                    rows:rows,
                    order_id:search_content,
                    start_time:start_date,
                    end_time:end_date
                };
                fish.callService("BusiOrderController", "queryBusiOrder",param,function(reply){
                    params.create_date = reply.rows[0].create_date;
                    that.showDetailView(params);
                });
                that.queryBusiOrder(1);
                
            },
            showDetailView:function(params){
                var that = this;
                var order_id = params.order_id;
                var create_date = params.create_date;
                that.$("#list_view").hide();
                that.$("#detail_view").show();
                that.requireView({
                    selector:"#detail_view",
                    url:"modules/memberManage/orderQuery/views/OrderDetailQueryView",
                    callback:function(view){
                        view.initData({order_id:order_id,create_date:create_date});
                    }
                });
            }
        });
        return pageView;
    });
