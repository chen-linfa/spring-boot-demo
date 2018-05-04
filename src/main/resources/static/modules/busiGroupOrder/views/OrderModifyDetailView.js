define(["hbs!../templates/orderModifyDetailView.html",'./prod_page_util','./Prod_add_page'
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        info : {},
        offer_inst_id : '',
        flowProdList : '',
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        loadData:function(data,type){
        	var that = this;
        	if("delete" == type){
        		that.$(".modal-title").text("套餐详情");
        		that.$("#btn_edit_attr").hide();
        		that.$("#btn_cancel").removeAttr("class").attr("class","btn btn-primary").text("返回");
        	}
        	that.info.inst_status = data.inst_status;
        	that.info.prod_id = data.prod_id;
        	that.info.prod_inst_id = data.prod_inst_id;
        	
        	that.$("form").form("value",data);
        	//根据prod_id查询产品属性值
        	that.offer_inst_id = data.offer_inst_id;
        	if(data.attr_num > 0 ){
  	  			that.$("#tc_attr_div").show();
  				that.getProdAttrByProdId(data.prod_id,data.prod_inst_id);
  				that.flowProdList = data.flowProdList
  			}
        },
      //根据prod_id查询套餐属性
        getProdAttrByProdId : function(prod_id,prod_inst_id){
        	var that = this;
        	var param = {
        			prod_id:prod_id,
        			prod_inst_id:prod_inst_id
        	};
        	fish.callService("BusiGroupOrderController", "getProdAttrByProdId",param,function(result){
        		var data = result.result;
        		var $tbody = that.$("#tc_attr_div");
        		that.$("#tc_attr_div").empty();
        		if(result.res_code = '00000'){
        			for(var i=0;i<data.length;i++){
        				if(data[i].prod_id == '380000010430'){
        					var info = "";
        					info = data[i];
        					info.flowProdList = that.flowProdList;
          	  				prod_page_util.buildProductAttrDiv($tbody,info,"flow");
          	  			}else if(i==data.length-1){
          	  				prod_page_util.buildProductAttrDiv($tbody,data,"");
          	  			}
        			}
        			
        		}else {
        			
        		}
        		that.$("#tc_attr_div").find(".inp-select").find("input").attr("disabled",true);
        	});
        },
        afterRender: function () {
            var that = this;
            
            //编辑按钮绑定点击事件
            that.$("#btn_edit_attr").unbind("click").bind("click",function(){
//        		that.$("#eff_time").datetimepicker({showSecond:true,timeFormat:'yyyy-MM-dd HH:mm:ss'
//        							,startDate:fish.dateutil.format(new Date(), 'yyyy-mm-dd HH:mm:ss')});
//        		that.$("#exp_time").datetimepicker({showSecond:true,timeFormat:'yyyy-MM-dd HH:mm:ss'
//        							,startDate:fish.dateutil.format(new Date(), 'yyyy-mm-dd HH:mm:ss')});
        		that.$("#tc_attr_div").find(".time_input").each(function(index,ele){
        			$(ele).datetimepicker({showSecond:true,timeFormat:'yyyy-MM-dd HH:mm:ss'
						,startDate:fish.dateutil.format(new Date(), 'yyyy-mm-dd HH:mm:ss')});
        		});
//        		that.$("#eff_time").removeAttr("disabled");
//        		that.$("#exp_time").removeAttr("disabled");
        		that.$("#tc_attr_div").find("[name='attr']").each(function(index,el){
        			if($(el).attr("is_modif") == "1"){
        				if($(el).attr("input_type") == "2"){
        					that.$(el).prev("#cover_select").hide();
        					that.$(el).find("input").removeAttr("disabled");
        				}else if($(el).attr("input_type") == "5"){
        					that.$(el).find(".time_input").removeAttr("disabled");
        				}else{
        					that.$(el).removeAttr("readonly");
        					that.$(el).removeAttr("disabled");
        				}
        			}
        		});
        		//that.$("#tc_attr_div").find(".inp-select").find("input").attr("disabled",false);
        		//that.$("#tc_attr_div").find(".time_input").attr("disabled",false);
        		that.$(this).hide();
        		that.$("#btn_submit").show();
        		
        	});
            
            //为确定按钮绑定点击事件
            that.$("#btn_submit").unbind("click").bind("click",function(e){
            	var product_info = {};
        		//product_info.name = "冰激凌";
        		
        		var prod_name = that.$("#tc_detail_name").val();
    			var eff_time = that.$("#eff_time").val();
    			var exp_time = that.$("#exp_time").val();
    			
    			var inst_status = that.info.inst_status;
    			if(inst_status == "1200"){
    				layer.alert("暂停状态不能变更套餐");
    			}
    			//日期校验
    			if(!(prod_page_util.validate(eff_time,exp_time))){
    				return false;
    			};
    			
    			//非空验证
    			var resp1 = prod_page_util.nullableValidate(that.$("#tc_attr_div").find("[name='attr']"));
    			if(resp1.result == "false"){
    				return false;
    			}
    			
    			var bol = true;
    			//校验输入限制
    			that.$("#tc_attr_div").find("[name='attr']").each(function(index,ele){
    				var resp = prod_page_util.valifyInputLimit1($(ele));
    				if(resp.result == "false"){
    					bol = false;
                		layer.alert(resp.msg);
                		return false;
                	}
    			});
    			if(bol){
        			var resp = prod_page_util.specialCheck(that.$("#tc_attr_div"),that.offer_inst_id);
        			if(resp.result == "false"){
                  		bol = false;
                		result = false;
                		layer.alert(resp.msg);
                		return false;
                	}
        		}
    			product_info.eff_time = eff_time;
    			product_info.exp_time = exp_time;
    			that.info.product_info = product_info;
    			var attr_list = [];
    			if(that.$("#tc_attr_div").find("[name='attr']").length > 0){
    				that.$("#tc_attr_div").find("[name='attr']").each(function(index,ele){
        				var attr = prod_page_util.getAttrValue($(ele));
            			attr_list.push(attr);
        			});
    				that.info.product_attr = attr_list;
    			}else {
    				that.info.product_attr = attr_list;
    			}
    			//that.$("#form_panel").empty();
    			if(bol && that.info.prod_id == "380000010430"){
    				var param = {};
		        	param.offer_inst_id = that.offer_inst_id;
		        	fish.callService("BusiGroupOrderController", "queryIsHasMem", param, function(result){
		        		 if(result.result==false){ 
		        			 bol = true;
		        			 that.parentView.submitModifyOrder(that.info);
		        			 that.$("#btn_cancel").click();
	                        }else{
	                        	layer.alert("订购组下存在成员时,不允许变更该或退订该套餐！");
	                        	bol = false;
	                        }
		            });
    			}else if(bol){
    				//调用变更套餐方法
    				that.parentView.submitModifyOrder(that.info);
    				that.$("#btn_cancel").click();
    			}
//    			
    			
        	});
            
            fish.callService("CustHomePageController", "queryCustInfoForHome", {}, function(result){
            	var cust = result.result.cust;
                if(cust){
                	that.$("input[name=user_name]").val(cust.cust_code);
                	that.cust_code = cust.cust_code;
                }
            });
            
            that.$("input[name=password]").on("input",function(){
            	var strength = fish.utils.checkPasswdStrength($(this).val());
            	if(strength <3){
            		//弱
            		that.$("#strength_text").text("弱");
            		that.$(".active-low").show();
            		that.$(".active-middle").hide();
            		that.$(".active-high").hide();
            	}else if(strength == 3){
            		//中
            		that.$("#strength_text").text("中");
            		that.$(".active-low").show();
            		that.$(".active-middle").show();
            	}else{
            		//强
            		that.$("#strength_text").text("强");
            		that.$(".active-low").show();
            		that.$(".active-middle").show();
            		that.$(".active-high").show();
            	}
            });
            
            /*that.$("#btn_submit").click(function(){
            	var param = that.$("form").form("value");
            	if(that.vaildData(param)){
            		fish.callService("SPUserController", "checkChildSPUserName", param, function(data){
						if(data.res_code == "00000"){
							var is_exists = data.result;
							if(is_exists){
								layer.alert("操作失败，账号名称已被使用，请重新输入账号");
							}else{
								param.password = $.base64.encode(param.password);
								fish.callService("SPUserController", "AddChildSPUser", param, function(data){
									if(data.res_code == "00000"){
										layer.alert("添加成功，新增的子账号只有配置了菜单权限、成员群组权限才能正常使用！");
										that.popup.close();
										that.parentView.queryChildUser();
									}else if(data.res_code == 40000){
										layer.alert(data.res_message);
									}else {
										layer.alert("添加失败，请重试");
									}
								});
							}
						}else {
							layer.alert("添加失败，请重试");
						}
					});
            	}
            });*/
        },
        onClosePupup: function () {
            this.popup.close();
        },
        vaildData:function(data){
        	var result = true;
			if(!data.user_name){
				layer.alert("用户名不能为空");
				return false;
			}
			
			if(!data.chinese_name){
				layer.alert("姓名不能为空");
				return false;
			}
			
			if(!data.mobile_phone){
				layer.alert("手机号码不能为空");
				return false;
			}
			
			if(!data.password){
				layer.alert("密码为空");
				return false;
			}
				
				if(!data.confirm_pwd){
					layer.alert("确认密码不能为空");
					return false;
				}
				
				if(data.confirm_pwd != data.password ){
					layer.alert("密码不一致");
					return false;
				}
				
			if(fish.utils.checkPasswdStrength(data.password) < 3){
					layer.alert("您输入的密码为弱密码，请您采用至少由8位及以上大小写字母、"
						+ "数字及特殊字符等混合、随机组成（至少包括数字、小写字母、大写字母和特殊符号中的三种）的密码串。");
					return false;
			}
			
			if(data.mobile_phone){
				if(!fish.utils.checkPhoneNumber(data.mobile_phone)){
					layer.alert("手机号码格式错误");
					return false;
				}
			}
			
			if(data.email){
				if(!fish.utils.isEmail(params.email)){
					layer.alert("邮箱格式错误");
					return false;
				}
			}
        	return result;
        }

    });

    return components;
});
