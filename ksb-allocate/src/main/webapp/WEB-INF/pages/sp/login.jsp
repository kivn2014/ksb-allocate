<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <meta name="description" content="">
    <meta name="author" content="">

    <title>快送宝 统一登录平台</title>

    <!-- Bootstrap core CSS -->
    <!-- <link href="${pageContext.request.contextPath}/css/bootstrap/bootstrap.min.css" rel="stylesheet"> -->
    <link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet">
    
    <link href="/css/signin.css" rel="stylesheet">
    <script src="/js/jquery/jquery-2.1.4.min.js"></script>
    <script src="/js/login.js"></script>

    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
   <!--  <script src="../../assets/js/ie-emulation-modes-warning.js"></script> -->

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
<script type="text/javascript">

</script>
</head>

  <body>

    <div class="container">

      <form class="form-signin" id="loginForm">
        <h2 class="form-signin-heading">快送宝 统一登录平台</h2>
        <label for="inputName" class="sr-only">User name</label>
        <input type="text" id="inputName" value="13012345678" class="form-control" placeholder="User name" required autofocus>
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" value="7890" class="form-control" placeholder="Password" required>
        <button class="btn btn-lg btn-primary btn-block" type="button" onclick="javascript:sp_login()">登录</button>
      </form>

    </div>

  </body>
</html>
