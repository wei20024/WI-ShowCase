var appcommon = {
    pageNum : 0, //一页显示app个数
    pageCount : 0,//页数
    curPage : 1,//当前第几页
    appListWidth : 340,//app区域宽度
    appListHeight : 370,//app区域高度
    myCollectionList : new Array(),//常用应用列表
    allAppList : new Array(),//所有应用列表
    appImgSrc : "/uns/default/img/app/",
    appIconSrc : "/uns/default/img/app/appicon/",
    desktopImg : "/uns/default/img/app/appicon/windowsDesktop.png",
    itemFloatDivW : 88, //浮动背景div的宽度
    itemFloatDivH : 88, //浮动背景div的高度
    itemMarginTop : 30, //appItem上边距大小
    itemMarginLeft : 25, //appItem左边距大小
    itemMarginRight : 25, //appItem右边距大小
    itemMarginBottom : 40, //appItem底边距大小
    showVmTabBtn : true, //是否显示桌面Tab按钮
        
    bindPageBtnEvent : function(appList, type)
    {
        //总页数小于1时隐藏分页控件，
        if(appcommon.pageCount > 1){
            var curPage = appcommon.curPage;
            appcommon.setSlideGroup(false, true, true);
            $(".rightBtn").unbind("click").bind("click", function(){
                if (appcommon.curPage < appcommon.pageCount) {
                    appcommon.curPage = appcommon.curPage + 1;
                    webui.objects.dashbord.app.loadAppList(appList, type);
                    if (appcommon.curPage == appcommon.pageCount) {
                        appcommon.setSlideGroup(true, false, true);
                    }
                    else {
                        appcommon.setSlideGroup(true, true, true);
                    }
                    appcommon.setSlideIndex();
                }
            });
            $(".leftBtn").unbind("click").bind("click", function(){
                if (appcommon.curPage > 1) {
                    appcommon.curPage = appcommon.curPage - 1;
                    webui.objects.dashbord.app.loadAppList(appList, type);
                    if (appcommon.curPage <= 1) {
                        appcommon.setSlideGroup(false, true, true);
                    }
                    else {
                        appcommon.setSlideGroup(true, true, true);
                    }
                    appcommon.setSlideIndex();
                }
            });
        }else{
            appcommon.setSlideGroup(false, false, false);
        }
    },
    
    /**
     * 设置左右翻页按钮和底部页签区域是否显示
     * @param flag 标志位 true:显示，false：隐藏
     */
    setSlideGroup : function(flag_left, flag_right, falg_bottom)
    {
        if (flag_left) {
            $("#leftBtn").show();
        }
        else
        {
            $("#leftBtn").hide();
        }
        
        if (flag_right) {
            $("#rightBtn").show();
        }
        else
        {
            $("#rightBtn").hide();
        }
        
        if (falg_bottom) {
            $("#slideBottomArea").show();
        }
        else
        {
            $("#slideBottomArea").hide();
        }
    },
    
    //初始化APP区域大小
    initAppArea : function()
    {
        var clientWidth = document.documentElement.clientWidth;
        clientWidth = clientWidth < 800 ? 800 : clientWidth;
        
        var clientHeight = document.documentElement.clientHeight;
        clientHeight = clientHeight < 720 ? 720 : clientHeight;
        
        var appListWidth = clientWidth - 120*2 - 50*2;
        var appListHeight = clientHeight - 200 - 80;
        var itemWidth = appcommon.itemFloatDivW + appcommon.itemMarginLeft + appcommon.itemMarginRight;
        var itemHeight = appcommon.itemFloatDivW + appcommon.itemMarginTop + appcommon.itemMarginBottom;
        appListWidth = appListWidth - (appListWidth % itemWidth);
        appListHeight = appListHeight - (appListHeight % itemHeight);
        appcommon.pageNum = parseInt(appListWidth / itemWidth) * parseInt(appListHeight / itemHeight);
        appcommon.appListWidth = appListWidth;
        appcommon.appListHeight = appListHeight;
        
        $(".appDivEle").css("width", appListWidth);
        
        //根据页面大小设置底部圆点区域距离浏览器顶部的距离
        //不用bottom的原因：IE8下 设置bottom在分辨率较小时出现重叠现象
        var slideBottom = 640;
        if (clientHeight > 720) {
            slideBottom = clientHeight - 80;
        }
        else
        {    
            slideBottom = 640;
        }
        
        $(".slideBottomArea").css("top", slideBottom);
    },
    
    //生成底部圆点个数。
    appendSlideBottomLi : function(num, appList, type)
    {
        if (num < 2) {
            return;
        }
        var sledeBottomEle = $("#slideBottomArea");
        sledeBottomEle.empty();
        for ( var i = 0; i < num; i++) {
            var liTemp = "";
            var liId = "btngo" + i;
            if (i == 0) {
                liTemp = '<a class="hightLight" id="' + liId + '" title="'+(i+1)+'"></a>';
            }
            else
            {
                liTemp = '<a class="normalLight" id="' + liId + '" title="'+(i+1)+'"></a>';
            }
            sledeBottomEle.append(liTemp);
        }
        sledeBottomEle.find("a").each(function(index){
            $(this).bind("click", function(){
                appcommon.curPage = index + 1;
                webui.objects.dashbord.app.loadAppList(appList, type);
                if (appcommon.curPage == appcommon.pageCount) {
                    appcommon.setSlideGroup(true, false, true);
                }
                else {
                    appcommon.setSlideGroup(true, true, true);
                }
                appcommon.setSlideIndex();
            });
        });
    },
    
    setSlideIndex : function()
    {
        $("#slideBottomArea").find("a").each(function(index){
            if ($(this).attr("class") == "hightLight") {
                $(this).removeClass("hightLight").addClass("normalLight");
            }
            if (appcommon.curPage == index + 1) {
                $(this).removeClass("normalLight").addClass("hightLight");
            }
        });
    },
    
    //查询应用（前台过滤）
    searchAppByName : function(value, appList)
    {
        if ("undefined" == typeof(value) || $.trim(value) == "") {
            return appList;
        }
        value = $.trim(value);
        if (appList.length == 0) {
            return null;
        }
        var resultList = new Array();
        if (value != "" && value != null) {
            for ( var i = 0; i < appList.length; i++) {
                var app = appList[i];
                var appName = app.appName;
                if (appName.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                    resultList.push(app);
                }
            }
            return resultList;
        }
        else
        {
            return null;
        }
    },
    
    initPageParam : function(appList, type)
    {
        if ("undefined" == typeof(appList) || appList == null) {
            return;
        }
        appcommon.pageCount = Math.ceil(appList.length/appcommon.pageNum);
        appcommon.curPage = 1;
        
        //生成底部圆点个数
        appcommon.appendSlideBottomLi(appcommon.pageCount, appList, type);
        
        //绑定左右滑动按钮事件
        appcommon.bindPageBtnEvent(appList, type);
    }
    
};

