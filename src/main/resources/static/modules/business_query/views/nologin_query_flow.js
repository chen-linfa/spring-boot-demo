fish.View.configure({manage: true, syncRender:true}); //全局设置fish使用扩展的功能
fish.setLanguage('zh'); //设置国际化语音
require(['./usg_current_query'], function(pageView){
	new pageView({
		el : $('#flow_main') //主视图选择器
	}).render();
 });