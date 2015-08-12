package com.ksb.web.openapi.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;

import com.ksb.openapi.entity.CourierEntity;
import com.ksb.openapi.entity.ResultEntity;
import com.ksb.openapi.error.BaseSupportException;
import com.ksb.openapi.mobile.service.CourierService;
import com.ksb.openapi.mobile.service.ShipperService;
import com.ksb.openapi.service.StatisticsService;
import com.ksb.openapi.service.WaybillService;
import com.ksb.openapi.util.DateUtil;
import com.ksb.openapi.util.DesUtil;
import com.ksb.openapi.util.MD5Util;
import com.ksb.web.openapi.entity.ResultPageEntity;
import com.ksb.web.service.WebWaybillService;

@Controller
@RequestMapping("/allocate")
@SessionAttributes("courierEntity")
public class WaybillAllocationController {

	private static final int DEFAULT_SIZE = 20;
	@Autowired
	ShipperService shipperService;
	
	@Autowired
	CourierService courierService;
	
	/*运单服务管理接口*/
	@Autowired
	WebWaybillService webWaybillService;
	
	/*统计接口*/
	@Autowired
	StatisticsService statisticsService;
	
	
	/**
	 * 登录页面跳转
	 * @return
	 */
	@RequestMapping("/login")
	public String loginPage(){
		return "allocate/login";
	}

	@RequestMapping("/courier_main")
	public String courierInfoPage(){
		return "allocate/courier_main";
	}
	
	@RequestMapping("/count_waybill_page")
	public String countWaybillPage(){
		
		return "allocate/count_waybill";
	}
	@RequestMapping("/count_courier_waybill_page")
	public String countCourierWaybillPage(){
		
		return "allocate/courier_waybill";
	}	
	
	@RequestMapping("/sp_main")
	public String spInfoPage(){
		return "allocate/sp_main";
	}
	
	
	@RequestMapping("/logout")
	public String logout(HttpServletRequest request){
		request.getSession().removeAttribute("courierEntity");
		return "allocate/login";
	}
	
	@RequestMapping("/all_waybill")
	public String allwaybillPage(){
		return "allocate/all";
	}
	
	@RequestMapping("/main")
	public String mainPage(){
		return "allocate/main";
	}
	@RequestMapping("/main_map")
	public String mainMapPage(){
		return "allocate/main_map";
	}	
	
	@RequestMapping("/do_login")
	public @ResponseBody
	       ResultEntity doLogin(HttpServletRequest request,HttpServletResponse response,ModelMap modelMap){
		
		ResultEntity rsEntity = new ResultEntity();
		String un = request.getParameter("un");
        String pw = request.getParameter("pw");
        //String eid = request.getParameter("eid");
        if(StringUtils.isBlank(un)||StringUtils.isBlank(pw)){
        	rsEntity.setErrors("ER");
        	rsEntity.setObj("用户名或者密码为空");
        }
		try{
			rsEntity = courierService.authen(un, pw, null);
		}catch(Exception e){
			rsEntity.setErrors("ER");
			return rsEntity;
		}
		if(!rsEntity.isSuccess()){
			return rsEntity;
		}
		rsEntity.setSuccess(true);
		rsEntity.setErrors("OK");

		modelMap.put("courierEntity", rsEntity.getObj());
		writeCookie(response, (CourierEntity)rsEntity.getObj());
		return rsEntity;
	}
	
