  var map,mapIcons,startpoints;
  var allpoints;
  var markerClusterer;
  var viewpoints;
  $().ready(function(){ 
	  initMap();
	  init_points();
	}); 
  
  function init_points(){
	  startpoints=[];
	  allpoints=[];
	  viewpoints=[];
  }
  function list_view(){
	  location.href="/allocate/main"
  }
  function initMap(){
    	startIcon = new BMap.Icon("/img/startPoint.png", new BMap.Size(26,46));
    	endIcon = new BMap.Icon("/img/endPoint.png", new BMap.Size(26,46));
    	map = new BMap.Map("alldatamap",{enableMapClick:false});
    	
    	var cp = new BMap.Point(116.404, 39.915);
    	map.centerAndZoom(cp, 17);
    	map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    	mapIcons = [startIcon,endIcon];
    }
	
	function batchaddMarker(points,mapIcons){
		var markers = [];
		for (var i = 0; i < points.length; i++) {
		  var startmarker = new BMap.Marker(points[i][0],{icon:mapIcons[0]});
		  var endmarker = new BMap.Marker(points[i][1],{icon:mapIcons[1]});
		  var wbid = points[i][2];
//		  var infowindow = new BMap.InfoWindow(wbid);
//		  startmarker.addEventListener("click",function(e){start_attribute(e,endmarker,wbid)});
//		  endmarker.addEventListener("click",function(e){end_attribute(e,endmarker,wbid)});
		  startmarker.addEventListener("click",function(e){start_attribute(e)});
		  endmarker.addEventListener("click",function(e){end_attribute(e)});
		  
		  /*mark本身是起点*/
		  var markerMenu1=new BMap.ContextMenu();
		  markerMenu1.addItem(new BMap.MenuItem('终点',function(e){start_preallocate(startmarker)}));
		  
		  /*mark本身是终点*/
		  var markerMenu2=new BMap.ContextMenu();
		  markerMenu2.addItem(new BMap.MenuItem('起点',function(e){end_preallocate(endmarker)}));
		  
		  map.addOverlay(startmarker);
		  map.addOverlay(endmarker);
		  
		  markers.push(startmarker);
		  markers.push(endmarker);
		  markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
		  
		  startmarker.addContextMenu(markerMenu1);
		  endmarker.addContextMenu(markerMenu2);
		}
	}
	
	/*mark本身是终点，把它当成起点查询一次*/
	var end_preallocate = function(e){
		var p = e.getPosition();  //获取marker的位置
		init_searchpoint();
		$("#sp_x").val(p.lng);
		$("#sp_y").val(p.lat);
		searchDatabypoint(0);
	}
	/*mark本身是起点，把它当成终点查询一次*/
	var start_preallocate = function(e){
		var p = e.getPosition();  //获取marker的位置
		init_searchpoint();
		$("#bu_x").val(p.lng);
		$("#bu_y").val(p.lat);
		
		searchDatabypoint(0);
	}	
	/*起点做搜索条件*/
	function start_attribute(e){
		var p = e.target.getPosition();  //获取marker的位置
		init_searchpoint();
		$("#sp_x").val(p.lng);
		$("#sp_y").val(p.lat);
		
		searchDatabypoint(0);
	}
	
	/*终点做搜索条件*/
	function end_attribute(e){
		var p = e.target.getPosition();  //获取marker的位置
		init_searchpoint();
		$("#bu_x").val(p.lng);
		$("#bu_y").val(p.lat);
		
		searchDatabypoint(0);
	}
	
	function init_searchpoint(){
		$("#bu_x").val("");
		$("#bu_y").val("");
		$("#sp_x").val("");
		$("#sp_y").val("");
	}
	
	
	/*起点终点画弧线(暂时不用)*/
	function attribute(e,endmark,wbid){
		
		var p = e.target.getPosition();  //获取marker的位置
		//alert("marker的位置是" + p.lng + "," + p.lat);    
		
		var ps = [];
		/*起点坐标*/
		var spoint = new BMap.Point(p.lng, p.lat);
		ps.push(spoint);
		/*终点坐标*/
		var pe = endmark.getPosition();
		var epoint = new BMap.Point(pe.lng, pe.lat);
		ps.push(epoint);
	    /*画弧线*/
		var curve = new BMapLib.CurveLine(ps, {strokeColor:"#33285E", strokeWeight:4, strokeOpacity:0.7,strokeStyle:'dashed'});
		
		curve.addEventListener("click",function(e){getarc(e)});
		map.addOverlay(curve); //添加到地图中
	}
	
	function getarc(e){
		map.removeOverlay(e.target);
	}
	
	// 绘制地图 路线
	function draw_my_path(){
		
		batchaddMarker(allpoints,mapIcons);
	    
	    //map.setViewport(startpoints)
		map.setViewport(viewpoints);
		
	}
	
	
	function search_courier(){
		var ids = $("#tmp_ids").val();
		/*配送状态*/
		var ds = $("#ds").val();
		var realName=$("#real_name").val();
		var phone = $("#phone").val();
		
		$.ajax({type:"POST",url:"/allocate/query_courier", data:{ws:1,ds:ds,real_name:realName,phone:phone,'timestamp':new Date().getTime()},contentType:"application/x-www-form-urlencoded;charset=utf-8", success:function(cdata,status,jqXHR) {
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
							$("<td/>").append(n.phone)).append(
							$("<td/>").append(n.real_name)).append(
							$("<td/>").append(getPsStatus(n.delivery_status))).append(		
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
	
	
	function batch_fpinmap(cid){
		
		var chk_value =[]; 
		$('input[name="wbids"]:checked').each(function(){ 
		 chk_value.push($(this).val()); 
		}); 
		
		if(chk_value.length==0){
			alert('未选择任何运单');
			return;
		}
		
		var ids = chk_value.join("^");
		$("#tmp_ids").val(ids);
		/*配送状态*/
		var ds = $("#ds").val();
		$.ajax({url:"/allocate/query_courier", data:{
			ws:1,
			ds:ds,
			'timestamp':new Date().getTime()
		}, contentType:"application/x-www-form-urlencoded;charset=utf-8",success:function(cdata,status,jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 //alert("");
	             location.href="login";
	        	 return;
	        } 
			var containerBody = $("#courierListId").empty();
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
							$("<td/>").append(n.phone)).append(
							$("<td/>").append(n.real_name)).append(
							$("<td/>").append(getPsStatus(n.delivery_status))).append(		
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
				containerBody.html("<tr><td colspan='4'>未查询到数据<td></tr>");
			}

		}});
	}
	
	
	function searchDatabypoint(page){

		/*处理分页信息*/
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
		
		$.ajax({type:"POST",url:"/allocate/query_waybill",data:{
			'status' : '0',
			'page':target_page,
			'size':'5',
			'sp_x':$("#sp_x").val(),
			'sp_y':$("#sp_y").val(),
			'bu_x':$("#bu_x").val(),
			'bu_y':$("#bu_y").val(),
			'timestamp':new Date().getTime()
		},contentType:"application/x-www-form-urlencoded;charset=utf-8",success: function(data,status,jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 alert("登录超时,请重新登录!");
	             location.href="login";
	        	 return;
	        } 			
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
				$("#waybillview_map").empty();
				info = data.obj;
				$.each(info, function(i, n) {
					 /*数据列表*/
					var html="<input type='checkbox' name='wbids' value="+n.id+">";
					$("<tr/>").append(html).append(
							$("<td/>").append(n.shipper_address)).append(
							$("<td/>").append(n.buyer_address))
							
//							.append(
//							$("<td/>").append("<button/>").find("button").addClass("btn btn-primary").append("map").click(function(){
//						    
//						    draw_onepath(n.shipper_x, n.shipper_y,n.buyer_x,n.buyer_y);
//					}))  
					.appendTo($("#waybillview_map"))	 
					 
				});
			} else {
				//containerBody.html("<tr><td colspan='4'>未查询到数据<td></tr>");
				//alert("未查询到数据");
				$("#waybillview_map").empty();
				$("<tr/>").append("<td colspan='4'>未查询到数据<td>").appendTo($("#waybillview_map"));
			}

		}});

	}
	// 绘制地图 路线
	function draw_onepath(sx,sy,ex,ey){
		map.clearOverlays();
		
	    var points=[];
	    points.push(new BMap.Point(sx,sy));
	    points.push(new BMap.Point(ex,ey));
	    
	    /*画起点*/
		var smarker = new BMap.Marker(points[0],{icon:mapIcons[0]});
		
	    /*画终点*/
		var emarker = new BMap.Marker(points[1],{icon:mapIcons[1]});
		map.addOverlay(smarker);
		map.addOverlay(emarker);
	    
	    /*画弧线*/
	    var curve = new BMapLib.CurveLine(points, {strokeColor:"#33285E", strokeWeight:4, strokeOpacity:0.7,strokeStyle:'dashed'});
	    map.addOverlay(curve); //添加到地图中
	    //curve.enableEditing(); //开启编辑功能
//	    map.centerAndZoom(points[0], 16)
	    map.setViewport(points);
	    
	}
	function searchData2map(page){

		/*处理分页信息*/
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
		
		//查询以后把地图上上次查询结果的展示数据清除掉
		map.clearOverlays();
		init_points();
		
		$.ajax({type:"POST",url:"/allocate/query_waybill", data:{
			'status' : '0',
			'page':target_page,
			'size':'100000',
			'timestamp':new Date().getTime()
		}, contentType:"application/x-www-form-urlencoded;charset=utf-8",success:function(data,status,jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 alert("登录超时,请重新登录!");
	             location.href="login";
	        	 return;
	        } 			
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
					//画点
					 startpoints.push(new BMap.Point(n.shipper_x, n.shipper_y));
					 
					 var tmppoints=[];
					 tmppoints.push(new BMap.Point(n.shipper_x, n.shipper_y));
					 tmppoints.push(new BMap.Point(n.buyer_x,n.buyer_y));
					 tmppoints.push(n.id);
					 
					 viewpoints.push(tmppoints[0]);
					 viewpoints.push(tmppoints[1]);
					 
					 allpoints.push(tmppoints);
				});
				draw_my_path();
			} else {
				alert("查询无数据");
			}

		}});
	}
	
	function reload_map_list(){
		searchData2map(0);
		searchDatabypoint(0);
		
	}
	
	