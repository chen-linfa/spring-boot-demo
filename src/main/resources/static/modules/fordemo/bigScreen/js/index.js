var that = this;
var Chart1 = echarts.init(that.$('.user-dev-chart')[0]);
var Chart2 = echarts.init(that.$('.company-dev-chart')[0]);
var Chart3 = echarts.init(that.$('.terminal-chart')[0]);
var Chart4 = echarts.init(that.$('.chart-api')[0]);
var chartColor = ['#B1E35D', '#1AEDB7', '#28D8E8', '#1790BE', '#1180AA', '#1180AA', '#1180AA', '#1180AA', '#1180AA', '#1180AA']
var chartColor = ['#1180AA', '#1180AA', '#1180AA', '#1180AA', '#1180AA', '#1180AA', '#1790BE', '#28D8E8', '#1AEDB7', '#B1E35D']
var option1 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '@numBg'
            }
        }
    },
    // color: colorArr,

    legend: {
        data: ['',],
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
        boundaryGap: false,
        data: ['1日', '2日', '3日', '4日', '5日', '6日', '今日'],
        axisLabel: {
            textStyle: {
                color: "#fff",
            }
        }
    }],
    yAxis: [{
        splitLine: {
            lineStyle: {
                color: '#34415c',
            }
        },

        type: 'value',
        name: '用户总数',
        position: 'left',
        axisLabel: {
            textStyle: {
                color: "#939CAD"
            }
        }
    },
    {
        splitLine: {
            lineStyle: {
                color: '#34415c',
            }
        },
        type: 'value',
        name: '新增用户数',
        position: 'right',
        min: 0,
        max: 20,
        axisLabel: {
            textStyle: {
                color: "#939CAD"
            }
        }
    }],
    series: [{
        name: '用户总数',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#12A0DF ' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#65D4F0' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        lineStyle: {
            normal: {
                opacity: 0
            }
        },
        data: [15000, 17000, 22000, 25000, 28000, 25000, 35000]
    },
    {
        name: '新增用户数',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        areaStyle: {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#5CF684' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#99ECB2' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        lineStyle: {
            normal: {
                opacity: 0
            }
        },
        data: [2, 2, 2, 3, 3, 2, 4]
    }
    ]
};

var option2 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        top: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: ['政企', '浦东', '南区', '西区', '北区', '闵行', '松江', '宝山', '嘉定', '青浦', '奉贤', '金山', '崇明'],
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                textStyle: {
                    color: "#fff",
                    writingMode: 'tb'
                }
            }
        }
    ],
    yAxis: [
        {
            splitLine: {
                lineStyle: {
                    color: '#34415c',
                }
            },
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: "#939CAD"
                }
            }
        }
    ],
    series: [
        {
            name: '',
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#76DDFB' },
                            { offset: 1, color: '#53A8E2' }
                        ]
                    )
                }
            },
            data: [9.4, 8.2, 10.9, 6.5, 5.1, 12.9, 8.9, 11.3, 7.2, 5.9, 8.1, 7.4, 4.4]
        }
    ]
}

var option3 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: []
    },

    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '4%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'value',
            show: false,
            splitLine: { show: false },
        }
    ],
    yAxis: [
        {
            type: 'category',
            axisTick: { show: false },
            axisLabel: {
                textStyle: {
                    color: "#fff"
                }
            },
            data: ['福建', '浙江', '江苏', '内蒙古', '河北', '北京', '江西', '海南', '广东', '天津']
        }
    ],
    series: [
        {
            name: '',
            type: 'bar',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            itemStyle: {
                normal: {
                    // callback,设定每一bar颜色,配置项color顶axis一组bars颜色
                    color: function (params) {
                        var num = chartColor.length;
                        return chartColor[params.dataIndex % num]
                    }
                }
            },
            data: [543223, 765423, 987542, 1023344, 1087767, 1998798, 2187978, 3765868, 4587792, 5646312]
        },

    ]
}
var option4 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '@numBg'
            }
        }
    },
    // color: colorArr,

    legend: {
        data: ['',],
    },
    grid: {
        show: false,
        left: '-6%',
        right: '4%',
        top: '6%',
        bottom: '3%',
        containLabel: true,
        borderColor: 'red'
    },
    xAxis: [{

        type: 'category',
        boundaryGap: false,
        data: ['1日', '2日', '3日', '4日', '5日', '6日', '今日'],
        axisLabel: {
            textStyle: {
                color: "#fff"
            }
        }
    }],
    yAxis: [{
        show: false,
        splitLine: { show: false },
        type: 'value',
        name: '用户总数',
        position: 'left',
        axisLabel: {
            textStyle: {
                color: "#939CAD"
            }
        }
    }],
    series: [{
        name: '用户总数',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0, color: '#13A0DF' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#44FF76' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        lineStyle: {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0, color: '#13A0DF' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#44FF76' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            }
        },
        data: [15000, 17000, 22000, 25000, 28000, 25000, 35000]
    }

    ]
};

Chart1.setOption(option1);
Chart2.setOption(option2);
Chart3.setOption(option3);
Chart4.setOption(option4);
// window.onresize = Chart1.resize;
// window.onresize = Chart2.resize;
// window.onresize = Chart3.resize;
// window.onresize = Chart4.resize;


$(window).on("resize", function () {
    Chart1.resize();
    Chart2.resize();
    Chart3.resize();
    Chart4.resize();
});

//window.addEventListener("resize", function () {	barChart.resize();	pieChart.resize();	});
