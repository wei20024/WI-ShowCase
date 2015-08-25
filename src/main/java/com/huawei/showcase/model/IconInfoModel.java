package com.huawei.showcase.model;

public class IconInfoModel
{
  private String appId;
  private byte[] icon;
  private String iconId;

  public String toString()
  {
    StringBuilder sb = new StringBuilder();

    sb.append("appId = " + this.appId + ", ");
    sb.append("iconid = " + this.iconId + ".");

    return sb.toString();
  }

  public String getAppId()
  {
    return this.appId;
  }

  public void setAppId(String appId)
  {
    this.appId = appId;
  }

  public String getIconId()
  {
    return this.iconId;
  }

  public void setIconId(String iconId)
  {
    this.iconId = iconId;
  }

  public byte[] getIcon()
  {
    return this.icon;
  }

  public void setIcon(byte[] icon)
  {
    this.icon = icon;
  }
}