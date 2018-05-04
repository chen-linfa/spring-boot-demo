define(['hbs!modules/fordemo/userUsesTheSituationAlarmConfiguration/templates/userUsesTheSituationAlarmConfiguration.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                that.$('.js-pagination').pagination({
                    records: 100
                });
                 that.$('.js-dropdownMenu2').dropdown();
            }
        });
        return pageView;
    });
