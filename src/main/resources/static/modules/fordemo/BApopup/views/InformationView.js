define(["hbs!modules/fordemo/BApopup/templates/Information.html"
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
        },
        onClosePupup: function () {
            this.trigger("editview.close");
            this.popup.close();
        }

    });

    return components;
});
