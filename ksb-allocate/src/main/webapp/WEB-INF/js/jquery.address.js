(function($){
    var querymap = [];

    //var resultMap = new $.HashTable();
    var local1 = null;
    $(document).click(function(event){
        $('.autoSearchResult').remove();
    });



    function get_geo_info(lng, lat, callback) {
        var myGeo = new BMap.Geocoder();
        myGeo.getLocation(new BMap.Point(lng, lat), function(res){
            // http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/AddressComponent
            callback && callback(res["addressComponents"]);
        });
    }

    function add_result_li(parent, position) {
        var title       = position.title;
        var address     = position.address || "";
        var lat         = position.point.lat;
        var lng         = position.point.lng;
        var province    = position.province;
        var city        = position.city;
        var html =  "<li class='bd_address_li'>" +
                        "<span class='i'>"+title+"</span>" +
                        "<span class='ii'>loading</span>" +
                        "<span class='ix' style='display:none'>"+lat+"</span>" +
                        "<span class='iy' style='display:none'>"+lng+"</span>" +
                        "<span class='ip' style='display:none'>"+province+"</span>" +
                        "<span class='ic' style='display:none'>"+city+"</span>" +
                    "</li>";
        var elem = $(html);
        parent.append(elem);

        // http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalResultPoi
        // http://jira.lanxiniu.cn/browse/LANXINIU-101
        switch(position.type) {
            case BMAP_POI_TYPE_NORMAL : // 一般位置点
                var $tmp_elem = elem.find(".ii");
                if (!address) {
                    get_geo_info(lng, lat, function(res){
                        // console.log(0, res);
                        $tmp_elem.text(res["city"] + res["district"] + res["street"] + res["streetNumber"]);
                    });
                } else if (new RegExp("^(.*市)(.*[区县])$").test(address)) {
                    get_geo_info(lng, lat, function(res){
                        $tmp_elem.text(res["city"] + res["district"] + res["street"] + res["streetNumber"]);
                    });
                } else if (new RegExp("^(.*市)(.*[区县]).+").test(address)) {
                    $tmp_elem.text(address);
                } else if (new RegExp(".*(?!市).*[区县]").test(address)) {
                    get_geo_info(lng, lat, function(res){
                        $tmp_elem.text(res["city"] + address);
                    });
                } else if (!(new RegExp("^(.*市).*[区县]").test(address))) {
                    get_geo_info(lng, lat, function(res){
                        $tmp_elem.text(res["city"] + res["district"] + address);
                    });
                } else {
                    $tmp_elem.text(address);
                }
                break;
            case BMAP_POI_TYPE_BUSSTOP : // 公交车站位置点
                get_geo_info(lng, lat, function(res){
                    elem.find(".ii").text(res["city"]+res["district"]+res["street"]+res["streetNumber"]);
                });
                break;
            case BMAP_POI_TYPE_SUBSTOP : // 地铁车站位置点
                get_geo_info(lng, lat, function(res){
                    elem.find(".ii").text(res["city"]+res["district"]+address+title+'地铁站');
                });
                break;
        }
    }

    //展示匹配的地址列表
    function searchComplete(results) {
        var top = querymap.length;
        var topquery = querymap[top-1];
        var t = topquery.disp;
        //alert();
        if(results && topquery.index == querymap.length-1 && topquery.key == results.keyword && topquery.pi == results.getPageIndex())
        {
            if(!resultMap.getValue(topquery.key+":"+topquery.pi)  && topquery.pi > 0) {
                resultMap.add( topquery.key+":"+topquery.pi, results);
            }
            $(".autoSearchResult").remove();
            $('.popup-js').hide();
            var top = t.parent().offset().top;
            var left = t.parent().offset().left;
            var height = t.height();
            var width = t.parent().width();
            var z = $("<ul class='autoSearchResult'></ul>");
            z.click(function(event){
                event.stopPropagation();
            });

            z.css({"top":top+height,"left":left});
            var count = 0;
            var reg = new RegExp(topquery.provFilter);
            for (var i = 0, r = results.getCurrentNumPois(); i < r; i++)  {
                // if (reg.test(results.getPoi(i).province)) {
                    count ++;
                    add_result_li(z, results.getPoi(i));
                // }
            }
            if (count==0) {
                z.html("没有找到合适的地址，建议输入小区、楼宇等关键字。");
                z.appendTo("body");
            } else {
                var curp = results.getPageIndex();
                var psize = results.getNumPages();
                var zx = $("<div class='preNext'></div>");
                if (curp > 0) {
                    var pp = $("<a href='javascript:' class='pre'>上一页</a>").appendTo(zx);
                    pp.click(function(){
                        var query = topquery;
                        query.pi = curp - 1;
                        var res = resultMap.getValue( query.key+":"+query.pi);
                        if (res) {
                            setTimeout(function(){
                                searchComplete(res);
                            },50);
                        } else {
                            local1.gotoPage(query.pi);
                        }
                    });
                }
                if (curp + 1 < psize ) {
                    var np = $("<a href='javascript:' class='next'>下一页</a>").appendTo(zx);
                    np.click(function(){
                        var query = topquery;
                        query.pi = curp + 1;
                        var res = resultMap.getValue( query.key+":"+query.pi);
                        if (res) {
                            setTimeout(function(){
                                searchComplete(res);
                            },50);
                        } else {
                            local1.gotoPage(query.pi);
                        }
                    });
                }
                zx.appendTo(z);
                z.appendTo("body");
                $('.autoSearchResult li').hover(function(){
                    $(".bd_address_li").removeClass('hover');
                    $(this).addClass('hover');
                },function(){
                    $(".bd_address_li").removeClass('hover');
                    $(this).removeClass('hover');
                });
                $(".autoSearchResult li").click(function(){
                    var th = $(this).children(".i").text();
                    var th2 = $(this).children(".ii").text();
                    var tx = $(this).children(".ix").text();
                    var ty = $(this).children(".iy").text();

                    var province = $(this).children(".ip").text();
                    var city = $(this).children(".ic").text();
                    topquery.select_cb(t, province, city, th,th2, tx,ty);
                    $(".autoSearchResult").remove();
                });

                $(".autoSearchResult li").mousedown(function(){
                    var th = $(this).children(".i").text();
                    var th2 = $(this).children(".ii").text();
                    var tx = $(this).children(".ix").text();
                    var ty = $(this).children(".iy").text();

                    var province = $(this).children(".ip").text();
                    var city = $(this).children(".ic").text();
                    topquery.select_cb(t, province, city, th,th2, tx,ty);
                    $(".autoSearchResult").remove();
                });
            }

            topquery.show_cb && topquery.show_cb();
        }
    }

    //监听地址框输入动作
    $.fn.localquery = function (settings, clear_cb, select_cb, show_cb) {
        settings=$.extend({},$.fn.localquery.defaults,settings);
        // if (!local) {
        // var local1=null;
        local1 = new BMap.LocalSearch(settings.cityCode,{
                onSearchComplete: searchComplete
            });
            // local.setLocation(settings.cityCode);
            // if (settings.cityCode == "北京") {
            //     settings.provFilter = "北京|密云|怀柔|门头沟";
            // }
            // local.setPageCapacity(settings.pageSize);
        // }

        var lastkey = "";
        this.click(function(event){
            event.stopPropagation();
        });

        this.keyup(function(event) {
            var myEvent = event || window.event;
            var keyCode = myEvent.keyCode;
            var curinput = $(this);
            if (keyCode == 38){
                var cursel = $(".bd_address_li.hover");
                if( cursel.length >0 && cursel.prev('.bd_address_li').length>0) {
                    $(".bd_address_li").removeClass('hover');
                    cursel.prev('.bd_address_li').addClass("hover");
                }
            } else if(keyCode == 40){
                var cursel = $(".bd_address_li.hover");
                if( cursel.length >0 && cursel.next('.bd_address_li').length > 0) {
                    $(".bd_address_li").removeClass('hover');
                    cursel.next('.bd_address_li').addClass("hover");
                } else if(cursel.length == 0){
                    cursel = $(".bd_address_li:first");
                    cursel.addClass("hover");
                }
            } else if (keyCode == 13){
                var cursel = $(".bd_address_li.hover");
                if (cursel.length == 0) {
                    cursel = $(".bd_address_li:first");
                    cursel.addClass("hover");
                }
                if (cursel.length >0) {
                    cursel.click();
                }
            } else if (keyCode != 37 && keyCode != 39) {
                var keyword = curinput.val();
                if (lastkey != keyword) {
                    clear_cb(curinput);
                }
                lastkey = keyword;
                if(keyword == "") {
                    $(".autoSearchResult").remove();
                    event.preventDefault();
                } else {
                    querymap.push({
                        key: keyword,
                        provFilter: settings.provFilter,
                        finish: false,
                        disp: curinput,
                        select_cb: select_cb ,
                        show_cb: show_cb ,
                        clear_cb : clear_cb,
                        pi : 0,
                        index: querymap.length
                    });
                    $(".autoSearchResult").remove();
                    var top = curinput.parent().offset().top;
                    var left = curinput.parent().offset().left;
                    var height = curinput.height();
                    var width = curinput.parent().width();
                    var z = $("<ul class='autoSearchResult'>加载中...</ul>").appendTo($("body"));

                    z.css({"top":top+height,"left":left});
                    local1.search(keyword, {forceLocal: true});
                }
            }
        });

        this.focus(function(event){
            if($(".autoSearchResult").length > 0){
                return;
            }

            var curinput = $(this);
            var keyword = curinput.val();
            if (!keyword) {
                return false;
            }

            querymap.push({
                key: keyword,
                provFilter: settings.provFilter,
                finish: false,
                disp: curinput,
                select_cb: select_cb,
                show_cb: show_cb ,
                clear_cb : clear_cb,
                pi : 0,
                index: querymap.length
            });

            $(".autoSearchResult").remove();
            var top = curinput.parent().offset().top;
            var left = curinput.parent().offset().left;
            var height = curinput.height();
            var width = curinput.parent().width();
            var z = $("<ul class='autoSearchResult'>加载中...</ul>").appendTo($("body"));

            z.css({"top":top+height,"left":left});
            local1.search(keyword, {forceLocal: true});
        });

        this.blur(function(){
            if($(".autoSearchResult")){
//              setTimeout(function(){$(".autoSearchResult").remove()},100);
            }
        });
    };
    $.fn.localquery.defaults = {
        pageSize: 6,
        currentPage: 1,
        cityCode: "北京",
        provFilter:"北京"
    };
})(jQuery);