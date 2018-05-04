!function () {
    "use strict";

    $.widget("ui.pagination",$.ui.pagination,{
	    _create : function () {
	        this._super();
	        //增加了样式
	        $.extend(this.options, {
	            'pgtextClass': 'pgtext hidden-xs hidden-sm',
	            'pgrectextClass': 'pgtext hidden-xs hidden-sm'
	        });
	    },
	    _setupAddEvents: function() {
            var base = this;
            this._on({
                'change .ui-pagination': function(e) {
                    base.options.rowNum = parseInt($(e.currentTarget).val(), 10);
                    var eventData = {
                        eventType: 'select',
                        rowNum: base.options.rowNum,
                        page: 1
                    };
                    if (base._trigger('onPageClick', e, eventData)) {
                        base._show(1);
                    }
                },
                'keydown .ui-pagination-input': function(e) {
                    var key = e.which; //按键的值
                    var $this = $(e.currentTarget), value;
                    if (key == 13) {
                        value = base._intNum($this.val(), 1);
                        value = Math.max(1, Math.min(base.options.totalPages, value));
                        $this.val(value);

                        var eventData = {
                            eventType: 'input',
                            rowNum: base.options.rowNum,
                            page: parseInt($this.val(),10)
                        };
                        if (base._trigger('onPageClick', e, eventData)) {
                            base._show(parseInt($this.val(), 10));
                        }
                    }
                }
            });
        }
    });
}();