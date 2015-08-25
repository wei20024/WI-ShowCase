package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;

@XmlRootElement(name="GetUserInfoReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetUserInfoReq extends UnsCommonReq
{
  private static final long serialVersionUID = -8501347934923280698L;

  @XmlElement(name="username")
  private String username;

  @XmlElement(name="domain")
  private String domain;
  private String emergencyLogonFlag;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this);
  }

  public String getUsername()
  {
    return this.username;
  }

  public void setUsername(String username)
  {
    this.username = username;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public String getEmergencyLogonFlag()
  {
    return this.emergencyLogonFlag;
  }

  public void setEmergencyLogonFlag(String emergencyLogonFlag)
  {
    this.emergencyLogonFlag = emergencyLogonFlag;
  }
}