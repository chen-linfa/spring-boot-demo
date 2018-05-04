define(["hbs!modules/formanage/BApopup/templates/EditProduct.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            that.$('.js-check').icheck();
            that.$('.js-search-tabs').tabs();
            that.$('.js-pagination').pagination({

            });
            that.$('.js-combobox').combobox();
            // 树图左
            var fNodes = [
                {
                    name: "自服务门户菜单", open: true,
                    children: [
                        {
                            name: "成员管理",
                            children: [

                            ]
                        },
                        {
                            name: "运营分析",
                            children: [

                            ]
                        },
                        {
                            name: "客户自助服务",
                            children: [

                            ]
                        },
                        {
                            name: "业务查询",
                            children: [

                            ]
                        },
                        {
                            name: "成员管理",
                            children: [

                            ]
                        },
                        {
                            name: "成员号码管理号理..",
                            children: [

                            ]
                        },
                        {
                            name: "成员添加",
                            children: [

                            ]
                        },
                        {
                            name: "成员删除",
                            children: [

                            ]
                        }
                    ]
                }
            ];
            var options = {
                fNodes: fNodes,
                view: {
                    formatter: function (node) {
                        var len = node.name.split(''),
                            str = node.name;
                        if (len.length > 15) {
                            str = node.name.slice(0, 14) + '...';
                        }
                        return str;
                    }
                },
                callback: {
                    beforeClick: function (e, treeNode, clickFlag) {
                        console.log("[beforeClick ] " + treeNode.name);
                    },
                    onClick: function (e, treeNode, clickFlag) {
                        console.log(treeNode);
                        console.log("[onClick ] clickFlag = " + clickFlag + " (" + (clickFlag === 1 ? "普通选中" : (clickFlag === 0 ? "<b>取消选中</b>" : "<b>追加选中</b>")) + ")");
                    },
                    onNodeCreated: function (e, treeNode) {
                        var id = this.id;
                        console.log("[onNodeCreated] " + id + " " + treeNode.name);
                    },
                    beforeDblClick: function (e, treeNode) {
                        console.log("[beforeDblClick] " + treeNode.name);
                    },
                    onDblClick: function (e, treeNode) {
                        console.log("[onDblClick] " + treeNode.name);
                    },
                    beforeMouseDown: function (e, treeNode) {
                        console.log("[beforeMouseDown] " + treeNode.name);
                    },
                    onMouseDown: function (e, treeNode) {
                        console.log("[onMouseDown] " + treeNode.name);
                    },
                    beforeMouseUp: function (e, treeNode) {
                        console.log("[beforeMouseUp] " + treeNode.name);
                    },
                    onMouseUp: function (e, treeNode) {
                        console.log("[onMouseUp] " + treeNode.name);
                    },
                    beforeRightClick: function (e, treeNode) {
                        console.log("[beforeRightClick] " + treeNode.name);
                    },
                    onRightClick: function (e, treeNode) {
                        console.log("[onRightClick] " + treeNode.name);
                    },
                    beforeCollapse: function (e, treeNode) {
                        console.log("[beforeCollapse] " + treeNode.name);
                    },
                    beforeExpand: function (e, treeNode) {
                        console.log("[beforeExpand] " + treeNode.name);
                    },
                    beforeSelect: function (e, treeNode, addFlag) {
                        console.log("[beforeSelect] " + treeNode.name + ' addFlag: ' + addFlag);
                    },
                    onSelect: function (e, treeNode, addFlag) {
                        console.log("[onSelect] " + treeNode.name + ' addFlag: ' + addFlag);
                    },
                },

            };

            $(".choosable-tree").on("tree:onnodecreated", function (e, treeNode) {
                var id = this.id;
                console.log(id + " tree:onnodecreated " + treeNode.name);
            });

            $(".choosable-tree").tree(options);


            $('.js-prev').on('click', function () {
                var nodes = $(".choosable-tree").tree("getSelectedNodes");
                if (nodes.length == 0) {
                    fish.info("请先选择一个节点");
                    return;
                }
                var preNode = nodes[0].getPreNode();
                if (preNode) {
                    fish.info("相邻的前一个节点：" + preNode.name);
                } else {
                    fish.info("无前一个相邻节点");
                }

            });

            $('.js-next').on('click', function () {
                var nodes = $(".choosable-tree").tree("getSelectedNodes");
                if (nodes.length == 0) {
                    fish.info("请先选择一个节点");
                    return;
                }
                var nextNode = nodes[0].getNextNode();
                if (nextNode) {
                    fish.info("相邻的后一个节点：" + nextNode.name);
                } else {
                    fish.info("无后一个相邻节点");
                }
            });
            //树图右

            var fNodes2 = [
                {
                    name: "自服务门户菜单", open: true,
                    children: [
                        {
                            name: "成员管理",
                            children: [

                            ]
                        },
                        {
                            name: "运营分析",
                            children: [

                            ]
                        },
                        {
                            name: "客户自助服务",
                            children: [

                            ]
                        },
                        {
                            name: "业务查询",
                            children: [

                            ]
                        },
                        {
                            name: "成员管理",
                            children: [

                            ]
                        },
                        {
                            name: "成员号码管理号理..",
                            children: [

                            ]
                        },
                        {
                            name: "成员添加",
                            children: [

                            ]
                        },
                        {
                            name: "成员删除",
                            children: [

                            ]
                        }
                    ]
                }
            ];
            var options2 = {
                fNodes: fNodes2,
                view: {
                    formatter: function (node) {
                        var len = node.name.split(''),
                            str = node.name;
                        if (len.length > 15) {
                            str = node.name.slice(0, 14) + '...';
                        }
                        return str;
                    }
                },
                callback: {
                    beforeClick: function (e, treeNode, clickFlag) {
                        console.log("[beforeClick ] " + treeNode.name);
                    },
                    onClick: function (e, treeNode, clickFlag) {
                        console.log(treeNode);
                        console.log("[onClick ] clickFlag = " + clickFlag + " (" + (clickFlag === 1 ? "普通选中" : (clickFlag === 0 ? "<b>取消选中</b>" : "<b>追加选中</b>")) + ")");
                    },
                    onNodeCreated: function (e, treeNode) {
                        var id = this.id;
                        console.log("[onNodeCreated] " + id + " " + treeNode.name);
                    },
                    beforeDblClick: function (e, treeNode) {
                        console.log("[beforeDblClick] " + treeNode.name);
                    },
                    onDblClick: function (e, treeNode) {
                        console.log("[onDblClick] " + treeNode.name);
                    },
                    beforeMouseDown: function (e, treeNode) {
                        console.log("[beforeMouseDown] " + treeNode.name);
                    },
                    onMouseDown: function (e, treeNode) {
                        console.log("[onMouseDown] " + treeNode.name);
                    },
                    beforeMouseUp: function (e, treeNode) {
                        console.log("[beforeMouseUp] " + treeNode.name);
                    },
                    onMouseUp: function (e, treeNode) {
                        console.log("[onMouseUp] " + treeNode.name);
                    },
                    beforeRightClick: function (e, treeNode) {
                        console.log("[beforeRightClick] " + treeNode.name);
                    },
                    onRightClick: function (e, treeNode) {
                        console.log("[onRightClick] " + treeNode.name);
                    },
                    beforeCollapse: function (e, treeNode) {
                        console.log("[beforeCollapse] " + treeNode.name);
                    },
                    beforeExpand: function (e, treeNode) {
                        console.log("[beforeExpand] " + treeNode.name);
                    },
                    beforeSelect: function (e, treeNode, addFlag) {
                        console.log("[beforeSelect] " + treeNode.name + ' addFlag: ' + addFlag);
                    },
                    onSelect: function (e, treeNode, addFlag) {
                        console.log("[onSelect] " + treeNode.name + ' addFlag: ' + addFlag);
                    },
                },

            };

            $(".choosen-tree").on("tree:onnodecreated", function (e, treeNode) {
                var id = this.id;
                console.log(id + " tree:onnodecreated " + treeNode.name);
            });

            $(".choosen-tree").tree(options);


            $('.js-prev').on('click', function () {
                var nodes = $(".choosen-tree").tree("getSelectedNodes");
                if (nodes.length == 0) {
                    fish.info("请先选择一个节点");
                    return;
                }
                var preNode = nodes[0].getPreNode();
                if (preNode) {
                    fish.info("相邻的前一个节点：" + preNode.name);
                } else {
                    fish.info("无前一个相邻节点");
                }

            });

            $('.js-next').on('click', function () {
                var nodes = $(".choosen-tree").tree("getSelectedNodes");
                if (nodes.length == 0) {
                    fish.info("请先选择一个节点");
                    return;
                }
                var nextNode = nodes[0].getNextNode();
                if (nextNode) {
                    fish.info("相邻的后一个节点：" + nextNode.name);
                } else {
                    fish.info("无后一个相邻节点");
                }
            });









        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        }
    });

    return components;
});
