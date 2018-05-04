define(['hbs!modules/fordemo/monthlyInfo/templates/montyly-info.html'], function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function() {
            var that = this;
            var colorDef = '88,157,255';
            that.$('.js-date').datetimepicker();
            var Chart1 = echarts.init(that.$('.js-chart-1')[0], 'day');
            var Chart2 = echarts.init(that.$('.js-chart-2')[0], 'day');
            var option1 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['语音分钟环比上月'],
                    show: false
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    top: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                        name: '语音分钟环比上月',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        areaStyle: {
                            normal: {
                                color: 'rgba(' + colorDef + ', 0.2)'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(' + colorDef + ')',
                                borderColor: 'rgba(' + colorDef + ',0.2)',
                                borderWidth: 12

                            }
                        },
                        data: [120, 132, 101, 134, 90, 120, 132, 101, 134, 90, 230, 210]
                    }
                ]
            };

            var option2 = {
                 color: ['#76ACF7'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    top: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '语音',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220, 100, 52, 200, 334, 390]
                }]
            }

            Chart1.setOption(option1);
            Chart2.setOption(option2);

            $(window).on("debouncedresize", function() {
                Chart1.resize();
                Chart2.resize();
            });
        }
    });
    return pageView;
});