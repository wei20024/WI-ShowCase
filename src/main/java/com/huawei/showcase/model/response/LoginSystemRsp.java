package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name="LoginRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoginSystemRsp extends CustomRsp
{
  private static final long serialVersionUID = 777476630517176525L;

  @XmlElement(name="tokenId")
  private String tokenId;

  public String getTokenId()
  {
    return this.tokenId;
  }

  public void setTokenId(String tokenId)
  {
    this.tokenId = tokenId;
  }
}