define(["hbs!modules/fordemo/BApopup/templates/ChangeGroupPermissionTwo.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            that.$('.js-pagination').pagination({
               
            });
            that.$('.js-combobox').combobox();
            that.$('.js-search-tabs').tabs();
              that.$('.js-check').icheck();
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        }

    });

    return components;
});
