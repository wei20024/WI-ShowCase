
var commomMethod = {
		languageType:"zh",
		init:function()
		{
			this.getLangType();
			this.getCssfromRequestParam();
		},
		getLangType:function()
		{
			var lang;
			if($.cookie("langType")!=null)
			{
				lang=$.cookie("langType");
				if(lang!='zh'&&lang!='en'&&lang!='ar')
				{
					lang=this.getBrowserLanguage();
				}				
			}
			else if($.cookie("browserType")!=null)
			{
				lang=$.cookie("browserType");
				if (lang.indexOf("-")>0)
				{
					lang = lang.substring(0,lang.indexOf("-"));
				}
				else if (lang.indexOf("_")>0)
				{
					lang = lang.substring(0,lang.indexOf("_"));
				}
			}
			else
			{
				lang=this.getBrowserLanguage();
			}
			
			if(lang != 'zh' && lang != 'ar')
			{
				lang = 'en';
			}
			
			this.languageType=lang;
		},

		// 获得浏览器语言
		getBrowserLanguage:function()
		{ 
			    var _lang="";
				if(window.navigator.language)
				{
					_lang=(window.navigator.language).toLocaleLowerCase();
				}
				else if(window.navigator.browserLanguage)
				{
					_lang=(window.navigator.browserLanguage).toLocaleLowerCase();
				}
				_lang = _lang.indexOf("-")>0?_lang.substring(0,_lang.indexOf("-")):_lang;
				return _lang;
		},

		loadcss:function(file)
		{
			$("link").remove();
			$("head").append("<link>");
			css = $("link").last();
			if(this.languageType == 'ar')
			{	
				file = "/custom/resources/tyyd/web/arabic/css/" + file;
			}
			else
			{
				file = "/custom/resources/tyyd/web/default/css/" + file;		
			}
			eval("css.attr({ rel: 'stylesheet',type: 'text/css', href:'" + file +"'})");
		},
		
		loadcssNoRemove:function(file)
		{
			$("head").append("<link>");
			css = $("link").last();
			if(this.languageType == 'ar')
			{	
				file = "/custom/resources/tyyd/web/arabic/css/" + file;
			}
			else
			{
				file = "/custom/resources/tyyd/web/default/css/" + file;		
			}
			eval("css.attr({ rel: 'stylesheet',type: 'text/css', href:'" + file +"'})");
		},
		getCssfromRequestParam:function() 
		{
		    if(this.languageType != 'ar')
			{	
				return;
			}
			var url = window.location.toString(); //获取url中"?"符后的字串
			if(url.indexOf("login.do") != -1)
			{
				this.loadcss("onlinehelp.css");
				this.loadcssNoRemove("explicit.css");
				
			}
			else if(url.indexOf("homepage") != -1)
			{
				this.loadcss("onlinehelp.css");
				this.loadcssNoRemove("dashbord.css");
			}
			else if(url.indexOf("login.html") != -1)
			{
			    this.loadcss("login.css");
			}
			else
			{
				 
			}
			  

		}
		};
commomMethod.init();