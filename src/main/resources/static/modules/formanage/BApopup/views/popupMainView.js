define(["hbs!../templates/popup-main.html",
    "css!../../../../../template/default/business/css/business-bss-web.css"
], function (temp, subSearchFormView, subOraderPanelView, subOrderInfoView) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-add-warn-configure": "onAddWarnConfigure",
            "click .js-edit-product": "onEditProduct",
            "click .js-new-role": "onNewRole",
            "click .js-new-relate-role": "onNewRelateRole",
            "click .js-new-menu": "onNewMenu",
            "click .js-user-detail": "onUserDetail",
            "click .js-user-detail-two": "onUserDetailTwo",
            "click .js-new-notice": "onNewNotice",
            "click .js-group-member-info": "onGroupMemberInfo",
            "click .js-change-group-member-info": "onChangeGroupMemberInfo",
            "click .js-terminal-info-enter": "onTerminalInfoEnter"



        },
        afterRender: function () {
        },
        onAddWarnConfigure: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/AddWarnConfigureView",
                width: 400,
            });
        },
        onEditProduct: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/EditProductView",
                width: 600,
            });
        },
        onNewRole: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/NewRoleView",
                width: 400,
            });
        },
        onNewRelateRole: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/NewRelateRoleView",
                width: 600,
            });
        },
        onNewMenu: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/NewMenuView",
                width: 400,
            });
        },
        onUserDetail: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/UserDetailView",
                width: 600,
            });
        },
        onUserDetailTwo: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/UserDetailTwoView",
                width: 600,
            });
        },
        onNewNotice: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/NewNoticeView",
                width: 600,
            });
        },
        onGroupMemberInfo: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/GroupMemberInfoView",
                width: 400,
            });
        },
        onChangeGroupMemberInfo: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/ChangeGroupMemberInfoView",
                width: 400,
            });
        },
        onTerminalInfoEnter: function () {
            fish.popupView({
                url: "modules/formanage/BApopup/views/TerminalInfoEnterView",
                width: 400,
            });
        }



    });

    return components;
});
