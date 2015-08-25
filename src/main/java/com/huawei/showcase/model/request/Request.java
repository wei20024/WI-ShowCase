package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="Request")
@XmlAccessorType(XmlAccessType.FIELD)
public class Request
{

  @XmlElement(name="operatorId")
  private String operatorId;

  @XmlElement(name="transactionId")
  private String transactionId;

  @XmlElement(name="tokenId")
  private String tokenId;

  public String getOperatorId()
  {
    return this.operatorId;
  }

  public String toString()
  {
    return this.transactionId;
  }

  public void setOperatorId(String operatorId)
  {
    this.operatorId = operatorId;
  }

  public String getTransactionId()
  {
    return this.transactionId;
  }

  public void setTransactionId(String transactionId)
  {
    this.transactionId = transactionId;
  }

  public String getTokenId()
  {
    return this.tokenId;
  }

  public void setTokenId(String tokenId)
  {
    this.tokenId = tokenId;
  }
}