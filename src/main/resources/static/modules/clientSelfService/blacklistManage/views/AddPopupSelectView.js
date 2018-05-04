define(['hbs!../templates/add-popup-select.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "mem_user_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
					    {checkbox:true},
						{data: "msisdn", title: "MSISDN（卡号）", width: "70%"},

					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};

				that.$("#xtab2").xtable(option);	
				that.bindTableButton();
				that.initGroupCheckBox();
				that.initEvent();
				
								//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.queryMemberGroup(eventData.page,rowNum,{});
                    },
                    create:function(){
                    	that.queryMemberGroup(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					var param={};
    		
    				var search_state = $("#input_group_id").val();
    				
    				if(search_state=="1"||search_state==""||search_state==null){
    					param.msisdn = that.$("#search_input").val();
    					
    				}else{
    					param.mem_user_name = that.$("#search_input").val();
    				}
					that.queryMemberGroup(1,5,param);
				});
				
				that.$("#pop_confirm").click(function(){
					if(that.$("#xtab2").xtable("getSelected").length <= 0){
						layer.alert("请选择至少一个成员后再操作！");
						return false;
					}
					//var msisdn = $("#xtab_msisdn").find("tr[mark='1']").find("td:eq(0)").html();
					//var mem_user_name = $("#xtab_msisdn").find("tr[mark='1']").find("td:eq(1)").html();
					//var cust_id = $("#xtab_msisdn").find("tr[mark='1']").find("td:eq(2)").attr("cust_id");
					//$("#msisdn",parent.document).val(msisdn);
					//$("#mem_user_name",parent.document).val(mem_user_name);
					//$("#msisdn",parent.document).attr("cust_id",cust_id);
					var data={
						msisdn:that.$("#xtab2").xtable("getSelected")["0"].msisdn,
						mem_user_name:that.$("#xtab2").xtable("getSelected")["0"].mem_user_name,
						cust_id:that.$("#xtab2").xtable("getSelected")["0"].cust_id
					}
				
					that.parentView.loadData(data);
					
					that.popup.close();
				});
            },
            queryMemberGroup:function(page,rows,params){
            	var that = this;
    			if(params==null){
    				params={};
    			}
            	if(page){
            		//暂存当前页面
            		that._nowpage = page;
            	}
         
    			var num = 1;
    			var row = 5;
    			params.page = page==null? num : page;
    			params.rows = rows==null? row : rows;

    			console.log(params);
            	fish.callService("SmsController", "queryMsisdnInfo", params, function(reply) {
            		that.$("#xtab2").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	that.$("#xtab2").delegate(".js-btn_group","click",function(){
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

    		initEvent: function(){
    			var me = this;
    		//	dropDown.initSelectDropDown($("#search_cond_form"));

    			
    			$('#close_layer').bind("click", function() {
    				me.popup.close();
    			});
    			
    		},
    		
            initGroupCheckBox:function(){
            	var that = this;
             	that.$('#input_group_id').combobox({dataSource:[{name:"成员卡号2",value:"1"}]});
            	var dataSource=[];
            	dataSource.push({value:"0",name:"成员名称"});
            	dataSource.unshift({name:"成员卡号",value:"1"})
            	that.$('#input_group_id').combobox("option",{dataSource:dataSource});

            }
        });
        return pageView;
    });
