define(["hbs!modules/serviceControlWarn/templates/addMemberPopup.html"], function(temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events:{
            "click .submit_btn" : "onAddMember",
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
            params.warn_config_id = that._data.warn_config_id;
            fish.callService("AlarmController", "queryNoConfigMember", params, function(result){
                var data = result.rows;
                that.$add_data_list.xtable("loadData",data);
                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                that.$(".page-total-num").text(result.pageCount);
                that.$(".page-data-count").text(result.total);
                that.popup.center();
            });
        },
        onAddMember:function(){
            var that = this;
            var row = that.$add_data_list.xtable("getSelected");
            if (!row || row.length == 0) {
                layer.alert("请选择要添加的号码");
                return;
            }
            var obj = row;
            var mem_user_id = new Array();
            for(var i= 0;i<row.length;i++){
                mem_user_id.push(row[i].mem_user_id);
            }
            var param = {}; 
            param.mem_user_id = mem_user_id;
            param.men_type = that._data.men_type;
            param.warn_config_id = that._data.warn_config_id;
            fish.callService("AlarmController", "insertAlarmRel", param , function(reply){
                if (reply.res_code != "00000") {
                    layer.alert(reply.res_message);
                    return;
                }
                layer.alert(reply.res_message);
                that.queryData();
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
