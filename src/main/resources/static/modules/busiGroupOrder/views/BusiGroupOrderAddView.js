define(['hbs!modules/busiGroupOrder/templates/busiGroupOrderAdd.html',"./Prod_add_page","./select_value_util",
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            order_info : {}, //订单信息,
            busi_type : '1',
            grp_id :'',
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-date').datetimepicker();
                that.$('.js-check').icheck();
//                that.$('.js-pagination').pagination({
//                    records: 100
//                });
                that.initEvent();
                var option = {
                        pagination: false,
                        autoFill: false,
                        singleSelect: true,//该表格可以多选
                        rowId: "offer_inst_id",//指定主键字段
                        onSelectClass: "selected",
                        nowPage: 1,
                        columns: [
                            {data: "prod_name", title: "订购组名称", width: "20%"},
                            {data: "offer_inst_id", title: "策划实例编号", width: "15%"},
                            {data: "prod_id", title: "产品编号", width: "15%"},
                            {data: "comments", title: "产品说明", width: "15%",visible:false},
                            {data: "offer_inst_id", title: "订购组实例ID", width: "10%",visible:false},
                            {data: "operation", title: "操作", width:"20%", formatter: function(data){
                                //操作列的按钮生成
                            	var html = '<a href="javascript:void(0);" class="js-btn_edit add_view">添加</a> '
    								+'<a href="javascript:void(0);" class="js-btn_del query_prod_order">套餐查询</a> '
    								+'<a href="javascript:void(0);" class="js-btn_menu query_rel">订购关系</a> '
    							return html;
                            }}
                        ],//每列的定义
                        onLoad: fish.bind(that.bindFormTableEvent,that) //表单加载数据后触发的操作
                    };
                	that.$form_table= that.$("#form_table").xtable(option);
                	that.doQuery(null,null,"");
                	
            	 var option_1 = {
                         pagination: false,
                         autoFill: false,
                         singleSelect: true,//该表格可以多选
                         rowId: "mem_user_id",//指定主键字段
                         onSelectClass: "selected",
                         nowPage: 1,
                         columns: [
                             {data: "mem_user_id", title: "成员卡号", width: "40%"},
                             {data: "card_brand_type", title: "卡品牌类型", width: "20%" ,formatter: function(result){
         						//操作列的按钮生成
         						if(result=='0'){
         							return '本地卡';
         						}else if(result=='1'){
         							return '物联卡';
         						}
         					}},
                             {data: "opening_date", title: "开户日期", width: "40%"},
                         ],//每列的定义
                             onLoad: fish.bind(that.bindFormTableEvent_1,that) //表单加载数据后触发的操作
                     };
                 	that.$form_table_1= that.$("#form_table_1").xtable(option_1);
                	
                	var option_2 = {
                        pagination: false,
                        autoFill: false,
                        singleSelect: true,//该表格可以多选
                        rowId: "prod_id",//指定主键字段
                        onSelectClass: "selected",
                        nowPage: 1,
                        columns: [
                            {data: "prod_id", title: "产品编码", width: "30%"},
                            {data: "prod_name", title: "产品名称", width: "30%"},
                            {data: "eff_time", title: "生效时间", width: "20%"},
                            {data: "exp_time", title: "失效时间", width: "20%"}
                        ],//每列的定义
                    };
                	that.$form_table_2= that.$("#form_table_2").xtable(option_2);
                    //过滤非法的卡号输入值
                    that.$('#search_input_id').bind({
                        keyup:function(){
                            this.value=this.value.replace(/\D/g,'');
                        }
                    });
                    that.$('.js-pagination').pagination({
                        records: 0,
                        pgRecText:false,
                        pgTotal:false,
                        onPageClick:function(e,eventData){
                        	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                        	that.$form_table.xtable("options",{pageSize:rowNum});
                        	that.doQuery(eventData.page,rowNum);
                        },
                        create:function(){
                        	that.doQuery(1);
                        }
                    });
            },
            bindFormTableEvent_1:function(){
            	var that = this;
            	that.$('.js-pagination_1').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination_1').pagination("option","rowNum");
                    	that.$form_table_1.xtable("options",{pageSize:rowNum});
                    	that.doQuery_rel(eventData.page,rowNum,that.grp_id);
                    },
                    create:function(){
//                    	that.doQuery_rel(1);
                    }
                });
            },
            
            initEvent:function(){
            	var that = this;
            	//套餐搜索
            	$("#btn_search").unbind("click").bind("click",function(e){
            		var prod_name = $("#prod_name").val();
            		var param = {};
            		param.prod_name = prod_name;
            		param.offer_inst_id = that.grp_id;
            		that.queryProdList(param);
            	});
            	//成员搜索
            	$("#btn_search_1").unbind("click").bind("click",function(e){
            		that.doQuery_rel(null,null,that.grp_id);
            	});
            	//套餐查询 搜索
            	$("#btn_search_2").unbind("click").bind("click",function(e){
            		that.doQuery_orderProd(null,null,that.grp_id);
            	});
            	//选订购组 查询
            	$("#btn_search_3").unbind("click").bind("click",function(e){
            		var name = $("#name").val(); 
            		that.doQuery(null,null,name);
            	});
            	//套餐查询 调接口刷新数据
            	$("#refresh").unbind("click").bind("click",function(e){
            		that.refresh_orderProd();
            	});
            	$("#submit").unbind("click").bind("click",function(e){
            		//1.非空校验
            		var bol = true;
            		if($("#choosed_list").find("li").length<=0){
            			bol = false;
        				layer.alert("请您选择套餐!");
        			}
            		
            		//测试 校验屏蔽
            		//2.是否都填了属性
            	
            		$("#prod_list").find("li div.checked").closest("li").each(function(index,ele){
    	        		$(ele).find(".attr").each(function(index,ele){
    	        			var res = Prod_add_page.nullableValidate($(ele));
    	        			if(res.result == "false"){
    	        				bol = false;
    	        				return false;
    	        			}
    	        			
    	        			//（4）产品输入校验
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
    	        		//特殊产品规则校验
    	        		if(bol){
    	        			var resp = Prod_add_page.specialCheck($(ele));
    	        			if(resp.result == "false"){
	                      		bol = false;
	                    		result = false;
	                    		layer.alert(resp.prod_name +" : "+ resp.msg,{yes: function() {
	                    			layer.closeAll();
	                    		}});
	                    		
	                    		
	                    		return false;
	                    	}
    	        		}
    	        		if(bol){
    	        			var prod_id = $(ele).attr("prod_id");
    	        			var rel_id = "";
    	        			var msg = "";
	        				if(prod_id =="390020004186"){
	        					rel_id = "390020004709";
	        					msg = "请确保该订购组下所有成员均已完成订购集团通用流量池月功费产品！";
	        				}else if(prod_id =="390020004707"){
	        					rel_id ="390020004710"
	        					msg = "请确保该订购组下所有成员均已完成订购集团定向流量池月功费产品！"
	        				}
    	        			if(prod_id =="390020004186" || prod_id =="390020004707"){
    	        				var params = {};
        	    				params.offer_inst_id = that.grp_id;
        	    				params.prod_id = rel_id;
        	    				 fish.callService("BusiGroupOrderController", "queryIsAllMemOrdered", params, function(result){
        	    					 if(result.result==false){    
        	    	                	//3.校验产品间的互斥和依赖关系    
        	    	             		if(bol){
        	    	             			var params = {};
        	    	   	                  var selected_prod_list = [];
        	    	   	                  $("#choosed_list").find("li").each(function(index,ele){
        	    	   	                  	
        	    	   	                  	var prod = {};
        	    	   	                  	prod.prod_id = $(ele).attr("prod_id");
        	    	   	                  	prod.prod_name = $(ele).attr("prod_name");
        	    	   	                  	prod.prod_type = $(ele).attr("prod_type");
        	    	   	                  	selected_prod_list.push(prod);
        	    	   	                  	
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
        	    	   	                		that.order_info.product_list = product_list;
        	    	   	                		
        	    	   	                		if(bol){
        	    	   	                			//校验通过 提交 
        	    	   	                			that.submitGroupOrder();
        	    	   	                		}
        	    	   	                      } else {
        	    	   	                      	bol = false;
        	    	   	                      	layer.alert(data.res_message);
        	    	   	                      	return false;
        	    	   	                      }
        	    	   	                  });
        	    	             		}
        	                        }else{
        	                        	layer.alert(msg,{yes: function() {
        	                        		$(ele).find("input").focus(); 
        	                        		layer.closeAll();
        	                        	}});
        	                        	bol = false;
        	                        	return false;
        	                        	
        	                        }
        	    	             });
    	        			}else{
    	        				if(bol){
	    	             		  var params = {};
	    	   	                  var selected_prod_list = [];
	    	   	                  $("#choosed_list").find("li").each(function(index,ele){
	    	   	                  	
	    	   	                  	var prod = {};
	    	   	                  	prod.prod_id = $(ele).attr("prod_id");
	    	   	                  	prod.prod_name = $(ele).attr("prod_name");
	    	   	                  	prod.prod_type = $(ele).attr("prod_type");
	    	   	                  	selected_prod_list.push(prod);
	    	   	                  	
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
	    	   	                		that.order_info.product_list = product_list;
	    	   	                		
	    	   	                		if(bol){
	    	   	                			//校验通过 提交 
	    	   	                			that.submitGroupOrder();
	    	   	                		}
	    	   	                      } else {
	    	   	                      	bol = false;
	    	   	                      	layer.alert(data.res_message);
	    	   	                      	return false;
	    	   	                      }
	    	   	                  });
	    	             		}
    	        			}
    	        			
    	        		}
            		});
            	});
            	//添加成功后 查看订单详情
            	$(".queryDetail").unbind("click").bind("click",function(e){
            		 
            		 var viewURL = "modules/busiGroupOrder/views/busiGroupOrderQueryView";
            		 var order_id = $("#order_id").text()
                     that.parentView.openView(viewURL,order_id);
            		
            	});
            	////添加成功后 继续添加 回到订购组页面
            	$(".continue_add").unbind("click").bind("click",function(e){
            		that.$(".group_list_div").show();
                    that.$(".group_submit_div").hide();
                    $(".cleanAll").trigger("click");
                    $("#prod_list").empty();
            	});
            	
            },
            //套餐查询
            queryProdList : function(params){
            	var that = this;
            	$("#prod_list").empty();
                $("#choosed_list").empty();
            	
                fish.callService("BusiGroupOrderController", "queryProductsList", params, function(data){
                	var has_data = false;
                    var pageCount = 0;
                    if (data && data.result.length > 0) {
                    	that.$(".group_list_div").hide();
                        that.$(".group_detail_div").show();
                        has_data = true;
                        that.initProductTableData(data);
                    }
                    if (has_data == false) {
                    	that.$(".group_list_div").hide();
                        that.$(".group_detail_div").show();
                    }
                });
            },
            bindFormTableEvent:function(){
                var that = this;
                //添加
                that.$(".add_view").unbind("click").bind("click",function(e){
                    that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐添加></a><a class="current">选择套餐</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
                    $(".backToMain").unbind("click").bind("click",function(e){
                    	that.$(".group_list_div").show();
                        that.$(".group_detail_div").hide();
                        that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐添加');
                    });
                    var prod_id = $(this).parents("tr").attr("id");
                    var data = that.$form_table.xtable("findData","#"+prod_id);
                    var group = new Object();
                	group.group_id = data.offer_inst_id;
                	group.group_name = data.prod_name;
                	that.order_info.group = group;
                	that.grp_id = data.offer_inst_id;
                	//判断订购组是否锁定
                	var reParam = {};
                    reParam.offer_inst_id = data.offer_inst_id;
                    var bol = false;
                    fish.callService("BusiGroupOrderController", "queryGroupIsLock", reParam, function(result){
                        var pageCount = 0;
//                        if(result.result==false){ 测试注释    
                        	if(true){   //  测试用
                        	var param = {};
                        	param.offer_inst_id = data.offer_inst_id;
                        	that.grp_id = data.offer_inst_id;
                        	that.queryProdList(param);
                        }else{
                        	layer.alert("存在在途订单，请您选择其他订购组！")
                        }
                    });
                });
                //订购关系查询
                that.$(".query_rel").unbind("click").bind("click",function(e){
                    that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐添加></a><a class="current">订购关系查询</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
                    $(".backToMain").unbind("click").bind("click",function(e){
                    	that.$(".group_rel_div").hide();
                    	that.$(".group_list_div").show();
                       
                        that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐添加');
                    });
                    var prod_id = $(this).parents("tr").attr("id");
                    var data = that.$form_table.xtable("findData","#"+prod_id);
                    that.grp_id = data.offer_inst_id;
                    that.doQuery_rel(null,null,data.offer_inst_id);
                    //
                });
                //已订购的套餐查询
                that.$(".query_prod_order").unbind("click").bind("click",function(e){
                	that.$('.js-pagination_2').pagination({
                      records: 0,
                      pgRecText:false,
                      pgTotal:false,
                      onPageClick:function(e,eventData){
                      	var rowNum = that.$('.js-pagination_2').pagination("option","rowNum");
                      	that.$form_table_2.xtable("options",{pageSize:rowNum});
                      	that.doQuery_orderProd(eventData.page,rowNum,that.grp_id);
                      },
                      create:function(){
//                      	that.doQuery_orderProd(1);
                      }
                  });
                	that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐添加></a><a class="current">套餐查询</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
                	 $(".backToMain").unbind("click").bind("click",function(e){
                     	that.$(".group_list_div").show();
                         that.$(".group_prod_div").hide();
                         that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐添加');
                     });
                	var prod_id = $(this).parents("tr").attr("id");
                    var data = that.$form_table.xtable("findData","#"+prod_id);
                    that.grp_id = data.offer_inst_id;
                    that.doQuery_orderProd(null,null,data.offer_inst_id);
                });
            },
            doQuery : function(page,rows,value){
                var that = this;
                var param = {};
                var num = 1;
                var row = 10;
                if(value!=""&&value!=null){
                	param.prod_name = value;
                }
                param.page = page==null? num : page;
                param.rows = rows==null? row : rows;
                fish.callService("BusiGroupOrderController", "queryBusiGroup", param, function(result){
                    that.$("#form_table").xtable("loadData",result.rows);
                    that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                    that.$(".page-total-num").text(result.pageCount);
                    that.$(".page-data-count").text(result.total);
                });
            },
            doQuery_rel : function(page, rows,offer_inst_id){
            	var that = this;
                var bol = false;
                var params = {};
                var num = 1;
                var row = 10;
                params.page = 1;
                params.rows = 10;
                params.page = page==null? num : page;
                params.rows = rows==null? row : rows;
                params.group_id = offer_inst_id;
                var mem_user_id = $("#search_input").val();
                if(mem_user_id!=""&&mem_user_id!=null){
                	params.mem_user_id = mem_user_id;
                }
                fish.callService("BusiGroupOrderController", "queryGroupRel", params, function(result){
                	  that.$("#form_table_1").xtable("loadData",result.rows);
                      that.$('.js-pagination_1').pagination("update",{records:result.total,start:result.pageNumber});
                      that.$(".page-total-num_1").text(result.pageCount);
                      that.$(".page-data-count_1").text(result.total);
                      that.$(".group_list_div").hide();
                      that.$(".group_rel_div").show();
                });
            },
            doQuery_orderProd : function(page, rows,offer_inst_id){
            	var that = this;
                var bol = false;
                var params = {};
                var num = 1;
                var row = 10;
                params.page = page==null? num : page;
                params.rows = rows==null? row : rows;
                params.offer_inst_id = offer_inst_id;
                var prod_id = $("#search_input_id").val();
                if(prod_id!=""&&prod_id!=null){
                	params.prod_id = prod_id;
                }
                fish.callService("BusiGroupOrderController", "queryGroupOrderProd", params, function(result){
                	  that.$("#form_table_2").xtable("loadData",result.rows);
                      that.$('.js-pagination_2').pagination("update",{records:result.total,start:result.pageNumber});
                      that.$(".page-total-num_2").text(result.pageCount);
                      that.$(".page-data-count_2").text(result.total);
                      that.$(".group_list_div").hide();
                      that.$(".group_prod_div").show();
                });
            },
            
            refresh_orderProd : function(){
            	var that = this;
                var bol = false;
                var params = {};
                params.offer_inst_id= that.grp_id;
                fish.callService("BusiGroupOrderController", "refreshOrderProd", params, function(data){
                	if(data.res_code == "00000"){
                		that.$("#form_table_2").xtable("loadData",data.result);
            			layer.alert("刷新成功");
            		}else{
            			layer.alert(data.res_message);
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
            
    		checkOutProdInst : function(params){
        		
        		var result = false;
        		fish.callService("BusiOrderController", "checkOutProdLegal", params,function(data) {
                    if (data.res_code == '00000') {
                    	result = true;
                    } else {
                        layer.alert(data.res_message);
                    }
                });
                return result;
        	},
              
              initData : function(param){
              },
              
            //提交
    		submitGroupOrder : function(){
    			var that = this;
    			var params = {};
    			params.order_info = that.order_info;
    			fish.callService("BusiGroupOrderController", "submitGroupAddOrder", params,function(data) {
            		
            		if(data.res_code == "00000"){
            			layer.alert("添加成功！");
            			that.$(".group_detail_div").hide();
                        that.$(".group_submit_div").show();
                        that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐添加></a><a class="current">确认提交</a>');
                        $("#add_list").empty();
                        $("#choosed_list").find("li").each(function(index,ele){
                        	var li = $('<li></li>');
                        	li.html($(ele).attr("prod_name"));
                        	$("#add_list").append(li);
                        });
                        $("#prod_num").html(data.result.pkg_num);
                        $("#order_id").html(data.result.order_id);
            		}else{
            			layer.alert("添加失败");
            		}
            	 });
    		}
        });
        return pageView;
    });
