package com.huawei.showcase.web.filter;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.huawei.showcase.common.enumcode.LoginTypeUrl;
import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.CommonUtils;
//import com.huawei.showcase.common.util.configration.WriteConf;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.web.util.CommonWebUtil;

public class RedirectFilter
  implements Filter
{
  private static final String ACCESS_CLIENT_TYPE = "accessClientType";
  private String logoutpage;
  private String redirectpage;
  private String exceptionpage;

  public void init(FilterConfig paramFilterConfig)
    throws ServletException
  {
    this.logoutpage = paramFilterConfig.getInitParameter("logoutpage");
    this.redirectpage = paramFilterConfig.getInitParameter("redirectpage");
    this.exceptionpage = paramFilterConfig.getInitParameter("exceptionpage");
  }

  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
    throws IOException, ServletException
  {
    LogUtils.VDESKTOP_LOG.enterMethod();
    HttpServletRequest req = (HttpServletRequest)servletRequest;
    HttpServletResponse rsp = (HttpServletResponse)servletResponse;
    HttpSession session = req.getSession(false);

    String username = "";

    if (session != null)
    {
      username = (String)session.getAttribute("username");
      if ((username == null) || (username.equals("")))
      {
        ServletContext context = session.getServletContext();
        String sessionid = session.getId();
        HttpSession sesionval = (HttpSession)context.getAttribute(sessionid);
        if (sesionval != null)
        {
          username = (String)sesionval.getAttribute("username");
        }
        else
        {
          LogUtils.VDESKTOP_LOG.debug("username is null in ServletContext.");
        }
      }

    }
    else
    {
      LogUtils.VDESKTOP_LOG.debug("username is null.");
    }

    setLanguageType(req, rsp);

    String userPasswordExpired = null;
    if (session != null)
    {
      userPasswordExpired = (String)session.getAttribute("userPasswordExpired");
    }
    String requri = req.getRequestURI();

    CommonWebUtil.dealSessionTimeOut(req);

    String redirectinter = this.redirectpage;

    if (requri.contains(this.exceptionpage))
    {
      LogUtils.VDESKTOP_LOG.debug("enter exceptionpage");
      if (requri.contains("changepassword.do"))
      {
        if (((username == null) || ("".equals(username))) && (!"true".equalsIgnoreCase(userPasswordExpired)))
        {
          rsp.sendRedirect("/");
          return;
        }
      }
      chain.doFilter(servletRequest, servletResponse);
    }
    else
    {
      if ((LoginTypeUrl.checkUrl(requri)) || (requri.equals("/")))
      {
        String accessClientType = getCookieByKey(req.getCookies(), "accessClientType");

        if ((accessClientType != null) && 
          (!"Windows".equalsIgnoreCase(accessClientType)) && (!"Linux".equalsIgnoreCase(accessClientType)) && 
          (!"android_tc".equalsIgnoreCase(accessClientType)) && 
          (!"Mac"
          .equalsIgnoreCase(accessClientType)))
        {
          if (session != null)
          {
            session.removeAttribute("username");
            session.invalidate();
            LogUtils.VDESKTOP_LOG.debug("cleare mobile user session, and login.");
          }
          rsp.sendRedirect("/uns/mobile/pages/mexplicit.html");
          chain.doFilter(servletRequest, servletResponse);
          return;
        }

        redirectinter = "/pages" + redirectinter;
        Configuration loginPropConf = Configuration.getControllerPropInstance();
        if (!CommonUtils.checkAllStringNull(new String[] { username }))
        {
          if (LoginTypeUrl.CERTIFICATE.getCode() != loginPropConf.getInt("logintype", 0))
          {
            rsp.sendRedirect(redirectinter);
            return;
          }

        }

        if (requri.equals("/"))
        {
          chain.doFilter(servletRequest, servletResponse);
          return;
        }

       // WriteConf wirteconf = WriteConf.getInstance();
        int logintypenum = loginPropConf.getInt("logintype", 0);;

        redirectinter = LoginTypeUrl.getName(logintypenum);

        if (redirectinter == null)
        {
          LogUtils.VDESKTOP_LOG.debug("get auth type not in 0-5");
          rsp.sendRedirect("/");
          return;
        }

        if ((redirectinter.equalsIgnoreCase(requri)) || (requri.equalsIgnoreCase(LoginTypeUrl.getName(-1))) || 
          (requri.equalsIgnoreCase(LoginTypeUrl.getName(LoginTypeUrl.LOGIN.getCode()))))
        {
          LogUtils.VDESKTOP_LOG.debug("enter first1 pages");
          chain.doFilter(servletRequest, servletResponse);
          return;
        }

        rsp.sendRedirect("/");
        LogUtils.VDESKTOP_LOG.debug("enter first continue pages");
        return;
      }

      if (requri.contains(this.logoutpage))
      {
        LogUtils.VDESKTOP_LOG.debug("enter first logoutpage pages");
        chain.doFilter(servletRequest, servletResponse);
      }
      else
      {
        if (CommonUtils.checkAllStringNull(new String[] { username }))
        {
          rsp.sendRedirect("/");
          LogUtils.VDESKTOP_LOG.debug("enter first continue pages");
          return;
        }
        LogUtils.VDESKTOP_LOG.exitMethod();
        chain.doFilter(servletRequest, servletResponse);
      }
    }
  }

  private boolean setLanguageType(HttpServletRequest req, HttpServletResponse rsp)
  {
    String language = getCookieByKey(req.getCookies(), "webuiLangType");
    LogUtils.VDESKTOP_LOG.debug("webuiLangType in cookie is: " + language);

    if (CommonUtils.checkAllStringNull(new String[] { language }))
    {
      Configuration loginPropConf = Configuration.getControllerPropInstance();
      language = loginPropConf.getString("languageType");

      if (!CommonUtils.checkAllStringNull(new String[] { language }))
      {
        try
        {
          Cookie cookie = setLanguageToCookie(language);
          rsp.addCookie(cookie);
          LogUtils.VDESKTOP_LOG.debug("set config language.");
        }
        catch (Exception unKnownE)
        {
          LogUtils.VDESKTOP_LOG.error("set config Language error");
        }

      }
      else
      {
        Locale locale = req.getLocale();
        language = locale.toString();
        LogUtils.VDESKTOP_LOG.debug("language get request:" + language);
        try
        {
          Cookie cookie = setLanguageToCookie(language);
          rsp.addCookie(cookie);
          LogUtils.VDESKTOP_LOG.debug("set request language");
        }
        catch (Exception unKnownE)
        {
          LogUtils.VDESKTOP_LOG.error("set request Language error");
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