define(['hbs!../templates/memberAdd.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            offer_inst_id :'',
            afterRender: function () {
                var that = this;
                
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,
					rowId: "offer_inst_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "prod_name", title: "订购组名称", width: "20%"},
                        {data: "offer_inst_id", title: "策划实例编号", width: "20%"},
						{data: "num", title: "成员数", width: "20%"},
						{data: "open_time", title: "开通时间", width: "20%"},
						{data: "control", title: "操作", width:"20%",formatter: function(data){
							//操作列的按钮生成
							var html = '<a href="javascript:void(0);" class="js-btn_add">成员添加</a>';
							return html;
						}}
					],//每列的定义
					onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
				};
				that.$form_table= that.$("#xtab").xtable(option);
				that.bindTableButton();
                
                that.$('.js-pagination').pagination({
                	records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.queryRelatedGroup(eventData.page,rowNum);
                    },
                    create:function(){
                    	that.queryRelatedGroup(1);
                    }
                });
                
                
            },
            queryRelatedGroup:function(page,rows){
            	//查询订购组
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	
            	var param = {
            		page:page,
            		rows:rows
            	};
            	fish.callService("BusiOrderNewController", "queryRelatedGrouptList",param,function(reply){
            		that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	that.$("#xtab").delegate(".js-btn_add","click",function(){
            		that.order_info = new Object();
            		var _group_id = $(this).parents("tr").attr("id");
            		var data = that.$form_table.xtable("findData","#"+_group_id);
            		that.order_info.group = new Object();
            		that.order_info.group.group_id = _group_id;
            		that.offer_inst_id = data.offer_inst_id;
            		that.controlDivChange(1);
            	});
            },
            tableStyling:function(){
            	var that = this;
            	//DATATABLE的classname是包括表头的，故自行设定表列样式
            	that.$("#xtab").find("tr").each(function(){
            		$(this).children("td").eq(1).addClass("text-brand-primary");
            		$(this).children("td").eq(2).addClass("text text-weaker-color");
            	});
            },
            controlDivChange:function(phase,param){
            	var that = this;
            	if(phase && phase != 0){
            		that.$(".js-list_div").hide();
            		that.$(".js-controldiv").show();
            	}
            	switch(phase){
            	case 0:
            		that.$(".js-controldiv").hide();
            		that.$(".js-list_div").show();
            		break;
            	case 1:
            		//1:选号码
            		that.requireView({
            			selector:".js-controldiv",
            			url:"modules/memberManageNew/memberAdd/views/SelectNumberView",
            			viewOption:param
            		});
            		break;
            	case 2:
            		//2:选套餐
            		var params = {};
            		params.offer_inst_id = that.offer_inst_id;
            		that.requireView({
            			selector:".js-controldiv",
            			url:"modules/memberManageNew/memberAdd/views/SelectSetMealView",
            			viewOption:params
            		});
            		break;
            	case 3:
            		//3:完成
            		that.requireView({
            			selector:".js-controldiv",
            			url:"modules/memberManageNew/memberAdd/views/FinishView",
            			viewOption:param
            		});
            		break;
            	default:
            	}
            }
        });
        return pageView;
    });
