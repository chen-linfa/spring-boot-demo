define(["hbs!modules/fordemo/BApopup/templates/PullDown.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            $('.js-popover').popover({ placement: 'bottom', content: $('.pull-down').html(), html: true });
            that.$('.js-pagination').pagination({

            });
            that.$('.js-selectmenu').combobox();
            that.$('.js-check').icheck();
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        }

    });

    return components;
});
