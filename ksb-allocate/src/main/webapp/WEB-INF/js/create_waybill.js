$(function() {

	$(".radioSpan").on('click', function() {
		$(this).siblings().removeClass("cur");
		$(this).addClass("cur");
	});
	$("#delayDelivery").on(
			'click',
			function() {
				$(".timeTips").show();
				$(".deliveryTip").html('注意：预约时间为配送人员取货时间。半小时以后，两天以内。');
				$(".deliveryTip").css("color", "#fd4801");

				var todayDate = getDate(0);
				var tomorrowtDate = getDate(1);
				$("#booking_date").append(
						"<option value='" + todayDate + "'>" + todayDate
								+ "</option>").append(
						"<option value='" + tomorrowtDate + "'>"
								+ tomorrowtDate + "</option>");

				$("#booking_time").val(getDateMinutes(30));
	});
	
	$(".com-adress-a").show();
	
    // 常用地址
    $(".com-address-a-js").each(function(index, elem) {
        var addr_species = $(this).attr('addr_species');
        //alert(addr_species);
       $(this).commonaddress( ".takeGoods-js", addr_species, on_address_selected,$("#sp_id").val());
    });
	
	//$.fn.commonaddress = function (ele, def, callback) {
		//alert("---");
//		ui_common_addr(COMMON.ADDRESS_SPECIES.PICKUP, '.popup-con1-js','#s1',curcity);
//		ui_common_addr(COMMON.ADDRESS_SPECIES.DELIVER, '.popup-con2-js','#s2',curcity);
//		this.click(function(){
//			addclickInputData(this,$(this).parents(ele), def, callback);
//			return false;
//		});
	//};
    
	$("#immediateDelivery").on("click", function() {
		$(".timeTips").hide();
		$(".deliveryTip").html('快送宝配送人员会立即上门取件');
		$(".deliveryTip").css("color", "#666");
		$("#booking_date").empty();
		$("#booking_time").val("");
	});
	
//	$("#appointmentTimePicker").on("change", function() {
//		if (!checkAppointmentTime()) {
//			on_input_error($("#appointmentTimePicker"), {
//				name : '请输入正确的预约时间'
//			}, true);
//			return;
//		} else {
//			on_input_error($("#appointmentTimePicker"), {
//				name : '请输入正确的预约时间'
//			}, false);
//		}
//	});
	
    $("#pay_type").on("change",function(){
    	
   	 var pt=$("#pay_type").val();
       if(pt=='1'){
       	 $("#fee_id").show();
       	
       	}else{
       		 $("#fee_id").hide();
       	}
      
   });
	$("#saveInfo").click(function() {
		save_info();
	});

	var save_info = function() {
		
		var city_code = $("#fromCity").val();
		var pickup_info = get_pickup_info();
		if (!pickup_info) {
			return;
		}

		var deliver_list = get_deliver_list();
		if (!deliver_list) {
			return;
		}

		var cargo_info = get_cargo_info();
		if (!cargo_info) {
			return;
		}

		var fee_info = get_fee_info();
		if(!fee_info){
			return;
		}
		
		
		//$("#saveInfo").addClass("next-disabled-btn");
		$("#saveInfo").attr("disabled","disabled");
		$("#saveInfo").text("正在提交...");
		
		save_order_base(city_code, pickup_info, deliver_list, cargo_info,fee_info,
				on_save_success, function() {
				}, function(res) {
					_is_saving = true;

				}, function(res) {
					_is_saving = false;
					//$("#saveInfo").removeClass("next-disabled-btn");
					$("#saveInfo").removeAttr("disabled");
					$("#saveInfo").text("提交");
				});

	};
});


function on_address_selected(eleF, id, province, city, address, address_remark, user_name, phone, x, y) {
	
	//alert("111");
}


// 去除字符串前后空格
function getDate(roll) {
	var today = new Date();
	today.setDate(today.getDate() + roll);

	return today.getFullYear() + "-" + (today.getMonth() + 1) + "-"
			+ today.getDate()

}

function getDateMinutes(roll) {

	var today = new Date();
	today.setMinutes(today.getMinutes() + roll);

	return today.getHours() + ":" + today.getMinutes()

}
function iss_trim(str) {
	return $.trim(str);
	if (!str) {
		return '';
	}
	return str.replace(/(^\s*)|(\s*$)/g, '');
}
function check_address(x, y) {
	if (!x || !y || x == '0.0' || y == '0.0') {
		return false;
	}
	return true;
}


