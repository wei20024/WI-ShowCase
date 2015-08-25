package com.huawei.showcase.model.request;

public class BusinessAlarmInfoReq extends BusinessRequest
{
  private String alarmID;
  private int alarmCategory;
  private String dynamicInfo;
  private String resourceID;
  private String resourceIP;

  public String getAlarmID()
  {
    return this.alarmID;
  }

  public int getAlarmCategory()
  {
    return this.alarmCategory;
  }

  public String getDynamicInfo()
  {
    return this.dynamicInfo;
  }

  public String getResourceID()
  {
    return this.resourceID;
  }

  public String getResourceIP()
  {
    return this.resourceIP;
  }

  public void setAlarmID(String alarmID)
  {
    this.alarmID = alarmID;
  }

  public void setAlarmCategory(int alarmCategory)
  {
    this.alarmCategory = alarmCategory;
  }

  public void setDynamicInfo(String dynamicInfo)
  {
    this.dynamicInfo = dynamicInfo;
  }

  public void setResourceID(String resourceID)
  {
    this.resourceID = resourceID;
  }

  public void setResourceIP(String resourceIP)
  {
    this.resourceIP = resourceIP;
  }
}