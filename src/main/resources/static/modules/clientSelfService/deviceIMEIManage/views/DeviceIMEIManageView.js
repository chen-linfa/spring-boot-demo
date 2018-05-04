define(['hbs!../templates/device-IMEI-manage.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "imei",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
                        {data: "mem_user_id", title: "MSISDN（卡号）", width: "20%"},
                        {data: "imei", title: "IMEI", width: "10%"},
                        {data: "card_type", title: "设备类型", width: "15%"},
                        {data: "terminal_type", title: "设备品牌", width: "15%"},
                        {data: "terminal_model", title: "设备型号", width: "15%"},
                        {data: "day_cycle", title: "IMEI记录日期", width: "15%"},
						{data: "control", title: "操作", width:"10%", formatter: function(data){
							//操作列的按钮生成
							var html = '<a href="javascript:void(0);" class="js-btn_detail">展开详情</a>';
							return html;
						}}
					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
				that.$("#xtab").xtable(option);	
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
				
				that.$("#btn_search").click(function(){
					that.queryMemberInfo(1);
				});
				
				that.$("#btn_downloadInfo").click(function(){
					var url = Utils.getContextPath() + "/servlet/downloadExcel?type=mould&mould=imei"
					window.open(url);
				});
				
				that.$("#btn_downloadTemp").click(function(){
					window.open("servlet/downloadExcel?type=mould&mould=msisdn");
				});
				that.initUploadEvent();
				//过滤非法的卡号输入值
	        	that.$('#search_input').bind({
	        		keyup:function(){
	        			this.value=this.value.replace(/\D/g,'');
	        		}
	        	});
            },
            initUploadEvent:function(){
            	var that = this;
            	that.$('#cust_mem_info_file').on("change", function(){
					var fileName = $("#cust_mem_info_file").val();
					that.$("#cust_mem_info_file").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
					var extPattern = /.+\.(xls|xlsx)$/i;
					if($.trim(fileName) != ""){
						if(!extPattern.test(fileName)){
							layer.alert("只能上传EXCEL文件！");
							that.$("#cust_mem_info_file").val("");
							return;
						}
					}
				
					var params_str = {};
					params_str.upload_type = 'trml_info';
					
					var other_params_str = JSON.stringify(params_str);
					var reg = new RegExp('"', "g");
		            var other_params_str = other_params_str.replace(reg, "?");
		            
					var params = {};
					params.params_str = other_params_str;
					
		        	$.ajaxFileUpload({
		    			url : "UploadController/uploadExcel.do",
		    			secureuri : false,
		    			fileElementId : "cust_mem_info_file",
		    			data: params,
		    			dataType : 'json',
		    			success : function(data) {
		    				layer.closeAll();
		    				that.$("#cust_mem_info_file").val("");
		    				if(data.res_code=="00000"){
		    					var info = data.result;
		    					var download_key = info.download_key;
		    					var exl_message = info.exl_message;
		    					if(""!=info.download_key && null!=info.download_key){
				    				var download_key = info.download_key;
									window.open(Utils.getContextPath() + "/UploadController/downloadExcel.do?download_key="+download_key+"&download_type=trml_info");   
				    			}else{
				    				var res_list = info.imei_list
			    					that.$("#xtab").xtable("loadData",res_list);
				    				that.$('.js-pagination').pagination("update",{records:res_list.length,start:"1"});
		    	            		that.$(".page-total-num").text("1");
		    	            		that.$(".page-data-count").text(res_list.length);
				    			}
		    				}else{
		    					layer.alert(data.res_message);
		    				}
		       			},
		    			error : function(data) {
		    				layer.alert("操作失败 ！  "+ data.res_message);
		    				that.$("#cust_mem_info_file").val("");
		    				layer.closeAll();
		    			}
		    		});
		        	layer.load();
		        	that.initUploadEvent();
				});
            },
            queryMemberInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	
            	if(!search_content){
            		layer.alert("请输入查询条件！");
            		return;
            	}
            	
            	var param = {
            		page:page,
            		rows:rows,
            		search_content:search_content
            	};
            	fish.callService("TrmlMgrController", "getTrmlList", param, function(reply){
            	//	console.log(reply);
            		that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	var page = 1;
            	var rows =  10;
            	that.$("#xtab").delegate(".js-btn_detail","click",function(){
            		var $tr = $(this).parents("tr");
            		that.$(".js-detail").remove();
            		var $template = that.$("#detail_tr").clone();
            		$template.removeAttr('id').addClass('js-detail');
            		$tr.after($template);
					var imei = $(this).parents("tr").attr("id");
                	var curresult = that.$("#xtab").xtable("findData","#"+imei);
                	//console.log(curresult);
					that.$("#IMEI").text(curresult.imei);
					that.$("#day_cycle").text(curresult.day_cycle);
					that.$("#tac").text(curresult.tac?curresult.tac:"");
					that.$("#snr").text(curresult.snr?curresult.snr:"");
					that.$("#cd_sd").text(curresult.cd_sd?curresult.cd_sd:"");
					that.$("#type").text(curresult.card_type?curresult.card_type:"");
					that.$("#terminal_name").text(curresult.terminal_type?curresult.terminal_type:"");
					that.$("#terminal_model").text(curresult.terminal_model?curresult.terminal_model:"");
					fish.utils.getAttrCode("IMEI",function(code){
						
						//console.log(code);
					});
            	});
            }
        });
        return pageView;
    });