	private void writeCookie(HttpServletResponse response,CourierEntity entity){
		 response.addCookie(new Cookie("3km_uid",entity.getId()));
		 response.addCookie(new Cookie("3km_login_name", entity.getName()));
		 response.addCookie(new Cookie("3km_eid", entity.getEnterprise_id()));
	}
	
	
	@RequestMapping("/query_waybill")
	public @ResponseBody
	       ResultPageEntity queryUnAllocateWaybill(HttpServletRequest request,String page,String size){
		
		ResultPageEntity rsEntity = new ResultPageEntity();
		
		CourierEntity entity = (CourierEntity)request.getSession().getAttribute("courierEntity");
		if(entity==null){
			rsEntity.setErrors("session过期,请重新登录");
			return rsEntity;
		}
		String eid = entity.getEnterprise_id();
		
		int sizeInt = DEFAULT_SIZE;
		if(StringUtils.isNotBlank(size)){
			sizeInt = Integer.parseInt(size);
		}
		if(StringUtils.isBlank(page)){
			page = "1";
		}
		int pageInt = Integer.parseInt(page);
		if(pageInt<0){
			pageInt = 0;
		}
		int skip = (pageInt-1)*sizeInt;
		/*封装查询入参*/
		Map<String, String> pm = new HashMap<String, String>();
		pm.put("status", request.getParameter("status"));
		pm.put("id", request.getParameter("wbid"));
		pm.put("third_platform_id", eid);
		
		pm.put("sp_x", request.getParameter("sp_x"));
		pm.put("sp_y", request.getParameter("sp_y"));
		pm.put("bu_x", request.getParameter("bu_x"));
		pm.put("bu_y", request.getParameter("bu_y"));
		
		pm.put("c_phone", request.getParameter("c_phone"));
		pm.put("c_realname", request.getParameter("c_realname"));
		
		pm.put("sp_address", request.getParameter("sp_address"));
		pm.put("bu_address", request.getParameter("bu_address"));
		
		
		Map<String, Object> rsMap = null;
		try{
		    rsMap = webWaybillService.searchWaybillInfo(pm, skip, sizeInt);
		}catch(Exception e){
			rsEntity.setSuccess(false);
			rsEntity.setErrors(e.getMessage());
			return rsEntity;
		}
		
		List<Map<String, String>> rsList = (List<Map<String, String>>)rsMap.get("1");
		Object count = rsMap.get("2");
		rsEntity.setObj(rsList);
		rsEntity.setSuccess(true);
		long totalPage = (Long.parseLong(count.toString()) + sizeInt -1) / sizeInt;
		rsEntity.setTotalCount(Long.parseLong(count.toString()));
		rsEntity.setTotalPage(totalPage);
		rsEntity.setLimit(0);
		rsEntity.setStart(0);
		
		rsEntity.setPage(pageInt);
		return rsEntity;
	}
	
	@RequestMapping("/query_courier")
	public @ResponseBody 
	       ResultPageEntity queryCourierList(HttpServletRequest request,String real_name,String phone,String page,String size){
		
		ResultPageEntity rsEntity = new ResultPageEntity();
		
		CourierEntity tm = (CourierEntity)request.getSession().getAttribute("courierEntity");
		if(tm==null){
			rsEntity.setErrors("session过期,请重新登录");
			return rsEntity;
		}
		String eid = tm.getEnterprise_id();
		if(StringUtils.isBlank(eid)){
			rsEntity.setErrors("无法获取配送公司编号");
			return rsEntity;
		}
		
		CourierEntity newCourier = new CourierEntity();
		newCourier.setEnterprise_id(eid);
		int sizeInt = DEFAULT_SIZE;
		if(StringUtils.isNotBlank(size)){
			sizeInt = Integer.parseInt(size);
		}
		if(StringUtils.isBlank(page)){
			page = "1";
		}
		int pageInt = Integer.parseInt(page);
		int skip = (pageInt-1)*sizeInt;
		
		
		newCourier.setReal_name(real_name);
		newCourier.setPhone(phone);
		newCourier.setWork_status("1");
		newCourier.setDelivery_status("0");
		
		Map<String, Object> rsMap = null;
		try{
		   rsMap = courierService.queryCorierList(newCourier, skip, sizeInt);
		}catch(Exception e){
			return getDefaultErrorEntity(e.getMessage());
		}
		
		List<CourierEntity> rsList = (List<CourierEntity>)rsMap.get("1");
		Object count = rsMap.get("2");
		rsEntity.setObj(rsList);
		rsEntity.setSuccess(true);
		long totalPage = (Long.parseLong(count.toString()) + sizeInt -1) / sizeInt;
		rsEntity.setTotalPage(totalPage);
		rsEntity.setTotalCount(Long.parseLong(count.toString()));
		rsEntity.setLimit(0);
		rsEntity.setStart(0);
		rsEntity.setPage(pageInt);
		return rsEntity;
	}
	
	@RequestMapping("/batch_allocate")
	public @ResponseBody 
	       ResultEntity batchAllocateWaybill(HttpServletRequest request,String cid,String wbids){
		
		ResultEntity rsEntity = new ResultEntity();
		
		CourierEntity tm = (CourierEntity)request.getSession().getAttribute("courierEntity");
		if(tm==null){
			rsEntity.setErrors("session过期,请重新登录");
			return rsEntity;
		}
		
		if(StringUtils.isBlank(cid)){
			rsEntity.setErrors("未指定配送员");
			return rsEntity;
		}
		
		if(StringUtils.isBlank(wbids)){
			rsEntity.setErrors("未选择任何运单");
			return rsEntity;
		}
		
		List<String> waybillList = Arrays.asList(wbids.split("\\^"));

		try{
			webWaybillService.batchAllocateWaybill2Courier(cid, waybillList);
			
		}catch(Exception e){
			rsEntity.setErrors(e.getMessage());
			return rsEntity;
		}
		
		rsEntity.setSuccess(true);
		rsEntity.setErrors("OK");
		return rsEntity;
	}
	
