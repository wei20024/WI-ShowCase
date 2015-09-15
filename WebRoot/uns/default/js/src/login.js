/**
 * author：
 */
//variables
var _onBrowser=true;
var authType=55;

//页面初始化
$(document).ready(function(){
	commonvar.init();
	$("#errorPanel").hide();
	$("#errorImg").hide();
	//根据参数启动日志
	var requestParam = new Object();
	requestParam =commonvar.getRequestParam();
	openlog= requestParam['openlog'];
		
	if(openlog=="1")//打开日志
	{
		consoleVisible=1;
		commonvar.setCookieByProtocol("openlog", "1");
	}
	else//0 关闭日志
	{
		consoleVisible=0;
		commonvar.setCookieByProtocol("openlog", "0");
		
	}
	initLog();
	
    commonvar.init();
    commonvar.setBgImg();
    commonvar.testvar=100;
    $("#loadingpanel").show();
    
      
    initLoginInfo();
    $(window).resize(function() {
    	commonvar.showscroll();  
    	});
    
    webuilog(loglevel.info,"test login page");
	
});


/**
 * 校验是否已经有用户登录
 * 如果没有登录初始化登录页面
 */
function checkUserIsLogin(){		
	$("#loadingpanel").show();//显示缓冲图片	
	  $.ajax({
            url:commonvar.serviceUrl.getloginuser,
            dataType:"json",
            type:"POST",
			cache:false,
            success:function(data){
			   if(data.resultCode == ResultCode.code.OPERATE_SUCCESS){
				  commonvar.jump2home();
		      }else{
		    		initLoginInfo();
		       }
            },
			error:function(){
				initLoginInfo();
			}
        });
}

/**
 * 初始化登录页面
 * 根据设置的认证方式显示不同的登录页面
 * 
 **/
function initLoginInfo()
	{
		
		$.ajax({
            url:commonvar.serviceUrl.getAuthType,
            dataType:"json",
            type:"GET",
			cache:false,
            success:function(data){
				var ConfigurationRsp=data;
               if (ConfigurationRsp.resultCode == ResultCode.code.OPERATE_SUCCESS) {
			   		
					//authType = ConfigurationRsp.loginType;
            	    authType=0;
			   		webuilog(loglevel.info,"auth type is: "+authType);
					commonvar.setCookieByProtocol("authType", authType);
					
					//初始化得到当前浏览器语言
					commonvar.init();
					commonvar.setFirstLoginCookie();
					//判断IE版本低于IE8弹出提示框
					var langType=commonvar.languageType;
					var str="";
					var wait ="";
					if(langType == 'zh')
						{
						    
						  wait= "正在加载，请稍侯...";
						}
					else if(langType == 'ar')
						{
						  wait = "جارٍ التحميل، يُرجى الانتظار...";
						}
					else
						{
						  wait = "Loading,please wait...";
						}
					$("#waiting").text(wait);
					if(langType=='zh')
					{
						str="浏览器版本过低，建议您使用IE8及以上版本浏览器！";
					}
					else if(langType=='ar')
					{
						str="إصدار المستعرض غير مدعوم. ينصح باستخدام IE 8 أو أحدث.";
					}
					else
					{
						str="The browser version is not supported. You are advised to use IE 8 or later.";
					}	
					var Sys = {};
				    var ua = navigator.userAgent.toLowerCase();
				    if (window.ActiveXObject)
				    {
				        Sys.ie = ua.match(/msie ([\d.]+)/)[1]
				    }
				    if(Sys.ie < 7)
				    {
				    	  alert(str);
				    }
				    
					jumplogin();
			   	
			   }
			   else {
				//初始化得到当前浏览器语言
				commonvar.init();
			   	webuilog(loglevel.info,"get auth type fail,not ResultCode.code.OPERATE_SUCCESS");
			   	showerror();
			   }
            },
			error: function(event, xhrequest, option, except){
				webuilog(loglevel.info,"get auth type error");
				showerror();
			}
        });
	}
function jumplogin()
{
	if(authType==0)
		   {
		   window.location.href =commonvar.serviceUrl.userNameLoginPage;
		   }
	   else if(authType==1)
		   {
		   window.location.href = commonvar.serviceUrl.userNameLoginPage;
		   }
	   else if(authType==2)
		   {
		   window.location.href =commonvar.serviceUrl.userNameLoginPage;
		   }
	   else if(authType==3)
		   {
		   window.location.href =commonvar.serviceUrl.userNameLoginPage;
		   }
		else if(authType==4)
			{
				window.location.href =commonvar.serviceUrl.userNameLoginPage;
			}
		else if(authType==5)
		{
			window.location.href =commonvar.serviceUrl.userNameLoginPage;
		}
		else if(authType==7)
		{
			window.location.href =commonvar.serviceUrl.userNameLoginPage;
		}
		else if(authType==6)
		{
			window.location.href =commonvar.serviceUrl.userNameLoginPage;
		}
	   else
		   {
		   	webuilog(loglevel.info,"get auth type not in 0-6");
			showerror();
		   }
}

function showerror()
{
	$("#loadingpanel").hide();
	$("#errorPanel").show();
	$("#errorImg").show();
	var browsername=navigator.appCodeName;
	var browserversion=navigator.appVersion.substring(0,1);
	var appname=navigator.appName;
	
	if(appname=='Microsoft Internet Explorer')
	{
		$("#errorImg").css({position: "absolute",'top':'2px','left':'0px'}); 
	}
	
	var langType=commonvar.languageType;
	var str="";
	if(langType=='zh')
	{
		str="请联系管理员，获取认证方式失败！";	
	}
	else if(langType=='ar')
	{
		str="يرجى الاتصال بالمسؤول، فشل الحصول على نوع المصادقة!";	
	}
	else
	{
		str="Please contact administrator, get authentication type failed!";
	}	
	
	var len=str.length*13;
	if (commonvar.languageType == 'en' || commonvar.languageType == 'ar' ) {
		len=len/2;
	}
	if(len>400){
		len=400;
	}
	if(langType == 'ar')
	{
		$("#errorImg").css({position: "absolute",'top':'2px','left':'390px'}); 
	}
	$("#errorPanel").css({position: "absolute",'left':commonvar.clientW*0.5-len});
	$("#errorMessage").text(str); 

	
}
