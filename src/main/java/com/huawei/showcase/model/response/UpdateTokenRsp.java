package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="UpdateTokenRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class UpdateTokenRsp extends CommonRsp
{
  private static final long serialVersionUID = 777476630517176525L;

  @XmlElement(name="newTokenId")
  private String newTokenId;

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public String getNewTokenId()
  {
    return this.newTokenId;
  }

  public void setNewTokenId(String newTokenId)
  {
    this.newTokenId = newTokenId;
  }
}