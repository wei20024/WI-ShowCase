
function explicitSelfInit()
{
	moveUpDiv("centerContainer", "centerBack");
	setDispPane();
	setDisplayPolicy();
	$("#switchUser").html(Login.getString("switchUser"));
	var langType = commonvar.getLangType();
	if (langType == "zh") {
		$("#notice").css("background","transparent url('/custom/resources/tyyd/web/darkblue/img/adch.png') no-repeat top center");
	}else{
		$("#notice").css("background","transparent url('/custom/resources/tyyd/web/darkblue/img/aden.png') no-repeat top center");
	}
	
	//初始化输入框
    $("#password").val(Login.getString("userPassTipuns"));
}

function checkUserBefor(name, pwd, emptyValue, emptyPwd)
{
	
	emptyValue = Login.getString(emptyValue);
	emptyPwd = Login.getString(emptyPwd);
    var username = document.getElementById(name);
    if (username.value == emptyValue || username.value == "")
    {
        username.value = "";
        showErrorMsg(Login.getString("userNameNotNull"));
    	username.focus();
        return;
    }
    var password = document.getElementById(pwd);
    if (password.value == emptyPwd || password.value == "")
    {
    	password.value = "";
    	showErrorMsg(Login.getString("pwdNotNull"));
    	password.focus();
        return;
    }
    uname = username.value;
    pass = password.value;
    doLogin();
}

function loginCode(code){
	if (code == 13) {
		checkUserBefor('user','password','userNameTip','userPassTipuns');
	}
}

//将错误码对应的描述，显示在错误提示栏中
function moveUpDiv(Containter, backGround)
{ 
    var windowH = window.screen.height;
    
    if(window.top.document.getElementById("overallWrapper"))
    {
        window.top.document.getElementById("overallWrapper").style.height = windowH * 0.8 + "px";
    }
    
    if (window.top.document.getElementById(Containter))
    {
        var h = window.top.document.getElementById(Containter).offsetHeight+30;
        window.top.document.getElementById(backGround).style.height = h + "px";
        window.top.document.getElementById(backGround).style.marginTop = -h/2 + "px";
        window.top.document.getElementById(Containter).style.marginTop = -h + "px";
    }
}

function showErrorMsg(msg)
{
	$("#feedbackArea").removeClass("noFeedback");
    $("#tmpFeedback").html(msg);
    moveUpDiv("centerContainer", "centerBack");
}

function hiddenErrorMsg()
{
	$("#feedbackArea").addClass("noFeedback");
}




