define(['hbs!modules/fordemo/500/templates/500.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
              
		}
	});
    return pageView;
});
