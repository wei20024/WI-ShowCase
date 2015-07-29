/**
 * @author 
 */
var log;
var consoleVisible=0;
var loglevel={
	trace:0,
	debug:1,
	info:2,
	warn:3,
	error:4,
	fatal:5
};
$.ajaxSetup({
  timeout:120000
});
function initLog()
{
	if(consoleVisible=="1")
	{
		log = log4javascript.getLogger("main");
		var appender = new log4javascript.PopUpAppender();		
		log.addAppender(appender);
		log.debug("start webui page log console");
	}
}


function webuilog(levelNum,logmessage,ex)
{
	if (consoleVisible=="1") {
		if(ex==null)
		{
			switch (levelNum) {
			case 0:
				log.trace(logmessage);
				break;
			case 1:
				log.debug(logmessage);
				break;
			case 2:
				log.info(logmessage);
				break;
			case 3:
				log.warn(logmessage);
				break;
			case 4:
				log.error(logmessage);
				break;
			case 5:
				log.fatal(logmessage);
				break;
			default:
				log.info("wrong log level:"+logmessage);
			}
		}
		else
		{
			switch (levelNum) {
			case 0:
				log.trace(logmessage,ex);
				break;
			case 1:
				log.debug(logmessage,ex);
				break;
			case 2:
				log.info(logmessage,ex);
				break;
			case 3:
				log.warn(logmessage,ex);
				break;
			case 4:
				log.error(logmessage,ex);
				break;
			case 5:
				log.fatal(logmessage,ex);
				break;
			default:
				log.info("wrong log level:"+logmessage,ex);
			}
		}
		
	}
	else{
		return;
	}
}
document.onmousewheel = function (evt) 
    {
        var e = evt || window.event;
        if(e.preventDefault && e.ctrlKey) e.preventDefault();
        if(e.ctrlKey) e.returnValue = false;
    } ;
	if (window.addEventListener) window.addEventListener('DOMMouseScroll', document.onmousewheel, false);