function setItemInCookie(name, value) {
		if (value == null) {
			value = "";
		}
		if ((name == null) || (name == "")) {
			return;
		}

		var newCookie = "";
		var oldCookie = getCookie("WIClientInfo");
		if (oldCookie != "") {
			var cookieItems = oldCookie.split("~");
			for (i = 0; i < cookieItems.length; i++) {
				// The name of the item will be escaped so we need to make sure
				// that we search for the escaped version.
				if (cookieItems[i].indexOf(escape(name) + "#") != 0) {
					newCookie += cookieItems[i] + "~";
				}
			}
		}

		newCookie += escape(name) + "#" + escape(value);
		storeCookie("WIClientInfo", newCookie);
	}

	function getItemFromCookie(name) {
		return unescape(getValueFromString(escape(name),
				getCookie("WIClientInfo"), "#", "~"));
	}

	function storeCookie(name, value) {
		if (value) { 
			value = "\"" + value + "\"";
		} else {
			value = "";
		}

		if (window.location.protocol.toLowerCase() == "https:") {
			value += "; secure";
		}

		var cookie = name + "=" + value;

		if ("/VDesktop/auth/".indexOf('site')) {
			if ("/VDesktop/auth/".indexOf('site') > 0) {
				cookie = cookie + "; path=/";
			} else {
				cookie = cookie + "; path=/VDesktop/auth/";

			}
		}

		var date = new Date;
		date.setTime(date.getTime() + 7 * 24 * 3600 * 1000);

		document.cookie = cookie + ";expires=" + date.toGMTString();
	}

	function getCookie(name) {
		var cookie = getValueFromString(name, document.cookie, "=", ";");
		if ((cookie.charAt(0) == "\"")
				&& (cookie.charAt(cookie.length - 1) == "\"")) {
			cookie = cookie.substring(1, cookie.length - 1);
		}
		return cookie;
	}

	function getValueFromString(name, str, sep1, sep2) {
		var result = "";

		if (str != null) {
			var itemStart = str.indexOf(name + sep1);
			if (itemStart != -1) {
				var valueStart = itemStart + name.length + 1;
				var valueEnd = str.indexOf(sep2, valueStart);
				if (valueEnd == -1) {
					valueEnd = str.length;
				}
				result = str.substring(valueStart, valueEnd);
			}
		}

		return result;
	}

	function clearForm(loginForm) {
		loginForm.user.value = "";
		loginForm.password.value = "";
		if (loginForm.domain) {
			if (loginForm.domain.type != "hidden") {
				loginForm.domain.value = "";
			}
		}
		if (loginForm.context != null) {
			loginForm.context.value = "";
		}
		setFocus(loginForm);
	}

	function setFocus(loginForm) {
		if (loginForm.tokencode && (!loginForm.tokencode.disabled)) {
			loginForm.tokencode.focus();
		} else if (loginForm.PIN1 && (!loginForm.PIN1.disabled)) {
			loginForm.PIN1.focus();
		} else if (loginForm.LoginType && (!loginForm.LoginType.disabled)) {
			if (loginForm.LoginType.value == "Explicit") {
				setExplicitLoginFocus(loginForm);
			} else {
				if (loginForm.LoginType.options
						&& (!loginForm.LoginType.options.disabled)) {
					if (loginForm.LoginType.options[loginForm.LoginType.selectedIndex].value == "Explicit") {
						setExplicitLoginFocus(loginForm);
					} else {
						var usrAgt = navigator.userAgent.toLowerCase();
						var nav4 = ((usrAgt.indexOf('mozilla/4') != -1)
								&& (usrAgt.indexOf('msie') == -1)
								&& (usrAgt.indexOf('spoofer') == -1)
								&& (usrAgt.indexOf('compatible') == -1)
								&& (usrAgt.indexOf('opera') == -1) && (usrAgt
								.indexOf('webtv') == -1));

						if (!nav4) {
							var buttonName;
							if (isHighContrastEnabled()) {
								buttonName = "highContrast_LoginButton";
							} else {
								buttonName = "btnLogin";
							}
							if (!document.getElementById(buttonName).disabled) {
								document.getElementById(buttonName).focus();
							}
						}
					}
				}
			}
		}
	}

	function setExplicitLoginFocus(loginForm) {

		if (loginForm.user.value != "") {
			loginForm.password.focus();
		} else if (!loginForm.user.disabled) {
			loginForm.user.focus();
		}

	}

	function onLoadLayout() {
		var login = getItemFromCookieStyle("loginStyle");

		if ('False' == 'True' || 'False' == 'True') {
			document.getElementById("loginStyle").style.display = "block";
			document.getElementById("bc").style.height = "91%";
		} else {
			document.getElementById("bc").style.height = "85%";
		}
		//set language
		setLang();

		maintainAccessibility("LoginButton");

		var frame = getTopFrame(window);
		if (frame != null) {
			return false;
		}

		var form = document.forms[0];
		if (form) {
			setFocus(form);

			onUsernameTextEntry(form);
		}

		var accountSSlink = document.getElementById("accountSS");

		if (accountSSlink != null) {
			showAccountSelfServiceIfEnabled(accountSSlink);
		}
		if (login == "normal" && 'False' != 'True') {
			if (document.getElementById("feedbackArea").className != "noFeedback") {
				var t = document.getElementById("tmpFeedback").innerHTML;
				if (t.indexOf("您的输入有误，请重新输入") != -1
						|| t.indexOf("用户鉴权成功") != -1) {
					document.getElementById("feedbackArea").className = "noFeedback";
				}
			}
			showNormal(1);

		}
		//login mode is usb key
		else if (login == "usbkey" || 'False' == 'True') {
			showUSBKey(0);
		}
		//login mode is fingerprint
		else if (login == "finger" && 'False' != 'True') {
			var useFinger = getItemFromCookie("useFinger");
			if (document.getElementById("feedbackArea").className != "noFeedback"
					&& useFinger == "true") {
				var t = document.getElementById("tmpFeedback").innerHTML;
				if (t.indexOf("您的帐户已暂时锁定。") == -1) {
					document.getElementById("feedbackArea").className = "noFeedback";
				}
				if (t.indexOf("用户鉴权成功") == -1) {
					OpenRegist();
					document.getElementById("returnMess").innerHTML = document
							.getElementById("tmpFeedback").innerHTML;
				}

			}
			if (document.getElementById("tmpFeedback")) {
				if (document.getElementById("tmpFeedback").innerHTML
						.indexOf("您的输入有误，请重新输入") != -1
						|| document.getElementById("tmpFeedback").innerHTML
								.indexOf("用户鉴权成功") != -1) {
					document.getElementById("feedbackArea").className = "noFeedback";
				}
			}
			showFinger(1);
		}
		return;
	}

	function setLang() {

		if (document.getElementById('certificateButton')) {
			if (document.getElementById('certificateButton').innerHTML == "Other Certificates") {
				lang = "en";
			} else {
				lang = "zh";
			}
			setL(lang);
		}

	}

	function setL(lang) {
		var hasp = hasPlugin();
		if (hasp) {
			if (lang == "en") {
				SetLang_ens();
			} else if (lang == "zh") {
				SetLang_zhs();
			}
		}
	}

	function SetLang_zhs() {
		var embed = window.top.document.embeds[0];
		var ret = embed.SetLanguage("zh");

	}

	function SetLang_ens() {
		var embed = window.top.document.embeds[0];
		var ret = embed.SetLanguage("en");
	}

	function usernameFieldContainsDomain(f) {
		return (f.user.value.indexOf("@") != -1)
				|| (f.user.value.indexOf("\\") != -1);
	}

	function isExplicitLoginType(f) {
		return (f.LoginType.value == "Explicit");
	}

	function setDomainState(f) {

		var explicit = isExplicitLoginType(f);

		setDisabled(f.domain, !explicit || usernameFieldContainsDomain(f));

		setDisabled(document.getElementById("lblDomain"), !explicit
				|| usernameFieldContainsDomain(f));

	}
	//show usbkey login window
	function showUSBKey(value) {
		setItemInCookie("loginStyle", "usbkey");
		if (document.getElementById("finger")) {
			document.getElementById("finger").style.display = "none";
		}
		if (document.getElementById("FingerTest")) {
			document.getElementById("FingerTest").style.display = "none";
			document.getElementById("fingerImg").style.display = "none";
		}
		if (document.getElementById('domain')) {
			document.getElementById("ShowDomainDiv").style.display = "none";
		}
		document.getElementById("normalImg").style.display = "";
		document.getElementById("loginMainForm").style.display = "block";
		document.getElementById("usernameTd").style.display = "none";
		document.getElementById("pwdtd").style.display = "none";
		if ('False' == 'True' || 'False' == 'True') {
			document.getElementById("loginStyle").style.display = "block";
		}
		document.getElementById("otherCertificate").style.display = "none";
		document.getElementById("messagesArea").style.display = "block";
		document.getElementById("fgbutton").style.display = "none";
		document.getElementById("lgbutton").style.display = "";
		document.getElementById("btnLogin").style.marginLeft = 75 + "px";
		if (document.getElementById('LoginType')) {
			select(value);
		}
	}

	//show explicit login window
	function showNormal(value) {
		setItemInCookie("loginStyle", "normal");
		document.getElementById("loginMainForm").style.display = "";
		document.getElementById("usernameTd").style.display = "";
		document.getElementById("pwdtd").style.display = "";
		if ('False' == 'True' || 'False' == 'True') {
			document.getElementById("loginStyle").style.display = "block";
		}
		document.getElementById("otherCertificate").style.display = "none";
		document.getElementById("messagesArea").style.display = "";
		document.getElementById("switchUser").style.display = "";
		document.getElementById("finger").style.display = "none";
		document.getElementById("fingerImg").style.display = "none";
		document.getElementById("normalImg").style.display = "";
		document.getElementById("fgbutton").style.display = "none";
		document.getElementById("lgbutton").style.display = "block";
		document.getElementById("switchUser").style.display = "block";
		document.getElementById("btnLogin").style.marginLeft = 0 + "px";

		if (document.getElementById('LoginType')) {
			select(value);
		}
		if (document.getElementById('domain')) {
			document.getElementById("ShowDomainDiv").style.display = "";
		}

		setSwitchLink();
	}

	//show fingerprint login window
	function showFinger(value) {
		setItemInCookie("loginStyle", "finger");
		if (document.getElementById("loginMainForm")) {
			document.getElementById("loginMainForm").style.display = "block";
		}
		document.getElementById("usernameTd").style.display = "";
		document.getElementById("pwdtd").style.display = "";
		if ('False' == 'True' || 'False' == 'True') {
			document.getElementById("loginStyle").style.display = "";
		}
		document.getElementById("otherCertificate").style.display = "none";
		document.getElementById("messagesArea").style.display = "";
		document.getElementById("switchUser").style.display = "none";
		document.getElementById("finger").style.display = "block";
		document.getElementById("fingerImg").style.display = "block";
		document.getElementById("normalImg").style.display = "none";
		document.getElementById("fgbutton").style.display = "";
		document.getElementById("lgbutton").style.display = "none";
		document.getElementById("feedbackArea").className == "noFeedback";
		if (document.getElementById("FingerTest")) {
			document.getElementById("FingerTest").style.display = ""
		}
		if (document.getElementById('LoginType')) {
			select(value);
		}
		if (document.getElementById('domain')) {
			document.getElementById("ShowDomainDiv").style.display = "";
		}
		setSwitchLink();
	}

	//if there is more than one login mode
	function select(value) {
		var t = document.getElementById('LoginType');
		t.selectedIndex = value;
		if (document.all) {
			t.fireEvent("onchange");
		} else {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", true, true);
			t.dispatchEvent(evt);
		}
	}

	function onChangeLoginType(f) {
		var explicit = isExplicitLoginType(f);

		setDisabled(f.user, !explicit);
		setDisabled(f.password, !explicit);
		setDisabled(f.accountSS, !explicit);
		setDisabled(f.context, !explicit);
		setDisabled(f.tree, !explicit);
		setDisabled(f.passcode, !explicit);

		setDisabled(document.getElementById("lblCredentials"), !explicit);
		setDisabled(document.getElementById("lblUserName"), !explicit);
		setDisabled(document.getElementById("lblPasswd"), !explicit);
		setDisabled(document.getElementById("lblContext"), !explicit);
		setDisabled(document.getElementById("lblTree"), !explicit);
		setDisabled(document.getElementById("lblPasscode"), !explicit);
		setDisabled(document.getElementById("switchUser"), !explicit);

		setDomainState(f);
		setInputShow(f, !explicit);
	}

	function onUsernameTextEntry(f) {
		setDomainState(f);
	}

	function showAccountSelfServiceIfEnabled(accountSSlink) {
		if (getItemFromCookie("clientConnSecure") == "true") {
			accountSSlink.style.display = "";
		} else {
			accountSSlink.style.display = "none";
		}
	}

	function addCssClass(item, c) {
		var names = item.className.split(' ');
		for ( var i in names) {
			if (names[i] == c)
				return;
		}
		item.className += ' ' + c;
	}
	function removeCssClass(item, c) {
		var names = item.className.split(' ');
		var newNames = '';
		for ( var i in names) {
			if (names[i] != c) {
				newNames += ' ' + names[i];
			}
		}
		item.className = newNames;
	}

	function setDisabled(item, disabled) {
		if (item) {
			if (item.tagName == 'INPUT' || item.tagName == 'SELECT') {
				if (disabled) {
					addCssClass(item, 'loginEntriesDisabled');
				} else {
					removeCssClass(item, 'loginEntriesDisabled');
				}
			}
			if (item.tagName == 'A') {
				if (disabled) {
					item.style.visibility = 'hidden';
				} else {
					item.style.visibility = 'visible';
				}
			}
			item.disabled = disabled;
		}
	}

	function setInputShow(f, disabled) {
		if (disabled) {
			var tmpTxt = document.getElementById("user");
			var tmpPassword = document.getElementById("password");
			var usernameTd = document.getElementById("usernameTd");
			var usernameTdDiv = document.getElementById("usernameTdDiv");
			var pwdtdDiv = document.getElementById("pwdtdDiv");
			tmpTxt.value = "";
			tmpPassword.value = "";
			usernameTd.className = "loginFormInputTd";
			tmpTxt.className = "enabledInput";
			tmpTxt.removeAttribute("readOnly");
			usernameTdDiv.className = "disabledInputbg";
			pwdtdDiv.className = "disabledInputbg";
		}
		else {
			setEmptyValue('user', 'userNameTip', 0);
			setEmptyValue('password', 'userPassTipuns', 1);
			setSwitchLink();
			var usernameTdDiv = document.getElementById("usernameTdDiv");
			var pwdtdDiv = document.getElementById("pwdtdDiv");
			usernameTdDiv.className = "inputbg";
			pwdtdDiv.className = "inputbg";
			if (document.getElementById("user").value != "") {
				document.getElementById("password").focus();
			} else {
				enableUserName();
			}
		}
	}

	// Disable all links in the document
	function disableLinks() {
		if (document.getElementsByTagName) {
			var allAnchors = document.getElementsByTagName("a");
			for (i = 0; i < allAnchors.length; i++) {
				allAnchors[i].onclick = function() {
					return false;
				};
			}
		}
	}

	// This variable is used to stop double form submits
	// does not need to be reset as the page is refreshed
	// when the login form is sent
	var isSubmitted = false;

	function submitForm() {
		if (!isSubmitted) {
			changeLoginBtnColor(false);

			saveUserName();
			isSubmitted = true;

			var loginBtn = document.getElementById("loginButtonWrapper");
			if (loginBtn) {
				loginBtn.style.color = "#aaaaaa";
			}

			disableLinks();
			document.forms[0].submit();
		}
	}

	function changeLoginBtnColor(b) {
		if (!isSubmitted) {
			var buttonId = document.getElementById("loginButtonBg");
			var ff = navigator.userAgent.toLowerCase().indexOf("firefox");
			if (b) {
				if (ff < 0) {
					buttonId.src = "/custom/resources/tyyd/web/darkblue/img/loginOver.gif";
				} else {
					buttonId.src = "/custom/resources/tyyd/web/darkblue/img/loginOver.png";
				}
			} else {
				if (ff < 0) {
					buttonId.src = "/custom/resources/tyyd/web/darkblue/img/login.gif";
				} else {
					buttonId.src = "/custom/resources/tyyd/web/darkblue/img/login.png";
				}
			}
		}
	}

	function setup_login_submit_keys() {
		// the form uses a link/image instead of a submit button, so it needs scripting to submit when the enter key is pressed on fields

		var submitIfEnter = function(e) {
			var keynum;
			if (window.event) { // IE
				keynum = window.event.keyCode;
			} else if (e.which) { // Other browser
				keynum = e.which;
			}
			if (keynum == 13) { // enter key
				if (document.getElementById("fingerRegist").style.display == "block") {
					document.getElementById("doReg").onclick();
					return false;
				}
				//submitForm();
				loginCode(keynum);
				return false;
			}
		}

		var inputs = document.forms[0].getElementsByTagName("input");
		for ( var i = 0; i < inputs.length; i++) {
			inputs[i].onkeypress = submitIfEnter;
		}

		var selects = document.forms[0].getElementsByTagName("select");
		for ( var i = 0; i < selects.length; i++) {
			selects[i].onkeypress = submitIfEnter;
		}
	}

	function saveUserName() {
		setItemInCookie("username", document.getElementById("user").value);

	}

	function getUserName() {
		if (document.getElementById("user")) {
			if($.cookie("userName") == "" || $.cookie("userName") == null || $.cookie("userName") == "undefined"){
				document.getElementById("user").value = "";
			}else{
				document.getElementById("user").value = $.cookie("userName");
			}
		}
	}

	function setSwitchLink() {
		getUserName();

		var tmpLinkBtn = document.getElementById("switchUser");
		var tmpTxt = document.getElementById("user");
		var usernameTd = document.getElementById("usernameTd");

		if (document.getElementById("user").value != ""
				&& getItemFromCookieStyle("loginStyle") == "normal") {
			tmpTxt.className = "disabledInput";
			usernameTd.className = "disabledtd";
			tmpLinkBtn.style.display = "block";
			tmpTxt.readOnly = "true";
		} else {
			tmpTxt.className = "enabledInput";
			usernameTd.className = "loginFormInputTd";
			tmpLinkBtn.style.display = "none";
			tmpTxt.removeAttribute("readOnly");
			tmpTxt.focus();
			tmpTxt.select();
		}
	}

	function enableUserName() {
		var tmpLinkBtn = document.getElementById("switchUser");
		var tmpTxt = document.getElementById("user");
		var usernameTd = document.getElementById("usernameTd");

		tmpLinkBtn.style.display = "none";
		usernameTd.className = "loginFormInputTd";
		tmpTxt.className = "enabledInput";
		tmpTxt.removeAttribute("readOnly");

		tmpTxt.focus();
		tmpTxt.select();
	}

	function setEmptyValue(input, emptyValue, b) {
		//根据传进来的关键字取得相应的国际化
		emptyValue = Login.getString(emptyValue);
	
		var text = document.getElementById(input);
		
		var val = text.value;
		if (b == 1) {
			if (val == "") {
				text.value = emptyValue;
				text.style.color = "#aaaaaa";
				if (text.type == "text") {
					text.style.fontSize = "12px";

					var Sys = {};
					var ua = navigator.userAgent.toLowerCase();
					var s;

					(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]
							:

							(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1]
									:

									(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1]
											:

											(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1]
													:

													(s = ua
															.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1]
															: 0;

					if (Sys.ie) {
						text.style.paddingTop = "3px";
					}
					if (Sys.firefox) {
						text.style.paddingTop = "1px";
					}

				}
			}
		} else {
			if (val == emptyValue || val == "") {
				text.value = "";
				text.style.color = "#000000";
				text.style.fontSize = "16px";
				text.style.paddingTop = "0px";
			}
		}
	}

	function fnOnOverSelect(selObj) {
		var isOutOfWidth = false;
		for ( var i = 0; i < selObj.options.length; i++) {
			if (selObj.options[i].innerText.length > 21) {
				isOutOfWidth = true;
				break;
			}
		}
		if (!isOutOfWidth)
			return;

		if (selObj.style.width != 'auto') {
			selObj.style.width = 'auto';
			selObj.focus();
			selObj.onblur = function() {
				selObj.style.width = 159;
				selObj.style._width = 158;
			}
		}
	}

	function checkUsername(name, pwd, emptyValue, emptyPwd) {
		var username = document.getElementById(name);
		if (username.value == emptyValue) {
			username.value = "";
		}
		var password = document.getElementById(pwd);
		if (password.value == emptyPwd) {
			password.value = "";
		}
		submitForm();
	}

	//open regist
	function OpenRegist() {

		document.getElementById("fingerRegist").style.display = "block";
		document.getElementById("options").style.display = "none";
		document.getElementById("cancelReg").focus();
		if (document.getElementById("fingerRegist").style.display == "block") {
			document.getElementById("fuser").focus();
		}
	}

	//when click login button,check the input is null or not ,regist if null,else login 
	function VerifyFPOrLogin() {

		var username = document.getElementById('user');
		var hasP = hasPlugin();
		if (username.value == '请输入用户名') {
			username.value = "";
		}
		var password = document.getElementById('password');
		if (password.value == 'admin') {
			password.value = "";
		}
		if (username.value == "" || password.value == "") {
			if (hasP) {
				VerifyFP();
			} else {
				alert("您使用的客户端不支持此功能，如需要请联系管理员。");
			}
		} else {

			submitForm();
		}
	}

	//cancel regist
	function closeReg() {
		document.getElementById("returnMess").innerHTML = "";
		document.getElementById("fingerRegist").style.display = "none";

		document.getElementById("fuser").value = "";
		document.getElementById("fpassword").value = "";
		setItemInCookie("useFinger", "false");
		document.getElementById('FingerDate').value = "";
	}

	//when click regist,show or hidden the panel of options
	function chooseOption() {
		var hasP = false;
		hasP = hasPlugin();

		if (hasP) {
			if (document.getElementById("options")) {
				if (document.getElementById("options").style.display == "block") {
					document.getElementById("options").style.display = "none";
				} else {
					document.getElementById("options").style.display = "block";
				}
			}
		} else {
			alert("您使用的客户端不支持此功能，如需要请联系管理员。");
		}
		var o = document.getElementById("finger");
		var b = document.getElementById("fff");
		var w = o.clientWidth || o.offsetWidth;
		var t = b.clientWidth || b.offsetWidth;

		document.getElementById("options").style.marginLeft = w / 2 - t / 2
				+ "px";
	}

	function hasPlugin() {
		var hasPlugin = false;
		try {
			try {
				var slControl = new ActiveXObject(
						'Fingerprint Plugin for Biocome'); //���IE 
				hasPlugin = true;
			} catch (e) {
				for ( var i = 0; i < navigator.plugins.length; i++) {
					if (navigator.plugins[i].name == "Fingerprint Plugin for Biocome") {
						hasPlugin = true;
						break;
					}
				}

			}
		} catch (e) {
		}
		return hasPlugin;
	}

	//check authentication of user
	function checkForm() {
		document.getElementById('FingerDate').value = "finger";
		setItemInCookie("useFinger", "true");
		if (document.getElementById("fuser").value == null
				|| document.getElementById("fuser").value == ""
				|| document.getElementById("fuser").value == '请输入用户名'
				|| document.getElementById("fpassword").value == null
				|| document.getElementById("fpassword").value == ""
				|| document.getElementById("fpassword").value == 'admin') {
			document.getElementById("returnMess").innerHTML = "必须输入一个用户名和密码。";

		} else {
			setItemInCookie("para", document.getElementById("fpassword").value);
			document.getElementById("user").value = document
					.getElementById("fuser").value;
			document.getElementById("password").value = document
					.getElementById("fpassword").value;
			if (document.getElementById("domain")) {
				document.getElementById("domain").value = document
						.getElementById("fdomain").value;
				setItemInCookie("domain",
						document.getElementById("fdomain").value);
			}
			submitForm();
		}
	}

	//if user is authenticate,then regist
	function RegFPIfAuthen() {
		if (document.getElementById('tmpFeedback')
				&& (getItemFromCookie("para") != "" || getItemFromCookie("para") != null)) {
			var t = document.getElementById("tmpFeedback").innerHTML;

			if (t.indexOf("用户鉴权成功") != -1
					&& getItemFromCookie("useFinger") == "true") {

				var domain;
				if (document.getElementById("fdomain")) {
					if (document.getElementById("fdomain").value == null
							|| document.getElementById("fdomain").value == "") {
						domain = "";
					} else {
						if (getItemFromCookie("domain") != null
								&& getItemFromCookie("domain") != "") {
							domain = getItemFromCookie("domain");
						}
					}
				} else {
					domain = "localhost";
				}
				setTimeout(function() {
					RegFP(domain);
				}, 1000);
			}
			setItemInCookie("useFinger", "false");

		}
	}

	//when choose fingerprint options,change background color of every option
	function changecolor(obj) {
		obj.style.background = "#DCF0F9";
	}
	function changecolorr(obj) {
		obj.style.background = "white";
	}

	function saveDomain() {
		setItemInCookie("domain", document.getElementById("fdomain").value);
	}

	var isSecure = (location.protocol.toLowerCase() == 'https:');
	setItemInCookie("clientConnSecure", isSecure);

	// -->
	try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e) {
	}
	
	
	function ModifyFP() {
		setTimeout(fp1, 1000);
	}
	function fp1() {
		var embed = document.embeds[0];

		if (document.getElementById("options")) {
			document.getElementById("options").style.display = "none";
		}
		embed.ModifyFingerprint();
	}

	function SyncPwd() {
		setTimeout(fp2, 1000);
	}
	function fp2() {
		var embed = document.embeds[0];
		if (document.getElementById("options")) {
			document.getElementById("options").style.display = "none";
		}
		embed.SyncPassword();
	}

	function VerifyFP() {
		var embed = document.embeds[0];
		var verifyRet = embed.VerifyFingerprint();
		var retInfo = "BIO_FAIL";
		if (!(verifyRet.indexOf(retInfo) == 0 && retInfo.indexOf(verifyRet) == 0)) {
			var infoArray = new Array;
			infoArray = verifyRet.split("'");
			var domainValue = infoArray[0];
			var usernameValue = infoArray[1];
			var pwdValue = infoArray[2];
			document.getElementById('user').value = usernameValue;
			document.getElementById('password').value = pwdValue;
			if (domainValue != null && domainValue != "") {
				if (document.getElementById("domain")) {
					document.getElementById("domain").value = domainValue;
				}
			}
			submitForm();
		}
	}

	function RegFP(domain) {
		var embed = document.embeds[0];
		var usernameValue = document.getElementById('user').value;
		var pwdValue = getItemFromCookie("para");
		embed.RegisterFingerprint(domain, usernameValue, pwdValue);
		setItemInCookie("para", "");
	}