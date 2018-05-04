define(["hbs!modules/clientSelfService/messagePortSwitch/templates/switch-popup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
        	//"click .js-close-popup": "onClosePupup",
            //"click .add_app_btn" : "onSubmit",
            "click .cancel_btn" : "onClosePupup"
        },
        init:function(status){
            var myStatus = (status==0)?"确定打开？":"确定关闭？";
            this.$('#switch_query').html(myStatus);
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
        //确定
        onConfirm:function(id,  port_status){
            var that = this;
            that.init(port_status);
            var params = {};
            params.gateway_id = id;
            if(port_status == 0){
                params.port_status = 1;
            }else if(port_status == 1){
                params.port_status = 0;
            }
                    console.log("当前状态 ",port_status);
            this.$('.confirm_btn').click(function(){
                //;
                console.log("id ",id);
                //var result = false;
                fish.callService("SmsController","resetSmsPortStatus",params,function(reply){
                    var status = port_status
                    if(reply.res_code == "00000")
                    {
                    	layer.alert("操作成功");
                    }else{
                    	layer.alert(reply.result);
                    }
                    that.parentView.doQuery();
                });
                that.popup.close();
            });

        }
    });

    return components;
});
