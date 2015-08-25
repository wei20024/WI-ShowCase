package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="LoginVmActionRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoginVmActionRsp extends CommonRsp
{
  private static final long serialVersionUID = -6245395297626574880L;

  @XmlElement(name="addressTicket")
  private String addressTicket;

  @XmlElement(name="addressInfo")
  private String addressInfo;

  @XmlElement(name="loginTicket")
  private String loginTicket;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("[WI>>HDC]req:resultCode=" + getResultCode());
    builder.append(",resultDesc=" + getResultDesc());
    builder.append(",addressInfo=" + this.addressInfo);

    return builder.toString();
  }

  public String getAddressTicket()
  {
    return this.addressTicket;
  }

  public void setAddressTicket(String addressTicket)
  {
    this.addressTicket = addressTicket;
  }

  public String getAddressInfo()
  {
    return this.addressInfo;
  }

  public void setAddressInfo(String addressInfo)
  {
    this.addressInfo = addressInfo;
  }

  public String getLoginTicket()
  {
    return this.loginTicket;
  }

  public void setLoginTicket(String loginTicket)
  {
    this.loginTicket = loginTicket;
  }
}