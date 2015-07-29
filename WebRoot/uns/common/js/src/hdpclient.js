var hdpclient={
	
	PLUGIN:null,
	
	init:function()
	{
		var browserType = commonvar.getBrowserType();
		
		if (browserType.indexOf("ie") == -1) 
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
	//得到客户端mac地址
	getClientMac:function()
	{
		try
		{	
			//从1.5.20.32以上版本获取到的客户端ip只有一个
			if (this.clientVersion() >= '1.5.20.100')
			{
				return this.clientSingleMac();
			}
			
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
		
		if( c > 0 )
		{
			webuilog( "Chrome dont like functions with parameters.");
			return true;
		}	
		
		if( ie > 0 )
		{
			webuilog( "Internet Explorer dont like NPAPI at all.");
			return true;
		}
		
		if( a > 0 )
		{
			webuilog( "Apple Safari dont like NPAPI at all.");
			return true;
		}
	
		return false;
	},
	//得到客户端版本号信息
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
	//得到客户端IP
	clientIp:function()
	{
		try
		{
			//从1.5.20.32以上版本获取到的客户端ip只有一个
			if (this.clientVersion() >= '1.5.20.100')
			{
				return this.clientSingleIp();
			}
			
			return this.PLUGIN.clientIp();
		}
		catch(err) 
		{ 
			webuilog(err); 
		}
	},
	//得到客户端名字
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
	//得到客户端版本
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
	userIdentity:function()
	{
		try
		{
			return this.PLUGIN.userIdentity();
		}
		catch(err)
		{
			webuilog(err); 
		}
	},
	//获取客户端mac和ip信息，之前的接口是将客户端所有的ip和mac获取，对于多网卡场景会返回很多
	//现在返回的只有一个，就是当前处理WI连接的网卡信息格式为：ＩＰ：ＭＡＣ
	clientSingleIp:function()
	{
		try
		{
			var url = window.location.hostname;
			var ipMacList = this.PLUGIN.clientIpMacList(url);
			var ipMacArray = ipMacList.split(",");
			var ipMac = ipMacArray[0];
			var ips = ipMac.split(":");
			return ips[0];
		}
		catch(err)
		{
			webuilog(err); 
		}
	},
	clientSingleMac:function()
	{
		try
		{
			var url = window.location.hostname;
			var ipMacList = this.PLUGIN.clientIpMacList(url);
			var ipMacArray = ipMacList.split(",");
			var ipMac = ipMacArray[0];
			var ips = ipMac.split(":");
			return ips[1];
		}
		catch(err)
		{
			webuilog(err); 
		}
	},
	
	//得到客户端类型
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
