/**
 * author：
 */
//variables

var authType="";

//页面初始化
$(document).ready(function(){
	commonvar.init();	
	ServiceAPI.init();	
	commonvar.setBgImg();
	
	$("#loadingpanel").show();
	$("#errorPanel").hide();
	
	commonvar.setCookieByProtocol("tabPageTag", "vmList");
	
	var requestParam = new Object();
	requestParam =commonvar.getRequestParam();
	var resultCode= requestParam['resultCode'];
	var resultMessage= requestParam['resultMessage'];
	
	if(resultCode==""||resultCode==null)
	{
		initLogoutInfo();
	}
	else
	{
		showerror(resultCode);
	}
	
	$(window).resize(function() {
		commonvar.showscroll();  
		});
});


function GetRequest() {
   var url = window.location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

/**
 * 初始化登录页面
 * 根据设置的认证方式显示不同的登录页面
 * 
 **/
function initLogoutInfo()
	{
	    //设置自动登录的值:true表示登录自动登录，false表示不自动登
		commonvar.setCookieByProtocol("isFirstLogin", "true");
	    
		
		accessType = $.cookie("accessClientType");
		
		if (accessType == "android" || accessType == "android_pad" || accessType == "iPhone" || accessType == "iPad" || accessType == "iPod" || accessType == "unknow")
		{
			$.ajax({
				url : commonvar.serviceUrl.userLogout,
				dataType : "json",
				type : "POST",
				cache : false,
                beforeSend: function(XMLHttpRequest){
                	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
				},
				success : function(data) {
					window.location.href = commonvar.serviceUrl.mobileLoginPage;
				},
				error : function(event, xhrequest, option, except) {
					window.location.href = commonvar.serviceUrl.mobileLoginPage;
				}
			});
			return;
		}
		else
		{
			logoutByAuth();
		}
	}
function logoutByAuth()
{
   $.ajax({
	    url:commonvar.serviceUrl.userLogout,
	    dataType:"json",
	    type:"POST",	
		cache:false,	
	    beforeSend: function(XMLHttpRequest){
	    	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
		},
	    success:function(data){
			window.location.href =commonvar.serviceUrl.userNameLoginPage + "?isLogout=1";
	    },
		error: function(event, xhrequest, option, except){
			window.location.href = commonvar.serviceUrl.userNameLoginPage;
		}
	});
	$.cookie("JSESSIONID",null);//清除session缓存
}

function showerror(resultCode)
{
	$("#loadingpanel").hide();
	$("#errorPanel").show();
	
	var browsername=navigator.appCodeName;
	var browserversion=navigator.appVersion.substring(0,1);
	var appname=navigator.appName;
	
	if(appname=='Microsoft Internet Explorer')
	{
		$("#errorImg").css({position: "absolute",'top':'2px','left':'0px'}); 
	}
	var len=Login.getString(resultCode).length*13;
	if (commonvar.languageType == 'en') {
		len=len/2;
	}
	if(len>400){
		len=400;
	}
	$("#errorPanel").css({position: "absolute",'left':commonvar.clientW*0.5-len});
	$("#errorMessage").text(Login.getString(resultCode)); 
	

		
	
	
}
