function createRandomId()
{
	try
	{
		//每次请求生成唯一标识,与返回标识对比,以确认请求与响应匹配
		var randomId = $("#username").text() + Math.random() ;
	
		randomId = escape(randomId)
		
		if(randomId !=null && randomId.length >50)
		{
		  randomId = randomId.substr(0,50); 
		}
		return randomId;
	
	}
	catch(err)
	{
		console.log("createRandomId throw exception:" + err, err.stack ? err.stack : "");
	}
}
