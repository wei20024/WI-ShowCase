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

//页面初始化
$(document).ready(function(){
	
	//启动日志
	consoleVisible=$.cookie("openlog");
	initLog();
	webuilog(loglevel.info,"test explicit page");
	commonvar.init();
	commonvar.setFirstLoginCookie();
	ServiceAPI.init();	
	commonvar.setBgImg();
	indexH=parseInt(Math.random()*(15)+1); 
	$("#normalHeadImg").attr("src","/uns/darkblue/img/headImg"+indexH+".jpg");	
	webuilog(loglevel.info,"start adjust location");
	checkUserIsLogin();
	hdpclient.init();
	commonvar.getConfigInfo(call_back);
	explicitSelfInit();
});

function keyDownFun()
{
	if(window.event.keyCode==123)
    {
    	return false;
    }
}

function call_back()
{
	if (webui.system.config.desktopLock == 1)
	{
		$("#onlinehelpimg").hide();
		 $(document).bind("contextmenu", function() { return false; });
		 document.onkeydown = keyDownFun;
	}
	if (webui.system.config.configFlag == "SystemNoConfig")
	{
		showErrorMsg(Login.getString("SystemNoConfig"));
	}
	
	if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system.config.runningMode)
	{
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
			
			var clientversion = clientVersion();
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
		//点击登录按钮事件		
		$("#loginBtn").click(function() {	
			doLogin();		    		   
		});
	}


function loginKey(event){
    if(event.keyCode == 13) {
        doLogin();
    }
}

