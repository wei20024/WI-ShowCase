package com.huawei.showcase.web.filter;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.web.util.CommonWebUtil;

public class RedirectFilter implements Filter
{
  private static final String ACCESS_CLIENT_TYPE = "accessClientType";
  private String logoutpage;
  private String homePage;
  private String changepassword;

  public void init(FilterConfig paramFilterConfig)
    throws ServletException
  {
    this.logoutpage = paramFilterConfig.getInitParameter("logoutpage");
    this.homePage = paramFilterConfig.getInitParameter("homePage");
    this.changepassword = paramFilterConfig.getInitParameter("changepassword");
  }

  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
    throws IOException, ServletException
  {
    LogUtils.LOG.enterMethod();
    HttpServletRequest req = (HttpServletRequest)servletRequest;
    HttpServletResponse rsp = (HttpServletResponse)servletResponse;
    HttpSession session = req.getSession(false);
    String requri = req.getRequestURI();
    
    String username = "";
    if (session != null)
    {
      username = (String)session.getAttribute("username");
      if ((username == null) || (username.equals("")))
      {
    	  LogUtils.LOG.debug("username is null.");
      }
    }
    
    String userPasswordExpired = null;
    if (session != null)
    {
      userPasswordExpired = (String)session.getAttribute("userPasswordExpired");
    }
    
    setLanguageType(req, rsp);
    CommonWebUtil.dealSessionTimeOut(req);
	
    if (requri.contains(this.changepassword))
    {
      LogUtils.LOG.debug("enter exceptionpage");
      if (CommonUtils.checkAllStringNull(username) && (!"true".equalsIgnoreCase(userPasswordExpired)))
      {
          rsp.sendRedirect("/");
          return;
      }
      chain.doFilter(servletRequest, servletResponse);
      return;
    }
    if (requri.contains(this.logoutpage))
    {
      LogUtils.LOG.debug("enter logoutpage pages");
      chain.doFilter(servletRequest, servletResponse);
      return;
    }
    if(CommonUtils.checkAllStringNull(username) && (requri.contains(homePage) ||  requri.contains("mohomepage")))
    {
    	 rsp.sendRedirect(logoutpage);
    }
    else if(!CommonUtils.checkAllStringNull(username) && !(requri.contains(homePage) || requri.contains("mohomepage")))
    {
    	String accessClientType = getCookieByKey(req.getCookies(), "accessClientType");
    	 
        if ((accessClientType != null) && 
          (!"Windows".equalsIgnoreCase(accessClientType)) && (!"Linux".equalsIgnoreCase(accessClientType)) && 
          (!"android_tc".equalsIgnoreCase(accessClientType)) && 
          (!"Mac".equalsIgnoreCase(accessClientType)))
        {
        	//访问的客户端类型为移动客户端
        	rsp.sendRedirect("uns/mobile/pages/mohomepage.html");

        }else{
        	rsp.sendRedirect(this.homePage);
        }    
    }
        
    chain.doFilter(servletRequest, servletResponse);

    LogUtils.LOG.debug("enter first continue pages");

  }

  private boolean setLanguageType(HttpServletRequest req, HttpServletResponse rsp)
  {
    String language = getCookieByKey(req.getCookies(), "webuiLangType");
    LogUtils.LOG.debug("webuiLangType in cookie is: " + language);

    if (CommonUtils.checkAllStringNull(language ))
    {
      Configuration loginPropConf = Configuration.getControllerPropInstance();
      language = loginPropConf.getString("languageType");

      if (!CommonUtils.checkAllStringNull( language ))
      {
        try
        {
          Cookie cookie = setLanguageToCookie(language);
          rsp.addCookie(cookie);
          LogUtils.LOG.debug("set config language.");
        }
        catch (Exception unKnownE)
        {
          LogUtils.LOG.error("set config Language error");
        }

      }
      else
      { 
        Locale locale = req.getLocale();
        language = locale.toString();
        LogUtils.LOG.debug("language get request:" + language);
        try
        {
          Cookie cookie = setLanguageToCookie(language);
          rsp.addCookie(cookie);
          LogUtils.LOG.debug("set request language");
        }
        catch (Exception unKnownE)
        {
          LogUtils.LOG.error("set request Language error");
        }
      }
    }

    return true;
  }

  private String getCookieByKey(Cookie[] cookies, String key)
  {
    StringBuilder sb = null;
    if (cookies != null)
    {
      for (Cookie cookie : cookies)
      {
        if (key.equals(cookie.getName()))
        {
          sb = new StringBuilder(cookie.getValue());
        }
      }
    }

    return sb == null ? null : sb.toString();
  }

  
  
  private Cookie setLanguageToCookie(String language)
  {
    Cookie cookie = CommonUtils.setCookieByProtocol("browserType", language, StaticNumber.NANO_UNIT.getCode());
    return cookie;
  }

  public void destroy()
  {
  }

public static String getAccessClientType() {
	return ACCESS_CLIENT_TYPE;
}
}