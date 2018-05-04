var Prod_add_page = {
		bol : '',
		loadProd : function(data){
			var that = this;
			for (var i = 0; i < data.result.length; i++) {
	            var item = data.result[i];
	            var attr_list = data.result[i].list_busi_prod_attr;
	            var content_div = $('<li></li>');
	            var label = $('<label class="no-margin-bottom"><input class="js-check" type="checkbox" name="" ></label>')
	            label.append(item.prod_name);
	            content_div.append(label);
	            content_div.attr("prod_id",item.prod_id);
	            content_div.attr("order_eff_type",item.order_eff_type);
	            content_div.attr("order_exp_type",item.order_eff_type);
	            content_div.attr("prod_name",item.prod_name);
	            content_div.attr("pkg_prod_id",item.pkg_prod_id);
	            content_div.attr("attr_num",item.attr_num);
	            content_div.attr("prod_type",item.prod_type);
	            //画属性 
	        	var busiProdDetial = {};
	        	busiProdDetial.prod_id = item.prod_id;
	        	busiProdDetial.attr_num = item.attr_num;
	        	busiProdDetial.attr_list = attr_list;
	            that.buildProductDiv(content_div,busiProdDetial);
	            $("#prod_list").append(content_div);
	        }
		},
		buildProductDiv : function($tbody,busiProdDetial){
        	var me = this;
        	//1--文本框；2--下拉框；3-整数框；4--浮点数；5--时间框（yyyyMMdd）; 6 ---字母数字框
        	var content_div = $('<form class="form-inline inbox"></form>');
        	var select_html = $('<div class="form-group">'+
                    ' <input name="combobox1" class="form-control combobox1" type="text"></div>');
        	var input_html = $(' <div class="form-group inp-text input_html"><input type="text" class="form-control"></div>')
        	var time_html = $('<div class="form-group"><div class="input-group">'+
        			'<input type="text" class="form-control js-date"></div></div>');
        	var integer_html = $(' <div class="form-group inp-text int_html"><input type="text" class="form-control"></div>')
        	var fload_html = $(' <div class="form-group inp-text float_html"><input type="text" class="form-control"></div>')
        	var abcNum_html = $(' <div class="form-group inp-text abc123_html"><input type="text" class="form-control"></div>')
        	if(Number(busiProdDetial.attr_num)>0){
        		var params = {};
        		params.prod_id = busiProdDetial.prod_id;
        		var attr_list = busiProdDetial.attr_list;
        		if(busiProdDetial.prod_id=='380000010430'){
	    			var select_html_clone = select_html.clone();
//					select_html_clone.attr("field",busi_prod_attr.attr_name_cn);
					select_html_clone.find("input").attr("name","附加套餐");
					select_html_clone.find("input").attr("input_type","2");
//					select_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
					select_html_clone.attr("attr_code","390020001825");
					select_html_clone.attr("attr_id","390020001825");
					select_html_clone.attr("attrorser","0");
//					select_html_clone.attr("input_limit",busi_prod_attr.input_limit);
					select_html_clone.attr("is_required","1");
//					select_html_clone.find("select").attr("limit",busi_prod_attr.input_limit);
					select_html_clone.addClass("attr");
					select_html_clone.addClass("inp-select");
					var flowProd = me.queryFlowProd(select_html_clone);
//					me.getSelect_1("",flowProd,select_html_clone);
					content_div.append(select_html_clone);
	    		}
//        		fish.callService("BusiGroupOrderController", "getProdAttrByProd", params,function(data) {
//            		if(data.res_code == "00000"){
        		if(attr_list!=null){
        			for(var i=0;i<attr_list.length;i++){
        				var busi_prod_attr = attr_list[i];
        				if(busi_prod_attr.input_type=='1'){//文本输入框
        					var input_html_clone = input_html.clone();
        					input_html_clone.find("input").attr("placeholder",busi_prod_attr.attr_name_cn);
        					input_html_clone.find("input").attr("name",busi_prod_attr.attr_name_cn);
        					input_html_clone.find("input").attr("input_type",busi_prod_attr.input_type);
        					input_html_clone.attr("length",busi_prod_attr.input_length);
        					input_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
        					input_html_clone.attr("attr_code",busi_prod_attr.attr_code);
        					input_html_clone.attr("attr_id",busi_prod_attr.attr_id);
        					input_html_clone.attr("input_limit",busi_prod_attr.input_limit);
        					input_html_clone.attr("is_required",busi_prod_attr.attr_train);
        					input_html_clone.attr("attrorser",busi_prod_attr.attrorser );
        					input_html_clone.addClass("attr");
        					input_html_clone.val(busi_prod_attr.default_value);
        					content_div.append(input_html_clone);
        				}else if(busi_prod_attr.input_type=='2'){//select下拉选择框
        					var select_html_clone = select_html.clone();
        					select_html_clone.attr("field",busi_prod_attr.attr_name_cn);
        					select_html_clone.find("input").attr("name",busi_prod_attr.attr_name_cn);
        					select_html_clone.find("input").attr("input_type",busi_prod_attr.input_type);
        					select_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
        					select_html_clone.attr("attr_code",busi_prod_attr.attr_code);
        					select_html_clone.attr("attr_id",busi_prod_attr.attr_id);
        					select_html_clone.attr("input_limit",busi_prod_attr.input_limit);
        					select_html_clone.attr("is_required",busi_prod_attr.attr_train);
        					select_html_clone.find("select").attr("limit",busi_prod_attr.input_limit);
        					select_html_clone.addClass("attr");
        					select_html_clone.addClass("inp-select");
        					select_html_clone.attr("attrorser",busi_prod_attr.attrorser );
        					me.getSelect(busi_prod_attr.attr_name_cn,busi_prod_attr.input_limit,select_html_clone);
        					content_div.append(select_html_clone);
        				}else if(busi_prod_attr.input_type=='5'){//时间选择框
        					var time_html_clone = time_html.clone();
        					//目前时间选择框有生效时间和失效时间
        					time_html_clone.find("input").attr("placeholder",busi_prod_attr.attr_name_cn);
        					time_html_clone.find("input").attr("name",busi_prod_attr.attr_name_cn);
        					time_html_clone.find("input").attr("input_type",busi_prod_attr.input_type);
        					time_html_clone.attr("field",busi_prod_attr.attr_name_cn);
        					time_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
        					time_html_clone.attr("attr_code",busi_prod_attr.attr_code);
        					time_html_clone.attr("attr_id",busi_prod_attr.attr_id);
        					time_html_clone.attr("input_limit",busi_prod_attr.input_limit);
        					time_html_clone.attr("is_required",busi_prod_attr.attr_train);
        					time_html_clone.addClass("attr");
        					time_html_clone.addClass("time_input");
        					time_html_clone.attr("attrorser",busi_prod_attr.attrorser );
        					content_div.append(time_html_clone);
        					me.$('.js-date').datetimepicker();
        				}else if(busi_prod_attr.input_type=='3'){//整型框
        					var integer_html_clone = integer_html.clone();
        					integer_html_clone.find("input").attr("placeholder",busi_prod_attr.attr_name_cn);
        					integer_html_clone.find("input").attr("input_type",busi_prod_attr.input_type);
        					integer_html_clone.find("input").attr("name",busi_prod_attr.attr_name_cn);
        					integer_html_clone.attr("length",busi_prod_attr.input_length);
        					integer_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
        					integer_html_clone.attr("attr_code",busi_prod_attr.attr_code);
        					integer_html_clone.attr("attr_id",busi_prod_attr.attr_id);
        					integer_html_clone.attr("input_limit",busi_prod_attr.input_limit);
        					integer_html_clone.attr("is_required",busi_prod_attr.attr_train);
        					integer_html_clone.attr("attrorser",busi_prod_attr.attrorser );
        					integer_html_clone.addClass("attr");
        					integer_html_clone.val(busi_prod_attr.default_value);
        					content_div.append(integer_html_clone);
        				}else if(busi_prod_attr.input_type=='4'){//浮点数
        					var fload_html_clone = fload_html.clone();
        					fload_html_clone.find("input").attr("placeholder",busi_prod_attr.attr_name_cn);
        					fload_html_clone.find("input").attr("input_type",busi_prod_attr.input_type);
        					fload_html_clone.find("input").attr("name",busi_prod_attr.attr_name_cn);
        					fload_html_clone.attr("length",busi_prod_attr.input_length);
        					fload_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
        					fload_html_clone.attr("attr_code",busi_prod_attr.attr_code);
        					fload_html_clone.attr("attr_id",busi_prod_attr.attr_id);
        					fload_html_clone.attr("input_limit",busi_prod_attr.input_limit);
        					fload_html_clone.attr("is_required",busi_prod_attr.attr_train);
        					fload_html_clone.attr("attrorser",busi_prod_attr.attrorser );
        					fload_html_clone.addClass("attr");
        					fload_html_clone.val(busi_prod_attr.default_value);
        					content_div.append(fload_html_clone);
        				}else if(busi_prod_attr.input_type=='6'){
        					var abcNum_html_clone = abcNum_html.clone();
        					abcNum_html_clone.find("input").attr("placeholder",busi_prod_attr.attr_name_cn);
        					abcNum_html_clone.find("input").attr("input_type",busi_prod_attr.input_type);
        					abcNum_html_clone.find("input").attr("name",busi_prod_attr.attr_name_cn);
        					abcNum_html_clone.attr("length",busi_prod_attr.input_length);
        					abcNum_html_clone.attr("attr_name",busi_prod_attr.attr_name_cn);
        					abcNum_html_clone.attr("attr_code",busi_prod_attr.attr_code);
        					abcNum_html_clone.attr("attr_id",busi_prod_attr.attr_id);
        					abcNum_html_clone.attr("input_limit",busi_prod_attr.input_limit);
        					abcNum_html_clone.attr("is_required",busi_prod_attr.attr_train);
        					abcNum_html_clone.addClass("attr");
        					abcNum_html_clone.attr("attrorser",busi_prod_attr.attrorser );
        					abcNum_html_clone.val(busi_prod_attr.default_value);
        					content_div.append(abcNum_html_clone);
        				}
        			}
	        	}
    		}
        	$tbody.append(content_div);
            			
        },
        queryFlowProd : function(select_html_clone){
        	var param = {};
        	var that = this;
	    	 fish.callService("BusiGroupOrderController", "queryFlowProd", param, function(data){
	         	if(data.result.length>0){
	         		var item = data.result;
	         		var flowProdList = [];
	         		for(var i=0;i<item.length;i++){
	         			var flowProd = {};
	         			flowProd.prod_id = item[i].prod_id;
	         			flowProd.prod_name = item[i].prod_name;
	         			flowProdList.push(flowProd);
	         		}
	         		that.getSelect_1("",flowProdList,select_html_clone);
	     		}
	         });
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
       	 var $combobox1 = select_html_clone.find("input").combobox({
             placeholder: attr_name,
             dataTextField: 'name',
             dataValueField: 'value',
             dataSource: dataSource,
         });
		},
		getSelect_1 : function(attr_name,flow_prod,select_html_clone){
	       	 var dataSource = [];
	       	 for(var i=0;i<flow_prod.length;i++){
	       		var source = {};
	       		source.name = flow_prod[i].prod_name;
	       		source.value = flow_prod[i].prod_id;
	       		dataSource.push(source);
	       		}
	       	 var $combobox1 = select_html_clone.find("input").combobox({
	             placeholder: "附加套餐",
	             dataTextField: 'name',
	             dataValueField: 'value',
	             dataSource: dataSource,
	         });
			},
		specialCheck : function($jqDom){
			var that = this;
			var prod_name = $jqDom.attr("prod_name");
			var prod_id = $jqDom.attr("prod_id");
			var response = new Object();
			response.prod_id = prod_id;
			response.prod_name = prod_name;
			response.result = "true";
			if($jqDom.attr("prod_id")==390020004187){
				var operType = "";
				var userClass = "";
				var userAccount = "";
				$jqDom.find(".attr").each(function(index,ele){
					var attr_code = $(ele).attr("attr_code");
					
					if(attr_code == "390000214285"){
						userClass = $(ele).find("input").val();
					}else if(attr_code == "390000214284"){
						operType = $(ele).find("input").val();
					}else if(attr_code == "390000214286"){
						userAccount = $(ele).find("input").val();
					}
				});
				if((operType=="" && userClass=="" && userAccount=="")||(operType!="" && userClass!="" && userAccount!="")){
					response.result = "true";
				}else{
					response.result = "false";
					response.msg = "请确保以下3个属性同时填写或同时为空 ：企业客户成员级别操作类型，企业客户成员级别，企业客户成员个人通话阀值";
				}
			}
			return response ;
		},
		 //检验输入限制
        valifyInputLimit : function($jqDom){
        	var me = this;
        	var result = true;
        	var p = new Object();
        	var attr_name = $jqDom.attr("attr_name");
        	var prod_name = $jqDom.closest("li").attr("prod_name");
			var prod_id = $jqDom.closest("li").attr("prod_id");
        	var response = new Object();
        	response.prod_id = prod_id;
			response.prod_name = prod_name;
        	response.result = "true";
        		//时间输入框
        		if($jqDom.hasClass("time_input")){
        			var input_limit = $jqDom.attr("input_limit");
        			if(input_limit!=""&&input_limit!=undefined){
        				var limit_arr = input_limit.split("-");
        				if(limit_arr[0]=="end"){//失效时间，最大、最小时间范围校验
            				var range = limit_arr[1];
            				var range_type = limit_arr[2];
            				//取得生效时间
            				var end_time = $jqDom.find('input').val();
            				var start_time = $jqDom.siblings("div.time_input").eq(0).find("input").val();
            				var resp = new Object();
            				if(range==undefined||range_type==undefined){
            					//resp.result = "true";
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
//                    //通过年,月差计算月份差
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
            				var value = parseInt($jqDom.find("input").val());
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
        			var value = $jqDom.find("input").val();
        			var re =  /^[0-9a-zA-Z]*$/g; 
        			if(!re.test(value)){
        				response.msg = attr_name+"的输入需填写字母或数字类型！";
						response.result = "false";
						return response;//跳出循环
        			}
        		}
        		
        	return response;
        }, 
        
        //比较时间范围
        compareTimeRange : function(start_time,end_time,range,range_type){
        	var resp = new Object();
        	resp.result = "true";
        	
        	if(start_time>end_time){
        		resp.result = "false";
        		resp.msg = "错误：生效时间大于失效时间！";
        	}
        	
        	if(range.indexOf("m")>0){//月份比较
        		
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
        	}else if(range.indexOf("d")>0){//日比较
        		var d_num = range.substring(0,range.indexOf("d")-1);
        		//暂时不考虑日长的情况,不应该出现日的情况（超过一个月的日长度难计算）
        	}
        	return resp;
        },
        nullableValidate : function($jqDom){
			var that = this; 
        	var resp = {};
        	resp.result = "true";
        	resp.msg = "";
        	if($jqDom.find("input.combobox1").combobox("value")==null){
        		
        		if($jqDom.attr("is_required")=='1'){
            		resp.result = "false";
            		layer.alert("请您先填写套餐内容!",{yes: function() {
            			$jqDom.find("input").focus(); 
            			layer.closeAll();
            		}});
            		
            		return resp;
        		}
        	}
        	if(($jqDom.hasClass("time_input")||$jqDom.hasClass("inp-text"))&&$jqDom.find("input").val()==""){
        		if($jqDom.attr("is_required")=='1'){
        			resp.result = "false";
        			layer.alert("请您先填写套餐内容!",{yes: function() {
            			$jqDom.find("input").focus(); 
            			layer.closeAll();
            		}});
            		
            		return resp;
        		}
        	}
//        	if($jqDom.hasClass("time_input")&&$jqDom.find("input").val()==""){
//        		if($jqDom.attr("is_required")=='1'){
//        			resp.result = "false";
//        			layer.alert("请您先填写套餐内容!",{yes: function() {
//            			$jqDom.find("input").focus(); 
//            			layer.closeAll();
//            		}});
//            		
//            		return resp;
//        		}
//        	}
        	return resp
        },
        getAttrValue : function($jqDom){
          	var attr = {};
          	if($jqDom.hasClass("inp-select")){
          		attr.attr_value = $jqDom.find("input.combobox1").combobox("value");
          	}else{
          		attr.attr_value = $jqDom.find("input").val();
          	}
          	attr.attrorser = $jqDom.attr("attrorser");
      		attr.attr_name = $jqDom.attr("attr_name");
      		attr.attr_code = $jqDom.attr("attr_code");
      		attr.attr_id = $jqDom.attr("attr_id");
          	return attr;
          },
}