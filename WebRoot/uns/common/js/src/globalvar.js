/**
 * author：
 */
var webui={
		language:{},
		system:{}	
};
webui.system.bgImg="/uns/default/img/null.jpg";
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
	//应急模式提示框停留时间
	webui.system.maintenanceTipFadeoutTime = 90000;
	
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
	webui.system.clientVersion = '1.5.20.100';
	
	//mac客户端最低版本
	webui.system.macClientVersion = '1.5.20.100';
	
	//android应用下载链接
	webui.system.androidTcDownloadUrl = 'http://'+window.location.hostname + '/plugin/aHDPtc.apk';
	webui.system.androidDownloadUrl = 'http://'+window.location.hostname + '/plugin/aHDP.apk';
	webui.system.iosDownloadUrl = 'http://itunes.apple.com/app/id852085857';
	webui.system.windowsClientDownloadUrl = '/plugin/WindowsClientSetup.msi';
	webui.system.macClientDownloadUrl = '/plugin/FusionAccessMac.zip';
	webui.system.unknowAccessDownloadUrl = '/webui/common/pages/download.html';
	webui.system.linuxClientDownloadUrl = '/plugin/LinuxClientSetupX86.bin';

	webui.system.systemCode = "string1234567";	
	

webui.system.config={
		retryConnectVNCCount:0, 		//WI尝试连接VNC次数
		windowSmartCardDevicePath:"C:\\Windows\\System32\\HWDESKTOPP11V211.dll;c:\\WINDOWS\\system32\\eTPKCS11.dll",   //windows智能卡驱动路径
		linuxSmartCardDevicePath:"/usr/lib/libeTPkcs11.so;", //linux智能卡驱动路径
		'dynamicPassword.SMSOTPAuth':0,
		'dynamicPassword.2FactorAuth':0,
		runningMode:"ad",
		autoConnectVm:"on",
		desktopLock:0,
		isEmergencyLogon:0,
		multidomainconfig:"",
		explicitcercrl:"false",   //双向认证
		androidClientVersion:'1.5.10005', //android移动客户端最低版本
		forceAndroidVersion:'0.0.0',
		iosClientVersion:'1.5.10006', //ios移动客户端最低版本
		forceIosVersion:'0.0.0',
		androidTcClientVersion:'1.0.0', //androidTc移动客户端最低版本
		forceAndroidTcVersion:'0.0.0',	
		setBgImgFull:0,
		clientAuth:0,
		configFlag:0
};

/**
* 后台服务API
*/
webui.service = {};
webui.classspace = {}; // use for store class (which function can be new)
webui.objects = {}; // use for store page's global object, like some components (login pannel/vm list etc)
webui.classspace.base = {}; // use for store base class, like subscriber/logger etc

