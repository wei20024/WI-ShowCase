/**
 * 显示登录页面，域、用户名、密码登录
 * author：
 */
//variables

var flag = true;
var firstLogin = 0;
var firstLogin1 = 0;
var editshow=true;
var loginPanel;
var adPanle;
var errorLabel;
var uname="";
var pass="";
webui.explicit = {};
var mac="";
var clientMac="";
accessType=null;
var multiDomainFlag = false;
var selectDomainName;

//初始化命名空间
webui.objects.explicit = {};

//页面初始化
$(document).ready(function(){

	//启动日志
	consoleVisible=$.cookie("openlog");
	initLog();
	webuilog(loglevel.info,"test explicit page");
	
	loginPanel=$("#userloginpanel");
	adPanle=$("#addiv");
	errorLabel=$("#errorLb");
	commonvar.init();
	commonvar.setFirstLoginCookie();
	ServiceAPI.init();	
	commonvar.setBgImg();
	var s = Login.getString("adimg");
	
	//国际化每日提醒图片
	commonvar.setAdvicePng();

	//变更头像图片
	commonvar.setHeadImage();
	
	webuilog(loglevel.info,"start adjust location");
	//调整位置
	var adTop=commonvar.clientH*0.4+135 <= commonvar.clientH-250 ? commonvar.clientH-250 : commonvar.clientH*0.4+135;
	
	loginPanel.css({position: "absolute",'top':commonvar.clientH*0.4-125,'left':commonvar.clientW*0.5-250}); 
	adPanle.css({position: "absolute",'top':adTop,'left':commonvar.clientW*0.5-235});
	
	var ll=commonvar.clientW*0.5-250; 
	webuilog(loglevel.info,"clientW="+commonvar.clientW+";loginpanel left="+ll);
	
	checkUserIsLogin();
	
	//获取接入类型
	accessType = commonvar.getAccessClientType();
	
	//根据浏览器大小调整位置
	$(window).resize(function() {
		
		commonvar.showscroll(); 
		var topU,leftU;
		topU=commonvar.clientH*0.4-125;
		leftU=commonvar.clientW*0.5-250;
		if(topU<100)
		{
			topU=100;
		}
		if(leftU<100)
		{
			leftU=100;
		}
		var adTop=topU+125+135 <= commonvar.clientH-250 ? commonvar.clientH-250 : topU+125+135;
		
		loginPanel.css({position: "absolute",'top':topU,'left':leftU}); 		
		adPanle.css({position: "absolute",'top':adTop,'left':leftU+15});
		webuilog(loglevel.info,"clientW="+commonvar.clientW+";loginpanel left="+leftU);
    }); 
	
	hdpclient.init();
	commonvar.getConfigInfo(call_back);
	
	if (accessType == "android_tc")
	{
		//融合TC
		webui.explicit.unicom.begin();
		$("#remberMe").show();
	}
	
	//配合客户端
	webui.explicit.autoUserIdentity.begin();
	
	if($("#errorLb").text()=='SystemNoConfig')
	{
		errorLabel.text(Login.getString("SystemNoConfig"));
	}
});

//配合客户端
(function(){
	
	//解析字符串
	function paraseIdentityString(identityString)
	{
		var userInfo = 
		{
			domain:"",
			userName:"",
			password:""
		};
		
		if (null != identityString && "" != identityString)
		{
			var splitIndex = identityString.indexOf('|');
			
			if (splitIndex == -1)
			{
				return;
			}
			
			var userName = identityString.substring(0, splitIndex);
			userInfo.password = identityString.substring(splitIndex + 1, identityString.length);
			
			if (null != userName)
			{
				if (userName.indexOf('\\') == -1)
				{
					userInfo.domain = "";
					userInfo.userName = userName;
				}
				else 
				{
					var infoTemp = userName.split('\\');
					userInfo.domain = infoTemp[0];
					userInfo.userName = infoTemp[1];
				}
			}
		}
		
		return userInfo;
	}
	
	function begin()
	{
		if (commonvar.getBrowserType() == "chrome")
		{
			return;
		}
		
		//判断是否logout，如果为logout不做处理
		var requestParam = new Object();
		requestParam =commonvar.getRequestParam();
		
		var resultCode= requestParam['isLogout'];
		
		if(resultCode == 1)
		{
			return;
		}
		
		var userIdentityString = hdpclient.userIdentity();
		
		if (null == userIdentityString || "" == userIdentityString)
		{
			//如果没有数据不做处理
			return;
		}
		else
		{
			var userInfo = paraseIdentityString(userIdentityString);
			
			//用户名为空不处理
			if ('' == userInfo.userName || '' == userInfo.password)
			{
				return;
			}
			else 
			{
				$("#userName").val(userInfo.userName);
				$("#userPass").val(userInfo.password);
				$("#userNameLb").text(userInfo.userName);
				
				if ('' != userInfo.domain)
				{
					selectDomainName = userInfo.domain;
				}
				
				webuilog(loglevel.info,"** doLogin. ");
				
				//执行登录
				doLogin();
			}
		}
		
	}
	
	//跟客户端配置工具配合
	webui.explicit.autoUserIdentity = 
	{
			begin:begin
	};
	
})();


