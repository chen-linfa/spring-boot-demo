define(["hbs!../templates/busiorderrel.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                        - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            var option = {
				pagination: false,
				autoFill: false,
				singleSelect: true,//该表格可以多选
				rowId: "mem_user_id",//指定主键字段
				onSelectClass: "selected",
				nowPage: 1,
				columns: [
					{data: "mem_user_id", title: "MSISDN（卡号）", width: "25%"},
					{data: "prod_name", title: "产品套餐", width: "25%"},
					{data: "eff_date", title: "生效时间", width: "20%"},
					{data: "exp_date", title: "失效时间", width: "20%"}
				],//每列的定义
				//onLoad: me.initTableEvent //表单加载数据后触发的操作
			};
			that.$("#curr_table").xtable(option);
			that.$("#next_table").xtable(option);
            
            that.$('.js-curr_pagination').pagination({
                records:0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                	var rowNum = that.$('.js-curr_pagination').pagination("option","rowNum");
                	that.queryCurrentRel(eventData.page,rowNum);
                },
                create:function(){
                	//默认不加载
                	that.queryCurrentRel(1);
                }
            });
            that.$('.js-next_pagination').pagination({
                records:0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                	var rowNum = that.$('.js-next_pagination').pagination("option","rowNum");
                	that.queryNextRel(eventData.page,rowNum);
                },
                create:function(){
                	//默认不加载
                	that.queryNextRel(1);
                }
            });
            
            that.$('.js-search-tabs').tabs();
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        queryCurrentRel:function(page,rows){
        	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	
            	var param = {
            		page:page,
            		rows:rows,
            		msisdn:that.options.msisdn,
            		type:"current"
            	};
            	fish.callService("BusiOrderController", "queryBusiOrderRel",param,function(reply){
            		that.$("#curr_table").xtable("loadData",reply.rows);
            		that.$('.js-curr_pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".js-curr_total").text(reply.pageCount);
            		that.$(".js-curr_count").text(reply.total);
            	});
        },
        queryNextRel:function(page,rows){
        	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	
            	var param = {
            		page:page,
            		rows:rows,
            		msisdn:that.options.msisdn,
            		type:"current"
            	};
            	fish.callService("BusiOrderController", "queryMemList",param,function(reply){
            		that.$("#next_table").xtable("loadData",reply.rows);
            		that.$('.js-next_pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".js-next_total").text(reply.pageCount);
            		that.$(".js-next_count").text(reply.total);
            	});
        }
    });

    return components;
});
