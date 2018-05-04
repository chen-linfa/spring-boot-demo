define(['hbs!modules/formanage/equipmentAlarmInquire/templates/equipmentAlarmInquire.html',
    "frm/template/party/echarts.min"], function (temp, echarts) {
        var pageView = fish.View.extend({
            template: temp,
            afterRender: function () {
                var that = this;
                that.$('.js-date').datetimepicker();
                that.$('.js-selectmenu').combobox();
                that.$('.js-check').icheck();
                that.$('.js-clearable').clearinput();
                that.$('.js-pagination').pagination({
                    records: 100
                });
            }
        });
        return pageView;
    });
