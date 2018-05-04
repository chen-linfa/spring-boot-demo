define(["hbs!../templates/selectgrouppop.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            
            that.loadGroupList();
            
            //确定按钮
            that.$("#btn_groupconfirm").click(function(){
            		//单个分组的情况
	            	var selected_group = [];
	            	that.$(":checked").each(function(){
	            		var group_id = $(this).attr("value");
	            		selected_group.push(group_id);
	            	});

	            	var param = {
	            		group_ids:selected_group,
	            		user_id:that.options.user_id
	            	};
					fish.callService("SPUserController", "updateSPUserGroupPrivilege", param, function(result){
						if(result.res_code == "00000"){
							layer.msg("分组成功");
							that.parentView.queryChildUser();
							that.popup.close();
						}else {
							layer.alert("操作失败，请重试");
						}
					});
            });

        },
        onClosePupup: function () {
            this.popup.close();
        },
        loadGroupList:function(){
        	//加载成员组数据
        	var that = this;
        	that.$("#group_list").empty();
        	fish.callService("CustMemGroupController","queryCustMemGroupList",{},function(data){
        		var result = data.result;
        		that.group_list = {};
        		if($.isArray(result)){
        			//group_id:group_name
        			_.each(result,function(item){
        				that.group_list[item.group_id] = item;
        				var $tr = that.$("#tab_template").find("tr").clone();
        				if(item.comments){
        					item.comments = "("+item.comments+")";
        				}
        				$tr.find(":checkbox").attr("value",item.group_id);
        				$tr.attr("group_id",item.group_id);
        				$tr.find("span[name]").each(function(){
        					var name = $(this).attr("name");
        					$(this).text(item[name]);
        				});
        				that.$("#group_list").append($tr);
        			});

        			that.$("#group_list").find(".js-check").icheck();
        		}
        		
        		//查询当前用户已经属于哪些组
        		fish.callService("SPUserController","querySpUserGroupList",{user_id:that.options.user_id},function(reply){
        			var result = reply.result;
        			if($.isArray(result)){
        				_.each(result,function(item){
        					that.$("#group_list").find(".js-check[value='"+item.group_id+"']").icheck("check");
        				});
        			}
        		});
        	});
        }
        
    });

    return components;
});