//桌面与应用tab页切换
(function(){
    var vmBtnEle;
    var myAppBtnEle;
    var allAppBtnEle;
    var vmDivEle;
    var appDivEle;
    
    //初始化tab按钮元素控件
    function initEle()
    {
        vmBtnEle = $("#vmTabBtn");
        myAppBtnEle = $("#myAppTabBtn");
        allAppBtnEle = $("#allAppTabBtn");
        vmDivEle = $("#vmArea");
        appDivEle = $("#appArea");
    }
    
    //初始化翻译
    function translate()
    {
        vmBtnEle.text(LA("my desktop"));
        myAppBtnEle.text(LA("my application"));
        allAppBtnEle.text(LA("all application"));
    }
    
    function begin()
    {
        initEle();
        translate();
        initTabLayout();
        
        //不显示虚拟机列表时，改变原有tab页按钮样式
        if (!appcommon.showVmTabBtn) {
            $("#tabBtnArea").addClass("tabBtnStyle2");
            $("#vmTabBtn").hide();
            $("#myAppTabBtn").removeClass("tabBtnCenter").addClass("tabBtnLeft");
        }
        
        $("#tabBtnArea").show();
        
        vmBtnEle.click(function(){
            commonvar.setCookieByProtocol("tabPageTag", "vmList");
            if (checkTabFocus(vmBtnEle)) {
                return;
            }
            showVmList();
        });
        
        myAppBtnEle.click(function(){
            commonvar.setCookieByProtocol("tabPageTag", "myAppList");
            if (checkTabFocus(myAppBtnEle)) {
                return;
            }
            showMyAppList();
            webui.objects.dashbord.app.appendAppHtml(0);
        });
        
        allAppBtnEle.click(function(){
            commonvar.setCookieByProtocol("tabPageTag", "allAppList");
            if (checkTabFocus(allAppBtnEle)) {
                return;
            }
            showAllAppList();
            webui.objects.dashbord.app.appendAppHtml(1);
        });
    }
    
    function showVmList()
    {
        vmDivEle.show();
        appDivEle.hide();
        vmBtnEle.css("background-image","url('')");
        myAppBtnEle.css("background","url('"+appcommon.appImgSrc+"menucenter.png')");
        allAppBtnEle.css("background","url('"+appcommon.appImgSrc+"menuright.png')");
        vmBtnEle.removeClass("tabBtnColor1").addClass("tabBtnColor2");
        myAppBtnEle.removeClass("tabBtnColor2").addClass("tabBtnColor1");
        allAppBtnEle.removeClass("tabBtnColor2").addClass("tabBtnColor1");
        
        //显示虚拟机列表时隐藏左右滑动按钮和底部圆点
        appcommon.setSlideGroup(false, false, false);
    }
    
    function showMyAppList()
    {
        vmDivEle.hide();
        appDivEle.show();
        myAppBtnEle.css("background-image","url('')");
        if (appcommon.showVmTabBtn) {
            vmBtnEle.css("background-image","url('"+appcommon.appImgSrc+"menuleft.png')");
            vmBtnEle.removeClass("tabBtnColor2").addClass("tabBtnColor1");
        }
        allAppBtnEle.css("background-image","url('"+appcommon.appImgSrc+"menuright.png')");
        myAppBtnEle.removeClass("tabBtnColor1").addClass("tabBtnColor2");
        allAppBtnEle.removeClass("tabBtnColor2").addClass("tabBtnColor1");
        //清空查询条件
        $("#searchAppName").val(LA("default search input value"));
    }
    
    function showAllAppList()
    {
        vmDivEle.hide();
        appDivEle.show();
        allAppBtnEle.css("background-image","url('')");
        if (!appcommon.showVmTabBtn) {
            myAppBtnEle.css("background-image","url('"+appcommon.appImgSrc+"menuleft.png')");
        }
        else
        {
            myAppBtnEle.css("background-image","url('"+appcommon.appImgSrc+"menucenter.png')");
            vmBtnEle.css("background-image","url('"+appcommon.appImgSrc+"menuleft.png')");
            vmBtnEle.removeClass("tabBtnColor2").addClass("tabBtnColor1");
        }
        myAppBtnEle.removeClass("tabBtnColor2").addClass("tabBtnColor1");
        allAppBtnEle.removeClass("tabBtnColor1").addClass("tabBtnColor2");
        //清空查询条件
        $("#searchAppName").val(LA("default search input value"));
    }
    
    //根据cookie中的值显示当前的tab页
    function initTabLayout()
    {
        var tabPageTagValue = $.cookie("tabPageTag");
        console.log("initTabLayout(): tabPageTag = %s.", tabPageTagValue);
        
        switch (tabPageTagValue) {
        case "vmList":
            if (appcommon.showVmTabBtn) {
                showVmList();
            }
            break;
        case "myAppList":
            showMyAppList();
            break;
        case "allAppList":
            showAllAppList();
            break;
        default:
            break;
        }
    }
    
    //检查tab焦点
    function checkTabFocus(obj)
    {
        //目标元素中样式包含“tabBtnColor2”时，说明当前页面已经处于该tab页
        if (obj.attr("class").indexOf("tabBtnColor2") != -1) {
            return true;
        }
        return false;
    }
    
    webui.objects.dashbord.changetabpage = 
    {
        begin:begin
    };
})();

