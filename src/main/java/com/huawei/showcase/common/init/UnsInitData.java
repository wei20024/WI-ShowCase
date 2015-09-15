package com.huawei.showcase.common.init;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.huawei.showcase.common.util.log.LogUtils;

public class UnsInitData
  implements ServletContextListener
{
  public void contextInitialized(ServletContextEvent servletcontextevent)
  {
    LogUtils.LOG.enterMethod();
    LogUtils.LOG.info("/*********************************************************/");
    LogUtils.LOG.info("/*----------------WIDemo start---------------------------*/");
    LogUtils.LOG.info("/*********************************************************/");
    LogUtils.LOG.exitMethod();
  }


  public void contextDestroyed(ServletContextEvent arg0)
  {
    LogUtils.LOG.enterMethod();
    LogUtils.LOG.info("contextDestroyed:tomcat stopped, please see the tomcat log.");
    LogUtils.LOG.exitMethod();
  }
}