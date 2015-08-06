/**
 * author：
 */
var Login = {
		loginLanguage:{}
		
};
Login.loginLanguage = { // 登录界面字符串
		zh:{
			'noFgPlugin':"请安装指纹插件",
			'rgFinger':"注册指纹",
			'changeFinger':"更改指纹",
			'changeFgPass':"更改密码",
			'openFg':"点击指纹登陆",
<<<<<<< HEAD
			'confirmbtn':"url(/uns/default/img/btnyes.png)",
			'cancelbtn':"url(/uns/default/img/btnno.png)",
			'loginbtn':"url(/uns/default/img/loginzh.png)",
			'adimg':"/uns/default/img/adch.png",
=======
			'confirmbtn':"url(/webui/default/img/btnyes.png)",
			'cancelbtn':"url(/webui/default/img/btnno.png)",
			'loginbtn':"url(/webui/default/img/loginzh.png)",
			'adimg':"/webui/default/img/adch.png",
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'congratulation':"新密码设置成功！",
			'usenewpassword':"请使用新密码登录系统！",
			'jumptohomepage':"点击跳转到主页面",
			'modPassTitle':"修改密码",
			'getAutherror':"系统未就绪,请稍后重试或联系管理员！",
			'closeBrowser':"为了保证用户浏览器安全，必须关闭浏览器后重新登录！",
			'nocertificate':"没有收到用户证书，请关闭浏览器重试，或联系管理员",
			'notice':"温馨提示",
			'confirm':"确定",
			'cancel':"取消",
			'userName':"用户名：",
			'oldPassword':"旧密码：",
			'newPassword':"新密码：",
			'renewPassword':"确认密码：",			
			'password':"密&nbsp;&nbsp;&nbsp;码：",
			'Domain':'域&nbsp;&nbsp;&nbsp;名:',
			'Verification':'验证码：',
			'refresh':'刷新',
			'userNameNotNull':'用户名不能为空',
			'pwdNotNull':'密码不能为空',
			'domainNotNull':'域名不能为空',
			'verificationNotNull':'验证码不能为空',
			'oldpwdNotNull':'旧密码不能为空',
			'newpwdNotNull':'新密码不能为空',
			'renewpwdNotNull':'请再次输入新密码',
			'renewpwdNotEqual':'与新密码不一致',
			'revoked':'您的登录凭证已失效,请联系管理员',
			'crlformaterror':'您的登录凭证无法通过认证,请联系管理员',
			'getcrlinfofailed':'获取证书吊销状态失败，请关闭浏览器重试，或联系管理员',
			'crlerror':'证书格式不是智能卡登录类型的证书，请检查证书正确性，或联系管理员',
			'userNameTip':'请输入用户名',
			'dynamicTip':'请输入动态密码',
			'messageTip':'点击此处获取动态密码',
			'userPassTipuns':'请输入用户密码',
<<<<<<< HEAD
			'userPassTip':'******',
=======
			'userPassTip':'请输入用户密码',
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'checkboxText':'保持登录状态',
			'loading':'加载中...',
			'rememberpwd':'记住密码',
			'loginBtn':'登录',
			'10002':'用户名或密码错误',
			'ResultCode.code.PARAMETER_INVALID':'参数错误',
			'10004':'验证码不能为空',
			'10005':'验证码输入错误',
			'10006':'验证码已失效',
			'ResultCode.code.LOGIN_INVALID':'登录失败',
			'10010':'登录太频繁',
			'10011':'网络异常',
			'ResultCode.code.USER_NO_EXIST':'用户名或密码错误',
			'10013':'域名不能为空',
<<<<<<< HEAD
			'10025':'用户名或密码错误',
=======
			'10025':'旧密码错误',
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'10026':'新密码不符合字符域的长度、复杂性或历史要求',
			'10027':'帐户被锁定',
			'10028':'修改密码失败，请联系系统管理员',
			'10030':'参数为空',
			'10031':'修改密码超时',
			'otherError':'系统无法认证您的登录凭证，请稍后重试或联系管理员',
			'0':'请求超时，请重试',
			'20001':'用户无权使用该TC，请联系管理员',
			'20002':'TC验证失败，请联系管理员',
			'ResultCode.code.USER_PASSWORD_INVALID':'用户名或密码错误',
			'ResultCode.code.USER_LOCK':'您的账号已被锁定,请联系管理员',
			'ResultCode.code.UNKNOW_REASON':'系统无法认证您的登录凭证，请联系管理员',
			'ResultCode.code.AD_UNREADY':'系统未就绪,请稍后重试或联系管理员',
			'ResultCode.code.DOMAIN_UNEXIST':'域名错误',
			'20009':'内部服务异常',
			'20010':'HDC后台服务异常',
			'20011':'HDC数据库异常',
			'ResultCode.code.PASSWORD_WILL_INVALIDATION':'用户密码即将过期',
			'ResultCode.code.PASSWORD_INVALIDATIONED':'用户密码已过期',
			'20014':'用户信息有误，请重试或联系管理员',
			'ResultCode.code.OTHER_USER_LOGINED':'请登出当前用户后重试',
			'20016':'获取Key信息失败',
			'ResultCode.code.ACCOUNT_INVALIDATIONED':'您的账号已过期,请联系管理员',
			'20018':'虚拟机认证用户失败',
			'passwordExpire':'您的密码已过期，请修改！',
			'modifypass':'修改密码',
			'timeout':'请求超时，请重试',
			"dymanicCodeNotNull":'动态密码不可为空',
			"macNotNull":'mac地址不可为空',
			"switchUser":'切换用户',
		"10": "客户端请求失败, 请检查服务是否正常",
		
		// 1xx Informational
		"100": "已收到请求的一部分，请继续发送余下部分",
		"101": "切换协议" ,
		"102": "处理中",
		// 2xx Success
		"ResultCode.code.OPERATE_SUCCESS": "系统异常，请稍后重试",
		"ResultCode.code.USERNAME_UNNORMAL": "已创建",
		"ResultCode.code.WRITEFILECODE_INVALID": "已接受",
		"203": "非权威性信息",
		"204": "无内容",
		"205": "重置内容",
		"206": "部分内容",
		"207": "多个独立的响应代码",
		// 3xx Redirection
		"300": "服务器可执行多种操作",
		"301": "永久移动转移",
		"302": "临时移动转移",
		"303": "查看重定向到的新资源",
		"304": "未修改",
		"305": "请使用代理",
		"307": "临时重定向",
		// 4xx Client Error
		"400": "错误的请求",
		"401": "访问被拒绝，需要用户验证",
		"402": "未知",
		"403": "禁止访问",
		"404": "未找到请求的内容",
		"405": "方法不被允许",
		"406": "请求的资源的内容特性无法满足请求头中的条件",
		"407": "要求进行代理身份验证",
		"408": "请求超时",
		"409": "冲突",
		"410": "被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址",
		"411": "需要设置请求头域的长度",
		"412": "前提条件失败",
		"413": "请求实体太大",
		"414": "请求 URI 太长",
		"415": "不支持的媒体类型",
		"416": "所请求的范围无法满足",
		"417": "执行失败",
		"419": "资源空间不足",
		"420": "方法错误",
		"422": "无法处理实体",
		"423": "锁定的错误",
		"424": "依赖错误",
		// 5xx Server Error
		"500": "服务器内部错误",
		"501": "服务器无法完成请求的功能",
		"502": "网关错误",
		"503": "服务不可用",
		"504": "网络超时",
		"505": "HTTP 版本不受支持",
		"507": "存储空间不足",
		/* 6XX Custom Error */
		"600": "部分文件没有操作权限",
		"601": "操作失败"  ,
		"602": "数据库服务器错误" ,
		"603": "DMS服务器错误",
		"604": "IO异常" ,           
		"605": "未知错误，可能有无法处理的数据" , 
		"606": "邮件服务错误"  ,    
		"608": "DMS获取用户信息不对"  ,
		"609": "没有权限操作系统资源"  ,
		"610": "逻辑错误"  ,
		"611": "用户权限不足，只有管理员可以广播消息"    , 
		"ResultCode.code.REQUEST_INVALID": "内部错误，参数为空"    ,          
		"613": "内部错误，DMS数据格式异常"  ,
		"614": "网络异常，请检查网络连接是否正常"  ,
		/* 7XX USER ERROR CODE*/
		"700": "验证码不对或者失效",
		"701": "用户名错误，可能包含特殊字符或者长度小于5",
		"702": "密码错误, 可能长度小于5或者和用户名相同",
		"703": "邮件格式错误"  ,
		"704": "生日格式错误",
		"705": "尝试登录次数达到最大次数"      ,
		"706": "DMS鉴权失败"  ,
		"707": "用户不存在"  ,
		"708": "用户已经存在"  ,
		"709": "用户被锁定"  ,
		"710": "从AD域查询用户错误"  ,
		"711": "初始化用户配置错误"  ,
		"712": "不能修改用户域信息"  ,
        "713" : "您的账号已在别处登录!",
		/* 8XX FILE SYSTEM ERROR CODE*/
		"800": "指定的文件(夹)不存在",
		"801": "文件(夹)名称已经存在",
		"802": "文件(夹)名不合法, 不能以.开头, 且不能包含  \\/:?<>&|\\\" ",
		"803": "初始化文件系统错误",
		"804": "用户没有去DMS鉴权，或者鉴权失效",
		"805": "目标文件(夹)不存在",
		"806": "指定的多个文件(夹)没在相同目录下",
		"807": "系统数据不一致, 共享的文件不存在或者共享的文件产生的链接不存在",
		"808": "当前系统只支持共享文件，不支持共享文件夹",
		"809": "共享文件产生的链接名称已经存在",
		/* 9XX APP ERROR CODE*/
		"900": "搜索应用失败",
		/* 1XXXX SHORTCUT ERROR CODE*/
		"1000": "新增快捷方式名称重复",
		"1001": "创建快捷方式 数据库异常",
		"1002": "查询快捷方式数据库异常",
		"1003": "快捷方式对应的文件已不存在，无法打开文件",
		/* 11XX DATABASE ERROR CODE*/
		"1100": "设置默认打开方式数据库异常",
		/* 12xx desktop error code */
		"ResultCode.code.HDC_INVALID": "管理系统异常",
		"ResultCode.code.SESSION_INVALID": "会话无效",
		"ResultCode.code.RESOURCE_INVALID": "虚拟机资源不可用",
		"60022": "用户已和其它TC绑定",
		"60021": "用户未和该TC绑定",
		"ResultCode.code.CHECK_DYNAMIC_CODE_FAIL": "您输入的动态密码错误,请确认无误后重试",
		"ResultCode.code.GET_DYNAMIC_CODE_FAIL": '获取动态密码失败,请点击"点击获取"按钮重新获取。',
		"ResultCode.code.GET_DYNAMIC_CODE_SUCCESS": '动态密码已通过短信发送。如长时间未获取，请重新点击此处获取！',
		"ResultCode.code.RADIUS_SERVICE_EXCEPTION": "动态密码服务器异常，请联系系统管理员。",
		"60029": "MAC地址无效。",
		"60030": "用户未和该TC绑定，无权使用该TC。",
		"70019": "用户名不存在。",
		 /*'R2C01账号登陆返回错误码',*/
		"10000102": "请验证您的用户名和密码，然后尝试重新登录。如果无法登录，请联系技术支持人员",
		"10000103": "请登录到Windows 更改过期的密码",
		"10000104": "没有与您的帐户关联的许可证",
		"10000105": "您的帐户已暂时锁定。",
		"10000106": "您的帐户已禁用。",
		"10000107": "您的凭据已过期。",
		"10000108": "您的凭据无效。请重试，或者与系统管理员联系。",
		"10000109": "登录检测失败，请确认当前用户和TC相匹配",
		"10000701":"修改密码失败，资源不可用",
		"10000702":"输入的旧密码不正确。",
		"10000703":"请输入满足贵公司密码策略的密码。如需帮助，请联系技术支持人员。",
		'Download Client': '请安装客户端插件后重新打开浏览器',
		'Download': '1. 点击这里',
		'Nosupport': '不支持本机操作系统，可能无法登录虚拟机',
		'NoSetupClient': '未安装客户端插件,请选择以下其中一种方式处理:',
		'contactAdministrator':'1. 请联系管理员升级客户端插件',
		'goonlogin':'2. 暂不处理, 继续登录, 可能会有系统异常',
		'clientVersionLow':'客户端版本较低,请选择以下其中一种方式处理:',
		'androidVersionTip':'新版本Android',
		'iosVersionTip':'新版本IOS', 
		'windowsVersionTip':'新版本Windows',
		'applicationClientDown':'FusionAccess客户端下载：',
		'downloadNow':'立即下载',
		'getCode':'获取验证码',
		'wrongloginType':'登录模式已经更改，请刷新当前页面',
		'SystemNoConfig':'系统未配置，请联系管理员配置后再使用',
		"ResultCode.code.API_LOGIN_TYPE_ERROR": "请配置UNS所使用的WI的认证方式是账号和密码方式"
		},
		en:{
			'noFgPlugin':"Please install the fingerprint plug-in.",
			'rgFinger':"Register Fingerprint",
			'changeFinger':"Change Fingerprint",
			'changeFgPass':"Change Password",
			'openFg':"Login by Fingerprint",
<<<<<<< HEAD
			'confirmbtn':"url(/uns/default/img/btnok.png)",
			'cancelbtn':"url(/uns/default/img/btncancel.png)",
			'loginbtn':"url(/uns/default/img/loginen.png)",
			'adimg':"/uns/default/img/aden.png",
=======
			'confirmbtn':"url(/webui/default/img/btnok.png)",
			'cancelbtn':"url(/webui/default/img/btncancel.png)",
			'loginbtn':"url(/webui/default/img/loginen.png)",
			'adimg':"/webui/default/img/aden.png",
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'congratulation':"The password is changed successefully!",
			'usenewpassword':"Please use the new password to log in to the system.",
			'jumptohomepage':"Home",
			'modPassTitle':"Change Password",
			'getAutherror':"The system is not ready. Please try again later or contact the administrator.",
			'closeBrowser':"To ensure security, close the browser and log in again.",
			'nocertificate':"No user certificate is found. Please close the browser and try again, or contact the administrator.",
			'notice':"Notice",
			'confirm':"OK",
			'cancel':"Cancel",
			'userName':"Username：",
			'oldPassword':"Old Password：",
			'newPassword':"New Password：",
			'renewPassword':"Confirm Password：",
			'password':"Password：",
			'Domain':'Domain name:',
			'Verification':'Verification code：',
			'refresh':'Refresh',
			'userNameNotNull':'The username cannot be empty.',
			'pwdNotNull':'The password cannot be empty.',
			'domainNotNull':'The domain name cannot be empty.',
			'verificationNotNull':'The verification code cannot be empty.',
			'oldpwdNotNull':'The old password cannot be empty.',
			'newpwdNotNull':'The new password cannot be empty.',
			'renewpwdNotNull':'Please input the new password again.',
			'renewpwdNotEqual':'The password is inconsistent with the new password.',
			'revoked':'Your login credentials have expired. Please contact the administrator.',
			'crlformaterror':'Your login credentials cannot pass the authentication. Please contact the administrator.',
			'getcrlinfofailed':'Obtain certificate revocation status failed. Please close the browser and try again, or contact the administrator.',
			'crlerror':'The certificate is not the type of SmartCard certificate. Check the correctness of the certificate, or contact the administrator.',
			'userNameTip':'Please input your username',
			'dynamicTip':'Please enter the One-Time password',
			'messageTip':'Click here for One-Time Password',
			'userPassTipuns':'password',
<<<<<<< HEAD
			'userPassTip':'******',
=======
			'userPassTip':'Please enter the user password',
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'rememberpwd':'Remember me',
			'10002':'The username or password is incorrect.',
			'loading':'loading...',
			'ResultCode.code.PARAMETER_INVALID':'Parameters error.',
			'10004':'The verification code cannot be empty.',
			'10005':'The verification code is incorrect. ',
			'10006':'The verification code is invalid.',
			'ResultCode.code.LOGIN_INVALID':'Login failed.',
			'10010':'Frequent login.',
			'10011':'The network is abnormal.',
			'ResultCode.code.USER_NO_EXIST':'The username or password is incorrect.',
			'10013':'The domain name cannot be empty.',
<<<<<<< HEAD
			'10025':'The username or password is incorrect.',
=======
			'10025':'The old password is incorrect.',
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'10026':'The new password does not meet the length, complexity, or history requirements of the domain.',
			'10027':'The account is locked. ',
			'10028':'Failed to change the password. Please contact the administrator. ',
			'10030':'The parameter is empty.',
			'10031':'Change password timeout',
			'otherError':'The system cannot authenticate your login credentials. Please try again later or contact the administrator.',
			'0':'Request timeout. Please try again.',
			'20001':'You are not authorized to use the TC. Please contact the administrator.',
			'20002':'TC authentication failed. Please contact the administrator.',
			'ResultCode.code.USER_PASSWORD_INVALID':'The username or password is incorrect.',
			'ResultCode.code.USER_LOCK':'Your account is locked. Please contact the administrator.',
			'ResultCode.code.UNKNOW_REASON':'The system cannot authenticate your login credentials. Please contact the administrator.',
			'ResultCode.code.AD_UNREADY':'The system is not ready. Please try again later or contact the administrator.',
			'ResultCode.code.DOMAIN_UNEXIST':'The domain name is incorrect.',
			'20009':'The internal service is abnormal.',
			'20010':'The HDC service is abnormal.',
			'20011':'The HDC database is abnormal.',
			'ResultCode.code.PASSWORD_WILL_INVALIDATION':'The user password is about to expire.',
			'ResultCode.code.PASSWORD_INVALIDATIONED':'The user password has expired.',
			'20014':'The user information is incorrect. Please try again or contact the administrator.',
			'ResultCode.code.OTHER_USER_LOGINED':'Please log out and try again.',
			'20016':'Failed to obtain the key information.',
			'ResultCode.code.ACCOUNT_INVALIDATIONED':'Your account has expired. Please contact the administrator.',
			'20018':'You cannot log in to the VM because the authentication fails',
			'passwordExpire':'The password has expired. Please change it.',
			'modifypass':'Change Password',
			'timeout':'Request timeout. Please try again.',
			"dymanicCodeNotNull":'The One-Time password cannot be blank. ',
			"macNotNull":'The MAC address cannot be blank. ',
			"switchUser":'Switch user',
			"10": "The client requests fail to be processed. Please check whether the service is normal.",
		// 1xx Informational
			"100": "Continue",
			"101": "Switching Protocols" ,
			"102": "Processing",
		// 2xx Success                             	
		"ResultCode.code.OPERATE_SUCCESS": "System exception, please try again",
			"ResultCode.code.USERNAME_UNNORMAL": "Created",
			"ResultCode.code.WRITEFILECODE_INVALID": "Accepted",
			"203": "Non Authoritative Information",
			"204": "No Content",
			"205": "Reset Content",
			"206": "Partial Content",
			"207": "Multi-Status",
		// 3xx Redirection
			"300": "Multiple Choices",
			"301": "Moved Permanently",
			"302": "Moved Temporarily",
			"303": "See Other",
			"304": "Not Modified",
			"305": "Use Proxy",
			"307": "Temporary Redirect",
		// 4xx Client Error
			"400": "Bad Request",
			"401": "Unauthorized",
			"402": "Unknown",
			"403": "Forbidden",
			"404": "Not Found",
			"405": "Method Not Allowed",
			"406": "Not Acceptable",
			"407": "Proxy Authentication Required",
			"408": "Request Timeout",
			"409": "Conflict",
			"410": "Gone",
			"411": "Length Required",
			"412": "Precondition Failed",
			"413": "Request Entity Too Large",
			"414": "Request-URI Too Long",
			"415": "Unsupported Media Type",
			"416": "Requested Range Not Satisfiable",
			"417": "Expectation Failed",
			"419": "Insufficient Resource Space",
			"420": "Incorrect Method",
			"422": "Unprocessable Entity",
			"423": "Locked",
			"424": "Failed Dependency",
		// 5xx Server Error                        	
			"500": "Internal Server Error",
			"501": "Not Implemented",
			"502": "Bad Gateway",
			"503": "Service Unavailable",
			"504": "Gateway Timeout",
			"505": "HTTP Version Not Supported",
			"507": "Insufficient Storage",
		/* 6XX Custom Error */
			"600": "Some of the files do not have operation permission.",
			"600": "Partial Success",
			"601": "Operate Error"  ,
			"602": "Database Service ERROR" ,
			"603": "DMS Service Error",
			"604": "IO Error" ,           
			"605": "Unknown Error. Not Expected Output Data" , 
			"606": "Email Service Error"  ,    
			"608": "The user information obtained by the DMS is incorrect."  ,
			"609": "No permission to operate system resources."  ,
			"610": "Logic error."  ,
			"611": "Insufficient user permission. Only administrators have the permission to broadcast messages."    , 
			"ResultCode.code.REQUEST_INVALID": "Internal error. The parameter is empty. "    ,          
			"613": "Internal error. The DMS data format is incorrect."  ,
			"614": "A network exception occurred. Please check the network connection."  ,
		/* 7XX USER ERROR CODE*/
			"700": "The verification code is incorrect or invalid.",
			"701": "The username is incorrect. It may contain special characters or the length is less than 5 characters.",
			"702": "The password is incorrect. It is the same as the username or the length is less than 5 characters.",
			"703": "Incorrect email format."  ,
			"704": "Incorrect birthday format.",
			"705": "The number of login attempts reaches the maximum."      ,
			"706": "DMS authentication failed."  ,
			"707": "The username does not exist."  ,
			"708": "The user already exists."  ,
			"709": "The user is locked out."  ,
			"710": "An error occurred when querying users in the AD domain."  ,
			"711": "An error occurred when initializing user configuration."  ,
			"712": "The user domain information cannot be modified."  ,
	        "713" : "Your account has been logged in elsewhere.",
		/* 8XX FILE SYSTEM ERROR CODE*/
	        "800": "The specified file or folder does not exist.",
			"801": "The file or folder name already exists.",
			"802": "The file or folder name is invalid. It cannot start with a dot (.) or contain special characters, such as \\/:?<>&|\\\" ",
			"803": "An error occurred when initializing the file system.",
			"804": "No DMS authentication is performed for the user or the DMS authentication failed.",
			"805": "The destination file or folder does not exist.",
			"806": "The specified files or folders are not in the same directory.",
			"807": "Inconsistent system data. The shared file or shared file link does not exist.",
			"808": "The current system supports only shared files, but does not support shared folders.",
			"809": "The link name generated for the shared file already exists.",
		/* 9XX APP ERROR CODE*/
			"900": "Failed to search for applications.",
			/* 1XXXX SHORTCUT ERROR CODE*/
			"1000": "The name of the newly created shortcut is the same as an existing one.",
			"1001": "The database is abnormal when creating a shortcut.",
			"1002": "The database is abnormal when querying a shortcut.",
			"1003": "Failed to open the file by using the shortcut because the file that the shortcut represents does not exist.",
			/* 11XX DATABASE ERROR CODE*/
			"1100": "The database is abnormal when setting the default open mode.",
			/* 12xx desktop error code */
			"ResultCode.code.HDC_INVALID": "The management system is abnormal.",
			"ResultCode.code.SESSION_INVALID": "Invalid session.",
			"ResultCode.code.RESOURCE_INVALID": "The VM resource is unavailable.",
			"60022": "The account is binded to other TC.",
			"60021": "The account does not bind to the TC.",
			"ResultCode.code.CHECK_DYNAMIC_CODE_FAIL": "The dynamic password is incorrect. Please confirm the dynamic password and try again.",
			"ResultCode.code.GET_DYNAMIC_CODE_FAIL": "Failed to obtain the One-Time password. Please click the Obtain password button to try again. ",
			"ResultCode.code.GET_DYNAMIC_CODE_SUCCESS": 'The One-Time password has been sent to you via a message. If you have not received the message for a while, click here for One-Time Password.',
			"ResultCode.code.RADIUS_SERVICE_EXCEPTION": "The radius server is not working normally. Please contact the system administrator. ",
			"60029": "Invalid MAC address.",
			"60030": "The user cannot use the TC because the user and the TC are not bound.",
			"70019": "The username does not exist.",
			/*'R2C01账号登陆返回错误码',*/
			"10000102": "Please verify your user name and password and try logging on again. If you cannot log on, contact your help desk.",
			"10000103": "Please log on to Windows to change your expired password.",
			"10000104": "There is no license associated with your account.",
			"10000105": "Your account has been temporarily locked out.",
			"10000106": "Your account has been disabled.",
			"10000107": "Your credentials have expired.",
			"10000108": "Your credentials are invalid. Try again or contact your system administrator.",
			"10000109": "TC login checking failed, the user is not allow to login the current TC",
			"10000701":"Fail to change password, the resource is unavailable",
			"10000702":"The old password you have entered is incorrect.",
			"10000703":"Please enter a password that meets your corporate password policy. For help, contact your help desk.",
			'Download Client': 'Please install the client plug reopen the browser',
			'Download': '1. click here',
			'Nosupport': 'Failed to log in to the VM because the local OS is not supported.',
			'NoSetupClient': 'The client plug-in is not installed. Select either of the following measures:',
			'contactAdministrator':'1. Contact the administrator to upgrade the client plug-in.',
			'goonlogin':'2. Ignore the problem and log in to the system. If you select this measure, system exceptions may occur.',
			'clientVersionLow':'The client version is too early. Select either of the following measures:',
			'checkboxText':'Remember me',
			'loginBtn':'Login',
			'androidVersionTip':'New version of Android',
			'iosVersionTip':'New version of IOS', 
			'windowsVersionTip':'New version of Windows',
			'applicationClientDown':'FusionAccess client download: ',
			'downloadNow':'Download now',
			'getCode':'Get Code',
			'wrongloginType':'LoginType has been changed ,please fresh current page',
			'SystemNoConfig':'The system is not configuration, please contact the administrator to configure before use',
			"ResultCode.code.API_LOGIN_TYPE_ERROR": 'Please set  WI identity type to "Username and Password" in the UNS'
		},
		ar:{
			'noFgPlugin':"يرجى تثبيت المكون الإضافي لبصمة الإصبع.",
			'rgFinger':"تسجيل بصمة الإصبع",
			'changeFinger':"تغيير بصمة الإصبع",
			'changeFgPass':"تغيير كلمة المرور",
			'openFg':"تسجيل الدخول ببصمة الإصبع",
<<<<<<< HEAD
			'confirmbtn':"url(/uns/arabic/img/btnokar.png)",
			'cancelbtn':"url(/uns/arabic/img/btncancelar.png)",
			'loginbtn':"url(/uns/arabic/img/loginar.png)",
			'adimg':"/uns/default/img/aden.png",
=======
			'confirmbtn':"url(/webui/arabic/img/btnokar.png)",
			'cancelbtn':"url(/webui/arabic/img/btncancelar.png)",
			'loginbtn':"url(/webui/arabic/img/loginar.png)",
			'adimg':"/webui/default/img/aden.png",
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'congratulation':"تم تغيير كلمة المرور بنجاح!",
			'usenewpassword':"يرجى استخدام كلمة المرور الجديدة لتسجيل الدخول إلى النظام.",
			'jumptohomepage':"الصفحة الرئيسية",
			'modPassTitle':"تغيير كلمة المرور",
			'getAutherror':"النظام غير جاهز. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالمسؤول.",
			'closeBrowser':"لدواعي الحماية، قم بإغلاق المتصفح وإعادة تسجيل الدخول مرة أخرى.",
			'nocertificate':"لم يتم العثور على شهادة مستخدم. يرجى إغلاق المستعرض والمحاولة مرة أخرى، أو الاتصال بالمسؤول.",
			'notice':"ملاحظة",
			'confirm':"موافق",
			'cancel':"إلغاء",
			'userName':"اسم المستخدم:",
			'oldPassword':"كلمة المرور القديمة:",
			'newPassword':"كلمة المرور الجديدة:",
			'renewPassword':"تأكيد كلمة المرور:",
			'password':"كلمة المرور:",
			'Domain':'اسم المجال:',
			'Verification':'رمز التحقق:',
			'refresh':'تحديث',
			'userNameNotNull':'أدخل اسم المستخدم.',
			'pwdNotNull':'أدخل كلمة المرور.',
			'domainNotNull':'أدخل اسم المجال.',
			'verificationNotNull':'أدخل رمز التحقق.',
			'oldpwdNotNull':'أدخل كلمة المرور القديمة.',
			'newpwdNotNull':'أدخل كلمة المرور الجديدة.',
			'renewpwdNotNull':'يرجى إدخال كلمة المرور الجديدة مرة أخرى.',
			'renewpwdNotEqual':'كلمة المرور غير مطابقة لكلمة المرور الجديدة.',
			'revoked':'انتهت صلاحية بيانات اعتماد تسجيل الدخول الخاصة بك. يرجى التواصل بالمسؤول .',
			'crlformaterror':'بيانات اعتماد تسجيل الدخول الخاصة بك لم تتمكن من اجتياز المصادقة. يرجى التواصل بالمسؤول .',
			'getcrlinfofailed':'فشل الحصول على حالة إبطال الشهادة. يرجى إغلاق المستعرض والمحاولة مرة أخرى، أو الاتصال بالمسؤول.',
			'crlerror':'الشهادة ليست من نوع شهادة البطاقة الذكية. تحقق من صحة الشهادة، أو اتصل بالمسؤول.',
			'userNameTip':'يرجى إدخال اسم المستخدم',
			'dynamicTip':'أدخل كلمة المرور لمرة واحدة',
			'messageTip':'انقر هنا للحصول على كلمة مرور لمرة واحدة',
<<<<<<< HEAD
			'userPassTip':'******',
=======
			'userPassTip':'يرجى إدخال كلمة مرور المستخدمط',
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'10002':'اسم المستخدم أو كلمة المرور غير صحيحة.',
			'ResultCode.code.PARAMETER_INVALID':'خطأ في المعلمات.',
			'10004':'أدخل رمز التحقق.',
			'10005':'رمز التحقق غير صحيح. ',
			'10006':'رمز التحقق غير صالح.',
			'ResultCode.code.LOGIN_INVALID':'تعذر تسجيل الدخول.',
			'10010':'تسجيل دخول متكرر.',
			'10011':'هناك مشكلة في الشبكة.',
			'ResultCode.code.USER_NO_EXIST':'اسم المستخدم أو كلمة المرور غير صحيحة.',
			'10013':'أدخل اسم المجال.',
<<<<<<< HEAD
			'10025':'اسم المستخدم أو كلمة المرور غير صحيحة.',
=======
			'10025':'كلمة المرور القديمة غير صحيحة.',
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
			'10026':'كلمة المرور الجديدة لا تستوفي متطلبات الطول أو التعقيد أو المحفوظات الخاصة بالمجال.',
			'10027':'الحساب مقفل. ',
			'10028':'تعذر تغيير كلمة المرور. يرجى الاتصال بالمسؤول.',
			'10030':'المعلمة فارغة.',
			'10031':'انتهت مهلة تغيير كلمة المرور',
			'otherError':'يتعذر على النظام مصادقة بيانات اعتماد تسجيل الدخول الخاصة بك. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالمسؤول.',
			'0':'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
			'20001':'غير مصرح لك باستخدام TC. يرجى الاتصال بالمسؤول.',
			'20002':'فشلت مصادقة TC. يرجى الاتصال بالمسؤول.',
			'ResultCode.code.USER_PASSWORD_INVALID':'اسم المستخدم أو كلمة المرور غير صحيحة.',
			'ResultCode.code.USER_LOCK':'تم قفل حسابك. يرجى الاتصال بالمسؤول .',
			'ResultCode.code.UNKNOW_REASON':'يتعذر على النظام مصادقة بيانات اعتماد تسجيل الدخول الخاصة بك. يرجى الاتصال بالمسؤول.',
			'ResultCode.code.AD_UNREADY':'AD غير جاهز أو حدث خطأ عند الاستعلام عن المستخدمين.',
			'ResultCode.code.DOMAIN_UNEXIST':'اسم المجال غير صحيح.',
			'20009':'هناك مشكلة في الخدمة الداخلية.',
			'20010':'هناك مشكلة في خدمة HDC.',
			'20011':'هناك مشكلة في قاعدة بيانات HDC.',
			'ResultCode.code.PASSWORD_WILL_INVALIDATION':'كلمة مرور المستخدم على وشك الانتهاء.',
			'ResultCode.code.PASSWORD_INVALIDATIONED':'انتهت صلاحية كلمة مرور المستخدم.',
			'20014':'معلومات المستخدم غير صحيحة. يرجى المحاولة مرة أخرى أو الاتصال بالمسؤول.',
			'ResultCode.code.OTHER_USER_LOGINED':'يرجى تسجيل الخروج والمحاولة مرة أخرى.',
			'20016':'تعذر الحصول على المعلومات الرئيسية.',
			'ResultCode.code.ACCOUNT_INVALIDATIONED':'انتهت صلاحية الحساب الخاص بك. يرجى الاتصال بالمسؤول.',
			'20018':'لا يمكنك تسجيل الدخول إلى VM بسبب فشل المصادقة',
			'passwordExpire':'انتهت صلاحية كلمة المرور. يرجى تغييرها.',
			'modifypass':'تغيير كلمة المرور',
			'timeout':'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
			"dymanicCodeNotNull":'أدخل كلمة المرور الديناميكية.',
			"macNotNull":'أدخل عنوان MAC.',
			"10": "تعذر معالجة طلبات جهاز العميل. يرجى التحقق من سلامة الخدمة.",
		// 1xx Informational
			"100": "متابعة",
			"101": "تبديل البروتوكولات" ,
			"102": "جارِ المعالجة",
		// 2xx Success                             	
		"ResultCode.code.OPERATE_SUCCESS": "حدث خطأ في النظام. يرجى المحاولة مرة أخرى",
			"ResultCode.code.USERNAME_UNNORMAL": "تم الإنشاء",
			"ResultCode.code.WRITEFILECODE_INVALID": "تم القبول",
			"203": "لا توجد معلومات موثوقة",
			"204": "لا يوجد محتوى",
			"205": "إعادة تعيين المحتوى",
			"206": "محتوى جزئي",
			"207": "حالة متعددة",
		// 3xx Redirection
			"300": "اختيارات متعددة",
			"301": "تم النقل نهائيًا",
			"302": "تم النقل مؤقتًا",
			"303": "مشاهدة المزيد",
			"304": "لم يتم التعديل",
			"305": "استخدام الوكيل",
			"307": "إعادة توجيه مؤقت",
		// 4xx Client Error
			"400": "طلب غير صحيح",
			"401": "غير مخول",
			"402": "غير معروف",
			"403": "محظور",
			"404": "غير موجود",
			"405": "غير مسموح بهذه الطريقة",
			"406": "غير مقبول",
			"407": "مطلوب مصادقة الوكيل",
			"408": "انتهت مهلة الطلب",
			"409": "تعارض",
			"410": "انتقل",
			"411": "الطول مطلوب",
			"412": "فشل الشرط المسبق",
			"413": "كيان الطلب كبير للغاية",
			"414": "طلب URI طويل للغاية",
			"415": "نوع وسائط غير مدعوم",
			"416": "النطاق المطلوب غير مقبول",
			"417": "توقع خاطئ",
			"419": "مساحة المورد غير كافية",
			"420": "طريقة غير صحيحة",
			"422": "كيان غير قابل للمعالجة",
			"423": "مقفل",
			"424": "فشلت التبعية",
		// 5xx Server Error                        	
			"500": "خطأ داخلي في الخادم",
			"501": "غير مطبق",
			"502": "بوابة غير صحيحة",
			"503": "الخدمة غير متوفرة",
			"504": "انتهاء مهلة البوابة",
			"505": 'إصدار HTTP غير مدعوم',
			"507": "مساحة تخزين غير كافية",
		/* 6XX Custom Error */
			"600": "بعض الملفات لا تحتوي على إذن بالتشغيل.",
			"600": "نجاح جزئي",
			"601": "خطأ في التشغيل"  ,
			"602": "خطأ في خدمة قاعدة البيانات" ,
			"603": "خطأ في خدمة DMS",
			"604": "خطأ إدخال/إخراج" ,           
			"605": "خطأ غير معروف. بيانات إخراج غير متوقعة" , 
			"606": "خطأ في خدمة البريد الإلكتروني"  ,    
			"608": "معلومات المستخدم التي تم الحصول عليها بواسطة DMS غير صحيحة."  ,
			"609": "لا يوجد إذن بتشغيل موارد النظام."  ,
			"610": "خطأ منطقي."  ,
			"611": "إذن مستخدم غير كافٍ. المسؤولون فقط لديهم إذن ببث الرسائل."    , 
			"ResultCode.code.REQUEST_INVALID": "خطأ داخلي. المعلمة فارغة. "    ,          
			"613": "خطأ داخلي. تنسيق بيانات DMS غير صحيح."  ,
			"614": "حدث خطأ في الشبكة. يرجى التحقق من اتصال الشبكة."  ,
		/* 7XX USER ERROR CODE*/
			"700": "رمز التحقق غير صحيح أو غير صالح.",
			"701": "اسم المستخدم غير صحيح. ربما يحتوي على أحرف خاصة أو أن الطول أقل من 5 أحرف.",
			"702": "كلمة المرور غير صحيحة. قد تكون مطابقة لإسم المستخدم أو أن الطول أقل من 5 أحرف.",
			"703": "تنسيق البريد الإلكتروني غير صحيح."  ,
			"704": "تنسيق تاريخ الميلاد غير صحيح.",
			"705": "وصل عدد محاولات تسجيل الدخول إلى الحد الأقصى."      ,
			"706": "فشلت مصادقة DMS."  ,
			"707": "اسم المستخدم غير موجود."  ,
			"708": "المستخدم موجود بالفعل."  ,
			"709": "تم حظر المستخدم."  ,
			"710": "حدث خطأ عند الاستعلام عن مستخدمين في مجال AD."  ,
			"711": "حدث خطأ عند تهيئة إعدادات المستخدم."  ,
			"712": "يتعذر تعديل معلومات مجال المستخدم."  ,
	        "713" : "تم تسجيل دخول حسابك في مكان آخر.",
		/* 8XX FILE SYSTEM ERROR CODE*/
	        "800": "الملف أو المجلد المحدد غير موجود.",
			"801": "اسم الملف أو المجلد موجود بالفعل.",
			"802": "اسم الملف أو المجلد غير صالح. لا يمكن أن يبدأ بنقطة (.) أو يحتوي على أحرف خاصة، مثل \\/:?<>&|\\\" ",
			"803": "حدث خطأ عند تهيئة نظام الملفات.",
			"804": "لم يتم إجراء مصادقة DMS للمستخدم أو فشلت مصادقة DMS.",
			"805": "الملف أو المجلد الوجهة غير موجود.",
			"806": "الملفات أو المجلدات المحددة غير موجودة في نفس الدليل.",
			"807": "بيانات النظام غير متطابقة. الملف المشترك أو رابط الملف المشترك غير موجود.",
			"808": "يدعم النظام الحالي الملفات المشتركة فقط، ولا يدعم المجلدات المشتركة.",
			"809": "اسم الرابط الذي تم إنشاؤه للملف المشترك موجود بالفعل.",
		/* 9XX APP ERROR CODE*/
			"900": "فشل البحث عن التطبيقات.",
			/* 1XXXX SHORTCUT ERROR CODE*/
			"1000": "اسم الاختصار الذي تم إنشاؤه حديثًا مماثل لاسم موجود.",
			"1001": "تحدث مشكلة في قاعدة البيانات عند إنشاء اختصار.",
			"1002": "تحدث مشكلة في قاعدة البيانات عند الاستعلام عن اختصار.",
			"1003": "فشل فتح الملف باستخدام الاختصار لأن الملف الذي يمثله الاختصار غير موجود.",
			/* 11XX DATABASE ERROR CODE*/
			"1100": "تحدث مشكلة في قاعدة البيانات عند تعيين وضع الفتح الافتراضي.",
			/* 12xx desktop error code */
			"ResultCode.code.HDC_INVALID": "هناك مشكلة في نظام الإدارة.",
			"ResultCode.code.SESSION_INVALID": "اتصال غير صالح.",
			"ResultCode.code.RESOURCE_INVALID": "مصدر VM غير متوفر.",
			"60022": "الحساب مرتبط بـ TC آخر.",
			"60021": "الحساب لا يرتبط بـ TC.",
			"ResultCode.code.CHECK_DYNAMIC_CODE_FAIL": "كلمة المرور الديناميكية غير صحيحة. يرجى تأكيد كلمة المرور الديناميكية والمحاولة مرة أخرى.",
			"ResultCode.code.GET_DYNAMIC_CODE_FAIL": "تعذر الحصول على كلمة المرور الديناميكية. يرجى النقر فوق زر الحصول على كلمة المرور للمحاولة مرة أخرى. ",
			"ResultCode.code.GET_DYNAMIC_CODE_SUCCESS": 'تم إرسال كلمة المرور لمرة واحدة عبر رسالة نصية. إذا لم تتلقي الرسالة خلال لحظات، يرجى النقر هنا للحصول على كلمة مرور لمرة واحدة.',
			"ResultCode.code.RADIUS_SERVICE_EXCEPTION": "خادم RADIUS لا يعمل بشكل صحيح. يرجى الاتصال بمسؤول النظام. ",
			"60029": "عنوان MAC غير صالح.",
			"60030": "يتعذر على المستخدم استخدام TC نظرًا لعدم ارتباط المستخدم وTC.",
			"70019": "اسم المستخدم غير موجود.",
			'Download Client': 'الرجاء تثبيت المكونات العميل إعادة فتح المتصفح',
			'Download': '1 انقر هنا',
			'Nosupport': 'فشل تسجيل الدخول إلى VM لأن نظام التشغيل المحلي غير مدعوم.',
			'NoSetupClient': 'لم يتم تثبيت المكون الإضافي للعميل. حدد أيًا من الإجرائين التاليين:',
			'contactAdministrator':'1. الاتصال بالمسؤول لترقية المكوّن الإضافي للعميل.',
			'goonlogin':'2. تجاهل المشكلة وتسجيل الدخول إلى النظام. إذا اخترت هذا الإجراء، فقد تحدث استثناءات في النظام.',
			'clientVersionLow':'إصدار العميل قديم للغاية. حدد أيًا من الإجرائين التاليين:',
			'wrongloginType':'تم تغيير نوع تسجيل الدخول، يرجى تحديث الصفحة الحالية',
			'SystemNoConfig':'ولم يتم تكوين النظام، يرجى الاتصال بمسؤول لتكوين قبل الاستخدام'				
		}

};
	
Login.getString = function(strName){ //  根据语言获得字符串
	if(!strName){
		return Login.loginLanguage[commonvar.languageType]["ResultCode.code.UNKNOW_REASON"];
	}
	return Login.loginLanguage[commonvar.languageType][strName];
};

