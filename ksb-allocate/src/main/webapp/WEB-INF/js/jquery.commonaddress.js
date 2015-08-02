var requestmap = {};
function show_common_addr(datars,ele,id){
	if(datars.success){
	var addressDetail = '';
//	var curcity2 = curcity+"市";
	data = datars.obj;
	if(data.length>0){
		for(var i=0;i<data.length;i++)
		{
			if(data[i].address_y == "" || data[i].address_y == 0 || data[i].address_x == "" || data[i].address_x == 0) continue;
//			if (curcity2==data[i].city_name) {
			alert(data[i].address);
			alert(data[i].id);
				addressDetail = addressDetail + '<li><div class="con-info" ><div class="coordinate-icon"></div><h5>' + data[i].address+'</h5><p class="person-detial"><span class="name">'+data[i].id+'</span><span class="phone">' + data[i].phone + '</span></p><span class="address-id" style="display:none">'+data[i].id+'</span></div></li>';
//				+ '</h5><p class="address-detial">详细地址: <span class="address-remark">' + data[i].addressTail + '</span></p><p class="person-detial"><span class="name">'
//				+ data[i].name  + '</span><span class="phone">' + data[i].mobile + '</span></p><span class="address-x" style="display:none">' + data[i].address_x + '</span><span class="address-y" style="display:none">'+data[i].address_y+'</span><span class="address-id" style="display:none">'+data[i].id+'</span><span class="address-province" style="display:none">'+data[i].province+'</span><span class="address-city" style="display:none">'+data[i].city_name+'</span></div></li>';
//			};
		}
		if (addressDetail=='') {
			addressDetail = '<p class="loading">您在本市还没有常用地址！</p>';
		};
	}else{
		addressDetail = '<p class="loading">您还没有常用地址！</p>';
	}
	$(ele).html(addressDetail);//数据追加到html中
	//判断数据有几条
	
	if(data.length<5){
		$(ele).parent('.imglist_w').height(data.length==0? 40: data.length*71);
	}else{
		//上下箭头
//		$(id).xslider({
//			unitdisplayed:5,//可视的单位个数
//			movelength:5,//要移动的单位个数
//			dir:"V",
//			//unitlen:71,//li的高度
//			autoscroll:null
//		});
	}
}
}

function ui_common_addr(addr_species, addr_city, ele, spid) {
	// if(requestmap[addr_species] && requestmap[addr_species][addr_city]) {
	// 	return;
	// }
	//requestmap[addr_species] || (requestmap[addr_species] = {});
	//requestmap[addr_species][addr_city] = 1;

	get_common_address(addr_species,spid, function(data) {		
		show_common_addr(data,ele);
	});
}

get_common_address = function(addr_species,spid, on_success) {
    //var url = this._base_url + this._post_common_address;
	var url = "/allocate/sp_address";
    var req = {
        sp_id: spid
    };
    this._post(url, req, on_success, function(){},  function(){},  function(){});
};


