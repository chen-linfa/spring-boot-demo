define(["hbs!modules/serviceRuleConf/activeTrigger/templates/ConfigureMember.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
            "click .submit_btn" : "onSubmit",
            "click .cancel_btn" : "onClosePupup"
        },
        afterRender: function() {
            var that = this;
            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
                         - that.$('.modal-footer').height();
            that.$('.modal-body').css({
                "max-height":height,
                "overflow":"auto"
            });
        },
        initTable:function(){
            var that = this;
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: false,//该表格可以多选
                rowId: "mem_user_id",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data:"_checkbox",title:"全选",checkbox:true},
                    {data: "mem_user_id", title: "成员号码", width: "70%"}
                ],//每列的定义
                //onLoad: me.initTableEvent //表单加载数据后触发的操作
            };
            that.$add_data_list = that.$("#add_data_list").xtable(option);
            that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                pgNumber:false,
                pgInput:false,
                rowList:[],
                onPageClick:function(e,eventData){
                    var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    that.$add_data_list.xtable("options",{pageSize:rowNum});
                    var params = {};
                    params.warn_config_id = that._data.warn_config_id;
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
            params.page = page==null? 1 : page;
            params.rows = rows==null? 10 : rows;
            params.query_type = that._data.query_type;
            params.trigger_id = that._data.trigger_id;
            params.trigger_type = that._data.trigger_type;
            params.mem_search_content = that.$("mem_search_content").val();
            fish.callService("TriggerController", "queryMemberList", params, function(result){
                var data = result.rows;
                that.$add_data_list.xtable("loadData",data);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
                that.popup.center();
            });
        },
        onSubmit:function(){
            var that = this;
            var row = that.$add_data_list.xtable("getSelected");
            if(that._data.query_type != "view"){
                if (!row || row.length == 0) {
                    layer.alert("请选择成员！");
                    return;
                }
                var obj = row;
                var mem_user_id_list = [];
                for(var i= 0;i<row.length;i++){
                    mem_user_id_list.push(row[i].mem_user_id);
                }
                that.parentView.getSelectedMember(that._data.query_type,mem_user_id_list);
            }
            that.onClosePupup();
        },
        onClosePupup: function(){
        	this.trigger("editview.close");
        	this.popup.close();
        },
        initData:function(params){
            var that = this;
            that._data ={};
            $.extend(true,that._data,params);
            if(params.query_type=="view"){
                that.$("#popupTitle").text("配置成员");
                that.$(".submit_btn").text("确定");
            }else if(params.query_type=="add"){
                that.$("#popupTitle").text("添加配置成员");
                that.$(".submit_btn").text("添加");
            }else if(params.query_type=="delete"){
                that.$("#popupTitle").text("删除配置成员");
                that.$(".submit_btn").text("删除");
            }
            that.initTable();
            that.queryData();
        }
    });
    return components;
});
