define(["hbs!../templates/NewAccount.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            fish.callService("CustHomePageController", "queryCustInfoForHome", {}, function(result){
            	var cust = result.result.cust;
                if(cust){
                	that.$("input[name=user_name]").val(cust.cust_code);
                	that.cust_code = cust.cust_code;
                }
            });
            
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
            		fish.callService("SPUserController", "checkChildSPUserName", param, function(data){
						if(data.res_code == "00000"){
							var is_exists = data.result;
							if(is_exists){
								layer.alert("操作失败，账号名称已被使用，请重新输入账号");
							}else{
								param.password = $.base64.encode(param.password);
								fish.callService("SPUserController", "AddChildSPUser", param, function(data){
									if(data.res_code == "00000"){
										layer.alert("添加成功，新增的子账号只有配置了菜单权限、成员群组权限才能正常使用！");
										that.popup.close();
										that.parentView.queryChildUser();
									}else if(data.res_code == 40000){
										layer.alert(data.res_message);
									}else {
										layer.alert("添加失败，请重试");
									}
								});
							}
						}else {
							layer.alert("添加失败，请重试");
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
			if(!data.user_name){
				layer.alert("用户名不能为空");
				return false;
			}
			
			if(!data.chinese_name){
				layer.alert("姓名不能为空");
				return false;
			}
			
			if(!data.mobile_phone){
				layer.alert("手机号码不能为空");
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
			
			if(data.mobile_phone){
				if(!fish.utils.checkPhoneNumber(data.mobile_phone)){
					layer.alert("手机号码格式错误");
					return false;
				}
			}
			
			if(data.email){
				if(!fish.utils.isEmail(data.email)){
					layer.alert("邮箱格式错误");
					return false;
				}
			}
        	return result;
        }

    });

    return components;
});
