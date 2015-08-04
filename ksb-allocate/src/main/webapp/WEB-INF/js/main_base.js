  var map,mapIcons;
  $().ready(function(){ 
	 // initMap();
	}); 
  
  function closeMap(){
	  $(".smallMapDiv").hide();
  }
  function map_view(){
	  location.href="/allocate/main_map"
  }
  function initMap(){
    	startIcon = new BMap.Icon("/img/startPoint.png", new BMap.Size(26,46));
    	endIcon = new BMap.Icon("/img/endPoint.png", new BMap.Size(26,46));
    	//map = new BMap.Map("allmap",{enableMapClick:false});
    	map = new BMap.Map("helpMapContainer",{enableMapClick:false});
    	var cp = new BMap.Point(116.404, 39.915);
    	map.centerAndZoom(cp, 17);
    	map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    	mapIcons = [startIcon,endIcon];
    }
	function addMarker(points){
		for (var i = 0; i < points.length; i++) {
		  var marker = new BMap.Marker(points[i],{icon:mapIcons[i]});
		  map.addOverlay(marker);
		}
	}
	
	// 绘制地图 路线
	function draw_my_path(sx,sy,ex,ey){
		map.clearOverlays();
		
	    var points=[];
	    points.push(new BMap.Point(sx,sy));
	    points.push(new BMap.Point(ex,ey));
	    /*地图上添加点*/
	    addMarker(points);
	    
	    /*画弧线*/
	    var curve = new BMapLib.CurveLine(points, {strokeColor:"#33285E", strokeWeight:4, strokeOpacity:0.7,strokeStyle:'dashed'});
	    map.addOverlay(curve); //添加到地图中

	    map.setViewport(points)
	}
	
	function view_inmap(points){
		 map.setViewport(points)
	}
	
	function search_courier(){
		//alert("333");
	}
	
	function batch_fp(){
		var chk_value =[]; 
		$('input[name="wbids"]:checked').each(function(){ 
		 chk_value.push($(this).val()); 
		}); 
		
		if(chk_value.length==0){
			alert('未选择任何运单');
			return;
		}
		
		var ids = chk_value.join("^");
		
		$.ajax({type:"POST",url:"/allocate/query_courier", data:{work_status:1,'timestamp':new Date().getTime()},contentType:"application/x-www-form-urlencoded;charset=utf-8", success:function(cdata,status,jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 alert("登录超时,请重新登录!");
	             location.href="login";
	        	 return;
	        } 
			var containerBody = $("#courierListId").empty();
			var htm = "";
			cdata = $.parseJSON(cdata);
			s = cdata.success;
			if (!s) {//查询失败
				alert(cdata.errors);
				return;
			}
			if (cdata.obj != null && cdata.obj.length > 0) {
				cinfo = cdata.obj;
				$.each(cinfo, function(i, n) {
					$("<tr/>").append(
							$("<td/>").append(n.id)).append(
							$("<td/>").append(n.name)).append(
							$("<td/>").append(n.real_name)).append(
							$("<td/>").append("<button/>").find("button").addClass("btn btn-primary").append("分给他").click(function(){
								$.post("/allocate/batch_allocate", {
									"cid":n.id,
									"wbids":ids
								}, function(d){
									d = $.parseJSON(d);
									ss = d.success;
									if (!ss) {//查询失败
										alert(cdata.errors);
										return;
									}else{
										alert("分配完毕");
										return;
									}
								});
					}))  
					.appendTo($("#courierListId"))
					
					 $('#courierModal').modal({});
				});
			} else {
				alert("未查询到可用的配送员");
				containerBody.html("<tr><td colspan='4'>未查询到数据<td></tr>");
			}

		},error:function(){
			alert("操作异常");
//            location.href="login";
       	    return;
		}});
	}
	
	
	function search_waybill(page) {
		
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
		
		$.ajax({type:"POST", url:"/allocate/query_waybill", data:{
			'status' : '2',
			'page':target_page,
			'size':'10',
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
					var html="<input type='checkbox' name='wbids' value="+n.id+">";
					var mapButton = "<button type='button'  class='btn btn-default' data-target='#addModal'>";
					$("<tr/>").append($("<td/>").append(html)).append($("<td/>").append(n.create_time)).append(
							$("<td/>").append(n.id)).append(
							$("<td/>").append(n.shipper_name)).append(
							$("<td/>").append(n.shipper_address+"-"+n.shipper_address_detail)).append(
							$("<td/>").append(n.buyer_address)).append(
							$("<td/>").append(getStatus(n.status))).append(
							$("<td/>").append("<button/>").find("button").addClass("btn btn-primary").append("地图").click(function(){
								
							$(".smallMapDiv").show();
							initMap();
						    
						    draw_my_path(n.shipper_x, n.shipper_y,n.buyer_x,n.buyer_y);
					}))  
					.appendTo($("#bodyid"))

				});

			} else {
				containerBody.html("<tr><td colspan='8'>未查询到数据<td></tr>");
			}
		},error:function(){
           // location.href="login";
			alert("操作异常");
       	    return;
		}});

	}