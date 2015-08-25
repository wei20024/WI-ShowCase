package com.huawei.showcase.common.util.log;

import java.util.HashSet;
import java.util.Set;
import org.apache.log4j.spi.LoggingEvent;
import org.apache.log4j.varia.LevelRangeFilter;

public class WIAppenderFilter extends LevelRangeFilter
{
  private Set<String> moduleNameSet = new HashSet<String>();

  public int decide(LoggingEvent event)
  {
    if ((event instanceof HLoggingEvent))
    {
      HLoggingEvent loggingEvent = (HLoggingEvent)event;

      String mName = loggingEvent.getModuleName();

      if (!this.moduleNameSet.contains(mName))
      {
        return -1;
      }
    }

    return super.decide(event);
  }

  public void setModuleName(String moduleName)
  {
    if (checkAllStringNull(new String[] { moduleName }))
    {
      return;
    }

    String[] moduleNameArray = moduleName.split(",");
    for (String mName : moduleNameArray)
    {
      this.moduleNameSet.add(mName);
    }
  }

  private static boolean checkAllStringNull(String[] params)
  {
    if (params == null)
    {
      return true;
    }

    String[] arrayOfString = params; int j = params.length; for (int i = 0; i < j; i++) { String param = arrayOfString[i];

      if ((param == null) || (param.trim().isEmpty()))
      {
        return true;
      }
    }

    return false;
  }
}