define(['hbs!../templates/membergroupmanage.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: false,//该表格可以多选
					rowId: "mem_user_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
					    {checkbox:true},
					    {data: "msisdn", title: "MSISDN（卡号）", width: "20%"},
						{data: "iccid", title: "ICCID", width: "20%"},
						{data: "imsi", title: "IMSI", width: "20%"},
						{data: "group_name", title: "归属群组", width: "20%"},
						{data: "control", title: "操作", width:"10%",className:"operation", formatter: function(data){
							//操作列的按钮生成
							var html = '<a href="javascript:void(0);" class="js-btn_group">分组</a>';
							return html;
						}}
					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
                that.$data_list = that.$("#xtab").xtable(option);	
				that.bindTableButton();
				that.initGroupCheckBox();
				
								//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.$data_list.xtable("options",{pageSize:rowNum});
                    	that.queryMemberGroup(eventData.page,rowNum);
                    },
                    create:function(){
                    	that.queryMemberGroup(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					that.queryMemberGroup(1);
				});
				
				that.$("#btn_batchgroup").click(function(){
					if(that.$("#xtab").xtable("getSelected").length <= 0){
						layer.alert("请选择至少一个成员后再操作！");
						return false;
					}
					fish.popupView({
						url : "modules/memberManage/memberGroupManage/views/SelectGroupPopView",
						width : 400,
						height : 405,
						viewOption:{mem_user_id_arr:that.$("#xtab").xtable("getSelected"),all_list:that.$("#xtab").xtable("getData")},
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
                // 导出按钮事件
				that.$("#btn_export_mem").click(function() {
					var group_id = $('#input_group_id').combobox('value');//群组ID
	            	var search_content = $.trim($('#search_input').val());
	                var param = {
	                	"group_id" : group_id,
	                	"search_content" : search_content
	                };
	                fish.callService("CustMemController", "exportMemberData", param,function(data) {
	                    if (data.res_code == "00000") {
	                        var temp_key = data.result;
	                        layer.alert("继续下载？", function(index){
	                            window.open("servlet/downloadExcel?type=member&temp_key="+temp_key);
	                            layer.close(index);
	                        });
	                    } else {
	                        layer.alert(data.res_message);
	                    }
	                });
				});
            },
            queryMemberGroup:function(page,rows){
            	var that = this;
            	if(page){
            		//暂存当前页面
            		that._nowpage = page;
            	}
            	page = page || 1;
            	rows = rows || 10;
            	var group_id = $('#input_group_id').combobox('value');//群组ID
            	var search_content = $.trim($('#search_input').val());
            	
            	var param = {
            		page:page,
            		rows:rows,
            		group_id:group_id,
            		search_content:search_content
            	};
            	fish.callService("CustMemController", "queryCustMemberByGroupId",param,function(reply){
            		that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	that.$("#xtab").delegate(".js-btn_group","click",function(){
            		var $tr = $(this).parents("tr");
            		
            		var mem_user_id = $tr.attr("id");
					fish.popupView({
						url : "modules/memberManage/memberGroupManage/views/SelectGroupPopView",
						width : 400,
						height : 405,
						viewOption:{mem_user_id:mem_user_id},
						callback:function(popup,view){
							view.parentView = that;
						}
					});
            	});
            },
            initGroupCheckBox:function(){
            	var that = this;
            	that.$('#input_group_id').combobox({dataSource:[{name:"全部群组",value:""}]});
            	fish.callService("CustMemGroupController", "queryCustMemGroupList",{},function(data){
            		var result = data.result;
            		var dataSource = [];
            		if($.isArray(result)){
            			//group_id:group_name
            			_.each(result,function(item){
            				dataSource.push({value:item.group_id,name:item.group_name});
            			});
            		}
            		dataSource.unshift({name:"全部群组",value:""})
            		that.$('#input_group_id').combobox("option",{dataSource:dataSource});
            	});
            }
        });
        return pageView;
    });
