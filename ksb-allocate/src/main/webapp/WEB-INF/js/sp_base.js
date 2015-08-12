  var map;
  var allpoints;
  var geoc;
  $().ready(function(){ 
	 // initMap();
	}); 
  
  function closeMap(){
	  $(".smallMapDiv").hide();
  }
  function closeBigMap(){
	  $(".bigMapDiv").hide();
  }
  function map_view(){
	  location.href="/allocate/main_map"
  }
  function initMap(){
    	
    	//map = new BMap.Map("allmap",{enableMapClick:false});
    	map = new BMap.Map("helpMapContainer",{enableMapClick:false});
    	var cp = new BMap.Point(116.404, 39.915);
    	map.centerAndZoom(cp, 18);
    	map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
//    	mapIcons = [startIcon,endIcon];
    }	

  function initBigMap(){
  	
  	map = new BMap.Map("bigMapContainer",{enableMapClick:false});
  	var cp = new BMap.Point(116.404, 39.915);
  	map.centerAndZoom(cp, 18);
  	map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
  	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
//  	mapIcons = [startIcon,endIcon];
  }
  
	// 绘制地图 路线
	function draw_courier(x,y){
		map.clearOverlays();
		
	    /*地图上添加点*/
		var courierIcon = new BMap.Icon("/img/courier-icon1.png", new BMap.Size(26,46));
		var cp = new BMap.Point(x, y);
		var marker = new BMap.Marker(cp,{icon:courierIcon});
		map.addOverlay(marker);
		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		
	    map.centerAndZoom(cp, 17);
	}
 
   function view_courier_map(){
		
		var realName=$("#c_real_name").val();
		var phone=$("#c_phone").val();
		$.ajax({type:'POST',url:"/allocate/query_courier", data:{
			'real_name' : realName,
			'phone':phone,
			'page':1,
			'size':'100000'
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
				
				info = data.obj;
				allpoints=[];
				
				$(".bigMapDiv").show();
				initBigMap();	
				
				$.each(info, function(i, n) {
					//查询结果展现在地图上

					var work_status = n.work_status;
					var real_name = n.real_name;
					var point = new BMap.Point(n.address_x, n.address_y)
					drawpoint(point,work_status,real_name);
					
				});

				map.setViewport(allpoints);
				
			} else {
				//containerBody.html("<tr><td colspan='5'>未查询到数据<td></tr>");
				alert("未查询到匹配的配送员");
			}

		},error:function(){
			alert("操作异常");
			return;
		}});	   
	   
	   
	}

   
   function drawpoint(point,status,name){
	   
	    allpoints.push(point);
	   
    	var pointIcon;
    	
		if(status=='1'){
			pointIcon = new BMap.Icon("/img/startPoint.png", new BMap.Size(26,46));
		}else{
			pointIcon = new BMap.Icon("/img/endPoint.png", new BMap.Size(26,46));
		}
		var marker = new BMap.Marker(point,{icon:pointIcon});
		map.addOverlay(marker);
		
		var opts = {
				  width : 100,     // 信息窗口宽度
				  height: 100,     // 信息窗口高度
				  title : name , // 信息窗口标题
				  enableMessage:false,//设置允许信息窗发送短息
				  message:""
				}
				
				marker.addEventListener("click", function(){    
					geoc = new BMap.Geocoder(); 
					geoc.getLocation(point, function(rs){
					var addComp = rs.addressComponents;
					
					var addressDetail = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
					
					var infoWindow = new BMap.InfoWindow(addressDetail, opts);  // 创建信息窗口对象 
					map.openInfoWindow(infoWindow,point); //开启信息窗口
					});

				});
		
		var label = new BMap.Label(name,{offset:new BMap.Size(20,-10)});
		marker.setLabel(label);
   }
   
   
