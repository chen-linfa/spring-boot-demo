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
            //判断这个选择分组弹窗是用于单个分组还是批量分组
            if(that.options.mem_user_id){
            	//alert(that.options.mem_user_id)
            	that._mode = "single"
            }else if($.isArray(that.options.mem_user_id_arr)){
            	that._mode = "batch";
            }
            that.$('.js-combobox').combobox();
            
            that.loadGroupList();
            
            //创建分组按钮
            that.$("#btn_addgroup").click(function(){
            	that.$("#newgroup_form").form("clear");
            	that.$("#newgroup_form").show();
            });
            
            //确定新增分组按钮
            that.$("#btn_addconfirm").click(function(){
            	var param = that.$("#newgroup_form").form("value");
            	if(!param.group_name){
            		layer.msg("群组名称不能为空");
            		return false;
            	}
            	fish.callService("CustMemGroupController", "insertMemGroupGroup", param, function(result){
					if(result.res_code == "00000"){
						layer.msg("新增群组成功");
						that.loadGroupList();
					}else {
						layer.alert(result.res_message);
					}
            	});
            });
            
            //确定按钮
            that.$("#btn_groupconfirm").click(function(){
            	if(that._mode == "single"){
            		//单个分组的情况
	            	var selected_group = [];
	            	that.$(":checked").each(function(){
	            		var group_id = $(this).attr("value");
	            		selected_group.push({group_id:group_id,mem_user_id:that.options.mem_user_id});
	            	});
	            	if(selected_group.length == 0){
	            		layer.alert("请选择群组！");
	            		return;
	            	}
	            	var param = {
	            		//警告：这里的select list指选择的分组ID列表
	            		mem_user_select_list:selected_group,
	            		mem_user_id:that.options.mem_user_id
	            	};
					fish.callService("CustMemGroupController", "GroupingForOne", param, function(result){
						if(result.res_code == "00000"){
							layer.msg("分组成功");
							that.parentView.queryMemberGroup();
							that.popup.close();
						}else {
							layer.alert("操作失败，请重试");
						}
					});
            	}else{
            	//批量分组的情况
            		var group_id = that.$(":checked").attr("value");
            		if(!group_id){
	            		layer.alert("请选择群组！");
	            		return;
	            	}
					var mem_user_select_list = [];
            		_.each(that.options.mem_user_id_arr,function(item){
            			var obj = {};
            			obj.mem_user_id = item.mem_user_id;
            			obj.group_id = group_id;
						mem_user_select_list.push(obj);
					});
					
					var mem_user_all_list = [];
					_.each(that.options.all_list,function(item){
						mem_user_all_list.push(item.mem_user_id);
					});
            		
            		var param = {
            			group_id:group_id,
            			//警告：这里的select list指被选取的成员卡号列表
            			mem_user_select_list:mem_user_select_list,
            			mem_user_all_list:mem_user_all_list
            		};
            		fish.callService("CustMemGroupController","batchGrouping",param,function(result){
            			if(result.res_code == "00000"){
							layer.msg("分组成功");
							that.parentView.queryMemberGroup();
							that.popup.close();
						}else {
							layer.alert("操作失败，请重试");
						}
            		});
            	}
            });

            //新增面板的取消按钮
            that.$("#btn_addcancel").click(function(){
            	that.$("#newgroup_form").hide();
            });
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        loadGroupList:function(){
        	//加载成员组数据
        	var that = this;
        	that.$("#newgroup_form").hide();
        	that.$("#group_list").empty();
        	fish.callService("CustMemGroupController", "queryCustMemGroupList",{},function(data){
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
        			if(that._mode == "batch"){
        				that.$("#group_list").find(":checkbox").attr("type","radio");
        			}
        			that.$("#group_list").find(".js-check").icheck();
        			
        			//编辑
        			that.$("#group_list").find(".js-editgroup").click(function(){
						that.$("#newgroup_form").hide();
        				var group_id = $(this).parents("tr").attr("group_id");
        				//定位：将编辑表单置于对应记录上层遮盖之
						that.$("#editgroup_form").show().css("top",$(this).parents("tr").position().top);
						var item = that.group_list[group_id];
						var comments = item.comments;
						item.comments = comments.substring(1,comments.length-1);
        				that.$("#editgroup_form").form("value",item);
        			});
        			
        			that.$("#group_list").find(".js-delgroup").click(function(){
        				var group_id = $(this).parents("tr").attr("group_id");
        				var group_name = $(this).parents("tr").find("span[name=group_name]").text();
        				layer.confirm("确定删除分组 "+group_name+" ？",function(){
        					fish.callService("CustMemGroupController", "deleteCustMemGroup", {group_id : group_id} , function(result){
	        					if(result.res_code == "00000"){
									layer.msg("删除成功");
									that.loadGroupList();
								}else {
									layer.alert(result.res_message);
								}
        					});
        				});
        			});
        			
        			//修改界面的确定按钮
        			that.$("#btn_editconfirm").unbind('click').bind('click',function(){
        				that.$("#editgroup_form").hide()
        				var param = that.$("#editgroup_form").form("value");
    					fish.callService("CustMemGroupController", "editCustMemGroup", param , function(result){
        					if(result.res_code == "00000"){
								layer.msg("修改成功");
								that.loadGroupList();
							}else {
								layer.alert(result.res_message);
							}
    					});
        			});
        			that.$("#btn_editcancel").click(function(){
        				that.$("#newgroup_form").hide();
        				that.$("#editgroup_form").hide();
        			});
        		}
        		
        		//查询该成员所属组ID
        		if(that._mode == "single"){
	        		fish.callService("CustMemGroupController", "queryGroupIdByMemId",
	        				{"mem_user_id":that.options.mem_user_id},function(reply){
	        			var result = reply.result;
	        			if($.isArray(result)){
	        				_.each(result,function(val){
	        					that.$(":checkbox[value='"+val+"']").click();
	        				});
	        			}
	        		})
        		}
        	});
        }
        
    });

    return components;
});
