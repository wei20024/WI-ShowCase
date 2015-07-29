/**
 * author：
 */
var webui={
		language:{},
		system:{}	
};
webui.system.bgImg="/uns/darkblue/img/backGroundMainE.jpg";
webui.system.langType='en'; //zh or en
webui.system.desktopList=[];
	// 登陆后超时注销时间，默认为5分钟
	webui.system.timout = 300000;
	
	//登录虚拟机尝试连接超时时间
	webui.system.retryTimeout = 180000;
	
	webui.system.rebootKeepTime = 180000;
	
	//每次VNC尝试连接间隔
	webui.system.retryConnectVNCTime = 5000;
	//每次HDP尝试连接间隔
	webui.system.retryConnectHDPTime = 5000;
	//界面每次刷新虚拟机状态间隔
	webui.system.refreshVmStateTime = 5000;
	//tip提示显示时间
	webui.system.tipFadeoutTime = 10000;
	
	//只有一台虚拟机时，是否自动登录，0：默认不登录
	webui.system.autologin = 0;
	
	//虚拟机重启后查询虚拟机状态间隔
	webui.system.rebootAfterTime = 30000;
	
	//虚拟机状态查询时间间隔
	webui.system.vmStateQueryTime = 5000;
	
	//虚拟机状态查询时间间隔
	webui.system.vmStateQueryTimeout = 180000;
	
	//虚拟机状态查询时间间隔
	webui.system.connectVmTimeout = 300000;
	
	//客户端最低版本
	webui.system.clientVersion = '1.5.10.100';
	
webui.system.systemCode = "string1234567";

webui.system.config={
		retryConnectVNCCount:0, 		//WI尝试连接VNC次数
		windowSmartCardDevicePath:"C:\\Windows\\System32\\HWDESKTOPP11V211.dll;c:\\WINDOWS\\system32\\eTPKCS11.dll",   //windows智能卡驱动路径
		linuxSmartCardDevicePath:"/usr/lib/libeTPkcs11.so;", //linux智能卡驱动路径
		'dynamicPassword.SMSOTPAuth':0,
		runningMode:"ad",
		autoConnectVm:"on",
		desktopLock:0,
		isEmergencyLogon:0,
		clientAuth:0
};

/**
* 后台服务API
*/
webui.service = {};
webui.classspace = {}; // use for store class (which function can be new)
webui.objects = {}; // use for store page's global object, like some components (login pannel/vm list etc)
webui.classspace.base = {}; // use for store base class, like subscriber/logger etc

