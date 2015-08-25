package com.huawei.showcase.common.util.log;


public abstract interface LogUtils
{
  public static final HLogManager VDESKTOP_LOG = HLogManager.getInstance("VDESKTOP");

  public static final HLogManager CONFIG_LOG = HLogManager.getInstance("CONFIG");
//
  public static final HLogManager USERLOGIN_LOG = HLogManager.getInstance("USERLOGIN");
//
  public static final HLogManager INTERACT_LOG = HLogManager.getInstance("INTERACT");

//  public static final LogManager LICENSE_LOG = HLogManager.getInstance("LICENSE");

//  public static final HLogManager BACKUP_LOG = HLogManager.getInstance("BACKUP");
//
//  public static final HLogManager GATEWAY_LOG = HLogManager.getInstance("GATEWAY");
//
  public static final HLogManager CUSTOM_LOG = HLogManager.getInstance("CUSTOM");

  public abstract void logUtil();
}