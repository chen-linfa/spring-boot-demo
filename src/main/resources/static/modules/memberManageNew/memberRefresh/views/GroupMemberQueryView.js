define(['hbs!../templates/groupmemberquery.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "msisdn",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "billId", title: "MSISDN（卡号）", width: "30%"},
						{data: "offerInstId", title: "订购组", width: "30%"},
						{data: "prodInstEffTime", title: "开户时间", width: "20%"}
					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
                that.$data_list = that.$("#detailtab").xtable(option);	
				//that.bindTableButton();
				
				//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.$data_list.xtable("options",{pageSize:rowNum});
                    	that.queryMemberInfo(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	//that.queryMemberInfo(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					that.queryMemberInfo(1);
				});
				
                //过滤非法的卡号输入值
                that.$('#search_input').bind({
                    keyup:function(){
                        this.value=this.value.replace(/\D/g,'');
                    }
                });
            },
            queryMemberInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	
            	var param = { msisdn:search_content};
            	param.page=page;
            	param.page=rows;
            	fish.callService("BusiGroupOrderController", "refreshMem",param,function(reply){
            		if(reply.res_code==00000){
            			layer.alert(reply.res_message);
            			that.$("#detailtab").xtable("loadData",reply.result.rows);
            			that.$('.js-pagination').pagination("update",{records:reply.result.total,start:reply.result.pageNumber});
            			that.$(".page-total-num").text(reply.result.pageCount);
            			that.$(".page-data-count").text(reply.result.total);
            			
            		}else{
            			layer.alert(reply.res_message);
            		}
            	});
            },
            /*bindTableButton:function(){
            	var that = this;
            	that.$("#detailtab").delegate(".js-btn_detail","click",function(){
            		var $tr = $(this).parents("tr");
					var msisdn = $tr.attr("id");
					fish.popupView({
						url:"modules/memberManageNew/memberRefresh/views/BusiOrderRelView",
						viewOption:{msisdn:msisdn},
						width:600
					});
            	});
            }*/
        });
        return pageView;
    });
