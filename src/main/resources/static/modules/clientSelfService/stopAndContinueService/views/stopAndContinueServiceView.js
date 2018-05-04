define(['hbs!modules/clientSelfService/stopAndContinueService/templates/stopAndContinueService.html',], function (temp) {
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
					var url =  "servlet/downloadExcel?type=mould&mould=stop_continue_service";
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
                            layer.alert("只适用于Excel文件");
                            that.$("#cust_mem_info_file").val("");
                            return;
                        }
                    }
                
                    var params_str = {};
                    params_str.upload_type = 'stop_continue_service';
                    
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
//                            layer.alert(data.res_message);
                            layer.closeAll();
    
                            
                            that.$("#cust_mem_info_file").val("");
                            if(data.res_code=="00000"){
                                var info = data.result;
                                var download_key = info.download_key;
                                var exl_message = info.check_re_map.exl_message
                                layer.alert(exl_message, function(index){
                                    window.open( "UploadController/downloadExcel.do?download_key="+download_key+"&download_type=stop_continue_service");
                                    layer.close(index);
                                });
                            }else{
                                layer.alert(data.res_message);
                                
                            }
                        },
                        error : function(data) {
                            layer.alert(data.res_message);
                            that.$("#cust_mem_info_file").val("");
                            layer.closeAll();
                        }
                    });
                    layer.load();
                    that.initUploadEvent();
                });
            },
        	queryCard : function(pageNum,pageRow){
        		
        		var me = this;
        		var msisdn = $("[name='misidn_num']").val();
        		if(msisdn==''||msisdn==null){
        			layer.alert('请输入卡号!');
        			return;
        		}
        		//var gprs_state = $("[name='gprs_state_search']").val();
        		var param = {};
        		var num = 1;
        		var row = 10;
        		param.msisdn = msisdn;
        		//param.gprs_state = gprs_state;
        		param.pageNum = pageNum==null? num : pageNum;
        		param.pageRow = pageRow==null? row : pageRow;
        		fish.callService("CustBusinessContrller", "queryCustGPRS", param, function(data) {
        			if (data.res_code == "00000") {
        				me.appendCardInfo(data);

        				that.$('.js-pagination').pagination("update",{records:data.result.total,start:data.result.pageNumber});
        				/*me.loadControlContent();
        				me.initEleControlEvent();*/
        				me.initEleControlEvent();
        			}
        			else{
        				layer.alert(data.res_message);
        			}
        		});
        	},
        	initClk : function(){
        		
        		var me = this;
        	//	me.initUploadEvent();
        	//	dropDown.initSelectDropDown($(".from-list-hd"));

        		//停机
        		$("#stop_service").unbind("click").bind("click",function(){
        			var text=$("#search_input").val();
        			layer.confirm('确定给号码'+text+'进行停机操作?', function(index){
        				me.stopAndContinueService("GKG1");
        				  layer.close(index);
        				}); 
        		});
        		
        		//复机
        		$("#continue_service").unbind("click").bind("click",function(){
        			var text=$("#search_input").val();
        			layer.confirm('确定给号码'+text+'进行复机操作?', function(index){
        				me.stopAndContinueService("GKG2");
        				  layer.close(index);
        				}); 
        		});
        	},
        	//change
        	stopAndContinueService : function(state){
        		
        		var msisdn = $.trim($("[name='misidn_num']").val());//去除输入框中的空格
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
        		var param = {};
        		param.msisdn = msisdn
        		param.oper_type = state;
        		layer.load();
        		fish.callService("CustBusinessContrller", "stopAndContinueService", param, function(data) {
        			layer.closeAll();
        			result.res_code = data.res_code;
        			result.data = data;
        			if (data.res_code == "00000") {
        				if(state=="GKG1"){
            				layer.alert("停机操作成功！");
        				}else{
            				layer.alert("复机操作成功！");
        				}
        			}
        			else{
        				layer.alert(data.res_message);
        			}
        		});
        		return result;
        	},
        	
        	
        });
        return pageView;
    });
