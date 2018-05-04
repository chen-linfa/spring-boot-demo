define(['hbs!modules/main/templates/main.html',
        "modules/indexPage/views/IndexView"],function(temp,IndexView,index) {
    var pageView = fish.View.extend({
        template: temp,
        className: "iot-page-wrap",
        _indexView:new IndexView(),
        initialize: function() {
            var that = this;
            this.setView('.js-page-view',that._indexView);
        },
        events:{
            "click .js-sidebar-menu li.item a.link" :"openViewFn",
            "click .js-page-sub-sidebar ul.sidebar-menu li.item a.link":"openSubViewFn"
        },
        afterRender: function(){
            var that = this;
            
            //获取顶部用户信息
            fish.callService("SPUserController", "getCustName",{},function(reply){
            	if(reply.res_code=="00000"){
            		that.$(".js-spuser-name").text(reply.result.spuser.user_name);
            		that.$(".js-last_online_time").text(reply.result.spuser.last_online_time);
            	}
            });
            
            that.$(".js-changepwd").click(function(){
            	//修改密码弹窗
            	fish.popupView({
        			url:"modules/main/views/ChangePwdView",
        			callback:function(popup,view){
        				view.parentView = that;
        			}
            	});
            });
            
            this.initMenu();
            this.toLogout();
            this.initFloatMenu();
            var changeTem = $('.js-change-tem');
            var bBtn = true;

            changeTem.on('click',function(){
                var timer;
                var dayCss = 'frm/fish-desktop/css/fish-iot.css';
                var nightCss = 'frm/fish-desktop/css/fish-iot-night.css';
                var dayTem = 'frm/template/css/template-iot.css';
                var nightTem = 'frm/template/css/template-night-iot.css';

                if(bBtn){

                    bBtn = false;

                    $('body').addClass('change-tem-animation');
                    var nowstate = "day;"
                    if($('body').hasClass('change-tem-animation')){
                        if($("link:eq(5)").attr("href")===dayCss){
                             changeTem.addClass('night-state');
                             $("link:eq(5)").prop("href",nightCss);
                             $("link:eq(6)").prop("href",nightTem);
                             nowstate = "night";
                        }
                        else{
                            changeTem.removeClass('night-state');
                             $("link:eq(5)").prop("href",dayCss);
                             $("link:eq(6)").prop("href",dayTem);
                        }

                        timer = setTimeout(function(){
                            $('body').removeClass('change-tem-animation');
                            clearTimeout(timer);
                            bBtn = true;
                        },1500);
                        
                        //触发当前视图的昼夜切换方法
                        var nowView = that.getView(".js-page-view");
                        if(nowView && $.isFunction(nowView.themeChange)){
                        	nowView.themeChange(nowstate);
                        }
                        that.themeChange(nowstate);
                    }
                }
                return false
            });

            this.listenTo(that._indexView,"showInfo",function(data){
               if(data === "ranking"){
                    var $rank = that.$('[href="modules/operationAnalysis/memberBusinessMonthlyRanking/views/MemberBusinessMonthlyRankingView"]');
                    var index = $rank.parent().parent().attr("menuSubIdx");
                    that.$('[menuChildIdx='+index+']').click();
                    $rank.click();
               }
                else{
                    var $notice = that.$('[href="modules/clientSelfService/unusualWarning/views/UnusualWarningView"]');
                    var index = $notice.parent().parent().attr("menuSubIdx");
                    that.$('[menuChildIdx='+index+']').click();
                    $notice.click();
                }
            });

            
		},
        openViewFn:function(e,norequire){
            var that = this;
            var menuItem = $(e.target).parent('.item');
            var menuURl = $(e.target).attr('href');
            var menuIdx = $(e.target).attr('menuChildIdx');
            var subMenu = that.$('.js-page-sub-sidebar');


            if(menuURl!=="#" && menuURl!==null){
                if(subMenu.is(':visible')){
                    subMenu.hide()
                };
                menuItem.addClass('activtead');
                menuItem.siblings('.item').removeClass('activtead');
                that.requireView({
                    selector: '.js-page-view',
                    url: menuURl
                });
            }else if(menuIdx!==undefined && menuIdx!==''){

                var subMenuUl = subMenu.find("[menuSubIdx="+menuIdx+"]");
                var subMenuItem = subMenuUl.find('li.item');
                var hasUrlArr = [];

                if(subMenu.is(':hidden')){
                    subMenu.show();
                }
                menuItem.addClass('activtead');
                menuItem.siblings('.item').removeClass('activtead');
                subMenuUl.show();
                subMenuUl.siblings().hide();

                subMenuItem.each(function(i){
                    var subMenuUrl = subMenuItem.eq(i).find('a.link').attr('href');
                    if(subMenuUrl != '' && subMenuUrl !== '#' && subMenuUrl !== null){
                        hasUrlArr.push([subMenuUrl,subMenuItem.eq(i).index()]);
                    }
                });
                if(!norequire){
	                if(hasUrlArr.length != 0){//排除子菜单项无链接的情况
		                subMenuItem.eq(hasUrlArr[0][1]).addClass('activtead');
		                subMenuItem.eq(hasUrlArr[0][1]).siblings().removeClass('activtead');
		                that.requireView({
		                    selector: '.js-page-view',
		                    url: hasUrlArr[0][0]
		                });
	                }
                }
            }else{
                if(subMenu.is(':visible')){
                    subMenu.hide()
                };
            }

            return false;
        },
        openSubViewFn:function(e){
            var that = this;
            var menuItem = $(e.target).parent('.item');
            var menuURl = $(e.target).attr('href');
            if(menuURl!=="#" && menuURl!==null){
                menuItem.addClass('activtead');
                menuItem.siblings('.item').removeClass('activtead');
                that.requireView({
                    selector: '.js-page-view',
                    url: menuURl
                });
            }
            return false
        },
        toLogout:function(){//退出登录
            this.$(".js-logout").click(function(e) {
               fish.callService("SPUserController", "spUserLogout", {}, function(result){
                    var res_code = result.res_code;
                    if(res_code == "00000"){
                        layer.alert("注销登录成功", function(){
                            window.location.reload();
                        });
                    }else{
                        layer.alert("注销账号失败");
                    }
                });
            });
        },
        initMenu:function(){
            var that = this;
            fish.callService("SPUserController", "getPortalMenus", {}, function(menus){
                var menuData = {};
                //按照menu_level分主菜单和子菜单
                menuData = _.groupBy(menus,function(value){
                    return value.menu_level;
                });
                //主菜单
                rootMenu = menuData["2"];
                //子菜单分组
                subMenu = _.groupBy(menuData["3"],function(value){
                    return value.parent_id;
                })
                //渲染主菜单
                that.renderMenu(rootMenu);
                //渲染子菜单
                _.each(rootMenu,function(value,index){
                    if(subMenu[value.menu_id] != null){
                        that.renderSubmenu(subMenu[value.menu_id],index);
                    }
                })
            });
        },
        renderMenu:function(rootMenu){
            //根据order_id属性从小到大排列
            rootMenu.sort(function(a,b){
                return a.order_id - b.order_id;
            });
            _.each(rootMenu,function(value,index){
                var menuTemp = this.$(".js-menu-item-temp li").clone();
                $("a",menuTemp).prop("href",value.menu_view||"#");
                $("a",menuTemp).attr("menuChildIdx",index);//menuChildIdx属性对应子菜单
                $("a",menuTemp).html(value.menu_name);
                this.$(".js-sidebar-menu").append(menuTemp);   
            });        
            this.$(".iot-page-sidebar").niceScroll({
				//滚动轴的颜色		
				cursorcolor: '#E4E4E4',
				autohidemode:false,
				cursoropacitymax:1
			});
        },       
        renderSubmenu:function(submenu,index){
            var that = this;
            submenu.sort(function(a,b){
                return a.order_id - b.order_id;
            });
            var submenuTemp = that.$(".js-submenu-temp").clone();
            _.each(submenu,function(value){
                var subMenuLi = that.$(".js-submenu-temp li").clone();
                $("a",subMenuLi).html(value.menu_name);
                $("a",subMenuLi).prop("href",value.menu_view||"#");
                submenuTemp.append(subMenuLi);
            });  
            submenuTemp.children("li").eq(0).remove();
            submenuTemp.attr("menuSubIdx",index);
            submenuTemp.removeClass("js-submenu-temp");  
            that.$(".js-sidebar-submenu").append(submenuTemp);    
            
            this.$(".js-page-sub-sidebar").niceScroll({
				//滚动轴的颜色		
				cursorcolor: '#E4E4E4',
				autohidemode:false,
				cursoropacitymax:1
			});
        },
        initFloatMenu:function(){
            var that = this;
            that.$(".js-float").css({"display": "block",
                                    "position": "absolute",
                                    "left": "200px",
                                    "z-index":2});
            that.$(".js-float").hide();
            that.$(".js-sidebar-menu").on("mouseenter","a:gt(0)",function(event){//gt(0)排除主页没有子菜单的情况
            	if($(this).parent("li").hasClass("activtead")){
            		//已经展开一个菜单了就不显示这个菜单的浮动版
            		return;
            	}
                that.$(".js-float-submenu").empty();//清空悬浮的子菜单，
                var menuSubIdx = $(event.target).attr("menuChildIdx");
                var $replace = that.$(".js-sidebar-submenu ul[menuSubIdx="+menuSubIdx+"]").clone();
                that.$(".js-float-submenu").append($replace);
                $replace.show();
                that.$(".js-float").show();
                that.$(".js-float li").removeClass("activtead");
                that.$(".js-float li.item a.link").click(function(e){
                	that.$(".js-sidebar-menu a[menuchildidx="+menuSubIdx+"]").trigger("click",true);
                	var ind = $(this).parent("li").index();
                	that.openSubViewFn.call(that,e);
                	that.$(".js-sidebar-submenu ul[menuchildidx="+menuSubIdx+"]").children("li").eq(ind).addClass("activtead");
                	e.preventDefault();
                });
            });

            var subMenuTemp;
            that.$(".js-sidebar-menu").on("mouseleave","a",function(event){
                    if(!that.$(".js-float")[0].contains(event.relatedTarget)){//如果不是移向右边的子目录
                        that.$(".js-float").hide();
                        that.$(".js-float-submenu").empty();
                    };                    
            }); 

            that.$(".js-float").on("mouseleave",function(event){
                    if(!that.$(".js-sidebar-menu")[0].contains(event.relatedTarget)){//如果不是移向左边的主目录
                        that.$(".js-float").hide();
                        that.$(".js-float-submenu").empty();
                    }
            });
            
            if(this.$(".js-float").getNiceScroll()){
        		this.$(".js-float").getNiceScroll().remove();
        	}
            that.$(".js-float").niceScroll({
				//滚动轴的颜色		
				cursorcolor: '#E4E4E4',
				autohidemode:false,
				cursoropacitymax:1
			});
        },
        openView:function(viewURL,param){
            var that = this;
            //展示对应视图
            that.requireView({
                selector:".js-page-view",
                url:viewURL,
                viewOption:{"keyname":param},
                callback:function(view){
                    view.initData(param);
                }
            });
            //显示对应的菜单
            var menuItem = that.$("a[href='"+viewURL+"']").parent();//li标签
            menuItem.addClass('activtead');
            menuItem.siblings('.item').removeClass('activtead');
            var index = menuItem.parent().attr("menusubidx");//ul标签
            var parentMenu = that.$("a[menuchildidx='"+index+"']").parent();
            //展示对应的子标签面板
            menuItem.parent().show();
            menuItem.parent().siblings().hide();
            that.$(".js-page-sub-sidebar").show();
            parentMenu.addClass("activtead");
            parentMenu.siblings().removeClass("activtead");
        },
        themeChange:function(state){
        	var that = this;
        	if(this.$(".iot-page-sidebar,.js-page-sub-sidebar,.js-float").getNiceScroll()){
        		this.$(".iot-page-sidebar,.js-page-sub-sidebar,.js-float").getNiceScroll().remove();
        	}
        	if(state == "day"){
	        	this.$(".iot-page-sidebar,.js-page-sub-sidebar,.js-float").niceScroll({
					//滚动轴的颜色		
					cursorcolor: '#E4E4E4',
					autohidemode:false,
					cursoropacitymax:1
				});
        	}else{
        		this.$(".iot-page-sidebar,.js-page-sub-sidebar,.js-float").niceScroll({
					//滚动轴的颜色		
					cursorcolor: '#EDEEEF',
					autohidemode:false,
					cursoropacitymax:0.15
				});
        	}
        }
	});
    return pageView;
});
