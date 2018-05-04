define(["hbs!modules/clientSelfService/messageGatewayConfigure/templates/add-popup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{

        },
        afterRender: function() {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                         - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            
            
            that.$("#btn_submit").click(function(){
            	that.addGateway();
            });
        },
        onClosePupup: function(){
        	this.popup.close();
        },
        //提交
        addGateway:function(){
			var that = this;
			var param = that.$("form").form("value");
        	//必填及格式检查
        	if(!that.vaildate(param)){
        		return;
        	}
        	
        	//第一步：判断网关是否已被使用
        	fish.callService("SmsController","qryGatewayByPort",param,function(reply){
				if(reply && reply.res_code == "00000"){
					if(reply.result == "true"){
						//已被使用
						layer.alert("该网关已被使用，不能重复配置!");
						return;
					}
				}
				
				//第二步：验证测试MSISDN是否有操作权限
				fish.callService("SmsController","qryCustMsisdn",param,function(data){
					if(data && data.res_code == "00000"){
						var msisdn_count = data.result;
						var num=new Number(msisdn_count);
						param.receive_msisdn = param.msisdn;
						that.evaluateGateway(param);
						/*if(num>0){
							//有权限
							that.evaluateGateway(param);
						}else{
							layer.alert("您没有该成员卡号的操作权限，请重新输入!");
						}*/
					}
				});
        	});
        },
        evaluateGateway:function(param){
        	var that = this;
        	fish.callService("SmsController","evaluateGatewayValidate",param,function(reply){
				if(reply.res_code == "00000")
				{
					that.addSmsGateway(param);
				}else{
					layer.alert("测试发送失败，请检查你的网关配置是否正确!");
				}
			});
        },
        addSmsGateway:function(param){
        	var that = this;
        	fish.callService("SmsController","smsGatewayAdd",param,function(result){
				if(result){
	        		if(result.res_code == "00000"){
						layer.alert("新增成功！");
						that.popup.close();
						
					}else if(result.res_code == "70004"){
						layer.alert("短信接入码已存在，不能重复配置！");
					}else if(result.res_code == "70005"){
						layer.alert("短信网关建立链接发生异常，请检查网关配置是否正确！");
					}else{
						layer.alert(result.result);
					}
				}
			});
        },
        vaildate:function(data){
			var regmatch;
        	if(!data.gateway_port){
        		layer.alert("请填写短信接入码！");
        		return false;
        	}else{
        		//正则判断：全为数字
        		if(!(/^[0-9]*$/g).test(data.gateway_port)){
        			layer.alert("短信接入码不符合格式，请重新填写!");
        			return false;
        		}
        	}
        	if(!data.company_code){
        		layer.alert("请填写企业代码！");
        		return false;
        	}
        	
        	if(!data.login_secret){
        		layer.alert("请填写业务网关登陆密码，示例：0914xx!");
        		return false;
        	}else{
        		if(!(/^\w{4,20}$/).test(data.login_secret)){
        			layer.alert("业务网关登陆密码不符合格式，请重新填写!");
        			return false;
        		}
        	}
        	
        	if(!data.server_code){
        		layer.alert("请填写服务代码，示例：szxx!");
        		return false;
        	}
        	
        	if(!data.msisdn){
        		layer.alert("请填写测试用MSISDN!");
        		return false;
        	}
        	
        	return true;
        }
    });

    return components;
});
