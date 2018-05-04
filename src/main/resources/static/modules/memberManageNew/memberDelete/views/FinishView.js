define(['hbs!../templates/menmberFinish.html'],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        afterRender: function(){
            var that = this;
            that.showResult();
            that.$("#btn_back").click(function(){
            	//返回第一个页面
            	that.parentView.controlDivChange(0);
            });
            that.$(".js-back-btn").click(function(){
            	//返回第一个页面
            	that.parentView.controlDivChange(0);
            });
		},
		showResult:function(){
			var that = this;
			if(that.options.type == "fail"){
				that.$("#img_result").attr("src","frm/template/images/logo-warning.png");
				that.$(".text-finish").text("提交失败！");
				that.$("#res_message").text(that.options.msg);
			}else{
				that.$("#res_message").text(that.options.data.result.res_tip);
				that.$("#res_message").append('<a href="#" name="order_id" id="order_id" class="fwn">'+that.options.data.result.order_id+'</a>');
			}
			that.$("#order_id").click(function(){
	            var order_id = that.$("#order_id").text();
	            var viewURL = "modules/memberManageNew/orderQuery/views/OrderQueryView";
	            that.parentView.parentView.openView(viewURL,{order_id:order_id});
	        });
		}
	});
    return pageView;
});
