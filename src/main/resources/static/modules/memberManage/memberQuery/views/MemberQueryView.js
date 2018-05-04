define(['hbs!../templates/memberQuery.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "mem_user_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "msisdn", title: "MSISDN（卡号）", width: "20%"},
						{data: "iccid", title: "ICCID", width: "20%"},
						{data: "imsi", title: "IMSI", width: "10%"},
						{data: "card_brand_type", title: "卡品牌", width: "10%",code:"CARD_BRAND_TYPE"},
						{data: "card_status", title: "号码状态", width: "15%",
							code:"CARD_STATUS",formatter:function(data){
							if(data == "正常"){
								return '<span class="states valid">正常</span>';
							}else{
								return '<span class="states invalid">'+data+'</span>';
							}
						}},
						{data: "control", title: "操作", width:"10%",className:"operation", formatter: function(data){
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
					var search_content = $.trim($('#search_input').val());
					var url = "UploadController/exportMemUserInfo.do?search_content="+search_content;
					window.open(url);
				});
				
				that.$("#btn_downloadTemp").click(function(){
					window.open("servlet/downloadExcel?type=mould&mould=msisdn");
				});
				that.clickFileUpload();
				//过滤非法的卡号输入值
	        	that.$('#search_input').bind({
	        		keyup:function(){
//	        			this.value=this.value.replace(/\D/g,'');
	        			this.value=this.value.replace(/[^\w\.\/]/ig,'');
	        		}
	        	});
	        	
	        	that.queryMemberInfo(1);
            },
            clickFileUpload:function(){
            	var that = this;
            	that.$('#cust_mem_info_file').on("change", function(){
					that.FileUpload();
				});
            },
            FileUpload:function(){
            	var that = this;
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
					params_str.upload_type = 'cust_mem_info';
					
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
		    					var exl_message = info.exl_message
		    					layer.alert(exl_message, function(){
		            				window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=cust_mem_info");
		            				layer.closeAll();
		    					});
		    				}else{
		    					layer.alert(data.res_message);
		    				}
		    				that.clickFileUpload();
		       			},
		    			error : function(data) {
		    				layer.alert("操作失败 ！  "+ data.res_message);
		    				that.$("#cust_mem_info_file").val("");
		    				layer.closeAll();
		    				that.clickFileUpload();
		    			}
		    		});
		        	layer.load();
            },
            queryMemberInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	
            	var param = {
            		page:page,
            		rows:rows,
            		search_content:search_content
            	};
            	fish.callService("CustMemController", "queryCustMemberInfo",param,function(reply){
            		console.log(reply);
            		that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	that.$("#xtab").delegate(".js-btn_detail","click",function(){
            		var $tr = $(this).parents("tr");
            		that.$(".js-detail").remove();
            		var $template = that.$("#detail_tr").clone();
            		$template.removeAttr('id').addClass('js-detail');
        			var params = {};
					params.mem_user_id = $tr.attr("id");
					fish.callService("CustMemController", "queryCustMemberDetail", params, function(reply){
						var result = reply.result;
						fish.utils.getAttrCode(["CARD_BRAND_TYPE","CARD_STATUS"],function(code){
							result.used_gprs = fish.utils.unitTranslate(result.used_gprs);
							result.card_brand_type = code["CARD_BRAND_TYPE"][result.card_brand_type];
							result.card_status = code["CARD_STATUS"][result.card_status];
							result.is_orderflows = "否";
							$template.find("span[name]").each(function(){
								var key = $(this).attr("name");
								if(!result[key]){
									result[key] = "";
								}
								$(this).text(result[key]);
							});
						});
					});
            		$tr.after($template);
            	});
            }
        });
        return pageView;
    });
