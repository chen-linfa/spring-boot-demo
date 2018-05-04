define(['hbs!../templates/date-data-analy.html'],function(temp){
	var views = fish.View.extend({
		template: temp,
		// el: false,
		afterRender: function(){
			var that = this;
			that.$('.js-datetimepicker').datetimepicker();	
			that.$('.js-combobox').combobox();
			
			//echart
			var myChart = echarts.init(document.getElementById('js-bar'));
			option = {
			    color: ['#76ACF7'],
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            
			            type : 'shadow' 
			        }
			    },
			    grid: {
			        left: '0%',
			        right: '0%',
			        bottom: '0%',
			        containLabel: true
			    },
			    xAxis : 
			        {
			            type : 'category',
			            data : ['1', '2', '3', '4', '5', '6', '7','8'],
			            axisTick: {
			                alignWithLabel: true
			            },
			            axisLine:{//坐标轴线是否显示
			                lineStyle:{
		                		color: '#ccc',
		                	}
		                },
		                 axisTick:{//刻度线是否显示
		                	show:false,
		                }
		             //    axisLabel:{
			            // 	show: true,
			            // 	color:'#808087',
			            // 	fontWeight: 'bold'
			            // },
			        }
			    ,
			    yAxis : 
			        {
			            type : 'value',
			            axisTick:{//刻度线是否显示
		                	show:false,
		                },
			            axisLine:{//坐标轴线是否显示
			                show: false
		                },
		                splitLine:{
		                	lineStyle:{
		                		color:'#F5F7F8'
		                	}
		                }
			        }
			    ,
			    series : [
			        {
			            name:'用户情况日数据',
			            barWidth: 30,
			            type:'bar',
			            data:[10, 52, 200, 334, 390, 330, 220, 100],
			        }
			    ]
			};
			myChart.setOption(option);
			//浮层
			this.requireView({
				url:"modules/formanage/dateDataAnaly/views/searchGroupFixedView",
				selector:".fbox",
				callback:function(view){
					that.fboxView = view;
					that.$(".js-fixed").fixedbox({
						trigger:"click",
						width: 340,
						content:that.$(".fbox"),
						show:function (e) {
							console.log("show");
						}
					});
				}
			});
		}
	});
	return views;
});