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

<title>快送宝 分配运单</title>
<script src="/js/jquery/jquery-2.1.4.min.js"></script>
<script src="/js/all_base.js"></script>
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
				<%-- <li><a href="<%=request.getContextPath()%>/openapi/add_waybill"
					target="_blank"><font color="red">在线下单</font></a></li> --%>
				<li><a href="http://www.3gongli.com/" target="_blank">联系我们</a></li>
				<li><a href="#">帮助</a></li>
			</ul>
		</div>
	</div>
	</nav>

	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-3 col-md-2 sidebar">
				<ul class="nav nav-sidebar">
					<li class="active"><a href="all_waybill">所有<span class="sr-only">(current)</span></a></li>
					<li><a href="main">待分配</a></li>
					<li><a href="sp_main">商家用户</a></li>
					<li><a href="courier_main">配送员</a></li>	
					<li><a href="count_waybill_page">订单统计</a></li>
					<li><a href="count_courier_waybill_page">配送员订单统计</a></li>										
				</ul>

			</div>
			<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
				<h1 class="page-header">快送宝 运单分配管理</h1>

				<form class="form-inline">
				<input type="text" id="wb_id" class="form-control" placeholder="运单编号" required autofocus>
				<input type="text" id="sp_address" class="form-control" placeholder="发货地址" required autofocus>
				<input type="text" id="bu_address" class="form-control" placeholder="收货地址" required autofocus>
				<input type="text" id="c_realname" class="form-control" placeholder="配送员真实姓名" required autofocus>
				<input type="text" id="c_phone" class="form-control" placeholder="配送员手机号" required autofocus>
					<button type="button" onclick="javascript:search_allwaybill(0)"
						class="btn btn-default" id="dataSearchId">查询</button>
				</form>
				<div class="table-responsive">
					<table class="table table-striped">
						<thead>
							<tr>
								<th>运单编号</th>
								<th>下单时间</th>
								<th>商家地址</th>
								<th>收货人地址</th>
								<th>配送员</th>
								<th>状态</th>
							</tr>
						</thead>
						<tbody id="bodyid">

						</tbody>
					</table>
					<div>
						<input type="hidden" id="current_page" value="1" /> <input
							type="hidden" id="total_page" value="1" />
						<nav>
						<ul class="pager">
							<li><a href="javascript:search_allwaybill(-1)">Previous</a></li>
							<li><a href="javascript:search_allwaybill(1)">Next</a></li>
						</ul>
						</nav>
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
					<input type="text" id="c_name" class="form-control"
						placeholder="用户名" required autofocus> <input type="text"
						id="c_realname" class="form-control" placeholder="真实姓名" required
						autofocus>
					<button type="button" onclick="javascript:search_courier()"
						class="btn btn-default" id="searchCourier">search</button>
				</form>
				<table class="table table-striped dssBasic">
					<thead>
						<tr>
							<td>用户名</td>
							<td>真实姓名</td>
							<td>操作</td>
						</tr>
					</thead>
					<tbody id="courierListId">

					</tbody>
				</table>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" id="stopDss"
					data-dismiss="modal">关闭</button>
			</div>
		</div>
	</div>
</div>
</html>

