package com.huawei.showcase.common.init;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.huawei.showcase.common.util.log.LogUtils;

public class UnsInitData
  implements ServletContextListener
{
  private static final String DEBUG_LOG_LEVEL = "DEBUG";

  public void contextInitialized(ServletContextEvent servletcontextevent)
  {
  
    LogUtils.VDESKTOP_LOG.enterMethod();
    LogUtils.VDESKTOP_LOG.info("/*********************************************************/");
    LogUtils.VDESKTOP_LOG.info("/*----------------WIDemo init start---------------------------*/");
    LogUtils.VDESKTOP_LOG.info("/*********************************************************/");
//    try
//    {
//      ComponentMonitorUtil.loadComponentInfoFromDB();
//
//    }
//    catch (Exception e)
//    {
//      LogUtils.VDESKTOP_LOG.error(e);
//    }
    LogUtils.VDESKTOP_LOG.info("/*********************************************************/");
    LogUtils.VDESKTOP_LOG.info("/*----------------WIDemo init end--------------------*/");
    LogUtils.VDESKTOP_LOG.info("/*********************************************************/");
    LogUtils.VDESKTOP_LOG.exitMethod();
  }


  public void contextDestroyed(ServletContextEvent arg0)
  {
    LogUtils.VDESKTOP_LOG.enterMethod();
    LogUtils.VDESKTOP_LOG.info("contextDestroyed:tomcat stopped, please see the tomcat log.");
    LogUtils.VDESKTOP_LOG.exitMethod();
  }
}