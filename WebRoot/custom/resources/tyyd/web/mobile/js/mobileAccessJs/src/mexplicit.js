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
var messageBox;
webui.objects.mexplicit = {};
var accessType = $.cookie("accessClientType");
var mac;
var selectDomainName;
var multiDomainFlag = false;
var dymanicCode = null;
var authType = $.cookie("authType");

//页面初始化
$(document).ready(function(){
	
	//初始化弹出框
	messageBox.begin();
	
	//重新调整页面高度，如果页面比较小
	webui.objects.mexplicit.ajust.begin();
	
	//初始化数据
	commonvar.init();
	
	//设置自动登录功能
	commonvar.setFirstLoginCookie();
	
	//初始化登录页面
	initLoginInfo();
	
	//检查用户是否已经登录过，如果登录就直接进入到虚拟机列表中
	checkUserIsLogin();
	
	//验证证书吊销列表状态
	commonvar.getConfigInfo(call_back);
	
});

//根据手机自动适应屏幕的对象webui.objects.dashbord.ajust
(function(){
	function begin()
	{
		//如果是iphone或者ipad就需要开启这个监听屏幕旋转的功能，动态修改页面的显示
		orientationListener();
	}
	
	//根据屏幕的分辨率大小重新设置页面高度以及虚拟机显示列表离屏幕的高度
	function ajustScreenSize()
	{
		var viewPortHeight = document.documentElement.clientHeight;
		if (viewPortHeight < 480)
		{
			$("body").css("height", "300px");
		}
	}
	
	//判断屏幕是否旋转,并且根据旋转对样式进行修改
	function orientationChange() 
	{ 
	   var screenwidth;
	   var screenheight;
	   if(screen.width < screen.height)
	   {
	   		screenwidth = screen.width;
	   		screenheight = screen.height;
	   }
	   else
	   {
	   		screenwidth = screen.height;
	   		screenheight = screen.width;
	   }
	   
		if(window.orientation == 0 || window.orientation == 180 || window.orientation == -90 || window.orientation == 90)
		{
			//重新设置高度
			ajustScreenSize();
		}
	   
	    //如果是iphone或者ipad就需要开启这个监听屏幕旋转的功能，动态修改页面的显示
		if (accessType == "iPhone" || accessType == "iPad" || accessType == "iPod" || accessType == "ios")
		{
			 switch(window.orientation) 
			 {
			   case 0: 
			 		$("body").css({"height":screenheight,"width":screenwidth});
			 		break; 
				case 180: 
					$("body").css({"height":screenheight,"width":screenwidth});
					break;
				case -90: 
			 		$("body").css({"height":screenwidth,"width":screenheight});
					 break; 
				case 90: 
			 		$("body").css({"height":screenwidth,"width":screenheight});
			 		break; 
			 };
		}
	} 
	
	//iphone或者ipad监听旋转
	function orientationListener()
	{
		// 添加监听 屏幕旋转的事件
		addEventListener('load', function(){ 
		 	orientationChange(); 
		 	window.onorientationchange = orientationChange; 
		});
	}
	
	webui.objects.mexplicit.ajust = 
	{
		begin:begin,
		orientationListener:orientationListener
	};
	
})();


function keyDownFun()
{
	if(window.event.keyCode==123)
    {
    	return false;
    }
}


//如果开启了双向认证，先进行双向认证，失败就跳转到logout界面，成功才进入登录页面
function wiMutualAuth()
{
	$.ajax({
        url:commonvar.serviceUrl.doMutualAuth,
        dataType:"json",
        type:"POST",
        cache:false,
        success:function(data){		
          switch (data.isRevoked)
          {
              case -1:
            	  document.location.href = window.location.protocol+"//"+window.location.host + "/pages/logout.do?resultCode=nocertificate";
                  break;
              case -2:
            	  document.location.href = window.location.protocol+"//"+window.location.host + "/pages/logout.do?resultCode=crlformaterror";
                  break;
              case 1:
                  document.location.href = window.location.protocol+"//"+window.location.host + "/pages/logout.do?resultCode=revoked";
                  break;
              case 2:
            	  document.location.href = window.location.protocol+"//"+window.location.host + "/pages/logout.do?resultCode=crlformaterror";
                  break;
              case 3:
            	  document.location.href = window.location.protocol+"//"+window.location.host + "/pages/logout.do?resultCode=getcrlinfofailed";
                  break;
              case 0:
                  return;
              default:
                  return;
          }      	
        return;
        },
		error:function(){

			}
    });
	
}

