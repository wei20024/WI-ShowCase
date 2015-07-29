(function(){
	var curLang = "en";
	var instance = {};
	instance.texts = {};
	
	curLang = commonvar.getLangType();
	
	// texts格式为{zh:{'xxxx'(文本代号):'xxxx'文本内容, ...}, en:{'xxx':'xxx',...}, ...}
	function loadText(texts)
	{
		for (var langType in texts)
		{
			if (typeof(instance.texts[langType]) == "undefined" || instance.texts[langType] == null) instance.texts[langType] = {};
			var inslangTexts = instance.texts[langType];
			var langTexts = texts[langType];
			for (var textId in langTexts)
			{
				inslangTexts[textId] = langTexts[textId];
			}
		}
	}
	
	function translate(textId)
	{
		var outText = null;
		var inslangTexts = instance.texts[curLang];
		if (typeof(inslangTexts) != "undefined" && inslangTexts != null) outText = inslangTexts[textId];
		if (typeof(outText) == "undefined" || outText == null) outText = textId;
		return outText;
	}
		
	webui.service.languageService = 
	{
		loadText : loadText,
		translate: translate,
		getLang: function(){return curLang;}
	};
	
})();

// 提供翻译的简便写法
var LA = function(textId){return webui.service.languageService.translate(textId);};

