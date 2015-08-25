package com.huawei.showcase.common.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;

import com.huawei.showcase.common.util.log.LogUtils;
import com.huawei.showcase.model.SessionInfo;

public class SessionInfoUtil
{
  private static ConcurrentMap<String, SessionInfo> sessionInfoMap = new ConcurrentHashMap<String, SessionInfo>();

  public static boolean addSessionInfo(SessionInfo sessionInfo)
  {
    try
    {
      if (sessionInfo == null)
      {
        LogUtils.VDESKTOP_LOG.error("input param invalid.");
        return false;
      }
      sessionInfo.setCreateTime(new Date());
      //SessionInfo old = (SessionInfo)sessionInfoMap.get(sessionInfo.getId());
      SessionInfo old = (SessionInfo)sessionInfoMap.get(sessionInfo.getUserId());
      if (old != null)
      {
        Map<String, String> map = old.getIpTokenMap();
        map.putAll(sessionInfo.getIpTokenMap());
        sessionInfo.setIpTokenMap(map);
      }
      sessionInfoMap.put(sessionInfo.getUserId(), sessionInfo);
    }
    catch (Exception e)
    {
      LogUtils.VDESKTOP_LOG.error(e);
    }
    return true;
  }

  public static boolean deleteSessionInfo(String userId)
  {
    if (StringUtils.isEmpty(userId))
    {
      LogUtils.VDESKTOP_LOG.error("input param invalid.");
      return false;
    }

    List<String> keys = new ArrayList<String>();
    for (Map.Entry<String,SessionInfo> map : sessionInfoMap.entrySet())
    {
      if (userId.equals(((SessionInfo)map.getValue()).getUserId()))
      {
        keys.add((String)map.getKey());
      }
    }
    for (String key : keys)
    {
      sessionInfoMap.remove(key);
    }
    return true;
  }
  
  /***
   * 检查登陆方式
   * @param session
   * @return true为紧急，false为普通方式
   */
  public static boolean isEmergencyLogin(HttpSession session)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();

    if (session == null)
    {
      LogUtils.VDESKTOP_LOG.debug("The session is null.");
      return false;
    }

    if (session.getAttribute("EMERGENCYLOGON") == null)
    {
      LogUtils.VDESKTOP_LOG.debug("The session.getAttribute is null.");
      return false;
    }

    String emerg = (String)session.getAttribute("EMERGENCYLOGON");
    if ("ok".equalsIgnoreCase(emerg))
    {
      return true;
    }

    LogUtils.VDESKTOP_LOG.exitMethod();
    return false;
  }
  

  public static SessionInfo getSessionInfo(String id)
  {
    return (SessionInfo)sessionInfoMap.get(id);
  }

  public static ConcurrentMap<String, SessionInfo> getSessionInfoMap()
  {
    return sessionInfoMap;
  }

  public static void setSessionInfoMap(ConcurrentMap<String, SessionInfo> sessionInfoMap)
  {
    SessionInfoUtil.sessionInfoMap = sessionInfoMap;
  }
}