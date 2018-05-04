define(["hbs!../templates/select-group-pop.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            that.$('.js-combobox').combobox();
            
            that.loadGroupList();
            
            //确定按钮
            that.$("#btn_groupconfirm").click(function(){
                that.parentView.$("ul[name='send_show']").find('li').remove();
                var num = 0;
                that.$("#group_list").find("tr").each(function(){
                    if($(this).find('.js-check').icheck('isChecked')){
                    	var group_id = $(this).attr('group_id');
                        num++;
                        that.parentView.$("ul[name='send_show']").append("<li class='num-item' group_id='"+group_id+"'><span>"
                            +$(this).find('span[name="group_name"]').text()
                            +"</span><button class='num-del-btn' type='button'></button></li>");
                    }
                });
                if(num > 0) that.onClosePupup();
            });

        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        },
        loadGroupList:function(){
        	//加载成员组数据
        	var that = this;
        	that.$("#newgroup_form").hide();
        	that.$("#group_list").empty();
        	fish.callService("SmsController", "qryGroupData",{},function(data){
        		var result = data.result;
        		that.group_list = {};
        		if($.isArray(result)){
        			//group_id:group_name
        			_.each(result,function(item){
                        //console.log(item);
        				that.group_list[item.group_id] = item;
        				var $tr = that.$("#tab_template").find("tr").clone();
        				$tr.find(":checkbox").attr("value",item.group_id);
        				$tr.attr("group_id",item.group_id);
        				$tr.find("span[name]").each(function(){
        					var name = $(this).attr("name");
        					$(this).text(item[name]);
        				});
        				that.$("#group_list").append($tr);
        			});
        			that.$("#group_list").find(".js-check").icheck();
        			
        			
        		}
        		
        	});
        }
        
    });

    return components;
});
