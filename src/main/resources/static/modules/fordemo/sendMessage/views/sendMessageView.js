define(['hbs!modules/fordemo/sendMessage/templates/sendMessage.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
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
