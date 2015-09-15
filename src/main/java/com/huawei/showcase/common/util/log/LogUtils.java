package com.huawei.showcase.common.util.log;


public abstract interface LogUtils
{
  public static final HLogManager LOG = HLogManager.getInstance("VDESKTOP");
  public abstract void logUtil();
}