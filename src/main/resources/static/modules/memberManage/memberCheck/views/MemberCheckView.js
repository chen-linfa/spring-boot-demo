define([ 'hbs!../templates/memberCheck.html'],
		function(temp) {
	var pageView = fish.View.extend({
		template : temp,
		afterRender : function() {
			var that = this;
			that.$("#select_group").combobox({dataSource:[{name:"所有组",value:""}]});
			var option = {
				pagination: false,
				autoFill: false,
				singleSelect: true,//该表格可以多选
				rowId: "prod_code",//指定主键字段
				onSelectClass: "selected",
				nowPage: 1,
				columns: [
					{data: "prod_name", title: "订购组名称", width: "20%"},
					{data: "num", title: "成员数", width: "10%",formatter:function(data){
						return "<a href='javascript:void(0);' class='js-detail'>"+data+"</a>";
					}},
					{data: "open_time", title: "开通时间", width: "10%"}
				],//每列的定义
				//onLoad: me.initTableEvent //表单加载数据后触发的操作
			};
			that.$("#xtab").xtable(option);
			that.bindTableButton();
			//外部分页组件
			that.$('.js-pagination').pagination({
				records : 0,
				pgRecText : false,
				pgTotal : false,
				onPageClick : function(e, eventData) {
					var rowNum = that.$('.js-pagination').pagination("option","rowNum");
					that.queryMemberInfo(eventData.page, rowNum);
				},
				create : function() {
					// 默认不加载
					that.queryMemberInfo(1);
				}
			});
		},
		bindTableButton:function(){
			var that = this;
			//详细查询
			that.$("#xtab").delegate(".js-detail","click",function(){
				var prod_code = $(this).parents("tr").attr("id");
				var prod = that.$("#xtab").xtable("findData","#"+prod_code);
				that.$("#list_view").hide();
				that.$("#detail_view").show();
				that.requireView({
					selector:"#detail_view",
					url:"modules/memberManage/memberCheck/views/InGroupMemberQueryView",
					callback:function(view){
						view.initData(prod);
					}
				});
			});
		},
		changeListDiv:function(){
			var that = this;
			//切换为第一层查询界面，隐藏详细页
			that.$("#detail_view").hide();
			that.$("#list_view").show();
		},
		queryMemberInfo:function(page,rows){
        	var that = this;
        	page = page || 1;
        	rows = rows || 10;
        	
        	var param = {
        		page:page,
        		rows:rows
        	};
        	fish.callService("BusiOrderController", "queryBusiOrderMem",param,function(reply){
        		that.$("#xtab").xtable("loadData",reply.rows);
        		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
        		that.$(".page-total-num").text(reply.pageCount);
        		that.$(".page-data-count").text(reply.total);
        	});
        }
	});
	
	return pageView;
});