(function(){
    var appInfo = {};
    
    //控制遮盖层的显示和隐藏
    function changeCoverState(appId, flag)
    {
        if (flag) {
            $("#" + appId).find(".appCover").show();
            $("#" + appId).find(".loaderImg").show();
        }
        else
        {
            $("#" + appId).find(".appCover").hide();
            $("#" + appId).find(".loaderImg").hide();
        }
    }
    
    /**
     * 获取APP列表 同时根据type是否选择生成HTML元素（是否调用loadAppList方法）
     * type = -1 : 应用区域不生成HTML
     * type = 0 : 生成常用应用HTML
     * type = 1 : 生成所有应用HTML
     */
    function getAppList(type)
    {
        var appreq = {queryType:1};
        var params = JSON.stringify(appreq);
        var success_callback = function(msg) {
            try {
                if (msg.resultCode == 0) {
                    
                    appcommon.myCollectionList = msg.myAppInfos;
                    appcommon.allAppList = msg.appInfos;
                    
                    //根据类型加载对应的页面应用元素
                    appendAppHtml(type);

                } else {
                    console.log("get app list failed(%s).", msg.resultCode);
                }
            } catch (err) {
                console.log("get app throw exception:" + err, err.stack ? err.stack : "");
            }
        };
        var error_callback=function(msg,error){
            console.log("get app list error(%d, %s).", msg.readyState, error);
            console.log("getLoginInfo msg.status = " + msg.status);
        };
        
        ServiceAPI.ajaxPostJSON(params, webui.objects.dashbord.actionurls.getVmList, success_callback, error_callback);
    };
    
    function appendAppHtml(type)
    {
        //根据类型加载对应的页面应用元素
        if (type == 0) {
            appcommon.initPageParam(appcommon.myCollectionList, type);
            loadAppList(appcommon.myCollectionList, type);
        }
        else if (type == 1) {
            appcommon.initPageParam(appcommon.allAppList, type);
            loadAppList(appcommon.allAppList, type);
        }
        else {
            console.log("other type(%s)", type);
        }
    }
    
    /*
     * 1：先把应用列表里面的特殊应用（桌面）和普通应用区分出来；
     * 2：组装成新的列表并把桌面放在前面；
     */
    function appListSort(appList)
    {
        var resultList = new Array();
        var desktopList = new Array();
        var appInfoList = new Array();
        for (var i in appList) {
            if (appList[i].appType == 1) {
                desktopList.push(appList[i]);
            }
            else {
                appInfoList.push(appList[i]);
            }
        }
        
        for ( var i in desktopList) {
            resultList.push(desktopList[i]);
        }
        for ( var i in appInfoList) {
            resultList.push(appInfoList[i]);
        }
        
        return resultList;
    }
    
    /**
     * appList : 应用列表
     * type: 0->常用应用 1->所有应用
     */
    function loadAppList(appList, type)
    {
        var templateSelector = "#appLiTemplate";
        var template = $(templateSelector);
        var containerSelector = "#appList";
        var container = $(containerSelector);
        //清空UL容器中的元素
        container.empty();
        
        if (appList != null && appList != "undifined" && appList.length > 0) {
            var content = template.html();
            var liId = "li_item_" + appcommon.curPage;
            content = content.replace(/__liItem__/g, liId);
            content = content.replace(/__index__/g, appcommon.curPage);
            container.append(content);
            
            var startNum = (appcommon.curPage - 1) * appcommon.pageNum;
            var endNum = appcommon.curPage * appcommon.pageNum;
            if (endNum > appList.length) {
                endNum = appList.length;
            }
            for (var j = startNum; j < endNum; j++)
            {
                appendHtmlForApp(appList[j], liId, type);
            }
                
            //设置Li长度
            webui.objects.dashbord.initMyAppView.resetAppAreaStyle();
            
            //绑定鼠标移入移出事件
            appItemMouseover(type);
            
            //刷新应用图标
            refreshAppIcon();
            
            $(".searchArea").show();
        }
        else
        {
            appcommon.setSlideGroup(false, false, false);
        }
    }
    
    function appendHtmlForApp(app, liId, type)
    {
        // 填充新桌面的HTML元素
        var templateSelector = "#appItemTemplate";
        var template = $(templateSelector);
        
        var content = template.html();
        var appId = app.appId;
        var appName = app.appName;
        var appImg = appcommon.appIconSrc + app.appId + ".png";
        if (app.appType == 1) {
            appImg = appcommon.desktopImg;
        }
        var optImg = appcommon.appImgSrc + "heart.png";
        var angleStyle = "";
        
        if (type == 0) {
            angleStyle = "angleDiv1";
        }
        else if (type == 1) {
            if (app.favoriteFlag == 0) {
                optImg = appcommon.appImgSrc + "heart.png";
            }
            else if(app.favoriteFlag == 1) {
                optImg = appcommon.appImgSrc + "redheart.png";
            }
            angleStyle = "angleDiv2";
        }
        
        content = content.replace(/__appId__/g, appId);
        content = content.replace(/__appName__/g, appName);
        content = content.replace(/__angleStyle__/g, angleStyle);
        $("#" + liId).append(content);
        
        var itemStyle = "width:" + appcommon.itemFloatDivW + "px;height:"
                        + appcommon.itemFloatDivH + "px;margin:" + appcommon.itemMarginTop
                        + "px " + appcommon.itemMarginRight + "px " + appcommon.itemMarginBottom 
                        + "px " + appcommon.itemMarginLeft + "px";
        $("#" + appId).attr("style", itemStyle);
        
        var bgStyle = "width:" + (appcommon.itemFloatDivW - 4) + "px;height:"
                        + (appcommon.itemFloatDivH - 4) + "px;margin: 2px !important;";
        $("#" + appId).find(".bgImgItem").attr("style", bgStyle);
        
        $("#" + appId).find(".bgImgItem").find("img").attr("src", appImg);
        $("#" + appId).find(".appNameItem").find("a").attr("title", appName);
        if (type == 1) {
            $("#" + appId).find(".angleDiv").find("a").css("background-image", "url('"+ optImg +"')");
        }
        
        var appconnect = new connectApp(app);
        var addCommonApp = new dealFavoriteApp(app, type);
    }
    
    //绑定启动应用事件
    var connectApp = function(appInfo)
    {
        $("#" + appInfo.appId).find(".bgImgItem").click(function(){
            changeCoverState(appInfo.appId, true);
            tryConnectApp(appInfo);
        });
        $("#" + appInfo.appId).find(".appNameItem").find("a").click(function(){
            changeCoverState(appInfo.appId, true);
            tryConnectApp(appInfo);
        });
        
        $("#" + appInfo.appId).find(".fillAngleBank").click(function(){
            changeCoverState(appInfo.appId, true);
            tryConnectApp(appInfo);
        });
    };
    
    //绑定操作事件
    var dealFavoriteApp = function(appInfo, type)
    {
        $("#" + appInfo.appId).find(".angleDiv").find("a").click(function(){
            changeCoverState(appInfo.appId, true);
            addCommonApp(appInfo, type);
        });
    };
    
    //添加到/移除常用应用
    function addCommonApp(appInfo, type)
    {
        var favoriteFlag = appInfo.favoriteFlag;
        if (favoriteFlag == 0) {
            favoriteFlag = 1;
        }
        else if (favoriteFlag == 1)
        {
            favoriteFlag = 0;
        }
        
        var dealReq = {
            userName: $.trim($("#username").text()),
            domain: $.cookie("selectedDomain"),
            appId: appInfo.appId,
            farmId: appInfo.farmId,
            favoriteFlag: favoriteFlag
        };
        
        var params = JSON.stringify(dealReq);

        var success_callback = function(msg) {
            try {
                if (msg.resultCode == 0) {
                    if (type == 1) {
                        changeOptImg(favoriteFlag, appInfo.appId);
                        appInfo.favoriteFlag = favoriteFlag;
                        getAppList(-1);
                    }
                    else
                    {
                        //常用应用移除操作时：要刷新页面
                        getAppList(0);
                    }
                    changeCoverState(appInfo.appId, false);
                } else {
                    console.log("addCommonApp failed(%s).", msg.resultCode);
                    var desc = LA(msg.resultCode);
                    //收藏/取消收藏应用错误描述
                    if (desc == msg.resultCode && favoriteFlag == 0 && type == 0) {
                        desc = LA("Remove APP failed");
                    }
                    else if (desc == msg.resultCode && favoriteFlag == 0 && type == 1) {
                        desc = LA("Cancel APP failed");
                    }
                    else if (desc == msg.resultCode && favoriteFlag == 1) {
                        desc = LA("Add APP failed");
                    }
                    globalErrorTip(appInfo.appName, desc + "(" + msg.resultCode +")");
                    changeCoverState(appInfo.appId, false);
                }
            } catch (err) {
                console.log("get app throw exception:" + err, err.stack ? err.stack : "");
                globalErrorTip(appInfo.appName, err.stack ? err.stack : "");
                changeCoverState(appInfo.appId, false);
            }
        };
        var error_callback=function(msg,error){
            console.log("addCommonApp error(%d, %s).", msg.readyState, error);
            console.log("addCommonApp msg.status = " + msg.status);
            globalErrorTip(appInfo.appName, LA("Request Error"));
            changeCoverState(appInfo.appId, false);
        };
        
        ServiceAPI.ajaxPostJSON(params, webui.objects.dashbord.actionurls.dealFavoriteApp, success_callback, error_callback);
    }
    
    function changeOptImg(optType, appId)
    {
        if (optType == 0) {
            $("#" + appId).find(".angleDiv").find("a").css("background-image", "url('"+ appcommon.appImgSrc + "heart.png')");
        }
        else
        {
            $("#" + appId).find(".angleDiv").find("a").css("background-image", "url('"+ appcommon.appImgSrc + "redheart.png')");
        }
    }
    
    //鼠标进入APP图标区域时显示浮动div
    function appItemMouseover(type)
    {
        var appListObj = $("#appList");
        
        if (type == 0) 
        {
            myAppMouseEvent(appListObj.find(".bgImgItem"));
            myAppMouseEvent(appListObj.find(".angleDiv"));
            myAppMouseEvent(appListObj.find(".fillAngleBank"));
        }
        else if(type == 1)
        {
            allAppMouseEvent(appListObj.find(".bgImgItem"));
            allAppMouseEvent(appListObj.find(".angleDiv"));
            allAppMouseEvent(appListObj.find(".fillAngleBank"));
        }
    }
    
    //绑定鼠标移入指定区域时显示浮动div和右上角操作区域
    function myAppMouseEvent(obj)
    {
        obj.bind("mouseover", function(){
            $(this).parent().find(".angleDiv").show();
            $(this).parent().find(".floatDiv").show();
        });
        obj.bind("mouseleave", function(){
            $(this).parent().find(".angleDiv").hide();
            $(this).parent().find(".floatDiv").hide();
        });
    }
    
    //绑定鼠标移出指定区域时显示浮动div和右上角操作区域
    function allAppMouseEvent(obj)
    {
        obj.bind("mouseover", function(){
            var floatDiv = $(this).parent().find(".floatDiv");
            var angleDiv = $(this).parent().find(".angleDiv");
            floatDiv.show();
            angleDiv.addClass("angleDivBg");
            var appImgObj = $(angleDiv.find("a")[0]);
            if (appImgObj.css("background-image").indexOf("/heart.png") != -1) {
                appImgObj.css("background-image", "url('" + appcommon.appImgSrc + "heart_w.png')");
            }
        });
        obj.bind("mouseleave", function(){
            var floatDiv = $(this).parent().find(".floatDiv");
            var angleDiv = $(this).parent().find(".angleDiv");
            floatDiv.hide();
            angleDiv.removeClass("angleDivBg");
            var appImgObj = $(angleDiv.find("a")[0]);
            if (appImgObj.css("background-image").indexOf("/heart_w.png") != -1) {
                appImgObj.css("background-image", "url('" + appcommon.appImgSrc + "heart.png')");
            }
        });
    }
    
    function tryConnectApp(appInfo) 
    {
        if (webui.objects.dashbord.pluginChecker.isPluginExist() == false)
        {
            globalErrorTip(appInfo.appName, LA("Please install client first"));
            changeCoverState(appInfo.appId, false);
            return;
        }    

        //1.5.30之后支持应用虚拟化 
        if (commonvar.getBrowserType() != "chrome" && hdpclient.clientVersion() < "1.5.30.0") {
            globalErrorTip(appInfo.appName, LA("Please upgrade client first"));
            changeCoverState(appInfo.appId, false);
            return;
        }
        
        var appreq = {
                farmId: appInfo.farmId,
              vmDomain: $.cookie("selectedDomain"),
                 appId: appInfo.appId,
            appGroupId: appInfo.appGroupId,
             clientMac: webui.objects.dashbord.hdpclient.getClientMac(),
            clientName: hdpclient.clientName(),
              clientIp: webui.objects.dashbord.hdpclient.getClientIp(),
         clientVersion: hdpclient.clientVersion(),
            clientType: hdpclient.clientType(),
               appType: appInfo.appType
        };
        
        var params = JSON.stringify(appreq);
    
        var success_callback = function(msg){
            if (msg.resultCode != 0)
            {
                console.log("login app fail(" + msg.resultCode + ")");
                // 先取应用虚拟划中错误码
                var desc = LA(msg.resultCode);
                    
                if (desc == msg.resultCode) {
                    // 没取到，取跟桌面一致错误码
                    desc = checkCode(msg.resultCode);
                        
                    if ("" == desc)
                    {
                        //都没有取到就取默认
                        desc = LA("Login APP failed");
                    }  
                    else
                    {
                        globalErrorTip(appInfo.appName, desc);
                        changeCoverState(appInfo.appId, false);
                        return;
					}  
                }
                globalErrorTip(appInfo.appName, desc + "(" + msg.resultCode + ")");
                changeCoverState(appInfo.appId, false);
            }
            else
            {
                appInfo.name = msg.vmName;
                appInfo.vmDomain = $.cookie("selectedDomain");
                
                //调起客户端
                webui.objects.dashbord.Vm.createClientUrl(appInfo, msg);
                
                //获取登陆信息成功后，等待5秒中再关掉loading层
                showErrorTip(appInfo.appId, LA("Start Application"));
                setTimeout(function(){
                    changeCoverState(appInfo.appId, false);
                }, 5000);
            }
        };
        var error_callback=function(msg,error){
            console.log("tryConnectApp error(%d, %s).", msg.readyState, error);
            console.log("tryConnectApp msg.status = " + msg.status);
            globalErrorTip(appInfo.appName, LA("Request Error"));
            changeCoverState(appInfo.appId, false);
        };
            
        ServiceAPI.ajaxPostJSON(params, webui.objects.dashbord.actionurls.getAppLoginInfo, success_callback, error_callback);
    }
    
    function globalErrorTip(appName, msg)
    {
        $(".tipContent").text("\" " + appName +  "\" " + LA("APP operation failed") + msg);
        $("#appErrorTip").show();
    }
    
    //显示错误信息
    function showErrorTip(appId, msg)
    {
        $("#" + appId).find(".tip_box").show().find(".tip").text(msg);
        //5秒钟后置空并隐藏
        setTimeout(function(){
            $("#" + appId).find(".tip_box").hide().find(".tip").text("");
        }, 5000);
    }
    
    //刷新应用图标
    function refreshAppIcon()
    {
        var appIconReq = {
            appList : appcommon.allAppList
        };
        
        var params = JSON.stringify(appIconReq);
    
        var success_callback = function(msg){
            if (msg.resultCode != 0)
            {
                console.log("get app icon fail(" + msg.resultCode + ")");
            }
            else
            {
                refreshAppIconForHtml(msg.appIdList);
            }
        };
        var error_callback=function(msg,error){
            console.log(error);
        };
            
        ServiceAPI.ajaxPostJSON(params, webui.objects.dashbord.actionurls.getAppIcon, success_callback, error_callback);
        
    }
    
    //刷新页面应用图片
    function refreshAppIconForHtml(appIdList)
    {
        if ("undefined" == typeof(appIdList) || appIdList.length == 0) {
            console.log("appIdList is null");
            return;
        }
        for ( var i = 0; i < appIdList.length; i++) {
            var appId = appIdList[i];
            $("#" + appId).find(".bgImgItem").find("img").attr("src", appcommon.appIconSrc + appId + ".png");
        }
    }
    
    function initErrorTip()
    {
        $("#appErrorTip").find(".globalDialogOkLink").css("background-image", "url(" + LA("globalConfirmOkLink") + ".png)");
        $("#appErrorTip").find(".globalDialogTitle").text(LA("APP error tip title"));
        $("#appErrorTip").find(".globalDialogLinkWarp").bind("click", function(){
            $("#appErrorTip").hide();
        });
        $("#appErrorTip").find(".globalDialogClose").bind("click", function(){
            $("#appErrorTip").hide();
        });
    }
    
    function begin()
    {
        var tabPageTagValue = $.cookie("tabPageTag");
        switch (tabPageTagValue) {
        case "vmList":
            appendAppHtml(-1);
            break;
        case "myAppList":
            appendAppHtml(0);
            break;
        case "allAppList":
            appendAppHtml(1);
            break;
        default:
            appendAppHtml(-1);
            break;
        }
        
        initErrorTip();
    }
    
    webui.objects.dashbord.app = 
    {
        begin:begin,
        loadAppList:loadAppList,
        appendAppHtml:appendAppHtml
    };
    
})();

