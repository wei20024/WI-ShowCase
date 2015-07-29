	<#include "template.ftl">
	<!-- 模板,公共js、logo、css样式 -->
	
	<#if loginType == 0>
		<!-- 客户端插件 -->
		<#include "hdpclientplugin.ftl">
	   <#include "tyydLogin.ftl"> 	
	   	   
	<#elseif loginType == 1>
		<!-- 智能卡登录 -->
		<#include "certificate.ftl">
	<#elseif loginType == 2>
		<!-- 智能卡单点登录 -->
		<#include "certificatesso.ftl">
	<#elseif loginType == 3>
		<!-- 客户端插件 -->
 		<#include "hdpclientplugin.ftl"> 
		<!-- 智能卡网关/卫士通登录 -->
		<#include "smartcardgateway.ftl">
	<#elseif loginType == 4>
		<!-- 客户端插件 -->
 		<#include "hdpclientplugin.ftl"> 
		<!-- 指纹仪输入框 -->
		<#include "finger.ftl">
	<#elseif loginType == 6>
		<!-- 客户端插件 -->
 		<#include "hdpclientplugin.ftl"> 
		<!-- 动态口令输入框 -->
		<#include "dynamicCode.ftl">
	<#elseif loginType == 5>
		<!-- 北京CA登录 -->
		<#include "calogin.ftl">
	<#elseif loginType == 7>
		<!-- 北京CA wst登录 -->
		<#include "caloginwst.ftl">
	<#else>
		<!-- 客户端插件 -->
 		<#include "hdpclientplugin.ftl"> 
		<!-- 用户名和密码输入框 -->
		<#include "username.ftl"> 
	</#if>
    
    <!-- 联机帮助图片 -->
    <#include "onlinehelp.ftl">
    
    <!-- 广告宣传图片 -->
    <#include "advice.ftl">
    
    <!-- 语言修改  -->
    <#include "changelanguage.ftl">