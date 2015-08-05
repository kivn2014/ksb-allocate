<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta charset="utf-8"/>
        <title>快送宝-3公里</title>

        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link href="/css/bootstrap/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    
        <link href="/css/order_base.css" rel="stylesheet" type="text/css" id="style_color" />
        <link href="/css/timepicker.css" rel="stylesheet" type="text/css" />
        <link href="/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
        <script src="/js/jquery/jquery-2.1.4.min.js" type="text/javascript"></script>

<script src="/js/bootstrap/bootstrap.min.js" type="text/javascript"></script>
    </head>
   <body>

<!-- BEGIN HEADER -->
<div class="js-comp header navbar navbar-default navbar-static-top" data-module="TopNavBar">
 	<!-- BEGIN TOP BAR -->

	<div class="container">
		<div class="navbar-header">
			<!-- BEGIN RESPONSIVE MENU TOGGLER -->
			<button class="navbar-toggle btn navbar-btn" data-toggle="collapse"
				data-target=".navbar-collapse">
				<span class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>

		</div>

		<!-- BEGIN TOP NAVIGATION MENU -->
		<div class="navbar-collapse collapse pull-right">
			<ul class="nav navbar-nav">
				<li class="home"><a data-close-others="false" href="#"> 首页 </a></li>
				<li class="home"><a data-close-others="false" href="login">登录</a></li>
				<!-- <li class="place_order"><a data-close-others="false" href="#"> 在线下单</a></li> -->

			</ul>
		</div>
		<!-- BEGIN TOP NAVIGATION MENU -->
	</div>
</div>
<div class="bottom_bar"></div>
<!-- END HEADER -->


<input name="fromChannel" id="fromChannel" type="hidden" value="01"/>
<input name="wholeEvent" id="wholeEvent" type="hidden" value=""/>
<input name="canRechargeReturnCoupon" id="canRechargeReturnCoupon" type="hidden" value=""/>

