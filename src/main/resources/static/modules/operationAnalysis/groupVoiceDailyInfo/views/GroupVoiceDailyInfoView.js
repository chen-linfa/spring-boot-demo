define(['hbs!modules/operationAnalysis/groupVoiceDailyInfo/templates/group-voice-daily-info.html',
    "frm/template/party/echarts.min"
], function(temp, echarts) {
    var pageView = fish.View.extend({
        template: temp,
        field : "count_voice_total",
        afterRender: function() {
            var that = this;
            that.$('.js-date').datetimepicker({viewType: "date"});
            that.$("#StartDate").val(that.addDate(-14));
            that.$("#EndDate").val(that.addDate(-1));
            that.doQuery();
            that.$('#query').click(function(){
            	that.doQuery();
            });
            
            that.$("#reset").click(function() {
				var start_date = that.addDate(-14); 
				var end_date = that.addDate(-1);
				that.$("#StartDate").val(start_date);
				that.$("#EndDate").val(end_date);
			
			});	
        },
        doQuery:function(){
        	var that = this;
        	var start_time = that.$("#StartDate").val();
            var end_time = that.$("#EndDate").val();
            if(!that.validate(start_time ,end_time,'D',90)){
                return false;
            }
            var params = {};
    		params.start_date = start_time;
    		params.end_date = end_time;
            params.field = that.field;
            //console.log("params:  ",params);
    		fish.callService("AnalysisController", "statDailyTraffic", params, function(reply){
    			//console.log("reply:  ",reply);
        		if (reply.res_code != "00000") {
					layer.alert(reply.res_message);
					return;
				}
				var data = reply.result;
				
				var xdate = [];
				var count_voice_total = [];
				var eData = {};
				for(var i=0;i<data.length;i++){
					if(data[i].xdate!=null){ //判断字段大小写存在性
						xdate.push(data[i].xdate);
						count_voice_total.push(data[i].count_voice_total);
					}else{
						xdate.push(data[i].XDATE);
						count_voice_total.push(data[i].COUNT_VOICE_TOTAL);
					}
				}
				eData.xdate = xdate;
				eData.count_voice_total = count_voice_total;
    			that.update_(eData);
    			//console.log("eData:  ",eData);
    		});
        },
        update_:function(data){
        	var that = this;
            var colorArr = ['#2C82BE', '#76DDFB', '#DBECF8', '#ABB7BF', '#53A8E2', '#ABC8FF'];
			var Chart2 = echarts.init(that.$('.js-chart-2')[0]);
            var option2 = {
            	color: colorArr,
			    legend: {
			    	 x: 'right',
			        data:['语音(分钟)'],
			        textStyle :{
			    	     fontSize:15,
			    	     color:'#AAAAAA'
			    	 },
			    },
			    title: {
			        text: '语音(分钟)'
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
			            axisLabel:{
			            	interval:0,
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
			            name:'语音(分钟)',
			            type:'bar',
			            barWidth: '30',
			            data:data.count_voice_total,
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
            }

            Chart2.setOption(option2);

            $(window).on("debouncedresize", function() {
                Chart2.resize();
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
        getDateTime:function (dateStr){
            var arr = dateStr.split("-");
            var date = null;
            if(arr.length > 2){
                date = new Date(arr[0], arr[1],arr[2]);
            }else{
                date = new Date(arr[0], arr[1]);
            }

            return  date.getTime();
        },

        getTodayTime:function(){
            var today = new Date();
            var cur_month = today.getMonth() * 1 + 1;
            var cur_day = today.getDate();
            if (cur_month < 10) {
                cur_month = "0" + cur_month;
            }
            todaytime = new Date(today.getFullYear(), cur_month ,cur_day);
            return  todaytime.getTime();
        },
        addDate:function (days) {
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
        }
    });
    return pageView;
});