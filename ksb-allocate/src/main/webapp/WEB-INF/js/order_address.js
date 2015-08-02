/**
 * Created by mina.zhang on 2015/5/15 0015.
 */
(function($){
    var querymap = [];

    $(document).click(function(event){
        $('.autoSearchResult').remove();
    });

    $(document).ready(function(){
        $(".help-address-a").on("click",function(){
            initHelpMap(this);
        });

        $(".closeHelpMap").on("click",function(){
            hideHelpMap();
            $('#helpPanel').off('click', 'li');
        });
    });

    //保存地址坐标
    function queryComplete(results,city,province,address) {
        var t = querymap.inputbox;
        var addrdiv = t.parents('.takeGoods-js');
        addrdiv.attr({
            'address-info-x': results.lng,
            'address-info-y': results.lat,
            'address-info-province': querymap.provFilter,
            'address-info-city': querymap.city,
            'address-info-address': querymap.key
        });
        var addrDiv = t.parents(".address");
        t.removeClass('inpError');
        t.css({
            borderColor : "#ccc"
        });
        addrDiv.next(".error").remove();
        addrDiv.next(".succTip").remove();
        var help = t.parent().find(".help-address-a");
        help.attr("src","/img/u16.png");
       
    }

    //解析错误的话，弹出地图辅助定位
    function continueFindAddr(){
        //没有找到合适的地址，建议输入小区、楼宇等关键字。
        var t = querymap.inputbox;
        var addrDiv  = t.parents(".tab2.takeGoods-js");
        addrDiv.attr("address-info-x",'');
        addrDiv.attr("address-info-y",'');
        addrDiv.attr("address-info-province",'');
        addrDiv.attr("address-info-city",'');
        addrDiv.attr("address-info-id",'');
        addrDiv.attr("address-info-address",'');
        addrDiv.attr("address-info-remark",'');

        t.css({
            borderColor : "#f00"
        });
        t.attr('isValid', 0);

        var help = t.parent().find(".help-address-a");
        help.attr("src","/img/u16.png");

        var addrTd = t.parents(".address");
        addrTd.next(".error").remove();
        addrTd.next(".succTip").remove();
        addrTd.after("<p class='error'>此地址定位失败，请<a class='showHelpMap'>点击这里</a>进行辅助定位</p>");
        $(".showHelpMap").on("click",initHelpMap);
    }

    function initHelpMap(that){
        var inputbox;
        var exist_x,exist_y ;
        if($(that).parent(".address").length>0){
            inputbox = $(that).parent(".address").find(".address-info-address");
            exist_x = $(that).parents(".tab2.takeGoods-js").attr("address-info-x");
            exist_y = $(that).parents(".tab2.takeGoods-js").attr("address-info-y");
        }else{
            inputbox = querymap.inputbox;
        }

        $(".helpMapDiv").show();
        $(".mask").show();

        // 创建Map实例
        var helpMap = new BMap.Map("helpMapContainer");
        helpMap.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        helpMap.enableContinuousZoom();
        querymap = {
            key: inputbox.val(),
            city:$("#fromCity").val(),
            provFilter: $("#fromCity").val(),
            finish: false,
            localbtn: $(that),
            inputbox: inputbox
        };
        var t = querymap.inputbox;
        $("#baiduKey").val(t.val());
        // 百度地图API功能
        var helpLocal = new BMap.LocalSearch(helpMap, {
            renderOptions: {map: helpMap, panel: "helpPanel"},
            onSearchComplete: function(results){
                setTimeout(function(){
                    if(results!=undefined && results.getNumPois()==0){
                        $("#helpPanel").html("<div class='noresult'><b style='color:#333;'>在"+ querymap.city +"市未找到合适的地址。</b><br><b>简单两步选择正确地址：</b><ol><li>在搜索框输入您所在的位置；</li><li>点击搜索框后的放大镜按钮或回车键，在下方的搜索结果中选择最适合您的位置。</li></ol><b>建议您在搜索框输入以下内容进行搜索：</b><ul><li>您所在的大厦或者小区的名字，例如“中关村图书大厦”或“左岸公社”；</li><li>或所在位置的街道号，例如“北四环西路68号”；</li></ul></div>");
                    }else{
                        $("#helpPanel").find("div").first().find("div").eq(1).find("a").remove();
                        $("#helpPanel").find("li").each(function(){
                            $(this).css("position","relative");
                            if($(this).find("div").first().find(".chooseAddrBtn").length==0){
                                $(this).find("div").first().prepend($("<div class='chooseAddrBtn'>选 择</div>"));
                            }
                            $(this).find("div").first().find("div").eq(1).find("a").remove();
                            $(this).find("div").first().find("div").eq(2).find("b").remove();
                            $(this).find("div").first().find("div").eq(3).remove();
                        });

                        $('.chooseAddrBtn').on('click',function(){
                            var addr = $(this).parent().find("div").eq(1).find("span").text();
                            var addr_remark = $(this).parent().find("div").eq(2).find("span").text();
                            confirmHelpAddr(addr_remark,addr);
                        })
                    }
                },10);
            }
        });
        //如果已经解析成功
        if(exist_x!=undefined && exist_x!=''&& exist_y!=undefined && exist_y!=''){
            $("#baiduKey").val('');
            var exist_point = new BMap.Point(exist_x,exist_y);
            helpMap.centerAndZoom(exist_point, 14);
            var marker = new BMap.Marker(exist_point);  // 创建标注
            var label = new BMap.Label(querymap.key,{offset:new BMap.Size(20,-10)});
            marker.setLabel(label);
            helpMap.addOverlay(marker);              // 将标注添加到地图中
            helpMap.panTo(exist_point);
            $("#helpPanel").html("<div class='noresult'><b style='color:#333;'>您的地址已定位成功，如右侧地图中标注。</b><br><b style='color:#333;'>如需更换地址，请在上方输入框内输入关键字重新检索。</b><br><b>简单两步选择正确地址：</b><ol><li>在搜索框输入您所在的位置；</li><li>点击搜索框后的放大镜按钮或回车键，在下方的搜索结果中选择最适合您的位置。</li></ol><b>建议您在搜索框输入以下内容进行搜索：</b><ul><li>您所在的大厦或者小区的名字，例如“中关村图书大厦”或“左岸公社”；</li><li>或所在位置的街道号，例如“北四环西路68号”；</li></ul></div>");

        }else{
            helpMap.centerAndZoom(querymap.city, 14);
            helpSearch(helpLocal,$("#baiduKey").val());
        }

        $('#helpPanel').on('mouseover', 'li', function(){
            $(this).find(".chooseAddrBtn").css("visibility","visible");
            $(this).find("div").eq(0).css("background","#eee");
        });

        $('#helpPanel').on('mouseout', 'li', function(){
            $(this).find(".chooseAddrBtn").css("visibility","hidden");
            $(this).find("div").eq(0).css("background","#fff");
        });

        //监听输入框
        $(".searchBtn2").on('click',function(){
            helpSearch(helpLocal,$("#baiduKey").val());
        });

        $("#baiduKey").on('keyup',function(event) {
            event.preventDefault();
            var myEvent = event || window.event;
            var keyCode = myEvent.keyCode;
            if (keyCode == 13){
                helpSearch(helpLocal,$(this).val());
            }
        });
    }

    function helpSearch(helpLocal,keyword){
        if(keyword==''){
            $("#helpPanel").html("<div class='noresult'><b style='color:#333;'>您输入的地址为空，请在上方输入框内输入关键字重新检索。</b><br><b>简单两步选择正确地址：</b><ol><li>在搜索框输入您所在的位置；</li><li>点击搜索框后的放大镜按钮或回车键，在下方的搜索结果中选择最适合您的位置。</li></ol><b>建议您在搜索框输入以下内容进行搜索：</b><ul><li>您所在的大厦或者小区的名字，例如“中关村图书大厦”或“左岸公社”；</li><li>或所在位置的街道号，例如“北四环西路68号”；</li></ul></div>");
        }else{
            helpLocal.search(keyword,{forceLocal:true});
        }
    }

    function confirmHelpAddr(addr_remark,addr){
        var t = querymap.inputbox;
        if(addr_remark!=''&& addr_remark!=undefined){
            var myGeo2 = new BMap.Geocoder();
            var address_whole = addr+"（"+ addr_remark +"）";
            myGeo2.getPoint(address_whole, function(point){
                if (point) {
                    queryComplete(point,querymap.city,querymap.provFilter,address_whole);
                    t.val(address_whole);
                    t.parents("tr").next().show();
                    t.parents(".tab2.takeGoods-js").attr("address-info-address-keyword",'');
                    hideHelpMap();
                }else{
                    //alert("您选择地址没有解析到结果!");
                    t.parents(".tab2.takeGoods-js").attr("address-info-address-keyword",'');
                    t.val(address_whole);
                    hideHelpMap();
                    continueFindAddr();
                }
            },querymap.city);
        }else{

        }
    }

    function hideHelpMap(){
        $(".helpMapDiv").hide();
        $(".mask").hide();
        $('.chooseAddrBtn').off('click');
        //$(".help-address-a").off("click");
        $("#baiduKey").off('keyup');
        $(".searchBtn2").off('click');
        $("#helpPanel").empty();
    }

    //监听地址框 blur动作
    $.fn.localquery2 = function (settings, clear_cb, select_cb, show_cb) {
        settings=$.extend({},$.fn.localquery.defaults,settings);
        this.blur(function(){
            var curinput = $(this);
            querymap = {
                key: curinput.val(),
                city:settings.cityCode,
                provFilter: settings.provFilter,
                finish: false,
                localbtn: '',
                inputbox:curinput
            };

            //$(this).parent().find(".help-address-a").removeClass('help-address-a-js');
            $(this).parent().find(".help-address-a").attr("src","/static/frontend/assets/img/icons/u16.png");

            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            myGeo.getPoint($(this).val(), function(point){
                if (point) {
                    //alert('解析成功');
                    queryComplete(point,settings.cityCode,settings.provFilter,curinput.val());
                }else{
                    //alert("您选择地址没有解析到结果!");
                    continueFindAddr();
                }
            }, settings.cityCode);
        });
    };
    $.fn.localquery2.defaults = {
        pageSize: 6,
        currentPage: 1,
        cityCode: $("#fromCity").val(),
        provFilter:$("#fromCity").val()
    };
})(jQuery);