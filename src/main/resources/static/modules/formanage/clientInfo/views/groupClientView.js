define([
	'hbs!../templates/group-client.html',
	'./clientInfoView',
	'./clientInfoMenberView',
	'./clientInfoProvideOrderView'	
	],function(temp,Info,Menber,ProvideOrder){
	var views = fish.View.extend({
		template: temp,
		// el: false,
		initialize: function(){
			var menber = new Menber();
			var provideOrder= new ProvideOrder();
			var info= new Info();
			this.setView('.js-client',info);
			this.setView('.js-client-menber',menber);
			this.setView('.js-provide-order',provideOrder);

		},
		afterRender: function(){
			this.$('.js-tabs').tabs();
		}
	});
	return views;
});