define(["hbs!../templates/showresultpop.html"
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
					singleSelect: true,
					rowId: "object_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "object_id", title: "成员号码"},
						{data: "data_content", title: "告警内容"},
					]//每列的定义
				};
            that.$data_list = that.$("#numbertab").xtable(option);	
            
            that.$('.js-pagination').pagination({
                records:0,
                rowList:[],
                pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.$data_list.xtable("options",{pageSize:rowNum});
                    	that.queryNumber(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认加载
                    	that.queryNumber(1);
                }
            });

        },
        onClosePupup: function () {
            this.popup.close();
        },
        queryNumber:function(page,rows){
        	var that = this;
        	page = page || 1;
        	rows = rows || 10;
        	
        	var param = {};
        	param.page = page;
        	param.rows = rows;
        	param.cfg_id = that.options.cfg_id;
        	param.time = that.options.time;
        	fish.callService("RulesInstanceDataController", "queryTriggerResultInfo", param, function(reply){
        		console.log(reply);
        		that.$("#numbertab").xtable("loadData",reply.rows);
            	that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            	that.$(".page-total-num").text(reply.pageCount);
            	that.$(".page-data-count").text(reply.total);
        	});
        },
		initData : function(){
        	console(that.options);
		}
    });

    return components;
});
