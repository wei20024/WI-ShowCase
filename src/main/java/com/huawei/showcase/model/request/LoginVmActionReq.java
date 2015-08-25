package com.huawei.showcase.model.request;

import com.huawei.showcase.model.ExtendInfo;

import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="LoginVmActionReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoginVmActionReq extends CommonReq
{
  private static final long serialVersionUID = 85047916923280667L;

  @XmlElement(name="vmType")
  private String vmType;

  @XmlElement(name="vmId")
  private String vmId;

  @XmlElement(name="userName")
  private String userName;

  @XmlElement(name="userPassword")
  private String userPassword;

  @XmlElement(name="domain")
  private String domain;

  @XmlElement(name="authType")
  private String authType;

  @XmlElement(name="accessType")
  private String accessType;

  @XmlElement(name="extendInfos")
  private List<ExtendInfo> extendInfos;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("[WI>>HDC]LoginVmActionReq:vmType=" + this.vmType);
    builder.append(",vmId=" + this.vmId);
    builder.append(",userName=" + this.userName);
    builder.append(",domain=" + this.domain);
    builder.append(",authType=" + this.authType);
    builder.append(",accessType=" + this.accessType);
    builder.append(",extendInfos=" + this.extendInfos);
    return builder.toString();
  }

  public String getVmType()
  {
    return this.vmType;
  }

  public void setVmType(String vmType)
  {
    this.vmType = vmType;
  }

  public String getVmId()
  {
    return this.vmId;
  }

  public void setVmId(String vmId)
  {
    this.vmId = vmId;
  }

  public String getUserName()
  {
    return this.userName;
  }

  public void setUserName(String userName)
  {
    this.userName = userName;
  }

  public String getUserPassword()
  {
    return this.userPassword;
  }

  public void setUserPassword(String userPassword)
  {
    this.userPassword = userPassword;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public String getAuthType()
  {
    return this.authType;
  }

  public void setAuthType(String authType)
  {
    this.authType = authType;
  }

  public String getAccessType()
  {
    return this.accessType;
  }

  public void setAccessType(String accessType)
  {
    this.accessType = accessType;
  }

  public List<ExtendInfo> getExtendInfos()
  {
    return this.extendInfos;
  }

  public void setExtendInfos(List<ExtendInfo> extendInfos)
  {
    this.extendInfos = extendInfos;
  }
}