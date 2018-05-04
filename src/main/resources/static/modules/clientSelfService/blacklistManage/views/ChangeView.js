define(["hbs!../templates/Change.html"
], function (temp) {
	var Validate = {
			//校验数据
			validate: function(jqdom){
				
				var me = this;
				var result = new Boolean(true);
				//校验是否为空,nullable='0'不能为空
				jqdom.find("input[nullable='0'],textarea[nullable='0']").each(function(index,ele){
					
					var tagName = $(ele).attr("tagName");
					if($(ele).hasClass("input_selectValue")){//select
						if($(ele).val()==""){
							var null_tip = $(ele).attr("null_tip");
							if(null_tip!=null&&null_tip!=""){
								 layer.alert(null_tip);
								result = false;
								return false;
							}
						}
					}else{//input
						if($(ele).val()==""){
							var null_tip = $(ele).attr("null_tip");
							if(null_tip!=null&&null_tip!=""){
								layer.alert(null_tip);
								result = false;
								return false;
							}
						}
					}
				});
				
				//校验是否符合正则表达式
				jqdom.find("input[regexp],textarea[regexp]").each(function(index,ele){
					
					if(!result){
						return false;
					}
					var tagName = $(ele).attr("tagName");
					if($(ele).hasClass("input_selectValue")){//select
						
					}else{//input
						if($(ele).val()!=""){
							
							var apregex = $(ele).attr("regexp");  
							apregex = me.regex[apregex];
		        			var patt=new RegExp(apregex);
					        var r = patt.test($(ele).val());
					        if(!r){
					        	var reg_tip=$(ele).attr("reg_tip");
					            layer.alert(reg_tip); //
					            result = false;
								return false;
					        }
						}
					}
				});
				
				return result;
			},
			
			
			regex: {
	        	"number":/^[0-9]*$/,
	        	"phone":/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/,
	        	"email":/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/,
	        	"idcard":/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
	        	"name":/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/,
	        	"numberCode":/^[0-9a-zA-Z]*$/,
	        	"password":/^\w{4,20}$/,
	        	"money":/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
	        	"ip":/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
	        },
	        
	        
	};		
	    var list_id = 0;
	    var components = fish.View.extend({
	        //el: false,
	        template: temp,
	    	detailframe:false,
	    	addframe:false,
	    	hasadd:false,
	    	ifadd : false,
	    	editmode : false,
	    	noreload : false,
	        events:{
	        	//"click .js-close-popup": "onClosePupup",
	            "click #submit_btn" : "onSubmit",
	            "click #cancle_btn" : "onClosePupup"
	        },
	        afterRender: function() {
	            var that = this;
	            var height = parseInt(window.innerHeight * 0.7) - that.$('.modal-header').height()
	                         - that.$('.modal-footer').height();
	            that.$('.modal-body').css({
	                "max-height":height,
	                "overflow":"auto"
	            });
	            this.$('#btn_query').click(function(){
	                that.popViewFunction();
	            	//that.Utils.layerOpen("modules/clientSelfService/blacklistManage/views/AddPopupSelectView");
	            });
	            if(!that.edimode){
	            	$("#submit_btn").html("修 改");
	            	$("#comments").addClass("disabled");
	            	that.editmode=true;
	            	
	            	
	            }
	        },
	        onClosePupup: function(){
	        	//this.trigger("editview.close");
	        	this.popup.close();
	        },
	        //提交
	        onSubmit:function(){
	        	var that = this;
	        	
				if(that.ifadd&&!that.editmode){
					
					var msisdn = $("#msisdn").val();
					layer.confirm("确定要把"+msisdn+"加入黑名单？",{yes:function(){
						//新增操作
						param.cust_id=$("#msisdn").attr("cust_id");

						that.addSmsBW(param);
						that.editmode=false;
					}});
				}
				if(that.editmode){//保存
					//点击修改

					that.editmode = false;
					that.ifadd = false;
					$("#submit_btn").html("保 存");
					$('#comments').attr("disabled",false);
			
				}else{
					if(!Validate.validate($("#bw_detail"))){
						return;
					}
					that.noreload = true;//$().form("value")
					var param = that.$("#bw_detail").form("value");
					
				
					
					if(!that.ifadd){//修改操作
						param.list_id=$("#comments").attr("list_id");
						
						that.updateSmsBW(param);
						that.editmode=true;
					}else{//新增操作
						/*param.cust_id=$("#msisdn").attr("cust_id");
						window.SMSBlankWhiteManage.addSmsBW(param);
						window.SMSBlankWhiteManage.editmode=false;*/
					}
					
					this.popup.close();
				}      
	        },
	    	updateSmsBW:function(param){
	    		//锁定按钮避免多次点击
	    		var me = this;
	    		$("#submit_btn").addClass("disabled");
	    		$("#submit_btn").html("提交中");
	    		console.log(param);
	    		param.list_id=me.list_id;
	    	
	    		fish.callService("SmsController","smsBWUpdate",param,function(result){
	    			$("#submit_btn").removeClass("disabled");
	    			console.log(result);
	    			console.log(result.res_code);
	    			if(result && result.res_code == "00000"){
	    				
	    				me.editmode = true;
	    				layer.alert("修改成功！");
						var data={
								update: true,
						}
					
						me.parentView.loadData(data);	    				
	    				//me.setTableDisable(false,$("#bw_detail"));
	    				$('#comments').attr("disabled",true);
	    				$("#submit_btn").html("修 改");
	    				//me.cancelPanel(true);
	    				me.popup.close();
	    			}else{
	    				$('#comments').attr("disabled",true);
	    			}
	    		});
	    	},
	    	//新增短信网关
	    	addSmsBW:function(param){
	    		//锁定按钮避免多次点击
	    	
	    		var me = this;
	    		param.comments=me.$("#comments").val();
	    		$("#submit_btn").addClass("disabled");
	    		$("#submit_btn").html("提交中");
	    		fish.callService("SmsController","smsBWAdd",param,function(result){
	    			$("#submit_btn").removeClass("disabled");
	    			$("#submit_btn").html("保 存");
	    			if(result && result.res_code == "00000"){
	    				me.editmode = false;
	    				layer.alert("新增成功！");
	    				me.popup.close();
	    				
	    			}else{
	    			}
	    		});
	    	},
	        popViewFunction: function () {
	        	var that=this;
	            fish.popupView({
	                url: "modules/clientSelfService/blacklistManage/views/AddPopupSelectView",
	                width: 600,
	                
	                callback:function(popup, view) {
	                    view.parentView = that;
	                }

	                
	            });
	        },
        	loadData:function(data){
        		var that=this;
        		that.$("#msisdn").val(data.msisdn)
        		that.$("#comments").val(data.comments)
        		that.list_id  = data.list_id;
        		that.ifadd = false;
        		
        	},
        	
        	getInputDomain : function(context) {
        		var iv = {}, me = this;
        		context = context || $("body");
        		if (typeof (context) == "string")
        			context = $("#" + context);
        		$("input[type='checkbox'][fieldType='db']:checked", context).each(
        				function() {
        					var $obj = $(this);
        					var ivId = $obj.attr("dbField") || $obj.attr("name");
        					// 真值
        					var ivVal = $obj.val();
        					me.setObjVal(iv, ivId, ivVal);
        					// 显示值
        					var ivValDesc = $obj.attr("cname");
        					me.setObjVal(iv, ivId + "_desc", ivValDesc);
        				});

        		// text
        		$("input[type='text'][fieldType='db']", context).each(function() {
        			var $obj = $(this);
        			var ivId = $obj.attr("dbField") || $obj.attr("id");
        			var ivVal = $obj.val();
        			me.setObjVal(iv, ivId, ivVal);

        		});
        		$("input[type='password'][fieldType='db']", context).each(function() {
        			var $obj = $(this);
        			var ivId = $obj.attr("dbField") || $obj.attr("id");
        			var ivVal = $obj.val();
        			me.setObjVal(iv, ivId, ivVal);

        		});

        		// hidden
        		$("input[type='hidden'][fieldType='db']", context).each(function() {
        			var $obj = $(this);
        			var ivId = $obj.attr("dbField") || $obj.attr("id");
        			var ivVal = $obj.val();
        			me.setObjVal(iv, ivId, ivVal);
        		});

        		// select
        		$("[fieldType='db']select option:selected", context).each(
        				function() {
        					var $obj = $(this);
        					var ivId = $obj.parent().attr("dbField")
        							|| $obj.parent().attr("id");
        					// 真值
        					var ivVal = $obj.val();
        					me.setObjVal(iv, ivId, ivVal);
        					// 显示值
        					var ivValDesc = $obj.text();
        					me.setObjVal(iv, ivId + "_desc", ivValDesc);

        				});
        		// textarea
        		$("textarea[fieldType='db']", context).each(function() {
        			var $obj = $(this);
        			var ivId = $obj.attr("dbField") || $obj.attr("id");
        			// 真值
        			var ivVal = $obj.val();
        			me.setObjVal(iv, ivId, ivVal);
        		});

        		$("span[fieldType='db']", context).each(function() {
        			var $obj = $(this);
        			var ivId = $obj.attr("dbField") || $obj.attr("id");
        			// 真值
        			var ivVal = $obj.text();

        			me.setObjVal(iv, ivId, ivVal);

        		});
        		$("a[fieldType='db']", context).each(function() {
        			var $obj = $(this);
        			var ivId = $obj.attr("dbField") || $obj.attr("name");
        			// 真值
        			var ivVal = $obj.attr("value");
        			me.setObjVal(iv, ivId, ivVal);

        		});
        		// radio
        		$("input[type='radio'][fieldType='db']:checked", context).each(
        				function() {
        					var $obj = $(this);
        					var ivId = $obj.attr("dbField") || $obj.attr("name");
        					// 真值
        					var ivVal = $obj.val();

        					me.setObjVal(iv, ivId, ivVal);
        					// 显示值
        					var ivValDesc = $obj.next("span").text();
        					me.setObjVal(iv, ivId + "_desc", ivValDesc);
        				});
        		// select
        		$("div.inp-select[fieldType='db']", context).each(
        				function() {
        					var $obj = $(this);
        					var ivId = $obj.attr("dbField") || $obj.attr("name");
        					var ivVal = $obj.find("input.input_selectValue").val();
        					me.setObjVal(iv, ivId, ivVal);
        				});
        		return iv;
        	},
	        add_popup:function(){
	            var that = this;
	            fish.popupView({
	                url:"modules/clientSelfService/blacklistManage/views/AddPopupSelectView",
	                width:400,
	                callback:function(popup, view) {
	                    view.parentView = that;
	                }
	            });
	        },		
	        initData:function(params){
	            var that = this;
	        
	            that.data = params;
	            var unitCode;
	            if(params.men_type=='1'){
	                unitCode = "FLOW_UTIL";
	            }else if(params.men_type=='2'){
	                unitCode = "MESSAGE_UTIL";
	            }else if(params.men_type=='3'){
	                unitCode = "VOICE_UTIL";
	            }
	            //初始化comboxbox下拉框
	            that.$addMenType = that.$("#add_men_type").combobox({
	                attr_code:"MEM_TYPE"
	            });
	            that.$addRestrictType = that.$("#add_restrict_type").combobox({
	                attr_code:"LIMIT_TYPE"
	            });
	            that.$addUnit = that.$("#add_unit").combobox({
	                attr_code:unitCode
	            });
	            that.$addStausCd = that.$("#add_status_cd").combobox({
	                attr_code:"STATUS_CD"
	            });
	            //初始化下拉框里面数值
	            that.$addMenType.combobox("value",params.men_type);
	            that.$addRestrictType.combobox("value",params.restrict_type);
	            that.$addUnit.combobox("value",params.unit);
	           
	            that.$addStausCd.combobox("value",params.status_cd);
	        }
	    });
	    return components;
	});
