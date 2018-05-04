define(['hbs!modules/clientSelfService/cancelTheCard/templates/cancelTheCard.html'], function (temp) {
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
					params_str.upload_type = 'cancel_the_card';
					var other_params_str = JSON.stringify(params_str);
					var reg = new RegExp('"', "g");
		            var other_params_str = other_params_str.replace(reg, "?");
					var params = {};
					params.params_str = other_params_str;
		        	layer.load();
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
								layer.alert(data.res_message + "。正在进行批量卡销户，请稍后！");
		    				}else if(data.res_message == "" || data.res_message == undefined || data.res_message == null){
								layer.alert("批量卡销户失败！");
		    				}else{
								layer.alert(data.res_message);
		    				}
		       			},
		    			error : function(data) {
		    				layer.closeAll();
		    				that.$("#cust_mem_info_file").val("");
		    				if(data.res_message == "" || data.res_message == undefined || data.res_message == null){
								layer.alert("批量卡销户失败！");
		    				}else{
								layer.alert(data.res_message);
		    				}
		    			}
		    		});
		        	that.initUploadEvent();
				});
     		},
        	initClk : function(){
        		var that = this;
        		//点击事件 卡销户
        		$("#cancel_button").unbind("click").bind("click",function(){
        			that.cancelTheCard();
        		});
        		
        		//批量激活模板下载 
        		$("button[name='batch_gprs_temp']").unbind("click").bind("click",function(){
        			window.open("servlet/downloadExcel?type=mould&mould=card");                 
        		});
        	},
        	cancelTheCard : function(){
        		var msisdn = $("[name='misidn_num']").val();
        		if(msisdn == '请输入卡号' || msisdn == '' || msisdn == undefined){
        			layer.alert('请输入卡号');
        			return ;
        		}
        		if(!/^[1-9][0-9]*$/.test(msisdn)){
        			layer.alert("卡号格式错误");
        			return;
        		}
        		var params = {};
        		params.msisdn = msisdn;
        		layer.load();
        		fish.callService("CustBusinessContrller", "cancelTheCard", params, function(data) {
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