(function(){
    
    function init()
    {
        appcommon.initAppArea();
        
        //窗口变化大小是重新计算，并重新排版应用
        $(window).resize(function() {
            appcommon.initAppArea();
            $("#tabBtnArea").find("a").each(function(){
                if ($(this).attr("class").indexOf("tabBtnColor2") != -1 && $(this).attr("id") == "myAppTabBtn") 
                {
                    webui.objects.dashbord.app.appendAppHtml(0);
                }
                else if($(this).attr("class").indexOf("tabBtnColor2") != -1 && $(this).attr("id") == "allAppTabBtn")
                {
                    webui.objects.dashbord.app.appendAppHtml(1);
                }
            });
        }); 
        
    }
    
    //设置应用列表Li的宽度和高度
    function resetAppAreaStyle()
    {
        $("#appList").find("li").css("width", appcommon.appListWidth);
        $("#appList").find("li").css("height", appcommon.appListHeight);
        
        //定位搜索框对其应用区域的右边
        var searchDivObj = $($("#appArea").find(".searchArea")[0]);
        var searchDivWidth = searchDivObj.width() + 20;
        searchDivObj.css("margin-left", appcommon.appListWidth/2 - appcommon.itemMarginRight - searchDivWidth);
        searchDivObj.show();
    }
    
    //初始化查询控件，1、在搜索区域按enter键时执行查询，2、点击搜索框左边查询图标是执行查询，3、绑定文本框键盘按键keyup事件
    function initSearch()
    {
        document.onkeydown=function(event) {
            var e = event ? event :(window.event ? window.event : null); 
            if(e.keyCode==13){ 
                reloadAppListHtml($.trim($("#searchAppName").val()));
            } 
        }
        
        $(".searchArea").find("img").click(function(){
            var appName = $.trim($("#searchAppName").val());
            
            if (appName == LA("default search input value")) {
                appName = "";
            }
            reloadAppListHtml(appName);
        });
        
        searchInputEvent();
    }
    
    //搜索框默认值
    function searchInputEvent()
    {
        var defalutVal = LA("default search input value");
        var searchInputObj = $("#searchAppName");
        searchInputObj.val(defalutVal);
        searchInputObj.bind("focus", function(){
            if ($.trim($(this).val()) == defalutVal) {
                $(this).val("");
                $(this).css("color", "white");
            }
            searchApp();
        }).bind("blur", function(){
            if ($.trim($(this).val()) == "") {
                $(this).val(defalutVal);
                $(this).css("color", "#EEEEEE");
            }
        });
        
        searchInputObj.bind("keyup", function(){
            searchApp();
        });
    }
    
    //本次搜索没有访问后台，仅前台缓存数据筛选
    function searchApp()
    {
        var searchInputObj = $("#searchAppName");
        var ulObj = $(".selectAppName");
        ulObj.empty();
        var result = filterApp($.trim(searchInputObj.val()));
        var searchResultList = result.searchResultList;
        if (searchResultList == null || searchResultList.length == 0) {
            ulObj.hide();
            return;
        }
        
        //加载下拉选项
        for ( var i in searchResultList) {
                ulObj.append("<li>"+searchResultList[i].appName+"</li>");
        }
        
        //显示下拉菜单
        ulObj.show();
        
        bindBodyClick(ulObj, searchResultList, result.type);
    }
    
    
    
    /**
     * 显示下拉选项后，绑定一个页面点击事件，
     * 当点击在选项LI上时， 给文本框赋值并关闭下拉菜单；
     * 当点击在UL区域外或者不是点击搜索文本框时关闭下拉
     * 关闭菜单时注销页面点击事件
     */
    function bindBodyClick(obj, searchResultList, type)
    {
        $("body").unbind("click").bind("click", function(e){
            var target = $(e.target);
            if (target.parent().attr("class") == "selectAppName") {
                $("#searchAppName").val($.trim(target.text()));
                
                reloadAppListHtml($.trim(target.text()));
                
                obj.hide();
                $("body").unbind("click");
                return;
            }
            if (target.attr("class") != "selectAppName" && target.attr("id") != "searchAppName") {
                obj.hide();
                $("body").unbind("click");
                return;
            }
        });
    }
    
    function reloadAppListHtml(appName)
    {
        //重新生成应用列表
        var result = filterApp(appName);
        appcommon.initPageParam(result.searchResultList, result.type);
        webui.objects.dashbord.app.loadAppList(result.searchResultList, result.type);
    }
    
    function filterApp(appName)
    {
        //根据应用名称查询应用（从缓存数据中过滤）并刷新页面
        var tabPageValue = $.cookie("tabPageTag");
        var searchResultList = null;
        var type = -1;
        if (tabPageValue == "myAppList") 
        {
            searchResultList = appcommon.searchAppByName(appName, appcommon.myCollectionList);
            type = 0;
        }
        else if (tabPageValue == "allAppList")
        {
            searchResultList = appcommon.searchAppByName(appName, appcommon.allAppList);
            type = 1;
        }
        
        //返回过滤后的AppList以及type【0：我的收藏列表；1：所有应用列表】
        var result = {
            searchResultList: searchResultList,
            type: type
        };
        
        return result;
    }
    
    function begin()
    {
        init();
        initSearch();
    }
    
    webui.objects.dashbord.initMyAppView = 
    {
        begin: begin,
        resetAppAreaStyle: resetAppAreaStyle
    };
    
})();

