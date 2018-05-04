define(['hbs!modules/fordemo/flowWarning/templates/flowWarning.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.$('.js-date').datetimepicker();
             that.$('.js-pagination').pagination({
                 records: 100
             });
		}
	});
    return pageView;
});
