define(['hbs!../templates/menmberFinish.html'],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            var reply = that.options;
            if(reply.result){
	            that.$("span[name]").each(function(){
	            	var name = $(this).attr("name");
	            	$(this).text(reply.result[name]);
	            });
                that.$("#order_id").text(reply.result.order_id);
            }
            
            if(reply.res_code != "00000"){
            	//失败了
            	that.$("#img_result").attr("src","frm/template/images/logo-warning.png");
            	that.$("#result_message").text(reply.res_message);
            	that.$("#status_message").text("订购失败");
            }
            that.$("#btn_back").click(function(){
            	that.parentView.controlDivChange(0);
            });
             that.$("#order_id").click(function(){
                var order_id = that.$("#order_id").text();
                var viewURL = "modules/memberManage/orderQuery/views/OrderQueryView";
                that.parentView.parentView.openView(viewURL,{order_id:order_id});
            });
		}
	});
    return pageView;
});
