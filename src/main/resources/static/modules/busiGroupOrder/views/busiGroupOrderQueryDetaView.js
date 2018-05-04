define(['hbs!modules/busiGroupOrder/templates/busiGroupOrderQueryDeta.html',
        "frm/template/party/echarts.min"],function(temp,echarts) {
    var pageView = fish.View.extend({
        template: temp,
        order_id : '',
        initialize : function(){
        	var that = this;
        	that.order_id = this.options["keyname"];
        },
        afterRender: function(){
            var that = this;
            that.toDetail(that.order_id,new Date());
            that.initEvent();
		},
        toDetail : function(order_id,create_date){
        	var that = this;
        	that.$(".group_list_div").hide();
            that.$(".group_detail_div").show();
        	  var params = {};
              params.page = 1;
              params.rows = 10;
              params.order_id = order_id;
              params.create_date = create_date;//data.create_date;
              fish.callService("BusiGroupOrderController", "queryOrderDeta", params, function(data){
              	var has_data = false;
                  var pageCount = 0;
                  if (data && data.result.length > 0) {
                      has_data = true;
                      for(var i=0;i<data.result.length;i++){
                     	 var div = $('<div class="panel panel-default"><div class="panel-body"> <form class="form-horizontal start'+i+'">'+
              					   '<div class="form-group"><label class="col-xs-2 control-lable">套餐名称：</label>'+
              					   '<div class="form-group  col-md-3"><input type="text" class="form-control prod_name'+i+'" placeholder="套餐名称">'+
              	                   '</div></div><div class="form-group"><label class="col-xs-2 control-lable">生效时间：</label>'+
              					   '<div class="form-group  col-md-3"><input type="text" class="form-control start_time'+i+'" placeholder="生效时间"></div>'+
              	                   '<label class="col-xs-2 control-lable">失效时间：</label><div class="form-group  col-md-3">'+
              	                   '<input type="text" class="form-control end_time'+i+'" placeholder="失效时间"></div></div>'+
              	                   '</form></div></div>');
                     	 $("#prod_list").append(div);
                     	 $("#prod_list").find(".prod_name"+i).val(data.result[i].prod_name);
                     	 $("#prod_list").find(".start_time"+i).val(data.result[i].eff_date);
                     	 $("#prod_list").find(".end_time"+i).val(data.result[i].exp_date);
                     	 var action_value = "";
                     	 if(data.result[i].order_action=='1'){
                     		 action_value = '订购套餐';
                     	 }else if(data.result[i].order_action=='2'){
                     		 action_value = '退订套餐';
                     	 }else if(data.result[i].order_action=='3'){
                     		 action_value = '变更套餐';
                     	 }else if(data.result[i].order_action=='4'){
                     		 action_value = '暂停套餐';
                     	 }else if(data.result[i].order_action=='5'){
                     		 action_value = '恢复套餐';
                     	 }
                     	 var attr = data.result[i].attr;
                     	 $("#prod_list").find(".order_action").val(action_value);
                     	 for(var j=0;j<attr.length;j++){
                     		 var div = $('<div class="form-group"><label class="col-xs-2 control-lable attr_name'+j+'">'+attr[j].attr_name+':</label>'+
              	                   '<div class="form-group  col-md-3"><input type="text" class="form-control attr_value'+j+'" placeholder="属性值">'+
              	                   '</div></div>');
                     		 $(".start"+i).append(div);
                     		 $(".start"+i).find(".attr_value"+j).val(attr[j].attr_value);
                     	 }
                      }
                  }
                  if (has_data == false) {
                  }
              });
        },
        initEvent : function(){
        	var that = this;
        	$(".backToMain").unbind("click").bind("click",function(e){
       		 var viewURL = "modules/busiGroupOrder/views/BusiGroupOrderAddView";
                 that.parentView.openView(viewURL);
       		
        	});
        },
        initData : function(param){
        },
	});
    return pageView;
});
