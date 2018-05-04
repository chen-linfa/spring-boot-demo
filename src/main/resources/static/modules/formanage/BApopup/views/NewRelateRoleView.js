define(["hbs!modules/formanage/BApopup/templates/NewRelateRole.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            that.$('.js-selectmenu').combobox();
            that.$('.js-check').icheck();
            that.$('.js-pagination').pagination({
                records: 100,
                rowList: [],
                pgTotal: false,
                pgInput: false,
                pgNumber: false,
                pgRecText: false
            });
            that.$('.js-combobox').combobox();


            var fNodes = [
                {
                    name: "公司", open: true,
                    children: [
                        {
                            name: "浦东",
                            children: [

                            ]
                        },
                        {
                            name: "崇明",
                            children: [

                            ]
                        },
                        {
                            name: "集团客户部",
                            children: [

                            ]
                        },
                        {
                            name: "代理",
                            children: [

                            ]
                        },
                        {
                            name: "其他",
                            children: [

                            ]
                        },
                        {
                            name: "选项一",
                            children: [

                            ]
                        },
                        {
                            name: "选项一",
                            children: [

                            ]
                        },
                        {
                            name: "选项一",
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

            $(".company-tree").on("tree:onnodecreated", function (e, treeNode) {
                var id = this.id;
                console.log(id + " tree:onnodecreated " + treeNode.name);
            });

            $(".company-tree").tree(options);


            $('.js-prev').on('click', function () {
                var nodes = $(".company-tree").tree("getSelectedNodes");
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
                var nodes = $(".company-tree").tree("getSelectedNodes");
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
