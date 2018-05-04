define(['hbs!modules/APIService/templates/apiAbilitySpec.html',
        "frm/template/party/echarts.min"], function (temp, echarts) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function () {
            var that = this;
            that.$('.js-selectmenu').combobox();
            that.$('.js-check').icheck();
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "ability_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "ability_code", title: "能力编码", width: "25%"},
                    {data: "ability_name", title: "能力名称", width: "25%"},
                    {data: "ability_desc", title: "能力描述", width: "25%"},
                    {data: "create_date", title: "创建时间", width: "25%"},
                ],//每列的定义
                //onLoad: me.initTableEvent //表单加载数据后触发的操作
            };
            that.$data_list = that.$("#data_list").xtable(option);
            //外部分页组件
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.$data_list.xtable("options",{pageSize:rowNum});
                    that.queryData(eventData.page,rowNum);
                },
                create:function(){
                    //默认不加载
                    //that.queryMemberInfo(1);
                }
            });
            that.queryData();
            that.bindEvent();
            
        },
        queryData:function(page,rows,params){
            var that = this;
            if (!params)  params = {};
            params.page = page ? page : 1;
            params.rows = rows ? rows : 10;
            fish.callService("AppManageContrller", "queryAllApiAbilitySpecs", params, function(result){
                data = result.result.rows;
                // console.log(data);
                that.$data_list.xtable("loadData",data);
                that.$('.js-pagination').pagination("update",{records:result.result.total,start:result.result.pageNumber});
                that.$(".page-total-num").text(result.result.pageCount);
                that.$(".page-data-count").text(result.result.total);
            })
        },
        //绑定下载事件
        bindEvent : function() {
            //绑定下载事件
            this.$("#i_api_download").click(function(){
                window.open("servlet/downloadExcel?type=doc&fieldCode=10000"); 
            });
            /*//绑定下载事件
            this.$('#absTab').delegate('a[name=btn_detail]' ,'click', function(){
                var fieldName = _self.attr("fieldName");
                window.open("servlet/downloadExcel?type=doc&fieldCode="+fieldName+""); 

            });*/
        }, 
    });
    return pageView;
});