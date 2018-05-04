define(['hbs!../templates/client-info-provide-order.html'],function(temp){
	var views = fish.View.extend({
		template: temp,
		// el: false,
		afterRender: function(){
			this.$('.js-combobox').combobox();
			this.$('.js-datetimepicker').datetimepicker();
		}
	});
	return views;
});