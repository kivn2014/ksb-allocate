package com.ksb.web.openapi.controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ksb.openapi.entity.CourierEntity;
import com.ksb.openapi.entity.ResultEntity;
import com.ksb.openapi.entity.ShipperUserEntity;
import com.ksb.openapi.mobile.service.CourierService;
import com.ksb.openapi.mobile.service.ShipperService;
import com.ksb.openapi.service.WaybillService;
import com.ksb.openapi.util.HTTPUtils;
import com.ksb.web.openapi.entity.AjaxEntity;
import com.ksb.web.openapi.entity.ResultPageEntity;

@Controller
@RequestMapping("/sp")
public class SpController {

	private Logger log = LogManager.getLogger(getClass());
	
	private static final int defaultSize = 10;
	
	/*运单服务管理接口*/
	@Autowired
	WaybillService waybillService;
	
	@Autowired
	CourierService courierService;
	
	@Autowired
	ShipperService shipperService;
	
	@RequestMapping("/login")
	public String login() throws Exception {

		return "sp/login";
	}

	@RequestMapping("/logout")
	public String logout(HttpServletRequest request){
		request.getSession().removeAttribute("SP_USER");
		return "sp/login";
	}
	
	@RequestMapping("/do_login")
	public @ResponseBody
	       ResultEntity doLogin(HttpServletRequest request,HttpServletResponse response,ModelMap modelMap){
		
		ResultEntity rsEntity = new ResultEntity();
		String un = request.getParameter("un");
        String pw = request.getParameter("pw");
        if(StringUtils.isBlank(un)||StringUtils.isBlank(pw)){
        	rsEntity.setErrors("ER");
        	rsEntity.setObj("用户名或者密码为空");
        }
		try{
			rsEntity = shipperService.authenSpUser(un, pw);
		}catch(Exception e){
			rsEntity.setErrors("ER");
			return rsEntity;
		}
		if(!rsEntity.isSuccess()){
			return rsEntity;
		}
		rsEntity.setSuccess(true);
		rsEntity.setErrors("OK");

//		modelMap.put("SP_USER", rsEntity.getObj());
	    request.getSession().setAttribute("SP_USER", rsEntity.getObj());
		//writeCookie(response, (CourierEntity)rsEntity.getObj());
		return rsEntity;
	}
	
	@RequestMapping("/main")
	public String actionLogin() throws Exception {

		return "sp/main";
	}

	@RequestMapping("/address")
	public String validateAddress() throws Exception {

		return "address-v";
	}

	@RequestMapping("/bd_address")
	public @ResponseBody String validateAddressByDBMap(String address) {

		String addressEncode = java.net.URLEncoder.encode(address);
		String bdUrl = "http://api.map.baidu.com/place/v2/suggestion?region=131&output=json&ak=zNC2uIzYGKnY3V8D7iCBbLsi&query="
				+ addressEncode;

		String returnRs = null;
		try{
		returnRs = HTTPUtils.executeGet(bdUrl).getObj().toString();
		}catch(Exception e){
			
		}
		return returnRs;
	}

	/**
	 * 基于快送宝提交运单 web页面快速提交运单
	 * @return
	 */
	@RequestMapping("/add_waybill")
	public String addWaybillPage(){
		
		return "sp/create_waybill";
	}

	/**
	 * 基于快送宝提交运单 web页面快速提交运单
	 * @return
	 */
	@RequestMapping("/add_waybill_login")
	public String addWaybillLoginPage(){
		
		return "sp/create_waybill_login";
	}
	
	/**
	 * 基于快送宝 web页面快速提交运单(快速运单入库)
	 * @param request
	 * @return
	 */
	@RequestMapping("/do_add_waybill")
	public @ResponseBody
	       AjaxEntity addWaybillByWeb(HttpServletRequest request){
	
		AjaxEntity rsEntity = new AjaxEntity();
		rsEntity.setSuccess(true);
		
		Map<String, String[]> requestMap = request.getParameterMap();
		
		try {
			waybillService.addWaybillByWeb(converRequestMap(requestMap));
		} catch (Exception e) {
			rsEntity.setErrors(e.getMessage());
			rsEntity.setSuccess(false);
			return rsEntity;
		}
		
		rsEntity.setErrors("ok");
		return rsEntity;
	}

