define(['hbs!../templates/childusermanage.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: false,//该表格可以多选
					rowId: "user_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
					    {checkbox:true},
						{data: "user_name", title: "账号", width: "15%"},
						{data: "chinese_name", title: "姓名", width: "15%"},
						{data: "mobile_phone", title: "手机号码", width: "15%"},
						{data: "email", title: "email", width: "15%"},
						{data: "comments", title: "备注", width: "15%"},
						{data: "control", title: "操作", width:"25%",className:"operation", formatter: function(data){
							//操作列的按钮生成
							var html = '<a href="javascript:void(0);" class="js-btn_edit">修改</a> '
								+'<a href="javascript:void(0);" class="js-btn_del">删除</a> '
								+'<a href="javascript:void(0);" class="js-btn_menu">菜单权限</a> '
								+'<a href="javascript:void(0);" class="js-btn_group">成员群组权限</a> '
							return html;
						}}
					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
                that.$data_list = that.$("#xtab").xtable(option);	
				that.bindTableButton();
				
								//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.$data_list.xtable("options",{pageSize:rowNum});
                    	that.queryChildUser(eventData.page,rowNum);
                    },
                    create:function(){
                    	that.queryChildUser(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					that.queryChildUser(1);
				});
				
				that.$("#btn_add").click(function(){
					fish.popupView({
            			url:"modules/memberManage/childUserManage/views/NewAccountView",
            			callback:function(popup,view){
            				view.parentView = that;
            			}
            		});
				});
                //过滤非法的卡号输入值
                that.$('#search_input').bind({
                    keyup:function(){
                        this.value=this.value.replace(/\D/g,'');
                    }
                });
            },
            queryChildUser:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	
            	var param = {
            		page:page,
            		rows:rows,
            		user_name:search_content
            	};
            	fish.callService("SPUserController", "querySPUserListByUserName",param,function(reply){
            		that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	//编辑按钮
            	that.$("#xtab").delegate(".js-btn_edit","click",function(){
            		var user_id = $(this).parents("tr").attr("id");
            		var user_data = that.$("#xtab").xtable("findData","#"+user_id);
            		fish.popupView({
            			url:"modules/memberManage/childUserManage/views/ChangeAccountView",
            			callback:function(popup,view){
            				view.parentView = that;
            				view.loadData(user_data);
            			}
            		});
            	});
            	//菜单按钮
            	that.$("#xtab").delegate(".js-btn_menu","click",function(){
            		var user_id = $(this).parents("tr").attr("id");
            		var user_data = that.$("#xtab").xtable("findData","#"+user_id);
            		fish.popupView({
            			url:"modules/memberManage/childUserManage/views/AccountMenuView",
            			viewOption:{user_id:user_id},
            			callback:function(popup,view){
            				view.parentView = that;
            				view.loadData(user_data);
            			},
            			width:600
            		});
            	});
            	//修改群组权限
            	that.$("#xtab").delegate(".js-btn_group","click",function(){
            		var user_id = $(this).parents("tr").attr("id");
            		var user_data = that.$("#xtab").xtable("findData","#"+user_id);
            		fish.popupView({
            			url:"modules/memberManage/childUserManage/views/SelectUserGroupPopView",
            			viewOption:{user_id:user_id},
            			callback:function(popup,view){
            				view.parentView = that;
            			},
            			width:400
            		});
            	});
            	//删除按钮
            	that.$("#xtab").delegate(".js-btn_del","click",function(){
            		var user_id = $(this).parents("tr").attr("id");
            		var user_data = that.$("#xtab").xtable("findData","#"+user_id);
            		layer.confirm("确定删除账号："+user_data.user_name+"？",function(){
						fish.callService("SPUserController", "deleteChildSPUser", {user_id:user_id}, function(data){
							if(data.res_code == "00000"){
								layer.alert("删除子账户成功！");
								that.queryChildUser();
							}else {
								layer.alert("删除子账户失败，请重试");
							}
						});
            		});
            	});
            }
        });
        return pageView;
    });
