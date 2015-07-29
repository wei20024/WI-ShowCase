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

//将错误码对应的描述，显示在错误提示栏中
function checkCode(resultCode)
{
    var errorMsg = "";
    
    if (resultCode == ResultCode.code.DESK_PREPARING) errorMsg = LA('VM is preparing') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_VM_ALREADY_LOGINED_BY_OTHER_USER) errorMsg = LA('Other user has logined') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_VM_NOT_EXIT) errorMsg = LA('VM not exist') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_NOT_VALID_VM_IN_DG) errorMsg = LA('Have not free VM in pool') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_RUN_VM_ERROR) errorMsg = LA('VM can not run') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_LICEN_OVER) errorMsg = LA('License not enough') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_GET_LICENINFO_ERROR) errorMsg = LA('License information error') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_CALL_LICEN_ERROR) errorMsg = LA('License service error') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.DESKLOGIN_LIC_EXPIRES) errorMsg = LA('License timeout') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.VNCGATE_INVALID) errorMsg = LA('VNCGateway Invalid') + '(' + resultCode + ')';
    else if (resultCode == 28104012) errorMsg = LA('timeStampError') + '(' + resultCode + ')';
    else if (resultCode == 28104013) errorMsg = LA('noAuthen') + '(' + resultCode + ')';
    else if (resultCode == 400207) errorMsg = LA('NoApp for Pool VM') + '(' + resultCode + ')';
    else if (resultCode == ResultCode.code.LOGIN_FOEBIDDEN_BY_TIMEACCESSCONTROL) errorMsg = LA('Login Foebidden Timeaccesscontrol') + '(' + resultCode + ')';
    
    return errorMsg;
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
    getAppLoginInfo: commonvar.serviceUrl.getAppLoginInfo,
    getAppList: commonvar.serviceUrl.getAppList,
    getAppIcon: commonvar.serviceUrl.getAppIcon,
    dealFavoriteApp: commonvar.serviceUrl.dealFavoriteApp,
    setVMsPowerSet: commonvar.serviceUrl.setVMsPowerSet // input: id:sid, domain, computerName, dgName, customVMUserPolicy; output: {resultCode,errorMessage}
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
    webui.objects.dashbord.Vm = 
    {
        createClientUrl : createClientUrl
    };
    
    // 在dom中添加虚拟机所需内容
    function appendHtmlForVm(type, isFistStaticGroup, eleId, vmName, isPool, inMaintenanceMode, vmVersion, platformKind, instance) // 添加新vm所需的html内容，eleId为元素的Id值,vmName为vm的名字, isPool表示是否为池, 返回Dom内容的jquery对象
    {
        // 填充新桌面的HTML元素
        var templateSelector = "#vmTemplate";
        var containerSelector = "#vmList";
        var template = $(templateSelector);
        var container = $(containerSelector);
        var content = template.html();
        
        //增加防跨站脚本攻击处理代码
        vmName = HtmlUtil.htmlDecode(vmName);
        
        content = content.replace(/__vmTemplate__/g, eleId);
        content = content.replace(/__vmName__/g, vmName);
        container.append(content);
        var ele = document.getElementById(eleId);
        ele = $(ele);
        if (vmName.length > 14) // 中文字符在vmNameLink/vmName标签250px的宽度下14个字符以上就会溢出
        {
            ele.find(".vmNameLink").attr("title", vmName); 
            ele.find(".vmName").attr("title", vmName); 
        }
        
        if (vmVersion == "R21") {
            ele.find(".powerSet").hide();
            ele.find(".loginVnc").hide();
        }

        //动态池模式（vmGroup）不显示，静态池模式（vmStaticGroup）只有第一次的时候不显示,如果是维护模式也不显示这些按钮
        if (vmVersion == "R51") {
            if (isPool || (type == "vmStaticGroup" && isFistStaticGroup == true) || inMaintenanceMode == "1")
            {
                ele.find(".vmOption").hide();
                ele.find(".loginVnc").hide();
                ele.find(".reboot").hide();
                ele.find(".forceReboot").hide();
                
                // 动态池支持重启场景
                        if (instance.groupVmOpFlag == 1) {
                            ele.find(".vmOption").show();
                            ele.find(".powerSet").hide();
                            ele.find(".loginVnc").show();
                            ele.find(".reboot").show();
                            ele.find(".forceReboot").show();
                            ele.find(".loginVnc").css("left", "20px");
                            ele.find(".reboot").css("left", "65px");
                            ele.find(".forceReboot").css("left", "110px");
                        }
            }
			
            if (platformKind == 2)
            {
                ele.find(".loginVnc").hide();
                ele.find(".powerSet").hide();
                ele.find(".vmOptionPannel").css({"background-image":"url(/uns/default/img/dashbord/vmOptionPannelMid.png)","width":"69px"});
                ele.find(".reboot").css({"left":"9px"});
                ele.find(".forceReboot").css({"left":"36px"});
            }
            else if (platformKind > 0)
            {
                ele.find(".loginVnc").hide();
                ele.find(".forceReboot").hide();
                ele.find(".powerSet").hide();
                ele.find(".vmOptionPannel").css({"background-image":"url(/uns/default/img/dashbord/vmOptionTiny.png)","width":"65px"});
                ele.find(".reboot").css({"left":"20px"});
            }
            
            // 显示vip图标
            if (instance.vipFlag == 1)
            {
                ele.find(".vipFlag").show();
            }
            else
            {
                ele.find(".vipFlag").hide();
            }
        }
        ele.find(".loginVnc").attr("title", LA("Self-service"));
        ele.find(".reboot").attr("title", LA("Reboot"));
        ele.find(".forceReboot").attr("title", LA("Force reboot"));
        ele.find(".powerSet").attr("title", LA("Set power management policy"));
        ele.find(".hdaVersion").text(LA("HDA Version"));
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
        
        createClientUrl(instance, loginInfo);
        
        if (instance.inMaintenanceMode == "1")
        {
            showTip(instance, LA("Running Client of EmergencyLogin"));
        }
        else
        {
            showTip(instance, LA("Running Client"));
        }
        outLoading(instance);
    }
    
    function createClientUrl(instance, loginInfo)
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
        
        //应用虚拟化需要增加几个参数
        reqStr += "&sessionType=" + loginInfo.sessionType;
        reqStr += "&loginInfoTicket=" + loginInfo.loginInfoTicket;
        reqStr += "&userSid=" + instance.userSid;
        reqStr += "&machineSid=" + loginInfo.machineSid;
		
        if (webui.objects.dashbord.system.getBrowserType() == "ie6" || webui.objects.dashbord.system.getBrowserType() == "ie7" 
        || webui.objects.dashbord.system.getBrowserType() == "ie8" || webui.objects.dashbord.system.getBrowserType() == "ie9"
            || webui.objects.dashbord.system.getBrowserType() == "ie")
        {
			//IE会自动解码一次，所以需要编码两次
            window.location = reqStr;
        }
        else if (webui.objects.dashbord.system.getBrowserType() == "chrome")
        {
            window.location = reqStr;
        }   
		else if (webui.objects.dashbord.system.getBrowserType() == "cloudclient")
		{
			$("#clientIframe").attr("src", reqStr);
		}     
        else 
        {
            $("#clientIframe").attr("src", reqStr);
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
        
        if ($.cookie("vnctip") != 0)
        {
            $("#globalDialog").css("height", "397px");
            $("#globalDialog").css("background-image", "url(/uns/default/img/dashbord/midbox.png)"); 
            $("#globalConfirmTipContainer").css("top", "80px"); 
            //$("#globalDialogButtonsWarp").css("bottom", "30px");
            $("#globalConfirmTipText").css("font-size", "12px"); 
            $("#globalConfirmTipText").css("text-align", "left");
            $("#vnclabel").text(LA("no tip again:"));
            $("#vnccheckbox").show();
            $("#vnclabel").show();
            
            webui.objects.dashbord.messageBox.show(LA("Notice"), LA("Vnc Tip:"), "<Ok><Canncel>", function(result){
                $("#globalDialog").css("height", "275px");
                $("#globalDialog").css("background-image", "url(/uns/default/img/dashbord/smallbox.png)"); 
                $("#globalConfirmTipContainer").css("top", "130px"); 
                $("#globalConfirmTipText").css("font-size", "16px"); 
                $("#globalConfirmTipText").css("text-align", "center");
                $("#vnccheckbox").hide();
                $("#vnclabel").hide();
                if (result == "<Canncel>") 
                {
                    return false;
                }
                else
                {
                    if (document.getElementById("vncTip").checked)
                    {
                        $.cookie("vnctip", 0, {expires:365,path:'/'});
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
                    showTip(instance, LA("Running Client"));
                }
            });
        }
        else
        {
            if (webui.objects.dashbord.system.getBrowserType() == "ie6" || webui.objects.dashbord.system.getBrowserType() == "ie7" 
                || webui.objects.dashbord.system.getBrowserType() == "ie8" || webui.objects.dashbord.system.getBrowserType() == "ie9"
                    || webui.objects.dashbord.system.getBrowserType() == "ie")
            {
				//IE会自动解码一次，所以需要编码两次
                window.location = reqStr;
            }
            else if (webui.objects.dashbord.system.getBrowserType() == "chrome")
            {
                window.location = reqStr;
            }
			else if (webui.objects.dashbord.system.getBrowserType() == "cloudclient")
			{
				//cs客户端会自动解码一次，所以需要编码两次
				$("#clientIframe").attr("src", reqStr);
			}  
            else $("#clientIframe").attr("src", reqStr);
            showTip(instance, LA("Running Client"));
        }
    }
    function tryConnect_R21(instance, callback, timeout)
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
                     else {
                           if ((null != msg.randomId && '' != msg.randomId && undefined != msg.randomId)
                                        && (msg.randomId != randomId)) 
                           {
                                    // 1225代表请求与响应不匹配
                                    errorMsg = LA('VM is preparing') + " 1225";
                                    callback(1225, errorMsg);
                          } else {
                                    if (typeof (instance.__retryTimer) != "undefined" && instance.__retryTimer != null
                                            && instance.__retryTimer != 0) {
                                        clearTimeout(instance.__retryTimer);
                                        instance.__retryTimer = 0;
                                    }
                                    callClient_R21(instance, msg);
                                    callback(0, "");
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
                
                console.log("getLoginInfo msg.status = " + msg.status);
                if (msg.status == 403)
                {
                    window.location.href = commonvar.serviceUrl.errorPage403;
                }
                
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
            console.log("clientMac=" + webui.objects.dashbord.hdpclient.getClientMac() + ",clientName=" + hdpclient.clientName() 
                    + ",clientIP=" + webui.objects.dashbord.hdpclient.getClientIp() + ",clientVersion=" + hdpclient.clientVersion() 
                    + "clientType=" + hdpclient.clientType());

         __connectAjaxer = $.ajax({
            url : isVNC ? webui.objects.dashbord.actionurls.getVncLoginInfo : webui.objects.dashbord.actionurls.getLoginInfo, // 加随机数防止缓存
            type : "POST",
            headers: { "cache-control": "no-cache"},    
            dataType : "json",
            contentType :"application/json",
            timeout: timeout,
            beforeSend: function(XMLHttpRequest){
                XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
            },
            data : isVNC ? JSON.stringify({
                    "id" : instance.sid,
                "vmName" : instance.name,
                "dgName" : instance.dgName,
               "clientIp": hdpclient.clientIp(),
                "farmId" : instance.farmId
            }) : JSON.stringify({
                    "id" : instance.sid,
                  "type" : instance.type,
                "farmId" : instance.farmId,
                  "dgId" : instance.dgId,
              "clientMac": webui.objects.dashbord.hdpclient.getClientMac(),
             "clientName": hdpclient.clientName(),
               "clientIp": webui.objects.dashbord.hdpclient.getClientIp(),
          "clientVersion": hdpclient.clientVersion(),
             "clientType": hdpclient.clientType(),
               "randomId":randomId
            }),
            success : function(msg) {
                if (!isVNC) webui.objects.dashbord.urlChecker.checkGetLoginInfoRsp(msg);
                else webui.objects.dashbord.urlChecker.checkGetVncLoginInfoRsp(msg);

                try
                {
                    if (msg.resultCode != 0)
                    {
                        console.log("login vm fail(" + msg.resultCode + ")");
                        
                        var errorMsg = checkCode(msg.resultCode);
                        
                        if ("" == errorMsg)
                        {
                            errorMsg = LA('Can not connect to VM') + '(' + msg.resultCode + ')';
                        }

                        callback(msg.resultCode, errorMsg);
                    }
                    else
                    {
                        if (typeof(instance.__retryTimer) != "undefined" && instance.__retryTimer != null && instance.__retryTimer != 0)
                        {
                            clearTimeout(instance.__retryTimer);
                            instance.__retryTimer = 0;
                        }
                        if (isVNC)
                            {
                                if(!callVNCClient(instance, msg, isAutoVncLogin))
                                {
                                    cancelConnectingStatus(instance);
                                    instance.__connecting = false;
                                    $("#warning").hide();
                                    return;
                                }
                            }
                            else
                            {
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
                                    callClient(instance, msg);
                                  }
                            }                        
                        
                        //如果是应急模式刷新时间间隔90秒
                        if (instance.inMaintenanceMode == "1")
                        {
                            callback(1900, LA("Running Client of EmergencyLogin"));
                        }
                        else
                        {
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
                
                console.log("getLoginInfo msg.status = " + msg.status);
                if (msg.status == 403)
                {
                    window.location.href = commonvar.serviceUrl.errorPage403;
                }
                
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
                            showTip(instance, errorText, function(){});
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
                        setTimeout(function(){document.location.reload()}, 5000);
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
        if (webui.objects.dashbord.pluginChecker.isPluginExistR21() == false)
        {
            showTip(instance, LA('Please install client first') , function(){});
            return;
        }

        if (typeof(instance.__connecting) != "undefined" && instance.__connecting != null && instance.__connecting == true) return;
           instance.ele.addClass("vmRoleConnecting");
           instance.__connecting = true;
           console.log("connect VM normal.");
               
        tryConnect_R21(instance, function(errorCode, errorText){
            cancelConnectingStatus(instance);
            instance.__connecting = false;
            if (errorCode == "10000601")
            {
                showTip(instance, errorText, function(){});
                queryVmStateInterval = 0;
                queryVmStateBeginTime = new Date().getTime();
                setTimeout(function(){
                    queryVmState(instance);
                }, webui.system.rebootAfterTime);
            }
            else 
            {
                if (errorCode !=0) showTip(instance, errorText, function(){});
                else 
                {
                    setTimeout(function(){document.location.reload();}, 5000);
                }
            }
        });
    }
    
    function queryVmState(instance)
    {
        //3分钟后停止状态查询
        if (new Date().getTime() - queryVmStateBeginTime > webui.system.connectVmTimeout) {
            console.log("query vm state timeout");
            clearInterval(queryVmStateInterval);
            showTip(instance, LA("Connect Error"), function(){});
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
                            showTip(instance, LA("VM Is Ready"), function(){});
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
                        clearInterval(queryVmStateInterval);
                        showTip(instance, LA('10000802_L') + instance.name + LA('10000802_R') + '(' + msg.resultCode + ')', function(){});
                    }else{
                        clearInterval(queryVmStateInterval);
                        showTip(instance, LA("Query VM state error"), function(){});
                    }
                },
                error : function() {
                    clearInterval(queryVmStateInterval);
                    console.log("query vm state error");
                    showTip(instance, LA("Query VM state error"), function(){});
                }
            });
        }
    }
    
    function connectVmNormal(instance, inputPa)
    {
        if (webui.objects.dashbord.pluginChecker.isPluginExist() == false)
        {
            showTip(instance, LA('Please install client first') , function(){});
            return;
        }

        if (typeof(instance.__connecting) != "undefined" && instance.__connecting != null && instance.__connecting == true) return;
           instance.ele.addClass("vmRoleConnecting");
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
                
                var os = $.cookie("accessClientType");
                
                //当前WI启动过程中默认不弹出VNC
                if (webui.system.config.retryConnectVNCCount != 0 && (os == "Windows" || os == "Linux"))
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
                if (errorCode !=0) showTip(instance, errorText, function(){});
                else 
                {
                    setTimeout(function(){document.location.reload()}, 5000);
                }
            }
        });
    }
    
    function connectVNC(instance)
    {
        if (webui.objects.dashbord.pluginChecker.isPluginExist() == false)
        {
            showTip(instance, LA('Please install client first') , function(){});
            return;
        }

        //经协商,虚拟机在连接过程中,也可以打开VNC,避免长时间处理连接中,用户也不能做任何操作
        instance.__connecting = true;
        instance.ele.addClass("vmRoleConnecting");
        tryConnect(instance, true, false, function(errorCode, errorText)    {
               cancelConnectingStatus(instance);
               instance.__connecting = false;
            if (errorCode != 0) showTip(instance, errorText, function(){});
            else 
            {
                setTimeout(function(){document.location.reload()}, 5000);
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
        instance.ele.removeClass("vmRoleConnecting");
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
            inLoading(instance);
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
                "userName" : $("#username").text(),
                "domain" : $.cookie("selectedDomain"),
                    "isForceReboot": isForce
                }),
                beforeSend: function(XMLHttpRequest){
                    XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
                },
                success : function(msg) {
                    setTimeout(function(){outLoading(instance);}, webui.system.rebootKeepTime);
                    if (msg.resultCode == 0)
                    {
                        if (instance.vmVersion == "R21") {
                            console.log("reboot R21 VM...");
                            intervalIndex = 0;
                            rebootBeginTime = new Date().getTime();
                            setTimeout(function(){
                                getVmStateIsReady(instance, isForce);
                            }, webui.system.rebootAfterTime);
                        }else if (instance.vmVersion == "R51") {
                            console.log("reboot R51 VM...");
                            webui.objects.dashbord.vmMgr.tryLoop(0);
                        }else{
                            webui.objects.dashbord.vmMgr.tryLoop(0);
                        }
                    }
                    else
                    {
                        if (instance.vmVersion == "R21") {
                            showRebootMsg(instance, msg.resultCode, isForce);
                        }else if (instance.vmVersion == "R51") {
                            showTip(instance, LA(isForce ? "Force reboot VM failed" : "Reboot VM failed"), function(){});
                            outLoading(instance);
                        }
                    }
                },
                error : function(msg,ret) {
                    
                    console.log("getLoginInfo msg.status = " + msg.status);
                    if (msg.status == 403)
                    {
                        window.location.href = commonvar.serviceUrl.errorPage403;
                    }
                    
                    outLoading(instance);
                    if (instance.vmVersion == "R21") {
                        showTip(instance, LA(isForce ? "Force RebootOtherCode" : "RebootOtherCode"), function(){});
                    }else if (instance.vmVersion == "R51") {
                        showTip(instance, LA(isForce ? "Can not force reboot VM" : "Can not reboot VM"), function(){});
                    }
                    console.log(isForce ? "force reboot vm" : "reboot vm" + instance.sid + "error(" + ret + ")");
                }
            });
    }
    
    function showRebootMsg(instance, resultCode, isForce)
    {
        if (resultCode == "10000501" || resultCode == "10000502" || resultCode == "17000003" || resultCode == "17000004") {
            showTip(instance, LA(resultCode), function(){});
        }
        else{
            showTip(instance, LA(isForce ? "Force RebootOtherCode" : "RebootOtherCode"), function(){});
        }
        outLoading(instance);
    }
    
    function getVmStateIsReady(instance, isForce)
    {
        //3分钟后停止状态查询
        if (new Date().getTime() - rebootBeginTime > webui.system.vmStateQueryTimeout) {
            console.log("query vm state timeout");
            clearInterval(intervalIndex);
            outLoading(instance);
            return false;
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
                    if (msg.vmStatus == null || msg.vmStatus == "UNREGISTER") {
                        if (intervalIndex == 0) {
                            intervalIndex = setInterval(function(){
                                getVmStateIsReady(instance, isForce);
                            }, webui.system.vmStateQueryTime);
                        }
                    }else{
                        clearInterval(intervalIndex);
                        outLoading(instance);
                    }
                },
                error : function() {
                    clearInterval(intervalIndex);
                    console.log("query vm state error");
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
    
    // 虚拟机类构造
    webui.classspace.dashbord.Vm = function(inputPa) // 入参:{name:显示的名字, sid:sid, isActive:true|false, isPool:true|false, farmId:xxx,vmDomain:xxx, dgId:xxx, dgName: xxxx}
    {
        // 初始化instance
        var vmId = "vm_" + inputPa.sid;
        var instance = {"vmId": vmId};
        
        if(1 == webui.system.config.vmNameType)
        {
            instance.name = inputPa.dgName;
        }
        else
        {
            instance.name = inputPa.name;
        }

        instance.sid = inputPa.sid;
        instance.farmId = inputPa.farmId;
        instance.vmDomain = inputPa.vmDomain;
        instance.inMaintenanceMode = inputPa.inMaintenanceMode;
        instance.dgId = inputPa.dgId;
        instance.dgName = inputPa.dgName;
        instance.isPool = inputPa.isPool;
        instance.platformKind = inputPa.platformKind;
        instance.vipFlag = inputPa.vipFlag;
        instance.groupVmOpFlag = inputPa.groupVmOpFlag;
        instance.ele = appendHtmlForVm(inputPa.type, inputPa.isFistStaticGroup, vmId, instance.name, inputPa.isPool, inputPa.inMaintenanceMode, inputPa.vmVersion, inputPa.platformKind, instance);
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
        
        // 绑定行为
        instance.ele.find(".loginVm").click(function(){    
            if(instance.inMaintenanceMode == "2") 
            {
                $("#globalConfirmTipContainer").css("top", "110px");
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("InMaintenanceMode Connect Tip"), "<Ok>" ,function(result){        
                });
            }else{
                $("#globalConfirmTipContainer").css("top", "130px");
                if (inputPa.vmVersion == "R21") {
                    connectVmNormal_R21(instance, inputPa);
                }
                else if (inputPa.vmVersion == "R51") {
                    connectVmNormal(instance, inputPa);
                }
            }
        });   
        instance.ele.find(".loginVnc").click(function(){
            if(instance.inMaintenanceMode == "2") 
            {
                $("#globalConfirmTipContainer").css("top", "110px");
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("InMaintenanceMode Connect Tip"), "<Ok>", function(result){        
                });
            }else{
                $("#globalConfirmTipContainer").css("top", "130px");
                hidePannel(instance); connectVNC(instance);
            }
        });
        instance.ele.find(".vmNameLink").click(function(){
            if(instance.inMaintenanceMode == "2") 
            {
                $("#globalConfirmTipContainer").css("top", "110px");
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("InMaintenanceMode Connect Tip"), "<Ok>", function(result){        
                });
            }else{    
                $("#globalConfirmTipContainer").css("top", "130px");
                if (inputPa.vmVersion == "R21") {
                    connectVmNormal_R21(instance, inputPa);
                }
                else if (inputPa.vmVersion == "R51") {
                    connectVmNormal(instance, inputPa);
                }
            }
        });
        instance.ele.find(".vmTipOk").click(function(){instance.ele.find(".vmTip").fadeOut(200);});
        instance.ele.find(".vmOption").click(function(){togglePannel(instance)});
        webui.objects.dashbord.popupMgr.register(vmId, [instance.ele.find(".vmOptionPannel")[0], instance.ele.find(".vmOption")[0]], function(){hidePannel(instance);});
        
        instance.ele.find(".reboot").click(function(){        
            if(instance.inMaintenanceMode == "2") 
            {
                $("#globalConfirmTipContainer").css("top", "110px");
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("InMaintenanceMode Restart Tip"), "<Ok>", function(result){        
                });
            }else{
                $("#globalConfirmTipContainer").css("top", "130px");
                hidePannel(instance);
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("Confirm reboot?"), "<Ok><Canncel>", function(result){
                if (result == "<Ok>") reboot(instance, false);                 
                });
            }
        });
        instance.ele.find(".forceReboot").click(function(){
            if(instance.inMaintenanceMode == "2") 
            {
                $("#globalConfirmTipContainer").css("top", "110px");
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("InMaintenanceMode Restart Tip"), "<Ok>", function(result){        
                });
            }else{    
                $("#globalConfirmTipContainer").css("top", "130px");
                hidePannel(instance);
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("Confirm force reboot?"), "<Ok><Canncel>", function(result){
                if (result == "<Ok>") reboot(instance, true); 
                });
            }
        });
        instance.ele.find(".powerSet").click(function(){
            hidePannel(instance);
            webui.objects.dashbord.powerSet.show(instance.sid, instance.name, instance.vmDomain, instance.dgName, function(result){
                if (result != "<Ok>") showTip(instance, LA("Set power policy failed"), function(){});
                else showTip(instance, LA("Set power policy success"), function(){});
            });
        });
        instance.ele.find(".hdaVersion").click(function(){
            webui.objects.dashbord.messageBox.show(instance.name, LA("HDA Version:") + instance.hdaVersion, "<Ok>", function(result){});
        });
        
        // 初始化
        if (inputPa.isActive == false) this.showPreparing();
        // 设置是否系统是应急模式
        if (instance.inMaintenanceMode == "1")
        {
            webui.system.config.isEmergencyLogon = 1;
        }
    };
})();

