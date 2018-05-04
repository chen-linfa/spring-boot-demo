define(['hbs!../templates/usg_current_query.html',
        "frm/portal/portal"], function (temp, echarts) {
            var pageView = fish.View.extend({
            	el:false,
                template: temp,
                afterRender: function () {
                    var that = this;
                    that.init();
                },
                init : function() {
                	var that = this;
        			var url = "https://openac.sh.chinamobile.com/open/access/oauth/authorizeVerify.html?"+
        					"appCode=A0007777&secret=Qxn+ApJP8ky6JdD30yW2PtqbPeA+6jsv&authorizeCode="+Utils.getUrlParams("code");
        			$.ajax({
        				url : url,
        				dataType: "jsonp",
        				data:"{}",
        				type: "get",
        				async: false,
        				jsonp: "jsonpCallback", //服务端用于接收callback调用的function名的参数     
                   		jsonpCallback: "callback", //callback的function名称,服务端会把名称和data一起传递回来     
            			success : function(data) {
	        				if(data.result=='false'){
	        					layer.alert("获取号码异常");
	        					return;
	        				}
	        				if(data.userPhone==''||data.userPhone==null){
	        					layer.alert("未获取到号码！");
	        					return;
	        				}
	        				that.loadCustInfo(data.userPhone);
	            		},
        				error: function (XMLHttpRequest, textStatus, errorThrown) {
        					layer.alert(XMLHttpRequest.responseText);
            			}
            		});	
                },
                loadCustInfo:function(msisdn){
                	//集团详情
					var params = {};
					params.msisdn = msisdn;
					fish.callService("CustMemController", "queryCurrentBusiUsage", params, function(result){
						if(result.res_code == "00000"){
							WYUtil.setInputDomain(result.result, $('#cust_detail_container'));
							$('#cust_detail_container').show();
						} else{
							layer.alert(result.res_message);
						}
					});
                },
            });
            return pageView;
        });
