define(['hbs!../templates/unusual-warning.html'],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            this.$('.js-date').datetimepicker();

            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "notice_title",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "notice_title", title: "公告标题", width: "30%"},
                    {data: "notice_type", title: "公告类型", width: "10%",code:"NOTICE_TYPE"},
                    {data: "notice_content", title: "公告内容", width: "30%"},
                    {data: "issue_date", title: "发布时间", width: "20%"},
                    {data: "control", title: "操作", width:"10%", formatter: function(data){
                        //操作列的按钮生成
                        var html = '<a href="javascript:void(0);" class="js-btn_detail">查看详情</a>';
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
            //this.doQuery();
            this.$('#query').click(function(){
                that.doQuery();
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
            fish.callService("CustHomePageController", "getCustNoticeList", param, function(result){
                console.log(result.rows);
                that.$("#myTable").xtable("loadData",result.rows);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
            });
        },
        bindTableButton:function(){
            var that = this;
            that.$(".js-btn_detail").on("click",function(){
                //console.log("aaa");
                var $tr = $(this).parents("tr");
                var id = $tr.attr("id");
                //console.log("id\n",id);
                var data = that.$("#myTable").xtable("findData","#"+id);
                //console.log("data\n", data);
                that.$(".js-detail").remove();
                var $template = that.$("#detail_tr").clone();
                $template.removeAttr('id').addClass('js-detail');
                
                fish.utils.getAttrCode("NOTICE_TYPE",function(code){
                    data.notice_type_name = code[data.notice_type];
                    console.log("data.notice_type\n",data.notice_type_name);
                    $template.find("span[name]").each(function(){
                        var key = $(this).attr("name");
                        $(this).text(data[key]);
                    });
                });
                $tr.after($template);
            });
        },
        initData : function(param){
        }
	});
    return pageView;
});
