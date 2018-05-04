define(["hbs!modules/serviceControlWarn/templates/viewDetail.html"], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .cancel_btn": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                        - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        initTable:function(){
            var that = this;
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "mem_user_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "mem_user_id", title: "成员卡号", width: "40%"},
                    {data: "men_type", title: "业务类型", width: "30%",code:"MEM_TYPE"},
                    {data: "control", title: "操作", width:"30%", formatter: function(data){
                        //操作列的按钮生成
                        var html = '<a href="#" class="js-warn_detail">查看告警明细</a>';
                        return html;
                    }}
                ],//每列的定义
                onLoad: fish.bind(that.bindTableEvent,that) //表单加载数据后触发的操作
            };
            that.$detail_data_list = that.$("#detail_data_list").xtable(option);
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                pgNumber:false,
                pgInput:false,
                rowList:[],
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.$detail_data_list.xtable("options",{pageSize:rowNum});
                    var params = {};
                    that.queryData(eventData.page,rowNum,params);
                },
                create:function(){
                    //默认不加载
                    //that.queryData(1);
                }
            });
        },
        queryData:function(page,rows,params){
            var that = this;
            if(!params) params = {};
            params.page = page ? page : 1;
            params.rows = rows ? rows : 10;
            params.warn_config_id = that._data.warn_config_id;
            fish.callService("AlarmController", "queryAlarmMember", params, function(result){
                var data = result.rows;
                that.$detail_data_list.xtable("loadData",data);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
                that.popup.center();
            });
        },
        bindTableEvent:function(){
            var that = this;
            that.$(".js-warn_detail").click(function(){
                var $tr = $(this).parents("tr");
                that.$(".js-detail").remove();
                var $template = that.$("#detail_tr").clone();
                $template.removeAttr('id').addClass('js-detail');
                var mem_user_id = $(this).parents("tr").attr("id");
                var data = that.$detail_data_list.xtable("findData","#"+mem_user_id);
                var params = {};
                params.mem_user_id = data.mem_user_id;
                params.mem_type = data.men_type;
                fish.callService("AlarmController", "queryAlarmDetail", params, function(reply){
                    if(reply.res_code=='00000'){
                        var result = reply.result;
                        fish.utils.getAttrCode(["MEM_TYPE"],function(code){
                            result.MEM_TYPE = code["MEM_TYPE"][result.MEM_TYPE];
                            $template.find("span[name]").each(function(){
                                var key = $(this).attr("name");
                                $(this).text(result[key]);
                            });
                        });
                        $tr.after($template);
                    }else{
                        layer.alert(reply.res_message);
                    }
                });
            });
        },
        initData:function(params){
            var that = this;
            that._data = {};
            $.extend(true,that._data,params);
            //console.log(that._data);
            that.initTable();
            that.queryData();
        }

    });

    return components;
});
