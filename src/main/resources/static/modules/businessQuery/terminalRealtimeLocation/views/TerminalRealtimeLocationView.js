define(['hbs!../templates/terminalRealtimeLocation.html',
        "./MapUtils",
        "http://223.100.246.29:9091/SDKService/jssdk/auth?v=1.0&key=dcc93452f8d8bc6f4a7c00f6613196b1"],function(temp) {
    var pageView = fish.View.extend({
        template: temp,
        map : null,
		batchId :"", //请求批次ID
		defLng: 116.368904,  //默认打开的地图经度坐标
		defLat: 39.833823,   //默认打开的地图纬度坐标
		defZoom:14  ,   //默认地图的缩放级别
		colors:{
			red :'map-sign-red-ico',
			org :'map-sign-org-ico',
			black :'map-sign-black-ico',
			purple :'map-sign-purple-ico',
			yellow :'map-sign-yellow-ico',
			blue :'map-sign-blue-ico',
			green :'map-sign-green-ico',
		},
        afterRender: function(){
            var that = this;
            that.mapInit();
            
            that.$("#btn_search").click(function(){
            	var msisdn = that.$("input[name=msisdn]").val();
            	that.searchDevice(msisdn);
            });
            //过滤非法的卡号输入值
			that.$('#msisdn').bind({
				keyup:function(){
					this.value=this.value.replace(/\D/g,'');
				}
			});
		},
		searchDevice:function(msisdn){
			var that = this;
			
			if(!msisdn){
				layer.alert("请输入卡号！");
				return;
			}
			
			//清空地图上的坐标
			that.clearAll();
			fish.callService("LocationController", "queryMemLocation",{msisdn:msisdn,mem_user_id:''},function(replay) {
				if ("00000" == replay.res_code) {
					//成功则初始化地图
					var markerObjs = replay.result;
					//记录下当前请求批次
					if($.isArray(markerObjs)){	
						$.each(markerObjs,function(i,marker){
							if(marker.loc_desc == null || marker.loc_desc == 'null'){
								marker.loc_desc = '';
							}
							if(marker.mem_user_name == null || marker.mem_user_name == 'null'){
								marker.mem_user_name = '';
							}
							if(marker.msisdn == null || marker.msisdn == 'null'){
								marker.msisdn = '';
							}
							if(marker.iccid == null || marker.iccid == 'null'){
								marker.iccid = '';
							}
						});
					}
					that.drawMarker(markerObjs);
				}else{
					layer.alert(replay.res_message);
				}
			});
		},
		mapInit:function(){
			var that = this;
			//初始化地图
			//默认初始化地图中间点坐标
				var position =  MapUtils.createPosition(that.defLng, that.defLat);
				var view2D = MapUtils.createView(position, that.defZoom);
				that.map = MapUtils.createMap("mapContainer", view2D, null);
				
				//地图比例尺
				MapUtils.createScale(that.map);
				//地图操作工具条
				MapUtils.createToolBar(that.map);
		},
		mapInit2 : function() {//地图测试用的
			//初始化地图
			//默认初始化地图中间点坐标
			var position =  MapUtils.createPosition(this.defLng, this.defLat);
			var view2D = MapUtils.createView(position, this.defZoom);
			this.map = MapUtils.createMap("mapContainer", view2D, null);
			MapUtils.createScale(this.map);
	
			var positions = [];
			MapUtils.addMapMarker(this.map, null, position);
			var lineArrs =  [[116.368904,39.833823],
	         [116.482122,39.901176],
	         [116.587271,39.912501],
	         [116.798258,39.953823]
	         ];
			for(var i = 0 ; i < lineArrs.length ; i++){
				var temPosition =  MapUtils.createPosition(lineArrs[i][0], lineArrs[i][1]);
				positions.push(temPosition);
			}
			MapUtils.createToolBar(this.map);
		},
		/**
		 * 渲染坐标点
		 */
		drawMarker: function(markerObjs){
			var that = this;
			if($.isArray(markerObjs)){	
				$.each(markerObjs,function(i,marker){
					var imageUrl = null;
					if(!marker.is_online){//设备不在线
						imageUrl = "images/map-sign-black-ico.png";
					}
					
					var iconMap = marker.mapIcon;
					
					var _content = that.customIcon(iconMap.color,iconMap.num,iconMap.title);
					//自定义坐标点标注参数
					var opts = {
							extData : marker,
							content : _content,
							imageUrl: imageUrl,
							animation :"AMAP_ANIMATION_NONE", //动画效果，“AMAP_ANIMATION_NONE”——无动画效果 “AMAP_ANIMATION_DROP”——点标掉落效果 “AMAP_ANIMATION_BOUNCE”——点标弹跳效果
							autoRotation :false, //是否自动旋转。
							clickable : true,   //点标记是否可点击
							angle:0,           //点标记的旋转角度。
							draggable:false,     //设置点标记是否可拖拽移动，默认为false 
							title: marker.loc_desc,   //鼠标滑过点标记时的文字提示，不设置则鼠标滑过点标无文字提示
	//					offset: new CMMap.Pixel(10,10),//点标记显示位置偏移量，默认值为Pixel(-10,-34)。
							raiseOnDrag :false ,     //设置拖拽点标记时是否开启点标记离开地图的效果
							topWhenClick:false,      //鼠标点击时marker是否置顶，默认false ，不置顶
							topWhenMouseOver :false, //鼠标移进时marker是否置顶，默认false，不置顶
							zIndex: 100  //点标记的叠加顺序。地图上存在多个点标记叠加时，通过该属性使级别较高的点标记在上层显示。默认zIndex：100	
					};
					marker.opts = opts;
					
					//添加坐标点击事件
					var callback = function(obj){
						var pst = obj.getPosition();
						var infoWindow = MapUtils.createInfoWindow(that.drawLocReqInfo(obj) , pst.lng, pst.lat);
						infoWindow.open(that.map, {lng:pst.lng, lat:pst.lat});
					};
					marker.eventName = 'click';
					marker.func = callback;
				});
				//批量渲染坐标点
				MapUtils.batchAddMapMarker(that.map, markerObjs);
				
				//默认以第一个坐标点作为地图中心
				var firstMarker =  markerObjs[0];
				MapUtils.setMapZoomAndCenter(that.map,14, MapUtils.createPosition(firstMarker.longitude, firstMarker.latitude));
			}
		},
		clearAll : function() {
			try {
	//			MapUtils.clearAll(this.map);
				MapUtils.clearAllMark();
			} catch (e) {
				
			}
		},
		/**
		 * 渲染定位请求信息
		 */
		drawLocReqInfo: function(data){
			var that = this;
			var markerObj = data.getExtData();
			var divTipJq = that.$("#InfoWindow").clone(false);
			
			var divTipHeadJq = divTipJq.find("#infoTopHead");
			divTipHeadJq.empty();
			var tipHeadHtml = [];
			//在线，离线设置
		    if(!markerObj.is_online){//设备离线
		    	tipHeadHtml.push("<span class='lct-sign-error fr'> 离线  </span>");
			}else{
		    	tipHeadHtml.push("<span class='lct-sign-success ml5 fr'> 在线  </span>");
			}
		    
		    //设置设备名称
		    tipHeadHtml.push("<span class='lct-name'>"+markerObj.mem_user_name+"</span>");
		    divTipHeadJq.append(tipHeadHtml.join(""));
		    
		    //定义要展示的字段
		    var fileds = {
		    		msisdn : "MSISDN卡号",
		    		iccid : "ICCID",
		    		longitude :"经度",
		    		latitude : "纬度"
		    };
		    
		    var contentJQ = divTipJq.find("#infoTopBody");
		    contentJQ.empty();
		    var html = [];
		    
		    for(var key in fileds){
		    	html.push("<p> <span class='det-th'>"+fileds[key]+" ： </span>"+markerObj[key]+" </p>");
		    }
		    contentJQ.append(html.join(""));
		    return divTipJq.html();
		},
		/**
		 * 渲染设备轨迹
		 */
		drawMarkTrace: function(markerObjs){
			var that = this;
			var lineArrs = [];
			$.each(markerObjs , function(i, obj){
				var point =  [obj.longitude, obj.latitude];
				lineArrs.push(point);
			});
	
			MapUtils.addPloyLine(that.map, lineArrs, null);
		},
		/**
		 * 自定义提示样式
		 */
		customTips :function(lng , lat){
			var that = this;
			var divTipJq = that.$("#InfoWindow").clone(false);
			MapUtils.openInfoWindow(this.map, divTipJq.html(), lng, lat);
		},
		
		/**
		 * 自定义图标
		 */
		customIcon :function(color , num , title){
			var that = this;
			var colorClass = that.colors[color] || that.colors['red'];
			var _num = num || 0;
			
			var iconHtml = [];
			iconHtml.push("<div class='location-map-wrap' title = "+title+">");
			iconHtml.push("<i class="+colorClass+" >"+num+"</i>");
			iconHtml.push("</div>");
			return iconHtml.join("");
		}
	});
    return pageView;
});