	/**
	 * 对外提供web api，支持批量运单入库
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/batch_add_waybill",method = RequestMethod.POST)
	public @ResponseBody
	       AjaxEntity addWaybillByApi(HttpServletRequest request){
	
		AjaxEntity rsEntity = new AjaxEntity();
		rsEntity.setSuccess(true);
		
		Map<String, String[]> requestMap = request.getParameterMap();
		
		
		try {
			waybillService.addWaybillByOpenApi(converRequestMap(requestMap));
		} catch (Exception e) {
			rsEntity.setErrors(e.getMessage());
			rsEntity.setSuccess(false);
			return rsEntity;
		}
		
		rsEntity.setSuccess(true);
		rsEntity.setErrors("ok");
		return rsEntity;
	}
	
	/**
	 * request的getParameterMap转换为普通map
	 * @param requestMap
	 * @return
	 */
	private Map<String, String> converRequestMap(Map<String, String[]> requestMap){
		
		Map<String, String> rsMap = new HashMap<String, String>();
		
		if(requestMap==null||requestMap.size()==0){
			return rsMap;
		}
		
		Iterator<Entry<String, String[]>> it = requestMap.entrySet().iterator();
		while(it.hasNext()){
			Entry<String, String[]> entry = it.next();
			rsMap.put(entry.getKey(), entry.getValue()[0]);
		}
		
		return rsMap;
	}
	
	/**
	 * 运单分配页面
	 * @return
	 */
	@RequestMapping("/fp_waybill")
	public String allocationWaybillPage(){
		
		return "fp_waybill";
	}
	
	/**
	 * 为配送员分配运单
	 * @param waybillId
	 * @param courierId
	 * @return
	 */
	@RequestMapping("/do_fp_waybill")
	public @ResponseBody 
	       AjaxEntity allocationWaybill2courier(String waybillId,String courierId ){
		
		AjaxEntity rsEntity = new AjaxEntity();
		rsEntity.setSuccess(false);
		
		if(StringUtils.isBlank(waybillId)){
			rsEntity.setErrors("参数: 运单编号为空");
			return rsEntity;
		}
		if(StringUtils.isBlank(courierId)){
			rsEntity.setErrors("参数: 配送员编号为空");
			return rsEntity;
		}		
		
		try{
			waybillService.allocationWaybill2Courier(waybillId, courierId);
		}catch(Exception e){
			rsEntity.setErrors(e.getMessage());
			return rsEntity;
		}
		
		rsEntity.setSuccess(true);
		rsEntity.setErrors("ok");
		return rsEntity;
	}
	
	@RequestMapping("/query_sp_user")
	public @ResponseBody
	       ResultPageEntity searchSpUser(HttpServletRequest request,String sp_name,String page,String size){
		
		ResultPageEntity rsEntity = new ResultPageEntity();
		
		CourierEntity entity = (CourierEntity)request.getSession().getAttribute("courierEntity");
		if(entity==null){
			rsEntity.setErrors("session过期,请重新登录");
			return rsEntity;
		}
		String eid = entity.getEnterprise_id();
		if(StringUtils.isBlank(eid)){
			rsEntity.setErrors("无法获取配送公司编号");
			return rsEntity;
		}
		Map<String, Object> rsMap = null;
		
		if(StringUtils.isBlank(page)){
			page = "1";
		}
		/*每页显示的记录数(不提供 默认10条)*/
		int sizeInt = defaultSize;
		if(StringUtils.isNotBlank(size)){
			sizeInt = Integer.parseInt(size);
		}
		
		int pageInt = Integer.parseInt(page);
		int skip = (pageInt-1)*sizeInt;
		
		try{
			rsMap = shipperService.querySpUser(eid, sp_name, skip, sizeInt);
		}catch(Exception e){
			return log.exit(rsEntity);
		}
		
		List<Map<String, String>> rsList = (List<Map<String, String>>)rsMap.get("1");
		Object count = rsMap.get("2");
		if(count==null){
			count = "0";
		}
		rsEntity.setObj(rsList);
		
		rsEntity.setPage(pageInt);
		rsEntity.setSuccess(true);
		long totalPage = (Long.parseLong(count.toString()) + sizeInt -1) / sizeInt;
		rsEntity.setTotalPage(totalPage);
		rsEntity.setTotalCount(Long.parseLong(count.toString()));
		rsEntity.setLimit(sizeInt);
		rsEntity.setStart(skip);
		rsEntity.setErrors("OK");
		return log.exit(rsEntity);
	}
	
	
	/**
	 * 运单数据查询(暂时 仅支持根据运单ID和运单状态查询；后期需要扩展)
	 * @param waybillStatus
	 * @param waybillId
	 * @return
	 */
	@RequestMapping("/query_waybill")
	public @ResponseBody
	       ResultPageEntity searchWaybillByCourier(String waybillStatus,String waybillId){
		
		log.trace(waybillStatus,waybillId);
		
		ResultPageEntity rsEntity = new ResultPageEntity();
		
		/*封装查询入参*/
		Map<String, String> pm = new HashMap<String, String>();
		pm.put("waybill_status", waybillStatus);
		pm.put("waybill_id", waybillId);
		
		
		Map<String, Object> rsMap = null;
		try{
		    rsMap = waybillService.searchWaybillInfo(pm, 0, 50);
		}catch(Exception e){
			rsEntity.setSuccess(false);
			log.error("运单查询时出现异常:",e);
			return log.exit(rsEntity);
		}
		
		List<Map<String, String>> rsList = (List<Map<String, String>>)rsMap.get("1");
		Object count = rsMap.get("2");
		rsEntity.setObj(rsList);
		rsEntity.setSuccess(true);
		rsEntity.setTotalCount(Long.parseLong(count.toString()));
		rsEntity.setLimit(0);
		rsEntity.setStart(0);
		return rsEntity;
	}
	
