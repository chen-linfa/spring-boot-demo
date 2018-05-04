define([ 'hbs!modules/businessQuery/userBillQuery/templates/userBillQuery.html',
		"frm/template/party/echarts.min" ], function(temp, echarts) {
	var pageView = fish.View.extend({
		template : temp,
		afterRender : function() {
			this.initBillGrid();
			this.initMonthCombobox();
			this.initEvents();
		},
		// 注册事件
		initEvents : function() {
			var _this = this;
			$("#btn_qry").click(function() {
				_this.$('.js-error').hide();
				_this.$('.js-error').empty();
				_this.reloadBillGrid();
			});
		},
		// 初始化月份下拉框
		initMonthCombobox : function() {
			fish.callService("CustBusinessContrller", "qryMonthList", {}, function(data) {
				var monthList = [];
				if (data.res_code == "00000") {
					monthList = data.result;
				} else {
					fish.error(data.res_message);
				}
				$('#month').combobox({
					editable : false,
					dataTextField : "name",
					dataValueField : "value",
					dataSource : monthList,
					width : 200
				});
				// 默认选中当月
				$('#month').combobox("value", monthList[0].value);
			});
		},
		// 初始化账单表格
		initBillGrid : function() {
			var $grid = $("#bill_grid").grid({
				datatype : "json",
				height : "auto",
				colModel : [ {
					name : 'title',
					sortable : false,
					label : '账单项',
					colHide  : true,
					width : 120
				}, {
					name : 'value',
					sortable : false,
					label : '金额(元)',
					colHide  : true,
					width : 200
				} ]
			});
		},
		//初始化图标
		initchart : function(PCAS_04_X,PCAS_04_Y,month_expenses){
			var that = this;
			var brand_option = {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter:'{a}<br />{b}:{c}元'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        top: '6%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: PCAS_04_X.reverse(),
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '近六个月消费图',
                        type: 'bar',
                        barWidth: '60%',
                        data: PCAS_04_Y.reverse()
                    }]
                };
                var brand_chart = echarts.init(that.$('.js-chart-xy')[0],'day');
                brand_chart.setOption(brand_option);
                
                
                //初始化饼图
                //当读取数据格式错误时，数据显示为0
                status_data = [{value:parseFloat(month_expenses.expenses_0)||0,name:'套餐固定费用'},
                            {value:parseFloat(month_expenses.expenses_1)||0,name:'语音通信费'},
                            {value:parseFloat(month_expenses.expenses_2)||0,name:'上网费'},
                            {value:parseFloat(month_expenses.expenses_3)||0,name:'短彩信费'},
                            {value:parseFloat(month_expenses.expenses_4)||0,name:'增值业务费'},
                            {value:parseFloat(month_expenses.expenses_5)||0,name:'代收业务费'},
                            {value:parseFloat(month_expenses.expenses_6)||0,name:'其他费'}]
                var colorArr = ['#2C82BE', '#76DDFB', '#DBECF8', '#ABB7BF', '#53A8E2', '#ABC8FF'];
                var status_chart = echarts.init(that.$('.js-chart-cycle')[0],'day');

                 var status_option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a}<br/>{b}:{c}元({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        formatter: '{name}',
                        data: ['套餐固定费用', '语音通信费', '上网费', '短彩信费', '增值业务费', '代收业务费','其他费']
                    },
                    color: colorArr,
                    series: [{
                        name: '当月费用结构图',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['60%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'inside'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: status_data
                    }]
                };
                status_chart.setOption(status_option);
		},
		
		initCustInfo : function(ele,realTimeBillList){
			var html = "<div class='col-xs-4'>客户名称："+ ele.acct_name +"</div>";
			html+="<div class='col-xs-4'>手机号："+ realTimeBillList[0].phone_id +"</div>";
			$(".well").html(html);
		},
		
		reloadBillGrid : function() {
			var that = this;
			var msisdn = $.trim($("#msisdn").val());
			if (msisdn == "") {
				layer.alert("请输入手机号");
				return;
			}
			var month = $('#month').combobox('value');
			if (month == "") {
				fish.warn("请选择月份！");
				return;
			}
			var params = {"msisdn" : msisdn, "begin_month" : month, "end_month" : month};
			fish.callService("CustBusinessContrller", "userBillQuery", params, function(data) {
				if (data.res_code == "00000") {
					$(".online-row").css("visibility","visible");
					if(data.response.real_type == "0"){
						//$("#bill_grid").grid("reloadData", data.result.historyBillList);
						changeDate(data.result.historyBillList);
						that.initCustInfo(data.result,data.result.historyBillList);
					}else if(data.response.real_type == "2"){
						//$("#bill_grid").grid("reloadData", data.result.realTimeBillList);
						changeDate(data.result.realTimeBillList);
						that.initCustInfo(data.result,data.response.realTimeBillList);
					}
					//that.initchart(data.result.PCAS_04_X,data.result.PCAS_04_Y,data.result.month_expenses);
				} else {
                    that.$('.js-error').empty();
                    that.$('.js-error').html("<tr><td colspan='99' align='center'><font color='red'>"+data.res_message+"</font></td></tr>");
                    that.$('.js-error').show();
				}
			});
		}
	});
	return pageView;
});
function changeDate(billList){
	var arr = [];
	var obj = {};
	obj2.title = "bill_fee";
	obj2.value = billList.bill_fee;
	arr.push(obj2);
	obj3.title = "unpay_fee";
	obj3.value = billList.unpay_fee;
	arr.push(obj3);
	obj4.title = "ppy_fee";
	obj4.value = billList.ppy_fee;
	arr.push(obj4);
	obj5.title = "late_fee";
	obj5.value = billList.late_fee;
	arr.push(obj5);
	obj6.title = "bill_month";
	obj6.value = billList.bill_month;
	arr.push(obj6);
	obj9.title = "sts";
	obj9.value = billList.sts;
	arr.push(obj9);
	obj10.title = "sts_date";
	obj10.value = billList.sts_date;
	arr.push(obj10);
	obj11.title = "due_date";
	obj11.value = billList.due_date;
	arr.push(obj11);
	obj13.title = "billing_type";
	obj13.value = billList.billing_type;
	arr.push(obj13);
	obj15.title = "is_real";
	obj15.value = billList.is_real;
	arr.push(obj15);
	obj16.title = "end_balance";
	obj16.value = billList.end_balance;
	arr.push(obj16);
	obj17.title = "end_fund_balance";
	obj17.value = billList.end_fund_balance;
	arr.push(obj17);
	
	$("#bill_grid").grid("reloadData", arr);
}

