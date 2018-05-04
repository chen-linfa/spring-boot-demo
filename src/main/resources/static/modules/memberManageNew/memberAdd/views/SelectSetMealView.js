define(['hbs!../templates/selectSetMeal.html',"../../../busiGroupOrder/views/Prod_add_page","../../../busiGroupOrder/views/select_value_util"],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        offer_inst_id : '',
        afterRender: function(){
            var that = this;
            var offer_inst_id = that.options.offer_inst_id;
            that.offer_inst_id = offer_inst_id;
            that.has_test_prod = false;
            that.order_exp_type = "";
            that.$('.js-selectmenu').combobox();
            that.$('.js-date').datetimepicker();
            that.$('.js-check').icheck();
            
            that.selected_list = [];
            that.queryProdList();
            
            that.$("#btn_back").click(function(){
            	that.parentView.controlDivChange(1);
            });
            
            that.$(".toback").click(function(){
            	that.parentView.controlDivChange(1,{cache_key:that.options.cache_key});
            });
            
            that.$("#btn_submit").click(function(){
            	that.submitOrder();
            });
		},
		//套餐查询
        queryProdList : function(){
        	var that = this;
        	$("#prod_list").empty();
            $("#choosed_list").empty();
            var params = {};
            params.offer_inst_id = that.offer_inst_id;
            fish.callService("BusiOrderNewController", "queryProductsList", params, function(data){
            	var has_data = false;
                var pageCount = 0;
                if (data && data.result.length > 0) {
                    has_data = true;
                    that.initProductTableData(data);
                }
                if (has_data == false) {
                }
            });
        },
        
        initProductTableData: function(data) {
            var that = this;
            var total = data.result.length;
            if (total > 0) {
            	Prod_add_page.loadProd(data);
            	that.$('.js-check').icheck();
                $("#prod_list").find("li").each(function(index,ele){
                	
    				$(ele).find("input:first").unbind("click").bind("click",function(e){
    					//将左边填写的数据显示到右边
    					var len = $(ele).find("input:gt(0)").length;
                    	if(len > 0){
                    		//遍历属性input
                    		$(ele).find("input:gt(0)").each(function(index,ele){
        						var input_type = that.$(ele).attr("input_type");
        						
        						//alert("类型是" + input_type);
        						if(input_type == "5"){
        							that.$(ele).datetimepicker({
        								changeDate: function (e, value) {
        									//alert(that.$(this).val());
            								var prod_id = that.$(this).closest("li").attr("prod_id");
            								var form_value = that.$(this).closest("form").form("value");
            								form_value = select_value_util.replaceAttrValue(that.$(this).closest("form"),form_value);
            								
            								var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
            								var str_values = str_value.split(",");
            					            var li = that.$("#choosed_list").find("li[prod_id='" + prod_id + "']");
            					            li.find("div").each(function(index,el){
            					            	that.$(el).remove();
            					            });
            					            if(str_values.length > 2){
            					            	var values = "";
            					            	for(var i = 1;i <= str_values.length;i++){
            					            		//当str_values中的数据总数为偶数
                					            	if(str_values.length % 2 == 0){
                					            		if(i % 2 == 0){
                    					            		values = values + "," + str_values[i-1];
                    					            		li.append("<div>" + values + "</div>");
                    					            		values = "";
                    					            	}else{
                    					            		values = str_values[i-1];
                    					            	}
                					            	}else {//当str_values中的数据总数为奇数
                					            		if(i % 2 == 0){
                    					            		values = values + "," + str_values[i-1];
                    					            		li.append("<div>" + values + "</div>");
                    					            		values = "";
                    					            	}else{
                    					            		values = str_values[i-1];
                    					            		if(str_values.length == i){
                    					            			li.append("<div>" + str_values[i-1] + "</div>");
                    					            		}
                    					            	}
                					            	}
                					            	
                					            }
            					            }else {
            					            	li.append("<div>" + str_value + "</div>");
            					            }
        						        }
        							});
        						}
        						if(input_type == "2"){
        							that.$(ele).on('combobox:change', function () {
        								//alert(that.$(this).val());
        								var prod_id = that.$(this).closest("li").attr("prod_id");
        								var form_value = that.$(this).closest("form").form("value");
        								form_value = select_value_util.replaceAttrValue(that.$(this).closest("form"),form_value);
        								
        								var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
        								var str_values = str_value.split(",");
        					            var li = that.$("#choosed_list").find("li[prod_id='" + prod_id + "']");
        					            li.find("div").each(function(index,el){
        					            	that.$(el).remove();
        					            });
        					            if(str_values.length > 2){
        					            	var values = "";
        					            	for(var i = 1;i <= str_values.length;i++){
        					            		//当str_values中的数据总数为偶数
            					            	if(str_values.length % 2 == 0){
            					            		if(i % 2 == 0){
                					            		values = values + "," + str_values[i-1];
                					            		li.append("<div>" + values + "</div>");
                					            		values = "";
                					            	}else{
                					            		values = str_values[i-1];
                					            	}
            					            	}else {//当str_values中的数据总数为奇数
            					            		if(i % 2 == 0){
                					            		values = values + "," + str_values[i-1];
                					            		li.append("<div>" + values + "</div>");
                					            		values = "";
                					            	}else{
                					            		values = str_values[i-1];
                					            		if(str_values.length == i){
                					            			li.append("<div>" + str_values[i-1] + "</div>");
                					            		}
                					            	}
            					            	}
            					            	
            					            }
        					            }else {
        					            	li.append("<div>" + str_value + "</div>");
        					            }
        						    });
        						}
        						if(input_type == "1" || input_type == "3" || input_type == "4" || input_type == "6"){
        							that.$(ele).blur(function(){
        								//alert(that.$(this).val());
        								var prod_id = that.$(this).closest("li").attr("prod_id");
        								var form_value = that.$(this).closest("form").form("value");
        								form_value = select_value_util.replaceAttrValue(that.$(this).closest("form"),form_value);
        								
        								var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
        								var str_values = str_value.split(",");
        					            var li = that.$("#choosed_list").find("li[prod_id='" + prod_id + "']");
        					            li.find("div").each(function(index,el){
        					            	that.$(el).remove();
        					            });
        					            if(str_values.length > 2){
        					            	var values = "";
        					            	for(var i = 1;i <= str_values.length;i++){
        					            		//当str_values中的数据总数为偶数
            					            	if(str_values.length % 2 == 0){
            					            		if(i % 2 == 0){
                					            		values = values + "," + str_values[i-1];
                					            		li.append("<div>" + values + "</div>");
                					            		values = "";
                					            	}else{
                					            		values = str_values[i-1];
                					            	}
            					            	}else {//当str_values中的数据总数为奇数
            					            		if(i % 2 == 0){
                					            		values = values + "," + str_values[i-1];
                					            		li.append("<div>" + values + "</div>");
                					            		values = "";
                					            	}else{
                					            		values = str_values[i-1];
                					            		if(str_values.length == i){
                					            			li.append("<div>" + str_values[i-1] + "</div>");
                					            		}
                					            	}
            					            	}
            					            	
            					            }
        					            }else {
        					            	li.append("<div>" + str_value + "</div>");
        					            }
        					            
        					            
        							});
        						}
        					});
                    	}
    					var length = $(ele).find(":checked").length;
    					if(length == 0){
    						//移除
    						$("#choosed_list").find("li").each(function(index,e){
    							if($(e).attr("prod_id")==$(ele).attr("prod_id")){
    								$(e).remove();
    								$(ele).find("form").form("clear");
    							}
    						});
    					}else{
    						//添加
    						var li = $('<li><button class="vacum-up fr"><i class="ico-del"></i></button></li>');
    						li.append($(ele).attr("prod_name"));
    						li.attr("prod_id",$(ele).attr("prod_id"));
    						li.attr("prod_type",$(ele).attr("prod_type"));
    						li.attr("prod_name",$(ele).attr("prod_name"));
    						li.attr("attr_name",$(ele).find(".attr").attr("attr_name"));
    						li.attr("attr_code",$(ele).find(".attr").attr("attr_code"));
    						$("#choosed_list").append(li);
    						var li_1 = $('<li></li>');
    						li_1.append($(ele).attr("prod_name"));
    						$("#add_list").append(li_1);
    						//左侧数据在右侧显示
    						var form_len = $(this).closest("li").find("form").length;
    						if(form_len > 0){
    							var prod_id = $(this).closest("li").attr("prod_id");
        						var form_value = $(this).closest("li").find("form").form("value");
        						form_value = select_value_util.replaceAttrValue($(this).closest("li").find("form"),form_value);
        						
        						var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
    							if(str_value != ""){
    								var str_values = str_value.split(",");
    					            var li = that.$("#choosed_list").find("li[prod_id='" + prod_id + "']");
    					            li.find("div").each(function(index,el){
    					            	that.$(el).remove();
    					            });
    					            if(str_values.length > 2){
    					            	var values = "";
    					            	for(var i = 1;i <= str_values.length;i++){
    					            		//当str_values中的数据总数为偶数
        					            	if(str_values.length % 2 == 0){
        					            		if(i % 2 == 0){
            					            		values = values + "," + str_values[i-1];
            					            		li.append("<div>" + values + "</div>");
            					            		values = "";
            					            	}else{
            					            		values = str_values[i-1];
            					            	}
        					            	}else {//当str_values中的数据总数为奇数
        					            		if(i % 2 == 0){
            					            		values = values + "," + str_values[i-1];
            					            		li.append("<div>" + values + "</div>");
            					            		values = "";
            					            	}else{
            					            		values = str_values[i-1];
            					            		if(str_values.length == i){
            					            			li.append("<div>" + str_values[i-1] + "</div>");
            					            		}
            					            	}
        					            	}
        					            	
        					            }
    					            }else {
    					            	li.append("<div>" + str_value + "</div>");
    					            }
    							}
    						}
    						
    					}
    					
	                    $("#choosed_list").find("li").each(function(index,e){
	    					$(e).find("button").unbind("click").bind("click",function(){
	    						$(e).remove();
	    						$("#prod_list").find("li").each(function(index,left){
	    							if($(left).attr("prod_id")==$(e).attr("prod_id")){
	    								$(left).find("div").removeClass("checked");
	    								$(left).find("form").form("clear");
	    							}
	    						});
    	    				});
            			});
	                    $(".cleanAll").unbind("click").bind("click",function(){
	                    	$("#choosed_list").find("li").remove();
	                    	$("#prod_list").find(".checked").each(function(index,e){
	                    		$(e).removeClass("checked");
	                    	});
	                    	$("#prod_list").find("form").each(function(index,el){
	                    		$(el).form("clear");
	                    	});
	                    });
	                    e.stopPropagation();
    			});
			});
                
            } 
        },
        
		submitOrder:function(){
			//预提交处理，仅校验
			var that = this;
			//1,非空校验
			var bol = true;
    		if($("#choosed_list").find("li").length<=0){
    			bol = false;
				layer.alert("请您选择套餐!");
			}
    		//2.是否都填了属性
    		$("#prod_list").find("li div.checked").closest("li").each(function(index,ele){
        		$(ele).find(".attr").each(function(index,ele){
        			var res = Prod_add_page.nullableValidate($(ele));
        			if(res.result == "false"){
        				bol = false;
        				return false;
        			}
        			//3.产品输入校验
        			if(bol){
        				var resp = Prod_add_page.valifyInputLimit($(ele));
                      	if(resp.result == "false"){
                      		bol = false;
                    		result = false;
                    		layer.alert(resp.prod_name +" : "+ resp.msg,{yes: function() {
                    			$(ele).find("input").focus(); 
                    			layer.closeAll();
                    		}});
                    		
                    		
                    		return false;
                    	}
        			}
                  
        		});
    		});
			
			//校验产品间的互斥和强弱依赖关系
    		if(bol){
    			var params = {};
                var selected_prod_list = [];
                $("#choosed_list").find("li").each(function(index,ele){
                	var prod = {};
                	prod.prod_id = $(ele).attr("prod_id");
                	prod.prod_name = $(ele).attr("prod_name");
                	prod.prod_type = $(ele).attr("prod_type");
                	selected_prod_list.push(prod);
                	if($(ele).attr("prod_id")=="123"){//“123”为测试期产品prod_id,请注意修改
                		that.has_test_prod = true;
						that.order_exp_type = prod.order_exp_type;
                	}
                	
  	        	});
                params.selected_prod_list = selected_prod_list;
  			
  			fish.callService("BusiOrderNewController", "qryBusiProdsRel", params,function(data) {
  				if (data.res_code == '00000') {
                    	//获取属性值 在校验后
                		var product_list = [];
                		$("#prod_list").find("li div.checked").closest("li").each(function(index,ele){
                			var prod = new Object();
        	        		prod.prod_id = $(ele).attr("prod_id");
        	        		prod.prod_name = $(ele).attr("prod_name");
        	        		prod.order_eff_type = $(ele).attr("order_eff_type");
	        	        	prod.order_exp_type = $(ele).attr("order_exp_type");
        	        		prod.pkg_prod_id = $(ele).attr("pkg_prod_id");
        	        		prod.attrorser = $(ele).attr("attrorser");
        	        		var attr_list = [];
        	        		$(ele).find(".attr").each(function(index,ele){
        	        			var attr = Prod_add_page.getAttrValue($(ele));
        	        			attr_list.push(attr);
        	        		});
        	        		prod.attr_list = attr_list;
        	        		product_list.push(prod);
                		});
                		that.parentView.order_info.product_list = product_list;
                		if(bol){
                			//准备提交
	                			console.log(that.parentView.order_info);
	                			that.confirmSubmitOrder(that.parentView.order_info);
                		}
                		/*if(bol){
                		//校验特殊产品
  		                	var legal_params = {};
  			                legal_params.prod_list = product_list;
  			                legal_params.mem_list = that.parentView.order_info.new_mem_list;
  			                legal_params.group = that.parentView.order_info.group;
  			                legal_params.busi_type = "1";//修改：3，新增：1
  		                	fish.callService("BusiOrderNewController", "checkOutProdLegal", legal_params,function(data) {
  				                if (data.res_code == '00000') {
  				                	//校验完毕，存储进入准备提交状态
  		                			that.parentView.order_info.product_list = product_list;
  		                			
  				                } else {
  				                    layer.alert(data.res_message);
  				                }
  				            });
                		}*/
                   } else {
                  	bol = false;
                  	layer.alert(data.res_message);
                  	return false;
                  }
              });
    		}
			
		},
		confirmSubmitOrder:function(order_info){
			var that = this;
			//实际提交订单
			layer.confirm("确认提交？",function(index){
				var params = {};
	        	params.order_info = order_info;
	        	params.cache_key = that.options.cache_key;
	        	params.has_test_prod = that.has_test_prod;
	        	params.order_exp_type = that.order_exp_type;
                layer.close(index);
	        	fish.callService("BusiOrderNewController", "submitMemAddOrder", params,function(data) {
	        		that.parentView.controlDivChange(3,data);
	        	});
			});
		},
	});
    return pageView;
});