	function allocate_login() {
		var un = $("#inputName").get(0).value
		var passwd = $("#inputPassword").get(0).value
		if(un=="" || passwd==""){
			alert("请输入用户名和密码");
			return;
		}
		$.get('/allocate/do_login', {
			"un" : un,
			"pw" : passwd
		}, function(data) {
			data = $.parseJSON(data);
			s = data.success;
			if (!s) {//登录失败
				alert(data.obj);
				return;
			}
			allocate_gotoIndex();
		});
	}

	function sp_login() {
		var un = $("#inputName").get(0).value
		var passwd = $("#inputPassword").get(0).value
		if(un=="" || passwd==""){
			alert("请输入用户名和密码");
			return;
		}
		$.get('/sp/do_login', {
			"un" : un,
			"pw" : passwd
		}, function(data) {
			data = $.parseJSON(data);
			s = data.success;
			if (!s) {//登录失败
				alert(data.obj);
				return;
			}
			sp_gotoIndex();
		});
	}	

	function sp_gotoIndex() {
		//alert("登录成功");
		location.href="/sp/main"
	}
	
	function allocate_gotoIndex() {
		location.href="/allocate/main"
	}