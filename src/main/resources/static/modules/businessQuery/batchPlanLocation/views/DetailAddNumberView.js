define(["hbs!modules/businessQuery/batchPlanLocation/templates/detailAddNumber.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            that.$("#proj_save_btn").click(function() {
                that.addPlanDetail();
            });
            
            that.$("#return_btn").click(function() {
                that.popup.close();
            });
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        //新增操作
        addPlanDetail : function() {
            var me = this;
            var msisdn = $.trim(me.$("#vadd_msisdn").val());
            if (!msisdn) {
                layer.alert("号码不能为空");
                return;
            };
            var param = {
                    msisdn : msisdn,
                    plan_id : me.options.plan_id
            };
            fish.callService("LocationController", "addLocationPlanDetail", param , function(reply){
                if (reply.res_code != "00000") {
                    layer.alert(reply.res_message);
                    return;
                }
                layer.alert("操作成功");
                me.parentView.doQuery();
            });
        },

    });

    return components;
});
