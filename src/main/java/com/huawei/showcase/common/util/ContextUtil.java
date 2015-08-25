package com.huawei.showcase.common.util;

import java.io.Serializable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.huawei.showcase.model.ContextInfoMap;

public class ContextUtil  implements Serializable
{
  private static final long serialVersionUID = -5078872523187051923L;
  public static final String HTTP_SESSION = "HTTP_SESSION";
  public static final String HTTP_APPLICATION = "HTTP_APPLICATION";
  public static final String HTTP_PARAMETERS = "HTTP_PARAMETERS";
  public static final String HTTP_REQUEST = "HTTP_REQUEST";
  public static final String HTTP_RESPONSE = "HTTP_RESPONSE";
  private static ThreadLocal<ContextInfoMap> actionContext = new ThreadLocal<ContextInfoMap>();

  public static void createContext(HttpServletRequest request, HttpServletResponse response)
  {
    ContextInfoMap info = new ContextInfoMap();
    info.put("HTTP_REQUEST", request);
    info.put("HTTP_RESPONSE", response);
    actionContext.set(info);
  }

  public static ContextInfoMap getContext()
  {
    return (ContextInfoMap)actionContext.get();
  }

  public static void setRequest(HttpServletRequest request)
  {
    ((ContextInfoMap)actionContext.get()).put("HTTP_REQUEST", request);
  }

  public static HttpServletRequest getRequest()
  {
    return (HttpServletRequest)((ContextInfoMap)actionContext.get()).get("HTTP_REQUEST");
  }

  public static void setResponse(HttpServletResponse response)
  {
    ((ContextInfoMap)actionContext.get()).put("HTTP_RESPONSE", response);
  }

  public static HttpServletResponse getResponse()
  {
    return (HttpServletResponse)((ContextInfoMap)actionContext.get()).get("HTTP_RESPONSE");
  }

  public static void setSession(HttpSession session)
  {
    ((ContextInfoMap)actionContext.get()).put("HTTP_SESSION", session);
  }

  public static HttpSession getSession()
  {
    HttpServletRequest request = getRequest();
    if (request != null)
    {
      return request.getSession();
    }
    return null;
  }
}