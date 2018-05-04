define(["hbs!../templates/changepwdpop.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            
            that.$("input[name=password]").on("input",function(){
            	var strength = fish.utils.checkPasswdStrength($(this).val());
            	if(strength <3){
            		//弱
            		that.$("#strength_text").text("弱");
            		that.$(".active-low").show();
            		that.$(".active-middle").hide();
            		that.$(".active-high").hide();
            	}else if(strength == 3){
            		//中
            		that.$("#strength_text").text("中");
            		that.$(".active-low").show();
            		that.$(".active-middle").show();
            	}else{
            		//强
            		that.$("#strength_text").text("强");
            		that.$(".active-low").show();
            		that.$(".active-middle").show();
            		that.$(".active-high").show();
            	}
            });
            
            that.$("#btn_submit").click(function(){
            	var param = that.$("form").form("value");
            	if(that.vaildData(param)){
	            	param.old_password = $.base64.encode(param.old_password);
					param.password = $.base64.encode(param.password);
					fish.callService("SPUserController", "updatePassWord", param, function(data){
						if(data.result.res_code == "01"){
							layer.alert("修改密码成功！");
							that.popup.close();
						}else{
							layer.alert(data.result.alert_msg);
						}
					});
            	}
            });
        },
        onClosePupup: function () {
            this.popup.close();
        },
        vaildData:function(data){
        	var result = true;
			
			if(!data.old_password){
				layer.alert("原密码不能为空");
				return false;
			}
			
			if(!data.password){
				layer.alert("密码为空");
				return false;
			}
				
				if(!data.confirm_pwd){
					layer.alert("确认密码不能为空");
					return false;
				}
				
				if(data.confirm_pwd != data.password ){
					layer.alert("密码不一致");
					return false;
				}
				
			if(fish.utils.checkPasswdStrength(data.password) < 3){
					layer.alert("您输入的密码为弱密码，请您采用至少由8位及以上大小写字母、"
						+ "数字及特殊字符等混合、随机组成（至少包括数字、小写字母、大写字母和特殊符号中的三种）的密码串。");
					return false;
			}

        	return result;
        }

    });

    return components;
});
