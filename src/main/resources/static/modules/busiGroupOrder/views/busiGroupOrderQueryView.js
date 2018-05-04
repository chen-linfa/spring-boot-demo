define(['hbs!modules/busiGroupOrder/templates/busiGroupOrderQuery.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        order_id : '',
        date : '',
        initialize : function(){
        	var that = this;
        	that.order_id = this.options["keyname"];
        },
        afterRender: function(){
            var that = this;
            that.$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
            that.start_date = that.addDate(-14); 
			that.end_date = that.addDate(0);
			$("#start_date").val(that.start_date);
			$("#end_date").val(that.end_date);
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
                rowId: "order_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "order_id", title: "订单号", width: "20%"},
                    {data: "order_title", title: "订单标题", width: "40%"},
                    {data: "status_date", title: "状态时间", width: "20%"},
                    {data: "create_date", title: "创建时间", width: "0%",visible:false},
                    {data: "order_status", title: "订单状态", width: "10%",
						code:"ORDER_STATUS_NEW" ,formatter:function(data,rows){
                            if(rows.order_status== "4"){
                                return '<span class="text-success">'+ '订购成功' +'</span>';
                            }else if(rows.order_status== "5" || rows.order_status== "3"){
                                return '<span class="text-danger">'+ '订购失败' +'</span>';
                            	/*
                                if(rows.fail_lelvel=="1"){
                                    return '<span class="text-danger">'+ data +'(全部提交失败)</span>';
                                }
                                else{
                                    return '<span class="text-warning">'+ data +'(部分竣工失败)</span>'; 
                                }
                                */
                            }else if(rows.order_status== "2"){
                            	return '<span">'+ '在途' +'</span>';
                            }else if(rows.order_status== "1"){
                            	return '<span>'+ '创建' +'</span>';
                            }else{
                                return '<span class="text-danger>'+ '订单异常' +'</span>';
                            }
                        }},
                    {data: "operation", title: "操作", width:"10%", formatter: function(data){
                        //操作列的按钮生成
                        var html = '<a href="javascript:void(0);" class="btn btn-gray btn-sm btn-icon icon-left btn_edit_table">详情</a>';
                        return html;
                    }}
                ],//每列的定义
                onLoad: fish.bind(that.bindFormTableEvent,that) //表单加载数据后触发的操作
            };
            that.$data_list = that.$("#myTable").xtable(option);
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.$data_list.xtable("options",{pageSize:rowNum});
                    that.doQuery(eventData.page,rowNum);
                },
                create:function(){
                    //默认不加载
                    //that.queryMemberInfo(1);
                }
            });
            this.doQuery();
            that.initEvent();
		},
		 addMonth : function(monthNum) {
	        	var today = new Date();
	        	var str = '';
	        	var lastMonth = today.setMonth(today.getMonth()+ 1 + monthNum);
	        	var month = "01";
	            if(today.getMonth() < 10){
	            	month = "0" + today.getMonth();
	            }else{
	            	month =  today.getMonth();
	            }
	            str = today.getFullYear() + "-" + month;  
	            if (today.getMonth() == '0') {
	            	str = today.getFullYear() - 1 + "-" + "12";
	        	}

	        	return str;

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
	        initEvent : function() {
				var me = this;
				$("#start_date").val(me.start_date);
				$("#end_date").val(me.end_date);
				var order_id = $("#search_input").val();
				$("#query").click(function() {
					var start_date = $("#start_date").val();
					var end_date = $("#end_date").val();
					if(!me.validate(start_date ,end_date,'M',180)){
						return false;
					}
					me.doQuery();
				});
				$("#reset_btn").click(function() {
				
					var start_date = me.addMonth(-6); 
					var end_date = me.addMonth(-1);
					$("#start_date").val(start_date);
					$("#end_date").val(end_date);
				
				});			
		        //时间控件处理
		        var dfmt = "yyyy-mm-dd";
		        var minDate = me.addMonth(-6);
		        var maxDate = me.addMonth(0);
		        me.limitDate("start_date", dfmt, minDate, maxDate);
		        me.limitDate("end_date", dfmt, minDate, maxDate);
		        
		        $("#seach_btn").unbind("click").bind("click",function(){
		        	me.toDetail(me.order_id,me.date,$("#prod_name").val());
		        });
		        
			},
			limitDate : function(key, dfmt , minDate , maxDate) {
		     	$("#"+key+"").unbind('focus').bind('focus',function(){
		     		$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
		        }); 
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
        doQuery : function( page, rows){
            var that = this;
            var param = {};
            var num = 1;
            var row = 10;
            var search_content = $("#search_input").val();
            param.page = page==null? num : page;
            param.rows = rows==null? row : rows;
        	param.start_time = $("#start_date").val();
			param.end_time = $("#end_date").val();
			param.order_id = search_content;
			param.prod_type = '0';
            fish.callService("BusiGroupOrderController", "queryBusiGroupOrder", param, function(result){
                that.$("#myTable").xtable("loadData",result.rows);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
            });
        },
        bindFormTableEvent : function(){
        	 var that = this;
        	
        	 that.$(".btn_edit_table").click(function(e){
                 that.order_id = $(this).parents("tr").attr("id");
                 var data = that.$data_list.xtable("findData","#"+that.order_id);
                 that.date = data.create_date;
                 that.toDetail(that.order_id,data.create_date);
                 
                 $(".backToMain").unbind("click").bind("click",function(e){
                 	 that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组订单查询></a>');
                      that.$('.main_list_div').show();
                      that.$('.detail_div').hide();
                  });
                 
             });
        	 
        	  $(".backToMain").unbind("click").bind("click",function(e){
             	 that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组订单查询></a>');
                  that.$('.main_list_div').show();
                  that.$('.detail_div').hide();
              });
        },
        toDetail : function(order_id,create_date,prod_name){
        	var that = this;
            that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组订单查询></a><a class="current">订单详情</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
        	$(".block-divide-list").empty();
        	 that.$('.main_list_div').hide();
             that.$('.detail_div').show();
        	  var params = {};
              params.page = 1;
              params.rows = 10;
              params.order_id = order_id;
              params.create_date = create_date;//data.create_date;
              if(prod_name !="" &&prod_name !=null){
            	  params.prod_name = $.trim(prod_name);
              }
              fish.callService("BusiGroupOrderController", "queryOrderDeta", params, function(data){
              	var has_data = false;
                  var pageCount = 0;
                  if (data.res_code=="00000" && data.result.length > 0) {
                      has_data = true;
                      for(var i=0;i<data.result.length;i++){
                    	 var action_value = "";
                       	 if(data.result[i].order_action=='1'){
                       		 action_value = '订购套餐';
                       	 }else if(data.result[i].order_action=='2'){
                       		 action_value = '退订套餐';
                       	 }else if(data.result[i].order_action=='3'){
                       		 action_value = '变更套餐';
                       	 }else if(data.result[i].order_action=='4'){
                       		 action_value = '暂停套餐';
                       	 }else if(data.result[i].order_action=='5'){
                       		 action_value = '恢复套餐';
                       	 }
                    	  var li = $('<li class="list-item start'+i+'"><div class="media"><div class="media-left">'+
        							'<img src="frm/template/images/img-provide-order_1.png"></div><div class="media-body">'+
        							'<div class="media-heading clearfix"><span class="media-title prod_name'+i+'"">套餐名字</span>'+
        							'<span class="states states-default order_action'+i+'">套餐订购</span></div><div>'+
        							'<span class="text-weaker-color time'+i+'">有效时间:2017-08-10至2017-08-20</span></div>'+
        							'</div></div></li>');
                    	  $(".block-divide-list").append(li);
                    	  $(".block-divide-list").find(".prod_name"+i).text(data.result[i].prod_name);
                    	  $(".block-divide-list").find(".time"+i).text("有效时间:"+data.result[i].eff_date+"至"+data.result[i].exp_date);
                    	  $(".block-divide-list").find(".order_action"+i).text(action_value);
                    	  var attr = data.result[i].attr;
                    	  for(var j=0;j<attr.length;j++){
                    		 var value =  attr[j].attr_value;
                    		 if(value == null || value==undefined){
                    			 value = "";
                    		 }
                      		 var div = $('<div class="text-weaker-color margin-top">套餐属性 ： </div>');
                      		 div.text(attr[j].attr_name+" : "+value);
                      		 li.append(div);
                      	 }
                    	  
                      }
                  }else{
                	  layer.alert("查询出错 !");
                  }
                  if (has_data == false) {
                  }
              });
        },
        initData : function(param){
        	var that = this;
        	that.toDetail(param,"","");
        }
	});
    return pageView;
});
