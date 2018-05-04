define(['hbs!modules/operationAnalysis/UserDayinfo/templates/userday-info.html',
    "frm/template/party/echarts.min"
],  function(temp, echarts) {
    var pageView = fish.View.extend({
        el: false,
        template: temp,
        field : 'user_day',
        afterRender: function() {
        	var that=this;
        	that.$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
			that.start_date = that.addDate(-14); 
			that.end_date = that.addDate(-1);
			that.doQuery();
			that.initEvent();
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
		doQuery : function(param) {
			var me = this;
			if (!param) {
				param = {};
				param.start_time = me.start_date;
				param.end_time = me.end_date;
			}
			fish.callService("AnalysisController", "queryCustUserByD", param, function(data) {
				//console.log(param);
				//console.log(data);
				if(data.res_code == "00000"){
					//图表
					var day_cycle = [];
					var user_count = [];
					var eData = {};
					var item =  data.result;
					if(item!= '' && item!= null){
						for(var i=0;i<item.length;i++){
							day_cycle.push(item[i].day_cycle?item[i].day_cycle:item[i].DAY_CYCLE);
							user_count.push(item[i].user_count?item[i].user_count:item[i].USER_COUNT);
						}
						eData.day_cycle = day_cycle;
						eData.user_count = user_count;
//						me.dxChart(data.result);
						//console.log(eData);
						me.echarts(eData);
						
					}else{
				
						me.echarts("");
//						me.dxChart("");
						//layer.msg("暂无数据");
					}
					
					/*//图表
					if(data.result!= '' && data.result!= null){
						//me.dxChart(data.result);
						me.echarts(data.result);
					}else{
						me.echarts("");
						layer.msg("暂无数据");
					}*/
				}else{
					//layer.msg("查询出错，"+ data.res_message);
				}
			});
		},		
		initEvent : function() {
			var me = this;
			$("#start_date").val(me.start_date);
			$("#end_date").val(me.end_date);
			$("#query_btn").click(function() {
				var start_date = $("#start_date").val();
				var end_date = $("#end_date").val();
				if(!me.validate(start_date ,end_date,'D',90)){
					return false;
				}
				var param = {start_time: start_date, end_time: end_date, field: me.field};
				
				me.doQuery(param);
			});
			$("#reset_btn").click(function() {
				
				var start_date = me.addDate(-14); 
				var end_date = me.addDate(-1);
				$("#start_date").val(start_date);
				$("#end_date").val(end_date);
			
			});				
	        //时间控件处理
	        var dfmt = "yyyy-MM-dd";
	        var minDate = me.addDate(-90);
	        var maxDate = me.addDate(0);
	        me.limitDate("start_date", dfmt, minDate, maxDate);
	        me.limitDate("end_date", dfmt, minDate, maxDate);
		},
		limitDate : function(key, dfmt , minDate , maxDate) {
	     	$("#"+key+"").unbind('focus').bind('focus',function(){
	     		$('.js-date').datetimepicker({format: 'yyyy-mm-dd'});
	        }); 
	    },
		unitTranslate : function (datas , keyFileds){
			if(!$.isEmptyObject(datas)){
				$.each(datas,function(i,data){
					if( $.isArray(keyFileds)){
						$.each(keyFileds, function(j,key){
							var num = (parseFloat(data[key]) / (1024*1024)).toFixed(2);
							data[key]  = parseFloat(num);
						});
					}
				});
			}
		},
		validate:function (startDate, endDate ,type, num) {
			that = this;
			if (startDate == '' || endDate == '') {
				that.$("#info1").text("查询时间段不能为空!");
				that.$("#info1").show();	

				return false;
			}
			var startTime = this.getDateTime(startDate);
			var endTime = this.getDateTime(endDate);
			
			var todayTime = this.getTodayTime();

			if (startTime > endTime) {

				that.$("#info1").text("起始时间不能大于截止时间!");
				that.$("#info1").show();	

				return false;
			}

			if (endTime > todayTime) {

				that.$("#info1").text("截止时间不能大于当前时间!");
				that.$("#info1").show();	
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
				that.$("#info1").text("时间跨度不可超过"+day+"!");
				that.$("#info1").show();	

				return false;
			}
			that.$("#info1").hide();	
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
		echarts : function(data){
			var me = this;
			var Chart1 = echarts.init(me.$('.js-chart-1')[0]);
			option1 = {
					color: ['#76ACF7','#76DDFB','#3686F5'],
				    legend: {
				    	 x: 'right',
				        data:['用户个数(个)'],
				        textStyle :{
				    	     fontSize:15,
				    	     color:'#AAAAAA'
				    	 },
				    },
				    title: {
				        text: '用户数量'
				    },
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				        left: '3%',
				        right: '5%',
				        bottom: '15%',
				        containLabel: true
				    },
				    xAxis : [
				        {
				            type : 'category',
				            data : data.day_cycle,
				            axisTick: {
				                alignWithLabel: true
				            },
				            axisLine:{
		   		            	lineStyle:{
		   		            		color:'#AAAAAA'
		   		            	}
				            },
				            axisLabel:{
				            	 interval:1,
					             rotate:-45
				            }
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value',
				            show:false
				        }
				    ],
				    series : [
				        {
				            name:'用户个数(个)',
				            type:'bar',
				            barWidth: 30,
				            data:data.user_count,
				            itemStyle: {
				                normal: {
				                    label: {
				                        show: true,
				                        position: 'top'
				                    }
				                }
				            }
				        }
				        
				    ]
				};
            Chart1.setOption(option1);

            $(window).on("debouncedresize", function() {
                Chart1.resize();
       
            });
		},
		
	    
		
    });
    return pageView;
});