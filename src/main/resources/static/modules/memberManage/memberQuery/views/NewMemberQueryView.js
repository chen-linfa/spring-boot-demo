define(['hbs!../templates/newMemberQuery.html'], function (temp) {
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
						{data: "msisdn", title: "MSISDN（卡号）"},
						{data: "iccid", title: "ICCID"},
						{data: "apn", title: "ICCID" ,visible:false},
						{data: "imsi", title: "IMSI"},
						{data: "card_brand_type", title: "卡品牌",code:"CARD_BRAND_TYPE",formatter:function(data){
							return data ;
						}},
						{data: "card_status", title: "卡状态",
							code:"CARD_STATUS",formatter:function(data){
							if(data == "正常"){
								return '<span class="text-success">正常</span>';
							}else if(data =="停机" || data =="单向停机"){
								return '<span class="text-danger">'+data+'</span>';
							}else if(data =="测试期" || data =="沉默期" || data =="待激活" || data =="预销号"){
								return '<span class="text-warning">'+data+'</span>';
							}
							else{
								return '<span class="text-weaker-color">'+data+'</span>';
							}
						}},
						{data: "gprs_online_status", title: "在线",formatter:function(data){
							if(data == "00"){
								return '<span class="states invalid">' +"离线"+'</span>';
							}else if(data =="01"){
								return '<span class="states invalid">' +"在线"+'</span>';
							}else{
								return "";
							}
						}},
						{data: "flow", title: "本月使用流量"},
						{data: "isOverFlow", title: "到达阀值",formatter:function(data){
							if(data == "是"){
								return '<span class="text-danger">'+data+'</span>';
							}else if(data == "否"){
								return '<span class="text-success">'+data+'</span>';
							}else{
								return '';
							}
						}},
						{data: "balance", title: "余额"},
						{data: "bill_fee", title: "当月话费"},
						 {data: "control", title: "操作", width:"5%", formatter: function(data){
	                            //操作列的按钮生成
	                            var html ='<div class="btn-group pull-right">';
	                            html += '<button data-toggle="dropdown" class="js-dropdownMenu2" type="button">';          
	                            html += '<i class="ico-pull-down"></i></button>';
	                            html += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenu2">';
	                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="js-btn_detail" >详情</a></li>';
	                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="js-btn_actice">激活卡状态</a></li>';
	                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="js-btn_diagnose">诊断此号码</a></li></ul></div>';
	                            return html;
	                        }}
					],//每列的定义
					onLoad: fish.bind(that.bindTableButton,that) //表单加载数据后触发的操作
				};
				that.$data_list = that.$("#xtab").xtable(option);
//				that.bindTableButton();
				
				//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.$data_list.xtable("options",{pageSize:rowNum});
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
	        			//保留数字和字母
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
            	var param = {};
            	param.page = page ? page : 1;
                param.rows = rows ? rows : 10;
            	var search_content = $.trim($('#search_input').val());
            	var num = "";
            	param.search_content = search_content;
            	var info = new Array();
            	var a = {};
            	fish.callService("CustMemController", "queryCustMemberInfo",param,function(reply){
            		if(reply){
            			that.$("#xtab").xtable("loadData",reply.rows);
                		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
                		that.$(".page-total-num").text(reply.pageCount);
                		that.$(".page-data-count").text(reply.total);
                		that.$("#xtab").find("tr").each(function(index,ele){
                			if(index>0){
                				var thisdata = that.$data_list.xtable("findData","#"+$(ele).attr("id"));
                				var params = {};
                    			params.msisdn = thisdata.msisdn;
                    			params.card_brand_type = thisdata.card_brand_type;
                    			fish.callService("CustMemController", "queryCustMemberSpecInfo",params,function(result){
                    				if(result.res_code=="40000"){
                    					if(result.result.flow!=null&&result.result.flow!=""){
                        					thisdata.flow = fish.utils.unitTranslate2(result.result.flow);
                    					}
                    					thisdata.isOverFlow = result.result.isThreshold;
                    					that.$data_list.xtable("updateData",thisdata);
                    				}else{
                    					if(thisdata.card_brand_type=='1'){
                        					thisdata.gprs_online_status = result.result.onlineStatus;
                        					if(result.result.card_status != "" && result.result.card_status!=null){
                            					thisdata.card_status = result.result.card_status;
                            				}
                        				}
                        				thisdata.isOverFlow = result.result.isThreshold;
                        				thisdata.apn = result.result.apn;
                        				thisdata.balance = result.result.balance;
                        				if(result.result.flow!=null&&result.result.flow!=""){
                        					thisdata.flow = fish.utils.unitTranslate2(result.result.flow);
                    					}
                        				thisdata.bill_fee = result.result.bill_fee;
                        				that.$data_list.xtable("updateData",thisdata);
                    				}
                    				
                    			});
                			}
                		});
            		}
            		
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	 that.$data_list.find("tr").each(function(){
                     $(this).children("td").eq(10).addClass("operation");
                 });
            	that.$("#xtab").delegate(".js-btn_detail","click",function(){
            		var $tr = $(this).parents("tr");
            		that.$(".js-detail").remove();
            		var $template = that.$("#detail_tr").clone();
            		$template.removeAttr('id').addClass('js-detail');
        			var params = {};
					params.mem_user_id = $tr.attr("id");
					var thisdata = that.$data_list.xtable("findData","#"+$tr.attr("id"));
					fish.callService("CustMemController", "queryCustMemberDetail", params, function(reply){
						var result = reply.result;
						fish.utils.getAttrCode(["CARD_BRAND_TYPE","CARD_STATUS"],function(code){
							result.used_gprs = fish.utils.unitTranslate2(result.used_gprs);
							result.card_brand_type = code["CARD_BRAND_TYPE"][result.card_brand_type];
							result.card_status = code["CARD_STATUS"][result.card_status];
							result.apn = thisdata.apn;
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
            	
            	that.$("#xtab").delegate(".js-btn_actice","click",function(){
            		var $tr = $(this).parents("tr");
					var thisdata = that.$data_list.xtable("findData","#"+$tr.attr("id"));
					var params = {};
	        		params.msisdn = thisdata.msisdn;
	        		if(thisdata.card_status=="4" || thisdata.card_status =="未激活"){
	        			fish.callService("CustBusinessContrller", "resetGPRSState", params, function(data) {
		        			if (data.res_code == "00000") {
		        				layer.alert(data.res_message);
		        			}
		        			else{
		        				layer.alert(data.res_message);
		        			}
		        		});
	        		}else{
	        			layer.alert("请您选择卡状态为沉默期或者休眠状态的物联卡进行激活！");
	        		}
            	});
            	
            	that.$("#xtab").delegate(".js-btn_diagnose","click",function(){
            		var $tr = $(this).parents("tr");
					var thisdata = that.$data_list.xtable("findData","#"+$tr.attr("id"));
            		 var viewURL = "modules/memberManage/oneKeyDiagnose/views/OneKeyDiagnoseView";
                     that.parentView.openView(viewURL,thisdata.msisdn);
            	});
            	
            	 that.$(".js-dropdownMenu2").click(function(){
                     if($(this).children(".ico-pull-down").hasClass("active")){
                         $(this).parents(".btn-group").removeClass("open");
                         $(this).children(".ico-pull-down").removeClass("active");
                     }else{
                         that.$(".btn-group").removeClass("open");
                         that.$(".ico-pull-down").removeClass("active");
                         $(this).parents(".btn-group").addClass("open");
                         $(this).children(".ico-pull-down").addClass("active");
                     }
                     
                 })
            }
        });
        return pageView;
    });
