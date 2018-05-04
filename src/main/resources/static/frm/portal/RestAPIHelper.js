define(function() {
	
	//表格导出，附近下载统一方法
	fish.getFile  = function(params,web_root,url){
		if(!url)  url = web_root + "/HttpRequestController/exportExcel.do";
		
    	var $form = $("<form id='fileform' method = 'post' action="+url+"><input type='hidden' name='ids' value=" + JSON.stringify(params) + "></form>").hide();
        $("body").append($form);
        $form.submit();
        $form.remove();
    };
    
    var _badRequestHandler = function(status, action, method){
		layer.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：请求的服务不存在", 5000);
	};
	
	var _forbiddenHandler = function(status, action, method){
		layer.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：请求被禁止", 5000);
	};
	
	var _notFoundHandler = function(status, action, method){
		layer.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：请求的资源不可用", 5000);
	};
	
	var _serverErrorHandler = function(XMLHttpRequest){
		var response_text = XMLHttpRequest.responseText;
		if(response_text){
			response_text = response_text.replace(/\n/g, "\\n");//回车
			response_text = response_text.replace(/\r/g, "\\r");//换行
			response_text = response_text.replace(/\t/g, "\\t");//水平制表符
			var index = response_text.lastIndexOf("}");
			if(index != response_text.length -1){
				response_text = response_text.substring(0, index + 1);
			}
		}
	
		if(jQuery.isEmptyObject(response_text) || "" == response_text){
			layer.alert("非常抱歉，服务器目前不可用，请您稍候重试", 5000);
			return;
		}
		
		try{
			var response = jQuery.parseJSON(response_text);
			fish.info(response.message);
		}
		catch(e){
			alert(response_text);
		}
	};
	
	var _serviceUnavailableHandler = function(status, action, method){
		layer.alert("状态码：" + status + "\n服务：" + action + "." + method + "\n信息：服务器不可用");
	};
	
	var _loginTimeoutHandler = function(status, action, method){
		layer.alert("登录超时，请重新登录系统", function(){
			//返回首页。因为我们是SPA应用，所以直接刷新当前页面即可
			window.location.reload();
		});
	};
    
	var callService = function (type, url, data, success,webroot,extobj,errorfunc){
		var option = {};
		if(fish.isObject(url)){//处理第一个参数是option的场景
			option = url;
			url = option.url;
			data = option.data;
			success = option.success;
			webroot = option.webroot;
		} else {
			if(fish.isFunction(data)){//第一个参数是url,第二个参数是回调函数,没有参数
				webroot = success;
				success = data;
				data = null;
			}
		}

		var url = (webroot ? webroot:"") + (fish.restPrefix ? fish.restPrefix + "/" :"") + url ;

		if(url.indexOf(".do")>-1){
			url = url.replace(".do", "");
		}

		if(data){
			if(type !== "GET"){
				if(fish.isEmpty(data) ) {
					if(fish.isArray(data)){
						data = "[]";
					} else {
						data = "{}";
					}
				} else {
					data = JSON.stringify(data);
				}
			}
		} else {
			data = null;
		}
		var layer_index;
		if(layer){
			layer_index = layer.load(1);
		}
		var ajaxOption = {
			type : type,
			url : url,
			data: data,
			success : function(re){
				if(layer){
					layer.close(layer_index);
				}
				success && success(re);
			},
			showError :false,
			error : function(xhr, status, error) {
				//$.unblockUI();//出现异常的话先释放遮罩
				if(layer){
					layer.close(layer_index);
				}
				if($.isFunction(errorfunc)){
					errorfunc(xhr, status, error);
					return;
				}

				var status = xhr.status;
				var action = extobj?extobj.action:"";
				var method = extobj?extobj.method:"";
				switch(status){
					case 400 :
						_badRequestHandler(status, action, method);
						break;
					case 403 :
						_forbiddenHandler(status, action, method);
						break;
					case 404 :
						_notFoundHandler(status, action, method);
						break;
					case 500 :
						_serverErrorHandler(XMLHttpRequest);
						break;
					case 503 :
						_serviceUnavailableHandler(status, action, method);
						break;
					case 999:
						_loginTimeoutHandler();
						break;
					default :
						_serviceUnavailableHandler(status, action, method);
				}
                
				if (xhr.responseText) {
                    console.error(xhr.responseText);
	            }
            },
			//#72 先暂停跨域请求，IE8，IE9有问题
			crossDomain : false,
			xhrFields : {
				withCredentials : true
			},
			cache : false
		}
		$.extend(true,ajaxOption,fish.omit(option, 'url', 'data'));

		if(type !== "GET") {
			ajaxOption.contentType  = 'application/json';
			ajaxOption.processData = false;
		}


		return fish.ajax(ajaxOption);
	};

	/**
	 * GET /collection：返回资源对象的列表（数组）
	 * GET /collection/{id}：返回单个资源对象
	 * POST /collection：返回新生成的资源对象
	 * PUT /collection： 修改完整的资源对象
	 * PATCH /collection/{id}：修改资源对象的部分属性
	 * DELETE /collection/{id}：删除资源对象
	 **/


	fish.get = function(url, data, success, webroot) {
		return callService("GET",url, data, success, webroot);
	};

	fish.post = function(url, data, success, webroot) {
		return callService("POST",url, data, success, webroot);
	};

	fish.put = function(url, data, success, webroot) {
		return callService("PUT",url, data, success, webroot);
	};

	fish.patch = function(url, data, success, webroot) {
		return callService("PATCH",url, data, success, webroot);
	};

	fish.remove = function(url, data, success, webroot) {
		return callService("DELETE",url, data, success, webroot);
	};
	
	fish.callService = function(controller, method, data,success,errorfunc) {
		var url = controller+"/"+method;//".do";
		if(window.portal.localajax) {
			url =  portal.appGlobal.attributes.webroot+"/modules/data/"+controller+"/"+method+".json"
		}
		return callService("POST",url, data, success,"",{action:controller,method:method},errorfunc);
	};

	

});
