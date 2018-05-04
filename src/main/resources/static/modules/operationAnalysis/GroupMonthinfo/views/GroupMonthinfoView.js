define(['hbs!modules/operationAnalysis/GroupMonthinfo/templates/groupMonth-info.html',
    "frm/template/party/echarts.min"
], function(temp, echarts) {
    var pageView = fish.View.extend({
        el: false,
        template: temp,
        field : 'user_months',
        afterRender: function() {
        	var that=this;
        	 $('.js-date').datetimepicker({viewType: "month"});
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
			param.start_month = start_date;
			param.end_month = end_date;
		
			fish.callService("AnalysisController", "statMonthMemUserInfo", param, function(data){
		
				if(data.res_code == "00000"){
					//图表
					if(data.result!= '' && data.result!= null){
						var month_cycle = [];
						var count_flow_total = [];
						var count_flow_23g = [];
						var count_flow_4g = [];
						var count_flow_roaming = [];
						var count_flow_local = [];
						var pre_total = [];
						var pre_4g = [];
						var pre_23g = [];
						var pre_local = [];
						var pre_roaming = [];
						var eData = {};
						var item = data.result.info_list;
						for(var i=0;i<item.length;i++){
							month_cycle.push(item[i].month_cycle?item[i].month_cycle:item[i].MONTH_CYCLE);
							count_flow_total.push(item[i].count_flow_total?item[i].count_flow_total:item[i].COUNT_FLOW_TOTAL);
							count_flow_23g.push(item[i].count_flow_23g?item[i].count_flow_23g:item[i].COUNT_FLOW_23G);
							count_flow_4g.push(item[i].count_flow_4g?item[i].count_flow_4g:item[i].COUNT_FLOW_4G);
							count_flow_roaming.push(item[i].count_flow_roaming?item[i].count_flow_roaming:item[i].COUNT_FLOW_ROAMING);
							count_flow_local.push(item[i].count_flow_local?item[i].count_flow_local:item[i].COUNT_FLOW_LOCAL);
							pre_total.push(item[i].pre_total?item[i].pre_total:(item[i].PRE_TOTAL?item[i].PRE_TOTAL:0));
							pre_4g.push(item[i].pre_4g  ?item[i].pre_4g:(item[i].PRE_4G?item[i].PRE_4G:0));
							pre_23g.push(item[i].pre_23g ? item[i].pre_23g:(item[i].PRE_23G?item[i].PRE_23G:0));
							pre_local.push(item[i].pre_local? item[i].pre_local:(item[i].PRE_LOCAL?item[i].PRE_LOCAL:0));
							pre_roaming.push(item[i].pre_roaming ?item[i].pre_roaming:(item[i].PRE_ROAMING?item[i].PRE_ROAMING:0));
						}
						
						eData.month_cycle = month_cycle;
						eData.count_flow_total = count_flow_total;
						eData.count_flow_23g = count_flow_23g;
						eData.count_flow_4g = count_flow_4g;
						eData.count_flow_roaming = count_flow_roaming;
						eData.count_flow_local = count_flow_local;
						// 环比第一个月没有数据，需要加上0
						/*pre_total.unshift(0);
						pre_4g.unshift(0);
						pre_23g.unshift(0);
						pre_local.unshift(0);
						pre_roaming.unshift(0);*/
						eData.pre_total = pre_total;
						eData.pre_4g = pre_4g;
						eData.pre_23g = pre_23g;
						eData.pre_local = pre_local;
						eData.pre_roaming = pre_roaming;
						
//						unitTranslate(data.result.info_list,
//						                ['count_flow_total',
//										'count_flow_23g',
//										'count_flow_4g',
//										'count_flow_local',
//										'count_flow_roaming']);
						me.echarts_total(eData);
						me.echarts_234g(eData);
						me.echarts_localRoaming(eData);
						me.echarts_rate_total(eData);
						me.echarts_rate_234g(eData);
						me.echarts_rate_localRoaming(eData);
//						me.dxChart(data.result.info_list);
					}else{
//						me.dxChart("");
						//layer.msg("暂无数据");
					}
				}else{
					//layer.msg("查询信息出错，"+ data.res_message);
				}
			});
		},	
		echarts_total : function(data){
			var me = this;
			var myChart =  echarts.init(me.$('.js-chart-1')[0]);
			option = {
			    color: ['#76ACF7','#76DDFB','#3686F5'],
			    legend: {
			    	 x: 'right',
			        data:['总流量(MB)'],
			        textStyle :{
			    	     fontSize:15,
			    	     color:'#76ACF7'
			    	 },
			    },
			    title: {
			        text: '集团流量统计月数据'
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
			            axisLine:{
	   		            	lineStyle:{
	   		            		color:'#76ACF7'
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


	         myChart.setOption(option);
	         $(window).on("debouncedresize", function() {
	                myChart.resize();
	       
	            });
		},
		
		echarts_234g : function(data){
			var me = this;
			var myChart = echarts.init(me.$('.js-chart-2')[0]);
			option = {
			    color: ['#76ACF7','#76DDFB','#3686F5'],
			    legend: {
			    	 x: 'right',
			        data:['2/3G流量(MB)','4G流量(MB)'],
			        textStyle :{
			    	     fontSize:15,
			    	     color:'#76ACF7'
			    	 },
			    },
			    title: {
			        text: '2/3G流量及4G流量数据'
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
			            axisLine:{
	   		            	lineStyle:{
	   		            		color:'#76ACF7'
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
			            name:'2/3G流量(MB)',
			            type:'bar',
			            barWidth: 30,
			            data:data.count_flow_23g,
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
			            name:'4G流量(MB)',
			            type:'bar',
			            barWidth: 30,
			            data:data.count_flow_4g,
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


	         myChart.setOption(option);
		},
		echarts_localRoaming : function(data){
			var me = this;
			var myChart = echarts.init(me.$('.js-chart-3')[0]);
			option = {
				color: ['#76ACF7','#76DDFB','#3686F5'],
			    legend: {
			    	 x: 'right',
			        data:['本地流量(MB)','漫游流量(MB)'],
			        textStyle :{
			    	     fontSize:15,
			    	     color:'#76ACF7'
			    	 },
			    },
			    title: {
			        text: '本地流量及漫游流量数据'
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
			            axisLine:{
	   		            	lineStyle:{
	   		            		color:'#76ACF7'
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
			            name:'本地流量(MB)',
			            type:'bar',
			            barWidth: 30,
			            data:data.count_flow_local,
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
			            name:'漫游流量(MB)',
			            type:'bar',
			            barWidth: 30,
			            data:data.count_flow_roaming,
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


	         myChart.setOption(option);
		},
		echarts_rate_total : function(data){
			var me = this;
			var myChart = echarts.init(me.$('.js-chart-4')[0]);
			option = {
					legend: {
				    	 x: 'right',
				        data:['总流量环比上月'],
				        textStyle :{
				    	     fontSize:15,
				    	     color:'#76ACF7'
				    	 },
				    },
				    color: ['#76ACF7','#76DDFB','#3686F5'],
//				    title: {
//				        text: '用户个数环比',
//				        textStyle:{
//				            fontSize:'16'
//				        },
//				    },
				    title: {
				        text: '总流量环比'
				    },
				    tooltip : {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        }
				    },
				  
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '8%',
				        containLabel: true,
				    },
				    xAxis : [
				        {
				        	splitLine:{  show:false   }  ,
				            type : 'category',
				            boundaryGap : false,
				            axisTick: {
	     		            	show: false
	     		            	},
				            data : data.month_cycle,
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
				            name:'总流量环比上月',
				            type:'line',
				          symbol:'circle',
				          symbolSize:'12',
				            data:data.pre_total,
				            tooltip: {
				                
				                trigger: 'item',
				                axisPointer: {
				                    type: 'line'
				                },
				                formatter: function (params, ticket, callback) {
				                    if(params.data>0){
				                    	 return '总流量环比上月:+'+params.data+'%';
				                    }else{
				                    	 return '总流量环比上月:'+params.data+'%';
				                    }
				                   
				                }
				            },
				        },
				       
				    ]
				};

	         myChart.setOption(option);
		},
		echarts_rate_234g : function(data){
			var me = this;
			var myChart = echarts.init(me.$('.js-chart-5')[0]);
			option = {
					legend: {
				    	 x: 'right',
				        data:['2/3G流量环比上月','4G流量环比上月'],
				        textStyle :{
				    	     fontSize:15,
				    	     color:'#AAAAAA'
				    	 },
				    },
				    color: ['#76ACF7','#76DDFB','#3686F5'],
//				    title: {
//				        text: '用户个数环比',
//				        textStyle:{
//				            fontSize:'16'
//				        },
//				    },
				    title: {
				        text: '2/3G流量及4G流量环比'
				    },
				    tooltip : {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        }
				    },
				  
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '8%',
				        containLabel: true,
				    },
				    xAxis : [
				        {
				        	splitLine:{  show:false   }  ,
				            type : 'category',
				            boundaryGap : false,
				            axisTick: {
	     		            	show: false
	     		            	},
				            data : data.month_cycle,
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
						    name:'2/3G流量环比上月',
						    type:'line',
						  symbol:'circle',
						  symbolSize:'12',
						    data:data.pre_23g,
						    tooltip: {
						        
						        trigger: 'item',
						        axisPointer: {
						            type: 'line'
						        },
						        formatter: function (params, ticket, callback) {
						            if(params.data>0){
						            	 return '2/3G流量环比上月:+'+params.data+'%';
						            }else{
						            	 return '2/3G流量环比上月:'+params.data+'%';
						            }
						           
						        }
						    },
						},
						{
						    name:'4G流量环比上月',
						    type:'line',
						  symbol:'circle',
						  symbolSize:'12',
						    data:data.pre_4g,
						    tooltip: {
						        
						        trigger: 'item',
						        axisPointer: {
						            type: 'line'
						        },
						        formatter: function (params, ticket, callback) {
						            if(params.data>0){
						            	 return '4G流量环比上月:+'+params.data+'%';
						            }else{
						            	 return '4G流量环比上月:'+params.data+'%';
						            }
						           
						        }
						    },
						},
				       
				    ]
				};

	         myChart.setOption(option);
		},
		echarts_rate_localRoaming : function(data){
			var me = this;
			var myChart = echarts.init(me.$('.js-chart-6')[0]);
			option = {
					legend: {
				    	 x: 'right',
				        data:['本地流量环比上月','漫游流量环比上月'],
				        textStyle :{
				    	     fontSize:15,
				    	     color:'#AAAAAA'
				    	 },
				    },
				    color: ['#76ACF7','#76DDFB','#3686F5'],
//				    title: {
//				        text: '用户个数环比',
//				        textStyle:{
//				            fontSize:'16'
//				        },
//				    },
				    title: {
				        text: '本地流量及漫游流量数据环比'
				    },
				    tooltip : {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        }
				    },
				  
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '8%',
				        containLabel: true,
				    },
				    xAxis : [
				        {
				        	splitLine:{  show:false   }  ,
				            type : 'category',
				            boundaryGap : false,
				            axisTick: {
	     		            	show: false
	     		            	},
				            data : data.month_cycle,
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
				            name:'本地流量环比上月',
				            type:'line',
				          symbol:'circle',
				          symbolSize:'12',
				            data:data.pre_local,
				            yAxisindex:0,
				            tooltip: {
				                
				                trigger: 'item',
				                axisPointer: {
				                    type: 'line'
				                },
				                formatter: function (params, ticket, callback) {
				                    if(params.data>0){
				                    	 return '本地流量环比上月:+'+params.data+'%';
				                    }else{
				                    	 return '本地流量环比上月:'+params.data+'%';
				                    }
				                   
				                }
				            },
				        },
				        {
				            name:'漫游流量环比上月',
				            type:'line',
				          symbol:'circle',
				          symbolSize:'12',
				            data:data.pre_roaming,
				            yAxisindex:1,
				            tooltip: {
				                
				                trigger: 'item',
				                axisPointer: {
				                    type: 'line'
				                },
				                formatter: function (params, ticket, callback) {
				                    if(params.data>0){
				                    	 return '漫游流量环比上月:+'+params.data+'%';
				                    }else{
				                    	 return '漫游流量环比上月:'+params.data+'%';
				                    }
				                   
				                }
				            },
				        }
				       
				    ]
				};

	         myChart.setOption(option);
		},
		dxChart : function (data) {
			var _self = this;
			var dataSource = data;
			
			//集团总流量月趋势图
			var seriesAllFlow = [ {
				type : "bar",
				valueField : "count_flow_total",
				name : "总流量(MB)",
				color : "#40bbea",
				tagField : "pre_total",
				label : {
					visible : true
				}
			}];
			_self.drawChart("month-flow-total", "集团流量月数据", seriesAllFlow, dataSource);
			
			//集团2/3G和4G流量 月趋势图
			var seriesNumGFlow = [ {
				type : "bar",
				valueField : "count_flow_23g",
				name : "2/3G流量(MB)",
				color : "#8dc63f",
				tagField : "pre_23g",
				label : {
					visible : true
				}
			}, {
				type : "bar",
				valueField : "count_flow_4g",
				name : "4G流量(MB)",
				color : "#ff00ff",
				tagField : "pre_4g",
				label : {
					visible : true
				}
			}];
			_self.drawChart("month-flow-234g", "", seriesNumGFlow, dataSource);
			
			//本地流量和漫游流量月分析
			var seriesLRFlow = [ {
				type : "bar",
				valueField : "count_flow_local",
				name : "本地流量(MB)",
//				color : "#FFFF00",
				color : "#FFD306",
				tagField : "pre_local",
				label : {
					visible : true
				}
			}, {
				type : "bar",
				valueField : "count_flow_roaming",
				name : "漫游流量(MB)",
//				color : "#0000ff",
				color : "#8080C0",
				tagField : "pre_roaming",
				label : {
					visible : true
				}
			},
			];

		   _self.drawChart("month-flow-local-roaming", "", seriesLRFlow, dataSource);
				
		},
		
		//渲染图表
		drawChart : function(field, title, dataField, dataSource) {
			$("#" + field).dxChart({
//				equalBarWidth : false,
				dataSource : dataSource,
				commonSeriesSettings : {
					argumentField : "month_cycle"
				},
				series :dataField,
				argumentAxis : {
					grid : {
						visible : false
					},
					label : {
						customizeText : function() {
							return this.value;
						}
					}
				},
				valueAxis : {
					grid : {
						visible : false
					},
					label : {
						customizeText : function() {
//							return this.value;
						}
					}
				},
				tooltip : {
					enabled : true,
					customizeText : function(data) {
						var _chain = this.point.tag ;// 环比率
						var tips = this.seriesName +':' +this.valueText + "<br/>";
						if ((_chain != '') && (typeof (_chain) != "undefined")) {
							if (_chain.indexOf('-') == -1) {
								tips += '环比上月上升了' + _chain + '%';
							} else {
								tips += '环比上月下降了' + _chain.replace('-', '') + '%';
							}
						}

						return tips;
					}
				},
				title : title,
				legend : {
					verticalAlignment : "bottom",
					horizontalAlignment : "center"
				},
				commonPaneSettings : {
					border : {
						visible : true,
						right : false,
						top:false,
						left:false
					}
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

				if(!me.validate(start_date ,end_date,'M',180)){
					return false;
				}
				var param = {start_month: start_date, end_month: end_date, field: me.field};
			//	console.log(param);

				me.doQuery(param);
			});
			$("#reset_btn").click(function() {
		
				var start_date =me.addMonth(-6); 
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
				layer.alert("查询时间段不能为空!");
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
				    color: ['#1E90FF','#99FF66','#e40177','#DDDDDD','#DDDDDD','#DDDDDD'],
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