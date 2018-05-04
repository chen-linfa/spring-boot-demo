define(["hbs!../templates/popup-main.html"], function (temp, subSearchFormView, subOraderPanelView, subOrderInfoView) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-compile-app": "onCompileApp",
            "click .js-change-group-permission": "onChangeGroupPermission",
            "click .js-change-configure": "onChangeConfigure",
            "click .js-flow-day-data": "onFlowDaydata",
            "click .js-information": "onInformation",
            "click .js-configure-member": "onConfigureMember",
            "click .js-select-group": "onSelectGroup",
            "click .js-change-account": "onChangeAccount",
            "click .js-new-account": "onNewAccount",
            "click .js-change-group-permission-two": "onChangeGroupPermissionTwo",
            "click .js-pull-down": "onPullDown"
        },
        afterRender: function () {

        },
        onCompileApp: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/CompileAppView",
                width: 400,
            });
        },
        onChangeGroupPermission: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/ChangeGroupPermissionView",
                width: 600,
            });
        },
        onChangeConfigure: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/ChangeConfigureView",
                width: 400,
            });
        },
        onFlowDaydata: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/FlowDaydataView",
                width: 600,
            });
        },
        onInformation: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/InformationView",
                width: 400,
            });
        },
        onConfigureMember: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/ConfigureMemberView",
                width: 400,
                height: 405
            });
        },
        onSelectGroup: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/SelectGroupView",
                width: 400,
                height: 405
            });
        },
        onChangeAccount: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/ChangeAccountView",
                width: 400,

            });
        },
        onNewAccount: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/NewAccountView",
                width: 400,

            });
        },
        onChangeGroupPermissionTwo: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/ChangeGroupPermissionTwoView",
                width: 400,

            });
        },
        onPullDown: function () {
            fish.popupView({
                url: "modules/fordemo/BApopup/views/PullDownView",
                width: 200,

            });
        }


    });

    return components;
});
