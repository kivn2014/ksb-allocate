<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="description" content="">
<meta name="author" content="">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />

<title>快送宝 订单管理</title>
<script type="text/javascript"
	src="http://api.map.baidu.com/api?v=2.0&ak=zNC2uIzYGKnY3V8D7iCBbLsi"></script>
<script type="text/javascript"
	src="http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>
<script type="text/javascript"
	src="http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js"></script>
<script type="text/javascript"
	src="http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js"></script>
<script src="/js/jquery/jquery-2.1.4.min.js"></script>
<script src="/js/mainmap_base.js"></script>
<script src="/js/waybill_status.js"></script>
<script src="/js/bootstrap/bootstrap.min.js"></script>
<link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">
<link href="/css/dashboard.css" rel="stylesheet">

<script type="text/javascript">
	
</script>

</head>

<body>
	<nav class="navbar navbar-inverse navbar-fixed-top">
	<div class="container-fluid">
		<div class="navbar-header">
			<a class="navbar-brand" href="#">3 KM</a>
		</div>
		<div id="navbar" class="navbar-collapse collapse">
			<ul class="nav navbar-nav navbar-right">
				<li><a href="logout">退出</a></li>
			 	<li><a href="<%=request.getContextPath()%>/sp/add_waybill"
					target="_blank"><font color="red">在线下单</font></a></li>
			<%--	<li><a href="<%=request.getContextPath()%>/openapi/fp_waybill"
					target="_blank"><font color="red">运单分配</font></a></li> --%>
				<li><a href="http://www.3gongli.com/" target="_blank">主页</a></li>
				<li><a href="#">帮助</a></li>
			</ul>
		</div>
	</div>
	</nav>

	<div class="container-fluid">
		<div class="row">

			<div class="col-sm-3 col-md-2 sidebar">
				<ul class="nav nav-sidebar">
				    <li><a href="all_waybill">所有</a></li>
					<li class="active"><a href="main">待分配<span class="sr-only">(current)</span></a></li>
					<li><a href="sp_main">商家用户</a></li>
					<li><a href="courier_main">配送员</a></li>
					<li><a href="count_waybill_page">订单统计</a></li>
					<li><a href="count_courier_waybill_page">配送员订单统计</a></li>						
				</ul>

			</div>
			<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
				<h1 class="page-header">快送宝 运单分配管理</h1>

				<form class="form-inline">
					<button type="button" onclick="javascript:searchData2map(0)"
						class="btn btn-default">查询</button>
					<button type="button" onclick="javascript:batch_fpinmap()"
						class="btn btn-default" id="batchFpInMap">批量分配</button>
					<button type="button" onclick="javascript:list_view()"
						class="btn btn-default">列表视图</button>
						
					<input type="hidden" id="current_page" value="1" /> 
					<input type="hidden" id="total_page" value="1" /> 
					
					<input type="hidden" id="sp_x" value="" /> 
					<input type="hidden" id="sp_y" value="" />
					<input type="hidden" id="bu_x" value="" />
					<input type="hidden" id="bu_y" value="" />
				</form>

				<div class="row">
					<div class="col-md-7">
						<div id="alldatamap"
							style="width: 100%; height: 400px; margin: 0; font-family: '微软雅黑';"></div>
						<div class="input-group input-group-lg" style="width: 100%;"></div>
					</div>
					<div class="table-responsive col-md-5">
						<table class="table table-striped">
							<thead>
								<tr>
								    <th></th>
									<th>商家地址</th>
									<th>买家地址</th>
								</tr>
							</thead>
							<tbody id="waybillview_map">
							</tbody>
						</table>
						<div>
							<nav>
							<ul class="pager">
								<li><a href="javascript:searchDatabypoint(-1)">Previous</a></li>
								<li><a href="javascript:searchDatabypoint(1)">Next</a></li>
							</ul>
							</nav>
						</div>
					</div>

				</div>

			</div>


		</div>
	</div>
</body>
<div class="modal fade" id="courierModal" tabindex="-1" role="dialog"
	aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">
					<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
				</button>
				<h4 class="modal-title" id="myModalLabel">配送员列表</h4>
			</div>
			<div class="modal-body">
				<form class="form-inline">
					<!-- <input type="text" id="c_name" class="form-control"
						placeholder="用户名" required autofocus> <input type="text"
						id="c_realname" class="form-control" placeholder="真实姓名" required
						autofocus> -->
					状态:<select class="form-control" id="ds">
						<option value="">所有</option>
						<option value="0">空闲</option>
						<option value="1">配送中</option>
					</select>
					<input type="text" id="real_name" placeholder="真实姓名" required
						autofocus />
					<input type="text" class="form-control" id="phone" placeholder="手机号" required
						autofocus/>
					<input type="hidden" id="tmp_ids"/>
					<button type="button" onclick="javascript:search_courier()"
						class="btn btn-default" id="searchCourier">查询</button>						
				</form>
				<table class="table table-striped dssBasic">
					<thead>
						<tr>
							<td>id</td>
							<td>手机号</td>
							<td>真实姓名</td>
							<td>配送状态</td>
							<td>操作</td>
						</tr>
					</thead>
					<tbody id="courierListId">

					</tbody>
				</table>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" id="stopDss"
					data-dismiss="modal" onclick="javascript:reload_map_list()">关闭</button>
			</div>
		</div>
	</div>
</div>
</html>

