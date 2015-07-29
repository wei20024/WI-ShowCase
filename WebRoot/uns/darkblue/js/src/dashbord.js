// 初始化系统环境,ie8在不打开开发人员工具时，console对象不生效
if (typeof(console) == "undefined" || console == null)
{
	console = {};
	console.log = function(){};
}
commonvar.init();

if (typeof(webuilog) != "undefined" && webuilog != null)
{
	(function()
	{
		var requestParam = new Object();
		requestParam =commonvar.getRequestParam();
		openlog= requestParam['openlog'];
		
		if(openlog=="1")//打开日志
		{
			consoleVisible=1;
			commonvar.setCookieByProtocol("openlog", "1");
		}
		else if(openlog == "0") //0 关闭日志
		{
			consoleVisible=0;
			commonvar.setCookieByProtocol("openlog", "0");
			return;
		}
		consoleVisible=$.cookie("openlog");
		if (typeof(consoleVisible) == "undefined" || consoleVisible != "1") return;
		initLog();
		console = {};
		console.log = function()
		{
			var str = "";
			for (var i = 0; i < arguments.length; i++)
			{
				if (i > 0) str += ", ";
				str += arguments[i];
			}
			webuilog(loglevel.info, str);
		}
	})();
}

// 提供平台工具类，TODO待提取到共用文件
// 暴露webui.classspace.base.JSS类，能够监控对象的变化，使用方法：
// new出来后，使用refresh方法放入新的json对象
// 使用setOnChange方法注册回调函数，每当refresh放入的json与上一次放入的发生变化时，通过回调函数提醒
// 回调函数具体格式参见类中的实现
(function(){
	function getJsonSeqInner(data, arr, prefix)
	{
	  for (var p in data)
	  {
	    var path = prefix + "." + p;
	    if (typeof(data[p]) == "object")
	    {
	      getJsonSeqInner(data[p], arr, path);
	    }
	    arr.push(path);
	  }
	}
	
	function getJsonSeq(data)
	{
	  var arr = new Array();
	  getJsonSeqInner(data, arr, "");
	  var len = arr.length;
	  var i = 0;
	  for (; i < len; i++)
	  {
	    arr[i] = arr[i].replace(/^\./, "");
	  }
	  arr.sort(function(a, b){return a < b ? -1 : a > b ? 1 : 0;});
	  return arr;
	};
	
	function getValue(path, dataSrc)
	{
	  var segs = path.split(".");
	  var len = segs.length;
	  var expression = "dataSrc";
	  var i = 0;
	  for (i = 0; i < len; i++)
	  {
	    expression = expression + "[\"" + segs[i] + "\"]";
	  }
	  return eval(expression);
	}
	
	function  refresh(instance, data)
	{
	  var oldArr = getJsonSeq(instance.data);
	  var arr = getJsonSeq(data);
	  var i = 0;
	  var j = 0;
	  while(1)
	  {
	    if (i >= oldArr.length && j>= arr.length) break;
	    var oldKey = oldArr.length <= i ? "" : oldArr[i];
	    var key = arr.length <= j ? "" : arr[j];
	    if (oldKey == key)
	    {
	      var oldVal = getValue(oldKey, instance.data);
	      var val = getValue(key, data);
	      if (oldVal != val && (typeof(oldVal) != "object" || typeof(val) != "object")) instance.onChange("mod", key, val, data);
	      i++; j++;
	    }
	    else if (oldArr.length == 0 || (oldKey > key && key != "") || oldKey == "")
	    {
	      var val = getValue(key, data);
	      instance.onChange("add", key, val, data);
	      j++;
	    }
	    else if (oldKey != "" )
	    {
	      instance.onChange("del", oldKey, "", data);
	      i++;
	    }
	    else
	    {
	      j++;
	    }
	  }
	  instance.data = data;
	};
	
	webui.classspace.base.JSS = function()
	{
		var instance = {};
		instance.data = {};
		instance.onChange = function(){};
		
		// 绑定方法
		this.refresh = function(data){refresh(instance, data);};
		this.setOnChange = function(callback){instance.onChange = callback;}; 
	}
})();

// 初始化命名空间
webui.classspace.dashbord = {};
webui.objects.dashbord = {};

//判断是否第一次登录
var isFirstLogin = "true";

// 初始化配置项
// 与后台交互的url设置
webui.objects.dashbord = {};
webui.objects.dashbord.actionurls = {
	getVmList: commonvar.serviceUrl.getVmList, // output:{resultCode:0|xxx, errorMessage:xxx, vms: [{farmId:xxx, sid:xxx, name:xxx, type:singleVm|vmGroup, vmDomain,dgId,dgName,state:UNREGISTER|REGISTERED|CONNECTED|DISCONNECTED},{...},...]}
	getLoginInfo: commonvar.serviceUrl.getLoginInfo, // input: id:sid or groupName, type:singleVm|vmGroup, farmId:xxx; output: {resultCode:ResultCode.code.DESK_PREPARING(preparing)|0,errorMessage,addressTicket,address,loginTicket, linkType:gw|direct, gwIp:xxxx:xx}
	getVncLoginInfo: commonvar.serviceUrl.getVncLoginInfo, // input: id:sid or groupName, farmId:xxx, vmName:xxx, dgName:xxx; output: {resultCode:ResultCode.code.DESK_PREPARING(preparing)|0,errorMessage,addressTicket,VncPassword, linkType:gw|direct, VncGateIp:xx.xx.xx.xx_xx.xx.xx.xx...}
	reboot: commonvar.serviceUrl.reboot, // input: id:sid, domain:xxx, computerName:xxx,dgName:xxx,isForceReboot:true|false; output: {resultCode:0 or other, errorMessage:xxx}
	loginUsername: commonvar.serviceUrl.loginUsername, // output: resultCode  resultMessage username
	getVMsPowerSet: commonvar.serviceUrl.getVMsPowerSet, // input: id:sid, vmDomain, computerName, dgName; output: {resultCode,errorMessage, customVMUserPolicy}
	setVMsPowerSet: commonvar.serviceUrl.setVMsPowerSet, // input: id:sid, domain, computerName, dgName, customVMUserPolicy; output: {resultCode,errorMessage}
	queryVmStatus: commonvar.serviceUrl.queryVmStatus
};

// 各个Url返回值是否合规的检查(json格式)
(function(){
	function checkNil(data, tip)
	{
		if (typeof(data) != "undefined" && data != null) return false;
		if (typeof(tip) != "undefined" && tip != null) console.log(tip);
		return true;
	}

	function checkNotArray(data, tip)
	{
		if (Object.prototype.toString.call(data) == '[object Array]') return false;
		if (typeof(tip) != "undefined" && tip != null) console.log(tip);
		return true;
	}

	function checkNotEqual(data, values, tip)
	{
		var ret = true;
		for (var i in values)
		{
			if (values[i] == data) ret = false;
		}
		if (ret == false) return false;
		if (typeof(tip) != "undefined" && tip != null) console.log(tip);
		return true;
	}

	function checkGetVmListRsp(rsp)
	{
		var err = false;
		var pre = "NOTICE!! for :" + webui.objects.dashbord.actionurls.getVmList;
		if (checkNil(rsp, pre + " rsp not exist")) return false;
		
		err = checkNil(rsp.resultCode, pre + " rsp.resultCode not exist") || err;
		
		if (!checkNil(rsp.vms, pre + " rsp.vms not exist"))
			err =checkNotArray(rsp.vms, pre + " rsp.vms not Array") ||  err;
		else return false;
		if (rsp.vms.length > 0)
		{
			for (var i in rsp.vms)
			{
				var vm = rsp.vms[i];
				err =checkNil(vm.farmId, pre + " vm[" + i + "] farmId not exist") ||  err;
				err = checkNil(vm.name, pre + " vm[" + i + "] name not exist") ||  err;
				err = checkNil(vm.type, pre + " vm[" + i + "] type not exist") ||  err;
				err = checkNil(vm.vmDomain, pre + " vm[" + i + "] vmDomain not exist") ||  err;
				err = checkNil(vm.dgId, pre + " vm[" + i + "] dgId not exist") ||  err;
				err = checkNil(vm.dgName, pre + " vm[" + i + "] dgName not exist") ||  err;
				err = checkNil(vm.state, pre + " vm[" + i + "] state not exist") ||  err;
			}
		}
		return !err;
	}
	
	function checkGetLoginInfoRsp(rsp)
	{
		var err = false;
		var pre = "NOTICE!! for :" + webui.objects.dashbord.actionurls.getLoginInfo;
		if (checkNil(rsp, pre + " rsp not exist")) return false;
		
		err = checkNil(rsp.resultCode, pre + " rsp.resultCode not exist") || err;
		err = checkNil(rsp.addressTicket, pre + " rsp.addressTicket not exist") || err;
		err = checkNil(rsp.address, pre + " rsp.address not exist") || err;
		err = checkNil(rsp.loginTicket, pre + " rsp.loginTicket not exist") || err;
		if (!checkNil(rsp.linkType, pre + " rsp.linkType not exist"))
			err = checkNotEqual(rsp.linkType, ['gw','direct'], pre + " rsp.linkType value not avalible:" + rsp.linkType) || err;
		else err = true;
		return !err;
	}

	function checkGetVncLoginInfoRsp(rsp)
	{
		var err = false;
		var pre = "NOTICE!! for :" + webui.objects.dashbord.actionurls.getVncLoginInfo;
		if (checkNil(rsp, pre + " rsp not exist")) return false;
		
		err = checkNil(rsp.resultCode, pre + " rsp.resultCode not exist") || err;
		err = checkNil(rsp.addressTicket, pre + " rsp.addressTicket not exist") || err;
		err = checkNil(rsp.vncGateIp, pre + " rsp.vncGateIp not exist") || err;
		if (!checkNil(rsp.linkType, pre + " rsp.linkType not exist"))
			err = checkNotEqual(rsp.linkType, ['gw','direct'], pre + " rsp.linkType value not avalible:" + rsp.linkType) || err;
		else err = true;
		return !err;
	}

	
	webui.objects.dashbord.urlChecker = 
	{
		checkGetVmListRsp: checkGetVmListRsp,
		checkGetLoginInfoRsp: checkGetLoginInfoRsp,
		checkGetVncLoginInfoRsp: checkGetVncLoginInfoRsp
	}
})();



