define(['hbs!../templates/tomcatController.html','frm/portal/portal'],
		function(temp) {
    var View = fish.View.extend({
        el:false,
        template: temp,
        datainterval:null,
        timeinterval:null,
        afterRender:function(){
        	this.init();
        	console.trace();
        },
        
        /**初始化*/
		init: function(){
			this.loadAllTomcat();
			//this.initEvent();
		},
		
		/**初始化事件*/
		initEvent: function(){
			var _self = this;
			//登录按钮点击事件
			$("#cust_list_div .btn-sm").click(function(){
				_self.login.call(_self);
			});
			this.offTomcat();
			this.onTomcat();
			this.flash();
			this.batchoff();
			this.batchon();
			this.batchflash();
		},
		offTomcat:function(){
			
			$("body").on("click","#offTomcat",function(data){
				var val=$(this).attr("name");
               
                params={"id":val,"state":"关闭"};
				fish.callService("TomcatController", "onAndoff", params, function(result){
                //Invoker.async("TomcatController", "onAndoff", params, function(result){
    				if(result.res_message="success"){
    					alert("正在执行中，请稍后刷新。");
    				}else if(result.res_message="error"){
    					alert("改变状态出错了");
    				}else{
    					alert("网络出错！");
    				}
    			});
			});
		},
		onTomcat:function(){
			
			$("body").on("click","#onTomcat",function(data){
				var val=$(this).attr("name");
				params={"id":val,"state":"开启"};
				fish.callService("TomcatController", "onAndoff", params, function(result){
				//Invoker.async("TomcatController", "onAndoff", params, function(result){
    				if(result.res_message="success"){
    					alert("正在执行中，请稍后刷新。");
    				}else if(result.res_message="error"){
    					alert("改变状态出错了");
    				}else{
    					alert("网络出错！");
    				}
    			});
			});
		},

		/**刷新状态*/
		flash:function(){
			$("body").on("click","#flashTomcat",function(data){
				var val=$(this).attr("name");
				params={"id":val};
				fish.callService("TomcatController", "flash", params, function(result){
				//Invoker.async("TomcatController", "flash", params, function(result){
					var _this = this;
					var params={"kai":"kai"};
					fish.callService("TomcatController", "allTomcat", params, function(result){
					//Invoker.async("TomcatController", "allTomcat", params, function(result){
						if(result.result_code="00000"){
							$("#tomcat_tbody").find("tr").remove();
							var s = parseInt(result.res_message);
							var num = i+1;
							for(var i=0;i<s;i++){
								var tb_tr = '<tr><td>'+'<input name="id" type="checkbox" value="'+result.result[i].id+'">'+'</td>'+
								'<td align="left">'+result.result[i].id+
								'</td><td  align="middle">'+result.result[i].tomcatname+
								'</td><td  align="middle">'+result.result[i].hostname+
								'</td><td  align="middle">'+result.result[i].othername+
								'</td><td  align="middle">'+result.result[i].state+
								'</td><td  align="middle">'+'<a href="javascript:void(0);" id="offTomcat" name="'+result.result[i].id+'">暂停</a>'+'--'+'<a href="javascript:void(0);" id="onTomcat" name="'+result.result[i].id+'">恢复</a>'+'--'+'<a href="javascript:void(0);" id="flashTomcat" name="'+result.result[i].id+'">刷新</a>'+
								'</td></tr>';
								$("#tomcat_tbody").append(tb_tr);
							}
						}else{
							alert("error");
						}
					});
	    			
    			});
			});
		},
		/**批量刷新*/
		batchflash:function(){
			$("body").on("click","#batch_flashtomcat",function(data){
				var spCodesTemp = "";
			      $('input:checkbox[name=id]:checked').each(function(i){
			       if(0==i){
			        spCodesTemp = $(this).val();
			       }else{
			        spCodesTemp += (","+$(this).val());
			       }
			      });
			      if(spCodesTemp==""){
			    	  alert("没有勾选刷新的Tomcat！");
			    	  return;
			      }
			      params = {codes:spCodesTemp};
				
				  fish.callService("TomcatController", "batchflash", params, function(result){
			     //Invoker.async("TomcatController", "batchflash", params, function(result){
						var _this = this;
						var params={"kai":"kai"};
						fish.callService("TomcatController", "allTomcat", params, function(result){
						//Invoker.async("TomcatController", "allTomcat", params, function(result){
							if(result.result_code="00000"){
								$("#tomcat_tbody").find("tr").remove();
								var s = parseInt(result.res_message);
								var num = i+1;
								for(var i=0;i<s;i++){
									var tb_tr = '<tr><td>'+'<input name="id" type="checkbox" value="'+result.result[i].id+'">'+'</td>'+
									'<td align="left">'+result.result[i].id+
									'</td><td  align="middle">'+result.result[i].tomcatname+
									'</td><td  align="middle">'+result.result[i].hostname+
									'</td><td  align="middle">'+result.result[i].othername+
									'</td><td  align="middle">'+result.result[i].state+
									'</td><td  align="middle">'+'<a href="javascript:void(0);" id="offTomcat" name="'+result.result[i].id+'">暂停</a>'+'--'+'<a href="javascript:void(0);" id="onTomcat" name="'+result.result[i].id+'">恢复</a>'+'--'+'<a href="javascript:void(0);" id="flashTomcat" name="'+result.result[i].id+'">刷新</a>'+
									'</td></tr>';
									$("#tomcat_tbody").append(tb_tr);
								}
								 
							}else{
								alert("error");
							}
						});
		    			
	    			});
			});
		},
		/**批量关闭*/
		batchoff:function(){
			$("body").on("click","#batch_ontomcat",function(data){
				var spCodesTemp = "";
			      $('input:checkbox[name=id]:checked').each(function(i){
			       if(0==i){
			        spCodesTemp = $(this).val();
			       }else{
			        spCodesTemp += (","+$(this).val());
			       }
			      });
			      params = {state:"关闭",codes:spCodesTemp};
				fish.callService("TomcatController", "batchOnAndOff", params, function(result){
				//Invoker.async("TomcatController", "batchOnAndOff", params, function(result){
    				if(result.res_message="success"){
    					alert("正在执行中，请稍后刷新。");
    				}else if(result.res_message="error"){
    					alert("改变状态出错了");
    				}else{
    					alert("网络出错！");
    				}
    			});
			});
		},
		/**批量开启*/
		batchon:function(){
			$("body").on("click","#batch_offtomcat",function(data){
				var spCodesTemp = "";
			      $('input:checkbox[name=id]:checked').each(function(i){
			       if(0==i){
			        spCodesTemp = $(this).val();
			       }else{
			        spCodesTemp += (","+$(this).val());
			       }
			      });
			    params = {state:"开启",codes:spCodesTemp};
				fish.callService("TomcatController", "batchOnAndOff", params, function(result){
    				if(result.res_message="success"){
    					alert("正在执行中，请稍后刷新。");
    					
    				}else if(result.res_message="error"){
    					alert("改变状态出错了");
    				}else{
    					alert("网络出错！");
    				}
    			});
			});
		},
	
		
		/**查询所有的tomcat*/
		loadAllTomcat: function(){
			var _this = this;
			var params={"kai":"kai"};
			
			fish.callService("TomcatController", "allTomcat", {}, function(result){
				if(result.result_code="00000"){
					$("#cust_list").find("tr:not(:first)").remove();
					var s = parseInt(result.res_message);
					var num = i+1;
					$("#tomcat_tbody").empty();
					for(var i=0;i<s;i++){
						var tb_tr = '<tr><td>'+'<input name="id" type="checkbox" value="'+result.result[i].id+'">'+'</td>'+
						'<td align="middle">'+result.result[i].id+
						'</td><td  align="middle">'+result.result[i].tomcatname+
						'</td><td  align="middle">'+result.result[i].hostname+
						'</td><td  align="middle">'+result.result[i].othername+
						'</td><td  align="middle">'+result.result[i].state+
						'</td><td  align="middle">'+'<a href="javascript:void(0);" id="offTomcat" name="'+result.result[i].id+'">暂停</a>'+'--'+'<a href="javascript:void(0);" id="onTomcat" name="'+result.result[i].id+'">恢复</a>'+'--'+'<a href="javascript:void(0);" id="flashTomcat" name="'+result.result[i].id+'">刷新</a>'+
						'</td></tr>';
						/**$("#tomcat_tbody").empty();*/
						$("#tomcat_tbody").append(tb_tr);
					}
					_this.initEvent();
				}else{
					alert("error");
				}
			});
		}
    });
    return View;
});