define(['hbs!modules/fordemo/404/templates/404.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
               
		}
	});
    return pageView;
});
