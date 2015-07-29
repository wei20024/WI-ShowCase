/**
 * 
 */
var clientW,clientH;
var _burl;
var fromhomepage;
//页面初始化

$(document).ready(function(){
	commonvar.init();
	commonvar.loadcss("changepassword.css");
	consoleVisible=$.cookie("openlog");
	initLog();
	webuilog(loglevel.info,"test changepassword page");
	commonvar.init();
	ServiceAPI.init();	
	commonvar.setBgImg();
	webuilog(loglevel.info,"start adjust location");
	//调整位置
	var topU,leftU;
		
		topU=commonvar.clientH*0.45-150;
		leftU=commonvar.clientW*0.5-250;
		if(topU<100)
		{
			topU=100;
		}
		if(leftU<100)
		{
			leftU=100;
		}
		$("#passExpired").css({position: "absolute",'top':topU,'left':leftU});
		
		topU=commonvar.clientH*0.45-200;
		leftU=commonvar.clientW*0.5-266;
		if(topU<100)
		{
			topU=100;
		}
		if(leftU<100)
		{
			leftU=100;
		}
		$("#modifyPasswordDiv").css({position: "absolute",'top':topU,'left':leftU});
	var ll=commonvar.clientW*0.5-250; 
	webuilog(loglevel.info,"clientW="+commonvar.clientW+";loginpanel left="+ll);
		//根据浏览器大小调整位置
	$(window).resize(function() {
		
		commonvar.showscroll();  
		var topU,leftU;
		
		topU=commonvar.clientH*0.45-150;
		leftU=commonvar.clientW*0.5-250;
		if(topU<100)
		{
			topU=100;
		}
		if(leftU<100)
		{
			leftU=100;
		}
		$("#passExpired").css({position: "absolute",'top':topU,'left':leftU});
		
		topU=commonvar.clientH*0.45-200;
		leftU=commonvar.clientW*0.5-266;
		if(topU<100)
		{
			topU=100;
		}
		if(leftU<100)
		{
			leftU=100;
		}
		$("#modifyPasswordDiv").css({position: "absolute",'top':topU,'left':leftU}); 	
		webuilog(loglevel.info,"clientW="+commonvar.clientW+";loginpanel left="+leftU);
			
	
	});
	
	
	
	$("#passExpired").css({position: "absolute",'top':commonvar.clientH*0.45-150,'left':commonvar.clientW*0.5-250}); 
	$("#modifyPasswordDiv").css({position: "absolute",'top':commonvar.clientH*0.45-200,'left':commonvar.clientW*0.5-266}); 
	
	$("#alertTitle").text(Login.getString('notice'));
	$("#alertText").text(Login.getString('passwordExpire'));
	$("#modTitle").text(Login.getString('modPassTitle'));
	$("#usernameLb").text(Login.getString('userName'));
	$("#oldPassLb").text(Login.getString('oldPassword'));
	$("#newPassLb").text(Login.getString('newPassword'));
	$("#renewPassLb").text(Login.getString('renewPassword'));	
		
	$("#successLB1").text(Login.getString('congratulation'));
	$("#successLB2").text(Login.getString('usenewpassword'));
	$("#successA").text(Login.getString('jumptohomepage'));
	
		$("#confirmMod").css({"background-image":Login.getString("confirmbtn")});
		$("#cancelMod").css({"background-image":Login.getString("cancelbtn")});
		$("#confirmBtn").css({"background-image":Login.getString("confirmbtn")});
		$("#cancelBtn").css({"background-image":Login.getString("cancelbtn")});
		
	
	if(commonvar.languageType=='en')
	{
		$("#alertIcon").css({position: "absolute",'left':'115px'});
		$("#alertText").css({position: "absolute",'top':'125px','left':'155px'});
		$(".labelClass").css({position: "absolute",'left':'-55px','width':'125px'}); 
		
	}
	
	//根据URL携带的参数呈现不同的界面，主页面点击修改密码后，直接显示修改密码界面
	var requestParam = new Object();
	requestParam =commonvar.getRequestParam();
	fromhomepage= requestParam['fromhomepage'];
		
	if(fromhomepage=="1")
	{
		$("#passExpired").hide();
		$("#modifyPasswordDiv").show();		
		$("#modifyInputDiv").show();
		showLoginUser();
		focusInput();
	}
	else
	{
		
		$("#passExpired").show();
		$("#modifyPasswordDiv").hide();		
		$("#modifyInputDiv").hide();
	}
	
	
	$("#confirmMod").click(function() {
		$("#passExpired").hide();		
		$("#modifyPasswordDiv").show();				
		$("#modifyInputDiv").show();
		$("#errorModifyDiv").remove();	
		$("#modifySuccessDiv").hide();
		$("#errorModifyDiv").css({"z-index":"-1"});
		$("#modifySuccessDiv").css({"z-index":"-1"});
		showLoginUser();
		focusInput();
		});
	$("#cancelMod").click(function() {
		window.location.href = commonvar.serviceUrl.userNameLoginPage;		    		   
		});
		
	$("#confirmBtn").click(function() {
		modifyPassword();
		});
	$("#cancelBtn").click(function() {
		if (fromhomepage == "1") {
			window.location.href = commonvar.serviceUrl.homepage;
		}
		else{
			window.location.href = commonvar.serviceUrl.userNameLoginPage;	
		}
		return false;	    		   
		});	
	$("#successA").click(function(){
		commonvar.jump2home();
	});	
	
	$("#errorModifyDiv").hide();
	$("#modifySuccessDiv").hide();
});
//用户名显示已登录的用户
function showLoginUser()
{
	var userName=$.cookie("userName");
	if (userName != "" && userName != null)
	{
		$("#usernameInput").val(userName);
	}
}