function on_address_selected(eleF, id, province, city, address, address_remark, user_name, phone, x, y) {
    eleF.attr({
        'address-info-id': id,
        'address-info-x': x,
        'address-info-y': y,
        'address-info-province': province,
        'address-info-city': city,
        'address-info-address': address,
        'address-info-remark': address_remark,
        'address-info-name': user_name,
        'address-info-phone': phone
    });

    eleF.find('.address-info-address').val(address);
    eleF.find('.address-info-name').val(user_name);
    eleF.find('.address-info-phone').val(phone);
    eleF.find('.address-info-remark').val(address_remark);
    if (address_remark && address_remark!='null') {
        eleF.find('.address-info-remark').parents('tr').show();
    } else {
        eleF.find('.address-info-remark').val("");
        eleF.find('.address-info-remark').parents('tr').hide();
    }

}

/*费用信息*/
function get_fee_info(){
	var pay_type = $("#pay_type").val();
	var pay_shipper_fee = $("#pay_shipper_fee").val();
	var fetch_buyer_fee = $("#fetch_buyer_fee").val();
	
	return {
		pay_type : pay_type,
		pay_shipper_fee : pay_shipper_fee,
		fetch_buyer_fee : fetch_buyer_fee
	}
}


// 获取物体信息 和发货时间信息
function get_cargo_info() {
	// 是否预约 deliveryTip =2 取件预约 dtp_input预约日期 time_input 预约时间 weight 物品重量
	// goodsName 名称 demo备注
	var appointType = $(".timeWrap").find(".cur").attr("servetype");
	var dtp_input = '', time_input = '';
	if (appointType == 1) {

		var dtp_input = $('#booking_date').val();
		var time_input = $('#booking_time').val();

		/*判断时间格式*/

	}

	var weight = $("#weight").val();
	var cargoName = $("#cargoName").val();
	var cargoNum = $("#cargoNum").val();
	var cargoPrice = $("#cargoPrice").val();
	var remarks = $("#remarks").val();

	var top = $("#weight").offset().top;
	if (!cargoName.length) {
		$("body").animate({
			scrollTop : top
		}, 800);
		on_input_error($("#cargoName"), {
			name : '请输入物品名称'
		}, true);
		return false;
	}

	return {
		isbooking : appointType,
		booking_date : dtp_input+" "+time_input,
		weight : weight,
		cargoName : cargoName,
		remarks : remarks,
		cargoNum : cargoNum,
		cargoPrice:cargoPrice
	}
}

function get_pickup_info() {
	var $obj = $('.pickup');
	var name = iss_trim($('.pickup').find('.address-info-name').val()); // 发货联系人姓名
	var phone = $('.pickup').find('.address-info-phone').val(); // 发货联系人电话
	var x = $('.pickup').attr('address-info-x'); // 发货地址的纬度 一般小于100 latitude
													// FIXME
	var y = $('.pickup').attr('address-info-y'); // 发货地址的经度 一般大于100 longitude
	var address = $('.pickup').find('.address-info-address').val(); // 发货地址
	var remark = $('.pickup').find('.address-info-remark').val(); // 发货地址备注
	var province = $('.pickup').attr('address-info-province') || ''; // 发货地址对应的省
	var city = $('.pickup').attr('address-info-city'); // 发货地址对应的城市

	var top = $obj.offset().top;
	if (!check_address(x, y)) {
		$("body").animate({
			scrollTop : top
		}, 800);
		on_input_error($obj.find('.address-info-address'), {
			name : '请选择发货地址'
		}, true);
		return false;
	}

	if (!name.length) {
		$("body").animate({
			scrollTop : top
		}, 800);
		on_input_error($obj.find('.address-info-name'), {
			name : '请输入姓名'
		}, true);
		return false;
	}

	if (!phone.length) {
		$("body").animate({
			scrollTop : top
		}, 800);
		on_input_error($obj.find('.address-info-phone'), {
			name : '请输入手机号'
		}, true);
		return false;
	}

	return {
		fromName : name,
		fromMobile : phone,
		x : x,
		y : y,
		fromCity : city,
		fromAddress : address,
		fromAddressTail : remark
	};

}
function on_input_error($elem, data, is_error) {
	if (!is_error) {
		$elem.removeClass('inpError');
		$elem.parent().next().remove();
		return false;
	}

	if ($elem.parent().next('.error').size() > 0) {
		$elem.parent().next('.error').html(data.name);
	} else {
		$elem.addClass('inpError');
		$elem.focus();
		$elem.parent().after('<p class="error">' + data.name + '</p>');
	}
}

// 检查预约时间
function checkAppointmentTime() {
	var chooseDay = $('#appointmentDay').val();
	var chooseTime = $('#appointmentTimePicker').val();
	if (chooseTime == 'undefined' || chooseTime == null || chooseTime == '') {
		return false;
	}
	var days = chooseDay.split("-");
	var times = chooseTime.split(":");
	if (times.length <= 0) {
		return false;
	}
	var ctime = new Date(days[0], days[1] - 1, days[2], times[0], times[1], 0,
			0).getTime();

	var current = $.now();

	if (ctime <= current) {
		return false;
	}

	// 如果选择时间和当前时间差值小于2消失
	if (parseInt(ctime - current) < (7200 * 1000)) {
		return false;
	}
	return true;
};

