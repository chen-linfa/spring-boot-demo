define(['hbs!../templates/selectIndex.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        report_dimension_inst : [],
        report_subscript_inst :[],
        report_subscript_ids :[],
        dimension_list : [],
        subscriptAttr_list :[],
        reportCategoryInst : {},
        index_bol : true,
        num : 0,
        subscript_list : [],
        afterRender: function(){
            var that = this;
            that.$('.js-selectmenu').combobox();
            that.$('.js-date').datetimepicker();
            that.$('.js-check').icheck();
            that.$('.js-pagination').pagination({
                 records: 100
            });
            if(that.options.keyname.saveType=="edit"){
				that.queryEditInfo(that.options.keyname.category_inst_id);
			}
            that.initSelectBox();
            var option = {
					pagination: false,
					autoFill: false,
					singleSelect: false,//该表格可以多选
					rowId: "report_subscript_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
					    {checkbox:true},
						{data: "report_subscript_id", title: "指标id",visible:false},
						{data: "report_subscript_code", title: "指标编码",visible:false},
						{data: "report_subscript_name", title: "指标名称"},
						{data: "report_dimension_name", title: "专属查询维度"},
						{data: "attr_name", title: "专属属性"},
					],//每列的定义
//					onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
            that.$data_list = that.$("#xtab").xtable(option);	
			that.initEvent();
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                	that.querySubscript(eventData.page,rowNum);
                },
                create:function(){
                	that.querySubscript(1);
                }
            });
            that.$("#default").find(".iradio").addClass("checked");
		},
		initEvent : function(){
			var that = this;
			
			if(that.options.keyname.saveType=="edit"){
				that.$("#allDiv").find(".current").text("修改报表");
			}
			that.$(".back").click(function(){
				var viewURL = "modules/reportQuery/selfAnalysis/views/selfAnalysisView";
				that.parentView.openView(viewURL);
			});
			that.$("#next_1").unbind("click").bind("click",function(){
				
				if(that.$("#name").val()==""){
					layer.alert("请您输入报表名称！");
					return false;
				}
				
				if(that.$data_list.xtable("getSelected").length>0){
					that.$("#step_one").hide();
					that.$("#step_three").hide();
					that.$("#step_two").show();
					that.showIndex();
					that.$(".selected-index").find(".ico-close2").click(function(){
						$(this).closest("li").remove();
						var id = $(this).closest("li").find("span").text();
						that.$("#xtab").find("tr").each(function(i,ele){
							if($(ele).attr("id")==id){
								$(ele).trigger("click");
							}
						});
						that.$(".selected-index").find("li").each(function(i,ele){
							if($(ele).find("span").text()==id){
								$(ele).remove();
							}
						});
						if(that.$(".selected-index").find("li").length==0){
							
							layer.alert("请您重新选择指标！",{yes: function() {
								that.$("#step_one").show();
								that.$("#step_three").hide();
								that.$("#step_two").hide();
								if(that.$("#xtab").find("th").find("input").is(":checked")){
									that.$("#xtab").find("th").find("input").trigger("click");
								}
								
		        				layer.closeAll();
	                		}});
							
						}else{
							that.report_subscript_ids = [];
							var getSelected = that.$data_list.xtable("getSelected");
							_.each(getSelected,function(item){
								that.report_subscript_ids.push(item.report_subscript_id);
							});
							that.queryAttr();
						}
					});
						
					that.queryExclusive();
					that.queryAttr();
					if(that.options.keyname.saveType=="edit" && that.index_bol){
						if(that.reportCategoryInst.report_doc_type=="0"){
	        				 that.$("#default").find(".iradio").trigger("click");
	        			}else{
	        				 that.$("#no_default").find(".iradio").trigger("click");
	        			}
					}
				}else{
					layer.alert("请您先选择指标！");
				}
			});
			that.$("#next_2").click(function(){
				that.$("#step_one").hide();
				that.$("#step_three").show();
				that.$("#step_two").hide();
				that.showDifficulty();
			});
			
			that.$("#last_1").click(function(){
				that.index_bol = false;
				that.$("#step_one").show();
				that.$("#step_two").hide();
				
			});
			
			that.$("#last_2").click(function(){
				that.$("#step_one").hide();
				that.$("#step_three").hide();
				that.$("#step_two").show();
			});
			
			that.$("#input_id").on('combobox:change', function(e) {
            	that.querySubscript(1);
            	that.$("#name").val(that.$("#input_id").combobox("text"));
            	that.queryPublic();
//            	that.dimension_bol = false;
            	that.num++;
            });
			
			that.$("#btn_submit").click(function(){
				if(that.$("div.radio").find("div.iradio.checked").length<=0){
					layer.alert("请您选择报表样式！");
					return false;
				}
				if(that.$("#public_attr").find("div.icheckbox.checked").length<=0){
					layer.alert("请您至少选择一个指标明细！");
					return false;
				}
				var data = that.$data_list.xtable("getSelected");
				that.report_subscript_inst = [];
				for(var i=0;i<data.length;i++){
					var report_subscript = {};
					report_subscript.report_subscript_id = data[i].report_subscript_id;
					report_subscript.report_subscript_code = data[i].report_subscript_code;
					that.report_subscript_inst.push(report_subscript);
				}
				that.$("#public").find("li").each(function(index,ele){
					if($(ele).find("input").is(":checked")){
						var report_dimension = {};
						report_dimension.report_dimension_id = $(ele).find(".report_dimension_id").text();
						report_dimension.report_dimension_code = $(ele).find(".report_dimension_code").text();
						that.report_dimension_inst.push(report_dimension);
					}
				});
				that.$("#exclusive").find("li").each(function(index,ele){
					if($(ele).find("input").is(":checked")){
						var report_dimension = {};
						report_dimension.report_dimension_id = $(ele).find(".report_dimension_id").text();
						report_dimension.report_dimension_code = $(ele).find(".report_dimension_code").text();
						that.report_dimension_inst.push(report_dimension);
					}
				});
				that.saveReport();
			});
		},
		showIndex:function(){
			var that = this;
			that.$(".report_name").text(that.$("#name").val());
			that.$(".selected-index").empty();
			
			var data = that.$data_list.xtable("getSelected");
			for(var i=0;i<data.length;i++){
				$li = $(' <li class="list-item">'+data[i].report_subscript_name+'<i class="ico-close2"></i><span style="display:none">'+data[i].report_subscript_id+'</span></li>');
				that.$(".selected-index").append($li);
			}
		},
		showDifficulty:function(){
			var that = this;
			that.report_dimension_inst = [];
			that.$(".selected-difficulty").empty();
			that.$("#public").find("li").each(function(index,ele){
				$li = $(' <li class="list-item type_0">'+$(ele).find(".name").text()+'<i class="ico-close2"></i><span style="display:none">'+$(ele).find(".report_dimension_id").text()+'</span></li>');
				if($(ele).find("input").is(":checked")){
					that.$(".selected-difficulty").append($li);
				}
			});
			that.$("#exclusive").find("li").each(function(index,ele){
				$li = $(' <li class="list-item type_1">'+$(ele).find(".name").text()+'<i class="ico-close2"></i><span style="display:none">'+$(ele).find(".report_dimension_id").text()+'</span></li>');
				if($(ele).find("input").is(":checked")){
					that.$(".selected-difficulty").append($li);
				}
			});
			that.$(".selected-difficulty").find(".ico-close2").click(function(){
				if($(this).closest("li").hasClass("type_1")){
					layer.alert("不能删除专属维度！");
				}else{
					$(this).closest("li").remove();
					var id = $(this).closest("li").find("span").text();
					that.$("#public").find("li").each(function(i,ele){
						if($(ele).find(".report_dimension_id").text()==id){
							$(ele).find(".icheckbox ").trigger("click");
						}
					});
				}
			});
		},
		initSelectBox:function(){
        	var that = this;
        	var param = {};
        	param.saveType = that.options.keyname.saveType;
        	if(that.options.keyname.saveType=="edit"){
        		param.category_inst_id = that.options.keyname.category_inst_id;
        	}
        	fish.callService("SelfAnalysisController", "queryReportCategory",param,function(data){
        		var result = data.result;
        		var dataSource = [];
        		if($.isArray(result.list)){
        			_.each(result.list,function(item){
        				dataSource.push({value:item.report_category_id,name:item.report_category_name});
        			});
        		}
        		
        		that.$('#input_id').combobox("option",{dataSource:dataSource});
        		if(that.options.keyname.saveType=="edit"){
        			that.$('#input_id').combobox('value', result.report_category_id);
        			that.$("#name").val(result.category_inst_name);
        		}else{
        			that.$('#input_id').combobox('value', result.list[0].report_category_id);
        		}
        	});
        },
        
        querySubscript:function(page,rows){
        	var that = this;
        	page = page || 1;
        	rows = rows || 10;
        	var search_content = $.trim($('#input_id').val());
        	var num = "";
        	var param = {
        		page:page,
        		rows:rows,
        		report_category_id:search_content
        	};
        	var info = new Array();
        	var a = {};
        	fish.callService("SelfAnalysisController", "querySubscriptById",param,function(reply){
        		if(reply){
        			_.each(reply.rows,function(item){
        				if(item.is_public=="1"){
        					item.report_dimension_name = "";
        				}
        			});
        			that.$("#xtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            		
            		if(that.subscript_list.length>0){
        				_.each(that.subscript_list,function(item){
            				that.$("#xtab").find("tr").each(function(i,ele){
            					if($(ele).attr("id")==item.report_subscript_id){
            						$(ele).trigger("click");
            					}
            				});
            			});
        			}
        		}
        		
        	});
        },
        queryPublic : function(){
			var that = this;
			var param = {};
			param.report_category_id = that.$("#input_id").val();
			that.$("#public").empty();
			fish.callService("SelfAnalysisController", "queryPublic",param,function(data){
        		if(data.result.length>0){
        			for(var i=0;i<data.result.length;i++){
        				var item = data.result[i]
        				$li = $('<li class="diff-item"><span class="report_dimension_id" style="display:none;">'+item.report_dimension_id+'</span>'
        						+'<span class="report_dimension_code" style="display:none;">'+item.report_dimension_code+'</span>'
            					+'<label class="no-margin-bottom"><input class="js-check" type="checkbox" name="" >'
                                +'</label> <span class="name">'+item.report_dimension_name+'</span></li>');
            			that.$("#public").append($li);
            			that.$('.js-check').icheck();
        			}
        			if(that.num<=1){
        				if(that.options.keyname.saveType=="edit"){
            				that.$("#public").find("li").each(function(i,ele){
            					console.log(that.dimension_list);
                				_.each(that.dimension_list,function(item){
                					if(item.report_dimension_id == $(ele).find(".report_dimension_id").text()){
                						$(ele).find(".js-check").trigger("click");
                					}
                				});
                			});
            			}
        			}
        		}
        	});
		},
		queryAttr : function(){
			var that = this;
			var param = {};
			
			param.report_subscript_ids = that.report_subscript_ids;
			that.$("#public_attr").empty();
			fish.callService("SelfAnalysisController", "queryPublicAttr",param,function(data){
        		if(data.result.length>0){
        			for(var i=0;i<data.result.length;i++){
        				var item = data.result[i]
        				var $li = $('<li style="width:250px;float:left;" class="diff-item" ><span class="attr_id" style="display:none;">'+item.report_subscript_attr_id+'</span>'
        						+'<span class="attr_code" style="display:none;">'+item.subscript_attr_code+'</span>'
        						+'<span class="report_subscript_id" style="display:none;">'+item.report_subscript_id+'</span>'
        						+'<label class="no-margin-bottom"><input class="js-check" type="checkbox" name="" >'
                               +'</label> <span class="name">'+item.subscript_attr_name+'</span></li>');
            			that.$("#public_attr").append($li);
            			that.$('.js-check').icheck();
        			}
        			if(that.index_bol){
        				if(that.options.keyname.saveType == "edit" ){
            				that.$("#public_attr").find("li").each(function(i,ele){
                				_.each(that.subscriptAttr_list,function(item){
                					if($(ele).find(".attr_id").text()==item.report_subscript_attr_id){
                						$(ele).find(".icheckbox").trigger("click");
                					}
                				});
                			});
            			}
        			}
        		}
        		var num = that.$("#public_attr").find("li").length;
        		if(num>3){
        			var height = Math.ceil(num/3) * 80;
        			document.getElementById("attr_div").style.height = height+"px";
        		}
        	});
			
		},
		 queryExclusive : function(){
				var that = this;
				var param = {};
				that.report_subscript_ids = [];
				var getSelected = that.$data_list.xtable("getSelected");
				_.each(getSelected,function(item){
					that.report_subscript_ids.push(item.report_subscript_id);
				});
				param.report_subscript_ids = that.report_subscript_ids;
				that.$("#exclusive").empty();
				fish.callService("SelfAnalysisController", "queryExclusive",param,function(data){
	        		if(data.result.length>0){
	        			for(var i=0;i<data.result.length;i++){
	        				var item = data.result[i]
	        				$li = $('<li class="diff-item"><span class="report_dimension_id" style="display:none;">'+item.report_dimension_id+'</span>'
	        						+'<span class="report_dimension_code" style="display:none;">'+item.report_dimension_code+'</span>'
	        						+'<label class="no-margin-bottom"><input disabled class="js-check" type="checkbox" checked="checked" name="" >'
	                                +'</label> <span class="name">'+item.report_dimension_name+'</span></li>');
	            			that.$("#exclusive").append($li);
	            			that.$('.js-check').icheck();
	        			}
	        			
	        		}
	        	});
			},
			saveReport : function(){
				var that = this;
				var param = {};
				var report_category_inst = {};
				var report_attr_inst = [];
				report_category_inst.category_inst_name = that.$("#name").val();
				report_category_inst.report_category_id = that.$("#input_id").val();
				report_category_inst.report_doc_type = that.$("div.radio").find("div.iradio.checked").find("input").val();
				if(that.options.keyname.saveType=="edit"){
					report_category_inst.category_inst_id = that.options.keyname.category_inst_id;
				}
				that.$("#public_attr").find("li").each(function(i,ele){
					if($(ele).find("input").is(":checked")){
						var report_attr = {};
						report_attr.report_subscript_id = $(ele).find(".report_subscript_id").text();
						report_attr.report_subscript_attr_id = $(ele).find(".attr_id").text();
						report_attr.subscript_attr_code = $(ele).find(".attr_code").text();
						report_attr_inst.push(report_attr);
					}
				});
				param.saveType = that.options.keyname.saveType;
				param.report_subscript_inst = that.report_subscript_inst;
				param.report_category_inst = report_category_inst;
				param.report_dimension_inst = that.report_dimension_inst;
				param.report_attr_inst = report_attr_inst;
				
			    var viewURL = "modules/reportQuery/selfAnalysis/views/selfAnalysisView";
				fish.callService("SelfAnalysisController", "saveReport",param,function(data){
	        		if(data.res_code == '00000'){
	        			if(param.saveType == "add"){
	        				layer.alert("添加成功！",{yes: function() {
		        				  that.parentView.openView(viewURL);
		        				  layer.closeAll();
	                		}});
	        			}else{
	        				layer.alert("修改成功！",{yes: function() {
		        				  that.parentView.openView(viewURL);
		        				  layer.closeAll();
	                		}});
	        			}
	        			
	        		
	        		}else{
	        			if(param.saveType == "add"){
	        				layer.alert("添加失败！");
	        			}else{
	        				layer.alert("修改失败！");
	        			}
	        			
	        		}
	        	});
				
			},
			queryEditInfo : function(category_inst_id){
				var that = this;
				var param = {};
				param.category_inst_id = category_inst_id;
				that.dimension_list = [];
				that.subscriptAttr_list = []; 
				that.reportCategoryInst = {};
				that.subscript_list = [];
				fish.callService("SelfAnalysisController", "queryEditInfo",param,function(data){
	        		if(data.res_code == '00000'){
	        			var result = data.result;
	        			that.dimension_list = result.dimension_list;
	        			that.subscriptAttr_list = result.subscriptAttr_list;
	        			that.subscript_list = result.subscript_list
	        			that.reportCategoryInst = result.reportCategoryInst;
	        		}else{
	        			
	        		}
	        	});
			},
		initData : function(data){
			var that = this;
		}
	});
    return pageView;
});
