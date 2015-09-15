package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="VNCLoginActionRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class VNCLoginActionRsp extends CommonRsp
{
  private static final long serialVersionUID = 7774517176525L;

  @XmlElement(name="addressTicket")
  private String addressTicket;

 @XmlElement(name="addressInfo")
  private String addressInfo;

  @XmlElement(name="vncPassword")
  private String password;

 public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("req:resultCode=" + getResultCode());
    builder.append(",resultDesc=" + getResultDesc());

    return builder.toString();
  }

  @XmlElement(name="linkType")
  private String linkType;

  @XmlElement(name="vncGateIp")
  private String vncGateIp;

  @XmlElement(name="transactionId")
  private String transactionId;

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

  public String getPassword()
  {
    return this.password;
  }

  public void setPassword(String password)
  {
    this.password = password;
  }

  public String getLinkType()
  {
    return this.linkType;
  }

  public void setLinkType(String linkType)
  {
    this.linkType = linkType;
  }

  public String getVncGateIp()
  {
    return this.vncGateIp;
  }

  public void setVncGateIp(String vncGateIp)
  {
    this.vncGateIp = vncGateIp;
  }

  public String getTransactionId()
  {
    return this.transactionId;
  }

  public void setTransactionId(String transactionId)
  {
    this.transactionId = transactionId;
  }
}