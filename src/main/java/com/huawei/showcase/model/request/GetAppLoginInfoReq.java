package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetAppLoginInfoReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetAppLoginInfoReq extends GetLoginInfoReq
{
  private static final long serialVersionUID = 8502583280667L;

  @XmlElement(name="appId")
  private String appId;

  @XmlElement(name="appGroupId")
  private String appGroupId;

  @XmlElement(name="appType")
  private Integer appType;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("GetAppLoginInfoReq:appId=" + this.appId);
    builder.append(",appGroupId=" + this.appGroupId);
    builder.append(",appType=" + this.appType);

    return builder.toString();
  }

  public String getAppId()
  {
    return this.appId;
  }

  public void setAppId(String appId)
  {
    this.appId = appId;
  }

  public String getAppGroupId()
  {
    return this.appGroupId;
  }

  public void setAppGroupId(String appGroupId)
  {
    this.appGroupId = appGroupId;
  }

  public Integer getAppType()
  {
    return this.appType;
  }

  public void setAppType(Integer appType)
  {
    this.appType = appType;
  }
}