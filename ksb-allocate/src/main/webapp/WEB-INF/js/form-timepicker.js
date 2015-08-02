// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var ISS_Timepicker = function (){

    var handleTimePickers = function () {
        var cdate = new Date();
        cdate.setHours(cdate.getHours()+2);
        cdate.setMinutes((parseInt(cdate.getMinutes()/10)+1)*10);
        if (jQuery().timepicker) {
            $('.timepicker-24').timepicker({
                defaultTime:cdate.Format("hh:mm"),
                autoclose: true,
                minuteStep: 10,
                showSeconds: false,
                showMeridian: false
            });
        }
        var minute = cdate.getMinutes()==0?'00':cdate.getMinutes();
        if('' == $('.timepicker-24').attr("data-time")|| undefined ==$('.timepicker-24').attr("data-time")){
            $('.timepicker-24').val(cdate.getHours()+':'+minute);
        }else{
            var timeStr = $('.timepicker-24').attr("data-time");
            $('.timepicker-24').val(timeStr.substr(0,5));
        }
    }
    var handleTimePickers2 = function () {
        $('.timepicker-24-nodisturb').each(function(){
            var cdate = new Date();
            var existTime = $(this).val();
            if(existTime==''||existTime==0){
                cdate.setHours();
                cdate.setMinutes(0);
            }else{
                cdate.setHours(existTime.substr(0,2));
                cdate.setMinutes(existTime.substr(3,2));
            }
            if (jQuery().timepicker) {
                $(this).timepicker({
                    defaultTime:cdate.Format("hh:mm"),
                    autoclose: true,
                    minuteStep: 30,
                    showSeconds: false,
                    showMeridian: false
                });
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            handleTimePickers();
            handleTimePickers2();
        }
    };
}();