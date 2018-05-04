define(['hbs!modules/formanage/main/templates/main.html',
        "modules/formanage/indexPage/views/IndexView"],function(temp,IndexView) {
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
