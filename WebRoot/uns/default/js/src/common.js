
var commonMethods = {};

//通用方法
$(document).ready(function(){
	
	// 设置语言功能
	commonMethods.changeLanguage.begin();
	
});

// 修改语言
(function(){
	
	function internationalization()
	{
		// 翻译提示语言
		$("#choiceLang").find(".langDialogTitle").text(CommonLang.getString("Choice Language"));
		$("#choiceLang").find(".langZh").text(CommonLang.getString("Simplified Chinese"));
		$("#choiceLang").find(".langEn").text(CommonLang.getString("English"));

		// 翻译按钮语言
		$("#choiceLang").find(".langDialogOkLink").css("background-image", "url(" + CommonLang.getString("globalConfirmOkLink") + ".png)");
		$("#choiceLang").find(".langDialogCanncelLink").css("background-image", "url(" + CommonLang.getString("globalConfirmCanncelLink") + ".png)");
	}
	
	function begin()
	{
		$("#lang").click(function(){
			commonvar.LangChoice.show();
			commonvar.LangChoice.begin();
			internationalization();
		});
	}
	
	commonMethods.changeLanguage = 
	{
		begin: begin
	};
	
})();