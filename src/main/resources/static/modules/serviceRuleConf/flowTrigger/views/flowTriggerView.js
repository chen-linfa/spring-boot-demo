define(['hbs!modules/serviceRuleConf/flowTrigger/templates/flowTrigger.html'],function(temp){
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
			fish.callService("TriggerController", "queryFlowTrigger", params, function(data){
				var has_data = false;
				var pageCount = 0;
				if(data && data.total>0){
					has_data = true;
					that.initData(data);
					pageCount = data.pageCount;
					if(data.total >= 2){
						that.$("#trigger_add_btn").hide(); ////数据超过两项时，新增按钮隐藏
					}else{
						that.$("#trigger_add_btn").show();
					}
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
				$template.addClass('list-item').attr("id",obj.trigger_id);
				$template.find("span[name]").each(function(){
					var key = $(this).attr("name");
					$(this).html(obj[key]);
				});
				if(obj.object_desc == null){
					obj.object_desc="全部成员";
				}
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
			 	var trigger_id = $li.attr("id");
			 	layer.confirm('停用当前配置，将不再提供相关预警服务，'+
	        			'并取消流量实时提醒套餐（叠加包），是否确定？', {yes:function(){
					that.deleteFlowTrigger(trigger_id);
				}});
			 });
			 that.$('.js-object_desc').click(function(){
			 	var trigger_id = $(this).parents("li").attr("id");
                var params = {};
                params.trigger_id = trigger_id;
                params.query_type = "view";
                params.trigger_type = "FLOW_OVERLOAP";
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
                params.trigger_type = "flow_trigger";
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
                params.option = "edit";
                params.trigger_type = "FLOW_OVERLOAP";
                params.trigger_desc = $(this).parents("li").find("[id='trigger_desc']").html();
                params.trigger_name = $(this).parents("li").find("[id='trigger_name']").text();
                //console.log(params.trigger_desc);
                fish.popupView({
                    url:"modules/serviceRuleConf/flowTrigger/views/flowChangeConfigureView",
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
            params.trigger_type = "FLOW_OVERLOAP";
            params.option = "add";
            fish.popupView({
                url:"modules/serviceRuleConf/flowTrigger/views/flowChangeConfigureView",
                width:400,
                callback:function(popup, view) {
                    view.parentView = that;
                    view.initData(params);
                }
            });
        },
		deleteFlowTrigger : function(trigger_id){
			var that = this;
			var params = {};
			params.trigger_id = trigger_id;
			fish.callService("TriggerController", "deleteFlowTrigger", params, function(data){
				if(data.res_code == '00000'){
					layer.alert(data.result != null ? "停用成功! 已生成订单号:"+data.result.order_id : "停用成功!");
					that.doQuery();
				}else{
					layer.alert(data.res_message);
				}			
			});
		},
	});
    return pageView;
})