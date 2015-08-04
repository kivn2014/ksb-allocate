package com.ksb.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.ksb.openapi.entity.CourierEntity;
import com.ksb.openapi.error.SessionTimeoutException;

public class SessionTimeoutInterceptor implements HandlerInterceptor {

	public String[] allowUrls;// 还没发现可以直接配置不拦截的资源，所以在代码里面来排除

	public void setAllowUrls(String[] allowUrls) {
		this.allowUrls = allowUrls;
	}

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		// TODO Auto-generated method stub

		String requestUrl = request.getRequestURI().replace(request.getContextPath(), "");
		if (requestUrl.equals("/")) {
			return true;
		}
		
		if (null != allowUrls && allowUrls.length >= 1)
			for (String url : allowUrls) {
				if (requestUrl.contains(url)) {
					return true;
				}
			}

		CourierEntity user = (CourierEntity) request.getSession().getAttribute("courierEntity");
		if (user != null) {
			return true; // 返回true，则这个方面调用后会接着调用postHandle(), afterCompletion()
		} else {
			if (request.getHeader("x-requested-with") != null
					&& request.getHeader("x-requested-with").equalsIgnoreCase(
							"XMLHttpRequest"))// 如果是ajax请求响应头会有，x-requested-with；
			{
				response.setHeader("sessionstatus", "timeout");// 在响应头设置session状态
				return false;
			} else {
				// 非ajax请求,未登录 跳转到登录页面
				throw new SessionTimeoutException();// 返回到配置文件中定义的路径
			}
		}
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub

	}

}
