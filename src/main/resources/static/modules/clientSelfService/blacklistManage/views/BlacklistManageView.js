define(['hbs!modules/clientSelfService/blacklistManage/templates/blacklist-manage.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
    	detailframe:false,
    	addframe:false,
    	hasadd:false,
    	ifadd : true,
    	editmode : false,
    	noreload : false,
    	update : false,

        afterRender: function(){
            var that = this;

            var option = {
                pagination: false,
                autoFill: false,
                singleSelect: true,//该表格可以多选
                rowId: "noticeTitle",//指定主键字段
                onSelectClass: "selected",
                nowPage: 1,
                columns: [
                    {data: "msisdn", title: "MSISDN(卡号)", width: "20%"},
                    {data: "type", title: "类型", width: "20%"},
                    {data: "create_date", title: "创建时间", width: "30%"},
                    {data: "comments", title: "备注", width: "20%"},
                    {data: "operation", title: "操作", width:"10%", formatter: function(data){
                        //操作列的按钮生成
						var html = '<a href="javascript:void(0);" class="js-btn_edit">详情</a> '
							+'<a href="javascript:void(0);" class="js-btn_del">删除</a> '

						return html;
                    }}
                ],//每列的定义
                
                onLoad: fish.bind(that.bindTableButton,that) //表单加载数据后触发的操作
            };
        	that.$("#xtab").delegate(".js-btn_del","click",function(){
        		var msisdn = $(this).parents("tr").attr("id");
        		console.log(msisdn);
        		console.log("wbgl");
        		console.log(msisdn);
        		var user_data = that.$("#xtab").xtable("findData","#"+msisdn);
    			var params={};
    			console.log("测试测试测试测试");
    			params.list_id =user_data.list_id;
    			console.log(user_data.list_id);
				console.log(params);

    			layer.confirm("你是否要删除该黑名单？",function(){
					fish.callService("SmsController","deleteBW",params,function(reply){
						console.log(params);
						console.log("delete");
						if(reply.res_code == "00000")
						{
							layer.alert("删除成功");
							that.initTable();
						}else{
							layer.alert(reply.result);
						}
					});
        		});
        	});
        	that.$("#xtab").delegate(".js-btn_edit","click",function(){
        		var user_id = $(this).parents("tr").attr("id");
        		var user_data = that.$("#xtab").xtable("findData","#"+user_id);
        		fish.popupView({
        			url:"modules/clientSelfService/blacklistManage/views/ChangeView",
        			width:400,
        			callback:function(popup,view){
        				view.parentView = that;
        				view.loadData(user_data);
        				
        			}
        		});
        	});
            that.initTable();

			
            this.$("#xtab").xtable(option);
			that.$('.js-pagination').pagination({
                records: 0,
                pgRecText:false,
                pgTotal:false,
                onPageClick:function(e,eventData){
                	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                	that.queryMember(eventData.page,rowNum,{});
                	console.log("***************");
                },
                create:function(){
                	that.queryMember(1);
                }
            });
            this.$('#btn_search').click(function(){
                that.doQuery();
            });
            this.$('#add').click(function(){
                that.popViewFunction();
            });
            //过滤非法的卡号输入值
            that.$('#search_input').bind({
                keyup:function(){
                    this.value=this.value.replace(/\D/g,'');
                }
            });
		},
        popViewFunction: function () {
        	var that = this;
            fish.popupView({
                url:"modules/clientSelfService/blacklistManage/views/AddPopupView",
                width:400,
                callback:function(popup, view) {
                    view.parentView = that;
                }
            });
        },
        add_popup:function(){
            var that = this;
            fish.popupView({
                url:"modules/clientSelfService/blacklistManage/views/AddPopupView",
                width:400,
                callback:function(popup, view) {
                    view.parentView = that;
                }
            });
        },		

		
        doQuery : function( page, rows){
        
            var that = this;
            var param = {};
            var num = 1;
            var row = 10;
            var search_content = $("#search_input").val();
            param.page = page==null? num : page;
            param.rows = rows==null? row : rows;
            param.msisdn = search_content;
            console.log(param);
            //Invoker.async("SmsController", "querySmsBWList", params, function(data)
        	fish.callService("SmsController", "querySmsBWList", param, function(reply){
        		console.log(reply);
				$.each(reply.rows, function(i,value){
					value.type=value.type=="black"?"黑名单":"白名单";
				});
        		that.$("#xtab").xtable("loadData",reply.rows);
        		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
        		that.$(".page-total-num").text(reply.pageCount);
        		that.$(".page-data-count").text(reply.total);
        	});
        },

		initTable:function(pageNum,pageRow,params){
			var me = this;
			var that = this;
			if(params==null){
				params={};
			}
			var num = 1;
			var row = 10;
			params.page = pageNum==null? num : pageNum;
			params.rows = pageRow==null? row : pageRow;
			fish.callService("SmsController", "querySmsBWList", params, function(reply) {

					console.log("INITABLE");
					$.each(reply.rows, function(i,value){
						value.type=value.type=="black"?"黑名单":"白名单";
					});
	        		that.$("#xtab").xtable("loadData",reply.rows);
	        		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
	        		that.$(".page-total-num").text(reply.pageCount);
	        		that.$(".page-data-count").text(reply.total);
			});
	},
	queryMember:function(page,rows,params){
        	var that = this;
			if(params==null){
				params={};
			}
        	if(page){
        		//暂存当前页面
        		that._nowpage = page;
        	}
     
			var num = 1;
			var row = 10;
			params.page = page==null? num : page;
			params.rows = rows==null? row : rows;
			console.log(params);

			fish.callService("SmsController", "querySmsBWList", params, function(reply) {


					$.each(reply.rows, function(i,value){
						value.type=value.type=="black"?"黑名单":"白名单";
					});
	        		that.$("#xtab").xtable("loadData",reply.rows);
	        		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
	        		that.$(".page-total-num").text(reply.pageCount);
	        		that.$(".page-data-count").text(reply.total);
			});
        },
        loadData:function(data){
        	var that= this;
        	that.update=data.update;
        	console.log(that.update);
        	if(that.update){
        		that.initTable();
        	
        		that.update=false;
        	}
        	console.log("update:::::");
        	console.log(that.update);
        },
        bindTableButton:function(){
            var that = this;
            that.$(".js-btn_detail").on("click",function(){
                
                var $tr = $(this).parents("tr");
                that.$(".js-detail").remove();
                var $template = that.$("#detail_tr").clone();
                $template.removeAttr('id').addClass('js-detail');
                console.log($tr);
                var params = {};
                params.mem_user_id = $tr.attr("id");
                // fish.callService("CustMemController", "queryCustMemberDetail", params, function(result){
                //     fish.utils.getAttrCode("CARD_BRAND_TYPE",function(code){
                //         console.log(code);
                //     });
                // });
                $tr.after($template);
            });
        }
        //loadData:function()
        //
	});
    return pageView;
});