//融合TC新增功能
(function(){
	//初始化页面点击记住密码功能
	function checkBoxInit()
	{
		//控制勾选框显示
		var checkboxvalue = $.cookie("rememberLogin");
		
		if (null == checkboxvalue || checkboxvalue == "undefined")
		{
			$("#remberBox").attr("checked",false);
		}
		else if (0 == checkboxvalue)
		{
			$("#remberBox").attr("checked",false);
		}
		else
		{
			$("#remberBox").attr("checked",true);
		}
		
		//绑定click事件
		//点击记住密码勾选框:0表示不记住，1表示记住
		$("#remberBox").click(function(){
			var checkboxvalue = $.cookie("rememberLogin");
			
			if (null == checkboxvalue || checkboxvalue == "undefined")
			{
				$.cookie("rememberLogin", 1, {expires:365,path:'/'});
			}
			else if (0 == checkboxvalue)
			{
				$.cookie("rememberLogin", 1, {expires:365,path:'/'});
			}
			else
			{
				$.cookie("rememberLogin", 0, {expires:365,path:'/'});
			}
		});
	};
	
	function begin()
	{
		//去掉联机帮助图标
		$("#onlinehelpimg").hide();
		$("#mobileConfirmSuccess").hide();
		$("#ad").attr("src","/custom/resources/tyyd/web/default/img/ad1.png");
		
		//国际化
		$("#checkboxText").text(Login.getString("rememberpwd"))
		
		//初始化记住密码功能
		checkBoxInit();
	};
	
	function remberLogin()
	{
		//得到登录类型，只有android系列的才需要执行以下方法
		var os_type = commonvar.getAccessClientType();
		
		if(os_type=="android" || os_type=="android_tc")
		{
			var checkedvalue = $.cookie("rememberLogin");
			var userNameEncode = $.trim($("#userName").val());
			
			if ($.trim($("#userName").val()) == null || $.trim($("#userName").val()) == "")
			{
				userNameEncode =  $("#userNameLb").text();
			}
	
			var passwordEncode = $("#userPass").val();
			
			if (checkedvalue == 1)
			{
				if (typeof(mobileclient) == "undefined" || undefined == mobileclient || mobileclient == null)
				{
					return;
				}
				
				try
				{
					mobileclient.setuserandpwd(checkedvalue,userNameEncode,passwordEncode);
				}
				catch(e)
				{
					
				}
				
			}
		}
	}
	
	webui.explicit.unicom = {
			remberLogin:remberLogin,
			begin:begin
	};
})();

function keyDownFun()
{
	if(window.event.keyCode==123)
    {
    	return false;
    }
}

