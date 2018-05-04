define(['hbs!../templates/batchRealtimePositioning.html',
    ], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.downLoad();
                that.setUploadFileEvent();
            },
            downLoad:function(){
            	this.$("button[name='templ_download_btn']").click(function() {
				window.location.href ="servlet/downloadExcel?type=mould&mould=location_realtime";
			});
            },
            setUploadFileEvent:function(){
				var me = this;
				//附件上传
				me.$('#loc_realtime_file').on('change',function(){
					var fileName = me.$("#loc_realtime_file").val();
					var extPattern = /.+\.(xls|xlsx)$/i;
					if($.trim(fileName) != ""){
						if(!extPattern.test(fileName)){
							me.$(".js-error").show();
							me.$(".js-error").siblings().hide();
							me.$("#loc_realtime_file").val("");
							return;
						}
					}
					var params_str = {};
					params_str.upload_type = 'loc_realtime';
					
					var other_params_str = JSON.stringify(params_str);
					var reg = new RegExp('"', "g");
		            var other_params_str = other_params_str.replace(reg, "?");
		            
					var params = {};
					params.params_str = other_params_str;
					
		        	$.ajaxFileUpload({
		        		url : "UploadController/uploadExcel.do",
		    			secureuri : false,
		    			fileElementId : "loc_realtime_file",
		    			data: params,
		    			dataType : 'json',
		    			success : function(data) {
		    				layer.closeAll();
		    				me.$("#loc_realtime_file").val("");
		    				if(data.res_code=="00000"){
		    					console.log(data);
		    					var info = data.result;
		    					var download_key = info.download_key;
		    					var exl_message = info.exl_message
		    					// layer.alert(exl_message, function(){
		    					// 	window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=loc_realtime");
		    					// });
		    					me.$(".js-success").siblings().hide();
		    					me.$(".js-success").show();
		    					window.open("UploadController/downloadExcel.do?download_key="+download_key+"&download_type=loc_realtime");

		    				}else{
		    					layer.alert(data.res_message);
		    					// me.$(".js-succ-num").html();
		    					// me.$(".js-fail-num").html();
		    					// me.$(".js-valid-num").html();
		    					// me.$(".js-success").siblings().hide();
		    					// me.$(".js-success").show();
		    				}
		       			},
		    			error : function(data) {
		    				layer.alert("操作失败   " + data.res_message);
	    					me.$("#loc_realtime_file").val("");
	    					layer.closeAll();

		    			}
		    		});
		        	layer.load();
		        	me.setUploadFileEvent();
		        });
			},
        });
        return pageView;
    });