// 虚拟机管理对象，webui.objects.dashbord.vmMgr，定义过程利用匿名函数保护，不让内部函数与变量外泄
(function(){
    var instance = {}; // 实例对象
    instance.JSS = new webui.classspace.base.JSS();
    instance.vms = {};
    var inLoop = 0;
    
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
            platformKind: vmInfo.platformKind,
            vipFlag: vmInfo.vipFlag,
            groupVmOpFlag: vmInfo.groupVmOpFlag,
            isFistStaticGroup: vmInfo.isFistStaticGroup,
            vmVersion: vmInfo.vmVersion
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
    
    // 更新虚拟机列表
    function tryLoop(type)
    {    
        if (type == "undefined" || type == "") {
            type = 0;
        }
        if (inLoop == 1) return;
        inLoop = 1;
        $.ajax({
            url : webui.objects.dashbord.actionurls.getVmList, // 加随机数防止缓存
            type : "POST",
            headers: { "cache-control": "no-cache"},    
            dataType : "json",
            contentType :"application/json",
            timeout: 300000,
            data : JSON.stringify({queryType:type}),
            beforeSend: function(XMLHttpRequest){
                XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
            },
            success : function(msg) {
                webui.objects.dashbord.netErrorTiper.hide();
                webui.objects.dashbord.urlChecker.checkGetVmListRsp(msg);
                inLoop = 0;
                try
                {
                    if (msg.resultCode == 0)
                    {
                        $("#loadingList").hide();
                        $("#vmListContainer").show();

                        var newVms = {};
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
                        }
                        
                        if (isExistVersion_R5 == false && "undefined" != typeof(msg.appInfos) && msg.appInfos.length > 0) {
                            isExistVersion_R5 = true;
                        }
                        instance.JSS.refresh(newVms);
                        
                        if (webui.objects.dashbord.pluginChecker.isFirstCheck()) {
                            webui.objects.dashbord.pluginChecker.begin(isExistVersion_R2, isExistVersion_R5);
                        }
                        
                        //只有在有应用的情况下才显示应用Tab按钮；另外应用虚拟化不支持“android_tc”和“Mac”
                        var appInfoList = msg.appInfos;
                        var osType = webui.objects.dashbord.pluginChecker.checkOs();
                        if ("undefined" != typeof(appInfoList) && appInfoList.length > 0
                                && osType != "android_tc" && osType != "Mac") {
                                    
                            //设置不自动登录
                            isFirstLogin = "false";
                            
                            //是否需要显示"我的桌面"Tab按钮
                            if ("undefined" == typeof(msg.vms) || msg.vms.length == 0) {
                                appcommon.showVmTabBtn = false;
                                if ("undefined" == typeof($.cookie("tabPageTag")) 
                                    || $.cookie("tabPageTag") == null || $.cookie("tabPageTag") == "vmList") {
                                    commonvar.setCookieByProtocol("tabPageTag", webui.system.defaultTab);
                                }
                            }
                            
                            appcommon.myCollectionList = msg.myAppInfos;
                            appcommon.allAppList = msg.appInfos;
                            webui.objects.dashbord.initMyAppView.begin();
                            webui.objects.dashbord.changetabpage.begin();
                            webui.objects.dashbord.app.begin();
                        }
                        
                        if ("on" == webui.system.config.autoConnectVm && "true" == isFirstLogin)
                        {
        
                            if ("undefined" != typeof(msg.vms) && msg.vms.length == 1)
                            {
                                if (msg.vms[0].vmVersion == "R51") {
                                    instance.vms[msg.vms[0].sid].instance.connect();
                                    isFirstLogin = "false";
                                }
                            }
                            else if ("undefined" == typeof(msg.vms))
                            {
                                $("#vmListContainer").hide();
                            }
                        }
                        
                        hideWarning();
                    }
                    else
                    {
                        console.log("get vm list failed(%s).", msg.resultCode);
                        showWarning(LA("Get vm list error:") + msg.resultCode);
                        $("#loadingList").show();
                        $("#vmListContainer").hide();
                        if (msg.resultCode == ResultCode.code.SESSION_INVALID || msg.resultCode == 10001 || msg.resultCode == ResultCode.code.PARAMETER_INVALID
                                || msg.resultCode == 60021 || msg.resultCode == 60022) // 会话无效
                        {
                            webui.objects.dashbord.system.logout();
                        }
                    }
                }
                catch(err)
                {
                    showWarning(LA("Get vm list error:") + "-1");
                    $("#loadingList").show();
                    $("#vmListContainer").hide();
                    console.log("get vm throw exception:" + err, err.stack ? err.stack : "");
                }
            },
            error : function(msg,ret) {
                inLoop = 0;
                console.log("get vm list error(%d, %s).", msg.readyState, ret);
                
                console.log("getLoginInfo msg.status = " + msg.status);
                if (msg.status == 403)
                {
                    window.location.href = commonvar.serviceUrl.errorPage403;
                }
                
                if (ret == "timeout" || ret == "error") 
                {
                    setTimeout(function(){
                        $.ajax({
                            url : commonvar.serviceUrl.versionPage + "?" + Math.random(), // 因为第一次产生ajax断网有可能是页面跳转等原因引起，不属于错误，再次读取某个简单url，确认网络是否通畅
                            success: function(){},
                            error: function(msg2,ret2)
                            {
                                showWarning(LA("Get vm list error:") + "-2");
                                $("#loadingList").show();
                                $("#vmListContainer").hide();
                                if (ret2 == "timeout" || ret2 == "error") webui.objects.dashbord.netErrorTiper.show(LA("Network Error"));
                            }
                        });
                    }, 0);
                }
            }
        });
    }

    // 开始运行虚拟机管理，主要工作为轮询后台虚拟机列表信息，处理虚拟机的增删以及状态改变
    function begin()
    {
        tryLoop(2);
        
        getVmListTimmer = setInterval(setTryLoop(), webui.system.refreshVmStateTime);

    }
    
    function setTryLoop()
    {
        return function()
        {
            tryLoop(0);
        }
    }
    
    webui.objects.dashbord.vmMgr = {
        begin: begin, // 开始运行
        end: function(){}, // 停止运行
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
        // 绑定行为
        $("#gear").click(toggleOption);
        $("#lang").click(function(){hideOption(); webui.objects.dashbord.LangChoice.show();});
        $("#chbg").click(function(){hideOption(); webui.objects.dashbord.bgChoice.show();});
        $("#chpsw").click(function()
        {
            hideOption();
            if (webui.objects.dashbord.system.getAuthType() != 0 || webui.system.config.runningMode == "NOLDAPSERVER" || webui.system.config.isEmergencyLogon == 1)
            {
                webui.objects.dashbord.messageBox.show(LA("Notice"), LA("Can not modify password in current mode"), "<Ok>", function(){});
            }
            else
            {
                document.location.href=commonvar.serviceUrl.changePwdPage + "?fromhomepage=1"; 
                return false;
            }
        });
        $("#logout").click(logout);
        
        //初始化
        $("#lang").attr("title", LA("Language"));
        $("#chbg").attr("title", LA("Background"));
        $("#chpsw").attr("title", LA("Password"));
        $("#logout").attr("title", LA("Logout"));
        
        webui.objects.dashbord.popupMgr.register("optioner", [$("#optionArea")[0], $("#gear")[0]], function(){hideOption()});
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
    }
})();


