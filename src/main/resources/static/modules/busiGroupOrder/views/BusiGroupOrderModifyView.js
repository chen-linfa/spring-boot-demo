define([ 'hbs!../templates/busiGroupOrderModify.html','./prod_page_util'],
		function(modify) {
	var modifyView = fish.View.extend({
		template : modify,
		info:{},
		offer_inst_id:'',
		flowProdList : [],
		afterRender : function() {
			var that = this;
			var option = {
				pagination: false,
				autoFill: false,
				singleSelect: true,//该表格可以多选
				rowId: "offer_id",//指定主键字段
				onSelectClass: "selected",
				nowPage: 1,
				columns: [
				    //{checkbox:true},
					{data: "prod_name", title: "订购组名称", width: "20%"},
                    {data: "offer_inst_id", title: "策划实例编号", width: "15%"},
					{data: "prod_id", title: "产品编号", width: "15%"},
					{data: "comments", title: "产品说明", width: "15%",visible:false},
					{data: "offer_inst_id", title: "订购组实例ID", width: "0%",visible:false},
					{data: "operation", title: "操作", width:"20%", formatter: function(data){
                        //操作列的按钮生成
                        var html = '<a href="javascript:void(0);" class="modify_view">选择套餐</a>'
                        		+ '&nbsp;&nbsp; <a href="javascript:void(0);" class="js-btn_menu query_rel">订购关系</a> ';
                        return html;
                    }}
				],//每列的定义
				//onLoad: me.initTableEvent //表单加载数据后触发的操作
			};
			var option_rel = {
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
//                    onLoad: fish.bind(that.bindFormTableEvent_1,that) //表单加载数据后触发的操作
                };
			
			that.$("#xtab").xtable(option);
			that.$form_table_1 = that.$("#form_table_1").xtable(option_rel);
			that.create();
			//外部分页组件
			that.$('.js-pagination').pagination({
				records : 0,
				pgRecText : false,
				pgTotal : false,
				onPageClick : function(e, eventData) {
					var rowNum = that.$('.js-pagination').pagination("option","rowNum");
					that.queryOrderGroupList(eventData.page, rowNum);
				},
			});
			that.queryFlowProd();
		},
		queryFlowProd : function(){
        	var param = {};
        	var that = this;
	    	 fish.callService("BusiGroupOrderController", "queryFlowProd", param, function(data){
	         	if(data.result.length>0){
	         		var item = data.result;
	         		var list = [];
	         		for(var i=0;i<item.length;i++){
	         			var flowProd = {};
	         			flowProd.prod_id = item[i].prod_id;
	         			flowProd.prod_name = item[i].prod_name;
	         			list.push(flowProd);
	         		}
	         		that.flowProdList = list;
	     		}
	         });
        },
		create : function() {
			var that = this;
			// 默认不加载
			that.queryOrderGroupList(1);
			that.bindEvent();
		},
		queryOrderGroupList:function(page,rows,keyWord){
        	var that = this;
        	page = page || 1;
        	rows = rows || 10;
        	
        	var param = {
        		page:page,
        		rows:rows,
        		prod_name:keyWord
        	};
        	fish.callService("BusiGroupOrderController", "queryOrderGroupList",param,function(reply){
        		var data = reply.rows;
        		that.$("#xtab").xtable("loadData",data);
        		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
        		that.$(".page-total-num").text(reply.pageCount);
        		that.$(".page-data-count").text(reply.total);
        		that.$("#input_search").val("");
        		
        		that.$("#xtab").find("tr[class='temp']").each(function(index,el){
        			that.$(el).data("group_info",data[index]);
        		});
        	});
        },
        //根据订购组id查询套餐列表
        queryProductsListByGroupId : function(info,prod_name){
        	var that = this;
        	var param = {
        			group_id:info.group_id,
        			prod_name:prod_name,
        			prod_id:info.prod_id,
        			offer_inst_id:info.offer_inst_id
        	};
        	fish.callService("BusiGroupOrderController", "queryProductsListByGroupId",param,function(result){
        		var $ul = that.$(".js_tc_ul");
        		$ul.empty();
        		
        		var data = result.result;
        		if(result.res_code == "00000"){
        			if(data.length > 0){
        				for(var i = 0 ;i < data.length;i++){
            				var $li = that.$(".js_ul_template").find("li").clone().data("tc_info",data[i]);
            				$li.find(".js_prod_name").text(data[i].prod_name);
            				$li.find(".prod_inst_id").text(data[i].prod_inst_id);
            				$li.find(".js_prod_code").text("（产品编码：" + data[i].prod_id + ")");
            				if(new Date().getTime() > prod_page_util.getDateTime(data[i].exp_time)){
            					$li.find(".js_prod_status").text("无效");
            				}else{
            					$li.find(".js_prod_status").text("有效");
            				}
            				$li.find(".js_prod_time").text("有效时间:" + data[i].eff_time + "至" + data[i].exp_time); 
            				if(data[i].inst_status == '1000'){
            					$li.find(".stop_start").text("暂停");
            				}
            				if(data[i].inst_status == '1200'){
            					$li.find(".stop_start").text("恢复");
            				}
            				$ul.append($li);
            			}
        			}else{
        				$ul.append("<li>暂无数据</li>");
        			}
        		}
        	});
        },
        
      //根据prod_id查询套餐属性
        getProdAttrByProdId : function(prod_id){
        	var that = this;
        	var param = {
        			prod_id:prod_id
        	};
        	fish.callService("BusiGroupOrderController", "getProdAttrByProdId",param,function(result){
        		var data = result.result;
        		var $tbody = that.$("#form_panel");
        		if(result.res_code = '00000'){
        			prod_page_util.buildProductAttrDiv($tbody,data);
        		}else {
        			
        		}
        	});
        },
        
      //提交要变更的套餐内容
        submitModifyOrder : function(info){
        	var that = this;
        	info.group_id = that.info.group_id;
        	info.offer_inst_id = that.info.offer_inst_id;
        	var param = {
        			order_info:info
        	};
        	fish.callService("BusiGroupOrderController", "submitModifyOrder",param,function(result){
        		var data = result.result;
        		if(result.res_code == '00000'){
        			that.$("#tc_detail_div").hide();
        			that.$("#group_div").hide();
        			that.$("#tc_div").hide();
        			$(".backToMain").hide();
        			that.$("#step_two").hide();
        			that.$("#step_three").show();
        			that.$("#tc_suc_div").show();
        			
        			$("#prod_num").html(data.pkg_num);
                    $("#order_id").html(data.order_id);
        			
        			that.$(".queryDetail").unbind("click").bind("click",function(){
        				var viewURL = "modules/busiGroupOrder/views/busiGroupOrderQueryView";
                        that.parentView.openView(viewURL,data.order_id);
        			});
        			that.$(".continue_modify").unbind("click").bind("click",function(){
        				
            			//清空所有的子元素
            			that.$("#form_panel").empty();
            			
            			that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐变更');
        				that.$("#tc_suc_div").hide();
        				that.$("#step_three").hide();
        				that.$("#group_div").show();
        			});
        		}else{
        			layer.alert(result.res_message);
        		}
        		//如果变更成功,显示成功提示页,点击查看订单,跳到订单查询页
        	});
        },
        
      //暂停或恢复套餐
        stopOrRecoveryOrder : function(info){
        	var that = this;
        	var param = {
        			order_info:info
        	};
        	fish.callService("BusiGroupOrderController", "stopOrRecoveryOrder",param,function(result){
        		var data = result.result;
        		if(result.res_code == '00000'){
        			layer.alert("申请提交成功");
        			that.$("#tc_suc_div").show();
                    that.$("#tc_div").hide();
                    that.$("#step_three").show();
                    that.$("#step_two").hide();
                    that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐变更></a><a class="current">确认提交</a>');
                    $("#prod_num").html(1);
                    $("#order_id").html(data.order_id);
        		}else{
        			layer.alert(result.res_message);
        		}
        	});
        },
        
        //查询订购关系
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
            });
        },
        
        //初始化click点击事件
        bindEvent:function(){
        	var that = this;
       
        	that.$("#btn_search").unbind("click").bind("click",function(){
        		var prod_name = $.trim(that.$("#input_search").val());
        		that.queryOrderGroupList(null,null,prod_name);
        	});
        	
        	  that.$("#xtab").on("click",".modify_view",function(){
        		  that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐变更></a><a class="current">选择套餐</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
                  $(".backToMain").unbind("click").bind("click",function(e){
                  	  that.$("#group_div").show();
                      that.$("#tc_div").hide();
                      that.$("#step_one").show();
              		  that.$("#step_two").hide();
                      that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐变更');
                  });
                  
        		//步骤的显示和隐藏
        		that.$("#step_one").hide();
        		that.$("#step_two").show();
        		
        		var tr = that.$(this).parents("tr");
        		
        		var group_id = tr.attr("id");
        		that.info.group_id = group_id;
        		
        		var offer_inst_id = tr.data("group_info").offer_inst_id;
        		that.info.offer_inst_id = offer_inst_id;
        		that.info.prod_id = tr.data("group_info").prod_id;
    			that.$("#group_div").hide();
        		that.$("#tc_div").show();
        		that.queryProductsListByGroupId(that.info);
        	});
        	  that.$(".js_tc_ul").undelegate("click",".see_detail").on("click",".see_detail",function(){
        		  var $li = that.$(this).parents("li");
        		  var data = $li.data("tc_info");
        		  data.flowProdList = that.flowProdList;
        		  data.offer_inst_id = that.info.offer_inst_id;
        		  fish.popupView({
        			width: "30%",
          			url:"modules/busiGroupOrder/views/OrderModifyDetailView",
          			callback:function(popup,view){
          				view.parentView = that;
          				view.loadData(data,"modify");
          			}
          		});
        		  
      		});
        	  that.$(".js_tc_ul").undelegate("click",".stop_start").on("click",".stop_start",function(){
      			var $li = that.$(this).parents("li");
      			var detail_data = $li.data("tc_info");
      			that.info.prod_id = detail_data.prod_id;
      			
      			var product_info = {};
          		
      			product_info.prod_id = detail_data.prod_id;
      			product_info.eff_time = detail_data.eff_time;
      			product_info.exp_time = detail_data.exp_time;
      			that.info.product_info = product_info;
      			that.info.product_attr = [];
      			if(detail_data.inst_status == '1000'){
          			var options = {title:"消息",yes:function(index){
          				that.info.order_action = "4";
          				that.stopOrRecoveryOrder(that.info);
              			layer.close(index);
          			},cancel:function(){
          				return;
          			}};
          			layer.confirm("确定要暂停吗?",options);
      			}else{
      				var options = {title:"消息",yes:function(index){
      					that.info.order_action = "5";
      					that.stopOrRecoveryOrder(that.info);
          				//alert("恢复成功");
      					layer.close(index);
              			
          			},cancel:function(){
          				return;
          			}};
      				layer.confirm("确定要恢复吗?",options);
      			}
      			
      		});
        	  
        	  $(".queryDetail").unbind("click").bind("click",function(e){
	         		 var viewURL = "modules/busiGroupOrder/views/busiGroupOrderQueryView";
	         		 var order_id = $("#order_id").text()
	                 that.parentView.openView(viewURL,order_id);
	         		
	         	});
        	  
        	  that.$(".continue_modify").unbind("click").bind("click",function(){
	      			that.$("#form_panel").empty();
	      			
	      			that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐变更');
	  				that.$("#tc_suc_div").hide();
	  				that.$("#step_three").hide();
	  				that.$("#group_div").show();
	  			});
        	  //订购组关系查询点击事件
        	  that.$("#xtab").undelegate("click",".query_rel").on("click",".query_rel",function(){
        		  that.$('.js-pagination_1').pagination({
                      records: 0,
                      pgRecText:false,
                      pgTotal:false,
                      onPageClick:function(e,eventData){
                      	var rowNum = that.$('.js-pagination_1').pagination("option","rowNum");
                      	that.$form_table_1.xtable("options",{pageSize:rowNum});
                      	that.doQuery_rel(eventData.page,rowNum,that.offer_inst_id);
                      },
                      create:function(){
                      	that.doQuery_rel(1);
                      }
                  });
        		  $("#search_input").val("");
        		  that.$("#step_one").hide();
        		  that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐变更></a><a class="current">订购关系查询</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
                  $(".backToMain").unbind("click").bind("click",function(e){
                  	that.$(".group_rel_div").hide();
                  	that.$("#step_one").show();
                  	that.$("#group_div").show();
                     
                    that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐变更');
                  });
        		  //alert("订购组关系");
        		  //显示和隐藏div
        		  that.$("#group_div").hide();
        		  that.$(".group_rel_div").show();
        		  var tr = that.$(this).parents("tr");
        		  var offer_inst_id = tr.data("group_info").offer_inst_id;
        		  that.offer_inst_id = offer_inst_id;
        		  //alert("offer_inst_id:" + offer_inst_id);
        		  that.doQuery_rel(null,null,offer_inst_id);
        	  });
        	  
        	//成员搜索
          	$("#btn_search_1").unbind("click").bind("click",function(e){
          		that.doQuery_rel(null,null,that.offer_inst_id);
          	});
          	
        	that.$("#tc_search").unbind("click").bind("click",function(){
        		//alert(that.$("#tc_name").val());
        		var prod_name = $.trim(that.$("#tc_name").val());
        		if(prod_name == "请输入套餐名称" || prod_name == ""){
        			layer.alert("请输入查询条件");
        			return;
        		}
        		that.queryProductsListByGroupId(that.info,prod_name);
        	});
        	
        	that.$("#btn_edit_attr").unbind("click").bind("click",function(){
        		that.$("#eff_time").datetimepicker({showSecond:true,timeFormat:'yyyy-MM-dd HH:mm:ss'
        							,startDate:fish.dateutil.format(new Date(), 'yyyy-mm-dd HH:mm:ss')});
        		that.$("#exp_time").datetimepicker({showSecond:true,timeFormat:'yyyy-MM-dd HH:mm:ss'
        							,startDate:fish.dateutil.format(new Date(), 'yyyy-mm-dd HH:mm:ss')});
        		
        		var attr_div = that.$("#attr_div");
        		that.$("#eff_time").removeAttr("disabled");
        		that.$("#exp_time").removeAttr("disabled");
        		that.$("#form_panel").find("[name='attr']").each(function(index,el){
        			that.$(el).removeAttr("readonly");
        			that.$(el).removeAttr("disabled");
        		});
        		that.$(this).hide();
        		that.$("#btn_submit").show();
        		
        		
        	});
        	
        	that.$("#btn_return").unbind("click").bind("click",function(){
        		$(".backToMain").show();
        		//that.$("#eff_time").datetimepicker('remove');
        		//that.$("#exp_time").datetimepicker('remove');
        		that.$("#eff_time").attr("disabled","disabled");
        		that.$("#exp_time").attr("disabled","disabled");
        		//清空值
        		that.$("#tc_detail_name").val("");
    			that.$("#eff_time").val("");
    			that.$("#exp_time").val("");
    			//清空所有的子元素
    			//that.$("#tab_prod_attr").find("tbody").empty();
    			that.$("#form_panel").empty();
    			
        		that.$("#tc_detail_div").hide();
        		that.$("#tc_attr_div").hide();
    			that.$("#group_div").hide();
    			that.$("#tc_div").show();
    			that.$("#btn_submit").hide();
    			that.$("#btn_edit_attr").show();
        	});
        	
        	that.$("#btn_submit").unbind("click").bind("click",function(){
        		var product_info = {};
        		
        		var prod_name = that.$("#tc_detail_name").val();
    			var eff_time = that.$("#eff_time").val();
    			var exp_time = that.$("#exp_time").val();
    			
    			var inst_status = that.info.inst_status;
    			//alert("产品实例id" + that.info.prod_inst_id);
    			if(inst_status == "1200"){
    				layer.alert("暂停状态不能变更套餐");
    			}
    			//日期校验
    			if(!(prod_page_util.validate(eff_time,exp_time))){
    				return false;
    			};
    			
    			//非空验证
    			prod_page_util.nullableValidate(that.$("#form_panel").find("[name='attr']"));
    			
    			//校验输入限制
    			var resp = prod_page_util.valifyInputLimit(that.$("#form_panel").find("[name='attr']"));
              	if(resp.result == "false"){
            		layer.alert(resp.msg);
            		return false;
            	}
    			
    			//that.info.eff_time = eff_time;
    			//that.info.exp_time = exp_time;
    			product_info.eff_time = eff_time;
    			product_info.exp_time = exp_time;
    			that.info.product_info = product_info;
    			var attr_list = [];
    			if(that.$("#form_panel").find("[name='attr']").length > 0){
    				that.$("#form_panel").find("[name='attr']").each(function(index,ele){
        				var attr = prod_page_util.getAttrValue($(ele));
            			attr_list.push(attr);
        			});
    				that.info.product_attr = attr_list;
    			}else {
    				that.info.product_attr = attr_list;
    			}
    			that.$("#form_panel").empty();
    			//调用变更套餐方法
    			that.submitModifyOrder(that.info);
        	});
        }
	});
	
	return modifyView;
});