function doLogin() {
	$("#loginBtn").unbind("click");
	var mac;
	
	//获取页面mac地址
	if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system.config.runningMode)
	{
		mac = getClientMac();
		if ('' == mac || "undefined" == typeof(mac))
		{
			showErrorMsg(Login.getString("macNotNull"));	
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
			var loginRsp=msg;
			 if (loginRsp.resultCode == ResultCode.code.OPERATE_SUCCESS) {
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
		if(error=="timeout")
		{
			showErrorMsg(Login.getString(error));
		}
		else
		{
			showErrorMsg(Login.getString(msg.status));
		}
       
	};
	ServiceAPI.ajaxPostJSON(params, commonvar.serviceUrl.userLogin, success_callback, error_callback);//ServiceAPI.serviceUrl.
	
    

}

//将错误码对应的描述，显示在错误提示栏中
function checkCode(codeType) {
	hiddenErrorMsg();
	if (codeType == "10002") {
		//R2风格保持提示与R2一致
		showErrorMsg(Login.getString("10000108"));
	} else if (codeType == ResultCode.code.PARAMETER_INVALID) {
		showErrorMsg(Login.getString("ResultCode.code.PARAMETER_INVALID"));
	} else if (codeType == "10004") {
		showErrorMsg(Login.getString("10004"));
	} else if (codeType == "10005") {
		showErrorMsg(Login.getString("10005"));
	} else if (codeType == "10006") {
		showErrorMsg(Login.getString("10006"));
	} else if (codeType == ResultCode.code.LOGIN_INVALID) {
	    if(firstLogin1 == 0)//尝试登录一次
        {
            doLogin();
            firstLogin1++;
        } else
        {
            firstLogin1 = 0;
            showErrorMsg(Login.getString("ResultCode.code.LOGIN_INVALID"));
        }
	} else if (codeType == "10010") {
		showErrorMsg(Login.getString("10010"));
	} else if (codeType == "10011") {	    
	    showErrorMsg(Login.getString("10011"));
	} else if (codeType == ResultCode.code.USER_NO_EXIST) {
        showErrorMsg(Login.getString("ResultCode.code.USER_NO_EXIST"));
    } else if (codeType == "10013") {
        showErrorMsg(Login.getString("10013"));
	} else if(codeType == "10031"){
    	showErrorMsg(Login.getString("10031"));
    } else if (codeType == "20001"){
    	showErrorMsg(Login.getString("20001"));
    } else if (codeType == "20002"){
    	showErrorMsg(Login.getString("20002"));
    }else if (codeType == ResultCode.code.USER_PASSWORD_INVALID){
    	showErrorMsg(Login.getString("10000108"));
    }else if (codeType == ResultCode.code.USER_LOCK){
    	showErrorMsg(Login.getString("ResultCode.code.USER_LOCK"));
    } else if (codeType == ResultCode.code.UNKNOW_REASON){
    	showErrorMsg(Login.getString("ResultCode.code.UNKNOW_REASON"));
    } else if (codeType == ResultCode.code.AD_UNREADY){
    	showErrorMsg(Login.getString("ResultCode.code.AD_UNREADY"));
    } else if (codeType == ResultCode.code.DOMAIN_UNEXIST){
    	showErrorMsg(Login.getString("ResultCode.code.DOMAIN_UNEXIST"));
    } else if (codeType == "20009"){
    	showErrorMsg(Login.getString("20009"));
    } else if (codeType == "20010"){
    	showErrorMsg(Login.getString("20010"));
    } else if (codeType == "20011"){
    	showErrorMsg(Login.getString("20011"));
    }else if (codeType == ResultCode.code.PASSWORD_WILL_INVALIDATION){
    	showErrorMsg(Login.getString("ResultCode.code.PASSWORD_WILL_INVALIDATION"));
		//弹出提示框，用户点击后弹出密码更改界面
		
    }else if (codeType == ResultCode.code.OTHER_USER_LOGINED){
    	showErrorMsg(Login.getString("ResultCode.code.OTHER_USER_LOGINED"));
		//弹出提示框，用户点击后弹出密码更改界面
		
    }else if (codeType == ResultCode.code.ACCOUNT_INVALIDATIONED){
    	showErrorMsg(Login.getString("ResultCode.code.ACCOUNT_INVALIDATIONED"));
    }else if (codeType == ResultCode.code.PASSWORD_INVALIDATIONED){
    	showErrorMsg(Login.getString("10000103"));
    }else if (codeType == "60021"){
    	showErrorMsg(Login.getString("60021"));
		
    }else  if (codeType == "60022"){
    	showErrorMsg(Login.getString("60022"));
		
    }else  if (codeType == "60029"){
    	showErrorMsg(Login.getString("60029"));
		
    }else  if (codeType == "60030"){
    	showErrorMsg(Login.getString("60030"));
		
    }else  if (codeType == "70019"){
    	showErrorMsg(Login.getString("70019"));
		
    }else  if (codeType == ResultCode.code.GET_DYNAMIC_CODE_SUCCESS){
	    window.location.reload(true);
		
    }else  if (codeType == ResultCode.code.GET_DYNAMIC_CODE_FAIL){
		window.location.reload(true);
	
    }else  if (codeType == ResultCode.code.RADIUS_SERVICE_EXCEPTION){
	    window.location.reload(true);
		
    }else  if (codeType == ResultCode.code.DYNAMIC_CODE_NULL){
		 window.location.reload(true);
	
    }else  if (codeType == "10000102"){
    	showErrorMsg(Login.getString("10000102"));
		
    }else  if (codeType == "10000103"){
    	showErrorMsg(Login.getString("10000103"));
		
    }else  if (codeType == "10000104"){
    	showErrorMsg(Login.getString("10000104"));
		
    }else  if (codeType == "10000105"){
    	showErrorMsg(Login.getString("10000105"));
		
    }else  if (codeType == "10000106"){
    	showErrorMsg(Login.getString("10000106"));
		
    }else  if (codeType == "10000107"){
    	showErrorMsg(Login.getString("10000107"));
		
    }else  if (codeType == "10000108"){
    	showErrorMsg(Login.getString("10000108"));
		
    }else  if (codeType == "10000109"){
    	showErrorMsg(Login.getString("10000109"));
		
    }else {
		showErrorMsg(Login.getString("otherError"));
	}
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
            _burl = 'https://' + params.server_port + '/uns/';
        } else {
            alert("Get server address failed!");
        }
}