// 虚拟机类，webui.classspace.dashbord.Vm，定义过程利用匿名函数保护，不让内部函数与变量外泄
(function(){
	// 在dom中添加虚拟机所需内容
	function appendHtmlForVm(type, isFistStaticGroup, eleId, vmName, isPool, inMaintenanceMode, vmVersion, groupName) // 添加新vm所需的html内容，eleId为元素的Id值,vmName为vm的名字, isPool表示是否为池, 返回Dom内容的jquery对象
	{
		webui.objects.dashbord.vmMgr.setVmIndex(webui.objects.dashbord.vmMgr.getVmIndex()+1);
		if (groupName == "" || groupName == null) {
			groupName = "&nbsp;";
		}
		var _vmName = groupName;
		if (vmName == "" || vmName == null ) {
			_vmName = groupName;
		}else{
			_vmName = groupName + "[" + vmName + "]";
		}
		
		//增加防跨站脚本攻击处理代码
		_vmName = HtmlUtil.htmlDecode(_vmName);
		groupName = HtmlUtil.htmlDecode(groupName);
		
		if (vmVersion == "R21") {
			// 填充新桌面的HTML元素
			var templateSelector = "#vmTemplate_V21";
			var containerSelector = "#vmBox";
			var template = $(templateSelector);
			var container = $(containerSelector);
			var content = template.html();
			
			content = content.replace(/__vmTemplate__/g, eleId);
			content = content.replace(/__vmName__/g, _vmName);
			content = content.replace(/__deskGroupName__/g, groupName);
			content = content.replace(/__restart__/g, LA("Restart"));
			container.append(content);
			//当eleId中含有“.”时jquery取到的对象为空 取到文档对象后，再转化为jquery对象
			var ele = document.getElementById(eleId);
			ele = $(ele);
		}
		else if (vmVersion == "R51") {
			// 填充新桌面的HTML元素  使用模板时对于IE浏览器 更多菜单显示位置
			var containerSelector = "#vmBox";
			var container = $(containerSelector);
			var _leftValue = webui.objects.dashbord.vmMgr.getVmIndex()*245 - 66;
			var r5content = '<li style="overflow: hidden; float: left; width: 245px; height: 111px;">'+
							'<div id="'+eleId+'" class="desktopResource">'+
							'	<div class="desktopScreenContainer" title="'+_vmName+'">'+
							'		<a href="javascript:void(0)" onclick="" title="'+_vmName+'" name="'+_vmName+'" class="iconLink">'+
							'			<div style="background-image: url(&quot;/uns/darkblue/img/comp_2.png&quot;);"'+
							'				class="desktopScreen" onmouseover="changeIconhover(this);" onmouseout="changeIconhout(this);">'+
							'				<div class="delayedImageNone" >'+
							'					<img id="spinner_'+eleId+'" style="vertical-align: middle; width: 32px; height: 32px; top: 20px;"'+
							'						src="/uns/darkblue/img/Transparent32.gif" >'+
							'				</div>'+
							'			</div>'+ 
							'		</a>'+
							'	</div>'+
							'	<div class="desktopName">'+
							'		<a href="javascript:void(0)" onclick="" id="" name="'+groupName+'" class="iconLink">'+groupName+'</a>'+
							'	</div>'+
							'	<div class="desktopRestartDiv">'+
							'		<div style="float: left;width: 115px;" class="restartClass">'+
							'			<a href="javascript:void(0)" onclick="" class="a_restart" style="margin-left: 80px;width: 40px;" title="'+LA("Restart")+'">'+
							'			</a>'+
							'		</div>'+
							'		<div onclick="openMore(this);" style="margin-left: 115px;font-size: 12px;display: block;width: 50px;" >'+
							'			<a style="margin-bottom">'+LA("More")+'</a>'+
							'		</div>'+
							'		<div class="moreClass" style="display: none; z-index: 100; position: absolute;top: 8px;left: '+_leftValue+'px;width: 115px;margin-left: 0px;">'+
							'			<div class="backCenter" style="width: auto;text-align: left;">'+
							'				<div class="power_set" style="color: black;width: auto;" href="javascript:void(0);" title="'+LA("Set power management policy")+'">'+
							'					<a class="power_set_1" style="line-height: 22px;margin: 0px 3px;">'+
							'						'+LA("PowerManagement")+
							'					</a>'+
							'				</div>'+
							'				<div class="vncLoginClass" style="color: black;line-height: 22px;width: auto;" href="javascript:void(0);" title="'+LA("Self-service")+'">'+
							'					<a class="vncLoginClass_1" style="line-height: 22px;margin: 0px 3px;">'+
							'						'+LA("Self-service")+
							'					</a>'+
							'				</div>'+
							'				<div class="reBootClass" style="color: black;line-height: 22px;width: auto;" href="javascript:void(0);" title="'+LA("Restart")+'">'+
							'					<a class="reBootClass_1" style="line-height: 22px;margin: 0px 3px;">'+
							'						'+LA("Restart")+
							'					</a>'+
							'				</div>'+
							'				<div class="forceReBootClass" style="color: black;line-height: 22px;width: auto;" href="javascript:void(0);" title="'+LA("Force reboot")+'">'+
							'					<a class="forceReBootClass_1" style="line-height: 22px;margin: 0px 3px;">'+
							'						'+LA("Force reboot")+
							'					</a>'+
							'				</div>'+
							'			</div>'+
							'		</div>'+
							'	</div>'+
							'</div>'+
							'</li>';
			
			container.append(r5content);
			//解决部分ID包含有“=”等其他特殊符号的在jquery中不兼容的问题（把“=”等其他符号作为jquery选择器关键词解析）
			var ele = document.getElementById(eleId);
			ele = $(ele);
			//动态池模式（vmGroup）不显示，静态池模式（vmStaticGroup）只有第一次的时候不显示,如果是维护模式也不显示这些按钮
			if (isPool || (type == "vmStaticGroup" && isFistStaticGroup == true) || inMaintenanceMode == "1")
			{
				ele.find(".desktopRestartDiv").hide();
				ele.find(".loginVnc").hide();
				ele.find(".reboot").hide();
				ele.find(".forceReboot").hide();
			}
		}
		
		return ele;
	}
	
	// 在dom中删除掉虚拟机所需内容
	function releaseHtmlForVm(eleObj)
	{
		eleObj.remove();
	}
	
	// 释放虚拟机，供外部引用
	function releaseVm(instance)
	{
		webui.objects.dashbord.popupMgr.unregister(instance.vmId);
		releaseHtmlForVm(instance.ele);
	}
	
	// 将虚拟机置为未准备好状态，instance为实例数据，参见构造函数内容
	function showPreparing(instance) 
	{
		instance.ele.addClass("vmRolePreparing");
	}
	
	// 将虚拟机置为准备好状态，instance为实例数据，参见构造函数内容
	function hidePreparing(instance) 
	{
		if (instance.ele.hasClass("vmRolePreparing"))
		{
			outLoading(instance);
		}
		instance.ele.removeClass("vmRolePreparing");
	}
	
	// 显示提示，供外部引用，instance为实例数据，参见构造函数内容，text为需要提示的内容，callback提示确认后的动作
	function showTip(instance, text, callback) 
	{
		var tip = instance.ele.find(".vmTip");
		tip.find(".vmTipText").text(text);
		adjustTipArea(instance,text);
		tip.fadeIn(200);
		if (typeof(instance.__tipTimer) != "undefined" && instance.__tipTimer != null && instance.__tipTimer != 0)
		{
			clearTimeout(instance.__tipTimer);
			instance.__tipTimer = 0;
		}
		instance.__tipTimer = setTimeout(function(){tip.fadeOut();}, webui.system.tipFadeoutTime);
		
		if (typeof(callback) != "undefined" && callback != null)
		{
			callback();
		}
	}
	function showMsgTip(instance, text, callback)
	{
		$("#mainTopPane").show();
		$("#ResourcefeedbackArea").removeClass("noFeedback");
		$("#Resourcefeebackmid").show();
		$("#tmpFeedback").text(text);
		if (typeof(callback) != "undefined" && callback != null)
		{
			callback();
		}
	}
	
	//调整显示区的大小
	function adjustTipArea(instance,text)
	{
		var tip = instance.ele.find(".vmTip");
		var len = text.length;
	
		if (len <= 36)//中文36个则把小框填充满了，大于36用大框，之所有用大小框，是兼容以前提示信息（很短）和后来修改的信息（很长）
		{
			var width = "151px";
			var height = "100px";//87不够
			var top = "47px";
			var left = "48px";
			tip.css("top",top);
			tip.css("left",left);
			tip.css("width",width);
			tip.css("height",height);
			tip.find("#vmg").css("width",width);
			tip.find("#vmg").css("height",height);
			tip.find(".vmTipTable").css("width",width);
			tip.find(".vmTipTable").css("height",height);
		}
		else
		{
			var width = "200px";
			var height = "140px";
			var top = "23px";
			var left = "25px";
			tip.css("top",top);
			tip.css("left",left);		    
			tip.css("width",width);
			tip.css("height",height);
			tip.find("#vmg").css("width",width);
			tip.find("#vmg").css("height",height);
			tip.find(".vmTipTable").css("width",width);
			tip.find(".vmTipTable").css("height",height);
		}	
	}
	
	//R2虚拟机成功得到连接信息后，将客户端调起来
	function callClient_R21(instance, loginInfo)
	{
		$("#icaFileId").val(loginInfo.icaFileId);
		var icaUrl = "/launch.ica?icaFileId="+loginInfo.icaFileId + "&" + Math.random();
		if (ClientInfo.isIE()) {
			var icaobjhtml = '<object id="icaobj" classid="clsid:238f6f83-b8b4-11cf-8771-00a024541ee3" width="0" height="0">'+
								'<param name="Launch" value= "true">'+
								'<param name="Start" value= "true">'+
								'<param name="IPCLaunch" value="false">'+
								'<param name="ICAfile" value="'+icaUrl+'">'+
							'</object>';
					$("#icaobjdiv").html(icaobjhtml);
		}
		else if (ClientInfo.isFirefox()) {
			$("#icaIframe").attr("src", icaUrl);	
		}else{
			$("#icaIframe").attr("src", icaUrl);	
		}
	}
	
	// 成功得到连接信息后，将客户端调起来
	function callClient(instance, loginInfo)
	{
		var reqStr = "hwcloud://localhost/";
		reqStr += "useGw=" + (loginInfo.linkType == "gw" ? "1":"0");
		reqStr += "&loginTicket=" + loginInfo.loginTicket;
		if (loginInfo.linkType == "gw")
		{
			reqStr += "&addressTicket=" + loginInfo.addressTicket;

			var gwIp = loginInfo.gwIp;
			gwIp = gwIp.replace(/\:.*/, "");
			var gwPort = loginInfo.gwIp;
			gwPort = gwPort.replace(/.*\:/, "");
			
			reqStr += "&gwIp=" + gwIp;
			reqStr += "&gwPort=" + gwPort;	
		}
		else
		{
			var loginIp = loginInfo.address;
			loginIp = loginIp.replace(/\:.*/, "");
			var loginPort = loginInfo.address;
			loginPort = loginPort.replace(/.*\:/, "");
			
			reqStr += "&vmIp=" + loginIp;
			reqStr += "&vmPort=" + loginPort;
		}
		reqStr += "&vmName=" + instance.name;
		reqStr += "&domain=" + instance.vmDomain;
		if (loginInfo.linkType == "gw")
		{
			reqStr += "&farmId=" + instance.farmId;
		}
		reqStr += "&transactionId=" + loginInfo.transactionId;
		if (loginInfo.linkType == "gw")
		{
			reqStr += "&gwIps=" + loginInfo.gwIps;
		}
		if (webui.system.config.clientAuth == 1)
		{
			reqStr += "&clientAuth=1";
		}
		if(loginInfo.randomId!=null && loginInfo.randomId !='' && loginInfo.randomId !=undefined)
		{
			  reqStr += "&randomId=" + loginInfo.randomId;
		}
		
		if (webui.objects.dashbord.system.getBrowserType() == "ie6" || webui.objects.dashbord.system.getBrowserType() == "ie7" 
		|| webui.objects.dashbord.system.getBrowserType() == "ie8" || webui.objects.dashbord.system.getBrowserType() == "ie9"
			|| webui.objects.dashbord.system.getBrowserType() == "ie")
		{
			window.location = reqStr;
		}
		else if (webui.objects.dashbord.system.getBrowserType() == "chrome")
		{
			window.location = reqStr;
		}
		else 
		{
			$("#clientIframe").attr("src", reqStr);
		}
	
		if (instance.inMaintenanceMode == "1")
		{
		}
		else
		{
		}
	}
	
	// 成功得到连接信息后，将VNC客户端调起来
	function callVNCClient(instance, loginInfo, isAutoVncLogin)
	{
		var reqStr = "hwvcloud://localhost/";
		reqStr += "VncGateIp=" + loginInfo.vncGateIp;
		reqStr += "&addressTicket=" + loginInfo.addressTicket;
		reqStr += "&farmid=" + instance.farmId;
		reqStr += "&VmName=" + instance.name;
		reqStr += "&domain=" + instance.vmDomain;
		reqStr += "&AutoVncLog=" + isAutoVncLogin;
		reqStr += "&transactionId=" + loginInfo.transactionId;
		if (webui.system.config.clientAuth == 1)
		{
			reqStr += "&clientAuth=1";
		}

		if (webui.objects.dashbord.system.getBrowserType() == "ie6" || webui.objects.dashbord.system.getBrowserType() == "ie7" 
			|| webui.objects.dashbord.system.getBrowserType() == "ie8" || webui.objects.dashbord.system.getBrowserType() == "ie9"
				|| webui.objects.dashbord.system.getBrowserType() == "ie")
		{
			window.location = reqStr;
		}
		else if (webui.objects.dashbord.system.getBrowserType() == "chrome")
		{
			window.location = reqStr;
		}
		else $("#clientIframe").attr("src", reqStr);
	}
	
	function tryConnect_R21(instance, callback, timeout)
	{
		if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
		{
			clearTimeout(instance.__retryTimer);
			instance.__retryTimer = 0;
		}
		if (typeof(instance.__connectAjaxer) != "undefined" && instance.__connectAjaxer != null && instance.__connectAjaxer != 0)
		{
			instance.__connectAjaxer.abort();
			instance.__connectAjaxer = 0;
		}
		
		if (typeof(timeout) == "undefined" || timeout == null || timeout == 0)
		{
			timeout = 300000;
		}
		
		console.log("clientMac=" + hdpclient.getClientMac() + ",clientName=" + hdpclient.clientName() 
				+ ",clientIP=" + hdpclient.clientIp() + ",clientVersion=" + hdpclient.clientVersion() 
				+ "clientType=" + hdpclient.clientType());
		
		//登录过后cookie中的isFirstLogin变为false，下次刷新就不会重新登录
		commonvar.setCookieByProtocol("isFirstLogin", "false");

		//每次请求生成唯一标识,与返回标识对比,以确认请求与响应匹配
		var randomId =  createRandomId();  	
		console.log("try connecting., randomId = " + randomId);
	
		// 发起ajax请求
		__connectAjaxer = $.ajax({
	        url : webui.objects.dashbord.actionurls.getLoginInfo, // 加随机数防止缓存
        type : "POST",
        headers: { "cache-control": "no-cache"},	
        dataType : "json",
        contentType :"application/json",
        timeout: timeout,
        data : JSON.stringify({
				"id" : instance.sid,
              "type" : instance.type,
            "farmId" : instance.farmId,
              "dgId" : instance.dgId,
          "clientMac": hdpclient.getClientMac(),
         "clientName": hdpclient.clientName(),
           "clientIp": hdpclient.clientIp(),
      "clientVersion": hdpclient.clientVersion(),
         "clientType": hdpclient.clientType(),
         "randomId":randomId
        }),
        beforeSend: function(XMLHttpRequest){
        	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
		},
        success : function(msg) {
        	webui.objects.dashbord.urlChecker.checkGetVncLoginInfoRsp(msg);
        	try
        	{
	        	if (msg.resultCode != 0)
	        	{
	        		console.log("login vm fail(" + msg.resultCode + ")");
					
					var errorMsg = "";
        			if (msg.resultCode == 10000402) errorMsg = LA('10000402') + '(' + msg.resultCode + ')';
        			else if (msg.resultCode == 10000403) errorMsg = instance.name + LA('10000403') + '(' + msg.resultCode + ')';
        			else if (msg.resultCode == 10000404) errorMsg = LA('10000404') + '(' + msg.resultCode + ')';
        			else if (msg.resultCode == 10000405) errorMsg = LA('10000405') + '(' + msg.resultCode + ')';
        			else if (msg.resultCode == 10000406) errorMsg = LA('10000406') + '(' + msg.resultCode + ')';
        			else if (msg.resultCode == 10000601) errorMsg = LA('10000601_L') + instance.name + LA('10000601_R');
        			else if (msg.resultCode == 10000602) errorMsg = LA('10000602_L') + instance.name + LA('10000602_R') + '(' + msg.resultCode + ')';
        			else if (msg.resultCode == 10000801) errorMsg = LA('10000801_L') + instance.name + LA('10000801_R') + '(' + msg.resultCode + ')';
        			else if (msg.resultCode == 10000802) errorMsg = LA('10000802_L') + instance.name + LA('10000802_R') + '(' + msg.resultCode + ')';
        			else errorMsg = LA('Can not connect to VM') + '(' + msg.resultCode + ')';
        			callback(msg.resultCode, errorMsg);
	        	}
	        	else
	        	{
	        	  if ((null != msg.randomId && '' != msg.randomId && undefined != msg.randomId)
								&& (msg.randomId != randomId)) 
				   {
							// 1225代表请求与响应不匹配
							errorMsg = LA('VM is preparing') + " 1225";
							callback(1225, errorMsg);
				   } else 
				   {
	        		if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
	        		{
	        			clearTimeout(instance.__retryTimer);
	        			instance.__retryTimer = 0;
	        		}
	        		callClient_R21(instance, msg);
					callback(0,"");
				  }	
				}
			}
			catch(err)
			{
				console.log("connect throw exception:" + err, err.stack ? err.stack : "");
				callback(-1,LA('Internal Error'));
			}
        },
        error : function(msg,ret) {
        	// 前后台通讯错误则直接报错
    		if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
    		{
    			clearTimeout(instance.__retryTimer);
    			instance.__retryTimer = 0;
    		}
            console.log("connect error(%s).", ret);
            callback(-2,LA('Connect to VM failed'));
        }
	});
	}

    function tryConnect(instance, isVNC, isAutoVncLogin, callback, timeout) 
    {
    	// 再次防止重入，除定时器外，对未完成的ajax请求也做中断处理
    		if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
    		{
    			clearTimeout(instance.__retryTimer);
    			instance.__retryTimer = 0;
    		}
    		if (typeof(instance.__connectAjaxer) != "undefined" && instance.__connectAjaxer != null && instance.__connectAjaxer != 0)
    		{
    			instance.__connectAjaxer.abort();
    			instance.__connectAjaxer = 0;
    		}
    		
    		if (typeof(timeout) == "undefined" || timeout == null || timeout == 0)
    		{
    			timeout = 300000;
    		}
    		
    		console.log("clientMac=" + hdpclient.getClientMac() + ",clientName=" + hdpclient.clientName() 
    				+ ",clientIP=" + hdpclient.clientIp() + ",clientVersion=" + hdpclient.clientVersion() 
    				+ "clientType=" + hdpclient.clientType());
    		
    		//登录过后cookie中的isFirstLogin变为false，下次刷新就不会重新登录
			commonvar.setCookieByProtocol("isFirstLogin", "false");

    		var randomId =  createRandomId();   
    		
    		// 发起ajax请求
    		console.log("try connecting. isVNC = " + isVNC + " isAutoVncLogin = " + isAutoVncLogin
					+ ", randomId = " + randomId);

     	__connectAjaxer = $.ajax({
	        url : isVNC ? webui.objects.dashbord.actionurls.getVncLoginInfo : webui.objects.dashbord.actionurls.getLoginInfo, // 加随机数防止缓存
	        type : "POST",
	        headers: { "cache-control": "no-cache"},	
	        dataType : "json",
	        contentType :"application/json",
	        timeout: timeout,
	        data : isVNC ? JSON.stringify({
    				"id" : instance.sid,
	            "vmName" : instance.name,
				"dgName" : instance.dgName,
	            "farmId" : instance.farmId
	        }) : JSON.stringify({
    				"id" : instance.sid,
	              "type" : instance.type,
	            "farmId" : instance.farmId,
	              "dgId" : instance.dgId,
	          "clientMac": hdpclient.getClientMac(),
	         "clientName": hdpclient.clientName(),
	           "clientIp": hdpclient.clientIp(),
	      "clientVersion": hdpclient.clientVersion(),
	         "clientType": hdpclient.clientType(),
	         "randomId":randomId
	        }),
            beforeSend: function(XMLHttpRequest){
            	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
			},
	        success : function(msg) {
	        	if (!isVNC) webui.objects.dashbord.urlChecker.checkGetLoginInfoRsp(msg);
	        	else webui.objects.dashbord.urlChecker.checkGetVncLoginInfoRsp(msg);

	        	try
	        	{
		        	if (msg.resultCode != 0)
		        	{
		        		console.log("login vm fail(" + msg.resultCode + ")");
						
						var errorMsg = "";
	        			if (msg.resultCode == ResultCode.code.DESK_PREPARING) errorMsg = LA('VM is preparing') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_VM_ALREADY_LOGINED_BY_OTHER_USER) errorMsg = LA('Other user has logined') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_VM_NOT_EXIT) errorMsg = LA('VM not exist') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_NOT_VALID_VM_IN_DG) errorMsg = LA('Have not free VM in pool') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_RUN_VM_ERROR) errorMsg = LA('VM can not run') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_LICEN_OVER) errorMsg = LA('License not enough') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_GET_LICENINFO_ERROR) errorMsg = LA('License information error') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_CALL_LICEN_ERROR) errorMsg = LA('License service error') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.DESKLOGIN_LIC_EXPIRES) errorMsg = LA('License timeout') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == ResultCode.code.VNCGATE_INVALID) errorMsg = LA('VNCGateway Invalid') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == 28104012) errorMsg = LA('timeStampError') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == 28104013) errorMsg = LA('noAuthen') + '(' + msg.resultCode + ')';
	        			else if (msg.resultCode == 400207) errorMsg = LA('NoApp for Pool VM') + '(' + msg.resultCode + ')';
	        			else errorMsg = LA('Can not connect to VM') + '(' + msg.resultCode + ')';
	        			callback(msg.resultCode, errorMsg);
		        	}
		        	else
		        	{
		        		if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
		        		{
		        			clearTimeout(instance.__retryTimer);
		        			instance.__retryTimer = 0;
		        		}
		        		
        				if ((null != msg.randomId && '' != msg.randomId && undefined != msg.randomId)
								&& (msg.randomId != randomId)) 
				          {
        					//1225代表请求与响应不匹配
		        			errorMsg = LA('VM is preparing') + " 1225";
		        			callback(1225, errorMsg);
				          }
        				else
				    	  {	
        					 msg.randomId = randomId;
		        		     isVNC ? callVNCClient(instance, msg, isAutoVncLogin) : callClient(instance, msg);
						     callback(0,"");
				    	  }
					}
				}
				catch(err)
				{
					console.log("connect throw exception:" + err, err.stack ? err.stack : "");
					callback(-1,LA('Internal Error'));
				}
	        },
	        error : function(msg,ret) {
	        	// 前后台通讯错误则直接报错
        		if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
        		{
        			clearTimeout(instance.__retryTimer);
        			instance.__retryTimer = 0;
        		}
	            console.log("connect error(%s).", ret);
	            callback(-2,LA('Connect to VM failed'));
	        }
    	});
    }

    //尝试正常连接虚拟机
    function tryconnectVm(instance)
    {
    	console.log("tryconnectVm normal enter.");
    	//使用VNC登录失败，这时候需要使用正常的WI进行登录，并且有重试
		tryConnect(instance, false, true, function(errorCode, errorText)
		{
			var tryDate = (new Date()).getTime();
			function retryConnect()
			{
				var tryCountLong = (new Date()).getTime();
				console.log("tryConnect VM normal continueTime = " + (tryCountLong - tryDate));
				tryConnect(instance, false, true, function(errorCode, errorText){
					if (errorCode != 0)
					{
						if (!(errorCode == ResultCode.code.DESK_PREPARING || errorCode == ResultCode.code.DESKLOGIN_PRE_RETURN_FAIL) || tryCountLong - tryDate >= webui.system.retryTimeout)
						{
							cancelConnectingStatus(instance);
							instance.__connecting = false;
							showMsgTip(instance, errorText, function(){});
						}
						else
						{
							setTimeout(function(){retryConnect();}, webui.system.retryConnectHDPTime);
						}
					}
					else
					{
						cancelConnectingStatus(instance);
						instance.__connecting = false;
					}
				});
			}
			setTimeout(function(){retryConnect();}, webui.system.retryConnectHDPTime);
		});
    }
    
    var queryVmStateInterval = 0;
    var queryVmStateBeginTime = 0;
    function connectVmNormal_R21(instance, inputPa)
    {
    	//校验R2插件是否已安装
    	if (webui.objects.dashbord.pluginChecker.isPluginExistR21() == false) {
    		showMsgTip(instance, LA('Please install client first'), function(){});
			return;
		}
    	if (typeof(instance.__connecting) != "undefined" && instance.__connecting != null && instance.__connecting == true) return;
    	setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Loader.gif");
   		instance.__connecting = true;
   		console.log("connect VM_R2 normal.");
   		tryConnect_R21(instance, function(errorCode, errorText){
   			cancelConnectingStatus(instance);
			instance.__connecting = false;
			if (errorCode == "10000601")
			{
				setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Loader.gif");
				showMsgTip(instance, errorText, function(){});
				queryVmStateInterval = 0;
				queryVmStateBeginTime = new Date().getTime();
				setTimeout(function(){
					queryVmState(instance);
	        	}, webui.system.rebootAfterTime);
			}
			else 
			{
				if (errorCode !=0) showMsgTip(instance, errorText, function(){});
			}
		});
    }
    
    function queryVmState(instance)
	{
		//3分钟后停止状态查询
		if (new Date().getTime() - queryVmStateBeginTime > webui.system.connectVmTimeout) {
			console.log("query vm state timeout");
			clearInterval(queryVmStateInterval);
			showMsgTip(instance, LA("Connect Error"), function(){});
    		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
		}else{
			$.ajax({
		        url : webui.objects.dashbord.actionurls.queryVmStatus + "?" + Math.random(), // 加随机数防止缓存
		        type : "POST",
		        headers: { "cache-control": "no-cache"},	
		        dataType : "json",
		        contentType :"application/json",
		        timeout: 300000,
		        data : JSON.stringify({
	  				"id" : instance.sid
		        }),
		        success : function(msg) {
		        	console.log("query vm state---" + msg.vmStatus);
		        	if (msg.resultCode == "0") {
		        		if (msg.vmStatus != "UNREGISTER") {
		        			clearInterval(queryVmStateInterval);
		        			setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
	        				showMsgTip(instance, LA("VM Is Ready"), function(){});
						}
		        		else{
		        			if (queryVmStateInterval == 0) {
			        			queryVmStateInterval = setInterval(function(){
			        				queryVmState(instance);
								}, webui.system.vmStateQueryTime);
							}
		        		}
					}
		        	else if (msg.resultCode == "10000802") {
		        		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
        				showMsgTip(instance, LA('10000802_L') + instance.name + LA('10000802_R') + '(' + msg.resultCode + ')', function(){});
					}else{
						setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
	    				showMsgTip(instance, LA("Query VM state error"), function(){});
					}
		        },
		        error : function() {
		        	console.log("query vm state error");
		        	setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
    				showMsgTip(instance, LA("Query VM state error"), function(){});
		        }
	    	});
		}
	}
    
    
	function connectVmNormal(instance, inputPa)
	{
		
		if (webui.objects.dashbord.pluginChecker.isPluginExist() == false)
		{
			showMsgTip(instance, LA('Please install client first'), function(){});
			return;
		}
		if (typeof(instance.__connecting) != "undefined" && instance.__connecting != null && instance.__connecting == true) return;
		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Loader.gif");
   		instance.__connecting = true;
   		console.log("connect VM normal.");
   			
		tryConnect(instance, false, true, function(errorCode, errorText){
			if (errorCode < 0 || errorCode == ResultCode.code.DESK_PREPARING || errorCode == ResultCode.code.DESKLOGIN_PRE_RETURN_FAIL || errorCode == ResultCode.code.DESKLOGIN_GET_VNCINFO_ERROR)
			{
				//使用正常的WI登录失败，需要使用VNC进行登录，并且VNC登录失败需要重试
				console.log("tryConnect VM by vnc.");
				var tryVNCCount = 0;
				function retryConnectByVNC()
				{
					tryVNCCount++;
					console.log("retryConnect VM by vnc ,retryConnectCount = " + tryVNCCount);
					tryConnect(instance, true, true, function(errorCode, errorText){
						if (errorCode != 0 && errorCode != ResultCode.code.VNCGATE_INVALID)
						{
							if (tryVNCCount >= webui.system.config.retryConnectVNCCount)
							{
								//使用vnc登录失败，尝试正常连接虚拟机，重试3分钟
								tryconnectVm(instance);
							}
							else
							{
								setTimeout(function(){retryConnectByVNC();}, webui.system.retryConnectVNCTime);
							}
						}
						else
						{
							//使用VNC登录成功，这时候需要使用正常的WI进行登录，并且有重试
							tryconnectVm(instance);
						}
					});
				}
				console.log("retryConnect VM by vnc ,retryConnectCount = " + webui.system.config.retryConnectVNCCount);
				//当前WI启动过程中默认不弹出VNC
				if (webui.system.config.retryConnectVNCCount != 0)
				{
					//如果VNC重试次数为0，则启动过程中不弹出VNC，否则进行第一次尝试连接
					setTimeout(function(){retryConnectByVNC();}, webui.system.retryConnectVNCTime);
				}
				else
				{
					tryconnectVm(instance);
				}
			}
			else 
			{
				cancelConnectingStatus(instance);
				instance.__connecting = false;
				if (errorCode !=0) showMsgTip(instance, errorText, function(){});
				else 
				{
				}
			}
		});
	}
	
	function connectVNC(instance)
	{
		if (webui.objects.dashbord.pluginChecker.isPluginExist() == false)
		{
			showMsgTip(instance, LA('Please install client first'), function(){});
			return;
		}

		//经协商,虚拟机在连接过程中,也可以打开VNC,避免长时间处理连接中,用户也不能做任何操作
		instance.__connecting = true;
		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Loader.gif");
		
		tryConnect(instance, true, false, function(errorCode, errorText)	{
	   		cancelConnectingStatus(instance);
	   		instance.__connecting = false;
			if (errorCode != 0) showMsgTip(instance, errorText, function(){});
			else 
			{
			}
		});
	}
	
	// 停止连接，用于连接完毕或失败后调用，如果连接还在进行，会终止
	function cancelConnectingStatus(instance)
	{
		if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
  		{
  			clearTimeout(instance.__retryTimer);
  			instance.__retryTimer = 0;
  		}
  		if (typeof(instance.__connectAjaxer) != "undefined" && instance.__connectAjaxer != null && instance.__connectAjaxer != 0)
  		{
  			instance.__connectAjaxer.abort();
  			instance.__connectAjaxer = 0;
  		}
  		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
	}
	
	// 切换option
	function togglePannel(instance)
	{
		instance.ele.find(".vmOptionPannel").toggle();
	}
	
	// 隐藏option
	function hidePannel(instance)
	{
		instance.ele.find(".vmOptionPannel").hide();
	}
	
	var rebootBeginTime = 0;
	var intervalIndex = 0;
	
	// 重启机器, isForce代表是否强制重启(true, false)
	function reboot(instance, isForce)
	{
		showMsgTip(instance, LA("Rebooting VM"), function(){});
		
		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Loader.gif");
      		// 发起ajax请求
	    	$.ajax({
		        url : webui.objects.dashbord.actionurls.reboot, // 加随机数防止缓存
		        type : "POST",
		        headers: { "cache-control": "no-cache"},	
		        dataType : "json",
		        contentType :"application/json",
		        timeout: 300000,
		        data : JSON.stringify({
      				"sid" : instance.sid,
		            "isForceReboot": isForce
		        }),
                beforeSend: function(XMLHttpRequest){
                	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
				},
		        success : function(msg) {
		        	if (msg != null && msg != "undefined" && msg != "") {
			        	if (msg.resultCode == 0)
			        	{
			        		intervalIndex = 0;
			        		rebootBeginTime = new Date().getTime();
			        		setTimeout(function(){
			        			getVmStateIsReady(instance, isForce);
				        	}, webui.system.rebootAfterTime);
			        	}
			        	else
			        	{
			        		if (instance.vmVersion == "R21") {
			        			showRebootMsg(instance, msg.resultCode, isForce);
							}else if (instance.vmVersion == "R51") {
								showMsgTip(instance, LA(isForce ? "Force reboot VM failed" : "Reboot VM failed"), function(){});
				        		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
							}
			        	}
					}
		        	else
					{
		        		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
		        		if (instance.vmVersion == "R21") {
		        			showMsgTip(instance, LA(isForce ? "Force RebootOtherCode" : "RebootOtherCode"), function(){});
						}else if (instance.vmVersion == "R51") {
			        		showMsgTip(instance, LA(isForce ? "Force reboot VM failed" : "Reboot VM failed"), function(){});
						}
		        		
					}
		        },
		        error : function(msg,ret) {
		        	setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
	        		if (instance.vmVersion == "R21") {
	        			showMsgTip(instance, LA(isForce ? "Force RebootOtherCode" : "RebootOtherCode"), function(){});
					}else if (instance.vmVersion == "R51") {
		        		showMsgTip(instance, LA(isForce ? "Force reboot VM failed" : "Reboot VM failed"), function(){});
					}
		        	console.log(isForce ? "force reboot vm" : "reboot vm" + instance.sid + "error(" + ret + ")");
		        }
	    	});
	}
	function showRebootMsg(instance, resultCode, isForce)
	{
		if (resultCode == "10000501" || resultCode == "10000502" || resultCode == "17000003" || resultCode == "17000004") {
			showMsgTip(instance, LA(resultCode), function(){});
		}
		else{
			showMsgTip(instance, LA(isForce ? "Force RebootOtherCode" : "RebootOtherCode"), function(){});
		}
		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
	}
	
	function getVmStateIsReady(instance, isForce)
	{
		//3分钟后停止状态查询
		if (new Date().getTime() - rebootBeginTime > webui.system.vmStateQueryTimeout) {
			console.log("query vm state timeout");
			clearInterval(intervalIndex);
			if (instance.vmVersion == "R21") {
				showMsgTip(instance, LA(isForce ? "Force RebootOtherCode" : "RebootOtherCode"), function(){});
			}else{
				showMsgTip(instance, LA(isForce ? "Force reboot VM failed" : "Reboot VM failed"), function(){});
			}
    		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
		}else{
			$.ajax({
		        url : webui.objects.dashbord.actionurls.queryVmStatus + "?" + Math.random(), // 加随机数防止缓存
		        type : "POST",
		        headers: { "cache-control": "no-cache"},	
		        dataType : "json",
		        contentType :"application/json",
		        timeout: 300000,
		        data : JSON.stringify({
	  				"id" : instance.sid
		        }),
		        success : function(msg) {
		        	console.log("query vm state---" + msg.vmStatus);
		        	if (msg.resultCode == 0) {
		        		if (msg.vmStatus == null || msg.vmStatus == "UNREGISTER") {
			        		if (intervalIndex == 0) {
			        			intervalIndex = setInterval(function(){
									getVmStateIsReady(instance, isForce);
								}, webui.system.vmStateQueryTime);
							}
			        	}else{
			        		clearInterval(intervalIndex);
			        		setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
	        				showMsgTip(instance, LA("VM Is Ready"), function(){});
			        	}
					}else{
						setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
	    				showMsgTip(instance, LA("Query VM state error"), function(){});
					}
		        },
		        error : function() {
		        	console.log("query vm state error");
		        	setLoadingImg("spinner_"+instance.ele.attr("id"), "/uns/darkblue/img/Transparent32.gif");
    				showMsgTip(instance, LA("Query VM state error"), function(){});
		        }
	    	});
		}
	}
	
	function inLoading(instance)
	{
		instance.ele.find(".vmLoading").fadeIn(200);
	}
	
	function outLoading(instance)
	{
		instance.ele.find(".vmLoading").fadeOut(200);
	}
	
	function setHdaVersion(instance, version)
	{
		instance.hdaVersion = version;
	}
	
	function setFarmId(instance, farmId)
	{
		instance.farmId = farmId;
	}
	
	function setInMaintenanceMode(instance, inMaintenanceMode)
	{
		instance.inMaintenanceMode = inMaintenanceMode;		
	}
	
	function setLoadingImg(eleId, imgUrl){
		var loadImgObj = $(document.getElementById(eleId));
		loadImgObj.attr("src", imgUrl);
	}
	function setButtonDisplay(sure, restart, forceRestart, cancel){
		if (sure) {
			$("#sureButtonPane").show();
		}else{
			$("#sureButtonPane").hide();
		}
		if (restart) {
			$("#okButtonPaneGentle").show();
		}else{
			$("#okButtonPaneGentle").hide();
		}
		if (forceRestart) {
			$("#okButtonPaneForce").show();
		}else{
			$("#okButtonPaneForce").hide();
		}
		if (cancel) {
			$("#cancelButtonPane").show();
		}else{
			$("#cancelButtonPane").hide();
		}
		
	}
	
	// 虚拟机类构造
	webui.classspace.dashbord.Vm = function(inputPa) // 入参:{name:显示的名字, sid:sid, isActive:true|false, isPool:true|false, farmId:xxx,vmDomain:xxx, dgId:xxx, dgName: xxxx}
	{
		// 初始化instance
		var vmId = "vm_" + inputPa.sid;
		var instance = {"vmId": vmId};
		instance.name = inputPa.name;
		instance.sid = inputPa.sid;
		instance.farmId = inputPa.farmId;
		instance.vmDomain = inputPa.vmDomain;
		instance.inMaintenanceMode = inputPa.inMaintenanceMode;
		instance.dgId = inputPa.dgId;
		instance.dgName = inputPa.dgName;
		instance.isPool = inputPa.isPool;
		instance.ele = appendHtmlForVm(inputPa.type, inputPa.isFistStaticGroup, vmId, inputPa.name, inputPa.isPool, inputPa.inMaintenanceMode, inputPa.vmVersion, inputPa.groupName);
		instance.hdaVersion = inputPa.hdaVersion;
		instance.type = inputPa.type;
		instance.vmVersion = inputPa.vmVersion;
		
		// 暴露方法
		this.showPreparing = function(){showPreparing(instance)};
		this.hidePreparing = function(){hidePreparing(instance)};
		this.release = function(){releaseVm(instance);};
		this.connect = function(){connectVmNormal(instance, inputPa);};
		this.tip = function(text, callback){showTip(instance, text, callback);};
		this.setHdaVersion = function(version){setHdaVersion(instance, version);};
		this.setFarmId = function(farmId){setFarmId(instance, farmId);};
		this.setInMaintenanceMode = function(inMaintenanceMode){setInMaintenanceMode(instance, inMaintenanceMode);};
		
		if (inputPa.vmVersion == "R21") {
		    $("#sureButtonPane").hide();
			// 绑定行为
			instance.ele.find(".desktopScreenContainer").unbind("click").click(function(){	
				clearResourceFeedback();
				//R2版本虚拟机登陆
			    if(instance.inMaintenanceMode == "2") 
				{
			    	setButtonDisplay(true, false, false, true);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
				    $("#cancelButtonPane").hide();
				}else{
					 connectVmNormal_R21(instance, inputPa);
				}
		    });
			instance.ele.find(".desktopName").unbind("click").click(function(){	
				clearResourceFeedback();
				//R2版本虚拟机登陆
			    if(instance.inMaintenanceMode == "2") 
				{
			    	setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
				}else{
					 connectVmNormal_R21(instance, inputPa);
				}
		    }); 
			instance.ele.find(".desktopRestartDiv").unbind("click").click(function(){		
				//R2版本虚拟机重启
				clearResourceFeedback();
				if(instance.inMaintenanceMode == "2") 
			    {
					setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
			    }else{
			    	setButtonDisplay(false, true, true, true);
					$("#okButtonPaneForce").css("margin-left", "0px");
				    showMsgConfirm(LA("ConfirmReboot") + instance.name + '"?', LA("unsavedMayBeLost"));
				    $("#okButtonPaneGentle").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	reboot(instance, false);
				    });
				    $("#okButtonPaneForce").unbind("click").click(function(){
				    	setButtonDisplay(true, false, false, true);
				    	showMsgConfirm(LA("ConfirmForceReboot"), "");
				    	$("#sureButtonPane").unbind("click").click(function(){
				    		$("#lightbox").hide();
				    		reboot(instance, true);
				    	});
				    });
				    $("#cancelButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
			    }
			});
		}
		else if (inputPa.vmVersion == "R51") {
			// VM登陆
			instance.ele.find(".desktopScreenContainer").unbind("click").click(function(){	
				clearResourceFeedback();
				if(instance.inMaintenanceMode == "2") 
				{
					setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
				}else{
					 connectVmNormal(instance, inputPa);
				}
		    });
			// VM登陆
			instance.ele.find(".desktopName").unbind("click").click(function(){	
				clearResourceFeedback();
				if(instance.inMaintenanceMode == "2") 
				{
					setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
				}else{
					 connectVmNormal(instance, inputPa);
				}
		    }); 
			// 自助维护
			instance.ele.find(".vncLoginClass").unbind("click").click(function(){
				closeMoreMune();
				clearResourceFeedback();
				instance.ele.find(".moreClass").hide();
				if(instance.inMaintenanceMode == "2") 
			    {
					setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
			    }else{
				    connectVNC(instance);
			    }
		    });
			
			instance.ele.find(".a_restart").unbind("click").click(function(){
				clearResourceFeedback();
				if(instance.inMaintenanceMode == "2") 
			    {
					setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
			    }else{
			    	setButtonDisplay(true, false, false, true);
				    showMsgConfirm(LA("ConfirmReboot") + instance.name + '"?', LA("unsavedMayBeLost"));
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	reboot(instance, false);
				    });
				    $("#cancelButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    });
			    }
			});
			
			instance.ele.find(".reBootClass").unbind("click").click(function(){
				closeMoreMune();
				clearResourceFeedback();
				if(instance.inMaintenanceMode == "2") 
			    {
					setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	instance.ele.find(".moreClass").hide();
				    });
			    }else{
			    	setButtonDisplay(true, false, false, true);
				    showMsgConfirm(LA("ConfirmReboot") + instance.name + '"?', LA("unsavedMayBeLost"));
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	instance.ele.find(".moreClass").hide();
				    	reboot(instance, false);
				    });
				    $("#cancelButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	instance.ele.find(".moreClass").hide();
				    });
			    }
			});
			instance.ele.find(".forceReBootClass").unbind("click").click(function(){
				closeMoreMune();
				clearResourceFeedback();
				if(instance.inMaintenanceMode == "2") 
			    {
					setButtonDisplay(true, false, false, false);
					showMsgConfirm(LA("InMaintenanceMode Connect Tip"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	instance.ele.find(".moreClass").hide();
				    });
			    }else{	
			    	setButtonDisplay(true, false, false, true);
			    	showMsgConfirm(LA("ConfirmForceReboot"), "");
				    $("#sureButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	instance.ele.find(".moreClass").hide();
				    	reboot(instance, true);
				    });
				    $("#cancelButtonPane").unbind("click").click(function(){
				    	$("#lightbox").hide();
				    	instance.ele.find(".moreClass").hide();
				    });
			    }
			});
			instance.ele.find(".power_set").unbind("click").click(function(){
				closeMoreMune();
				$("#powerControlDiv").hide();
				webui.objects.dashbord.powerSet.show(instance.sid, instance.name, instance.vmDomain, instance.dgName, function(result){
					if (result != "<Ok>") showMsgTip(instance, LA("Set power policy failed"), function(){});
					else showMsgTip(instance, LA("Set power policy success"), function(){});
				});
			});
			instance.ele.find(".hdaVersion").unbind("click").click(function(){
				webui.objects.dashbord.messageBox.show(instance.name, LA("HDA Version:") + instance.hdaVersion, "<Ok>", function(result){});
			});
			
			// 初始化
			if (inputPa.isActive == false) this.showPreparing();
			// 设置是否系统是应急模式
			if (instance.inMaintenanceMode == "1")
			{
				webui.system.config.isEmergencyLogon = 1;
			}
		}
	};
})();

