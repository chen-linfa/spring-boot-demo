define(['hbs!modules/operationAnalysis/groupVoiceMonthlyInfo/templates/group-voice-monthly-info.html',
    "frm/template/party/echarts.min"
], function(temp, echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function() {
            var that = this;
            that.$('.js-date').datetimepicker({viewType: "month"});
            that.$("#StartMonth").val(that.addMonth(-6));//按当月截止前一天的前六个月
            that.$("#EndMonth").val(that.addMonth(-1));
            this.doQuery();
            that.$('#query').click(function(){
                that.doQuery();
            });
            this.$("#reset").click(function() {
				var start_date =that.addMonth(-6); 
				var end_date = that.addMonth(-1);
				that.$("#StartMonth").val(start_date);
				that.$("#EndMonth").val(end_date);
			});
        },
        doQuery:function(){
            var that = this;
            var start_time = that.$("#StartMonth").val();
            var end_time = that.$("#EndMonth").val();
            if(!that.validate(start_time ,end_time,'M',180)){
                return false;
            }
            var params = {};
            params.start_month = start_time;
            params.end_month = end_time;
            fish.callService("AnalysisController", "statMonthMemUserInfo", params, function(data){
                //console.log("data",data);
                if (data.res_code == "00000") {
                    // 图表
                    //console.log(data);
                    var item = data.result.info_list;
                    var month_cycle = [];
                    var count_voice_total = [];
                    var pre_voice = [];
                    var eData = {};
                    if (data.result != '' && data.result != null) {
                        for(var i=0;i<item.length;i++){
                            if(item[i].month_cycle!=null){  //判断字段大小写存在性
                                month_cycle.push(item[i].month_cycle);
                                count_voice_total.push(item[i].count_voice_total);
                                pre_voice.push(item[i].pre_voice==null?0:item[i].pre_voice);
                            }else{
                                month_cycle.push(item[i].MONTH_CYCLE);
                                count_voice_total.push(item[i].COUNT_VOICE_TOTAL);
                                pre_voice.push(item[i].PRE_VOICE==null?0:item[i].PRE_VOICE);
                            }
                                
                        }
                        eData.month_cycle = month_cycle;
                        eData.count_voice_total = count_voice_total;
                        eData.pre_voice = pre_voice;
                        that.update_(eData);
                        //console.log("eData:  ",eData);
    //                  that.dxChart(data.result.info_list);
                    } else {
    //                  me.dxChart("");
                        layer.msg("暂无数据");
                    }
                } else {
                    if(data.res_message!=null)  layer.msg("查询集团语音信息出错，"+ data.res_message);
                    else layer.msg("查询集团语音信息出错，"+ data.RES_MESSAGE);
                }
            });
        },
        update_:function(data){
        	var that = this;
            var colorArr = ['#2C82BE', '#76DDFB', '#DBECF8', '#ABB7BF', '#53A8E2', '#ABC8FF'];
            var Chart1 = echarts.init(that.$('.js-chart-1')[0]);
            var Chart2 = echarts.init(that.$('.js-chart-2')[0]);
            var option1 = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        },
                        formatter: function(params,ticket,callback){
    			        	var res;
    			        	if(Number(params[0].value)==0){
    			        		res = params[0].seriesName+0+"%";
    			        	}else if(Number(params[0].value)>0){
    			        		res = params[0].seriesName+"+"+params[0].value+"%";
    			        	}else{
    			        		res = params[0].seriesName+"-"+params[0].value+"%";
    			        	}
    			        	return res;
    			        }
                    },
                    color: colorArr,
                    legend: {
                    	x:'right',
                        data: ['语音分钟环比上月'],
                        show: true
                    },
    			    title: {
    			        text: '语音分钟环比上月'
    			    },
                    grid: {
    			        left: '3%',
    			        right: '4%',
    			        bottom: '8%',
    			        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: data.month_cycle,
			            axisLabel:{
			            	interval:0,
			            	rotate:-45
			            }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                            name: '语音分钟环比上月',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            smooth: true,
                            data: data.pre_voice
                        }
                    ]
                };
                                    

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
			        right: '4%',
			        bottom: '8%',
			        containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : data.month_cycle,
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

            Chart1.setOption(option1);
            Chart2.setOption(option2);

            $(window).on("debouncedresize", function() {
                Chart1.resize();
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
        addMonth: function(monthNum) {
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
        }
    });
    return pageView;
});