	@RequestMapping("/count_waybill_date")
	public @ResponseBody
	ResultPageEntity countEnterpriseWaybillByDate(HttpServletRequest request,String st,String et,String size,String page){
		ResultPageEntity rsEntity = new ResultPageEntity();
		
		CourierEntity tm = (CourierEntity)request.getSession().getAttribute("courierEntity");
		if(tm==null){
			rsEntity.setErrors("session过期,请重新登录");
			return rsEntity;
		}
		String eid = tm.getEnterprise_id();
		if(StringUtils.isBlank(eid)){
			rsEntity.setErrors("无法获取配送公司编号");
			return rsEntity;
		}
		
		if(StringUtils.isBlank(st) || StringUtils.isBlank(et)){
			rsEntity.setErrors("日期参数为空");
			return rsEntity;
		}
		
		int sizeInt = DEFAULT_SIZE;
		if(StringUtils.isNotBlank(size)){
			sizeInt = Integer.parseInt(size);
		}
		if(StringUtils.isBlank(page)){
			page = "1";
		}
		int pageInt = Integer.parseInt(page);
		int skip = (pageInt-1)*sizeInt;
		
		long startTime = DateUtil.getStartTime(st);
		long endTime = DateUtil.getEndTime(et);
		
		Map<String, Object> rsMap = null;
		try{
			rsMap = statisticsService.groupQueryDateStatus(eid, startTime, endTime,skip,sizeInt);
		}catch(Exception e){
			rsEntity.setErrors("系统异常:"+e.getMessage());
			return rsEntity;
		}
		
		Map<String, Map<String, String>> objmap = (Map<String,Map<String,String>>)rsMap.get("1");
		Object count = rsMap.get("2");
		Map<String, String> countMap = (Map<String, String>)rsMap.get("3");
		rsEntity.setRsobj(countMap);
		rsEntity.setObjmap(objmap);
		rsEntity.setSuccess(true);
		//long totalPage = (Long.parseLong(count.toString()) + sizeInt -1) / sizeInt;
		//rsEntity.setTotalCount(Long.parseLong(count.toString()));
		rsEntity.setTotalPage(0);
		rsEntity.setLimit(0);
		rsEntity.setStart(0);
		rsEntity.setPage(pageInt);
		return rsEntity;
	}

	@RequestMapping("/count_courier_waybill_date")
	public @ResponseBody
	ResultPageEntity countEntCourierWaybillByDate(HttpServletRequest request,String name,String st,String size,String page){
		ResultPageEntity rsEntity = new ResultPageEntity();
		
		CourierEntity tm = (CourierEntity)request.getSession().getAttribute("courierEntity");
		if(tm==null){
			rsEntity.setErrors("session过期,请重新登录");
			return rsEntity;
		}
		String eid = tm.getEnterprise_id();
		if(StringUtils.isBlank(eid)){
			rsEntity.setErrors("无法获取配送公司编号");
			return rsEntity;
		}
		
		if(StringUtils.isBlank(st)){
			rsEntity.setErrors("日期参数为空");
			return rsEntity;
		}
		
		int sizeInt = DEFAULT_SIZE;
		if(StringUtils.isNotBlank(size)){
			sizeInt = Integer.parseInt(size);
		}
		if(StringUtils.isBlank(page)){
			page = "1";
		}
		int pageInt = Integer.parseInt(page);
		int skip = (pageInt-1)*sizeInt;
		
		Map<String, Object> rsMap = null;
		try{
			rsMap = statisticsService.groupQueryCourierStatusByDate(eid, name, st, skip, sizeInt);
		}catch(Exception e){
			rsEntity.setErrors("系统异常:"+e.getMessage());
			return rsEntity;
		}
		
		Map<String, Map<String, String>> objmap = (Map<String,Map<String,String>>)rsMap.get("1");
		//Object count = rsMap.get("2");
		rsEntity.setObjmap(objmap);
		rsEntity.setSuccess(true);
		//long totalPage = (Long.parseLong(count.toString()) + sizeInt -1) / sizeInt;
		//rsEntity.setTotalCount(Long.parseLong(count.toString()));
		//rsEntity.setTotalPage(totalPage);
		rsEntity.setLimit(0);
		rsEntity.setStart(0);
		rsEntity.setPage(pageInt);
		return rsEntity;
}
	
	
	@RequestMapping("/sp_address")
	public @ResponseBody
	       ResultEntity shipperAddressList(String sp_id,String city_name){
		
		ResultEntity rs = new ResultEntity();
		if(StringUtils.isBlank(sp_id)){
			rs.setErrors("ER");
			rs.setObj("未指定商家");
			return rs;
		}
		List<Map<String, String>> rsList = null;
		try{
		    rsList = shipperService.shipperCommonAddress(sp_id, city_name);
		}catch(Exception e){
			rs.setErrors("ER");
			rs.setObj(e.getMessage());
			return rs;
		}
		
		rs.setSuccess(true);
		rs.setErrors("OK");
		rs.setObj(rsList);
		return rs;
	}	
	
