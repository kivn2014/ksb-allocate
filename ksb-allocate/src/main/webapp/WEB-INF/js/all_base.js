	
	function search_allwaybill(page) {
		
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
		
		$.ajax({type:"POST",url:"/allocate/query_waybill", data:{
			'status' : '',
			'wbid' : $("#wb_id").val(),
			'page':target_page,
			'size':'10',
			'sp_address':$("#sp_address").val(),
			'bu_address':$("#bu_address").val(),
			'c_phone':$("#c_phone").val(),
			'c_realname':$("#c_realname").val(),
			'timestamp':new Date().getTime()
				
		}, contentType:"application/x-www-form-urlencoded;charset=utf-8",success:function(data,status,jqXHR) {
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
			if (data.obj != null && data.obj.length > 0) {
				
				/*从查询结果中获取当天查询页和总页数*/
				$("#current_page").val(data.page);
				$("#total_page").val(data.totalPage);
				
				info = data.obj;
				$.each(info, function(i, n) {
					//$("<tr/>").append($("<td/>").append(n.id)).append(
					$("<tr/>").append($("<td/>").append(n.create_time)).append(
							$("<td/>").append(n.shipper_address)).append(
							$("<td/>").append(n.buyer_address)).append(
							$("<td/>").append(n.courier_realname)).append(		
							$("<td/>").append(getStatus(n.status))) 
					       .appendTo($("#bodyid"))

				});

			} else {
				containerBody.html("<tr><td colspan='8'>未查询到数据<td></tr>");
			}

		}});

	}