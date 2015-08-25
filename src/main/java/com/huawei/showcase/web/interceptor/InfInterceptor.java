package com.huawei.showcase.web.interceptor;

import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.common.util.log.TransactionIdUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Response;
import org.apache.cxf.endpoint.Endpoint;
import org.apache.cxf.interceptor.InterceptorChain;
import org.apache.cxf.interceptor.OutgoingChainInterceptor;
import org.apache.cxf.message.Message;
import org.apache.cxf.message.MessageImpl;
import org.apache.cxf.phase.AbstractPhaseInterceptor;
import org.apache.cxf.phase.PhaseInterceptorChain;
import org.apache.cxf.ws.policy.PolicyOutInterceptor;

public class InfInterceptor extends AbstractPhaseInterceptor<Message>
{
  private static final String REST_CONTENT_TYPE = "application/json;charset=UTF-8";
  private static final int HTTPS_REST_PORT = 4477;
  private List<String> outInterfaceNameLists;
  private List<String> certAuthInterfaceNameLists;

  public InfInterceptor()
  {
    super("receive");
  }

  public InfInterceptor(String phase)
  {
    super(phase);
  }

  public void handleMessage(Message message)
  {
    try
    {
      if (this.certAuthInterfaceNameLists != null)
      {
        boolean result = checkInterfacesAuth(message);
        if (!result)
        {
          LogUtils.VDESKTOP_LOG.error(" Rest Request port error.");
          return;
        }
      }

      String interfaceName = getInterfaceName(message);

      String transactionId = null;
      if (!CommonUtils.checkAllStringNull(new String[] { interfaceName }))
      {
        if ((this.outInterfaceNameLists != null) && (!this.outInterfaceNameLists.contains(interfaceName)))
        {
          String userName = getUserName();

          transactionId = CommonUtils.createTransactoinId(userName);
        }

      }

      if (transactionId != null)
      {
        TransactionIdUtil.setCurrentTransactionId(transactionId);
        LogUtils.VDESKTOP_LOG.debug("cached transactionId = " + transactionId);
      }
      else
      {
        TransactionIdUtil.removeCurrentTransactionId();
      }
    }
    catch (Exception e)
    {
      LogUtils.VDESKTOP_LOG.error(e);
      TransactionIdUtil.removeCurrentTransactionId();
    }
  }

  private String getUserName()
  {
    String username = null;

    Message message = PhaseInterceptorChain.getCurrentMessage();
    HttpServletRequest httprequest = (HttpServletRequest)message.get("HTTP.REQUEST");
    HttpSession session = httprequest.getSession();
    if (session != null)
    {
      username = (String)session.getAttribute("username");
      if (CommonUtils.checkAllStringNull(new String[] { username }))
      {
        ServletContext context = session.getServletContext();
        HttpSession sesionsoo = (HttpSession)context.getAttribute(session.getId());
        if (sesionsoo != null)
        {
          username = (String)sesionsoo.getAttribute("username");
        }
      }
    }
    return username;
  }

  private boolean checkInterfacesAuth(Message message)
  {
    HttpServletRequest httprequest = (HttpServletRequest)message.get("HTTP.REQUEST");

    if (httprequest == null)
    {
      LogUtils.VDESKTOP_LOG.error("httprequest is null.");
      Response response = createResponse(Response.Status.NOT_FOUND.getStatusCode(), null);
      returnSpeResponse(message, Response.Status.NOT_FOUND.getStatusCode(), response, null);
      return false;
    }

    String curMethodPath = httprequest.getPathInfo();

    if ((CommonUtils.checkAllStringNull(new String[] { curMethodPath })) || (curMethodPath.endsWith("/")))
    {
      curMethodPath = httprequest.getRequestURI();
      if ((CommonUtils.checkAllStringNull(new String[] { curMethodPath })) || (curMethodPath.endsWith("/")))
      {
        LogUtils.VDESKTOP_LOG.error("pathInfo is null or invalid.");
        Response response = createResponse(Response.Status.NOT_FOUND.getStatusCode(), null);
        returnSpeResponse(message, Response.Status.NOT_FOUND.getStatusCode(), response, null);
        return false;
      }

    }

    if (!checkMethodPath(curMethodPath, this.certAuthInterfaceNameLists))
    {
      return true;
    }

    int httpsPort = StaticNumber.ZERO.getCode();;
    try
    {
      httpsPort = httprequest.getLocalPort();
    }
    catch (Exception e)
    {
      LogUtils.VDESKTOP_LOG.error("get https port error.", e);

      Response response = createResponse(Response.Status.NOT_FOUND.getStatusCode(), null);
      returnSpeResponse(message, Response.Status.NOT_FOUND.getStatusCode(), response, null);
      return false;
    }

    if (HTTPS_REST_PORT != httpsPort)
    {
      LogUtils.VDESKTOP_LOG.error(" port invalid.");

      Response response = createResponse(Response.Status.FORBIDDEN.getStatusCode(), null);
      returnSpeResponse(message, Response.Status.FORBIDDEN.getStatusCode(), response, null);
      return false;
    }
    return true;
  }

