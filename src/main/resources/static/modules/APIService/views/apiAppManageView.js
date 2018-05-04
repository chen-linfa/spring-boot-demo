define(['hbs!modules/APIService/templates/apiAppManage.html',
    	"frm/template/party/echarts.min"], function (temp, echarts) {
    var pageView = fish.View.extend({
        template: temp,
        events:{
            "click #add_app":"add_app_popup",
            "click #edit_detail":"edit_app_popup"
        },
        afterRender: function () {
            var that = this;
            that.$('.js-selectmenu').combobox();
            that.$('.js-check').icheck();
            that.initTable();
            that.queryData();
            that.bindEvent();
            that.$pwd_input = that.$('#look_app_secret').popover({
                html:true,
                placement: 'bottom',
                content: that.$('.js-popover-content').html()
            }).on("popover:show",function(){
                if(that.$("#app_secret_star").attr('value')=="on"){
                    layer.tips("此处为密钥明文", "#app_secret_star", {tips: [4, "#3595CC"], tipsMore: true});
                    that.$pwd_input.popover("hide");
                    return;
                }
                var aria_describedby = that.$("#look_app_secret").attr('aria-describedby');
                $(".pwd_submit_btn","#"+aria_describedby).click(function(){
                    var params = {};
                    params.app_id = that._app_id;
                    params.user_pwd = $("#user_pwd","#"+aria_describedby).val();
                    that.displaySecretKey(params);
                });
                $(".pwd_cancle_btn","#"+aria_describedby).click(function(){
                    that.$pwd_input.popover("hide");
                    that.$('.look_app_secret').attr("value","off");
                });
            })
        },
        initTable:function(){
            var that = this;
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "app_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "app_id", title: "AppID", width: "20%"},
                    {data: "app_name", title: "应用名称", width: "20%"},
                    {data: "app_desc", title: "应用描述", width: "20%"},
                    {data: "create_date", title: "创建时间", width: "20%"},
                    {data: "control", title: "操作", width:"20%", formatter: function(data){
                        //操作列的按钮生成
                        var html = '<a href="#" class="margin-right detail_view" name="a1" id="detail_view">详情</a>';
                        html += '<a href="#" class="stop_app" name="stop_app" id="stop_app">停用</a>';
                        return html;
                    }}
                ],//每列的定义
                onLoad: fish.bind(that.bindFormTableEvent,that) //表单加载数据后触发的操作
            };
            that.$form_table= that.$("#form_table").xtable(option);
            //能力列表
            var option1 = {
                pagination: false,
                autoFill: false,
                singleSelect: false,//该表格可以多选
                rowId: "ability_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "ability_code", title: "能力编码", width: "20%"},
                    {data: "ability_name", title: "能力名称", width: "20%"},
                    {data: "ability_desc", title: "能力描述", width: "40%"},
                    {data: "open_status", title: "状态", width: "10%",code:"ABILITY_STATUS_CD",formatter:function(data){
                        if(data=="已开通"){
                            return '<span class="states valid">已开通</span>'
                        }else{
                            return '<span class="states invalid">未开通</span>'
                        }
                    }},
                    {data: "control", title: "操作", width:"10%", formatter: function(data,rows){
                        //操作列的按钮生成
                        var html;
                        if(rows["open_status"]=="1000"){
                            html = '<a href="#" class="setting_ability" name="setting_ability" id="setting_ability">设置</a>';
                        }else{
                            html = '<a href="#" class="open_ability" name="open_ability" id="open_ability">开通</a>'
                        }
                        return html;
                    }}
                ],//每列的定义
                onLoad: fish.bind(that.bindAbilityListTableEvent,that) //表单加载数据后触发的操作
            };
            that.$ability_list_table= that.$("#ability_list_table").xtable(option1);
            that.$('.js-pagination-form').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination-form').pagination("option","rowNum");
                    that.$form_table.xtable("options",{pageSize:rowNum});
                    that.queryData(eventData.page,rowNum);
                },
                create:function(){
                    //默认不加载
                    //that.queryMemberInfo(1);
                }
            });
            that.$('.js-pagination-ability').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination-ability').pagination("option","rowNum");
                    that.$ability_list_table.xtable("options",{pageSize:rowNum});
                    var params = {};
                    params.app_id = that.$('#detail_app_id').html();
                    that.queryApiAbilitySpecs(eventData.page,rowNum,params);
                },
                create:function(){
                    //默认不加载
                    //that.queryMemberInfo(1);
                }
            });
        },
        bindFormTableEvent:function(){
            var that = this;
            //停用操作
            that.$(".stop_app").click(function(e){
                var app_id = $(this).parents("tr").attr("id");
                var params = {};
                params.app_id = app_id;
                layer.confirm("停用当前应用，可能导致对应的应用无法正常接入平台的API能力，是否确定？",{yes:function(index){
                    layer.close(index);
                    fish.callService("AppManageContrller","stopAppByID",params,function(result){
                        if(result.res_code == "00000"){ 
                            if(result.result=='1'){
                                that.queryData();
                            }else{
                                layer.alert("停用失败！");
                            }
                        }
                    });
                }});        
            });
            //打开详情操作
            that.$(".detail_view").click(function(e){
                that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">API服务><a href="#" class="link-text js-back">API应用管理>></a><a class="current">详情</a><a class="fr text-brand-primary js-back" href="#" >返回上一层</a>');
                var app_id = $(this).parents("tr").attr("id");
                that._app_id = app_id;
                var data = that.$form_table.xtable("findData","#"+app_id);
                that.$(".app_list_div").hide();
                that.$(".app_detail_div").show();
                that.$("#vali_pwd").hide();//隐藏输入密码框
                that.$("#detail_app_id").html(data["app_id"]);
                that.$("#detail_app_title").html(data["app_name"]);
                that.$("#app_secret_star").html("*******************************");
                that.$("#app_secret_star").attr("value", "off");//默认
                //这里查询能力列表
                var page=1;
                var rows=10;
                that.queryApiAbilitySpecs(page,rows,data);//传入app_id
                //$("#eidt_app_id").val(data.app_id);//编辑获取app_id
                //详情
                fish.callService("AppManageContrller", "queryAppByAppID", {}, function(result){
                    if(result.res_code == '00000'){
                        //WYUtil.setInputDomain(result.result, $(".app_detail_div"));
                        that.$("#ability_app_id").val(data.app_id);
                        that.$("#setting_ability_app_id").val(data.app_id);
                    }
                });
                 that.$(".js-back").click(function(){
                    that.$('.iot-loaction-bar').html('当前位置：<a href="#" class="link-text">API服务></a><span class="current">API应用管理</span>');
                    that.$(".app_list_div").show();
                    that.$(".app_detail_div").hide();
                });
            });
        },
        bindAbilityListTableEvent:function(){
            var that = this;
            //能力列表开通操作
            that.$('.open_ability').click(function(){
                var ability_id = $(this).parents("tr").attr("id");
                var data = that.$ability_list_table.xtable("findData","#"+ability_id);
                data.app_id = that._app_id;
                //console.log(data);
                fish.popupView({
                    url:"modules/APIService/views/appBuildingPopupView",
                    width:400,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.initData(data);
                    }
                });
            });
            //能力列表设置操作
            that.$('.setting_ability').click(function(){
                var ability_id = $(this).parents("tr").attr("id");
                var data = that.$ability_list_table.xtable("findData","#"+ability_id);
                data.app_id = that._app_id;
                fish.popupView({
                    url:"modules/APIService/views/appSettingPopupView",
                    width:400,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.initData(data);
                    }
                });
            })
        },
        bindEvent:function(){
            var that = this;
            that.$("#reset_app_secret").click(function(e){
                var params={};
                params.app_id=that._app_id;
                that.resetAppSecret(params);
            });        
        },
        //新增应用弹窗
        add_app_popup:function(){
            var that = this;
            fish.popupView({
                url:"modules/APIService/views/addAppPopupView",
                width:400,
                callback:function(popup, view) {
                    view.parentView = that;
                }
            });
        },
        //编辑详情弹窗
        edit_app_popup:function(){
            var that = this;
            var params={};
            params.app_id=that._app_id;
            fish.callService("AppManageContrller", "queryAppByAppID", params, function(result){
                if(result.res_code == '00000'){//查出需要修改的app
                    fish.popupView({
                        url:"modules/APIService/views/editAppPopupView",
                        width:400,
                        callback:function(popup, view) {
                            view.parentView = that;
                            view.initData(result,params.app_id);
                        }
                    });
                }
            });
        },
        //能力列表查询
        queryApiAbilitySpecs:function(page,rows,app_id){
            var that = this;                      
            var params = {};
            params.page = page==null? 1 : page;
            params.rows = rows==null? 10 : rows;
            params.app_id = app_id.app_id;
            fish.callService("AppManageContrller", "queryApiAbilitySpecs", params, function(result){
                var data = result.result.rows
                that.$ability_list_table.xtable("loadData",data);
                that.$('.js-pagination-ability').pagination("update",{records:result.result.total,start:result.result.pageNumber});
                that.$(".page-total-num-ability").text(result.result.pageCount);
                that.$(".page-data-count-ability").text(result.result.total);
            });         
        },
        queryData:function(page,rows,params){
            var that = this;
            if (!params)  params = {};
            params.page = page ? page : 1;
            params.rows = rows ? rows : 10;
            fish.callService("AppManageContrller", "queryAllApp", params, function(result){
                var data = result.result.rows;
                //console.log(data);
                that.$form_table.xtable("loadData",data);
                // that.bindFormTableEvent();
                that.$('.js-pagination-form').pagination("update",{records:result.result.total,start:result.result.pageNumber});
                that.$(".page-total-num-form").text(result.result.pageCount);
                that.$(".page-data-count-form").text(result.result.total);
            })
        },
        //重新设置密钥
        resetAppSecret:function(params){
            var that = this;
            fish.callService("AppManageContrller", "resetAppSecret", params, function(result){
                if(result.res_code == '00000'){
                    layer.alert("密钥重新设置成功！");
                    //layer.tips("密钥重新设置成功！", "#app_secret_star", {tips: [4, "#3595CC"], tipsMore: true});
                    that.$("#app_secret_star").html("*******************************");
                    that.$("#app_secret_star").attr("value", "off");//未显示标记
                }else{
                    layer.alert(result.res_message);
                    //layer.tips(result.res_message, "#app_secret_star", {tips: [4, "#3595CC"], tipsMore: true});
                }
            });         
        },
        //查看明文密钥
        displaySecretKey:function(params){
            var that = this;
            fish.callService("AppManageContrller", "displaySecretKey", params, function(result){
                if(result.res_code == '00000'){
                    $("#app_secret_star").text(result.result);                  
                    $("#app_secret_star").attr("value", "on");//已经显示标记
                    $("#user_pwd").val("");
                    that.$pwd_input.popover("hide");
                }else{
                    layer.tips(result.res_message, "#user_pwd", {tips: [4, "#3595CC"], tipsMore: true});
                }
            });         
        },
    });
    return pageView;
});