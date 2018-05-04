define(['hbs!../templates/client-info-menber.html'],function(temp){
	var views = fish.View.extend({
		template: temp,
		// el: false,
		afterRender: function(){
			var that = this;
			this.$('.js-combobox').combobox({
				 placeholder:"请选择"
			});
			this.$('.js-pagination').pagination({
					 records: 100
				});
			this.$('.js-popover').popover({
				html:true,
			    placement: 'bottom',
			    content: that.$('.js-popover-content').html()
			});
			this.$('input[type="checkbox"]').icheck();
			this.$('.js-datetimepicker').datetimepicker();
			
		}
	});
	return views;
});