define(function() {
	return {
		/**
		 * [从一个数组中根据对应的selfField和parentField的关系构造出树形结构]
		 * @param  {[Array]} srcData     [数据源，是一个数组]
		 * @param  {[String]} selfField   [数据源中代表当前记录的key]
		 * @param  {[String]} parentField [数据源中代表父元素的key]
		 * @param  {[Object]} topFlag     [数据源中最上层的值（比如最顶部的parentField的值为null，就是表示parentField的值为null的作为根元素）]
		 * @return {[Array]}             [返回一个数组，数组中的每条元素可能有children选项，里面也是数组记录了子数据]
		 */
		getTree: function(srcData, selfField, parentField, topFlag) {
			var tree = new Array();
			if (srcData) {
				var dict = new Array();
				// add  roodnode
				var n = srcData.length;
				for (var i = 0; i < n; i++) {
					var item = srcData[i];
					dict[item[selfField]] = item;
					if (item[parentField] == topFlag || item[parentField] == "") {
						tree[tree.length] = (item); // 添加根节点
					}
				}
				// 由下至上，构造树
				for (var j = 0; j < n; j++) {
					var child = srcData[j];
					if (child[parentField] == topFlag || child[parentField] == "") {
						continue;
					}
					var parent = dict[child[parentField]];
					if (parent) {
						//child.parent = parent;
						if (!parent.children) {
							parent.children = new Array();
						}
						(parent.children)[parent.children.length] = (child);
					}
				}
				return tree;
			}
		},
		filterUpperCaseKey: function(obj) {
			var keys = fish.keys(obj),
				retObj = {};
			fish.forEach(keys, function(key) {
				if (key.toUpperCase() === key) {
					retObj[key] = obj[key];
				}
			});
			return retObj;
		},
		gridIncHeight: function($grid,delta) {
			if ($grid.outerHeight() + delta < 114) {
				$grid.jqGrid("setGridHeight", 114);
			} else {
				$grid.jqGrid("setGridHeight", $grid.outerHeight() + delta);
			}
		},
		incHeight: function($el, delta) {
			$el.height($el.height() + delta);
		},
		getDeltaHeight:function($el){
			return $el.parent().height() - $el.outerHeight(true);
		},
		seekBeforeRemRow: function($grid, rowdata) {
		    var nextrow = this.$tree.jqGrid("getNextSelection", rowdata),
                prevrow = this.$tree.jqGrid("getPrevSelection", rowdata),
                parerow = this.$tree.jqGrid("getNodeParent", rowdata);
		    if (nextrow) {
		        $grid.jqGrid("setSelection", nextrow);
		    } else if (prevrow) {
		        $grid.jqGrid("setSelection", prevrow);
		    } else if (parerow) {
		        $grid.jqGrid("setSelection", parerow);
		    }
		},
		drawViewType: function($view) {
			return $view.hasClass('ui-dialog') ? 'C' : 'M';
		},
		calcPath : function ($el) {
            var path = "",
            	bubbleUp = function ($el) {
                var $parent = $el.parent();
                //IE8不支持localname，改用nodename
                var idx = $parent.children($el[0].nodeName.toLowerCase()).index($el);
                if (path) {
                    path = $el[0].nodeName.toLowerCase() + ":eq(" + idx + ")>" + path;
                } else {
                    path = $el[0].nodeName.toLowerCase() + ":eq(" + idx + ")";
                }
                if (!$parent.hasClass("comprivroot")) {
                    return bubbleUp($parent);
                }
                return $parent;
            },
            	$view = bubbleUp($el),
            	viewType = this.drawViewType($view),
            	compid = (function () {
                var wrapid = "",
                    elemid = "";
                if ($view.parent().hasClass("ui-tabs-panel")) {
                    wrapid = $view.parent().attr("id");
                }
                if ($el.data("priv")) {
                    elemid = $el.data("priv");
                } else if ($el.attr("id")) {
                    elemid = $el.attr("id");
                } else if ($el.attr("name")) {
                    elemid = $el.attr("name");
                }
                return wrapid + "." + elemid;
            })(),
            	menuObj = portal.appGlobal.get("currentMenu");
            return {
                path: viewType + "/" + compid + "/>" + path,
                menuId: menuObj.menuId,
                menuUrl: menuObj.menuUrl
            };
        },
        extractUrlParam: function (url) {
            var compArr = url.split("?"),
                paramStr = null,
                paramObj = {};
            if (compArr.length > 1) {
                paramStr = compArr[1];
                var paramArr = paramStr.split('&');
                fish.forEach(paramArr, function (item) {
                    var pair = item.split('=');
                    if (pair.length >= 2) {
                        paramObj[pair[0]] = pair[1];
                    }
                });
            }
            return {
            	url:compArr[0],
            	params:paramObj,
            	paramStr : paramStr
            };
        },
        isFullscreenMode: function () {
            // we drop part of the criteria for fullscrenn mode identification
            // document.body.clientWidth == screen.width
            //不同浏览器screen.height是一样的，但是document.body.clientHeight取值不一样，会与screen.height相等或者比其少1px左右。
            return document.body.clientHeight <= screen.height && document.body.clientHeight > screen.height - 5;
        },
        getAttrCode:function(code,callback){
        	fish._codecache = fish._codecache || {};
        	var need_request = false;
        	if(typeof code == "string"){
        		if(!fish._codecache[code]){
	        		need_request = true;
	        		fish.callService("CacheController", "getMultiAttrValues",[code],function(data){
	    				for(var _temp_code in data)
						{
							var _temp_code_list = data[_temp_code];
							if ($.isArray(_temp_code_list))
							{
								fish._codecache[_temp_code] = {};
								for(var i=0;i<_temp_code_list.length;i++)
								{
									var _list_inst = _temp_code_list[i];
									fish._codecache[_temp_code][_list_inst.attr_value] = _list_inst.attr_value_desc;
								}
							}
						}
	    				callback(fish._codecache[code]);
	        		});
        		}else{
        			callback(fish._codecache[code]);
        		}
        	}else if($.isArray(code)){
        		var need_code = [];
        		var callback_result = {};
        		_.each(code,function(item){
        			if(!fish._codecache[item]){
        				need_request = true;
        				need_code.push(item);
        			}else{
        				callback_result[item] = fish._codecache[item];
        			}
        		});
        		if(need_request){
	        		fish.callService("CacheController", "getMultiAttrValues",need_code,function(data){
	    				var callback_result = {};
	        			for(var _temp_code in data)
						{
							var _temp_code_list = data[_temp_code];
							if ($.isArray(_temp_code_list))
							{
								fish._codecache[_temp_code] = {};
								callback_result[_temp_code] = {};
								for(var i=0;i<_temp_code_list.length;i++)
								{
									var _list_inst = _temp_code_list[i];
									fish._codecache[_temp_code][_list_inst.attr_value] = _list_inst.attr_value_name;
									callback_result[_temp_code][_list_inst.attr_value] = _list_inst.attr_value_name;
								}
							}
						}
	    				
	    				callback(callback_result);
	        		});
        		}else{
        			callback(callback_result);
        		}
        	}
        },
        unitTranslate : function(flow_count,htmlneed){
        	var unit = 'KB'
			if(flow_count == ''){
				flow_count = '0';
			}
			flow_count = (parseFloat(flow_count));
			if(flow_count >= (1024 * 1024)){
				unit = 'G';
				flow_count = (parseFloat(flow_count) / (1024 * 1024)).toFixed(2);
			}else if(flow_count >= 1024){
				unit = 'MB';
				flow_count = (parseFloat(flow_count) / 1024).toFixed(2);
			}else{
				flow_count = parseFloat(flow_count).toFixed(2);
			}
			if(!htmlneed){
				return flow_count+unit;
			}else{
				return flow_count+'<span class="text-weaker-color f12">'+unit+'</span>';
			}
        },
		unitTranslate2 : function(flow_count,htmlneed){
        	var unit = 'KB'
			if(flow_count == ''){
				flow_count = '0';
			}
			flow_count = (parseFloat(flow_count));
			if(flow_count >= (1024 * 1024 * 1024)){
				unit = 'G';
				flow_count = (parseFloat(flow_count) / (1024 * 1024 * 1024)).toFixed(2);
			}else if(flow_count >= 1024 * 1024){
				unit = 'MB';
				flow_count = (parseFloat(flow_count) / (1024 * 1024)).toFixed(2);
			}else if(flow_count >= 1024){
				unit = 'KB';
				flow_count = (parseFloat(flow_count) / 1024).toFixed(2);
			}else{
				unit = 'B';
				flow_count = parseFloat(flow_count).toFixed(2);
			}
			if(!htmlneed){
				return flow_count+unit;
			}else{
				return flow_count+'<span class="text-weaker-color f12">'+unit+'</span>';
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
	}
	}
});