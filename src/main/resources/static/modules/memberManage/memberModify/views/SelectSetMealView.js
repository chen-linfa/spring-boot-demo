define(['hbs!../templates/selectSetMeal.html',"../../../busiGroupOrder/views/select_value_util"],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.selected_list = [];
            that.$(".js-btn_back").click(function(){
            	that.parentView.controlDivChange(1); 
             });
            that.$("#btn_back").click(function(){
            	that.parentView.controlDivChange(1,{cache_key:that.options.cache_key});
            });
            
            that.$("#btn_clearselected").click(function(){
            	that.selected_list = [];
            	that.$("#product_list").find(".js-check").icheck("uncheck");
            	that.$("#selected_list").empty();
            	that.$("#product_list").find("form").each(function(index,ele){
            		that.$(ele).form("clear");
            	});
            	//that.renderSelected();
            });

            that.queryProductList();
            that.renderSelected();
            
            that.$("#btn_submit").click(function(){
            	that.submitOrder();
            });
		},
		renderSelected:function(){
			var that = this;
			that.$("#selected_list").empty();
			_.each(that.selected_list,function(prod){
				var len = that.$("#selected_list").find("button[prod_id='" + prod.prod_id + "']").length;
				if(len == 0){
					var $li = that.$("#selected_temp").find("li").clone();
					$li.find("span[name]").text(prod.prod_name);
					$li.find(".js-btn_sltclean").attr("prod_id",prod.prod_id);
					that.$("#selected_list").append($li);
				}
			});
			//移除单个已选套餐按钮事件
			that.$("#selected_list").find(".js-btn_sltclean").click(function(){
				var prod_id = $(this).attr("prod_id");
				that.selected_list = _.reject(that.selected_list, function(item){ 
					return item.prod_id == prod_id;
				});
			
				that.$("input[value="+prod_id+"]").icheck("uncheck");
				//清空表单中的值
				that.$("input[value="+prod_id+"]").closest("li").find("form").form("clear");
				$(this).parent("li").remove();
			});
		},
		queryProductList:function(page,rows){
			var that = this;
			var params = {};
			params.page = page ? page: 1;
            params.rows = rows ? rows: 10;
            params.cache_key = that.options.cache_key?that.options.cache_key:"";
            that.$("#product_list").empty();
            that._product_list = {};//暂存数据
            fish.callService("BusiOrderController", "queryProductsList", params,function(reply){
            	if(reply && $.isArray(reply.result)){
            		//构建套餐列表
            		//总回调函数执行次数与套餐列表大小一致
            		var readyfunc = _.after(reply.result.length,fish.bind(that.readyProduct,that));
            		_.each(reply.result,function(data){
            			//对于每个套餐，需要查询套餐属性，然后才能组装套餐选项
            			that._product_list[data.prod_id] = {prod_id:data.prod_id,prod_name:data.prod_name,prod_attr:[],pkg_prod_id:data.pkg_prod_id,prod_type:data.prod_type};
            			var prod_param = {prod_id:data.prod_id};
            			fish.callService("BusiOrderController", "getProdAttrByProd", prod_param,function(attr_data) {
            				if($.isArray(attr_data.result)){
            					_.each(attr_data.result,function(item){
            						that._product_list[data.prod_id].prod_attr.push(item);
            					})
            				}
            				readyfunc();
            			});

            		});
            	}
            });
		},
		readyProduct:function(){
			//加载套餐内容完成，组装套餐列表
			var that = this;
			console.log(that._product_list);
			_.each(that._product_list,function(item,key){
				var $li = that.$("#prod_temp").find("li").clone();
				$li.find("span[name]").text(item.prod_name);
				$li.find(".js-check").attr("value",key);
				$li.find("form").attr("prod_id",key);
				//渲染套餐属性填写
				if($.isArray(item.prod_attr)){
					$li.find("form").empty();
					_.each(item.prod_attr,function(attr){
						//1--文本框；2--下拉框；3-整数框；4--浮点数；5--时间框（yyyyMMdd）
						var input_type = attr.input_type;
						var $div = $('<div class="form-group"><input type="text" class="form-control" name="'+attr.attr_name+'" placeholder="'+attr.attr_name+'" input_type="'+input_type+'"></div>');
						$div.find("input").data("attr",attr);
						$li.find("form").append($div);
					});

				}
				
				that.$("#product_list").append($li);
			});
			
			that.$("#product_list").find(":checkbox").icheck();
			that.$("#product_list").find(":checkbox").click(function(){
				//将左边填写的数据显示到右边
				var input_len = that.$(this).closest("li").find("input").length;
				if(input_len > 1){
					that.$(this).closest("li").find("form").find("input").each(function(index,ele){
						var input_type = that.$(ele).attr("input_type");
						
						//alert("类型是" + input_type);
						if(input_type == "5"){
							that.$(this).datetimepicker({
								changeDate: function (e, value) {
									//debugger;
									var prod_id = that.$(this).closest("form").attr("prod_id");
									var form_value = that.$(this).closest("form").form("value");
									form_value = select_value_util.replaceAttrValue(that.$(this).closest("form"),form_value);
									
									var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
						            var btn = that.$("#selected_list").find("button[prod_id='" + prod_id + "']");
						            btn.closest("li").find("div").remove();
						            btn.after("<div>" + str_value + "</div>");
						        }
							});
						}
						if(input_type == "2"){
							that.$(this).on('combobox:change', function () {
								//alert(that.$(this).combobox("text"));
								//var smstype_value = that.$(this).combobox("text");
								var prod_id = that.$(this).closest("form").attr("prod_id");
								var form_value = that.$(this).closest("form").form("value");
								form_value = select_value_util.replaceAttrValue(that.$(this).closest("form"),form_value);
								
								var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
					            var btn = that.$("#selected_list").find("button[prod_id='" + prod_id + "']");
					            btn.closest("li").find("div").remove();
					            btn.after("<div>" + str_value + "</div>");
						    });
						}
						if(input_type == "1" || input_type == "3" || input_type == "4"){
							that.$(this).blur(function(){
								//alert(that.$(this).val());
								var prod_id = that.$(this).closest("form").attr("prod_id");
								var form_value = that.$(this).closest("form").form("value");
								form_value = select_value_util.replaceAttrValue(that.$(this).closest("form"),form_value);
								
								var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
					            var btn = that.$("#selected_list").find("button[prod_id='" + prod_id + "']");
					            btn.closest("li").find("div").remove();
					            btn.after("<div>" + str_value + "</div>");
							});
						}
					});
				}
				
				//如果点击了
				that.selected_list = [];
				that.$("#product_list").find(":checked").each(function(){
					var prod_id = $(this).attr("value");
					var prod = that._product_list[prod_id];
					that.selected_list.push({prod_id:prod_id,prod_name:prod.prod_name,pkg_prod_id:prod.pkg_prod_id,prod_type:prod.prod_type});
				});
				that.renderSelected();
				//debugger;
				var checked_len = that.$(this).closest("label").find("div[class='icheckbox checked']").length;
				//已选中再次点击则移除
				if(checked_len == 1){
					var prod_id = that.$(this).closest("li").find("form").attr("prod_id");
					that.$(this).closest("li").find("form").form("clear");
					that.$("#selected_list").find("button[prod_id='" + prod_id + "']").closest("li").remove();
				}else{
					//debugger;
					var prod_id = that.$(this).closest("li").find("form").attr("prod_id");
					var form_value = that.$(this).closest("li").find("form").form("value");
					form_value = select_value_util.replaceAttrValue(that.$(this).closest("li").find("form"),form_value);
					
					var str_value = JSON.stringify(form_value).substring(1,JSON.stringify(form_value).length - 1);
		            if(str_value != ""){
		            	var btn = that.$("#selected_list").find("button[prod_id='" + prod_id + "']");
		            	//alert(btn.attr("prod_id"));
			            btn.closest("li").find("div").remove();
			            btn.after("<div>" + str_value + "</div>");
		            }
				}
			});
			//渲染输入框
			that.$("#product_list").find("input[input_type]").each(function(){
				var attr_data = $(this).data("attr");
				var input_type = $(this).attr("input_type");
				if(input_type == "2"){
					$(this).combobox({
						attr_code:attr_data.input_limit
					});
				}else if(input_type == "5"){
					$(this).wrap("<div class='input-group'></div>");
					$(this).datetimepicker({viewType:"date"});
				}else{
					//赋予默认值
				}
			});
		},
		submitOrder:function(){
			//预提交处理，仅校验
			var that = this;
			if(that.selected_list.length == 0){
				layer.alert("请选择套餐！");
				return;
			}
			//校验所选套餐的输入框是否都填了属性（本地校验，有必填和选填的分别）
			//先获取填写的值
			var checked = true;
			var vaildmsg = "";
			_.each(that.selected_list,function(selected_attr){
				var prod_id = selected_attr.prod_id;
				selected_attr.attr_list = [];
				//取出对应套餐填写值的情况
				var attrdata = that.$("form[prod_id='"+prod_id+"']").form("value");
				
				//从事先查询出的套餐列表中找出对应属性，遍历寻找必填项
				var prod_attr = that._product_list[prod_id].prod_attr;
				_.each(prod_attr,function(item){
					if(!attrdata[item.attr_name]){
						attrdata[item.attr_name] = "";
					}
					
					//如果没有填写必填项，设置标记位为false
					if(item.is_required == "1" && !attrdata[item.attr_name]){
						checked = false;
					}
					
					//输入校验前移到这个位置进行
					if(!vaildmsg){
						//校验到一项就不再校验了
						switch(item.input_type){
						case "5":
							//时间输入框判断时间范围
							if(item.input_limit){
								var limit_arr = item.input_limit.split("-");
								if(limit_arr[0] == "end"){
									var end_time = attrdata[item.attr_name];
									var start_time = "";
									_.each(prod_attr,function(item_s){
										if(item_s.input_type=="5" && item_s.input_limit == "start"){
											start_time = attrdata[item_s.attr_name];
											return false;
										}
									});
									var range = limit_arr[1];
		            				var range_type = limit_arr[2];
		            				//比较时间大小
		            				vaildmsg = that.compareTimeRange(start_time,end_time,range,range_type);
		            				
		            				var endDate=new Date(end_time.replace("-", "/").replace("-", "/"));  
		            				if(endDate.getDate()!=1){
		            					vaildmsg = "失效时间要求填写N月后的1号！";
		            				}
								}
							}
							break;
						};
						
						if(item.attr_name == "月份" && item.input_type == "3"){
							//月份校验
							var time1 = "";
		        			var time2 = "";
		        			//极简易获取time1和time2的方法，固定假设只有两个事件输入框
		        			_.each(prod_attr,function(item_s){
								if(item_s.input_type=="5"){
									if(!time1){
										time1 = attrdata[item_s.attr_name];
									}else{
										time2 = attrdata[item_s.attr_name];
									}
								}
							});
		        			
		        			var time1Date=new Date(time1.replace("-", "/").replace("-", "/"));    
		            	    var time2Date=new Date(time2.replace("-", "/").replace("-", "/"));   
		        			
		            	    var monthToMonth = new Number();      
		            	    if(time1Date>time2Date){
		            	    	monthToMonth = time1Date.getMonth() - time2Date.getMonth();
		            	    }else{
		            	    	monthToMonth = time2Date.getMonth() - time1Date.getMonth();
		            	    }
		            	    if(monthToMonth!=new Number(attrdata[item_s.attr_name])){
		    					vaildmsg = '属性-月份值填写不正确，实际：'+new Number(attrdata[item_s.attr_name])+"',理应："+monthToMonth;
		            	    }
						}
					}
					
					//将对应单个属性值组装进已选属性列表
					var single_attr = {};
					single_attr.attr_value = attrdata[item.attr_name];
					single_attr.attr_name = item.attr_name;
					single_attr.attr_code = item.attr_code;
					selected_attr.attr_list.push(single_attr);
				});
			});
			if(!checked){
				//必填校验不通过
				layer.alert("请先填写套餐内容！");
				return;
			}
			console.log(that.selected_list);
			
			//校验产品间的互斥和强弱依赖关系
			var params = {selected_prod_list:that.selected_list};
			fish.callService("BusiOrderController", "qryBusiProdsRel", params,function(data) {
                if (data.res_code == '00000') {
                	//互斥规则通过，进行输入校验（本地）
                	//实际校验已经在上一步内完成，本处仅为保持原业务逻辑顺序一致在此输出信息
                	if(vaildmsg){
						layer.alert(vaildmsg);
						return;
					}
                	
                	//校验特殊产品
                	var legal_params = {};
	                legal_params.prod_list = that.selected_list;
	                legal_params.mem_list = that.parentView.order_info.new_mem_list;
	                legal_params.group = that.parentView.order_info.group;
	                legal_params.busi_type = "3";//修改：3，新增：1
                	fish.callService("BusiOrderController", "checkOutProdLegal", legal_params,function(data) {
		                if (data.res_code == '00000') {
		                	//校验完毕，存储进入准备提交状态
                			that.parentView.order_info.product_list = that.selected_list;
                			//准备提交
                			that.confirmSubmitOrder(that.parentView.order_info);
		                } else {
		                    layer.alert(data.res_message);
		                }
		            });
                } else {
                	layer.alert(data.res_message);
                }
            });
		},
		confirmSubmitOrder:function(order_info){
			var that = this;
			//实际提交订单
			layer.confirm("确认提交？",function(index){
				var params = {};
	        	params.order_info = order_info;
	        	params.order_info.cache_key = that.options.cache_key;
	        	layer.close(index);
	        	fish.callService("BusiOrderController", "submitMemModifyOrder", params,function(data) {
	        		that.parentView.controlDivChange(3,data);
	        	});
	        	return;
			});
		},
		compareTimeRange : function(start_time,end_time,range,range_type){
        	if(start_time>end_time){
        		return "错误：生效时间大于失效时间！";
        	}
        	
        	if(range.indexOf("m")>0){//月份比较
        		var m_num = new Number(range.substring(0,range.indexOf("m")));
        		var startDate=new Date(start_time.replace("-", "/").replace("-", "/"));    
        	    var endDate=new Date(end_time.replace("-", "/").replace("-", "/"));    
        	    var number = 0;
        	    var yearToMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12;      
        	    number += yearToMonth;      
        	    monthToMonth = endDate.getMonth() - startDate.getMonth();      
        	    number += monthToMonth;    
        	    if(range_type=="maxday"){
        	    	if(number>m_num||(number==m_num&&(endDate.getDate()>startDate.getDate()))){
        	    		return "时间选择范围大于最大值（"+m_num+"个月）！";
        	    	}
        	    }else if(range_type=="minday"){
        	    	if(number<m_num||(number==m_num&&(endDate.getDate()<startDate.getDate()))){
        	    		return "时间选择范围小于最小值（"+m_num+"个月）！";
        	    	}
        	    }
        	}else if(range.indexOf("d")>0){//日比较
        		var d_num = range.substring(0,range.indexOf("d")-1);
        		//暂时不考虑日长的情况,不应该出现日的情况（超过一个月的日长度难计算）
        	}
        	return "";
        }
	});
    return pageView;
});
