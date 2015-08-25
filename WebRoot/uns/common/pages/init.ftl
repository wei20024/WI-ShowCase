    <script type="text/javascript" src="/jslib/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="/jslib/jquery.cookie.js"></script> 
    <script type="text/javascript" src="/uns/common/js/src/constantvar.js"></script>
    <script>
    
    	jumplogin();
    	
		function jumplogin()
		{
			var accessClientType = commonvar.getAccessClientType();
			
			if (accessClientType == "Windows" || accessClientType == "Linux" || accessClientType == "android_tc" || accessClientType == "Mac")
			{
			
		    	//if ("${style_name}" == "R21")
		    	//{
		    	//	window.location.href = "/uns/darkblue/explicit.html";
		    	//}
		    	//else
		    //	{
					window.location.href = "pages/login.do";
		    	//}
			}
			else if(accessClientType == "android" || accessClientType == "android_pad" || accessClientType == "iPhone" || accessClientType == "iPad" || accessClientType == "iPod" || accessClientType == "unknow")
			{	
				//移动客户端接入方式
				window.location.href = window.location.protocol+"//"+window.location.host+"/" + "uns/mobile/pages/mexplicit.html";
			}
			else
			{
				//获取认证方式失败，默认跳转到登录页面
				window.location.href = "pages/login.do";
			}
		}
    </script>
    
 