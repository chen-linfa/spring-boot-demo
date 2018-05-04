define(['hbs!../templates/jobmanage.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.initTable();
                that.$('.js-dropdownMenu2').dropdown();
                that.queryData();
                that.bindEvent();
            },
            initTable:function(){
                var that = this;
                var option = {
                    pagination: true,
                    autoFill: false,
                    singleSelect: true,//该表格可以多选
                    rowId: "job_info_id",//指定主键字段
                    onSelectClass: "selected",
                    nowPage: 1,
                    columns: [
                        {data: "job_info_name", title: "定时任务名称", width: "15%"},
                        {data: "cron_expression", title: "时间表达式", width: "15%"},
                        {data: "trigger_state", title: "任务状态", width: "8%",code:"TRIGGER_STATE",formatter:function(data){
                            if(data=="等待"){
                                return '<span class="states valid">'+data+'</span>';
                            }else{
                                return '<span class="states invalid">'+data+'</span>';
                            }
                        }},
                        {data: "create_date", title: "创建时间", width: "10%"},
                        {data: "prev_fire_time", title: "上次执行时间", width: "10%"},
                        {data: "next_fire_time", title: "下次执行时间", width: "10%"},
                        {data: "hosts", title: "服务器", width: "10%"},
                        {data: "control", title: "操作", width:"5%", formatter: function(data,rows){
                            //操作列的按钮生成
                            var html ='<div class="btn-group pull-right">';
                            html += '<button class="js-dropdownMenu2" type="button">';          
                            html += '<i class="ico-pull-down"></i></button>';
                            html += '<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenu2">';
                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="view_detail">详情</a></li>';
                            if(rows.trigger_state != "PAUSED"){
                            	html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="pause_job">暂停</a></li>';
                            }else{
                            	html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="resume_job">恢复</a></li>';
                            }
                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="trigger_job">立刻执行</a></li>';
                            html += '<li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="delete_job">删除</a></li></ul></div>';
                            return html;
                        }}
                    ],//每列的定义
                    onLoad: fish.bind(that.bindTableEvent,that)
                };
                that.$data_list= that.$("#data_list").xtable(option);
                //外部分页组件
                that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    rowList:[],
                    onPageClick:function(e,eventData){
                        var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                        that.queryData(eventData.page,rowNum);
                    },
                    create:function(){
                        //默认不加载
                        //that.queryData(1);
                    }
                });
                that.$("[name=trigger_state]").combobox({
                    attr_code:"TRIGGER_STATE",
                    dataSource: [{name: '全部', value: ''}]
                });
                

            },
            queryData:function(page, rows, param){
                var that = this;
                if (!param)  param = that.$("form").form('value');
                param.page = page ? page : 1;
                param.rows = rows ? rows : 10;
                fish.callService("JobController", "queryJobInfo", param, function(result){
                    data = result.rows;
                    that.$data_list.xtable("loadData",data);
                    that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
                    that.$(".page-total-num").text(result.pageCount);
                    that.$(".page-data-count").text(result.total);
                });
            },
            //表格内部事件绑定
            bindTableEvent:function(){
                var that = this;
                that.$data_list.find("tr").each(function(){
                	//给操作列添加样式
                    $(this).children("td").eq(7).addClass("operation");
                });
                that.$(".pause_job").click(function(){
                    var warn_config_id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+warn_config_id);
					fish.callService("JobController","pauseJob",data,function(reply){
						if(reply.res_code == "00000")
						{
							layer.alert("暂停成功！");
							that.queryData();
						}else{
							layer.alert(reply.result);
						}
					});
                });
                that.$(".trigger_job").click(function(){
                    var warn_config_id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+warn_config_id);
					fish.callService("JobController","triggerJob",data,function(reply){
						if(reply.res_code == "00000")
						{
							layer.alert("立刻执行成功！");
							that.queryData();
						}else{
							layer.alert(reply.result);
						}
					});
                });
                that.$(".resume_job").click(function(){
                    var warn_config_id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+warn_config_id);
					fish.callService("JobController","resumeJob",data,function(reply){
						if(reply.res_code == "00000")
						{
							layer.alert("恢复成功！");
							that.queryData();
						}else{
							layer.alert(reply.result);
						}
					});
                });
                that.$(".delete_job").click(function(){
                    var warn_config_id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+warn_config_id);
                    layer.confirm("确认删除定时任务:"+data.job_info_name+" ？",function(index){
                    	fish.callService("JobController","deleteJobInfo",data,function(reply){
							if(reply.res_code == "00000")
							{
								layer.alert("删除成功！");
								that.queryData();
							}else{
								layer.alert(reply.result);
							}
						});
                    	layer.close(index);
                    });
                });
                that.$(".view_detail").click(function(){
                    var id = $(this).parents("tr").attr("id");
                    var data = that.$data_list.xtable("findData","#"+id);
                    data.type = "edit";
                    fish.popupView({
                        url:"modules/jobManage/views/JobDetailView",
                        width:600,
                        viewOption:data,
                        callback:function(popup, view) {
                            view.parentView = that;
//                            view.loadData(data,true);
                        }
                    });
                });
                that.$(".js-dropdownMenu2").click(function(){
                    if($(this).children(".ico-pull-down").hasClass("active")){
                        $(this).parents(".btn-group").removeClass("open");
                        $(this).children(".ico-pull-down").removeClass("active");
                    }else{
                        that.$(".btn-group").removeClass("open");
                        that.$(".ico-pull-down").removeClass("active");
                        $(this).parents(".btn-group").addClass("open");
                        $(this).children(".ico-pull-down").addClass("active");
                    }
                    
                });
            },

            bindEvent:function(){
                var that = this;
                that.$("#query_btn").click(function(){
                	that.queryData();
                });
                
                that.$("#btn_add").click(function(){
                    fish.popupView({
                        url:"modules/jobManage/views/JobDetailView",
                        width:600,
                        callback:function(popup, view) {
                            view.parentView = that;
                        }
                    });
                });
                
                //重构按钮
                that.$("#reload_job_btn").click(function(){
                	fish.callService("JobController","reloadJobInfo",{},function(reply){
						if(reply.res_code == "00000"){
							layer.alert("重构成功！");
							that.queryData();
						}else{
							layer.alert(reply.result);
						}
					});
                });
            }
        });
        return pageView;
    });
