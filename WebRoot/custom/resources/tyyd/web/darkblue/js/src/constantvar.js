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
				userLogout:this.baseUrl+"services/desktop/logout",
				getAuthType: this.baseUrl +"services/configuration/LoginType",
				modifyPass:this.baseUrl + "services/login/changepwd",
				getloginuser:this.baseUrl+"services/login/loginUsername",
				wstLogin: this.baseUrl + "services/login/loginWST",
				caLogin: this.baseUrl + "services/login/loginCA",
				caLoginwst:this.baseUrl + "services/login/loginCAWST",
				
				homepage:this.baseUrl+"uns/darkblue/homepage.html",
				userNameLoginPage:this.baseUrl+"uns/darkblue/explicit.html",
				certificateSSOLoginPage:this.baseUrl+"pages/certificatesso.html",
				miscellaneousLoginPage:this.baseUrl+"pages/smartcardgateway.html",
				smartCardLoginService:this.baseUrl + "services/login/loginSmartCard",
				fingerLoginPage:this.baseUrl+"pages/finger.html",
				logoutPage:this.baseUrl+"uns/darkblue/logout.html",
				loginPage:this.baseUrl+"pages/login.html",
				caLoginPage:this.baseUrl+"pages/calogin.html",
				cawstLoginPage:this.baseUrl+"pages/caloginwst.html",
				certificateLoginPage:this.baseUrl+"pages/certificate.html",
				dynamicLoginPage:this.baseUrl+"pages/dynamicCode.html",
				versionPage:this.baseUrl+"pages/version.html",
				changePwdPage:this.baseUrl+"pages/changepassword.html",
				
				getVmList: this.baseUrl+"services/desktop/getvmlist" + "?" + Math.random(), // output:{resultCode:0|xxx, errorMessage:xxx, vms: [{farmId:xxx, sid:xxx, name:xxx, type:singleVm|vmGroup, vmDomain,dgId,dgName,state:UNREGISTER|REGISTERED|CONNECTED|DISCONNECTED},{...},...]}
				getLoginInfo:this.baseUrl+"services/desktop/getlogininfo" + "?" + Math.random(), // input: id:sid or groupName, type:singleVm|vmGroup, farmId:xxx; output: {resultCode:ResultCode.code.DESK_PREPARING(preparing)|0,errorMessage,addressTicket,address,loginTicket, linkType:gw|direct, gwIp:xxxx:xx}
				getVncLoginInfo: this.baseUrl+"services/desktop/getvnclogininfo" + "?" + Math.random(), // input: id:sid or groupName, farmId:xxx, vmName:xxx, dgName:xxx; output: {resultCode:ResultCode.code.DESK_PREPARING(preparing)|0,errorMessage,addressTicket,VncPassword, linkType:gw|direct, VncGateIp:xx.xx.xx.xx_xx.xx.xx.xx...}
				reboot: this.baseUrl+"services/desktop/reboot" + "?" + Math.random(), // input: id:sid, domain:xxx, computerName:xxx,dgName:xxx,isForceReboot:true|false; output: {resultCode:0 or other, errorMessage:xxx}
				loginUsername: this.baseUrl+"services/login/loginUsername", // output: resultCode  resultMessage username
				getVMsPowerSet: this.baseUrl+"services/desktop/getvmspowerset" + "?" + Math.random(), // input: id:sid, vmDomain, computerName, dgName; output: {resultCode,errorMessage, customVMUserPolicy}
				setVMsPowerSet: this.baseUrl+"services/desktop/setvmspowerset" + "?" + Math.random(), // input: id:sid, domain, computerName, dgName, customVMUserPolicy; output: {resultCode,errorMessage}
				errorPage403:this.baseUrl+"uns/common/error/error403.jsp",
				getConfigInfo: this.baseUrl + "services/desktop/getconfiginfo",
				queryVmStatus: this.baseUrl + "services/desktop/queryVmStatus"
		};
		this.getLangType();
		
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
	//设置个人语言信息
	setCookieLang:function(langType)
	{
		commonvar.setCookieByProtocol("webuiLangType", langType);
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
		bgDefault="/custom/resources/tyyd/web/darkblue/img/backGroundMainE.jpg";		
		
		if($.cookie("darkblue_bgImg")!=null)
		{
			$("body").css("background-image","url(" + $.cookie("darkblue_bgImg") + ")");
		}
		else
		{
			$("body").css("background-image","url(" + bgDefault + ")");
			
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
	getRandomTokenId:function()
	{
		return $.cookie("randomTokenId");
	},
	loadcss:function(file)
	{
		
		$("head").append("<link>");
		css = $("link").last();
		if(commonvar.languageType == 'ar')
		{	
			file = "../css/arabic/" + file;
		}
		else
		{
			file = "../css/" + file;		
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
	//获取后台login.property配置文件中的key-value值
	getConfigInfo:function()
	{
		// 获取property的值
		webuilog(loglevel.info,"get property config begin");
		
		var call_back;
		if (arguments.length > 0)
		{
			call_back = arguments[0];
		}
		$.ajax({
	        url : commonvar.serviceUrl.getConfigInfo + "?" + Math.random(), // 加随机数防止缓存
	        type : "POST",
	        headers: { "cache-control": "no-cache"},	
	        dataType : "json",
	        contentType :"application/json",
	        data : JSON.stringify({
	        	"configReq":["dynamicPassword.SMSOTPAuth","retryConnectVNCCount","retryConnectCount","runningMode","autoConnectVm","desktopLock","clientAuth","configFlag"]
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
		        			webuilog(loglevel.info,"get property config key:" + newconfig[config.key].key + ", value:" + newconfig[config.key].value);
		        		}
		  
		            	for(var ig in newconfig)
		            	{
		            		webui.system.config[ig] = newconfig[ig].value;
		            		webuilog(loglevel.info,"newconfig[ig].value = " + newconfig[ig].value + " ,webui.system.config[ig] = " + webui.system.config[ig]);
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
	}
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
		window.open("/onlinehelp/zh/index.html","","width=" + width +",height=" + heigh + ",top=" + top +",left=" + left + ",right=" + right + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
	}
	else
	{
		window.open("/onlinehelp/en/index.html","","width=" + width +",height=" + heigh + ",top=" + top +",left=" + left + ",right=" + right + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
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