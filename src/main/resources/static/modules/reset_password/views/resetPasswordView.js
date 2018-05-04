/**
 * 重置密码页面
 */
//时间显示
var time = {
	initDate : function() {
		var array = new Array("日", "一", "二", "三", "四", "五", "六");
		var today = new Date();
		$('#today').text((today.getMonth() * 1 + 1) + "月" + today.getDate() + "日");
		$('#this_week').text("星期" + array[today.getDay()]);
		$(".now_date").show();
	}
};

var resetPWD = {
	init : function(){
		var me = this;
		me.initEvent();
		me.initStep("1");
	},
	
	initStep : function(step) {
		$(".reset_step").hide();
		$(".step_" + step).show();
		$(".flow-item-" + i).addClass("active");
		for(var i=1; i<=step; i++){
			$(".flow-item-" + i).addClass("active");
		}
	},
    

	initEvent : function() {
		var me = this;

		$("#code_img").click(function() {
			me.refreshCode();
		});

		$("#refreshCode").click(function() {
			me.refreshCode();
		});
    	

		$("#btn_next").click(function() {
			var validate_code = $("#validate_code").val();
			var validate_user_name = $("#user_name").val();
			if (validate_user_name == "" || validate_user_name == null) {
				var res_message = "用户名不能为空！";
				layer.tips(res_message, "#user_name", {tips : [ 4, "#3595CC" ], tipsMore : true});
				return;
			}
			if (validate_code == "" || validate_code == null) {
				var res_message = "验证码不能为空！";
				layer.tips(res_message, "#validate_code", {tips : [ 4, "#3595CC" ], tipsMore : true});
				me.refreshCode();
			} else {
                $.ajax({
                    type    :   'POST',
                    url     :   '../../../servlet/SecurityCodeServlet',//校验验证码
                    cache   :   false,
                    data    :   {"securityCode":$("#validate_code").val(),"userName":$("#user_name").val()},
                    success :   function(data){
						if (data == "fail") {
							var res_message = "用户名错误！";
							layer.tips(res_message, "#user_name", {tips : [ 4, "#3595CC" ], tipsMore : true});
							me.refreshCode();
							return;
						}
						if (data == '1') {
							me.initStep("2");
						} else {
							var res_message = "验证码错误！";
							layer.tips(res_message, "#validate_code", {tips : [ 4, "#3595CC" ], tipsMore : true
							});
							me.refreshCode();
						}
                    }
                });
            }
        });
    	
    	$("#getCodeAgain").click(function(){
    		// 计时器
			var clock = '';
			var nums = 120;
			var dConeJq = $("#getCodeAgain");
			var params = {};
    		Invoker.async("SPUserController", "querySPUserNumAndSendCode", params, function(result){
    			var res_code = result.res_code;
				if (res_code == "00000") {
					// 动态验证码计时器
					dConeJq.attr('disabled', true);
					clock = setInterval(function doLoop() {
						nums--;
						if (nums > 0) {
							dConeJq.html("重新获取(" + nums + "S)");
						} else {
							clearInterval(clock); // 清除js定时器
							dConeJq.attr('disabled', false);
							dConeJq.html("点击获取");
							nums = 120; // 重置时间
						}
					}, 1000); // 一秒执行一次
					mobile_phone = result.result.mobile_phone;
					$(".reset-psw-info").html("<p>已将短信发送到您的手机：<span class='red'>"
											+ result.result.mobile_phone
											+ "</span></p><p>请查看并输入随机短信密码。</p>");
				}

    		});
        });
    	
    	$("#btn_next2").click(function(){
        	var vali_code = $.trim($("#vali_code").val());
        	if(vali_code == ''){
        		var res_message = "短信验证码不能为空！";
        		layer.tips(res_message, "#vali_code", {tips: [4, "#3595CC"], tipsMore: true});
        		return;
        	}
        	var params = {}; 
        	params.vali_code = vali_code;
        	
        	Invoker.sync("SPUserController", "validateStep1", params, function(result){
        		var res_code = result.res_code;
    			if (res_code == "00000") {
    				 me.initStep("3");
    			} else if (res_code == "40000") {
    				layer.alert("安全认证失败，请您重新操作！", function() {
    					window.location.href="../reset_password/reset-password.html";
    				});
    			} else if (vali_code == ""||vali_code == null) {
                	var res_message = "6位短信验证码不能为空！";
                    layer.tips(res_message, "#vali_code", {tips: [4, "#3595CC"], tipsMore: true});
                } else {
                	var res_message = "6位短信验证码错误！";
                    layer.tips(res_message, "#vali_code", {tips: [4, "#3595CC"], tipsMore: true});      
                }
    		});
        });
    	
    	$("#pwd_lable #password").blur(function(){
    		var password = $("#pwd_lable #password").val();
    		$("#pwd_lable").find("span").css("background","#988A8B");
    		if(password!="" && password!=null){
    			if(password.length<8 || password.length>16){
    				layer.alert("密码格式错误(8~16位)，请重新输入！");
    				return false;
    			}
    			//校验密码复杂度
    			var mode = Utils.checkPasswdStrength(password);
    			if(mode < 3){
    				$("#pwd_lable .weak").addClass("mode").css("background","#f42a38");
    				layer.alert("您输入的密码为弱密码，请您采用至少由8位及以上大小写字母、"
    						+ "数字及特殊字符等混合、随机组成（至少包括数字、小写字母、大写字母和特殊符号中的三种）的密码串。");
    				return false;
    			}else if(mode == 3){
    				$("#pwd_lable .normal").addClass("mode").css("background","#f4a62a");
    			}else if(mode > 3){
    				$("#pwd_lable .strong").addClass("mode").css("background","#06e254");
    			}
    		}
    	});
        
        $("#btn_next3").click(function(){
            var password=$.trim($("#password").val());        
            var sure_password=$.trim($("#sure_password").val());
            if(!me.validate()){
            	return false;
            }
        	//获取用户名和密码
        	var params={};       
    		params.password= $.base64.encode(sure_password);
    		Invoker.sync("SPUserController", "validateStep2", params, function(result){
    			var res_code = result.res_code;
    			var res_msg = result.res_message;
    			if(res_code == "00000"){
    				if (result.result.res_code == "01") {
	                     layer.alert("重置成功！",
	                     function() {
	                    	 history.replaceState(null,null,"/iotportal/login.html");
	                    	 me.initStep("4");
	                    	 layer.closeAll();
	                     });
	                } else {
	                 	var alert_msg = result.result.alert_msg;
	                 	if(alert_msg == undefined){
	                 		alert_msg = res_msg;
	                 	}
	                 	layer.alert(alert_msg);
	                }
    			} else {
    				layer.alert(res_msg);
    			}
    		});
        });
    },
    
    refreshCode : function(){
		$("#code_img").attr({"src":"verificationcode.jsp?time=" + Math.random()});
    },
    
    //正则表达式获取地址栏参数
    GetQueryString : function(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    },
    
    //校验
    validate : function(){
    	var password = $.trim($("#password").val());        
        var sure_password = $.trim($("#sure_password").val());
        if (password == "") {
        	layer.alert("输入密码不能为空！");
        	return false;
        }
        if (sure_password == "") {
            layer.alert("确认密码不能为空！");
        	return false;
        }
      
        if (password != sure_password) {
            layer.alert("确认密码与新密码不一致");
        	return false;
        }
        if(password.length<8 || password.length>16){
			layer.alert("密码格式错误(8~16位)，请重新输入！");
			return false;
		}
		if(fish.utils.checkPasswdStrength(password) < 3){
			layer.alert("您输入的密码为弱密码，请您采用至少由8位及以上大小写字母、"
				+ "数字及特殊字符等混合、随机组成（至少包括数字、小写字母、大写字母和特殊符号中的三种）的密码串。");
			return false;
		} 
        return true;
    }
};

$(function(){
	time.initDate();
	resetPWD.init();
});
