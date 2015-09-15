package com.huawei.showcase.web.filter;

import java.net.PortUnreachableException;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.huawei.showcase.common.enumcode.CheckServiceUrl;
import com.huawei.showcase.common.enumcode.CsrfCheckUrl;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import com.huawei.showcase.web.util.CommonWebUtil;

public class PortFilter implements Filter
{
  private static AtomicInteger restRequestTimes = new AtomicInteger();
  private String[] exceptInterfaces;
  private String exceptInterface;
  private String localhostIp = "127.0.0.1";
  private String localhost6Ip = "0:0:0:0:0:0:0:1";
  
  public void init(FilterConfig paramFilterConfig)throws ServletException
  {
    this.exceptInterface = paramFilterConfig.getInitParameter("exceptinterface");
    if (!CommonUtils.checkAllStringNull( this.exceptInterface ))
    {
      this.exceptInterfaces = this.exceptInterface.split(":");
    }
    else
    {
      this.exceptInterfaces = new String[0];
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
   
    //是否允许HTTP访问
    if (!isAllowedHttpAccess(url))
    {
      if (isIpAndPortAllowed(remoteip,localhost,port))
      {
        LogUtils.LOG.info("port = " + port + ", remoteIp = " + remoteip);
      }
      else if (!url.contains("https"))
      {
        LogUtils.LOG.error("auth error! you are rejected!");
        throw new PortUnreachableException("using the wrong server port");
      }

    }

    try
    {
      CommonWebUtil.dealSessionTimeOut(request);
      //需防止csfr攻击
      if (!csrfPrevention(request, response))
      {
        LogUtils.LOG.error("Maybe is csrf attract, return to loginpage!");
        request.getSession().removeAttribute("username");
        request.getSession().invalidate();
        response.sendRedirect("/");
        return;
      }
      //需检查用户是否登录
      if (!serviceUrlAuthCheck(request, response))
      {
        LogUtils.LOG.error("Maybe the request is valid, return error code!");
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
      LogUtils.LOG.error(e1);
    }
  }

  private boolean isIpAndPortAllowed(String remoteip,String localip,int port)
  {
	  String propPort = Configuration.getControllerPropInstance().getString("wi.http.port");
	  //客户端IP和服务端Ip一致，端口与配置一致
	  if (((localhostIp.equals(remoteip)) ||  (localhost6Ip.equals(remoteip)))
			 ||(localip.equals(remoteip)) && (propPort.equals(String.valueOf(port))))
		  return true;
	  return false;
  }
  
  private boolean isAllowedHttpAccess(String url)
  {	  
	boolean allowHttpFlag = false;
	
    for (String interfaces : this.exceptInterfaces)
    {
      if (url.contains(interfaces))
      {
        allowHttpFlag = true;
      }
    }
	String propHttpFlag = Configuration.getControllerPropInstance().getString("wi.http.allowed");
	if ("true".equals(propHttpFlag) || allowHttpFlag)  return true;
	
	return false;
  }
  
  private boolean csrfPrevention(HttpServletRequest req, HttpServletResponse rsp)
  {
    String csrfFlag = Configuration.getControllerPropInstance().getString("Common.csrf.flag");
    if ((!CommonUtils.checkAllStringNull(csrfFlag )) && (csrfFlag.equalsIgnoreCase("0")))
    {
      LogUtils.LOG.debug("csrf is cancel.");
      return true;
    }

    String requri = req.getRequestURI();

    if (CsrfCheckUrl.containUrl(requri))
    {
      String previousNonce = req.getHeader("randomTokenId");

      String nonceCache = (String)req.getSession().getAttribute("randomTokenId");

      if (CommonUtils.checkAllStringNull( previousNonce ))
      {
        LogUtils.LOG.error("previousNonce is null!");
        return false;
      }

      if ((!CommonUtils.checkAllStringNull(nonceCache ))&&(!previousNonce.equalsIgnoreCase(nonceCache)))
      {
        LogUtils.LOG.error("previousNonce and nonceCache is noequal, nonceCache = " + nonceCache + 
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

      if (CommonUtils.checkAllStringNull(userName ))
      {
        LogUtils.LOG.error("The userName is null, cannot use!");
        return false;
      }
    }

    return true;
  }

  private String getUserName(HttpServletRequest req)
  {
    HttpSession session = req.getSession(false);
 
    String userName = null;

    if (session == null)
    {
      LogUtils.LOG.debug("session is null.");
      return null;
    }
  
   if (session.getAttribute("username") != null)
   {
     userName = (String)session.getAttribute("username");
     LogUtils.LOG.debug("userName is " + userName);
     return userName;
   }
   LogUtils.LOG.debug("userName is null" );
   return null;
  }
}