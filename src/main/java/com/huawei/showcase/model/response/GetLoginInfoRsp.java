package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetLoginInfoRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetLoginInfoRsp extends CommonRsp
{
  private static final long serialVersionUID = 1256767176525L;

  @XmlElement(name="addressTicket")
  private String adressTicket;

  @XmlElement(name="loginTicket")
  private String loginTicket;

  @XmlElement(name="address")
  private String addressInfo;

  @XmlElement(name="linkType")
  private String linkType;

  @XmlElement(name="gwIp")
  private String gwIp;

  @XmlElement(name="transactionId")
  private String transactionId;

  @XmlElement(name="gwIps")
  private String gwIps;

  @XmlElement(name="icaFileContent")
  private String icaFileContent;

  @XmlElement(name="icaFileId")
  private String icaFileId;

  @XmlElement(name="randomId")
  private String randomId;

  @XmlElement(name="sessionType")
  private String sessionType;

  @XmlElement(name="clientAuth")
  private Integer clientAuth;

  public String getAdressTicket()
  {
    return this.adressTicket;
  }

  public void setAdressTicket(String adressTicket)
  {
    this.adressTicket = adressTicket;
  }

  public String getLoginTicket()
  {
    return this.loginTicket;
  }

  public void setLoginTicket(String loginTicket)
  {
    this.loginTicket = loginTicket;
  }

  public String getAddressInfo()
  {
    return this.addressInfo;
  }

  public void setAddressInfo(String addressInfo)
  {
    this.addressInfo = addressInfo;
  }

  public String getLinkType()
  {
    return this.linkType;
  }

  public void setLinkType(String linkType)
  {
    this.linkType = linkType;
  }

  public String getGwIp()
  {
    return this.gwIp;
  }

  public void setGwIp(String gwIp)
  {
    this.gwIp = gwIp;
  }

  public String getGwIps()
  {
    return this.gwIps;
  }

  public void setGwIps(String gwIps)
  {
    this.gwIps = gwIps;
  }

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("GetLoginInfoRsp:addressTicket=" + this.adressTicket);
    builder.append(",addressInfo=" + this.addressInfo);
    builder.append(",linkType=" + this.linkType);
    builder.append(",transactionId=" + this.transactionId);
    builder.append(",randomId=" + this.randomId);
    builder.append(",sessionType=" + this.sessionType);
    return builder.toString();
  }

  public String getTransactionId()
  {
    return this.transactionId;
  }

  public void setTransactionId(String transactionId)
  {
    this.transactionId = transactionId;
  }

  public String getIcaFileContent()
  {
    return this.icaFileContent;
  }

  public void setIcaFileContent(String icaFileContent)
  {
    this.icaFileContent = icaFileContent;
  }

  public String getIcaFileId()
  {
    return this.icaFileId;
  }

  public void setIcaFileId(String icaFileId)
  {
    this.icaFileId = icaFileId;
  }

  public String getRandomId()
  {
    return this.randomId;
  }

  public void setRandomId(String randomId)
  {
    this.randomId = randomId;
  }

  public String getSessionType()
  {
    return this.sessionType;
  }

  public void setSessionType(String sessionType)
  {
    this.sessionType = sessionType;
  }

  public Integer getClientAuth()
  {
    return this.clientAuth;
  }

  public void setClientAuth(Integer clientAuth)
  {
    this.clientAuth = clientAuth;
  }
}