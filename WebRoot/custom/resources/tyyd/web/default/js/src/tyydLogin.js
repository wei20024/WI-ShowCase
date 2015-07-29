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
var multiDomainFlag=false;

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
	
	//国际化每日提醒图片
	commonvar.setAdvicePng();
	
	//变更头像图片
	commonvar.setHeadImage();
	
	$("#getDymanicCode").attr("title",Login.getString("messageTip"));
	webuilog(loglevel.info,"start adjust location");
	//调整位置
	var adTop=commonvar.clientH*0.4+135 <= commonvar.clientH-250 ? commonvar.clientH-250 : commonvar.clientH*0.4+135;
	
	loginPanel.css({position: "absolute",'top':commonvar.clientH*0.4-125,'left':commonvar.clientW*0.5-250}); 
	adPanle.css({position: "absolute",'top':adTop,'left':commonvar.clientW*0.5-235});
	
	var ll=commonvar.clientW*0.5-250; 
	webuilog(loglevel.info,"clientW="+commonvar.clientW+";loginpanel left="+ll);
	  
	checkUserIsLogin();
	
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
	
	//获取login.properties中的是否开启短消息认证中的值
	hdpclient.init();
	commonvar.getConfigInfo(call_back);
	
	commonMethods.changepwd.begin();

});

