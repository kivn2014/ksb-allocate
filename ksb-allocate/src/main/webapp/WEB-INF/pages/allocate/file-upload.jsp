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
<head>
	<script type="text/javascript" src="/js/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="/js/jquery/jquery.ajaxfileupload.js"></script>
</head>	
<script type="text/javascript">
        $(function(){
            $(":button").click(function() {
                ajaxFileUpload();
            })
        })
        function ajaxFileUpload() {
            $.ajaxFileUpload
            (
                {
                    url: 'batch_save_courier',
                    secureuri: false,
                    fileElementId: 'file1',
                    dataType: 'json',
                    success:function(data,status)
                    {
                    alert("----"+data+"----"+status);
                    },
                    error: function (data, status, e)
                    {
                      alert(e);
                    }
                }
            )
            return false;
        }
    </script>

<body>
    <p><input type="file" id="file1" name="file" /></p>
    <input type="button" value="提交"/>
   
    <!-- <p><img id="img1" alt="" src=""/></p> -->
</body>

</html>