function get_deliver_list() {
	var deliver_list = "[";
	var ret = true;
	$(".tab-js.takeGoods-js").each(
			function() {
				var $this = $(this);
				var name = iss_trim($(this).find('.address-info-name').val());// 收货联系人姓名
				var phone = $(this).find('.address-info-phone').val(); // 收货联系人电话
				var x = $(this).attr('address-info-x'); // 收货地址的纬度 一般小于100
														// latitude FIXME
				var y = $(this).attr('address-info-y'); // 收货地址的经度 一般大于100
														// longitude
				var address = $(this).find('.address-info-address').val(); // 收货地址
				var remark = $(this).find('.address-info-remark').val(); // 收货地址备注
				var province = ''; // 收货地址对应的省$(this).attr('address-info-province')||
				var city = $(this).attr('address-info-city'); // 收货地址对应的城市
				var cid = $(this).attr('address-info-id'); // 常用地址对应的数据库记录id*/

				var top = $this.offset().top;
				if (!check_address(x, y)) {
					$("body").animate({
						scrollTop : top
					}, 800);
					on_input_error($this.find('.address-info-address'), {
						name : '请输入收货地址'
					}, true);
					ret = false;
					return false;
				}

				if (!name.length) {
					$("body").animate({
						scrollTop : top
					}, 800);
					on_input_error($this.find('.address-info-name'), {
						name : '请输入联系人姓名'
					}, true);
					ret = false;
					return false;
				}

				if (!phone.length) {
					$("body").animate({
						scrollTop : top
					}, 800);
					on_input_error($this.find('.address-info-phone'), {
						name : '请输入手机号'
					}, true);
					ret = false;
					return false;
				}

				var remarkStr = '';
				if (remark) {
					remarkStr = encodeURI(remark);
				}
				;
				deliver_list += "{name: \"" + encodeURI(name) + "\", phone: \""
						+ encodeURI(phone) + "\", address_x: " + x
						+ ", address_y: " + y + ", address: \""
						+ encodeURI(address) + remarkStr + "\"},";
			});
	deliver_list = deliver_list.substr(0, deliver_list.length - 1);
	deliver_list += "]";

	if (!ret) {
		return false;
	}

	if (deliver_list.length == 0) {
		new ISS_pop(null, '请添加收货信息！');
		return false;
	}
	return deliver_list;

}

var save_order_base = function(order_city, pickup_info, deliver_list,
		goods_info,fee_info, on_success, on_before_send, on_complete, on_error) {

	var url = 'batch_add_waybill';

	var req_data = {
		city_code : order_city,
		shipper_name : pickup_info.fromName,
		shipper_phone : pickup_info.fromMobile,
		shipper_address : pickup_info.fromAddress,
		shipper_address_detail:	pickup_info.fromAddressTail,	
		shipper_address_x : pickup_info.x,
		shipper_address_y : pickup_info.y,
		buyers_list : deliver_list,

		booking_fetch : goods_info.isbooking,
		booking_fetch_time : goods_info.booking_date,

		cargo_weight : goods_info.weight,
		cargo_name : goods_info.cargoName,
		cargo_num : goods_info.cargoNum,
		cargo_price:goods_info.cargoPrice,
		remarks : goods_info.remarks,
		fetch_buyer_fee:fee_info.fetch_buyer_fee,
		pay_shipper_fee:fee_info.pay_shipper_fee,
		timestamp:new Date().getTime()
		
	};
	this._post(url, req_data, on_success, on_before_send, on_complete,
					on_error);
};

var on_save_success = function(res) {
	if (res.success) {
		$("#saveInfo").removeAttr("disabled");
		$("#saveInfo").text("提交");
		alert("提交成功!");
		location.href = "/sp/add_waybill"
		return;
	} else {
		alert("提交失败: " + res.errors);
		$("#saveInfo").removeAttr("disabled");
		$("#saveInfo").text("提交");
		return;
	}

};

var _post = function(post_url, req_data, on_success, on_before_send,
		on_complete, on_error) {
	$.ajax({
		url : post_url,
		type : 'POST',
		data : req_data,
		dataType : 'json',
		contentType:"application/x-www-form-urlencoded;charset=utf-8",
		success : function(data, textStatus, jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 alert("登录超时,请重新登录!");
	             location.href="login";
	        	 return;
	        } 
			on_success && on_success(data, textStatus, jqXHR);
		},
		beforeSend : function(jqXHR, settings) {
			on_before_send && on_before_send(jqXHR, settings);
		},
		complete : function(jqXHR, textStatus) {
			on_complete && on_complete(jqXHR, textStatus);
		},
		on_error : function(jqXHR, textStatus, errorThrown) {
			on_error && on_error(jqXHR, textStatus, errorThrown);
		}
	});
};
