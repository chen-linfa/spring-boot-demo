define(['hbs!modules/memberManage/oneKeyDiagnose/templates/onekeydiagnose.html'],function(temp,echarts) {
	var pageView = fish.View.extend({
		template: temp,
		card_brand_type :'',
		msisdn : '',
		apn : '',
		card_status : '',
		initialize : function(){
        	var that = this;
        	that.msisdn = this.options["keyname"];
        },
		afterRender: function(){
			var that = this;
			
			that.$("#btn_diagnose").click(function(){
				var mem_search_content = $.trim($("#search_input").val());
				if (mem_search_content != '') {
					if (!/^[1-9][0-9]*$/.test(mem_search_content)) {
						layer.alert("卡号格式错误");
						return;
					}
				}
				if (mem_search_content == "") {
					layer.alert("请输入卡号");
					return;
				}
				that.$("#msisdn").text("MSISDN(卡号)："+mem_search_content);
				that.queryDiagnosisInfo(mem_search_content);
			});
			
			that.$("#btn_retry").click(function(){
				if(that.$("#msisdn").text().substring(11)==""||that.$("#msisdn").text().substring(11)==null){
					layer.alert("请您先进行查询！再重新诊断");
				}else{
					that.queryDiagnosisInfo(that.$("#msisdn").text().substring(11));
				}
				
			})
			
			that.$("#btn_message").click(function(){
				var mem_search_content = $.trim($("#search_input").val());
				if (mem_search_content != '') {
					if (!/^[1-9][0-9]*$/.test(mem_search_content)) {
						layer.alert("卡号格式错误");
						return;
					}
				}
				if (mem_search_content == "") {
					layer.alert("请输入卡号");
					return;
				}
				that.messageTest(mem_search_content);
			});
		},
		queryDiagnosisInfo:function(search_content){
			var that = this;
			//故障诊断
			var params = {
					mem_user_id : search_content
			};
			fish.callService("DiagnosisController","queryDiagnosis",params,function(data) {
				console.log(data.result);
				/*if(data.res_code == "00000"){*/
					that.$("#showView").show();
					that.apn = data.result.apn;
					that.card_status = data.result.card_status;
					if(data.result.flowUsed!=null&&data.result.flowUsed!=""){
						data.result.flowUsed = fish.utils.unitTranslate2(data.result.flowUsed);
					}
					that.$("#info_left").find("td[name]").each(function(){
						$(this).html("");
						var name = $(this).attr("name");
						$(this).html(data.result[name]);
					});
					that.$("#info_right").find("td[name]").each(function(){
						$(this).html("");
						var name = $(this).attr("name");
						$(this).html(data.result[name]);
					});
					if(data.result.card_status!="正常"){
						that.$("[name=isNomal_1]").removeClass("ico-sim");
						that.$("[name=isNomal_1]").addClass("ico-sim-warn");
						that.$("#info_right").find("[name=card_status]").addClass("text-danger");
					}else{
						that.$("[name=isNomal_1]").addClass("ico-sim");
						that.$("[name=isNomal_1]").removeClass("ico-sim-warn");
						that.$("#info_right").find("[name=card_status]").removeClass("text-danger");
					}
					
					if(data.result.gprs_online_status!="在线"){
						that.$("[name=isNomal_2]").removeClass("ico-connect");
						that.$("[name=isNomal_2]").addClass("ico-connect-warn");
						that.$("#info_right").find("[name=gprs_online_status]").addClass("text-danger");
					}else{
						that.$("[name=isNomal_2]").addClass("ico-connect");
						that.$("[name=isNomal_2]").removeClass("ico-connect-warn");
						that.$("#info_right").find("[name=gprs_online_status]").removeClass("text-danger");
					}
					
					if(data.result.isOverFlow=="是"){
						that.$("[name=isNomal_3]").removeClass("ico-sim");
						that.$("[name=isNomal_3]").addClass("ico-sim-warn");
						that.$("#info_right").find("[name=isOverFlow]").addClass("text-danger");
						that.$("#info_right").find("[name=isOverFlow]").text("流量使用超过阈值");
					}else{
						that.$("[name=isNomal_3]").addClass("ico-sim");
						that.$("[name=isNomal_3]").removeClass("ico-sim-warn");
						that.$("#info_right").find("[name=isOverFlow]").removeClass("text-danger");
					}
					fish.callService("CustMemController", "queryCustMemberDetail", params, function(reply){
						var result = reply.result;
						console.log(result);
						if(result!=null){
							fish.utils.getAttrCode(["CARD_BRAND_TYPE","CARD_STATUS"],function(code){
								if(null!=result.used_gprs&&""!=result.used_gprs){
									result.used_gprs = fish.utils.unitTranslate2(result.used_gprs);
								}
								result.card_brand_type = code["CARD_BRAND_TYPE"][result.card_brand_type];
								result.card_status = code["CARD_STATUS"][result.card_status];
								result.is_orderflows = "否";
								that.$("#bottom_info").find("td[name]").each(function(){
									var key = $(this).attr("name");
									
									if(key == "apn" || key == "card_status"){
										if(key=="card_status"){
											$(this).text(that.card_status);
										}else{
											$(this).text(that.apn);
										}
									}else{
										if(!result[key]){
											result[key] = "";
										}
										$(this).text(result[key]);
									}
								});
							});
						}else{
							that.$("#bottom_info").find("td[name]").each(function(){
								var key = $(this).attr("name");
								$(this).text("");
							});
						}
							
					});
				/*}else{
					layer.alert(data.res_message);
				}*/
			});
		},
		messageTest:function(mem_search_content){
			//通讯测试
			var that = this;
			var params = {};
			params.mem_search_content = mem_search_content;
			params.card_brand_type = that.card_brand_type;
			fish.callService("DiagnosisController", "queryMessageInfo", params, function(data){
				var result = data.result;
				console.log(data);
				if(data.res_code == "00000"){
					layer.alert("短信发送成功！");
				}else if(data.res_code == "40000"){
					layer.alert("短信发送失败！");
				}else{
					layer.alert(data.res_message);
				}

			});
		},
		initData : function(param){
        	var that = this;
        	that.$("#search_input").val(param);
        	that.$("#btn_diagnose").trigger("click");
        }
	});
    return pageView;
});
