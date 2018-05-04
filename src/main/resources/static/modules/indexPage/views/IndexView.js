define(['hbs!modules/indexPage/templates/index.html'], function(temp) {
    var pageView = fish.View.extend({
        el: false,
        template: temp,
        afterRender: function() {
            var that = this;
            //that.initCustInfo();//左侧用户名，密码，右侧用户情况概述，集团业务概览
            //that.initMsgOverview();//号码状态分布，号码品牌分布，流量使用情况分布
            //that.showMoreInfo();
            //that.initBusiTop();//排行版数据
            //that.initNotice();//异动告警
            //that.initCustProd();//集团订购列表
            //var status_chart = echarts.init(that.$('.js-chart-status')[0],'day');
            //var brand_chart = echarts.init(that.$('.js-chart-brand')[0],'day');

            $(window).on("debouncedresize", function() {
                status_chart.resize();
                brand_chart.resize();
            });

        },
        
        //单个数据流量单位转换
        unitTranslate_0 : function(flow_count){
            var unit = 'KB';
            if(flow_count == ''){
                flow_count = '0';
            }
            flow_count = (parseFloat(flow_count) / 1024);
            if(flow_count >= (1024 * 1024)){
                unit = 'G';
                flow_count = (parseFloat(flow_count) / (1024 * 1024)).toFixed(2);
            }else if(flow_count >= 1024){
                unit = 'MB';
                flow_count = (parseFloat(flow_count) / 1024).toFixed(2);
            }else{
                flow_count = parseFloat(flow_count).toFixed(2);
            }
            return {"flow_count" : flow_count, "unit" : unit};
        },
        
        //左侧用户名，密码，右侧用户情况概述，集团业务概览
        initCustInfo:function(){
            var that = this;
            fish.callService("CustHomePageController", "queryCustInfoForHome", {}, function(result){
                var balance_amount = "";
                var cust_name = "";
                var cust_code = "";
                var count_flow_total = "0";
                var count_msg_total = "0";
                var count_voice_total = "0";
                var user_count = "0";
                var add_user_count = "0";
                var lost_user_count = "0";
                
                if(result.res_code == "00000"){
                    if(!that.isEmptyObject(result.result)){
                        var cust = result.result.cust;
                        if(!that.isEmptyObject(cust)){
                        	//暂存集团用户信息供其他地方使用
                        	fish._userinfo = {
                        		cust_name:cust.cust_name,
                        		cust_code:cust.cust_code
                        	};
                            cust_name = cust.cust_name;
                            cust_code = cust.cust_code;
                        }
                
                        user_count = result.result.user_count;
                        
                        var mem_user_info_1 = result.result.mem_user_info_1;
                        if(mem_user_info_1 != '' && mem_user_info_1 != null){
                            add_user_count = mem_user_info_1.add_user_count;
                            lost_user_count = mem_user_info_1.lost_user_count;
                        }
                        
                        var cust_busi_info = result.result.cust_busi_info;
                        if(cust_busi_info != '' & cust_busi_info != null){
                            count_flow_total = cust_busi_info.count_flow_total;
                            count_msg_total = cust_busi_info.count_msg_total;
                            count_voice_total = cust_busi_info.count_voice_total;
                        }
                    }
                }
                
                $(".js-cust-name").html(cust_name);
                $(".js-cust-code").html(cust_code);
                
                this.$(".js-user-count").html(user_count+"个");
                this.$(".js-add-user-count").html(add_user_count+"个");
                this.$(".js-lost-user-count").html(lost_user_count+"个");

                var flow_map = that.unitTranslate_0(count_flow_total);
                $(".js-count-flow-total").html(flow_map.flow_count+flow_map.unit);
                $(".js-count-msg-total").html(count_msg_total+"条");
                $(".js-count-voice-total").html(count_voice_total+"分钟");
                });
        },
        //号码状态分布，号码品牌分布，流量使用情况分布
        initMsgOverview:function(){
            var that = this;
            fish.callService("CustHomePageController", "queryCustChartInfo", {}, function(result){
            if(result.res_code == "00000"){
                if(!that.isEmptyObject(result.result)){
                    var card_status_map = result.result.card_status_map;
                    var card_brand_map = result.result.card_brand_map;
                    var mem_user_map = result.result.mem_user_map;
                    //号码状态分布
                    if(card_status_map){
                        //号码状态分布
                        if(that.isEmptyObject(card_status_map)){
                            card_status_map = {};
                            card_status_map.card_status_0 = 0;
                            card_status_map.card_status_1 = 0;
                            card_status_map.card_status_2 = 0;
                            card_status_map.card_status_3 = 0;
                            card_status_map.card_status_4 = 0;
                            card_status_map.card_status_5 = 0;
                        }
                        //当读取数据格式错误时，数据显示为0
                        status_data = [{value:parseFloat(card_status_map.card_status_1)||0,name:'正常'},
                                    {value:parseFloat(card_status_map.card_status_2)||0,name:'停机'},
                                    {value:parseFloat(card_status_map.card_status_0)||0,name:'未激活'},
                                    {value:parseFloat(card_status_map.card_status_4)||0,name:'沉默期'},
                                    {value:parseFloat(card_status_map.card_status_3)||0,name:'测试期'},
                                    {value:parseFloat(card_status_map.card_status_5)||0,name:'其他'}]
                        var colorArr = ['#2C82BE', '#76DDFB', '#DBECF8', '#ABB7BF', '#53A8E2', '#ABC8FF'];
                        var status_chart = echarts.init(that.$('.js-chart-status')[0],'day');

                         var status_option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a}<br/>{b}:{c}个({d}%)"
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
                    }
                    //号码品牌分布
                    if(card_brand_map){
                        if(that.isEmptyObject(card_brand_map)){
                            card_brand_map = {};
                            card_brand_map.card_brand_type_0 = 0;
                            card_brand_map.card_brand_type_1 = 0;
                        }
                        //如果没有数据则为0
                        var brand_data = [parseFloat(card_brand_map.card_brand_type_0)||0,parseFloat(card_brand_map.card_brand_type_1)||0];
                        
                        var brand_option = {
                            color: ['#3398DB'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                                },
                                formatter:'{a}<br />{b}:{c}个'
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
                                }
                            }],
                            yAxis: [{
                                type: 'value'
                            }],
                            series: [{
                                name: '号码品牌分布',
                                type: 'bar',
                                barWidth: '60%',
                                data: brand_data
                            }]
                        };
                        var brand_chart = echarts.init(that.$('.js-chart-brand')[0],'day');
                        brand_chart.setOption(brand_option);
                    }
                    //流量使用情况
                    if(mem_user_map){
                        if(that.isEmptyObject(mem_user_map)){
                            mem_user_map = {};
                            mem_user_map.count_flow_local = 0;
                            mem_user_map.count_flow_roaming = 0;
                        }
                        var flow_map_0 = that.unitTranslate_0(mem_user_map.count_flow_local);
                        var flow_map_1 = that.unitTranslate_0(mem_user_map.count_flow_roaming);
                       
                        this.$(".js-local-flow").html(flow_map_0.flow_count+flow_map_0.unit);
                        this.$(".js-roaming-flow").html(flow_map_1.flow_count+flow_map_1.unit);

                        mem_user_map.count_flow_local = mem_user_map.count_flow_local?mem_user_map.count_flow_local:0;
                        mem_user_map.count_flow_roaming = mem_user_map.count_flow_roaming?mem_user_map.count_flow_roaming:0;

                        var sum = parseFloat(mem_user_map.count_flow_local) + parseFloat(mem_user_map.count_flow_roaming);
                        var roaming_flow_width = 100*(parseFloat(mem_user_map.count_flow_roaming)/sum);
                        var local_flow_width = 100*(parseFloat(mem_user_map.count_flow_local)/sum);

                        this.$('.js-roaming-flow-width').width(roaming_flow_width+"%");
                        this.$('.js-local-flow-width').width(local_flow_width+"%");
                }
                }
            }
        });
        },

        //更多信息
        showMoreInfo : function(){
            var that = this;
            this.$(".js-more-ranking-info").click(function(){
                var viewURL = "modules/operationAnalysis/memberBusinessMonthlyRanking/views/MemberBusinessMonthlyRankingView";
                that.parentView.openView(viewURL,{});
             });

            this.$(".js-more-unusual-info").click(function(){
                 var viewURL = "modules/clientSelfService/unusualWarning/views/UnusualWarningView";
                that.parentView.openView(viewURL,{});
            });
               
         },

        //成员业务量本月Top 10
        initBusiTop : function(){
           var that = this;
            that.$(".js-ranking").children(":gt(1)").hide();
            that.$(".js-ranking-tabs a").click(function(event){
                that.$(".js-ranking").children(":gt(0)").hide();
                var indexShow = $(event.target).index()+1;
                that.$(".js-ranking").children(":eq("+indexShow+")").show();
                $(event.target).addClass("activtead");
                $(event.target).siblings().removeClass("activtead");
            });
           var params = {};
           params.month = that.showMonthSelect(0);
           fish.callService("AnalysisController", "queryMemUserBusiTop", params, function(result){
               var has_data = false; 
               if(result.res_code == "00000"){
                   if(!that.isEmptyObject(result.result)){
                       var info = result.result;
                       has_data = true;
                       that.setBusiTopData(that.unitTranslate(info.flow_list), 'js-flow-top', 'MB');
                       that.setBusiTopData(info.msg_list, 'js-msg-top', '条');
                       that.setBusiTopData(info.voice_list, 'js-voice-top', '分钟');
                        that.$(".js-ranking").children(":gt(1)").hide();
                   }
               }
               if(has_data == false){
                   var tr_error = that.$(".js-no-data").clone().removeClass("js-no-data");
                   that.$(".js-flow-top").replaceWith(tr_error.clone());
                   that.$(".js-msg-top").replaceWith(tr_error.clone());
                   that.$(".js-voice-top").replaceWith(tr_error.clone());
                   that.$(".js-ranking").children(":gt(1)").hide();
               }
           });
        },

        //返回正确的月份格式
        showMonthSelect : function (monthNum) {
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
        //批量数据流量单位转换
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
        //添加排行榜
        setBusiTopData : function(data, tab_type, DW){
            var that = this;
            that.$("."+tab_type).empty();
            var tr_error = that.$(".js-no-data").clone().removeClass("js-no-data");
           if(data==undefined||data.length ==0){
               that.$("."+tab_type).replaceWith(tr_error);
           }else{
                data.length = data.length>5?5:data.length;//暂定只显示5项
               _.each(data,function(value,key,list){
                    var li_template = this.$(".js-ranking-template li").clone();
                   var obj = value;
                   var count_total = obj.count_total?obj.count_total:0;
                   var msisdn = obj.msisdn?obj.msisdn:"";
                   $(".item-ranking",li_template).html(key+1);
                   $(".item-work-num",li_template).html(msisdn);
                   $(".item-number",li_template).html(count_total+DW);
                   switch (key+1) {
                       case 1:
                           $(".item-ranking",li_template).addClass("one");
                           break;
                       case 2:
                            $(".item-ranking",li_template).addClass("two");
                            break;    
                       case 3:
                            $(".item-ranking",li_template).addClass("three");
                            break;    
                       default:
                           break;
                   }
                   that.$("."+tab_type).append(li_template);
               });
               }
        },
         //初始化公告
        initNotice : function(){
            var that = this;
            var params = {};
            params.page = 1;
            params.rows = 3;//显示三行
            params.is_honePage = 'true';
            fish.callService("CustHomePageController", "getCustNoticeList", params, function(result){
                that.$(".js-changes-warn").empty();
                if(!result.rows||result.rows.length == 0){
                    var li_error = that.$(".js-no-data").clone().removeClass("js-no-data");
                    that.$(".js-changes-warn").replaceWith(li_error);
                }
                else{
                    that.setNoticeData(result.rows);
                }
            }); 
        },
        setNoticeData : function(data){
            var that = this;
            //debugger;
            var li_error = that.$(".js-no-data").clone().removeClass("js-no-data");
            if(data == undefined || data.length == 0){
                this.$('.js-changes-warn').replaceWith(li_error);
            }else{           
                _.each(data,function(value,index,array){
                    var li_template = that.$(".js-changes-warn-template li").clone();
                    var notice_id = value.notice_id;
                    var notice_title = value.notice_title;
                    var notice_type = value.notice_type;
                    var issue_type = value.issue_type;
                    var batch_id = value.batch_id;
                    notice_title = notice_title.split(/[:：]/);//以冒号分隔前面部分与后面的数字，这里的冒号有时是中文的，有时是英文的
                    li_template.find(".js-warn-content").html(notice_title[0].slice(0,10));//前十位为日期                   
                    li_template.find(".js-warn-title").html(notice_title[0].slice(10));//日期之后，数字之前的所有信息
                    var num = parseFloat(notice_title[1]);//后面部分为数字
                    if(num>99){//大于99显示99+，加上类more-num
                        num ="99+";
                        that.$(".js-warn-num").addClass("more-num");//大于99要加上类
                    }
                    li_template.find(".js-warn-num").html(num);
                    li_template.find(".js-warn-num").click(function(){
                        if(issue_type == "30"){
                            //跳到成员使用情况清单告警
                            var viewURL = "modules/serviceControlWarn/views/memUsingInfoNoticeView";
                            that.parentView.openView(viewURL,{batch_id:batch_id});

                        }else{//跳到异动告警
                             var viewURL = "modules/clientSelfService/unusualWarning/views/UnusualWarningView";
                            that.parentView.openView(viewURL,{});
                        }
                    });
                    that.$(".js-changes-warn").append(li_template);

                })
            }
        },
        //集团订购列表
        initCustProd : function(){
            var that = this;
            var params = {};
            params.pageNum = "1";
            params.pageRow = "9";
            fish.callService("CustController", "getCustProdRelList", params, function(result){
                that.$(".js-order-list").empty();
                if(!that.isEmptyObject(result)){
                    that.setCustProdData(result.rows);
                }
                else{
                    var tr_error = that.$(".js-no-data").clone().removeClass("js-no-data");
                    that.$(".js-order-list").replaceWith(tr_error);
                }
            });     
        },
        setCustProdData : function(data){
            var that = this;
            var tr_error = that.$(".js-no-data").clone().removeClass("js-no-data");
            if(data == undefined || data.length == 0){
                that.$('.js-order-list').append(tr_error);
            }else{
                data.length = data.length>9?9:data.length;//最长显示9条信息，否则会撑到下面
                for(var i=0; i<data.length; i++){
                    var obj = data[i];
                    var open_time = obj.open_time;
                    var prod_name = obj.prod_name;
                    open_time = open_time||'';//若没有open_time数据，则置为‘’
                    if(open_time.length > 10){//若长于10，则只取前十位
                        open_time = open_time.substring(0, 10);
                    }
                    prod_name = prod_name||'';//若没有open_name数据，则置为‘’
                    var li_template = that.$(".js-order-list-template li").clone();
                    li_template.find("span").html(open_time);
                    li_template.find("a").html(prod_name);
                    that.$(".js-order-list").append(li_template);
                }
            }
        },
        isEmptyObject:function(obj) {//判断是否为空对象
         for (var key in obj) {
            return false;
             }
            return true;
        }
    });
    return pageView;
});