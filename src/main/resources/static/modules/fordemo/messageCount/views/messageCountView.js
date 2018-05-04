define(['hbs!modules/fordemo/messageCount/templates/messageCount.html'], function (temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function () {
            var that = this;
            var colorDef = '88,157,255';
            that.$('.js-date').datetimepicker();
            var Chart1 = echarts.init(that.$('.js-chart-1')[0], 'day');
           var option1 = {
                backgroundColor: "#fff",
                color: ["#579CFF", "#76DDFB"],
                textStyle: {
                    color: "#ffffff",
                },

                xAxis: [{
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: ['2017-5', '2017-4', '2017-3', '2017-2', '2017-1', '2016-12']
                }],
                yAxis: [{
                    type: 'value',
                    
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#333333"
                            
                        }
                    },
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                series: [{
                    name: '短信发送总数: ',
                    type: 'bar',
                    barWidth: 25,
                    data: [350, 270, 420, 380, 150, 310]
                }, {
                    name: '短信接收总数:',
                    type: 'bar',
                    barGap: 0,
                    barWidth: 25,
                    data: [270, 180, 280, 310, 120, 270]
                },]
            };


            Chart1.setOption(option1);


            $(window).on("debouncedresize", function () {
                Chart1.resize();

            });
        }
    });
    return pageView;
});