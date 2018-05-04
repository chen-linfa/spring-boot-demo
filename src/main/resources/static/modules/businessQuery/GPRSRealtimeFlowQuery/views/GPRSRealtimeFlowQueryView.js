define(['hbs!modules/businessQuery/GPRSRealtimeFlowQuery/templates/GPRSRealtimeFlowQuery.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                // that.$('.js-progressbar1').progressbar({
                //      value: 20
                // });
                that.$('.js-search').unbind().bind("click", function() {
                    that.loadCurrentFlowInfo();
                });
            },
            loadCurrentFlowInfo : function() {
                // 集团详情
                var that = this;
                var msisdn = $.trim(that.$('#search_content').val());// 去除输入框中的空格
                if (msisdn == '请输入卡号') {
                    msisdn = '';
                }
                
                if(msisdn == ''){
                    layer.alert('请输入卡号');
                    return ;
                }
                
                if(!/^[1-9][0-9]*$/.test(msisdn)){
                    layer.alert("卡号格式错误");
                    return;
                }
                
                var params = {};
                params.msisdn = msisdn;
                params.isRel = "1";
                fish.callService("CustMemController","queryCurrentBusiUsage",params,function(result) {
                	
                    var data = result.result;
                

                    if (data.result_code == "SUCCESS") {
                        that.$(".js-voice").html(data.teleminutes+'<span class="f12 text-brand-primary">分钟</span>');
                        that.$(".js-message").html(data.massage+'<span class="f12 text-brand-primary">条</span>');
                        that.$(".js-flow").html(data.flows+'<span class="f12 text-brand-primary">MB</span>');
                        that.$('.js-detail').show();
                        that.$(".js-error").hide();
                    } else if (result.res_code == "1300") {
                        that.$('.js-detail').hide();
                        that.$('.js-error').empty();
                        that.$('.js-error').html("<tr><td colspan='99' align='center'><font color='red'>"+result.res_message+"</font></td></tr>");
                        that.$('.js-error').show();
                    } else {
                        that.$('.js-detail').hide();
                        that.$('.js-error').empty();
                        that.$('.js-error').html("<tr><td colspan='99' align='center'><font color='red'>暂无数据，请重新查询！</font></td></tr>");
                        that.$('.js-error').show();
                    }
                        
                });

            },

        });
        return pageView;
    });
