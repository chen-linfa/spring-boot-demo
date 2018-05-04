define(['hbs!modules/fordemo/login/templates/login.html'],function(temp) {
    var loginView = fish.View.extend({
        el:false,
        template: temp,
	    events:{
	    	"click .js-login":"onLogin"
        },

        afterRender: function(){

		},
		onLogin: function(){
			 var status = "running";
	         portal.appGlobal.set("currentStatus", status);
		}

	});

    return loginView;
});
