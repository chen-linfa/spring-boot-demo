define(['hbs!modules/fordemo/main/templates/main.html',
        "modules/fordemo/indexPage/views/IndexView"],function(temp,IndexView) {
    var pageView = fish.View.extend({
        template: temp,
        className: "iot-page-wrap",
        initialize: function() {
            this.setView('.js-page-view',new IndexView());
        },
        events:{
            "click .js-sidebar-menu li.item a.link" :"openViewFn",
            "click .js-page-sub-sidebar ul.sidebar-menu li.item a.link":"openSubViewFn"
        },
        afterRender: function(){
            var that = this;
            var changeTem = that.$('.js-change-tem');
            var bBtn = true;

            changeTem.on('click',function(){
                var group = $('link');
                var timer;
                var dayCss = 'frm/fish-desktop/css/fish-iot.css';
                var nightCss = 'frm/fish-desktop/css/fish-iot-night.css';
                var dayTem = 'frm/template/css/template-iot.css';
                var nightTem = 'frm/template/css/template-night-iot.css';

                if(bBtn){

                    bBtn = false;

                    $('body').addClass('change-tem-animation');

                    if($('body').hasClass('change-tem-animation')){
                        group.each(function(index, el) {
                             if(group.eq(index).attr('href')=== dayCss){
                                changeTem.addClass('night-state');
                                group.eq(index).attr('href',nightCss);
                             }else if(group.eq(index).attr('href')===dayTem){
                                changeTem.addClass('night-state');
                                group.eq(index).attr('href',nightTem);
                             }else if(group.eq(index).attr('href')===nightCss){
                                changeTem.removeClass('night-state');
                                group.eq(index).attr('href',dayCss);
                            }else if(group.eq(index).attr('href')===nightTem){
                                changeTem.removeClass('night-state');
                                group.eq(index).attr('href',dayTem);
                            }
                        });
                        timer = setTimeout(function(){
                            $('body').removeClass('change-tem-animation');
                            clearTimeout(timer);
                            bBtn = true;
                        },1500);
                    }
                }
                return false
            });

		},
        openViewFn:function(e){
            var that = this;
            var menuItem = $(e.target).parent('.item');
            var menuURl = $(e.target).attr('href');
            var menuIdx = $(e.target).attr('menuChildIdx');
            var subMenu = that.$('.js-page-sub-sidebar');


            if(menuURl!=="#" && menuURl!==null){
                if(subMenu.is(':visible')){
                    subMenu.hide()
                };
                menuItem.addClass('activtead');
                menuItem.siblings('.item').removeClass('activtead');
                that.requireView({
                    selector: '.js-page-view',
                    url: menuURl
                });
            }else if(menuIdx!==undefined && menuIdx!==''){

                var subMenuUl = subMenu.find("[menuSubIdx="+menuIdx+"]");
                var subMenuItem = subMenuUl.find('li.item');
                var hasUrlArr = [];

                if(subMenu.is(':hidden')){
                    subMenu.show();
                }
                menuItem.addClass('activtead');
                menuItem.siblings('.item').removeClass('activtead');
                subMenuUl.show();
                subMenuUl.siblings().hide();

                subMenuItem.each(function(i){
                    var subMenuUrl = subMenuItem.eq(i).find('a.link').attr('href');
                    if(subMenuUrl != '' && subMenuUrl !== '#' && subMenuUrl !== null){
                        hasUrlArr.push([subMenuUrl,subMenuItem.eq(i).index()]);
                    }
                });

                subMenuItem.eq(hasUrlArr[0][1]).addClass('activtead');
                subMenuItem.eq(hasUrlArr[0][1]).siblings().removeClass('activtead');

                that.requireView({
                    selector: '.js-page-view',
                    url: hasUrlArr[0][0]
                });

            }else{
                if(subMenu.is(':visible')){
                    subMenu.hide()
                };
            }

            return false;
        },
        openSubViewFn:function(e){
            var that = this;
            var menuItem = $(e.target).parent('.item');
            var menuURl = $(e.target).attr('href');
            if(menuURl!=="#" && menuURl!==null){
                menuItem.addClass('activtead');
                menuItem.siblings('.item').removeClass('activtead');
                that.requireView({
                    selector: '.js-page-view',
                    url: menuURl
                });
            }
            return false
        }
	});
    return pageView;
});
