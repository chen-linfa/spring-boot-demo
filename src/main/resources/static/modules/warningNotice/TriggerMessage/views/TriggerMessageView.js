define(['hbs!../templates/trigger-message.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.initSelectBox();
                that.initSelectBox_1();
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "cfg_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
				      	{data: "cfg_id", title: "配置id",visible:false},
						{data: "cfg_name", title: "规则配置名称"},
						{data: "cat_name", title: "类型"},
						{data: "rule_name", title: "告警模板"},
						{data: "sms_num", title: "短信通知对象",width:"200px",formatter:function(data){
							if(data==null){
								return "<a href='javascript:void(0);' class='sms_obj'>"+0+"</a>";
							}else{
								return "<a href='javascript:void(0);' class='sms_obj'>"+data+"</a>";
							}
						}},
						{data: "cfg_desc", title: "规则描述",code:"CARD_BRAND_TYPE"},
						{data: "exe_code", title: "执行方式",formatter:function(data){
							if(data=="exe_realtime"){
								return "实时执行";
							}else if(data=="exe_eachday5am"){
								return "定时执行";
							}
						}},
						{data: "trigger_date", title: "触发时间"},
						{data: "result_num", title: "触发结果",formatter:function(data){
							if(data==null){
								return "<a href='javascript:void(0);' class='result_num'>"+0+"</a>";
							}else{
								return "<a href='javascript:void(0);' class='result_num'>"+data+"</a>";
							}
						}},
						{data: "create_date", title: "创建时间"}
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
                    	that.queryTriggerInfo(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	//that.queryTriggerInfo(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					that.queryTriggerInfo(1);
				});
				
				//过滤非法的卡号输入值
	        	that.$('#search_input').bind({
	        		keyup:function(){
	        			this.value=this.value.replace(/\D/g,'');
	        		}
	        	});
	        	
	        	that.queryTriggerInfo(1);
            },
            initSelectBox:function(){
    			//REPORT_CATEGORY
            	var that = this;
            	that.$('#cat_name').combobox({dataSource:[{name:"类型",value:""}]});
            	fish.callService("RulesConfigurationController", "getRulesTplCat",{},function(data){
            		var result = data.result;
            		var dataSource = [];
            		if($.isArray(result)){
            			//group_id:group_name
            			_.each(result,function(item){
            				dataSource.push({value:item.cat_id,name:item.cat_name});
            			});
            		}
//            		dataSource.unshift({name:"类型",value:""})
            		that.$('#cat_name').combobox("option",{dataSource:dataSource});
            	});
            },
            initSelectBox_1:function(){
    			//REPORT_CATEGORY
            	var that = this;
            	that.$('#rule_name').combobox({dataSource:[{name:"模板",value:""}]});
            	fish.callService("RulesInstanceDataController", "queryRulesTpl",{},function(data){
            		var result = data.result;
            		var dataSource = [];
            		if($.isArray(result)){
            			//group_id:group_name
            			_.each(result,function(item){
            				dataSource.push({value:item.tpl_id,name:item.rule_name});
            			});
            		}
//            		dataSource.unshift({name:"类型",value:""})
            		that.$('#rule_name').combobox("option",{dataSource:dataSource});
            	});
            },
            queryTriggerInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var search_content = $.trim($('#search_input').val());
            	var num = "";
            	var param = {
            		page:page,
            		rows:rows,
            		cfg_name:that.$("#cfg_name").val(),
            		cat_id:that.$("#cat_name").val(),
            		tpl_id:that.$("#rule_name").val()
            	};
            	var info = new Array();
            	var a = {};
            	fish.callService("RulesInstanceDataController", "queryTriggerInfo",param,function(reply){
            		console.log(reply);
            		if(reply){
            			that.$("#xtab").xtable("loadData",reply.result.rows);
                		that.$('.js-pagination').pagination("update",{records:reply.result.total,start:reply.result.pageNumber});
                		that.$(".page-total-num").text(reply.result.pageCount);
                		that.$(".page-data-count").text(reply.result.total);
            		}
            		
            	});
            },
            bindTableButton:function(){
            	var that = this;
            	that.$data_list.find("tr").each(function(){
                    $(this).children("td").addClass("text-omit");
                    $(this).children("th").addClass("text-omit");
                });
            	that.$("#xtab").find(".sms_obj").unbind("click").bind("click",function(){
            		var cfg_id = $(this).parents("tr").attr("id");
            		var data = {};
            		data.cfg_id = cfg_id;
            		fish.popupView({
    					url:"modules/warningNotice/TriggerMessage/views/ShowNumberView",
    					width:400,
    					viewOption:data
    				});
            	});
            	
            	that.$("#xtab").find(".result_num").unbind("click").bind("click",function(){
            		var cfg_id = $(this).parents("tr").attr("id");
            		var item = that.$data_list.xtable("findData","#"+cfg_id);
            		var data = {};
            		data.cfg_id = cfg_id;
            		data.time = item.trigger_date;
            		fish.popupView({
    					url:"modules/warningNotice/TriggerMessage/views/ShowResultView",
    					width:600,
    					viewOption:data
    				});
            	});
            	that.$("#xtab").delegate(".js-btn_detail","click",function(){
            		var $tr = $(this).parents("tr");
            		that.$(".js-detail").remove();
            		var $template = that.$("#detail_tr").clone();
            		$template.removeAttr('id').addClass('js-detail');
        			var params = {};
					params.mem_user_id = $tr.attr("id");
					var thisdata = that.$data_list.xtable("findData","#"+$tr.attr("id"));
					fish.callService("CustMemController", "queryCustMemberDetail", params, function(reply){
						var result = reply.result;
						fish.utils.getAttrCode(["CARD_BRAND_TYPE","CARD_STATUS"],function(code){
							result.used_gprs = fish.utils.unitTranslate(result.used_gprs);
							result.card_brand_type = code["CARD_BRAND_TYPE"][result.card_brand_type];
							result.card_status = code["CARD_STATUS"][result.card_status];
							result.apn = thisdata.apn;
							result.is_orderflows = "否";
							$template.find("span[name]").each(function(){
								var key = $(this).attr("name");
								if(!result[key]){
									result[key] = "";
								}
								$(this).text(result[key]);
							});
						});
					});
            		$tr.after($template);
            	});
            	
            	that.$("#xtab").delegate(".js-btn_actice","click",function(){
            		var $tr = $(this).parents("tr");
					var thisdata = that.$data_list.xtable("findData","#"+$tr.attr("id"));
					var params = {};
	        		params.msisdn = thisdata.msisdn;
	        		if(thisdata.card_status=="4" || thisdata.card_status =="休眠"){
	        			fish.callService("CustBusinessContrller", "resetGPRSState", params, function(data) {
		        			if (data.res_code == "00000") {
		        				layer.alert(data.res_message);
		        			}
		        			else{
		        				layer.alert(data.res_message);
		        			}
		        		});
	        		}else{
	        			layer.alert("请您选择卡状态为沉默期或者休眠状态的物联卡进行激活！");
	        		}
            	});
            	
            	that.$("#xtab").delegate(".js-btn_diagnose","click",function(){
            		var $tr = $(this).parents("tr");
					var thisdata = that.$data_list.xtable("findData","#"+$tr.attr("id"));
            		 var viewURL = "modules/memberManage/oneKeyDiagnose/views/OneKeyDiagnoseView";
                     that.parentView.openView(viewURL,thisdata.msisdn);
            	});
            	
            	 that.$(".js-dropdownMenu2").click(function(){
                     if($(this).children(".ico-pull-down").hasClass("active")){
                         $(this).parents(".btn-group").removeClass("open");
                         $(this).children(".ico-pull-down").removeClass("active");
                     }else{
                         that.$(".btn-group").removeClass("open");
                         that.$(".ico-pull-down").removeClass("active");
                         $(this).parents(".btn-group").addClass("open");
                         $(this).children(".ico-pull-down").addClass("active");
                     }
                     
                 })
            }
        });
        return pageView;
    });
