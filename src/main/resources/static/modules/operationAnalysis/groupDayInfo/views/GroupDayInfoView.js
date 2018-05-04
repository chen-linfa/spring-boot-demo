define(['hbs!modules/operationAnalysis/groupDayInfo/templates/groupday-info.html',
    "frm/template/party/echarts.min"
], function(temp, echarts) {
    var pageView = fish.View.extend({
        el: false,
        template: temp,
        field : 'count_flow_total',
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
				param.start_date = me.start_date;
				param.end_date = me.end_date;
				param.field = me.field;
			}
			fish.callService("AnalysisController", "statDailyTraffic", param, function(reply) {
				if (reply.res_code != "00000") {
					return;
				}
				var data = reply.result;
		//		console.log(data);
				me.unitTranslate(data,[me.field]);
				if(data!= '' && data!= null){
					var xdate = [];
					var count_flow_total = [];
					var eData = {};
					for(var i=0;i<data.length;i++){
						xdate.push(data[i].xdate?data[i].xdate:data[i].XDATE);
						count_flow_total.push(data[i].count_flow_total?data[i].count_flow_total:data[i].COUNT_FLOW_TOTAL);
					}
			//		console.log(xdate);
					eData.xdate = xdate;
					eData.count_flow_total = count_flow_total;
					me.echarts(eData);
				}else{
					//layer.msg("暂无数据");
					//alert("ggggggggggggggggg");
				
				}
				
				
				//initChart("daily_traffic_chart", "集团流量日数据", {argumentField: "xdate", valueField: me.field, name: "总流量(MB)", unit: "MB"}, data);
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
				var param = {start_date: start_date, end_date: end_date, field: me.field};
		//		console.log(param);
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
			that.$("#info1").show();
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
			        data:['总流量(MB)'],
			        textStyle :{
			    	     fontSize:15,
			    	     color:'#AAAAAA'
			    	 },
			    },
			    title: {
			        text: '集团流量统计'
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
			            data : data.xdate,
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
			            name:'总流量(MB)',
			            type:'bar',
			            barWidth: 30,
			            data:data.count_flow_total,
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