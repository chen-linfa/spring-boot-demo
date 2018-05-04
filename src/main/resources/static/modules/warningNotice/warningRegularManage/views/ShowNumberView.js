define(["hbs!../templates/shownumberpop.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            
            var title = {
            	mem_list:"已选号码列表",
            	cust_list:"已选集团编码列表",
            	phone_list:"已选短信号码列表",
            	imei_pool:"已选IMEI列表"
            };
            that.$(".modal-title").text(title[that.options.para_code]);
            var num_text = {
            	mem_list:"号码",
            	cust_list:"集团编码",
            	phone_list:"短信号码",
            	imei_pool:"IMEI"
            };
            
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
					rowId: "para_value",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "para_value", title: num_text[that.options.para_code]},
					]//每列的定义
				};
            that.$data_list = that.$("#numbertab").xtable(option);	
			that.queryNumber();
//            that.$('.js-pagination').pagination({
//                records:0,
//                rowList:[],
//                pgRecText:false,
//                    pgTotal:false,
//                    onPageClick:function(e,eventData){
//                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
//                    	that.queryNumber(eventData.page,rowNum);
//                    },
//                    create:function(){
//                    	//默认加载
//                    	that.queryNumber(1);
//                }
//            });

        },
        onClosePupup: function () {
            this.popup.close();
        },
        queryNumber:function(){
        	var that = this;
        	page = 1;
        	rows = 10000;
        	
        	var param = that.options;
        	param.page = page;
        	param.rows = rows;
        	
        	fish.callService("RulesConfigurationController", "queryUploadList", param, function(reply){
        		console.log(reply);
        		that.$data_list.xtable("options",{pageSize:reply.pageSize});
        		that.$("#numbertab").xtable("loadData",reply.rows);
        		
//            	that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
//            	that.$(".page-total-num").text(reply.pageCount);
//            	that.$(".page-data-count").text(reply.total);
        	});
        }

    });

    return components;
});
