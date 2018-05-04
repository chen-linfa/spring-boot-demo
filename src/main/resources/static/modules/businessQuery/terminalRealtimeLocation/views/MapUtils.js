var MapUtils = {
	overlays :[],
	lng:120, //默认经度
	lat:40, //默认纬度
	zoom:14,//默认地图缩放级别
	defMapOptions : {          //地图默认属性
		cursor : "default",    //地图默认鼠标样式。
		animateEnable : true,  //地图平移过程中是否使用动画
		rotateEnable : false,  //地图是否可旋转。
		resizeEnable : false,  //是否监控地图容器尺寸变化。
		dragEnable : true,     //地图是否可通过鼠标拖拽平移
		zoomEnable : true,     //地图是否可缩放。
		doubleClickZoom : false,//是否支持双击鼠标放大地图。
		keyboardEnable : true, //键盘操作地图是否有效。使用键盘工具操作地图，包括通过键盘方向键移动地图、使用主键盘“+”、“-”键来缩放地图。
		jogEnable : true,      //地图是否具有缓动效果。缓动效果，即地图拖拽后根据惯性滑动小段距离的效果。
		scrollWheel : true,    //是否支持鼠标滚轮缩放地图。
		touchZoom : true       //地图在移动终端上是否可通过多点触控缩放浏览地图。
	},
	
	defMarkerOptions : { //坐标点属性
		extData:null, //数据
		content:null, //自定义图标
		icon: null,
		animation :"AMAP_ANIMATION_NONE", //动画效果，“AMAP_ANIMATION_NONE”——无动画效果 “AMAP_ANIMATION_DROP”——点标掉落效果 “AMAP_ANIMATION_BOUNCE”——点标弹跳效果
		autoRotation :false, //是否自动旋转。
		clickable : true,   //点标记是否可点击
		angle:0,           //点标记的旋转角度。
		draggable:false,     //设置点标记是否可拖拽移动，默认为false 
		title:"我是title",   //鼠标滑过点标记时的文字提示，不设置则鼠标滑过点标无文字提示
//		offset: new CMMap.Pixel(10,10),//点标记显示位置偏移量，默认值为Pixel(-10,-34)。
		raiseOnDrag :true ,     //设置拖拽点标记时是否开启点标记离开地图的效果
		topWhenClick:false,      //鼠标点击时marker是否置顶，默认false ，不置顶
		topWhenMouseOver :false, //鼠标移进时marker是否置顶，默认false，不置顶
		zIndex: 100 , //点标记的叠加顺序。地图上存在多个点标记叠加时，通过该属性使级别较高的点标记在上层显示。默认zIndex：100
	},
	
	defPolyLineOptions:{// 直线属性
		strokeColor: "#FF0000",    // 线颜色
		strokeOpacity: 0.8,        // 线透明度
		strokeWeight: 6,          // 线宽
		isOutline:false,            // 是否有描边
		outlineColor:"#00FFFF",    // 描边颜色
		strokeStyle: "solid",     // 线样式
		strokeDasharray: [10,2,10], // 补充线样式
	    geodesic:true //是否绘制大地线
	},
	
	defPolygonOptions : {
		strokeColor : "#FF33FF", // 线颜色
		strokeOpacity : 0.1, // 线透明度
		strokeWeight : 3, // 线宽
		fillColor : "#1791fc", // 填充色
		fillOpacity : 0.85 // 填充透明度
	},
	/**
	 * 创建坐标位置对象
	 * 
	 * @param lng
	 * @param lat
	 * @returns {CMMap.LngLat}
	 */
	createPosition : function(lng , lat){//地图中心点坐标值,lng:经度，lat维度
		 var _lng = lng || this.lng;
		 var _lat = lat || this.lat;
		 return new CMMap.LngLat(_lng, _lat);
	},
	/**
	 * 创建地图二维视口,以及地图释放级别
	 * @param position
	 * @param zoom
	 */
	createView : function(position , zoom){
		var _position = position || this.createPosition();
		var _zoom = zoom || this.zoom;
		var view = new CMMap.View2D({// 创建地图二维视口
			center : _position,// 创建中心点坐标
			zoom : _zoom, // 设置地图缩放级别
		});
		return view;
	},
	
	/**
	 * 创建一个地图对象
	 * Container ： 存放地图容器ID，如div[id=Container].
	 * view2D : 维地图显示视口，用于定义二维地图静态显示属性，如地图缩放级别“zoom”、地图中心点“center”等
	 * mapOpt : 地图参数
	 */
	createMap : function(Container, view2D, mapOpt) {
		var _MapOptions = mapOpt || this.defMapOptions;
		var _View2D = view2D || this.createView(null, null);
		
		var map = new CMMap.Map(Container, {
			view : _View2D,
			cursor : _MapOptions.cursor,
			animateEnable : _MapOptions.animateEnable,
			rotateEnable : _MapOptions.rotateEnable,
			resizeEnable : _MapOptions.resizeEnable,
			dragEnable : _MapOptions.dragEnable,
			zoomEnable : _MapOptions.zoomEnable,
			doubleClickZoom : _MapOptions.doubleClickZoom,
			keyboardEnable : _MapOptions.keyboardEnable,
			jogEnable : _MapOptions.jogEnable,
			scrollWheel : _MapOptions.scrollWheel,
			touchZoom : _MapOptions.touchZoom
		});

		return map;
	},
	
	/**
	 * 生成一个坐标点对象
	 * map:地图对象 ，类型CMMap.Map 
	 * position:点坐标 类型CMMap.LngLat，
	 * opts：点属性
	 */
	createMarker:function(map ,position,opts){
		var marker = null;
		if(map==null || position == null){//地图对象不能为空，点坐标不能为空
			return marker;
		}
		
		var _opts = opts || this.defMarkerOptions;
		
		var icon =  this.createIcon(_opts.imageUrl);
		var _extData = _opts.extData;
		
		var marker = new CMMap.Marker({
			map : null, // 地图对象
			extData :_extData,
			position : position, // 点坐标经纬度
			angle : _opts.angle,
			draggable : _opts.draggable,
//			title : _opts.title,
//			offset : makerOpt.offset,
//			icon :icon,
			
			animation : _opts.makerOpt, //动画效果，“AMAP_ANIMATION_NONE”——无动画效果 “AMAP_ANIMATION_DROP”——点标掉落效果 “AMAP_ANIMATION_BOUNCE”——点标弹跳效果
			autoRotation :_opts.makerOpt, //是否自动旋转。
			clickable : _opts.clickable,   //点标记是否可点击
			raiseOnDrag :_opts.raiseOnDrag ,     //设置拖拽点标记时是否开启点标记离开地图的效果
			topWhenClick:_opts.topWhenClick,      //鼠标点击时marker是否置顶，默认false ，不置顶
			topWhenMouseOver :_opts.topWhenMouseOver, //鼠标移进时marker是否置顶，默认false，不置顶
			zIndex: 100  //点标记的叠加顺序。地图上存在多个点标记叠加时，通过该属性使级别较高的点标记在上层显示。默认zIndex：100
		}); 
		
		//自定义图标
		if(_opts.content){
			marker.setContent(_opts.content);
		}else{
			marker.setIcon(_opts.icon);
			marker.setTitle(_opts.title);
		}
		
		marker.setMap(map);
		return marker;
	},
	/**
	 * 表示点标记的图标 用于添加复杂点标记，即在普通点标记的基础上，添加Icon类，通过在Icon表示的大图上截取其中一部分作为标注的图标。
	 * imageUrl 图片地址 
	 */
	createIcon: function(imageUrl , msize ){
		var _imageUrl = imageUrl || "images/map-sign-org-ico.png";//默认为橘色
		var icon = new CMMap.Icon({
            size:  new CMMap.Size(30, 30),
//          image: "images/marker_red_sprite.png"
            image: _imageUrl
//          imageOffset: new CMMap.Pixel(-56, 0)
        });
		return icon;
	},
	
	/**
	 * 创建折线
	 * mapObj:地图对象
	 * lineArr:坐标集合
	 * opts: 直线属性
	 */
	createPolyLine: function(mapObj , lineArr , opts){
		var _opts = opts || this.defPolyLineOptions;
		
		var polyline = new CMMap.Polyline({
			map : mapObj,
			path : lineArr, // 设置线覆盖物路径
			strokeColor : _opts.strokeColor,// 线颜色
			strokeOpacity : _opts.strokeOpacity, // 线透明度
			strokeWeight : _opts.strokeWeight,// 线宽
			isOutline : _opts.isOutline, // 是否有描边
			outlineColor : _opts.outlineColor, // 描边颜色
			strokeStyle : _opts.strokeStyle, // 线样式
//			strokeDasharray : opts.strokeDasharray	// 补充线样式
		});
			
		return polyline;
	},
	/**
	 * 由一系列有序经纬度坐标构成,不同的是多边形是定义闭合区域
	 * map:地图对象
	 * lineArr:坐标集合,[{lng:116.403322,lat:39.920255},{lng:116.410703,lat:39.897555}]
	 * opts: 属性
	 */
	createPolyGon :function(mapObj , lineArr , opts){
		_opts = opts || this.defPolygonOptions;

		var polygon = new CMMap.Polygon({
			map:mapObj,
			path: lineArr,             // 设置线覆盖物路径
			strokeColor: _opts.strokeColor,    // 线颜色
			strokeOpacity: _opts.strokeOpacity,        // 线透明度
			strokeWeight: _opts.strokeWeight,           // 线宽
			fillColor: _opts.fillColor,      // 填充色
			fillOpacity: _opts.fillOpacity          // 填充透明度
//			geodesic : false
//			strokeStyle: "dashed",     // 线样式
//			strokeDasharray: [10,2,10] // 补充线样式
			});
		return polygon;
	},
	
	/**
	 * 创建地图提示框
	 * @param content 自定义提示内容 div 
	 * @param lng
	 * @param lat
	 * @returns {CMMap.InfoWindow}
	 */
	createInfoWindow : function(content , lng , lat){
		var infoWindow = new CMMap.InfoWindow({
			content : content , // 使用默认信息窗体框样式，显示信息内容
			size : new CMMap.Size(300, 200),
			closeWhenClickMap: true ,
//			offset: new CMMap.Pixel(0,-50),
			showShadow : false, //控制是否显示信息窗体阴影
			autoMove : true,  //是否自动调整窗体到视野内
			position : new CMMap.LngLat(lng, lat)
		});
		
		return infoWindow;
	},
	
	/**
	 * 在地图上添加一个坐标点,注：必须在地图对象回调后进行点标注 
	 * mapObj:地图对象 
	 * position：点标注坐标
	 * makerOpt:点坐标参数
	 * eventName : 触发时机名称
	 * func : 绑定的事件
	 */
	addMapMarker :function(mapObj, makerOpt , position ,eventName, func){
		var me = this;
		mapObj.plugin([ "CMMap.OverLay" ], function() {
			var obj =  me.createMarker(mapObj, position, makerOpt);
			me.overlays.push(obj);
			if($.isFunction(func)){
				obj.addListener(mapObj , eventName , func.call(obj), null);
			} 
		});
	},
	
	/**
	 * 在地图上添加多个坐标点,注：必须在地图对象回调后进行点标注
	 * mapObj:地图对象
	 * markers：点标注坐标集合
	 */
	batchAddMapMarker : function(mapObj,markers){
		var me = this;
		mapObj.plugin([ "CMMap.OverLay" ], function() {
			$.each(markers, function(i, marker){
				var position = me.createPosition(marker.longitude, marker.latitude);	
				var obj = me.createMarker(mapObj, position, marker.opts);
				me.overlays.push(obj);//记录下新增覆盖点
				var func = marker.func;
				if($.isFunction(func)){
					obj.addListener(obj , marker.eventName , function(){
						func.call(me,obj);
					}, null);
				} 
			});
			
		});
	},
	
	/**
	 * 添加折线
	 * @param mapObj
	 */
	addPloyLine: function(mapObj, lineArr , opts){
		var me = this;
		mapObj.plugin([ "CMMap.OverLay" ], function() {
			me.createPolyLine(mapObj, lineArr, opts);
		});
	},
	
	/**
	 * 添加环形
	 * @param mapObj
	 */
	addPloyGon: function(mapObj, lineArr , opts){
		var me = this;
		mapObj.plugin([ "CMMap.OverLay" ], function() {
			me.createPolyGon(map, lineArr, opts);
		});
	},
	
	/**
	 * 地图比例尺插件。位于地图右下角，用户可控制其显示与隐藏。
	 */
	createScale : function(mapObj) {
		mapObj.plugin(["CMMap.Scale"], function() {
			scale = new CMMap.Scale();
			mapObj.addControl(scale);
		});
	},
	

	/**
	 * 地图操作工具条插件。可支持方向导航、位置定位、视野级别缩放、视野级别选择等操作。
	 */
	createToolBar : function(mapObj) {
		mapObj.plugin(["CMMap.ToolBar"], function() {
			toolbar = new CMMap.ToolBar({
				size : 10,
				offset : new CMMap.Pixel(10, 10),
				ruler : true,
				direction : false,
				autoPosition: false
			});
			mapObj.addControl(toolbar);
		});

	},
	
	/**
	 * 设置地图展开的中心点
	 * @param mapObj 地图对象
	 * @param position 中心点坐标
	 */
	setMapCenter:function(mapObj , position){
		if(mapObj){
			var _position = position || this.createPosition(null, null);
			mapObj.setCenter(_position);
		}
	},
	
	/**
	 * 设置地图缩放至指定级别并以指定点为地图显示中心点。
	 */
	setMapZoomAndCenter:function(mapObj , zoom , position){
		if(mapObj){
			var _zoom = zoom || this.zoom;
			var _position = position || this.createPosition(null, null);
			mapObj.setZoomAndCenter(_zoom,_position);
		}
	},
	
	/**
	 * 打开自定义窗口
	 * mapObj : 地图对象
	 * content ：信息内容，自定义样式
	 * lng : 经度
	 * lat ：维度
	 */
	openInfoWindow:function(mapObj , content, lng ,lat){
		var me = this;
		mapObj.plugin([ "CMMap.OverLay" ], function() {
			var infoWindow = me.createInfoWindow(content, lng, lat);
			infoWindow.open(mapObj, {lng:lng, lat:lat});
		});
	},
	
	/**
	 * 删除当前地图对象所有标注点
	 */
	clearAll : function(mapObj){
		mapObj.clearMap();
		mapObj.clearOverlays();
		this.clearMark(this.overlays);
	},
	
	/**
	 * 删除点标注
	 * @param markers
	 */
    clearAllMark : function(){
    	var markers = this.overlays;
    	$.each(markers , function(i , maker){
    		maker.setMap(null);
    	});
    	this.overlays = [];
    }
};