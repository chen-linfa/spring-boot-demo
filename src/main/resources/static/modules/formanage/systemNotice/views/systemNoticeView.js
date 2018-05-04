define(['hbs!../templates/system-notice.html'],function(temp){
	var views = fish.View.extend({
		template: temp,
		// el: false,
		afterRender: function(){
			var that = this;
			
		}
	});
	return views;
});