function call_back()
{
	//把运行模式保存到Cookie中
	commonvar.setCookieByProtocol("runMode", webui.system.config.runningMode);
	if (webui.system.config.desktopLock == 1)
	{
		$("#onlinehelpimg").hide();
		 $(document).bind("contextmenu", function() { return false; });
		 document.onkeydown = keyDownFun;
	}
	
	if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system.config.runningMode)
	{
		//得到mac地址
		clientMac = hdpclient.getClientMac();
		
		var dowloader = $("#downloadClient");
		
		var nosupporter = $("#nosupportTip");
		nosupporter.find("#nosupportTipText").text(Login.getString("Nosupport"));
		
		var os = checkOs();
		
		webuilog(loglevel.info,"checked os is: " + os);
		if (os == "Windows")
		{
			dowloader.find("#downloadClientButtion2").attr("href", "/plugin/AccessClient_Win.msi");
		}
		else if (os == "Linux")
		{
			dowloader.find("#downloadClientButtion2").attr("href", "/plugin/LinuxClientSetupX86.bin");
		}
		else
		{
			setTimeout(function(){
				nosupporter.fadeIn();
			}, 2000);
			return;
		}
		
			if (os == "Windows")
			{
				dowloader.find("#downloadClientTip1").text(Login.getString("NoSetupClient"));
				dowloader.find("#downloadClientTip2").text(Login.getString("Download Client"));
				dowloader.find("#downloadClientButtion2").text(Login.getString("Download"));
			}
			else if (os == "Linux")
			{
				dowloader.find("#downloadClientTip1").text(Login.getString("NoSetupClient"));
				dowloader.find("#downloadClientTip2").text(Login.getString("contactAdministrator"));
				dowloader.find("#downloadClientButtion2").text("");
			}
			
			dowloader.find("#downloadClientTip3").text(Login.getString("goonlogin"));
			
			var clientversion = hdpclient.clientVersion();
			if (null == clientversion || '' == clientversion || undefined == clientversion)
			{
				setTimeout(function(){
					dowloader.fadeIn();
				}, 2000);
			}
			else if (clientversion < webui.system.clientVersion)
			{
				dowloader.find("#downloadClientTip1").text(Login.getString("clientVersionLow"));
				
				if (os == "Windows")
				{
					dowloader.find("#downloadClientTip2").text(Login.getString("Download Client"));
					dowloader.find("#downloadClientButtion2").text(Login.getString("Download"));
				}
				else if (os == "Linux")
				{
					dowloader.find("#downloadClientTip2").text(Login.getString("contactAdministrator"));
					dowloader.find("#downloadClientButtion2").text("");
				}
				setTimeout(function(){
					dowloader.fadeIn();
				}, 2000);
			}	
	}
}

function checkOs()
{
	var os_type = null;
	
	windows = (navigator.userAgent.indexOf("Windows",0) != -1)?true:false;
	linux = (navigator.userAgent.indexOf("Linux",0) != -1)?true:false;
 
	if (windows) os_type = "Windows";
	else if (linux) os_type = "Linux";
 
	return os_type;
}

// 检查插件是否存在，name为正则表达式
function checkPlugin(name)
{
	console.log("plugin list:", navigator.plugins);
	if (name.test(navigator.appVersion)) return true;
	if (name.test(navigator.userAgent)) return true;
	for(var i=0; i<navigator.plugins.length; i++){
	      if(name.test(navigator.plugins[i].name.toLowerCase())){
	             return true;
	      }
	}
	return false;
}
/**
 * 校验是否已经有用户登录
 * 如果没有登录初始化登录页面
 */
function checkUserIsLogin(){
	
	
	$("#loadingpanel").css({"z-index":"10"}).show();//显示缓冲图片

	var serviceUrl ="login/loginUsername";
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
			   $("#loadingpanel").css({"z-index":"0"}).hide();//隐藏缓冲图片	
            },
			error:function(){
				initLoginInfo();
				$("#loadingpanel").css({"z-index":"0"}).hide();//隐藏缓冲图片	
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
		//根据cookie是否有保存的用户信息而显示登陆页面
		var userName=$.cookie("userName");
		if(userName=="" || userName==null)
		{
			$("#uNameInput").show();
			$("#userName").val("");
			document.getElementById('userName').focus();
			$("#userName").focus(function(){
  								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputfocus.png");
								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
						}).blur(function(){
  								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
						});
			
			editshow=true;
			$("#userPass").focus(function(){
								if(document.getElementById('userPass').value == Login.getString('userPassTip') || document.getElementById('userPass').value == "")
								{
									$("#userPass").val("");
								}
  								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputfocus.png");
								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
						}).blur(function(){
  								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
						});	

			$("#uNameLabel").hide();	
			$("#userNameLb").text("");
			$("#btnEditName").unbind("click");			
		}
		else
		{
			$("#uNameInput").hide();
			$("#userName").val("");			
			
			$("#uNameLabel").show();	
			$("#userNameLb").text(userName);
			editshow=false;
			document.getElementById('userPass').focus();
			$("#userPass").focus(function(){
								if(document.getElementById('userPass').value == Login.getString('userPassTip') || document.getElementById('userPass').value == "")
								{
									$("#userPass").val("");
								}
  								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputfocus.png");
								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
						}).blur(function(){
  								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
						});	
			
			//用户名编辑按钮事件
			$("#btnEditName").click(function(){
				$("#uNameInput").show();
				$("#userName").val($("#userNameLb").text());
				document.getElementById('userName').focus();
				$("#userName").focus(function(){
  								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputfocus.png");
								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
						}).select().blur(function(){
  								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
								});			
				editshow=true;
					
				$("#uNameLabel").hide();	
				$("#userNameLb").text("");
				
				$("#btnEditName").unbind("click");	
			});
		}
						
		//点击登录按钮事件		
		$("#loginBtn").css({"background-image":Login.getString("loginbtn")}).click(function() {	
			doLogin();		    		   
		});
	}

