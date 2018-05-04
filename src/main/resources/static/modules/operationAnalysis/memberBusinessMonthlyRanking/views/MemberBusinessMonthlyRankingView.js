define(['hbs!modules/operationAnalysis/memberBusinessMonthlyRanking/templates/member-business-monthly-ranking.html',
    "frm/template/party/echarts.min"
], function(temp, echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.$('.js-date').datetimepicker();
            that.$('.js-pagination').pagination({
                records: 100
            });
            var myDate = new Date();
            var y = myDate.getFullYear();
            var m = myDate.getMonth()+1;
            var year = y.toString();//that.$('.year-item .active').html();
            var month = m>=10?m.toString():"0"+m.toString();//that.$('.month-item .active').val();
            //console.log(y,' ',m);
            //console.log(year,' ',month);
            that.doQuery(year,month);
            that.$('.year-item').find('button').eq(y-2015).addClass("active");
            that.$('.month-item').find('button').eq(m-1).addClass("active");
            that.$('.year-item button').click(function(){
                year = $(this).html();
                //alert("year:"+year+" month:"+ month);
                that.$('.year-item .active').removeClass("active");
                $(this).addClass("active");
                if(month!=""){
                    that.doQuery(year , month);
                }
            });
            that.$('.month-item button').click(function(){
                month = $(this).val();
                //alert("year:"+year+" month:"+ month);
                that.$('.month-item .active').removeClass("active");
                $(this).addClass("active");
                if(year!=""){
                    that.doQuery(year , month);
                }
            });
		},
        doQuery: function(year , month){
            var me = this;
            var params = {};
            params.month = year+"-"+month;
            me.$(".idx-work-ranking .item").remove();
            // $(".idx-work-ranking #msg_top").find("tr:not(:first)").remove();
            // $(".idx-work-ranking #voice_top").find("tr:not(:first)").remove();
            
            fish.callService("AnalysisController", "queryMemUserBusiTop", params, function(result){
                var has_data = false;
                //console.log("params:  "+params.month);
                //console.log("result:  ",result);
                if(result.res_code == "00000"){
                    if(result.result != ''){
                        var info = result.result;
                        has_data = true;
                        me.initTableDeta(me.unitTranslate(info.flow_list), 'flow', 'MB');
                        me.initTableDeta(info.msg_list, 'msg', '条');
                        me.initTableDeta(info.voice_list, 'voice', '分钟');
                    }
                }
                if(has_data == false){
                    var tr_error = '<li class="item"><div class="item-cont"><div class="item-work-num">'+
                                    '暂无数据</div></div><div class="item-number"></div></li>';
                    me.$("#flow").append(tr_error);
                    me.$("#msg").append(tr_error);
                    me.$("#voice").append(tr_error);
                }
            });
        },
        initTableDeta : function(data, tab_type, DW){
            var that = this;
            var tr_error = '<li class="item"><div class="item-cont"><div class="item-work-num">'+
            '暂无数据</div></div><div class="item-number"></div></li>';
            if(data == undefined || data == ''){
                that.$('#'+ tab_type).append(tr_error);
            }else{
                for(var i=0; i<data.length; i++){
                    var obj = data[i];
                    var count_total = obj.count_total;
                    var msisdn = obj.msisdn;
                    if(count_total == undefined || count_total == '' || count_total == 'null') count_total = 0;
                    if(undefined == msisdn || "null" == msisdn ) msisdn = '';
                    var tr_template = '<li class="item">';
                    if(true){
                        if(i == 0){
                            tr_template += '<div class="item-ranking one">1</div>'
                                +'<div class="item-cont"><div class="item-work-num">'+msisdn+'</div></div><div class="item-number">'
                                +count_total+'</div></li>' 
                        }else if(i == 1){
                            tr_template += '<div class="item-ranking two">2</div>'
                                +'<div class="item-cont"><div class="item-work-num">'+msisdn+'</div></div><div class="item-number">'
                                +count_total+'</div></li>' 
                        }else if(i == 2){
                            tr_template += '<div class="item-ranking three">3</div>'
                                +'<div class="item-cont"><div class="item-work-num">'+msisdn+'</div></div><div class="item-number">'
                                +count_total+'</div></li>' 
                        }else{
                            tr_template += '<div class="item-ranking">' + (i+1) + '</div>'
                                +'<div class="item-cont"><div class="item-work-num">'+msisdn+'</div></div><div class="item-number">'
                                +count_total+'</div></li>' 
                        }
                    }else{
                        if(i == 0){
                            tr_template += msisdn+'</td>'+
                                '<td class="text-right"><span class="ranking-num-one">'+count_total+'</span></td></tr>' 
                        }else if(i == 1){
                            tr_template += msisdn+'</td>'+
                                '<td class="text-right"><span class="ranking-num-two">'+count_total+'</span></td></tr>' 
                        }else if(i == 2){
                            tr_template += msisdn+'</td>'+
                                '<td class="text-right"><span class="ranking-num-three">'+count_total+'</span></td></tr>' 
                        }else{
                            tr_template += msisdn+'</td><td class="text-right">'+count_total+'</td></tr>';
                        }
                    }
                    that.$("#"+tab_type).append(tr_template);
                }
            }
        },
        unitTranslate : function(datas){
            if($.isArray(datas)){
                for(var i=0; i<datas.length; i++){
                    var obj = datas[i];
                    var count_total = obj.count_total;
                    if(count_total == undefined || count_total == '' || count_total == 'null'){
                        count_total = 0;
                    } 
                    var num = (parseFloat(count_total) / (1024*1024)).toFixed(2);
                    datas[i].count_total = parseFloat(num);
                }
            }
            return datas;
        },

        initData:function(){//用以从其它页面跳转到当前页面传参，在mainView.js的openView函数中调用。若不声明，会报错
        }
    });
    return pageView;
});