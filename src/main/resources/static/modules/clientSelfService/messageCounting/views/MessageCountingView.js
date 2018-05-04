define(['hbs!modules/clientSelfService/messageCounting/templates/message-counting.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function () {
            var that = this;
            var colorDef = '88,157,255';
            that.$('.js-date').datetimepicker({viewType: "date"});
            that.$('#start_time').val();
            that.$('#end_time').val();
            this.doQuery();
            this.$('#query').click(function(){
                var start_time = that.$("#start_time").val();
                var end_time = that.$("#end_time").val();
                var params = {};
                params.start_time = start_time;
                params.end_time = end_time;
                that.doQuery(null,null,params);
            });
            
        },
        doQuery:function(page,rows,params){
            var that = this;
            // if(!that.validate(start_time ,end_time,'D',90)){
            //     return false;
            // }
            if(params==null){
                var params = {};
            }            
            params.page = 1;
            params.rows = 10;
            console.log("params:  ",params);
            fish.callService("SmsController", "querySmsInfo", params, function(reply){
                console.log("reply:  ",reply);
                //that.$('.detail').show();
                that.$("#send_count").text(reply.rows[0].send_count);
                if(params.start_time){
                	that.$("#time_text").show();
	                that.$("#starttime_text").text(params.start_time);
	                that.$("#endtime_text").text(params.end_time);
                }else{
                	that.$("#time_text").hide();
                }
                that.$("#receive_count").text(reply.rows[0].receive_count);
            //     if (reply.res_code != "00000") {
            //         Utils.alert(reply.res_message);
            //         return;
            //     }
            //     var data = reply.result;
                
            //     var xdate = [];
            //     var count_voice_total = [];
            //     var eData = {};
            //     for(var i=0;i<data.length;i++){
            //         if(data[i].xdate!=null){ //判断字段大小写存在性
            //             xdate.push(data[i].xdate);
            //             count_voice_total.push(data[i].count_voice_total);
            //         }else{
            //             xdate.push(data[i].XDATE);
            //             count_voice_total.push(data[i].COUNT_VOICE_TOTAL);
            //         }
            //     }
            //     eData.xdate = xdate;
            //     eData.count_voice_total = count_voice_total;
                that.update_(reply);
            //     //console.log("eData:  ",eData);
            });
        },
        update_:function(mdata){
            var that = this;
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
                    //data: mdata.rows
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
                    }
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
                    //data: data.rows
                }, {
                    name: '短信接收总数:',
                    type: 'bar',
                    barGap: 0,
                    barWidth: 25,
                    data: [270, 180, 280, 310, 120, 270]
                    //data: [270, 180, 280, 310, 120, 270]
                },]
            };


            Chart1.setOption(option1);


            $(window).on("debouncedresize", function () {
                Chart1.resize();

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
