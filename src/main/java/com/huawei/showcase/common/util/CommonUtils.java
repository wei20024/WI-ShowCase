package com.huawei.showcase.common.util;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.PhaseInterceptorChain;

import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.model.SessionInfo;
import com.huawei.showcase.model.request.UnsCommonReq;

public final class CommonUtils
{
  public static final String TIME_START = " 00:00:00";
  public static final String TIME_END = " 23:59:59";
  private static final int TRANSACTIONID_MAX_LEN = 50;

  public static String getProjAbsolutePath(){
	  URL classPath = CommonUtils.class.getClassLoader().getResource("");
	  String path = classPath.getPath();
	  
	  if(path.charAt(path.length()-1) == '/')path = path.substring(0,path.length()-1);
	  path = path.replace("/WEB-INF/classes", "");
	  return path;
  }
  
  
  public static boolean checkAllObjectNull(Object... objects)
  {
    if (objects == null)
    {
      return true;
    }
	Object[] arrayOfObject = objects;
	int j = objects.length;
	
	for (int i = 0; i < j; i++) 
	{
	   Object object = arrayOfObject[i];
       if (object == null)
       {
        return true;
       }
    }
    return false;
  }


  public static <V> boolean checkCollectionNullOrEmpty(Collection<V> list)
  {
    return (list == null) || (list.isEmpty());
  }

	public static boolean checkAllStringNull(String... params) {
		if (params == null) 
		{
			return true;
		}

		String[] arrayOfString = params;
		int j = params.length;
		for (int i = 0; i < j; i++) 
		{
			String param = arrayOfString[i];

			if ((param == null) || (param.trim().isEmpty()))
			{
				return true;
			}
		}

		return false;
	}

	public static boolean checkAllStringNullNotTrim(String... params)
	{
		if (params == null) 
		{
			return true;
		}

		String[] arrayOfString = params;
		int j = params.length;
		for (int i = 0; i < j; i++) 
		{
			String param = arrayOfString[i];

			if ((param == null) || (param.isEmpty()))
			{
				return true;
			}
		}

		return false;
	}


	public static HttpServletResponse getRespone() 
	{
		Message message = PhaseInterceptorChain.getCurrentMessage();
		return (HttpServletResponse) message.get("HTTP.RESPONSE");
	}

	public static String createTransactoinId(String userName) 
	{
		String transactionId = "TID-"
				+ DateFormatUtils.format(new Date(), "ddHHmmssSSS");
		if (!checkAllStringNull( userName )) 
		{
			transactionId = transactionId + "-" + userName;
		}
		if (transactionId.length() > TRANSACTIONID_MAX_LEN)
		{
			transactionId = transactionId.substring(0, TRANSACTIONID_MAX_LEN);
		}
		return transactionId;
	}

	public static String getUserFarmId(String userId, String farmId) {
		String id = userId;
		if (checkAllStringNull(farmId )) 
		{
			if (checkAllStringNull(userId ));
		} 
		else 
		{
			id = id + farmId;
			return id;
		}
		if (!checkAllStringNull( farmId )) 
		{
			return farmId;
		}
		return id;
	}

	public static boolean createRandomTokenId(HttpServletRequest req,
			HttpServletResponse rsp) 
	{
		UUID uuid = UUID.randomUUID();
		Cookie uuidCookie = setCookieByProtocol("randomTokenId",
				uuid.toString(), 0);

		req.getSession().setAttribute("randomTokenId", uuid.toString());
		rsp.addCookie(uuidCookie);

		return true;
	}

  public static List<String> getFiles(String path)
  {
    if (path == null)
    {
      return null;
    }

    List<String> fileNameList = new ArrayList<String>();
    try
    {
      File file = new File(path);
      File[] fileArray = file.listFiles();
      if (fileArray == null)
      {
        return null;
      }
      for (int i = 0; i < fileArray.length; i++)
      {
        fileNameList.add(fileArray[i].getName());
      }
    }
    catch (Exception e)
    {
      LogUtils.LOG.error("Catch Exception ", e);
      return null;
    }

    return fileNameList;
  }

	public static synchronized String generateUUID() {
		return UUID.randomUUID().toString();
	}

	public static boolean checkRandomId(String req, String rsp) {
		if (!checkAllStringNull( req )) 
		{
			if (!checkAllStringNull(rsp ));
		} 
		else 
		{
			return true;
		}
		if (!req.equalsIgnoreCase(rsp)) 
		{
			LogUtils.LOG.error("randomId is error. req = " + req
					+ " rsp = " + rsp);
			return false;
		}
		return true;
	}

	public static Cookie setCookieByProtocol(String key, String value, int age) {
		Cookie cookie = new Cookie(key, value);
		cookie.setPath("/");

		if (age != 0) 
		{
			cookie.setMaxAge(age);
		}

		String httpAllowFlag = Configuration.getControllerPropInstance()
				.getString("wi.http.allowed", "false");

		if (httpAllowFlag.equalsIgnoreCase("false")) 
		{
			cookie.setSecure(true);
		}

		return cookie;
	}

	/**
	 * 给Req设置当前Session中的信息
	 */
	  public static void setCommonReq(UnsCommonReq req)
	  {
	    HttpSession currentSession = ContextUtil.getSession();
	    String userId = (String)currentSession.getAttribute("username");
	    if (!checkAllStringNull( userId ))
	    {
	      req.setUserId(userId);
	    }
	    req.setCurrentSession(currentSession);
	    req.setCurrentSessionMap((Map<String,SessionInfo>)currentSession.getAttribute("currentSessionInfosMap"));
	  }
}