<div class="js-comp info-order-wrap place-multi-order" data-module="PlaceMultiOrder">
    <div class="info-order">
        <div class="info">

            <!--====取件信息 begin ======-->
            <div class="info-list">
                <div class="info-t">发件人信息:</div>
                
                <div class="tab2 default-send-address"
                     data-default=''
                     data-province=""
                     data-city=""
                     data-longitude=""
                     data-latitude=""
                     data-location=""
                     data-address=""
                     data-name=""
                     data-mobile=""
                     style='display: none;'>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tbody>
                        <tr>
                            <td style="padding-left: 30px;">
                                    <span class="my-address-district">
                                        
                                    </span>
                                    <span class="my-address-location">
                                        
                                    </span>
                                    <span class="my-address-address">
                                    
                                    </span>
                                <div class="my-address-sender">
                                     &nbsp;&nbsp;&nbsp;
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="tab2 takeGoods-js pickup"
                     address-info-y=""
                     address-info-x=""
                     address-info-province=""
                     address-info-city=""
                     address-info-id=""
                     address-info-address=""
                     address-info-remark=""
                     address-info-name=""
                     address-info-phone=""
                     style='display: ;'>
                    <table width="100%" cellpadding="0" cellspacing="0">                    
                        <tbody>
                        <tr>
                            <th>所在城市：</th>
                            <td>
                                <div class="address-wrap">
                                    <div class="address">
                                        <select id="fromCity" class="from-address-info-city">
                                            
                                                <option selected="selected" value="020" data-name="广州市">广州市</option>
                                            
                                                <option  value="0769" data-name="东莞市">东莞市</option>
                                            
                                                <option  value="0531" data-name="济南市">济南市</option>
                                            
                                                <option  value="0755" data-name="深圳市">深圳市</option>
                                            
                                                <option  value="010" data-name="北京市">北京市</option>
                                            
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>商家编号：</th>
                            <td>
                                <p>
                                    <input  type="text" placeholder="商家编号" maxlength="20" class="address-info-spid from-address-info-name" value=""/>(选填)
                                </p>
                            </td>
                        </tr>    
                        <tr>
                            <th>原始订单ID：</th>
                            <td>
                                <p>
                                    <input  type="text" placeholder="商家订单ID" maxlength="20" class="address-info-originid from-address-info-name" value=""/> (选填)
                                </p>
                            </td>
                        </tr>     
                        <tr>
                            <th>配送平台ID：</th>
                            <td>
                                <p>
                                    <input  type="text" placeholder="配送平台ID" maxlength="20" class="address-info-psid from-address-info-name" value=""/> (指定配送商)
                                </p>
                            </td>
                        </tr>                                                                  
                        <tr>
                            <th>寄件地址：</th>
                            <td>
                                <div class="address-wrap">
                                    <div class="address">
                                        <input autocomplete="off" type="text" placeholder="请输入小区、大厦等地址关键字"
                                               class="l address-info-address address-info-address2 from-address-info-address" value="" isvalid="1"/>
                                                  <img class="help-address-a offset-left" title="辅助位置输入" src="/img/startPoint.png"/>  
                                            <!--  <a href="javascript:void(0)" class="com-adress-a com-address-a-js" addr_species="01">常用</a> -->
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr style="display: none">
                            <th>地址详情：</th>
                            <td><input autocomplete="off"  type="text" placeholder="请输入楼号、门牌号等详细地址" class="l address-info-remark from-address-info-remark"  value=""/></td>
                        </tr>
                        <tr>
                            <th>发件人姓名：</th>
                            <td>
                                <p>
                                    <input  type="text" placeholder="请输入姓名" maxlength="20" class="address-info-name from-address-info-name" value=""/>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th>手机号：</th>
                            <td>
                                <p><input  type="text" placeholder="请输入联系人手机号" class="address-info-phone from-address-info-phone" value="" maxlength="11"/></p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="info-list">
                <div class="info-t">收件人信息:</div>
                
                    <div class="tab2 tab-js takeGoods-js"
                         address-info-x=""
                         address-info-y=""
                         address-info-province=""
                         address-info-city=""
                         address-info-id="">
                        <div class="receipt-address-num num1"></div>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tbody>
                            <tr>
                                <th>收件地址：</th>
                                <td>
                                    <div class="address-wrap">
                                        <div class="address">
                                            <input autocomplete="off"  type="text" name="address" placeholder="请输入您的收件地址" class="l address-info-address address-info-address2" value=""/>
                                                <img class="help-address-a offset-left" title="辅助定位" src="/img/startPoint.png"/>
                                                
                                        </div>
                                    </div>
                                </td>
                              
                            </tr>
                            <tr style="display: none">
                                <th>地址详情：</th>
                                <td><input autocomplete="off"  type="text" placeholder="请输入楼号、门牌号等详细地址" class="l address-info-remark" value="" /></td>
                            </tr>
                            <tr>
                                <th>收件人姓名：</th>
                                <td>
                                    <p>
                                        <input autocomplete="off"  type="text" maxlength="20" placeholder="请输入姓名" class="address-info-name" value="" />
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <th>手机号：</th>
                                <td>
                                    <p><input autocomplete="off"  type="text" placeholder="请输入联系人手机号" class="address-info-phone" value=""  maxlength="11"/></p>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                
            </div>

            <div class="info-list"  style="border-bottom:none;padding-bottom:50px;">
                <div class="info-t">货物信息:</div>
                <div class="tab2 tab-js">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tbody>
                        <tr>
                            <th>货物重量：</th>
                            <td>
                                <p>
                                    <input class="goodInfo" id="weight" name="weight" autocomplete="off" maxlength="3" type="text" onkeyup="this.value=this.value.replace(/\D/g,'')"  onafterpaste="this.value=this.value.replace(/\D/g,'')"  placeholder="请输入货物重量(公斤)"  value="" />
                                </p> 
                            </td>
                        </tr>
                        <tr>
                            <th>货物数量：</th>
                            <td>
                                <p>
                                    <input id="cargoNum" class="goodInfo" name="cargoNum" maxlength="32" type="text" placeholder="请输入货物数量"  value="1" />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th>物品价格：</th>
                            <td>
                                <p>
                                    <input id="cargoPrice" class="goodInfo" name="cargoPrice" maxlength="32" type="text" placeholder="请输入货物价格"  value="0" />
                                </p>
                            </td>
                        </tr>                        
                        <tr>
                            <th>物品名称：</th>
                            <td>
                                <p>
                                    <input id="cargoName" class="goodInfo" name="cargoName" maxlength="32" type="text" placeholder="请输入货物名称"  value="" />
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th>备注：</th>
                            <td>
                                <p><input id="remarks" name="remarks"  class="" type="text" placeholder="请在这里填写您的配送特别要求" value="" /></p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <!--====费用信息r ======-->
               <div class="info-list"  style="border-bottom:none;padding-bottom:50px;">
                <div class="info-t">费用信息:</div>
                <div class="tab2 tab-js">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tbody>
                        <tr>
                            <th>支付方式：</th>
                            <td>
                             <select id="pay_type">                  
                              <!--  <option selected="selected" value="2" data-name="2">在线支付</option> -->
                               <option selected="selected" value="1" data-name="1">现金</option>
                             </select> 
                           <!--  <div id="fee_id" style="border:none; display:none;"> -->
                              <div id="fee_id" style="border:none;">
                             	<p>物品费用:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="pay_shipper_fee" name="pay_shipper_fee" onkeyup="this.value=this.value.replace(/[^\d.]/g,'')" class="" type="text" placeholder="物品费用" value="" /></p>
                             	<p>收取客户费用: <input id="fetch_buyer_fee" name="fetch_buyer_fee" onkeyup="this.value=this.value.replace(/[^\d.]/g,'')" class="" type="text" placeholder="收取客户费用" value="" /></p>
                             </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="info-list"  style="border-bottom:none;padding-bottom:50px;">
                    <div class="info-t">取件时间:</div>
                    <div class="tab2 tab-js">
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tbody>
                            <tr>
                                <th width="280">是否预约：</th>
                                <td>
                                    <!-- time begin -->
                                    <div class="timeWrap">
                                        <!-- time handle begin -->
                                        <div class="chooseDiv timeBtn" servetype="100">
                                    <span class="radioSpan cur" name="appointType" id="immediateDelivery" servetype="0">
                                        立即取件
                                    </span>
                                    <span class="radioSpan" name="appointType" id="delayDelivery" servetype="1">
                                        预约取件
                                    </span>
                                        </div>
                                        <div class="timeTips" style="border:none; display:none;">
                                            <div class="datepicker-div">
                                                <select class="form-control"  autocomplete="off" id="booking_date" name="dtp_input" >
                                                    
                                                </select>
                                            </div>
                                            <div class="input-group bootstrap-timepicker timepicker-div">
                                                <input type="text" id="booking_time" autocomplete="off" name="time_input" class="time_input form-control timepicker-24 valid" data-time="">
                                         <span class="input-group-btn">
                                         
                                         </span>
                                            </div>
                                        </div>

                                        <div class="deliveryTip" style="border:none;clear:left;">
                                             我们配送人员接单后会立即上门取件
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <button type="button" id="saveInfo" class="btn btn-radius save-btn" >提交</button>
                </div>
            </div>
        </div>
    </div>
    <div class="mask"> </div>
    <div class="helpMapDiv">
        <div class="inputdivbg"></div>
        <div class="inputdiv">
            <span class="baiduKeyBox">
                <input type="text" id="baiduKey" class="baiduKey" style="border:1px solid #f60; color:#03C;" placeholder="请输入关键字"/>
                <b class="searchBtn2"></b>
            </span>
        </div>
        <div class="helpResultList">
            <div id="helpPanel">
            </div>
        </div>
        <div id="helpMapContainer" style="width:75%;height:100%;position: absolute;right: 0;">
        </div>
        <span class="closeHelpMap"></span>
    </div>

</div>



<!-- multiplaceorder.jsp start -->

<script type="text/javascript" src="/js/jquery.address.js"></script>
<script type="text/javascript" src="/js/order_address.js"></script>
<script type="text/javascript" src="/js/create_waybill.js" ></script>
<script type="text/javascript" src="/js/jquery.commonaddress.js" ></script>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=zNC2uIzYGKnY3V8D7iCBbLsi"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>

</body>
</html>
