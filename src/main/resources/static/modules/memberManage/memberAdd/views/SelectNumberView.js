define(['hbs!../templates/selectNumber.html'],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.cache_key = "";

                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "msisdn",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "msisdn", title: "MSISDN", width: "10%"},
						{data: "opening_date", title: "开户时间", width: "25%",formatter:function(data){
                            if(data=="null")
                                return "";
                            else return data;
                        }},
						{data: "control", title: "操作", width: "10%",formatter:function(){
							//操作列的按钮生成
							var html = '<a href="javascript:void(0);" class="js-btn_cancel">取消</a>';
							return html;
						}}
					],//每列的定义
					//onLoad: fish.bind(that.tableStyling,that) //表单加载数据后触发的操作
				};
				that.$("#addtab").xtable(option);	
				that.bindTableButton();
             that.$('.js-pagination').pagination({
                 records: 0,
                 pgInput:false,
                 pgRecText:false,
                 pgTotal:false,
                onPageClick:function(e,eventData){
                	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                	that.queryNewMemsFromCache(eventData.page,rowNum);
                },
                create:function(){
                	//默认加载
                	that.queryNewMemsFromCache(1);
                }
             });
            //过滤非法的卡号输入值
            that.$('#new_mem_num').bind({
                keyup:function(){
                    this.value=this.value.replace(/\D/g,'');
                }
            });
             that.$(".js-btn_back").click(function(){
            	that.parentView.controlDivChange(0); 
             });
             
             that.$("#btn_nextstep").click(function(){
            	var new_mem_list = that.$("#addtab").xtable("getData");
            	if(new_mem_list.length == 0){
            		layer.alert("请先选择成员！");
            		return
            	}
            	that.parentView.order_info.new_mem_list = new_mem_list;
            	that.parentView.order_info.cache_key = that.cache_key;
            	that.parentView.controlDivChange(2,{cache_key:that.cache_key}); 
             });
             
             that.$("#btn_add").click(function(){
            	var params = {};
                params.msisdn = $.trim(that.$("#new_mem_num").val());
                params.add_type = "0"; //单个筛选，与上传批量的区分开来
                params.cache_key = that.cache_key; //缓存key 
                fish.callService("BusiOrderController", "addNewMemToCache", params,function(data) {
                    if (data.res_code == '00000') {
                        if (data.result.code == "00000") {
                            that.cache_key = data.result.cache_key;
                            that.queryNewMemsFromCache();
                        } else {
                            layer.alert(data.result.msg);
                        }
                    } else {
                        layer.alert("服务内部错误！");
                    }
                });
             });
            //上传附件
            that.initUploadEvent();
             
            //下载模板按钮
            that.$("#templ_download_btn").click(function() {
                window.location.href = "servlet/downloadExcel?type=mould&mould=new_mem_user";
            });
		},
        initUploadEvent:function(){
            //附件上传
            var that = this;
            that.$('#new_mem_user_file').unbind().on('change',function() {
                var fileName = that.$("#new_mem_user_file").val();
                var extPattern = /.+\.(xls|xlsx)$/i;
                if ($.trim(fileName) != "") {
                    if (!extPattern.test(fileName)) {
                        layer.alert("只能上传EXCEL文件！");
                        that.$("#new_mem_user_file").val("");
                        return;
                    }
                }
                var params_str = {};
                params_str.upload_type = 'new_mem_user_add';
                params_str.cache_key = that.cache_key;
                params_str.busi_type = "add";
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");

                var params = {};
                params.params_str = other_params_str;

                $.ajaxFileUpload({
                    url: "UploadController/uploadExcel.do",
                    secureuri: false,
                    fileElementId: "new_mem_user_file",
                    data: params,
                    dataType: 'json',
                    success: function(data, status) {
                        layer.closeAll();
                        that.$("#new_mem_user_file").val("");
                        //debugger;
                        if (data.res_code == "00000") {
                            if (data.result.code == "00000") {
                                that.cache_key = data.result.cache_key;
                                that.queryNewMemsFromCache();
                            } else {
                                layer.alert(data.result.msg);
                            }
                        } else {
                            layer.alert(data.res_message);
                        }
                        that.initUploadEvent();
                    },
                    error: function(data, status, e) {
                        layer.alert("操作失败");
                        that.initUploadEvent();
                        that.$("#msg_file").val("");
                        layer.closeAll();
                    }
                });
                layer.load();
            });
        },
		bindTableButton:function(){
			var that = this;
        	that.$("#addtab").delegate(".js-btn_cancel","click",function(){
        		//取消
        		var params = {};
                params.msisdn = $(this).parents("tr").attr("id");
                params.cache_key = that.cache_key; //缓存key
                params.busi_type = "add";
                params.group_id = that.parentView._group_id;
                fish.callService("BusiOrderController", "dropTempMem", params, function(data){
                    if(data.res_code == '00000'){
                    	that.queryNewMemsFromCache();
                    }else{
                    	layer.alert(data.res_message);
                    }
                });
        	});
		},
		queryNewMemsFromCache:function(page,rows){
			var that = this;
			var params = {};
            params.page = page ? page: 1;
            params.rows = rows ? rows: 10;
            params.cache_key = that.cache_key?that.cache_key:"";
            fish.callService("BusiOrderController", "queryNewMemsFromCache", params,function(reply){
            	if(reply){
            		that.$("#addtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	}
            });
		}
	});
    return pageView;
});
