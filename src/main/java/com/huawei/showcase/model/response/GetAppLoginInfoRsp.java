package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetAppLoginInfoRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetAppLoginInfoRsp extends GetLoginInfoRsp
{
  private static final long serialVersionUID = 1256763696525L;

  @XmlElement(name="loginInfoTicket")
  private String loginInfoTicket;

  @XmlElement(name="vmName")
  private String vmName;

  @XmlElement(name="domain")
  private String domain;

  @XmlElement(name="machineSid")
  private String machineSid;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("[HDC>>WI]GetAppLoginInfoRsp:loginInfoTicket=" + this.loginInfoTicket);
    builder.append(",vmName=" + this.vmName);
    builder.append(",domain=" + this.domain);
    builder.append(",machineSid=" + this.machineSid);
    return builder.toString();
  }

  public String getLoginInfoTicket()
  {
    return this.loginInfoTicket;
  }

  public void setLoginInfoTicket(String loginInfoTicket)
  {
    this.loginInfoTicket = loginInfoTicket;
  }

  public String getVmName()
  {
    return this.vmName;
  }

  public void setVmName(String vmName)
  {
    this.vmName = vmName;
  }

  public String getDomain()
  {
    return this.domain;
  }

  public void setDomain(String domain)
  {
    this.domain = domain;
  }

  public String getMachineSid()
  {
    return this.machineSid;
  }

  public void setMachineSid(String machineSid)
  {
    this.machineSid = machineSid;
  }
}