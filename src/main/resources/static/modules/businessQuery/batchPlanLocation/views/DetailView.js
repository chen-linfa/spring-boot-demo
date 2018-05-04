define(["hbs!modules/businessQuery/batchPlanLocation/templates/detail.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        detailParam:{},
        parentView:null,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        plan_id : "",
        exec_state : "",
        plan_name:"",
        beforeRender:function(plan_id,exec_state,plan_name){
            var that = this;
            that.plan_id = this.options.plan_id;
            that.exec_state = this.options.exec_state;
            that.plan_name = this.options.plan_name;
        },
        afterRender: function () {
            var that = this;
            that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    pgInput:false,
                    rowList:[],
                    rowNum:5,
                    onPageClick:function(e,eventData){
                        var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                        that.doQuery(eventData.page,rowNum);
                    },
                    create:function(){
                        that.doQuery();
                    }
                });
            that.$(".js-plan-name").html(that.options.plan_name);
            that.$(".js-sure").click(function(){
                that.addPlanDetail();
                that.popup.close();
            });
            that.$(".js-cancel").click(function(){
                that.popup.close();
            });
            that.initProjectTable();
            that.initEvent();
            //添加号码
            that.$("#btn_addgroup").click(function(){
                that.$("#newgroup_form").form("clear");
                that.$("#newgroup_form").show();
            });
            //确定添加
            that.$("#btn_addconfirm").click(function(){
                that.addPlanDetail();
            });
            //新增号码的取消按钮
            that.$("#btn_addcancel").click(function(){
                that.$("#newgroup_form").hide();
            });
        },
        ele : {
            data_list : $("#proj_list")
        },
        addPlanDetail : function() {
            var me = this;
            var msisdn = $.trim(me.$("#vadd_msisdn").val());
            if (!msisdn) {
                layer.alert("号码不能为空");
                return;
            };
            var param = {
                    msisdn : msisdn,
                    plan_id : me.options.plan_id
            };
            fish.callService("LocationController", "addLocationPlanDetail", param , function(reply){
                if (reply.res_code != "00000") {
                    layer.alert(reply.res_message);
                    return;
                }
                layer.alert("操作成功");
                me.parentView.doQuery();
            });
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        //初始化计划表格
        initProjectTable : function() {
            var me = this;
            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格单选
                onSelectClass: "selected",
                rowId: "plan_deta",//指定主键字
                pageSize : 5,
                columns : [
                    {data:"_checkbox",title:"",checkbox:true,width: "20%"},
                    {data : "msisdn",title : "号码", width: "60%"},
                    {data:"",title:"操作",width:"20%",formatter:function(){
                        return '<a href="javascript:void(0);" class="js-delgroup">删除</a>'
                    }}
                    ],
                /*{data : "exec_state",title : "任务状态", width: "25%", className: "td-center", formatter: function(data, row) {
                    return me.translate_exec_state(data);
                }}*/
            };
            me.$(".js-detail-table").xtable(option);
            me.$(".js-detail-table").delegate(".js-delgroup","click",function(e){                 
                var ele = $(this).closest("tr");
               me.deleteProject();
            });
            me.doQuery();
        },
        //查询
        doQuery : function(page, rows, param){
            var me = this;
            if (!param)  param = new Object();
            param.page = page ? page : 1;
            param.rows = rows ? rows : 5;
            param.plan_id = me.options.plan_id?me.options.plan_id:"";
            fish.callService("LocationController", "queryLocPlanDetailPage", param, function(data){
                var has_data = false;
                var pageCount = 0;
                if(data && data.total>0){
                    has_data = true;
                    pageCount = data.pageCount;
                }
                if(has_data == false){
                    me.$(".js-detail-table").xtable("loadData",[]);
                    var error_tr = '<tr><td colspan="99" align="center"><font color="red">暂无数据</font></td></tr>';
                    me.$(".js-detail-table").append(error_tr);
                }
                me.$('.js-pagination').pagination("update",{records:data.total,start:data.pageNumber});
                me.$(".js-total").html(data.pageCount);
                me.$(".js-num").html(data.total);
                me.$(".js-detail-table").xtable("loadData",data.rows);
            });
        },
        //事件注册
        initEvent : function() {
            var me = this;
            
            if (me.options.exec_state == "0") {    //待执行
                me.$("#proj_add_btn").click(function() {
                    // fish.popupView({
                    //     url:"modules/businessQuery/batchPlanLocation/views/DetailAddNumberView.js",
                    //     width:400,
                    //     options:{
                    //         plan_id:me.options.plan_id
                    //     },
                    //     callback:function(popup,view){
                    //         view.parentView = me;
                    //     }
                    // })

                });
                
                
            } else {
                me.$("#proj_add_btn").hide();
                me.$("#proj_del_btn").hide();
            }
        },
        
        //删除操作
        deleteProject : function() {
            var me = this;
            var row = me.$(".js-detail-table").xtable("getSelected");
            if (!row || row.length == 0) {
                layer.alert("请选择要删除的号码");
                return;
            }
            var obj = row[0];
            layer.confirm("确认删除【" + obj.msisdn + "】？", {yes: function() {
                var param = {plan_id: me.options.plan_id, plan_deta_id: obj.plan_deta};            
                fish.callService("LocationController", "deleteLocPlanDetail", param , function(reply){
                    if (reply.res_code != "00000") {
                        layer.alert(reply.res_message);
                        return;
                    }
                    layer.alert("删除成功");
                    me.doQuery();
                });
            }});
        },
        
    });

    return components;
});