// 虚拟机管理对象，webui.objects.dashbord.vmMgr，定义过程利用匿名函数保护，不让内部函数与变量外泄
(function(){
	var instance = {}; // 实例对象
	instance.JSS = new webui.classspace.base.JSS();
	instance.vms = {};
	var inLoop = 0;
	var vmIndex = 0;
	
	function addVm(vmInfo) // {farmId:xxx, sid:xxx, name:xxx, type:singleVm|vmGroup, state:UNREGISTER|REGISTERED|CONNECTED|DISCONNECTED, hdaVersion:xxx}
	{
		var vm = instance.vms[vmInfo.sid];
		if (typeof(vm) != "undefined" && vm != null)
		{
			console.log("replacation sid:" + sid);
			return;
		}
		var sid = vmInfo.sid;
		var isActive = true;
		if (vmInfo.state == "UNREGISTER") isActive = false;
		var isPool = false;
		
		//pool模式包括：vmGroup和vmStaticGroup，但是页面为了处理简单，只认为vmGroup这种模式不显示虚拟机的启动重启按钮，对于
		//静态池模式（vmStaticGroup）默认是要显示虚拟机的启动重启按钮，所以静态池模式（vmStaticGroup）的isPool = false
		if (vmInfo.type == "vmGroup") isPool = true;
		
		var vmInstance = new webui.classspace.dashbord.Vm({
			name: vmInfo.name, 
			sid: vmInfo.sid, 
			isActive:isActive, 
			isPool: isPool, 
			type:vmInfo.type,
			inMaintenanceMode: vmInfo.inMaintenanceMode,
			farmId:vmInfo.farmId,
			vmDomain: vmInfo.vmDomain,
			dgId: vmInfo.dgId,
			dgName: vmInfo.dgName,
			hdaVersion: vmInfo.hdaVersion,
			isFistStaticGroup: vmInfo.isFistStaticGroup,
			vmVersion: vmInfo.vmVersion,
			groupName: vmInfo.dgName
		});
		
		var newVm = {};
		newVm.sid = sid;
		newVm.instance = vmInstance;
		newVm.type = "singleVm";
		newVm.state = vmInfo.state;
		newVm.hdaVersion = vmInfo.hdaVersion;
		newVm.farmId = vmInfo.farmId;
		newVm.inMaintenanceMode = vmInfo.inMaintenanceMode;
		instance.vms[sid] = newVm;
	}
	
	function deleteVm(sid)
	{
		var vm = instance.vms[sid];
		if (typeof(vm) == "undefined" || vm == null) return;
		var vmInstance = vm.instance;
		vmInstance.release();
		delete instance.vms[sid];
	}
	
	function refreshVms(method, key, val, data)
	{
		console.log("getvmlist change: " + method + " key=" + key + " val=" + val);
		if (key.match(/^[^\.]+$/)) // 找寻vm或group节点发生的变化
		{
			if (method == "add")
			{
				console.log("add vm:" + key, val.name);
				addVm(val);
			}
			else if (method == "del")
			{
				var vm = instance.vms[key];
				if (typeof(vm) != "undefined" && vm != null)
				{
					console.log("del vm:" + key);
					deleteVm(key);
				}
			}
		}
		else if (key.match(/^[^\.]+\.state/)) // 找寻vm或group状态发生的变化
		{
			if (method != "mod") return;
			var nodeName = (key.match(/^[^\.]+/))[0];
			console.log("vm " + nodeName + " status change:" + val);
			var vm = instance.vms[nodeName];
			if (typeof(vm) != "undefined" && vm != null)
			{
				if (val != "UNREGISTER")
				{
					vm.instance.hidePreparing();
				}
				else
				{
					vm.instance.showPreparing();
				}
			}
		}
		else if (key.match(/^[^\.]+\.hdaVersion/))
		{
			var nodeName = (key.match(/^[^\.]+/))[0];
			console.log("vm " + nodeName + " hdaVersion change:" + val);
			var vm = instance.vms[nodeName];
			if (typeof(vm) != "undefined" && vm != null)
			{
				vm.instance.setHdaVersion(val);
			}
		}
		else if (key.match(/^[^\.]+\.farmId/))
		{
			var nodeName = (key.match(/^[^\.]+/))[0];
			console.log("vm " + nodeName + " farmId change:" + val);
			var vm = instance.vms[nodeName];
			if (typeof(vm) != "undefined" && vm != null)
			{
				vm.instance.setFarmId(val);
			}
		}
		else if (key.match(/^[^\.]+\.inMaintenanceMode/))
		{
			var nodeName = (key.match(/^[^\.]+/))[0];
			console.log("vm " + nodeName + " inMaintenanceMode change:" + val);
			var vm = instance.vms[nodeName];
			if (typeof(vm) != "undefined" && vm != null)
			{
				vm.instance.setInMaintenanceMode(val);
			}
		}
	}
	instance.JSS.setOnChange(refreshVms);
	
	function showWarning(text)
	{
		var warningObj = $("#getVmListError");
		warningObj.find("#getVmListErrorText").text(text);
		warningObj.fadeIn();
	}
	
	function hideWarning()
	{
		var warningObj = $("#getVmListError");
		warningObj.fadeOut();
	}
	
	function getVmIndex()
	{
		return vmIndex;
	}
	
	function setVmIndex(index)
	{
		vmIndex = index; 
	}
	
	function intervalVmList()
	{
		$.ajax({
	        url : webui.objects.dashbord.actionurls.getVmList + "?" + Math.random(), // 加随机数防止缓存
	        type : "POST",
	        headers: { "cache-control": "no-cache"},	
	        dataType : "json",
	        contentType :"application/json",
	        timeout: 300000,
	        data : {},
            beforeSend: function(XMLHttpRequest){
            	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
			},
	        success : function(msg) {
	        	console.log("intervalVmlist success...");
	        },
	        error : function(msg,ret) {
	        	console.log("intervalVmlist error...");
	        }
    	});
	}
	
	// 更新虚拟机列表
	function tryLoop()
	{	
		if (inLoop == 1) return;
		inLoop = 1;
    	$.ajax({
	        url : webui.objects.dashbord.actionurls.getVmList, // 加随机数防止缓存
	        type : "POST",
	        headers: { "cache-control": "no-cache"},	
	        dataType : "json",
	        contentType :"application/json",
	        timeout: 300000,
	        data : {},
            beforeSend: function(XMLHttpRequest){
            	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
			},
	        success : function(msg) {
	        	webui.objects.dashbord.netErrorTiper.hide();
	        	webui.objects.dashbord.urlChecker.checkGetVmListRsp(msg);
	        	inLoop = 0;
	        	setVmIndex(0);
	        	try
	        	{
		        	if (msg.resultCode == 0)
		        	{
		        		var newVms = {};
		        		var vmsNums = 0;
		        		var isExistVersion_R2 = false;
		        		var isExistVersion_R5 = false;
		        		for (var i in msg.vms)
		        		{
		        			var vm = msg.vms[i];
		        			newVms[vm.sid] = vm;
		        			if (isExistVersion_R2 == false && vm.vmVersion == "R21") 
		        			{
		        				isExistVersion_R2 = true;
							}
		        			if (isExistVersion_R5 == false && vm.vmVersion == "R51") 
		        			{
		        				isExistVersion_R5 = true;
							}
		        			vmsNums++;
		        		}
		        		if (vmsNums == 0) {
							$(".applistMessageStyleInfo").text(LA("User dot VM"));
							$(".applistMessageStyleInfo").show();
						}
		        		instance.JSS.refresh(newVms);
		        		
		        		//当虚拟机超过3台时设置显示移动图标
		        		jCarouselLite(vmsNums);
		        		$("#foot_mbox").find(".com_box").css("width","785px");
		        		//检查插件
		        		webui.objects.dashbord.pluginChecker.begin(isExistVersion_R2, isExistVersion_R5);
		        		
		        		if ("on" == webui.system.config.autoConnectVm && "true" == isFirstLogin)
		        		{
		
		        			if ("undefined" != typeof(msg.vms) && msg.vms.length == 1)
			        		{

			        		}
		        			else if ("undefined" == typeof(msg.vms))
		        			{
		        			}
		        		}
		        	}
		        	else
		        	{
		        		console.log("get vm list failed(%s).", msg.resultCode);
		        		if (msg.resultCode == ResultCode.code.SESSION_INVALID || msg.resultCode == 10001 || msg.resultCode == ResultCode.code.PARAMETER_INVALID
		        				|| msg.resultCode == 60021 || msg.resultCode == 60022) // 会话无效
		        		{
		        			webui.objects.dashbord.system.logout();
		        		}
					}
				}
				catch(err)
				{
					console.log("get vm throw exception:" + err, err.stack ? err.stack : "");
				}
	        },
	        error : function(msg,ret) {
	        	inLoop = 0;
	        	console.log("get vm list error(%d, %s).", msg.readyState, ret);
				if (ret == "timeout" || ret == "error") 
				{
					setTimeout(function(){
						$.ajax({
			        		url : commonvar.serviceUrl.versionPage + "?" + Math.random(), // 因为第一次产生ajax断网有可能是页面跳转等原因引起，不属于错误，再次读取某个简单url，确认网络是否通畅
			        		success: function(){},
			        		error: function(msg2,ret2)
			        		{
			        			if (ret2 == "timeout" || ret2 == "error") webui.objects.dashbord.netErrorTiper.show(LA("Network Error"));
			        		}
			        	});
		        	}, 0);
				}
	        }
    	});
	}
	
	function jCarouselLite(vmsNums)
	{
		//当虚拟机列表的数量大于3个时 开启滚动图标按钮
    	if(vmsNums > 3){
    		document.getElementById("btn_l").style.visibility = "visible";
    		document.getElementById("btn_r").style.visibility = "visible";
    	}else{
    		document.getElementById("btn_l").style.visibility = "hidden";
    		document.getElementById("btn_r").style.visibility = "hidden";
    	}
		$(".com_box").jCarouselLite({
			btnNext : ".btn_r",
			btnPrev : ".btn_l",
			visible : 3,
			speed : 500,
			circular : false
		});
	}

	// 开始运行虚拟机管理，主要工作为轮询后台虚拟机列表信息，处理虚拟机的增删以及状态改变
	function begin()
	{
		tryLoop();
		// 每隔3分钟调用后台虚拟机列表接口一次(不做任何处理)
		setInterval(function(){
			intervalVmList();
		}, 3000*60);
	}
	
	webui.objects.dashbord.vmMgr = {
		begin: begin, // 开始运行
		end: function(){}, // 停止运行
		getVmIndex: getVmIndex,
		setVmIndex: setVmIndex,
		tryLoop: tryLoop // 尝试刷新虚拟机列表以及状态
	};
})();

