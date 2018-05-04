define(['hbs!modules/clientSelfService/messagePortSwitch/templates/message-port-switch.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.$('.js-date').datetimepicker();
            that.doQuery();
            
            var myCombobox = that.$('#combobox1').combobox({
                placeholder: 'chose',
                dataTextField: 'name',
                dataValueField: 'value',
                dataSource: [
                    {name: '所有', value: ''},
                    {name: '在用', value: '1'},
                    {name: '关闭', value: '0'}
                ],
                template: '<li><a href="#">test</a></li>'
            });
            myCombobox.on('combobox:change', function(e){
                console.log(myCombobox.val());
                var param = {};
                param.port_status = myCombobox.val();
                that.doQuery(null,null,param);
            });
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "gateway_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "gateway_port", title: "短信接入码", width: "30%"},
                    {data: "company_code", title: "企业代码", width: "30%"},
                    {data: "port_status", title: "端口状态", width: "20%", code:"PORT_STATUS"},//basic_info_enum.port_status[result.rows[i].port_status]
                    {data: "operation", title: "操作", width:"20%", formatter: function(data,rows){
                        //操作列的按钮生成
                        var op = (rows.port_status==0)?"打开":"关闭";
                        var html = '<a href="javascript:void(0);" class="js-btn_switch">'+op+'</a>';
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
                onPageClick:function(page){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.queryMemberInfo(page,rowNum);
                },
                create:function(){
                    //默认不加载
                    //that.queryMemberInfo(1);
                }
            });
            this.$('#query').click(function(){
                var param = {};
                param.port_status = myCombobox.val();
                that.doQuery(null,null,param);
            });
		},
        doQuery : function( page, rows, param){
            var that = this;
            if(param == null){
                param = {};
            }
            var num = 1;
            var row = 10;
            var search_content = that.$("#search_input").val();
            param.page = page==null? num : page;
            param.rows = rows==null? row : rows;
            param.search_content=search_content;
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
            that.$(".js-btn_switch").on("click",function(){
                var id = $(this).parents("tr").attr('id');
                var data = that.$("#myTable").xtable("findData","#"+id);
                //console.log("data",data);
                var status = data.port_status;
                var myStatus = (status==0)?"确定打开？":"确定关闭？";
                layer.confirm(myStatus, {yes:function(){
					that.onConfirm(id,status);
				}});
            });
        },
        //确定
        onConfirm:function(id,  port_status){
            var that = this;
            var params = {};
            params.gateway_id = id;
            if(port_status == 0){
                params.port_status = 1;
            }else if(port_status == 1){
                params.port_status = 0;
            }
            fish.callService("SmsController","resetSmsPortStatus",params,function(reply){
                var status = port_status
                if(reply.res_code != "00000"){
                    layer.alert(reply.result);
                }
                that.doQuery();
            });
            layer.closeAll();
        }

	});
    return pageView;
});
