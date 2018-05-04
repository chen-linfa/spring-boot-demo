define(["hbs!../templates/ChangeAccount.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        loadData:function(data){
        	var that = this;
        	that.$("form").form("value",data);
        },
        afterRender: function () {
            var that = this;
            
            that.$("#btn_confirm").click(function(){
            	var params = that.$("form").form("value");
            	if(!params.mobile_phone){
            		layer.alert("手机号码必填！");
            		return;
            	}
            	if(!params.chinese_name){
            		layer.alert("姓名必填！");
            		return;
            	}
            	fish.callService("SPUserController", "updateChildSPUserByID", params, function(data){
            		if(data.res_code == "00000"){
						that.popup.close();
						layer.alert("修改成功！");
						that.parentView.queryChildUser();
					}else {
						layer.alert("修改失败，请重试");
					}
				});
            });
        },
        onClosePupup: function () {
            this.popup.close();
        }

    });

    return components;
});
