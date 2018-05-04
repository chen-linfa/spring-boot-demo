define(["hbs!modules/businessQuery/batchPlanLocation/templates/modify.html"
], function (temp) {
    var components = fish.View.extend({
        //el: false,
        template: temp,
        msisdn_list:[],
        upload_key : "",
        events: {
            "click .js-close-popup": "onClosePupup"
        },
        afterRender: function () {
            var that = this;
            that.initEle();
            that.initData(that.options.type,that.options.param);
            that.initBtn();
            that.setUploadFileEvent();
        },
        initData:function(type,obj){
            var that = this;
            that.data = obj;
            if(type == "add"){
                that.$(".js-hide-row").show();
                that.$(".js-title").html("添加批量计划定位");
            }else{
                that.$(".js-title").html("修改批量计划定位");
                that.$(".js-hide-row").hide();
                that.$(".js-form").form("value",obj);
                //频率值框的显示
                if(that.$('.js-exec-type').combobox("value")=="1"){
                    that.$('.js-loc-rate-min-div').removeClass("hidden");
                    that.$(".js-loc-rate-hour").addClass("hidden").val("");
                }
                else {
                    that.$('.js-loc-rate-min-div').addClass("hidden").val("");
                    that.$(".js-loc-rate-hour").removeClass("hidden");
                // fish.utils.getAttrCode(["LOC_RATE"],function(code){//整点频率的输入框的值显示转码之后的值
                //     var data = code["LOC_RATE"][obj.loc_rate];
                //     that.$(".js-loc-rate-hour").val(data);
                // });
            }
        }
        },
        initEle:function(){
            var that = this;
            that.$('.js-exec-type').combobox( 
                {
                placeholder: '请选择',
                editable: false,
                attr_code:"EXEC_TYPE"
            }
            );
            that.$('.js-exec-type').on('combobox:change', function(e) {
                if(that.$('.js-exec-type').combobox("value")=="1"){
                    that.$('.js-loc-rate-min-div').removeClass("hidden");
                    that.$(".js-loc-rate-hour").addClass("hidden").val("");
                }
                else {
                    that.$('.js-loc-rate-min-div').addClass("hidden").val("");
                    that.$(".js-loc-rate-hour").removeClass("hidden");
                }
            });
            that.$(".js-loc-rate-hour").click(function(e){
                fish.popupView({
                    url:"modules/businessQuery/batchPlanLocation/views/TimeView.js",
                    width:400,
                    viewOption:{
                        loc_rate:that.$(".js-loc-rate-hour").val(),
                    },
                    callback:function(popup,view){
                        view.parentView = that;
                        that.listenTo(view,"select",function(data){
                            that.$(".js-loc-rate-hour").val(data);
                        })
                    }
                })
            }),

            that.$('.js-loc-rate-min').combobox({
                placeholder: '请选择',
                editable: false,
                // attr_code:"LOC_RATE",
                dataTextField: 'name',
                dataValueField: 'value',
                dataSource: [
                    {name: '5分钟', value: 5},
                    {name: '10分钟', value: 10},
                    {name: '20分钟', value: 20},
                    {name: '30分钟', value: 30},
                    {name: '1小时', value: 60},
                ],
            });
            //初始化时间控件
            var initdate = new Date();
            var mindate = new Date();
            var maxdate = new Date();
            fish.dateutil.addDays(mindate,1);
            maxdate.setDate("2050-12-30 23:59:59");
            that.$('#modify_begin_time').datetimepicker({
                //initialDate:that.options.begin_time,
                todayBtn : false,
                startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd hh:ii:ss'),
                endDate:fish.dateutil.format(maxdate, 'yyyy-mm-dd hh:ii:ss')
            });
            that.$('#modify_end_time').datetimepicker({
                //initialDate:that.options.end_time,
                todayBtn : false,
                startDate:fish.dateutil.format(mindate, 'yyyy-mm-dd hh:ii:ss'),
                endDate:fish.dateutil.format(maxdate, 'yyyy-mm-dd hh:ii:ss')
            });
            
        },
        initBtn:function(){
            var that = this;
            that.$(".js-submit").click(function() {
                if (that.options.type == "add") {
                    that.addBatch();
                } else if (that.options.type == "modify") {
                    that.modifyPlan();
                }
            });
            that.$("#templ_download_btn").click(function() {
                    window.location.href ="servlet/downloadExcel?type=mould&mould=location_project";
            });
            that.$("#proj_del_btn").click(function() {
                    that.deleteProject();
             });
        },

        //上传文件事件
        setUploadFileEvent : function() {
            var me = this;
            //附件上传
            me.$('#loc_project_file').unbind().on('change', function(){
                var fileName = me.$("#loc_project_file").val();
                console.log(fileName);
                // me.$("#loc_project_file").val(fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length));
                console.log(me.$("#loc_project_file").val());
                var extPattern = /.+\.(xls|xlsx)$/i;
                if($.trim(fileName) != ""){
                    if(!extPattern.test(fileName)){
                        layer.alert("只能上传EXCEL文件！");
                        me.$("#loc_project_file").val("");
                        return;
                    }
                }
                
                var params_str = {};
                params_str.upload_type = 'loc_project';
                
                var other_params_str = JSON.stringify(params_str);
                var reg = new RegExp('"', "g");
                var other_params_str = other_params_str.replace(reg, "?");
                
                var params = {};
                params.params_str = other_params_str;
                
                
                $.ajaxFileUpload({
                    url : "UploadController/uploadExcel.do",
                    secureuri : false,
                    fileElementId : "loc_project_file",
                    data: params,
                    dataType : 'json'   ,
                    success : function(data) {
                        layer.closeAll();
                        me.$("#loc_project_file").val("");
                        me.msisdn_list = [];
                        if(data.res_code=="00000"){
                            var info = data.result;
                            var exl_message = info.exl_message;
                            layer.alert(exl_message, function(index){
//                              me.msisdn_list = info.phone_list;
                                me.upload_key = info.download_key;
                                me.$("#upload_msisdn").val("上传成功！");
                                me.setUploadFileEvent();
                                layer.close(index);
                            });
                        }else{
                            layer.alert(data.res_message);
                        }
                    },
                    error : function(data) {
                        layer.alert("操作失败 ！  "+ data.res_message);
                        me.$("#loc_project_file").val("");
                        layer.closeAll();
                    }
                });
                me.setUploadFileEvent();
                layer.load();
            });
        },

        //修改操作
        modifyPlan : function() {
            var that = this;
            if (!that.validate("modify"))  return;
            var param = that.$(".js-form").form("value");
            if(param.exec_type == '1'){
                param.loc_rate = $.trim(that.$(".js-loc-rate-min").val());
            }else if(param.exec_type == '2'){
                param.loc_rate = $.trim(that.$(".js-loc-rate-hour").val());
            }
            
            console.log(param);
            fish.callService("LocationController", "updateLocPlan", param , function(reply){
                if (reply.res_code != "00000") {
                    layer.alert(reply.res_message);
                    return;
                }
                layer.closeAll();
                layer.alert("操作成功");
                that.parentView.doQuery();
            });
        },
        //新增操作
        addBatch : function() {
            var me = this;
            if(!me.validate("add")){
                return;
            }
    
            var filename = me.$(".js-file").val();            
            var taskname = $.trim(me.$("#task_name").val());
            var plan_prior = $.trim(me.$("#vadd_plan_prior").val());   
            //var plan_time = $("#vadd_plan_time").val();
            var begin_time = $.trim(me.$("#modify_begin_time").val());
            var end_time = $.trim(me.$("#modify_end_time").val());
            var exec_type = $.trim(me.$("#exec_type").val());
            var loc_rate = '';
            if(exec_type == '1'){
                loc_rate = $.trim(me.$(".js-loc-rate-min").val());
            }else if(exec_type == '2'){
                loc_rate = $.trim(me.$(".js-loc-rate-hour").val());
            }
        
            var params = {};
            params.plan_name = taskname;
            params.plan_type = '0';
            params.plan_prior = plan_prior;
            params.begin_time = begin_time;
            params.end_time = end_time;
            params.exec_type = exec_type;
            params.loc_rate = loc_rate;
            params.msisdn_list = me.msisdn_list;
            
            params.upload_key = me.upload_key;
            console.log(params);
            fish.callService("LocationController", "addBatchLocPlan", params, function(reply){
                if (reply.res_code != "00000") {
                    layer.alert(reply.res_message);
                    return;
                }else{
                    layer.alert("新增批量定位计划成功", function(index){
                        me.msisdn_list = [];
                        me.parentView.doQuery();
                        me.setUploadFileEvent();
                        layer.close(index);
                    });
                }
            });
        },
        //校验
        validate : function(action) {
            var me = this;
            
            if (!$.trim(me.$("#task_name").val())) {
                layer.alert("任务名称不能为空");
                return false;
            }
            
            var begin_time = $.trim(me.$("#modify_begin_time").val());
            if (!begin_time) {
                layer.alert("起始时间不能为空");
                return false;
            }
            var end_time = $.trim(me.$("#modify_end_time").val());
            if (!end_time) {
                layer.alert("结束时间不能为空");
                return false;
            }
            
            if(!me.validate_date(begin_time, end_time, action)){
                return false;
            }
            
            var exec_type = $.trim(me.$("#exec_type").val());
            if (!exec_type) {
                layer.alert("执行类型不能为空");
                return false;
            }
            var loc_rat_1 = $.trim(me.$(".js-loc-rate-min").val());
            var loc_rate_2 = $.trim(me.$(".js-loc-rate-hour").val());
            if ((exec_type == '1' && loc_rat_1 == '') || (exec_type == '2' && loc_rate_2 == '')) {
                layer.alert("定位频率不能为空");
                return false;
            }
            //优先级允许为空，默认0
            var plan_prior = me.$("#vadd_plan_prior").val();
            if (plan_prior && !me.validNum(plan_prior)) {
                layer.alert("优先级输入有误，请输入自然数");
                return false;
            }
            
            if (action == "add") {
                if(me.msisdn_list.length < 1 && me.upload_key==""){
                    layer.alert("请上传excel文件");
                    return false;
                }
            }
            
            return true;
        },
        validNum : function(value) {
            if (/^[0-9]*$/g.test(value)) return true;
            return false;
        },
        validate_date : function(startDate, endDate, action) {
            var me = this;
            if (startDate == '' || endDate == '') {
                layer.alert("查询时间段不能为空!");
                return false;
            }
            var startTime = me.getDateTime(startDate);
            var endTime = me.getDateTime(endDate);
            
            var todayTime = me.getDateTime(me.addDate(0));
            var tomorrowTime = me.getDateTime(me.addDate(1));

            if (startTime > endTime) {
                layer.alert("起始时间不能大于结束时间!");
                return false;
            }
            
            if (startTime < tomorrowTime && action == 'add') {
                layer.alert("起始时间不能小于明天!");
                return false;
            }
            
            if (endTime < todayTime && action == 'modify') {
                layer.alert("结束时间不能小于当前时间!");
                return false;
            }
            
            return true;
        },
        getDateTime : function(dateStr){
            var date = new Date(dateStr);
            return  date.getTime();
        },
        addDate : function(days) {
            var d = new Date();
            d.setDate(d.getDate() + days);
            var month = d.getMonth() + 1;
            var day = d.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            var val = d.getFullYear() + "-" + month + "-" + day;
            return val;
        },
        
    });

    return components;
});
