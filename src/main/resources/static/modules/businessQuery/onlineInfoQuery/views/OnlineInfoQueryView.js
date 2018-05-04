define(['hbs!modules/businessQuery/onlineInfoQuery/templates/onlineInfoQuery.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "ip_addr",//指定主键字段
                onSelectClass: "selected",
                columns: [
                    {data: "gprs_status", title: "GPRS在线状态", width: "20%",
                    	formatter:function(data){
                        	if(data==""||data==null||data==undefined){
                        		return "";
                        	}else{
                        		return that.status[data];
                        	}
                          
                     }},
                    {data: "ip_addrs", title: "用户IP地址", width: "16%"},
                    {data: "apn", title: "用户接入的 APN", width: "16%"},
                    {data: "rat", title: "用户接入的 RAT", width: "16%",formatter:function(data){
                    	if(data==""||data==null||data==undefined){
                    		return "";
                    	}else{
                    		return that.ratStatus[data];
                    	}
                    }},
                    {data: "user_status", title: "实时号码状态", width: "16%",formatter:function(data){
                        if(data==""||data==null||data==undefined){
                    		return "";
                    	}else{
                    		 return that.numStatus[data];
                    	}
                    }},
                    {data: "on_off_status", title: "开关机状态", width:"16%", formatter: function(data){
                    	 if(data==""||data==null||data==undefined){
                     		return "";
                     	}else{
                     		return that.onAndOffstatus[data];
                     	}
                    }}
                ]
            };
            that.$("#onlineTable").xtable(option);
            that.$("#search_btn").click(function(e){
            that.initFormTable();
            });
		},
        initFormTable : function(page, rows){
            var me = this;

            var msisdn = $.trim(me.$('#search_input').val());//去除输入框中的空格
            if(msisdn == '请输入物联网卡号'){
                msisdn = '';
            }
            
            if(msisdn == ''){
                layer.alert('请输入物联网卡号');
                return ;
            }
            
            if(!/^[1-9][0-9]*$/.test(msisdn)){
                layer.alert("卡号格式错误");
                return;
            }
            
            var param = {};
            param.search_online_content = msisdn;
            fish.callService("CustMemController", "queryOnlineInfo", param, function(data){
                if(data.res_code=="00000"){         
                    me.initTableData(data.result);
                }else{
                    //Utils.alert(data.res_message);//不是物联卡号的弹出提示
                    me.$("#onlineTable").xtable("loadData",[]);
                    var error_tr = '<tr><td colspan="99" align="center"><font color="red">'+data.res_message+'</font></td></tr>';/*无数据，请重新查询！*/
                    me.$("#onlineTable").append(error_tr);
                }
            });
        },
        initTableData : function(data){
            var me = this;
            if(data){   
                    var memberInfo = data.userInfoSearch;
                    var info = [];
                    info.push(memberInfo);
                    me.$("#onlineTable").xtable("loadData",info);
            }else{
                me.$("#onlineTable").xtable("loadData",[]);
                var error_tr = '<tr><td colspan="99" align="center"><font color="red">无数据，请重新查询！</font></td></tr>';
                me.$("#onlineTable").append(error_tr);
            }
            
        },
        //gprs状态
        status : {
            "00":"离线",
            "01":"在线",
        },
        
        //rat
        ratStatus : {
            "1":"3G",
            "2":"2G",
            "6":"4G",
        },
        
        //实时号码状态
        numStatus : {
            "00":"正常",
            "01":"单向停机",
            "02":"停机",
            "03":"预销号",
            "04":"销号",
            "05":"过户",
            "06":"休眠",
            "07":"待激",
            "99":"号码不存在"
        },
        
        //开关机状态
        onAndOffstatus : {
            "0":"关机",
            "1":"开机",
        }
	});
    return pageView;
});
