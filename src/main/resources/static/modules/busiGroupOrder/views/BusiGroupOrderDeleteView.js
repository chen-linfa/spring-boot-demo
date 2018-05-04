define([ 'hbs!../templates/busiGroupOrderDelete.html','./prod_page_util'],
		function(del) {
	var deleteView = fish.View.extend({
		template : del,
		info:{},
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
					{data: "prod_name", title: "订购组名称", width: "20%"},
                    {data: "offer_inst_id", title: "策划实例编号", width: "15%"},
					{data: "prod_id", title: "产品编号", width: "15%"},
					{data: "comments", title: "产品说明", width: "15%",visible:false},
					{data: "operation", title: "操作", width:"20%", formatter: function(data){
                        //操作列的按钮生成
                        var html = '<a href="javascript:void(0);" class="delete_view">选择套餐</a>'
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
			//that.$("#xtab_tc").xtable(option1);
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
        queryProductsListByGroupId:function (info,prod_name){
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
            				$li.find(".js_prod_code").text("（产品编码：" + data[i].prod_id + ")");
            				if(new Date().getTime() > prod_page_util.getDateTime(data[i].exp_time)){
            					$li.find(".js_prod_status").text("无效");
            				}else{
            					$li.find(".js_prod_status").text("有效");
            				}
            				$li.find(".js_prod_time").text("有效时间:" + data[i].eff_time + "至" + data[i].exp_time); 
            				
            				$ul.append($li);
            			}
        			}else{
        				$ul.append("<li>暂无数据</li>");
        			}
        			
        			
        		}
        		
        	});
        },
        
      //根据prod_id查询套餐属性
        getProdAttrByProdId:function (prod_id){
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
        
      //提交要退订的套餐内容
        submit : function(info){
        	var that = this;
        	var param = {
        			order_info:info
        	};
    		fish.callService("BusiGroupOrderController", "submitDeleteOrder",param,function(result){
        		var data = result.result;
        		//如果退订提交成功,显示成功提示页,点击查看订单,跳到订单查询页
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
        			that.$(".continue_delete").unbind("click").bind("click",function(){
        				//清空所有的子元素
            			that.$("#form_panel").empty();
            			
            			that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐退订');
            			that.$("#step_three").hide();
            			that.$("#tc_suc_div").hide();
        				that.$("#group_div").show();
        			});
        		}else{
        			layer.alert(result.res_message);
        		}
        	});
        },
        submitDeleteOrder:function(info){
        	var that = this;
        	if(info.prod_id == '380000010430'){
        		var param = {};
	        	param.offer_inst_id = info.offer_inst_id;
	        	fish.callService("BusiGroupOrderController", "queryIsHasMem", param, function(result){
	        		 if(result.result==false){    
	        			 that.submit(info);
                        }else{
                        	layer.alert("订购组下存在成员时,不允许变更该或退订该套餐！");
                        	return false;
                        }
	            });
        	}else{
        		that.submit(info);
        	}
        	
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
        	//根据条件查询订购组
        	that.$("#btn_search").unbind("click").bind("click",function(){
        		var prod_name = $.trim(that.$("#input_search").val());
        		that.queryOrderGroupList(null,null,prod_name);
        	});
        	
        	that.$("#xtab").on("click",".delete_view",function(){
        		that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐退订></a><a class="current">选择套餐</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
                $(".backToMain").unbind("click").bind("click",function(e){
                	that.$("#group_div").show();
                    that.$("#tc_div").hide();
                    that.$("#step_one").show();
            		that.$("#step_two").hide();
                    that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐退订');
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
        		//}
        	});
        	//套餐列表页详情按钮事件
        	that.$(".js_tc_ul").undelegate("click",".see_detail").on("click",".see_detail",function(){
        		//alert("进入详情页");
        		//return;
        		var $li = that.$(this).parents("li");
      		  	var data = $li.data("tc_info");
      		  	data.flowProdList = that.flowProdList;
      		  	fish.popupView({
        			url:"modules/busiGroupOrder/views/OrderModifyDetailView",
        			callback:function(popup,view){
        				view.parentView = that;
        				view.loadData(data,"delete");
        			}
        		});
        		
        		/*$(".backToMain").hide();
    			//var tc_info = that.$(this).data("tc_info");
    			//alert(tc_info.prod_name);
    			//alert("查看详情");
    			//清空值
        		that.$("#tc_detail_name").val("");
    			that.$("#eff_time").val("");
    			that.$("#exp_time").val("");
    			//清空动态添加的属性标签
    			//that.$("#tab_prod_attr").find("tbody").empty();
    			that.$("#form_panel").empty();
    			
    			var tr = that.$(this).parents("tr");
    			var detail_data = tr.data("tc_info");
    			//alert("parent中的数据:" + tr.data("tc_info").prod_name);
    			//alert("属性名:" + tr.attr("id"));
    			that.$("#tc_detail_div").show();
    			that.$("#group_div").hide();
    			that.$("#tc_div").hide();
    			that.$("#tc_detail_name").val(detail_data.prod_name);
    			that.$("#eff_time").val(tr.data("tc_info").eff_time);
    			that.$("#exp_time").val(tr.data("tc_info").exp_time);
    			
    			if(detail_data.attr_num > 0){
    				that.$("#tc_attr_div").show();
    				that.getProdAttrByProdId(detail_data.prod_id);
    			}*/
    		});
        	//套餐列表页退订按钮事件
        	that.$(".js_tc_ul").undelegate("click",".click_unsub").on("click",".click_unsub",function(){
    			//alert("点击退订");

    			/*//清空值
        		that.$("#tc_detail_name").val("");
    			that.$("#eff_time").val("");
    			that.$("#exp_time").val("");
    			//清空动态添加的属性标签
    			//that.$("#tab_prod_attr").find("tbody").empty();
    			that.$("#form_panel").empty();*/
    			
    			var $li = that.$(this).parents("li");
    			var detail_data = $li.data("tc_info");
    			that.info.prod_id = detail_data.prod_id;
    			
    			var product_info = {};
        		
    			product_info.prod_id = detail_data.prod_id;
    			product_info.eff_time = detail_data.eff_time;
    			product_info.exp_time = detail_data.exp_time;
    			that.info.product_info = product_info;
    			that.info.product_attr = [];
    			
    			var options = {title:"消息",yes:function(){
    				that.submitDeleteOrder(that.info);
      			},cancel:function(){
      				return;
      			}};
      			Utils.confirm("确定要退订吗?",options);
    			
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
      		that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐退订></a><a class="current">订购关系查询</a><a class="fr text-brand-primary backToMain" href="javascript:void(0);">返回上一层</a>');
            $(".backToMain").unbind("click").bind("click",function(e){
            	that.$(".group_rel_div").hide();
            	that.$("#step_one").show();
            	that.$("#group_div").show();
               
              that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">业务订购><a href="#" class="link-text">订购组套餐退订');
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
        	
        	that.$("#btn_back").unbind("click").bind("click",function(){
        		$(".backToMain").show();
        		//清空值
        		that.$("#tc_detail_name").val("");
    			that.$("#eff_time").val("");
    			that.$("#exp_time").val("");
    			//清空动态添加的属性标签
    			//that.$("#tab_prod_attr").find("tbody").empty();
    			that.$("#form_panel").empty();
    			
        		that.$("#tc_detail_div").hide();
        		that.$("#tc_attr_div").hide();
    			that.$("#group_div").hide();
    			that.$("#tc_div").show();
        	});
        }
	});
	
	return deleteView;
});
