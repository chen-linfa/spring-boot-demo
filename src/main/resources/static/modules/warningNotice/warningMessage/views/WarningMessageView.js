define(['hbs!../templates/warning-message.html'],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.queryWarnType();
            that.autoHeight();
            that.$(".js-start_date,.js-end_date").datetimepicker({
            	viewType:"date"
            });
            that.$("#btn_search").click(function(){
            	that.queryWarnMessage(1);
            });
            that.$("#btn_export").click(function(){
            	var param = that.$("form").form("value");
            	param.cat_code = param.cat_code || "";
            	param.start_time = param.start_time || "";
            	param.end_time = param.end_time || "";
            	window.open("UploadController/exportWarningInfo.do?start_time="+param.start_time
				+"&end_time=" + param.end_time + "&cat_code=" + param.cat_code);
            });
            
            //外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    rowList:[],
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.queryWarnMessage(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	that.queryWarnMessage(1);
                    }
                });
		},
		queryWarnType:function(){
			var that = this;
			fish.callService("RulesConfigurationController", "getRulesTplCat", {}, function(result){
				if(result.res_code == "00000"){
					var data = result.result;
		            that.$("input[name=cat_code]").combobox({
		            	placeholder:"选择告警类型",
		            	dataSource:data,
		            	dataTextField:"cat_name",
		            	dataValueField:"cat_code"
		            });
				}else{
					layer.alert(result.res_message);
				}
			});
		},
		queryWarnMessage:function(page,rows){
			var that = this;
			//查询告警信息
			page = page || 1;
			rows = rows || 10;
			var param = that.$("form").form("value");
			param.page = page;
			param.rows = rows;
			
			that.$("#warnmsg_list").empty();
			fish.callService("RulesInstanceDataController","queryWarningInfoByMonth",param,function(reply){
				if(reply.result){
					that.$('.js-pagination').pagination("update",{records:reply.result.total,start:reply.result.pageNumber});
					that.$(".page-total-num").text(reply.result.pageCount);
					that.$(".page-data-count").text(reply.result.total);
					if($.isArray(reply.result.rows)){
						var rows = reply.result.rows;
						_.each(rows,function(item){
							var $li = that.$("#detail-li").clone();
							_.each(item,function(val,key){
								$li.find("span[name="+key+"],a[name="+key+"],div[name="+key+"]").text(val);
							});
							that.$("#warnmsg_list").append($li);
						});
					}
				}
			});
		},
		autoHeight:function()
		{
		  var $width = window.screen.width;
		  $("#d1").css("width",$width);
		}
		
	});
    return pageView;
});