// 构造Option对象,负责选项区域
(function(){
	var isShow = 0;
	
	function showOption()
	{
		$("#optionArea").show();
		isShow = 1;
	}
	
	function hideOption()
	{
		$("#optionArea").hide();
		isShow = 0;
	}
	
	function toggleOption()
	{
		if (isShow != 0)
		{
			hideOption();
		}
		else
		{
			showOption();
		}
	}
	
	function logout()
	{
		webui.objects.dashbord.system.logout();
		return false;
	}
	
	function begin()
	{
		$("#logoutAreaLogoutLink").click(logout);
		$("#logoutAreaLogoutLink").attr("title", LA("Logout"));
		$("#setLangAndBg").attr("title", LA("Set language and background"));
		initPanleLangValue();
	}
	
	webui.objects.dashbord.optioner = {
		begin: begin, // 开始运行
		end: function(){} // 停止运行
	};
})();

// 构造界面弹出对象管理对象webui.objects.dashbord.popupMgr
(function(){
	var instance = {};
	instance.pops = {};
	
	function isParent(domP, domS) // 判断dom对象domP是否是domS的父对象
	{
		var domSP = $(domS).parent()[0];
		while(typeof(domSP) != "undefined" && domSP != null)
		{
			if (typeof(domSP) != "undefined" && domSP != null)
			{
				if (domSP === domP) return true;
			}
			domSP = $(domSP).parent()[0];
		}
		return false;
	}
	
	function register(id, doms, disappearCallback) // dom代表需要不需要触发popup对象消失doms对象(包含所有子对象)，disappearCallback代表（调用时this对象为此时传入的doms）
	{
		instance.pops[id] = {'doms': doms, 'disappearCallback': disappearCallback};
	}
	
	function unregister(id)
	{
		if (typeof(instance.pops[id]) != "undefined" && instance.pops[id] != null)
		{
			delete instance.pops[id];
		}
	}
	
	function begin()
	{
		// 绑定行为
		$(document).mousedown(function(event){
			for (var poper in instance.pops)
			{
				var callback = instance.pops[poper].disappearCallback;
				var doms = instance.pops[poper].doms;
				var willPass = false;
				for (var i in doms)
				{
					var dom = doms[i];
					if (dom ==event.target || isParent(dom, event.target)) willPass = true;
				}
				if (!willPass) callback.call(doms);
			}
		});
	}
	
	webui.objects.dashbord.popupMgr = 
	{
		begin: begin,
		register: register,
		unregister: unregister
	};
})();


