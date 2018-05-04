/**
 XENON DATATABLE组件 By Minami
 需求样式：
 	<link rel="stylesheet" href="public/lib/xenon/css/bootstrap.css">
	<link rel="stylesheet" href="public/lib/xenon/css/xenon-core.css">
需求JS：
	<script src="public/lib/xenon/js/datatables/js/jquery.dataTables.min.js"></script>
	<script src="public/lib/xenon/js/datatables/dataTables.bootstrap.js"></script>
例子页面标签写法：
<div class="panel panel-default">
<div class="panel-body">
	<table id="minami" class="minami_c"></table>
</div>
</div>
 最简使用方式：
 $(jq).xtable();即按默认方法初始化xtable
 $(jq).xtable({pageSize:20,adjustPageSize:true});即按指定属性初始化xtable，可使用属性见后文
 $(jq).xtable('toPage',1);对已经初始化的xtable执行某个xtable内部方法
 */

(function ($){
	$.fn.xtable = function(options, params){
		var _self = this;
		//需求table标签
		if (!$(this).is('table')){
			return null;
		}
		
		//执行方法
		if(typeof options == "string"){
			if(!_self.data("xtable")){
				//没初始化，不执行
				return null;
			}
			
			var method = $.fn.xtable.methods[options];
			if($.isFunction(method)){
				return method(_self, params);
			}

			return null;
		}
		
		options = options || {};
		
		return _self.each(function(){
			var that = this;
			//根据属性初始化
			//$(this).html("");
			var data = $(this).data("xtable");
			if(data){
				data.options = $.extend(data.options, options);
			}
			else{
				//覆盖默认属性
				options = $.extend({}, $.fn.xtable.defaults, options);
				$(this).data("xtable", {options: options});
			}
			
			$(this).css("margin-bottom","0px");
			//$(this).addClass("table table-bordered xtable_break");//XENON DATATABLE默认样式
			var tableoption = $(this).data("xtable").options;
			tableoption._async = [];
			var column = tableoption.columns;
			var column_code = [];
			//先行处理columns定义
			var emptyformatter = function(data){
				//默认formatter
				if (data === null || data === undefined){
					return "";
				}else{
					return data;
				}
			};
			for(var i=0;i<column.length;i++){
				column[i].name = column[i].data;
				if (column[i].formatter && !column[i].code){
					//EASYUI风格的FORMATTER改名成dataTable接受的render
					column[i].render = (function(formatter){
							return function(data,type,rows,meta){
								if (!rows._isEmptyRow)
								{
									return formatter(data,rows);
								}else{
									return "";
								}
							};
						})(column[i].formatter);
				}else if (column[i].code){
					//如果有设置CODE。如果CODE和formatter同时设置，数据先经过code转换再赋予formatter依然可以使用。
					column_code.push(column[i].code);
					column[i].render = (function(code,ext_formatter){ 
						return (function(data,type,rows,meta){
							if (data === null || data === undefined){
								return "";
							}
							var result = data;
							if (_self.data("xtable").options._code[code] && _self.data("xtable").options._code[code][data]){
								result = _self.data("xtable").options._code[code][data];
							}
							return ext_formatter?ext_formatter(result,rows):result;
						});
					})(column[i].code,column[i].formatter);
				}else{
					//如果都没有的话，为了保证dataTable不报内部错误，自行定义一个默认的formatter(render)
					column[i].render = emptyformatter;
				}
			};
			if (column_code.length>0){
				//加载静态参数
				_self.data("xtable").options._code = {};
				fish.callService("CacheController", "getMultiAttrValues", column_code, function(data){
					if (data)
					{
						fish._codecache = fish._codecache || {};
						for(var _temp_code in data)
						{
							var _temp_code_list = data[_temp_code];
							if ($.isArray(_temp_code_list))
							{
								fish._codecache[_temp_code] = {};
								for(var i=0;i<_temp_code_list.length;i++)
								{
									var _list_inst = _temp_code_list[i];
									fish._codecache[_temp_code][_list_inst.attr_value] = _list_inst.attr_value_desc;
								}
							}
						}
						_self.data("xtable").options._code = fish._codecache;
						
					}
					initDataTable.call(that);
					for(var i=0;i<tableoption._async.length;i++){
						var item = tableoption._async[i];
						$.fn.xtable.methods[item.method]($(that),item.data);
					}
					_async = [];
				});
			}else{
				initDataTable.call(that);
			}
			
			function initDataTable(){
				var columnDefs = [];//对应的列定义
			//检查DIV状态，不是dataTable要求的则进行补足
			if ($(this).find("thead").length <=0 && column){
				if ($.isArray(column))
				{
					var html = "<thead><tr>";
					$.each(column,function(i,item){
						if(item.checkbox){
							//如果配置要加入CHECKBOX
							column.splice(i,1);
							columnDefs.push({targets:[ 0 ],sortable:false});//加入CHECKBOX的话要隐藏排序功能
							if(tableoption.singleSelect){
								column.unshift({data:"_checkbox",title:'',width:"35px"});
							}else{
								column.unshift({data:"_checkbox",title:'<input type="checkbox" class="cbr">',width:"35px"});
							}
							if ($.isArray(tableoption.data) && tableoption.data.length > 0)
							{
								for(var i=0;i<tableoption.data.length;i++)
								{
									if($.isArray(tableoption.data[i]))
									{
										tableoption.data[i].unshift('<input type="checkbox" class="cbr">');
									}
									else{
										tableoption.data[i]["_checkbox"] = '<input type="checkbox" class="cbr">';
									}
								}
							}
							return false;
						}
					});

					//组装TH
					for(var i=0;i<column.length;i++)
					{
						var ins = column[i];
						if(typeof ins == "string")
						{
							html += "<th>"+ins+"</th>";
						}else{
							html += "<th>"+ins.data+"</th>";
						}
					}
					html += "</tr></thead>";
					html += "<tbody><tr class='sss'>";
					html+="<td>xxx</td>";
					html += "</tr></tbody>";
					$(this).html(html);
				}
			}
			
			//初始化dataTable
			var domoption = "t";
			if (tableoption.adjustPageSize)
			{
				domoption = "<'col-xs-6'l>" + domoption;
			}
			
			//将xtable设置载入dataTable的原始设置
			var dataTableOption = {
				autoWidth:false,
				stripeClasses:tableoption.stripeClasses,
				pageLength:tableoption.pageSize,
				ordering : false,//tableoption.sortAble,//是否启用排序功能
				paging : true,//tableoption.ifPaging,
				searching : false,
				serverSide:false,//弃用serverSide
				//scrollY:tableoption.height?tableoption.height:null,
				scrollCollapse:false,
				dom: domoption,
				rowId : tableoption.rowId,
				data:tableoption.data,
				columns:column,
				columnDefs : columnDefs,
				"aaSorting": [],
				"oLanguage" : {// 语言设置
					"sLengthMenu" : "每页显示  _MENU_ 条记录",
					"sInfo" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
					"oPaginate" : {
						"sFirst" : "首页",
						"sPrevious" : "前一页",
						"sNext" : "后一页",
						"sLast" : "尾页"
					},
					"sSearch" : "搜索:",
					"sZeroRecords" : "暂无数据",
					"sInfoEmpty" : "没有数据"
				}
			};
			
			var dtobj = $(this).dataTable(dataTableOption);
			//在data里存储dataTable对象，供后续调用API时使用
			$(this).data("xtable").options.dtobj = dtobj;
			$(dtobj.api().table().container()).find(".dataTables_empty").attr("colspan",dataTableOption.columns.length);
			if ($.isFunction(tableoption.onLoad) && tableoption.data.length > 0)
			{
				tableoption.onLoad($(dtobj.api().table().container()));
			}
			
			if ($(this).data("xtable").options.url){
				//如果有配置请求地址
				
				//生成分页控件框架
				if ($(this).data("xtable").options.pagination)
				{
					var phtml = "<div class='row '><div class='col-xs-6'><div class='dataTables_info' name='total_count'> </div></div>";
					phtml += "<div class=''><div class='dataTables_paginate'><ul class='pagination' name='pager_control'></ul></div></div></div>";
					
					$(dtobj.api().table().container()).append(phtml);
				}
				//加载第一页的信息
				$.fn.xtable.methods.toPage(_self,1);
			}
			
			// XENON原始CHECKBOX替换、事件绑定操作
			var $state = $(this).find("thead input[type='checkbox']");//全选复选框
			if ($state.length > 0)
			{
				$(this).on('draw.dt', function()
				{
					//cbr_replace();
					$state.trigger('change');
				});
				
				$state.on('change', function(ev)
				{
					var $chcks = $(_self).find("tbody input[type='checkbox']");
					
					if($state.is(':checked'))
					{
						$chcks.prop('checked', true).trigger('change');
						$chcks.closest("tr").attr("slt",true);
					}
					else
					{
						$chcks.prop('checked', false).trigger('change');
						$chcks.closest("tr").removeAttr("slt");
					}
				});
			}
			}
		});
	};

	$.fn.xtable.methods = {
		options: function(jq,data){
			if(!data){
				return jq.data("xtable").options || {};
			}else{
				jq.data("xtable").options = $.extend(jq.data("xtable").options,data);
				if(data.pageSize){
					jq.data("xtable").options.dtobj.api().page.len(data.pageSize);
				}
			}
		},
		getSelected : function(jq){
			//获取勾选的记录的数据
			var idlist = [];
			$(jq).find("tbody tr[slt=true]").each(function(){
					//JQuery选择器形式在dataTable里找
					idlist.push("#"+$(this).attr("id"));
			});
			var result = [];
			var objlist = jq.data("xtable").options.dtobj.api().rows(idlist).data();
			for(var i=0;i<objlist.length;i++){
				result.push(objlist[i]);
			}
			return result;
		},
		addData:function(jq,data){
			//添加记录方法
			var me = $.fn.xtable.methods;
			var new_data = me.getData(jq);
			new_data.push(data);
			me.loadData(jq,new_data);
		},
		getData : function(jq,selector){
			//获取当前显示所有记录的数据
			var objlist = jq.data("xtable").options.dtobj.api().rows(selector).data();
			var result = [];
			for(var i=0;i<objlist.length;i++){
				if(objlist[i][jq.data("xtable").options.rowId].indexOf("_temp_") != -1){
					objlist[i][jq.data("xtable").options.rowId] = "";
				}
				if (objlist[i]._isEmptyRow){
					//移除空白行记录
					objlist.splice(i,1);
					i=-1;
				}
			}
			for(i=0;i<objlist.length;i++){
				result.push(objlist[i]);
			}
			return result;
		},
		updateData : function(jq,data){
			//按照条件更新某一行数据，注意该方法需要设置里设定的主键ID字段（rowId）
			var option = jq.data("xtable").options;
			if(option.columns[0].data == "_checkbox"){
				data["_checkbox"] = '<input type="checkbox" class="cbr">';
			}
			jq.data("xtable").options.dtobj.api().row("#"+data[option.rowId]).data(data).draw();
			//cbr_replace();
		},
		findData : function(jq,data){
			//按照条件返回数据，该方法建议使用ID
			return jq.data("xtable").options.dtobj.api().row(data).data();
		},
		delData : function(jq,data){
			//按照条件删除数据，该方法建议使用ID
			var option = jq.data("xtable").options;
			var deldata = [];
			if($.isArray(data)){
				for(var i=0;i<data.length;i++){
					if (typeof data[i] === "string" && data[i].indexOf("#") == -1){
						deldata.push("#"+data[i]);
					}else{
						deldata.push("#"+data[i][option.rowId]);
					}
				}
			}else{
				deldata.push("#"+data[option.rowId]);
			}
			option.dtobj.api().rows(deldata).remove();
			option.dtobj.api().draw();
			return true;
		},
		delSelectedData : function(jq){
			//删除勾选的记录
			var me = $.fn.xtable.methods;
//			var option = jq.data("xtable").options;
			var idlist = [];
			$(jq).find("tbody tr[slt=true]").each(function(){
					//JQuery选择器形式在dataTable里找
					idlist.push("#"+$(this).attr("id"));
			});
			me.delData(jq,idlist);
			return true;
		},
		reload : function(jq){
			//按目前的参数重新刷新dataTable数据
			var option = jq.data("xtable").options;
//			var me = $.fn.xtable.methods;
			$.fn.xtable.methods.toPage(jq,option.nowPage);
		},
		load : function(jq,param){
			//按目前的参数重新刷新dataTable数据
			var option = jq.data("xtable").options;
			if(param){
				option.param = param;
			}
			$.fn.xtable.methods.toPage(jq,1);
		},
		toPage : function(jq,page){
			//跳到某页
			if (page<1){
				return false;
			}
			
			var me = $.fn.xtable.methods;
			var option = jq.data("xtable").options;
			var urlp = option.url.split(".");
			var param = {
				page:page,
				rows:option.pageSize
			};
			$.extend(param,option.param);
			
			if (option.url){
				//如果有配置请求地址
				var dtobj = option.dtobj;
				//如果一开始是没有加载分页控件的，则补充生成分页控件框架
				if (option.pagination && $(dtobj.api().table().container()).find("ul[name=pager_control]").length==0)
				{
					var phtml = "<div class='row '><div class='col-xs-6'><div class='dataTables_info' name='total_count'></div></div>";
					phtml += "<div class=''><div class='dataTables_paginate'><ul class='pagination' name='pager_control'></ul></div></div></div>";
					
					$(dtobj.api().table().container()).append(phtml);
				}
			}
			
			if (urlp && urlp.length>=2)
			{
				fish.callService(urlp[0],urlp[1],param,function(reply){
					option.dtobj.api().clear();
					if (reply && reply.rows)
					{
						option.nowPage = reply.pageNumber;
						//刷新分页控件
						if (option.pagination)
						{
							var container = $(option.dtobj.api().table().container());
							container.find("div[name=total_count]").html("共有<span name='page'>"+reply.pageCount+"</span>页，<span name='total'>"+reply.total+"</span>条数据");
							var pager_html = "<li class='paginate_button "+(reply.pageNumber>1?"":"disabled")+"'><a href='javascript:void(0);' page='-1'>上一页</a></li>";

							//宽度控制，如果是10页以下的总页数，则让所有按钮直接展示，如果是10页以上的页数，则缩减区间
							//页数可由配置决定
							//var page_limit = Math.ceil(option.pageControlNum/2);
							pager_html += "<li class='paginate_button active'><a href='javascript:void(0);'>"+reply.pageNumber+"</a></li>";
							/*
							var start = (reply.pageNumber>=page_limit?reply.pageNumber-page_limit:0)+1;
							var end = (reply.pageNumber+page_limit<=reply.pageCount?reply.pageNumber+page_limit:reply.pageCount);
							for(var i=start;i<=end;i++){
								if (i == reply.pageNumber){
									pager_html += "<li class='paginate_button active'><a href='javascript:void(0);' page='="+i+"'>"+i+"</a></li>";
								}else{
									pager_html += "<li class='paginate_button'><a href='javascript:void(0);' page='="+i+"'>"+i+"</a></li>";
								}
							}*/
							pager_html += "<li class='paginate_button "+(reply.pageNumber<reply.pageCount?"":"disabled")+"'><a href='javascript:void(0);' page='+1'>下一页</a></li>";
							
							pager_html += "<li class='paginate_button'><input type='text' id='pnum_input' style='width:40px;height:32px;' placeholder='页码'><a href='javascript:void(0);' style='margin-left:10px;border-right:none;' page='*'>跳页</a></li>";
							container.find("ul[name=pager_control]").html(pager_html);
							
							//绑定分页控件点击事件
							container.find("ul[name=pager_control]").find("a[page]").unbind("click").click(function(){
								var page_param = $(this).attr("page");
								switch(page_param[0]){
								case '+':
									if (reply.pageNumber < reply.pageCount)
									{
										me.toPage(jq,reply.pageNumber+1);
									}
									break;
								case '-':
									if (reply.pageNumber > 1)
									{
										me.toPage(jq,reply.pageNumber-1);
									}
									break;
								case '=':
									me.toPage(jq,parseInt(page_param.substring(1)));
									break;
								case '*':
									var pnum = container.find("ul[name=pager_control]").find("#pnum_input").val();
									if(pnum){
										if(pnum > reply.pageCount){
											pnum = reply.pageCount;
										}
										if(pnum < 1)
										{
											pnum = 1;
										}
										me.toPage(jq,parseInt(pnum,10));
									}
									break;
									default:
								}
							});
						}
					}
					me.loadData(jq,reply.rows);
					//option.dtobj.api().draw();
					//var td = $(option.dtobj.api().table().container()).find(".dataTables_empty")
					//td.attr("colspan",option.columns.length);
				});
			}
		},
		loadData : function(jq,data){
			var option = jq.data("xtable").options;
			if(!option.dtobj){
				option._async.push({method:"loadData",data:data});
				return;
			}
			option.dtobj.api().clear();
			if (data && data.length){
				
				if (option.autoFill && data.length < option.pageSize )
				{
					//如果数据的条数不足分页大小，则自动填充空行
					var empty = $.extend({},data[0]);
					for(var a in empty){
						empty[a] = "<span style='visibility:hidden;'>EMPTY</span>";
					}
					empty._isEmptyRow = true;//空记录标记
					empty[option.rowId] = "";
					while (data.length < option.pageSize)
					{
						data.push(empty);
					}
				}
				
				if(data.length > option.pageSize){
					//载入的数据大于分页大小，可能是手动添加的，展示分页控件
					var container = $(option.dtobj.api().table().container());
					var pageCount = Math.ceil(data.length/option.pageSize);
					var pageNumber = 1;
					//如果一开始是没有加载分页控件的，则补充生成分页控件框架
					if (option.pagination && container.find("ul[name=pager_control]").length==0)
					{
						var phtml = "<div class='row '><div class='col-xs-6'><div class='dataTables_info' name='total_count'></div></div>";
						phtml += "<div class=''><div class='dataTables_paginate'><ul class='pagination' name='pager_control'></ul></div></div></div>";
						container.append(phtml);
					}
					container.find("div[name=total_count]").html("共有"+pageCount+"页，"+data.length+"条数据");
					var pager_html = "<li class='paginate_button'><a href='javascript:void(0);' page='-1'>上一页</a></li>";

					//宽度控制，如果是10页以下的总页数，则让所有按钮直接展示，如果是10页以上的页数，则缩减区间
					//页数可由配置决定
					pager_html += "<li class='paginate_button active'><a href='javascript:void(0);'>"+pageNumber+"</a></li>";
					/*
					var start = (pageNumber>=page_limit?pageNumber-page_limit:0)+1;
					var end = (pageNumber+page_limit<=pageCount?pageNumber+page_limit:pageCount);
					for(var i=start;i<=end;i++){
						if (i == pageNumber){
							pager_html += "<li class='paginate_button active'><a href='javascript:void(0);' page='="+i+"'>"+i+"</a></li>";
						}else{
							pager_html += "<li class='paginate_button'><a href='javascript:void(0);' page='="+i+"'>"+i+"</a></li>";
						}
					}*/
					pager_html += "<li class='paginate_button "+(pageNumber<pageCount?"":"disabled")+"'><a href='javascript:void(0);' page='+1'>下一页</a></li>";
					pager_html += "<li class='paginate_button'><input type='text' id='pnum_input' style='width:40px;height:32px;' placeholder='页码'><a href='javascript:void(0);' style='margin-left:10px;' page='*'>跳页</a></li>";
					container.find("ul[name=pager_control]").html(pager_html);
					var page_li_clickfunc = function(that){
						var page_param = $(that).attr("page");
						switch(page_param[0]){
						case '+':
							option.dtobj.api().page('next').draw('page');
							break;
						case '-':
							option.dtobj.api().page('previous').draw('page');
							break;
						case '=':
							option.dtobj.api().page(parseInt($(that).attr("page").substring(1),10)-1).draw('page');
							break;
						case '*':
							var pnum = container.find("ul[name=pager_control]").find("#pnum_input").val();
							if(pnum){
								if(pnum > reply.pageCount){
									pnum = reply.pageCount;
								}
								if(pnum < 1)
								{
									pnum = 1;
								}
								option.dtobj.api().page(parseInt(pnum,10)-1).draw('page');
							}
							break;
							default:
						}
						//刷新分页控件部分
						var pageNumber = option.dtobj.api().page()+1;
						var pager_html = "<li class='paginate_button "+(pageNumber>1?"":"disabled")+"'><a href='javascript:void(0);' page='-1'>上一页</a></li>";
						pager_html += "<li class='paginate_button active'><a href='javascript:void(0);'>"+pageNumber+"</a></li>";
						/*
						var start = (pageNumber>=page_limit?pageNumber-page_limit:0)+1;
						var end = (pageNumber+page_limit<=pageCount?pageNumber+page_limit:pageCount);
						for(var i=start;i<=end;i++){
							if (i == pageNumber){
								pager_html += "<li class='paginate_button active'><a href='javascript:void(0);' page='="+i+"'>"+i+"</a></li>";
							}else{
								pager_html += "<li class='paginate_button'><a href='javascript:void(0);' page='="+i+"'>"+i+"</a></li>";
							}
						}*/
						pager_html += "<li class='paginate_button "+(pageNumber<pageCount?"":"disabled")+"'><a href='javascript:void(0);' page='+1'>下一页</a></li>";
						pager_html += "<li class='paginate_button'><input type='text' id='pnum_input' style='width:40px;height:32px;' placeholder='页码'><a href='javascript:void(0);' style='margin-left:10px;' page='*'>跳页</a></li>";
						container.find("ul[name=pager_control]").html(pager_html);
						container.find("ul[name=pager_control]").find("a[page]").unbind("click").click(function(){
							page_li_clickfunc(this);
						});
						
						//手动翻页时重新绑定每行点击事件
						var clickfunc = (function(option){
							return function(e){
								if (!$(this).attr("id")){
									//是自己补充的空记录则不触发操作
									return false;
								}
								
								if(!$(this).attr("slt"))
								{
									if (option.singleSelect)
									{
										container.find("tr").css("background-color","");
										container.find("input[type=checkbox]").prop('checked', false).trigger('change');
										container.find("tr").removeAttr("slt");
									}
									$(this).find("input[type=checkbox]").prop('checked', true).trigger('change');
									$(this).attr("slt",true);
									if (!option.onSelectClass)
									{
										$(this).css("background-color","#f5f5f5");//#666
									}
									else{
										$(this).addClass(option.onSelectClass);
									}
								}else{
									$(this).find("input[type=checkbox]").prop('checked', false).trigger('change');
									$(this).removeAttr("slt");
									if (!option.onSelectClass)
									{
										$(this).css("background-color","");
									}
									else{
										$(this).removeClass(option.onSelectClass);
									}
								}
								
								if ($.isFunction(option.onSelect)){
									//执行外部绑定的点击事件
									var data = option.dtobj.api().row("#"+$(this).attr("id")).data();
									option.onSelect(e,data);
								}
							};
						})(option);
						container.find("tbody tr").unbind("click").click(clickfunc);
						//cbr_replace();
					};
					//绑定分页控件点击事件
					container.find("ul[name=pager_control]").find("a[page]").unbind("click").click(function(){
						page_li_clickfunc(this);
					});
					
					
				}
				
				if (option.columns[0].data != "_checkbox")
				{
					for(var i=0;i<data.length;i++)
					{
						var data_item = data[i];
						if(!data_item._isEmptyRow && !data_item[option.rowId]){
							data_item[option.rowId] = "_temp_"+Math.floor((Math.random()*1000));
						}
						option.dtobj.api().row.add(data_item);
					}
				}
				else{
					for(var i=0;i<data.length;i++)
					{
						var data_item = data[i];
						if (!data_item._isEmptyRow)
						{
							if(!data_item[option.rowId]){
								data_item[option.rowId] = "_temp_"+Math.floor((Math.random()*1000));
							}
							data_item["_checkbox"] = '<input type="checkbox" class="cbr">';
						}else{
							data_item["_checkbox"] = '';
						}
						option.dtobj.api().row.add(data_item);
					}
				}
			}
			option.dtobj.api().draw();
			//绑定每行点击事件
			var container = $(option.dtobj.api().table().container());
			var clickfunc = (function(option){
				return function(e){
					if (!$(this).attr("id")){
						//是自己补充的空记录则不触发操作
						return false;
					}
					
					if(!$(this).attr("slt"))
					{
						if (option.singleSelect)
						{
							container.find("tr").css("background-color","");
							container.find("input[type=checkbox]").prop('checked', false).trigger('change');
							container.find("tr").removeAttr("slt");
						}
						$(this).find("input[type=checkbox]").prop('checked', true).trigger('change');
						$(this).attr("slt",true);
						if (!option.onSelectClass)
						{
							$(this).css("background-color","#f5f5f5");//#666
						}
						else{
							$(this).addClass(option.onSelectClass);
						}
					}else{
						$(this).find("input[type=checkbox]").prop('checked', false).trigger('change');
						$(this).removeAttr("slt");
						if (!option.onSelectClass)
						{
							$(this).css("background-color","");
						}
						else{
							$(this).removeClass(option.onSelectClass);
						}
					}
					
					if ($.isFunction(option.onSelect)){
						//执行外部绑定的点击事件
						var data = option.dtobj.api().row("#"+$(this).attr("id")).data();
						option.onSelect(e,data);
					}
				};
			})(option);
			container.find("tbody tr").unbind("click").click(clickfunc);
			//cbr_replace();
			
			//设置空白行
			container.find(".dataTables_empty").attr("colspan",option.columns.length);
			//onLoad事件执行
			if ($.isFunction(option.onLoad))
			{
				option.onLoad(container);
			}
		}
	};
	
	//默认属性
	$.fn.xtable.defaults = $.extend({}, {
		nowPage:1,//当前页
		pageSize : 10,//默认页码大小
		height : null,//高度，注意这仅仅是TBODY即表格数据部分的高度
		pagination : true,//是否显示分页控件
		pageControlNum:10,//分页时，分页按钮展示的区间长度，10的话则分页区域最多展示10个按钮
		autoFill:true,//当数据条数不足指定的分页大小时，是否自动维持空白行
		adjustPageSize : false, //是否可以动态选择页面大小
		columns : [],//定义表头对象，如果指定的TABLE标签内有表头<thead>，则以<thead>为准，否则以此生成。如果没有<thead>也没有指定column则会出错
		sortAble : false,//是否启动排序功能
		singleSelect : true,//是否单选，false则加入选择框checkbox
		onSelectClass : null,//记录被选中时呈现的样式，应用于TR标签，如果不配置则默认
		data : [],//加载默认数据
		rowId : "record_id",//作为每行记录主键ID的字段名称
		url : "",//请求的SPRING注解方法，如CacheController.getTestData
		param : {},//AJAX调用时传递的参数
		onSelect : function(e,data){},//选中记录时触发的事件
		onLoad : function(container){},//加载数据完毕时触发的事件，参数container为表格本身的jQuery对象
		stripeClasses: ["temp"]//斑马线样式数组，可以按斑马线式循环给tr标签附上指定样式，如["odd","even"]为奇数行为odd，偶数行为even
	});

	/**
	 * 触发事件
	 * event_name 事件名称
	 * params 事件参数
	 */
	function dispatchEvent(jq, event_name, params){
		var options = jq.xtable("options");
		if($.isFunction(options[event_name])){
			if($.isArray(params)){
				options[event_name].apply(jq, params);
			}
			else{
				options[event_name].apply(jq);
			}
		}
	}
})(jQuery);