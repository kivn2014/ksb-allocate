  $().ready(function(){ 
	 
	  var currentDay = getDate(0);
	  $("#st").val(currentDay);
	  $("#et").val(currentDay);
	  
	}); 
 (function(){
	
	 
 })(jQuery) 
 
function getDate(roll) {
	var today = new Date();
	today.setDate(today.getDate() + roll);

	return today.getFullYear() + "-" + (today.getMonth() + 1) + "-"
			+ today.getDate()

} 

function getstatusValue(status){
	if(status==null){
		return "0";
	}
	
	return status;
	
}
 
function search_count_waybill(page) {
		
		var target_page = 1;
		var currentpage = parseInt($("#current_page").val());
		if(page==1||page==-1){
			target_page = currentpage+page;
		}
		
		var totalpage = parseInt($("#total_page").val());
		if(totalpage!=null&&totalpage!=''){
			if(target_page>totalpage){
				alert("最后一页啦");
				return;
			}
			if(target_page<1){
				alert("当前是第一页");
				return;
			}
		}
		
		var st = $("#st").val();
		var et = $("#et").val();
		
		
		$.ajax({type:"POST",url:"/allocate/count_waybill_date", data:{
			'st' : st,
			'et' : et,
			'page':target_page,
			'size':'10',
			'timestamp':new Date().getTime()
		}, contentType:"application/x-www-form-urlencoded;charset=utf-8",success:function(data) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 alert("登录超时,请重新登录!");
	             location.href="login";
	        	 return;
	        } 
			var containerBody = $("#bodyid").empty();
			var htm = "";
			data = $.parseJSON(data);
			s = data.success;
			if (!s) {//查询失败
				alert(data.errors);
				return;
			}
			if (data.objmap != null) {
				
				/*从查询结果中获取当天查询页和总页数*/
				$("#current_page").val(data.page);
				$("#total_page").val(data.totalPage);
				
				info = data.objmap;

				var havaDate=false;
				for (var key in info) {
					if(!havaDate){
						havaDate = true;
					}
                    tm = info[key];
                  
					$("<tr/>").append($("<td/>").append(key)).append(
					$("<td/>").append(getstatusValue(tm["2"]))).append(
					$("<td/>").append(getstatusValue(tm["0"]))).append(
					$("<td/>").append(getstatusValue(tm["1"]))).append(
					$("<td/>").append(getstatusValue(tm["5"]))).append(
					$("<td/>").append(getstatusValue(tm["-3"])))
			     .appendTo($("#bodyid"))
				}
				if(!havaDate){
					//alert("no data");
					containerBody.html("<tr><td colspan='8'>未查询到数据<td></tr>");
					return;
				}
				countdata = data.rsobj;
				/*把该时间段内总量 写到最后*/
				$("<tr/>").append($("<td/>").append("当前时间内总量")).append(
						$("<td/>").append(getstatusValue(countdata["2"]))).append(
						$("<td/>").append(getstatusValue(countdata["0"]))).append(
						$("<td/>").append(getstatusValue(countdata["1"]))).append(
						$("<td/>").append(getstatusValue(countdata["5"]))).append(
						$("<td/>").append(getstatusValue(countdata["-3"])))
				.appendTo($("#bodyid"))				
			} 
		}});

	}

function search_courier_count_waybill(page) {
	
	var target_page = 1;
	var currentpage = parseInt($("#current_page").val());
	if(page==1||page==-1){
		target_page = currentpage+page;
	}
	
	var totalpage = parseInt($("#total_page").val());
	if(totalpage!=null&&totalpage!=''){
		if(target_page>totalpage){
			alert("最后一页啦");
			return;
		}
		if(target_page<1){
			alert("当前是第一页");
			return;
		}
	}
	
	var st = $("#st").val();
	var name = $("#c_real_name").val();
	
	$.ajax({type:"POST",url:"/allocate/count_courier_waybill_date", data:{
		'st' : st,
		'name' : name,
		'page':target_page,
		'size':'10',
		'timestamp':new Date().getTime()
	},contentType:"application/x-www-form-urlencoded;charset=utf-8",success: function(data,status,jqXHR) {
		var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
        if(sessionstatus=="timeout"){
        	 alert("登录超时,请重新登录!");
             location.href="login";
        	 return;
        } 		
		var containerBody = $("#bodyid").empty();
		var htm = "";
		data = $.parseJSON(data);
		s = data.success;
		if (!s) {//查询失败
			alert(data.errors);
			return;
		}
		if (data.objmap != null && !data.objmap.isEmpty) {
			
			/*从查询结果中获取当天查询页和总页数*/
			$("#current_page").val(data.page);
			$("#total_page").val(data.totalPage);
			
			info = data.objmap;
			var havaDate=false;
			for (var key in info) {
				if(!havaDate){
					havaDate = true;
				}
                tm = info[key];
              
				$("<tr/>").append($("<td/>").append(key)).append(
				$("<td/>").append(getstatusValue(tm["2"]))).append(
				$("<td/>").append(getstatusValue(tm["0"]))).append(
				$("<td/>").append(getstatusValue(tm["1"]))).append(
				$("<td/>").append(getstatusValue(tm["5"]))).append(
				$("<td/>").append(getstatusValue(tm["-3"])))
		     .appendTo($("#bodyid"))
			}
			
			if(!havaDate){
				//alert("no data");
				containerBody.html("<tr><td colspan='8'>未查询到数据<td></tr>");
				return;
			}
			
		} 
	}});

}