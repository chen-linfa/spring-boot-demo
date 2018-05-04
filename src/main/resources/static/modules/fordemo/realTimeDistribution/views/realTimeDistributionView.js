define(['hbs!modules/fordemo/realTimeDistribution/templates/realTimeDistribution.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
               
		}
	});
    return pageView;
});