(function($){
	var multAddressNum = 5;
	var requestmap = [];
	//url= json的地址
	//ele= 要放入json 数据的ul
	//id= 运行翻页的外层id
	//
	$(document).click(function(event){
		$('.popup-js').hide();
	})

//阻止冒泡
	function stopClick(){
		$('.autoSearchResult').remove();
		$(".popup-js").find(".con-info").unbind("click");
		$('.popup-js').click(function(event){
			event.stopPropagation();
		})
	}
	//把地址添加到input 框里
	function addclickInputData(ele,eleF, def, callback){
		var ele = $(ele);
		//var eleF = $(eleF);
		var offsetT = $(ele).parent().offset().top + 38;
		var offsetL = $(ele).parent().offset().left;

		//展示常用地址信息

		stopClick();
		if($('.popup-js').is(':visible')){
			$('.popup-js').hide();
			if(offsetT!=$('.popup-js').offset().top){
				if(def == 1){
					$("#address-p1").click();
				}
				else
				{
					$("#address-p2").click();
				}

				$('.popup-js').css({'display':'block','position':'absolute','left':offsetL,'top':offsetT});
			}else{
				$('.popup-js').hide();
			}
		}else{
			if(def == 1){
				$("#address-p1").click();
			}
			else
			{
				$("#address-p2").click();
			}
			$('.popup-js').css({'display':'block','position':'absolute','left':offsetL,'top':offsetT});
		}

		$('.popup-js').find('.con-info').bind("click",function(){
			callback(eleF, $(this).find('.address-id').text(), $(this).find('.address-province').text(),$(this).find('.address-city').text(),$(this).find('h5').text(), $(this).find('.address-remark').text(), $(this).find('.name').text(), $(this).find('.phone').text(), $(this).find('.address-x').text(), $(this).find('.address-y').text());
			$('.popup-js').hide(function(){
				$('.popup-js').find('.con-info').unbind("click");
			});
			return false;
		})
	}

	 //$(this).commonaddress( ".takeGoods-js", addr_species, on_address_selected,$("#sp_id").val());
	$.fn.commonaddress = function (ele, def, callback,spid) {
		ui_common_addr('01', '.popup-con1-js','#s1',spid);
		
		this.click(function(){
			addclickInputData(this,$(this).parents(ele), def, callback);
			return false;
		});
	};

	//f=tab切换外层div的class
	//c=tab切换内容块div的class
	//f=tab切换a点击处的class
	//s=tab切换点击后a的class
	$.fn.tabChange =  function(f,c,a,s) {
		var tabfather = $(f), tabcon = tabfather.find(c), taba = tabfather.find(a);
  		taba.click(function() {
  			var $index = $(this).index();//获取a的位置
  			tabcon.hide();
  			tabcon.eq($index).show();
  			taba.removeClass(s);
  			taba.eq($index).addClass(s);
  			tabfather.find('.left').hide();
  			tabfather.find('.right').hide();
  			tabfather.find('.left').eq($index).show();
  			tabfather.find('.right').eq($index).show();
  		})
	}

//添加删除收货信息
	$.fn.addInfor = function(ele, callback, cloneFunc){
		var $id = this;
		var takeGoodsF = $($id),takeGoods = $($id).find(ele);
		var $min = takeGoods.find('.min'),$add = takeGoods.find('.add'),$l = 1;
		changeState(this,takeGoodsF);
		//减
		$min.bind('click',function(){
			var $this = $(this);
			$l = takeGoodsF.find(ele).length;
			if($l == 1){
			}else{
				$(this).parents(ele).remove();
				$l = takeGoodsF.find(ele).length;
			}
			changeState($this,takeGoodsF);
			callback();
			//添加状态
			return false;
		})
		//加
		$add.bind('click',function(){
			var $this = $(this);
			$l = takeGoodsF.find(ele).length;
			if($l < multAddressNum){
				var takeGoodsClone = "";
				if(cloneFunc){
					takeGoodsClone = cloneFunc($(this).parents(ele));
				}
				else
				{
					takeGoodsClone = $(this).parents(ele).clone(true);
					takeGoodsClone.find('input').val('');
				}
				takeGoodsClone.insertAfter($(this).parents(ele));

				$l = takeGoodsF.find(ele).length;
			}
			changeState($this,takeGoodsF);
			callback();
			//添加状态
			return false;
		})

		//改变状态
		function changeState($this,id){
			var $this = $this;
			var $id = id;
			if($id.find(ele).length == 1){
				$($id).find('.add').removeClass('add-no').addClass('add-yes');
				$($id).find('.min').removeClass('min-yes').addClass('min-no');
			}else if($id.find(ele).length < multAddressNum){
				$($id).find('.add').removeClass('add-no').addClass('add-yes');
				$($id).find('.min').removeClass('min-no').addClass('min-yes');
			}else{
				$($id).find('.add').removeClass('add-yes').addClass('add-no');
				$($id).find('.min').removeClass('min-no').addClass('min-yes');
			}
		}//改变状态over
}//添加收货地址over


})(jQuery);
$(document).ready(function () {
	$("body").append('<div class="popup_address popup-js" ><div class="con-wrap"><div class="con con1 scrolllist" id="s1"><a href="#left" class="left abtn aleft agrayleft"></a><div class="imglist_w"><ul class="imglist popup-con1-js"><p class="loading">加载中....</p></ul></div><a href="#right" class="right abtn aright agrayright"></a></div><div class="con con2 scrolllist" id="s2" style="display: none"><a href="#left" class="left abtn aleft agrayleft"></a><div class="imglist_w"><ul class="imglist popup-con2-js"><p class="loading">加载中....</p></ul></div><a href="#right" class="right abtn aright agrayright"></a></div><div class="address-p">常用收货地址</div></div></div>');
	$('.popup-js').tabChange('.popup-js','.con','.address-p div','cur');
});
