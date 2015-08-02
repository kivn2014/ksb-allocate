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
<style type="text/css">
	</style>
<title>快送宝 订单按天统计</title>
<link href="/css/order_base.css" rel="stylesheet" type="text/css" id="style_color" />
<script src="/js/jquery/jquery.min.js"></script>
<script src="/js/bootstrap/bootstrap-datetimepicker.min.js"></script>
<script src="/js/bootstrap/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="/js/bootstrap/bootstrap.min.js"></script>
<script src="/js/statistics_base.js"></script>
<link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">
<link href="/css/dashboard.css" rel="stylesheet">
 <link href="/css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet">

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
				<li><a href="<%=request.getContextPath()%>/api/add_waybill"
					target="_blank"><font color="red">在线下单</font></a></li>
				<%-- <li><a href="<%=request.getContextPath()%>/openapi/fp_waybill"
					target="_blank"><font color="red">运单分配</font></a></li> --%>
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
					<li><a href="all_waybill">所有</a></li>
					<li><a href="main">待分配</a></li>
					<li><a href="sp_main">商家用户</a></li>
					<li><a href="courier_main">配送员</a></li>
					<li class="active"><a href="count_waybill_page">订单统计<span class="sr-only">(current)</span></a></li>
					<li><a href="count_courier_waybill_page">配送员订单统计</a></li>
				</ul>
			</div>
			<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
				<h1 class="page-header">快送宝 订单统计</h1>
				<form class="form-inline">
				 <input size="16" type="text" value="" id="st" readonly class="form-control form_datetime">
				  <script type="text/javascript">
                    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd',language:'zh-CN',minView:2,autoclose:true});
                  </script> 
				  <input size="16" type="text" value="" id="et" readonly class="form-control form_datetime">
				  <script type="text/javascript">
                    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd',language:'zh-CN',minView:2,autoclose:true});
                  </script> 				 		
					<button type="button" onclick="javascript:search_count_waybill(0)"
						class="btn btn-default" id="dataSearchId">查询</button>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					
				</form><br/>
				<div class="table-responsive">
					<table class="table table-striped">
						<thead>
							<tr>
								<th>日期</th>
								<th>待分配</th>
								<th>分配待取</th>
								<th>配送中</th>
								<th>完成</th>
								<th>取消</th>
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
							<li><a href="javascript:search_count_waybill(-1)">Previous</a></li>
							<li><a href="javascript:search_count_waybill(1)">Next</a></li>
						</ul>
						</nav>
					</div>
				</div>

			</div>
		</div>
	</div>

</body>

</html>

