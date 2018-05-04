define(['hbs!../templates/selfAnalysisQuery.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            sel_id : "",
            bol : true,
            doc_type : "",
            afterRender: function () {
                var that = this;
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "category_inst_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
					    {data: "category_inst_id", title: "报表编号"},
						{data: "category_inst_name", title: "报表名称"},
						{data: "subscript_num", title: "包含指标"},
						{data: "dimension_num", title: "包含维度"},
						{data: "attr_num", title: "包含指标明细"},
						{data: "create_date", title: "创建时间"},
						{data: "a", title: "使用报表",formatter:function(data){
							return "<a href='javascript:void(0);' class='js-btn_use'>"+"使用报表";
						}},
						{data: "control", title: "操作", width:"5%", formatter: function(data){
	                            //操作列的按钮生成
	                            var html ='<div class="btn-group pull-right">';
	                            html += '<button  class="js-dropdownMenu2" type="button">';          
	                            html += '<i class="ico-pull-down"></i></button>';
	                            html += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenu2">';
	                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="js-btn_edit" >修改</a></li>';
	                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="js-btn_delete">删除</a></li></ul></div>';
	                            return html;
	                        }}
					],//每列的定义
					onLoad: fish.bind(that.bindTableButton,that) //表单加载数据后触发的操作
				};
				that.$data_list = that.$("#xtab").xtable(option);
//				that.bindTableButton();
				
				//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.$data_list.xtable("options",{pageSize:rowNum});
                    	that.querySelfAnalysisInfo(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	//that.querySelfAnalysisInfo(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					that.querySelfAnalysisInfo(1);
				});
	        	
	        	that.querySelfAnalysisInfo(1);
	        	
            },
            querySelfAnalysisInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	var num = "";
            	var param = {
            		page:page,
            		rows:rows,
            		category_inst_name:search_content
            	};
            	fish.callService("SelfAnalysisController", "queryInstList",param,function(reply){
            		if(reply){
            			that.$("#xtab").xtable("loadData",reply.rows);
                		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
                		that.$(".page-total-num").text(reply.pageCount);
                		that.$(".page-data-count").text(reply.total);
            		}
            		
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	 that.$data_list.find("tr").each(function(){
                     $(this).children("td").eq(7).addClass("operation");
                 });
            	that.$("#btn_add").click(function(){
            		 var data = {};
            		 data.saveType = "add";
            		 var viewURL = "modules/reportQuery/selfAnalysis/views/selectIndexView";
                     that.parentView.openView(viewURL,data);
            	});
            	
            	 that.$(".js-dropdownMenu2").unbind("click").bind("click",function(){
                     if($(this).children(".ico-pull-down").hasClass("active")){
                         $(this).parents(".btn-group").removeClass("open");
                         $(this).children(".ico-pull-down").removeClass("active");
                     }else{
                         that.$(".btn-group").removeClass("open");
                         that.$(".ico-pull-down").removeClass("active");
                         $(this).parents(".btn-group").addClass("open");
                         $(this).children(".ico-pull-down").addClass("active");
                     }
                     
                 });
                 that.$(".js-btn_delete").click(function(){
                	 var category_inst_id = $(this).parents("tr").attr("id");
                	 var param = {};
                	 param.category_inst_id = category_inst_id;
                	 fish.callService("SelfAnalysisController", "deleteReport",param,function(data){
                 		if(data.res_code = '00000'){
                 			layer.alert("删除成功！");
                 			that.querySelfAnalysisInfo(1);
                 		}else {
                 			layer.alert("删除失败！");
                 		}
                 	});
            	});
                that.$(".js-btn_edit").click(function(){
                	 var data = {};
                	 var category_inst_id = $(this).parents("tr").attr("id");
              		 data.saveType = "edit";
              		 data.category_inst_id = category_inst_id;
              		 var viewURL = "modules/reportQuery/selfAnalysis/views/selectIndexView";
                     that.parentView.openView(viewURL,data);
            	});
                
                that.$(".js-btn_use").unbind("click").bind("click",function(){
                	that.$("#useReport").find("#tab_1").empty();
                	that.$("#main").hide();
                	that.$("#useReport").show();
                	if(that.$data_list_1 !=undefined){
        				that.$(".tab_report").remove();
        			}
                	var $table = $(' <table class="table table-striped tab_report" > </table>');
                	that.$("#useReport").find("#report_div").append($table);
                	that.$('.js-pagination_1').pagination({
                        records: 0,
                        pgRecText:false,
                        pgTotal:false,
                        onPageClick:function(e,eventData){
                        	var rowNum = that.$('.js-pagination_1').pagination("option","rowNum");
                        	that.$data_list_1.xtable("options",{pageSize:rowNum});
                        	that.queryReportPageByCfg(that.sel_id,eventData.page,rowNum);
                        },
                        create:function(){
                        	//默认不加载
                        	//that.querySelfAnalysisInfo(1);
                        }
                    });
                	
                	 that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">报表查询><a href="#" class="link-text">使用报表<a class="fr text-brand-primary back" href="javascript:void(0);">返回上一层</a>');
                	 var category_inst_id = $(this).parents("tr").attr("id");
                	 that.sel_id = category_inst_id;
                	 var param = {};
     				 param.category_inst_id = category_inst_id;
     				 param.type = '1';
     				 var dimension_list = [];
     				 var subscriptAttr_list = []; 
     				 var reportCategoryInst = {};
     				 var subscript_list = [];
     				 var reportDimensionAttr_list = [];
     			
     				 fish.callService("SelfAnalysisController", "queryEditInfo",param,function(data){
    	        		if(data.res_code == '00000'){
    	        			var result = data.result;
    	        			dimension_list = result.dimension_list;
    	        			subscriptAttr_list = result.subscriptAttr_list;
    	        			subscript_list = result.subscript_list
    	        			reportCategoryInst = result.reportCategoryInst;
    	        			reportDimensionAttr_list = result.reportDimensionAttr_list;
    	        			console.log(reportDimensionAttr_list);
    	        			var col = [];
    	        			_.each(dimension_list,function(item){
    	        				col.push({data:item.report_dimension_code.toUpperCase(),title:item.report_dimension_name});
    	        			});
    	        			_.each(subscriptAttr_list,function(item){
    	        				col.push({data:item.subscript_attr_code.toUpperCase(),title:item.subscript_attr_name});
    	        			});
    	        			that.doc_type = reportCategoryInst.report_doc_type;
		        			var option = {
        						pagination: false,
        						autoFill: false,
        						singleSelect: true,//该表格可以多选
        						rowId: "category_inst_id",//指定主键字段
        						onSelectClass: "selected",
        						nowPage: 1,
        						columns: col,
        						onLoad: fish.bind(that.bindTableButton,that) //表单加载数据后触发的操作
        					};
		        			
		        			that.$data_list_1 = that.$(".tab_report").xtable(option);
		        			that.initAttrPanel(reportDimensionAttr_list);
		        			that.$("#btn_search_1").unbind("click").bind("click",function(){
		                     	that.queryReportPageByCfg(that.sel_id);
		                     });
		        			
		        			that.$("#btn_exp").unbind("click").bind("click",function(){
		                     	that.expReportPageByCfg(that.sel_id);
		                     });
		        			
		        			
		        			
		        			that.$(".back").click(function(){
		        				 that.$("#main").show();
		                    	 that.$("#useReport").hide();
		                    	 that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">报表查询><a href="#" class="link-text">自助分析');
		        			});
    	        		}
    	        	});
                });
                
                
            },
            expReportPageByCfg : function(category_inst_id){
            	var that = this;
            	var dimension_attr_list = [];
            	var param = {};
            	that.$("#attr_form").find("div.attr").each(function(i,ele){
            		var attr = {};
            		if($(ele).find("input").val()!=""){
            			var value = "";
            			if($(ele).attr("input_type")=='2'){
            				value = $(ele).find(".combobox1").combobox("value");
            			}else if($(ele).attr("input_type")=='5'){
            				value = $(ele).find("input").val();
            				value = value.replace('-','').replace('-','');
            			}else{
            				value = $(ele).find("input").val();
            			}
            			attr.attr_value = value;
            			attr.attr_type = $(ele).attr("input_type");
            			attr.attr_code =$(ele).attr("attr_code"); 
            			attr.attr_id = $(ele).attr("attr_id"); 
            			dimension_attr_list.push(attr);
            		}
            	});
            	param.dimension_attr_list = dimension_attr_list;
            	param.category_inst_id = category_inst_id;
            	param.doc_type = that.doc_type;
            	var json  =  JSON.stringify(param);
            	//window.open("UploadController/exportforReportPageByCfg.do?json="+json);
            	$(".nx-tmp_form").remove();
            	var _form = $("<form class='nx-tmp_form' target='_blank' method='post' action='UploadController/exportforReportPageByCfg.do'></form>");
            	var _input = $("<input type='hidden' name='json'/>");
            	_input.val(json);
            	_form.append(_input);
            	$(document.body).append(_form);
            	_form.submit();
            },
            queryReportPageByCfg : function(category_inst_id,page,rows){
            	var that = this;
            	var dimension_attr_list = [];
            	var param = {};
            	page = page || 1;
            	rows = rows || 10;
            	param.page = page;
            	param.rows = rows;
            	that.$("#attr_form").find("div.attr").each(function(i,ele){
            		var attr = {};
            		if($(ele).find("input").val()!=""){
            			var value = "";
            			if($(ele).attr("input_type")=='2'){
            				value = $(ele).find(".combobox1").combobox("value");
            			}else if($(ele).attr("input_type")=='5'){
            				value = $(ele).find("input").val();
            				value = value.replace('-','').replace('-','');
            			}else{
            				value = $(ele).find("input").val();
            			}
            			attr.attr_value = value;
            			attr.attr_type = $(ele).attr("input_type");
            			attr.attr_code =$(ele).attr("attr_code"); 
            			attr.attr_id = $(ele).attr("attr_id"); 
            			dimension_attr_list.push(attr);
            		}
            	});
            	param.dimension_attr_list = dimension_attr_list;
            	param.category_inst_id = category_inst_id;
            	
            	fish.callService("SelfAnalysisController", "queryReportPageByCfg",param,function(data){
             		if(data.res_code = '00000'){
             			console.log(data);
             			if(data.result != null){
             				that.$(".tab_report").xtable("loadData",data.result.rows);
                    		that.$('.js-pagination_1').pagination("update",{records:data.result.total,start:data.result.pageNumber});
                    		that.$(".page-total-num_1").text(data.result.pageCount);
                    		that.$(".page-data-count_1").text(data.result.total);
             			}
             		}else {
             			
             		}
             	});
            	
            },
            
            initAttrPanel : function(reportDimensionAttr_list){
            	var that = this;
            	that.$("#attr_form").empty();
            	//1--文本框；2--下拉框；3-整数框；4--浮点数；5--时间框（yyyyMMdd）
            	var select_html = $('<div class="form-group attr"><input class="form-control combobox1" type="text"></div>');
            	var input_html = $(' <div class="form-group attr inp-text input_html"><input type="text" class="form-control"></div>');
            	var integer_html = $(' <div class="form-group attr inp-text int_html"><input type="text" class="form-control"></div>');
            	var fload_html = $('<div class="form-group attr inp-text float_html"><input type="text" class="form-control"></div>');
             	var time_html = $(' <div class="form-group attr"><div class="input-group"><input type="text" class="form-control js-date" name="start_time" placeholder=""></div></div>')
            	var num = 0;
             	_.each(reportDimensionAttr_list,function(item){
    				if(item.input_type == '1'){
    					var input_html_clone = input_html.clone();
    					input_html_clone.find("input").attr("placeholder",item.attr_name);
    					input_html_clone.find("input").attr("name",item.attr_name);
    					input_html_clone.find("input").attr("input_type",item.input_type);
    					input_html_clone.attr("input_type",item.input_type);
    					input_html_clone.attr("length",item.input_length);
    					input_html_clone.attr("attr_name",item.attr_name);
    					input_html_clone.attr("attr_code",item.attr_code);
    					input_html_clone.attr("attr_id",item.attr_id);
    					input_html_clone.attr("input_limit",item.input_limit);
    					input_html_clone.attr("attr_train",item.attr_train);
    					input_html_clone.val(item.default_value);
    					input_html_clone.addClass("attr");
    					input_html_clone.val(item.default_value);
    					that.$("#attr_form").append(input_html_clone);
    				}else if(item.input_type=='2'){//select下拉选择框
    					var select_html_clone = select_html.clone();
    					select_html_clone.attr("field",item.attr_name);
    					select_html_clone.find("input").attr("name",item.attr_name);
    					select_html_clone.find("input").attr("input_type",item.input_type);
    					select_html_clone.attr("input_type",item.input_type);
    					select_html_clone.attr("attr_name",item.attr_name);
    					select_html_clone.attr("attr_code",item.attr_code);
    					select_html_clone.attr("attr_id",item.attr_id);
    					select_html_clone.attr("input_limit",item.input_limit);
    					select_html_clone.attr("attr_train",item.attr_train);
    					select_html_clone.find("select").attr("limit",item.input_limit);
    					select_html_clone.addClass("attr");
    					select_html_clone.addClass("inp-select");
    					that.getSelect(item.attr_name,item.input_limit,select_html_clone);
    					that.$("#attr_form").append(select_html_clone);
    				}else if(item.input_type=='3'){//整型框
    					var integer_html_clone = integer_html.clone();
    					integer_html_clone.attr("input_type",item.input_type);
    					integer_html_clone.find("input").attr("placeholder",item.attr_name);
    					integer_html_clone.find("input").attr("input_type",item.input_type);
    					integer_html_clone.find("input").attr("name",item.attr_name);
    					integer_html_clone.attr("length",item.input_length);
    					integer_html_clone.attr("attr_name",item.attr_name);
    					integer_html_clone.attr("attr_code",item.attr_code);
    					integer_html_clone.attr("attr_id",item.attr_id);
    					integer_html_clone.attr("input_limit",item.input_limit);
    					integer_html_clone.attr("attr_train",item.attr_train);
    					integer_html_clone.addClass("attr");
    					integer_html_clone.find("input").val(item.default_value);
    					integer_html_clone.find('input').bind({
    		                    keyup:function(){
    		                        this.value=this.value.replace(/\D/g,'');
    		                    }
    		                });
    					that.$("#attr_form").append(integer_html_clone);
    					
    				}else if(item.input_type=='4'){//浮点数
    					var fload_html_clone = fload_html.clone();
    					fload_html_clone.attr("input_type",item.attr_name);
    					fload_html_clone.find("input").attr("placeholder",item.attr_name);
    					fload_html_clone.find("input").attr("input_type",item.input_type);
    					fload_html_clone.find("input").attr("name",item.attr_name);
    					fload_html_clone.attr("length",item.input_length);
    					fload_html_clone.attr("attr_name",item.attr_name);
    					fload_html_clone.attr("attr_code",item.attr_code);
    					fload_html_clone.attr("attr_id",item.attr_id);
    					fload_html_clone.attr("input_limit",item.input_limit);
    					fload_html_clone.attr("attr_train",item.attr_train);
    					fload_html_clone.addClass("attr");
    					fload_html_clone.find("input").val(item.default_value);
    					that.$("#attr_form").append(fload_html_clone);
    				}else if(item.input_type=='5'){//时间框
    					var time_html_clone = time_html.clone();
    					time_html_clone.find("input").attr("placeholder",item.attr_name);
    					time_html_clone.find("input").attr("input_type",item.input_type);
    					time_html_clone.find("input").attr("name",item.attr_name);
    					time_html_clone.attr("length",item.input_length);
    					time_html_clone.attr("attr_name",item.attr_name);
    					time_html_clone.attr("attr_code",item.attr_code);
    					time_html_clone.attr("input_type",item.input_type);
    					time_html_clone.attr("attr_id",item.attr_id);
    					time_html_clone.attr("input_limit",item.input_limit);
    					time_html_clone.attr("attr_train",item.attr_train);
    					time_html_clone.addClass("attr");
    					time_html_clone.find("input").val(item.default_value);
    					that.$("#attr_form").append(time_html_clone);
//    					that.$('.js-date').datetimepicker();
    					num++;
    					if(num == 1){
    						that.$("#attr_form").append("-- ")
    					}
    					var begin = item.input_limit.substring(item.input_limit.indexOf(">")+1,item.input_limit.indexOf(","));
    					var end = item.input_limit.substring(item.input_limit.indexOf("<")+1,item.input_limit.length+1);
    					var initdate = new Date();
    					var mindate = new Date();
    					var maxdate = new Date()
    					mindate.setDate(initdate.getDate()- Math.abs(begin)*30);
    					maxdate.setDate(initdate.getDate()- Math.abs(end)*30);
    					
    					that.$(".js-date").datetimepicker({viewType:"date",
//    	            		initialDate:initdate,
    	            		startDate:mindate,
    	            		endDate:maxdate
    	            	});
    				}
    			});
             	var btn_exp = $('<div class="form-group fr" > <button class="btn btn-default" type="button" id="btn_exp"><i class="ico-download margin-sm-right"></i>导出报表</button></div>')
            	var btn_query = $('<div class="form-group"><button class="btn btn-primary" type="button" id="btn_search_1">查询</button></div>');
            	that.$("#attr_form").append(btn_query);
            	that.$("#attr_form").append(btn_exp);
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
            initData :function(data){
            	
            },
        });
        return pageView;
    });
