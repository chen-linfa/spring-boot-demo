define(['hbs!modules/clientSelfService/messageSending/templates/message-sending.html',
        'frm/template/party/echarts.min',
        'frm/fish-desktop/third-party/icheck/fish.icheck'],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        ifadd : true,
        editmode : true,
        sendmode : "",
        send_list : [],
        cust_msisdn_nums:[],//该客户下面的msisdn卡
        basic_info_enum : {
            "sendmode" : {"default" : "0", "batch" : "1","group":"2"},//发送选择：默认、批量、分组
            "sendmold" : {"actual":"0","regular":"1"},//发送方式：“0”：“actual”、“1”：“regular”-- 实时和定时
            "msg_fmt" : {"ASCII":"0","UCS2":"8"},//
        },
        afterRender: function(){
            var that = this;

            that.loadSmsGatewayPort();

            that.$('.js-date').datetimepicker();
            that.$('#date_pick').attr("disabled","true");

            that.$('.js-check').icheck();
            that.$('input[name="sendingType"]').icheck('enable');
            that.$('input[name="encodingType"]').icheck('enable');
            that.$(".just_time").icheck('check');
            that.$(".shortmsg").icheck('check');     
            that.$(".uds2").icheck('check');            

            that.$('#js-selectmenu').combobox();


            that.$('.select').click( function(){
                that.$("ul[name='send_show']").find('li').remove();//清空发送队列
                that.$("[name='send_msisdn_tip']").html(""); //清空消息提醒
                $(this).siblings().find('.active').removeClass("active");
                $(this).find("div").addClass("active");
                if($(this).children('div').hasClass('msb-item-gd')){  //群发
                    that.$('#addPhone').show();
                    that.$("#accept_num").removeAttr("disabled");
                    that.$("#accept_num").val("");
                    that.$('#bt_upload').hide();
                    that.$('#download').hide();
                    that.$('#select_group').hide();
                }else if($(this).children('div').hasClass('msb-item-batch')){ //批量
                    that.$("#accept_num").attr("disabled","true");
                    that.$("#accept_num").val("");
                    that.$('#addPhone').hide();
                    that.$('#bt_upload').show();
                    that.$('#download').show();
                    that.$('#select_group').hide();
                }else{                                                 //分组
                    that.$("#accept_num").attr("disabled","true");
                    that.$("#accept_num").val("");
                    that.$('#addPhone').hide();
                    that.$('#bt_upload').hide();
                    that.$('#download').hide();
                    that.$('#select_group').show();
                }
            });
            that.$('.js-check').click(function(){
                if(that.$(".just_time").icheck('isChecked')){
                    that.$('#date_pick').attr("disabled","true");
                }else{
                    that.$('#date_pick').removeAttr("disabled");
                }
            });
            that.initUploadEvent();
            //过滤非法的卡号输入值
            that.$('#accept_num').bind({
                keyup:function(){
                    this.value=this.value.replace(/\D/g,'');
                }
            });
            //下载批量发送模板
            that.$('#download').click(function(){
                window.open("servlet/downloadExcel?type=mould&mould=msg");
            });
            //分组选择

            that.$('#select_group').click(function(){
                fish.popupView({
                    url : "modules/clientSelfService/messageSending/views/SelectGroupPopView",
                    width : 400,
                    height : 405,
                    //viewOption:{mem_user_id:mem_user_id},
                    callback:function(popup,view){
                        view.parentView = that;
                    }
                });;
            });
            //添加号码
            that.$('#addPhone').click(function(){
                that.$("[name='send_msisdn_tip']").html("");
                if(that.$(".phone-num-list").find("li").length>=20){
                    layer.alert("群发短信限制数目20个!");
                    return;
                }
                var num = $("#accept_num").val();
                if($.trim(num)==""){
                    layer.alert("请先输入要发送的号码");
                    return;
                }
                var patt=new RegExp(/^[0-9]*$/);
                var r = patt.test(num);
                if(!r){
                    that.$("[name='send_msisdn_tip']").html("  *号码不符合格式");
                    return false;
                }
                if(num.length!=11&&num.length!=13){
                    that.$("[name='send_msisdn_tip']").html("  *请输入11位或13位的物联卡号码");
                    return false;
                }
                //是否是集团号码
                var params = {};
                var result = false;
                params.number = num;
                fish.callService("SmsController","smsIsJTNumber",params,function(data){
                    if(!data.result) {
                        $("[name='send_msisdn_tip']").html("  *目前仅支持集团物联卡号码,请重新输入!");
                    }
                    else {
                        var param = {};
                        param.msisdn = num;
                        var r1 = false;
                        //console.log("ok1",num);
                        fish.callService("SmsController","qryCustMsisdn",param,function(data){
                            if(data && data.res_code == "00000"){
                                var msisdn_count = data.result;
                                var numm=new Number(msisdn_count);
                                if(numm>0){
                                    r1 = true;
                                }else{
                                    r1 = false;
                                }
                            }
                            if(r1<=0){
                                //测试卡号跳过校验
                                if(num=="1064853187600"){
                                    
                                }else{
                                   layer.alert("您没有该成员卡号的操作权限，请重新输入!");
                                    return ;
                                }
                            }
                            //console.log("oke",num);
                            that.$(".phone-num-list").append('<li class="list-item"><span>'+num+'</span><i class="ico-close2 num-del-btn"></i></li>');
                            that.initDelBtuEvent();
                            that.$("#accept_num").val("");
                        });
                    }
                });
            });
            that.$('#ok').click(function(){
                that.sendOut();
            });

            that.$('#reset').unbind('click').bind('click',function(){
                that.clearData();
            });
		},

//         loadSmsGatewayPort : function(){  //发送端口点击查询事件
//             var params = {};
//             fish.callService("SmsController","loadSmsGatewayPort",params,function(data){
//                 if(data && data.res_code == "00000"){
//                     var list = data.result;
//                     for(var i=0;i<list.length;i++){
//                         $("#selectmenu").append("<li class='inp-slt-item' val='"+list[i].gateway_id+"'>"+list[i].gateway_port+"</li>");
// //                      $("#gateway_port_ul").append("<li class='inp-slt-item' val='"+list[i].gateway_port+"'>"+list[i].gateway_port+"</li>");
//                     }
//                     dropDown.initSelectDropDown($("#send_detail"));
//                     if($("#selectmenu").find("li").length==1){
//                         $("#selectmenu").find("li").eq(0).trigger("click");
//                     }
//                 }
//             });
//         },
        initUploadEvent:function(){
            var that = this;
            //上传号码文件
            that.$('#upload').on('change',function(){
                var fileName = that.$("#upload").val();
                that.$("#upload").siblings("input[type='hidden']").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        that.$("#upload").val("");
                        return;
                    }
                }
                
                var params_str = {};
                params_str.upload_type = 'msg_send';
                
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                $.ajaxFileUpload({
                    url : "UploadController/uploadExcel.do",
                    secureuri : false,
                    fileElementId : "upload",
                    data: params, 
                    dataType : 'json',
                    success : function(data, status) {
                        layer.closeAll();
                        that.$("#upload").val("");
                        if(data.res_code=="00000"){
                            var info = data.result;
                            var exl_message = info.exl_message;
                            layer.alert(exl_message, function(index){
                                that.send_list = info.phone_list;
                                that.$("#accept_num").val("上传成功!");
                                layer.close(index);
                            });
                        }else{
                            layer.alert(data.res_message);
                        }
                    },
                    error : function(data, status, e) {
                        layer.alert("操作失败");
                        that.initUploadEvent();
                        that.$("#upload").val("");
                        layer.closeAll();
                    }
                });
                layer.load();
                that.initUploadEvent();
            });
        },
        //是否符合权限的卡号
        isAuthMsiSdnNum : function(msisdn_num){
            var me = this;
            var params = {};
            params.msisdn = msisdn_num;
            var r = false;
            fish.callService("SmsController","qryCustMsisdn",params,function(data){
                if(data && data.res_code == "00000"){
                    var msisdn_count = data.result;
                    var num=new Number(msisdn_count);
                    if(num>0){
                        r = true;
                        return r;
                    }else{
                        r = false;
                        return r;
                    }
                }
            });
            return r;
        },
        //是否是集团号码
        isJtNumber : function(num){
            
            var params = {};
            var result = false;
            params.number = num;
            fish.callService("SmsController","smsIsJTNumber",params,function(data){
                if(data.result) result = true;
            });
            return result;
        },
        initDelBtuEvent : function(){
            this.$(".num-del-btn").click(function(){
                $(this).parent().remove();
                //console.log('delete');
            });
        },
        sendOut:function(){
            var that = this;
            if(that.$("#textarea_content").val().trim()==""){
                layer.alert("请输入发送内容!");
                return;
            }
            if(that.getByteLen(that.$("#textarea_content").val().trim())>960){
                layer.alert("短信发送内容限制480个汉字或960字符，请重新输入!");
                return;
            }
            //console.log($(".gateway_id").find("option:selected").text());
            if(that.$("input[name=gate_way_list]").combobox("value")==''){
                layer.alert("请选择发送端口!");
                return;
            }
            if(!that.validateMsgFmt()) return;
            var active_ = that.$('.active');
            if(active_.hasClass('msb-item-gd')){            //群发
                //console.log('gd');
                that.sendSmsDefault();
            }else if(active_.hasClass('msb-item-batch')){   //批量
                // console.log('batch');
                that.sendSmsBatch();
            }else{                                          //分组
                // console.log('group');
                that.sendSmsGroup();
            }
            that.$("#ok").removeAttr("disabled");
            that.$("#ok").html("确定");
        },
        //群发短信
        sendSmsDefault : function(){
            var me = this;
            var phone_arr = new Array();
            me.$(".phone-num-list").find("li span").each(function(index,ele){
                phone_arr.push($(ele).html());
            });
            if(phone_arr.length==0){
                layer.alert("请输入发送号码!");
                return;
            }
            var sms_content = me.$("#textarea_content").val();
            var params = {};
            
            params.phone_arr = phone_arr;
            params.sms_content = escape(sms_content);
            params.send_mode = me.basic_info_enum.sendmode["default"];
            params.message_type = "2";
            params.message_category = $('.shortmsg').icheck('isChecked') ? $('.shortmsg').val(): $('.longmsg').val();
            if(me.$(".just_time").icheck('isChecked')){//实时
                params.send_type = me.basic_info_enum.sendmold["actual"];
            }else{
                if(me.$("#date_pick").val()==""){
                    layer.alert("请选择发送时间!");
                    return;
                }
                var datNow = new Date();
                var val = me.$("#date_pick").val();
                val = val.replace(/-/g,"/");
                dateValue = new Date(val); // 要自己修改成合适的赋值
                if(dateValue-datNow<600000){
                    layer.alert("发送时间须限定为当前10分钟后，请重新选择时间！");
                    return;
                }
                params.send_type = me.basic_info_enum.sendmold["regular"];
                params.send_time = me.$("#date_pick").val();
            }
            //params.gateway_id = me.$(".gateway_id").val();
            //params.gateway_port = me.$(".gateway_id").find("option:selected").text();
            params.gateway_id = me.$("input[name=gate_way_list]").combobox("value");
            params.gateway_port = me.$("input[name=gate_way_list]").combobox("text");
            params.msg_fmt = me.$('.uds2').icheck('isChecked') ? me.$('.uds2').val(): me.$('.ascii').val();
            //console.log("msg_fmt",params);
            me.$("#ok").attr("disabled","true");
            me.$("#ok").html("提交中");
            
            fish.callService("SmsController","smsSend",params,function(result){
                $("#btn_edit").removeClass("disabled");
                $("#btn_edit").html("保 存");
                if(result && result.res_code == "00000"){
                    layer.alert("操作成功，短信已保存至发送队列，等待发送！");
                    me.clearData();
                }else{
                    layer.alert(result.res_message);
                }
            });
        },
        //批量发送
        sendSmsBatch:function(){
            var me = this;
            if(me.$("#accept_num").val()==""){
                layer.alert("请先上传短信号码附件！");
                return;
            }
            var sms_content = me.$("#textarea_content").val();
            var params = {};
            params.phone_arr = me.send_list;
            params.sms_content = escape(sms_content);
            params.send_mode = me.basic_info_enum.sendmode["batch"];
            params.message_type = "2";
            params.message_category = $('.shortmsg').icheck('isChecked') ? $('.shortmsg').val(): $('.longmsg').val();

            if(me.$(".just_time").icheck('isChecked')){//实时
                params.send_type = me.basic_info_enum.sendmold["actual"];
            }else{
                if(me.$("#date_pick").val()==""){
                    layer.alert("请选择发送时间!");
                    return;
                }
                var datNow = new Date();
                var val = me.$("#date_pick").val();
                val = val.replace(/-/g,"/");
                dateValue = new Date(val); // 要自己修改成合适的赋值
                if(dateValue-datNow<600000){
                    layer.alert("发送时间须限定为当前10分钟后，请重新选择时间！");
                    return;
                }
                params.send_type = me.basic_info_enum.sendmold["regular"];
                params.send_time = me.$("#date_pick").val();
            }
            //params.gateway_id = me.$(".gateway_id").val();
            //params.gateway_port = me.$(".gateway_id").find("option:selected").text();
            params.gateway_id = me.$("input[name=gate_way_list]").combobox("value");
            params.gateway_port = me.$("input[name=gate_way_list]").combobox("text");
            params.msg_fmt = me.$('.uds2').icheck('isChecked') ? me.$('.uds2').val(): me.$('.ascii').val();

            me.$("#confirm_send").attr("disabled","true");
            me.$("#confirm_send").html("提交中");
            
            fish.callService("SmsController","smsSend",params,function(result){
                me.$("#btn_edit").removeClass("disabled");
                me.$("#btn_edit").html("保 存");
                if(result && result.res_code == "00000"){
                    layer.alert("操作成功，短信已保存至发送队列，等待发送！");
                    me.clearData();
                }else{
                    layer.alert(result.res_message);
                }
            });
        },
        sendSmsGroup : function(){
            var me = this;
            if(me.$("ul[name='send_show']").find("li").length==0){
                layer.alert("请先选择分组！");
                return;
            }
            var arr = new Array();
            me.$("ul[name='send_show']").find("li").each(function(index,ele){
                arr.push(me.$(ele).attr("group_id"));
                console.log(me.$(ele).attr("group_id"));
            });
            var sms_content = me.$("#textarea_content").val();
            var params = {};
            params.phone_arr = arr;
            params.sms_content = escape(sms_content);
            params.send_mode = me.basic_info_enum.sendmode["group"];
            params.message_type = "2";
            params.message_category = $('.shortmsg').icheck('isChecked') ? $('.shortmsg').val(): $('.longmsg').val();
            params.msg_fmt = me.$('.uds2').icheck('isChecked') ? me.$('.uds2').val(): me.$('.ascii').val();
            
            if(me.$(".just_time").icheck('isChecked')){//实时
                params.send_type = me.basic_info_enum.sendmold["actual"];
            }else{
                console.log(me.$("#date_pick").val());
                if(me.$("#date_pick").val()==""){
                    layer.alert("请选择发送时间!");
                    return;
                }
                var datNow = new Date();
                var val = me.$("#date_pick").val();
                val = val.replace(/-/g,"/");
                
                dateValue = new Date(val); // 要自己修改成合适的赋值
                if(dateValue-datNow<600000){
                    layer.alert("发送时间须限定为当前10分钟后，请重新选择时间！");
                    return;
                }
                params.send_type = me.basic_info_enum.sendmold["regular"];
                params.send_time = me.$("#date_pick").val();
            }
            //params.gateway_id = me.$("#gateway_id").val();
            //params.gateway_port = me.$(".gateway_id").find("option:selected").text();
            params.gateway_id = me.$("input[name=gate_way_list]").combobox("value");
            params.gateway_port = me.$("input[name=gate_way_list]").combobox("text");
            me.$("#ok").attr("disabled","true");
            me.$("#ok").html("提交中");
            
            fish.callService("SmsController","smsSend",params,function(result){
                me.$("#btn_edit").removeClass("disabled");
                me.$("#btn_edit").html("保 存");
                if(result && result.res_code == "00000"){
                    layer.alert("操作成功，短信已保存至发送队列，等待发送！");
                    me.clearData();
                }else{
                    layer.alert(result.res_message);
                }
            });
        },
        //加载短信接入码
        loadSmsGatewayPort : function(){
            var that = this;
            var params = {};
            //Invoker.sync("SmsController","loadSmsGatewayPort",params,function(data){
            fish.callService("SmsController","loadSmsGatewayPort",params,function(data){
                if(data && data.res_code == "00000"){
                    var list = data.result;
                    that.$("input[name=gate_way_list]").combobox({
		            	placeholder:"选择网关",
		            	dataSource:data.result,
		            	dataTextField:"gateway_port",
		            	dataValueField:"gateway_id"
		            });
                    that.$("input[name=gate_way_list]").combobox("value",list[0].gateway_id);
                }
            });
        },

        //发送成功后清除页面上的内容
        clearData : function(){
            this.$(".phone-num-list").find("li").remove();
            this.$("#accept_num").val("");
            this.$("#textarea_content").val("");
            this.$("td[name='send_show']").find("ul li").remove();
            this.$('#char_tip').html("");
        },
        //获取val的长度
        getByteLen : function(val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                 var a = val.charAt(i);
                 if (a.match(/[^\x00-\xff]/ig) != null) 
                {
                    len += 2;
                }
                else
                {
                    len += 1;
                }
            }
            return len;
        },
        validateMsgFmt : function(){
            var that = this;
            if(that.$(".ascii").icheck("isChecked")){
                var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                if(reg.test(that.$("#textarea_content").val())){
                    layer.alert("ASCII编码不支持带有中文字符的短信内容，请您重新输入！");
                    return false;
                }else{
                    return true;
                }
            }
            return true;
        }
	});
    return pageView;
});
