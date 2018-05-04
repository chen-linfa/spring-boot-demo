define(["hbs!../templates/jobdetail.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
    	editmode:"",
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        loadData:function(data,mode){
        	var that = this;
        	that._data = data;
        	that.$("form").form("value",data);
        	that.$("form").form("disable");
        	that.$("#btn_confirm").text("修改");
        	that.$(".modal-title").text("定时任务详情");
        },
        afterRender: function () {
            var that = this;
            if("edit"==that.options.type){
            	 that.loadData(that.options,true);
            }
           
            that.$("[name=trigger_state]").combobox({
                    attr_code:"TRIGGER_STATE",
                    dataSource: [{name: '全部', value: ''}]
            });
			that.$("#cron_tip").click(function(){
				  layer.alert(that.$("#cron_tip_div").html(),{title:"时间表达式示例"});
			});
            that.$("#btn_confirm").click(function(){
            	
            	if(that._data && !that.editmode){
            		that.$("form").form("enable",["trigger_state","job_class_name"]);
            		that.editmode = true;
            		$(this).text("保存");
            		return;
            	}
            	//如果是编辑模式，那么先获取原来的记录数据（_data存在），然后与填写的内容作合并
            	var params = that._data?that._data:{};
            	
            	$.extend(params,that.$("form").form("value"));

            	if(!params.job_info_name){
            		layer.alert("任务名不能为空！");
            		return;
            	}
            	
            	if(!params.cron_expression){
            		layer.alert("时间表达式不能为空！");
            		return;
            	}
            	
            	if(!params.job_class_name){
            		layer.alert("任务执行类不能为空！");
            		return;
            	}
            	
            	fish.callService("JobController", "saveJobInfo", params, function(data){
            		if(data.res_code == "00000"){
						that.popup.close();
						layer.alert("操作成功！");
						that.parentView.queryData();
					}else {
						if(!_.isEmpty(data.result)){
							_.each(data.result,function(msg){
								layer.alert(msg);
								return false;
							});
						}else{
							layer.alert("操作失败，请重试！");
						}
					}
				});
            });
        },
        onClosePupup: function () {
            this.popup.close();
        }
    });

    return components;
});
