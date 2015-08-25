package com.huawei.showcase.web.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.log.LogUtils;

public class FileFilter
  implements Filter
{
  private static final String HTMLSUFFIX = ".html";
  private static final String HTMLSUFFIXS = ".HTML";
  private String except;
  private List<String> excepts;

  public void init(FilterConfig paramFilterConfig)
    throws ServletException
  {
    this.except = paramFilterConfig.getInitParameter("exclude");

    if (!CommonUtils.checkAllStringNull(new String[] { this.except }))
    {
      String[] exceptArrays = this.except.split(":");
      this.excepts = Arrays.asList(exceptArrays);
    }
  }

  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
    throws IOException, ServletException
  {
    LogUtils.VDESKTOP_LOG.enterMethod();
    HttpServletRequest req = (HttpServletRequest)servletRequest;
    HttpServletResponse rsp = (HttpServletResponse)servletResponse;

    boolean allowFlag = checkAuth(req);

    if (!allowFlag)
    {
      LogUtils.VDESKTOP_LOG.error("url rejected.");
      rsp.sendRedirect("/");
      return;
    }

    try
    {
      chain.doFilter(req, rsp);
    }
    catch (Exception e1)
    {
      LogUtils.VDESKTOP_LOG.error(e1);
    }
  }

  private boolean checkAuth(HttpServletRequest req)
  {
    try
    {
      String requri = req.getRequestURI();
      LogUtils.VDESKTOP_LOG.debug("url " + requri);

      for (String interfaces : this.excepts)
      {
        if ((!CommonUtils.checkAllStringNull(new String[] { interfaces })) && (!interfaces.isEmpty()))
        {
          if (requri.contains(interfaces))
          {
            return true;
          }
        }
      }

      if ((requri.contains(".html")) || (requri.contains(".HTML")))
      {
        String userName = getUserNameFromSession(req.getSession());

        if (!CommonUtils.checkAllStringNull(new String[] { userName }))
        {
          return true;
        }
      }
    }
    catch (Exception e)
    {
      LogUtils.VDESKTOP_LOG.error(e);
      return true;
    }
    return false;
  }

  private String getUserNameFromSession(HttpSession session)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();

    String username = null;

    if (session != null)
    {
      username = (String)session.getAttribute("username");

      if ((username == null) || (username.equals("")))
      {
        ServletContext context = session.getServletContext();
        String sessionid = (String)session.getAttribute("ssoContextId");

        if (!CommonUtils.checkAllStringNull(new String[] { sessionid }))
        {
          HttpSession sesionval = (HttpSession)context.getAttribute(sessionid);
          if (sesionval != null)
          {
            username = (String)sesionval.getAttribute("username");
          }
          else
          {
            LogUtils.VDESKTOP_LOG.debug("Username is null in ServletContext.");
          }
        }
      }
    }
    else
    {
      LogUtils.VDESKTOP_LOG.debug("Session is null, username is null.");
    }

    LogUtils.VDESKTOP_LOG.debug("GetUserNameFromSession the userName is " + username);
    return username;
  }

  public void destroy()
  {
  }

public static String getHtmlsuffix() {
	return HTMLSUFFIX;
}

public static String getHtmlsuffixs() {
	return HTMLSUFFIXS;
}
}