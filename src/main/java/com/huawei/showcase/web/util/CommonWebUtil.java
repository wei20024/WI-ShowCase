package com.huawei.showcase.web.util;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.time.DateUtils;

import com.huawei.showcase.common.enumcode.StaticNumber;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;

public class CommonWebUtil
{
  private static final String TIMER_REQUEST_URL = "getvmlist";
  private static final int SESSION_TIMEOUT = Configuration.getControllerPropInstance().getInt("Web.Session.TimeOut", 
    StaticNumber.FIFTY.getCode());


  public static void dealSessionTimeOut(HttpServletRequest req)
  {
    Date lastOperateTime = (Date)req.getSession().getAttribute("lastOperateTime");
    if (lastOperateTime == null)
    {
      lastOperateTime = new Date();
      req.getSession().setAttribute("lastOperateTime", lastOperateTime);
    }

    Date timeOutDate = DateUtils.addMinutes(lastOperateTime, SESSION_TIMEOUT);
    Date current = new Date();

    if (current.after(timeOutDate))
    {
      try
      {
        req.getSession().invalidate();
      }
      catch (Exception e)
      {
        LogUtils.LOG.error(e);
      }
    }
    else
    {
      String requestUrl = req.getRequestURI();
      if ((requestUrl != null) && (!requestUrl.contains(TIMER_REQUEST_URL)))
      {
        req.getSession().setAttribute("lastOperateTime", new Date());
      }
    }
  }
}