!function(){
	"use strict";
	
	var feature = {};
    feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
    feature.formdata = window.FormData !== undefined;
    
	//重载表格
	$.widget("ui.form",$.ui.form,{
		//改写获取值方法，弥补控件取值导致的问题
		formToArray:function(){
           var a = [];
            if (this.length === 0) {
                return a;
            }

            var form = this.element[0];
            var els = form.elements;
            var elements;

            if (!els || !els.length) {
                return a;
            }

            var i, j, n, v, el, max, jmax;
            for (i = 0, max = els.length; i < max; i++) {
                el = els[i];
                n = el.name;
                //      if (!n || el.disabled) {
                //        continue;
                //      }
                if (!n) {
                    continue;
                }

                v = $.fieldValue(el, true);
                var widget = $.data(el, "formfield"); //目前没有处理控件组(如icheck控件)的概念
                if (widget) {
                    var value = widget._formGetValue(); //需要有返回值
                    if (!_.isUndefined(value)) {
                        v = value;
                    }
                }
                if (v && v.constructor == Array) {
                    if (elements) {
                        elements.push(el);
                    }
                    for (j = 0, jmax = v.length; j < jmax; j++) {
                        a.push({
                            name: n,
                            value: v[j]
                        });
                    }
                } else if (feature.fileapi && el.type == 'file') {
                    if (elements) {
                        elements.push(el);
                    }
                    var files = el.files;
                    if (files.length) {
                        for (j = 0; j < files.length; j++) {
                            a.push({
                                name: n,
                                value: files[j],
                                type: el.type
                            });
                        }
                    } else {
                        // #180
                        a.push({
                            name: n,
                            value: '',
                            type: el.type
                        });
                    }
                } else if (v !== null && typeof v != 'undefined') {
                    if (elements) {
                        elements.push(el);
                    }
                    a.push({
                        name: n,
                        value: v,
                        type: el.type,
                        required: el.required
                    });
                }
            }

            if (form.clk) {
                // input type=='image' are not found in elements array! handle it here
                var $input = $(form.clk),
                    input = $input[0];
                n = input.name;
                if (n && input.type == 'image') { //&& !input.disabled
                    a.push({
                        name: n,
                        value: $input.val()
                    });
                    a.push({
                        name: n + '.x',
                        value: form.clk_x
                    }, {
                        name: n + '.y',
                        value: form.clk_y
                    });
                }
            }
            return a;
		}
	});
}();