	@RequestMapping("/batch_save_courier")
	public @ResponseBody 
	       ResultEntity batchSaveCourier(@RequestParam(value = "file", required = false) MultipartFile file,HttpServletRequest request){
		
		ResultEntity rs = new ResultEntity();
		
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
		
		
		if(file==null){
			rs.setErrors("ER");
			rs.setObj("未指定上传的文件");
			return rs;
		}
		
		String fileName = file.getOriginalFilename(); 
		
		/*验证文件格式(后缀必须是csv)*/
		if(StringUtils.isBlank(fileName)){
			rs.setErrors("ER");
			rs.setObj("无法获取文件名");
			return rs;
		}
		
		List<CourierEntity> courierList = null;
  
        //读取文件内容 
        try {  
            //file.transferTo(targetFile);  
        	InputStream in = file.getInputStream();
        	BufferedReader br =null;
        	br=new BufferedReader(new InputStreamReader(in));
        	
        	courierList = new ArrayList<CourierEntity>();
        	String temp=null;
        	temp=br.readLine();
        	int i = 1;
        	/*跳过csv文件头*/
        	temp=br.readLine();
        	while(temp!=null){
        		i++;
        		try{
        			courierList.add(str2entity(temp,eid));
        		}catch(Exception e){
        			rs.setErrors("ER");
        			rs.setObj("第["+i+"]行异常: "+e.getMessage());
        			return rs;
        		}
        		
        	}
        	
        } catch (Exception e) {  
            //e.printStackTrace();  
        	System.out.println("文件上传异常："+e.getMessage());
        } 
		
		rs.setSuccess(true);
		rs.setErrors("OK");
		rs.setObj("");
		return rs;
	}
	
	private CourierEntity str2entity(String str,String eid){
		
		if(StringUtils.isBlank(str)){
			throw new BaseSupportException("数据为空");
		}
		
		CourierEntity entity = new CourierEntity();
		try{
			String strs[] = str.split("\\,");
			if(strs.length<3){
				throw new BaseSupportException("数据格式异常");
			}
			
			
			entity.setReal_name(strs[0]);
			entity.setPhone(strs[1]);
			entity.setPwd(strs[2]);
			entity.setWork_status("2");
			entity.setDelivery_status("0");
			entity.setEnterprise_id(eid);
			entity.setName("courier");
			setCourierPwd(entity);
			
		}catch(Exception e){
			throw new BaseSupportException(e);
		}
		
		return entity;
	}
	
	private void setCourierPwd(CourierEntity entity){
		String pwd = entity.getPwd();
		String srcPwd = null;
		try {
			srcPwd = DesUtil.getInstance().encrypt(pwd);
		} catch (Exception e1) {}
		
		/*密码使用两次MD5加密*/
		pwd = MD5Util.MD5(MD5Util.MD5(pwd));
		entity.setPwd(pwd);
		entity.setSrcPwd(srcPwd);
		
	}
	
	
	
	@RequestMapping("/save_courier")
	public @ResponseBody
    ResultEntity saveCourier(HttpServletRequest request,String real_name,String pwd,String phone){
		ResultEntity rs = new ResultEntity();

		if(StringUtils.isBlank(real_name)){
			rs.setErrors("真实姓名为空");
			return rs;
		}
		
		if(StringUtils.isBlank(pwd)){
			rs.setErrors("密码为空");
			return rs;
		}		
		if(StringUtils.isBlank(phone)){
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
		
		CourierEntity newCourier = new CourierEntity();
		newCourier.setEnterprise_id(eid);
		
		/*默认开通的配送员处于收工状态;配送状态为可以配送*/
		newCourier.setWork_status("2");
		newCourier.setDelivery_status("0");
		newCourier.setName("courier");
		newCourier.setReal_name(real_name);
		newCourier.setPwd(pwd);
		newCourier.setPhone(phone);
		
		
		try{
			courierService.createCourier(newCourier);
		}catch(Exception e){
			rs.setErrors(e.getMessage());
			return rs;
		}
		
		rs.setSuccess(true);
		rs.setErrors("OK");
		rs.setObj("");
		return rs;
    }
	
	
	public ResultPageEntity getDefaultErrorEntity(String errorInfo){
		
		ResultPageEntity pageEntity = new ResultPageEntity();
		pageEntity.setSuccess(false);
		pageEntity.setLimit(0);
		pageEntity.setStart(0);
		pageEntity.setTotalCount(0);
		pageEntity.setErrors(errorInfo);
		pageEntity.setPage(0);
		
		return pageEntity;
	}
	
	
}
