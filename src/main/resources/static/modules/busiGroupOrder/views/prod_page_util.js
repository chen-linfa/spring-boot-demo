var prod_page_util = {
		buildProductAttrDiv:function($tbody,attrDetail,type){
        	// 1--文本框；2--下拉框；3-整数框；4--浮点数；5--时间框（yyyyMMdd）;6 ---字母数字框
			var that = this;
			console.log(attrDetail);
        	var content_div = $('<div></div>');
        	var select_html = $("<div name='attr' class='inp-select inp-size-s' style='width: 200px;'>"+
                    "<select name='' class='form-control js-selectmenu combobox1'>"+
                	"</select></div>");
        	var input_html = $("<input name='attr' type='text' class='inp-text input_html inp-size-s form-control' style='width:100px;' length='' readonly='true'>");
        	var time_html = $("<input  name='attr' type='text' class='time_input form-control' id='start_time' disabled>");
        	var integer_html = $("<input name='attr' type='text' class='inp-text int_html inp-size-s form-control' style='width:100px;' length='' readonly='true'>");
        	var fload_html = $("<input name='attr' type='text' class='inp-text float_html inp-size-s form-control' style='width:100px;' length='' readonly='true'>");
        	var abcNum_html = $("<input name='attr' type='text' class='inp-text abc123_html inp-size-s form-control' style='width:100px;' length='' readonly='true'>");
        	var cover_html = $("<div id='cover_select' style='right:0;position:absolute;width:38px;height:30px;z-index:9999'></div>");
        	if(type != ""){
        		var curr = $('<form class="form-horizontal" id="form_template" style="margin-top:15px;">'
    					+ '<div class="form-group">'
    					+ '<label for="" class="col-md-3 control-label"></label>'	
    					+ '<div class="input-group  col-md-3">'	
    			        + '</div>'    
    		            + '</div>'
    		            + '</form>');
        		var select_html_clone = select_html.clone();
				curr.find("label").append("附加套餐" + ":");
				select_html_clone.attr("field","附加套餐");
				select_html_clone.attr("attr_id","390020001825");
				select_html_clone.attr("attr_name","附加套餐");
				select_html_clone.attr("attr_code","390020001825");
				select_html_clone.attr("is_modif","1");
				select_html_clone.attr("is_required","1");
				select_html_clone.attr("attrorser","0");
				this.getSelect_1("",attrDetail.flowProdList,select_html_clone);
				curr.find(".input-group").append(cover_html.clone());
				curr.find(".input-group").append(select_html_clone);
				console.log(attrDetail);
				select_html_clone.find("select").combobox('value',attrDetail.attr_value);
				$tbody.append(curr);
        	}else{
        		for(var i=0;i<attrDetail.length;i++){
            		var curr = $('<form class="form-horizontal" id="form_template" style="margin-top:15px;">'
        					+ '<div class="form-group">'
        					+ '<label for="" class="col-md-3 control-label"></label>'	
        					+ '<div class="input-group  col-md-3">'	
        			        + '</div>'    
        		            + '</div>'
        		            + '</form>');
            		var busi_prod_attr = attrDetail[i];
            		if(busi_prod_attr.input_type=='1'){// 文本输入框
    					var input_html_clone = input_html.clone();
    					curr.find("label").append(busi_prod_attr.attr_name_cn + ":");
    					input_html_clone.attr("input_type",busi_prod_attr.input_type);
    					input_html_clone.attr("length",busi_prod_attr.input_length);
    					input_html_clone.attr("attr_id",busi_prod_attr.attr_id);
    					input_html_clone.attr("is_modif",busi_prod_attr.is_modif);
    					input_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
    					input_html_clone.attr("attr_code",busi_prod_attr.attr_code);
    					input_html_clone.attr("input_limit",busi_prod_attr.input_limit);
    					input_html_clone.attr("is_required",busi_prod_attr.attr_train);
    					input_html_clone.attr("attrorser",busi_prod_attr.attrorser);
    					input_html_clone.val(busi_prod_attr.attr_value == null ? busi_prod_attr.default_value : busi_prod_attr.attr_value);
    					// content_div.append(input_html_clone);
    					curr.find(".input-group").append(input_html_clone);
    					$tbody.append(curr);
    				}else if(busi_prod_attr.input_type=='2'){// select下拉选择框
    					var select_html_clone = select_html.clone();
    					curr.find("label").append(busi_prod_attr.attr_name_cn + ":");
    					select_html_clone.attr("input_type",busi_prod_attr.input_type);
    					select_html_clone.attr("field",busi_prod_attr.attr_name);
    					select_html_clone.attr("attr_id",busi_prod_attr.attr_id);
    					select_html_clone.attr("is_modif",busi_prod_attr.is_modif);
    					select_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
    					select_html_clone.attr("attr_code",busi_prod_attr.attr_code);
    					select_html_clone.attr("input_limit",busi_prod_attr.input_limit);
    					select_html_clone.attr("is_required",busi_prod_attr.attr_train);
    					select_html_clone.attr("attrorser",busi_prod_attr.attrorser);
    					select_html_clone.find("select").attr("limit",busi_prod_attr.input_limit);
    					this.getSelect(busi_prod_attr.attr_name_cn,busi_prod_attr.input_limit,select_html_clone);
    					curr.find(".input-group").append(cover_html.clone());
    					curr.find(".input-group").append(select_html_clone);
    					select_html_clone.find("select").combobox('value',busi_prod_attr.attr_value);
    					$tbody.append(curr);
    				}else if(busi_prod_attr.input_type=='5'){// 时间选择框
    					var time_html_clone = time_html.clone();
    					// 目前时间选择框有生效时间和失效时间
    					// content_div.append(busi_prod_attr.attr_name);
    					curr.find("label").append(busi_prod_attr.attr_name_cn + ":");
    					// content_div.append("：");
    					time_html_clone.attr("input_type",busi_prod_attr.input_type);
    					time_html_clone.attr("field",busi_prod_attr.attr_name_cn);
    					time_html_clone.attr("attr_id",busi_prod_attr.attr_id);
    					time_html_clone.attr("is_modif",busi_prod_attr.is_modif);
    					time_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
    					time_html_clone.attr("attr_code",busi_prod_attr.attr_code);
    					time_html_clone.attr("input_limit",busi_prod_attr.input_limit);
    					time_html_clone.attr("attrorser",busi_prod_attr.attrorser);
    					time_html_clone.attr("is_required",busi_prod_attr.attr_train);
    					time_html_clone.val(busi_prod_attr.attr_value == null ? busi_prod_attr.default_value : busi_prod_attr.attr_value);
    					curr.find(".input-group").attr("class","input-group margin-lg-right");
    					curr.find(".input-group").attr("style","width: 188px;");
    					curr.find(".input-group").append(time_html_clone);
    					$tbody.append(curr);
    				}else if(busi_prod_attr.input_type=='3'){// 整型框
    					var integer_html_clone = integer_html.clone();
    					// content_div.append(busi_prod_attr.attr_name);
    					// curr.find("[dbfield='attr_name']").find("label").append(busi_prod_attr.attr_name);
    					// content_div.append("：");
    					curr.find("label").append(busi_prod_attr.attr_name_cn + ":");
    					integer_html_clone.attr("input_type",busi_prod_attr.input_type);
    					integer_html_clone.attr("length",busi_prod_attr.input_length);
    					integer_html_clone.attr("attr_id",busi_prod_attr.attr_id);
    					integer_html_clone.attr("is_modif",busi_prod_attr.is_modif);
    					integer_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
    					integer_html_clone.attr("attr_code",busi_prod_attr.attr_code);
    					integer_html_clone.attr("input_limit",busi_prod_attr.input_limit);
    					integer_html_clone.attr("attrorser",busi_prod_attr.attrorser);
    					integer_html_clone.attr("is_required",busi_prod_attr.attr_train);
    					integer_html_clone.val(busi_prod_attr.attr_value == null ? busi_prod_attr.default_value : busi_prod_attr.attr_value);
    					curr.find(".input-group").append(integer_html_clone);
    					$tbody.append(curr);
    				}else if(busi_prod_attr.input_type=='4'){// 浮点数
    					var fload_html_clone = fload_html.clone();
    					curr.find("label").append(busi_prod_attr.attr_name_cn + ":");
    					fload_html_clone.attr("input_type",busi_prod_attr.input_type);
    					fload_html_clone.attr("length",busi_prod_attr.input_length);
    					fload_html_clone.attr("is_modif",busi_prod_attr.is_modif);
    					fload_html_clone.attr("attr_id",busi_prod_attr.attr_id);
    					fload_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
    					fload_html_clone.attr("attr_code",busi_prod_attr.attr_code);
    					fload_html_clone.attr("input_limit",busi_prod_attr.input_limit);
    					fload_html_clone.attr("attrorser",busi_prod_attr.attrorser);
    					fload_html_clone.attr("is_required",busi_prod_attr.attr_train);
    					fload_html_clone.val(busi_prod_attr.attr_value == null ? busi_prod_attr.default_value : busi_prod_attr.attr_value);
    					curr.find(".input-group").append(fload_html_clone);
    					$tbody.append(curr);
    				}else if(busi_prod_attr.input_type=='6'){//字母数字框
    					var abcNum_html_clone = abcNum_html.clone();
    					curr.find("label").append(busi_prod_attr.attr_name_cn + ":");
    					abcNum_html_clone.attr("input_type",busi_prod_attr.input_type);
    					abcNum_html_clone.attr("length",busi_prod_attr.input_length);
    					abcNum_html_clone.attr("attr_id",busi_prod_attr.attr_id);
    					abcNum_html_clone.attr("is_modif",busi_prod_attr.is_modif);
    					abcNum_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
    					abcNum_html_clone.attr("attr_code",busi_prod_attr.attr_code);
    					abcNum_html_clone.attr("attrorser",busi_prod_attr.attrorser);
    					abcNum_html_clone.attr("input_limit",busi_prod_attr.input_limit);
    					abcNum_html_clone.attr("is_required",busi_prod_attr.attr_train);
    					abcNum_html_clone.val(busi_prod_attr.attr_value == null ? busi_prod_attr.default_value : busi_prod_attr.attr_value);
    					curr.find(".input-group").append(abcNum_html_clone);
    					$tbody.append(curr);
    				}
            		
            	}
        	}
        	
        },
        
		getSelect : function(attr_name,attr_code,select_html_clone){
	       	 var json = JSON.parse(attr_code);
	       	var dataSource = [];
	       	 for(var p in json){
	       		var source = {};
	       		source.name = json[p];
	       		source.value = p;
	       		dataSource.push(source);
	       		}
	       	 for(var p in json){
	       		select_html_clone.find("select").combobox({
	                placeholder: "请选择",
	                dataTextField: 'name',
	                dataValueField: 'value',
	                dataSource: dataSource,
	            });
	       		}
			},
	        getSelect_1 : function(attr_name,flow_prod,select_html_clone){
		       	 for(var prod in flow_prod){
		       		select_html_clone.find("select").combobox('append', {name: flow_prod[prod].prod_name, value: flow_prod[prod].prod_id});
		       		}
			},
		        getAttrValue : function($jqDom){
		        	var attr = {};
		        	if($jqDom.hasClass("inp-select")){
		        		attr.attr_value = $jqDom.find("select").combobox("value");
		        		attr.attr_name = $jqDom.attr("attr_name");
		        		attr.attr_code = $jqDom.attr("attr_code");
		        	}else if($jqDom.hasClass("inp-text")){
		        		attr.attr_value = $jqDom.val();
		        		attr.attr_name = $jqDom.attr("attr_name");
		        		attr.attr_code = $jqDom.attr("attr_code");
		        	}else if($jqDom.hasClass("time_input")){// time_input
		        		attr.attr_value = $jqDom.val();
		        		attr.attr_name = $jqDom.attr("attr_name");
		        		attr.attr_code = $jqDom.attr("attr_code");
		        	}
		        	attr.attr_id = $jqDom.attr("attr_id");
		        	attr.attrorser = $jqDom.attr("attrorser");
		        	return attr;
		        },
		        
		        // 检验输入限制
		        valifyInputLimit : function($jqDom){
		        	
		        	var me = this;
		        	var result = true;
		        	var p = new Object();
		        	var response = new Object();
		        	response.result = "true";
		        	$jqDom.each(function(index,ele){	
		        		// 时间输入框
		        		if($(ele).hasClass("time_input")){
		        			var input_limit = $(ele).attr("input_limit");
		        			if(input_limit!=""&&input_limit!=undefined){
		        				var limit_arr = input_limit.split("-");
		        				if(limit_arr[0]=="end"){// 失效时间，最大、最小时间范围校验
		            				var range = limit_arr[1];
		            				var range_type = limit_arr[2];
		            				// 取得生效时间
		            				var end_time = $(ele).find('input').val();
		            				var start_time = $(ele).siblings("label.time_input").eq(0).find("input").val();
		            				var resp = new Object();
		            				if(range==undefined||range_type==undefined){
		            					// resp.result = "true";
		            				}else{
		            					resp = me.compareTimeRange(start_time,end_time,range,range_type);
		            				}
		            				
		            				var endDate=new Date(end_time.replace("-", "/").replace("-", "/"));  
		            				if(endDate.getDate()!=1){
		            					resp.result = "false";
		            					resp.msg = "失效时间要求填写N月后的1号！";
		            				}
		            				
		            				if(resp.result == "false"){
		            					response.result = resp.result;
		            					response.msg = resp.msg;
		            					return false;// 跳出循环
		            				}
		            			}
		        			}
		        		}else if($(ele).hasClass("input_html")){
		        			
		        			
		        			
		        			
		        			
		        		}else if($(ele).hasClass("int_html")){
		        			// 月份
		        			var attr_name = $(ele).attr("attr_name");
		        			if(attr_name=='月份'){// 做月份校验
		        				
		        			var time1 =	$(ele).siblings("label.time_input").eq(0).find("input").val();
		        			var time2 =	$(ele).siblings("label.time_input").eq(1).find("input").val();
		        			
		        			var time1Date=new Date(time1.replace("-", "/").replace("-", "/"));    
		            	    var time2Date=new Date(time2.replace("-", "/").replace("-", "/"));   
		        			
		            	    var monthToMonth = new Number();      
		            	    if(time1Date>time2Date){
		            	    	monthToMonth = time1Date.getMonth() - time2Date.getMonth();
		            	    }else{
		            	    	monthToMonth = time2Date.getMonth() - time1Date.getMonth();
		            	    }
		            	    if(monthToMonth!=new Number($(ele).val())){
		    					response.result = "false";
		    					response.msg = '属性-月份值填写不正确，实际：'+new Number($(ele).val())+"',理应："+monthToMonth;
		    					return false;// 跳出循环
		            	    }
		        			}
		        		}
		        	});
		        	return response;
		        },
		      //检验输入限制
		        valifyInputLimit1 : function($jqDom){
		        	var me = this;
		        	var result = true;
		        	var p = new Object();
		        	var attr_name = $jqDom.attr("attr_name");
		        	var response = new Object();
		        	response.result = "true";
		        	
		        	//特殊规则校验
		        		//时间输入框
		        		if($jqDom.hasClass("time_input")){
		        			var input_limit = $jqDom.attr("input_limit");
		        			if(input_limit!=""&&input_limit!=undefined){
		        				var limit_arr = input_limit.split("-");
		        				if(limit_arr[0]=="end"){//失效时间，最大、最小时间范围校验
		            				var range = limit_arr[1];
		            				var range_type = limit_arr[2];
		            				//取得生效时间
		            				var end_time = $jqDom.val();
		            				var start_time = $jqDom.closest("form").prev().find("input[class='time_input form-control']").val();
		            				var resp = new Object();
		            				if(range==undefined||range_type==undefined){
		            				}else{
		            					resp = me.compareTimeRange(start_time,end_time,range,range_type);
		            				}
		            				
		            				var endDate=new Date(end_time.replace("-", "/").replace("-", "/"));  
		            				if(endDate.getDate()!=1){
		            					resp.result = "false";
		            					resp.msg = "失效时间要求填写N月后的1号！";
		            				}
		            				
		            				if(resp.result == "false"){
		            					response.result = resp.result;
		            					response.msg = resp.msg;
		            					return response;//跳出循环
		            				}
		            			}
		        			}
		        		}else if($jqDom.hasClass("input_html")){
		        			
		        			
		        			
		        			
		        			
		        		}else if($jqDom.hasClass("int_html")){
		        			//月份
		        			
		        			if(attr_name=='月份'){//做月份校验
		        				
		        			var time1 =	$jqDom.siblings("div.time_input").eq(0).find("input").val();
		        			var time2 =	$jqDom.siblings("div.time_input").eq(1).find("input").val();
		        			
		        			var date1= [];
		        			var date2 = []
		        			date1 =	time1.substring(0,10).split("-");   
		            	    date2=time2.substring(0,10).split("-");
		                	var year1 = parseInt(date1[0]); 
		                  var month1 = parseInt(date1[1]);
		                  var  year2 = parseInt(date2[0]);
		                  var  month2 = parseInt(date2[1]); 
//		                    //通过年,月差计算月份差
		                  var months = (year2 - year1) * 12 + (month2-month1);
		            	    if(months!=new Number($jqDom.find("input").val())){
		    					response.result = "false";
		    					response.msg = '属性-月份值填写不正确，实际：'+new Number($jqDom.find("input").val())+"',理应："+months;
		    					return response;//跳出循环
		            	    }
		        			}else{
		        				var input_limit = [];
		        				if($jqDom.attr("input_limit")!=undefined){
		        					input_limit = $jqDom.attr("input_limit").split("-");
		            				var value = parseInt($jqDom.val());
		            				if(input_limit.length==2){
		            					if(input_limit[1]==""){
		            						if(value < parseInt(input_limit[0])){
		            							response.msg = attr_name+"的输入需填写大于"+input_limit[0]+"的整数！";
		                						response.result = "false";
		                						return response;//跳出循环
		            						}
		            					}else if(input_limit[0]==""){
		            						if(value >= parseInt(input_limit[1])){
		            							response.msg = attr_name+"的输入需填写小于"+input_limit[1]+"的整数！";
		                						response.result = "false";
		                						return response;//跳出循环
		            						}
		            					}else if(!(parseInt(input_limit[0])<=value&&value<=parseInt(input_limit[1]))){
		            						response.msg = attr_name+"的输入需填写"+$jqDom.attr("input_limit")+"的整数！";
		            						response.result = "false";
		            						return response;//跳出循环
		            					}
		            				}else{
		            					var list = $jqDom.attr("input_limit").split("|");
		            					var list_1 = [];
		            					var limit = [];
		            					for(var i=0;i<list.length;i++){
		            						list_1 = list[i].split("-");
		            						limit.push(list_1); 
		            					}
		            					if(!((parseInt(limit[0])<=value && value<parseInt(limit[1]))||(parseInt(limit[3])<=value && value<parseInt(limit[4])))){
		            						response.msg = attr_name+"的输入需填写"+list[0]+"或"+list[1]+"的整数！";
		            						response.result = "false";
		            						return response;//跳出循环
		            					}
		            				}
		        				}
		        			}
		        		}else if($jqDom.hasClass("abc123_html")){
		        			var value = $jqDom.val();
		        			var re =  /^[0-9a-zA-Z]*$/g; 
		        			if(!re.test(value)){
		        				response.msg = attr_name+"的输入需填写字母或数字类型！";
								response.result = "false";
								return response;//跳出循环
		        			}
		        		}
		        	return response;
		        }, 
		        
		        specialCheck : function($jqDom,offer_inst_id){
		        	var that = this;
		        	var operType = "";
					var userClass = "";
					var userAccount = "";
					var response = new Object();
					response.result = "true";
					$jqDom.find("[name='attr']").each(function(index,ele){
						var attr_code = $(ele).attr("attr_code");
						if(attr_code == "390000214285"){
							userClass = $(ele).val();
						}else if(attr_code == "390000214284"){
							operType = $(ele).find("input").val();
						}else if(attr_code == "390000214286"){
							userAccount = $(ele).val();
						}
						//流量共享产品（月包模式） 特殊校验
						if(attr_code == "390020001825"){
							that.isHasMem(offer_inst_id);
						}
					});
					
					if((operType=="" && userClass=="" && userAccount=="")||(operType!="" && userClass!="" && userAccount!="")){
						response.result = "true";
					}else{
						response.result = "false";
						response.msg = "请确保以下3个属性同时填写或同时为空 ：企业客户成员级别操作类型，企业客户成员级别，企业客户成员个人通话阀值";
					}
					
					return response;
		        },
		        
		        isHasMem : function(offer_inst_id){
		        	var param = {};
		        	param.offer_inst_id = offer_inst_id;
		        	fish.callService("BusiGroupOrderController", "queryIsHasMem", param, function(result){
		        		 if(result.result==false){    
		        			 return true;
	                        }else{
	                        	layer.alert("订购组下存在成员时,不允许变更该或退订该套餐！");
	                        	return false;
	                        }
		            });
		        },
		        
		        // 比较时间范围
		        compareTimeRange : function(start_time,end_time,range,range_type){
		        	
		        	var resp = new Object();
		        	resp.result = "true";
		        	
		        	if(start_time>end_time){
		        		resp.result = "false";
		        		resp.msg = "错误：生效时间大于失效时间！";
		        	}
		        	
		        	if(range.indexOf("m")>0){// 月份比较
		        		
		        		var m_num = new Number(range.substring(0,range.indexOf("m")));;
		        		var startDate=new Date(start_time.replace("-", "/").replace("-", "/"));    
		        	    var endDate=new Date(end_time.replace("-", "/").replace("-", "/"));    
		        	    var number = 0;
		        	    var yearToMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12;      
		        	    number += yearToMonth;      
		        	    monthToMonth = endDate.getMonth() - startDate.getMonth();      
		        	    number += monthToMonth;    
		        	    if(range_type=="maxday"){
		        	    	if(number>m_num||(number==m_num&&(endDate.getDate()>startDate.getDate()))){
		        	    		resp.result = "false";
		        	    		resp.msg = "时间选择范围大于最大值（"+m_num+"个月）！";
		        	    	}
		        	    }else if(range_type=="minday"){
		        	    	if(number<m_num||(number==m_num&&(endDate.getDate()<startDate.getDate()))){
		        	    		resp.result = "false";
		        	    		resp.msg = "时间选择范围小于最小值（"+m_num+"个月）！";
		        	    	}
		        	    }
		        	}else if(range.indexOf("d")>0){// 日比较
		        		var d_num = range.substring(0,range.indexOf("d")-1);
		        		// 暂时不考虑日长的情况,不应该出现日的情况（超过一个月的日长度难计算）
		        	}
		        	return resp;
		        },
		        
		        
		        // 非空判断
		        nullableValidate : function($jqdom){
		        	
		        	var resp = {};
		        	resp.result = "true";
		        	resp.msg = "";
		        	$jqdom.each(function(index,ele){
		            	if($(ele).hasClass("inp-select")&&$(ele).find("input").val()==""){
		            		if($(ele).attr("is_required")=='1' && $(ele).attr("is_modif")=='1'){
		                		resp.result = "false";
		                		resp.msg = "请先填写套餐内容!";
		                		layer.alert("请您先填写套餐内容!",{yes: function() {
		                			$(ele).find("input").focus(); 
		                			layer.closeAll();
		                		}});
		                		return;
		            		}
		            	}
		            	if($(ele).hasClass("inp-text")&&$(ele).val()==""){
		            		if($(ele).attr("is_required")=='1' && $(ele).attr("is_modif")=='1'){
		            			resp.result = "false";
		            			resp.msg = "请先填写套餐内容!";
		            			layer.alert("请您先填写套餐内容!",{yes: function() {
		            				$(ele).focus(); 
		                			layer.closeAll();
		                		}});
		                		return;
		            		}
		            	}
		            	if($(ele).hasClass("time_input")&&$(ele).val()==""){
		            		if($(ele).attr("is_required")=='1' && $(ele).attr("is_modif")=='1'){
		          
		            			resp.result = "false";
		            			resp.msg = "请先填写套餐内容!";
		            			layer.alert("请您先填写套餐内容!",{yes: function() {
		            				$(ele).focus(); 
		                			layer.closeAll();
		                		}});
		                		return;
		            		}
		            	}
		            });
		        	return resp;
		        },
		        
		        validate : function(startDate, endDate){
		        	if (startDate == '' || endDate == '') {
		        		layer.alert("时间设置不能为空!");
		        		return false;
		        	}
		        	
		        	var startTime = this.getDateTime(startDate);
		        	var endTime = this.getDateTime(endDate);
		        	
		        	if (startTime > endTime) {
		        		layer.alert("生效时间不能大于失效时间!");
		        		return false;
		        	}
		        	return true;
		        },
		        
		        getDateTime : function(dateStr){
		        	var date = null;
		        	date = new Date(dateStr);
		        	return  date.getTime();
		        }
}
