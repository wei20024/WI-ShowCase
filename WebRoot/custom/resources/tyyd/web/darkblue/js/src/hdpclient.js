var hdpclient={
	
	PLUGIN:null,
	
	init:function()
	{
		if (navigator.appName.indexOf("Microsoft Internet") == -1) 
		{
			try
			{	
				this.PLUGIN = document.getElementById("plugin");
			}
			catch (err)
			{
		      webuilog("get plugin error: " + err);
			}
		}
		else
		{
			try
			{	
				this.PLUGIN = document.getElementById("pluginIE");
			}
			catch (err)
			{
		      webuilog("get plugin error: " + err);
			}
		}
	},
	getClientMac:function()
	{
		try
		{	
			return this.PLUGIN.clientMac();
		}
		catch (err) 
		{
			webuilog(err);
		}
	},
	
	//检测浏览器类型
	CheckBrowser:function()
	{
		var s = navigator.userAgent;
		var a = s.indexOf("Apple");
		var c = s.indexOf("Chrome");
		var ie = s.indexOf("MSIE");
		
		if( c > 0 )//is there chrome
		{
			webuilog( "Chrome dont like functions with parameters.");
			return true;
		}	
		
		if( ie > 0 )//is there chrome
		{
			webuilog( "Internet Explorer dont like NPAPI at all.");
			return true;
		}
		
		if( a > 0 )//is there chrome
		{
			webuilog( "Apple Safari dont like NPAPI at all.");
			return true;
		}
	
		return false;
	},
	
	clientVersion:function()
	{
		try
		{	
			return this.PLUGIN.clientVersion();
		}
		catch (err)
		{
			webuilog(err);
			return null;
		}
	},
	
	clientIp:function()
	{
		try
		{	
			return this.PLUGIN.clientIp();
		}
		catch(err) 
		{ 
			webuilog(err); 
		}
	},
	
	clientName:function()
	{
		try
		{	
			return this.PLUGIN.clientName();
		}
		catch (err) 
		{ 
			webuilog(err); 
		}
	},
	
	clientVersion:function()
	{
		try
		{	
			return this.PLUGIN.clientVersion();
		}
		catch (err) 
		{ 
			webuilog(err); 
		}
	},
	
	clientType:function()
	{
		try
		{	
			return this.PLUGIN.clientType();
		}
		catch (err) 
		{ 
			webuilog(err); 
		}
	}
}


function keys(obj)
{  
   var keys = [];  
   for(var pro in obj){  
      keys.push(pro);  
   }  
   return keys;  
}  
