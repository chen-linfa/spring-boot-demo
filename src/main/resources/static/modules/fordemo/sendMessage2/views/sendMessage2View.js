define(['hbs!../templates/send-message2.html'
        ],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
             that.$('.js-date').datetimepicker();
             that.$('.js-check').icheck();
             that.$('#js-selectmenu').combobox();
		}
	});
    return pageView;
});