function call_back()
{
	if (webui.system.config['dynamicPassword.2FactorAuth'] == '1')
	{
		authType = 6;
		//支持动态口令功能，需要获取配置参数后进行初始化
		webui.objects.mexplicit.dynamicCode.begin();
	}
	
	//支持双向认证
	if (webui.system.config.explicitcercrl == true)
	{
		wiMutualAuth();
	}
	
	//多域支持
	if ("" != webui.system.config.multidomainconfig)
	{
		//不为空说明取到后台配置值，如果为空没有取到默认是单域模式不显示多域框
		var domains = commonvar.getDomainInfo(webui.system.config.multidomainconfig);
		
		if (domains.length > 1)
		{
			multiDomainFlag = true;
			
			//设置多域样式
			var node = document.createElement('link');
			node.rel = 'stylesheet';
			node.href = '/custom/resources/tyyd/web/mobile/css/mexplicitMulti.css';
			document.getElementById('multiDomainCss').appendChild(node);
			
			var selectedDomain = $.cookie("selectedDomain");
			var flag = false;
			
			//设置select标签选项值
			for (var i = 0; i < domains.length; i++)
			{
				$('#seslectItem').append('<option value=' + domains[i] + '">' + domains[i] + '</option>');
				
				//有一种场景：cookie已经有值，但是重新配置多域后没有这个值了
				if (null != selectedDomain && selectedDomain == domains[i])
				{
					flag = true;
				}
			}
			
			if (flag)
			{
				var selectObject = document.getElementById("seslectItem");
				setDefaultSelect(selectObject, selectedDomain);
			}
			
			//显示多域
			$('#domainSelect').show();
		}
		else
		{
			selectDomainName = domains[0];
			$('#seslectItem').append('<option value=' + domains[0] + '>' + domains[0] + '</option>');
		}
	}
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
	              var sessionName = date.username;
	              var cookieName = $.cookie("userName");
	              
	              if (sessionName == cookieName)
	              {
	            	  jump2home();
	              }
	              else 
	              {
	            	  initLoginInfo();
	              }
		      }
            },
			error:function(){
				initLoginInfo();

			}
        });
}

/**
 * 初始化登录页面
 **/