var commonvar={
	testvar:0,
	serviceUrl : {},
	baseUrl:"",
	clientH:0,
	clientW:0,
	languageType:"zh",
	init:function()
	{

		this.baseUrl=window.location.protocol+"//"+window.location.host+"/";
		this.serviceUrl = {
				
				//用户交互
				userLogin: this.baseUrl + "services/login/loginWI",
				verifyUser:this.baseUrl + "services/login/printLogin",
				getAuthType: this.baseUrl +"services/configuration/LoginType",
				getloginuser:this.baseUrl+"services/login/loginUsername",
				wstLogin: this.baseUrl + "services/login/loginWST",
				caLogin: this.baseUrl + "services/login/loginCA",
				caLoginwst:this.baseUrl + "services/login/loginCAWST",
				smartCardLoginService:this.baseUrl + "services/login/loginSmartCard",
				
				homepage:this.baseUrl+"pages/homepage.do",
				userNameLoginPage:this.baseUrl+"pages/login.do",
				versionPage:this.baseUrl+"pages/version.html",
				changePwdPage:this.baseUrl+"pages/changepassword.do",
				logoutPage:this.baseUrl+"pages/logout.do",
				
				mobileLoginPage:this.baseUrl+"uns/mobile/pages/mexplicit.html",
				mobileHomePage:this.baseUrl+"uns/mobile/pages/mohomepage.html",
				
				modifyPass:this.baseUrl + "services/login/changepwd",
				userLogout:this.baseUrl+"services/desktop/logout",
				getVmList: this.baseUrl+"services/desktop/getvmlist" + "?" + Math.random(), // output:{resultCode:0|xxx, errorMessage:xxx, vms: [{farmId:xxx, sid:xxx, name:xxx, type:singleVm|vmGroup, vmDomain,dgId,dgName,state:UNREGISTER|REGISTERED|CONNECTED|DISCONNECTED},{...},...]}
				getLoginInfo: this.baseUrl+"services/desktop/getlogininfo" + "?" + Math.random(), // input: id:sid or groupName, type:singleVm|vmGroup, farmId:xxx; output: {resultCode:ResultCode.code.DESK_PREPARING(preparing)|0,errorMessage,addressTicket,address,loginTicket, linkType:gw|direct, gwIp:xxxx:xx}
				getVncLoginInfo: this.baseUrl+"services/desktop/getvnclogininfo" + "?" + Math.random(), // input: id:sid or groupName, farmId:xxx, vmName:xxx, dgName:xxx; output: {resultCode:ResultCode.code.DESK_PREPARING(preparing)|0,errorMessage,addressTicket,VncPassword, linkType:gw|direct, VncGateIp:xx.xx.xx.xx_xx.xx.xx.xx...}
				reboot: this.baseUrl+"services/desktop/reboot" + "?" + Math.random(), // input: id:sid, domain:xxx, computerName:xxx,dgName:xxx,isForceReboot:true|false; output: {resultCode:0 or other, errorMessage:xxx}
				loginUsername: this.baseUrl+"services/login/loginUsername", // output: resultCode  resultMessage username
				getVMsPowerSet: this.baseUrl+"services/desktop/getvmspowerset" + "?" + Math.random(), // input: id:sid, vmDomain, computerName, dgName; output: {resultCode,errorMessage, customVMUserPolicy}
				setVMsPowerSet: this.baseUrl+"services/desktop/setvmspowerset" + "?" + Math.random(), // input: id:sid, domain, computerName, dgName, customVMUserPolicy; output: {resultCode,errorMessage}
				errorPage403:this.baseUrl+"uns/common/error/error403.jsp",
				getConfigInfo: this.baseUrl+ + "services/desktop/getconfiginfo"
		};
		this.getLangType();
		//获取接入客户端类型
		this.getAccessClientType();
		
		//判断是否需要加载插件
		this.setHdpPluginLoad();
	},
	
	//启动日志
	startlog:function()
	{
	
		log = log4javascript.getLogger("main");
		appender = new log4javascript.PopUpAppender();		
		log.addAppender(appender);
		log.debug("start webui page log console");
	
	
	
	
	if (!consoleVisible) {
		appender.hide();				
	} else {
		appender.show();		
	}
	
	},
	showlog:function()
	{
		appender.show();
	},

	//获取当前设置的语言
	getLangType:function()
	{
		var lang;
		if($.cookie("webuiLangType")!=null)
		{
			lang=$.cookie("webuiLangType");
			if(lang!='zh'&&lang!='en'&&lang!='ar')
			{
				lang=this.getBrowserLanguage();
			}				
		}
		else if($.cookie("browserType")!=null)
		{
			lang=$.cookie("browserType");
			if (lang.indexOf("-")>0)
			{
				lang = lang.substring(0,lang.indexOf("-"));
			}
			else if (lang.indexOf("_")>0)
			{
				lang = lang.substring(0,lang.indexOf("_"));
			}
			else
			{
				if (lang == 'zh' || lang == 'ar' || lang == 'en')
				{
					this.languageType=lang;
					return lang;
				}
			}
		}
		else
		{
			lang=this.getBrowserLanguage();
		}
		
		if(lang != 'zh' && lang != 'ar')
		{
			lang = 'en';
		}
		
		this.languageType=lang;
		return lang;
	},

	// 获得浏览器语言
	getBrowserLanguage:function()
	{ 
		    var _lang="";
			if(window.navigator.language)
			{
				_lang=(window.navigator.language).toLocaleLowerCase();
			}
			else if(window.navigator.browserLanguage)
			{
				_lang=(window.navigator.browserLanguage).toLocaleLowerCase();
			}
			_lang = _lang.indexOf("-")>0?_lang.substring(0,_lang.indexOf("-")):_lang;
			return _lang;
	},
	
	setHdpPluginLoad:function()
	{
		if (this.getBrowserType() != "chrome")
		{
			$("#pluginIE").show();
			$("#plugin").show();
		} 
	},
	
	//设置个人语言信息
	setCookieLang:function(langType)
	{
		$.cookie("webuiLangType", langType, {expires:365,path:'/'});
	},
	//跳转到主页面
	jump2home:function() 
	{
		window.location.href =this.serviceUrl.homepage;  
	},
	//调整背景大小，适配浏览器
	adjustBgSize:function()
	{
		this.clientH= document.documentElement.clientHeight;
		this.clientW = document.documentElement.clientWidth;
		
	},
	//设置背景图片
	setBgImg:function()
	{
		
		this.clientH= document.documentElement.clientHeight;
		this.clientW = document.documentElement.clientWidth;
		
		$("body").css({"width":this.clientW,"height":this.clientH});
		
		if($.cookie("bgImg")!=null)
		{
			$("body").css("background-image","url(" + $.cookie("bgImg") + ")");
		}

	},
	showscroll:function()
	{
		this.clientH= document.documentElement.clientHeight;
		this.clientW = document.documentElement.clientWidth;
		if(this.clientH<620)
		{
			if(this.clientW<620)
			{
				$("html").css({"overflow-x":"scroll","overflow-y":"scroll"});
				
				$("body").css({
					"width": "650px",
					"height": "620px"
				});	
			}
			else
			{
				$("html").css({"overflow-x":"hidden","overflow-y":"scroll"});
				$("body").css({
					"width": this.clientW+20,
					"height": "620px"
				});	
			}
		}
		else
		{
			if(this.clientW<620)
			{
				$("html").css({"overflow-x":"scroll","overflow-y":"hidden"});
				$("body").css({
					"width": "650px",
					"height": this.clientH+20
				});
			}
			else
			{
				$("html").css({"overflow-x":"hidden","overflow-y":"hidden"});
				$("body").css({
					"width":this.clientW+17,"height":this.clientH+17});
			}
		}	
	},
	//获取请求后携带的参数
	 getRequestParam:function() 
	 {
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
	},
	//如果第一次登录设置第一次登录的cookie值
	setFirstLoginCookie:function()
	{
		webuilog(loglevel.info,"setFirstLoginCookie begin");
		
		//只要访问登录页面就设置自动登录的值:true表示第一次登录，false表示不是第一次
		commonvar.setCookieByProtocol("isFirstLogin", "true");
	},

	//设置每日提醒图片功能公共方法
	setAdvicePng:function()
	{
		webuilog(loglevel.info,"setAdvicePng begin");
		var cnAdvice = $("#hideInputCN").val();
		var enAdvice = $("#hideInputEN").val();
		var arAdvice = $("#hideInputAR").val();
		
		if (commonvar.languageType == "zh")
		{
			$("#ad").attr("src",cnAdvice);	
		}
		else if (commonvar.languageType == "ar")
		{
			$("#ad").attr("src",arAdvice);	
		}
		else
		{
			$("#ad").attr("src",enAdvice);	
		}
	},
	
	//设置头像图片
	setHeadImage:function()
	{
		webuilog(loglevel.info,"setHeadImage begin");
		
		var headImageArray = new Array();
		headImageArray[0] = $("#headImage1").val();
		headImageArray[1] = $("#headImage2").val();
		headImageArray[2] = $("#headImage3").val();
		headImageArray[3] = $("#headImage4").val();
		headImageArray[4] = $("#headImage5").val();
		headImageArray[5] = $("#headImage1").val();
		
		indexH=parseInt(Math.random()*(5-1+1)+1); 
		$("#headImage").attr("src", headImageArray[indexH]);

	},
	
	//获取后台login.property配置文件中的key-value值
	getConfigInfo:function()
	{
		// 获取property的值
		webuilog(loglevel.info,"get property config begin");
		var configInfo = this.baseUrl + "services/desktop/getconfiginfo";

		var call_back;
		if (arguments.length > 0)
		{
			call_back = arguments[0];
		}

		$.ajax({
	        url : configInfo + "?" + Math.random(), // 加随机数防止缓存
	        type : "POST",
	        headers: { "cache-control": "no-cache"},	
	        dataType : "json",
	        contentType :"application/json",
	        data : JSON.stringify({
	        	"configReq":["dynamicPassword.SMSOTPAuth","retryConnectVNCCount","retryConnectCount","runningMode","autoConnectVm","desktopLock","dynamicPassword.2FactorAuth","clientAuth"]
	        }),
	        timeout: 300000,
	        success : function(msg) {
	        	try
	        	{
	        		webuilog(loglevel.info,"get property config msg.resultCode = " + msg.resultCode);
		        	if (msg.resultCode == 0)
		        	{
		        		var newconfig = {};
		        		for(var i in msg.config)
		        		{
		        			var config = msg.config[i];
		        			newconfig[config.key] = config;
		        		}
		  
		            	for(var ig in newconfig)
		            	{
		            		webui.system.config[ig] = newconfig[ig].value;
		            	}
		            	
		            	if ("undefined" != typeof(call_back))
		            	{
		            		call_back();
		            	}
		        	}
		        	else
		        	{
		        		webuilog(loglevel.info,"get property config failed:", msg.resultCode);
					}
				}
				catch(err)
				{
					webuilog(loglevel.info,"get property config exception:" + err, err.stack ? err.stack : "");
				}
	        },
	        error : function(msg,ret) {
	        	webuilog(loglevel.info,"get property config error:", ret);
	        }
		});	
	},
	getRandomTokenId:function()
	{
		return $.cookie("randomTokenId");
	},
	getBrowserType:function()
	{
		if(navigator.userAgent.indexOf("MSIE 6.0")>0)  
    	{  
			return "ie6";
		}
		else if(navigator.userAgent.indexOf("MSIE 7.0")>0)  
    	{  
			return "ie7";
		}
		else if(navigator.userAgent.indexOf("MSIE 8.0")>0)  
    	{  
			return "ie8";
		}
		else if(navigator.userAgent.indexOf("MSIE 9.0")>0)
		{
			return "ie9";
		}
		else if(navigator.userAgent.indexOf("MSIE") > 0)
		{
			return "ie";
		}
		else if(navigator.userAgent.indexOf("Trident") > 0)
		{
			return "ie";
		}
		else if(navigator.userAgent.indexOf("Chrome") > 0)
		{
			return "chrome";
		}
		else
		{
			return "other";
		}
	},
	
	loadcss:function(file)
	{
		
		$("head").append("<link>");
		css = $("link").last();
		if(commonvar.languageType == 'ar')
		{	
			file = "/webui/default/css/arabic/" + file;
		}
		else
		{
			file = "/webui/default/css/" + file;		
		}
		eval("css.attr({ rel: 'stylesheet',type: 'text/css', href:'" + file +"'})");
	},
	setCookieByProtocol:function(key, value)
	{
		//设置cookie值，如果是http协议不需要加secure属性，如果是https协议需要
		var httpProtocol = window.location.protocol;
		if (httpProtocol == 'http:' || httpProtocol == 'HTTP:')
		{
			$.cookie(key, value,{expires:365,path:'/'});
		}
		else
		{
			$.cookie(key, value,{expires:365,path:'/',secure:'secure'});
		}
	},
	getAccessClientType:function()
	{
		var os_type = null;	
		var accessClientType = null;
		var u = navigator.userAgent;

		windows = (navigator.userAgent.indexOf("Windows",0) != -1)?true:false; //说明windows系统
		linux = (navigator.userAgent.indexOf("Linux",0) != -1 && u.indexOf('Android') <= -1)?true:false;//说明Linux TC访问
		android =  u.indexOf('Android') > -1 && u.indexOf('Linux') > -1 && u.indexOf('android_pad') <= -1;//说明android原生浏览器访问，但不是客户端访问
		androidpad = u.indexOf('android_pad') > -1;//说明是android客户端访问
		iPhone =  u.indexOf('iPhone') > -1;//说明iPhone访问
		iPad = u.indexOf('iPad') > -1;//说明iPad访问
		iPod = u.indexOf('iPod') > -1;//说明iPod访问
		mac = u.indexOf('Mac') > -1;//说明iPod访问
		androidtc = u.indexOf("android_tc") > -1; //说明android_tc访问
				
		//判断是否为pc或者移动客户端接入
		if (windows)
		{
			accessClientType = "Windows";
		}
		else if (linux)
		{
			accessClientType = "Linux";
		}
		else if (android)
		{
			accessClientType = "android";
		}
		else if (androidpad)
		{
			accessClientType = "android_pad";
		}
		else if (iPhone)
		{
			accessClientType = "iPhone";
		}
		else if (iPad)
		{
			accessClientType = "iPad";
		}
		else if (iPod)
		{
			accessClientType = "iPod";
		}
		else if (androidtc)
		{
			accessClientType = "android_tc";
		}
		else if (mac)
		{
			accessClientType = "Mac";
		}
		else
		{
			accessClientType = "unknow";
		}
		
		commonvar.setCookieByProtocol("accessClientType", accessClientType);
		return accessClientType;
	}
};