//打开页面后，光标聚焦在输入老密码的输入框上
function focusInput()
{
	$("#oldPassInput").focus();
}

function modifyPassword()
{
	$("#confirmBtn").unbind("click");
	$("#loadingpanel").css({"z-index":"10"}).show();
	$("#errorModifyDiv").remove();
	
	if(!checkParam())
    {
    	 $("#confirmBtn").bind("click",modifyPassword);
		 $("#loadingpanel").css({"z-index":"0"}).hide();
        return false;
    }
	
	var uname =  $.trim($("#usernameInput").val());
	var oldpass =  $("#oldPassInput").val();
	var newpass =  $("#newPassInput").val();
	var contextName = [];
	var obj = {
		username: uname,
        oldpwd: oldpass,
		newpwd:newpass
		};

	var params = JSON.stringify(obj);//data);
	var success_callback = function(msg){
		$("#confirmBtn").bind("click",modifyPassword);         
            
			 if (msg.resultCode == ResultCode.code.OPERATE_SUCCESS) {			   				   		 
            		showSuccessModifyDiv();
			   	
			   } else {
                addErrorLB();
				checkModifyCode(msg.resultCode);            
            }
			$("#loadingpanel").css({"z-index":"0"}).hide();
	};
	var error_callback=function(msg,error){
		$("#confirmBtn").bind("click",modifyPassword); 
		addErrorLB();
		$("#errorModifyDiv").show();
		if (error == "timeout") {
			$("#errorDivLB").text(Login.getString(error));
		}
		else {
			$("#errorDivLB").text(Login.getString(msg.status));
		}
		$("#loadingpanel").css({"z-index":"0"}).hide();
	};
	ServiceAPI.ajaxPostJSON(params, commonvar.serviceUrl.modifyPass, success_callback, error_callback);//ServiceAPI.serviceUrl.modifyPass
	
}
function checkModifyCode(resultcode)
{
	$("#errorModifyDiv").show();
	$("#errorDivLB").text(Login.getString(resultcode));//"修改密码错误");
}
function showSuccessModifyDiv()
{
	$("#modifyPasswordDiv").show();
	$("#modifySuccessDiv").show();
	$("#modifyInputDiv").hide();
	$("#modifySuccessDiv").css({"z-index":"1"});
	
}
//检查用户名是否为空
function checkName() {
	
		var name =  $.trim($("#usernameInput").val());
		if (name == "") {
			return false;
		}
		
		return true;
			
}
//检查密码是否为空
function checkOldPass() {
	var pass =  $("#oldPassInput").val();
	if (pass == "") {
		return false;
	}
	return true;
}
//检查密码是否为空
function checkNewPass() {
	var pass =  $("#newPassInput").val();
	if (pass == "") {
		return false;
	}
	return true;
}
//检查密码是否为空
function checkRenewPass() {
	var pass =  $("#renewPassInput").val();
	if (pass == "") {
		return false;
	}
	return true;
}
function checkPassEqual()
{
	var newPass =  $("#newPassInput").val();
	var pass =  $("#renewPassInput").val();
	if (pass != newPass) {
		return false;
	}
	return true;
}

function addErrorLB()
{
	$("#modifyInputDiv").append("<div id=\"errorModifyDiv\"><img id=\"errorDivImg\" src=\"/uns/default/img/bubbleerror.png\"><label id=\"errorDivLB\"></label></div>	");
	
	//用户名、密码和密码输入框（当修改出错时，调整高度）
	$("#usernameDIV").css({"top":"44px"});
	$("#oldPassDIV").css({"top":"89px"});
	$("#newPassDIV").css({"top":"134px"});
	$("#renewPassDIV").css({"top":"178px"});
	
	if(commonvar.languageType=='en')
	{
		$("#errorModifyDiv").css({"left":"20px"});
		$("#errorDivLB").css({"font-size":"12px"});	
	}
		
}

function checkParam()
{
    $(".inputClass").css({"border":"#e3e3e3 solid thin"});
	if(!checkName())
	{
		addErrorLB();
		$("#errorModifyDiv").show();
		$("#errorDivLB").text(Login.getString("userNameNotNull"));
		$("#usernameInput").css({"border":"red solid thin"});
		flag = false;
	}	
	else if(!checkOldPass())
	{
		addErrorLB();
		$("#errorModifyDiv").show();
		$("#errorDivLB").text(Login.getString("oldpwdNotNull"));
		$("#oldPassInput").css({"border":"red solid thin"});
		flag = false;
	}	
	else if(!checkNewPass())
	{
		addErrorLB();
		$("#errorModifyDiv").show();
		$("#errorDivLB").text(Login.getString("newpwdNotNull"));
		$("#newPassInput").css({"border":"red solid thin"});
		flag = false;
	}	
	else if(!checkRenewPass())
	{		
		addErrorLB();
		$("#errorModifyDiv").show();
		$("#errorDivLB").text(Login.getString("renewpwdNotNull"));
		$("#renewPassInput").css({"border":"red solid thin"});
		flag = false;
	}	
	else if(!checkPassEqual())
	{
		addErrorLB();
		$("#errorModifyDiv").show();
		$("#errorDivLB").text(Login.getString("renewpwdNotEqual"));
		$("#renewPassInput").css({"border":"red solid thin"});
		flag = false;
	}else
	{
		flag=true; 	
	}	   
	
	return flag;
}

