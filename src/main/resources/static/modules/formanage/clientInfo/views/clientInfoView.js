define([
	'hbs!../templates/client-info.html'
	],function(temp){
	var views = fish.View.extend({
		template: temp,
		// el: false,
		afterRender: function(){
		}
	});
	return views;
});