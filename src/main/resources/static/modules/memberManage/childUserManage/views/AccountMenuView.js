define(["hbs!../templates/accountmenu.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        loadData:function(data){
        	
        },
        afterRender: function () {
            var that = this;
            var choosable_options = {
                //fNodes: fNodes,
                view: {
                    formatter: function (node) {
                        var len = node.name.split(''),
                            str = node.name;
                        if (len.length > 15) {
                            str = node.name.slice(0, 14) + '...';
                        }
                        return str;
                    },
                    addHoverDom: fish.bind(that.addHoverDom,that),
                    removeHoverDom: fish.bind(that.removeHoverDom,that)
                },
                callback:{
                	onAsyncSuccess:function(event, treeId,treeNode, msg) {
                		//重复展开所有节点
                		that.$(".choosable-tree").tree("expandAll",true);
					},
                	beforeClick:function(){return false;}
                },
                async: {
					enable: true,
					url: "HomeController.getChildPortalMenus",
					autoParam: ["menu_id", "menu_name"]
				},
				data: {
					key: {
						name: "menu_name"
					},
					simpleData: {
						enable:true,
						idKey: "menu_id",
						pIdKey: "parent_id"
					}
				},

            };
            
            var choosen_options = {
                //fNodes: fNodes,
                view: {
                    formatter: function (node) {
                        var len = node.name.split(''),
                            str = node.name;
                        if (len.length > 15) {
                            str = node.name.slice(0, 14) + '...';
                        }
                        return str;
                    },
                    addHoverDom: fish.bind(that.addChosenHoverDom,that),
                    removeHoverDom: fish.bind(that.removeHoverDom,that)
                },
                callback:{
                	beforeClick:function(){return false;}
                },
				data: {
					key: {
						name: "menu_name"
					},
					simpleData: {
						enable:true,
						idKey: "menu_id",
						pIdKey: "parent_id"
					}
				},

            };

            that.$(".choosable-tree").tree(choosable_options);
            
            
            that.$(".choosen-tree").tree(choosen_options);
            
            that.$("#btn_confirm").click(function(){
            	that.saveMenus();
            });
            
            //如果有用户ID，说明是修改模式
            if(that.options.user_id){
            	fish.callService("SPUserController", "querySPUserPrivilegeList", {user_id:that.options.user_id}, function(result){
					if(result.res_code == '00000'){
						if(result.result){
							result.result.unshift({menu_id:-3,menu_name:"自服务门户菜单",isParent:true});
							that.$(".choosen-tree").tree("reloadData",result.result);
							that.$(".choosen-tree").tree("expandAll",true);
						}
					}
				});	
            }
        },
        saveMenus:function(){
        	var that = this;
        	var param = {};
        	param.user_id = that.options.user_id;
        	param.menuList = [];
        	var $selmenuTree = that.$(".choosen-tree");
			var selMenus = $selmenuTree.tree("transformToArray",$selmenuTree.tree("getNodes"));
			if(selMenus.length>0){
				$.each(selMenus,function(i,menu){
					if(menu.menu_id != '' && menu.menu_id != '-3'){
						param.menuList.push(menu.menu_id);
					}
				});
			}

        	fish.callService("SPUserController", "updateChildSPUserPrivilege",param,function(result){
	        	if(result.res_code == "00000"){
					layer.alert("操作成功！");
					that.popup.close();
				}
				else{
					layer.alert(result.res_message);
				}
        	});
        },
        addHoverDom:function(treeNode){
        	var that = this;
        	var aObj = that.$(".choosable-tree").find("#" + treeNode.tId + "_a");
        	if (that.$(".choosable-tree").find("#diyBtn_"+treeNode.id).length>0) 
        		return;
	        var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' >&nbsp;</span><span class='ico-append' id='diyBtn_" +treeNode.id+ "' title='添加该项到已选列表中' onfocus='this.blur();'></span>";
	        aObj.append(editStr);
	        var btn = that.$(".choosable-tree").find("#diyBtn_"+treeNode.id);
	        if (btn){
	        	btn.bind("click", function(){
	        		that.addChosenMenu(treeNode);
	        	});
	        }
        },
        addChosenMenu:function(selnode){
        	var that = this;
        	//从可选菜单移到已选菜单
        	var menutree = that.$(".choosable-tree");
			var seltree = that.$(".choosen-tree");
				var nodes = seltree.tree("transformToArray",seltree.tree("getNodes"));
				var selnode_array = menutree.tree("transformToArray",selnode);
				for(var i=0;i<nodes.length;i++){
					//移除已经选中过的节点
					for(var j=0;j<selnode_array.length;j++)
					{
						if(nodes[i].menu_id == selnode_array[j].menu_id){
							seltree.tree("removeNode",nodes[i]);
						}
					}
				}
				//从根节点开始复制节点树
				var parentnode = [];
				var node = $.extend({},selnode);
				while(node){
					node = node.getParentNode();
					if(node){
						var newnode = {};
						newnode.menu_id = node.menu_id;
						newnode.menu_name = node.menu_name;
						parentnode.push(newnode);
					}
				}
				parentnode.reverse();
				var last_id = null;
				var parent_check = [];
				if(parentnode.length > 0)
				{
					//如果有父目录结构则进行组装父目录路径的操作
					last_id = parentnode[0].menu_id;
					for(i=1;i<parentnode.length;i++){
						parentnode[i].parent_id = parentnode[i-1].menu_id;
						last_id = parentnode[i].menu_id;
					}
					parent_check = seltree.tree("getNodesByParam","menu_id", parentnode[0].menu_id);
				}
				
				var parent_treenode = null;
				while(parentnode.length>0 && parent_check.length > 0){
					parent_treenode = parent_check[0];
					parentnode.splice(0,1);
					if(parentnode.length > 0)
					{
						parent_check = seltree.tree("getNodesByParam","menu_id", parentnode[0].menu_id);
					}
				}
				
				if(parentnode.length>0)
				{
					//如果所选节点的父目录路径在页面右侧已选择目录树中不完整，则进行补全
					seltree.tree("addNodes",parent_treenode,parentnode);
				}
				//将目前选中的节点添加到已选择目录树中
				var n = seltree.tree("getNodesByParam","menu_id", last_id)[0];
				seltree.tree("copyNode",n,selnode,"inner");
        },
        removeHoverDom:function(treeNode){
        	var that = this;
        	that.$("#diyBtn_"+treeNode.id).unbind().remove();
        	that.$("#diyBtn_space_" +treeNode.id).unbind().remove();
        },
        addChosenHoverDom:function(treeNode){
        	var that = this;
        	var aObj = that.$(".choosen-tree").find("#" + treeNode.tId + "_a");
        	if (that.$(".choosen-tree").find("#diyBtn_"+treeNode.id).length>0) 
        		return;
	        var editStr = "<span id='diyBtn_space_" +treeNode.id+ "' >&nbsp;</span><span class='ico-delete' id='diyBtn_" +treeNode.id+ "' title='从已选列表中删除' onfocus='this.blur();'></span>";
	        aObj.append(editStr);
	        var btn = that.$(".choosen-tree").find("#diyBtn_"+treeNode.id);
	        if (btn){
	        	btn.bind("click", function(){
	        		that.$(".choosen-tree").tree("removeNode",treeNode);
	        	});
	        }
        },
        onClosePupup: function () {
            this.popup.close();
        }
});

return components;
});
