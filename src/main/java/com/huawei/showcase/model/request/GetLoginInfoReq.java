package com.huawei.showcase.model.request;

import com.huawei.showcase.model.UserGroupInfo;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="data")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetLoginInfoReq extends UnsCommonReq
{
  private static final long serialVersionUID = 8504793280667L;

  @XmlElement(name="type")
  private String type;

  @XmlElement(name="id")
  private String id;

  @XmlElement(name="sid")
  private String sid;

  @XmlElement(name="farmId")
  private String farmId;

  @XmlElement(name="dgId")
  private String dgId;

  @XmlElement(name="clientMac")
  private String clientMac;

  @XmlElement(name="clientName")
  private String clientName;

  @XmlElement(name="clientIp")
  private String clientIp;

  @XmlElement(name="clientVersion")
  private String clientVersion;

  @XmlElement(name="clientType")
  private String clientType;

  @XmlElement(name="userInfo")
  private UserGroupInfo userInfo;

  @XmlElement(name="randomId")
  private String randomId;
  private List<String> vmList;
  private String ticket;
  private String isEmergencyLogin;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.DEFAULT_STYLE);
  }

  public String getType()
  {
    return this.type;
  }

  public void setType(String type)
  {
    this.type = type;
  }

  public String getId()
  {
    return this.id;
  }

  public void setId(String id)
  {
    this.id = id;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }

  public String getDgId()
  {
    return this.dgId;
  }

  public void setDgId(String dgId)
  {
    this.dgId = dgId;
  }

  public String getClientMac()
  {
    return this.clientMac;
  }

  public void setClientMac(String clientMac)
  {
    this.clientMac = clientMac;
  }

  public String getClientName()
  {
    return this.clientName;
  }

  public void setClientName(String clientName)
  {
    this.clientName = clientName;
  }

  public String getClientIp()
  {
    return this.clientIp;
  }

  public void setClientIp(String clientIp)
  {
    this.clientIp = clientIp;
  }

  public String getClientVersion()
  {
    return this.clientVersion;
  }

  public void setClientVersion(String clientVersion)
  {
    this.clientVersion = clientVersion;
  }

  public String getClientType()
  {
    return this.clientType;
  }

  public void setClientType(String clientType)
  {
    this.clientType = clientType;
  }

  public UserGroupInfo getUserInfo()
  {
    return this.userInfo;
  }

  public void setUserInfo(UserGroupInfo userInfo)
  {
    this.userInfo = userInfo;
  }

  public String getTicket()
  {
    return this.ticket;
  }

  public void setTicket(String ticket)
  {
    this.ticket = ticket;
  }

  public String getIsEmergencyLogin()
  {
    return this.isEmergencyLogin;
  }

  public void setIsEmergencyLogin(String isEmergencyLogin)
  {
    this.isEmergencyLogin = isEmergencyLogin;
  }

  public List<String> getVmList()
  {
    return this.vmList;
  }

  public void setVmList(List<String> vmList)
  {
    this.vmList = vmList;
  }

  public String getSid()
  {
    return this.sid;
  }

  public void setSid(String sid)
  {
    this.sid = sid;
  }

  public String getRandomId()
  {
    return this.randomId;
  }

  public void setRandomId(String randomId)
  {
    this.randomId = randomId;
  }
}