	function getStatus(code){
		
		if(code=='2'){
			return "待分配["+code+"]";
		}else if(code=='0'){
			return "分配待处理["+code+"]"
		}else if(code=='1'){
			return "配送中["+code+"]"
		}else if(code=='5'){
			return "完成配送["+code+"]"
		}else if(code=='-1'){
			return "回库["+code+"]"
		}else if(code=='-2'){
			return "拒收["+code+"]"
		}else if(code=='-3'){
			return "取消["+code+"]"
		}
	}
	
	function getActionStatus(code){
		
		if(code=='0'){
			return "明细";
		}else if(code=='1'){
			return "取件"
		}else if(code=='3'){
			return "配送中["+code+"]"
		}else if(code=='5'){
			return "完成配送["+code+"]"
		}else if(code=='-1'){
			return "已经取消["+code+"]"
		}else if(code=='-2'){
			return "拒收["+code+"]"
		}
	}	
	
	function getWorkStatus(code){
		if(code=='1'){
			return "开工"
		}else if(code=='2'){
			return "收工"
		}else{
			return "未知"
		}	
	}
	
	function getPsStatus(code){
		if(code=='0'){
			return "空闲"
		}else if(code=='1'){
			return "配送中"
		}else{
			return "未知"
		}	
	}
	
	function getspUserStatus(code){
		if(code=='0'){
			return "正常";
		}else if(code!='0'){
			return "锁定";
		}
	}