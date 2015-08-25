package com.huawei.showcase.common.util.configration;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.locks.ReentrantLock;

import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.log.LogUtils;


/**
 * 
 * @author wzf
 *
 */
public class Configuration
{
  //private static final String CONTROLLER_PROPERTY_FILENAME = "controller.properties";
  private static final String LOGIN_PROPERTY_FILENAME = System.getProperty("product.home") + "/conf/controller.properties";
  private String PropFileName="";
  private  Properties prop;
  //private  Properties configurerProps = new Properties();

  private  static Configuration ControllerconfignIns = null;
  //private  static Configuration LoginPropconfigIns = null;
  private  static Configuration CustomPropconfigIns = null;
  private ReentrantLock lock = new ReentrantLock();
  //private  Properties customConfigProperties;

  public static Configuration getControllerPropInstance()
  {
	  if(ControllerconfignIns==null){
		  ControllerconfignIns = new Configuration();
		 
		  ControllerconfignIns.prop = getConfigByPath(LOGIN_PROPERTY_FILENAME);
		  ControllerconfignIns.PropFileName = LOGIN_PROPERTY_FILENAME;
	  }
    return ControllerconfignIns;
	 
  }

  public static Configuration getCustomPropInstance(){
	  if(CustomPropconfigIns ==null){
		  CustomPropconfigIns = new Configuration();
		  CustomPropconfigIns.prop = getConfigByPath(getCustomPropertiesPath());
		  CustomPropconfigIns.PropFileName = getCustomPropertiesPath();
	  }
	  return CustomPropconfigIns;
  }
  public String getString(String key, String defaultValue)
  {
    return getTrimmed(prop.getProperty(key, defaultValue));
  }

  public int getInt(String key, int defaultValue)
  {
    String property = getTrimmed(prop.getProperty(key));
    int value;
    try
    {
      value = Integer.parseInt(property);
    }
    catch (NumberFormatException nfe)
    {
      value = defaultValue;
    }
    return value;
  }

  public String getString(String key)
  {
	 if(prop!=null){
		 return getTrimmed(prop.getProperty(key));
	 }
    return null;
  }


  public boolean containsProperty(String key)
  {
    return prop.containsKey(key);
  }

  public boolean getBoolean(String key, boolean defaultValue)
  {
    String valueString = getTrimmed(key);
    if ((valueString == null) || ("".equals(valueString)))
    {
      return defaultValue;
    }

    valueString = valueString.toLowerCase(Locale.ENGLISH);

    if ("true".equals(valueString))
    {
      return true;
    }
    if ("false".equals(valueString))
    {
      return false;
    }

    return defaultValue;
  }

  public String getTrimmed(String value)
  {
    if (value == null)
    {
      return null;
    }

    return value.trim();
  }

  public String getString(String key, Map<String, String> properties)
  {
    if (CommonUtils.checkAllStringNull(new String[] { key }))
    {
      LogUtils.CONFIG_LOG.error(String.format("The parameter key is invalid, methodName is %s.", key ));
      return null;
    }

    if (!CommonUtils.checkAllObjectNull(new Object[] { properties }))
    {
      if (properties.containsKey(key))
      {
        return (String)properties.get(key);
      }
    }

    return this.prop.getProperty(key);
  }

  public String getString(String key, String defaultValue, Map<String, String> properties)
  {
    if (CommonUtils.checkAllStringNull(new String[] { key }))
    {
      LogUtils.CONFIG_LOG.error(String.format("The parameter key is invalid, methodName is %s.", key ));
      return null;
    }

    if (!CommonUtils.checkAllObjectNull(new Object[] { properties }))
    {
      if (properties.containsKey(key))
      {
        return (String)properties.get(key);
      }
    }

    return this.prop.getProperty(key, defaultValue);
  }
 
  public Set<Object> getPropKey()
  {
    return this.prop.keySet();
  }
  
  public Boolean writeData(String key, String keyvalue)
  {
    OutputStream fos = null;
    String value = "";

    if (CommonUtils.checkAllStringNull(new String[] { key }))
    {
      LogUtils.CONFIG_LOG.error(String.format("writeData() The parameter key and value is invalid, key is %s.", key ));
      return Boolean.valueOf(false);
    }
    this.lock.lock();
    try
    {
      if (keyvalue == null)
      {
        value = "";
      }
      else
      {
        value = keyvalue;
      }
      fos = new FileOutputStream(LOGIN_PROPERTY_FILENAME);
      this.prop.setProperty(key, value);
      this.prop.store(fos, "Update or add '" + key + "' value");
    }
    catch (IOException e)
    {
      LogUtils.CONFIG_LOG.error("Visit " + LOGIN_PROPERTY_FILENAME + " for updating " + 
        value + " value error", e);
      Boolean localBoolean = Boolean.valueOf(false); return localBoolean;
    }
    finally
    {
      try
      {
        if (fos != null)
        {
          fos.close();
        }
      }
      catch (IOException e)
      {
        LogUtils.CONFIG_LOG.error("close " + LOGIN_PROPERTY_FILENAME + " file for updating " + 
          value + " value error", e);
      }
      finally
      {
        this.lock.unlock();
      }
    }
    return Boolean.valueOf(true);
  }
  
  public static Properties getConfigByPath(String path)
  {
    if (CommonUtils.checkAllStringNull(new String[] { path }))
    {
      LogUtils.CONFIG_LOG.error("path is null");
      return null;
    }
    InputStream inputstream = null;
    try
    {
      LogUtils.CONFIG_LOG.debug("Loading file : " + path);
      inputstream = new FileInputStream(new File(path));
      Properties properties = new Properties();
      properties.load(inputstream);
      return properties;
    }
    catch (IOException e)
    {
      LogUtils.CONFIG_LOG.error("throw exception :Loading of property file failed.", e);
    }
    finally
    {
      if (inputstream != null)
      {
        try
        {
          inputstream.close();
        }
        catch (IOException e)
        {
          LogUtils.CONFIG_LOG.error("close InputStream. meet some error.", e);
        }
      }
    }
    return null;
  }

  private static String getCustomPropertiesPath()
  {
    String productHome = System.getProperty("product.home");
    if (CommonUtils.checkAllStringNull(new String[] { productHome }))
    {
      productHome = "/opt/WI/tomcat/WI/ROOT/WEB-INF";
    }
    return productHome.replace("WEB-INF", "custom/resources/conf/custom.properties");
  }

}