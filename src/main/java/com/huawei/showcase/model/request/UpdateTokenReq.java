package com.huawei.showcase.model.request;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="LoginReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class UpdateTokenReq extends UnsCommonReq
{
  private static final long serialVersionUID = -8501347916923280698L;

  @XmlElement(name="oldTokenId")
  private String oldTokenId;

  public String getOldTokenId()
  {
    return this.oldTokenId;
  }

  public void setOldTokenId(String oldTokenId)
  {
    this.oldTokenId = oldTokenId;
  }
}