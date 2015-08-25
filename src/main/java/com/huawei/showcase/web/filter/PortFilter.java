package com.huawei.showcase.web.filter;

import java.net.PortUnreachableException;
import java.util.concurrent.atomic.AtomicInteger;

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

import com.huawei.showcase.common.enumcode.CheckServiceUrl;
import com.huawei.showcase.common.enumcode.CsrfCheckUrl;
import com.huawei.showcase.common.enumcode.LoginType;
import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.configration.Configuration;
//import com.huawei.showcase.common.util.configration.WriteConf;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.web.util.CommonWebUtil;

public class PortFilter implements Filter
{
  private static AtomicInteger restRequestTimes = new AtomicInteger();
  private String[] exceptInterfaces;
  private String exceptInterface;

  public void init(FilterConfig paramFilterConfig)
    throws ServletException
  {
    this.exceptInterface = paramFilterConfig.getInitParameter("exceptinterface");
    if (!CommonUtils.checkAllStringNull(new String[] { this.exceptInterface }))
    {
      this.exceptInterfaces = this.exceptInterface.split(":");
    }
    else
    {
      this.exceptInterfaces = 
        new String[0];
    }
  }

  public void destroy()
  {
  }

  public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
    throws PortUnreachableException
  {
    TransactionIdUtil.removeCurrentTransactionId();
    HttpServletRequest request = (HttpServletRequest)servletRequest;
    HttpServletResponse response = (HttpServletResponse)servletResponse;

    int port = request.getServerPort();
    String remoteip = request.getRemoteAddr();
    String localhost = request.getLocalAddr();
    String url = request.getRequestURL().toString();
    boolean allowHttpFlag = false;

    if ((!url.contains("monitorStatus")) && (!url.contains("getPublicInfo")))
    {
      restRequestTimes.incrementAndGet();
      LogUtils.VDESKTOP_LOG.debug("port = " + port + ", remoteIp = " + remoteip + ",localhost = " + 
        localhost + ", " + request.getRequestURL());
    }
    if (restRequestTimes.intValue() > StaticNumber.MILL_UNIT.getCode())
    {
      LogUtils.VDESKTOP_LOG.info("Rest request times = " + restRequestTimes.intValue());
      restRequestTimes.set(0);
    }

    for (String interfaces : this.exceptInterfaces)
    {
      if (url.contains(interfaces))
      {
        allowHttpFlag = true;
      }
    }

    if ((!"true".equals(Configuration.getControllerPropInstance().getString("wi.http.allowed"))) && (!allowHttpFlag))
    {
      if ((("127.0.0.1".equals(remoteip)) || (localhost.equals(remoteip)) || ("0:0:0:0:0:0:0:1".equals(remoteip))) && 
        (Configuration.getControllerPropInstance().getString("wi.http.port").equals(String.valueOf(port))))
      {
        LogUtils.VDESKTOP_LOG.info("port = " + port + ", remoteIp = " + remoteip);
      }
      else if (!url.contains("https"))
      {
        LogUtils.VDESKTOP_LOG.error("auth error! you are rejected!");
        throw new PortUnreachableException("using the wrong server port");
      }

    }

    try
    {
      CommonWebUtil.dealSessionTimeOut(request);

      if (!csrfPrevention(request, response))
      {
        LogUtils.VDESKTOP_LOG.error("Maybe is csrf attract, return to loginpage!");
        request.getSession().removeAttribute("username");
        request.getSession().invalidate();
        response.sendRedirect("/");
        return;
      }

      if (!serviceUrlAuthCheck(request, response))
      {
        LogUtils.VDESKTOP_LOG.error("Maybe the request is valid, return error code!");
        request.getSession().removeAttribute("username");
        request.getSession().invalidate();
        response.setHeader("sessionstatus", "sessionOut");
        response.getWriter().print("sessionOut");
        return;
      }

      response.addHeader("Cache-Control", "no-store");
      response.addHeader("Pragma", "no-cache");

      filterChain.doFilter(request, response);
    }
    catch (Exception e1)
    {
      LogUtils.VDESKTOP_LOG.error(e1);
    }
  }

  private boolean csrfPrevention(HttpServletRequest req, HttpServletResponse rsp)
  {
    String csrfFlag = Configuration.getControllerPropInstance().getString("Common.csrf.flag");
    if ((!CommonUtils.checkAllStringNull(new String[] { csrfFlag })) && (csrfFlag.equalsIgnoreCase("0")))
    {
      LogUtils.VDESKTOP_LOG.debug("csrf is cancel.");
      return true;
    }

    String requri = req.getRequestURI();

    if (CsrfCheckUrl.containUrl(requri))
    {
      String previousNonce = req.getHeader("randomTokenId");

      String nonceCache = (String)req.getSession().getAttribute("randomTokenId");

      if (CommonUtils.checkAllStringNull(new String[] { previousNonce }))
      {
        LogUtils.VDESKTOP_LOG.error("previousNonce is null!");
        return false;
      }

      if ((!CommonUtils.checkAllStringNull(new String[] { nonceCache })) && (!previousNonce.equalsIgnoreCase(nonceCache)))
      {
        LogUtils.VDESKTOP_LOG.error("previousNonce and nonceCache is noequal, nonceCache = " + nonceCache + 
          ", previousNonce = " + previousNonce);
        return false;
      }
    }

    return true;
  }

  private boolean serviceUrlAuthCheck(HttpServletRequest req, HttpServletResponse rsp)
  {
    String requri = req.getRequestURI();

    if (CheckServiceUrl.containUrl(requri))
    {
      String userName = getUserName(req);

      if (CommonUtils.checkAllStringNull(new String[] { userName }))
      {
        LogUtils.VDESKTOP_LOG.error("The userName is null, cannot use!");
        return false;
      }
    }

    return true;
  }

  private String getUserName(HttpServletRequest req)
  {
    HttpSession session = req.getSession(false);
    Configuration loginPropConf = Configuration.getControllerPropInstance();
    String logintype = loginPropConf.getString("logintype").trim();
    String userName = null;

    if (session == null)
    {
      LogUtils.VDESKTOP_LOG.debug("session is null.");
      return null;
    }
    if (LoginType.CERTIFICATESSO.getCode().intValue() == Integer.parseInt(logintype))
    {
      if (session.getAttribute("username") != null)
      {
        userName = (String)session.getAttribute("username");

        LogUtils.VDESKTOP_LOG.debug("userName is " + userName);
        return userName;
      }

      ServletContext servletContext = session.getServletContext();
      String sessionid = (String)session.getAttribute("ssoContextId");
      HttpSession sessionVal = (HttpSession)servletContext.getAttribute(sessionid);

      if (sessionVal == null)
      {
        LogUtils.VDESKTOP_LOG.debug("sessionVal is null.");
        return null;
      }

      userName = (String)sessionVal.getAttribute("username");
      session.setAttribute("username", userName);
    }
    else {
      if (session.getAttribute("username") == null)
      {
        LogUtils.VDESKTOP_LOG.debug("username is null 2.");
        return null;
      }

      userName = (String)session.getAttribute("username");
    }
    return userName;
  }
}