// 构造插件检查对象webui.objects.dashbord.pluginChecker
(function(){
    var pluginExist = false;
    var pluginExistR21 = true;
    
    //0:未安装，1：已安装，2：版本低，3：其他（如：linux系统下R5客户端时设置为3）
    var r2ClientIsInstall = 0;
    var r5ClientIsInstall = 0;
    var r2NetIsInstall = 0;
    
    var firstCheck = true;
    
    function checkOs()
    {
        var os_type = $.cookie("accessClientType");
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
        $("#downloadClientButtion2_Net").attr("href", "/plugin/Clients/connectTools.exe");
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
    //1：首先要判断R2和R5是否都需要检测，
    function begin(isExistVersion_R2, isExistVersion_R5)
    {
        console.log("user agent is:", navigator.userAgent);
        console.log("user agent is:", navigator.appVersion);
        
        firstCheck = false;
        var dowloader = $("#pluginTipArea");
        
        var nosupporter = $("#nosupportTip");
        nosupporter.find("#nosupportTipText").text(LA("Nosupport"));
        $("#downloadClientTip").text(LA("Install Client"));
        
        var os = checkOs();
        console.log("checked os is", os);
        if (os == "Windows") {
			dowloader.find("#downloadRef").click(function(){
			    clientDownload(webui.system.windowsClientDownloadUrl);
            });
			
            dowloader.find("#downloadRefR21").attr("href", "/plugin/Clients/huaweiDesktop.exe");
            showWindowsDownloadTip(isExistVersion_R2, isExistVersion_R5);
            return;
        }
        else if (os == "Linux")
        {
                dowloader.find("#downloadRef").click(function(){
			        clientDownload(webui.system.linuxClientDownloadUrl);
                });
            pluginExistR21 = true;
            r2ClientIsInstall = 1;
            showLinuxDownloadTip(isExistVersion_R2, isExistVersion_R5);
        }
        else if (os == "android_tc")
        {
            showAndroidTcDownloadTip();
            return;
        }
        else if (os == "Mac")
        {
             showMacDownloadTip();
             return;
        }
        else
        {
            setTimeout(function(){
                nosupporter.fadeIn();
            }, 2000);
            return;
        }
    }
    
    function showWindowsDownloadTip(isExistVersion_R2, isExistVersion_R5)
    {
        setR2Client(isExistVersion_R2);
        setWindowsR5Client(isExistVersion_R5);
        var browser = commonvar.getBrowserType();
        if(browser == "chrome") {
            //标志客户端已安装标志位
			pluginExist = true;
			
            if (isExistVersion_R2 && isExistVersion_R5) {
                $("#downloadRef").text(LA("clickDownload1"));
                $("#downloadRefR21").text(LA("clickDownload2"));
            } else if(isExistVersion_R2) {
                $("#downloadRefR21").text(LA("clickDownload"));
            } else if(isExistVersion_R5) {
                $("#downloadRef").text(LA("clickDownload"));
            }
            $("#pluginTipArea").show();
            return;
        } else {
            console.log("client: " + r2ClientIsInstall + " - " + r5ClientIsInstall + " - " + r2NetIsInstall);
            var clientInstallState = getClientState(r2ClientIsInstall, r5ClientIsInstall, r2NetIsInstall);
            showClientTip(clientInstallState, $("#pluginTipArea"), $("#nosupportTip"));
        }
        var pluginVersion = getPluginVersion();
        $("#clientVersion").text(LA("Client Version:") + pluginVersion);
    }
    
    function showLinuxDownloadTip(isExistVersion_R2, isExistVersion_R5)
    {
        setR2Client(isExistVersion_R2);
        setLinuxR5Client(isExistVersion_R5);
        if (r5ClientIsInstall != 1) {
            $("#linuxTipText").text(LA("contactAdministrator"));
            setTimeout(function(){
                $("#linuxTip").fadeIn();
            }, 2000);
            $("#nosupportTip").hide();
        }else{
            $("#pluginTipArea").hide();
            $("#linuxTip").hide();
        }
        var pluginVersion = getPluginVersion();
        $("#clientVersion").text(LA("Client Version:") + pluginVersion);
    }
    
    function setR2Client(isExistVersion_R2)
    {
        if (isExistVersion_R2) {
            //检测R2插件是否安装
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
        }else{
            r2ClientIsInstall = 1;
            r2NetIsInstall = 1;
        }
    }
    
    function setWindowsR5Client(isExistVersion_R5)
    {
		if (checkPlugin(/hwcloud/)) 
		{
			//标志客户端已安装标志位
			pluginExist = true;
		}
		
        if (isExistVersion_R5) {
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
            
            var clientversion = hdpclient.clientVersion();
            var tipText;
            
            if (null == clientversion || '' == clientversion || undefined == clientversion) {
                r5ClientIsInstall = 0;
            }
            else if (clientversion < webui.system.clientVersion)
	     {
                    //标志客户端已安装标志位
                    pluginExist = true;
                    r5ClientIsInstall = 2;
                    
                    // R5客户端版本较低，弹出提示框升级
                    var msgList = new Array();
                    msgList.push(LA("clientVersionLow"));
                    msgList.push(LA("upgrade client tip"));
                    msgList.push(LA("goonlogin"));
                    
                    //升级弹出框提示
                    tipText = showClientTipDetail(msgList);
                    
                    //webui.objects.dashbord.messageBox.show(LA("Notice"), tipText, "<download><Canncel>", function(result){}, changeBoxStyle(webui.system.windowsClientDownloadUrl));
                    
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
    }
    
    function setLinuxR5Client(isExistVersion_R5)
	{
        //CS客户端设置下载链接
        var isCS = getLinuxSystemType();
        
        var msgList = new Array();
        var tipText;
        msgList.push(LA("clientVersionLow"));
        
        if (null == isCS) {
            msgList.push(LA("contactAdministrator"));
        }
        else 
		{
            msgList.push(LA("DownloadLinuxClient"));
        }
        
        msgList.push(LA("goonlogin"));
        
        pluginExist = true;
        var clientversion = hdpclient.clientVersion();
        if (null == clientversion || '' == clientversion || undefined == clientversion) {
            r5ClientIsInstall = 0;
        }
        else if (clientversion < webui.system.clientVersion) 
		{
                //标志客户端已安装标志位
                pluginExist = true;
                r5ClientIsInstall = 3;
                
                //升级弹出框提示
                tipText = showClientTipDetail(msgList);
				
                //配合CS客户端设置下载链接
                if (null != isCS) {
                    // 显示升级提示框
                    //webui.objects.dashbord.messageBox.show(LA("Notice"), tipText, "<download><Canncel>", function(result){}, changeBoxStyle(webui.system.linuxClientDownloadUrl));
                    
                    // 设置不自动登录
                    //isFirstLogin = "false";
                }
            }
            else {
                //clientversion不为空,认为客户端已安装
                pluginExist = true;
                r5ClientIsInstall = 1;
            }
    }
    
    // 判断是否cs客户端，如果linux下cs客户端可以下载
    function getLinuxSystemType(){
        try {
            if (typeof(cloudclientInfo) == "undefined") {
                console.log("can not getLinuxSystemType.");
                return null;
            }
            
            webui.system.linuxClientDownloadUrl = cloudclientInfo.clientPakageName();
            
            return "isCs";
        } 
        catch (e) {
            console.log("getLinuxSystemType error ", e);
            return null;
        }
    }
    
    function showClientTip(clientInstallState, dowloader, nosupporter){
        switch (clientInstallState) {
        case 1:
            break;
        case 2:
            $("#downloadRef").text("");
            $("#downloadRefR21").text(LA("clickDownload"));            
            break;
        case 3:
            $("#downloadRef").text(LA("clickDownload"));
            $("#downloadRefR21").text("");
            break;
        case 4:
            dowloader.hide();
            break;
        case 5:
            $("#downloadRef").text(LA("clickDownload1"));
            $("#downloadRefR21").text(LA("clickDownload2"));
            break;
        case 6:
            $("#downloadRef").text("");
            $("#downloadRefR21").text(LA("clickDownload"));
            break;
        case 7:
            $("#downloadRef").text(LA("clickDownload"));
            $("#downloadRefR21").text("");
            break;
        case 8:
            $("#downloadRef").text(LA("clickDownload1"));
            $("#downloadRefR21").text(LA("clickDownload2"));
            break;
        default:
            $("#downloadRef").text(LA("clickDownload1"));
            $("#downloadRefR21").text(LA("clickDownload2"));
            break;
        }
        if (clientInstallState == 1) {
            dowloader.hide();
        } else {
            setTimeout(function(){
                dowloader.fadeIn();
            }, 2000);
        }
        nosupporter.hide();
    }
    
    /**
     * 获取当前客户端安装情况 
     * 1：全部安装了，2：安装了R5和.net, 3：安装了R2和.net, 4：安装了R2和R5
     * 5：安装了.net, 6：安装了R5, 7：安装了R2, 8: 都没安装
     */
    function getClientState(r2ClientIsInstall, r5ClientIsInstall, r2NetIsInstall)
    {
        if (r2ClientIsInstall == 1 && r5ClientIsInstall == 1 && r2NetIsInstall ==1) {
            return 1;
        }else if (r2ClientIsInstall != 1 && r5ClientIsInstall == 1 && r2NetIsInstall ==1) {
            return 2;
        }else if (r2ClientIsInstall == 1 && r5ClientIsInstall != 1 && r2NetIsInstall ==1) {
            return 3;
        }else if (r2ClientIsInstall == 1 && r5ClientIsInstall == 1 && r2NetIsInstall !=1) {
            return 4;
        }else if (r2ClientIsInstall != 1 && r5ClientIsInstall != 1 && r2NetIsInstall ==1) {
            return 5;
        }else if (r2ClientIsInstall != 1 && r5ClientIsInstall == 1 && r2NetIsInstall !=1) {
            return 6;
        }else if (r2ClientIsInstall == 1 && r5ClientIsInstall != 1 && r2NetIsInstall !=1) {
            return 7;
        }else{
            return 8;
        }
    }
    
    function showMacDownloadTip()
    {
        var dowloader = $("#downloadClient");
        dowloader.find("#downloadClientButtion2").attr("href", webui.system.macClientDownloadUrl);
        
        var clientversion = hdpclient.clientVersion();
        
        if (undefined == clientversion || null == clientversion || '' == clientversion)
        {
            pluginExist = true;
            dowloader.find("#downloadClientTip1").text(LA("clientVersionNoOrLow"));
            dowloader.find("#downloadClientTip2").text("1. " + LA("Download Client"));
            dowloader.find("#downloadClientButtion2").text(LA("clickDownload"));
            dowloader.find("#downloadClientButtion2_R21").text("");
            dowloader.find("#downloadClientButtion2_Net").text("");
            dowloader.find("#downloadClientTip3").text(LA("goonlogin"));
            
            setTimeout(function(){
                dowloader.fadeIn();
            }, 1000);
        }
        else if (clientversion < webui.system.macClientVersion)
        {
            pluginExist = true;
            dowloader.find("#downloadClientTip1").text(LA("clientVersionNoOrLow"));
            dowloader.find("#downloadClientTip2").text("1. " + LA("Download Client"));
            dowloader.find("#downloadClientButtion2").text(LA("clickDownload"));
            dowloader.find("#downloadClientButtion2_R21").text("");
            dowloader.find("#downloadClientButtion2_Net").text("");
            dowloader.find("#downloadClientTip3").text(LA("goonlogin"));
            
            setTimeout(function(){
                dowloader.fadeIn();
            }, 1000);
        }
        else
        {
            pluginExist = true;
            return;
        }
        return;
    }
    
    //android_tc客户端下载提示信息
    function showAndroidTcDownloadTip()
    {
        accessClientVersion = $.cookie("accessClientVersion");
        var nosupporter = $("#nosupportTip");
        nosupporter.find("#nosupportTipText").text(LA("Nosupport"));
        
        var dowloader = $("#downloadClient");
        dowloader.find("#downloadClientButtion2").attr("href", webui.system.androidTcDownloadUrl);
        
        pluginExist = true;
        
        if (accessClientVersion < webui.system.config.androidTcClientVersion)
        {
            dowloader.find("#downloadClientTip1").text(LA("clientVersionLowAndroidTc"));
            dowloader.find("#downloadClientButtion2").text(LA("Download2"));
            dowloader.find("#downloadClientTip2").text(LA("DownloadLastApp"));
            
            setTimeout(function(){
                dowloader.fadeIn();
            }, 2000);
            
            return;
        }
        return;
    }
    
    /**
     * 显示客户端下载详情提示
     * @param msgList: 提示信息列表
     */
    function showClientTipDetail(msgList){
        // 显示升级语句
        var tips = "";
        if (typeof(msgList) != "undefined" && msgList.length > 0) {
            for (var i in msgList) {
                tips += msgList[i] + "<br/>";
            }
            tips.substring(0, tips.lastIndexOf("<br/>", 0));
        }
        
        return tips;
    }
    
    function changeBoxStyle(clientDownloadUrl){
        $("#messageBox").find(".globalDialog").css({
            "background-image": "url(/uns/default/img/dashbord/midbox_2.png)"
        });
        $("#messageBox").find(".smallGlobalDialog").css({
            "height": "335px",
            "width": "555"
        });
        $("#messageBox").find("#globalConfirmTipText").css({
            "text-align": "left",
            "font-size": "16px"
        });
        $("#messageBox").find("#globalConfirmTipContainer").css({
            "top": "95px",
            "left": "50%",
            "margin-left": "-236px",
            "width": "470px"
        });
        $("#messageBox").find("#globalDialogButtonsWarp").css({
            "bottom": "40px"
        });
        $("#messageBox").find(".globalDialogTitle").css({
            "top": "36px"
        });
        $("#messageBox").find(".globalDialogClose").css({
            "top": "39px"
        });
        $("#messageBox").find(".globalDialogDownloadLink").css({
            "font-size": "16px",
            "line-height": "33px",
            "font-size": "15px",
            "text-decoration": "inherit",
            "font-family": "Microsoft YaHei",
            "text-shadow": "1px 1px 4px #f9f9f9"
        });
        
        $("#messageBox").find(".globalDialogDownloadLink").click(function(){
            clientDownload(clientDownloadUrl);
        });
    }
    
    function clientDownload(name){
        var success_callback = function(msg, error){
        
            if (msg.getResponseHeader("downloadflag") === "false") {
                console.log("the status is not right status = " + msg.status);
                
                tipText = LA('download limit tip');
                // 超过总数需要提示出错
                webui.objects.dashbord.messageBox.show(LA("Notice"), tipText, "<Canncel>", function(result){
                }, downloadLimitBoxStyle);
                return;
            }
            
            //执行下载
            var url = commonvar.serviceUrl.clientDownload + "?name=" + name;
            document.getElementById("clientIframe").src = url;
        };
        
        var error_callback = function(msg, error){
            console.log("clientDownload error msg.status = " + msg.status);
        };
        
        ServiceAPI.ajaxGetNoResult("", commonvar.serviceUrl.clientDownload + "?checkDownloadFlag", success_callback, error_callback);
    }
	
    function downloadLimitBoxStyle()
	{
		$("#messageBox").find("#globalConfirmTipContainer").css({"top":"109px"});
	}
    
    function isPluginExist(){
        return pluginExist;
    }
    function isPluginExistR21()
    {
        return pluginExistR21;
    }
    
    function isFirstCheck()
    {
        return firstCheck;
    }
    
    webui.objects.dashbord.pluginChecker =
    {
        begin: begin,
        checkOs:checkOs,
        isPluginExist: isPluginExist,
        isPluginExistR21: isPluginExistR21,
        isFirstCheck: isFirstCheck
    };
})();

// 构造全局提示框对象webui.objects.dashbord.messageBox
(function(){
    var g_callback = null;
    
    // 显示对话框，titile为标题，text为内容，buttons为所需要的按钮，格式为一个字符串用<>将所需的按钮名字包含，如<Ok><Canncel><Ignore>
    // callback为外部回调，格式为callback(result)，result为用户点击按钮的名字，点击x固定返回<Canncel>
    function show(title, text, buttons, callback, changeBoxStyle){
        if (typeof(changeBoxStyle) != "undefined") {
            changeBoxStyle();
        }
        
        if (typeof(g_callback) != "undefined" && g_callback != null) 
            g_callback("<Canncel>");
        g_callback = callback;
        
        $("#messageBox").find(".globalDialogTitle").text(title);
        $("#messageBox").find("#globalConfirmTipText").html(text);
        if (buttons.indexOf("<Ok>", 0) != -1) 
            $("#messageBox").find(".globalDialogOk").show();
        else 
            $("#messageBox").find(".globalDialogOk").hide();
        
        if (buttons.indexOf("<download>", 0) != -1) {
            $("#messageBox").find(".globalDialogDownload").show();
            $("#messageBox").find(".globalDialogDownloadLink").text(LA("Click download"));
        }
        else {
            $("#messageBox").find(".globalDialogDownload").hide();
        }
        
        if (buttons.indexOf("<Canncel>", 0) != -1) 
            $("#messageBox").find(".globalDialogCanncel").show();
        else 
            $("#messageBox").find(".globalDialogCanncel").hide();
        if (buttons.indexOf("<Ignore>", 0) != -1) 
            $("#messageBox").find(".globalDialogIgnore").show();
        else 
            $("#messageBox").find(".globalDialogIgnore").hide();
        $("#messageBox").show();
    }
    
    function hide(result){
        $("#messageBox").hide();
        g_callback(result);
        g_callback = null;
        
        // 如果修改了样式，当取消后恢复
        renewBoxStyle();
    }
    
    function renewBoxStyle(){
        $("#globalDialog").css("height", "275px");
        $(".smallGlobalDialog").css("width", "451px");
        $("#globalDialog").css("background-image", "url(/uns/default/img/dashbord/smallbox.png)");
        $("#globalConfirmTipContainer").css("top", "132px");
        $("#globalConfirmTipText").css("font-size", "16px");
        $("#globalConfirmTipText").css("text-align", "center");
        $("#messageBox").find("#globalConfirmTipContainer").css({
            "top": "132px",
            "left": "30px",
            "width": "390px",
            "margin-left": "0px"
        });
    }
    
    function begin(){
        // 绑定行为
        $("#messageBox").find(".globalDialogClose").click(function(){hide("<Canncel>")});
        $("#messageBox").find(".globalDialogOkLink").click(function(){hide("<Ok>")});
        $("#messageBox").find(".globalDialogCanncelLink").click(function(){hide("<Canncel>")});
        $("#messageBox").find(".globalDialogIgnoreLink").click(function(){hide("<Ignore>")});
		
		$("#messageBox").find(".globalDialogDownloadLink").click(function(){hide("<download>")});
        
        // 翻译按钮语言
        $("#messageBox").find(".globalDialogOkLink").css("background-image", "url(" + LA("globalConfirmOkLink") + ".png)");
        $("#messageBox").find(".globalDialogCanncelLink").css("background-image", "url(" + LA("globalConfirmCanncelLink") + ".png)");
        $("#messageBox").find(".globalDialogIgnoreLink").css("background-image", "url(" + LA("globalConfirmIgnoreLink") + ".png)");
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
        $("#choiceLang").find(".globalDialogOkLink").css("background-image", "url(" + LA("globalConfirmOkLink") + ".png)");
        $("#choiceLang").find(".globalDialogCanncelLink").css("background-image", "url(" + LA("globalConfirmCanncelLink") + ".png)");
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
        var cookieImg = $.cookie("bgImg");
        var optionVal = "/uns/default/img/null.jpg";
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
            if (optionVal == "def") commonvar.setCookieByProtocol("bgImg",null);
            else commonvar.setCookieByProtocol("bgImg",optionVal);
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
        $("#changeBg").find(".globalDialogOkLink").css("background-image", "url(" + LA("globalConfirmOkLink") + ".png)");
        $("#changeBg").find(".globalDialogCanncelLink").css("background-image", "url(" + LA("globalConfirmCanncelLink") + ".png)");
        
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
        loading();
        var boxEle = $("#powerMgr");
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
                unloading();
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
                console.log("getVMsPowerSet msg.status = " + msg.status);
                if (msg.status == 403)
                {
                    window.location.href = commonvar.serviceUrl.errorPage403;
                }
                
                unloading();
                console.log("get power error:", ret);
                hide("<Canncel>", callback);
            }
        });            
    }
    
    function hide(result, callback)
    {
        if (result == "<Ok>")
        {
            var selector = $("#powerMgr").find(".powerSelector");
            var itemVal = selector.val();
            if (itemVal == "none") itemVal = 0;
            else if (itemVal == "all") itemVal = 1;
            else if (itemVal == "sleep") itemVal = 2;
            else if (itemVal == "sr") itemVal = 3;
            
            loading();
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
                    unloading();
                    $("#powerMgr").hide();
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
                      console.log("setVMsPowerSet msg.status = " + msg.status);
                    if (msg.status == 403)
                    {
                        window.location.href = commonvar.serviceUrl.errorPage403;
                    }
                    
                    unloading();
                    $("#powerMgr").hide();
                    console.log("set power error:", ret);
                    if (typeof(callback) != "undefined" && callback != null) callback("<Canncel>");
                }
            });            
        }
        else
        {
            $("#powerMgr").hide();
            if (typeof(callback) != "undefined" && callback != null) callback(result);
        }
    }
    
    function begin()
    {
        // 翻译提示语言
        $("#powerMgr").find(".powerNone").text(LA("Forbid automatic SHUTDOWN/RESET/SLEEP"));
        $("#powerMgr").find(".powerAll").text(LA("Allow automatic SHUTDOWN/RESET/SLEEP"));
        $("#powerMgr").find(".powerSleep").text(LA("Allow automatic SLEEP"));
        $("#powerMgr").find(".powerSR").text(LA("Allow automatic SHUTDOWN/RESET"));
        
        // 翻译按钮语言
        $("#powerMgr").find(".globalDialogOkLink").css("background-image", "url(" + LA("globalConfirmOkLink") + ".png)");
        $("#powerMgr").find(".globalDialogCanncelLink").css("background-image", "url(" + LA("globalConfirmCanncelLink") + ".png)");
        
        // 绑定行为
        $("#powerMgr").find(".globalDialogClose").click(function(){hide("<Canncel>")});
        $("#powerMgr").find(".globalDialogOkLink").click(function(){hide("<Ok>")});
        $("#powerMgr").find(".globalDialogCanncelLink").click(function(){hide("<Canncel>")});
        
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
        $("#neterror").find("#netErrorTipText").text(text);
        $("#neterror").show();
    }
    
    function hide()
    {
        $("#neterror").hide();
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
        window.location.href = commonvar.serviceUrl.logoutPage;
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
        commonvar.setBgImg();
        
        commonvar.setHdpPluginLoad();
        
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
        

        // 获取property的值
        commonvar.getConfigInfo(call_back);

        $("#compatibility").text(LA("Compatibility"));
        
        

        $(window).focus(function() {    
            if(isLowIeBrower() == true)
            {
                return ;             
            }    
                      
            if(getVmListTimmer != null && getVmListTimmer != undefined )
            {
                return ;
            }
            clearInterval(getVmListTimmer);
            webuilog(loglevel.info,"start getVmListTimmer ");
            webui.objects.dashbord.vmMgr.tryLoop(0);
            getVmListTimmer = setInterval("webui.objects.dashbord.vmMgr.tryLoop(0)", webui.system.refreshVmStateTime);
        });

        $(window).blur(function() {
         
         if(isLowIeBrower() == true)
         {
             return ;             
         }            
            
         webuilog(loglevel.info,"cancel getVmListTimmer ");
         clearInterval(getVmListTimmer);
         getVmListTimmer = null;
       });
    }
    
    function isLowIeBrower()
    {
        if("ie8" == commonvar.getBrowserType() || "ie7" == commonvar.getBrowserType() )
        {
            return true;
        }
        return false;
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

(function(){
    
    //获取系统类型
    function checkOs()
    {
        var os_type = $.cookie("accessClientType");
        return os_type;
    }
    
    function androidTcDisplay()
    {
        var osType = checkOs();
        
        if (osType == "android_tc")
        {
            $("#onlinehelpimg").hide();
            $(".loginVnc").hide();
            $(".powerSet").css("left","20px");
            $(".reboot").css("left","65px");
            $(".forceReboot").css("left","110px");
        }
    }
    
    function begin()
    {
        //android TC调整页面样式
        androidTcDisplay();
    }
    
    webui.objects.dashbord.rejustdiplay = 
    {
            begin:begin,
            androidTcDisplay:androidTcDisplay
    };
})();

(function(){
    
    var clientMac;
    var clientIp;
    
    function begin()
    {
        //初始化hdpclient插件
        hdpclient.init();
        
        //先缓存mac和ip
        clientMac = hdpclient.getClientMac();
        clientIp = hdpclient.clientIp();
    }
    
    function getClientMac()
    {
        return clientMac;
    }
    
    function getClientIp()
    {
        return clientIp;
    }
    
    webui.objects.dashbord.hdpclient = 
    {
        begin:begin,
        getClientMac:getClientMac,
        getClientIp:getClientIp
    };
})();

//页面初始化
$(document).ready(function(){
    
    //初始化hdpclient插件
    webui.objects.dashbord.hdpclient.begin();
    
    webui.objects.dashbord.system.begin();
    webui.objects.dashbord.netErrorTiper.begin();
    webui.objects.dashbord.vmMgr.begin();
    webui.objects.dashbord.popupMgr.begin();
    webui.objects.dashbord.messageBox.begin();
    webui.objects.dashbord.LangChoice.begin();
    webui.objects.dashbord.bgChoice.begin();
    webui.objects.dashbord.powerSet.begin();
    webui.objects.dashbord.optioner.begin();
    
    //重新定义页面元素显示
    webui.objects.dashbord.rejustdiplay.begin();
    
    //根据浏览器大小调整位置
    $(window).resize(function() {
        commonvar.showscroll(); 
       }); 
});