function initLoginInfo()
{
	    //初始化页面国际化
		$("#checkboxText").text(Login.getString("checkboxText"));
		$("#loginBtn").text(Login.getString("loginBtn"));
		$("#loadingTxet").text(Login.getString("loading"));
		
		//隐藏loading图片
		$("#loadingDiv").hide();
		
		//如果是ios需要重新调整样式
		if (accessType == "iPhone" || accessType == "iPad" || accessType == "iPod" || accessType == "ios")
		{
			$(".userName").css({"left":"8px"});
			$(".userPass").css({"left":"8px"});
			$(".controlgroup").css({"left":"8px", "width":"315px"});
			$(".buttonStyle").css({"left":"8px", "width":"315px"});
			$(".domainSelect").css({"left":"8px", "width":"315px", "top":"132px"});
		}
		
		//控制勾选框显示
		//控制勾选框显示
		var checkboxvalue = $.cookie("rememberLogin");
		
		if (null == checkboxvalue || checkboxvalue == "undefined")
		{
			$("#remberBox").attr("checked",false);
			
			//控制样式取消状态显示
			$(".onoffswitch-switch").css({"left":"0"});
			$(".onoffswitch-inner").css({"margin-left":"0"});
		}
		else if (0 == checkboxvalue)
		{
			$("#remberBox").attr("checked",false);
			
			//控制样式取消状态显示
			$(".onoffswitch-switch").css({"left":"0"});
			$(".onoffswitch-inner").css({"margin-left":"0"});
		}
		else
		{
			$("#remberBox").attr("checked",true);
			
			//控制样式选中状态显示
			$(".onoffswitch-switch").css({"left":"32px"});
			$(".onoffswitch-inner").css({"margin-left":"-50px"});
		}

		//根据cookie是否有保存的用户信息而显示登陆页面
		var userName=$("#userName").val();
		
		if(userName=="" || userName==null)
		{
			$("#userName").val(Login.getString("userNameTip"));
			$("#userPass").val(Login.getString("userPassTip"));
			$("#userPass").focus(function(){
								if(document.getElementById('userPass').value == Login.getString('userPassTip') || document.getElementById('userPass').value == "")
								{
									$("#userPass").val("");
								}
						});		
		}
		else
		{
			document.getElementById('userPass').focus();
			$("#userPass").focus(function(){
								if(document.getElementById('userPass').value == Login.getString('userPassTip') || document.getElementById('userPass').value == "")
								{
									$("#userPass").val("");
								}
						});	
		}
						
		//点击登录按钮事件		
		$("#loginBtn").click(function() {	
			doLogin();		    		   
		});
		
		//点击记住密码勾选框
		$("#remberBox").click(function(){
			var checkboxvalue = $.cookie("rememberLogin");
			
			if (null == checkboxvalue || checkboxvalue == "undefined")
			{
				$.cookie("rememberLogin", 1, {expires:365,path:'/'});
				
				//控制样式选中状态
				$(".onoffswitch-switch").css({"left":"32px"});
				$(".onoffswitch-inner").css({"margin-left":"-50px"});
			}
			else if (0 == checkboxvalue)
			{
				$.cookie("rememberLogin", 1, {expires:365,path:'/'});
				
				//控制样式选中状态
				$(".onoffswitch-switch").css({"left":"32px"});
				$(".onoffswitch-inner").css({"margin-left":"-50px"});
			}
			else
			{
				$.cookie("rememberLogin", 0, {expires:365,path:'/'});
				
				//控制样式取消状态
				$(".onoffswitch-switch").css({"left":"0"});
				$(".onoffswitch-inner").css({"margin-left":"0"});
			}
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

//移动客户端调用的方法：：用来自动登录
function autodologin(username, password, macs)
{
	if (authType == 6)
	{
		$("#userName").val(username);
		$("#userPass").val(password);
		return;
	}
	
	if (username != null || username != "")
	{
		$("#userName").val(username);
		$("#userPass").val(password);
		mac = macs;
		doLogin();
	}
}

function doLogin() 
{
	$("#loginBtn").unbind("click");
	
	//显示loading图片
	$("#loadingDiv").show();
	
	uname =$.trim($("#userName").val());
    pass = $("#userPass").val();
    
    if(uname == Login.getString("userNameTip"))
    {
    	uname="";
    }
	
    if(pass == Login.getString("userPassTip"))
    {
    	pass="";
    }
    
    //得到域值，如果selectDomainName为空说明是多域
    if (selectDomainName != null)
    {
    	domainInput = selectDomainName;
    }
    else
    {
    	selectDomainName = $("#seslectItem").find("option:selected").text();
    	domainInput = selectDomainName;
    }
    
	if(!checkParam())
    {
    	$("#loginBtn").bind("click",doLogin);
    	$("#loadingDiv").hide();
        return false;
    }
	
	//如果为6说明开启了动态口令功能
	if (authType == 6)
	{
		//处理动态口令逻辑
		if (!checkVCode())
		{
	    	$("#loginBtn").bind("click",doLogin);
	    	$("#loadingDiv").hide();
			return;
		}
		
		dymanicCode = $.trim($("#dymanicPassword").val());
	}
	
	//获取页面mac地址
	if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system.config.runningMode)
	{
		mac = hdpclient.getClientMac();
		if (null == mac || '' == mac || "undefined" == typeof(mac))
		{
			messageBox.show(Login.getString("macNotNull"));
			$("#loginBtn").bind("click",doLogin);
			$("#loadingDiv").hide();
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
        domain:domainInput,
        macAddress: mac,
        dymanicCode: dymanicCode
		};
	var params = JSON.stringify(obj);
	var success_callback = function(msg){
		$("#loginBtn").bind("click",doLogin);            

			var loginRsp=msg;
			 if (loginRsp.resultCode == ResultCode.code.OPERATE_SUCCESS) {
			   		clientTicket = loginRsp.loginState;
					commonvar.setCookieByProtocol("userName",uname);
			   		jump2home();
			   } else {
			   	$("#userPass").val("");	
				commonvar.setCookieByProtocol("userName",uname);
				
		   		//设置默认域
				commonvar.setCookieByProtocol("selectedDomain",domainInput);
                checkCode(loginRsp.resultCode);            
            }
			 
			//隐藏loading图片
			$("#loadingDiv").hide();
	};
	var error_callback=function(msg,error){
		$("#loginBtn").bind("click",doLogin);
		$("#userPass").val("");
		
		if(error=="timeout")
		{
			messageBox.show(Login.getString("timeout"));
		}
		else
		{
			messageBox.show(msg.status);
		}
		$("#loadingDiv").hide();
	};
	ServiceAPI.ajaxPostJSON(params, commonvar.serviceUrl.userLogin, success_callback, error_callback);
}


(function(){
	var g_callback = null;
	
	// 显示对话框，titile为标题，text为内容，buttons为所需要的按钮，格式为一个字符串用<>将所需的按钮名字包含，如<Ok><Canncel><Ignore>
	// callback为外部回调，格式为callback(result)，result为用户点击按钮的名字，点击x固定返回<Canncel>
	function show(text, buttons, callback)
	{
		$("#messageBox").find("#globalConfirmTipText").text(text);
		$("#messageBox").find(".globalDialogOkLink").text(Login.getString("confirm"));
		$("#messageBox").show();
	}
	
	function hide(result)
	{
		$("#messageBox").hide();
	}
	
	function begin()
	{
		$(".globalDialogOkLink").bind("click",hide);
		messageBox.hide();
	}
	
	messageBox = 
	{
		begin: begin,
		show: show,
		hide:hide
	};
})();

//将错误码对应的描述，显示在错误提示栏中
function checkCode(codeType) {
	$("#loadingDiv").hide();

	if (codeType == "10002") {
		messageBox.show(Login.getString("10002"));
	} else if (codeType == ResultCode.code.PARAMETER_INVALID) {
		messageBox.show(Login.getString("ResultCode.code.PARAMETER_INVALID"));
	} else if (codeType == "10004") {
		messageBox.show(Login.getString("10004"));
	} else if (codeType == "10005") {
		messageBox.show(Login.getString("10005"));
	} else if (codeType == "10006") {
		messageBox.show(Login.getString("10006"));
	} else if (codeType == ResultCode.code.LOGIN_INVALID) {
	    if(firstLogin1 == 0)//尝试登录一次
        {
            doLogin();
            firstLogin1++;
        } else
        {
            firstLogin1 = 0;
            messageBox.show(Login.getString("ResultCode.code.LOGIN_INVALID"));
        }
	} else if (codeType == "10010") {
		messageBox.show(Login.getString("10010"));
	} else if (codeType == "10011") {	    
		messageBox.show(Login.getString("10011"));
	} else if (codeType == ResultCode.code.USER_NO_EXIST) {
		messageBox.show(Login.getString("ResultCode.code.USER_NO_EXIST"));
    } else if (codeType == "10013") {
    	messageBox.show(Login.getString("10013"));
	} else if(codeType == "10031"){
		messageBox.show(Login.getString("10031"));
    } else if (codeType == "20001"){
    	messageBox.show(Login.getString("20001"));
    } else if (codeType == "20002"){
    	messageBox.show(Login.getString("20002"));
    }else if (codeType == ResultCode.code.USER_PASSWORD_INVALID){
    	messageBox.show(Login.getString("ResultCode.code.USER_PASSWORD_INVALID"));
    }else if (codeType == ResultCode.code.USER_LOCK){
    	messageBox.show(Login.getString("ResultCode.code.USER_LOCK"));
    } else if (codeType == ResultCode.code.UNKNOW_REASON){
    	messageBox.show(Login.getString("ResultCode.code.UNKNOW_REASON"));
    } else if (codeType == ResultCode.code.AD_UNREADY){
    	messageBox.show(Login.getString("ResultCode.code.AD_UNREADY"));
    } else if (codeType == ResultCode.code.DOMAIN_UNEXIST){
    	messageBox.show(Login.getString("ResultCode.code.DOMAIN_UNEXIST"));
    } else if (codeType == "20009"){
    	messageBox.show(Login.getString("20009"));
    } else if (codeType == "20010"){
    	messageBox.show(Login.getString("20010"));
    } else if (codeType == "20011"){
    	messageBox.show(Login.getString("20011"));
    }else if (codeType == ResultCode.code.PASSWORD_WILL_INVALIDATION){
    	messageBox.show(Login.getString("ResultCode.code.PASSWORD_WILL_INVALIDATION"));
		//弹出提示框，用户点击后弹出密码更改界面
		
    }else if (codeType == ResultCode.code.OTHER_USER_LOGINED){
    	messageBox.show(Login.getString("ResultCode.code.OTHER_USER_LOGINED"));
		//弹出提示框，用户点击后弹出密码更改界面
		
    }else if (codeType == ResultCode.code.ACCOUNT_INVALIDATIONED){
    	messageBox.show(Login.getString("ResultCode.code.ACCOUNT_INVALIDATIONED"));
    }else if (codeType == ResultCode.code.PASSWORD_INVALIDATIONED){
		//弹出密码更改界面
		window.location.href = "../pages/changepassword.html";		
    }else if (codeType == "60021"){
    	messageBox.show(Login.getString("60021"));
		
    }else  if (codeType == "60022"){
    	messageBox.show(Login.getString("60022"));
		
    }else  if (codeType == "60029"){
    	messageBox.show(Login.getString("60029"));
		
    }else  if (codeType == "60030"){
    	messageBox.show(Login.getString("60030"));
		
    }else  if (codeType == "70019"){
    	messageBox.show(Login.getString("70019"));
		
    }else  if (codeType == ResultCode.code.GET_DYNAMIC_CODE_SUCCESS){
	    window.location.reload(true);
		
    }else  if (codeType == ResultCode.code.GET_DYNAMIC_CODE_FAIL){
		window.location.reload(true);
	
    }else  if (codeType == ResultCode.code.RADIUS_SERVICE_EXCEPTION){
	    window.location.reload(true);
		
    }else  if (codeType == ResultCode.code.DYNAMIC_CODE_NULL){
		 window.location.reload(true);
	
    }else {
    	messageBox.show(Login.getString("otherError"));
	}
	messageBox.show(errorLabel.text() + " " + codeType);
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
function checkVCode() 
{
	var code =  $.trim($("#dymanicPassword").val());
	if (code == "") 
	{
		messageBox.show(Login.getString("dymanicCodeNotNull"));	
		return false;
	}
	return true;
}


function checkParam()
{
	if(!checkName())
	{
		messageBox.show(Login.getString("userNameNotNull"));	
		flag = false;
	}
	else if(!checkPass())
	{
		messageBox.show(Login.getString("pwdNotNull"));	
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
    
    window.location.href = commonvar.serviceUrl.mobileHomePage;
   
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

//定义移动客户端支持动态口令结构webui.objects.mexplicit.dynamicCode
(function(){
	
	totalTime = 60;
	var inter;
	//实现倒数功能
	function countTime()
	{
	    uname =$.trim($("#userName").val());
	    pass = $("#userPass").val();
	    
	    if(uname == Login.getString("userNameTip"))
	    {
	    	uname="";
	    }
		
	    if(pass == Login.getString("userPassTip"))
	    {
	    	pass="";
	    }
		
		if (!checkParam())
		{
			return;
		}

		$(".mesgButton").css({"background-color":"#9C9C9C"});
		$("#mesgButton").unbind("click");
		
		//发起获取动态码请求
		getDymanicCode();
		
		inter = setInterval(deleaseNum,1000);
	};
	
	function deleaseNum()
	{
		if(totalTime==0)
		{
			$(".mesgButton").css({"background-color":"#4A96E2"});
			$("#mesgButton").bind("click",countTime);
			$("#mesgButton").text("获取验证码");
			clearInterval(inter);
			totalTime = 60;
		}
	    else 
	    {
	    	totalTime = totalTime-1;
	    	$("#mesgButton").text(totalTime);
	     }
	};
	
	//获取动态口令请求
	function getDymanicCode()
	{
	    uname =$.trim($("#userName").val());
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
	    	 $("#mesgButton").bind("click",countTime);
	         return false;
	    }
		
		var mac = null;
		var contextName = [];
		var obj = {
			username: uname,
	        password: pass,
	        macAddress: mac,
	        dymanicCode: null
			};
		
		var params = JSON.stringify(obj);

		 $.ajax({
		        url : commonvar.serviceUrl.userLogin + "?" + Math.random(), // 加随机数防止缓存
		        type : "POST",
		        headers: {"cache-control": "no-cache"},	
		        dataType : "json",
		        contentType :"application/json",
		        timeout: 300000,
		        data : params,
		        success:function(msg)
		        {
		        	$("#mesgButton").bind("click",countTime);            
					var loginRsp=msg;

				   	$("#dymanicPassword").val("");
					commonvar.setCookieByProtocol("userName",uname);
		        },
				error:function(msg,error)
				{
					$("#getDymanicCode").bind("click",countTime);
					if(error=="timeout")
					{
						messageBox.show(Login.getString(error));
					}
					else
					{
						messageBox.show(Login.getString(msg.resultCode));
					}
				}
		 });
	}

	//动态口令
	function ajustDisplay()
	{
		$("#dymanicPassword").hide();
		$("#dymanicSpan").show();
		$("#dymanicSpan").val(Login.getString("dynamicTip"));
		$("#mesgButton").text(Login.getString("getCode"));
		
		//判断是否开启短消息认证
		if (1 == webui.system.config['dynamicPassword.SMSOTPAuth'])
		{
			//短消息页面显示样式
			$(".dymanicPassword").css({"width": "180px"});
			$(".mesgButtonLink").show();
			
			//页面显示样式
			$(".buttonStyle").css({"top":"190px"});
			$(".loginContainer").css({"height":"260px"});
			
			//如果是ios需要重新调整样式
			if (accessType == "iPhone" || accessType == "iPad" || accessType == "iPod" || accessType == "ios")
			{
				$(".dymanicPassword").css({"left":"8px"});
				$(".mesgButtonLink").css({"left": "220px"});
			}
			
			//绑定动态密码倒数功能
			$("#mesgButton").click(function(){
				countTime();
			});
		}
		else
		{
			//动态口令页面显示样式
			$(".mesgButtonLink").hide();
			$(".buttonStyle").css({"top":"190px"});
			$(".loginContainer").css({"height":"260px"});
			
			//如果是ios需要重新调整样式
			if (accessType == "iPhone" || accessType == "iPad" || accessType == "iPod" || accessType == "ios")
			{
				$(".dymanicPassword").css({"left":"8px"});
			}
		}
	}
	
	// 初始化函数
	function begin()
	{
		//如果为6说明开启了动态口令功能
		if (authType != 6)
		{
			return;
		}
		
		//调整页面样式支持动态口令
		ajustDisplay();
	};
	
	webui.objects.mexplicit.dynamicCode =
	{
		begin:begin	
	};
	
})();

//处理页面显示中文和密码的效果
function changPassType(id)
{
	$("#dymanicPassword").show();
	$("#dymanicSpan").hide();
	$("#dymanicPassword").focus();
}