	/**
	 * 添加登录商家APP的用户
	 * @param entity
	 * @return
	 */
	@RequestMapping("/save_sp")
	public @ResponseBody 
	       ResultEntity addSpUser(HttpServletRequest request,ShipperUserEntity entity){
		
		ResultEntity rs = new ResultEntity();

		if(StringUtils.isBlank(entity.getSp_name())){
			rs.setErrors("商家名称为空");
			return rs;
		}
		if(StringUtils.isBlank(entity.getName())){
			rs.setErrors("用户名为空");
			return rs;
		}
		if(StringUtils.isBlank(entity.getPasswd())){
			rs.setErrors("密码为空");
			return rs;
		}		
		if(StringUtils.isBlank(entity.getPhone())){
			rs.setErrors("手机号为空");
			return rs;
		}		
		CourierEntity c = (CourierEntity)request.getSession().getAttribute("courierEntity");
		if(c==null){
			rs.setErrors("session过期,请重新登录");
			return rs;
		}
		String eid = c.getEnterprise_id();
		if(StringUtils.isBlank(eid)){
			rs.setErrors("无法获取配送公司编号");
			return rs;	
		}
		entity.setEnterprise_id(eid);
		
		try{
		    shipperService.createShipperAndUser(entity);
		}catch(Exception e){
			e.printStackTrace();
			rs.setErrors(e.getMessage());
			return rs;
		}
		
		rs.setSuccess(true);
		rs.setErrors("OK");
		rs.setObj("");
		return rs;
	}
	
	
	/**
	 * 接入快送宝openapi的商户查询
	 * @param id
	 * @param orderId
	 * @param waybillStatus
	 * @param buyerName
	 * @param buyerPhone
	 * @return
	 */
	@RequestMapping("/search_sp")
	public @ResponseBody ResultPageEntity searchShipperOrderInfo(Long id,
			String orderId,String waybillStatus, String buyerName, String buyerPhone) {

		/*组装返回的数据*/
		ResultPageEntity rsEntity = new ResultPageEntity();
		rsEntity.setLimit(0);
		rsEntity.setStart(0);
		rsEntity.setSuccess(true);
		rsEntity.setTotalCount(0);
		
		Map<String, Object> rsMap = null;
		try{
		    rsMap = waybillService.searchShipperOrderInfo(id, orderId, waybillStatus, buyerName, buyerPhone);
		    if(rsMap==null){
				log.error("web调用查询商家订单信息接口异常");
				rsEntity.setSuccess(false);
				return log.exit(rsEntity);
		    }
		}catch(Exception e){
			log.error("web调用查询商家订单信息接口异常",e);
			rsEntity.setSuccess(false);
		}
		
		List<Map<String, Object>>rsList = (List<Map<String, Object>>)rsMap.get("1");
		rsEntity.setObj(rsList);
		
		return log.exit(rsEntity);
	}

}
