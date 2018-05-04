define(['hbs!../templates/ingroupmemberquery.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            initData:function(data){
            	this.options = data;
            	this.queryMemberInfo(1);
            },
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
						{data: "msisdn", title: "MSISDN（卡号）", width: "30%"},
						{data: "prod_name", title: "订购组", width: "30%"},
						{data: "open_time", title: "开户时间", width: "20%"},
						{data: "control", title: "操作", width:"20%", formatter: function(data){
							//操作列的按钮生成
							var html = '<a href="javascript:void(0);" class="js-btn_detail">订购关系</a>';
							return html;
						}}
					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
				that.$("#detailtab").xtable(option);	
				that.bindTableButton();
				
				//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.queryMemberInfo(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	//that.queryMemberInfo(1);
                    }
                });
				//过滤非法的卡号输入值
                that.$('#search_input').bind({
                    keyup:function(){
                        this.value=this.value.replace(/\D/g,'');
                    }
                });
				that.$("#btn_search").click(function(){
					that.queryMemberInfo(1);
				});
				
				//返回按钮
				that.$(".js-btn_back").click(function(){
					that.parentView.changeListDiv();
				});
            },
            queryMemberInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	
            	var param = {
            		offer_inst_id:that.options.offer_inst_id,
            		prod_code:that.options.prod_code,
            		prod_name:that.options.prod_name,
            		page:page,
            		rows:rows,
            		msisdn:search_content
            	};
            	fish.callService("BusiOrderController", "queryMemList",param,function(reply){
            		that.$("#detailtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	that.$("#detailtab").delegate(".js-btn_detail","click",function(){
            		var $tr = $(this).parents("tr");
					var msisdn = $tr.attr("id");
					fish.popupView({
						url:"modules/memberManage/memberCheck/views/BusiOrderRelView",
						viewOption:{msisdn:msisdn},
						width:600
					});
            	});
            }
        });
        return pageView;
    });
