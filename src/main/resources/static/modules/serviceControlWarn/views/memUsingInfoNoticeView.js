define(['hbs!modules/serviceControlWarn/templates/memUsingInfoNotice.html'],function(temp){
	var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                that.initTable();
	            that.queryData();
	            that.bindEvent();
	        },
	        initTable:function(){
	        	var that = this;
	        	var mydata=[];
	            var option = {
	                data:mydata,
	                pagination: false,
	                autoFill: false,
	                singleSelect: true,//该表格可以多选
	                rowId: "warning_id",//指定主键字段
	                onSelectClass: "selected",
	                nowPage: 1,
	                columns: [
	                    {data: "mem_user_id", title: "MSISDN卡号", width: "10%"},
	                    {data: "mem_type", title: "成员类型", width: "10%", code:"MEM_TYPE"},
	                    {data: "usering_value", title: "使用值", width: "10%"},
	                    {data: "warning_comment", title: "告警信息", width: "50%"},
	                    {data: "create_date", title: "告警时间", width: "20%"},
	                ],//每列的定义
	                //onLoad: me.initTableEvent //表单加载数据后触发的操作
	            };
	            that.$data_list= that.$("#form_table").xtable(option);
	            //外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.queryData(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	//that.queryMemberInfo(1);
                    }
                });
	        },
	        queryData:function(page,rows,params){
	        	var msisdn=$.trim($("#search_input").val());
				var batch_id = $("#usingInfoNotice_batch_id").val();//批次
				if(msisdn == '请输入卡号'){
					msisdn = '';
				}
				if(batch_id == '0'){
					if(msisdn != ''){
						if(!/^[1-9][0-9]*$/.test(msisdn)){
							layer.alert("卡号格式错误");
							return;
						}
					}
					batch_id = '';
				}
	            var that = this;
	            if (!params)  params = {};
	            params.pageNum = page ? page : 1;
	            params.pageRow = rows ? rows : 10;
	            params.msisdn = msisdn;
	            params.batch_id = batch_id;
	            fish.callService("CustMemController", "queryCustMemUsingInfo", params, function(result){
	                data = result.rows;
	                //console.log(data);
	                that.$data_list.xtable("loadData",data);
	                that.$('.js-pagination').pagination("update",{records:result.total,start:result.pageNumber});
            		that.$(".page-total-num").text(result.pageCount);
            		that.$(".page-data-count").text(result.total);
	            })
	        },
	        bindEvent:function(){
	        	var that = this;
	        	//过滤非法的卡号输入值
	        	that.$('#search_input').bind({
	        		keyup:function(){
	        			this.value=this.value.replace(/\D/g,'');
	        		}
	        	});
	        	//点击导出清单文件
	        	that.$('#export_memUsingInfo_data').click(function(){
	         		var batch_id = $.trim(that.$("#usingInfoNotice_batch_id").val());//批次		
		    			if(batch_id == '0'){
		    			batch_id = '';
		    		}
					var url ="UploadController/exportforMemUsingNotice.do?batch_id="+batch_id;
					window.open(url);
	        	});
	        	//点击查询
	        	that.$('#btn_search').click(function() {
					that.queryData();
				});
	        },
	        //首页告警公告跳转传batch_id来查询相应告警信息。
		 	usingInfoNoticeBatchId : function(batch_id){
		 		var that = this;
		 		that.$("#usingInfoNotice_batch_id").val(batch_id);
		 		that.queryData();
		 	},
		 	initData:function(param){//用以从其它页面跳转到当前页面传参，在mainView.js的openView函数中调用。若不声明，会报错
		 		var that = this;
		 		that.usingInfoNoticeBatchId(param.batch_id);
        	}
        });
    return pageView;
})
