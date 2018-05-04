define(['hbs!modules/clientSelfService/cardActivate/templates/cardActivate.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                that.$('.js-pagination').pagination({
                    records: 100
                });
                that.initClk();
				that.$("#btn_downloadInfo").click(function(){
					var url = "servlet/downloadExcel?type=mould&mould=card";
					window.open(url);
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
					params_str.upload_type = 'card_active';
					
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
							layer.alert(data.res_message);
		    				layer.closeAll();
		    				that.$("#cust_mem_info_file").val("");
		    				if(data.res_code=="00000"){
		    					var info = data.result;
		    					var exl_message = info.exl_message
		        				layer.alert(exl_message);

		    				}else{
								layer.alert("只适用于Excel文件");
		    				}
		       			},
		    			error : function(data) {
		    				//layer.alert("操作失败 ！  "+ data.res_message);
							layer.alert(data.res_message);
		    				that.$("#cust_mem_info_file").val("");
		    				layer.closeAll();
		    			}
		    		});
		        	layer.load();
		        	that.initUploadEvent();
				});
     		},
        	initClk : function(){
        		
        		var me = this;
        		//me.initUploadEvent();
        		//dropDown.initSelectDropDown($(".from-list-hd"));
        		$("#card_search").unbind("click").bind("click",function(){
        			me.queryCard();
        		});

        		//点击暂停
        		$("#active_gprs").unbind("click").bind("click",function(){
        			me.resetCardState();
        		});
        		

        		
        		//批量激活模板下载 
        		$("button[name='batch_gprs_temp']").unbind("click").bind("click",function(){
        			window.open("servlet/downloadExcel?type=mould&mould=card");                 
        		});
        		
        		
        		
        	},
        	//重置卡状态，激活卡（停用卡暂时不需要）,msisnList要激活的卡号，state 1激活，0停用
        	resetCardState : function(){
        		
        		var me = this;
        		var msisdn = $("[name='misidn_num']").val();
        		if(msisdn == '请输入卡号'){
        			msisdn = '';
        		}
        		if(msisdn == ''){
        			layer.alert('请输入卡号');
        			return ;
        		}
        		if(!/^[1-9][0-9]*$/.test(msisdn)){
        			layer.alert("卡号格式错误");
        			return;
        		}
        	
        		var result = {};
        		var params = {};
        		params.msisdn = msisdn;
        		layer.load();
        		fish.callService("CustBusinessContrller", "resetGPRSState", params, function(data) {
        			layer.closeAll();
        			if (data.res_code == "00000") {
        				layer.alert(data.res_message);
        			}
        			else{
        				layer.alert(data.res_message);
        			}
        		});
        	},
        });
        return pageView;
    });
