define(['hbs!modules/formanage/indexPage/templates/index.html'], function (temp) {
    var pageView = fish.View.extend({
        el: false,
        template: temp,
        afterRender: function () {
            var that = this;
            var colorArr = ['#2C82BE', '#76DDFB', '#DBECF8', '#ABB7BF', '#53A8E2', '#ABC8FF'];
            var Chart1 = echarts.init(that.$('.js-chart-1')[0]);
            var Chart2 = echarts.init(that.$('.js-chart-2')[0]);
            var option1 = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a}<br/>{b}:{c}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    formatter: '{name}',
                    data: ['正常', '停机', '未激活', '沉默期', '测试期', '其他']
                },
                color: colorArr,
                series: [{
                    name: '号码状态分布',
                    type: 'pie',
                    radius: ['40%', '70%'],
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
                    data: [
                        { value: 335, name: '正常' },
                        { value: 310, name: '停机' },
                        { value: 234, name: '未激活' },
                        { value: 135, name: '沉默期' },
                        { value: 235, name: '测试期' },
                        { value: 1548, name: '其他' }
                    ]
                }]
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
                    top: '6%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['本地卡', '物联卡'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#black"
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#dfdfdf"
                        }

                    }
                }],
                yAxis: [{
                    type: 'value',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#dfdfdf"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#black"
                        }
                    },
                    axisTick: {
                        lineStyle: {
                            color: "#dfdfdf"
                        }
                    }
                }],
                series: [{
                    name: '号码品牌分布',
                    type: 'bar',
                    barWidth: '60%',
                    data: [11344, 2344]
                }],
                itemStyle: {
                    normal: {
                        shadowBlur: 0
                    }
                }
            };

            Chart1.setOption(option1);
            Chart2.setOption(option2);

            $(window).on("debouncedresize", function () {
                Chart1.resize();
                Chart2.resize();
            });

        }
    });
    return pageView;
});