function call_back()
{
	//如果不开启短消息认证,则不显示获取动态口令图标
	if (0 == webui.system.config['dynamicPassword.SMSOTPAuth'])
	{
		$("#getDymanicCode").hide();
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
			node.href = '/custom/resources/tyyd/web/default/css/dynamicCodeMultidomain.css';
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
				 //必须要设置值
				var selectObject = document.getElementById("seslectItem");
				setDefaultSelect(selectObject, selectedDomain);
			}
			
			//显示多域
			$('#domainSelect').show();
		}
		else
		{
			$('#seslectItem').append('<option value=' + domains[0] + '>' + domains[0] + '</option>');
		}
	}
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
						
		//点击获取动态口令按钮事件		
		$("#getDymanicCode").click(function() {	
			getDymanicCode();
		});
		//点击登录按钮事件
		$("#loginBtn").css({"background-image":Login.getString("loginbtn")}).click(function() {	
			doLogin();
		});			
		//点击登录按钮事件
		$("#resetPwdBtn").click(function() {	
			resetPwd_sendCode();
		});			
		//点击登录按钮事件
		$("#resetPwdBtn1").click(function() {	
			resetPwd_reset();
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

function changeType(id)
{
	$("#userPass").hide();
	$("#userPassSpan").html("<input  autocomplete=\"off\"  type=\"password\" id=\"userPass\" name=\"userPass\" onpaste=\"return false;\" oncopy=\"return false;\" onblur=\"setEmptyValue('userPass','userPassTip',1);\" onfocus=\"setEmptyValue('userPass','userPassTip',0);\" onKeyPress=\"loginKey(event);\" tabindex=\"101\"/>");
	
	setTimeout('$("#userPass").focus();',500);
}

function changPassType(id)
{
	$("#dymanicPassword").hide();
	$("#dymaniCodeSpan").html("<input  autocomplete=\"off\"  type=\"password\" id=\"dymanicPassword\" name=\"dymanicPassword\" onpaste=\"return false;\" oncopy=\"return false;\" onblur=\"setEmptyValue('dymanicPassword','dynamicTip',1);\" onfocus=\"setEmptyValue('dymanicPassword','dynamicTip',0);\" onKeyPress=\"loginKey(event);\" tabindex=\"102\"/>");
	
	setTimeout('$("#dymanicPassword").focus();',500);
}

function doLogin() {
	$("#loginBtn").unbind("click");
	errorLabel.hide();
	$("#passImgTip").hide();
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
    
    domainInput = null;
    
    //得到域值
    if (multiDomainFlag == true)
    {
    	domainInput = $("#seslectItem").find("option:selected").text();
    }
    else 
    {
    	domainInput = $("#seslectItem ").get(0).value;
    }

	if(!checkParam())
    {
    	 $("#loginBtn").bind("click",doLogin);
		 $("#loadingpanel").css({"z-index":"0"}).hide();//显示缓冲图片	
        return false;
    }
    
	var code = $("#dymanicPassword").val();
    
	if ("" == code || Login.getString("dynamicTip") == code)
	{
		code = null;
		errorLabel.text(Login.getString("dymanicCodeNotNull"));
		errorLabel.fadeIn(1000);
		$("#dymanicPassImg").attr("src","/custom/resources/tyyd/web/default/img/inputerror.png");
		$("#loginBtn").bind("click",doLogin);
		 $("#loadingpanel").css({"z-index":"0"}).hide();//显示缓冲图片	
		return false;
	}

	var mac;
	//获取页面mac地址
	if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system.config.runningMode)
	{
		mac = hdpclient.getClientMac();
		if (null == mac || '' == mac || "undefined" == typeof(mac))
		{
			errorLabel.text(Login.getString("macNotNull"));	
			errorLabel.fadeIn(1000);
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
        macAddress: mac,
        domain: domainInput,
        dymanicCode: code,
        extendData:hdpclient.clientIp()
		};

	var params = JSON.stringify(obj);
	var success_callback = function(msg){
		$("#loginBtn").bind("click",doLogin);            
            //如果用户登录成功，且输入用户名、密码错误次数小于3时，页面进行跳转，否则显示验证码输入框进行验证
            $("#loadingpanel").css({"z-index":"0"}).hide();
			var loginRsp=msg;
			 if (loginRsp.resultCode == 0) {		  
			   		clientTicket = loginRsp.loginState;
					commonvar.setCookieByProtocol("userName",uname);
					commonvar.setCookieByProtocol("selectedDomain",domainInput);
            		jump2home();
			   } else {
				if(ResultCode.code.RADIUS_SERVICE_EXCEPTION!=loginRsp.resultCode && ResultCode.code.CHECK_DYNAMIC_CODE_FAIL!=loginRsp.resultCode)
				{
					$("#userPass").val("");	
				}

			   	$("#dymanicPassword").val("");
				commonvar.setCookieByProtocol("userName",uname);
				
				if(showTyydMsg(loginRsp))
				{
					return ;
				}
					
                checkCode(loginRsp.resultCode);            
            }
	};
	var error_callback=function(msg,error){
		$("#loadingpanel").css({"z-index":"0"}).hide();
		$("#loginBtn").bind("click",doLogin);
		$("#userPass").val("");
		$("#dymanicPassword").val("");
		errorLabel.hide();
		if(error=="timeout")
		{
			 errorLabel.text(Login.getString(error)).fadeIn(1000);
		}
		else
		{
			 errorLabel.text(Login.getString(msg.status)).fadeIn(1000);
		}
       
	};
	ServiceAPI.ajaxPostJSON(params, commonvar.serviceUrl.userLogin, success_callback, error_callback);
}

function getDymanicCode()
{
	$("#getDymanicCode").unbind("click");
	errorLabel.hide();
	$("#passImgTip").hide();
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
    	 $("#getDymanicCode").bind("click",getDymanicCode);
		 $("#loadingpanel").css({"z-index":"0"}).hide();//显示缓冲图片	
         return false;
    }
	
	var mac;
	//获取页面mac地址
	if ('NoLdapServer' == webui.system.config.runningMode || 'NOLDAPSERVER' == webui.system.config.runningMode)
	{
		mac = hdpclient.getClientMac();
		if (null == mac || '' == mac || "undefined" == typeof(mac))
		{
			errorLabel.text(Login.getString("macNotNull"));	
			errorLabel.fadeIn(1000);
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
        macAddress: mac,
        dymanicCode: null,
        extendData:hdpclient.clientIp()        
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
	        	$("#getDymanicCode").bind("click",getDymanicCode);            
	            $("#loadingpanel").css({"z-index":"0"}).hide();
				var loginRsp=msg;

			   	$("#dymanicPassword").val("");
				commonvar.setCookieByProtocol("userName",uname);
				
				if(loginRsp.resultCode == 0)
					{
						jump2home();
						return ;
					}
				
				if(showTyydMsg(loginRsp))
				{
					return ;
				}	
                checkCode(loginRsp.resultCode); 
	        },
			error:function(msg,error)
			{
				$("#loadingpanel").css({"z-index":"0"}).hide();
				$("#getDymanicCode").bind("click",getDymanicCode);
				errorLabel.hide();
				if(error=="timeout")
				{
					 errorLabel.text(Login.getString(error)).fadeIn(1000);
				}
				else
				{
					 errorLabel.text(Login.getString(msg.resultCode)).fadeIn(1000);
				}
			}
	 });
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
    }
    else if (codeType == ResultCode.code.GET_DYNAMIC_CODE_SUCCESS){
    	//获取动态口令成功
		errorLabel.text("");
		$("#passImgTip").show();
		$("#tiptext").text(Login.getString("ResultCode.code.GET_DYNAMIC_CODE_SUCCESS"));
	}
    else if (codeType == ResultCode.code.GET_DYNAMIC_CODE_FAIL){
    	//获取动态失败
		errorLabel.text(Login.getString("ResultCode.code.GET_DYNAMIC_CODE_FAIL"));
	}
    else if (codeType == ResultCode.code.RADIUS_SERVICE_EXCEPTION){
    	//radius服务器异常
    	errorLabel.text(Login.getString("ResultCode.code.RADIUS_SERVICE_EXCEPTION"));
	}
    else if (codeType == ResultCode.code.CHECK_DYNAMIC_CODE_FAIL){
    	//验证动态口令失败
    	errorLabel.text(Login.getString("ResultCode.code.CHECK_DYNAMIC_CODE_FAIL"));
	}
	else if (codeType == ResultCode.code.PASSWORD_INVALIDATIONED){
		//弹出密码更改界面
		window.location.href = commonvar.serviceUrl.changePwdPage;
		
    }else if (codeType == "60021"){
    	errorLabel.text(Login.getString("60021"));		
    
	}
    else  if (codeType == "60022"){
    	errorLabel.text(Login.getString("60022"));
    }else  if (codeType == "60029"){
    	errorLabel.text(Login.getString("60029"));
		
    }else  if (codeType == "60030"){
    	errorLabel.text(Login.getString("60030"));
		
    }else  if (codeType == "70019"){
    	errorLabel.text(Login.getString("70019"));	
    }else {
		errorLabel.text(Login.getString("otherError"));
	}
	errorLabel.fadeIn(1000);
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
		errorLabel.fadeIn(1000);	
  		$("#uNameImg").attr("src","/custom/resources/tyyd/web/default/img/inputerror.png");
		flag = false;
	}
	else if(!checkPass())
	{
		errorLabel.text(Login.getString("pwdNotNull"));
		errorLabel.fadeIn(1000);
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

function resetPwd_sendCode() {
	$("#resetPwdBtn").unbind("click");
	errorLabel.hide();
	$("#loadingpanel").css({
		"z-index" : "10"
	}).show();

	var userName = "";
	if (editshow == false) {
		userName = $.trim($("#userNameLb").text());
	} else {
		userName = $.trim($("#userName").val());
	}

    if(userName == Login.getString("userNameTip"))
    {
    	userName="";
    }
	if (userName == "") {
		errorLabel.text(Login.getString("userNameNotNull"));
		errorLabel.fadeIn(1000);
		$("#uNameImg").attr("src", "/custom/resources/tyyd/web/default/img/inputerror.png");
		$("#resetPwdBtn").bind("click", resetPwd_sendCode);
		$("#loadingpanel").css({
			"z-index" : "0"
		}).hide();// 显示缓冲图片
		return false;
	}

	var contextName = [];
	var obj = {		
		functionType:"resetPwd",
		extendList:["{changeType}:1","{userName}:"+userName,"{clientIp}:"+hdpclient.clientIp()]
	};

	var params = JSON.stringify(obj);

	$.ajax({
		url : "/services/desktop/extendFunction" + "?" + Math.random(), // 加随机数防止缓存
		type : "POST",
		headers : {
			"cache-control" : "no-cache"
		},
		dataType : "json",
		contentType : "application/json",
		timeout : 300000,
		data : params,
		success : function(msg) {
			$("#resetPwdBtn").bind("click", resetPwd_sendCode);
			$("#loadingpanel").css({
				"z-index" : "0"
			}).hide();
			var loginRsp = msg;
			if(msg.resultCode==0)
 			{
				$("#resetPwdLog").show();
			}else
			{
				if(showTyydMsg(loginRsp))
				{
					return ;
				}
			}
		},
		error : function(msg, error) {
			$("#loadingpanel").css({
				"z-index" : "0"
			}).hide();
			$("#resetPwdBtn").bind("click", resetPwd_sendCode);
			errorLabel.hide();
			if (error == "timeout") {
				errorLabel.text(Login.getString(error)).fadeIn(1000);
			} else {
				errorLabel.text(Login.getString(msg.resultCode)).fadeIn(1000);
			}

		}
	});
}

function resetPwd_reset() {
	$("#resetPwdBtn1").unbind("click");
	errorLabel.hide();
	$("#loadingpanel").css({
		"z-index" : "10"
	}).show();

	var userName = "";
	if (editshow == false) {
		userName = $.trim($("#userNameLb").text());
	} else {
		userName = $.trim($("#userName").val());
	}
	
    if(userName == Login.getString("userNameTip"))
    {
    	userName="";
    }
	
	var code = $.trim($("#dinamicinput").val());

	if (userName == "" || code=="" ) {
		errorLabel.text(Login.getString("10004"));
		errorLabel.fadeIn(1000);
		$("#uNameImg").attr("src", "/custom/resources/tyyd/web/default/img/inputerror.png");
		$("#resetPwdBtn1").bind("click", resetPwd_reset);
		$("#loadingpanel").css({
			"z-index" : "0"
		}).hide();// 显示缓冲图片
		return false;
	}

	var contextName = [];
	var obj = {		
		functionType:"resetPwd",
		extendList:["{changeType}:0","{userName}:"+userName,"{clientIp}:"+hdpclient.clientIp(),"{dymanicCode}:"+code]
	};

	var params = JSON.stringify(obj);

	$.ajax({
		url : "/services/desktop/extendFunction" + "?" + Math.random(), // 加随机数防止缓存
		type : "POST",
		headers : {
			"cache-control" : "no-cache"
		},
		dataType : "json",
		contentType : "application/json",
		timeout : 300000,
		data : params,
		success : function(msg) {
			$("#resetPwdBtn1").bind("click", resetPwd_reset);
			$("#loadingpanel").css({
				"z-index" : "0"
			}).hide();
			var loginRsp = msg;
			$("#resetPwdLog").hide();
			$("#dinamicinput").val("");
			if(msg.resultCode==0)
 			{
				errorLabel.text(Login.getString("resetPwdSuccess")).fadeIn(1000);
			}else{				
				if(showTyydMsg(loginRsp))
				{
					return ;
				}		
			}
		},
		error : function(msg, error) {
			$("#loadingpanel").css({
				"z-index" : "0"
			}).hide();
			$("#resetPwdBtn1").bind("click", resetPwd_reset);
			errorLabel.hide();
			if (error == "timeout") {
				errorLabel.text(Login.getString(error)).fadeIn(1000);
			} else {
				errorLabel.text(Login.getString(msg.resultCode)).fadeIn(1000);
			}

		}
	});
}

function showTyydMsg(rsp)
{
	if(rsp == null)
	{
		return ;
	}
	if (rsp.resultCode == "411000")
	{
		var msg = rsp.resultDesc;
		if(msg =="" || msg == undefined)
			{
			   msg="调用4A接口失败";
			}
		errorLabel.text(msg);
		errorLabel.fadeIn(1000);
		return true;
	}			

	return false;
}

//修改语言
(function(){
	
	function internationalization()
	{
		
	}
	
	function begin()
	{
		$(".langDialogClose").click(function(){
			$("#resetPwdLog").hide();
		});
		$(".langDialogCanncelLink").click(function(){
			$("#resetPwdLog").hide();
		});
		
	}
	
	commonMethods.changepwd = 
	{
		begin: begin
	};
	
})();