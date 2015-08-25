package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name="VncLoginActionReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class VncLoginActionReq extends CommonReq
{
  private static final long serialVersionUID = 1785623014520L;

  @XmlElement(name="userName")
  private String userName;

  @XmlElement(name="domain")
  private String domain;

  @XmlElement(name="sid")
  private String sid;

  @XmlElement(name="dgName")
  private String dgName;

  @XmlElement(name="vmName")
  private String vmName;

  @XmlElement(name="accessType")
  private String accessType;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("userName=" + this.userName);
    builder.append(",domain=" + this.domain);
    builder.append(",sid=" + this.sid);
    builder.append(",accessType=" + this.accessType);
    return builder.toString();
  }

  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public String getSid()
  {
    return this.sid;
  }

  public void setSid(String sid)
  {
    this.sid = sid;
  }

  public String getAccessType()
  {
    return this.accessType;
  }

  public void setAccessType(String accessType)
  {
    this.accessType = accessType;
  }

  public String getDgName()
  {
    return this.dgName;
  }

  public void setDgName(String dgName)
  {
    this.dgName = dgName;
  }

  public String getVmName()
  {
    return this.vmName;
  }

  public void setVmName(String vmName)
  {
    this.vmName = vmName;
  }
}