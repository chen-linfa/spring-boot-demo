define(["hbs!modules/clientSelfService/messageGatewayConfigure/templates/delete-popup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
        	//"click .js-close-popup": "onClosePupup",
            //"click .add_app_btn" : "onSubmit",
            "click .cancel_btn" : "onClosePupup"
        },
        afterRender: function() {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                         - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            // that.$('.js-combobox').combobox();
        },
        onClosePupup: function(){
        	this.trigger("editview.close");
        	this.popup.close();
        },
        onConfirm:function(id){
            var that = this;
            that.$('.confirm_btn').click(function(){
                var params={};
                params.gateway_id = id;
                //console.log("id\n",id);
                fish.callService("SmsController","deleteGateById",params,function(reply){
                	if(reply.res_code == "00000"){
                        alert("删除成功");
                    }else{
                        alert(reply.res_message);
                    }
                });   
                that.popup.close();  
            });
            
        },
        
    });

    return components;
});
