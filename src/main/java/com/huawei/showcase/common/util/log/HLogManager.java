package com.huawei.showcase.common.util.log;


import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.Priority;
import org.apache.log4j.spi.LocationInfo;

public class HLogManager
{
	
  protected static final String FQCN;
  private static final String METHOD_ENTER_MESSAGE = "[Enter]";
  private static final String METHOD_EXIT_MESSAGE = "[Exit]";
  private static Map<String, Logger> loggerMap = null;
  private static Map<String, HLogManager> hLoggerManagerMap = null;
  private String moduleName;
  static
  {
    FQCN = HLogManager.class.getName();
    hLoggerManagerMap = new Hashtable<String, HLogManager>();
    loggerMap = new HashMap<String, Logger>();
  }
  protected HLogManager(String mName)
  {
    this.moduleName = mName;
  }

  public static synchronized HLogManager getInstance(String moduleName)
  {
    HLogManager manager = (HLogManager)hLoggerManagerMap.get(moduleName);
    if (manager == null)
    {
      manager = new HLogManager(moduleName);
      hLoggerManagerMap.put(moduleName, manager);
    }

    return manager;
  }

  public static Logger getLogger(Class<?> clazz)
  {
    Logger logger = (Logger)loggerMap.get(clazz.getName());
    if (logger != null)
    {
      return logger;
    }
    return Logger.getLogger(clazz);
  }

  public static Logger getLogger(String className)
  {
    Logger logger = (Logger)loggerMap.get(className);
    if (logger == null)
    {
      logger = Logger.getLogger(className);
      loggerMap.put(className, logger);
    }
    return logger;
  }

  public void enterMethod()
  {
	Logger logger = getPrivateLogger();
	  
    if (!(isLevelAvailable(logger, Level.DEBUG)))
    {
      return;
    }
    
    logger.debug(new HLoggingEvent(FQCN, logger, Level.DEBUG, getLogMsg(METHOD_ENTER_MESSAGE), null, this.moduleName));
  }

  public void exitMethod()
  {

    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.DEBUG)))
    {
      return;
    }

    logger.debug(new HLoggingEvent(FQCN, logger, Level.DEBUG, getLogMsg(METHOD_EXIT_MESSAGE), null, this.moduleName));
  }

  public void debug(Object message)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.DEBUG)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.DEBUG, getLogMsg(message), null, this.moduleName));
  }

  public void debug(Object message, Throwable t)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.DEBUG)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.DEBUG, getLogMsg(message), t, this.moduleName));
  }

  public void info(Object message)
  {
	 Logger logger = getPrivateLogger();
	  
    if (!(isLevelAvailable(logger, Level.INFO)))
    {
      return;
    }
    
    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.INFO, getLogMsg(message), null, this.moduleName));
  }

  public void info(Object message, Throwable t)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.INFO)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.INFO, getLogMsg(message), t, this.moduleName));
  }

  public void warn(Object message)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.WARN)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.WARN, getLogMsg(message), null, this.moduleName));
  }

  public void warn(Object message, Throwable t)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.WARN)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.WARN, getLogMsg(message), t, this.moduleName));
  }

  public void error(Throwable t)
  {
	Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.ERROR)))
    {
      return;
    }
    
    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.ERROR, getLogMsg(""), t, this.moduleName));
  }

  public void error(Object message)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.ERROR)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.ERROR, getLogMsg(message), null, this.moduleName));
  }

  public void error(Object message, Throwable t)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.ERROR)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.ERROR, getLogMsg(message), t, this.moduleName));
  }

  public void fatal(Throwable t)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.FATAL)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.FATAL, getLogMsg(""), t, this.moduleName));
  }

  public void fatal(Object message)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.FATAL)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.FATAL, getLogMsg(message), null, this.moduleName));
  }

  public void fatal(Object message, Throwable t)
  {
    Logger logger = getPrivateLogger();

    if (!(isLevelAvailable(logger, Level.FATAL)))
    {
      return;
    }

    logger.callAppenders(new HLoggingEvent(FQCN, logger, Level.FATAL, message, t, this.moduleName));
  }

  private boolean isLevelAvailable(Logger logger, Priority priority)
  {
    return logger.isEnabledFor(priority);
  }

  private Logger getPrivateLogger()
  {
    LocationInfo locationInfo = new LocationInfo(new HThrowable(), FQCN);
    return getLogger(locationInfo.getClassName());
  }

  private Object getLogMsg(Object msg)
  {
    StringBuffer sb = new StringBuffer();
    sb.append("[");
    sb.append(this.moduleName);
    sb.append("]");

    String transactionId = TransactionIdUtil.getCurrentTransactionId();
    if (transactionId != null)
    {
      sb.append("[WI-");
      sb.append(transactionId);
      sb.append("]");
    }

    sb.append(msg);
    return sb.toString();
  }

  
}