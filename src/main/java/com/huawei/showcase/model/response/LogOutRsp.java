package com.huawei.showcase.model.response;


import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="LogOutRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class LogOutRsp extends CommonRsp
{
  private static final long serialVersionUID = 1256766316525L;

  @XmlElement(name="authType")
  private String authType;

  public String getAuthType()
  {
    return this.authType;
  }

  public void setAuthType(String authType)
  {
    this.authType = authType;
  }
}