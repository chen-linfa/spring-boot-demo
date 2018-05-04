define(['i18n!modules/index/i18n/index',
        'frm/portal/portal'], function (i18n) {
    var IndexView = fish.View.extend({
        initialize: function () {
        	//监听登录状态改变
        	portal.appGlobal.on("change:currentStatus", this.currentStatusChange, this);
        },

        index: function () {
        	//解决Firefox和IE浏览器在页面的backspace退格键点击执行“后退”操作的问题
        	if (document.addEventListener) {
        		//对于IE 9或Firefox
        		document.onkeydown = function (e) {
                	var event = e || window.event; //获取event对象
                    var obj = event.target || event.srcElement; //获取事件源
                    var keyCode = event.keyCode; //获取按键
                    var type = event.target.localName.toLowerCase();
                    if ((keyCode == 8) && (type != 'input') && (type != 'textarea') && (type != 'submit')) {
                    	if (event.returnValue) {
                    		event.returnValue = false;
                    	}
                    	if (event.preventDefault) {
                    		event.preventDefault();
                    	}
                    }
        		};
        	} else if (document.attachEvent) {
        		//对于IE 8或更早版本
        		document.onkeydown = function (e) {
        			debugger;
        			var event = e || window.event; //获取event对象
                    var obj = event.target || event.srcElement; //获取事件源
                    var code; //获取按键
                    if (event.keyCode) {
                    	code = event.keyCode;
                    } else if (event.witch) {
                    	code = event.witch;
                    }
                    var type = obj.tagName.toLowerCase();
                    if ((code == 8) && (type != 'input') && (type != 'textarea') && (type != 'submit')) {
                    	event.keyCode = 0;
                        event.returnValue = false;
                    }
                    return true;
        		};
        	};

        	//var status = "login"; //先进入登录页
            var status = "running"; //直接进入页面

            portal.appGlobal.set("currentStatus", status);
        },


        currentStatusChange: function () { //登录状态改变
            if ("login" == portal.appGlobal.get("currentStatus")) { //如果已经登录了，则修改成main IndexView，否则变成LoginView
                this.requireView('modules/formanage/login/views/LoginView');

            } else if ("running" == portal.appGlobal.get("currentStatus")) {
            	var menuCode = portal.appGlobal.get("menuCode");
            	//console.log('menuCode:'+menuCode);
            	//TODO 根据menuCode 去加载不同的菜单url

            	this.requireView('modules/formanage/main/views/MainView');

            } else if ("sessionTimeOut" == portal.appGlobal.get("currentStatus")) {
            	fish.store.set("reLogin", i18n.SESSION_TIME_OUT_REASON);
				document.location.href = portal.appGlobal.get('webroot');
            } else if ("beenKickedFromLogin" == portal.appGlobal.get("currentStatus")) {
            	fish.store.set("reLogin", i18n.SESSION_TIME_OUT_BEEN_KICKED);
				document.location.href = portal.appGlobal.get('webroot');
            }
        }
    });
    return IndexView;
});
