package com.huawei.showcase.common.util.log;

import org.apache.log4j.Category;
import org.apache.log4j.Priority;
import org.apache.log4j.spi.LoggingEvent;

public class HLoggingEvent extends LoggingEvent
{
  private static final long serialVersionUID = -1579779839656358336L;
  private String moduleName;

  public HLoggingEvent(String fqnOfCategoryClass, Category logger, Priority level, Object message, Throwable throwable, String moduleName)
  {
    super(fqnOfCategoryClass, logger, level, message, throwable);
    this.moduleName = moduleName;
  }

  public String getModuleName()
  {
    return this.moduleName;
  }

  public void setModuleName(String moduleName)
  {
    this.moduleName = moduleName;
  }
}