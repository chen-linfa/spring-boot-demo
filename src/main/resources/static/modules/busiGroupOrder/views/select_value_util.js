var select_value_util = {
        replaceAttrValue : function($jqDom,obj_value){
        	var form_value = obj_value;
          	if(form_value["SMSTYPE"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='SMSTYPE']");
				form_value.SMSTYPE = type2.combobox("text");
			}
			//debugger;
			if(form_value["是否可共享"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='是否可共享']");
				//alert(type2.combobox("text"));
				form_value.是否可共享 = type2.combobox("text");
			}
			if(form_value["附加套餐"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='附加套餐']");
				//alert(type2.combobox("text"));
				form_value.附加套餐 = type2.combobox("text");
			}
			if(form_value["企业通话阀值的计费范围"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业通话阀值的计费范围']");
				//alert(type2.combobox("text"));
				form_value.企业通话阀值的计费范围 = type2.combobox("text");
			}
			if(form_value["企业客户成员自动前转"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业客户成员自动前转']");
				//alert(type2.combobox("text"));
				form_value.企业客户成员自动前转 = type2.combobox("text");
			}
			if(form_value["企业被叫闭锁"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业被叫闭锁']");
				//alert(type2.combobox("text"));
				form_value.企业被叫闭锁 = type2.combobox("text");
			}
			if(form_value["企业白名单操作类型"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业白名单操作类型']");
				//alert(type2.combobox("text"));
				form_value.企业白名单操作类型 = type2.combobox("text");
			}
			if(form_value["企业客户成员级别操作类型"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业客户成员级别操作类型']");
				//alert(type2.combobox("text"));
				form_value.企业客户成员级别操作类型 = type2.combobox("text");
			}
			if(form_value["企业黑名单操作类型"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业黑名单操作类型']");
				//alert(type2.combobox("text"));
				form_value.企业黑名单操作类型 = type2.combobox("text");
			}
			if(form_value["用户类别"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='用户类别']");
				//alert(type2.combobox("text"));
				form_value.用户类别 = type2.combobox("text");
			}
			if(form_value["企业客户成员国际长途权限"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业客户成员国际长途权限']");
				//alert(type2.combobox("text"));
				form_value.企业客户成员国际长途权限 = type2.combobox("text");
			}
			if(form_value["企业客户成员国际漫游权限"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业客户成员国际漫游权限']");
				//alert(type2.combobox("text"));
				form_value.企业客户成员国际漫游权限 = type2.combobox("text");
			}
			if(form_value["企业客户成员分钟数使用完毕后是否支持自动前转"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='企业客户成员分钟数使用完毕后是否支持自动前转']");
				//alert(type2.combobox("text"));
				form_value.企业客户成员分钟数使用完毕后是否支持自动前转 = type2.combobox("text");
			}
			if(form_value["被叫闭锁功能标识"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='被叫闭锁功能标识']");
				//alert(type2.combobox("text"));
				form_value.被叫闭锁功能标识 = type2.combobox("text");
			}
			if(form_value["来电显示状态"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='来电显示状态']");
				//alert(type2.combobox("text"));
				form_value.来电显示状态 = type2.combobox("text");
			}
			if(form_value["OCSI操作类型"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='OCSI操作类型']");
				//alert(type2.combobox("text"));
				form_value.OCSI操作类型 = type2.combobox("text");
			}
			if(form_value["国际漫游状态"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='国际漫游状态']");
				//alert(type2.combobox("text"));
				form_value.国际漫游状态 = type2.combobox("text");
			}
//			if(form_value["OCSI模板号"] != undefined){
//				var type2 = $jqDom.find("input[input_type='2'][name='OCSI模板号']");
//				//alert(type2.combobox("text"));
//				form_value.OCSI模板号 = type2.combobox("text");
//			}
			if(form_value["TCSI操作类型"] != undefined){
				var type2 = $jqDom.find("input[input_type='2'][name='TCSI操作类型']");
				//alert(type2.combobox("text"));
				form_value.TCSI操作类型 = type2.combobox("text");
			}
          	return form_value;
          }
}