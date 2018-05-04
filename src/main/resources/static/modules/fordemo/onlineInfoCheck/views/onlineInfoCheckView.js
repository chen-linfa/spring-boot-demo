define(['hbs!modules/fordemo/onlineInfoCheck/templates/onlineInfoCheck.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                that.$('.js-progressbar1').progressbar({
                     value: 20
                });
                that.$('.js-pagination').pagination({
                    records: 100
                });
            }
        });
        return pageView;
    });