// 移动客户端调用接口，设置一些参数
// systemType：ios，android，android TC
// version：iOS 与 Anroid 独立版本，均从1.0.0开始，符合posix版本规范。
// location：国家区域码：zh-cn...
// user：期望登录的用户名（如果与当前session用户名不一致时，需要显示登录页面）
function setAgent(version, systemType, locationLanguage, loginUser) 
{
	// 将这些客户端信息设置到cookie中
	commonvar.setCookieByProtocol("accessClientVersion", version);
	$.cookie("userName", loginUser);
};

//联机帮助弹出页面
function openWin()
{
	var width,heigh,top,left,right;
	if (document.documentElement.clientWidth > 1250)
	{
		width = 1300;
		heigh = 770;
		top = document.documentElement.clientWidth*0.05;
		left = document.documentElement.clientWidth*0.1;
		right = document.documentElement.clientWidth*0.1;
	}
	else
	{
		width = document.documentElement.clientWidth*0.8;
		heigh = document.documentElement.clientHeight*0.92;
		top = document.documentElement.clientWidth*0.05;
		left = document.documentElement.clientWidth*0.1;
		right = document.documentElement.clientWidth*0.1;
	}
	
	//获取浏览器语言
	commonvar.getLangType();
	
	if(commonvar.languageType == 'zh')
	{
		window.open("/uns/common/onlinehelp/zh/index.html","","width=" + width +",height=" + heigh + ",top=" + top +",left=" + left + ",right=" + right + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
	}
	else
	{
		window.open("/uns/common/onlinehelp/en/index.html","","width=" + width +",height=" + heigh + ",top=" + top +",left=" + left + ",right=" + right + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
	}
	
};

var HtmlUtil = {
	/*1.用浏览器内部转换器实现html转码*/
	htmlEncode:function (html){
		//1.首先动态创建一个容器标签元素，如DIV
		var temp = document.createElement ("div");
		//2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
		(temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
		//3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
		var output = temp.innerHTML;
		temp = null;
		return output;
	},
	/*2.用浏览器内部转换器实现html解码*/
	htmlDecode:function (text){
		//1.首先动态创建一个容器标签元素，如DIV
		var temp = document.createElement("div");
		//2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
		temp.innerHTML = text;
		//3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	}
};
var wiJsVersion = "R5C20";