function open_sp_tip(){
		$(".optDiv").show();
	}
	
	function close_sp_tip(){
		$(".optDiv").hide();
		/*刷新页面*/
		search_sp(0);
	}

	function open_courier_tip(){
		$(".optDiv").show();
	}
	
	function close_courier_tip(){
		$(".optDiv").hide();
		/*刷新页面*/
		search_courier(0);
	}
	
	function switchSaveCourierType(t){
		if(t==''){
			return;
		}
		
		/*批量创建*/
		if(t=='0'){
			$("#form_id").css('display','none');
			$("#file_id").css('display','block');
			return;
		}
		
		/*单个创建*/
		if(t=='1'){
			$("#form_id").css('display','block');
			$("#file_id").css('display','none');
			return;
		}
	}
	
    function ajaxFileUpload() {
        $.ajaxFileUpload
        (
            {
                url: 'batch_save_courier',
                secureuri: false,
                fileElementId: 'courier-file',
                dataType: 'json',
                success:function(data,status)
                {
                	alert("执行结果：123");
                },
                error: function (data, status, e)
                {
                  alert(e);
                }
            }
        )
        $("#courier-file").val("");
        alert("数据已经提交!");
        //return false;
    }	
	function add_sp_user(){
		var map={sp_name:'1',sp_user:'2',sp_passwd:'3',sp_phone:'4'};
		$(".optDiv").find("input").each(function(){
			
            //alert($(this).attr("id"));
            //map.$(this).attr("id")=$(this).val();
			var id = $(this).attr("id");
            if(id=='sp_name'){
            	map.sp_name=$(this).val();
            }else
            if(id=='sp_passwd'){
            	map.sp_passwd=$(this).val();
            }else
            if(id=='sp_phone'){
            	map.sp_phone=$(this).val();
            }
        });
		
		if(map.sp_name==''){
			alert("商家名称为空");
			return;
		}

		if(map.sp_passwd==''){
			alert("密码为空");
			return;
		}
		if(map.sp_phone==''){
			alert("手机号为空");
			return;
		}
		do_save_sp(map.sp_name,map.sp_user,map.sp_passwd,map.sp_phone);
	}

	function add_courier(){
		var map={c_real_name:'1',c_name:'2',c_passwd:'3',c_phone:'4'};
		$(".optDiv").find("input").each(function(){
			
            //alert($(this).attr("id"));
            //map.$(this).attr("id")=$(this).val();
			var id = $(this).attr("id");
            if(id=='c_real_name'){
            	map.c_real_name=$(this).val();
            }else
            if(id=='c_passwd'){
            	map.c_passwd=$(this).val();
            }else
            if(id=='c_phone'){
            	map.c_phone=$(this).val();
            }
        });
		
		if(map.c_real_name==''){
			alert("真实姓名");
			return;
		}
		if(map.c_name==''){
			alert("登录用户名");
			return;
		}
		if(map.c_passwd==''){
			alert("密码为空");
			return;
		}
		if(map.c_phone==''){
			alert("手机号为空");
			return;
		}
		do_save_courier(map.c_real_name,map.c_passwd,map.c_phone);
	}
	
	
   function do_save_sp(spName,spUser,spPasswd,spPhone){
		
	   $.ajax({type:'POST',url:"/sp/save_sp", data:{
			sp_name:spName,
			name:'sp',
			passwd:spPasswd,
			phone:spPhone
		}, contentType:"application/x-www-form-urlencoded;charset=utf-8",success:function(cdata,status,jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 alert("登录超时,请重新登录!");
	             location.href="login";
	        	 return;
	        } 
			cdata = $.parseJSON(cdata);
			s = cdata.success;
			if (!s) {//查询失败
				alert("创建失败: "+cdata.errors);
				return;
			}else{
				alert("添加成功");
//				clearAdd();
//				search_sp(0);
				close_sp_tip();
			}
		}});
	}
   function do_save_courier(realName,passwd,phone){
		
	   $.ajax({type:'POST',url:"/allocate/save_courier", data:{
			real_name:realName,
			pwd:passwd,
			phone:phone
		}, contentType:"application/x-www-form-urlencoded;charset=utf-8",success:function(cdata,status,jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus=="timeout"){
	        	 alert("登录超时,请重新登录!");
	             location.href="login";
	        	 return;
	        } 
			cdata = $.parseJSON(cdata);
			s = cdata.success;
			if (!s) {//查询失败
				alert("创建失败: "+cdata.errors);
				return;
			}else{
				alert("添加成功");
//				clearAdd();
//				search_sp(0);
				close_courier_tip();
			}
		}});
	}	
	function clearAdd(){
		$(".optDiv").find("input").each(function(){
			
			$(this).val("");
        });
	}
   
   
	function search_sp(page) {
		
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
		
		var sp_name=$("#spname").val();
		$.ajax({type:"POST", url:"/sp/query_sp_user", data:{
			'sp_name' : sp_name,
			'page':target_page,
			'size':'10'
		}, contentType:"application/x-www-form-urlencoded;charset=utf-8",success:function(data,status,jqXHR) {
			var sessionstatus=jqXHR.getResponseHeader("sessionstatus");
	        if(sessionstatus!=''&&sessionstatus=="timeout"){
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
					$("<tr/>").append(
							$("<td/>").append(n.sp_name)).append(
//							$("<td/>").append(n.name)).append(
							$("<td/>").append(n.phone)).append(
							$("<td/>").append(getspUserStatus(n.status))).append(
							$("<td/>").append(n.address))
//							.append(
//							$("<td/>").append("<button/>").find("button").addClass("btn btn-primary").append("锁定").click(function(){
//						    
//					}))  
					.appendTo($("#bodyid"))

				});

			} else {
				containerBody.html("<tr><td colspan='6'>未查询到数据<td></tr>");
			}

		}});
	}
	
	function search_courier(page) {
		
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
		
		var realName=$("#c_real_name").val();
		var phone=$("#c_phone").val();
		$.ajax({type:"POST",url:"/allocate/query_courier", data:{
			'real_name' : realName,
			'phone':phone,
			'page':target_page,
			'size':'10'
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
					$("<tr/>").append(
							$("<td/>").append(n.real_name)).append(
							//$("<td/>").append(n.name)).append(
							$("<td/>").append(n.phone)).append(
							$("<td/>").append(getWorkStatus(n.work_status))).append(
							$("<td/>").append(getPsStatus(n.delivery_status)))
							.append(
							$("<td/>").append("<button/>").find("button").addClass("btn btn-primary").append("位置").click(function(){
								$(".smallMapDiv").show();
								initMap();							    
								draw_courier(n.address_x, n.address_y);
						    
					}))  
					.appendTo($("#bodyid"))

				});

			} else {
				containerBody.html("<tr><td colspan='5'>未查询到数据<td></tr>");
			}

		}});

	}	
	