/**
 * 控制页面输入框中是否显示字符
 * @param input
 * @param emptyValue
 * @param b
 */
function setEmptyValue(input, emptyValue, b)
{
	//根据传进来的关键字取得相应的国际化
	emptyValue = Login.getString(emptyValue);
	
    var text = document.getElementById(input);
    var val = null;
    if(text)
    {
       val = text.value;
    }
    if (b == 1)
    {
        if (val == "")
        {
            text.value = emptyValue;
            text.style.color = "#aaaaaa";
            if (text.type == "text")
            {
                text.style.fontSize = "14px";
                                 
                var Sys = {};
                var ua = navigator.userAgent.toLowerCase();
                var s;

                (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :

                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :

                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :

                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :

                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;                

                if (Sys.ie) 
                {
                    text.style.paddingTop = "3px";
                }
                if (Sys.firefox) 
                {
                    text.style.paddingTop = "1px";
                }

            }
        }
    }
    else
    {
        if (val == emptyValue || val == "")
        {
            text.value = "";
            text.style.fontSize="18px";
            text.style.color = "#6c8ba4";
            text.style.paddingTop = "0px";
        }
    }
}

function loginKey(event){
    if(event.keyCode == 13) {
        doLogin();
    }
}

//android TC调用的方法：：用来自动登录
function autodologin(username, password, macs)
{
	if (username != null && username != "")
	{
		$("#userName").val(username);
		$("#userPass").val(password);
		mac = macs;
		$("#userNameLb").text(username);
		
		if(password != null && password != "")
		{
			doLogin();
		}
	}
	else
	{
		//重新初始化登录页面显示
		$("#uNameInput").show();
		$("#userName").val("");
		document.getElementById('userName').focus();
		$("#userName").focus(function(){
								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputfocus.png");
							$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
					}).blur(function(){
								$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
					});
		
		editshow=true;
		$("#userPass").focus(function(){
							if(document.getElementById('userPass').value == Login.getString('userPassTip') || document.getElementById('userPass').value == "")
							{
								$("#userPass").val("");
							}
								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputfocus.png");
							$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
					}).blur(function(){
								$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputnofocus.png");
					});	

		$("#uNameLabel").hide();	
		$("#userNameLb").text("");
		$("#btnEditName").unbind("click");	
	}
}
function doLogin() {
	$("#loginBtn").unbind("click");
	errorLabel.hide();
	$("#loadingpanel").css({"z-index":"10"}).show();	
	if(editshow==false)
	{
    	uname =$.trim($("#userNameLb").text());
	}
    else
	{
    	uname =$.trim($("#userName").val());
	}	    
    	
    pass = $("#userPass").val();
    
    if(uname == Login.getString("userNameTip"))
    {
    	uname="";
    }
	
    if(pass == Login.getString("userPassTip"))
    {
    	pass="";
    }
    
	if(!checkParam())
    {
    	 $("#loginBtn").bind("click",doLogin);
		 $("#loadingpanel").css({"z-index":"0"}).hide();//显示缓冲图片	
        return false;
    }
	
	//获取页面mac地址
	if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system.config.runningMode)
	{
		mac = clientMac;
		if (null == mac || '' == mac || "undefined" == typeof(mac))
		{
			errorLabel.text(Login.getString("macNotNull"));	
			showErrorLabel(1);
			$("#loginBtn").bind("click",doLogin);
			$("#loadingpanel").css({"z-index":"0"}).hide();//显示缓冲图片
			return false;
		}
		else
		{
			mac = mac.replace(/-/g,"");
		}
	}
	else
	{
		mac = $("#UserIdentifyString").val();
	}
	
	var contextName = [];
	var obj = {
		username: uname,
        password: pass,
        macAddress: mac
		};
	var params = JSON.stringify(obj);
	var success_callback = function(msg){
		$("#loginBtn").bind("click",doLogin);  
		
            //如果用户登录成功，且输入用户名、密码错误次数小于3时，页面进行跳转，否则显示验证码输入框进行验证
            $("#loadingpanel").css({"z-index":"0"}).hide();
            
            //如果认证成功调用android_tc方法
            webui.explicit.unicom.remberLogin();
            
			var loginRsp=msg;
			 if (loginRsp.resultCode == ResultCode.code.OPERATE_SUCCESS || loginRsp.resultCode == ResultCode.code.SUCCESS) {
			   		clientTicket = loginRsp.loginState;
					commonvar.setCookieByProtocol("userName",uname);
			   		jump2home();
			   } else {
			   	$("#userPass").val("");	
				commonvar.setCookieByProtocol("userName",uname);
                checkCode(loginRsp.resultCode);            
            }
	};
	var error_callback=function(msg,error){
		$("#loadingpanel").css({"z-index":"0"}).hide();
		$("#loginBtn").bind("click",doLogin);
		$("#userPass").val("");
		errorLabel.hide();
		if(error=="timeout")
		{
			 showErrorLabel(0,error);
		}
		else
		{
			showErrorLabel(0,msg.status);
		}
       
	};
	ServiceAPI.ajaxPostJSON(params, commonvar.serviceUrl.userLogin, success_callback, error_callback);//ServiceAPI.serviceUrl.
	
}

