define(['hbs!modules/fordemo/memberAdd/templates/memberAdd.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-selectmenu').combobox();
                that.$('.js-date').datetimepicker();
                that.$('.js-pagination').pagination({
                    records: 100
                });
            }
        });
        return pageView;
    });
