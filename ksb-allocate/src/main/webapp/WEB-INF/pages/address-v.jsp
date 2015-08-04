
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!--[if IE 8]> <html class="ie8" lang="zh"> <![endif]-->
<!--[if IE 9]> <html class="ie9" lang="zh"> <![endif]-->
<!--[if !IE]><!-->
<html lang="zh">
<!--<![endif]-->
<head>
<meta charset="utf-8" />
<title>快送宝 地址验证</title>

<link
	href="/css/bootstrap/bootstrap.min.css"
	rel="stylesheet">
<script
	src="/js/jquery/jquery-2.1.4.min.js"></script>

<script type="text/javascript">
	$(document).ready(function() {
        var cityName = $("#fromCity").val();
		$('#search_from_suggest').bind('input', function() {
			 
			var ad = $("#from_address_suggest").get(0).value;
            
			var a = '/sp/bd_address?city_name='+encodeURIComponent(cityName)+'&address=' + encodeURIComponent(ad)

			$.get(a, {}, function(data) {
				var containerBody = $("#address-select").empty();
				var htm = "";
				data = $.parseJSON(data);
                var mg = data.message;
                if(mg!='ok'){
                	return;
                }
				result = data.result;

				$.each(result, function(i, n) {

					htm += "<option>" +n.city+'-'+n.district+'-'+ n.name + "</option>"

				});

				containerBody.html(htm);

			});

		});

	});
</script>

</head>
<body>


	<div class="panel-body clearfix" id="search_from_suggest">
		<div class="form-body">
			<div class="form-group">
				<h5 class='color-gray'>
					<strong>建议：输入相关的地址，从系统下拉地址里选择选择</strong>
				</h5>
				<div id="from_address_selector">
				    <div>                                        
				        <select id="fromCity" class="from-address-info-city">
                               <option selected="selected" value="广州市" data-name="广州市">广州市</option>
                               <option  value="东莞市" data-name="东莞市">东莞市</option>
                               <option  value="济南市" data-name="济南市">济南市</option>
                               <option  value="深圳市" data-name="深圳市">深圳市</option>
                               <option  value="北京市" data-name="北京市">北京市</option>
                       </select></div><br/>
					<div class="input-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
					    
						<input class="form-control" type="text" autocomplete="off"
							placeholder="输入您所在的大厦名称或周边标志性建筑" name="from_address_suggest"
							id="from_address_suggest" /> <span class="input-group-btn"></span>
					</div>

				</div>
			</div>

		</div>
	</div>

	</div>

	<form role="form">

		<div class="input-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
			<select multiple class="form-control" id="address-select"
				style="height: 400px;">
				<tbody id="address-detail">
			</select>
		</div>
</body>
</html>