//将错误码对应的描述，显示在错误提示栏中
function checkCode(codeType) {
	$("#loadingpanel").css({"z-index":"0"}).hide();
	errorLabel.hide();
	if (codeType == "10002") {
		errorLabel.text(Login.getString("10002"));
	} else if (codeType == ResultCode.code.PARAMETER_INVALID) {
		errorLabel.text(Login.getString("ResultCode.code.PARAMETER_INVALID"));
	} else if (codeType == "10004") {
		errorLabel.text(Login.getString("10004"));
	} else if (codeType == "10005") {
		errorLabel.text(Login.getString("10005"));
	} else if (codeType == "10006") {
		errorLabel.text(Login.getString("10006"));
	} else if (codeType == ResultCode.code.LOGIN_INVALID) {
	    if(firstLogin1 == 0)//尝试登录一次
        {
            doLogin();
            firstLogin1++;
        } else
        {
            firstLogin1 = 0;
            errorLabel.text(Login.getString("ResultCode.code.LOGIN_INVALID"));
        }
	} else if (codeType == "10010") {
		errorLabel.text(Login.getString("10010"));
	} else if (codeType == "10011") {	    
	    errorLabel.text(Login.getString("10011"));
	} else if (codeType == ResultCode.code.USER_NO_EXIST) {
        errorLabel.text(Login.getString("ResultCode.code.USER_NO_EXIST"));
    } else if (codeType == "10013") {
        errorLabel.text(Login.getString("10013"));
	} else if(codeType == "10031"){
    	errorLabel.text(Login.getString("10031"));
    } else if (codeType == "20001"){
    	errorLabel.text(Login.getString("20001"));
    } else if (codeType == "20002"){
    	errorLabel.text(Login.getString("20002"));
    }else if (codeType == ResultCode.code.USER_PASSWORD_INVALID){
    	errorLabel.text(Login.getString("ResultCode.code.USER_PASSWORD_INVALID"));
    }else if (codeType == ResultCode.code.USER_LOCK){
    	errorLabel.text(Login.getString("ResultCode.code.USER_LOCK"));
    } else if (codeType == ResultCode.code.UNKNOW_REASON){
    	errorLabel.text(Login.getString("ResultCode.code.UNKNOW_REASON"));
    } else if (codeType == ResultCode.code.AD_UNREADY){
    	errorLabel.text(Login.getString("ResultCode.code.AD_UNREADY"));
    } else if (codeType == ResultCode.code.DOMAIN_UNEXIST){
    	errorLabel.text(Login.getString("ResultCode.code.DOMAIN_UNEXIST"));
    } else if (codeType == "20009"){
    	errorLabel.text(Login.getString("20009"));
    } else if (codeType == "20010"){
    	errorLabel.text(Login.getString("20010"));
    } else if (codeType == "20011"){
    	errorLabel.text(Login.getString("20011"));
    }else if (codeType == ResultCode.code.PASSWORD_WILL_INVALIDATION){
    	errorLabel.text(Login.getString("ResultCode.code.PASSWORD_WILL_INVALIDATION"));
		//弹出提示框，用户点击后弹出密码更改界面
		
    }else if (codeType == ResultCode.code.OTHER_USER_LOGINED){
    	errorLabel.text(Login.getString("ResultCode.code.OTHER_USER_LOGINED"));
		//弹出提示框，用户点击后弹出密码更改界面
		
    }else if (codeType == ResultCode.code.ACCOUNT_INVALIDATIONED){
    	errorLabel.text(Login.getString("ResultCode.code.ACCOUNT_INVALIDATIONED"));
    }else if (codeType == ResultCode.code.PASSWORD_INVALIDATIONED){
		//弹出密码更改界面
		window.location.href = commonvar.serviceUrl.changePwdPage;		
    }else if (codeType == "60021"){
    	errorLabel.text(Login.getString("60021"));
		
    }else  if (codeType == "60022"){
    	errorLabel.text(Login.getString("60022"));
		
    }else  if (codeType == "60029"){
    	errorLabel.text(Login.getString("60029"));
		
    }else  if (codeType == "60030"){
    	errorLabel.text(Login.getString("60030"));
		
    }else  if (codeType == "70019"){
    	errorLabel.text(Login.getString("70019"));
		
    }else  if (codeType == ResultCode.code.GET_DYNAMIC_CODE_SUCCESS){
	    window.location.reload(true);
		
    }else  if (codeType == ResultCode.code.GET_DYNAMIC_CODE_FAIL){
		window.location.reload(true);
	
    }else  if (codeType == ResultCode.code.RADIUS_SERVICE_EXCEPTION){
	    window.location.reload(true);
		
    }else  if (codeType == ResultCode.code.DYNAMIC_CODE_NULL){
		 window.location.reload(true);
	
    }else  if (codeType == "10000102"){
    	errorLabel.text(Login.getString("10000102"));
		
    }else  if (codeType == "10000103"){
    	window.location.href = commonvar.serviceUrl.changePwdPage;		
    }else  if (codeType == "10000104"){
    	errorLabel.text(Login.getString("10000104"));
		
    }else  if (codeType == "10000105"){
    	errorLabel.text(Login.getString("10000105"));
		
    }else  if (codeType == "10000106"){
    	errorLabel.text(Login.getString("10000106"));
		
    }else  if (codeType == "10000107"){
    	errorLabel.text(Login.getString("10000107"));
		
    }else  if (codeType == "10000108"){
    	errorLabel.text(Login.getString("ResultCode.code.USER_PASSWORD_INVALID"));
    	
    }else  if (codeType == "10000109"){
    	errorLabel.text(Login.getString("10000109"));
		
    }else {
		errorLabel.text(Login.getString("otherError"));
	}
	errorLabel.text(errorLabel.text() + " " + codeType);
	showErrorLabel(1);
}

