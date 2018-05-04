define(['hbs!modules/business_query/templates/flow_query_submenu.html',
        "frm/template/party/echarts.min"], function (temp, echarts) {
            var pageView = fish.View.extend({
                template: temp,
                afterRender: function () {
                    var that = this;
                    Utils.load("#div_main","usg_current_query.html");
                	that.initSubmenuClk();
                },
              //初始化菜单点击事件
            	initSubmenuClk : function(){
            		$(".tab-nav .tab-item").unbind("click").bind("click",function(){
            			$(this).siblings("li").find("a").removeClass("active");
            			$(this).find("a").addClass("active");
            			Utils.load("#div_main",$(this).find("a").attr("url"));
            			
            		});
            	},
            });
            return pageView;
        });

