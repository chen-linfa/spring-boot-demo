define(["hbs!../templates/time.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            that.$("#btn_confirm").click(function(){
            	var selected = [];
            	that.$(":checked").each(function(){
            		selected.push($(this).attr("value"));
            	});
            	that.trigger("select",selected.join(","));
            	that.popup.close();
            });
            that.initState();
            //that.$(".js-check").icheck();
        },
        onClosePupup: function () {
            this.popup.close();
        },
        initState : function() {
            var that = this;
            var loc_rates = that.options.loc_rate;
            var rates_arr = loc_rates.split(",");
            _.each(rates_arr,function(data){
            	that.$(":checkbox[value='"+data+"']").prop("checked",true);
            });
        }

        
    });

    return components;
});
