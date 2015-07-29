var WebOS ={
	language:{},
	system:{},
	logoInfo:{},
	appManager:{},
	skinAndbgImg:{},
	language_browser:{},
	filemanagerLanguage:{}
};

WebOS.Trim = function(str){
	if( undefined == str || null == str || "" == str){
		return "";
	}else{
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
};

WebOS.system.appList = [];
WebOS.system.appManagerList = [];
WebOS.system.deskTopList = [];
WebOS.system.hdpDeskTop = [];
WebOS.system.Timmer = '';
WebOS.system.shortCutFlag = 'false';
WebOS.system.recentVisitFlag = 'false';
WebOS.system.getAppsByPostfix = function(postfix){
	var apps = [];
	if(postfix){
		for(var i = 0; i <  WebOS.system.appList.length; i++){
			var appPostfix = WebOS.system.appList[i].fileextensions.split(',');
			if(appPostfix.length > 0){
				for(var j = 0; j < appPostfix.length; j++){
					if(appPostfix[j] === postfix){
						apps.push(WebOS.system.appList[i]);
						break;
					}
				}
			}
			
		}
	}
	else{	
		
	}
	return apps;
};
WebOS.appManager.searchAppFromList = function(appid) {
    for(var i = 0; i < WebOS.system.appList.length; i++){
        if(WebOS.system.appList[i].publishappid == appid)
        {
            return WebOS.system.appList[i];
        }
    }   
};
WebOS.appManager.searchAppByAppid = function(appid){
	for(var i = 0; i < WebOS.system.appManagerList.length; i++){
		if(WebOS.system.appManagerList[i].appId == appid)
		{
			return WebOS.system.appManagerList[i];
		}
	}	
};
WebOS.appManager.setAppId = function(appid){
	if(appid === "" || appid === undefined)
	{
		return;
	}
	var p = {
		appId:appid,
		num:0,
		delFlag : 'false',
		liLen : 0,
		textVal : "",
        searchType : "ALL"
            
	};
	WebOS.system.appManagerList.push(p);
};

WebOS.appManager.openInfo = {};

WebOS.appManager.openApp = function(appId){
	jLoadPage("loading");
	var result = WuiBPlugin.detect();
	if(result == -1){
		return;
	}
	if(appId && appId !== "" && appId !== undefined){
        var openInfo = WebOS.appManager.openInfo;
        var urlstr = "";
        urlstr = urlstr + "--runmode webplugin --app ";
        urlstr = urlstr + "--authtoken " + openInfo.ticket + " ";
        urlstr = urlstr + "--apptoken " + createUuid() + " ";
        urlstr = urlstr + "--appid " + $.trim(appId) + " ";
        urlstr = urlstr + openInfo.host;
        urlstr = "AppCloud://" + base64encode(urlstr);
        $("#redirect-app-iframe").attr({
        	"src":urlstr
        });
    }
	jHide('loadPage');
};

WebOS.appManager.openFileByApp = function(appId, filePath){
	var result = WuiBPlugin.detect();
	jLoadPage("loading");
	if(result == -1){
		return;
	}
	if(appId && appId !== "" && appId !== undefined){
        var openInfo = WebOS.appManager.openInfo;
        var urlstr = "";
        urlstr = urlstr + "--runmode webplugin --app ";
        urlstr = urlstr + "--authtoken " + openInfo.ticket + " ";
        urlstr = urlstr + "--apptoken " + createUuid() + " ";
        urlstr = urlstr + "--appid " + $.trim(appId) + " ";
        urlstr = urlstr + "--sharetype profile ";
        urlstr = urlstr + "--appparams \"" + utf16to8($.trim(filePath)) + "\" ";
        urlstr = urlstr + openInfo.host;
        urlstr = "AppCloud://" + base64encode(urlstr);
        $("#redirect-app-iframe").attr({
        	"src":urlstr
        });
    }
	jHide('loadPage');
};

WebOS.appManager.openDesktop = function(desktopId){
	var result = WuiBPlugin.detect();
	jHide('loadPage');
	if(result == -1){
		return;
	}
	if(desktopId && desktopId !== undefined && desktopId !== "" ){
        var openInfo = WebOS.appManager.openInfo;
        var urlstr = "";
        urlstr = urlstr + "--runmode webplugin ";
        urlstr = urlstr + "--authtoken " + openInfo.ticket + " ";
        urlstr = urlstr + "--apptoken " + createUuid() + " ";
        urlstr = urlstr + "--deskid " + $.trim(desktopId) + " ";
        urlstr = urlstr + openInfo.host;
        urlstr = "AppCloud://" + base64encode(urlstr);
        $("#redirect-app-iframe").attr({
        	"src":urlstr
        }); 
        
    }
    
};

WebOS.appManager.plulogin = function() {
    var openInfo = WebOS.appManager.openInfo;
    var urlstr = "";
    urlstr = urlstr + "--runmode webplugin --login ";
    urlstr = urlstr + "--authtoken " + openInfo.ticket + " ";
    urlstr = urlstr + openInfo.host;
    console.log("AppCloud://" + urlstr);
    urlstr = "AppCloud://" + base64encode(urlstr);
    console.log(urlstr);
    $("#redirect-app-iframe").attr({
        "src":urlstr
    }); 
};

WebOS.appManager.plulogout = function() {
    if (WebOS.appManager.openInfo.ticket == undefined) {
        return;
    }
    var urlstr = "";
    urlstr = urlstr + "--runmode webplugin --logout";
    console.log("AppCloud://" + urlstr);
    urlstr = "AppCloud://" + base64encode(urlstr);
    console.log(urlstr);
    $("#redirect-app-iframe").attr({
        "src":urlstr
    }); 
};

WebOS.appManager.mouseSlideUpDown=function(divid,ulid){
	var start,stop;
	var i=0;
	var ulHeight=$("#"+ulid).height();
	$("#"+divid).bind('vmousedown',function(event){
		 start = {
				time: ( new Date() ).getTime(),
				coords: [ event.pageX, event.pageY ]
			};
	});
	$("#"+divid).bind('vmouseup',function(event){
		 stop = {
				time: ( new Date() ).getTime(),
				coords: [ event.pageX, event.pageY ]
			};
		if ( start && stop ) {
			var pageY = stop.coords[1] - start.coords[1];
			var pageX = stop.coords[0] - start.coords[0];
			if ( pageY > 0 && pageX < 50){
				i += pageY;
				if( i <= 0 ){
					i=0;
				}
				$("#"+divid).scrollTop(i);
			}else{
				i += pageY;
				if( i >= ulHeight ){
					i = ulHeight;
				}
				$("#"+divid).scrollTop(i);
			}
		}
		start = stop = undefined;
	});
};

