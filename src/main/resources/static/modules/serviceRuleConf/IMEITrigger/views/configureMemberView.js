define(["hbs!modules/serviceRuleConf/IMEITrigger/templates/configureMember.html"], function (temp) {
   var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
            "click #submit_btn" : "onClosePupup",
            "click #cancel_btn" : "onClosePupup"
        },
        afterRender: function() {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                         - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
            that.$('#search_btn').click(function(){
                that.queryData();
            })
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
                    {data:"_checkbox",title:"全选",checkbox:true},
                    {data: "mem_user_id", title: "成员号码", width: "50%"}
                ],//每列的定义
                //onLoad: me.initTableEvent //表单加载数据后触发的操作
            };
            that.$imei_conf_list = that.$("#imei_conf_list").xtable(option);
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                pgNumber:false,
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.$imei_conf_list.xtable("options",{pageSize:rowNum});
                    var params = {};
                    params.trigger_id = that._data.trigger_id;
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
            var mem_search_content = that.$("#search_input").val();
            if(mem_search_content != ''){
                if(!/^[1-9][0-9]*$/.test(mem_search_content)){
                    layer.alert("卡号格式错误");
                    return;
                }
            }
            if(!params) params = {};
            params.page = page==null? 1 : page;
            params.rows = rows==null? 10 : rows;
            params.trigger_id = that._data.trigger_id;
            params.mem_search_content = mem_search_content;
            params.trigger_type = that._data.trigger_type;
            params.query_type = that._data.query_type;
            fish.callService("TriggerController", "queryMemberList", params, function(result){
                var data = result.rows;
                that.$imei_conf_list.xtable("loadData",data);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
                that.popup.center();
            });
        },
        onClosePupup: function(){
            this.trigger("editview.close");
            this.popup.close();
        },
        initData:function(params){
            var that = this;
            that._data ={};
            $.extend(true,that._data,params);
            that.initTable();
            that.queryData();
        }
    });

    return components;
});
