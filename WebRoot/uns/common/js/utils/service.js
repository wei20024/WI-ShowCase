
/**
*  与后台通信接口
*/	
var ServiceAPI = {
	serviceUrl : {},
	
	//需要在消息系统注册方法，方便前台调用
	init:function(){
		/**
		*  定义url
		*/
		this.serviceUrl = {
				//用户交互				
				wstLogin: commonvar.serviceUrl.wstLogin,
				caLogin: commonvar.serviceUrl.caLogin,
				caLoginwst:commonvar.serviceUrl.caLoginwst
		};
	},
	//内部ajax调用函数
	ajax:function(params, url, success_callback, error_callback, method , dataType ,headers){
		if(typeof(params) != 'undefined' && url){
			var type_method = method || 'post';
			var curdataType = dataType || 'json';
			$.ajax({
				url : url,
				type:type_method,         //数据发送方式
				dataType:curdataType,     //接受数据格式
				data:params,         //要传递的数据
				cache:false,
				beforeSend: function(XMLHttpRequest){			
				},
<<<<<<< HEAD
=======
				complete:function(response){
				},
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
				success : function(response) {							
					if($.isFunction(success_callback)){
							success_callback(response);
					}
				},
				error : function(response) {
					if($.isFunction(error_callback)){
							error_callback(response);
					}
				}
			});
		}
	},
	ajaxPostJSON:function(params, url, success_callback, error_callback){
		if(typeof(params) != 'undefined' && url){
			webuilog(loglevel.info,"type is:"+typeof(params));
			var cType="application/x-www-form-urlencoded; charset=UTF-8";
			
			if(typeof(params)=="string")
			 	cType="application/json";
				
			webuilog(loglevel.info,"Post "+url+" request body is: ");
			var type_method = 'POST';
            $.ajax({
                url : url,
                type : type_method,
				timeout:120000,
                dataType : "json",
                contentType: cType,
                data: params,
				cache:false,
                beforeSend: function(XMLHttpRequest){
                	XMLHttpRequest.setRequestHeader("randomTokenId",commonvar.getRandomTokenId());
				},
<<<<<<< HEAD
=======
				complete:function(response){

				},
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
                success : function(msg) {
					webuilog(loglevel.info,"Post "+url+" success,response body is: ");
					webuilog(loglevel.info,msg);
					ServiceAPI.successHandler(msg, success_callback,'');					
                },
                error : function(response,error) {
					webuilog(loglevel.info,url+" error,status is: "+response.status+"  "+error);
                	ServiceAPI.errorHandler(response, error,error_callback,''); 
                }
            });
		}
	},
	ajaxGetJSON:function(params, url, success_callback, error_callback){
		if(typeof(params) != 'undefined' && url){
			webuilog(loglevel.info,"Get "+url+" request body is: ");
			webuilog(loglevel.info,params);
			var type_method = 'GET';
            $.ajax({
                url : url,
                type : type_method,
				cache:false,
                dataType : "json",
                data: params,
                success : function(msg) {
					webuilog(loglevel.info,"Get "+url+" success,response body is: ");
					webuilog(loglevel.info,msg);
					ServiceAPI.successHandler(msg, success_callback,'');					
                },
                error : function(response) {
					webuilog(loglevel.info,"Get "+url+" error,status is: "+response.status);					
                	ServiceAPI.errorHandler(response, error_callback,''); 
                }
            });
		}
	},
	ajaxGetJSONAsync:function(params, url, success_callback, error_callback){
		if(typeof(params) != 'undefined' && url){
			var type_method = 'GET';
            $.ajax({
                url : url,
                type : type_method,
                dataType : "json",
				async:false,
                data: params,
                success : function(msg) {
					ServiceAPI.successHandler(msg, success_callback,'');				
                },
                error : function(response) {
                	ServiceAPI.errorHandler(response, error_callback,''); 
                }
            });
		}
	},
<<<<<<< HEAD
	ajaxGetNoResult:function(params, url, success_callback, error_callback){
		if(typeof(params) != 'undefined' && url){
			webuilog(loglevel.info,"Get "+url+" request body is: ");
			webuilog(loglevel.info,params);
			var type_method = 'GET';
            $.ajax({
                url : url,
                type : type_method,
				cache:false,
				dataType: 'text',
                data: params,
                success : function(msg, result, xmlresponse) {
					webuilog(loglevel.info,"Get "+url+" success,response body is: ");
					webuilog(loglevel.info,msg);
									/*如果不是请求成功或者批量时候部分成功, 接口统一处理错去请求*/
                	if($.isFunction(success_callback)){
                   		 success_callback(xmlresponse);  
                	}  					
                },
                error : function(response) {
					webuilog(loglevel.info,"Get "+url+" error,status is: "+response.status);					
                	error_callback(response);
                }
            });
		}
	},
=======
	
>>>>>>> 7cf7c9997bcec953e9a329c30100afadb59cc3b7
	ajaxCrossDomain:function(params, url, formId, success_callback, error_callback, method) {
		if(params && url){
			$.ajax({
				type : method,
				url : url,
				params: params,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				success : function(response) {							
					if($.isFunction(success_callback)){
							success_callback(response);
					}
				},
				error : function(response) {
					if($.isFunction(error_callback)){
							error_callback(response);;
					}
				}
			});
		}
	},
	successHandler:function(msg, success_callback,fileManager){
        if(msg){        	
            if (null != msg && msg.resultCode == "401" || msg.resultCode == "804")
			{
                window.location.href =commonvar.baseUrl ;                
            } 
			else if (null != msg && msg.resultCode == "713")//用户在别处登录
			{
                window.location.href =commonvar.serviceUrl.logoutPage+"?resultCode="+msg.resultCode; 
                return;
            } 
			else 
			{  
				/*如果不是请求成功或者批量时候部分成功, 接口统一处理错去请求*/
                if($.isFunction(success_callback)){
                    success_callback(msg);  
                }           
            }
        }
	},	
	errorHandler:function(response,error, error_callback,fileManager){
		
    	if(!error_callback){
    		var default_status = 10;
			var status = response.status;
			if(!status){
				status = parseInt(status);
				if(isNaN(status)){
					status = default_status;
				}
			}

			if(status < 100){
				status = default_status;		
			}
			else{
			    if (status == ResultCode.code.OPERATE_SUCCESS){
			        window.location.href =commonvar.baseUrl ; 
			    }else{			    	
			    	
			    }			  
			}						
    	}else if($.isFunction(error_callback)){
			error_callback(response,error);
		}
	},
	
	getNoticeLanguage:function(){
		return Login.getString('notice');		
	}
};

