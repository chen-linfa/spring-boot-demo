define(['hbs!../templates/warning-regular-manage.html'],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.$(".js-start_date,.js-end_date").datetimepicker({
            	viewType:"date"
            });
            that.$("#btn_search").click(function(){
            	that.queryWarnRules(1);
            });
            that.$("#btn_add").click(function(){
            	fish.popupView({
            		url:"modules/warningNotice/warningRegularManage/views/WarnCfgPopView",
            		width:400,
            		viewOption:{cfg_id:"",saveType:"add"},
            		callback:function(popup,view){
            			view.parentView = that;
            		}
            	});
            });
             that.$('.js-pagination').pagination({
                 records: 0,
                 pgRecText:false,
                    pgTotal:false,
                    rowList:[],
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.queryWarnRules(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	that.queryWarnRules(1);
                    }
             });
		},
		queryWarnRules:function(page,rows){
			var that = this;
			page = page || 1;
			rows = rows || 10;
			var param = that.$("form").form("value");
			param.portal = "portal";
			param.page = page;
			param.rows = rows;
			that.$("#warnmsg_list").empty();
			fish.callService("RulesConfigurationController","queryWarnRules",param,function(reply){
				if(reply.result){
					that.$('.js-pagination').pagination("update",{records:reply.result.total,start:reply.result.pageNumber});
					that.$(".page-total-num").text(reply.result.pageCount);
					that.$(".page-data-count").text(reply.result.total);
					if($.isArray(reply.result.rows)){
						var rows = reply.result.rows;
						_.each(rows,function(item){
							var $li = that.$("#detail-li").clone();
							$li.data("cfg",item);
							if(item.status_cd == "失效"){
								$li.find("[type=stop]").hide();
								$li.find("[type=start]").show();
							}else{
								$li.find("[type=stop]").show();
								$li.find("[type=start]").hide();
							}
							_.each(item,function(val,key){
								$li.find("span[name="+key+"],a[name="+key+"],div[name="+key+"]").html(val);
							});
							that.$("#warnmsg_list").append($li);
						});
						that.bindButtonEvent();
					}
				}
			});
		},
		bindButtonEvent:function(){
			var that = this;
			
			//配置按钮
			that.$(".js-btn_edit").click(function(){
				var data = $(this).parents("li.list-item").data("cfg");
				//编辑模式下，在此刻加载规则信息
				fish.callService("RulesConfigurationController", "getAllRulesInfo", {cfg_id:data.cfg_id}, function(reply){
					console.log(data);
					if(reply.res_code == "00000"){
						console.log(reply.result);
						
						fish.popupView({
		            		url:"modules/warningNotice/warningRegularManage/views/WarnCfgPopView",
		            		width:600,
		            		viewOption:{cfg_id:data.cfg_id,saveType:"edit",edit_detail:reply.result},
		            		callback:function(popup,view){
		            			view.parentView = that;
		            		}
		            	});
					}
				});
			});
			
			that.$(".js-btn_control").click(function(){
				var type = $(this).attr("type");
				var msg = {
					stop:"停用当前配置，将不再提供相关预警服务，是否确定？",
					start:"启用当前配置，将启用相关预警服务，是否确定？",
					"delete":"删除当前配置，将删除相关预警服务，是否确定？"
				};
				var data = $(this).parents("li.list-item").data("cfg");
				var params = {
					type:type,
					cfg_id:data.cfg_id,
					cfg_opt_val_id:data.cfg_opt_val_id
				};
				
				layer.confirm(msg[type],function(){
					fish.callService("RulesConfigurationController", "deleteRules", params, function(data){
						if(data.res_code == '00000'){
							if(type=="delete"){
								layer.alert("删除成功");
							}else if(type=="stop"){
								layer.alert("停用成功");
							}else if(type=="start"){
								layer.alert("启用成功");
							}
							that.queryWarnRules();
						}else{
							if(type=="delete"){
								layer.alert("删除出错");
							}else if(type=="stop"){
								layer.alert("停用出错");
							}
						}			
					});
				});
				
			});
		}
	});
    return pageView;
});
