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
<title>快送宝 商户管理</title>

<script src="/js/jquery/jquery-2.1.4.min.js"></script>
<script src="/js/waybill_status.js"></script>
<script src="/js/sp_base.js"></script>
<link href="/css/order_base.css" rel="stylesheet" type="text/css" id="style_color" />
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
				<li><a href="http://www.3gongli.com/" target="_blank">主页</a></li>
			</ul>
		</div>
	</div>
	</nav>

	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-3 col-md-2 sidebar">
				<ul class="nav nav-sidebar">
					<li><a href="all_waybill">所有</a></li>
					<li><a href="main">待分配</a></li>
					<li class="active"><a href="sp_main">商家用户<span class="sr-only">(current)</span></a></li>
					<li><a href="courier_main">配送员</a></li>
					<li><a href="count_waybill_page">订单统计</a></li>
					<li><a href="count_courier_waybill_page">配送员订单统计</a></li>						
				</ul>
			</div>
			<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
				<h1 class="page-header">快送宝 商家管理</h1>
                
				<form class="form-inline">
				    <input class="form-control" type="text" autocomplete="off"
							placeholder="商家名称" id="spname" />
					<button type="button" onclick="javascript:search_sp(0)"
						class="btn btn-default" id="dataSearchId">查询</button>	
					&nbsp;&nbsp;&nbsp;&nbsp;		
					<button type="button" class="btn btn-default" onclick="javascript:open_sp_tip()" id="add_page">添加商户</button>		
					
				</form>
				<div class="table-responsive">
					<table class="table table-striped">
						<thead>
							<tr>
								<!-- <th>城市</th> -->
								<th>商家名称</th>
								<!-- <th>用户名</th> -->
								<th>手机号</th>
								<th>状态</th>
								<th>地址</th>
								<!-- <th>管理</th> -->
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
							<li><a href="javascript:search_sp(-1)">Previous</a></li>
							<li><a href="javascript:search_sp(1)">Next</a></li>
						</ul>
						</nav>
					</div>
				</div>

			</div>
		</div>
	</div>

</body>

<div class="optDiv" >
			<div>
				
				<h4 class="modal-title" id="myModalLabel">添加商家</h4>
			</div>
			<div class="modal-body">
				<form class="form-inline">
				    
					商家名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" id="sp_name" class="form-control"
						placeholder="商家名称" required autofocus> <br/> <br/>
					商家手机号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text"
						id="sp_phone" class="form-control" placeholder="手机号" required
						autofocus>	 <br/> <br/>						
					商家登录密码： <input type="text"
						id="sp_passwd" class="form-control" placeholder="密码" required
						autofocus> <br/> <br/>	
									
					<button type="button" onclick="javascript:add_sp_user()"
						class="btn btn-default" onclick="javascript:add_sp_user()">添加</button>
				</form>

			</div>
			<span class="closeHelpMap" onclick="javascript:close_sp_tip()"></span>
</div>
</html>

