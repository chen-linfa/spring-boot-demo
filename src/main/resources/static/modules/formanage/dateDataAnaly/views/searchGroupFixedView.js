define(['hbs!../templates/search-group-fixed.html'],function(temp){
	var views = fish.View.extend({
		template: temp,
		afterRender:function(){

		}
	});
	return views;
});