define(['hbs!modules/serviceRuleConf/IMEITrigger/templates/IMEITrigger.html'],function(temp){
	  var pageView = fish.View.extend({
        template: temp,
        events:{
        	"click #trigger_add_btn":"addConfigure"
        },
        afterRender: function(){
            var that = this;
            that.doQuery();
		},
		doQuery:function(page,rows, params){
			var that = this;
			if (!params)  params = new Object();
			params.page = page ? page : 1;
			params.rows = rows ? rows : 10;
			fish.callService("TriggerController", "queryImeiTrigger", params, function(data){
				var has_data = false;
				var pageCount = 0;
				if(data && data.total>0){
					has_data = true;
					that.$("#trigger_add_btn").hide();
					that.initData(data);
					pageCount = data.pageCount;
				}
				if(has_data == false){
					
				}
				that.bindEvent();
			})
		},
		initData:function(data){
			var that = this;
			var result = data.rows;
			var $template;
			that.$(".list-item").remove();
			_.each(result,function(obj){
				$template = that.$('#detail-li').clone();
				$template.attr("id",obj.trigger_id).addClass('list-item');
				$template.find("span[name]").each(function(){
					var key = $(this).attr("name");
					$(this).html(obj[key]);
				});
				$template.find("#object_desc").text(obj.object_desc);
				that.$("#data_list").append($template);
				$template.css({
					"display":"block"
				})
			})
		},
		bindEvent:function(){
			 var that = this;
			 that.$('.js-delete_detail').click(function(){
			 	var $li = $(this).parents("li");
			 	var trigger_id = $li.find("[name='trigger_id']").text();
			 	layer.confirm('停用当前配置，将不再提供相关预警服务，'+
			        			'是否确定？', {yes:function(){
					that.deleteImeiTrigger(trigger_id);
				}});
			 });
			 that.$('.mem_list').click(function(){
			 	var trigger_id = $(this).parents("li").attr("id");
                var params = {};
                params.trigger_id = trigger_id;
                params.query_type = "view";
                params.trigger_type = "IMEI_MISMATCHING";
                fish.popupView({
                    url:"modules/serviceRuleConf/IMEITrigger/views/configureMemberView",
                    width:400,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.initData(params);
                    }
                });
			 });
			 that.$('.js-report_detail').click(function(){
                var trigger_id = $(this).parents("li").attr("id");
                var params = {};
                params.trigger_id = trigger_id;
                params.trigger_type = "imei_trigger";
                fish.popupView({
                    url:"modules/serviceRuleConf/activeTrigger/views/DayDataPopupView",
                    width:600,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.initData(params);
                    }
                });
             }),
             that.$('.js-edit_detail').click(function(){
                var trigger_id = $(this).parents("li").attr("id");
                var params = {};
                params.trigger_id = trigger_id;
                params.trigger_type = "IMEI_MISMATCHING";
                params.option = "edit";
                params.trigger_desc = $(this).parents("li").find("[id='trigger_desc']").html();
                params.trigger_name = $(this).parents("li").find("[id='trigger_name']").text();
                //console.log(params.trigger_desc);
                fish.popupView({
                    url:"modules/serviceRuleConf/IMEITrigger/views/imeiChangeConfigureView",
                    width:400,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.initData(params);
                    }
                });
            })
		},
		addConfigure:function(){
			var that = this;
			var params = {};
			params.trigger_type = "IMEI_MISMATCHING";
			params.option = "add";
            fish.popupView({
                url:"modules/serviceRuleConf/IMEITrigger/views/imeiChangeConfigureView",
                width:400,
                callback:function(popup, view) {
                    view.parentView = that;
                    view.initData(params);
                }
            });
		},
		deleteImeiTrigger : function(trigger_id){
			var that = this;
			var params = {};
			params.trigger_id = trigger_id;
			fish.callService("TriggerController", "deleteImeiTrigger", params, function(data){
				if(data.res_code == '00000'){
					layer.alert("停用成功！");
					that.doQuery();
				}else{
					layer.alert("停用失败！");
				}			
			});
		}
	});
    return pageView;
})