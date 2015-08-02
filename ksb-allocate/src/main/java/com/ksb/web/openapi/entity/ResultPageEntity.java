package com.ksb.web.openapi.entity;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class ResultPageEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -814641748626718737L;
	long start;
	long page;
	long limit;
	boolean success = false;
	String errors;
	long totalCount;
	long totalPage;
	public long getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(long totalPage) {
		this.totalPage = totalPage;
	}

	List obj;
	Map  objmap;
	Object rsobj;


	public Object getRsobj() {
		return rsobj;
	}

	public void setRsobj(Object rsobj) {
		this.rsobj = rsobj;
	}

	public Map getObjmap() {
		return objmap;
	}

	public void setObjmap(Map objmap) {
		this.objmap = objmap;
	}

	public long getPage() {
		return page;
	}

	public void setPage(long page) {
		this.page = page;
	}

	public String getErrors() {
		return errors;
	}

	public void setErrors(String errors) {
		this.errors = errors;
	}

	public List getObj() {
		return obj;
	}

	public void setObj(List obj) {
		this.obj = obj;
	}

	public long getStart() {
		return start;
	}

	public void setStart(long start) {
		this.start = start;
	}

	public long getLimit() {
		return limit;
	}

	public void setLimit(long limit) {
		this.limit = limit;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public long getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
	}

	@Override
	public String toString() {
		return "result [start=" + start + ", limit=" + limit
				+ ", success=" + success + ", totalCount=" + totalCount
				+ ", obj=" + obj + "]";
	}

}
