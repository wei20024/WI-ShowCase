
var CommonLang = {
		Language:{}
};

CommonLang.Language = { 
		zh:{
			'globalConfirmCanncelLink': '/custom/resources/tyyd/web/default/img/dashbord/globalConfirmCanncelLinkzh',
			'globalConfirmOkLink': '/custom/resources/tyyd/web/default/img/dashbord/globalConfirmOkLinkzh',
			'Arabic':'العربية',
			'English': 'English',
			'Simplified Chinese': '简体中文',
			'Choice Language': '选择语言 Select Language',
			'ResultCode.code.UNKNOW_REASON':'系统无法认证您的登录凭证，请联系管理员'
		},
		en:{
			'globalConfirmCanncelLink': '/custom/resources/tyyd/web/default/img/dashbord/globalConfirmCanncelLink',
			'globalConfirmOkLink': '/custom/resources/tyyd/web/default/img/dashbord/globalConfirmOkLink',
			'Arabic':'العربية',
			'English': 'English',
			'Simplified Chinese': '简体中文',
			'Choice Language': 'Select Language 选择语言',
			'ResultCode.code.UNKNOW_REASON':'The system cannot authenticate your login credentials. Please contact the administrator.'
		},
		ar:{
			'globalConfirmCanncelLink': '/custom/resources/tyyd/web/arabic/img/globalConfirmCanncelLinkar',
			'globalConfirmOkLink': '/custom/resources/tyyd/web/arabic/img/globalConfirmOkLinkar',
			'Arabic':'العربية',
			'English': 'English',
			'Simplified Chinese': '简体中文',
			'Choice Language': 'تحديد اللغة Select Language 选择语言',
			'ResultCode.code.UNKNOW_REASON':'يتعذر على النظام مصادقة بيانات اعتماد تسجيل الدخول الخاصة بك. يرجى الاتصال بالمسؤول.'
		}
};
	
CommonLang.getString = function(strName){ //  根据语言获得字符串
	if(!strName){
		return CommonLang.Language[commonvar.languageType]["ResultCode.code.UNKNOW_REASON"];
	}
	return CommonLang.Language[commonvar.languageType][strName];
};

