define(['hbs!modules/login/templates/login.html','css!modules/login/CSS/style.css'],function(temp,style) {
    var loginView = fish.View.extend({
        el:false,
        template: temp,
        afterRender: function(){
        	var that = this;
        	var verifyCorrectCode = 0;
        	//左上滚动消息
        	$.fn.myScroll = function(options){
				//默认配置
				var defaults = {
					speed:40,  //滚动速度,值越大速度越慢
					rowHeight:24 //每行的高度
				};
				
				var opts = $.extend({}, defaults, options),intId = [];
				
				function marquee(obj, step){
					obj.find("ul").animate({
						marginTop: '-=1'
					},0,function(){
						var s = Math.abs(parseInt($(this).css("margin-top")));
						if(s >= step){
							$(this).find("li").slice(0, 1).appendTo($(this));
							$(this).css("margin-top", 0);
						}
					});
				}
					
				this.each(function(i){
					var sh = opts["rowHeight"],speed = opts["speed"],_this = $(this);
					intId[i] = setInterval(function(){
						if(_this.find("ul").height()<=_this.height()){
							clearInterval(intId[i]);
						}else{
							marquee(_this, sh);
						}
					}, speed);

					_this.hover(function(){
						clearInterval(intId[i]);
					},function(){
						intId[i] = setInterval(function(){
							if(_this.find("ul").height()<=_this.height()){
								clearInterval(intId[i]);
							}else{
								marquee(_this, sh);
							}
						}, speed);
					});
				
				});
			}
			this.$("#iot_notice_ul").empty();
			/*fish.callService("SPUserController", "queryIotNoticeList", {}, function(result) {
				var res_code = result.res_code;
				var data = result.result;
				if(res_code == '00000' && data != ''){
				    for(var i=0; i<data.length; i++){
				    	var title = data[i].notice_title;
				    	if(title.length > 54){
				    		title = title.substring(0, 53) + "..."; 
				    	}
				    	var li_template = '<li class="notice-item"><p>'+
						'<a href="javascript:void(0);" class="a_blue" '+
				    	'title='+data[i].notice_title+'>'+
						title+'</a><span>'+data[i].create_date+'</span></p></li>';
				    	that.$("#iot_notice_ul").append(li_template);
				    }
				    that.$("div.notice-list").myScroll({speed:70, rowHeight:30});
				}
			});*/
			that.init();
		},
		init : function() {

			var me = this;
			var that = this;
			
			this.$("#btn_login").click(function() {
				me.login();
			});

			// 换一张验证码
			this.$("#changeCode").click(function() {
				// me.reloadVerifyCode();
			});

			// 获取验证码
			this.$("#getCode").click(function() {
				// 先验证用户名密码
				if (!me.checkUser()) {
					return;
				}
				// 存在正确再发送短信验证码
				me.sendCode();
			});

			that.$("#btn_query_flow").click(function() {
				that.$("#sploginModal").modal('show');
			});

			// 键盘事件Enter登录
			$(window).keydown(function(e) {
				if (e.keyCode == "13") {
					that.$("#btn_login").focus().click();
				}
			});

		},
		layerOpen : function(title, pageUrl, endFun,height,width) {
	        var me = this;
	        height = height || "450"; //默认高度,宽带
	        width = width || "520";
	        
	        layer.open({
	            type : 2,
	            title : title,
	            // skin : "layui-layer-molv",
	            fix : false,
	            maxmin : true,
	            area : [ width+"px", height+"px" ],
	            content :  pageUrl,
	            end : function() {
	                if (null == endFun || undefined == endFun
	                        || typeof (endFun) != "function")
	                    return;
	                endFun.apply(this);
	            }
	        });
	    },

		 /** 登录校验 */
		check : function() {
			var that = this;
			var flag = true;
			var user_name = $.trim(that.$("#user_name").val());
			var password = $.trim(that.$("#password").val());
			var verifyCode = $.trim(that.$("#verifyCode").val());
			// var verification_code = $.trim($("#verification_code").val());

			if (!user_name) {
				this.$("#user_name").tooltip({
										placement:"left",
										title:"用户名或手机号码不能为空"
									});
				this.$("#user_name").tooltip("show");
				flag = false;
			} else {
				var reg = /^[0-9a-zA-Z_]*$/g;
				if (!reg.test(user_name)) {
					this.$("#user_name").tooltip({
										placement:"left",
										title:"用户名或手机号码只能由数字、字母、下划线组合成，请确认"
									});
					this.$("#user_name").tooltip("show");
					flag = false;
				}
			}

			if (!password) {
				that.$("#password").tooltip({
										placement:"left",
										title:"密码不能为空"
									});
				that.$("#password").tooltip("show");
				flag = false;
			}
			return flag;
		},
		/** 用户名校验* */
		checkUser : function() {
			var that = this;
			var flag = true;
			var user_name = $.trim(that.$("#user_name").val());
			// var password = $.trim($("#password").val());
			if (!user_name) {
				that.$("#user_name").tooltip({
										placement:"left",
										title:"用户名不能为空"
									});
				that.$("#user_name").tooltip("show");
				flag = false;
			} else {
				var reg = /^[0-9a-zA-Z_]*$/g;
				if (!reg.test(user_name)) {
					that.$("#user_name").tooltip({
										placement:"left",
										title:"用户名或手机号码只能由数字、字母、下划线组合成，请确认"
									});
					that.$("#user_name").tooltip("show");
					flag = false;
				}
			}
			return flag;
		},
		/** 登录 */
		login : function() {
			var me = this;
			var that = this;
			if (!me.check())
				return;

			var user_name = $.trim(that.$("#user_name").val());
			var password = $.trim(that.$("#password").val());
			var verification_code = $.trim(that.$("#verifyCode").val());

			// base64加密
			// alert($.base64.encode(user_name));
			// alert($.base64.encode(password));
			var params = {};
			/*
			 * params.user_name = user_name; params.password=password;
			 */

			params.user_name = user_name;
			params.password = fish.Base64.encode(password);

			// params.password = md5(password).toUpperCase();
			params.verification_code = verification_code;
			fish.callService("SPUserController", "spUserLogin", params, function(
					result) {
				var res_code = result.res_code;
				var res_message = result.res_message;
				if (res_code == "00000") {
					var is_need_pwd_notice = result.result.is_need_pwd_notice;
					checked = true;
					if(is_need_pwd_notice == true){
						fish.warn("尊敬的客户，您的密码已超过90天未更新，为了保障信息安全，请您及时更新密码。", 
						function(){
							portal.appGlobal.set("currentStatus", "running");
						});
					}else{
						portal.appGlobal.set("currentStatus", "running");
					}
				} else {
					if (res_code == "40011" || res_code == "40012" || res_code == "40020" || res_code == "40021") {
						// 验证码提示信息
						
						this.$("#verifyCode").tooltip({
										placement:"left",
										title:res_message
									});
						this.$("#verifyCode").tooltip("show");

						// splogin.reloadVerifyCode();
						return;
					}

					if (res_code == "40013" || res_code == "40014"
							|| res_code == "40004" || res_code == "40018") {
						// 用户名提示信息
						this.$("#user_name").tooltip({
										placement:"left",
										title:res_message
									});
						this.$("#user_name").tooltip("show");
						// splogin.reloadVerifyCode();
						return;
					}

					if (res_code == "40015" || res_code == "40016") {
						// 密码提示信息
						this.$("#password").tooltip({
										placement:"left",
										title:res_message
									});
						this.$("#3595CC").tooltip("show");
						
						// splogin.reloadVerifyCode();
						return;
					}

					if (res_code == "40022" || res_code == "40023") {
						layer.alert(res_message);
						return;
					}
					if (res_code == "40024" ) {
						layer.alert(res_message);
						return;
					}
				}
			});
		},
		/** 根据用户名的手机号送短信验证码 */
		sendCode : function() {
			var that = this;
			if (!that.checkUser())
				return;
			// 计时器
			var clock = '';
			var nums = 120;
			var dConeJq = that.$("#getCode");

			var user_name = $.trim(that.$("#user_name").val());

			var params = {};
			params.user_name = user_name;
			fish.callService("SPUserController", "querySPUserNumAndSendCode", params,
					function(result) {
						var res_code = result.res_code;
						var res_message = result.res_message;

						if (1 == 1) {/* res_code == "00000" */
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

							layer.alert("短信验证码已发送至您的手机号!");
						} else {

							if (res_code == "40013" || res_code == "40014"
									|| res_code == "40004" || res_code == "40018") {
								// 用户名提示信息
							this.$("#user_name").tooltip({
										placement:"left",
										title:res_message
									});
							this.$("#user_name").tooltip("show");
								return;
							}

							// if(res_code == "40015" || res_code == "40016"){
							// //密码提示信息
							// layer.tips(res_message, "#password", {tips: [4,
							// "#3595CC"], tipsMore: true});
							//					return;
							//				}
						}
					});
		}
	});

    return loginView;
});
