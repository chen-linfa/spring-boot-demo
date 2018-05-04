define(['hbs!../templates/orderdetail.html'], function (temp) {
        var pageView = fish.View.extend({
            template: temp,
            initData:function(data){
            	this.options = data;
            	this.queryMemberInfo(1);
            },
            afterRender: function () {
                var that = this;
                that.$(".js-order_detail_status").combobox({attr_code:"ORDER_DETAIL_STATUS"});
                var option = {
					pagination: false,
					autoFill: false,
					singleSelect: true,//该表格可以多选
					rowId: "mem_user_id",//指定主键字段
					onSelectClass: "selected",
					nowPage: 1,
					columns: [
						{data: "mem_user_id", title: "MSISDN(卡号)", width: "20%"},
						{data: "busi_type", title: "业务", width: "10%",code:"BUSI_TYPE",formatter:function(data,rows){
                            if(rows.busi_type== "1"){
                            	return '<span">'+ '订购' +'</span>';
                            }else if(rows.busi_type== "2"){
                            	return '<span">'+ '退订' +'</span>';
                            }else if(rows.busi_type== "3"){
                            	return '<span">'+ '变更' +'</span>';
                            }
                        }},
						{data: "prod_name", title: "产品套餐", width: "20%"},
						{data: "status_date", title: "状态时间", width: "20%"},
						{data: "order_detail_status", title: "状态", width:"10%", 
							code:"ORDER_DETAIL_STATUS", formatter:function(data,rows){
                            if(rows.order_detail_status== "00S"){
                                return '<span class="text-success">'+ '订购成功' +'</span>';
                            }else if(rows.order_detail_status== "00F" || rows.order_status== "0CF"){
                                return '<span class="text-danger">'+ '订购失败' +'</span>';
                            	/*
                                if(rows.fail_lelvel=="1"){
                                    return '<span class="text-danger">'+ data +'(全部提交失败)</span>';
                                }
                                else{
                                    return '<span class="text-warning">'+ data +'(部分竣工失败)</span>'; 
                                }
                                */
                            }else if(rows.order_detail_status== "00C"){
                            	return '<span">'+ '在途' +'</span>';
                            }else if(rows.order_detail_status== "00A"){
                            	return '<span>'+ '创建' +'</span>';
                            }else{
                                return '<span class="text-danger>'+ '订单异常' +'</span>';
                            }
                        }},
						{data: "transation_id", title: "操作流水", width:"20%"}
					],//每列的定义
					//onLoad: me.initTableEvent //表单加载数据后触发的操作
				};
				that.$("#detailtab").xtable(option);	
				
				//外部分页组件
				that.$('.js-pagination').pagination({
                    records: 0,
                    pgRecText:false,
                    pgTotal:false,
                    onPageClick:function(e,eventData){
                    	var rowNum = that.$('.js-pagination').pagination("option","rowNum");
                    	that.queryMemberInfo(eventData.page,rowNum);
                    },
                    create:function(){
                    	//默认不加载
                    	//that.queryMemberInfo(1);
                    }
                });
				
				that.$("#btn_search").click(function(){
					that.queryMemberInfo(1);
				});
				
				//返回按钮
				that.$(".js-btn_back").click(function(){
					that.parentView.changeListDiv();
				});
                //过滤非法的卡号输入值
                that.$('#search_input').bind({
                    keyup:function(){
                        this.value=this.value.replace(/\D/g,'');
                    }
                });
            },
            queryMemberInfo:function(page,rows){
            	var that = this;
            	page = page || 1;
            	rows = rows || 10;
            	var mem_user_id = $.trim(that.$('#search_input').val());
            	var order_detail_status = that.$(".js-order_detail_status").combobox("value");
            	order_detail_status = order_detail_status?order_detail_status:"";
            	var param = {
            		page:page,
            		rows:rows,
            		order_id:that.options.order_id,
					mem_user_id:mem_user_id,
					create_date:that.options.create_date,
					order_detail_status:order_detail_status
            	};
            	fish.callService("BusiOrderNewController", "queryBusiOrderDetail",param,function(reply){
            		that.$("#detailtab").xtable("loadData",reply.rows);
            		that.$('.js-pagination').pagination("update",{records:reply.total,start:reply.pageNumber});
            		that.$(".page-total-num").text(reply.pageCount);
            		that.$(".page-data-count").text(reply.total);
            	});
            }
        });
        return pageView;
    });