  private String getInterfaceName(Message message)
  {
    String requestURL = (String)message.get("org.apache.cxf.request.url");
    if (!CommonUtils.checkAllStringNull(new String[] { requestURL }))
    {
      int separator = requestURL.lastIndexOf("/");
      if (separator == -1)
      {
        LogUtils.VDESKTOP_LOG.error("URL is invalid url = " + requestURL);
        return null;
      }
      return requestURL.substring(separator + 1);
    }
    return null;
  }

  private void returnSpeResponse(Message message, int rspCode, Response rsp, String tokenId)
  {
    message.getInterceptorChain().abort();
    Endpoint endpoint = message.getExchange().getEndpoint();

    Message rspMsg = new MessageImpl();
    rspMsg.setExchange(message.getExchange());
    rspMsg = endpoint.getBinding().createMessage(rspMsg);
    message.getExchange().setOutMessage(rspMsg);

    rspMsg.put(Message.RESPONSE_CODE, Integer.valueOf(rspCode));
    rspMsg.getExchange().put(Message.RESPONSE_CODE, Integer.valueOf(rspCode));

    Map<String, ArrayList<String>> headers = (Map<String, ArrayList<String>>)rspMsg.get(Message.PROTOCOL_HEADERS);
    if (headers == null)
    {
      headers = new TreeMap<String, ArrayList<String>>();
      rspMsg.put(Message.PROTOCOL_HEADERS, headers);
    }

    if (!CommonUtils.checkAllStringNull(new String[] { tokenId }))
    {
      ArrayList<String> xAuthToken = new ArrayList<String>();
      xAuthToken.add(tokenId);
      headers.put("X-Auth-Token", xAuthToken);
    }

    ArrayList<String> contentEncoding = new ArrayList<String>();
    contentEncoding.add("UTF-8");
    headers.put("Content-Encoding", contentEncoding);

    rspMsg.setContent(Response.class, rsp);
    rspMsg.put(Response.class, rsp);
    rspMsg.getExchange().put(Response.class, rsp);

    rspMsg.put("Content-Type", "application/json");
    rspMsg.getExchange().put("Content-Type", "application/json");

    InterceptorChain chain = OutgoingChainInterceptor.getOutInterceptorChain(message.getExchange());
    rspMsg.setInterceptorChain(chain);
    chain.doInterceptStartingAfter(rspMsg, PolicyOutInterceptor.class.getName());
  }

  private Response createResponse(int httpStatus, Object obj)
  {
    Response.ResponseBuilder builder = Response.status(httpStatus);
    builder.header("Content-Type", REST_CONTENT_TYPE);
    if (obj != null)
    {
      builder.entity(obj);
    }

    return builder.build();
  }

  private boolean checkMethodPath(String curMethodPath, List<String> methodPath)
  {
    if (methodPath == null)
    {
      LogUtils.VDESKTOP_LOG.debug("excludePath is null.");
      return false;
    }
    if (CommonUtils.checkAllStringNull(new String[] { curMethodPath }))
    {
      LogUtils.VDESKTOP_LOG.error("curMethodPath is null.");
      return false;
    }
    int separator = curMethodPath.lastIndexOf("/");
    if (separator == -1)
    {
      LogUtils.VDESKTOP_LOG.error("URL is not correct. url = " + curMethodPath);
    }
    else
    {
      String path = curMethodPath.substring(separator + 1);
      if (methodPath.contains(path))
      {
        LogUtils.VDESKTOP_LOG.debug("path = " + path);
        return true;
      }
    }

    return false;
  }

  public List<String> getOutInterfaceNameLists()
  {
    return this.outInterfaceNameLists;
  }

  public void setOutInterfaceNameLists(List<String> outInterfaceNameLists)
  {
    this.outInterfaceNameLists = outInterfaceNameLists;
  }

  public List<String> getCertAuthInterfaceNameLists()
  {
    return this.certAuthInterfaceNameLists;
  }

  public void setCertAuthInterfaceNameLists(List<String> certAuthInterfaceNameLists)
  {
    this.certAuthInterfaceNameLists = certAuthInterfaceNameLists;
  }
}