//检查用户名是否为空
function checkName() {
	if (uname == "") {
			return false;
		}
	return true;	
}
//检查密码是否为空
function checkPass() {
	if (pass == "") {
		return false;
	}
	return true;
}
//检查域名是否为空
function checkDomain() {
    var domain =  $.trim($("#domainName").val());
    if (domain == "") {
        return false;
    }
    return true;
}
//检查验证码是否为空
function checkVCode() {
	var code =  $.trim($("#verfiyCode").val());
	if (code == "") {
		return false;
	}
	return true;
}


function checkParam()
{
    
	errorLabel.hide();
	if(!checkName())
	{
		errorLabel.text(Login.getString("userNameNotNull"));	
		showErrorLabel(1);
  		$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputerror.png");
		flag = false;
	}
	else if(!checkPass())
	{
		errorLabel.text(Login.getString("pwdNotNull"));
		showErrorLabel(1);
		$("#passImg").attr("src","/custom/resources/tyyd/web/default/img/inputerror.png");
		flag = false;
	}
	else 
	{
	   flag=true; 
	}
	return flag;
}


function getUrlParams() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (str, key, value) {
           params[key] = value;
    });
    return params;
}

function jump2home() {
    window.location.href = commonvar.serviceUrl.homepage;

}
function judgePlatform() {
    var params = getUrlParams();
    if (params.server_port) {
            _burl = 'https://' + params.server_port + '/custom/resources/tyyd/web/';
        } else {
            alert("Get server address failed!");
        }
}
/**item为1的话,直接显示，为0的话，则需要输入key，函数会读key对应的国际化内容**/
function showErrorLabel(item,text)
{
	
	if(item == 0)
	{
		errorLabel.text(Login.getString(text));
	}
	var height = errorLabel.height();
	height = 248+height-15;
	$("#loginframe").css("height",height+"px");

	errorLabel.fadeIn(1000);
}