// 构造插件检查对象webui.objects.dashbord.pluginChecker
(function(){
	var pluginExist = false;
	var pluginExistR21 = true;
	
	function checkOs()
	{
		var os_type = null;
		
		windows = (navigator.userAgent.indexOf("Windows",0) != -1)?true:false;
		linux = (navigator.userAgent.indexOf("Linux",0) != -1)?true:false;
	 
		if (windows) os_type = "Windows";// another:"Apple mac","Unix";
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
	
	// 得到插件版本
	function getPluginVersion()
	{
		if (/^.*hwcloud\((.*)\)/.test(navigator.appVersion))
		{
			var ver= navigator.appVersion;
			var ver = ver.replace(/^.*hwcloud\((.*?)\).*$/, "$1");
			return ver;
		}
		if (/^.*hwcloud\((.*)\)/.test(navigator.userAgent))
		{
			var ver= navigator.userAgent;
			var ver = ver.replace(/^.*hwcloud\((.*?)\).*$/, "$1");
			return ver;
		}
		for(var i=0; i<navigator.plugins.length; i++){
		      if(/^.*hwcloud\((.*)\)/.test(navigator.plugins[i].name)){
		             var ver = navigator.plugins[i].name;
		             ver = ver.replace(/^.*hwcloud\((.*?)\).*$/, "$1");
		             console.log(ver);
		             return ver;
		      }
		}
		return "";
	}
	
	function checkNetIsInstall(r2ClientIsInstall)
	{
		$("#downLoadR2Net").attr("href", "/plugin/Clients/connectTools.exe");
		
		var result = navigator.userAgent.match(/.NET CLR [0-9.]+/g);
	     if(result == null)
	     {
	    	//firefox检测不到，返回null，当R2插件已经安装时，默认.net已经安装
	    	 if (r2ClientIsInstall == 1) {
	    		 return 1;
	    	 }else{
	    		 return 0;
	    	 }
	     }
	     else
	     {
	         var str = result.toString();
	         if(str.indexOf("3.5") == -1)
	          { 
	              return 0;
	          }
	     }
	     return 1;
	}
	
	function begin(isExistVersion_R2, isExistVersion_R5)
	{
		console.log("user agent is:", navigator.userAgent);
		console.log("user agent is:", navigator.appVersion);
		
		var r2ClientIsInstall = 0;
		var r5ClientIsInstall = 0;
		var r2NetIsInstall = 0;
		var downloadClient = $("#downloadDiv");
		var nosupportTip = $("#nosupportTip");
		var linkthree = $("#linkthree");
		var clientVersionTip = $("#clientVersionTip");
		clientVersionTip.text(LA("clientVersionNoOrLow"));
		linkthree.text(LA("Nosupport"));
		$("#dealWithOne").text(LA("InstallAndRestartBrowser"));
		$("#dealWithTwo").text(LA("goonlogin"));
		
		var os = checkOs();
		console.log("checked os is" , os);
		if (os == "Windows")
		{
			$("#downLoadR5").attr("href", "/plugin/WindowsClientSetup.msi");
			$("#downLoadR2").attr("href", "/plugin/Clients/huaweiDesktop.exe");
		}
		else if (os == "Linux")
		{
			$("#downLoadR5").attr("href", "/plugin/LinuxClientSetupX86.bin");
			pluginExistR21 = true;
			r2ClientIsInstall = 1;
		}
		else
		{
			downloadClient.hide();
			setTimeout(function(){
				nosupportTip.fadeIn();
			}, 2000);
			return;
		}
		
		if (isExistVersion_R2) {
			//检测R2插件是否安装（在火狐版本高于21时检测不到）
			var result = SilentDetection.run();
			if (result.remoteClient == null || result.remoteClient == "") {
				r2ClientIsInstall = 0;
				
			}else{
				pluginExistR21 = true;
				r2ClientIsInstall = 1;
			}
			
			//检测.net插件
			r2NetIsInstall = checkNetIsInstall(r2ClientIsInstall);
			
			//.net安装包中包含了R2的插件包，所以当没有检测到.net插件时，只需要安装.net包就可以了
			if (r2NetIsInstall == 0) {
				r2ClientIsInstall = 1;
			}
		}
		else 
		{
			r2ClientIsInstall = 1;
			r2NetIsInstall = 1;
		}
		if (isExistVersion_R5) {
			
			if (os == "Windows")
			{
				if (checkPlugin(/hwcloud/))
				{
					//标志客户端已安装标志位
					pluginExist = true;
					r5ClientIsInstall = 1;
				}
				else
				{
					r5ClientIsInstall = 0;
				}
			}
			else if (os == "Linux")
			{
				pluginExist = true;
				r5ClientIsInstall = 3;
			}
			
			var clientversion = hdpclient.clientVersion();
			if (null == clientversion || '' == clientversion || undefined == clientversion)
			{
				r5ClientIsInstall = 0;
			}
			else if (clientversion < webui.system.clientVersion)
			{
				//标志客户端已安装标志位
				pluginExist = true;
				r5ClientIsInstall = 2;
				
				if (os == "Windows")
				{
					r5ClientIsInstall = 2;
				}
				else if (os == "Linux")
				{
					r5ClientIsInstall = 3;
				}
			}
			else
			{
				//clientversion不为空,认为客户端已安装
				//防止出现checkplugin不存在的情况
				pluginExist = true;
				r5ClientIsInstall = 1;
			}
		}
		else
		{
			r5ClientIsInstall = 1;
		}
		if (os == "Linux") {
			if (r5ClientIsInstall != 1) {
				$("#downLoadR2").text("");
				$("#downLoadR2Net").text("");
				$("#downLoadR5").text("");
				$("#dealWithOne").text(LA("contactAdministrator"));
				setTimeout(function(){
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}else{
				downloadClient.hide();
			}
		}else{
			if (r2ClientIsInstall == 1 && r5ClientIsInstall == 1 && r2NetIsInstall ==1) {
				$("#linkone").hide();
				$("#linktwo").hide();
				downloadClient.show();
				nosupportTip.hide();
			}else if (r2ClientIsInstall != 1 && r5ClientIsInstall == 1 && r2NetIsInstall ==1) {
				$("#downLoadR2").text(LA("clickDownload"));
				$("#downLoadR5").text("");
				$("#downLoadR2Net").text("");
				setTimeout(function(){
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}else if (r2ClientIsInstall == 1 && r5ClientIsInstall != 1 && r2NetIsInstall ==1) {
				$("#downLoadR2").text("");
				$("#downLoadR2Net").text("");
				$("#downLoadR5").text(LA("clickDownload"));
				setTimeout(function(){
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}else if (r2ClientIsInstall == 1 && r5ClientIsInstall == 1 && r2NetIsInstall !=1) {
				$("#downLoadR2").text("");
				$("#downLoadR5").text("");
				$("#downLoadR2Net").text(LA("clickDownload"));
				setTimeout(function(){
					$("#linkone").show();
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}else if (r2ClientIsInstall != 1 && r5ClientIsInstall != 1 && r2NetIsInstall ==1) {
				$("#downLoadR2").text(LA("clickDownload1"));
				$("#downLoadR5").text(LA("clickDownload2"));
				$("#downLoadR2Net").text("");
				setTimeout(function(){
					$("#linkone").show();
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}else if (r2ClientIsInstall != 1 && r5ClientIsInstall == 1 && r2NetIsInstall !=1) {
				$("#downLoadR2").text(LA("clickDownload1"));
				$("#downLoadR5").text("");
				$("#downLoadR2Net").text(LA("clickDownload2"));
				setTimeout(function(){
					$("#linkone").show();
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}else if (r2ClientIsInstall == 1 && r5ClientIsInstall != 1 && r2NetIsInstall !=1) {
				$("#downLoadR2").text("");
				$("#downLoadR5").text(LA("clickDownload1"));
				$("#downLoadR2Net").text(LA("clickDownload2"));
				setTimeout(function(){
					$("#linkone").show();
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}else{
				$("#downLoadR2").text(LA("clickDownload1"));
				$("#downLoadR5").text(LA("clickDownload2"));
				$("#downLoadR2Net").text(LA("clickDownload3"));
				setTimeout(function(){
					$("#linkone").show();
					downloadClient.fadeIn();
				}, 2000);
				nosupportTip.hide();
			}
		}
	}
	
	function isPluginExist()
	{
		return pluginExist;
	}
	
	function isPluginExistR21()
	{
		return pluginExistR21;
	}
	
	webui.objects.dashbord.pluginChecker =
	{
		begin: begin,
		isPluginExist: isPluginExist,
		isPluginExistR21: isPluginExistR21
	};
})();

// 构造全局提示框对象webui.objects.dashbord.messageBox
(function(){
	var g_callback = null;
	
	// 显示对话框，titile为标题，text为内容，buttons为所需要的按钮，格式为一个字符串用<>将所需的按钮名字包含，如<Ok><Canncel><Ignore>
	// callback为外部回调，格式为callback(result)，result为用户点击按钮的名字，点击x固定返回<Canncel>
	function show(title, text, buttons, callback)
	{
		if (typeof(g_callback) != "undefined" && g_callback != null) g_callback("<Canncel>");
		g_callback = callback;
		
		$("#messageBox").find(".globalDialogTitle").text(title);
		$("#messageBox").find("#globalConfirmTipText").text(text);
		if (buttons.indexOf("<Ok>", 0) != -1) $("#messageBox").find(".globalDialogOk").show(); else $("#messageBox").find(".globalDialogOk").hide();
		if (buttons.indexOf("<Canncel>", 0) != -1) $("#messageBox").find(".globalDialogCanncel").show(); else $("#messageBox").find(".globalDialogCanncel").hide();
		if (buttons.indexOf("<Ignore>", 0) != -1) $("#messageBox").find(".globalDialogIgnore").show(); else $("#messageBox").find(".globalDialogIgnore").hide();
		$("#messageBox").show();
	}
	
	function hide(result)
	{
		$("#messageBox").hide();
		g_callback(result);
		g_callback = null;
	}
	
	function begin()
	{
		// 绑定行为
		$("#messageBox").find(".globalDialogClose").click(function(){hide("<Canncel>")});
		$("#messageBox").find(".globalDialogOkLink").click(function(){hide("<Ok>")});
		$("#messageBox").find(".globalDialogCanncelLink").click(function(){hide("<Canncel>")});
		$("#messageBox").find(".globalDialogIgnoreLink").click(function(){hide("<Ignore>")});
		
		// 翻译按钮语言
		$("#messageBox").find(".globalDialogOkLink").css("background-image", "url(/uns/darkblue/img/dashbord/" + LA("globalConfirmOkLinkuns") + ".png)");
		$("#messageBox").find(".globalDialogCanncelLink").css("background-image", "url(/uns/darkblue/img/dashbord/" + LA("globalConfirmCanncelLinkuns") + ".png)");
		$("#messageBox").find(".globalDialogIgnoreLink").css("background-image", "url(/uns/darkblue/img/dashbord/" + LA("globalConfirmIgnoreLinkuns") + ".png)");
	}
	
	webui.objects.dashbord.messageBox = 
	{
		begin: begin,
		show: show
	}
})();

// 构造语言选择对象webui.objects.dashbord.LangChoice
(function(){
	
	function show()
	{
		// 读取当前cookie存储的语言
		var cookieLang = commonvar.getLangType();
		var optionVal = "en";
		if (cookieLang == "zh") optionVal = "zh";
		else if (cookieLang == "ar") optionVal = "ar";
		else optionVal = "en"
		$("#choiceLang").find(".langSelector").val(optionVal);
		
		$("#choiceLang").show();
	}
	
	function hide(result)
	{
		$("#choiceLang").hide();
		var optionVal = $("#choiceLang").find(".langSelector").val();
		if (result == "<Ok>")
		{
			commonvar.setCookieLang(optionVal);
		    document.location.reload();
		}
	}
	
	function begin()
	{
		// 绑定行为
		$("#choiceLang").find(".globalDialogClose").click(function(){hide("<Canncel>")});
		$("#choiceLang").find(".globalDialogOkLink").click(function(){hide("<Ok>")});
		$("#choiceLang").find(".globalDialogCanncelLink").click(function(){hide("<Canncel>")});
		
		// 翻译提示语言
		$("#choiceLang").find(".globalDialogTitle").text(LA("Choice Language"));
		$("#choiceLang").find(".langZh").text(LA("Simplified Chinese"));
		$("#choiceLang").find(".langEn").text(LA("English"));
		$("#choiceLang").find(".langAr").text(LA("Arabic"));

		// 翻译按钮语言
		$("#choiceLang").find(".globalDialogOkLink").css("background-image", "url(/uns/darkblue/img/dashbord/" + LA("globalConfirmOkLinkuns") + ".png)");
		$("#choiceLang").find(".globalDialogCanncelLink").css("background-image", "url(/uns/darkblue/img/dashbord/" + LA("globalConfirmCanncelLinkuns") + ".png)");
	}
	
	webui.objects.dashbord.LangChoice = 
	{
		begin: begin,
		show: show
	}
})();

// 构造背景选择对象webui.objects.dashbord.bgChoice
(function(){
	
	function show()
	{
		// 读取当前cookie存储的背景
		var cookieImg = $.cookie("darkblue_bgImg");
		var optionVal = "/uns/darkblue/img/backGroundMainE.jpg";
		if (cookieImg != null) optionVal = cookieImg;
		$("#changeBg").find(".bgSelector").val(optionVal);
		$("#changeBg").find(".bgPreview").attr("src", $("#changeBg").find(".bgSelector").val());
		
		$("#changeBg").show();
	}
	
	function hide(result)
	{
		$("#changeBg").hide();
		var optionVal = $("#changeBg").find(".bgSelector").val();
		if (result == "<Ok>")
		{
			if (optionVal == "def") $.cookie("darkblue_bgImg", null, {expires:365,path:'/'});
			else $.cookie("darkblue_bgImg", optionVal, {expires:365,path:'/'});
			$("body").css("background-image", "url(" + optionVal + ")");
		}
	}
	
	function begin()
	{
		// 翻译提示语言
		$("#changeBg").find(".globalDialogTitle").text(LA("Choice Background"));
		$("#changeBg").find(".defBg").text(LA("Default"));
		$("#changeBg").find(".lightBg").text(LA("Light"));
		$("#changeBg").find(".grassBg").text(LA("Grass"));
		$("#changeBg").find(".grassBg2").text(LA("Grass2"));
		$("#changeBg").find(".seaBg").text(LA("Sea"));
		
		// 翻译按钮语言
		$("#changeBg").find(".globalDialogOkLink").css("background-image", "url(/uns/darkblue/img/dashbord/" + LA("globalConfirmOkLinkuns") + ".png)");
		$("#changeBg").find(".globalDialogCanncelLink").css("background-image", "url(/uns/darkblue/img/dashbord/" + LA("globalConfirmCanncelLinkuns") + ".png)");
		
		// 绑定行为
		$("#changeBg").find(".globalDialogClose").click(function(){hide("<Canncel>")});
		$("#changeBg").find(".globalDialogOkLink").click(function(){hide("<Ok>")});
		$("#changeBg").find(".globalDialogCanncelLink").click(function(){hide("<Canncel>")});
		$("#changeBg").find(".bgSelector").change(function(){
			var newName = $("#changeBg").find(".bgSelector").val();
			newName = newName.replace(/\./,"_small.");
			$("#changeBg").find(".bgPreview").attr("src", newName);
		});
		
	}
	
	webui.objects.dashbord.bgChoice = 
	{
		begin: begin,
		show: show
	}
})();

// 构造修改电源管理选项对象webui.objects.dashbord.powerMgr
(function(){
	var m_vmName = null;
	var m_vmDomain = null;
	var m_dgName = null;
	var m_sid = null;
	var __ajaxer = null;
	
	function loading()
	{
		$("#powerMgr").find(".loadingPower").show();
		$("#powerMgr").find(".powerSelector").hide();
		$("#powerMgr").find(".globalDialogButtonsWarp").hide();
		$("#powerMgr").find(".globalDialogClose").hide();
	}
	
	function unloading()
	{
		$("#powerMgr").find(".loadingPower").hide();
		$("#powerMgr").find(".powerSelector").show();
		$("#powerMgr").find(".globalDialogButtonsWarp").show();
		$("#powerMgr").find(".globalDialogClose").show();
	}
	
	function show(sid, vmName, vmDomain, dgName, callback)
	{
		m_vmName = vmName;
		m_vmDomain = vmDomain;
		m_dgName = dgName;
		m_sid = sid;
		var boxEle = $("#powerControlDiv");
		boxEle.show();
		boxEle.find(".globalDialogTitle").text(LA("Power Management:") + vmName);
		// 读取当前的设置
    	$.ajax({
	        url : webui.objects.dashbord.actionurls.getVMsPowerSet, // 加随机数防止缓存
	        type : "POST",
	        headers: { "cache-control": "no-cache"},	
	        dataType : "json",
	        contentType :"application/json",
	        timeout: 300000,
	        data : JSON.stringify({
	        	"sid": m_sid,
	        	"vmDomain": vmDomain,
	        	"computerName": vmName,
	        	"dgName": dgName
	        }),
            beforeSend: function(XMLHttpRequest){
            	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
			},
	        success : function(msg) {
	        	try
	        	{
		        	if (msg.resultCode == 0)
		        	{
		        		var selector = boxEle.find(".powerSelector");
		        		if (msg.customVMUserPolicy == 0) selector.val("none");
		        		else if (msg.customVMUserPolicy == 1) selector.val("all");
		        		else if (msg.customVMUserPolicy == 2) selector.val("sleep");
		        		else if (msg.customVMUserPolicy == 3) selector.val("sr");
		        		else
		        		{
		        			console.log("NOTICE!! VM power policy error:" + msg.customVMUserPolicy);
		        			hide("<Canncel>", callback);
		        			return;
		        		}
		        	}
		        	else
		        	{
		        		console.log("get power failed:", msg.resultCode);
		        		hide("<Canncel>", callback);
					}
				}
				catch(err)
				{
					console.log("get power exception:" + err, err.stack ? err.stack : "");
					hide("<Canncel>", callback);
				}
	        },
	        error : function(msg,ret) {
	        	console.log("get power error:", ret);
	        	hide("<Canncel>", callback);
	        }
    	});			
	}
	
	function hide(result, callback)
	{
		if (result == "<Ok>")
		{
			var selector = $("#powerControlDiv").find(".powerSelector");
			var itemVal = selector.val();
			if (itemVal == "none") itemVal = 0;
			else if (itemVal == "all") itemVal = 1;
			else if (itemVal == "sleep") itemVal = 2;
			else if (itemVal == "sr") itemVal = 3;
			
	    	$.ajax({
		        url : webui.objects.dashbord.actionurls.setVMsPowerSet, // 加随机数防止缓存
		        type : "POST",
		        headers: { "cache-control": "no-cache"},	
		        dataType : "json",
		        contentType :"application/json",
		        timeout: 300000,
		        data : JSON.stringify({
		        	"sid": m_sid,
		        	"domain": m_vmDomain,
		        	"computerName": m_vmName,
		        	"dgName": m_dgName,
		        	"customVMUserPolicy": itemVal
		        }),
                beforeSend: function(XMLHttpRequest){
                	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
				},
		        success : function(msg) {
		        	$("#powerControlDiv").hide();
		        	try
		        	{
			        	if (msg.resultCode == 0)
			        	{
			        		if (typeof(callback) != "undefined" && callback != null) callback("<Canncel>");
			        	}
			        	else
			        	{
			        		console.log("set power failed:", msg.resultCode);
			        		if (typeof(callback) != "undefined" && callback != null) callback("<Canncel>");
						}
					}
					catch(err)
					{
						console.log("set power exception:" + err, err.stack ? err.stack : "");
						if (typeof(callback) != "undefined" && callback != null) callback("<Canncel>");
					}
		        },
		        error : function(msg,ret) {
		        	$("#powerControlDiv").hide();
		        	console.log("set power error:", ret);
		        	if (typeof(callback) != "undefined" && callback != null) callback("<Canncel>");
		        }
	    	});			
		}
		else
		{
			$("#powerControlDiv").hide();
			if (typeof(callback) != "undefined" && callback != null) callback(result);
		}
	}
	
	function begin()
	{
		// 翻译提示语言
		$("#powerControlDiv").find(".powerNone").text(LA("Forbid automatic SHUTDOWN/RESET/SLEEP"));
		$("#powerControlDiv").find(".powerAll").text(LA("Allow automatic SHUTDOWN/RESET/SLEEP"));
		$("#powerControlDiv").find(".powerSleep").text(LA("Allow automatic SLEEP"));
		$("#powerControlDiv").find(".powerSR").text(LA("Allow automatic SHUTDOWN/RESET"));
		
		// 翻译按钮语言
		$("#powerControlDiv").find("#save_power").val(LA("SureButton"));
		$("#powerControlDiv").find("#cancel_power").val(LA("CancelButton"));
		
		// 绑定行为
		$("#powerControlDiv").find("#cancel_power").click(function(){hide("<Canncel>");});
		$("#powerControlDiv").find("#save_power").click(function(){hide("<Ok>");});
		
		$("#dispClose").click(function(){$("#powerControlDiv").hide();});
		
	}
	
	webui.objects.dashbord.powerSet = 
	{
		begin: begin,
		show: show
	}
})();


// 构造断网提示对象webui.objects.dashbord.netErrorTiper
(function(){

	// 显示对话框，titile为标题，text为内容，buttons为所需要的按钮，格式为一个字符串用<>将所需的按钮名字包含，如<Ok><Canncel><Ignore>
	// callback为外部回调，格式为callback(result)，result为用户点击按钮的名字，点击x固定返回<Canncel>
	function show(text)
	{
	}
	
	function hide()
	{
	}
	
	function begin()
	{
	}
	
	webui.objects.dashbord.netErrorTiper = 
	{
		begin: begin,
		show: show,
		hide: hide
	}
})();


// 构造系统运行对象 webui.objects.dashbord.system
(function(){
	var mousemovePerSec = 0;
	var mousemovePerSecTemp = 0;
	var authType = 0; // 0 is explicit, 1 is certificate, 2 is certificatesso, 3 is miscellaneous
	
	function logout()
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
	}
	
	function getAuthType()
	{
		return authType;
	}
	
	function begin()
	{
		// 保证页面不会出现元素被框选引起奇怪问题
		document.onselectstart = function(){return false;};
		document.ondragstart = function () { return false; };
		
	  	//根据cookie存储设置背景图片
		if($.cookie("darkblue_bgImg")!=null)
		{
			webui.system.bgImg=$.cookie("darkblue_bgImg");
		}
		if ($("body").css("background-image") != webui.system.bgImg) $("body").css("background-image", "url(" + webui.system.bgImg + ")");
	
		
		// 得到当前的登录方式
		authType = $.cookie("authType");
		if (authType == null) authType = 0;
		
		//得到是否为第一次登录
		isFirstLogin = $.cookie("isFirstLogin");
		if (typeof(isFirstLogin) == "undefined" || isFirstLogin == null)
		{
			isFirstLogin = "false";
		}
		
		console.log("authType = " + authType + ", isFirstLogin = " + isFirstLogin);
		
		// 得当当前登录的用户名，如果没有登陆，则跳回登录页面
    	$.ajax({
	        url : webui.objects.dashbord.actionurls.loginUsername + "?" + Math.random(), // 加随机数防止缓存
	        type : "POST",
	        headers: { "cache-control": "no-cache"},	
	        dataType : "json",
	        contentType :"application/json",
	        data : "",
	        timeout: 300000,
	        success : function(msg) {
	        	try
	        	{
		        	if (msg.resultCode == ResultCode.code.OPERATE_SUCCESS)
		        	{
		        		$("#username").text(msg.username);
		        		if (msg.username.length > 7) $("#username").attr("title", msg.username); // 中文字符在username标签130px的宽度下7个字符以上就会溢出
		        	}
		        	else
		        	{
		        		console.log("get user failed:", msg.resultCode);
					}
				}
				catch(err)
				{
					console.log("get user exception:" + err, err.stack ? err.stack : "");
				}
	        },
	        error : function(msg,ret) {
	        	console.log("get user error:", ret);
	        }
    	});		
		
		// 保持每3秒鼠标活动次数信息，以及判断是否5分钟鼠标没有动，没动就注销
		var lastTim = (new Date()).getTime();
		$(document).mousemove(function(){mousemovePerSecTemp++; });
		setInterval(function(){
			mousemovePerSec = mousemovePerSecTemp; mousemovePerSecTemp = 0;
			
			if (mousemovePerSec > 0)
			{
				lastTim = (new Date()).getTime();
			}
			
			if ((new Date()).getTime() - lastTim > webui.system.timout) // 5分钟没有鼠标活动退出
			{
				logout();
			}
		}, 3000);
		
		// 获取property的值
		commonvar.getConfigInfo(call_back);

	}
	
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
			 
			 $("#downloadClientTip1").hide();
			 $("#downloadClientTip2").hide();
			 $("#downloadClientTip3").hide();
			 $("#downloadClientButtion2").hide();
		}
	}
	
	function showTip(text)
	{
		var warningObj = $("#warning");
		warningObj.find("#warningText").text(text);
		warningObj.fadeIn().delay(3000).fadeOut();
	}
	
	
	function getBrowserType()
	{
		return commonvar.getBrowserType();
	}
	
	webui.objects.dashbord.system = {
		begin: begin,
		end:function(){},
		getMousemovePerSec : function(){return mousemovePerSec},
		logout: logout,
		getAuthType: getAuthType,
		showTip:showTip,
		getBrowserType:getBrowserType
	};
})();

//页面初始化
$(document).ready(function(){
	
	//初始化hdpclient插件
	hdpclient.init();
	webui.objects.dashbord.system.begin();
	webui.objects.dashbord.netErrorTiper.begin();
	webui.objects.dashbord.vmMgr.begin();
	webui.objects.dashbord.popupMgr.begin();
	webui.objects.dashbord.messageBox.begin();
	webui.objects.dashbord.powerSet.begin();
	webui.objects.dashbord.optioner.begin();
});