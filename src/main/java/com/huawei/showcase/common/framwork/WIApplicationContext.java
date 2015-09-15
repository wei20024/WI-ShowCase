package com.huawei.showcase.common.framwork;

import java.lang.reflect.Method;
import java.util.Map;

import org.springframework.beans.factory.support.AbstractBeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationEvent;
import org.springframework.web.context.support.XmlWebApplicationContext;

import com.huawei.showcase.common.util.log.LogUtils;

public class WIApplicationContext
  implements ApplicationContextAware
{
  private static ApplicationContext applicationContext;

  public static Object getBean(String beanId)
  {
    return applicationContext.getBean(beanId);
  }

  public static <T> T getBean(Class<T> requiredClass)
  {
    return applicationContext.getBean(requiredClass);
  }

  public static <T> Map<String, T> getBeansOfTypes(Class<T> requiredClass)
  {
    return applicationContext.getBeansOfType(requiredClass);
  }

  public void setApplicationContext(ApplicationContext appCon)
  {
    set(appCon);
  }

  private static void set(ApplicationContext appCon)
  {
    applicationContext = appCon;
  }

  public static void publishEvent(ApplicationEvent event)
  {
    applicationContext.publishEvent(event);
  }

  public static void removeBean(String beanName)
  {
    BeanDefinitionRegistry factory = (BeanDefinitionRegistry)applicationContext.getAutowireCapableBeanFactory();
    factory.removeBeanDefinition(beanName);
  }

  public static void registerBean(String beanName, AbstractBeanDefinition beanDefinition)
  {
    XmlWebApplicationContext ctx = (XmlWebApplicationContext)applicationContext;
    DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory)ctx.getBeanFactory();
    beanFactory.registerBeanDefinition(beanName, beanDefinition);
  }

  public static void registerBeanForBean(Object targetBean, Object bean)
  {
    try
    {
      String beanClassName = bean.getClass().getSimpleName();
      Method method = targetBean.getClass().getMethod("set" + beanClassName, new Class[] { bean.getClass() });
      method.invoke(targetBean, new Object[] { bean });
    }
    catch (Exception e)
    {
      LogUtils.LOG.error("Failed to register bean.", e);
    }
  }
}