package com.huawei.showcase.model.request;

import com.huawei.showcase.model.UserGroupInfo;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="vncLoginReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class VncLoginReq extends UnsCommonReq
{
  private static final long serialVersionUID = -85013576280667L;

  @XmlElement(name="farmId")
  private String farmId;

  @XmlElement(name="vmName")
  private String vmName;

  @XmlElement(name="id")
  private String sid;

  @XmlElement(name="dgName")
  private String dgName;

  @XmlElement(name="clientIp")
  private String clientIp;

  @XmlElement(name="userInfo")
  private UserGroupInfo userInfo;
  private String userName;
  private String domain;
  private String accessType;

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

  public String getAccessType()
  {
    return this.accessType;
  }

  public void setAccessType(String accessType)
  {
    this.accessType = accessType;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }

  public String getClientIp()
  {
    return this.clientIp;
  }

  public void setClientIp(String clientIp)
  {
    this.clientIp = clientIp;
  }

  public UserGroupInfo getUserInfo()
  {
    return this.userInfo;
  }

  public void setUserInfo(UserGroupInfo userInfo)
  {
    this.userInfo = userInfo;
  }
}