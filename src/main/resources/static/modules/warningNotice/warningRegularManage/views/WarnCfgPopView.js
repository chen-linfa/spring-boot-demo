define(["hbs!../templates/newwarncfg.html"],function(Temp){
	var View = fish.View.extend({
		template:Temp,
		uploadImeiKey:"",//用于查询IMEI池已经上传的号码数
		upload_key:{},//用于查询已选号码等操作
		submitParam:{//最后提交的内容格式
			saveType:"add",//提交类型，新增为add，编辑为edit
			result_tpl:{},//告警描述等信息
			result_tplAttr:[],//参数？目前仅IMEI池使用到
			result_optList:[],//步骤中，所有勾选到的opt项（RulesOptions.opt）
			result_optValList:[]//步骤中，所有勾选到的opt项对应的para（RulesOptions.paraMap）
		},
		afterRender:function(){
			var that = this;
			
			if(that.options.saveType){
				that.submitParam.saveType = that.options.saveType;
				that.upload_key = {};
				that.uploadImeiKey = "";
				if(that.options.saveType == "edit"){
					//编辑模式下不允许修改告警类型和告警规则
					that.$(".modal-title").text("编辑告警规则");
					that.$("input[name=cat_id]").prop("disabled",true);
					that.$("input[name=rule_code]").prop("disabled",true);
					that.submitParam.cfg_id = that.options.cfg_id;
					that.submitParam.cfg_opt_val_id = that.options.edit_detail.rulesCfgOptVal.cfg_opt_val_id;
					that.$("[name=cfg_name]").val(that.options.edit_detail.rulesCfg.cfg_name);
				}
			}
			var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                        - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            
            that.$("#btn_submit").click(function(){
            	that.submit();
            });
            
            //下载IMEI模板按钮
            that.$("#btn_downimei").click(function(){
            	window.open("servlet/downloadExcel?type=mould&mould=rules_imei");
            });
            
            //查看已选IMEI
            that.$("#btn_imeipool").click(function(){
            	//弹出已选号码弹窗
				fish.popupView({
					url:"modules/warningNotice/warningRegularManage/views/ShowNumberView",
					width:400,
					viewOption:{para_code:"imei_pool",cfg_id:that.options.cfg_id,uploadKey:that.uploadImeiKey}
				});
            });
            
            that.initRuleCombobox();
            that.imeiFileEvent();
		},
		initRuleCombobox:function(){
			//初始化选择规则部分的下拉框
			var that = this;
			that.$("input[name=cat_id]").combobox({
				dataTextField:"cat_name",
				dataValueField:"cat_id"
			});
			that.$("input[name=rule_code]").combobox({
				dataTextField:"rule_name",
				dataValueField:"rule_code"
			});
			
			//查询可选择的规则分类，并赋予默认值
			fish.callService("RulesConfigurationController","getRulesTplCat",{},function(reply){
				that.$("input[name=cat_id]").combobox("option",{
					dataSource:reply.result
				});
				//新增模式下，规则分类默认选择第一项，编辑模式下则加载配置
				if(that.options.saveType != "edit"){
					that.$("input[name=cat_id]").combobox("value",reply.result[0].cat_id);
				}else{
					that.$("input[name=cat_id]").combobox("value",that.options.edit_detail.rulesCfg.cat_id);
				}
			});
			
			//联动：规则分类改变的时候，要影响到后面具体规则的可选项
			that.$("input[name=cat_id]").on("combobox:change",function(){
				var val = $(this).val();
				fish.callService("RulesConfigurationController","getRulesTplType",{cat_id:val},function(reply){
					//groupBy:以rulecode组织具体规则数据，供后续查找
					that.ruleData = _.groupBy(reply.result,function(item){
						return item.rule_code;
					});

					that.$("input[name=rule_code]").combobox("option",{
						dataSource:reply.result
					});
					//新增模式下，规则分类默认选择第一项，编辑模式下则加载配置
					if(that.options.saveType != "edit"){
						that.$("input[name=rule_code]").combobox("value",reply.result[0].rule_code);
					}else{
						var target_rule = _.findWhere(reply.result,{tpl_id:that.options.edit_detail.rulesCfg.tpl_id});
						that.$("input[name=rule_code]").combobox("value",target_rule.rule_code);
					}
				});
			});
			
			//联动：选择一个具体规则的时候，填写的规则名称默认与选择的具体规则相同（仅新增的情况下）
			//并且需要组装下方的属性面板
			that.$("input[name=rule_code]").on("combobox:change",function(){
				if(that.submitParam.saveType == "add"){
					that.$("input[name=cfg_name]").val(that.$("input[name=rule_code]").combobox("text"));
				}
				//具体规则的属性列表需要tpl_id查询，通过rule_code在缓存的数据里查询具体规则的模板数据
				var target_tpl = that.ruleData[that.$("input[name=rule_code]").combobox("value")][0];
				var tpl_id = target_tpl.tpl_id;
				//在这里提前赋予提交参数时tpl部分的内容
				//注意：另有cfg_desc配置描述字段目前来看需要前台组装，在这里无法完全组装，需要提交时组装
				that.submitParam.result_tpl.tpl_id = tpl_id;
				that.submitParam.result_tpl.cfg_name = that.$("input[name=rule_code]").combobox("text");
				that.submitParam.result_tpl.data_content_cfg = target_tpl.data_content_tpl;
				that.submitParam.result_tpl.cfg_desc = "开通"+that.$("input[name=cat_id]").combobox("text")+"告警功能，当"
				+target_tpl.rule_desc;
				
				fish.callService("RulesConfigurationController","getRulesTemplateCache",{tpl_id:tpl_id},function(reply){
					//请求获取具体规则里需要配置的属性
					if(reply && reply.result && reply.result.tplAttrMap){
						that.generateRuleAttr(reply.result);
					}
				});
			});
		},
		generateRuleAttr:function(result){
			//组装需要填写的属性面板（包括规则参数、其他步骤如选择操作方式对象等）
			var that = this;
			var tplAttrMap = result.tplAttrMap;
			
			that.templateCache = result;
			//选择规则部分
			that.$("#ruleattr").empty()
			if(_.size(tplAttrMap) == 0){
				that.$("#ruleattr").text("不需要填写");
			}
			that.$("#imei_attr").hide();
			that.submitParam.result_tplAttr = [];
			that.$("#flow_unit").hide();
			_.each(tplAttrMap,function(item,key){
				//给result_tplAttr增加一项
				that.submitParam.result_tplAttr.push({
					attr_code:item.attr_code,
					attr_value:"",
					tpl_attr_id:item.tpl_attr_id
				});
				//FIXME 流量展示单位和IMEI池单独处理全为非配置项的内容，将来可能做调整
				//流量时要展示单位
				if(item.attr_code == "flow_limit"){
					that.$("#flow_unit").show();
				}else{
					that.$("#flow_unit").hide();
				}
				
				//FIXME IMEI池单独处理，IMEI池固定展示三个IMEI使用的号码按钮，否则的话不展示
				if(item.attr_code != "imei_pool"){
					var $div = that.$("#attr_template").clone().show();
					if(that.options.saveType == "edit"){
						$div.find("label").text(item.attr_name);
						$div.find("input").attr("name",item.attr_code).val(that.options.edit_detail.rulesTplAttr[0].attr_value);
					}else{
						$div.find("label").text(item.attr_name);
						$div.find("input").attr("name",item.attr_code).val(item.default_value);
					}
					that.$("#ruleattr").append($div);
				}else{
					//如果是IMEI池
					var length = that.submitParam.result_tplAttr.length;
					that.submitParam.result_tplAttr[length-1].value = {key:""};
					that.$("#imei_attr").show();
					if(that.options.saveType == "edit"){
						that.$("#imei_num").text(that.options.edit_detail.rulesTplAttr.length);
					}
				}
			});
			
			//其他部分（其他步骤，操作方式等）的组装
			//遍历stepList，取出需要查询的所有项目数据
			var opt_code_list = [];
			that.$("#steplist").empty();
			//stepList目前没有排序，以tpl_step_id为排序标准，如果后续排序确定了应当删除
			var stepSortList = _.sortBy(result.stepList, 'tpl_step_id'); 
			_.each(stepSortList,function(item,key){
				//将每个步骤需要的选项保存起来，后续一口气查询生成
				if(item.opt_list){
					opt_code_list = opt_code_list.concat(item.opt_list.split(","));
				}
				var $div = that.$("#step_template").clone().show();
				$div.find("label[name=step_name]").text(item.step_name);
				$div.find("div[name=opt_div]").attr("id",item.step_code+"_list");
				
				if(item.step_code == "obj" 
					&& ($.isArray(item.opt_list) || item.opt_list.length == 0)){
					$div.find("div[name=opt_div]").text("系统已存在默认对象，无须选择");
				}
				
				that.$("#steplist").append($div);
			});
			//查询完毕，开始组装具体的rules_opt项目
			if(opt_code_list.length > 0){
				fish.callService("RulesConfigurationController","getRulesOptionCacheList",{opt_code:opt_code_list},function(reply){
					if(reply.res_code == "00000"){
						that.optData = reply.result;
						_.each(reply.result,function(item,key){
							//opt_code下划线之前的部分与step_code认为是对应的
							var step_code = key.split("_")[0];
							//仅有选择对象为单选框，其他为复选框
							var type = (step_code =="obj"?"radio":"checkbox");
							//寻找到对应的div
							var $input = $("<input type='"+type+"' value='"+item.opt.opt_code+"'>");
							$input.attr("name",step_code+"_input").wrap("<label style='font-weight:normal'></label>");
							$input = $input.parent("label").append(item.opt.opt_name).wrap("<div></div>").parent("div");
							//FIXME 对于操作为APP和API，有额外的提醒信息，该信息为非配置项，为界面写死
							if(item.opt.opt_code == "act_api"){
								$input.append('<span class="text-weaker-color ">（具体请您在API应用管理去开通并配置'+result.tpl.api_name+'）</span>');
							}
							if(item.opt.opt_code == "act_app"){
								$input.append('<span class="text-weaker-color ">（具体信息请登录上海物联网app客户端进行查看）</span>');
							}
							
							that.$("#"+step_code+"_list").append($input);
														
							if(item.opt.opt_code == "obj_mem" || item.opt.opt_code == "obj_cust"
								|| item.opt.opt_code == "act_sms"){
								//步骤中，需要上传号码的项，号码处理按钮的生成
								//obj_mem为成员号码，obj_cust为集团编码，act_sms为操作方式中的发送短信
								var $btn = that.$("#file_step_template").clone().show().removeAttr("id");
								var para_code;
								_.each(item.paraMap,function(item,key){
									para_code = key;
									return false;
								});
								
								//编辑模式下，如果有这些需要上传的，查询已经选取的号码数
								if(that.options.saveType == "edit"){
									var params = {};
									params.page = 1;
									params.rows = 10;
									params.para_code = para_code;
									params.cfg_id = that.options.cfg_id;
									fish.callService("RulesConfigurationController", "queryUploadList",params,function(reply){
										$btn.find(".js-num").text(reply.total);
									});
								}
								
								$input.append($btn);
								that.bindObjButtonEvent(item.opt.opt_code,$btn,para_code);
							}
						});
					}
					
					//组装所有选项完毕，编辑模式时在此处勾选需要选中的复选框
					if(that.options.saveType == "edit"){
						var rulesCfgOpt = that.options.edit_detail.rulesCfgOpt;
						_.each(rulesCfgOpt,function(item){
							var opt_code = item.opt_code;
							that.$(":checkbox[value="+opt_code+"],:radio[value="+opt_code+"]").prop("checked",true);
						});
					}
					that.$(":radio,:checkbox").icheck();
					that.popup.center();
				});
			}
		},
		bindObjButtonEvent:function(type,$btn,para_code){
			var that = this;
			//给选择对象里的按钮绑定事件（顺便修改文字提示
			//type为对应项的opt_code
			var mould = {
				obj_mem:"msisdn",
				obj_cust:"cust",
				act_sms:"msg_phone"
			};
			
			if(type == "obj_cust"){
				$btn.find(".js-downtemp").text("下载集团编码模板");
				$btn.find(".js-uploadlabel").text("上传集团编码");
				$btn.find(".js-selected").text("已选集团编码列表");
			}else if(type == "act_sms"){
				$btn.find(".js-downtemp").text("下载短信号码模板");
				$btn.find(".js-uploadlabel").text("上传短信号码");
				$btn.find(".js-selected").text("已选短信号码列表");
			}
			
			$btn.find(".js-downtemp").click(function(){
				//下载模板
				window.open("servlet/downloadExcel?type=mould&mould="+mould[type]);
			});
			$btn.find(".js-selected").click(function(){
				//弹出已选号码弹窗
				fish.popupView({
					url:"modules/warningNotice/warningRegularManage/views/ShowNumberView",
					width:400,
					viewOption:{para_code:para_code,cfg_id:that.options.cfg_id,uploadKey:that.upload_key[type],uploadKey:that.uploadKey}
				});
			});
			
			//然后绑定文件输入框的事件
			that.initFileEvent(type,$btn,para_code);
		},
		initFileEvent:function(type,$btn,para_code){
			var that = this;
			if(!type){
				console.error("没有输入type，无法初始化文件输入框事件");
				return;
			}
			
			$btn.find("label").attr("for",type+"_file");
			var $file = $btn.find(".js-input_file").attr("id",type+"_file");
			$file.unbind().on('change', function(){
				var fileName = $file.val();
				var extPattern = /.+\.(xls|xlsx)$/i;
				if($.trim(fileName) != ""){
					if(!extPattern.test(fileName)){
						layer.alert("只能上传EXCEL文件！");
						$file.val("");
						return;
					}
				}
				var params_str = {};
				params_str.upload_type = type;
				if(that.$("input[value=obj_memWlAll]").length>0){
					//如果当前对象里全部成员仅限物联网，则增加卡品牌参数
					params_str.card_brand_type="1";
				}
				var other_params_str = JSON.stringify(params_str);
				var reg = new RegExp('"', "g");
	            var other_params_str = other_params_str.replace(reg, "?");
				var params = {};
				params.params_str = other_params_str;
				layer.load(1);
				$.ajaxFileUpload({
	    			url : "UploadController/uploadExcel.do",
	    			secureuri : false,
	    			fileElementId : type+"_file",
	    			data: params,
	    			dataType : 'json',
	    			success : function(data) {
	    				layer.closeAll();
	    				if(data.res_code=="00000"){
	    					that.upload_key[para_code] = data.result.download_key;
	    					if(!data.result){
		    					layer.alert("上传的数据为空 ！");
		    					return;
	    					}else{
	    						layer.alert("上传成功 ！有效号码数为："+data.result.num);
	    						$btn.find(".js-num").text(data.result.num);
	    					}
	    					that.uploadKey = data.result.download_key;
	    				}else{
	    					layer.alert(data.res_message);
	    				}
	       			},
	    			error : function(data) {
	    				layer.alert("操作失败 ！  "+ data.res_message);
	    				layer.closeAll();
	    			}
	    		});
	    		that.$("#"+type+"_file").val("");
				that.initFileEvent(type,$btn,para_code);
	        });
		},
		imeiFileEvent:function(){
			var that = this;
			//选择具体的规则时，IMEI选择号码文件的事件绑定
			var $file = that.$("#imei_file");
			$file.unbind().on('change', function(){
				var fileName = $file.val();
				var extPattern = /.+\.(xls|xlsx)$/i;
				if($.trim(fileName) != ""){
					if(!extPattern.test(fileName)){
						layer.alert("只能上传EXCEL文件！");
						$file.val("");
						return;
					}
				}
				
				var params_str = {};
				params_str.upload_type = 'up_imei';
				var other_params_str = JSON.stringify(params_str);
				var reg = new RegExp('"', "g");
	            var other_params_str = other_params_str.replace(reg, "?");
				var params = {};
				params.params_str = other_params_str;
				layer.load(1);
				$.ajaxFileUpload({
	    			url : "UploadController/uploadExcel.do",
	    			secureuri : false,
	    			fileElementId : "imei_file",
	    			data: params,
	    			dataType : 'json',
	    			success : function(data) {
	    				layer.closeAll();
	    				that.$("#imei_file").val("");
	    				if(data.res_code=="00000"){
	    					that.uploadImeiKey = data.result.download_key;
//	    					me.uploadEmailFirst = data.result.firstNumber;
	    					that.$("#imei_num").text(data.result.num);
	    					if(!data.result){
		    					layer.alert("上传的数据为空 ！");
		    					return;
	    					}else{
	    						layer.alert("上传成功 ！有效号码数为："+data.result.num);
	    					}
	    				}else{
	    					layer.alert(data.res_message);
	    				}
	       			},
	    			error : function(data) {
	    				layer.alert("操作失败 ！  "+ data.res_message);
	    				$file.val("");
	    				layer.closeAll();
	    			}
	    		});
	    		that.$("#imei_file").val("");
				that.imeiFileEvent();
	        });
		},
		validateRulesAttr:function(){
			//校验规则属性的有效性
			//属于直接按照业务规则的判断，目前与规则属性的定义没有任何关系
			var that = this;
			var saveType = that.submitParam.saveType;
			
			that.submitParam.result_tpl.cfg_name = that.$("[name=cfg_name]").val();
			if(!that.submitParam.result_tpl.cfg_name){
				layer.alert("请填写配置名称！");
				return false;
			}
				//如果规则有IMEI池
				var rulecode = that.$("input[name=rule_code]").combobox("value");
				if(rulecode == "1001_imeiPool" && that.submitParam.result_tplAttr[0]){
					if(saveType == "add"){
						if(!that.uploadImeiKey){
							layer.alert("请先上传IMEI！");
							return false;
						}
						that.submitParam.result_tplAttr[0].value = {key:that.uploadImeiKey};
					}
				}
			
			return true;
		},
		validateStep:function(){
			//校验其他步骤有效性，并组装其他参数
			var that = this;
			var opt_code = [];
			var step_check = {};

			that.$(":checked").each(function(){
				var code = $(this).attr("value");
				opt_code.push(code);
				step_check[code.split("_")[0]] = true;
			});
			
			if(!step_check.obj && that.$("input[type=radio]").length>0){
				layer.alert("请选择对象！");
				return false;
			}
			
			if(!step_check.act){
				layer.alert("请选择操作！");
				return false;
			}
			
			if(!step_check.exe){
				layer.alert("请选择执行方式！");
				return false;
			}
			
			//组装cfg_desc的剩余部分
			//首先判断是否有规则参数，有规则参数的话需要拼接上去
			if(that.submitParam.result_tplAttr.length > 0){
				var attr_code = that.submitParam.result_tplAttr[0].attr_code;
				var val = that.$("input[name="+attr_code+"]").val();
				if(!val && attr_code != "imei_pool"){
					layer.alert("请填写规则参数！");
					return false;
				}
				
				//根据规则参数类型进行业务判断
				switch (attr_code){
				case "flow_limit":
					if(that.$(":checked[name=flow_unit]").length == 0){
						layer.alert("请选择流量单位！");
						return false;
					}
					if(that.$(":checked[name=flow_unit]").attr("value") == "G"){
						val *= 1024;//最终结果转换为M，选择单位为G的时候乘以1024
					}
					if(val>51200){
						layer.alert("填写的流量不应大于50G！");
						return false;
					}
					break;
				case "msgLimit":
					if(val>10000){
						layer.alert("请您填写小于10000的正整数！");
						return false;
					}
					break;
				case "voiceLimit":
					if(val>1000){
						layer.alert("请您填写小于1000的正整数！");
						return false;
					}
					break;
				case "imei_pool":
					val = "";
					//IMEI池的值是uploadkey，不需要写在警告内容里
					//该值已经在validateRulesAttr中设置，此处不需要处理，只供备忘
					break;
				}
				if(val){
					that.submitParam.result_tplAttr[0].attr_value = val;
					that.submitParam.result_tpl.cfg_desc += "("+val+")";
				}
			}
			that.submitParam.result_tpl.cfg_desc += "时，将提供以下服务：<br/>(1)平台web页面显示告警信息。<br/>";
			var tpl_desc_count = 1;
			//将所有选择了的step option 放到结构中
			that.submitParam.result_optList = [];
			that.submitParam.result_optValList = [];
			var flag = true;
			_.each(opt_code,function(code){
				if(that.optData[code]){
					//组装其他的告警模板
					if(code.indexOf("act") != -1){
						//如果是操作类型的step_option就可以添加到告警模板中
						that.submitParam.result_tpl.cfg_desc += "("+(++tpl_desc_count)+")"+that.optData[code].opt.opt_desc+"<br/>";
					}
					//此处为opt
					that.submitParam.result_optList.push(that.optData[code].opt);
					
					//此处为paraMap
					//FIXME 通过对比后台方法，似乎是仅有上传号码类（即paraMap结构内有{value:{key:'xxx'}}结构时需要额外值
					if(_.size(that.optData[code].paraMap)>0){
						_.each(that.optData[code].paraMap,function(item){
							item.para_value = item.para_code;//默认为para_code
							if(item.para_code == "mem_list" || item.para_code == "phone_list"
								|| item.para_code == "cust_list"){
								item.value = {key:""};
							}
							if(that.options.saveType == "add"){
								if(that.upload_key[item.para_code]){
									//如果上传系的code存在
									item.value = {key:that.upload_key[item.para_code]};
								}else{
									if(item.para_code == "mem_list"){
										flag = false;
										layer.alert("请先上传成员列表！");
									}else if(item.para_code == "phone_list"){
										flag = false;
										layer.alert("请先上传短信号码列表！");
									}else if(item.para_code == "mem_list"){
										flag = false;
										layer.alert("请先上传集团客户列表！");
									}
									
								}
							}else if(that.options.saveType == "edit"){
								if(item.para_code == "mem_list"){
									if(that.upload_key[item.para_code] == undefined){
										flag = false;
										that.queryIsUpload("mem_list",that.options.cfg_id);
									}else{
										flag = true;
										item.value = {key:that.upload_key[item.para_code]};
									}
								}else if(item.para_code == "phone_list"){
									flag = false;
									if(that.upload_key[item.para_code] == undefined){
										flag = false;
										that.queryIsUpload("phone_list",that.options.cfg_id);
									}else{
										flag = true;
										item.value = {key:that.upload_key[item.para_code]};
									}
								}else if(item.para_code == "cust_list"){
									if(that.upload_key[item.para_code] == undefined){
										flag = false;
										that.queryIsUpload("cust_list",that.options.cfg_id);
									}else{
										flag = true;
										item.value = {key:that.upload_key[item.para_code]};
									}
								}
							}
							
							switch(item.para_code){
							//处理部分特殊的para
							case "cust_id":
								//用户集团编码
								item.para_value = fish._userinfo.cust_code;
								break;
							case "api_code":
								item.para_value = that.templateCache.tpl.api_code;
								break;
							case "mem_wl_all":
								item.para_value = fish._userinfo.cust_code;
								break;
							}
							that.submitParam.result_optValList.push(item);
						});
					}
				}else{
					console.warn("无法识别的opt_code:"+code);
				}
			});
			if(flag==false){
				return flag;
			}
			return true;
		},
		queryIsUpload : function(para_code,cfg_id){
        	var that = this;
			var params = {};
			params.page = 1;
			params.rows = 10;
			params.para_code = para_code;
			params.cfg_id = cfg_id;
			var bol;
			fish.callService("RulesConfigurationController", "queryUploadList", params, function(data){
				if(data.total>0){	
					bol = true; 
					if(para_code=="phone_list"){
						that.uploadSmsAll = data.rows;
						that.querySmsNum = data.total;
					}else if(para_code=="email_list"){
						that.uploadEmailAll = data.rows;
						that.queryEmailNum = data.total;
					}else if(para_code=="cust_list"){
						that.queryCustNum = data.total;
					}else if(para_code=="mem_list"){
						that.queryMemNum = data.total;
					}

					var obj_params = JSON.stringify(that.submitParam);
					fish.callService("RulesConfigurationController","saveRuleCfg",{reParams:obj_params},function(result){
						if(result.res_code == "00000"){
							layer.alert("提交成功！");
							that.popup.close();
							that.parentView.queryWarnRules();
						}else{
							layer.alert("提交失败！");
						}
					});
				}else{
					bol = false;
					if(para_code == "mem_list"){
						layer.alert("请先上传成员列表！");
					}else if(para_code == "phone_list"){
						layer.alert("请先上传短信号码列表！");
					}else if(para_code == "cust_list"){
						layer.alert("请先上传集团客户列表!");
					}
					
					return false;
				}
			});
			return bol;
        },
		submit:function(){
			//最终提交操作
			var that = this;
			if(!that.validateRulesAttr() || !that.validateStep()){
				return;
			}
			
			var obj_params = JSON.stringify(that.submitParam);
			fish.callService("RulesConfigurationController","saveRuleCfg",{reParams:obj_params},function(result){
				if(result.res_code == "00000"){
					layer.alert("提交成功！");
					that.popup.close();
					that.parentView.queryWarnRules();
				}else{
					layer.alert("提交失败！");
				}
			});
		}
	});
	
	return View;
});