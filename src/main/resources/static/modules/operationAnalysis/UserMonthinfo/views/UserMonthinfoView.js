define(['hbs!modules/operationAnalysis/UserMonthinfo/templates/usermonth-info.html',
    "frm/template/party/echarts.min"
], function(temp, echarts) {
    var pageView = fish.View.extend({
        el: false,
        template: temp,
        field : 'user_months',
        afterRender: function() {
        	var that=this;
        	that.$('.js-date').datetimepicker({viewType: "month"});
			that.start_date = that.addMonth(-6); 
			that.end_date = that.addMonth(-1);
			$("#start_date").val(that.start_date);
			$("#end_date").val(that.end_date);
			that.doQuery();
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
		doQuery : function() {
			var me = this;
			var start_date = $("#start_date").val();
			var end_date = $("#end_date").val();
			if(!me.validate(start_date ,end_date,'M',180)){
				return false;
			}
			var param = {};
			param.start_time = start_date;
			param.end_time = end_date;
		
			fish.callService("AnalysisController", "queryCustUserByM", param, function(data){
		
				if(data.res_code == "00000"){
					//图表
					//图表
					var status_month = [];
					var pre_msg = [];
					var pre_msg_add = [];
					var pre_msg_lost = [];
					var user_count = [];
					var add_user_count = [];
					var lost_user_count = [];
					var eData = {};
					var item =  data.result;
					if(item!= '' && item!= null){
//						me.dxChart(data.result);
						for(var i=0;i<item.length;i++){
							status_month.push(item[i].status_month?item[i].status_month:item[i].STATUS_MONTH);
							pre_msg.push(item[i].pre_msg?item[i].pre_msg:(item[i].PRE_MSG?item[i].PRE_MSG:0));
							pre_msg_add.push(item[i].pre_msg_add?item[i].pre_msg_add:(item[i].PRE_MSG_ADD?item[i].PRE_MSG_ADD:0));
							pre_msg_lost.push(item[i].pre_msg_lost?item[i].pre_msg_lost:(item[i].PRE_MSG_LOST?item[i].PRE_MSG_LOST:0));
							user_count.push(item[i].user_count?item[i].user_count:item[i].USER_COUNT);
							add_user_count.push(item[i].add_user_count?item[i].add_user_count:item[i].ADD_USER_COUNT);
							lost_user_count.push(item[i].lost_user_count?item[i].lost_user_count:item[i].LOST_USER_COUNT);
						}
						eData.status_month = status_month;
						eData.pre_msg = pre_msg;
						eData.pre_msg_add = pre_msg_add;
						eData.pre_msg_lost = pre_msg_lost;
						eData.user_count = user_count;
						eData.add_user_count = add_user_count;
						eData.lost_user_count = lost_user_count;
						me.echarts(eData);
						me.echarts_rate(eData);
					}else{
//						me.dxChart("");
						me.echarts("");
						//layer.msg("暂无数据");
					}
				}else{
					layer.alert("查询集团流量池信息出错，"+ data.res_message);
				}
			});
			
		},
		echarts_rate : function(data){
			var me = this;
			var Chart1 = echarts.init(that.$('.js-chart-2')[0]);
			option = {
					legend: {
				    	 x: 'right',
				        data:['用户个数环比上月','新增用户数环比上月','退订用户数环比上月'],
				        textStyle :{
				    	     fontSize:15,
				    	     color:'#AAAAAA'
				    	 },
				    },
				    color: ['#76ACF7','#76DDFB','#3686F5'],
				    title: {
				        text: '用户数环比'
				    },
				    tooltip : {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        },
				    },
				  
				    // grid: {
				    //     left: '3%',
				    //     right: '4%',
				    //     bottom: '3%',
				    //     containLabel: true,
				    // },
				    xAxis : [
				        {
				        	splitLine:{  show:false   }  ,
				            type : 'category',
				            boundaryGap : false,
				            axisTick: {
	     		            	show: false
	     		            	},
				            data : data.status_month,
				            axisLine:{
	       		            	lineStyle:{
	       		            		color:'#AAAAAA'
	       		            	}
				            },
				            axisLabel:{
				            	interval:0,
				            	rotate:-45
				            }
				        }
				    ],
				    yAxis : [
				        {
				        	 splitLine:{  show:false  }  ,
				            type : 'value',
				            axisTick: {
	     		            	show: false
	     		            	},
	 		            	axisLine:{
	       		            	lineStyle:{
	       		            		color:'#AAAAAA'
	       		            	}
	 		            	}
				        }
				    ],
				    series : [
				        {
				            name:'用户个数环比上月',
				            type:'line',
				          symbol:'circle',
				          symbolSize:'12',
				            data:data.pre_msg,
				            tooltip: {
				                trigger: 'item',
				                axisPointer: {
				                    type: 'line'
				                },
				                formatter: function (params, ticket, callback) {
//				                	 return '用户个数环比上月:'+params.data+'%';
				                    if(params.data>0){
				                    	 return '退订用户数环比上月:+'+params.data+'%';
				                    }else{
				                    	 return '退订用户数环比上月:'+params.data+'%';
				                    }
				                   
				                }
				            },
				        },
				        {
				            name:'新增用户数环比上月',
				            type:'line',
				          symbol:'circle',
				          symbolSize:'12',
				            data:data.pre_msg_add,
				            tooltip: {
				                trigger: 'item',
				                axisPointer: {
				                    type: 'line'
				                },
				                formatter: function (params, ticket, callback) {
//				                	 return '新增用户数环比上月:'+params.data+'%';
				                    if(params.data>0){
				                    	 return '退订用户数环比上月:+'+params.data+'%';
				                    }else{
				                    	 return '退订用户数环比上月:'+params.data+'%';
				                    }
				                   
				                }
				            },
				        },
				        {
				            name:'退订用户数环比上月',
				            type:'line',
				          symbol:'circle',
				          symbolSize:'12',
				            data:data.pre_msg_lost,
				            tooltip: {
				                
				                trigger: 'item',
				                axisPointer: {
				                    type: 'line'
				                },
				                formatter: function (params, ticket, callback) {
				                    if(params.data>0){
				                    	 return '退订用户数环比上月:+'+params.data+'%';
				                    }else{
				                    	 return '退订用户数环比上月:'+params.data+'%';
				                    }
				                   
				                }
				            },
				        },
				        
				      
				    ]
				};

	         Chart1.setOption(option);
	         $(window).on("debouncedresize", function() {
	                Chart1.resize();
	       
	            });
		},
			
		/**
		 *  根据每一个月的流量池信息画出条形图
		 */
		dxChart : function (data) {
			var dataSource = data;

			$(".js-chart-1")[0].dxChart(
					{
//						equalBarWidth: false,
						dataSource : dataSource,
						commonSeriesSettings : {
							argumentField : "status_month"
						},

						series : [ {
							type : "bar",
							valueField : "user_count",
							tagField : "pre_msg",
							name : "用户数(个)",
							label : {
								visible : true,
								customizeText : function() {
									return this.valueText;
								}
							},
							color : "#40bbea"
						}, {
							type : "bar",
							valueField : "add_user_count",
							tagField : "pre_msg_add",
							name : "新增用户数(个)",
							label : {
								visible : true,
								customizeText : function() {
									return this.valueText;
								}
							},

							color : "#8dc63f"
						}, {
							type : "bar",
							valueField : "lost_user_count",
							tagField : "pre_msg_lost",
							name : "退订用户数(个)",
							label : {
								visible : true,
								customizeText : function() {
									return this.valueText;
								}
							},
							color : "#cc3f44"
						} ],
						valueAxis : [ {
							pane : "bottomPane",
							grid : {
								visible : false
							},
							label : {
								customizeText : function() {
//									return this.value ;
								}
							}
						} ],
						legend : {
							verticalAlignment : "bottom",
							horizontalAlignment : "center"
						},
						commonPaneSettings: {
							border:{
								visible: true,
								right: false,
								top: false,
								left:false
							}	   
						},
					    title: {
					        text: '用户统计'
					    },
						tooltip : {
							enabled : true,
							customizeText : function() {
								var _chain = this.point.tag ;// 环比率
								var tips = this.seriesName + ":" + this.valueText+ "<br/>";
								if ((_chain != '')
										&& (typeof (_chain) != "undefined")) {
									if (_chain.indexOf('-') == -1) {
										tips += '环比上月上升了' + _chain + '%';
									} else {
										tips += '环比上月下降了' + _chain.replace('-', '')+ '%';
									}
								}

								return tips;
							}

						},
					});

			
		},
		initEvent : function() {
			var me = this;
			$("#start_date").val(me.start_date);
			$("#end_date").val(me.end_date);
			$("#query_btn").click(function() {
				var start_date = $("#start_date").val();
				var end_date = $("#end_date").val();

				if(!me.validate(start_date ,end_date,'M',180)){
					return false;
				}
				var param = {start_time: start_date, end_time: end_date, field: me.field};
	//			console.log(param);

				me.doQuery(param);
			});
			$("#reset_btn").click(function() {
			
				var start_date = me.addMonth(-6); 
				var end_date = me.addMonth(-1);
				$("#start_date").val(start_date);
				$("#end_date").val(end_date);
			
			});			
	        //时间控件处理
	        var dfmt = "yyyy-mm";
	        var minDate = me.addMonth(-6);
	        var maxDate = me.addMonth(0);
	        me.limitDate("start_date", dfmt, minDate, maxDate);
	        me.limitDate("end_date", dfmt, minDate, maxDate);
		},
		limitDate : function(key, dfmt , minDate , maxDate) {
	     	$("#"+key+"").unbind('focus').bind('focus',function(){
	     		$('.js-date').datetimepicker({format: 'yyyy-mm'});
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
			var Chart1 = echarts.init(that.$('.js-chart-1')[0]);
			var option1 = {
					color: ['#76ACF7','#76DDFB','#3686F5'],
				    title: {
				        text: '用户统计'
				    },
				    legend: {
				    	 x: 'right',
				        data:['用户个数(个)','新增用户数(个)','退订用户数(个)'],
				        textStyle :{
				    	     fontSize:15,
				    	     color:'#AAAAAA'
				    	 },
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
				            data : data.status_month,
				            axisTick: {
				                alignWithLabel: true
				            },
				            axisLine:{
		   		            	lineStyle:{
		   		            		color:'#AAAAAA'
		   		            	}
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
				        },
				          {
				            name:'新增用户数(个)',
				            type:'bar',
				            barWidth: 30,
				            data:data.add_user_count,
				            itemStyle: {
				                normal: {
				                    label: {
				                        show: true,
				                        position: 'top'
				                    }
				                }
				            }
				        },
				        {
				            name:'退订用户数(个)',
				            type:'bar',
				            barWidth: 30,
				            data:data.lost_user_count,
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