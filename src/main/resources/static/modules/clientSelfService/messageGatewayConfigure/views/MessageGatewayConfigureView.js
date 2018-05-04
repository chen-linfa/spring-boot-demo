define(['hbs!../templates/message-gateway-configure.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.$('.js-date').datetimepicker();
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "gateway_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "gateway_port", title: "短信接入码", width: "20%"},
                    {data: "company_code", title: "企业代码", width: "20%"},
                    {data: "login_secret", title: "用户登录密码", width: "20%", formatter:function(data){
                        return "******"
                    }},
                    {data: "server_code", title: "服务代码", width: "20%"},
                    {data: "operation", title: "操作", width:"20%", formatter: function(data){
                        //操作列的按钮生成
                        var html = '<a href="javascript:void(0);" class="js-btn_detail">详情</a>';
                        html += '&nbsp&nbsp<a href="javascript:void(0);" class="js-btn_delete">删除</a>';
                        return html;
                    }}
                ],//每列的定义
                onLoad: fish.bind(that.bindTableButton,that) //表单加载数据后触发的操作
            };
            this.$("#myTable").xtable(option);
            this.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.doQuery(eventData.page,rowNum);
                },
                create:function(){
                    //默认不加载
                    that.doQuery(1);
                }
            });
            this.$('#query').click(function(){
                that.doQuery();
            });
            this.$('#add').click(function(){
                that.add_popup();
            });
		},
        doQuery : function( page, rows){
            var that = this;
            var param = {};
            var num = 1;
            var row = 10;
            var search_content = that.$("#search_input").val();
            param.page = page==null? num : page;
            param.rows = rows==null? row : rows;
            param.search_content = search_content;
            fish.callService("SmsController", "queryGatewayList", param, function(result){
                console.log(result.rows);
                that.$("#myTable").xtable("loadData",result.rows);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
            });
        },
        bindTableButton:function(){
            var that = this;
            that.$(".js-btn_delete").on("click",function(){
                var $tr = $(this).parents("tr");
                var id = $tr.attr('id');
                fish.popupView({
                    url:"modules/clientSelfService/messageGatewayConfigure/views/DeletePopupView",
                    width:600,
                    callback:function(popup, view) {
                        view.parentView = that;
                        view.onConfirm(id);
                    }
                });
            });
            that.$(".js-btn_detail").on("click",function(){
                //console.log("aaa");
                var $tr = $(this).parents("tr");
                var id = $tr.attr('id');
                var data = that.$("#myTable").xtable("findData","#"+id);
                that.$(".js-detail").remove();
                var $template = that.$("#detail_tr").clone();
                $template.removeAttr('id').addClass('js-detail');
                $template.find("span[name]").each(function(){
                    var key = $(this).attr("name");
                    $(this).text(data[key]);
                });
                $tr.after($template);
            });
        },
        //新增应用弹窗
        add_popup:function(){
            var that = this;
            fish.popupView({
                url:"modules/clientSelfService/messageGatewayConfigure/views/AddPopupView",
                width:400,
                callback:function(popup, view) {
                    view.parentView = that;
                }
            });
        }
	});
    return pageView;
});
