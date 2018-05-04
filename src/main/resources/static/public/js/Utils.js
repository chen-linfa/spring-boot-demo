/**
 * 前台工具
 */
var Utils = {
	getLoginUser: function(callback){
		Invoker.sync("UserLoginController", "getLoginUser", {}, function(data){
			if(typeof(callback) === "function"){
				callback(data);
			}
		});
	},
	getContextPath: function(){
		var pathname = document.location.pathname;
		var index = pathname.substr(1).indexOf("/");
		var context_path = "";
		
		if(index !== -1){
			context_path = pathname.substr(0, index + 1);
		}
		
		if(context_path && context_path.substr(0, 1) != "/"){
			context_path = "/" + context_path;
		}
		
		return context_path;
	},
	getScript: function(url, success, error){
		//同步取javascript
		jQuery.ajax({
			url: url,
			async: false,
			cache: true,
			dataType: "script",
			success: success,
			error: error
		});
	},
	createInst: function(class_name, param){
		if(param){
			return (new Function("return new " + class_name + "(arguments[0]);")(param));
		}
		else{
			return (new Function("return new " + class_name + "();")());
		}
	},
	supportPjax: function(){
		return window.history && window.history.pushState && window.history.replaceState &&
			!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/);
	},
	pjax: function(a, callback){
		if(Utils.supportPjax()){
			//不刷新页面改变url
			window.history.pushState(null, "", $(a).attr("href"));
			if(typeof(callback) === "function"){
				callback();
			}
			return false;//不触发href
		}
		
		return true;
	},
	alert: function(message, arg1, arg2,arg3){
		try{
			if(layer && layer.alert){
				message = message.replace(/\n/g, "<br>");//回车
				var timeout = typeof(arg1) === "number" ? arg1 : 0;
				var callback = $.isFunction(arg1) ? arg1 : arg2;
				
				var cancelfunc = $.isFunction(arg3) ? arg3 : null;
				layer.alert(message, {
					skin: "layui-layer-lan",
					time: timeout,
					yes: function(index, layero){
						if($.isFunction(callback)){
							callback();
						}
						layer.close(index);
					},
					cancel : cancelfunc
					}
				);
				
				return;
			}
		}
		catch(e){}
		
		message = message.replace(/<br>|<\/br>/g, "\n");//回车
		alert(message);
	},
	/**
	 * 确认信息 options：{title: "标题", yes: "确定按钮事件", cancel: "取消按钮事件"}
	 */
	confirm: function(message, options){
		var defaults = {title: "信息"};
		options = $.extend({}, defaults, options);
		message = message.replace(/<br>|<\/br>/g, "\n");//回车
		layer.confirm(message, {title: options.title}, function(index){
			if($.isFunction(options.yes)){
				options.yes();
			}
			layer.close(index);
		}, function(index){
			if($.isFunction(options.cancel)){
				options.cancel();
			}
		});
	},
	/**
     * Layer弹出层
     * 
     * @param title - 标题
     * @param pageUrl - 页面的URL
     * @param endFun - 关闭页面之后执行的方法
     */
    layerOpen : function(title, pageUrl, endFun,height,width) {
        var me = this;
        
        height = height || "540"; //默认高度,宽带
        width = width || "992";
        
        layer.open({
            type : 2,
            title : title,
            // skin : "layui-layer-molv",
            fix : false,
            maxmin : true,
            area : [ width+"px", height+"px" ],
            content : me.getContextPath() + pageUrl,
            end : function() {
                if (null == endFun || undefined == endFun
                        || typeof (endFun) != "function")
                    return;
                endFun.apply(this);
            }
        });
    },
    /**
     * 关闭弹出层
     */
    layerClose : function() {
        // 获取窗口索引
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    },
    /**加载iframe，加载完毕触发callback
	 * frm 可以是iframe的id，也可以可以iframe的jquery对象，也可以是iframe的dom对象
	 * src iframe的url
	 * callback 加载完毕回调函数
	 */
	loadFrame: function(frm, src, callback){
		if(typeof(frm) === "string"){
			frm = $("#" + frm).get(0);
		}
		
		if(frm && frm.size &&  frm.size() > 0){
			frm = frm.get(0);
		}
		
		if(frm){
			frm.onload = frm.onreadystatechange = function(){
				if(this.readyState && this.readyState != "complete"){
					return;
				}
				else{
					if($.isFunction(callback)){
						callback.call(frm);
					}
				}
			};
			
			$(frm).attr("src", src);
		}
	},
	/**刷新iframe的高度
	 * frm 可以是iframe的id，也可以可以iframe的jquery对象，也可以是iframe的dom对象
	 */
	refreshFrameHeight: function(frm, height){
		if(typeof(frm) === "string"){
			frm = $("#" + frm).get(0);
		}
		
		if(frm && frm.size &&  frm.size() > 0){
			frm = frm.get(0);
		}
		
		if(frm && frm.contentDocument){
			if(!height){
				height = frm.contentDocument.body.scrollHeight;
			}
			
			frm.height = height;
		}
	},
	//初始化下拉框
	initSelect: function(sel, params, blankVal, blankName, defaultVal){
		Invoker.async("CacheController", "getAttrOrSubAttr", params, function(data){
			data = data || [];
			var html = [];
			var selVal = sel.val();
			if(blankVal != undefined && blankName != undefined){
				html.push("<option value='" + blankVal + "'>" + blankName + "</option>");
			}
			
			$.each(data, function(i, attrValue){
				html.push("<option value='" + attrValue.attr_value + "'>" + attrValue.attr_value_name + "</option>");
			});
			sel.html(html.join(""));
			if(defaultVal){
				sel.val(defaultVal);
			}
		}, false);
	},
	/**邮箱校验**/
	isEmail: function(email){
		var isEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if(isEmail.test(email)){
			return true;
		}
		return false;
	},
	/**校验身份证**/
	checkIdCard: function(id_card){
		var isIdCard = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
		if(isIdCard.test(id_card)){
			return true;
		}
		return false;
	},
	checkPhoneNumber: function(phoneNumber){
		var reg  = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if(reg.test(phoneNumber)){
			return true;
		}
		return false;
	},
	getUrlParams: function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r!=null) {
			return unescape(r[2]);
		} 
		return null; //返回参数值
	},
	load: function(div, url, params, callback){
		if (!callback){
			callback = function(response,status,xhr){
				if (xhr.status == 666)
				{
					Utils.alert("该功能只对注册用户开放，请登录后再尝试访问！", function(){window.location.href = "login.html";}, null, function(){});
				}
			};
		}
		$(div).load(url, params, callback);
	},
	/**
	 * iframe弹出框(适用弹出选择页面)
	 * url：iframe地址
	 * options：{title: "标题", width: "宽度", height: "高度", autoClose: "点击确定是否自动关闭", yes: "确定按钮方法，iframe中callback方法返回值做为参数", cancel: "取消按钮方法", success: "层弹出后的成功回调方法", end: "层销毁后触发的回调"}
	 */
	openDialog: function(url, options){
		var defaults = {title: "信息", width: "700px", height: "500px", autoClose: true};
		options = $.extend({}, defaults, options);
		
		var settings = {
			type: 2,
			content: url,
			title: options.title,
			area: [options.width, options.height]
		};
		
		var btn = [];
		if($.isFunction(options.yes)){
			btn.push("确定");
			settings.yes = function(index, layero){
				var frame_id = layero.find("iframe").attr("id");
				var frm = window.frames[frame_id];
				//调用iframe中的callback方法获取数据并做为yes方法的参数
				if(frm && $.isFunction(frm.callback)){
					var data = frm.callback(index);
					options.yes(data, index);
				}
				
				if(options.autoClose){
					layer.close(index);
				}
			};
		}
		
		if($.isFunction(options.cancel)){
			btn.push("取消");
			settings.cancel = function(index){
				options.cancel();
			};
		}
		
		if($.isFunction(options.success)){
			settings.success = options.success;
		}
		
		if($.isFunction(options.end)){
			settings.end = options.end;
		}
		
		if(btn.length > 0){
			settings.btn = btn;
		}
		
		layer.open(settings);
	},
	/**
	 * 弹出框
	 * content：可以是html内容，也可以是dom(如：$("#id"))对象
	 * options：{title: "标题", width: "宽度", height: "高度", autoClose: "点击确定是否自动关闭", yes: "确定按钮方法", cancel: "取消按钮方法", success: "层弹出后的成功回调方法"}
	 */
	showDialog: function(content, options){
		var defaults = {title: "信息", width: "700px", height: "500px", autoClose: true};
		options = $.extend({}, defaults, options);
		
		var settings = {
			type: 1,
			content: content,
			title: options.title,
			area: [options.width, options.height]
		};
		
		var btn = [];
		if($.isFunction(options.yes)){
			btn.push("确定");
			settings.yes = function(index, layero){
				options.yes(index, layero);
				
				if(options.autoClose){
					layer.close(index);
				}
			};
		}
		
		if($.isFunction(options.cancel)){
			btn.push("取消");
			settings.cancel = function(index){
				options.cancel();
			};
		}
		
		if($.isFunction(options.success)){
			settings.success = function(layero, index){
				options.success(layero, index);
			};
		}
		
		if(btn.length > 0){
			settings.btn = btn;
		}
		
		layer.open(settings);
	},
	/**获取本地缓存*/
	getItem: function(key){
		if(window.localStorage){
			var value = window.localStorage.getItem(key);
			if(value != null){
				try{
					value = $.parseJSON(value);
				}
				catch(e){
					
				}
			}
			return value;
		}
		
		return null;
	},
	/**添加本地缓存*/
	setItem: function(key, value){
		if(window.localStorage){
			if(typeof(value) !== "string"){
				value = JSON.stringify(value);
			}
			window.localStorage.setItem(key, value);
		}
	},
	/**删除本地缓存*/
	removeItem: function(key){
		if(window.localStorage){
			window.localStorage.removeItem(key);
		}
	},
	/**清空本地缓存*/
	clear: function(){
		if(window.localStorage){
			window.localStorage.clear();
		}
	},
	/**校验密码复杂度**/
	checkPasswdStrength : function(passWord){
		var me = this;
		Modes = 0;
		for(var i = 0; i < passWord.length; i++) {
		    //测试每一个字符的类别并统计一共有多少种模式.
		    Modes |= me.CharMode(passWord.charCodeAt(i));
		}
		return me.bitTotal(Modes);
	},
	
	//测试某个字符是属于哪一类
	CharMode : function(iN){
	   if(iN>=48 && iN <=57){
		   return 1; //数字
	   }else if(iN>=65 && iN <=90){
		   return 2; //大写字母
	   }else if(iN>=97 && iN <=122){
		   return 4; //小写
	   }else{
		   return 8; //特殊字符
	   }
	},

	//计算出当前密码当中一共有多少种模式
	bitTotal : function(num){
	   var modes=0;
	   for(var i=0; i<4; i++){
		   if((num & 1) > 0){
			   modes++; 
		   }
		   num>>>=1;
	   }
	   return modes;
	}
};
